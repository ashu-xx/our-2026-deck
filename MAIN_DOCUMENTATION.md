# 🎴 Our 2026 Adventure Deck - Complete Documentation

## 📖 Overview

A beautiful, interactive card deck web application for tracking 52 weeks of adventures together! Create, edit, and manage activity cards across two years (2025 memories and 2026 future plans) with a festive, romantic theme.

---

## ✨ Current Features

### 🎴 Card System
- **52 Regular Cards** per year (weeks 1-52)
- **2 Joker Cards** per year (weeks 53-54 for wild card adventures)
- **Dual Year System** - 2025 (past memories) and 2026 (upcoming adventures)
- **Auto-initialization** - Cards automatically created on first login

### ⚡ Card Interactions
- **Click to Flip** - View front and back of each card
- **Edit Any Card** - Blue "✏️ Edit" button on both front and back
- **Upload Images** - Add photos to document memories or plan future activities
- **Mark Complete** - Double-tap cards from upcoming year to mark as done
- **Celebration Animation** - 🎉 appears when marking cards complete

### 🎨 Card Categories (Suits)

#### ♥️ Hearts - Cultural & Social (Weeks 1-13)
- **Color**: Soft Pink
- **Examples**: Museums, theatre, concerts, restaurants, art exhibitions, social events

#### ♦️ Diamonds - Adventures & Exploration (Weeks 14-26)
- **Color**: Golden Yellow
- **Examples**: Weekend getaways, day trips, new neighborhoods, tours, travel

#### ♣️ Clubs - Nature & Outdoors (Weeks 27-39)
- **Color**: Mint Green
- **Examples**: Parks, gardens, nature walks, wildlife watching, outdoor activities

#### ♠️ Spades - Cozy & Creative (Weeks 40-52)
- **Color**: Lavender
- **Examples**: Home dates, cooking together, crafts, movie nights, relaxation

#### 🃏 Joker - Wild Card (Weeks 53-54)
- **Color**: Rainbow Shimmer
- **Examples**: Surprise dates, spontaneous adventures, unique experiences

### 👥 User System
- **Two Equal Users**: Alice and Bob
- **No Admin** - Everyone has the same permissions
- **Yellow Avatars** - Shows user initial (A or B)
- **Same Features** - Both users can edit all cards

### 🎯 User Capabilities
- ✅ View all cards for both years
- ✅ Edit any card (title, description, suit, image)
- ✅ Upload and update images
- ✅ Mark cards as complete (upcoming year only)
- ✅ Switch between 2025 (past) and 2026 (upcoming)
- ✅ Flip cards to see details
- ✅ Access from any device (data syncs)

---

## 🔐 Login Credentials

### Test Accounts (Local Dev Mode)

| User | Email | Password | Avatar |
|------|-------|----------|--------|
| **Alice** | alice@example.com | alice123 | Yellow "A" |
| **Bob** | bob@example.com | bob123 | Yellow "B" |

---

## 🎨 User Interface

### Navigation Bar (Top)
- **Logo**: 💝 Our 2026 Deck
- **User Avatar**: Yellow circle with initial
- **Username**: Displays before @
- **Logout Button**: 🚪 Red button (always visible)

### Header Section
- **Title**: "Our Adventures Together"
- **Subtitle**: "52 Weeks, Infinite Memories ✨"
- **Year Toggle**: Two buttons to switch between years
  - 📸 2025 Memories (shows past year cards)
  - 🎴 2026 Adventures (shows upcoming year cards)

### Card Grid
- **Responsive Layout**: 1-6 columns based on screen size
- **Card Back**: Shows suit symbol, emoji, week number, category, and edit button
- **Card Front**: Shows image, title, description, status badge, and edit button

### Edit Card Modal
- **Opens when** clicking any "✏️ Edit" button
- **Fields**:
  - Activity Title
  - Description
  - Category/Suit selector
  - Image upload
- **Actions**: Save Changes or Cancel

---

## 🚀 How to Use

### 1. Login
1. Open the application
2. Enter credentials for Alice or Bob
3. Click "Open Your Gift 🎁"

### 2. View Cards
- See 54 cards for the selected year (default: 2026)
- Click year toggle buttons to switch between 2025 and 2026
- Scroll through the card grid

### 3. Flip Cards
- Click any card to flip it
- See week number and category on back
- See image and details on front

### 4. Edit Cards
1. Click the blue "✏️ Edit" button on any card
2. Update title, description, or category
3. Upload an image (optional)
4. Click "💾 Save Changes"
5. Card updates immediately

