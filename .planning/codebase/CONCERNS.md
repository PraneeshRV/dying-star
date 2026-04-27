# Codebase Concerns

**Analysis Date:** 2026-04-27

## Tech Debt

**Planning and README status drift:**
- Issue: Active planning files recognize the M3 first pass, `/resume`, static content data, and production smoke status, while `README.md` still reports M1 at 10%, M2 at 0%, and M3 at 0%.
- Files: `README.md`, `docs/progress.md`, `docs/task_plan.md`, `.planning/STATE.md`, `.planning/ROADMAP.md`, `.planning/REQUIREMENTS.md`
- Impact: Future phases can be planned from stale status, causing duplicate work or accidental replacement of implemented sections in `components/sections/` and `app/page.tsx`.
- Fix approach: Treat `.planning/STATE.md` and `.planning/REQUIREMENTS.md` as the current source of truth, then update `README.md` and legacy docs after each phase.

**Certification data has no rendered UI:**
- Issue: Certification and education entries exist as data but are not imported by any section or route.
- Files: `content/data/certifications.json`, `types/index.ts`, `app/page.tsx`, `components/sections/ExperienceSection.tsx`, `components/ui/FloatingNav.tsx`
- Impact: Credential proof is hidden from visitors, and M3 remains incomplete against `CONT-07`.
- Fix approach: Add a certifications section or fold credential cards into `components/sections/ExperienceSection.tsx`, define a `Certification` type in `types/index.ts`, and add a nav item only if the section becomes first-class.

**Contact form is a mailto shell instead of the planned Resend workflow:**
- Issue: The contact form submits to `mailto:` and has no client validation, success/error state, API route, toast integration, or spam resistance.
- Files: `components/sections/ContactSection.tsx`, `content/data/profile.json`, `package.json`, `.planning/ROADMAP.md`, `.planning/REQUIREMENTS.md`
- Impact: Visitors depend on local email clients, submissions cannot be observed or validated, and installed packages `react-hook-form`, `zod`, `react-hot-toast`, and the planned Resend integration are unused.
- Fix approach: Implement `app/api/contact/route.ts` with Resend, keep the direct mail link as fallback, and bind `components/sections/ContactSection.tsx` to validated client/server states.

**Static content has no schema or freshness checks:**
- Issue: JSON imports are cast directly to local TypeScript shapes; no Zod schema or build-time validation checks required fields, URL shape, project status, or in-progress credential claims.
- Files: `content/data/profile.json`, `content/data/projects.json`, `content/data/skills.json`, `content/data/experience.json`, `content/data/ctf-achievements.json`, `content/data/certifications.json`, `types/index.ts`
- Impact: A malformed content edit can break rendering at runtime or publish stale/unverifiable profile claims without CI catching it.
- Fix approach: Add schemas under `content/` or `lib/`, validate JSON during build/test, and keep project/CTF links specific rather than generic profile URLs.

**GPU tier model remains split between store and scene:**
- Issue: `stores/globalStore.ts` describes `gpuTier` as `1=high, 4=no-webgl`, but `components/3d/SpaceCanvas.tsx` treats `tier <= 1` as low-end and `tier > 1` as bloom-capable.
- Files: `stores/globalStore.ts`, `types/index.ts`, `components/3d/SpaceCanvas.tsx`
- Impact: Future fallback, animation, or game work can invert performance decisions and over-render on weak devices.
- Fix approach: Normalize GPU capability behind a shared wrapper such as `hooks/useGpuCapability.ts` with explicit states like `none`, `low`, `medium`, and `high`.

## Known Bugs

**Next dev/Turbopack smoke does not reliably reach hydrated app state:**
- Symptoms: Current project state records that `npm run dev` with default Turbopack accepted the port but did not reach DOMContentLoaded within the 45s Playwright smoke timeout; `npm run dev -- --webpack` returned HTML but did not hydrate the app shell within the smoke window.
- Files: `.planning/STATE.md`, `docs/progress.md`, `next.config.ts`, `package.json`, `app/MainContent.tsx`
- Trigger: Run the dev-server browser smoke path against `npm run dev` or the webpack fallback.
- Workaround: Use `npm run build` plus `npm run start` for production smoke until the dev-server behavior has a smaller reproduction and documented fix.

**WebGL fallback only catches React render errors:**
- Symptoms: `WebGLErrorBoundary` renders `StarFallback` only when a React subtree throws; it does not proactively handle no-WebGL devices, WebGL context loss, rejected GPU detection, hidden tabs, or reduced-motion contexts before mounting `<Canvas>`.
- Files: `app/page.tsx`, `components/3d/WebGLErrorBoundary.tsx`, `components/3d/SpaceCanvas.tsx`, `components/fallbacks/StarFallback.tsx`
- Trigger: Disable WebGL, force context loss, run on a weak mobile GPU, or test reduced-motion with the hero in view.
- Workaround: Keep the SSR hero copy readable and add explicit capability gates before rendering `Canvas`.

