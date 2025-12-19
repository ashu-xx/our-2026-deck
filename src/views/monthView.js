export function renderMonthView({ year, monthIndex }) {
  const monthName = new Date(year, monthIndex, 1).toLocaleString(undefined, { month: 'long' })

  return `
    <section class="mt-10">
      <div class="flex items-center justify-between mb-4 px-2">
        <h2 class="font-festive text-4xl text-gold drop-shadow">${monthName}</h2>
        <span class="text-white/70 text-xs font-bold uppercase tracking-[0.2em]">${year}</span>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 sm:gap-6 px-2 sm:px-0" data-month-grid="${monthIndex}"></div>
    </section>
  `
}
