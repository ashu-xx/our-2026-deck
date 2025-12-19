import { json } from './_auth'
import { kvConfigured } from './_kv'

const ENV_KEYS = [
  // App-mode flags
  'VITE_LOCAL_DEV_MODE',
  'VITE_LOCAL_USERS',

  // Auth for protected API routes
  'APP_LOGIN_EMAIL',
  'APP_LOGIN_PASSWORD',

  // Vercel Blob
  'BLOB_READ_WRITE_TOKEN',

  // Vercel KV / Upstash
  'KV_URL',
  'KV_REST_API_URL',
  'KV_REST_API_TOKEN',
  'KV_REST_API_READ_ONLY_TOKEN',
  'REDIS_URL'
]

function presentEnv(keys) {
  const out = {}
  for (const k of keys) out[k] = Boolean(process.env[k])
  return out
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET')
    return json(res, 405, { error: 'Method not allowed' })
  }

  const env = presentEnv(ENV_KEYS)

  let kvOk = false
  let kvError = null

  if (!kvConfigured()) {
    kvOk = false
    kvError = 'KV not configured (missing KV env vars)'
  } else {
    try {
      // Lazy-load kv client only when configured.
      const { kv } = await import('@vercel/kv')
      await kv.get('our-2026-deck:health')
      kvOk = true
    } catch (e) {
      kvOk = false
      kvError = e?.message || String(e)
    }
  }

  return json(res, 200, {
    ok: kvOk,
    env,
    kv: { ok: kvOk, error: kvError }
  })
}
