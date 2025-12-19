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
        
        <!-- Login Card -->
        <div class="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-md border-4 border-yellow-400 relative z-10 animate-slide-in">
            <!-- Header -->
            <div class="text-center mb-8">
              <div class="text-7xl mb-4 animate-float">💝</div>
              <h1 class="font-festive text-5xl mb-2 bg-gradient-to-r from-green-700 to-green-900 bg-clip-text text-transparent">Our 2026 Journey</h1>
              <p class="font-script text-xl text-gray-600 italic mt-2">A year of love and adventure</p>
              <div class="mt-4 flex justify-center gap-3 text-3xl">
                <span class="animate-float">🦊</span>
                <span class="animate-float-reverse">🌺</span>
                <span class="animate-float">🎴</span>
              </div>
            </div>
            
            ${isLocalDev ? `
            <div class="bg-yellow-50 border-2 border-yellow-400 text-yellow-800 px-4 py-3 rounded-xl mb-6 text-xs">
              <div class="flex items-start space-x-2">
                <span class="text-lg">🔧</span>
                <div>
                  <strong class="block mb-1">Local Dev Mode</strong>
                  <div class="space-y-1">
                    <div><span class="font-semibold">Admin:</span> admin@example.com / password123</div>
                    <div><span class="font-semibold">User:</span> user@example.com / password123</div>
                  </div>
                </div>
              </div>
            </div>
            ` : ''}
            
            <!-- Login Form -->
            <form id="loginForm" class="space-y-5">
                <div class="relative">
                  <label class="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">Email Address</label>
                  <div class="relative">
                    <span class="absolute left-4 top-1/2 transform -translate-y-1/2 text-xl">✉️</span>
                    <input 
                      type="email" 
                      id="email" 
                      placeholder="Enter your email" 
                      class="w-full pl-12 pr-4 py-4 border-2 border-gray-300 rounded-xl text-black focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 outline-none transition-all placeholder-gray-400"
                      required
                    >
                  </div>
                </div>
                
                <div class="relative">
                  <label class="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">Password</label>
                  <div class="relative">
                    <span class="absolute left-4 top-1/2 transform -translate-y-1/2 text-xl">🔑</span>
                    <input 
                      type="password" 
                      id="password" 
                      placeholder="Enter your password" 
                      class="w-full pl-12 pr-4 py-4 border-2 border-gray-300 rounded-xl text-black focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 outline-none transition-all placeholder-gray-400"
                      required
                    >
                  </div>
                </div>
                
                <button 
                  type="submit" 
                  class="w-full bg-gradient-to-r from-red-500 to-red-600 text-white py-4 rounded-xl font-bold text-lg hover:from-red-600 hover:to-red-700 transition-all shadow-lg transform hover:scale-[1.02] active:scale-[0.98] mt-6"
                >
                  <span class="flex items-center justify-center space-x-2">
                    <span>Open Your Gift</span>
                    <span>🎁</span>
                  </span>
                </button>
            </form>
            
            <!-- Footer -->
            <div class="mt-8 text-center border-t-2 border-gray-100 pt-6">
              <p class="font-script text-lg text-gray-600 mb-2">Made with love for the adventures ahead</p>
              <div class="text-2xl">✨💕✨</div>
            </div>
        </div>
        
        <!-- Bottom decoration -->
        <div class="fixed bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>
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