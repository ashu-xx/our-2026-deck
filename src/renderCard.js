import { showCardEditor } from './cardEditor'
import { renderCardView } from './views/cardView'

/**
 * @typedef {Object} DeckCardContext
 * @property {boolean} isLocalDev
 * @property {any} supabase
 * @property {number} index
 * @property {string} monthLabel
 * @property {(id: string, updates: any) => Promise<void>} onEdit
 * @property {() => Promise<void>} onToggle
 * @property {(suit: string) => any} getSuitMeta
 * @property {(activity: any) => Promise<string>} fetchImageUrl
 */

/**
 * @param {any} act
 * @param {DeckCardContext} ctx
 */
export async function createDeckCard(act, ctx) {
  const {
    isLocalDev,
    supabase,
    index,
    onEdit,
    onToggle,
    getSuitMeta,
    fetchImageUrl,
    monthLabel
  } = ctx

  const card = document.createElement('div')
  card.className = `perspective h-96 cursor-pointer animate-slide-in card-container relative select-none`
  card.style.animationDelay = `${index * 0.05}s`

  const imgUrl = await fetchImageUrl(act)
  const suitMeta = getSuitMeta(act.suit)
  const isFlipped = act.is_used ? 'flipped' : ''
  const suitClass = `suit-${act.suit}`
  const ctaHtml = buildCtaHtml({ isDone: act.is_used })

  card.innerHTML = renderCardView({
    act,
    imgUrl,
    suitMeta,
    isFlipped,
    suitClass,
    ctaHtml,
    monthLabel
  })

  const inner = card.querySelector('.card-inner')
  if (!inner) return card

  let flipState = !!act.is_used
  let startX = 0
  let startY = 0
  let currentX = 0
  let currentY = 0
  let dragging = false

  const setTransform = () => {
    inner.style.setProperty('--tx', `${currentX}px`)
    inner.style.setProperty('--ty', `${currentY}px`)
    inner.style.setProperty('--rot', `${currentX / 15}deg`)
    inner.style.setProperty('--flip', flipState ? '180deg' : '0deg')
  }

  const resetTransform = () => {
    currentX = 0
    currentY = 0
    inner.classList.remove('dragging')
    setTransform()
  }

  inner.addEventListener('click', (e) => {
    if (e.target.closest('.edit-card-btn')) return
    if (Math.hypot(currentX, currentY) > 8) return
    flipState = !flipState
    inner.classList.toggle('flipped', flipState)
    setTransform()
  })

  inner.addEventListener('pointerdown', (e) => {
    if (e.target.closest('.edit-card-btn')) return
    dragging = true
    startX = e.clientX - currentX
    startY = e.clientY - currentY
    inner.classList.add('dragging')
    inner.setPointerCapture(e.pointerId)
  })

  inner.addEventListener('pointermove', (e) => {
    if (!dragging || !inner.hasPointerCapture(e.pointerId)) return
    currentX = e.clientX - startX
    currentY = e.clientY - startY
    setTransform()
  })

  inner.addEventListener('pointerup', async (e) => {
    if (!inner.hasPointerCapture(e.pointerId)) return
    inner.releasePointerCapture(e.pointerId)
    dragging = false
    const dist = Math.hypot(currentX, currentY)
    const threshold = 120

    if (dist > threshold) {
      const direction = Math.sign(currentX || 1)
      inner.style.transition = 'transform 220ms ease-out'
      inner.style.setProperty('--tx', `${direction * 600}px`)
      inner.style.setProperty('--rot', `${direction * 28}deg`)
      setTimeout(async () => {
        if (onToggle) await onToggle()
      }, 220)
      return
    }

    inner.style.transition = 'transform 200ms ease-out'
    resetTransform()
    setTimeout(() => {
      inner.style.transition = ''
    }, 220)
  })

  inner.addEventListener('pointercancel', () => {
    dragging = false
    resetTransform()
  })

  inner.addEventListener('dblclick', async (e) => {
    e.stopPropagation()
    try {
      if (onToggle) await onToggle()
    } catch (err) {
      alert(err.message || 'Failed to update card')
    }
  })

  card.addEventListener('click', (e) => {
    if (e.target.closest('.edit-card-btn')) {
      e.stopPropagation()
      showCardEditor(act, supabase, isLocalDev, async (id, updates) => {
        if (onEdit) await onEdit(id, updates)
      })
    }
  })

  return card
}

function buildCtaHtml({ isDone }) {
  if (isDone) {
    return `
      <div class="mt-3 bg-linear-to-r from-green-500 to-emerald-600 text-xs text-center font-bold py-2.5 text-white rounded-lg shadow-md">
        ✓ Completed — swipe to undo
      </div>
    `
  }

  return `
    <div class="mt-3 bg-linear-to-r from-yellow-400 to-yellow-500 text-xs text-center font-bold py-2.5 text-white rounded-lg shadow-md">
      Tap to flip • Swipe to complete
    </div>
  `
}
