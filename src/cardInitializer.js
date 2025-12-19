import { dataStore } from './dataStore'

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

  // Create 2 joker cards (default: one summer, one December)
  cards.push(
    {
      title: 'Joker 1',
      description: 'Wild card adventure!',
      suit: 'joker',
      deck_year: year,
      week_number: 53,
      planned_date: new Date(year, 6, 5).toISOString().slice(0, 10),
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
      planned_date: new Date(year, 11, 15).toISOString().slice(0, 10),
      image_path: null,
      is_used: false,
      created_at: new Date().toISOString()
    }
  )

  return cards
}

function computePlannedDate(year, card) {
  if (card.suit === 'joker') {
    const d = card.week_number === 53 ? new Date(year, 6, 5) : new Date(year, 11, 15)
    return d.toISOString().slice(0, 10)
  }

  return new Date(year, 0, 1 + (card.week_number - 1) * 7).toISOString().slice(0, 10)
}

async function ensureYearCards({ year, existingCards, isLocalDev }) {
  if (existingCards.length >= 54) return

  const newCards = initializeYearCards(year)
  const existingWeeks = new Set(existingCards.map(c => c.week_number))
  const cardsToAdd = newCards.filter(c => !existingWeeks.has(c.week_number))
  if (cardsToAdd.length === 0) return

  await dataStore.insertActivities(cardsToAdd, isLocalDev)
}

async function backfillPlannedDates({ year, cards, isLocalDev }) {
  const missing = cards.filter(c => !c.planned_date && c.week_number)
  if (missing.length === 0) return

  for (const c of missing) {
    const planned_date = computePlannedDate(year, c)
    await dataStore.updateActivity(c.id, { planned_date }, isLocalDev)
  }
}

// Check if year needs initialization
export async function checkAndInitializeYear(year, isLocalDev) {
  let allActivities = await dataStore.listActivities(isLocalDev)
  let existingCards = allActivities.filter(a => a.deck_year === year)

  await ensureYearCards({ year, existingCards, isLocalDev })

  // Re-fetch after potential inserts so the caller sees the newly created cards.
  allActivities = await dataStore.listActivities(isLocalDev)
  existingCards = allActivities.filter(a => a.deck_year === year)

  await backfillPlannedDates({ year, cards: existingCards, isLocalDev })
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
