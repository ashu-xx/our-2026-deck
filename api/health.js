import { kv } from '@vercel/kv'
import { json } from './_auth'

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

  // Connectivity check for KV.
  // Important: if KV isn't configured, the '@vercel/kv' client can throw before/when calling.
  // We *must not* crash the whole function; return a diagnostic response instead.
  let kvOk = false
  let kvError
  try {
    if (!env.KV_REST_API_URL || !env.KV_REST_API_TOKEN) {
      kvOk = false
      kvError = 'KV not configured (missing KV_REST_API_URL/KV_REST_API_TOKEN)'
    } else {
      await kv.get('our-2026-deck:health')
      kvOk = true
      kvError = null
    }
  } catch (e) {
    kvOk = false
    kvError = e?.message || String(e)
  }

  return json(res, 200, {
    ok: kvOk,
    env,
    kv: { ok: kvOk, error: kvError || null }
  })
}
