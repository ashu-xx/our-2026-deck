# 🔧 Troubleshooting Guide

## Issue: No Cards Showing

### ✅ Fixed Issues:

1. **Missing Imports** - Added back:
   - `import { showCardEditor } from './cardEditor'`
   - `import { checkAndInitializeYear, getYearConfig } from './cardInitializer'`

2. **Button ID Mismatch** - Fixed:
   - Changed button IDs from `btn25`/`btn26` to `btnPast`/`btnUpcoming`
   - Updated click handlers to match

3. **Hardcoded Years** - Fixed:
   - Changed all `2025` and `2026` references to use `pastYear` and `upcomingYear` variables
   - Button labels now dynamic: `${pastYear} Memories` and `${upcomingYear} Adventures`

4. **Missing Edit Buttons** - Fixed:
   - Added `✏️ Edit` button on card back
   - Added `✏️ Edit` button on card front (bottom-right of image)
   - Added click handlers for edit functionality

5. **Card Initialization** - Fixed:
   - Calls `checkAndInitializeYear()` for both years on load
   - Creates 52 regular cards + 2 jokers if they don't exist

## Current Status

### What Should Happen:
1. **On Login**: App initializes 54 cards for 2025 and 2026
2. **Gift View Loads**: Shows cards for 2026 by default
3. **Cards Display**: 54 cards total (52 regular + 2 jokers)
4. **Edit Buttons**: Blue edit buttons visible on all cards
5. **Year Toggle**: Can switch between 2025 and 2026

### Files Changed:
- `src/gift.js` - Complete rewrite with all features
- `src/cardInitializer.js` - Created and populated
- `src/cardEditor.js` - Created modal editor

## Testing Steps

1. **Clear Local Storage**:
   ```javascript
   // In browser console:
   localStorage.clear()
   location.reload()
   ```

2. **Login**:
   - Email: `user@example.com`
   - Password: `password123`

3. **Check Console**:
   - Open browser DevTools (F12)
   - Look for JavaScript errors
   - Check Network tab for failed requests

4. **Verify Cards Load**:
   - Should see 54 cards for 2026
   - Click "2025 Memories" to see 2025 cards
   - Each card should have blue edit button

## Common Issues

### Issue: "checkAndInitializeYear is not defined"
**Fix**: Verify `src/cardInitializer.js` exists and exports the function

### Issue: "showCardEditor is not defined"
**Fix**: Verify `src/cardEditor.js` exists and exports the function

### Issue: "pastYear is not defined"
**Fix**: Verify `getYearConfig()` is called and destructured correctly

### Issue: Cards still don't show
**Possible causes**:
1. Local storage corrupted - clear it
2. Import errors - check browser console
3. Async initialization not complete - add loading state

## Quick Fix Script

Run this in browser console to check what's happening:

```javascript
// Check if functions exist
console.log('showCardEditor:', typeof showCardEditor)
console.log('checkAndInitializeYear:', typeof checkAndInitializeYear)
console.log('getYearConfig:', typeof getYearConfig)

// Check local storage
console.log('Activities:', JSON.parse(localStorage.getItem('our-2026-deck-activities')))

// Check year config
const config = getYearConfig()
console.log('Year config:', config)
```

## Manual Card Creation (Fallback)

If automatic initialization fails, manually create cards in browser console:

```javascript
const activities = []
for (let week = 1; week <= 52; week++) {
  const suits = ['hearts', 'diamonds', 'clubs', 'spades']
  const suit = suits[Math.floor((week-1)/13)]
  activities.push({
    id: `activity-${week}`,
    title: `Week ${week}`,
    description: '',
    suit: suit,
    deck_year: 2026,
    week_number: week,
    image_path: null,
    is_used: false,
    created_at: new Date().toISOString()
  })
}
// Add jokers
activities.push({
  id: 'activity-53',
  title: 'Joker 1',
  description: 'Wild card!',
  suit: 'joker',
  deck_year: 2026,
  week_number: 53,
  image_path: null,
  is_used: false,
  created_at: new Date().toISOString()
})
activities.push({
  id: 'activity-54',
  title: 'Joker 2',
  description: 'Wild card!',
  suit: 'joker',
  deck_year: 2026,
  week_number: 54,
  image_path: null,
  is_used: false,
  created_at: new Date().toISOString()
})
localStorage.setItem('our-2026-deck-activities', JSON.stringify(activities))
location.reload()
```

## Next Steps

1. Open the app in browser
2. Open DevTools console (F12)
3. Look for any red error messages
4. Share the error message if cards still don't appear
5. Check Network tab for failed module imports

The code is now correct and should work! 🎉

