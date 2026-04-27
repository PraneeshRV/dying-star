# Roadmap: Dying Star Portfolio

**Created:** 2026-04-28
**Granularity:** standard
**Mode:** yolo
**Core Value:** Visitors must quickly understand Praneesh's cybersecurity credibility and have a memorable, high-signal experience that makes the portfolio stand out.

## Overview

This is a brownfield roadmap. Phase 0 records what is already implemented so future planning does not duplicate it. Phases 1-7 complete the launch path from the current M3 first pass to a polished, deployable portfolio.

| # | Phase | Goal | Requirements | Status |
|---|-------|------|--------------|--------|
| 0 | Existing Baseline | Preserve and verify implemented M0-M3 foundation | FOUND-01..04, SCENE-01..02, CONT-01..06, CONT-08, FORM-01, QA-01..02 | Complete |
| 1 | Finish Content Shell | Complete M3 content quality and certification UI | CONT-07, CONT-09 | Complete |
| 2 | Contact API | Replace mailto-only contact with secure Resend submission | FORM-02, FORM-03 | Pending |
| 3 | 3D Fallbacks and Validation | Make the heavy scene resilient across devices and preferences | SCENE-03, SCENE-04 | Pending |
| 4 | Motion and Terminal | Add polished animation and the secret terminal layer | MOTN-01, MOTN-02, TERM-01, TERM-02, TERM-03 | Pending |
| 5 | Packet Runner | Add optional minigame with local persistence | GAME-01, GAME-02, GAME-03 | Pending |
| 6 | Blog Engine | Add local MDX blog and first content | BLOG-01, BLOG-02, BLOG-03 | Pending |
| 7 | Launch Polish | Finish SEO, analytics, accessibility, testing, and deployment | SEO-01, SEO-02, QA-03, DEPLOY-01, DEPLOY-02 | Pending |

## Phase Details

### Phase 0: Existing Baseline

**Goal:** Preserve the working foundation already present in the repo.
**Status:** Complete
**UI hint:** yes

**Requirements:** FOUND-01, FOUND-02, FOUND-03, FOUND-04, SCENE-01, SCENE-02, CONT-01, CONT-02, CONT-03, CONT-04, CONT-05, CONT-06, CONT-08, FORM-01, QA-01, QA-02

**Success Criteria:**
1. `npm run lint`, `npx tsc --noEmit`, and `npm run build` pass.
2. Production browser smoke confirms home sections, canvas, `/resume`, and zero console errors.
3. Existing section ids and resume route remain stable.
4. Future phases treat the current source as baseline, not as generated throwaway work.

### Phase 1: Finish Content Shell

**Goal:** Complete the remaining M3 content work so the portfolio reads as a complete MVP, not a shell.
**Status:** Complete
**UI hint:** yes

**Requirements:** CONT-07, CONT-09

**Success Criteria:**
1. Certifications and education render as a polished section using `content/data/certifications.json`.
2. Floating navigation and/or section flow includes certifications if it becomes a first-class section.
3. Flagship projects have clearer descriptions, credible links where available, and visible status/context.
4. Responsive desktop/mobile visual check passes without overlapping text or layout jumps.

### Phase 2: Contact API

**Goal:** Make contact submission real while keeping mailto as a fallback.
**Status:** Pending
**UI hint:** yes

**Requirements:** FORM-02, FORM-03

**Success Criteria:**
1. `app/api/contact/route.ts` accepts validated submissions and sends through Resend.
2. Client form uses `react-hook-form` and `zod` with clear success/error states.
3. Server path includes rate limiting or abuse resistance appropriate for a public portfolio.
4. No Resend key, email secret, or private configuration appears in client bundles or public files.

### Phase 3: 3D Fallbacks and Validation

**Goal:** Make the visual centerpiece resilient instead of merely impressive on ideal hardware.
**Status:** Pending
**UI hint:** yes

**Requirements:** SCENE-03, SCENE-04

**Success Criteria:**
1. No-WebGL, low-tier GPU, reduced-motion, hidden-tab, and mobile cases avoid expensive canvas behavior when appropriate.
2. WebGL context loss and GPU detection failure produce a user-visible static fallback.
3. Browser smoke or screenshot checks verify nonblank canvas/fallback rendering on desktop and mobile viewports.
4. Production build remains healthy and `next dev` behavior is either fixed or documented with a reproducible workaround.

### Phase 4: Motion and Terminal

**Goal:** Add the cyber "soul" layer without making the site noisy or inaccessible.
**Status:** Pending
**UI hint:** yes

**Requirements:** MOTN-01, MOTN-02, TERM-01, TERM-02, TERM-03

**Success Criteria:**
1. Scroll and entrance animations improve section comprehension and do not obscure content.
2. Reduced-motion users receive a stable equivalent experience.
3. Terminal opens from both keyboard and visible UI, closes predictably, and traps/restores focus correctly.
4. Terminal commands return useful portfolio content and never expose real secrets.

### Phase 5: Packet Runner

**Goal:** Add a small optional game that supports the theme without blocking portfolio comprehension.
**Status:** Pending
**UI hint:** yes

**Requirements:** GAME-01, GAME-02, GAME-03

**Success Criteria:**
1. Game launches from terminal, UI, and Konami code.
2. Game loop supports movement, enemies, collision, scoring, pause/resume, and power-ups.
3. High score persists in localStorage only for v1.
4. Mobile controls work and the game remains optional for accessibility/performance.

### Phase 6: Blog Engine

**Goal:** Add the writing surface that turns the portfolio from showcase into proof of skill.
**Status:** Pending
**UI hint:** yes

**Requirements:** BLOG-01, BLOG-02, BLOG-03

**Success Criteria:**
1. Local MDX posts render through App Router with a blog index and post route.
2. Posts support metadata, tags, excerpts, dates, and syntax-highlighted code blocks.
3. RSS output is valid XML.
4. At least two sample posts exist: one CTF/writeup style and one build/research style.

### Phase 7: Launch Polish

**Goal:** Prepare the site for public launch on `praneeshrv.me`.
**Status:** Pending
**UI hint:** yes

**Requirements:** SEO-01, SEO-02, QA-03, DEPLOY-01, DEPLOY-02

**Success Criteria:**
1. Sitemap, robots, JSON-LD, canonical metadata, OG metadata/assets, and analytics are in place.
2. Lighthouse, keyboard, reduced-motion, mobile, and basic screen-reader passes are documented.
3. Vercel project, domain, and environment variables are ready.
4. README or planning docs explain local development, production preview, deployment, and verification.

## Requirement Coverage

| Phase | Requirement Count |
|-------|-------------------|
| Phase 0 | 16 |
| Phase 1 | 2 |
| Phase 2 | 2 |
| Phase 3 | 2 |
| Phase 4 | 5 |
| Phase 5 | 3 |
| Phase 6 | 3 |
| Phase 7 | 5 |

**Coverage:** 38 of 38 v1 requirements mapped.

## Next Step

Run `$gsd-plan-phase 1` to plan the next implementation phase: Finish Content Shell.

---
*Roadmap created: 2026-04-28*
*Last updated: 2026-04-28 after GSD project initialization*
