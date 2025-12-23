import { getImage, putImage } from './localImageStore'

// Local Storage Service for offline/local dev mode
const STORAGE_KEY = 'our-2026-deck-activities'

// Initialize with sample data if empty
function initializeSampleData() {
  const existing = localStorage.getItem(STORAGE_KEY)
  if (!existing) {
    const nowYear = new Date().getFullYear()

    const sampleActivities = [
      // Upcoming year sample
      {
        id: 'sample-upcoming-1',
        title: 'Richmond Park Deer Walk',
        description: 'New Year\'s walk with deer spotting and hot chocolate',
        suit: 'clubs',
        deck_year: nowYear + 1,
        planned_date: `${nowYear + 1}-01-03`,
        image_path: null,
        created_at: new Date().toISOString()
      },
      {
        id: 'sample-upcoming-2',
        title: 'Cozy Movie Marathon',
        description: 'Our favorite films, popcorn, and blankets',
        suit: 'spades',
        deck_year: nowYear + 1,
        planned_date: `${nowYear + 1}-01-10`,
        image_path: null,
        created_at: new Date().toISOString()
      },
      {
        id: 'sample-upcoming-3',
        title: 'Tate Modern Late Night',
        description: 'Art, cocktails, and culture on a Friday evening',
        suit: 'hearts',
        deck_year: nowYear + 1,
        planned_date: `${nowYear + 1}-01-17`,
        image_path: null,
        created_at: new Date().toISOString()
      },

      // Past year sample
      {
        id: 'sample-past-1',
        title: 'Our First Memory Card',
        description: `A little placeholder memory to prove the ${nowYear} tab works in local dev.`,
        suit: 'diamonds',
        deck_year: nowYear,
        planned_date: `${nowYear}-01-06`,
        image_path: null,
        created_at: new Date().toISOString()
      },
      {
        id: 'sample-past-2',
        title: 'A Cozy Night In',
        description: 'Blankets, tea, and planning our next adventure.',
        suit: 'spades',
        deck_year: nowYear,
        planned_date: `${nowYear}-01-13`,
        image_path: null,
        created_at: new Date().toISOString()
      }
    ]

    localStorage.setItem(STORAGE_KEY, JSON.stringify(sampleActivities))
  }
}

export const localStorageDB = {
  // Get all activities
  async getActivities() {
    initializeSampleData()
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : []
  },

  // Insert new activity
  async insertActivity(activity) {
    const activities = await this.getActivities()
    const newActivity = {
      ...activity,
      // Preserve provided IDs (used by year initialization) so future edits can update in-place.
      id: activity?.id || `activity-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
      created_at: activity?.created_at || new Date().toISOString()
    }
    activities.push(newActivity)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(activities))
    return { data: newActivity, error: null }
  },

  // Update activity
  async updateActivity(id, updates) {
    const activities = await this.getActivities()
    const index = activities.findIndex(a => a.id === id)
    if (index === -1) {
      return { error: { message: 'Activity not found' } }
    }
    activities[index] = { ...activities[index], ...updates }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(activities))
    return { data: activities[index], error: null }
  },

  // Delete activity
  async deleteActivity(id) {
    const activities = await this.getActivities()
    const filtered = activities.filter(a => a.id !== id)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered))
    return { error: null }
  },

  // Store image in IndexedDB as a Blob
  async uploadImage(file) {
    const imageId = `img-${Date.now()}-${Math.random().toString(36).substring(2, 11)}-${file.name}`
    await putImage(imageId, file)
    return { data: { path: imageId }, error: null }
  },

  // Get image URL (object URL)
  async getImageUrl(imagePath) {
    if (!imagePath) return null
    const blob = await getImage(imagePath)
    if (!blob) return null
    return URL.createObjectURL(blob)
  },

  // Clear all data (useful for testing)
  clearAll() {
    localStorage.removeItem(STORAGE_KEY)
    // Images are in IndexedDB; keep clearAll lightweight.
  },

  // Export data
  exportData() {
    return {
      activities: localStorage.getItem(STORAGE_KEY)
    }
  },

  // Import data
  importData(data) {
    if (data.activities) localStorage.setItem(STORAGE_KEY, data.activities)
  }
}
