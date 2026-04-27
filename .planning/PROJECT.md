# Dying Star Portfolio

## What This Is

`dying-star` is Praneesh R V's cybersecurity portfolio: a dark, immersive, space/quasar themed Next.js site that turns a resume into an explorable technical experience. It is for recruiters, security peers, CTF collaborators, and anyone evaluating Praneesh's work across cybersecurity, CTFs, infrastructure, Linux, and project building.

The product is not a generic landing page. It should feel like a polished cyber observatory: readable and professional first, then memorable through 3D space visuals, terminal interactions, CTF easter eggs, and technical writing.

## Core Value

Visitors must quickly understand Praneesh's cybersecurity credibility and have a memorable, high-signal experience that makes the portfolio stand out.

## Requirements

### Validated

- [x] Next.js 16 App Router scaffold with TypeScript, Tailwind v4, Biome, strict typing, and npm scripts is present.
- [x] Design system primitives are present: boot loader, custom cursor, glitch text, typewriter text, button/card styling, glass/glow utilities, and floating navigation.
- [x] 3D hero scene is present with React Three Fiber, adaptive starfield/constellation, neutron star, accretion disk, jets, Dyson sphere, orbital planets, bloom, and WebGL error fallback.
- [x] Main home sections have a first implementation: hero, about, projects, skills, experience, CTF, and contact.
- [x] Static data exists for projects, CTF achievements, profile, skills, experience, and certifications.
- [x] `/resume` route and `public/resume.pdf` are present.
- [x] Production build and production browser smoke pass for `/`, canvas presence, `/resume`, and console errors.

### Active

- [ ] Finish the M3 section pass with certifications UI, stronger project content, responsive polish, and a real contact path.
- [ ] Replace the mailto contact shell with a Resend-backed API route using validation, rate limiting, and safe secret handling.
- [ ] Resolve or document the `next dev` reliability issue while preserving the healthy `next build` and `next start` path.
- [ ] Add an animation layer that improves the experience without harming reduced-motion, accessibility, or mobile performance.
- [ ] Add the terminal overlay with useful portfolio commands, fake challenge tokens only, and accessible non-keyboard triggers.
- [ ] Add Packet Runner as an optional progressive enhancement with local persistence only for v1.
- [ ] Add the blog/MDX system with sample posts, Shiki highlighting, RSS, and SEO metadata.
- [ ] Complete launch polish: sitemap, robots, metadata, OG assets, Vercel Analytics, Lighthouse/accessibility/mobile checks, and production deployment readiness.

### Out of Scope

- User accounts or authentication - the portfolio is public and does not need identity management for v1.
- Paid tools or paid design assets - the project is intentionally built on free/open tooling and student-friendly services.
- A full CMS for v1 - local JSON/MDX keeps the launch surface small and reviewable.
- Real secrets in easter eggs, flags, terminal output, or client code - all challenge content must be clearly fake.
- A global realtime leaderboard for v1 - localStorage is enough unless Supabase is deliberately added with schema and RLS.
- Native mobile apps - responsive web is the target.

## Context

- The original vision lives in `docs/praneesh_portfolio_masterplan.md`, with refined implementation docs in `docs/PERFECTED_PLAN.md`, `docs/MODULE_BREAKDOWN.md`, `docs/OUTSOURCING_PLAN.md`, and `docs/task_plan.md`.
- The repo is already a brownfield Next.js application, not a greenfield start. M0, M1, most of M2, and a first M3 pass are implemented.
- The active tech stack is Next.js 16.2.4, React 19.2.4, TypeScript, Tailwind v4, Biome, React Three Fiber, Three.js, Zustand, motion, lucide-react, and npm with `package-lock.json`.
- `AGENTS.md` requires reading local Next.js docs in `node_modules/next/dist/docs/` before changing Next-specific behavior.
- There is no database today. Content is static JSON plus the copied resume PDF.
- Production preview works with `npm run start`. During the latest implementation session, `npm run dev` with default Turbopack accepted the port but did not reach DOMContentLoaded within the smoke timeout.
- The current preview server may be running on `http://127.0.0.1:3000/` from `npm run start`.

## Constraints

- **Framework**: Next.js 16 APIs and conventions must be checked against installed local docs before framework changes.
- **Package manager**: Use npm and `package-lock.json`; do not introduce pnpm/yarn lockfile drift.
- **Performance**: The 3D scene must degrade gracefully on weak GPUs, mobile devices, hidden tabs, and reduced-motion preferences.
- **Accessibility**: Every interactive feature needs a keyboard/screen-reader path outside the canvas.
- **Security**: Contact API work must validate input, rate-limit, avoid leaking env vars, and avoid putting real secrets in client bundles.
- **Budget**: Prefer free/open-source tools and Vercel/free-tier services.
- **Verification**: `npm run lint`, `npx tsc --noEmit`, `npm run build`, and browser smoke against `npm run start` are the minimum gate for user-facing changes.

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Use Next.js 16 App Router with local docs as source of truth | Repo already uses Next 16 and AGENTS.md warns that APIs differ from older assumptions | Good |
| Use npm instead of pnpm | Existing lockfile and scripts are npm-based | Good |
| Keep portfolio content in local JSON/MDX for v1 | Fast, transparent, easy to version, no database needed for launch | Good |
| Treat 3D as progressive enhancement | The site must remain readable and impressive even when WebGL is unavailable or reduced motion is enabled | Pending |
| Use Resend only for the contact endpoint | Plans already target Resend and it is enough for a public portfolio form | Pending |
| Keep Packet Runner localStorage-only for v1 | Avoids early database/security scope and keeps the game optional | Pending |
| Preserve fake-only CTF/easter egg content | Prevents accidental secret leakage and avoids confusing scanners | Pending |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition**:
1. Requirements invalidated? Move to Out of Scope with reason.
2. Requirements validated? Move to Validated with phase reference.
3. New requirements emerged? Add to Active.
4. Decisions to log? Add to Key Decisions.
5. "What This Is" still accurate? Update if drifted.

**After each milestone**:
1. Full review of all sections.
2. Core Value check: still the right priority?
3. Audit Out of Scope: reasons still valid?
4. Update Context with current state.

---
*Last updated: 2026-04-28 after GSD project initialization*