### 5. Mark Complete (2026 Only)
1. Find a card from 2026
2. Double-tap the card
3. See 🎉 celebration animation
4. Card shows "✓ COMPLETED! 🎉" badge
5. Double-tap again to unmark

### 6. Logout
- Click the 🚪 Logout button in top-right
- Returns to login screen

---

## 💻 Technical Details

### Tech Stack
- **Frontend**: Vanilla JavaScript, HTML, CSS
- **Styling**: Tailwind CSS v4
- **Build Tool**: Vite
- **Database**: Supabase (production) or Local Storage (dev mode)
- **Storage**: Supabase Storage (images) or Base64 (dev mode)

### File Structure
```
src/
├── main.js              # App initialization, login, routing
├── gift.js              # Main card view for all users
├── admin.js             # Simplified (just renders gift view)
├── cardEditor.js        # Edit card modal component
├── cardInitializer.js   # Year setup and card creation
├── localStorage.js      # Local storage service (dev mode)
└── style.css            # Custom styles and animations
```

### Data Structure
```javascript
{
  id: "activity-123",
  title: "Week 1",
  description: "Activity description",
  suit: "hearts", // hearts, diamonds, clubs, spades, joker
  deck_year: 2026, // 2025 or 2026
  week_number: 1, // 1-54
  image_path: "path/to/image",
  is_used: false, // completion status
  created_at: "2025-12-19T..."
}
```

### Local Dev Mode
- **Enabled**: When `VITE_LOCAL_DEV_MODE=true`
- **Storage**: Browser localStorage
- **Images**: Stored as base64
- **Users**: Mock authentication (Alice, Bob)
- **Data Persistence**: Survives page refresh (local to browser)

### Production Mode
- **Database**: Supabase PostgreSQL
- **Authentication**: Supabase Auth
- **Images**: Supabase Storage
- **Users**: Real authentication required

---

## 🎯 Workflows

