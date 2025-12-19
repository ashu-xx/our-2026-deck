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
      // Upsert activities: merge incoming with existing, add new ones
      const chunks = []
      for await (const chunk of req) chunks.push(chunk)
      const body = chunks.length ? JSON.parse(Buffer.concat(chunks).toString('utf-8')) : {}

      const incoming = Array.isArray(body.activities) ? body.activities : []
      const existingList = (await kv.get(KEY)) || []

      // Build lookup map by ID
      const existingById = {}
      for (const a of existingList) {
        if (a.id) existingById[String(a.id)] = a
      }

      // Track which existing IDs we've updated
      const updatedIds = new Set()

      // Merge/update incoming activities
      const updated = incoming.map((a) => {
        if (a.id) updatedIds.add(String(a.id))
        const prev = existingById[String(a.id)] || {}
        return {
          ...prev,
          ...a,
          updated_at: a.updated_at || prev.updated_at || new Date().toISOString(),
          created_at: a.created_at || prev.created_at || new Date().toISOString()
        }
      })

      // Keep existing activities that weren't in the incoming list
      const unchanged = existingList.filter(a => !updatedIds.has(String(a.id)))

      const final = [...unchanged, ...updated]
      await kv.set(KEY, final)
      return json(res, 200, { ok: true, count: final.length })
    }

    res.setHeader('Allow', 'GET, PUT')
    return json(res, 405, { error: 'Method not allowed' })
  } catch (e) {
    return json(res, 500, { error: e?.message || 'Internal error' })
  }
}
