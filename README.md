# Anjoom Irshad & Rinsha Pulikkal — Wedding Reception Invitation

React + Vite + Tailwind CSS + Framer Motion + Lucide. Mobile-first, deployable to Vercel.

## Run locally

```bash
npm install
npm run dev          # http://localhost:5173   (add ?intro=0 to skip the opening video)
npm run build && npm run preview
```

## Everything editable lives in two places

| What | Where |
| --- | --- |
| Names, families, date, venue, texts, media paths | `src/data/invitation.js` |
| Site URL, Supabase keys | `.env` (copy from `.env.example`) |

### ⏰ Set the reception time (not provided yet — nothing is invented)
In `src/data/invitation.js`:
```js
time: { hour: 19, minute: 0 },   // 24h clock, India Standard Time
```
This makes the countdown aim at that exact moment and reveals **Add to Calendar** (Google Calendar link + `.ics` download). Until then the countdown targets 00:00 IST on 28 Dec 2026.

### 📍 Set the verified map link
```js
venue: { mapUrl: 'https://maps.app.goo.gl/…', directionsUrl: '' }
```
Until set, *View Location* / *Get Directions* open a Google Maps **search** for "Khayaal Palace, Mankada, Kerala" (no coordinates are invented).

### 📅 Weekday
Only the numeric date is shown. The reference artwork says "Saturday", but 28 December 2026 is a **Monday**. Confirm with the family before adding any weekday.

## Wishes (Supabase)

1. Create a free project at supabase.com.
2. SQL Editor → paste and run `supabase.sql` (creates the table with Row-Level Security: guests can insert, and can read only approved wishes).
3. Project Settings → API → copy the **Project URL** and **anon public** key into `.env` (and into Vercel env vars):
   ```
   VITE_SUPABASE_URL=https://xxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJ…
   ```
4. New wishes arrive with `approved = false`. Tick **approved** in Table Editor to show a wish in the carousel.

Without these variables the form is disabled and shows a friendly "not switched on yet" note — it never pretends to save.

## Deploy to Vercel

1. Push this folder to GitHub → **Import** in Vercel (framework: Vite, auto-detected; `vercel.json` included).
2. Add environment variables: `VITE_SITE_URL` (your final `https://…` domain, no trailing slash) and the two Supabase keys.
3. Deploy.

`VITE_SITE_URL` is baked into the **static** Open Graph tags in `index.html` at build time (WhatsApp does not run JavaScript). If you leave it empty on Vercel, `VERCEL_PROJECT_PRODUCTION_URL` is used automatically. After adding a custom domain, redeploy.

Preview image: `public/images/og-invitation.jpg` (1672×941, ~200 KB — under WhatsApp's 300 KB guideline). WhatsApp caches previews; to refresh, share the link with `?v=2`.

## Structure

```
public/images   optimized WebP/JPG assets (satin bg, glass panel, floral overlay, venue, posters, OG)
public/video    intro.mp4 (9:16) and venue-tour.mp4 — re-encoded, faststart
src/data        invitation.js  ← single config file
src/lib         event.js (countdown IST, calendar, maps, share) · wishes.js (Supabase REST)
src/components  Intro · Hero · Families · SaveTheDate · Venue · VenueVideo (+modal) · Wishes · Closing · ui
```

## Notes
- The opening video starts only after the guest taps; sound is allowed because it follows a tap, and a mute button is provided. Skip Intro is always available.
- The venue video element does not exist in the DOM until the modal opens, so it is never downloaded on first load.
- `prefers-reduced-motion` is honoured (Framer Motion `MotionConfig` + CSS).
- Fonts are self-hosted via `@fontsource` (Cormorant Garamond, Pinyon Script, Amiri) — no third-party requests.

## Background music
`public/audio.mp3` (re-encoded to 96 kbps, ~2 MB). It starts only from the guest's tap (Skip Intro, or when the opening video ends), fades in, loops, pauses while the venue video plays, and can be toggled with the round button at the bottom-right. Replace the file (or change `media.music` in `src/data/invitation.js`) to swap the song.
