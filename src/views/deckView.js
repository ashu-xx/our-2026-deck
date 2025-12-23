export function renderDeckView({ suit, suitMeta }) {
  return `
    <section class="mt-10">
      <div class="flex items-center justify-between mb-6 px-2">
        <div class="flex items-center gap-4">
          <div class="text-6xl">${suitMeta.symbol}</div>
          <div>
            <h2 class="font-festive text-4xl text-gold drop-shadow">${suitMeta.label}</h2>
            <p class="text-white/60 text-sm mt-1">${suitMeta.emoji} Complete a card to reveal the next one</p>
          </div>
        </div>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 sm:gap-6 px-2 sm:px-0" data-suit-grid="${suit}"></div>
    </section>
  `
}

