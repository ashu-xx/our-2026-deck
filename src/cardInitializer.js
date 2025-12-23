import { dataStore } from './dataStore'

// Generate a unique random ID for activities
function generateActivityId() {
  return `activity-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`
}

function isoDateForWeek(year, week) {
  return new Date(year, 0, 1 + (week - 1) * 7).toISOString().slice(0, 10)
}

// Initialize cards for a year
export function initializeYearCards(year) {
  const suits = ['hearts', 'diamonds', 'clubs', 'spades']
  const cardsPerSuit = 13 // 52 cards / 4 suits = 13 cards per suit

  const now = new Date().toISOString()
  const cards = []

  // Create 52 regular cards
  for (let week = 1; week <= 52; week++) {
    const suitIndex = Math.floor((week - 1) / cardsPerSuit)
    const suit = suits[suitIndex] || suits[0]

    const planned_date = isoDateForWeek(year, week)

    cards.push({
      id: generateActivityId(),
      title: `Planned for ${planned_date}`,
      description: '',
      suit,
      deck_year: year,
      planned_date,
      image_path: null,
      is_used: false,
      created_at: now,
      updated_at: now
    })
  }

  // Create 2 joker cards and place them randomly in any suit
  const randomSuit = () => suits[Math.floor(Math.random() * suits.length)]
  const randomWeek1 = Math.floor(Math.random() * 52) + 1
  const randomWeek2 = Math.floor(Math.random() * 52) + 1

  cards.push(
    {
      id: generateActivityId(),
      title: 'Joker 1',
      description: 'Wild card adventure!',
      suit: randomSuit(),
      deck_year: year,
      planned_date: isoDateForWeek(year, randomWeek1),
      image_path: null,
      is_used: false,
      created_at: now,
      updated_at: now
    },
    {
      id: generateActivityId(),
      title: 'Joker 2',
      description: 'Another wild card adventure!',
      suit: randomSuit(),
      deck_year: year,
      planned_date: isoDateForWeek(year, randomWeek2),
      image_path: null,
      is_used: false,
      created_at: now,
      updated_at: now
    }
  )

  return cards
}

// Check if year needs initialization
export async function checkAndInitializeYear(year, isLocalDev) {
  const allActivities = await dataStore.listActivities(isLocalDev)
  const existingCards = allActivities.filter(a => a.deck_year === year)

  // Only initialize when the year has no cards at all.
  if (existingCards.length > 0) return

  const cards = initializeYearCards(year)
  await dataStore.insertActivities(cards, isLocalDev)
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
