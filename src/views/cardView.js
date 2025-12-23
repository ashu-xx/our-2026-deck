export function renderCardView({
  act,
  imgUrl,
  suitMeta,
  isFlipped,
  suitClass,
  ctaHtml,
  label,
  showEdit = false
}) {
  const { symbol, emoji, label: suitLabel } = suitMeta

  // Check if this is a joker card
  const isJoker = act.title?.toLowerCase().includes('joker')
  const displaySymbol = isJoker ? '🃏' : symbol
  const displayEmoji = isJoker ? '🌟' : emoji
  const displayLabel = isJoker ? 'Wild Card!' : suitLabel

  // Only show the optional pill label if it's not duplicating the suit label.
  const normalizedLabel = (label || '').trim()
  const normalizedDisplayLabel = (displayLabel || '').trim()
  const showPillLabel = Boolean(
    normalizedLabel &&
      normalizedDisplayLabel &&
      normalizedLabel.toLowerCase() !== normalizedDisplayLabel.toLowerCase()
  )

  const cacheBuster = act.updated_at || act.id || ''

  // Don't append query params to blob: URLs (they're already unique per object URL).
  // Also avoid appending a second cache-buster if the URL already has one.
  let imgSrc = imgUrl
  if (cacheBuster && imgUrl && !String(imgUrl).startsWith('blob:')) {
    const u = String(imgUrl)
    if (!/[?&]v=/.test(u)) {
      imgSrc = u.includes('?')
        ? `${u}&v=${encodeURIComponent(cacheBuster)}`
        : `${u}?v=${encodeURIComponent(cacheBuster)}`
    }
  }

  const editBtnBack = showEdit
    ? `
      <button class="edit-card-btn mt-4 px-4 py-2 bg-white/15 hover:bg-white/25 text-white text-xs font-bold rounded-full transition-all backdrop-blur">
        ✏️ Edit
      </button>
    `
    : ''

  const editBtnFront = showEdit
    ? `
      <button class="edit-card-btn absolute bottom-2 right-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 text-[11px] font-bold rounded-full transition-all shadow-md">
        ✏️ Edit
      </button>
    `
    : ''

  const viewLargeBtnFront = `
      <button class="view-large-btn absolute bottom-2 left-2 bg-black/70 hover:bg-black/80 text-white px-3 py-1 text-[11px] font-bold rounded-full transition-all shadow-md">
        🔍 View
      </button>
    `

  return `
    <div class="card-inner w-full h-full relative ${isFlipped}"
      style="--flip: ${isFlipped ? '180deg' : '0deg'}; --tx: 0px; --ty: 0px; --rot: 0deg;"
    >
      <!-- Back (playing card face-down) -->
      <div class="absolute inset-0 backface-hidden border-4 border-white rounded-3xl shadow-2xl overflow-hidden bg-linear-to-br from-slate-900 via-slate-800 to-slate-900">
        <div class="absolute inset-2 rounded-2xl border-2 border-white/30"></div>
        <div class="absolute inset-6 rounded-xl border border-white/15"></div>
        <div class="absolute inset-0 flex flex-col items-center justify-center text-white px-6">
          <div class="text-6xl drop-shadow">${displaySymbol}</div>
          <div class="mt-2 text-3xl">${displayEmoji}</div>
          ${showPillLabel ? `<div class="mt-4 px-4 py-2 bg-white/10 rounded-full backdrop-blur text-xs font-bold tracking-[0.3em] uppercase">${label}</div>` : ''}
          <div class="mt-2 text-[9px] text-white/90 font-bold text-center max-w-[70%] leading-tight wrap-break-word uppercase tracking-wider">${displayLabel}</div>
          <div class="mt-6 text-[11px] text-white/70"></div>
          ${editBtnBack}
        </div>
      </div>

      <!-- Front (revealed activity) -->
      <div class="absolute inset-0 backface-hidden rotate-y-180 rounded-3xl overflow-hidden shadow-2xl bg-white border border-slate-200 flex flex-col">
        <div class="relative h-56 sm:h-64 overflow-hidden shrink-0">
          <img src="${imgSrc}" alt="${act.title}" class="h-full w-full object-contain bg-black/5">
          <div class="absolute top-2 right-2 bg-white/90 rounded-full w-10 h-10 flex items-center justify-center text-2xl shadow-lg">
            ${displaySymbol}
          </div>
          ${viewLargeBtnFront}
          ${editBtnFront}
        </div>

        <div class="p-2 sm:p-3 flex-1 flex flex-col ${suitClass} overflow-hidden">
          <h3 class="font-bold text-sm sm:text-base leading-tight text-slate-900 mb-1">${act.title}</h3>
          ${ctaHtml}
        </div>
      </div>
    </div>
  `
}
