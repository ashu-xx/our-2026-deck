const AUTH_KEY = 'our-2026-deck-basic-auth'

export function setApiAuth({ email, password }) {
  const token = btoa(`${email}:${password}`)
  localStorage.setItem(AUTH_KEY, `Basic ${token}`)
}

export function clearApiAuth() {
  localStorage.removeItem(AUTH_KEY)
}

export function hasApiAuth() {
  return !!localStorage.getItem(AUTH_KEY)
}

function authHeader() {
  return localStorage.getItem(AUTH_KEY) || ''
}

// Client for Vercel-hosted API routes (works on Vercel and locally).
// Contract:
// - Activities are stored server-side.
// - Images are uploaded server-side and returned as a public URL.

async function request(path, { method = 'GET', body, headers } = {}) {
  const auth = authHeader()

  const res = await fetch(path, {
    method,
    headers: {
      ...(body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
      ...(auth ? { Authorization: auth } : {}),
      ...(headers || {})
    },
    body: body instanceof FormData ? body : body != null ? JSON.stringify(body) : undefined
  })

  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(text || `Request failed: ${method} ${path} (${res.status})`)
  }

  const ct = res.headers.get('content-type') || ''
  if (ct.includes('application/json')) return res.json()
  return res.text()
}

export const vercelApi = {
  async listActivities() {
    return request('/api/activities')
  },

  async upsertActivities(activities) {
    return request('/api/activities', { method: 'PUT', body: { activities } })
  },

  async updateActivity(id, updates) {
    return request(`/api/activities/${encodeURIComponent(id)}`, { method: 'PATCH', body: updates })
  },

  async uploadImage(file) {
    const fd = new FormData()
    fd.append('file', file)
    return request('/api/upload', { method: 'POST', body: fd })
  }
}
