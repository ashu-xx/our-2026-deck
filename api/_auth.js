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
  const expectedEmail = process.env.APP_LOGIN_EMAIL
  const expectedPassword = process.env.APP_LOGIN_PASSWORD

  // If not configured, fail closed.
  if (!expectedEmail || !expectedPassword) {
    json(res, 500, { error: 'Server auth is not configured. Set APP_LOGIN_EMAIL and APP_LOGIN_PASSWORD.' })
    return false
  }

  const header = req.headers.authorization || ''
  const m = /^Basic\s+(.+)$/i.exec(header)
  if (!m) {
    res.setHeader('WWW-Authenticate', 'Basic realm="Our 2026 Deck"')
    json(res, 401, { error: 'Unauthorized' })
    return false
  }

  const decoded = Buffer.from(m[1], 'base64').toString('utf8')
  const idx = decoded.indexOf(':')
  const email = idx >= 0 ? decoded.slice(0, idx) : ''
  const password = idx >= 0 ? decoded.slice(idx + 1) : ''

  if (!safeEqual(email, expectedEmail) || !safeEqual(password, expectedPassword)) {
    res.setHeader('WWW-Authenticate', 'Basic realm="Our 2026 Deck"')
    json(res, 401, { error: 'Unauthorized' })
    return false
  }

  return true
}
