import { kv } from '@vercel/kv'
import { requireBasicAuth, json } from '../_auth'

const KEY = 'our-2026-deck:activities'

export default async function handler(req, res) {
  try {
    if (!requireBasicAuth(req, res)) return

    if (req.method !== 'PATCH') {
      res.setHeader('Allow', 'PATCH')
      return json(res, 405, { error: 'Method not allowed' })
    }

    const id = req.query.id

    const chunks = []
    for await (const chunk of req) chunks.push(chunk)
    const updates = chunks.length ? JSON.parse(Buffer.concat(chunks).toString('utf-8')) : {}

    const activities = (await kv.get(KEY)) || []
    const idx = activities.findIndex((a) => String(a.id) === String(id))
    if (idx === -1) return json(res, 404, { error: 'Not found' })

    activities[idx] = { ...activities[idx], ...updates }

    await kv.set(KEY, activities)
    return json(res, 200, { ok: true, activity: activities[idx] })
  } catch (e) {
    return json(res, 500, { error: e?.message || 'Internal error' })
  }
}
