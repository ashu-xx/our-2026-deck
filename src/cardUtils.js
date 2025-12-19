import { localStorageDB } from './localStorage'

export const SUIT_META = {
  hearts: { symbol: '♥️', emoji: '🎭', label: 'Cultural & Social' },
  diamonds: { symbol: '♦️', emoji: '🗺️', label: 'Adventures & Exploration' },
  clubs: { symbol: '♣️', emoji: '🦋', label: 'Nature & Outdoors' },
  spades: { symbol: '♠️', emoji: '🏠', label: 'Cozy & Creative' },
  joker: { symbol: '🃏', emoji: '🌟', label: 'Wild Card' },
  default: { symbol: '✨', emoji: '✨', label: 'Special' }
}

export async function fetchImageUrl(act, isLocalDev, supabase) {
  const fallback = 'https://via.placeholder.com/300x200?text=No+Photo'
  if (!act.image_path) return fallback

  if (isLocalDev) {
    const localImg = localStorageDB.getImageUrl(act.image_path)
    return localImg || fallback
  }

  const { data, error } = await supabase.storage.from('activity-images').createSignedUrl(act.image_path, 3600)
  if (error || !data) return fallback
  return data.signedUrl
}

export async function toggleUsage(act, isLocalDev, supabase) {
  if (isLocalDev) {
    const { error } = await localStorageDB.updateActivity(act.id, { is_used: !act.is_used })
    if (error) throw new Error(error.message)
    return
  }
  const { error } = await supabase.from('activities').update({ is_used: !act.is_used }).eq('id', act.id)
  if (error) throw new Error(error.message)
}

export function celebrateIfNeeded(act) {
  if (act.is_used) return
  const celebration = document.createElement('div')
  celebration.className = 'fixed inset-0 flex items-center justify-center z-50 pointer-events-none'
  celebration.innerHTML = '<div class="text-9xl animate-bounce">🎉</div>'
  document.body.appendChild(celebration)
  setTimeout(() => celebration.remove(), 1500)
}

