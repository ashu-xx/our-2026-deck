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

  const submitBtn = modal.querySelector('button[type="submit"]')
  let pendingImagePath = card.image_path
  let isUploading = false

  // Event handlers
  document.getElementById('closeModal').onclick = () => modal.remove()
  document.getElementById('cancelEdit').onclick = () => modal.remove()

  const fileInput = document.getElementById('editImageFile')
  const fileStatus = document.getElementById('editImageStatus')

  fileInput.onchange = async () => {
    const file = fileInput.files[0]
    if (!file) return
    try {
      isUploading = true
      if (submitBtn) {
        submitBtn.disabled = true
        submitBtn.innerHTML = 'Uploading…'
      }
      fileStatus.textContent = 'Uploading…'
      fileStatus.classList.remove('text-green-600', 'text-red-600')
      fileStatus.classList.add('text-gray-700')

      const { image_path } = await dataStore.uploadImage(file, isLocalDev)
      pendingImagePath = image_path

      fileStatus.textContent = 'Uploaded'
      fileStatus.classList.remove('text-gray-700', 'text-red-600')
      fileStatus.classList.add('text-green-600')
    } catch (err) {
      fileStatus.textContent = err?.message || 'Upload failed'
      fileStatus.classList.remove('text-gray-700', 'text-green-600')
      fileStatus.classList.add('text-red-600')
      pendingImagePath = card.image_path
    } finally {
      isUploading = false
      if (submitBtn) {
        submitBtn.disabled = false
        submitBtn.innerHTML = '💾 Save Changes'
      }
    }
  }

  document.getElementById('editCardForm').onsubmit = async (e) => {
    e.preventDefault()
    if (isUploading) {
      fileStatus.textContent = 'Please wait: upload in progress…'
      fileStatus.classList.remove('text-green-600')
      fileStatus.classList.add('text-gray-700')
      return
    }
    const submitBtn = e.target.querySelector('button[type="submit"]')
    submitBtn.disabled = true
    submitBtn.innerHTML = 'Saving... ⏳'

    const file = fileInput.files[0]

    try {
      if (file && !pendingImagePath) {
        const { image_path } = await dataStore.uploadImage(file, isLocalDev)
        pendingImagePath = image_path
      }

      const plannedDateInput = document.getElementById('editPlannedDate')
      const planned_date = plannedDateInput?.value || null

      const updates = {
        title: document.getElementById('editTitle').value,
        description: document.getElementById('editDescription').value,
        suit: document.getElementById('editSuit').value,
        planned_date,
        updated_at: new Date().toISOString()
      }

      if (pendingImagePath) updates.image_path = pendingImagePath

      if (onSave) {
        await onSave(card.id, updates)
      }

      modal.remove()
    } catch (err) {
      alert(err?.message || 'Failed to save card')
      submitBtn.disabled = false
      submitBtn.innerHTML = '💾 Save Changes'
    }
  }

  // Close on backdrop click
  modal.onclick = (e) => {
    if (e.target === modal) modal.remove()
  }
}
