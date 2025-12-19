# 🎴 Our 2026 Adventure Deck

A beautiful, interactive card deck web application celebrating 52 weeks of adventures together in 2026! Each card represents a weekly activity across 4 different categories, with a whimsical theme featuring animals, flowers, and festive touches.

## 📖 Complete Documentation

**👉 See [MAIN_DOCUMENTATION.md](MAIN_DOCUMENTATION.md) for complete, up-to-date functionality and features!**

## ✨ Quick Overview

- 🎴 **108 Cards Total** - 54 cards per year (52 regular + 2 jokers)
- 🔄 **Dual Year System** - 2025 memories and 2026 future plans
- ✏️ **Full Editing** - All users can edit any card
- 📸 **Image Uploads** - Add photos to cards
- 👥 **Two Users** - Alice and Bob (equal permissions)
- 🎨 **Beautiful UI** - Festive, responsive design
- ⚡ **Interactive** - Click to flip, double-tap to complete

## 🔐 Login

### Local development (localStorage)
Set in `.env`:
- `VITE_LOCAL_DEV_MODE=true`
- `VITE_LOCAL_USERS=alice@example.com:alice123,bob@example.com:bob123`

The app will show the login screen and validate against `VITE_LOCAL_USERS`, then store a local session in `localStorage`.

### Production on Vercel (KV + Blob)
Set in Vercel Project → Settings → Environment Variables:
- `VITE_LOCAL_DEV_MODE=false`
- `APP_LOGIN_EMAIL=...`
- `APP_LOGIN_PASSWORD=...`

The UI login stores a Basic-Auth token in the browser and all `/api/*` routes verify it against `APP_LOGIN_EMAIL` / `APP_LOGIN_PASSWORD`.

> Important: `APP_LOGIN_EMAIL` / `APP_LOGIN_PASSWORD` are server-only (do **not** prefix with `VITE_`).


## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

Access the app at http://localhost:5173

## 🎭 The 4 Card Suits (Activity Categories)

### ♥️ Hearts - Cultural & Social
**Emoji: 🎭 | Color: Soft Pink**

