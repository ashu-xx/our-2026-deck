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
    <div class="card-inner w-full h-full relative transition-transform duration-700 transform-style-3d ${isFlipped}">
      <!-- Back (playing card face-down style) -->
      <div class="absolute inset-0 backface-hidden border-4 border-white rounded-2xl shadow-2xl overflow-hidden bg-gradient-to-br from-xmas-red/90 via-rose-600 to-xmas-green/90">
        <div class="absolute inset-2 rounded-xl border-2 border-white/60"></div>
        <div class="absolute inset-6 rounded-lg border border-white/40"></div>
        <div class="absolute inset-0 flex flex-col items-center justify-center text-white">
          <div class="text-6xl drop-shadow">${symbol}</div>
          <div class="mt-3 text-3xl">${emoji}</div>
          <div class="mt-4 px-4 py-2 bg-white/15 rounded-full backdrop-blur text-xs font-bold tracking-[0.3em] uppercase">${monthLabel}</div>
          <div class="mt-2 text-xs text-white/80 font-semibold">${label}</div>
          <button class="edit-card-btn mt-5 px-4 py-2 bg-white/20 hover:bg-white/30 text-white text-xs font-bold rounded-full transition-all backdrop-blur">
            ✏️ Edit
          </button>
        </div>
      </div>

      <!-- Front (details, only meaningful when card is flipped / done) -->
      <div class="absolute inset-0 backface-hidden rotate-y-180 bg-white rounded-2xl border-4 border-white overflow-hidden flex flex-col shadow-2xl">
        <div class="relative h-40 overflow-hidden">
          <img src="${imgUrl}" alt="${act.title}" class="h-full w-full object-cover">
          <div class="absolute top-2 right-2 bg-white/90 rounded-full w-10 h-10 flex items-center justify-center text-2xl shadow-lg">
            ${symbol}
          </div>
          <button class="edit-card-btn absolute bottom-2 right-2 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 text-xs font-bold rounded-full transition-all shadow-md">
            ✏️ Edit
          </button>
        </div>

        <div class="p-4 flex-1 flex flex-col ${suitClass}">
          <h3 class="font-bold text-base leading-tight text-gray-800 mb-2">${act.title}</h3>
          <p class="text-xs text-gray-700 leading-relaxed flex-1">${act.description || ''}</p>
          ${ctaHtml}
        </div>
      </div>
    </div>
  `
}
