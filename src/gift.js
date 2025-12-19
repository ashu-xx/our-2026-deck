export async function renderGiftView(app, supabase) {
  const { data: activities } = await supabase.from('activities').select('*').order('week_number', { ascending: true })

  app.innerHTML = `
    <div class="min-h-screen bg-xmas-green pb-20">
      <header class="p-10 text-center">
        <h1 class="font-festive text-5xl text-gold mb-6 drop-shadow-lg">Our 2026 Adventures</h1>
        <div class="flex justify-center bg-black/20 p-1 rounded-full w-fit mx-auto backdrop-blur-sm">
          <button id="btn25" class="px-6 py-2 rounded-full transition-all">2025 Memories</button>
          <button id="btn26" class="px-6 py-2 rounded-full bg-gold text-xmas-green font-bold shadow-inner">2026 Future</button>
        </div>
      </header>
      <div id="deck" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 px-6"></div>
    </div>`

  const deck = document.querySelector('#deck')

  async function loadYear(year) {
    deck.innerHTML = '<div class="col-span-full text-center text-gold animate-pulse">Shuffling the deck...</div>'
    const filtered = activities.filter(a => a.deck_year === year)
    deck.innerHTML = ''

    for (const act of filtered) {
      let imgUrl = 'https://via.placeholder.com/300x200?text=No+Photo'
      if (act.image_path) {
        const { data } = await supabase.storage.from('activity-images').createSignedUrl(act.image_path, 3600)
        imgUrl = data.signedUrl
      }

      const card = document.createElement('div')
      card.className = `perspective h-72 cursor-pointer transition-opacity duration-300 ${act.is_used ? 'opacity-40' : ''}`

      const isFlipped = year === 2025 ? 'rotate-y-180' : ''

      card.innerHTML = `
        <div class="card-inner w-full h-full relative transition-transform duration-700 transform-style-3d ${isFlipped}">
          <div class="absolute inset-0 backface-hidden bg-white border-4 border-gold rounded-xl flex flex-col items-center justify-center shadow-xl">
             <span class="text-5xl">${getSymbol(act.suit)}</span>
             <span class="mt-4 text-gray-400 font-bold uppercase text-[10px] tracking-widest">Week ${act.week_number}</span>
          </div>
          <div class="absolute inset-0 backface-hidden rotate-y-180 bg-white rounded-xl border-4 border-gold overflow-hidden flex flex-col shadow-xl">
            <img src="${imgUrl}" class="h-32 w-full object-cover grayscale-[0.2]">
            <div class="p-3 text-black">
              <h3 class="font-bold text-sm leading-tight">${act.title}</h3>
              <p class="text-[10px] text-gray-600 mt-2 leading-relaxed">${act.description || ''}</p>
            </div>
            ${year === 2026 ? `<div class="mt-auto bg-gold/20 text-[9px] text-center font-bold py-2 text-xmas-green border-t border-gold/30">${act.is_used ? '✓ COMPLETED' : 'DOUBLE TAP TO FINISH'}</div>` : ''}
          </div>
        </div>`

      card.onclick = () => card.querySelector('.card-inner').classList.toggle('rotate-y-180')

      if (year === 2026) {
        card.ondblclick = async (e) => {
          e.stopPropagation()
          const { error } = await supabase.from('activities').update({ is_used: !act.is_used }).eq('id', act.id)
          if (!error) location.reload()
        }
      }
      deck.appendChild(card)
    }
  }

  function getSymbol(s) { return { hearts:'♥️', diamonds:'♦️', clubs:'♣️', spades:'♠️', joker:'🃏' }[s] || '✨' }

  document.querySelector('#btn25').onclick = (e) => { switchTab(e.target); loadYear(2025) }
  document.querySelector('#btn26').onclick = (e) => { switchTab(e.target); loadYear(2026) }

  function switchTab(btn) {
    document.querySelectorAll('header button').forEach(b => b.classList.remove('bg-gold', 'text-xmas-green', 'font-bold'))
    btn.classList.add('bg-gold', 'text-xmas-green', 'font-bold')
  }

  loadYear(2026)
}