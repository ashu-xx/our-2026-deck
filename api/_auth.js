import crypto from 'node:crypto'

export function json(res, status, data) {
  res.statusCode = status
  res.setHeader('Content-Type', 'application/json')
  res.end(JSON.stringify(data))
}

function safeEqual(a, b) {
  const ab = Buffer.from(String(a || ''), 'utf8')
  const bb = Buffer.from(String(b || ''), 'utf8')
  if (ab.length !== bb.length) return false
  return crypto.timingSafeEqual(ab, bb)
}

function normalizeEnvString(v) {
  // Vercel env vars are usually clean, but copy/paste can introduce trailing spaces/newlines.
  return String(v ?? '').trim()
}

function parseAllowedEmails(envValue) {
  const raw = normalizeEnvString(envValue)
  if (!raw) return []

  // Support either a single email or a comma-separated list.
  return raw
    .split(',')
    .map(s => s.trim().toLowerCase())
    .filter(Boolean)
}

function decodeBasicToken(token) {
  const raw = String(token || '').trim()
  if (!raw) return ''

  // Support base64url just in case something upstream normalizes the token.
  const b64 = raw.replace(/-/g, '+').replace(/_/g, '/')
  const padded = b64 + '='.repeat((4 - (b64.length % 4)) % 4)

  try {
    return Buffer.from(padded, 'base64').toString('utf8')
  } catch {
    return ''
  }
}

function unauthorized(res) {
  res.setHeader('WWW-Authenticate', 'Basic realm="Our 2026 Deck"')
  json(res, 401, { error: 'Unauthorized' })
}

/**
 * Protects an API route using credentials stored in Vercel Environment Variables.
 *
 * Required env vars:
 * - APP_LOGIN_EMAIL
 * - APP_LOGIN_PASSWORD
 *
 * Client must send header:
 * - Authorization: Basic base64(email:password)
 */
export function requireBasicAuth(req, res) {
  const allowedEmails = parseAllowedEmails(process.env.APP_LOGIN_EMAIL)
  const expectedPassword = normalizeEnvString(process.env.APP_LOGIN_PASSWORD)

  // If not configured, fail closed.
  if (!allowedEmails.length || !expectedPassword) {
    json(res, 500, { error: 'Server auth is not configured. Set APP_LOGIN_EMAIL and APP_LOGIN_PASSWORD.' })
    return false
  }

  const header = String(req.headers.authorization || '').trim()
  const m = /^Basic\s+(.+)$/i.exec(header)
  if (!m) {
    unauthorized(res)
    return false
  }

  const decoded = decodeBasicToken(m[1])
  const idx = decoded.indexOf(':')
  const email = idx >= 0 ? decoded.slice(0, idx).trim() : ''
  const password = idx >= 0 ? decoded.slice(idx + 1).trim() : ''

  // Email is lowercased in the UI; compare case-insensitively.
  const normalizedEmail = email.toLowerCase()
  const emailOk = allowedEmails.some((e) => safeEqual(normalizedEmail, e))
  const passwordOk = safeEqual(password, expectedPassword)

  if (!emailOk || !passwordOk) {
    unauthorized(res)
    return false
  }

  return true
}

// Back-compat: some code may import requireAuth.
export const requireAuth = requireBasicAuth
