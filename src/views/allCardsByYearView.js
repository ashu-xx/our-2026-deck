import { fetchImageUrl, getSuitMeta } from '../cardUtils'
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

// Keep order stable for section rendering.
const SUIT_ORDER = ['hearts', 'diamonds', 'clubs', 'spades']

function suitDisplay(suit) {
  const meta = getSuitMeta(suit)
  const fallback = String(suit || '').toUpperCase()
  return {
    suit,
    label: meta?.label || fallback,
    emoji: meta?.emoji || '',
    symbol: meta?.symbol || ''
  }
}

function emptyCardTemplate({ year, suit }) {
  const now = new Date().toISOString()
  return {
    id: `custom-${year}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    deck_year: year,
    planned_date: null,
    title: '',
    description: '',
    suit,
    image_path: null,
    created_at: now,
    updated_at: now
  }
}

async function renderSuitSection({ container, year, suit, cards, isLocalDev }) {
  const meta = suitDisplay(suit)

  const section = document.createElement('section')
  section.className = 'mt-10'
  section.dataset.suit = suit

  section.innerHTML = `
    <div class="text-center mb-4">
      <div class="text-5xl mb-2">${meta.symbol}</div>
      <h2 class="font-festive text-2xl text-gold drop-shadow">${meta.label}</h2>
      <p class="text-white/60 text-xs mt-1">${cards.length} cards</p>
    </div>

    <div class="flex justify-center mb-4">
      <button type="button" class="add-card-btn btn btn-success px-4 py-2 rounded-full" data-add-card-suit="${suit}">
        + Add card
      </button>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 sm:gap-6" data-suit-grid="${suit}"></div>
  `

  container.appendChild(section)

  const grid = section.querySelector(`[data-suit-grid="${suit}"]`)
  if (!grid) return

  if (cards.length === 0) {
    const empty = document.createElement('div')
    empty.className = 'col-span-full max-w-2xl mx-auto surface-card p-6 text-center border-2 border-white/20'
    empty.innerHTML = `<h3 class="font-bold text-lg text-slate-900">No ${meta.label} cards for ${year}</h3>`
    grid.appendChild(empty)
    return
  }

  const nodes = await Promise.all(cards.map(async (act, index) => {
    const node = await createDeckCard(act, {
      isLocalDev,
      index,
      label: String(year),
      showEdit: true,
      onEdit: async (id, updates) => {
        const updatedActivity = { ...act, ...updates, id, updated_at: new Date().toISOString() }
        await dataStore.updateActivity(updatedActivity, isLocalDev)
        await renderAllCardsByYearView({ app: container.closest('#app') || container, year, isLocalDev })
      },
      getSuitMeta,
      fetchImageUrl: (activity) => fetchImageUrl(activity, isLocalDev)
    })

    // Cards are now always rendered revealed by default.

    // Add remove button to the card container.
    const removeBtn = document.createElement('button')
    removeBtn.type = 'button'
    removeBtn.className = 'remove-card-btn absolute top-2 left-2 bg-red-600 hover:bg-red-700 text-white px-3 py-1 text-[11px] font-bold rounded-full transition-all shadow-md'
    removeBtn.textContent = '🗑 Remove'
    removeBtn.dataset.removeCardId = String(act.id)
    if (act.title) removeBtn.dataset.removeCardTitle = String(act.title)
    node.appendChild(removeBtn)

    return node
  }))

  nodes.forEach(n => grid.appendChild(n))
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
        <div id="allCardsSections" class="max-w-7xl mx-auto"></div>
      </main>
    </div>
  `

  const sections = app.querySelector('#allCardsSections')
  if (!sections) return

  // One-time delegated handler bound to this freshly-rendered container.
  sections.addEventListener('click', async (e) => {
    const addBtn = e.target?.closest?.('[data-add-card-suit]')
    if (addBtn) {
      e.preventDefault()
      // @ts-ignore - dataset typing varies by tooling
      const suit = addBtn.dataset.addCardSuit
      if (!suit) return
      const activity = emptyCardTemplate({ year, suit })
      await dataStore.insertActivities([activity], isLocalDev)
      await renderAllCardsByYearView({ app, year, isLocalDev })
      return
    }

    const removeBtn = e.target?.closest?.('[data-remove-card-id]')
    if (removeBtn) {
      e.preventDefault()
      // @ts-ignore
      const id = removeBtn.dataset.removeCardId
      if (!id) return

      // Best-effort label.
      // @ts-ignore
      const titleAttr = removeBtn.dataset.removeCardTitle
      const title = titleAttr ? `"${titleAttr}"` : 'this card'
      if (!confirm(`Remove ${title}? This cannot be undone.`)) return

      await dataStore.deleteActivity(id, isLocalDev)
      await renderAllCardsByYearView({ app, year, isLocalDev })
    }
  }, { passive: false })

  const all = await dataStore.listActivities(isLocalDev)
  const yearCards = all
    .filter(a => a.deck_year === year)
    .sort((a, b) => dateKeyOrDefault(a) - dateKeyOrDefault(b))

  if (yearCards.length === 0) {
    sections.innerHTML = `
      <div class="max-w-2xl mx-auto surface-card p-6 text-center border-2 border-white/20">
        <h3 class="font-bold text-xl text-slate-900">No cards found for ${year}</h3>
        <p class="text-slate-600 text-sm mt-2">Use the buttons below to add your first card.</p>
        <div class="mt-4 flex flex-wrap gap-2 justify-center">
          ${SUIT_ORDER.map(s => `<button type="button" class="add-card-btn btn btn-success px-4 py-2 rounded-full" data-add-card-suit="${s}">+ Add ${suitDisplay(s).label}</button>`).join('')}
        </div>
      </div>
    `

    return
  }

  const bySuit = new Map(SUIT_ORDER.map(s => [s, []]))
  for (const act of yearCards) {
    if (!SUIT_ORDER.includes(act.suit)) continue
    bySuit.get(act.suit).push(act)
  }

  // Render suit sections in stable order.
  let globalIndex = 0
  for (const suit of SUIT_ORDER) {
    const cards = bySuit.get(suit) || []
    await renderSuitSection({ container: sections, year, suit, cards, isLocalDev })
    globalIndex += cards.length
  }

  // (Event delegation handler is attached above.)
}
