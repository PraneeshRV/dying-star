# Feature Landscape

**Domain:** Cybersecurity portfolio with immersive 3D space/terminal aesthetic
**Project:** dying-star
**Researched:** 2026-04-28
**Overall confidence:** HIGH for implementation reality and phase ordering; MEDIUM for market/ecosystem expectations

## Executive Take

The feature ecosystem for this project is clear: this cannot behave like a generic designer portfolio. For a cybersecurity student portfolio, the feature stack must prove identity, competence, credibility, and contactability quickly, then add immersive/interactive layers only after the proof path is stable. The current build already has the right foundation: hero, About, Projects, Skills, Experience, CTF, Contact shell, Resume route, design system primitives, and most of the 3D scene are implemented.

The remaining launch-critical gaps are not broad feature invention. They are proof completion and resilience: render the existing certifications data, sharpen flagship project proof, replace mailto-only contact with a validated Resend flow, and make the 3D centerpiece degrade before it can harm usability. Terminal, Packet Runner, blog, and anime/easter-egg polish are valuable differentiators, but they should not block a credible MVP.

The most important product rule is: every memorable flourish needs a professional fallback. Canvas navigation cannot be the only navigation. Moving effects need reduced-motion and pause/stop/hide behavior. Fake CTF tokens must stay fake. Contact submission must not become public spam infrastructure. Blog and game work should wait until they add real proof rather than decorative surface area.

## Current Implementation Reality

| Area | Current State | Complexity to Finish | Evidence | Roadmap Impact |
|------|---------------|----------------------|----------|----------------|
| Home hero | Present | Low | `app/page.tsx`, `.planning/STATE.md` | Preserve SSR-readable identity and CTAs. |
| Design system | Present | Low-Medium | `components/ui/`, `app/globals.css` | Stable enough for more sections and forms. |
| 3D space scene | Mostly present | High | `components/3d/`, `components/fallbacks/StarFallback.tsx` | Needs explicit no-WebGL/mobile/reduced-motion fallback and screenshot validation. |
| About | Present | Low | `components/sections/AboutSection.tsx`, `content/data/profile.json` | Good table-stakes credibility section. |
| Projects | Present but shallow proof | Medium | `components/sections/ProjectsSection.tsx`, `content/data/projects.json` | Needs project-specific URLs, proof artifacts, and flagship depth. |
| Skills | Present | Low-Medium | `components/sections/SkillsSection.tsx`, `content/data/skills.json` | Keep proficiency labels conservative and evidence-backed. |
| Experience | Present | Low | `components/sections/ExperienceSection.tsx`, `content/data/experience.json` | Strong chronology; can cross-link certifications. |
| CTF Hall of Fame | Present | Low-Medium | `components/sections/CTFSection.tsx`, `content/data/ctf-achievements.json` | One of the strongest cyber-specific proof areas. |
| Certifications | Data only | Low-Medium | `content/data/certifications.json` | Must render before M3 is complete. |
| Contact | Mailto shell only | Medium | `components/sections/ContactSection.tsx` | Resend API, validation, success/error UX, and abuse controls remain pending. |
| Resume | Present | Low | `app/resume/page.tsx`, `public/resume.pdf` | Keep route and PDF stable; instrument later. |
| Blog | Placeholder only | High | `content/blog/.gitkeep`, `types/index.ts` | Defer until real writeups exist. |
| Terminal | State/types only | High | `stores/globalStore.ts`, `types/index.ts` | Build after content targets stabilize. |
| Packet Runner | Placeholder only | High | `components/game/.gitkeep`, `stores/globalStore.ts` | Optional differentiator after terminal. |
| SEO/analytics/launch QA | Partial metadata only | Medium-High | `.planning/REQUIREMENTS.md`, `.planning/ROADMAP.md` | Final polish phase, not content-shell blocker. |
| Dev-server reliability | Pending issue | Medium | `.planning/STATE.md`, `.planning/codebase/CONCERNS.md` | Production path is validated; dev smoke needs fix or documented workaround. |

