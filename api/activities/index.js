import { requireBasicAuth, json } from '../_auth.js'
import { kvConfigured, getKvClient } from '../_kv.js'

const KEY = 'our-2026-deck:activities'

export default async function handler(req, res) {
  try {
    if (!requireBasicAuth(req, res)) return

    if (!kvConfigured()) {
      return json(res, 500, { error: 'Vercel KV is not configured for this deployment.' })
    }

    const kv = await getKvClient()

    if (req.method === 'GET') {
      const activities = (await kv.get(KEY)) || []
      return json(res, 200, { activities })
    }

    if (req.method === 'PUT') {
      const chunks = []
      for await (const chunk of req) chunks.push(chunk)
      const body = chunks.length ? JSON.parse(Buffer.concat(chunks).toString('utf-8')) : {}

      const incoming = Array.isArray(body.activities) ? body.activities : []
      const existing = ((await kv.get(KEY)) || []).reduce((map, a) => {
        map[String(a.id)] = a
        return map
      }, {})

      const merged = incoming.map((a) => {
        const prev = existing[String(a.id)] || {}
        return {
          ...a,
          updated_at: a.updated_at || prev.updated_at || new Date().toISOString()
        }
      })

      await kv.set(KEY, merged)
      return json(res, 200, { ok: true, count: merged.length })
    }

    res.setHeader('Allow', 'GET, PUT')
    return json(res, 405, { error: 'Method not allowed' })
  } catch (e) {
    return json(res, 500, { error: e?.message || 'Internal error' })
  }
}
