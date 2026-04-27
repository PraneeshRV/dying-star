# Requirements: Dying Star Portfolio

**Defined:** 2026-04-28
**Core Value:** Visitors must quickly understand Praneesh's cybersecurity credibility and have a memorable, high-signal experience that makes the portfolio stand out.

## v1 Requirements

### Foundation

- [x] **FOUND-01**: Visitor can load a Next.js 16 App Router site with strict TypeScript, Tailwind v4 styling, and production metadata.
- [x] **FOUND-02**: Visitor sees a coherent cyber/space design system with glass panels, terminal surfaces, glow tokens, cursor, boot loader, buttons, cards, and floating navigation.
- [x] **FOUND-03**: Portfolio content is stored in typed local data files for projects, CTF achievements, profile, skills, experience, and certifications.
- [x] **FOUND-04**: Maintainer can run the baseline verification commands: lint, typecheck, production build, and production smoke.

### 3D Scene

- [x] **SCENE-01**: Visitor sees a full-viewport space hero with R3F canvas, starfield, constellation, neutron star, accretion disk, jets, Dyson sphere, and planets.
- [x] **SCENE-02**: Visitor receives a nonblank fallback if the WebGL subtree throws during render.
- [ ] **SCENE-03**: Visitor on low-end GPU, no-WebGL, hidden-tab, mobile, or reduced-motion contexts receives an appropriate reduced/fallback experience before the page becomes unusable.
- [ ] **SCENE-04**: Maintainer can validate the 3D scene with browser smoke or screenshot checks across desktop, mobile, and reduced-motion contexts.

### Portfolio Content

- [x] **CONT-01**: Visitor can scroll through stable home sections with ids for home, about, projects, skills, experience, ctf, and contact.
- [x] **CONT-02**: Visitor can read a clear About section based on Praneesh's actual profile.
- [x] **CONT-03**: Visitor can browse project cards and filter projects by category.
- [x] **CONT-04**: Visitor can inspect skills through a desktop constellation graph and mobile-friendly grouped grid.
- [x] **CONT-05**: Visitor can read an experience timeline with education, CTF, project, and milestone entries.
- [x] **CONT-06**: Visitor can see CTF achievements and a safe fake challenge token interaction.
- [x] **CONT-07**: Visitor can see certifications and education badges as a polished section, not just raw JSON data.
- [x] **CONT-08**: Visitor can open a resume route and access the static resume PDF.
- [x] **CONT-09**: Visitor can distinguish the strongest projects through sharper descriptions, real links where available, and case-study depth for flagship work.

### Contact

- [x] **FORM-01**: Visitor can reach Praneesh from the Contact section through an accessible mailto fallback and social links.
- [ ] **FORM-02**: Visitor can submit the contact form through a server-side Resend API route.
- [ ] **FORM-03**: Contact submissions are validated, rate-limited, spam-resistant, and do not expose secrets in client code.

### Motion

- [ ] **MOTN-01**: Visitor sees section entrance, scroll, hover, count-up, and text reveal animations that match the cosmic cybersecurity theme.
- [ ] **MOTN-02**: Visitor with reduced-motion preferences receives a calm equivalent experience without animation-heavy effects.

### Terminal

- [ ] **TERM-01**: Visitor can open and close a terminal overlay by keyboard shortcut and visible UI trigger.
- [ ] **TERM-02**: Visitor can run portfolio commands such as help, whoami, projects, skills, ctf, resume, contact, blog, theme, clear, and exit.
- [ ] **TERM-03**: Terminal easter eggs use fake-only challenge tokens and remain documented as intentional client-visible content.

### Packet Runner

- [ ] **GAME-01**: Visitor can launch Packet Runner as an optional canvas minigame.
- [ ] **GAME-02**: Game supports movement, enemies, collision, scoring, pause/resume, and power-ups.
- [ ] **GAME-03**: Game can be triggered from terminal, UI, and Konami code, with localStorage high scores and mobile controls.

### Blog