## Table Stakes

Features users expect. Missing = the product feels incomplete or untrustworthy.

| Feature | Why Expected | Complexity | Current Status | Recommendation |
|---------|--------------|------------|----------------|----------------|
| Immediate identity and role | Recruiters/security peers need to know who this is and why it matters within seconds. | Low | Present | Keep hero text readable before 3D hydration; avoid hiding identity behind boot/canvas effects. |
| Resume access | Personal portfolios need a fast path to the formal resume. | Low | Present | Keep `/resume` and `/resume.pdf`; later track resume clicks via analytics. |
| About/profile proof | Visitors need affiliation, location/context, learning track, and operator identity. | Low | Present | Current HUD/profile structure is enough for MVP. |
| Project portfolio | Cybersecurity credibility depends on concrete work, not just tool names. | Medium | Present, shallow links | Upgrade RedCalibur, Axec-CLI, and L3m0nCTF with specific repo/live links, screenshots, case-study notes, or constraints. |
| Skills grouped by capability | Hiring and peer review both need scannable capability areas. | Low-Medium | Present | Keep categories aligned to security, development, infrastructure, and tools; avoid inflated expertise claims. |
| Experience/timeline | Gives chronology and supports student/in-progress context. | Low-Medium | Present | Keep education, CTF, project, and milestone entries together unless certifications become a separate anchor. |
| CTF achievements | CTFs are a domain-specific credibility signal. | Medium | Present | Add verified profile/event links when available; keep achievements factual and dated. |
| Certifications/education badges | Cybersecurity audiences expect education and certification status to be visible. | Low-Medium | Pending UI | Render `PJPT` and `B.Tech CSE Cybersecurity` from `content/data/certifications.json`; clearly label both as in-progress. |
| Reliable contact path | Recruiters/collaborators need a form that works without relying on the visitor's email client. | Medium | Partial | Implement Resend API and keep `mailto:` as fallback. |
| Form validation and spam resistance | Public contact forms attract abuse. | Medium | Pending | Add server-side validation, rate limiting/honeypot/friction, length limits, and server-only secrets. |
| Mobile/responsive usability | The audience will include phones, tablets, and low-power machines. | Medium | Partial | Prioritize no-overlap mobile checks and a non-WebGL hero path before adding more animation. |
| Keyboard/screen-reader path | Interactive portfolios still need accessible core navigation and forms. | Medium | Partial | Keep DOM nav canonical; canvas planets and hidden commands are enhancements only. |
| Reduced-motion control | The site has continuous 3D, cursor, glitch, and future scroll animations. | Medium | Partial | Honor `prefers-reduced-motion`; provide static or slowed equivalents before launch. |
| SEO/social basics | A named personal domain should be discoverable and preview cleanly. | Medium | Pending launch polish | Add sitemap, robots, canonical metadata, JSON-LD/ProfilePage/Person where appropriate, and OG assets in launch phase. |
| Basic analytics | The owner needs to know whether resume, contact, blog, terminal, and game features matter. | Low-Medium | Pending | Use Vercel Analytics in M8 after final feature surfaces are known. |

## Differentiators

Features that make this portfolio memorable. They are valuable, but only after table stakes are stable.

