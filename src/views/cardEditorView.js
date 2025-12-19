export function renderCardEditorView({ card, isEmpty }) {
  return `
    <div class="surface-card max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-slide-in">
      <div class="sticky top-0 bg-gradient-to-r from-xmas-green to-green-900 text-white p-6 rounded-t-2xl border-b-4 border-gold">
        <div class="flex justify-between items-center">
          <div>
            <h2 class="text-2xl font-festive">${isEmpty ? 'Create' : 'Edit'} Card 🎴</h2>
            <p class="text-sm text-white/80 mt-1">${card.deck_year}</p>
          </div>
          <button id="closeModal" class="text-white hover:text-gold transition text-2xl">&times;</button>
        </div>
      </div>
      
      <form id="editCardForm" class="p-6 space-y-5">
        <div>
          <label class="text-xs font-bold uppercase text-gray-700 block mb-2">Planned Date</label>
          <input
            type="date"
            id="editPlannedDate"
            value="${card.planned_date || ''}"
            class="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200 outline-none"
          >
          <p class="text-xs text-gray-500 mt-1">This controls which month the card appears in, and ordering within the month.</p>
        </div>

        <div>
          <label class="text-xs font-bold uppercase text-gray-700 block mb-2">Activity Title</label>
          <input
            type="text"
            id="editTitle"
            value="${card.title || ''}"
            placeholder="e.g., Kew Gardens Adventure 🌺"
            class="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200 outline-none"
            required
          >
        </div>

        <div>
          <label class="text-xs font-bold uppercase text-gray-700 block mb-2">Description</label>
          <textarea
            id="editDescription"
            placeholder="A brief description of this activity..."
            class="w-full p-3 border-2 border-gray-300 rounded-lg h-24 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200 outline-none"
          >${card.description || ''}</textarea>
        </div>

        <div>
          <label class="text-xs font-bold uppercase text-gray-700 block mb-3">Category (Suit)</label>
          <select id="editSuit" class="w-full p-3 border-2 border-gray-300 rounded-lg bg-white focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200 outline-none">
            <option value="hearts" ${card.suit === 'hearts' ? 'selected' : ''}>♥️ Hearts - Cultural & Social</option>
            <option value="diamonds" ${card.suit === 'diamonds' ? 'selected' : ''}>♦️ Diamonds - Adventures & Exploration</option>
            <option value="clubs" ${card.suit === 'clubs' ? 'selected' : ''}>♣️ Clubs - Nature & Outdoors</option>
            <option value="spades" ${card.suit === 'spades' ? 'selected' : ''}>♠️ Spades - Cozy & Creative</option>
            <option value="joker" ${card.suit === 'joker' ? 'selected' : ''}>🃏 Joker - Wild Card</option>
          </select>
        </div>

        <div class="p-5 border-2 border-dashed border-yellow-400 rounded-lg bg-yellow-50">
          <label class="block text-sm font-bold mb-2 text-gray-700">📸 Activity Image</label>
          ${card.image_path ? `<div class="mb-3 text-xs text-green-600">✓ Current image will be replaced if you upload a new one</div>` : ''}
          <input
            type="file"
            id="editImageFile"
            accept="image/*"
            class="text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-yellow-400 file:text-gray-700 hover:file:bg-yellow-500 file:cursor-pointer"
          >
        </div>

        <div class="flex gap-3 pt-4">
          <button
            type="submit"
            class="btn btn-success flex-1 py-3 rounded-xl font-bold shadow-lg transition-all transform hover:scale-[1.02]"
          >
            💾 Save Changes
          </button>
          <button
            type="button"
            id="cancelEdit"
            class="px-6 bg-gray-200 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-300 transition-all"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  `
}
