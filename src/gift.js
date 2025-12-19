export async function renderGiftView(app, supabase) {
  const { data: activities } = await supabase.from('activities').select('*').order('week_number', { ascending: true })

  app.innerHTML = `
    <div class="min-h-screen bg-pattern pb-20 relative overflow-hidden">
      <!-- Floating decorative elements -->
      <div class="fixed top-10 left-10 text-6xl animate-float opacity-20">🦋</div>
      <div class="fixed top-20 right-20 text-5xl animate-float-reverse opacity-20">🌸</div>
      <div class="fixed bottom-20 left-20 text-5xl animate-float opacity-20">🦊</div>
      <div class="fixed bottom-32 right-32 text-6xl animate-float-reverse opacity-20">🌺</div>
      <div class="fixed top-1/3 left-1/4 text-4xl animate-sparkle opacity-15">✨</div>
      <div class="fixed top-2/3 right-1/4 text-4xl animate-sparkle opacity-15">🎄</div>
      
      <header class="p-10 text-center relative z-10">
        <div class="mb-4 text-6xl animate-float">💝</div>
        <h1 class="font-festive text-6xl text-gold mb-2 drop-shadow-2xl">Our Adventures Together</h1>
        <p class="font-script text-2xl text-white/90 mb-6">52 Weeks, Infinite Memories ✨</p>
        
        <div class="flex justify-center bg-white/20 p-1.5 rounded-full w-fit mx-auto backdrop-blur-md shadow-2xl border-2 border-white/30">
          <button id="btn25" class="px-8 py-3 rounded-full transition-all font-semibold text-white">
            <span class="mr-2">📸</span> 2025 Memories
          </button>
          <button id="btn26" class="px-8 py-3 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-xmas-green font-bold shadow-lg">
            <span class="mr-2">🎴</span> 2026 Adventures
          </button>
        </div>
      </header>
      
      <div id="deck" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6 px-6 relative z-10"></div>
    </div>`

  const deck = document.querySelector('#deck')

  async function loadYear(year) {
    deck.innerHTML = '<div class="col-span-full text-center"><div class="inline-block bg-white/90 px-8 py-4 rounded-full shadow-xl"><span class="text-gold animate-pulse text-xl font-script">Shuffling the deck... 🎴✨</span></div></div>'
    const filtered = activities.filter(a => a.deck_year === year)
    deck.innerHTML = ''

    for (const [index, act] of filtered.entries()) {
      let imgUrl = 'https://via.placeholder.com/300x200?text=No+Photo'
      if (act.image_path) {
        const { data } = await supabase.storage.from('activity-images').createSignedUrl(act.image_path, 3600)
        imgUrl = data.signedUrl
      }

      const card = document.createElement('div')
      card.className = `perspective h-80 cursor-pointer animate-slide-in card-container ${act.is_used ? 'opacity-60' : ''}`
      card.style.animationDelay = `${index * 0.05}s`

      const isFlipped = year === 2025 ? 'rotate-y-180' : ''
      const suitClass = `suit-${act.suit}`
      const suitEmoji = getSuitEmoji(act.suit)
      const suitSymbol = getSymbol(act.suit)

      card.innerHTML = `
        <div class="card-inner w-full h-full relative transition-transform duration-700 transform-style-3d ${isFlipped}">
          <!-- Card Back (Week number side) -->
          <div class="absolute inset-0 backface-hidden ${suitClass} border-4 border-white rounded-2xl flex flex-col items-center justify-center shadow-2xl p-4">
            <div class="text-7xl mb-3">${suitSymbol}</div>
            <div class="text-5xl mb-2">${suitEmoji}</div>
            <div class="mt-4 px-4 py-2 bg-white/80 rounded-full shadow-inner">
              <span class="text-gray-700 font-bold text-xs tracking-widest">WEEK ${act.week_number}</span>
            </div>
            <div class="mt-3 text-xs text-gray-600 font-semibold">${getCategoryName(act.suit)}</div>
          </div>
          
          <!-- Card Front (Activity details) -->
          <div class="absolute inset-0 backface-hidden rotate-y-180 bg-white rounded-2xl border-4 border-white overflow-hidden flex flex-col shadow-2xl">
            <div class="relative h-40 overflow-hidden">
              <img src="${imgUrl}" class="h-full w-full object-cover">
              <div class="absolute top-2 right-2 bg-white/90 rounded-full w-10 h-10 flex items-center justify-center text-2xl shadow-lg">
                ${suitSymbol}
              </div>
              <div class="absolute top-2 left-2 bg-white/90 px-3 py-1 rounded-full text-xs font-bold text-gray-700 shadow-lg">
                Week ${act.week_number}
              </div>
            </div>
            
            <div class="p-4 flex-1 flex flex-col ${suitClass}">
              <h3 class="font-bold text-base leading-tight text-gray-800 mb-2">${act.title}</h3>
              <p class="text-xs text-gray-700 leading-relaxed flex-1">${act.description || ''}</p>
              
              ${year === 2026 ? `
                <div class="mt-3 bg-gradient-to-r ${act.is_used ? 'from-green-400 to-green-500' : 'from-yellow-400 to-yellow-500'} text-xs text-center font-bold py-2.5 text-white rounded-lg shadow-md">
                  ${act.is_used ? '✓ COMPLETED! 🎉' : '⚡ DOUBLE TAP TO MARK DONE'}
                </div>
              ` : `
                <div class="mt-3 bg-gradient-to-r from-pink-300 to-pink-400 text-xs text-center font-script text-lg py-2 text-white rounded-lg shadow-md">
                  Beautiful Memory 💕
                </div>
              `}
            </div>
          </div>
        </div>`

      card.onclick = () => {
        const inner = card.querySelector('.card-inner')
        inner.classList.toggle('rotate-y-180')
      }

      if (year === 2026) {
        card.ondblclick = async (e) => {
          e.stopPropagation()
          const { error } = await supabase.from('activities').update({ is_used: !act.is_used }).eq('id', act.id)
          if (!error) {
            // Show a nice celebration animation
            if (!act.is_used) {
              const celebration = document.createElement('div')
              celebration.className = 'fixed inset-0 flex items-center justify-center z-50 pointer-events-none'
              celebration.innerHTML = '<div class="text-9xl animate-bounce">🎉</div>'
              document.body.appendChild(celebration)
              setTimeout(() => celebration.remove(), 1500)
            }
            location.reload()
          }
        }
      }
      deck.appendChild(card)
    }

    // Add jokers if they exist
    const jokers = filtered.filter(a => a.suit === 'joker')
    if (jokers.length === 0 && year === 2026) {
      // Show a message about adding jokers
      const jokerPrompt = document.createElement('div')
      jokerPrompt.className = 'col-span-full mt-8 text-center'
      jokerPrompt.innerHTML = `
        <div class="inline-block bg-white/90 px-8 py-6 rounded-2xl shadow-xl">
          <div class="text-5xl mb-3">🃏</div>
          <p class="font-script text-2xl text-gray-700">Don't forget to add your wild card adventures!</p>
        </div>
      `
      deck.appendChild(jokerPrompt)
    }
  }

  function getSymbol(s) {
    return {
      hearts:'♥️',
      diamonds:'♦️',
      clubs:'♣️',
      spades:'♠️',
      joker:'🃏'
    }[s] || '✨'
  }

  function getSuitEmoji(s) {
    return {
      hearts: '🎭',      // Cultural & Social
      diamonds: '🗺️',   // Adventures & Exploration
      clubs: '🦋',       // Nature & Outdoors
      spades: '🏠',      // Cozy & Creative
      joker: '🌟'        // Wild card
    }[s] || '✨'
  }

  function getCategoryName(s) {
    return {
      hearts: 'Cultural & Social',
      diamonds: 'Adventures & Exploration',
      clubs: 'Nature & Outdoors',
      spades: 'Cozy & Creative',
      joker: 'Wild Card'
    }[s] || 'Special'
  }

  document.querySelector('#btn25').onclick = (e) => { switchTab(e.target); loadYear(2025) }
  document.querySelector('#btn26').onclick = (e) => { switchTab(e.target); loadYear(2026) }

  function switchTab(btn) {
    const allBtns = document.querySelectorAll('header button')
    allBtns.forEach(b => {
      b.classList.remove('bg-gradient-to-r', 'from-yellow-400', 'to-yellow-500', 'text-xmas-green', 'font-bold', 'shadow-lg')
      b.classList.add('text-white')
    })
    btn.classList.remove('text-white')
    btn.classList.add('bg-gradient-to-r', 'from-yellow-400', 'to-yellow-500', 'text-xmas-green', 'font-bold', 'shadow-lg')
  }

  loadYear(2026)
}