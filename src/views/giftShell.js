import { renderTopBar } from './topBar'

export function renderGiftShell({ app, pastYear, upcomingYear, userEmail, onLogout, onYearChange }) {
  app.innerHTML = `
    <div class="min-h-screen bg-pattern pb-20 relative overflow-hidden">
      ${renderTopBar({ userEmail })}

      <div class="fixed top-24 left-10 text-6xl animate-float opacity-20">🦙</div>
      <div class="fixed top-32 right-20 text-5xl animate-float-reverse opacity-20">🌹</div>
      <div class="fixed bottom-20 left-20 text-5xl animate-float opacity-20">🎅</div>
      <div class="fixed bottom-32 right-32 text-6xl animate-float-reverse opacity-20">🌺</div>
      <div class="fixed top-1/3 left-1/4 text-4xl animate-sparkle opacity-15">✨</div>
      <div class="fixed top-2/3 right-1/4 text-4xl animate-sparkle opacity-15">🎄</div>

      <header class="pt-24 p-10 text-center relative z-10">
        <div class="mb-4 text-6xl animate-float">💝</div>
        <h1 class="font-festive text-6xl text-gold mb-2 drop-shadow-2xl">Our Adventures Together</h1>
        <p class="font-script text-2xl text-white/90 mb-6">A year of dates, surprises, and memories ✨</p>

        <div class="flex justify-center bg-white/20 p-1.5 rounded-full w-fit mx-auto backdrop-blur-md shadow-2xl border-2 border-white/30">
          <button id="btnPast" class="tab-pill">${pastYear} Memories</button>
          <button id="btnUpcoming" class="tab-pill tab-pill-active">${upcomingYear} Plans</button>
        </div>
      </header>

      <div id="deck" class="px-6 relative z-10"></div>
    </div>`

  app.querySelector('#logoutBtn').onclick = onLogout

  const btnPast = app.querySelector('#btnPast')
  const btnUpcoming = app.querySelector('#btnUpcoming')

  btnPast.onclick = () => {
    setActive(btnPast, btnUpcoming)
    onYearChange(pastYear)
  }

  btnUpcoming.onclick = () => {
    setActive(btnUpcoming, btnPast)
    onYearChange(upcomingYear)
  }

  return {
    deckEl: app.querySelector('#deck'),
    setYearActive: (year) => {
      if (year === pastYear) setActive(btnPast, btnUpcoming)
      else setActive(btnUpcoming, btnPast)
    }
  }
}

function setActive(active, inactive) {
  active.classList.add('tab-pill-active')
  inactive.classList.remove('tab-pill-active')
}
