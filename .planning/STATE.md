# Project State

**Updated:** 2026-04-28

## Project Reference

See: `.planning/PROJECT.md` (updated 2026-04-28)

**Core value:** Visitors must quickly understand Praneesh's cybersecurity credibility and have a memorable, high-signal experience that makes the portfolio stand out.
**Current focus:** Phase 1 - Finish Content Shell

## Current Snapshot

- Project: `dying-star`, a Next.js 16.2.4 / React 19 cybersecurity portfolio with a 3D space hero.
- Repository type: brownfield app initialized into GSD after `$gsd-map-codebase`.
- Active implementation state: M0 and M1 are present; M2 is present with R3F canvas, starfield, constellation, neutron star/disk/jets, Dyson sphere, orbital planets, bloom, GPU scaling, and WebGL error fallback.
- M3 first pass is implemented on the home page with stable sections: `home`, `about`, `projects`, `skills`, `experience`, `ctf`, and `contact`.
- Runtime routes now include `/`, `/resume`, and framework not-found.
- Content source today: static JSON in `content/data/`; no database exists in the repo.
- Planned integrations not implemented: Resend contact API, certifications UI section, Supabase leaderboard, Vercel Analytics, blog/MDX, RSS, sitemap/robots.

## Planning Artifacts

- Project context: `.planning/PROJECT.md`
- Workflow config: `.planning/config.json`
- Requirements: `.planning/REQUIREMENTS.md`
- Roadmap: `.planning/ROADMAP.md`
- Codebase map: `.planning/codebase/`
- Project research: `.planning/research/`

## Codebase Map

Detailed codebase docs live in `.planning/codebase/`:

- `STACK.md`
- `INTEGRATIONS.md`
- `ARCHITECTURE.md`
- `STRUCTURE.md`
- `CONVENTIONS.md`
- `TESTING.md`
- `CONCERNS.md`

Last mapping commit: `9ad175d docs: map existing codebase`

## Verified This Session

- `npm run lint` passes.
- `npx tsc --noEmit` passes.
- `npm run build` passes with network access for `next/font/google`.
- Browser smoke against `npm run start` passes: home sections present, canvas present, `/resume` iframe/link present, zero console errors.
- `npm run dev` with default Turbopack still accepts the port but did not reach DOMContentLoaded in the 45s Playwright smoke timeout. `npm run dev -- --webpack` returned HTML but did not hydrate the app shell within the smoke window. Production preview is validated.

## Fixes Applied In Latest Implementation Pass

- Set `turbopack.root` in `next.config.ts` so Next/Turbopack does not infer `/home/praneesh` from the parent lockfile.
- Replaced `gl_VertexID` in `components/3d/Constellation.tsx` with an explicit `aPhase` attribute for broader WebGL shader compatibility.
- Formatted `app/layout.tsx` to satisfy Biome.
- Added structured profile, skills, experience, and certifications data under `content/data/`.
- Added About, Projects, Skills, Experience, CTF, and Contact sections and wired them into `app/page.tsx`.
- Added CTF navigation item.
- Added `/resume` route and copied `docs/Praneesh_R_V_Resume.pdf` to `public/resume.pdf`.

## Next Execution Target

Recommended next phase: Phase 1 - Finish Content Shell.

Highest-impact blockers:

- Add certifications UI using `content/data/certifications.json`.
- Improve flagship project content and case-study depth.
- Replace mailto contact shell with the planned Resend API flow in Phase 2.
- Investigate Next 16 dev-server hydration/response behavior; production build and `next start` are currently healthy.
- Run visual/mobile screenshots for the full home page and tighten responsive details.

## Quick Tasks Completed

| Date | Mode | Task | Status |
|------|------|------|--------|
