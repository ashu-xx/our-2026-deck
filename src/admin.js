import { renderGiftView } from './gift'

export async function renderAdminDashboard(app) {
  // No admin-specific features - everyone is equal
  await renderGiftView(app)
}