| Feature | Value Proposition | Complexity | Current Status | Recommendation |
|---------|-------------------|------------|----------------|----------------|
| Dying-star/quasar 3D hero | Establishes a unique brand and makes the first viewport memorable. | High | Mostly present | Keep as the visual centerpiece, but invest in fallback/device policy before more effects. |
| Orbital planet navigation | Turns page sections into exploration. | Medium-High | Partially present | Keep decorative/enhancement-only; FloatingNav and anchors remain canonical. |
| Terminal boot/system aesthetic | Makes the portfolio feel like a live cyber system. | Medium | Present primitives | Use sparingly so content still reads professionally. |
| Fake CTF flag interaction | Shows security taste and playfulness without a large feature build. | Low-Medium | Present | Keep tokens visibly fake and document future flags as client-visible challenges. |
| Full terminal overlay | Lets visitors discover commands for projects, skills, CTF stats, resume, contact, and hidden jokes. | High | Deferred | Build after content model is stable; include visible UI trigger and focus management. |
| Packet Runner minigame | Strong memorability tied to packet/security theme. | High | Deferred | Lazy-load, keep optional, use localStorage-only high scores for v1. |
| Blog/CTF writeups | Adds long-term proof, SEO, and technical depth. | High | Deferred | Do not ship placeholder posts; start with one real CTF/writeup and one build/research post. |
| `/uses` Arch/tooling page | Good fit for Linux/terminal identity and peer credibility. | Medium | v2/future | Add only after launch content and blog are useful. |
| Anime easter eggs | Adds personality for visitors who notice. | Low-Medium | Partial | Keep subtle, optional, and never in the critical recruiter path. |
| Case-study routes | Converts shallow project cards into deep proof. | Medium-High | Future | Better than adding more cards if there are 1-2 flagship projects ready for deep documentation. |

## Anti-Features

Features to explicitly avoid or delay.

| Anti-Feature | Why Avoid | What to Do Instead |
|--------------|-----------|-------------------|
| Fake or inflated security claims | Cybersecurity audiences punish unverifiable claims. | Use dated CTF results, in-progress labels, repository links, screenshots, and concrete project constraints. |
| 3D as a hard dependency | WebGL failure, low GPU, or reduced-motion users could lose the whole experience. | Keep SSR text, DOM nav, CSS/static fallback, and screenshot checks. |
| Contact API without abuse controls | A public mail endpoint can become spam infrastructure. | Ship validation, rate limiting/honeypot/friction, safe recipient config, and env-only secrets with the API. |
| Placeholder blog posts | Weak writing reduces credibility more than no blog. | Defer blog until real CTF/build posts exist. |
| Global leaderboard in v1 | Adds storage, moderation, and security scope before the game is proven. | Use localStorage first; consider Supabase only after Packet Runner has value. |
| Live CTFTime/GitHub feeds before static proof is clean | External APIs add fragility without fixing shallow project evidence. | Add specific static links and case-study detail first. |
| Canvas-only navigation | Mesh clicks are not accessible enough to be the primary route through the page. | Keep semantic anchors, FloatingNav, and buttons as the source of truth. |
| Too many visible easter eggs | Recruiter flow can become noisy or unserious. | Hide optional jokes behind terminal/console/rare interactions. |
| Real secrets or real flags in client code | Public bundles and static content are inspectable. | Use fake challenge tokens only. |
| Paid or deprecated tooling | Project constraints require free/student-friendly, maintained tools. | Stay with the corrected stack from `docs/PERFECTED_PLAN.md`. |
| Broad CMS/admin system | It increases attack surface and maintenance for a small portfolio. | Keep JSON/MDX until content updates become a real bottleneck. |
| Auth/user accounts | Public portfolio does not need identity management. | Avoid auth entirely for v1. |

## Deferred and V2 Features

| Feature | Target | Complexity | Defer Because | Revisit When |
|---------|--------|------------|---------------|--------------|
| Scroll/entrance animation layer | Phase 4 | Medium-High | Needs stable section DOM first. | Certifications/contact/project content are complete. |
| Interactive terminal overlay | Phase 4 | High | Commands need stable content targets. | Section IDs, project data, and contact paths are finalized. |
| Packet Runner | Phase 5 | High | Needs isolated performance budget and optional launch paths. | Terminal and global game state are ready. |
| Blog/MDX engine | Phase 6 | High | Real content matters more than route scaffolding. | At least two worthwhile posts exist. |
| RSS feed | Phase 6 | Low-Medium | Depends on blog metadata. | Blog engine is implemented. |
| Analytics instrumentation | Phase 7 | Low-Medium | Event taxonomy depends on final features. | Resume/contact/terminal/game/blog surfaces are stable. |
| `/uses` page | v2 | Medium | Nice identity layer, not core launch proof. | Main launch site and blog are healthy. |
| Supabase leaderboard | v2 | High | Database/security scope is premature. | Game retention justifies public persistence. |
| Admin-editable CMS | v2 | High | Local JSON/MDX is simpler and safer. | Manual content edits become a proven bottleneck. |
| Live activity integrations | v2 | Medium-High | Static proof has higher launch ROI. | API limits, caching, privacy, and value are clearly defined. |
| Internationalization | v2 | High | No current evidence of need. | Analytics show a real audience need. |

