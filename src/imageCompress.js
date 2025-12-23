// Client-side image compression to make mobile (iOS) uploads reliable.
// - Resizes large images to a max dimension
// - Re-encodes as JPEG to dramatically reduce file size
// - Tries to preserve orientation via createImageBitmap(imageOrientation)

const DEFAULTS = {
  maxDimension: 1600, // good balance for card images
  quality: 0.82,
  maxOutputBytes: 1024 * 1024 // ~1MB safety target
}

function isBrowser() {
  return globalThis.window !== undefined && globalThis.document !== undefined
}

function getExtFromType(type) {
  if (type === 'image/png') return 'png'
  if (type === 'image/webp') return 'webp'
  if (type === 'image/heic' || type === 'image/heif') return 'heic'
  return 'jpg'
}

function withJpgName(originalName) {
  // Only remove the last extension (single replacement).
  const base = String(originalName || 'upload').replace(/\.[^/.]+$/, '')
  return `${base}.jpg`
}

async function fileToImageBitmap(file) {
  // createImageBitmap with imageOrientation is supported in modern browsers.
  // If not available, fallback to HTMLImageElement.
  if (typeof createImageBitmap === 'function') {
    try {
      return await createImageBitmap(file, { imageOrientation: 'from-image' })
    } catch {
      // ignore and fallback
    }
  }

  const url = URL.createObjectURL(file)
  try {
    const img = new Image()
    img.decoding = 'async'
    img.src = url
    await new Promise((resolve, reject) => {
      img.onload = () => resolve()
      img.onerror = () => reject(new Error('Failed to decode image'))
    })

    // Convert image element to bitmap-like object.
    return img
  } finally {
    URL.revokeObjectURL(url)
  }
}

function drawToCanvas(source, targetW, targetH) {
  const canvas = document.createElement('canvas')
  canvas.width = targetW
  canvas.height = targetH
  const ctx = canvas.getContext('2d')
  ctx.imageSmoothingEnabled = true
  ctx.imageSmoothingQuality = 'high'
  ctx.drawImage(source, 0, 0, targetW, targetH)
  return canvas
}

async function canvasToJpegFile(canvas, { quality, name }) {
  const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg', quality))
  if (!blob) throw new Error('Failed to encode image')

  return new File([blob], name, { type: 'image/jpeg' })
}

function debugEnabled() {
  // Always-on for now.
  // (We can switch back to a localStorage toggle once iOS uploads are stable.)
  return true
}

function log(...args) {
  if (!debugEnabled()) return
  // eslint-disable-next-line no-console
  console.log('[imageCompress]', ...args)
}

function fmtBytes(n) {
  const num = Number(n)
  if (!Number.isFinite(num)) return String(n)
  const kb = 1024
  const mb = kb * 1024
  if (num >= mb) return `${(num / mb).toFixed(2)} MB`
  if (num >= kb) return `${(num / kb).toFixed(1)} KB`
  return `${num} B`
}

/**
 * Compress image if it is too large for reliable uploads.
 * Used by the card editor before calling dataStore.uploadImage(...).
 *
 * Returns the original file if it doesn't need compression (or if not in browser).
 *
 * @param {File} file
 * @param {{maxDimension?: number, quality?: number, maxOutputBytes?: number}} [opts]
 */
export async function compressImageForUpload(file, opts = {}) {
  if (!isBrowser()) return file
  if (!(file instanceof File)) return file

  const { maxDimension, quality, maxOutputBytes } = { ...DEFAULTS, ...opts }

  log('input', {
    name: file.name,
    type: file.type,
    size: fmtBytes(file.size),
    maxDimension,
    maxOutputBytes: fmtBytes(maxOutputBytes),
    quality
  })

  // If it's already small-ish, keep it.
  if (file.size <= maxOutputBytes) {
    log('skip: already under target')
    return file
  }

  // Some iOS images can be HEIC; browsers may not decode it.
  // In that case, leave as-is so the upload fails with a clear error.
  const type = String(file.type || '')
  if (type.includes('heic') || type.includes('heif')) {
    log('skip: HEIC/HEIF not handled by canvas in most browsers', { type })
    return file
  }

  const source = await fileToImageBitmap(file)
  const srcW = source.width
  const srcH = source.height

  log('decoded', { srcW, srcH })

  if (!srcW || !srcH) {
    log('skip: missing dimensions')
    return file
  }

  const scale = Math.min(1, maxDimension / Math.max(srcW, srcH))
  const outW = Math.max(1, Math.round(srcW * scale))
  const outH = Math.max(1, Math.round(srcH * scale))

  log('resize', { scale: Number(scale.toFixed(4)), outW, outH })

  const canvas = drawToCanvas(source, outW, outH)

  // Try a couple of quality steps until under the target size.
  const name = withJpgName(file.name || `upload.${getExtFromType(type)}`)
  let q = quality
  for (let i = 0; i < 4; i++) {
    const out = await canvasToJpegFile(canvas, { quality: q, name })
    log('encode attempt', { attempt: i + 1, quality: Number(q.toFixed(3)), outSize: fmtBytes(out.size) })
    if (out.size <= maxOutputBytes) {
      log('success', { outSize: fmtBytes(out.size), outType: out.type, outName: out.name })
      return out
    }
    q = Math.max(0.6, q - 0.12)
  }

  // Return best effort.
  const best = await canvasToJpegFile(canvas, { quality: q, name })
  log('best-effort', { quality: Number(q.toFixed(3)), outSize: fmtBytes(best.size) })
  return best
}
