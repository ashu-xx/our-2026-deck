import { showCardEditor } from './cardEditor'
import { renderCardView } from './views/cardView'
import { showCardLargeModal } from './views/cardLargeModal'
import { showBirthdayCelebration } from './birthdayCelebration'

/**
 * @typedef {Object} DeckCardContext
 * @property {boolean} isLocalDev
 * @property {number} index
 * @property {string} label
 * @property {(id: string, updates: any) => Promise<void>} [onEdit]
 * @property {() => Promise<void>} [onToggle]
 * @property {(suit: string) => any} getSuitMeta
 * @property {(activity: any) => Promise<string>} fetchImageUrl
 * @property {boolean} [showEdit]
 * @property {boolean} [viewOnly]
 */

/**
 * @param {any} act
 * @param {DeckCardContext} ctx
 */
export async function createDeckCard(act, ctx) {
  const {
    isLocalDev,
    index,
    onEdit,
    onToggle,
    getSuitMeta,
    fetchImageUrl,
    label,
    showEdit = false,
    viewOnly = false
  } = ctx

  const card = document.createElement('div')
  card.className = `perspective h-96 cursor-pointer animate-slide-in card-container relative select-none`
  card.style.animationDelay = `${index * 0.05}s`

  const imgUrl = await fetchImageUrl(act)
  const suitMeta = getSuitMeta(act.suit)
  const isFlipped = act.is_used ? 'flipped' : ''
  const suitClass = `suit-${act.suit}`

  // In view-only mode, keep the card focused for viewing (no edit UI),
  // but still allow marking complete via swipe/double-click.
  // We still show a "Completed" badge when the card is done.
  let ctaHtml = buildCtaHtml({ isDone: act.is_used })
  if (viewOnly && !act.is_used) {
    ctaHtml = ''
  }

  card.innerHTML = renderCardView({
    act,
    imgUrl,
    suitMeta,
    isFlipped,
    suitClass,
    ctaHtml,
    label,
    showEdit
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
    if (e.target.closest('.view-large-btn')) return
    if (Math.hypot(currentX, currentY) > 8) return

    flipState = !flipState
    inner.classList.toggle('flipped', flipState)
    setTransform()
  })

  // Allow swipe + dblclick toggling as long as onToggle exists.
  // (Edit remains disabled by showEdit=false.)
  inner.addEventListener('pointerdown', (e) => {
    if (e.target.closest('.edit-card-btn')) return
    if (e.target.closest('.view-large-btn')) return
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

    // Always release capture first.
    inner.releasePointerCapture(e.pointerId)
    dragging = false

    const dist = Math.hypot(currentX, currentY)
    const threshold = 120

    if (dist > threshold) {
      const direction = Math.sign(currentX || 1)

      // Animate card off-screen.
      inner.style.transition = 'transform 220ms ease-out'
      inner.style.setProperty('--tx', `${direction * 600}px`)
      inner.style.setProperty('--rot', `${direction * 28}deg`)

      // After the animation, always clean up visual state so it can't get stuck
      // (even if the re-render is slow or onToggle errors).
      setTimeout(async () => {
        try {
          if (onToggle) await onToggle()
        } finally {
          // Ensure local visual state is reset.
          inner.classList.remove('dragging')
          inner.style.transition = ''
          resetTransform()
        }
      }, 220)

      return
    }

    inner.style.transition = 'transform 200ms ease-out'
    resetTransform()
    setTimeout(() => {
      inner.style.transition = ''
    }, 220)
  })

  inner.addEventListener('pointercancel', (e) => {
    // If we still have capture for this pointer, release it.
    try {
      if (e?.pointerId != null && inner.hasPointerCapture(e.pointerId)) {
        inner.releasePointerCapture(e.pointerId)
      }
    } catch {
      // ignore
    }
    dragging = false
    inner.classList.remove('dragging')
    inner.style.transition = ''
    resetTransform()
  })

  inner.addEventListener('lostpointercapture', () => {
    // Safety net: if capture is lost mid-drag, reset.
    dragging = false
    inner.classList.remove('dragging')
    inner.style.transition = ''
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

  // Open modal for large view
  card.addEventListener('click', async (e) => {
    const viewBtn = e.target.closest('.view-large-btn')
    if (!viewBtn) return
    e.stopPropagation()
    try {
      console.log('[View Button] Calling showBirthdayCelebration')
      // Treat opening the large view as a reveal moment as well.
      showBirthdayCelebration(act)
      await showCardLargeModal({ act, isLocalDev, label })
    } catch (err) {
      console.error(err)
    }
  })

  card.addEventListener('click', (e) => {
    if (!showEdit) return
    if (e.target.closest('.edit-card-btn')) {
      e.stopPropagation()
      showCardEditor(act, isLocalDev, async (id, updates) => {
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
