import { localStorageDB } from './localStorage'

const AUTH_KEY = 'our-2026-deck-basic-auth'

function isLocalDevMode(explicit) {
  if (typeof explicit === 'boolean') return explicit
  return import.meta.env.VITE_LOCAL_DEV_MODE === 'true'
}

function setBasicAuth({ email, password }) {
  const token = btoa(`${email}:${password}`)
  localStorage.setItem(AUTH_KEY, `Basic ${token}`)
}

function clearBasicAuth() {
  localStorage.removeItem(AUTH_KEY)
}

function decodeEmailFromBasicAuthHeader(header) {
  const raw = String(header || '').trim()
  const m = /^Basic\s+(.+)$/i.exec(raw)
  if (!m) return null

  try {
    const decoded = atob(m[1])
    const idx = decoded.indexOf(':')
    if (idx <= 0) return null
    return decoded.slice(0, idx).trim() || null
  } catch {
    return null
  }
}

function getBasicAuthHeader() {
  return localStorage.getItem(AUTH_KEY) || ''
}

async function request(path, { method = 'GET', body } = {}) {
  const auth = getBasicAuthHeader()

  const headers = {}
  if (!(body instanceof FormData)) headers['Content-Type'] = 'application/json'
  if (auth) headers.Authorization = auth

  let payload
  if (body instanceof FormData) payload = body
  else if (body == null) payload = undefined
  else payload = JSON.stringify(body)

  const res = await fetch(path, {
    method,
    headers,
    body: payload
  })

  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(text || `Request failed: ${method} ${path} (${res.status})`)
  }

  const ct = res.headers.get('content-type') || ''
  if (ct.includes('application/json')) return res.json()
  return res.text()
}

function parseLocalUsersEnv() {
  const raw = import.meta.env.VITE_LOCAL_USERS
  if (!raw) {
    return {
      'alice@example.com': { password: 'alice123', email: 'alice@example.com', id: '1' },
      'bob@example.com': { password: 'bob123', email: 'bob@example.com', id: '2' }
    }
  }

  // Format: email:password,email2:password2
  const entries = String(raw)
    .split(',')
    .map(s => s.trim())
    .filter(Boolean)

  const users = {}
  let i = 1
  for (const entry of entries) {
    const idx = entry.indexOf(':')
    if (idx <= 0) continue
    const email = entry.slice(0, idx).trim().toLowerCase()
    const password = entry.slice(idx + 1)
    if (!email || !password) continue
    users[email] = { email, password, id: String(i++) }
  }

  return Object.keys(users).length ? users : {
    'alice@example.com': { password: 'alice123', email: 'alice@example.com', id: '1' },
    'bob@example.com': { password: 'bob123', email: 'bob@example.com', id: '2' }
  }
}

export function getLocalDevUsers() {
  return parseLocalUsersEnv()
}

/**
 * Backend abstraction:
 * - Local Dev: localStorage (including mock login)
 * - Prod: HTTP API + BasicAuth stored client-side (server validates against Vercel env)
 */
export const appBackend = {
  // ---- Auth ----
  hasSession(explicitIsLocalDev) {
    const isLocalDev = isLocalDevMode(explicitIsLocalDev)
    if (isLocalDev) return !!localStorage.getItem('localDevUser')
    return !!getBasicAuthHeader()
  },

  async login({ email, password }, explicitIsLocalDev) {
    const isLocalDev = isLocalDevMode(explicitIsLocalDev)

    if (isLocalDev) {
      const LOCAL_USERS = parseLocalUsersEnv()

      const normalizedEmail = String(email || '').trim().toLowerCase()
      const user = LOCAL_USERS[normalizedEmail]
      if (!user || user.password !== password) {
        throw new Error('Invalid credentials')
      }

      localStorage.setItem('localDevUser', JSON.stringify({ email: user.email, id: user.id }))
      return { email: user.email }
    }

    // Prod: store basic auth and validate by hitting a protected endpoint.
    clearBasicAuth()
    setBasicAuth({ email, password })

    // Validate by hitting a protected endpoint.
    await request('/api/activities')
    return { email }
  },

  logout(explicitIsLocalDev) {
    const isLocalDev = isLocalDevMode(explicitIsLocalDev)
    if (isLocalDev) {
      localStorage.removeItem('localDevUser')
      return
    }
    clearBasicAuth()
  },

  getCurrentUserEmail(explicitIsLocalDev) {
    const isLocalDev = isLocalDevMode(explicitIsLocalDev)
    if (isLocalDev) {
      const localUser = JSON.parse(localStorage.getItem('localDevUser'))
      return localUser?.email || 'Guest'
    }

    // Prod: decode email from the stored Basic auth header.
    const email = decodeEmailFromBasicAuthHeader(getBasicAuthHeader())
    return email || 'Guest'
  },

  // ---- Activities ----
  async listActivities(explicitIsLocalDev) {
    const isLocalDev = isLocalDevMode(explicitIsLocalDev)
    if (isLocalDev) return localStorageDB.getActivities()
    const res = await request('/api/activities')
    return res.activities || []
  },

  async insertActivities(activities, explicitIsLocalDev) {
    const isLocalDev = isLocalDevMode(explicitIsLocalDev)
    if (isLocalDev) {
      for (const a of activities) await localStorageDB.insertActivity(a)
      return
    }
    // Use PUT to upsert only the new activities (merges with existing by ID)
    await request('/api/activities', { method: 'PUT', body: { activities } })
  },

  async updateActivity(activity, explicitIsLocalDev) {
    const isLocalDev = isLocalDevMode(explicitIsLocalDev)
    if (isLocalDev) {
      const { error } = await localStorageDB.updateActivity(activity.id, activity)
      if (error) throw new Error(error.message)
      return
    }

    // Send just this one activity via PUT - backend will merge by ID
    await request('/api/activities', { method: 'PUT', body: { activities: [activity] } })
  },

  // ---- Images ----
  async uploadImage(file, explicitIsLocalDev) {
    const isLocalDev = isLocalDevMode(explicitIsLocalDev)
    if (isLocalDev) {
      const { data, error } = await localStorageDB.uploadImage(file)
      if (error) throw new Error(error.message)
      const url = await localStorageDB.getImageUrl(data.path)
      return { image_path: data.path, url }
    }

    const fd = new FormData()
    fd.append('file', file)
    const res = await request('/api/upload', { method: 'POST', body: fd })
    return { image_path: res.url, url: res.url }
  },

  async getImageUrl(imagePath, explicitIsLocalDev) {
    const isLocalDev = isLocalDevMode(explicitIsLocalDev)
    if (!imagePath) return null
    if (isLocalDev) return localStorageDB.getImageUrl(imagePath)
    return imagePath
  }
}
