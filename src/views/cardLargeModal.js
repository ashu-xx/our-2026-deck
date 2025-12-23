import { fetchImageUrl, getSuitMeta } from '../cardUtils'

/**
 * Lightweight single-card modal (reused; only one at a time).
 * @param {{ act: any, isLocalDev: boolean, label?: string }} opts
 */
export async function showCardLargeModal({ act, isLocalDev, label = '' }) {
  const imgUrl = await fetchImageUrl(act, isLocalDev)
  const suitMeta = getSuitMeta(act.suit)

  // Remove any existing modal
  document.querySelector('[data-card-modal-overlay]')?.remove()

  const overlay = document.createElement('div')
  overlay.dataset.cardModalOverlay = 'true'
  overlay.className = 'card-modal-overlay'

  overlay.innerHTML = `
    <div class="card-modal-backdrop" data-card-modal-backdrop></div>
    <div class="card-modal-dialog" role="dialog" aria-modal="true">
      <button class="card-modal-close" type="button" aria-label="Close" data-card-modal-close>✕</button>

      <div class="card-modal-card">
        <div class="card-modal-image">
          <img src="${imgUrl}" alt="${escapeHtml(act.title || '')}">
          <div class="card-modal-suit">
            <span class="text-2xl">${suitMeta.symbol}</span>
          </div>
        </div>

        <div class="card-modal-body suit-${act.suit}">
          ${label ? `<div class="card-modal-label">${escapeHtml(label)}</div>` : ''}
          <h2 class="card-modal-title">${escapeHtml(act.title || '')}</h2>
          ${act.description ? `<p class="card-modal-desc">${escapeHtml(act.description)}</p>` : ''}
          ${act.is_used ? `<div class="card-modal-completed">✓ Completed</div>` : ''}
        </div>
      </div>
    </div>
  `

  const close = () => {
    document.removeEventListener('keydown', onKeyDown)
    overlay.remove()
  }

  const onKeyDown = (e) => {
    if (e.key === 'Escape') close()
  }

  overlay.addEventListener('click', (e) => {
    if (e.target?.closest?.('[data-card-modal-close]')) {
      e.preventDefault()
      close()
      return
    }
    if (e.target?.closest?.('[data-card-modal-backdrop]')) {
      close()
    }
  })

  document.addEventListener('keydown', onKeyDown)
  document.body.appendChild(overlay)
}

function escapeHtml(str) {
  return String(str)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}
