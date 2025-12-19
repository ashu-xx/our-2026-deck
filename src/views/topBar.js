export function renderTopBar({ userEmail, title = 'Our 2026 Deck', subtitle = 'Adventures Together' }) {
  const safeUser = userEmail || 'Guest'
  const initial = safeUser.charAt(0).toUpperCase()
  const label = safeUser.split('@')[0]

  return `
    <nav class="sticky top-0 z-50 surface-glass-nav">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center space-x-3">
            <span class="text-3xl animate-float">💝</span>
            <div>
              <h2 class="font-festive text-xl text-gold">${title}</h2>
              <p class="text-white/70 text-xs font-script">${subtitle}</p>
            </div>
          </div>
          <div class="flex items-center space-x-4">
            <div class="hidden sm:flex items-center space-x-3 bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm">
              <div class="w-8 h-8 bg-linear-to-br from-yellow-400 to-gold rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                ${initial}
              </div>
              <div class="flex flex-col">
                <span class="text-white text-sm font-medium">${label}</span>
              </div>
            </div>
            <button id="logoutBtn" class="btn btn-danger btn-pill hover:shadow-xl transform hover:scale-105 flex items-center space-x-2">
              <span>🚪</span>
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  `
}
