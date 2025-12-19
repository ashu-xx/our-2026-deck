export function renderCardView({
  act,
  imgUrl,
  suitMeta,
  isFlipped,
  suitClass,
  ctaHtml
}) {
  const { symbol, emoji, label } = suitMeta

  return `
    <div class="card-inner w-full h-full relative transition-transform duration-700 transform-style-3d ${isFlipped}">
      <div class="absolute inset-0 backface-hidden ${suitClass} border-4 border-white rounded-2xl flex flex-col items-center justify-center shadow-2xl p-4">
        <div class="text-7xl mb-3">${symbol}</div>
        <div class="text-5xl mb-2">${emoji}</div>
        <div class="mt-4 px-4 py-2 bg-white/80 rounded-full shadow-inner">
          <span class="text-gray-700 font-bold text-xs tracking-widest">WEEK ${act.week_number}</span>
        </div>
        <div class="mt-3 text-xs text-gray-600 font-semibold">${label}</div>
        <button class="edit-card-btn mt-4 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-xs font-bold rounded-full transition-all shadow-md">
          ✏️ Edit
        </button>
      </div>

      <div class="absolute inset-0 backface-hidden rotate-y-180 bg-white rounded-2xl border-4 border-white overflow-hidden flex flex-col shadow-2xl">
        <div class="relative h-40 overflow-hidden">
          <img src="${imgUrl}" alt="${act.title}" class="h-full w-full object-cover">
          <div class="absolute top-2 right-2 bg-white/90 rounded-full w-10 h-10 flex items-center justify-center text-2xl shadow-lg">
            ${symbol}
          </div>
          <div class="absolute top-2 left-2 bg-white/90 px-3 py-1 rounded-full text-xs font-bold text-gray-700 shadow-lg">
            Week ${act.week_number}
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
