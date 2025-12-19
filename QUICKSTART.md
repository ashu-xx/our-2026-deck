# Quick Start Guide 🚀

## Getting Your Gift App Running

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Local Dev Mode

Create a `.env` file in the root directory:
```env
VITE_LOCAL_DEV_MODE=true
VITE_ADMIN_EMAIL=admin@example.com
```

This allows you to test the app without setting up Supabase right away!

### 3. Start the Development Server
```bash
npm run dev
```

The app will open at `http://localhost:5173`

### 4. Login Credentials (Local Dev Mode)

**Admin Account** (to add activities):
- Email: `admin@example.com`
- Password: `password123`

**User Account** (your girlfriend's view):
- Email: `user@example.com`
- Password: `password123`

### 5. Add Your First Activity

1. Login with admin credentials
2. Fill out the form:
   - **Year**: Choose 2026 for future plans, 2025 for memories
   - **Week Number**: 1-52
   - **Title**: Name of the activity
   - **Description**: Brief description
   - **Category (Suit)**: Choose from:
     - ♥️ Hearts - Cultural & Social
     - ♦️ Diamonds - Adventures & Exploration
     - ♣️ Clubs - Nature & Outdoors
     - ♠️ Spades - Cozy & Creative
     - 🃏 Joker - Wild Card
   - **Image**: Upload a photo (optional)
3. Click "Save to Database"

**Note**: In local dev mode, images won't actually save to Supabase, but you can still test the UI!

### 6. View as Your Girlfriend

1. Logout (click Logout in top right)
2. Login with `user@example.com` / `password123`
3. See your beautiful card deck!
4. Click cards to flip them
5. Switch between 2025 Memories and 2026 Adventures

---

## Setting Up Real Supabase (For Production)

When you're ready to deploy this for real:

### 1. Create Supabase Project
- Go to [supabase.com](https://supabase.com)
- Create a new project (free tier is perfect!)

### 2. Set Up Database

Run this SQL in Supabase SQL Editor:

```sql
-- Create activities table
create table activities (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  title text not null,
  description text,
  suit text not null,
  deck_year integer not null,
  week_number integer not null,
  image_path text,
  is_used boolean default false
);

-- Enable Row Level Security
alter table activities enable row level security;

-- Create policy to allow all operations for authenticated users
create policy "Allow all for authenticated users"
  on activities
  for all
  using (auth.role() = 'authenticated');
```

### 3. Set Up Storage

1. Go to Storage in Supabase dashboard
2. Create a new bucket called `activity-images`
3. Make it public
4. Set up policies:

```sql
-- Allow authenticated users to upload
create policy "Allow authenticated uploads"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'activity-images');

-- Allow public access to view images
create policy "Public Access"
  on storage.objects for select
  to public
  using (bucket_id = 'activity-images');
```

### 4. Set Up Authentication

1. Go to Authentication in Supabase
2. Add your email address
3. Add your girlfriend's email address
4. Send them invite emails or set temporary passwords

### 5. Update Environment Variables

Update your `.env` file:

```env
VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
VITE_ADMIN_EMAIL=your-email@example.com
VITE_LOCAL_DEV_MODE=false
```

### 6. Deploy!

Deploy to Vercel (recommended):
```bash
npm run build
npx vercel
```

Or Netlify:
```bash
npm run build
npx netlify deploy --prod --dir=dist
```

---

## Tips for Success 🌟

### For Adding Activities:
- Do a few at a time - don't rush to complete all 52
- Mix up the categories throughout the year
- Consider seasonal activities (outdoor stuff in summer, cozy stuff in winter)
- Leave some flexibility for spontaneous changes

### For Photos:
- Use landscape orientation for best results
- Keep file sizes reasonable (under 2MB)
- For 2025 memories: use real photos!
- For 2026 plans: use aspirational images or placeholders

### For Your Girlfriend:
- Reveal it on a special occasion (New Year's, Anniversary, etc.)
- Walk through it with her the first time
- Explain that she can mark activities as complete with double-tap
- Make it a weekly tradition to check the next card together!

---

## Troubleshooting

### "Can't login"
- Make sure `VITE_LOCAL_DEV_MODE=true` in your `.env` file
- Or set up real Supabase authentication

### "Images not showing"
- In local dev mode, images won't actually upload
- Set up Supabase storage for real image uploads

### "No cards showing"
- You need to add activities first using the admin account
- Make sure you're logged in with the user account to view

### "Build errors"
- Run `npm install` to make sure all dependencies are installed
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`

---

## What's Next?

1. **Add all 52 activities** - Use the SAMPLE_ACTIVITIES.md for ideas
2. **Customize the design** - Colors, fonts, emojis - make it yours!
3. **Add 2025 memories** - Upload photos from your actual 2025 weekends
4. **Plan the reveal** - Make opening this gift special
5. **Use it together** - Check off activities throughout 2026

---

**Remember**: This is about the journey together, not just the destination. The real gift is the time you'll spend together! 💕

Happy adventuring! 🎴✨

