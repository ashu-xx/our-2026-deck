export function renderCardView({
  act,
  imgUrl,
  suitMeta,
  isFlipped,
  suitClass,
  ctaHtml,
  monthLabel
}) {
  const { symbol, emoji, label } = suitMeta

  return `
    <div class="card-inner w-full h-full relative ${isFlipped}"
      style="--flip: ${isFlipped ? '180deg' : '0deg'}; --tx: 0px; --ty: 0px; --rot: 0deg;"
    >
      <!-- Back (playing card face-down) -->
      <div class="absolute inset-0 backface-hidden border-4 border-white rounded-3xl shadow-2xl overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div class="absolute inset-2 rounded-2xl border-2 border-white/30"></div>
        <div class="absolute inset-6 rounded-xl border border-white/15"></div>
        <div class="absolute inset-0 flex flex-col items-center justify-center text-white">
          <div class="text-6xl drop-shadow">${symbol}</div>
          <div class="mt-2 text-3xl">${emoji}</div>
          <div class="mt-4 px-4 py-2 bg-white/10 rounded-full backdrop-blur text-xs font-bold tracking-[0.3em] uppercase">${monthLabel}</div>
          <div class="mt-2 text-[11px] text-white/80 font-semibold">${label}</div>
          <div class="mt-6 text-[11px] text-white/70">Tap to reveal • Swipe to skip</div>
          <button class="edit-card-btn mt-4 px-4 py-2 bg-white/15 hover:bg-white/25 text-white text-xs font-bold rounded-full transition-all backdrop-blur">
            ✏️ Edit
          </button>
        </div>
      </div>

      <!-- Front (revealed activity) -->
      <div class="absolute inset-0 backface-hidden rotate-y-180 rounded-3xl overflow-hidden shadow-2xl bg-white border border-slate-200 flex flex-col">
        <div class="relative h-44 overflow-hidden">
          <img src="${imgUrl}" alt="${act.title}" class="h-full w-full object-cover">
          <div class="absolute top-2 right-2 bg-white/90 rounded-full w-10 h-10 flex items-center justify-center text-2xl shadow-lg">
            ${symbol}
          </div>
          <button class="edit-card-btn absolute bottom-2 right-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 text-[11px] font-bold rounded-full transition-all shadow-md">
            ✏️ Edit
          </button>
        </div>

        <div class="p-4 flex-1 flex flex-col ${suitClass}">
          <p class="text-[10px] uppercase tracking-[0.25em] text-slate-500 font-semibold">Weekend Activity</p>
          <h3 class="font-bold text-lg leading-tight text-slate-900 mb-1">${act.title}</h3>
          <p class="text-sm text-slate-700 leading-relaxed flex-1">${act.description || ''}</p>
          ${ctaHtml}
        </div>
      </div>
    </div>
  `
}
