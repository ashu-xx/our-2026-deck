/**
 * Renders the 4-pile deck view where each suit has its own pile
 * Users press "Deal" to reveal the next 4 cards (one from each pile)
 */
export function renderPileView({ piles }) {
  return `
    <div class="max-w-7xl mx-auto px-4 py-8">
      <!-- Deal Button at top -->
      <div class="text-center mb-8">
        <button id="dealCardsBtn" class="btn-primary px-12 py-5 rounded-2xl shadow-2xl font-bold text-xl transform hover:scale-105 transition-all">
          🎴 Deal
        </button>
        <p class="text-white/70 text-sm mt-3">Reveals the next card from each pile</p>
      </div>

      <!-- 4 Piles side by side -->
      <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
        ${piles.map(pile => `
          <div class="pile-container" data-pile="${pile.suit}">
            <div class="text-center mb-4">
              <div class="text-5xl mb-2">${pile.suitMeta.symbol}</div>
              <h3 class="font-festive text-2xl text-gold drop-shadow">${pile.suitMeta.label}</h3>
              <p class="text-white/60 text-xs mt-1">Card ${(pile.total > 0 ? ((pile.revealed % pile.total) || pile.total) : 0)} of ${pile.total}</p>
            </div>

            <!-- Pile visualization: stacked cards -->
            <div class="relative mx-auto" style="width: 280px; height: 400px;">
              <!-- Card back pile (visual only) -->
              ${pile.total > 0 ? `
                <div class="absolute inset-0 card-pile-stack">
                  ${new Array(5).fill(0).map((_, i) => `
                    <div class="absolute rounded-2xl border-4 border-white shadow-xl bg-linear-to-br from-slate-900 via-slate-800 to-slate-900"
                         style="top: ${i * 2}px; left: ${i * 2}px; right: ${-i * 2}px; bottom: ${-i * 2}px; z-index: ${5 - i};">
                      <div class="absolute inset-2 rounded-xl border-2 border-white/30"></div>
                      <div class="absolute inset-0 flex items-center justify-center">
                        <div class="text-6xl text-white/50">${pile.suitMeta.symbol}</div>
                      </div>
                    </div>
                  `).join('')}
                </div>
              ` : `
                <div class="absolute inset-0 rounded-2xl border-4 border-dashed border-white/30 flex items-center justify-center">
                  <div class="text-center text-white/50">
                    <div class="text-sm font-semibold">No cards</div>
                  </div>
                </div>
              `}

              <!-- Current top card container -->
              <div data-pile-cards="${pile.suit}" class="relative z-10"></div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `
}
