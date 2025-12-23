# 🎴 Our Adventure Deck

A playful, romantic card-deck web app: **4 suit piles** (♥ ♦ ♣ ♠) and a **Deal** button that reveals the next card from each pile.

This repository intentionally has **one** documentation source: this `README.md`.

---

## Quick start

```bash
npm install
npm run dev
```

Build:

```bash
npm run build
```

---

## How it works (current UX)

### Main experience (normal users)
- You see **4 piles** (one per suit).
- You press **Deal Again** to reveal the **next 4 cards** (one per pile).
- Dealing is **circular**: when a pile reaches the end, it loops back to the beginning.
- There is **no completed-cards timeline** on purpose.

### 52 cards = 52 weeks
The deck represents 52 weeks in a year — one card per week — so you keep dealing to see what the year holds.

---

## Hidden endpoint: show *all* cards for a year (direct URL only)

There is a hidden, no-navigation route that renders **all cards for a year**.
This is not linked anywhere in the UI; you must know the URL.

Supported URLs:
- `/all` (defaults to the upcoming year)
- `/all/2026`
- `/all?year=2026`

Notes:
- You must be logged in first (same session rules as the main app).
- This is meant for debugging / reviewing the full deck.

---

## Suits (categories)

- **♥ Hearts** — Cultural & Social
- **♦ Diamonds** — Adventures & Exploration
- **♣ Clubs** — Nature & Outdoors
- **♠ Spades** — Cozy & Creative

Jokers are randomly assigned into one of the four suits during initialization so they’re discovered naturally while dealing.

---

## Login

### Local development (localStorage)
Set in `.env`:
- `VITE_LOCAL_DEV_MODE=true`
- `VITE_LOCAL_USERS=alice@example.com:alice123,bob@example.com:bob123`

### Production on Vercel (KV + Blob)
Set in Vercel Project → Settings → Environment Variables:
- `VITE_LOCAL_DEV_MODE=false`
- `APP_LOGIN_EMAIL=...`
- `APP_LOGIN_PASSWORD=...`

> `APP_LOGIN_EMAIL` / `APP_LOGIN_PASSWORD` are server-only (do **not** prefix with `VITE_`).

#### Image uploads (direct to Blob)
In production, images are uploaded **directly from the browser to Vercel Blob** using a short-lived upload token minted by the app:
- Client requests a token from `POST /api/blob-upload-token` (protected by Basic Auth)
- Client uploads the file to Blob using that token

The legacy server-proxy upload route (`POST /api/upload`) still exists, but the app now prefers the direct upload path.

---

## Data model (high level)
Each card is an "activity":

- `id` (string)
- `title` (string)
- `description` (string)
- `suit` (`hearts | diamonds | clubs | spades`)
- `deck_year` (number)
- `planned_date` (YYYY-MM-DD)
- `image_path` (optional)
- `is_used` (boolean)

---

## Repo layout (important bits)
- `src/main.js` — app bootstrap + hidden route handling
- `src/gift.js` — main pile dealing experience
- `src/views/pileView.js` — pile layout UI
- `src/cardInitializer.js` — year initialization (52 + jokers)
- `api/` — Vercel serverless routes (KV for activities, Blob for uploads)

---

## Security / privacy note
The hidden `/all/...` route is **not** security by itself. Real access control is still enforced by login (local mode) or basic auth (prod mode).
