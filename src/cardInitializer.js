import { localStorageDB } from './localStorage'

// Initialize cards for a year
export function initializeYearCards(year) {
  const suits = ['hearts', 'diamonds', 'clubs', 'spades']
  const cardsPerSuit = 13 // 52 cards / 4 suits = 13 cards per suit

  const cards = []

  // Create 52 regular cards
  for (let week = 1; week <= 52; week++) {
    const suitIndex = Math.floor((week - 1) / cardsPerSuit)
    const suit = suits[suitIndex] || suits[0]

    const planned_date = new Date(year, 0, 1 + (week - 1) * 7).toISOString().slice(0, 10)

    cards.push({
      title: `Planned for ${planned_date}`,
      description: '',
      suit,
      deck_year: year,
      week_number: week,
      planned_date,
      image_path: null,
      is_used: false,
      created_at: new Date().toISOString()
    })
  }

  // Create 2 joker cards (week 53 and 54)
  cards.push(
    {
      title: 'Joker 1',
      description: 'Wild card adventure!',
      suit: 'joker',
      deck_year: year,
      week_number: 53,
      planned_date: new Date(year, 11, 20).toISOString().slice(0, 10),
      image_path: null,
      is_used: false,
      created_at: new Date().toISOString()
    },
    {
      title: 'Joker 2',
      description: 'Another wild card adventure!',
      suit: 'joker',
      deck_year: year,
      week_number: 54,
      planned_date: new Date(year, 11, 27).toISOString().slice(0, 10),
      image_path: null,
      is_used: false,
      created_at: new Date().toISOString()
    }
  )

  return cards
}

// Check if year needs initialization
export async function checkAndInitializeYear(year, supabase, isLocalDev) {
  let existingCards

  if (isLocalDev) {
    const allActivities = await localStorageDB.getActivities()
    existingCards = allActivities.filter(a => a.deck_year === year)
  } else {
    const { data } = await supabase.from('activities')
      .select('*')
      .eq('deck_year', year)
    existingCards = data || []
  }

  // If year has less than 54 cards, initialize missing ones
  if (existingCards.length < 54) {
    const newCards = initializeYearCards(year)

    // Filter out weeks that already exist
    const existingWeeks = new Set(existingCards.map(c => c.week_number))
    const cardsToAdd = newCards.filter(c => !existingWeeks.has(c.week_number))

    if (cardsToAdd.length > 0) {
      if (isLocalDev) {
        for (const card of cardsToAdd) {
          await localStorageDB.insertActivity(card)
        }
      } else {
        await supabase.from('activities').insert(cardsToAdd)
      }
    }
  }

  // Backfill planned_date for existing cards that don't have it yet
  const missingPlannedDate = existingCards.filter(c => !c.planned_date && c.week_number)
  if (missingPlannedDate.length > 0) {
    for (const c of missingPlannedDate) {
      const planned_date = c.suit === 'joker'
        ? new Date(year, 11, c.week_number === 53 ? 20 : 27).toISOString().slice(0, 10)
        : new Date(year, 0, 1 + (c.week_number - 1) * 7).toISOString().slice(0, 10)

      if (isLocalDev) {
        await localStorageDB.updateActivity(c.id, { planned_date })
      } else {
        await supabase.from('activities').update({ planned_date }).eq('id', c.id)
      }
    }
  }
}

// Get year configuration
export function getYearConfig() {
  const currentYear = new Date().getFullYear()

  // At any point in time:
  // - pastYear is the current calendar year
  // - upcomingYear is the next calendar year
  const pastYear = currentYear
  const upcomingYear = currentYear + 1

  return {
    pastYear,
    upcomingYear,
    currentYear,
    availableYears: [pastYear - 1, pastYear, upcomingYear, upcomingYear + 1]
  }
}