**Fallback starfield is nondeterministic across remounts:**
- Symptoms: `StarFallback` generates star positions with `Math.random()` inside `useMemo`, so every remount changes the fallback background.
- Files: `components/fallbacks/StarFallback.tsx`
- Trigger: Remount the fallback during navigation, error recovery, or hot reload.
- Workaround: Use a deterministic seeded layout or a static CSS background so screenshots and smoke tests are stable.

## Security Considerations

**Remote image wildcard allows every HTTPS host:**
- Risk: `next.config.ts` permits optimized images from any HTTPS hostname using `hostname: "**"`.
- Files: `next.config.ts`
- Current mitigation: No `next/image` usage or external image rendering is detected in `app/`, `components/`, or `content/`.
- Recommendations: Remove the wildcard until real remote images are introduced, or restrict `remotePatterns` to specific trusted hosts.

**Future contact API can become public spam infrastructure:**
- Risk: The planned Resend endpoint will be internet-facing and can be abused if it ships without validation, rate limiting, origin checks, honeypot/turnstile-style friction, and conservative email content handling.
- Files: `components/sections/ContactSection.tsx`, `package.json`, `.planning/ROADMAP.md`, `.planning/REQUIREMENTS.md`, `.env.example`
- Current mitigation: `app/api/contact/route.ts` does not exist, so there is no exposed mail-sending API. `.env.example` is present only as environment configuration metadata; do not store live secrets there.
- Recommendations: Implement `app/api/contact/route.ts` with server-side Zod validation, length limits, rate limiting, safe recipient configuration, Resend secrets only in environment variables, and no secret values in client code.

**Public profile data exposes direct personal contact information:**
- Risk: `content/data/profile.json` contains the public email address, and `ContactSection` renders it through `mailto:` links.
- Files: `content/data/profile.json`, `components/sections/ContactSection.tsx`
- Current mitigation: This is intentional for the current mailto fallback.
- Recommendations: Keep mailto as a fallback but prefer the API route for primary submissions once abuse controls exist; consider obfuscating or rate-limiting visible direct contact surfaces if spam becomes a problem.

**Client-visible challenge token must remain fake-only:**
- Risk: `CTFSection` reveals a challenge-like token in client-rendered markup after repeated clicks; future terminal/game work may add more easter eggs.
- Files: `components/sections/CTFSection.tsx`, `.planning/REQUIREMENTS.md`, `.planning/ROADMAP.md`
- Current mitigation: The current token is visibly fake and no real secrets are present in the implementation.
- Recommendations: Document all client-visible flags as fake challenges and never place deploy secrets, API keys, or private challenge material in `app/`, `components/`, `content/`, or `public/`.

## Performance Bottlenecks

**Heavy WebGL scene mounts before low-capability fallback decisions:**
- Problem: `SpaceCanvas` always renders `<Canvas>` and then adjusts counts/effects after `getGPUTier()` resolves.
- Files: `components/3d/SpaceCanvas.tsx`, `app/page.tsx`, `components/fallbacks/StarFallback.tsx`
- Cause: GPU detection is local state inside the WebGL component instead of a pre-render capability gate.
- Improvement path: Detect WebGL support, reduced motion, mobile constraints, and GPU tier before mounting `Canvas`; render `StarFallback` or a static hero background for no-WebGL/low-tier cases.

**Continuous animation has no centralized pause budget:**
- Problem: Multiple `useFrame`, `requestAnimationFrame`, `setInterval`, and CSS animations run independently.
- Files: `components/3d/Constellation.tsx`, `components/3d/NeutronStar.tsx`, `components/3d/OrbitalPlanets.tsx`, `components/3d/DysonSphere.tsx`, `components/3d/Starfield.tsx`, `components/ui/CustomCursor.tsx`, `components/ui/TypewriterText.tsx`, `components/sections/CTFSection.tsx`
- Cause: Hidden-tab, offscreen, battery-saver, and reduced-motion behavior is not governed by one shared signal.
- Improvement path: Add a motion/performance policy hook and use it to pause or simplify 3D frames, pointer effects, counters, and decorative CSS animations.

**Constellation neighbor search scales quadratically at mount:**
- Problem: `Constellation` precomputes star pairs with nested loops and caps edges after `count * 8`.
- Files: `components/3d/Constellation.tsx`, `components/3d/SpaceCanvas.tsx`
- Cause: Pair discovery is O(n^2), with `count` currently scaled up to 750 constellation points.
- Improvement path: Keep current caps for MVP, but use spatial partitioning or precomputed deterministic constellations if counts increase.

