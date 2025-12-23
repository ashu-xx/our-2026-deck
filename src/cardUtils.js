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
