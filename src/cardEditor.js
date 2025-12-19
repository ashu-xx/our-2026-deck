import { renderCardEditorView } from './views/cardEditorView'
import { dataStore } from './dataStore'

// Card Editor Modal Component
export function showCardEditor(card, isLocalDev, onSave) {
  const modal = document.createElement('div')
  modal.id = 'cardEditorModal'
  modal.className = 'fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-fade-in'

  const isEmpty = !card.title

  modal.innerHTML = renderCardEditorView({ card, isEmpty })

  document.body.appendChild(modal)

  // Event handlers
  document.getElementById('closeModal').onclick = () => modal.remove()
  document.getElementById('cancelEdit').onclick = () => modal.remove()

  document.getElementById('editCardForm').onsubmit = async (e) => {
    e.preventDefault()
    const submitBtn = e.target.querySelector('button[type="submit"]')
    submitBtn.disabled = true
    submitBtn.innerHTML = 'Saving... ⏳'

    const file = document.getElementById('editImageFile').files[0]
    let imagePath = card.image_path

    try {
      if (file) {
        const { image_path } = await dataStore.uploadImage(file, isLocalDev)
        imagePath = image_path
      }

      const plannedDateInput = document.getElementById('editPlannedDate')
      const planned_date = plannedDateInput?.value || null

      const updates = {
        title: document.getElementById('editTitle').value,
        description: document.getElementById('editDescription').value,
        suit: document.getElementById('editSuit').value,
        image_path: imagePath,
        planned_date,
        updated_at: new Date().toISOString()
      }

      if (onSave) {
        await onSave(card.id, updates)
      }

      modal.remove()
    } catch (err) {
      alert(err.message || 'Failed to save card')
      submitBtn.disabled = false
      submitBtn.innerHTML = '💾 Save Changes'
    }
  }

  // Close on backdrop click
  modal.onclick = (e) => {
    if (e.target === modal) modal.remove()
  }
}
