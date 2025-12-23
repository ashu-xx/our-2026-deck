import { requireBasicAuth, json } from './_auth.js'
import crypto from 'node:crypto'

function blobConfigured() {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN)
}

export default async function handler(req, res) {
  try {
    if (!requireBasicAuth(req, res)) return

    if (!blobConfigured()) {
      return json(res, 500, { error: 'Vercel Blob is not configured for this deployment.' })
    }

    if (req.method !== 'POST') {
      res.setHeader('Allow', 'POST')
      return json(res, 405, { error: 'Method not allowed' })
    }

    const chunks = []
    for await (const chunk of req) chunks.push(chunk)
    const body = chunks.length ? JSON.parse(Buffer.concat(chunks).toString('utf-8')) : {}

    const filename = String(body.filename || 'upload').replaceAll(/[^a-zA-Z0-9._-]/g, '_')
    const contentType = String(body.contentType || 'application/octet-stream')

    // Create a unique path/key and let the client upload directly to Blob.
    const key = `activity-images/${Date.now()}-${crypto.randomUUID()}-${filename}`

    const { createPutToken } = await import('@vercel/blob')

    const token = await createPutToken({
      pathname: key,
      access: 'public',
      contentType
    })

    return json(res, 200, { token, key })
  } catch (e) {
    return json(res, 500, { error: e?.message || 'Failed to create upload token' })
  }
}
