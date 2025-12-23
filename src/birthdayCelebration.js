/**
 * Detects if a card is a birthday card by checking title/description for keywords.
 * Keywords: "birthday", "bday" (case-insensitive)
 */
export function isBirthdayCard(act) {
  if (!act) return false

  const title = String(act.title || '').toLowerCase()
  const desc = String(act.description || '').toLowerCase()

  const hasBirthday = title.includes('birthday') || desc.includes('birthday')
  const hasBday = title.includes('bday') || desc.includes('bday')

  return hasBirthday || hasBday
}

/**
 * Shows a celebratory overlay when a birthday card is revealed.
 * Fires every time the card is flipped to reveal.
 */
export function showBirthdayCelebration(act) {
  console.log('[Birthday] showBirthdayCelebration called for:', {
    id: act?.id,
    title: act?.title,
    isBirthday: isBirthdayCard(act)
  })

  // Check if this is a birthday card
  if (!isBirthdayCard(act)) {
    console.log('[Birthday] Not a birthday card, skipping')
    return
  }

  console.log('[Birthday] 🎉 SHOWING CELEBRATION!')

  // Create overlay
  const overlay = document.createElement('div')
  overlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 9999;
    background: rgba(0, 0, 0, 0.7);
    backdrop-filter: blur(8px);
    display: flex;
    align-items: center;
    justify-content: center;
    animation: fadeIn 0.3s ease-out;
    pointer-events: none;
  `

  // Create content
  const content = document.createElement('div')
  content.style.cssText = `
    text-align: center;
    color: white;
    animation: zoomIn 0.5s ease-out;
  `
  content.innerHTML = `
    <div style="font-size: 120px; margin-bottom: 20px; animation: bounce 1s ease-in-out infinite;">🎂</div>
    <div style="font-size: 48px; font-weight: 900; text-shadow: 0 4px 20px rgba(0,0,0,0.5); margin-bottom: 10px;">Happy Birthday!</div>
    <div style="font-size: 24px; opacity: 0.9; text-shadow: 0 2px 10px rgba(0,0,0,0.5);">A special card for a special day ✨</div>
  `

  // Create floating emojis
  const emojis = ['🎈', '🎉', '✨', '💛', '🌟', '🎊', '🎁', '🎵']
  for (let i = 0; i < 30; i++) {
    const emoji = document.createElement('div')
    emoji.textContent = emojis[i % emojis.length]
    emoji.style.cssText = `
      position: absolute;
      font-size: 40px;
      left: ${Math.random() * 100}%;
      bottom: -50px;
      animation: floatUp ${2 + Math.random() * 2}s ease-out ${Math.random() * 0.5}s forwards;
      pointer-events: none;
    `
    overlay.appendChild(emoji)
  }

  overlay.appendChild(content)
  document.body.appendChild(overlay)

  // Add animations
  const style = document.createElement('style')
  style.textContent = `
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes zoomIn {
      from { transform: scale(0.5); opacity: 0; }
      to { transform: scale(1); opacity: 1; }
    }
    @keyframes bounce {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-20px); }
    }
    @keyframes floatUp {
      to {
        transform: translateY(-120vh) rotate(${Math.random() * 360}deg);
        opacity: 0;
      }
    }
  `
  document.head.appendChild(style)

  // Remove after 3 seconds
  setTimeout(() => {
    overlay.style.animation = 'fadeIn 0.5s ease-out reverse'
    setTimeout(() => {
      overlay.remove()
      style.remove()
    }, 500)
  }, 3000)
}
