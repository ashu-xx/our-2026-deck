function present(k) {
  return Boolean(process.env[k])
}

export function kvConfigured() {
  // Vercel KV typically provides these. We check both common sets to be safe.
  return (
    (present('KV_REST_API_URL') && present('KV_REST_API_TOKEN')) ||
    present('KV_URL') ||
    present('REDIS_URL')
  )
}

export async function getKvClient() {
  const mod = await import('@vercel/kv')
  return mod.kv
}
