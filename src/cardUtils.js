import { dataStore } from './dataStore'

export const SUIT_META = {
  hearts: { symbol: '♥️', emoji: '🎭', label: 'Cultural & Social' },
  diamonds: { symbol: '♦️', emoji: '🗺️', label: 'Adventures & Exploration' },
  clubs: { symbol: '♣️', emoji: '🦙', label: 'Nature & Outdoors' },
  spades: { symbol: '♠️', emoji: '🏠', label: 'Cozy & Creative' },
  default: { symbol: '✨', emoji: '✨', label: 'Special' }
}

export function getSuitMeta(suit) {
  return SUIT_META[suit] || SUIT_META.default
}

export async function fetchImageUrl(act, isLocalDev) {
  const fallback = '/vite.svg'
  if (!act?.image_path) return fallback

  const url = await dataStore.getImageUrl(act.image_path, isLocalDev)
  return url || fallback
}

export async function toggleUsage(act, isLocalDev) {
  const updated = { ...act, is_used: !act.is_used, updated_at: new Date().toISOString() }
  await dataStore.updateActivity(updated, isLocalDev)
}

export function celebrateIfNeeded(act) {
  if (act.is_used) return
  const celebration = document.createElement('div')
  celebration.className = 'fixed inset-0 flex items-center justify-center z-50 pointer-events-none'
  celebration.innerHTML = '<div class="text-9xl animate-bounce">🎉</div>'
  document.body.appendChild(celebration)
  setTimeout(() => celebration.remove(), 1500)
}
