# dying-star

Praneesh R V's cybersecurity portfolio, rebuilt as **Archive of the Shattered Star**: a post-apocalyptic intergalactic archive with a realistic animated neutron-star scene, damaged Dyson shell, ruined planets, moons, megastructures, and tactical portfolio sections.

## Current Status

The production portfolio shell is implemented and verified. The current site includes:

- Next.js 16 App Router, React 19, TypeScript strict mode, Tailwind v4, Biome, and npm lockfile.
- Full home route with hero, About, Projects, Skills, Experience, Certifications, CTF, Blog preview, and Contact sections.
- Interactive 3D scene with zoom, drag, guided focus, rotating/revolving celestial bodies, damaged Dyson sphere sectors, moons, pathways, and ruins.
- Production SEO basics: metadata, canonical URLs, sitemap, robots, manifest, generated Open Graph/Twitter images, and JSON-LD structured data.
- `/resume` route plus `/resume.pdf` static asset.

Pending roadmap items remain intentionally out of scope for the current static launch: Resend contact API, full MDX blog engine, terminal overlay, Packet Runner minigame, analytics, and domain/Vercel project wiring.

## Requirements

- Node.js `>=20.9.0`
- npm with the committed `package-lock.json`

## Local Development

```bash
npm install
npm run dev
```

The production path is the source of truth for release checks:

```bash
npm run build
npm run start
```

If `next dev` behaves differently from the production server, verify against `npm run build` plus `npm run start` before treating it as a product bug.

## Verification

Run the full non-browser gate:

```bash
npm run verify
```

Equivalent expanded commands:

```bash
npm run verify:system
npm run lint
tsc --noEmit
npm run build
```

For UI/runtime changes, also run a production browser smoke against `npm run start`. The current smoke coverage checks desktop and mobile rendering, canvas/fallback behavior, zoom/drag, animation, reduced motion, section navigation, and resume/contact/blog reachability.

## Deployment

Recommended Vercel settings:

- Framework preset: Next.js
- Install command: `npm install`
- Build command: `npm run build`
- Output: managed by Next.js/Vercel
- Node version: `>=20.9.0`

No environment variables are required for the current static/mailto build.

Optional:

```bash
SITE_URL=https://praneeshrv.me
```

Use `SITE_URL` only if the deployment domain differs from the default canonical domain. Future Contact API work may add a server-only `RESEND_API_KEY`; it is not used today.

## Project Structure

- `app/` - App Router routes, metadata routes, global styles, and generated OG image routes.
- `components/3d/` - React Three Fiber scene objects, camera controls, orbit math, and tactical labels.
- `components/sections/` - Portfolio content sections.
- `components/ui/` - Reusable UI primitives.
- `content/data/` - Static portfolio and shattered-system data.
- `scripts/` - Verification and local setup helpers.

## Production Notes

- The boot screen is an overlay; route content remains present in initial HTML for SEO and no-JS resilience.
- The WebGL scene preflights browser support and falls back to a deterministic static star archive for no-WebGL, reduced-motion, or context-loss paths.
- The contact form is mailto-based for the current launch. Treat the future Resend API as a separate secured phase.