### New User First Login
1. Login with credentials
2. `checkAndInitializeYear()` runs for 2025 and 2026
3. 54 cards created for each year (if they don't exist)
4. Cards displayed in grid
5. Ready to edit!

### Edit a Card
1. Click "✏️ Edit" button
2. Modal opens with current data
3. Update fields as needed
4. Upload image (optional)
5. Click "Save Changes"
6. Updates saved to database
7. Page reloads with updated card

### Mark Card Complete
1. View 2026 cards
2. Double-tap a card
3. `is_used` field toggles
4. UI updates with green "COMPLETED" badge
5. 🎉 animation plays
6. Page reloads

### Switch Years
1. Click year button (2025 or 2026)
2. `loadYear()` function runs
3. Cards filtered by year
4. Grid re-renders with selected year's cards

---

## 🎨 Design System

### Color Palette
- **Primary Green**: `#1e5128` (Christmas green)
- **Gold**: `#ffd700` (accent color)
- **Red**: `#d63447` (Christmas red, CTAs)
- **Soft Pink**: `#ffe5e5` (Hearts suit)
- **Lavender**: `#d4a5f9` (Spades suit)
- **Mint**: `#a7f3d0` (Clubs suit)

### Typography
- **Headings**: Pacifico (festive, handwritten)
- **Subheadings**: Dancing Script (elegant, flowing)
- **Body**: Poppins (clean, modern)

### Animations
- **Float**: Gentle up/down (decorative emojis)
- **Float Reverse**: Reverse floating
- **Sparkle**: Pulsing opacity/scale
- **Slide In**: Entry animation
- **Card Flip**: 3D rotation on click
- **Shimmer**: Gradient movement (joker cards)

### Responsive Breakpoints
- **Mobile**: 1 column
- **Tablet (sm)**: 2 columns
- **Desktop (md)**: 3 columns
- **Large (lg)**: 4 columns
- **XL**: 6 columns

---

## 📋 Features Summary

### What Users Can Do
✅ Login as Alice or Bob
✅ View 54 cards per year (52 regular + 2 jokers)
✅ Switch between 2025 (past) and 2026 (upcoming)
✅ Click cards to flip and view details
✅ Edit any card (title, description, suit, image)
✅ Upload photos for activities
✅ Mark 2026 cards as complete (double-tap)
✅ See celebration animation when completing
✅ Logout anytime

### What's Automatic
✅ Cards auto-created on first login (54 per year)
✅ Cards distributed across 4 suits intelligently
✅ Year configuration updates automatically
✅ Images optimized and stored
✅ Data syncs across sessions

### What's NOT Included
❌ Admin privileges (removed)
❌ Initialize year button (removed)
❌ Role-based permissions (everyone equal)
❌ Card deletion (only editing)
❌ Bulk operations
❌ Data export/import (in production mode)

---

## 🔧 Development

### Getting Started
```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build
```

### Environment Variables
```
VITE_LOCAL_DEV_MODE=true           # Enable local dev mode
VITE_SUPABASE_URL=your_url         # Supabase project URL
VITE_SUPABASE_ANON_KEY=your_key    # Supabase anon key
```

### Local Storage Structure
```javascript
// Activities
localStorage.getItem('our-2026-deck-activities')
// Array of activity objects

// Images (dev mode)
localStorage.getItem('our-2026-deck-images')
// Object mapping image IDs to base64 data

// User session (dev mode)
localStorage.getItem('localDevUser')
// { email: "alice@example.com", id: "1" }
```

---

## 🐛 Troubleshooting

### Cards Don't Appear
1. Open DevTools console (F12)
2. Check for JavaScript errors
3. Verify `checkAndInitializeYear()` ran
4. Clear localStorage: `localStorage.clear()`
5. Reload page

### Can't Edit Cards
1. Verify you're logged in
2. Check if edit buttons are visible
3. Try clicking different cards
4. Check console for errors

### Images Not Uploading
1. Check file size (< 5MB recommended)
2. Verify file format (jpg, png, gif, webp)
3. Check browser console for errors
4. Try a different image

### Wrong Year Showing
1. Click the correct year button
2. Verify `pastYear` and `upcomingYear` variables
3. Check if cards exist for that year
4. Reload page

---

## 📊 Quick Reference

### Keyboard Shortcuts
- None (mobile-friendly app)

### Card States
- **Empty**: No title/description
- **Populated**: Has title and description
- **With Image**: Has uploaded photo
- **Completed**: Marked as done (2026 only)

### Week Distribution
- Weeks 1-13: ♥️ Hearts (Cultural)
- Weeks 14-26: ♦️ Diamonds (Adventures)
- Weeks 27-39: ♣️ Clubs (Nature)
- Weeks 40-52: ♠️ Spades (Cozy)
- Weeks 53-54: 🃏 Jokers (Wild Cards)

### Status Badges
- **2025**: "Beautiful Memory 💕" (pink)
- **2026 Pending**: "⚡ DOUBLE TAP TO MARK DONE" (yellow)
- **2026 Complete**: "✓ COMPLETED! 🎉" (green)

---

## 🎊 Best Practices

### For Users
1. **Add photos early** - Capture memories while fresh
2. **Use descriptive titles** - Make cards memorable
3. **Fill descriptions** - Add context and details
4. **Choose right suit** - Helps organize activities
5. **Edit jokers creatively** - Use for unique plans

### For Developers
1. **Test both users** - Alice and Bob should work identically
2. **Clear localStorage** - When testing new features
3. **Check both years** - 2025 and 2026 should both work
4. **Verify edit modal** - Test all form fields
5. **Test responsive** - Check mobile, tablet, desktop

---

## 🎯 Future Enhancement Ideas

### Potential Additions
- Filter by suit/category
- Search functionality
- Sort cards (by week, completion, suit)
- Print view
- Export as PDF
- Card duplication
- Undo/redo edits
- Dark mode
- More year options (2027+)
- Statistics dashboard
- Progress tracking charts

---

## 📚 Additional Resources

### Related Files
- `QUICKSTART.md` - Quick setup guide
- `LOCAL_DEV.md` - Local development setup
- `SAMPLE_ACTIVITIES.md` - Activity ideas
- `LOGIN_CREDENTIALS.md` - User accounts

### External Links
- [Tailwind CSS Documentation](https://tailwindcss.com)
- [Vite Documentation](https://vitejs.dev)
- [Supabase Documentation](https://supabase.com/docs)

---

## 🎉 Summary

**Our 2026 Adventure Deck** is a fully-featured, beautiful card management application for tracking shared adventures across two years. With automatic card initialization, easy editing, image uploads, and a festive design, it provides an intuitive way to plan and remember special moments together.

**Key Highlights:**
- 🎴 108 total cards (54 per year)
- 👥 2 equal users (Alice & Bob)
- ✏️ Full card editing capabilities
- 📸 Image upload support
- 🎨 Beautiful, responsive design
- 🔄 Dual year system (past & future)
- ⚡ No admin complexity - everyone is equal

**Ready to create amazing memories!** 💝

---

**Version**: 1.0
**Last Updated**: December 19, 2025
**Status**: ✅ Production Ready

