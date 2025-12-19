export function renderDealingOverlay({ label = 'Dealing the deck…' } = {}) {
  const suits = ['\u2665', '\u2666', '\u2663', '\u2660']
  const suit = suits[Math.floor(Math.random() * suits.length)]

  return `
    <div data-dealing-overlay class="dealing-overlay">
      <div class="dealing-card">
        <div class="dealing-bg-circle dealing-bg-1"></div>
        <div class="dealing-bg-circle dealing-bg-2"></div>

        <div class="dealing-header">
          <div class="dealing-title">${label}</div>
          <div class="dealing-subtitle">Shuffling, cutting, and dealing…</div>
        </div>

        <div class="dealing-stage">
          <div class="deal-card deal-card-1" data-suit="${suit}"></div>
          <div class="deal-card deal-card-2" data-suit="${suit}"></div>
          <div class="deal-card deal-card-3" data-suit="${suit}"></div>
          <div class="deal-card deal-card-4" data-suit="${suit}"></div>

          <div class="spark spark-1">${suit}</div>
          <div class="spark spark-2">${suit}</div>
          <div class="spark spark-3">${suit}</div>
          <div class="spark spark-4">${suit}</div>
        </div>

        <div class="dealing-footer">Fetching activities and shuffling memories…</div>
      </div>
    </div>
  `
}

