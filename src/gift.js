import { celebrateIfNeeded, fetchImageUrl, getSuitMeta, toggleUsage } from './cardUtils'
import { createDeckCard } from './renderCard'
import { renderGiftShell } from './views/giftShell'
import { renderPileView } from './views/pileView'
import { renderLandingView } from './views/landingView'
import { checkAndInitializeYear, getYearConfig } from './cardInitializer'
import { dataStore } from './dataStore'
import { appBackend } from './appBackend'
import { renderDealingOverlay } from './views/dealingOverlay'

function parseLocalDate(isoDate) {
  if (!isoDate) return null
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(isoDate)
  if (!m) return null
  const year = Number(m[1])
  const month = Number(m[2]) - 1
  const day = Number(m[3])
  const d = new Date(year, month, day)
  return Number.isNaN(d.getTime()) ? null : d
}

function dateKeyOrDefault(act) {
  const d = parseLocalDate(act.planned_date)
  if (d) return d.getTime()
  return new Date(act.deck_year, 11, 1).getTime()
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function runDealFlow({ app, isLocalDev, pastYear, upcomingYear }) {
  await checkAndInitializeYear(pastYear, isLocalDev)
  await checkAndInitializeYear(upcomingYear, isLocalDev)

  const userEmail = appBackend.getCurrentUserEmail(isLocalDev)

  let activities = []

  async function refreshActivities() {
    activities = await dataStore.listActivities(isLocalDev)

    activities = activities.map(a => ({
      ...a,
      planned_date: a.planned_date || `${a.deck_year}-12-01`
    }))

    activities = activities.map(a => (a.deck_year === pastYear ? { ...a, is_used: true } : a))

    activities.sort((a, b) => dateKeyOrDefault(a) - dateKeyOrDefault(b))
  }

  await refreshActivities()

  const { deckEl, setYearActive } = renderGiftShell({
    app,
    pastYear,
    upcomingYear,
    userEmail,
    onLogout: () => {
      appBackend.logout(isLocalDev)
      location.reload()
    },
    onYearChange: async (nextYear) => {
      currentYear = nextYear
      setYearActive(currentYear)
      await renderPiles()
    }
  })

  let currentYear = upcomingYear

  /**
   * How many cards have been *dealt* from each suit (monotonic counter).
   * We convert this to a current index via modulo to create a circular loop.
   */
  let dealtCardCounts = {} // { [suit]: number }

  async function renderPiles() {
    await refreshActivities()

    const filtered = activities.filter(a => a.deck_year === currentYear)

    if (filtered.length === 0) {
      deckEl.innerHTML = `
        <div class="max-w-3xl mx-auto mt-10 surface-card p-6 text-center border-2 border-white/20">
          <h3 class="font-bold text-xl text-white">No cards found for ${currentYear}</h3>
          <p class="text-white/70 mt-2 text-sm">Your deck is empty for this year.</p>
        </div>
      `
      return
    }

    const suits = ['hearts', 'diamonds', 'clubs', 'spades']

    const suitBuckets = Object.fromEntries(suits.map(s => [s, []]))
    for (const act of filtered) {
      if (suitBuckets[act.suit]) suitBuckets[act.suit].push(act)
    }
    for (const suit of suits) {
      suitBuckets[suit].sort((a, b) => dateKeyOrDefault(a) - dateKeyOrDefault(b))
    }

    if (Object.keys(dealtCardCounts).length === 0) {
      for (const suit of suits) dealtCardCounts[suit] = 0
    }

    const piles = suits.map((suit) => {
      const cards = suitBuckets[suit]
      const dealt = dealtCardCounts[suit] || 0
      const total = cards.length

      return {
        suit,
        suitMeta: getSuitMeta(suit),
        total,
        revealed: dealt,
        remaining: total,
        cards
      }
    })

    deckEl.innerHTML = renderPileView({ piles })

    for (const pile of piles) {
      const container = deckEl.querySelector(`[data-pile-cards="${pile.suit}"]`)
      if (!container) continue

      const total = pile.cards.length
      if (total === 0) continue

      const dealt = dealtCardCounts[pile.suit] || 0
      if (dealt <= 0) continue

      const currentIdx = (dealt - 1) % total
      const currentCard = pile.cards[currentIdx]
      if (!currentCard) continue

      const cardNode = await createDeckCard(currentCard, {
        isLocalDev,
        index: 0,
        monthLabel: pile.suitMeta.label,
        onEdit: async (id, updates) => {
          const updatedActivity = { ...currentCard, ...updates, id, updated_at: new Date().toISOString() }
          await dataStore.updateActivity(updatedActivity, isLocalDev)
          await renderPiles()
        },
        onToggle: async () => {
          await toggleUsage(currentCard, isLocalDev)
          celebrateIfNeeded(currentCard)
          await renderPiles()
        },
        getSuitMeta,
        fetchImageUrl: (activity) => fetchImageUrl(activity, isLocalDev)
      })

      container.appendChild(cardNode)
    }


    const dealBtn = deckEl.querySelector('#dealCardsBtn')
    if (dealBtn) dealBtn.onclick = dealNextFour
  }

  async function dealNextFour() {
    const suits = ['hearts', 'diamonds', 'clubs', 'spades']

    // Keep ordering stable
    await refreshActivities()

    // Advance each suit by 1 (circular)
    for (const suit of suits) {
      const total = activities.filter(a => a.deck_year === currentYear && a.suit === suit).length
      if (total <= 0) continue
      dealtCardCounts[suit] = (dealtCardCounts[suit] || 0) + 1
    }

    await renderPiles()
  }

  setYearActive(currentYear)
  await renderPiles()
}

export async function renderGiftView(app) {
  const isLocalDev = import.meta.env.VITE_LOCAL_DEV_MODE === 'true'

  const yearConfig = getYearConfig()
  const { pastYear, upcomingYear } = yearConfig

  const userEmail = appBackend.getCurrentUserEmail(isLocalDev)

  // Landing screen first (no data fetch required)
  app.innerHTML = renderLandingView({ pastYear, upcomingYear, userEmail })

  const logoutBtn = app.querySelector('#logoutBtn')
  if (logoutBtn) {
    logoutBtn.onclick = () => {
      appBackend.logout(isLocalDev)
      location.reload()
    }
  }

  // Proceed to load actual deck view when user clicks "Deal"
  const dealBtn = app.querySelector('#dealDeckBtn')
  if (!dealBtn) return

  dealBtn.onclick = async () => {
    const overlay = document.createElement('div')
    overlay.innerHTML = renderDealingOverlay()
    document.body.appendChild(overlay.firstElementChild)

    const minOverlayMs = 2000
    const startedAt = Date.now()

    try {
      await runDealFlow({ app, isLocalDev, pastYear, upcomingYear })

      const elapsed = Date.now() - startedAt
      if (elapsed < minOverlayMs) await sleep(minOverlayMs - elapsed)
    } finally {
      document.querySelector('[data-dealing-overlay]')?.remove()
    }
  }
}