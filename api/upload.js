import { requireBasicAuth, json } from './_auth.js'
import Busboy from 'busboy'
import crypto from 'node:crypto'

export const config = {
  api: {
    bodyParser: false
  }
}

function blobConfigured() {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN)
}

async function parseMultipart(req) {
  return new Promise((resolve, reject) => {
    try {
      const busboy = Busboy({ headers: req.headers })
      let fileBuffer = null
      let fileName = null
      let fileMime = null

      busboy.on('file', (_, file, info) => {
        const { filename, mimeType } = info
        const chunks = []
        file.on('data', (d) => chunks.push(d))
        file.on('end', () => {
          fileBuffer = Buffer.concat(chunks)
          fileName = filename
          fileMime = mimeType
        })
      })

      busboy.on('error', (err) => reject(err))
      busboy.on('finish', () => {
        if (!fileBuffer || !fileName) return reject(new Error('No file found in form-data'))
        resolve({ filename: fileName, contentType: fileMime || 'application/octet-stream', buffer: fileBuffer })
      })

      req.pipe(busboy)
    } catch (err) {
      reject(err)
    }
  })
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

    const { filename, contentType, buffer } = await parseMultipart(req)

    const { put } = await import('@vercel/blob')

    const key = `activity-images/${Date.now()}-${crypto.randomUUID()}-${filename}`
    const blob = await put(key, buffer, {
      access: 'public',
      contentType
    })

    return json(res, 200, { url: blob.url, key })
  } catch (e) {
    return json(res, 500, { error: e?.message || 'Upload failed' })
  }
}
