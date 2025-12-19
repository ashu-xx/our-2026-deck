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
    <div class="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-green-800 via-green-700 to-green-900 relative overflow-hidden">
        <!-- Animated background decorations -->
        <div class="fixed top-10 left-10 text-6xl animate-float opacity-30">🎄</div>
        <div class="fixed top-20 right-20 text-5xl animate-float-reverse opacity-30">❄️</div>
        <div class="fixed bottom-20 left-1/4 text-5xl animate-float opacity-30">🌸</div>
        <div class="fixed bottom-32 right-1/4 text-6xl animate-float-reverse opacity-30">🦋</div>
        <div class="fixed top-1/2 left-10 text-4xl animate-sparkle opacity-20">✨</div>
        <div class="fixed top-1/2 right-10 text-4xl animate-sparkle opacity-20">💫</div>
        
        <div class="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-md border-4 border-yellow-400 relative z-10 animate-slide-in">
            <div class="text-center mb-6">
              <div class="text-6xl mb-4 animate-float">💝</div>
              <h1 class="font-festive text-5xl text-xmas-green mb-2">Our 2026 Journey</h1>
              <p class="font-script text-xl text-gray-600 italic">A year of love and adventure</p>
              <div class="mt-4 flex justify-center gap-3 text-3xl">
                <span class="animate-float">🦊</span>
                <span class="animate-float-reverse">🌺</span>
                <span class="animate-float">🎴</span>
              </div>
            </div>
            
            ${isLocalDev ? '<div class="bg-yellow-100 border-2 border-yellow-400 text-yellow-800 px-4 py-3 rounded-lg mb-6 text-xs"><strong>🔧 Local Dev Mode</strong><br/>Admin: admin@example.com / password123<br/>User: user@example.com / password123</div>' : ''}
            
            <form id="loginForm" class="space-y-5">
                <div>
                  <input type="email" id="email" placeholder="✉️ Email" class="w-full p-4 border-2 border-gray-300 rounded-xl text-black focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 outline-none transition-all">
                </div>
                <div>
                  <input type="password" id="password" placeholder="🔑 Password" class="w-full p-4 border-2 border-gray-300 rounded-xl text-black focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 outline-none transition-all">
                </div>
                <button type="submit" class="w-full bg-gradient-to-r from-red-500 to-red-600 text-white py-4 rounded-xl font-bold text-lg hover:from-red-600 hover:to-red-700 transition-all shadow-lg transform hover:scale-[1.02]">
                  Open Your Gift 🎁
                </button>
            </form>
            
            <div class="mt-6 text-center text-xs text-gray-500">
              <p class="font-script text-sm">Made with love for the adventures ahead ✨</p>
            </div>
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