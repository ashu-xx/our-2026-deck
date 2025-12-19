// Local Storage Service for offline/local dev mode
const STORAGE_KEY = 'our-2026-deck-activities'
const IMAGES_KEY = 'our-2026-deck-images'

// Initialize with sample data if empty
function initializeSampleData() {
  const existing = localStorage.getItem(STORAGE_KEY)
  if (!existing) {
    const sampleActivities = [
      {
        id: 'sample-1',
        title: 'Richmond Park Deer Walk',
        description: 'New Year\'s walk with deer spotting and hot chocolate',
        suit: 'clubs',
        deck_year: 2026,
        week_number: 1,
        image_path: null,
        is_used: false,
        created_at: new Date().toISOString()
      },
      {
        id: 'sample-2',
        title: 'Cozy Movie Marathon',
        description: 'Our favorite films, popcorn, and blankets',
        suit: 'spades',
        deck_year: 2026,
        week_number: 2,
        image_path: null,
        is_used: false,
        created_at: new Date().toISOString()
      },
      {
        id: 'sample-3',
        title: 'Tate Modern Late Night',
        description: 'Art, cocktails, and culture on a Friday evening',
        suit: 'hearts',
        deck_year: 2026,
        week_number: 3,
        image_path: null,
        is_used: false,
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
      id: `activity-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
      created_at: new Date().toISOString(),
      is_used: false
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

  // Store image as base64
  async uploadImage(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => {
        const images = JSON.parse(localStorage.getItem(IMAGES_KEY) || '{}')
        const imageId = `img-${Date.now()}-${file.name}`
        images[imageId] = {
          data: reader.result,
          name: file.name,
          type: file.type
        }
        localStorage.setItem(IMAGES_KEY, JSON.stringify(images))
        resolve({ data: { path: imageId }, error: null })
      }
      reader.onerror = () => reject({ error: { message: 'Failed to read image' } })
      reader.readAsDataURL(file)
    })
  },

  // Get image URL
  getImageUrl(imagePath) {
    if (!imagePath) return null
    const images = JSON.parse(localStorage.getItem(IMAGES_KEY) || '{}')
    return images[imagePath]?.data || null
  },

  // Clear all data (useful for testing)
  clearAll() {
    localStorage.removeItem(STORAGE_KEY)
    localStorage.removeItem(IMAGES_KEY)
  },

  // Export data
  exportData() {
    return {
      activities: localStorage.getItem(STORAGE_KEY),
      images: localStorage.getItem(IMAGES_KEY)
    }
  },

  // Import data
  importData(data) {
    if (data.activities) localStorage.setItem(STORAGE_KEY, data.activities)
    if (data.images) localStorage.setItem(IMAGES_KEY, data.images)
  }
}

