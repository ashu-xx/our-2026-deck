import { renderGiftView } from './gift'

export async function renderAdminDashboard(app, supabase) {
  // No admin-specific features - everyone is equal
  await renderGiftView(app, supabase, false)
}

