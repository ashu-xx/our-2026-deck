import { createClient } from '@supabase/supabase-js'
import './style.css'
import { renderGiftView } from './gift'
import { renderLoginView } from './views/loginView'

const isLocalDev = import.meta.env.VITE_LOCAL_DEV_MODE === 'true'

function createSupabaseClient() {
  const url = import.meta.env.VITE_SUPABASE_URL
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
  if (!url || !anonKey) {
    console.error('Missing Supabase configuration. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.')
    return null
  }
  return createClient(url, anonKey)
}

export const supabase = isLocalDev ? null : createSupabaseClient()

const app = document.querySelector('#app')

// Local dev mode mock users - No admin, everyone is equal
const LOCAL_USERS = {
  'alice@example.com': { password: 'alice123', email: 'alice@example.com', id: '1', role: 'user' },
  'bob@example.com': { password: 'bob123', email: 'bob@example.com', id: '2', role: 'user' }
}

async function init() {
  if (!app) {
    console.error('#app container missing')
    return
  }

  try {
    if (isLocalDev) {
      const localUser = JSON.parse(localStorage.getItem('localDevUser'))
      if (!localUser) {
        renderLogin()
      } else {
        renderGiftView(app, supabase)
      }
      return
    }

    if (!supabase) {
      renderLogin()
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
    } else {
      renderGiftView(app, supabase)
    }
  } catch (err) {
    console.error('Initialization error:', err)
    renderLogin()
  }
}

function renderLogin() {
  renderLoginView({
    app,
    isLocalDev,
    onSubmit: async ({ email, password }) => {
      if (isLocalDev) {
        const user = LOCAL_USERS[email]
        if (user && user.password === password) {
          localStorage.setItem('localDevUser', JSON.stringify({ email: user.email, id: user.id }))
          init()
        } else {
          alert('❌ Invalid credentials!\n\n👤 Alice: alice@example.com / alice123\n👤 Bob: bob@example.com / bob123')
        }
        return
      }

      if (!supabase) {
        alert('Supabase is not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.')
        return
      }
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) alert(error.message)
      else init()
    }
  })
}

init()