## Complexity Map

| Feature Area | Complexity | Main Risk | Confidence |
|--------------|------------|-----------|------------|
| Certifications UI | Low-Medium | Layout/navigation fit and honest in-progress labeling. | HIGH |
| Project proof improvement | Medium | Lack of specific links/screenshots/case-study material. | HIGH |
| Resend contact flow | Medium | Abuse controls and server/client validation boundary. | HIGH |
| 3D fallback policy | High | Device detection, reduced motion, context loss, and screenshot validation. | HIGH |
| Motion layer | Medium-High | Jank, visual noise, reduced-motion gaps. | MEDIUM |
| Terminal | High | Focus management, command scope creep, and fake-only token discipline. | MEDIUM |
| Packet Runner | High | Accessibility/mobile controls/performance relative to portfolio value. | MEDIUM |
| Blog engine | High | Content quality and MDX/SEO integration. | MEDIUM |
| SEO/analytics/launch QA | Medium-High | Missing validation gates and social asset polish. | HIGH |

## Feature Dependencies

```text
Existing baseline
  -> Certifications UI
  -> Project proof improvements
  -> Responsive visual pass

content/data/certifications.json
  -> Certifications section or Experience credential band
  -> Optional nav item if first-class section

content/data/projects.json
  -> Project cards
  -> Future terminal `projects` command
  -> Future project case-study routes
  -> Future blog links

content/data/skills.json
  -> Skills section
  -> Future terminal `skills` command

content/data/ctf-achievements.json
  -> CTF Hall of Fame
  -> Future terminal `ctf --stats`
  -> Future CTF writeups

Contact shell
  -> `app/api/contact/route.ts`
  -> Zod/react-hook-form validation
  -> Resend server sender
  -> Success/error UI
  -> Abuse controls
  -> Analytics event

3D scene
  -> Explicit capability/reduced-motion gate
  -> CSS/static fallback
  -> Desktop/mobile/reduced-motion screenshot smoke
  -> Launch confidence

Stable sections
  -> Motion layer
  -> Terminal commands
  -> Blog preview links

Terminal
  -> Packet Runner trigger
  -> Hidden fake flag command
  -> Usage analytics

Blog engine
  -> RSS
  -> Article metadata
  -> BlogPosting JSON-LD
  -> CTF/project case-study SEO

Launch polish
  -> Sitemap/robots
  -> OG images
  -> Person/ProfilePage structured data
  -> Vercel Analytics
  -> Lighthouse/accessibility/mobile/cross-browser validation
```

## MVP Recommendation

Prioritize before calling the current content shell complete:

1. Render certifications/education from `content/data/certifications.json`, clearly marking PJPT and B.Tech as in-progress.
2. Improve flagship project proof: specific repository/live links where available, sharper descriptions, visible status, and at least one deeper RedCalibur or L3m0nCTF proof path.
3. Keep the current Contact shell but plan Phase 2 immediately for Resend, validation, success/error states, and anti-spam.
4. Schedule 3D fallback work before animation/terminal expansion; the visual centerpiece must be resilient on low-end, mobile, no-WebGL, hidden-tab, and reduced-motion contexts.
5. Run mobile/desktop visual checks after Certifications and project proof updates to prevent text overlap and layout regressions.

