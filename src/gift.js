import { celebrateIfNeeded, fetchImageUrl, getSuitMeta, toggleUsage } from './cardUtils'
import { createDeckCard } from './renderCard'
import { renderGiftShell } from './views/giftShell'
import { renderMonthView } from './views/monthView'
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

function monthIndexOrDefault(act) {
  const d = parseLocalDate(act.planned_date)
  if (d) return d.getMonth()
  return 11
}

function randomSuit() {
  const suits = ['\u2665', '\u2666', '\u2663', '\u2660']
  return suits[Math.floor(Math.random() * suits.length)]
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
      await renderMonthWise()
    }
  })

  let currentYear = upcomingYear

  async function renderMonthWise() {
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

    const monthBuckets = new Map()
    for (const act of filtered) {
      const monthIndex = monthIndexOrDefault(act)
      if (!monthBuckets.has(monthIndex)) monthBuckets.set(monthIndex, [])
      monthBuckets.get(monthIndex).push(act)
    }

    const sortedMonths = [...monthBuckets.keys()].sort((a, b) => a - b)

    deckEl.innerHTML = ''

    for (const monthIndex of sortedMonths) {
      const sectionWrapper = document.createElement('div')
      sectionWrapper.innerHTML = renderMonthView({ year: currentYear, monthIndex })
      const section = sectionWrapper.firstElementChild
      const grid = section.querySelector('[data-month-grid]')

      const label = new Date(currentYear, monthIndex, 1)
        .toLocaleString(undefined, { month: 'long' })
        .toUpperCase()

      const acts = monthBuckets.get(monthIndex)

      const nodes = await Promise.all(acts.map((act, index) => {
        const cardCtx = {
          isLocalDev,
          index,
          monthLabel: label,
          onEdit: async (id, updates) => {
            // Merge updates with current activity data
            const updatedActivity = { ...act, ...updates, id, updated_at: new Date().toISOString() }
            await dataStore.updateActivity(updatedActivity, isLocalDev)
            await renderMonthWise()
          },
          onToggle: async () => {
            await toggleUsage(act, isLocalDev)
            celebrateIfNeeded(act)
            await renderMonthWise()
          },
          getSuitMeta,
          fetchImageUrl: (activity) => fetchImageUrl(activity, isLocalDev)
        }

        return createDeckCard(act, cardCtx)
      }))

      nodes.forEach(n => grid.appendChild(n))
      deckEl.appendChild(section)
    }
  }

  setYearActive(currentYear)
  await renderMonthWise()
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