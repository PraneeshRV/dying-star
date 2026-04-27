# External Integrations

**Analysis Date:** 2026-04-27

## APIs & External Services

**Implemented:**
- Google Fonts via Next.js font optimization - `app/layout.tsx` imports Orbitron, DM Sans, JetBrains Mono, and Cinzel from `next/font/google`.
  - SDK/Client: built-in `next/font/google`
  - Auth: none
  - Runtime behavior: fonts are managed by Next.js font optimization; no app code calls a Google Fonts API.
- Public website metadata - `app/layout.tsx` sets `metadataBase` to `https://praneeshrv.me` and defines Open Graph/Twitter metadata through the Next.js Metadata API.
  - SDK/Client: Next.js Metadata API
  - Auth: none
- External profile and project links - `components/sections/ProjectsSection.tsx`, `components/ui/ProjectCard.tsx`, and `components/sections/ContactSection.tsx` render links from `content/data/projects.json` and `content/data/profile.json`.
  - SDK/Client: static anchor tags
  - Auth: none
  - Targets: GitHub profile URLs, LinkedIn profile URL, website URL, and `mailto:` email links.
- Browser email handoff - `components/sections/ContactSection.tsx` uses a form with `action="mailto:..."` and a separate direct mail link.
  - SDK/Client: browser/mail client `mailto:` handling
  - Auth: none
- Static resume delivery - `app/resume/page.tsx` embeds `public/resume.pdf` and links directly to `/resume.pdf`.
  - SDK/Client: browser PDF rendering through `<iframe>`
  - Auth: none
- Remote image allowance - `next.config.ts` configures `images.remotePatterns` for any HTTPS hostname.
  - SDK/Client: Next.js Image Optimization config
  - Auth: none
  - Usage note: no `next/image` import was detected in implemented source, so this is configured but unused by current app code.

**Planned / Documented Only:**
- Resend email API - planned for contact form email delivery in `docs/praneesh_portfolio_masterplan.md`, `docs/MODULE_BREAKDOWN.md`, `docs/TOOL_ASSIGNMENT.md`, and `docs/progress.md`; no Resend package, `app/api/**/route.ts`, or env usage exists.
- Supabase leaderboard - planned as optional leaderboard storage in `docs/praneesh_portfolio_masterplan.md`; no Supabase package, client, table schema, or env usage exists.
- Vercel Analytics - planned/recommended in `docs/praneesh_portfolio_masterplan.md` and `docs/MODULE_BREAKDOWN.md`; no analytics package or import exists.
- GitHub activity graph - listed as future work in `docs/praneesh_portfolio_masterplan.md`; current project links are static JSON only.
- CTFtime integration - listed as future work in `docs/praneesh_portfolio_masterplan.md`; current CTF achievements are static JSON only.
- Spotify now playing - listed as future work in `docs/praneesh_portfolio_masterplan.md`; no Spotify package, route, or env usage exists.
- Discord webhook - planned as an optional deployment notification in `docs/praneesh_portfolio_masterplan.md`; no webhook code or CI workflow exists.

## Data Storage

**Databases:**
- Not detected.
  - Connection: none
  - Client: none
  - Files: no database SDK imports in `app/`, `components/`, `hooks/`, `lib/`, `stores/`, or `types/`.

**Local/static data:**
- Profile and contact/social data: `content/data/profile.json`.
- Project cards and source URLs: `content/data/projects.json`.
- Skill graph/grid data: `content/data/skills.json`.
- Experience timeline data: `content/data/experience.json`.
- CTF achievement table data: `content/data/ctf-achievements.json`.
- Certification data: `content/data/certifications.json`; data exists but no certification UI section is wired into `app/page.tsx`.
- Blog placeholder: `content/blog/.gitkeep`; no MDX/blog engine is implemented.
- Shared type contracts for static content: `types/index.ts`.

**File Storage:**
- Local repository/public filesystem only.
- Public runtime assets: `public/resume.pdf`, `public/file.svg`, `public/globe.svg`, `public/next.svg`, `public/vercel.svg`, `public/window.svg`, `public/textures/.gitkeep`, and `public/fonts/.gitkeep`.
- App favicon: `app/favicon.ico`.
- Source/reference resume copy: `docs/Praneesh_R_V_Resume.pdf`.
- No external object storage, upload handling, or user-generated files are implemented.

**Caching:**
- No external cache service is configured.
- No Redis, KV, CDN cache config, custom Next cache handler, or `cacheComponents` flag is present.
- Framework-managed build/dev cache lives under `.next/`; application code does not implement caching.

## Authentication & Identity

**Auth Provider:**
- None.
  - Implementation: no NextAuth/Auth.js, Supabase Auth, Clerk, Firebase Auth, OAuth provider, session store, protected route, `proxy.ts`, or `middleware.ts` exists.
  - Files checked: `app/`, `components/`, `hooks/`, `lib/`, `stores/`, `types/`, and `package.json`.

**Identity data:**
- Public portfolio identity content is static JSON in `content/data/profile.json`.
- `app/layout.tsx` hard-codes public author/creator metadata through the Next.js Metadata API.

## Monitoring & Observability

**Error Tracking:**
- No Sentry, PostHog, OpenTelemetry, Vercel Analytics, or custom error-tracking service is installed or imported.
- `components/3d/WebGLErrorBoundary.tsx` handles WebGL render failures locally and logs through `console.error`.

**Logs:**
- Browser console only for `components/3d/WebGLErrorBoundary.tsx`.
- No server logging integration, log transport, analytics event tracking, or metrics sink exists.

