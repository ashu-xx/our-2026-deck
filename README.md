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
- You press **Deal** to show the **next 4 cards** (one per pile).
- Dealing is **circular**: when a pile reaches the end, it loops back to the beginning.
- Cards are **always shown revealed** (no flip / no completed state).

### 52 cards = 52 weeks
The deck represents 52 weeks in a year — one card per week — so you keep dealing to see what the year holds.

---

## Hidden endpoint: show *all* cards for a year (direct URL only)

There is a hidden, no-navigation route that renders **all cards for a year**.
This is not linked anywhere in the UI; you must know the URL.

Supported URLs:
- `/all` (defaults to the **next** year)
- `/all/2026`
- `/all?year=2026`

Notes:
- You must be logged in first (same session rules as the main app).
- This is meant for debugging / reviewing the full deck.
- In this view you can **add** and **remove** cards.

---

## Suits (categories)

- **♥ Hearts** — Cultural & Social
- **♦ Diamonds** — Adventures & Exploration
- **♣ Clubs** — Nature & Outdoors
- **♠ Spades** — Cozy & Creative

---

## Data model (high level)
Each card is an "activity":

- `id` (string)
- `title` (string)
- `description` (string)
- `suit` (`hearts | diamonds | clubs | spades`)
- `deck_year` (number)
- `planned_date` (YYYY-MM-DD)
- `image_path` (optional; URL in prod, IndexedDB key in local dev)
