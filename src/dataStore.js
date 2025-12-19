import { appBackend } from './appBackend'

function isLocalDevMode(explicit) {
  if (typeof explicit === 'boolean') return explicit
  return import.meta.env.VITE_LOCAL_DEV_MODE === 'true'
}

/**
 * Unified data access layer.
 * Local dev uses localStorage; prod uses the remote API.
 */
export const dataStore = {
  async listActivities(explicitIsLocalDev) {
    return appBackend.listActivities(isLocalDevMode(explicitIsLocalDev))
  },

  async updateActivity(activity, explicitIsLocalDev) {
    return appBackend.updateActivity(activity, isLocalDevMode(explicitIsLocalDev))
  },

  async insertActivities(activities, explicitIsLocalDev) {
    return appBackend.insertActivities(activities, isLocalDevMode(explicitIsLocalDev))
  },

  async uploadImage(file, explicitIsLocalDev) {
    return appBackend.uploadImage(file, isLocalDevMode(explicitIsLocalDev))
  },

  async getImageUrl(imagePath, explicitIsLocalDev) {
    return appBackend.getImageUrl(imagePath, isLocalDevMode(explicitIsLocalDev))
  }
}
