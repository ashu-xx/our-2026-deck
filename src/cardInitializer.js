import { dataStore } from './dataStore'

// Generate a unique random ID for activities
function generateActivityId() {
  return `activity-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`
}

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
      id: generateActivityId(),
      title: `Planned for ${planned_date}`,
      description: '',
      suit,
      deck_year: year,
      planned_date,
      image_path: null,
      is_used: false,
      created_at: new Date().toISOString()
    })
  }

  // Create 2 joker cards (default: one summer, one December)
  cards.push(
    {
      id: generateActivityId(),
      title: 'Joker 1',
      description: 'Wild card adventure!',
      suit: 'joker',
      deck_year: year,
      planned_date: new Date(year, 6, 5).toISOString().slice(0, 10),
      image_path: null,
      is_used: false,
      created_at: new Date().toISOString()
    },
    {
      id: generateActivityId(),
      title: 'Joker 2',
      description: 'Another wild card adventure!',
      suit: 'joker',
      deck_year: year,
      planned_date: new Date(year, 11, 15).toISOString().slice(0, 10),
      image_path: null,
      is_used: false,
      created_at: new Date().toISOString()
    }
  )

  return cards
}

async function ensureYearCards({ year, existingCards, isLocalDev }) {
  if (existingCards.length >= 54) return

  const newCards = initializeYearCards(year)
  const existingDates = new Set(existingCards.map(c => c.planned_date))
  const cardsToAdd = newCards.filter(c => !existingDates.has(c.planned_date))
  if (cardsToAdd.length === 0) return

  await dataStore.insertActivities(cardsToAdd, isLocalDev)
}

// Check if year needs initialization
export async function checkAndInitializeYear(year, isLocalDev) {
  const allActivities = await dataStore.listActivities(isLocalDev)
  const existingCards = allActivities.filter(a => a.deck_year === year)

  await ensureYearCards({ year, existingCards, isLocalDev })
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

