import { json } from './_auth'

// Unprotected ping route to validate that API functions are running at all.
export default async function handler(req, res) {
  return json(res, 200, {
    ok: true,
    now: new Date().toISOString(),
    node: process.version,
    hasEnv: {
      APP_LOGIN_EMAIL: Boolean(process.env.APP_LOGIN_EMAIL),
      APP_LOGIN_PASSWORD: Boolean(process.env.APP_LOGIN_PASSWORD),
      KV_REST_API_URL: Boolean(process.env.KV_REST_API_URL),
      KV_REST_API_TOKEN: Boolean(process.env.KV_REST_API_TOKEN),
      BLOB_READ_WRITE_TOKEN: Boolean(process.env.BLOB_READ_WRITE_TOKEN)
    }
  })
}

