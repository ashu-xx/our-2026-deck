import { localStorageDB } from './localStorage'
import { celebrateIfNeeded, fetchImageUrl, SUIT_META, toggleUsage } from './cardUtils'
import { createDeckCard } from './renderCard'
import { renderGiftShell } from './views/giftShell'
import { renderMonthView } from './views/monthView'
import { checkAndInitializeYear, getYearConfig } from './cardInitializer'

export async function renderGiftView(app, supabase) {
  const isLocalDev = import.meta.env.VITE_LOCAL_DEV_MODE === 'true'
  if (!isLocalDev && !supabase) {
    app.innerHTML = '<div class="p-8 text-center text-white">Supabase is not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.</div>'
    return
  }

  const yearConfig = getYearConfig()
  const { pastYear, upcomingYear } = yearConfig

  await checkAndInitializeYear(pastYear, supabase, isLocalDev)
  await checkAndInitializeYear(upcomingYear, supabase, isLocalDev)

  let userEmail
  if (isLocalDev) {
    const localUser = JSON.parse(localStorage.getItem('localDevUser'))
    userEmail = localUser?.email || 'Guest'
  } else {
    const { data: { user } } = await supabase.auth.getUser()
    userEmail = user?.email || 'Guest'
  }

  let activities = []

  // Helpers: prefer planned_date only
  function dateKeyOrDefault(act) {
    const t = Date.parse(act.planned_date)
    if (Number.isFinite(t)) return t
    return Date.parse(`${act.deck_year}-12-01`)
  }

  function monthIndexOrDefault(act) {
    const t = Date.parse(act.planned_date)
    if (Number.isFinite(t)) return new Date(t).getMonth()
    return 11
  }

  async function refreshActivities() {
    if (isLocalDev) {
      activities = await localStorageDB.getActivities()
    } else {
      const { data } = await supabase.from('activities').select('*')
      activities = data || []
    }

    // Ensure every activity has a planned_date (defensive, should already be backfilled)
    activities = activities.map(a => ({
      ...a,
      planned_date: a.planned_date || `${a.deck_year}-12-01`
    }))

    // Past-year cards are treated as completed/revealed
    activities = activities.map(a => (a.deck_year === pastYear ? { ...a, is_used: true } : a))

    activities.sort((a, b) => dateKeyOrDefault(a) - dateKeyOrDefault(b))
  }

  // IMPORTANT: actually fetch activities before first render
  await refreshActivities()

  const { deckEl, setYearActive } = renderGiftShell({
    app,
    pastYear,
    upcomingYear,
    userEmail,
    onLogout: () => {
      if (isLocalDev) {
        localStorage.removeItem('localDevUser')
        location.reload()
      } else {
        supabase.auth.signOut().then(() => location.reload())
      }
    },
    onYearChange: async (nextYear) => {
      currentYear = nextYear
      setYearActive(currentYear)
      await renderMonthWise()
    }
  })

  let currentYear = upcomingYear

  function monthNameFromIso(iso) {
    const t = Date.parse(iso)
    const d = Number.isFinite(t) ? new Date(t) : new Date(currentYear, 11, 1)
    return d.toLocaleString(undefined, { month: 'long' }).toUpperCase()
  }

  function getMonthIndex(act) {
    return monthIndexOrDefault(act)
  }

  async function renderMonthWise() {
    await refreshActivities()

    const filtered = activities.filter(a => a.deck_year === currentYear)

    const monthBuckets = new Map()
    for (const act of filtered) {
      const monthIndex = act.suit === 'joker' ? 11 : getMonthIndex(act)
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

      const acts = monthBuckets.get(monthIndex)
      const label = monthNameFromIso(acts.find(a => a.planned_date)?.planned_date || `${currentYear}-12-01`)

      const nodes = await Promise.all(acts.map((act, index) => createDeckCard(act, {
        isLocalDev,
        supabase,
        index,
        monthLabel: label,
        onEdit: async (id, updates) => {
          if (isLocalDev) {
            await localStorageDB.updateActivity(id, updates)
          } else {
            await supabase.from('activities').update(updates).eq('id', id)
          }
          await renderMonthWise()
        },
        onToggle: async () => {
          await toggleUsage(act, isLocalDev, supabase)
          celebrateIfNeeded(act)
          await renderMonthWise()
        },
        getSuitMeta: (suit) => SUIT_META[suit] || SUIT_META.default,
        fetchImageUrl: (activity) => fetchImageUrl(activity, isLocalDev, supabase)
      })))

      nodes.forEach(n => grid.appendChild(n))
      deckEl.appendChild(section)
    }
  }

  setYearActive(currentYear)
  await renderMonthWise()
}