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
    const id = req.query.id

    if (req.method === 'PATCH') {
      const chunks = []
      for await (const chunk of req) chunks.push(chunk)
      const updates = chunks.length ? JSON.parse(Buffer.concat(chunks).toString('utf-8')) : {}

      if (updates.image_path === undefined || updates.image_path === null || updates.image_path === '') {
        delete updates.image_path
      }

      updates.updated_at = updates.updated_at || new Date().toISOString()

      const activities = (await kv.get(KEY)) || []
      const idx = activities.findIndex((a) => String(a.id) === String(id))
      if (idx === -1) return json(res, 404, { error: 'Not found' })

      activities[idx] = { ...activities[idx], ...updates }

      await kv.set(KEY, activities)
      return json(res, 200, { ok: true, activity: activities[idx] })
    }

    if (req.method === 'DELETE') {
      const activities = (await kv.get(KEY)) || []
      const before = activities.length
      const next = activities.filter((a) => String(a.id) !== String(id))
      if (next.length === before) return json(res, 404, { error: 'Not found' })

      await kv.set(KEY, next)
      return json(res, 200, { ok: true, deleted_id: String(id) })
    }

    res.setHeader('Allow', 'PATCH, DELETE')
    return json(res, 405, { error: 'Method not allowed' })
  } catch (e) {
    return json(res, 500, { error: e?.message || 'Internal error' })
  }
}
