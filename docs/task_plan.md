# Task Plan: Archive of the Shattered Star

## Goal

Build a production-ready cybersecurity portfolio for Praneesh R V as a post-apocalyptic intergalactic archive: realistic neutron-star centerpiece, damaged Dyson sphere, ruined planets and moons, megastructures, pathway remnants, and tactical portfolio sections that remain readable, accessible, and deployable.

## Current Phase

Production readiness and deployment polish.

## Implemented

- Next.js 16 App Router with TypeScript, Tailwind v4, Biome, Zustand, and npm lockfile.
- Home route with Hero, About, Projects, Skills, Experience, Certifications, CTF, Blog preview, and Contact.
- `/resume` route with static `/resume.pdf` asset.
- Shattered-star 3D system with neutron star, 33% destroyed Dyson shell, 8 planets, 14 moons, 9 megastructures, and 3 pathway remnants.
- Scalable/zoomable/movable/observable scene controls with rotating and revolving celestial bodies.
- Data contract verification for `content/data/shattered-system.json`.
- Production SEO basics: canonical metadata, sitemap, robots, manifest, generated OG/Twitter images, and JSON-LD.
- WebGL and reduced-motion fallback path.

## Production Gate

Run before deployment:

```bash
npm run verify:system
npm run lint
tsc --noEmit
npm run build
```

For UI/runtime changes, also run production browser smoke against:

```bash
npm run start
```

The smoke pass should cover desktop, mobile, reduced motion, canvas/fallback visibility, zoom/drag, section navigation, blog/contact reachability, and `/resume`.

## Deployment

Recommended Vercel settings:

- Framework preset: Next.js
- Install command: `npm install`
- Build command: `npm run build`
- Node version: `>=20.9.0`
- Required env vars: none for the current static/mailto build
- Optional env var: `SITE_URL=https://praneeshrv.me`

## Remaining Roadmap

- Contact API with validation, abuse controls, and Resend.
- Full MDX blog engine with RSS and highlighted code.
- Terminal overlay with fake-only easter eggs.
- Optional Packet Runner minigame.
- Analytics and final domain wiring.
