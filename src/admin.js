export async function renderAdminDashboard(app, supabase) {
  app.innerHTML = `
    <div class="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-6">
      <div class="max-w-2xl mx-auto">
        <div class="bg-white p-8 rounded-2xl shadow-2xl border-4 border-yellow-400 mb-6">
          <div class="flex justify-between items-center mb-6">
            <div>
              <h2 class="text-3xl font-bold text-xmas-green font-festive">Admin Panel 🎴</h2>
              <p class="text-sm text-gray-500 mt-1">Create magical memories for 2026</p>
            </div>
            <button id="logout" class="text-xs text-red-500 hover:text-red-700 underline font-semibold">Logout</button>
          </div>
          
          <form id="activityForm" class="space-y-5 text-black">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="text-xs font-bold uppercase text-gray-700 block mb-2">Year</label>
                <select id="deckYear" class="w-full p-3 border-2 border-gray-300 rounded-lg bg-white focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200 outline-none">
                  <option value="2025">2025 (Memory)</option>
                  <option value="2026">2026 (Future)</option>
                </select>
              </div>
              <div>
                <label class="text-xs font-bold uppercase text-gray-700 block mb-2">Week Number</label>
                <input type="number" id="weekNumber" min="1" max="52" class="w-full p-3 border-2 border-gray-300 rounded-lg bg-white focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200 outline-none" required>
              </div>
            </div>

            <div>
              <label class="text-xs font-bold uppercase text-gray-700 block mb-2">Activity Title</label>
              <input type="text" id="title" placeholder="e.g., Kew Gardens Adventure 🌺" class="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200 outline-none" required>
            </div>

            <div>
              <label class="text-xs font-bold uppercase text-gray-700 block mb-2">Description</label>
              <textarea id="description" placeholder="A brief description or memory of this activity..." class="w-full p-3 border-2 border-gray-300 rounded-lg h-24 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200 outline-none"></textarea>
            </div>

            <div>
              <label class="text-xs font-bold uppercase text-gray-700 block mb-3">Category (Suit)</label>
              <select id="suit" class="w-full p-3 border-2 border-gray-300 rounded-lg bg-white focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200 outline-none">
                <option value="hearts">♥️ Hearts - Cultural & Social (museums, theatre, dinners, events)</option>
                <option value="diamonds">♦️ Diamonds - Adventures & Exploration (trips, new places, getaways)</option>
                <option value="clubs">♣️ Clubs - Nature & Outdoors (parks, gardens, walks, wildlife)</option>
                <option value="spades">♠️ Spades - Cozy & Creative (home dates, crafts, cooking, relaxation)</option>
                <option value="joker">🃏 Joker - Wild Card (special surprises!)</option>
              </select>
            </div>

            <div class="p-5 border-2 border-dashed border-yellow-400 rounded-lg bg-yellow-50">
              <label class="block text-sm font-bold mb-2 text-gray-700">📸 Activity Image</label>
              <input type="file" id="imageFile" accept="image/*" class="text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-yellow-400 file:text-gray-700 hover:file:bg-yellow-500 file:cursor-pointer">
              <p class="text-xs text-gray-500 mt-2">Upload a photo from your memory or a placeholder for future adventures</p>
            </div>

            <button type="submit" id="saveBtn" class="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-4 rounded-xl font-bold text-lg hover:from-green-700 hover:to-green-800 shadow-lg transition-all transform hover:scale-[1.02]">
              Save to Database ✨
            </button>
          </form>
        </div>

        <!-- Category Guide -->
        <div class="bg-white p-6 rounded-2xl shadow-xl border-2 border-gray-200">
          <h3 class="font-bold text-lg mb-4 text-gray-800 font-festive">📚 Category Guide</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div class="p-3 rounded-lg suit-hearts border-2 border-pink-200">
              <div class="font-bold text-gray-800 mb-1">♥️ Cultural & Social</div>
              <div class="text-xs text-gray-600">Museums, theatre, concerts, restaurants, social events, exhibitions</div>
            </div>
            <div class="p-3 rounded-lg suit-diamonds border-2 border-yellow-200">
              <div class="font-bold text-gray-800 mb-1">♦️ Adventures & Exploration</div>
              <div class="text-xs text-gray-600">Day trips, new neighborhoods, weekend getaways, exploring London</div>
            </div>
            <div class="p-3 rounded-lg suit-clubs border-2 border-green-200">
              <div class="font-bold text-gray-800 mb-1">♣️ Nature & Outdoors</div>
              <div class="text-xs text-gray-600">Parks, gardens, nature walks, wildlife watching, outdoor activities</div>
            </div>
            <div class="p-3 rounded-lg suit-spades border-2 border-purple-200">
              <div class="font-bold text-gray-800 mb-1">♠️ Cozy & Creative</div>
              <div class="text-xs text-gray-600">Home dates, cooking together, crafts, reading, cozy evenings</div>
            </div>
          </div>
          <div class="mt-3 p-3 rounded-lg suit-joker border-2 border-red-200">
            <div class="font-bold text-gray-800 mb-1">🃏 Joker (Wild Card)</div>
            <div class="text-xs text-gray-600">Special surprises, spontaneous adventures, unique experiences that don't fit other categories</div>
          </div>
        </div>
      </div>
    </div>`

  document.querySelector('#logout').onclick = () => {
    const isLocalDev = import.meta.env.VITE_LOCAL_DEV_MODE === 'true'
    if (isLocalDev) {
      localStorage.removeItem('localDevUser')
      location.reload()
    } else {
      supabase.auth.signOut().then(() => location.reload())
    }
  }

  document.querySelector('#activityForm').onsubmit = async (e) => {
    e.preventDefault()
    const btn = document.querySelector('#saveBtn')
    btn.disabled = true
    btn.innerHTML = "Processing... ⏳"

    const file = document.querySelector('#imageFile').files[0]
    let path = null

    if (file) {
      const fileName = `${Date.now()}-${file.name}`
      const { data, error: upErr } = await supabase.storage
      .from('activity-images')
      .upload(`uploads/${fileName}`, file)
      if (upErr) {
        alert(upErr.message)
        btn.disabled = false
        btn.innerHTML = "Save to Database ✨"
        return
      }
      path = data.path
    }

    const { error } = await supabase.from('activities').insert([{
      title: e.target.title.value,
      description: e.target.description.value,
      suit: e.target.suit.value,
      deck_year: parseInt(e.target.deckYear.value),
      week_number: parseInt(e.target.weekNumber.value),
      image_path: path
    }])

    if (error) {
      alert(error.message)
    } else {
      // Success animation
      btn.innerHTML = "Saved! 🎉"
      btn.classList.add('bg-green-500')
      setTimeout(() => {
        e.target.reset()
        btn.innerHTML = "Save to Database ✨"
        btn.classList.remove('bg-green-500')
      }, 2000)
    }
    btn.disabled = false
  }
}