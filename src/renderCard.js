import { showCardEditor } from './cardEditor'
import { renderCardView } from './views/cardView'
import { showCardLargeModal } from './views/cardLargeModal'

/**
 * @typedef {Object} DeckCardContext
 * @property {boolean} isLocalDev
 * @property {number} index
 * @property {string} label
 * @property {(id: string, updates: any) => Promise<void>} [onEdit]
 * @property {(suit: string) => any} getSuitMeta
 * @property {(activity: any) => Promise<string>} fetchImageUrl
 * @property {boolean} [showEdit]
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
    getSuitMeta,
    fetchImageUrl,
    label,
    showEdit = false
  } = ctx

  const card = document.createElement('div')
  card.className = `perspective h-96 cursor-pointer animate-slide-in card-container relative select-none`
  card.style.animationDelay = `${index * 0.05}s`

  const imgUrl = await fetchImageUrl(act)
  const suitMeta = getSuitMeta(act.suit)

  // Always show the revealed/front side now.
  const isFlipped = 'flipped'
  const suitClass = `suit-${act.suit}`

  // Completion concept removed.
  const ctaHtml = ''

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

  // Force visual state to revealed.
  inner.classList.add('flipped')
  inner.style.setProperty('--flip', '180deg')

  // Remove flip + swipe-to-complete interactions.
  // Keep only:
  // - View large
  // - Edit (if showEdit)

  // Open modal for large view
  card.addEventListener('click', async (e) => {
    const viewBtn = e.target.closest('.view-large-btn')
    if (!viewBtn) return
    e.stopPropagation()
    try {
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
