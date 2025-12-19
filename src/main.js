import './style.css'
import { renderGiftView } from './gift'
import { renderLoginView } from './views/loginView'
import { appBackend } from './appBackend'

const isLocalDev = import.meta.env.VITE_LOCAL_DEV_MODE === 'true'

const app = document.querySelector('#app')

async function init() {
  if (!app) {
    console.error('#app container missing')
    return
  }

  try {
    if (!appBackend.hasSession(isLocalDev)) {
      renderLogin()
      return
    }

    renderGiftView(app)
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
      try {
        await appBackend.login({ email, password }, isLocalDev)
        init()
      } catch {
        if (isLocalDev) {
          alert('❌ Invalid credentials!\n\nSet local users in .env via VITE_LOCAL_USERS (email:password,...)')
        } else {
          alert('❌ Invalid credentials for this deployment.')
        }
      }
    }
  })
}

init()