## CI/CD & Deployment

**Hosting:**
- No deployment platform config is implemented.
- No `vercel.json`, `netlify.toml`, Dockerfile, Docker Compose file, or `output` customization in `next.config.ts` was detected.
- Vercel is referenced in planning docs such as `docs/praneesh_portfolio_masterplan.md`; the repo itself only exposes standard Next scripts in `package.json`.

**CI Pipeline:**
- None detected.
- No `.github/workflows/*` files exist.
- Local pre-commit automation exists through `.husky/pre-commit`, `lint-staged` in `package.json`, and `biome.json`.

**Deployment notifications:**
- Discord webhook notification is documented as optional future work in `docs/praneesh_portfolio_masterplan.md`.
- No webhook sender, CI secret, or deployment callback exists in implemented files.

## Environment Configuration

**Required env vars:**
- None for the implemented app.
- No `process.env` or `NEXT_PUBLIC_*` reads were detected in `app/`, `components/`, `hooks/`, `lib/`, `stores/`, `types/`, or `content/`.

**Documented future env vars:**
- `RESEND_API_KEY` - planned contact form email delivery in `docs/praneesh_portfolio_masterplan.md`.
- `NEXT_PUBLIC_SITE_URL` - planned canonical/OG URL configuration in `docs/praneesh_portfolio_masterplan.md`; implemented metadata currently uses `https://praneeshrv.me` directly in `app/layout.tsx`.
- `SUPABASE_URL` - planned optional Supabase leaderboard backend in `docs/praneesh_portfolio_masterplan.md`.
- `SUPABASE_ANON_KEY` - planned optional Supabase public key in `docs/praneesh_portfolio_masterplan.md`.

**Secrets location:**
- `.env.example` exists and was not read.
- `.gitignore` ignores `.env*`; use local `.env.local` or host-managed environment variables for future secrets.
- Do not commit API keys, access tokens, private keys, or webhook URLs into `content/`, `docs/`, or `.planning/codebase/`.

## Webhooks & Callbacks

**Incoming:**
- None implemented.
- No `app/api/**/route.ts`, `proxy.ts`, `middleware.ts`, server action endpoint, or webhook receiver exists.
- For future App Router APIs, local Next 16 docs at `node_modules/next/dist/docs/01-app/01-getting-started/15-route-handlers.md` require `route.ts` files under `app/`.

**Outgoing:**
- None implemented.
- Browser-level outgoing interactions are static anchors and `mailto:` links from `components/sections/ProjectsSection.tsx`, `components/ui/ProjectCard.tsx`, and `components/sections/ContactSection.tsx`.
- No server-side `fetch`, webhook POST, email send, analytics event, or database write exists in implemented source.

## Implemented Integration Map

**Home route:**
- `app/page.tsx` composes the 3D hero and M3 sections.
- `components/3d/SpaceCanvas.tsx` uses browser WebGL through React Three Fiber; it does not call an external 3D service.
- `components/sections/AboutSection.tsx` reads `content/data/profile.json`.
- `components/sections/ProjectsSection.tsx` reads `content/data/projects.json` and renders external GitHub links.
- `components/sections/SkillsSection.tsx` reads `content/data/skills.json`.
- `components/sections/ExperienceSection.tsx` reads `content/data/experience.json`.
- `components/sections/CTFSection.tsx` reads `content/data/ctf-achievements.json`.
- `components/sections/ContactSection.tsx` reads `content/data/profile.json` and uses `mailto:`.

**Resume route:**
- `app/resume/page.tsx` serves `/resume` with metadata, a static PDF link, and an iframe pointed at `/resume.pdf#toolbar=1&navpanes=0`.
- `public/resume.pdf` is the runtime file served by the route.
- `docs/Praneesh_R_V_Resume.pdf` is a documentation/reference copy.

**Global metadata and fonts:**
- `app/layout.tsx` configures metadata, viewport, Google fonts through `next/font/google`, `CustomCursor`, and `MainContent`.
- `app/globals.css` defines local theme tokens and utility classes; no external CSS CDN is imported.

## Integration Gaps

**Contact email delivery:**
- Problem: `components/sections/ContactSection.tsx` submits through `mailto:`; installed `react-hook-form`, `zod`, and `react-hot-toast` are unused, and Resend remains planned only.
- Required files for implementation: `app/api/contact/route.ts`, `components/sections/ContactSection.tsx`, `package.json`, and secret env configuration for `RESEND_API_KEY`.

**Dynamic CTF/GitHub data:**
- Problem: `content/data/ctf-achievements.json` and `content/data/projects.json` are static; planned CTFtime and GitHub activity integrations are not implemented.
- Required files for implementation: route handlers under `app/api/**/route.ts`, static data fallback in `content/data/*.json`, and UI consumers in `components/sections/CTFSection.tsx` or `components/sections/ProjectsSection.tsx`.

**Analytics and resume tracking:**
- Problem: page views, resume downloads, and contact submits are discussed in `docs/MODULE_BREAKDOWN.md`, but no analytics package or event calls exist.
- Required files for implementation: `app/layout.tsx`, route/link instrumentation around `app/resume/page.tsx`, and provider config/env vars as required by the chosen analytics service.

**Database-backed features:**
- Problem: Supabase leaderboard is documented but no database client, schema, or API route exists.
- Required files for implementation: database client in `lib/`, route handlers under `app/api/**/route.ts`, env vars from host-managed secrets, and typed data contracts in `types/index.ts`.

---

*Integration audit: 2026-04-27*