**Root layout gates all route visibility behind a client boot flow:**
- Problem: `app/layout.tsx` wraps every route with `MainContent`, and `MainContent` hides children until client mount and boot completion.
- Files: `app/layout.tsx`, `app/MainContent.tsx`, `components/ui/BootLoader.tsx`, `stores/globalStore.ts`
- Cause: The boot loader is global rather than scoped to the home-page experience.
- Improvement path: Keep essential route content visible to SSR and assistive technologies, make boot decorative/skippable, and avoid delaying `/resume` behind the same home boot sequence.

## Fragile Areas

**Accessibility depends on manual review:**
- Files: `biome.json`, `components/3d/OrbitalPlanets.tsx`, `components/ui/ProjectCard.tsx`, `components/ui/FloatingNav.tsx`, `components/ui/GlitchText.tsx`, `components/sections/SkillsSection.tsx`, `components/sections/CTFSection.tsx`
- Why fragile: `biome.json` disables `a11y.noStaticElementInteractions`, Canvas planets are pointer-only, hover-only labels are used in the 3D scene and skill graph, and no automated keyboard/screen-reader checks exist.
- Safe modification: Keep every Canvas/hover interaction mirrored by DOM links or buttons, run keyboard navigation checks for `FloatingNav`, filters, details/summary, contact, and resume, and add Playwright accessibility smoke coverage.
- Test coverage: No Playwright, axe, Lighthouse, or keyboard test suite is configured.

**Canvas navigation is not an accessible source of truth:**
- Files: `components/3d/OrbitalPlanets.tsx`, `components/ui/FloatingNav.tsx`, `app/page.tsx`
- Why fragile: Planet meshes call `document.querySelector(...).scrollIntoView()` and mutate `document.body.style.cursor`, but they do not expose keyboard interaction or semantic links.
- Safe modification: Treat `FloatingNav`, hero CTAs, and section headings as the canonical navigation; keep planet clicks decorative or mirror them with accessible DOM controls.
- Test coverage: No E2E coverage verifies hash navigation, section focus, or reduced-motion scroll behavior.

**Next.js 16 behavior requires local documentation checks:**
- Files: `AGENTS.md`, `package.json`, `next.config.ts`, `app/layout.tsx`, `app/resume/page.tsx`
- Why fragile: `AGENTS.md` explicitly warns that this Next.js version has breaking API/convention changes, and the app uses `next@16.2.4` with Turbopack configuration and experimental view transitions.
- Safe modification: Read the relevant files under `node_modules/next/dist/docs/` before changing routes, metadata, image config, dev/build config, or App Router behavior.
- Test coverage: Production build and production smoke are documented; dev smoke is still unstable.

**Static PDF resume path is manual:**
- Files: `docs/Praneesh_R_V_Resume.pdf`, `public/resume.pdf`, `app/resume/page.tsx`
- Why fragile: The source resume in `docs/` and served asset in `public/` can drift because there is no sync check.
- Safe modification: Treat `public/resume.pdf` as the deploy asset and add a documented update step or checksum check when replacing the resume.
- Test coverage: Production smoke checks route presence, but no test verifies that the PDF matches the source document.

## Scaling Limits

**Local JSON content is the only data layer:**
- Current capacity: Static imports from `content/data/profile.json`, `content/data/projects.json`, `content/data/skills.json`, `content/data/experience.json`, `content/data/ctf-achievements.json`, and `content/data/certifications.json`.
- Limit: No live CTF updates, admin editing, contact storage, analytics event store, blog index generation, or global Packet Runner leaderboard exists.
- Scaling path: Keep v1 static unless a phase explicitly adds MDX, Resend, Vercel Analytics, or Supabase with schemas and environment handling.

**Project proof is shallow for recruiter evaluation:**
- Current capacity: `content/data/projects.json` contains three project summaries and generic GitHub profile links.
- Limit: Visitors cannot inspect flagship case studies, screenshots, live demos, deep technical writeups, or repository-specific links from the current data.
- Scaling path: Add specific URLs, proof artifacts, and case-study routes before adding broader integrations.

**Launch metadata assets are incomplete:**
- Current capacity: `app/layout.tsx` defines metadata and `metadataBase`, but no `robots.txt`, sitemap route/file, JSON-LD, custom OG image, Twitter image, or analytics integration exists.
- Limit: Public launch on `praneeshrv.me` has weaker SEO/social verification and no usage telemetry.
- Scaling path: Add launch assets in the phase that owns `SEO-01`, `SEO-02`, and `DEPLOY-02`.

## Dependencies at Risk

**Unused planned dependencies increase audit and maintenance surface:**
- Risk: `react-hook-form`, `zod`, `react-hot-toast`, `gsap`, `@gsap/react`, `splitting`, and `date-fns` are installed but not used by current rendered routes.
- Impact: Dependency updates and vulnerability audit noise can accumulate before the features land.
- Migration plan: Keep packages only if near-term phases use them; otherwise remove deferred dependencies and add them with the phase that needs them.

