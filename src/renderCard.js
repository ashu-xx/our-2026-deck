import { showCardEditor } from './cardEditor'
import { renderCardView } from './views/cardView'

function buildCtaHtml({ isUpcomingYear, isUsed }) {
  if (isUpcomingYear) {
    const gradient = isUsed ? 'from-green-400 to-green-500' : 'from-yellow-400 to-yellow-500'
    const text = isUsed ? '✓ COMPLETED! 🎉' : '⚡ DOUBLE TAP TO MARK DONE'
    return `
      <div class="mt-3 bg-gradient-to-r ${gradient} text-xs text-center font-bold py-2.5 text-white rounded-lg shadow-md">
        ${text}
      </div>
    `
  }

  return `
    <div class="mt-3 bg-gradient-to-r from-pink-300 to-pink-400 text-center font-script text-lg py-2 text-white rounded-lg shadow-md">
      Beautiful Memory 💕
    </div>
  `
}

export async function createDeckCard(act, ctx) {
  const {
    year,
    pastYear,
    upcomingYear,
    isLocalDev,
    supabase,
    index,
    onEdit,
    onToggle,
    getSuitMeta,
    fetchImageUrl
  } = ctx

  const card = document.createElement('div')
  card.className = `perspective h-80 cursor-pointer animate-slide-in card-container ${act.is_used ? 'opacity-60' : ''}`
  card.style.animationDelay = `${index * 0.05}s`

  const imgUrl = await fetchImageUrl(act)
  const suitMeta = getSuitMeta(act.suit)
  const isFlipped = year === pastYear ? 'rotate-y-180' : ''
  const suitClass = `suit-${act.suit}`
  const isUpcomingYear = year === upcomingYear
  const ctaHtml = buildCtaHtml({ isUpcomingYear, isUsed: act.is_used })

  card.innerHTML = renderCardView({
    act,
    imgUrl,
    suitMeta,
    isFlipped,
    suitClass,
    ctaHtml
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

  if (isUpcomingYear) {
    card.ondblclick = async (e) => {
      e.stopPropagation()
      try {
        if (onToggle) await onToggle()
      } catch (err) {
        alert(err.message || 'Failed to update card')
      }
    }
  }

  return card
}