Perfect for arts, culture, and social experiences:
- Museum visits (Natural History, V&A, Tate Modern, British Museum)
- Theatre shows (West End, National Theatre, Shakespeare's Globe)
- Live music & concerts
- Art exhibitions & galleries
- Fancy dinners & restaurant explorations
- Wine tasting or cocktail making classes
- Comedy shows at the Soho Theatre
- Book readings or literary events
- Opera or ballet performances
- Cultural festivals in London

### ♦️ Diamonds - Adventures & Exploration
**Emoji: 🗺️ | Color: Golden Yellow**

For exploring new places and having adventures:
- Weekend getaways (Brighton, Oxford, Cambridge, Bath)
- Day trips to nearby towns
- Exploring new London neighborhoods
- Walking tours (hidden London, historical walks)
- Harry Potter Studio Tour
- Warner Bros. Studio Tour
- Boat trips on the Thames
- Visit to Stonehenge or other landmarks
- Food market adventures (Borough Market, Camden)
- Escape rooms
- Ghost tours
- Hot air balloon ride

### ♣️ Clubs - Nature & Outdoors
**Emoji: 🦋 | Color: Mint Green**

For connecting with nature and enjoying the outdoors:
- Kew Gardens visits
- Richmond Park deer spotting
- Hampstead Heath walks
- Hyde Park picnics
- Regents Park & Primrose Hill
- London Wetland Centre
- RHS Wisley gardens
- Cycling along the Thames
- Outdoor yoga or fitness
- Cherry blossom viewing (spring)
- Hampton Court Palace gardens
- Woodland walks in Epping Forest
- Wildlife photography
- Outdoor cinema in summer

### ♠️ Spades - Cozy & Creative
**Emoji: 🏠 | Color: Lavender**

For intimate, creative, and relaxing experiences:
- Cooking dinner together (trying new recipes)
- Board game nights
- Movie marathons
- Home spa day
- Arts and crafts projects
- Pottery or painting classes
- Baking challenges
- Book club for two
- Puzzle building
- Stargazing from home/balcony
- Indoor plant care & gardening
- Learning something new together online
- Photography projects
- Writing love letters to each other

### 🃏 Joker - Wild Card (Up to 2 cards)
**Emoji: 🌟 | Color: Rainbow Shimmer**

For truly unique, spontaneous, or surprise activities:
- Surprise date planned by one person
- Completely spontaneous adventure
- "Say yes to everything" day
- Random act of kindness day
- Fulfilling a childhood dream
- Trying something neither has done before

## 🚀 Getting Started

### Prerequisites
- Node.js 18+

### Installation

1. **Install dependencies:**

```bash
npm install
```

2. **Configure environment variables**

Copy `.env.example` to `.env` and adjust values:

```bash
cp .env.example .env
```

3. **Run the app**

```bash
npm run dev
```

### Production setup on Vercel

In Vercel Project → Settings → Environment Variables:
- Set `VITE_LOCAL_DEV_MODE=false`
- Set `APP_LOGIN_EMAIL` and `APP_LOGIN_PASSWORD`
- Add Vercel KV + Blob to the project (Storage tab)


## 🗄️ Database Schema

### Activities Table
```sql
create table activities (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  title text not null,
  description text,
  suit text not null, -- 'hearts', 'diamonds', 'clubs', 'spades', 'joker'
  deck_year integer not null, -- 2025 or 2026
  week_number integer not null, -- 1-52
  image_path text,
  is_used boolean default false
);
```

### Storage Bucket
- Bucket name: `activity-images`
- Public access: enabled
- Allowed file types: images

## 🎨 Theme & Design

The design incorporates:
- **Festive Colors**: Christmas reds and greens with golden accents
- **Whimsical Elements**: Floating animals (🦋🦊🐦) and flowers (🌸🌺🌻)
- **Beautiful Typography**: Pacifico for headings, Dancing Script for accents
- **Smooth Animations**: Floating, sparkle, and slide-in effects
- **Card Flip Mechanics**: Interactive 3D flip animations

## 📖 How to Use

### As an Admin:
1. Log in with your admin credentials
2. Add activities one by one
3. Choose the appropriate suit (category)
4. Upload photos (memories from 2025, or placeholders for 2026)
5. Assign week numbers (1-52)

### As the Gift Recipient:
1. Log in with user credentials
2. View all 52 cards (plus jokers)
3. Click any card to flip and see the activity
4. Switch between 2025 Memories and 2026 Adventures
5. Double-tap 2026 cards to mark them as complete when done!

## 💡 Activity Ideas for London-Based Couple

### Week-by-Week Suggestions:

**January (Weeks 1-4):**
1. New Year's walk in Richmond Park 🦌
2. Cozy movie marathon at home 🏠
3. Visit the London Eye for winter views 🗺️
4. Try a new recipe - make fresh pasta 🏠

**February (Weeks 5-8):**
5. Valentine's dinner at a special restaurant ♥️
6. Visit a contemporary art gallery 🎭
7. Spa day at home ♠️
8. Explore a new London neighborhood 🗺️

**March (Weeks 9-13):**
9. Spring gardens at Kew 🦋
10. Theatre show in the West End 🎭
11. Weekend trip to Oxford 🗺️
12. Cooking class together ♠️
13. Cherry blossom viewing 🦋

**April (Weeks 14-17):**
14. Hampton Court Palace 🦋
15. Escape room challenge 🗺️
16. Pottery painting class ♠️
17. Borough Market food adventure ♥️

**May (Weeks 18-22):**
18. Thames boat cruise 🗺️
19. Outdoor cinema preparation ♠️
20. Visit to Brighton 🗺️
21. Primrose Hill picnic 🦋
22. Jazz night at Ronnie Scott's 🎭

**June (Weeks 23-26):**
23. Wimbledon (or pub screening) ♥️
24. Regent's Park open air theatre 🎭
25. Garden party at home ♠️
26. Day trip to Cambridge 🗺️

**July (Weeks 27-31):**
27. Outdoor cinema in the park ♥️
28. Hyde Park summer festival 🦋
29. Cocktail making class 🎭
30. Cycling along the Thames 🦋
31. Weekend getaway to Bath 🗺️

**August (Weeks 32-35):**
32. Notting Hill Carnival 🎭
33. Kew Gardens summer evening 🦋
34. Sunset at Primrose Hill 🦋
35. Home BBQ night ♠️

**September (Weeks 36-39):**
36. London Fashion Week events 🎭
37. Autumn walk in Hampstead Heath 🦋
38. Wine tasting experience ♥️
39. Museum late night event 🎭

**October (Weeks 40-44):**
40. Halloween movie marathon ♠️
41. Ghost tour of London 🗺️
42. Pumpkin carving night ♠️
43. Harvest festival cooking ♠️
44. Autumn photography walk 🦋

**November (Weeks 45-48):**
45. Guy Fawkes fireworks 🦋
46. Cozy board game night ♠️
47. Christmas market visit 🎭
48. Thames riverside walk 🦋

**December (Weeks 49-52):**
49. Christmas lights tour 🗺️
50. Festive afternoon tea ♥️
51. Winter garden at Kew 🦋
52. New Year's Eve celebration 🃏

## 🎁 Tips for Making This Special

1. **Add Personal Photos**: Use real photos from your 2025 memories for the 2025 deck
2. **Write Loving Descriptions**: Make each description personal and meaningful
3. **Use the Jokers Wisely**: Save these for truly special surprises
4. **Track Progress Together**: Review completed activities each month
5. **Be Flexible**: Life happens! It's okay to swap weeks or categories
6. **Celebrate Completions**: Make a ritual of marking cards as done

## 🛠️ Tech Stack

- **Frontend**: Vanilla JavaScript (ES6+)
- **Styling**: Tailwind CSS with custom animations
- **Backend**: Vercel Serverless Functions + Vercel KV + Vercel Blob
- **Build Tool**: Vite
- **Hosting**: Vercel

## 📱 Deployment

Build for production:
```bash
npm run build
```

The `dist` folder will contain your production-ready files.

Deploy to Vercel:
```bash
npm install -g vercel
vercel
```

## 🎯 Future Enhancements

- [ ] Add a calendar view
- [ ] Export completed activities as a photo book
- [ ] Send reminder notifications for upcoming activities
- [ ] Add weather suggestions for outdoor activities
- [ ] Create a mobile app version

## 💝 Made with Love

This gift was created to celebrate all the wonderful moments you'll share together in 2026. Here's to 52 weeks of adventure, laughter, and love!

---

**Note**: This is a deeply personal gift. Customize the activities to match your unique relationship and interests. The categories are suggestions - make them your own!

✨ Happy adventuring! ✨
