import { localStorageDB } from './localStorage'
import { celebrateIfNeeded, fetchImageUrl, SUIT_META, toggleUsage } from './cardUtils'
import { createDeckCard } from './renderCard'
import { renderGiftShell } from './views/giftShell'
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
  async function refreshActivities() {
    if (isLocalDev) {
      activities = await localStorageDB.getActivities()
      activities.sort((a, b) => a.week_number - b.week_number)
    } else {
      const { data } = await supabase.from('activities').select('*').order('week_number', { ascending: true })
      activities = data || []
    }
  }

  await refreshActivities()

  const { deckEl, switchToYear } = renderGiftShell({
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
    onTabChange: (tab) => {
      const year = tab === 'past' ? pastYear : upcomingYear
      switchToYear(year)
      loadYear(year)
    }
  })

  let currentYear = upcomingYear

  async function loadYear(year) {
    currentYear = year
    deckEl.innerHTML = '<div class="col-span-full text-center"><div class="inline-block bg-white/90 px-8 py-4 rounded-full shadow-xl"><span class="text-gold animate-pulse text-xl font-script">Shuffling the deck... 🎴✨</span></div></div>'
    const filtered = activities.filter(a => a.deck_year === year)
    deckEl.innerHTML = ''

    const cards = await Promise.all(filtered.map((act, index) => createDeckCard(act, {
      year,
      pastYear,
      upcomingYear,
      isLocalDev,
      supabase,
      index,
      onEdit: async (id, updates) => {
        if (isLocalDev) {
          await localStorageDB.updateActivity(id, updates)
        } else {
          await supabase.from('activities').update(updates).eq('id', id)
        }
        await refreshActivities()
        loadYear(currentYear)
      },
      onToggle: async () => {
        await toggleUsage(act, isLocalDev, supabase)
        celebrateIfNeeded(act)
        await refreshActivities()
        loadYear(currentYear)
      },
      getSuitMeta: (suit) => SUIT_META[suit] || SUIT_META.default,
      fetchImageUrl: (activity) => fetchImageUrl(activity, isLocalDev, supabase)
    })))

    cards.forEach(card => deckEl.appendChild(card))

    const jokers = filtered.filter(a => a.suit === 'joker')
    if (jokers.length === 0 && year === 2026) {
      const jokerPrompt = document.createElement('div')
      jokerPrompt.className = 'col-span-full mt-8 text-center'
      jokerPrompt.innerHTML = `
        <div class="inline-block bg-white/90 px-8 py-6 rounded-2xl shadow-xl">
          <div class="text-5xl mb-3">🃏</div>
          <p class="font-script text-2xl text-gray-700">Don't forget to add your wild card adventures!</p>
        </div>
      `
      deckEl.appendChild(jokerPrompt)
    }
  }

  switchToYear(upcomingYear)
  loadYear(upcomingYear)
}