Defer:

| Feature | Reason |
|---------|--------|
| Terminal | Strong differentiator, but command content depends on stable sections and proof data. |
| Packet Runner | Memorable but optional; it should not compete with recruiter comprehension or performance. |
| Blog | Valuable only with real writing; placeholder posts are a credibility loss. |
| Supabase/global leaderboard | Security/storage/moderation complexity is premature. |
| Live feeds | Static verified proof has better launch ROI. |

## Roadmap Implications

Suggested phase ordering:

1. **Finish Content Shell** - Certifications UI, project proof depth, responsive checks. Addresses `CONT-07` and `CONT-09`.
2. **Contact API** - Resend form, validation, rate limiting/spam controls, fallback mail path. Addresses `FORM-02` and `FORM-03`.
3. **3D Fallbacks and Validation** - Capability gates, reduced-motion/static fallback, screenshots, and dev-server workaround/fix. Addresses `SCENE-03` and `SCENE-04`.
4. **Motion and Terminal** - Add animation and terminal only after the page has stable DOM/content. Addresses `MOTN-*` and `TERM-*`.
5. **Packet Runner** - Lazy-loaded optional game with localStorage high score only. Addresses `GAME-*`.
6. **Blog Engine** - MDX posts, Shiki, RSS, and technical writing proof. Addresses `BLOG-*`.
7. **Launch Polish** - SEO, analytics, accessibility, mobile, cross-browser, deploy docs. Addresses `SEO-*`, `QA-03`, and `DEPLOY-*`.

## Confidence Assessment

| Area | Confidence | Reason |
|------|------------|--------|
| Current implementation state | HIGH | Verified through `.planning/STATE.md`, codebase maps, current roadmap, and content JSON. |
| Table stakes | HIGH | Local requirements align with common portfolio expectations and official accessibility/search guidance. |
| Differentiators | MEDIUM-HIGH | Strongly grounded in project vision, but actual value depends on execution and performance. |
| Anti-features | HIGH | Based on current security/accessibility/performance risks in project docs and public web guidance. |
| Deferred/v2 ordering | HIGH | Matches `.planning/ROADMAP.md` dependencies and current implementation gaps. |
| External ecosystem | MEDIUM | Checked official sources for cyber workforce framing, accessibility, and search/performance, but portfolio taste remains partly qualitative. |

## Sources

Local project sources:

- `.planning/codebase/ARCHITECTURE.md`
- `.planning/codebase/STRUCTURE.md`
- `.planning/codebase/CONCERNS.md`
- `.planning/PROJECT.md`
- `.planning/REQUIREMENTS.md`
- `.planning/ROADMAP.md`
- `.planning/STATE.md`
- `docs/task_plan.md`
- `docs/MODULE_BREAKDOWN.md`
- `docs/PERFECTED_PLAN.md`
- `content/data/profile.json`
- `content/data/projects.json`
- `content/data/skills.json`
- `content/data/experience.json`
- `content/data/ctf-achievements.json`
- `content/data/certifications.json`

External research sources:

- NIST NICE Framework Resource Center: https://www.nist.gov/itl/applied-cybersecurity/nice/resources/nice-cybersecurity-workforce-framework
- NIST NICE Framework Components v2.0.0 announcement: https://www.nist.gov/news-events/news/2025/03/nice-releases-nice-framework-components-v200
- CISA Cyber Career Pathways Tool announcement: https://www.cisa.gov/news-events/news/cisa-releases-new-cyber-career-pathways-tool
- W3C WCAG 2.2 Understanding SC 2.2.2 Pause, Stop, Hide: https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide
- Google/web.dev Core Web Vitals: https://web.dev/articles/vitals
- Google Search Central Core Web Vitals: https://developers.google.com/search/docs/appearance/core-web-vitals
- Google Search Central structured data overview: https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data
- Google Search Central robots.txt guidance: https://developers.google.com/search/docs/crawling-indexing/robots/create-robots-txt
