# KS Hospitality Group — Website Source

A single-page React site built with **Vite**. Dark, cinematic, fully responsive (desktop + tablet + mobile with a hamburger nav).

## Quick start

```bash
npm install        # one-time
npm run dev        # start dev server (HMR + LAN access)
```

Then open `http://localhost:5174` in your browser.

The dev server also prints a **Network** URL (e.g. `http://192.168.1.x:5174`). Visit that from your phone on the same Wi-Fi to test mobile.

### Other scripts

| Command | What it does |
|---|---|
| `npm run dev`     | Start Vite dev server with hot-reload at `localhost:5174` |
| `npm run build`   | Produce a production bundle in `dist/` |
| `npm run preview` | Serve the built `dist/` locally to verify the production build |

## File structure

```
site/
├── index.html               ← Vite entry, links /src/main.jsx
├── package.json             ← scripts + deps
├── vite.config.js           ← Vite config (port 5174, LAN access)
├── public/
│   └── img/                 ← all images, served at /img/* in the browser
└── src/
    ├── main.jsx             ← React mount + splash hide
    ├── App.jsx              ← state-based page router
    ├── data.js              ← ALL content (properties, team, copy, contact)
    ├── styles.css           ← global CSS + responsive breakpoints
    ├── components/
    │   └── Parts.jsx        ← TopNav (with hamburger), LogoPlate, Photo, PropertyCard, Footer, Kicker
    └── pages/
        ├── Home.jsx         ← homepage
        └── Pages.jsx        ← Portfolio, The Group, Team, Property detail, Contact
```

## How to edit

### Properties, team, contact, copy
All content lives in `src/data.js`. Edit it and the site hot-reloads.

```js
// src/data.js
{
  id: 'elsie',
  name: 'Elsie Rooftop',
  cat: 'Rooftop', catSlug: 'rooftops',
  loc: 'Midtown, NY',
  url: 'https://www.elsierooftop.com',
  img: '/img/cat-rooftops.jpg',     // path is rooted at /img/* (served from public/img/)
  kind: 'photo',                    // 'photo' for environmental shots; 'logo' for centered logo marks
  featured: true,                   // optional — marks the homepage hero card
  blurb: '...',
}
```

### Add / change images
Drop files into `public/img/`. Reference them as `/img/your-file.jpg` (no `public/` prefix in the URL).

### Change colors
`src/styles.css`, top of the file (`:root` block):
- `--bg` → main background (charcoal)
- `--cream` → main text color
- `--accent` / `--accent-2` → oxblood red used for buttons & highlights

### Pages / layout
- Homepage: `src/pages/Home.jsx`
- Portfolio / About / Team / Property / Contact: `src/pages/Pages.jsx`
- Shared UI (nav, footer, photo cards): `src/components/Parts.jsx`

## Responsive design

Three breakpoints in `src/styles.css`:
- `≤ 1024px` — tablet: typography down a notch, container padding tightened
- `≤ 768px`  — phone: hamburger nav, single-column layout, fluid photo aspect ratios, iOS safe-area insets
- `≤ 480px`  — small phone: one more typography step down

`prefers-reduced-motion` is respected (Ken Burns / fade animations disable).

## Production to-do list

This is a marketing site without a backend. To go live you'll still want:

1. **Contact form** — currently decorative. Drop in [Formspree](https://formspree.io) by changing the `<form>` to `<form action="https://formspree.io/f/YOUR_ID" method="POST">` (see `src/pages/Pages.jsx`, `HiFiContact`).
2. **Analytics** — paste a Google Analytics / Plausible snippet into `index.html` `<head>`.
3. **Real photos** — replace placeholders in `public/img/` with high-res environmental shots (≥1600px wide).
4. **CMS** (optional) — wire `KS_DATA` to Contentful / Sanity if non-developers need to edit content.

## Deploy

`npm run build` produces a static `dist/` folder. Drop it onto:

| Host | Notes | Cost |
|---|---|---|
| **Netlify** | Connect the repo or drag-drop `dist/` to [Netlify Drop](https://app.netlify.com/drop). Auto-detects Vite. | Free |
| **Cloudflare Pages** | Build command `npm run build`, output `dist`. Fastest CDN. | Free |
| **Vercel** | Auto-detects Vite. | Free |

All three give you a live URL in under a minute.

— Generated April 2026
