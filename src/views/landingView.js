export function renderLandingView({ pastYear, upcomingYear }) {
  return `
    <div class="min-h-screen bg-pattern relative overflow-hidden">
      <div class="fixed top-24 left-10 text-6xl animate-float opacity-20">🦋</div>
      <div class="fixed top-32 right-20 text-5xl animate-float-reverse opacity-20">🌸</div>
      <div class="fixed bottom-20 left-20 text-5xl animate-float opacity-20">🦊</div>
      <div class="fixed bottom-32 right-32 text-6xl animate-float-reverse opacity-20">🌺</div>
      <div class="fixed top-1/3 left-1/4 text-4xl animate-sparkle opacity-15">✨</div>
      <div class="fixed top-2/3 right-1/4 text-4xl animate-sparkle opacity-15">🎄</div>

      <main class="pt-20 px-6 pb-20 relative z-10">
        <div class="max-w-6xl mx-auto">
          <header class="text-center mb-10">
            <div class="text-7xl mb-3 animate-float">💝</div>
            <h1 class="font-festive text-6xl text-gold drop-shadow-2xl">Our Adventures Together</h1>
            <p class="font-script text-2xl text-white/90 mt-3">Pick a suit, then deal the deck 🎴</p>
            <p class="text-white/70 text-sm mt-2">${pastYear} memories are revealed • ${upcomingYear} plans start face-down</p>
          </header>

          <section class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <div class="surface-card p-6 text-center suit-hearts border-4 border-white">
              <div class="text-5xl mb-2">♥️</div>
              <div class="font-bold text-gray-800">Cultural & Social</div>
              <div class="text-xs text-gray-700 mt-2">Museums, dates, friends, food</div>
            </div>
            <div class="surface-card p-6 text-center suit-diamonds border-4 border-white">
              <div class="text-5xl mb-2">♦️</div>
              <div class="font-bold text-gray-800">Adventures & Exploration</div>
              <div class="text-xs text-gray-700 mt-2">Trips, new places, trying things</div>
            </div>
            <div class="surface-card p-6 text-center suit-clubs border-4 border-white">
              <div class="text-5xl mb-2">♣️</div>
              <div class="font-bold text-gray-800">Nature & Outdoors</div>
              <div class="text-xs text-gray-700 mt-2">Parks, hikes, gardens, sunshine</div>
            </div>
            <div class="surface-card p-6 text-center suit-spades border-4 border-white">
              <div class="text-5xl mb-2">♠️</div>
              <div class="font-bold text-gray-800">Cozy & Creative</div>
              <div class="text-xs text-gray-700 mt-2">Home nights, crafts, baking, movies</div>
            </div>
          </section>

          <section class="text-center">
            <button id="dealDeckBtn" class="btn btn-primary px-10 py-4 rounded-2xl shadow-2xl font-bold text-lg transform hover:scale-[1.02]">
              Deal the Deck 🎴
            </button>
            <div class="mt-6 flex justify-center">
              <div class="relative w-40 h-56">
                <div class="absolute inset-0 rounded-2xl border-4 border-white shadow-2xl bg-linear-to-br from-xmas-red/90 via-rose-600 to-xmas-green/90 -rotate-6"></div>
                <div class="absolute inset-0 rounded-2xl border-4 border-white shadow-2xl bg-linear-to-br from-xmas-red/90 via-rose-600 to-xmas-green/90 rotate-6 translate-x-2 translate-y-2 opacity-90"></div>
                <div class="absolute inset-0 rounded-2xl border-4 border-white shadow-2xl bg-linear-to-br from-xmas-red/90 via-rose-600 to-xmas-green/90 translate-x-4 translate-y-4 opacity-80"></div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  `
}
