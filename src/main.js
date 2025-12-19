import { createClient } from '@supabase/supabase-js'
import './style.css'
import { renderAdminDashboard } from './admin'
import { renderGiftView } from './gift'

export const supabase = createClient(
    import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_ANON_KEY
)

const app = document.querySelector('#app')

// Local dev mode mock users
const LOCAL_USERS = {
  'admin@example.com': { password: 'password123', email: 'admin@example.com', id: '1' },
  'user@example.com': { password: 'password123', email: 'user@example.com', id: '2' }
}

async function init() {
  try {
    // Check if local dev mode is enabled
    const isLocalDev = import.meta.env.VITE_LOCAL_DEV_MODE === 'true'

    if (isLocalDev) {
      const localUser = JSON.parse(localStorage.getItem('localDevUser'))
      if (!localUser) {
        renderLogin()
      } else if (localUser.email === import.meta.env.VITE_ADMIN_EMAIL) {
        renderAdminDashboard(app, supabase)
      } else {
        renderGiftView(app, supabase)
      }
      return
    }

    const { data: { user }, error } = await supabase.auth.getUser()

    if (error) {
      console.error('Supabase auth error:', error)
      renderLogin()
      return
    }

  if (!user) {
    renderLogin()
  } else if (user.email === import.meta.env.VITE_ADMIN_EMAIL) {
    renderAdminDashboard(app, supabase)
  } else {
    renderGiftView(app, supabase)
  }
  } catch (err) {
    console.error('Initialization error:', err)
    renderLogin()
  }
}

function renderLogin() {
  const isLocalDev = import.meta.env.VITE_LOCAL_DEV_MODE === 'true'

  app.innerHTML = `
    <div class="min-h-screen flex items-center justify-center bg-xmas-green p-4">
        <div class="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md border-4 border-gold">
            <h1 class="font-festive text-4xl text-xmas-green mb-2 text-center">Our 2026 Journey</h1>
            <p class="text-center text-gray-500 mb-6 text-sm italic">A year of love and adventure</p>
            ${isLocalDev ? '<div class="bg-yellow-100 border border-yellow-400 text-yellow-800 px-3 py-2 rounded mb-4 text-xs"><strong>Local Dev Mode</strong><br/>Admin: admin@example.com / password123<br/>User: user@example.com / password123</div>' : ''}
            <form id="loginForm" class="space-y-4">
                <input type="email" id="email" placeholder="Email" class="w-full p-3 border rounded-lg text-black focus:ring-2 focus:ring-gold outline-none" required>
                <input type="password" id="password" placeholder="Password" class="w-full p-3 border rounded-lg text-black focus:ring-2 focus:ring-gold outline-none" required>
                <button type="submit" class="w-full bg-xmas-red text-white py-3 rounded-lg font-bold hover:scale-105 transition-transform shadow-lg">Open Your Gift 🎁</button>
            </form>
        </div>
    </div>`

  document.querySelector('#loginForm').addEventListener('submit', async (e) => {
    e.preventDefault()
    const email = e.target.email.value
    const password = e.target.password.value

    if (isLocalDev) {
      // Local dev mode authentication
      const user = LOCAL_USERS[email]
      if (user && user.password === password) {
        localStorage.setItem('localDevUser', JSON.stringify({ email: user.email, id: user.id }))
        init()
      } else {
        alert('Invalid credentials. Use admin@example.com or user@example.com with password: password123')
      }
    } else {
      // Real Supabase authentication
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) alert(error.message)
      else init()
    }
  })
}

init()