**Google font fetching can make offline builds brittle:**
- Risk: `app/layout.tsx` uses `next/font/google` for Orbitron, DM Sans, JetBrains Mono, and Cinzel.
- Impact: Network-restricted builds can fail if font assets are not cached.
- Migration plan: If CI or deployment needs offline reproducibility, place font files under `public/fonts/` and switch to `next/font/local`.

**Experimental framework flags can change under dependency updates:**
- Risk: `next.config.ts` enables `experimental.viewTransition` and custom Turbopack root behavior.
- Impact: Future Next.js upgrades can change local dev, routing transitions, or build diagnostics.
- Migration plan: Pin upgrade work to local Next docs, verify with `npm run build`, production smoke, and a dev-server smoke reproduction.

## Missing Critical Features

**Certifications UI remains pending:**
- Problem: Credential data exists but is invisible in the UI.
- Files: `content/data/certifications.json`, `app/page.tsx`, `components/sections/ExperienceSection.tsx`, `components/ui/FloatingNav.tsx`
- Blocks: `CONT-07` and the M3 content-shell completion pass.

**Resend-backed contact API remains pending:**
- Problem: There is no `app/api/contact/route.ts`, no server-side mail sender, no validation boundary, and no success/error UX beyond browser mailto behavior.
- Files: `components/sections/ContactSection.tsx`, `package.json`, `.planning/ROADMAP.md`, `.planning/REQUIREMENTS.md`
- Blocks: `FORM-02`, `FORM-03`, reliable contact submissions, and launch-ready abuse controls.

**3D fallback and validation phase remains pending:**
- Problem: Low-end GPU, no-WebGL, hidden-tab, mobile, context-loss, and reduced-motion cases are not yet validated with browser screenshots or smoke tests.
- Files: `components/3d/SpaceCanvas.tsx`, `components/3d/WebGLErrorBoundary.tsx`, `components/fallbacks/StarFallback.tsx`, `.planning/ROADMAP.md`, `.planning/REQUIREMENTS.md`
- Blocks: `SCENE-03`, `SCENE-04`, and confidence that the visual centerpiece is progressive enhancement.

**Terminal, blog, game, SEO, analytics, and deployment polish are not implemented:**
- Problem: Planned routes/features for terminal commands, Packet Runner, MDX blog, RSS, sitemap, robots, OG images, analytics, and deployment docs are absent.
- Files: `app/`, `content/`, `public/`, `.planning/ROADMAP.md`, `.planning/REQUIREMENTS.md`, `docs/task_plan.md`
- Blocks: Later roadmap phases and public launch readiness.

## Test Coverage Gaps

**No application test runner or E2E config exists:**
- What's not tested: Home section rendering, section filters, contact form behavior, `/resume`, `not-found`, content schema validation, WebGL fallback, keyboard navigation, or future API routes.
- Files: `package.json`, `biome.json`, `app/`, `components/`, `content/data/`
- Risk: Runtime regressions can ship while `npm run lint` and TypeScript remain green.
- Priority: High

**3D scene lacks automated canvas/fallback checks:**
- What's not tested: Nonblank canvas pixels, shader compile behavior, context loss, reduced-motion fallback, mobile viewport behavior, low-tier GPU path, and `StarFallback` rendering.
- Files: `components/3d/SpaceCanvas.tsx`, `components/3d/Constellation.tsx`, `components/3d/NeutronStar.tsx`, `components/fallbacks/StarFallback.tsx`
- Risk: The hero can fail blank or overload devices without being caught by unit checks.
- Priority: High

**Accessibility and mobile launch checks are manual only:**
- What's not tested: Tab order, focus visibility, hover-only tooltip alternatives, screen-reader labels, contrast under glow effects, reduced-motion equivalence, mobile overflow, and cross-browser behavior.
- Files: `components/ui/FloatingNav.tsx`, `components/ui/FloatingNav.module.css`, `components/ui/ProjectCard.tsx`, `components/sections/SkillsSection.tsx`, `components/sections/ContactSection.tsx`, `app/globals.css`
- Risk: The portfolio can look complete while remaining hard to navigate for keyboard, assistive tech, mobile, or motion-sensitive users.
- Priority: High

**Dev-server smoke issue is documented but not covered by a reproducible test:**
- What's not tested: Whether `npm run dev` reaches DOMContentLoaded and hydrates the app shell within an expected timeout.
- Files: `.planning/STATE.md`, `docs/progress.md`, `next.config.ts`, `package.json`
- Risk: Contributors may waste time debugging production-healthy changes because the local dev smoke path is noisy.
- Priority: Medium

---

*Concerns audit: 2026-04-27*