- [ ] **BLOG-01**: Visitor can browse a blog index generated from local MDX content.
- [ ] **BLOG-02**: Visitor can read individual post pages with metadata, tags, and code-friendly layout.
- [ ] **BLOG-03**: Blog supports Shiki highlighting, RSS, sample posts, and SEO metadata per post.

### SEO, Analytics, and Launch

- [ ] **SEO-01**: Search engines and social previews receive sitemap, robots, JSON-LD, canonical metadata, and OG assets.
- [ ] **SEO-02**: Maintainer can inspect basic usage through Vercel Analytics without adding invasive tracking.
- [x] **QA-01**: Maintainer can keep lint, typecheck, and production build passing after every phase.
- [x] **QA-02**: Maintainer has a production browser smoke path that checks home sections, canvas, resume route, and console errors.
- [ ] **QA-03**: Maintainer has Lighthouse, accessibility, keyboard, mobile, and cross-browser checks for launch.
- [ ] **DEPLOY-01**: Site is connected to Vercel with the needed environment variables and domain settings.
- [ ] **DEPLOY-02**: README or planning docs explain local preview, production preview, and deployment verification.

## v2 Requirements

### Persistence

- **PERS-01**: Supabase-backed public leaderboard for Packet Runner if the local game proves worth extending.
- **PERS-02**: Admin-editable content workflow if local MDX/JSON becomes too slow.

### Expanded Content

- **USES-01**: `/uses` page for hardware, Arch/Linux setup, security tools, and workflow.
- **LABS-01**: Dedicated writeups or lab notes for larger CTF/project case studies.
- **I18N-01**: Additional languages only if analytics or audience needs justify it.

## Out of Scope

| Feature | Reason |
|---------|--------|
| User authentication | Public portfolio does not need accounts for v1. |
| Paid animation/design services | Project must stay free/student-friendly. |
| Real secrets or real flags in client code | Easter eggs are public; all tokens must be fake. |
| Native mobile app | Responsive web is the correct launch target. |
| Full CMS | Local MDX/JSON is simpler and safer for v1. |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| FOUND-01 | Phase 0 | Complete |
| FOUND-02 | Phase 0 | Complete |
| FOUND-03 | Phase 0 | Complete |
| FOUND-04 | Phase 0 | Complete |
| SCENE-01 | Phase 0 | Complete |
| SCENE-02 | Phase 0 | Complete |
| SCENE-03 | Phase 3 | Pending |
| SCENE-04 | Phase 3 | Pending |
| CONT-01 | Phase 0 | Complete |
| CONT-02 | Phase 0 | Complete |
| CONT-03 | Phase 0 | Complete |
| CONT-04 | Phase 0 | Complete |
| CONT-05 | Phase 0 | Complete |
| CONT-06 | Phase 0 | Complete |
| CONT-07 | Phase 1 | Complete |
| CONT-08 | Phase 0 | Complete |
| CONT-09 | Phase 1 | Complete |
| FORM-01 | Phase 0 | Complete |
| FORM-02 | Phase 2 | Pending |
| FORM-03 | Phase 2 | Pending |
| MOTN-01 | Phase 4 | Pending |
| MOTN-02 | Phase 4 | Pending |
| TERM-01 | Phase 4 | Pending |
| TERM-02 | Phase 4 | Pending |
| TERM-03 | Phase 4 | Pending |
| GAME-01 | Phase 5 | Pending |
| GAME-02 | Phase 5 | Pending |
| GAME-03 | Phase 5 | Pending |
| BLOG-01 | Phase 6 | Pending |
| BLOG-02 | Phase 6 | Pending |
| BLOG-03 | Phase 6 | Pending |
| SEO-01 | Phase 7 | Pending |
| SEO-02 | Phase 7 | Pending |
| QA-01 | Phase 0 | Complete |
| QA-02 | Phase 0 | Complete |
| QA-03 | Phase 7 | Pending |
| DEPLOY-01 | Phase 7 | Pending |
| DEPLOY-02 | Phase 7 | Pending |

**Coverage:**
- v1 requirements: 38 total
- Mapped to phases: 38
- Unmapped: 0

---
*Requirements defined: 2026-04-28*
*Last updated: 2026-04-28 after GSD project initialization*
