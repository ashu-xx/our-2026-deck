export async function renderAdminDashboard(app, supabase) {
  app.innerHTML = `
    <div class="min-h-screen bg-gray-50 p-6">
      <div class="max-w-xl mx-auto bg-white p-8 rounded-2xl shadow-lg">
        <div class="flex justify-between items-center mb-6">
            <h2 class="text-2xl font-bold text-xmas-green font-festive">Admin Panel</h2>
            <button id="logout" class="text-xs text-red-500 underline">Logout</button>
        </div>
        
        <form id="activityForm" class="space-y-4 text-black">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="text-xs font-bold uppercase">Year</label>
              <select id="deckYear" class="w-full p-2 border rounded bg-gray-50">
                <option value="2025">2025 (Memory)</option>
                <option value="2026">2026 (Future)</option>
              </select>
            </div>
            <div>
              <label class="text-xs font-bold uppercase">Week Number</label>
              <input type="number" id="weekNumber" min="1" max="52" class="w-full p-2 border rounded bg-gray-50" required>
            </div>
          </div>

          <input type="text" id="title" placeholder="Title (e.g. Kew Gardens)" class="w-full p-2 border rounded" required>
          <textarea id="description" placeholder="Short description or clue..." class="w-full p-2 border rounded h-24"></textarea>

          <select id="suit" class="w-full p-2 border rounded bg-gray-50">
            <option value="hearts">Hearts (Human Rights/Culture)</option>
            <option value="diamonds">Diamonds (Tech/Logic)</option>
            <option value="clubs">Clubs (Animals/Nature)</option>
            <option value="spades">Spades (Botanical/Flowers)</option>
          </select>

          <div class="p-4 border-2 border-dashed border-gold rounded-lg bg-yellow-50">
            <label class="block text-sm font-medium mb-1">Activity Image</label>
            <input type="file" id="imageFile" accept="image/*" class="text-xs">
          </div>

          <button type="submit" id="saveBtn" class="w-full bg-xmas-green text-white py-3 rounded-xl font-bold hover:bg-green-800 shadow-md transition">Save to Database</button>
        </form>
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
    btn.disabled = true; btn.innerText = "Processing..."

    const file = document.querySelector('#imageFile').files[0]
    let path = null

    if (file) {
      const fileName = `${Date.now()}-${file.name}`
      const { data, error: upErr } = await supabase.storage
      .from('activity-images')
      .upload(`uploads/${fileName}`, file)
      if (upErr) return alert(upErr.message)
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

    if (error) alert(error.message)
    else { alert("Saved!"); e.target.reset() }
    btn.disabled = false; btn.innerText = "Save to Database"
  }
}