import { createClient } from '@supabase/supabase-js'
import './style.css'
import { renderAdminDashboard } from './admin'
import { renderGiftView } from './gift'

export const supabase = createClient(
    import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_ANON_KEY
)

const app = document.querySelector('#app')

async function init() {
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    renderLogin()
  } else if (user.email === import.meta.env.VITE_ADMIN_EMAIL) {
    renderAdminDashboard(app, supabase)
  } else {
    renderGiftView(app, supabase)
  }
}

function renderLogin() {
  app.innerHTML = `
    <div class="min-h-screen flex items-center justify-center bg-xmas-green p-4">
        <div class="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md border-4 border-gold">
            <h1 class="font-festive text-4xl text-xmas-green mb-2 text-center">Our 2026 Journey</h1>
            <p class="text-center text-gray-500 mb-6 text-sm italic">A year of love and adventure</p>
            <form id="loginForm" class="space-y-4">
                <input type="email" id="email" placeholder="Email" class="w-full p-3 border rounded-lg text-black focus:ring-2 focus:ring-gold outline-none" required>
                <input type="password" id="password" placeholder="Password" class="w-full p-3 border rounded-lg text-black focus:ring-2 focus:ring-gold outline-none" required>
                <button type="submit" class="w-full bg-xmas-red text-white py-3 rounded-lg font-bold hover:scale-105 transition-transform shadow-lg">Open Your Gift 🎁</button>
            </form>
        </div>
    </div>`

  document.querySelector('#loginForm').addEventListener('submit', async (e) => {
    e.preventDefault()
    const { error } = await supabase.auth.signInWithPassword({
      email: e.target.email.value,
      password: e.target.password.value
    })
    if (error) alert(error.message)
    else init()
  })
}

init()