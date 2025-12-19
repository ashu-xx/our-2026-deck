import { kv } from '@vercel/kv'
import { requireBasicAuth, json } from '../_auth'

const KEY = 'our-2026-deck:activities'

export default async function handler(req, res) {
  try {
    if (!requireBasicAuth(req, res)) return

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
