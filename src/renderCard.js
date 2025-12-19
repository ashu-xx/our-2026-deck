import { showCardEditor } from './cardEditor'
import { renderCardView } from './views/cardView'

function buildCtaHtml({ isDone }) {
  if (isDone) {
    return `
      <div class="mt-3 bg-gradient-to-r from-green-400 to-green-500 text-xs text-center font-bold py-2.5 text-white rounded-lg shadow-md">
        ✓ COMPLETED! 🎉
      </div>
    `
  }

  return `
    <div class="mt-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-xs text-center font-bold py-2.5 text-white rounded-lg shadow-md">
      ⚡ DOUBLE TAP TO MARK DONE
    </div>
  `
}

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
  card.className = `perspective h-80 cursor-pointer animate-slide-in card-container ${act.is_used ? '' : ''}`
  card.style.animationDelay = `${index * 0.05}s`

  const imgUrl = await fetchImageUrl(act)
  const suitMeta = getSuitMeta(act.suit)
  const isFlipped = act.is_used ? 'rotate-y-180' : ''
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

  card.onclick = (e) => {
    if (e.target.closest('.edit-card-btn')) {
      e.stopPropagation()
      showCardEditor(act, supabase, isLocalDev, async (id, updates) => {
        if (onEdit) await onEdit(id, updates)
      })
      return
    }

    card.querySelector('.card-inner').classList.toggle('rotate-y-180')
  }

  card.ondblclick = async (e) => {
    e.stopPropagation()
    try {
      if (onToggle) await onToggle()
    } catch (err) {
      alert(err.message || 'Failed to update card')
    }
  }

  return card
}
