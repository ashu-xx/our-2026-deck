import './style.css'
import { renderGiftView } from './gift'
import { renderLoginView } from './views/loginView'
import { appBackend } from './appBackend'
import { renderAllCardsByYearView } from './views/allCardsByYearView'

const isLocalDev = import.meta.env.VITE_LOCAL_DEV_MODE === 'true'

const app = document.querySelector('#app')

function parseAllCardsRoute() {
  const url = new URL(window.location.href)

  // Support:
  // - /all
  // - /all/2026
  // - /all?year=2026
  const path = url.pathname.replace(/\/+$/, '')

  const isAllRoot = path === '/all'
  const m = /^\/all\/(\d{4})$/.exec(path)
  const yearFromPath = m ? Number(m[1]) : null

  const yearFromQuery = url.searchParams.get('year') ? Number(url.searchParams.get('year')) : null

  if (!isAllRoot && !yearFromPath && !yearFromQuery) return null

  // If user only typed /all, default to upcoming year (so it always works)
  const defaultYear = new Date().getFullYear() + 1

  const year = yearFromPath || yearFromQuery || defaultYear
  if (!year || Number.isNaN(year)) return null

  return { year }
}

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

    const hiddenRoute = parseAllCardsRoute()
    if (hiddenRoute) {
      await renderAllCardsByYearView({ app, year: hiddenRoute.year, isLocalDev })
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