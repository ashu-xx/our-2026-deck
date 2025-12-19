import { requireBasicAuth, json } from '../_auth'
import { kvConfigured } from '../_kv'

const KEY = 'our-2026-deck:activities'

export default async function handler(req, res) {
  try {
    if (!requireBasicAuth(req, res)) return

    if (!kvConfigured()) {
      return json(res, 500, { error: 'Vercel KV is not configured for this deployment.' })
    }

    // Lazy-load kv client to avoid crashing the function when KV env is missing.
    const { kv } = await import('@vercel/kv')

    if (req.method === 'GET') {
      const activities = (await kv.get(KEY)) || []
      return json(res, 200, { activities })
    }

    if (req.method === 'PUT') {
      const chunks = []
      for await (const chunk of req) chunks.push(chunk)
      const body = chunks.length ? JSON.parse(Buffer.concat(chunks).toString('utf-8')) : {}

      const activities = Array.isArray(body.activities) ? body.activities : []
      await kv.set(KEY, activities)
      return json(res, 200, { ok: true, count: activities.length })
    }

    res.setHeader('Allow', 'GET, PUT')
    return json(res, 405, { error: 'Method not allowed' })
  } catch (e) {
    return json(res, 500, { error: e?.message || 'Internal error' })
  }
}
