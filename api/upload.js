import { requireBasicAuth, json } from './_auth'

export const config = {
  api: {
    bodyParser: false
  }
}

function blobConfigured() {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN)
}

async function readMultipartFile(req) {
  // Minimal multipart/form-data parser that supports a single file field named "file".
  // Avoids extra deps; good enough for small personal apps.
  const ct = req.headers['content-type'] || ''
  const m = /boundary=(.+)$/.exec(ct)
  if (!m) throw new Error('Missing multipart boundary')
  const boundary = `--${m[1]}`

  const chunks = []
  for await (const chunk of req) chunks.push(chunk)
  const buf = Buffer.concat(chunks)

  const parts = buf.toString('binary').split(boundary)
  for (const part of parts) {
    if (!part || part === '--\r\n' || part === '--') continue

    const [rawHeaders, rawBody] = part.split('\r\n\r\n')
    if (!rawHeaders || !rawBody) continue

    const disp = /content-disposition:([^\r\n]+)/i.exec(rawHeaders)
    if (!disp) continue

    const nameMatch = /name="([^"]+)"/i.exec(disp[1])
    const fileMatch = /filename="([^"]*)"/i.exec(disp[1])
    const fieldName = nameMatch?.[1]
    const filename = fileMatch?.[1]
    if (fieldName !== 'file' || !filename) continue

    const typeMatch = /content-type:\s*([^\r\n]+)/i.exec(rawHeaders)
    const contentType = typeMatch?.[1]?.trim() || 'application/octet-stream'

    // rawBody ends with \r\n, and boundary split keeps trailing markers
    const bodyBinary = rawBody.replace(/\r\n$/, '')
    const fileBuffer = Buffer.from(bodyBinary, 'binary')

    return { filename, contentType, buffer: fileBuffer }
  }

  throw new Error('No file found in form-data')
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

    const { filename, contentType, buffer } = await readMultipartFile(req)

    // Lazy-load blob client to avoid crashing the function when Blob env is missing.
    const { put } = await import('@vercel/blob')

    const key = `activity-images/${Date.now()}-${filename}`
    const blob = await put(key, buffer, {
      access: 'public',
      contentType
    })

    return json(res, 200, { url: blob.url })
  } catch (e) {
    return json(res, 500, { error: e?.message || 'Upload failed' })
  }
}
