import { localStorageDB } from './localStorage'

export async function renderAdminDashboard(app, supabase) {
  const isLocalDev = import.meta.env.VITE_LOCAL_DEV_MODE === 'true'

  // Get user email
  let userEmail = ''
  if (isLocalDev) {
    const localUser = JSON.parse(localStorage.getItem('localDevUser'))
    userEmail = localUser?.email || 'Admin'
  } else {
    const { data: { user } } = await supabase.auth.getUser()
    userEmail = user?.email || 'Admin'
  }

  app.innerHTML = `
    <div class="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <!-- Top Navigation Bar -->
      <nav class="bg-gradient-to-r from-xmas-green to-green-900 border-b-4 border-gold shadow-2xl sticky top-0 z-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between items-center h-16">
            <!-- Logo/Brand -->
            <div class="flex items-center space-x-3">
              <span class="text-3xl animate-float">🎴</span>
              <div>
                <h2 class="font-festive text-xl text-gold">Admin Dashboard</h2>
                <p class="text-white/70 text-xs font-script">Manage Adventures</p>
              </div>
            </div>
            
            <!-- User Menu -->
            <div class="flex items-center space-x-4">
              <div class="hidden sm:flex items-center space-x-3 bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm">
                <div class="w-8 h-8 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                  👑
                </div>
                <div class="flex flex-col">
                  <span class="text-white text-xs font-medium">${userEmail.split('@')[0]}</span>
                  <span class="text-yellow-300 text-xs font-bold">Admin</span>
                </div>
              </div>
              <button id="logout" class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full font-semibold text-sm transition-all shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center space-x-2">
                <span>🚪</span>
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div class="p-6">
        <div class="max-w-2xl mx-auto">
        ${isLocalDev ? `
        <div class="bg-blue-100 border-2 border-blue-400 text-blue-800 px-4 py-3 rounded-lg mb-4 text-sm">
          <strong>🔧 Local Dev Mode Active</strong><br/>
          Activities are saved to browser local storage. Data will persist across sessions but is local to this browser.
        </div>
        ` : ''}
        <div class="bg-white p-8 rounded-2xl shadow-2xl border-4 border-yellow-400 mb-6">
          <div class="mb-6">
            <h2 class="text-3xl font-bold text-xmas-green font-festive mb-2">Create Activity 🎴</h2>
            <p class="text-sm text-gray-500">Add magical memories for 2026</p>
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

        ${isLocalDev ? `
        <!-- Local Storage Management -->
        <div class="bg-white p-6 rounded-2xl shadow-xl border-2 border-gray-200 mt-4">
          <h3 class="font-bold text-lg mb-4 text-gray-800 font-festive">💾 Local Data Management</h3>
          <div class="grid grid-cols-3 gap-3">
            <button id="exportData" class="bg-blue-500 text-white py-2 px-4 rounded-lg text-sm font-semibold hover:bg-blue-600 transition">
              📤 Export Data
            </button>
            <button id="importData" class="bg-green-500 text-white py-2 px-4 rounded-lg text-sm font-semibold hover:bg-green-600 transition">
              📥 Import Data
            </button>
            <button id="clearData" class="bg-red-500 text-white py-2 px-4 rounded-lg text-sm font-semibold hover:bg-red-600 transition">
              🗑️ Clear All
            </button>
          </div>
          <input type="file" id="importFile" accept=".json" class="hidden">
          <p class="text-xs text-gray-500 mt-3">Export your data to back it up, or clear all to start fresh. Import previously exported data to restore.</p>
        </div>
        ` : ''}
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

  // Local storage management buttons
  if (isLocalDev) {
    document.querySelector('#exportData')?.addEventListener('click', () => {
      const data = localStorageDB.exportData()
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `our-2026-deck-backup-${new Date().toISOString().split('T')[0]}.json`
      a.click()
      URL.revokeObjectURL(url)
    })

    document.querySelector('#importData')?.addEventListener('click', () => {
      document.querySelector('#importFile').click()
    })

    document.querySelector('#importFile')?.addEventListener('change', (e) => {
      const file = e.target.files[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (e) => {
          try {
            const data = JSON.parse(e.target.result)
            localStorageDB.importData(data)
            alert('Data imported successfully! Refreshing...')
            location.reload()
          } catch (err) {
            alert('Error importing data: ' + err.message)
          }
        }
        reader.readAsText(file)
      }
    })

    document.querySelector('#clearData')?.addEventListener('click', () => {
      if (confirm('Are you sure you want to clear ALL data? This cannot be undone!')) {
        localStorageDB.clearAll()
        alert('All data cleared! Refreshing...')
        location.reload()
      }
    })
  }

  document.querySelector('#activityForm').onsubmit = async (e) => {
    e.preventDefault()
    const btn = document.querySelector('#saveBtn')
    btn.disabled = true
    btn.innerHTML = "Processing... ⏳"

    const file = document.querySelector('#imageFile').files[0]
    let path = null

    if (file) {
      if (isLocalDev) {
        // Save to local storage
        const { data, error: upErr } = await localStorageDB.uploadImage(file)
        if (upErr) {
          alert(upErr.message)
          btn.disabled = false
          btn.innerHTML = "Save to Database ✨"
          return
        }
        path = data.path
      } else {
        // Save to Supabase
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
    }

    const activityData = {
      title: e.target.title.value,
      description: e.target.description.value,
      suit: e.target.suit.value,
      deck_year: parseInt(e.target.deckYear.value),
      week_number: parseInt(e.target.weekNumber.value),
      image_path: path
    }

    let error = null
    if (isLocalDev) {
      // Save to local storage
      const result = await localStorageDB.insertActivity(activityData)
      error = result.error
    } else {
      // Save to Supabase
      const result = await supabase.from('activities').insert([activityData])
      error = result.error
    }

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