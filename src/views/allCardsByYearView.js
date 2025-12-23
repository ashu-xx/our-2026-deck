import { celebrateIfNeeded, fetchImageUrl, getSuitMeta, toggleUsage } from '../cardUtils'
import { createDeckCard } from '../renderCard'
import { dataStore } from '../dataStore'

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

/**
 * Hidden view: renders ALL cards for a given year.
 * Meant to be accessed only via direct URL.
 *
 * @param {{ app: HTMLElement, year: number, isLocalDev: boolean }} params
 */
export async function renderAllCardsByYearView({ app, year, isLocalDev }) {
  app.innerHTML = `
    <div class="min-h-screen bg-pattern pb-20 relative overflow-hidden">
      <header class="pt-10 px-6 text-center">
        <h1 class="font-festive text-5xl text-gold drop-shadow-2xl">All Cards — ${year}</h1>
        <p class="text-white/70 text-sm mt-2">Hidden view (direct URL only)</p>
        <p class="text-white/60 text-xs mt-2">Tip: go back to <code class="bg-white/10 px-2 py-1 rounded">/</code> for the normal experience</p>
      </header>
      <main class="px-6 mt-8">
        <div id="allCardsGrid" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 sm:gap-6"></div>
      </main>
    </div>
  `

  const grid = app.querySelector('#allCardsGrid')
  if (!grid) return

  const all = await dataStore.listActivities(isLocalDev)
  const cards = all
    .filter(a => a.deck_year === year)
    .sort((a, b) => dateKeyOrDefault(a) - dateKeyOrDefault(b))

  if (cards.length === 0) {
    grid.innerHTML = `
      <div class="col-span-full max-w-2xl mx-auto surface-card p-6 text-center border-2 border-white/20">
        <h3 class="font-bold text-xl text-slate-900">No cards found for ${year}</h3>
      </div>
    `
    return
  }

  const nodes = await Promise.all(cards.map(async (act, index) => {
    const node = await createDeckCard(act, {
      isLocalDev,
      index,
      monthLabel: String(year),
      onEdit: async (id, updates) => {
        const updatedActivity = { ...act, ...updates, id, updated_at: new Date().toISOString() }
        await dataStore.updateActivity(updatedActivity, isLocalDev)
        await renderAllCardsByYearView({ app, year, isLocalDev })
      },
      onToggle: async () => {
        await toggleUsage(act, isLocalDev)
        celebrateIfNeeded(act)
        await renderAllCardsByYearView({ app, year, isLocalDev })
      },
      getSuitMeta,
      fetchImageUrl: (activity) => fetchImageUrl(activity, isLocalDev)
    })

    // Force "revealed" (front) view visually, but don't touch is_used/completed state.
    const inner = node.querySelector('.card-inner')
    if (inner) {
      inner.classList.add('flipped')
      inner.style.setProperty('--flip', '180deg')
    }

    return node
  }))

  nodes.forEach(n => grid.appendChild(n))
}
