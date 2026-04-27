# Project Research Summary

**Project:** Dying Star Portfolio
**Domain:** Brownfield cybersecurity portfolio with immersive WebGL, terminal, game, blog, and contact layers
**Researched:** 2026-04-28
**Confidence:** HIGH

## Executive Summary

`dying-star` is a brownfield Next.js 16 portfolio, not a greenfield app. The repo already has a working App Router foundation, production metadata, typed local content, a 3D hero, design primitives, home sections, CTF interaction, contact shell, and `/resume`. Expert work from here should preserve the existing architecture and finish the missing proof, resilience, and launch paths rather than rebuilding the site or changing frameworks.

The recommended approach is to keep the current stack: Next.js 16.2.4, React 19.2.4, TypeScript strict mode, Tailwind CSS v4, Biome, npm, React Three Fiber/Three.js, Zustand, static JSON content, and progressive client islands. Add new infrastructure only when the owning phase needs it: Resend for contact, Playwright for browser validation, MDX/Shiki for blog, xterm only for terminal, and Vercel Analytics at launch.

The key risks are not feature invention. They are shallow proof, fragile WebGL behavior, contact API abuse, accessibility loss behind visual effects, and planning from stale docs. Mitigate them by completing certifications and flagship project evidence first, keeping semantic DOM navigation and resume/contact paths reliable, gating WebGL before Canvas mount, keeping all secrets server-side, and treating `.planning/PROJECT.md`, `.planning/REQUIREMENTS.md`, `.planning/ROADMAP.md`, and `.planning/codebase/` as the current source of truth.

## Key Findings

### Recommended Stack

Keep the implemented stack and harden it. The current repo is already shaped around App Router, CSS-first Tailwind v4, strict TypeScript, static content, and client-only islands for WebGL and interactive UI. Switching package managers, routers, design systems, or 3D engines would create churn without helping Phase 1.

Framework-specific changes must be checked against installed Next.js 16 docs under `node_modules/next/dist/docs/` before implementation. Next 16 behavior differs from older assumptions: App Router route handlers belong in `app/api/**/route.ts`, `next lint` is gone, Turbopack is the default, and new request interception should prefer the current `proxy.ts` convention if needed.

**Core technologies:**
- Next.js 16.2.4 App Router: server-rendered routes, metadata, future route handlers, and launch metadata conventions.
- React 19.2.4: UI runtime; keep experimental features cautious around R3F and production build.
- TypeScript strict mode: required for content and integration safety; add validation instead of widening types.
- Tailwind CSS v4 plus CSS Modules: CSS-first tokens in `app/globals.css`, component-local styling for complex visuals.
- React Three Fiber, Three.js, drei, postprocessing, detect-gpu: 3D hero stack; must remain progressive enhancement.
- Zustand: global UI flags only, such as boot, GPU capability, terminal, and game state.
- Biome: linting, formatting, and import organization; do not use removed Next lint behavior.
- npm with `package-lock.json`: active package manager; do not introduce pnpm/yarn/bun drift.
- Zod and React Hook Form: already planned for content/contact validation, especially Phase 2.
- Playwright: first testing addition because browser behavior, canvas, responsive layout, and accessibility are the major risks.

### Expected Features

The portfolio must prove cybersecurity credibility before it adds more spectacle. Visitors should immediately understand identity, role, resume access, actual projects, skills, experience, CTF work, certifications, and a reliable way to contact Praneesh. Differentiators are valuable, but only when they enhance that proof path.

**Must have (table stakes):**
- Clear identity and cybersecurity role in the first viewport.
- Resume route and PDF access.
- About/profile proof with real context.
- Project portfolio with specific evidence, real links where available, and visible status.
- Skills grouped by capability with conservative, evidence-backed claims.
- Experience timeline and CTF achievements.
- Certifications and education badges rendered from `content/data/certifications.json`.
- Reliable contact path with mailto fallback now and Resend API in Phase 2.
- Mobile, keyboard, screen-reader, and reduced-motion paths outside the canvas.
- Basic launch SEO, sitemap, robots, canonical metadata, JSON-LD, OG assets, and analytics in the launch phase.

**Should have (differentiators):**
- Dying-star/quasar WebGL hero with deterministic static fallback.
- Orbital navigation as enhancement only, with DOM navigation as canonical.
- Terminal overlay with useful portfolio commands and visible trigger.
- Packet Runner as an optional lazy-loaded minigame with localStorage high score only.
- Blog/CTF writeups with real technical content, MDX, Shiki, RSS, and post metadata.
- Flagship case-study routes or writeups for RedCalibur, Axec-CLI, and L3m0nCTF when content is ready.

**Defer (v2+):**
- Supabase/global leaderboard until the game proves value.
- CMS/admin editing until local JSON/MDX becomes a real bottleneck.
- Auth/user accounts; the portfolio is public.
- Live GitHub/CTFTime feeds before static proof is strong.
- `/uses`, internationalization, and broad lab pages until the launch site is stable.
- Placeholder blog posts, real-looking secrets, paid tooling, and client-visible private data.

### Architecture Approach

Preserve the current architecture: route files are Server Components by default, browser-specific behavior lives in narrow Client Component islands, and content remains local JSON/MDX for v1. New server mutation work should enter through App Router route handlers. Terminal and Packet Runner should be global progressive-enhancement overlays mounted from `app/MainContent.tsx`, not new mandatory route flows.

**Major components:**
1. Root document and global chrome: `app/layout.tsx` plus `app/MainContent.tsx` own metadata, fonts, boot reveal, global overlays, and route-aware chrome.
2. Home route and sections: `app/page.tsx` composes hero and section stack; section components import `content/data/*.json`.
3. 3D hero island: `components/3d/*` and `components/fallbacks/StarFallback.tsx` own WebGL rendering, capability gates, context-loss behavior, and fallback visuals.
4. Content domain: `content/data/*.json`, future `content/blog/*.mdx`, and typed helpers keep launch content reviewable in git.
5. Contact server domain: `app/api/contact/route.ts` plus `lib/contact/*` should validate, rate-limit, send email, and return sanitized responses.
6. Terminal domain: `components/terminal/*`, `hooks/useTerminalHotkeys.ts`, and `lib/terminal-commands.ts` should keep command parsing pure and UI/focus behavior accessible.
7. Packet Runner domain: `components/game/*` should be client-only, lazy-loaded, optional, and localStorage-only for v1.

**Key architectural recommendations:**
- Keep `app/page.tsx`, `/resume`, and future blog routes server-rendered unless a small child needs client state.
- Split contact into a server-rendered section shell and a `ContactForm.tsx` client island.
- Fix route-aware chrome before adding non-home pages: `FloatingNav` should not show home section IDs on `/resume` or future `/blog` pages.
- Add `CertificationsSection` as a server component unless it needs filters or counters.
- Keep terminal commands and game logic separate from Zustand so they can be tested.
- Add blog after real content exists; use local MDX and validated metadata, not remote MDX or CMS scope.

### Critical Pitfalls

1. **Planning from stale docs** - use `.planning/*` and `.planning/codebase/*` as source of truth; treat older docs as historical unless a phase explicitly reconciles them.
2. **Next 16 assumptions from memory** - read local docs before route, middleware/proxy, metadata, MDX, Turbopack, or config changes.
3. **WebGL as a hard dependency** - add pre-canvas capability gates, deterministic fallback, reduced-motion handling, hidden-tab pause, and context-loss handling.
4. **Contact API abuse or secret leakage** - keep Resend keys server-only, validate with Zod on the server, rate-limit, cap lengths, add honeypot/friction, and return narrow errors.
5. **Accessibility buried under visuals** - DOM navigation, visible triggers, keyboard paths, focus management, reduced motion, and screen-reader behavior must remain canonical.
6. **Testing remains ad hoc** - move toward Playwright production smoke and targeted unit/API tests; lint/typecheck/build alone will not catch canvas, contact, or accessibility regressions.
7. **Proof remains too thin** - the site can look finished while certifications are hidden and project evidence is generic; Phase 1 must close that credibility gap.

## Implications for Roadmap

The existing roadmap is correctly ordered. Research supports keeping Phase 1 focused and narrow, then securing contact, hardening WebGL, and only then adding richer differentiators.

### Phase 1: Finish Content Shell

**Rationale:** This comes first because the product already looks impressive, but MVP credibility still depends on visible certifications and stronger flagship project proof.

**Delivers:** A polished certifications/education section, sharper project descriptions, credible project links or status/context, and responsive desktop/mobile visual validation.

**Addresses:** `CONT-07`, `CONT-09`; table stakes for certifications, education badges, project proof, and recruiter evaluation.

**Avoids:** Shallow proof, docs drift, layout regressions, and navigation drift.

**Immediate planning implications for Phase 1:**
- Do not rebuild existing home sections. Treat current hero, About, Projects, Skills, Experience, CTF, Contact, and `/resume` as baseline.
- Add `CertificationsSection` using `content/data/certifications.json`, with honest in-progress labeling for PJPT and B.Tech CSE Cybersecurity.
- Decide whether certifications is a first-class nav item. If yes, give it a stable `id="certifications"` and update FloatingNav deliberately.
- Improve flagship project evidence before adding new feature surfaces. Prefer specific repo/demo/writeup links, status labels, screenshots, constraints, and case-study hints over more cards.
- Include a responsive visual pass for long real content strings. Check desktop and mobile for overlap, clipped labels, broken card heights, and nav anchor behavior.
- Keep package, framework, and architecture churn out of Phase 1 unless required to finish content.

### Phase 2: Contact API

**Rationale:** A portfolio needs reliable contact, but this is the first public server mutation path and must be secured as a unit.

**Delivers:** `app/api/contact/route.ts`, server Zod validation, Resend email sending, abuse controls, clear client success/error states, and mailto fallback.

**Uses:** App Router route handlers, Zod, React Hook Form, Resend, server-only env variables.

**Avoids:** Client-side secrets, spam infrastructure, arbitrary recipients, oversized submissions, and raw provider error leaks.

### Phase 3: 3D Fallbacks and Validation

**Rationale:** The WebGL hero is the brand centerpiece, but it must fail gracefully before more animation, terminal, or game load is added.

**Delivers:** Pre-canvas capability policy, reduced-motion/no-WebGL/low-tier/mobile fallback behavior, context-loss handling, deterministic fallback, and browser screenshot smoke.

**Uses:** R3F/Three/detect-gpu with a shared motion and capability policy.

**Avoids:** Blank canvas, overheated mobile devices, reduced-motion violations, flaky screenshots, and false product failures from dev-server noise.

### Phase 4: Motion and Terminal

**Rationale:** Motion and terminal are differentiators that depend on stable DOM sections, content IDs, and accessibility policy.

**Delivers:** Entrance/scroll/hover/text animations, reduced-motion equivalents, visible terminal trigger, keyboard shortcut, focus trap, command history, portfolio commands, and fake-only challenge output.

**Uses:** CSS/Motion first; GSAP only if timeline orchestration truly justifies it. xterm only if terminal fidelity needs it.

**Avoids:** Hidden-only interactions, noisy recruiter path, focus traps, real-looking secrets, and terminal scope creep.

### Phase 5: Packet Runner

**Rationale:** The game should extend the terminal/cyber theme after the primary proof path is solid.

**Delivers:** Lazy-loaded optional canvas game with movement, enemies, collision, scoring, pause/resume, power-ups, localStorage high score, mobile controls, and terminal/UI/Konami launch.

**Uses:** Pure Canvas and localStorage for v1.

**Avoids:** Backend leaderboard, auth, moderation, database security scope, and first-paint performance cost.

### Phase 6: Blog Engine

**Rationale:** Blog and CTF writeups add long-term proof only if real content exists.

**Delivers:** Local MDX blog index and post routes, metadata, tags, Shiki code highlighting, RSS, at least two credible posts, and per-post SEO.

**Uses:** `@next/mdx`, Shiki, validated metadata, App Router static params, and route handlers for RSS.

**Avoids:** Placeholder content, remote MDX, CMS sprawl, unvalidated frontmatter, and blog pages that cannot be included in sitemap/metadata.

### Phase 7: Launch Polish

**Rationale:** SEO, analytics, accessibility, deployed smoke, and docs reconciliation depend on the final route and feature surface.

**Delivers:** sitemap, robots, JSON-LD, OG/Twitter assets, Vercel Analytics, Lighthouse/accessibility/mobile/cross-browser checks, Vercel env/domain checklist, deployed preview smoke, and updated launch docs.

**Uses:** Next metadata/file conventions first, Vercel defaults unless a concrete need appears.

**Avoids:** stale README/docs, missing env vars, broken social previews, unvalidated deployed behavior, and launch claims unsupported by checks.

### Phase Ordering Rationale

- Proof precedes polish: certifications and project evidence must be visible before terminal, game, or blog expansion.
- Security precedes public endpoint launch: contact must ship with validation, rate limiting, and safe env handling.
- Resilience precedes spectacle: WebGL fallback and reduced-motion policy should land before additional animation loops.
- Stable content precedes terminal commands and blog metadata: commands and posts should reference finalized section IDs and content models.
- Launch polish comes last so sitemap, analytics events, docs, and deployment checks reflect the real final surface.

### Research Flags

Phases likely needing deeper research during planning:
- **Phase 2:** Rate-limit strategy depends on deployment/runtime constraints and whether durable storage is allowed.
- **Phase 3:** Needs browser-level validation for no-WebGL, forced context loss, GPU tiers, mobile, hidden-tab, and reduced-motion behavior in the actual R3F stack.
- **Phase 4:** Terminal accessibility and focus-management design should be specified before implementation.
- **Phase 5:** Game-loop architecture, mobile controls, pause/exit behavior, and performance budget need a scoped plan.
- **Phase 6:** Final MDX stack decision needs local Next 16 docs review and content validation design.
- **Phase 7:** Deployment verification depends on the actual Vercel project, domain, env vars, and preview URL.

Phases with standard patterns or enough current context:
- **Phase 1:** Standard content/rendering work in the existing section system; skip deeper research unless project evidence is missing.
- **Phase 7 SEO basics:** Standard Next metadata/file conventions, but still verify against local docs.

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | Verified against package/config files, codebase maps, and installed Next 16 docs. Planned additions are medium confidence until their phases start. |
| Features | HIGH | Requirements, roadmap, current implementation, and content files align. Market expectations are medium confidence but do not change MVP direction. |
| Architecture | HIGH | Current code already matches Server Component plus client island pattern; route and component boundaries are well documented. |
| Pitfalls | HIGH | Risks are strongly supported by repo concerns, current implementation shape, local Next docs, and security/accessibility guidance. |

**Overall confidence:** HIGH

### Gaps to Address

- Resend/rate-limit implementation details: resolve during Phase 2 based on Vercel runtime and acceptable storage.
- Dev-server reliability: isolate or document in Phase 3; keep production build/start smoke as the release signal until then.
- WebGL fallback validation: implement browser screenshot and pixel checks rather than relying on code review.
- Project proof assets: Phase 1 may need owner input for exact repo URLs, demos, screenshots, or case-study details.
- Blog content quality: do not implement placeholder posts; require at least one CTF/writeup style and one build/research style post before blog launch.
- Deployment assumptions: validate Node/npm versions, env vars, domain, analytics, and preview smoke when Vercel is configured.

## Sources

### Primary (HIGH confidence)
- `.planning/research/STACK.md` - implemented stack, planned additions, Next 16 constraints, tooling risks.
- `.planning/research/FEATURES.md` - table stakes, differentiators, anti-features, feature dependencies.
- `.planning/research/ARCHITECTURE.md` - route boundaries, component boundaries, data flow, verification flow.
- `.planning/research/PITFALLS.md` - critical/moderate pitfalls, phase-specific warnings, launch gate.
- `.planning/PROJECT.md` - product identity, current brownfield context, constraints, decisions.
- `.planning/REQUIREMENTS.md` - v1/v2 requirements and phase traceability.
- `.planning/ROADMAP.md` - active Phase 0-7 roadmap and Phase 1 target.
- Local Next.js 16 docs in `node_modules/next/dist/docs/` - route handlers, MDX, metadata, Turbopack, proxy, testing, and upgrade behavior.

### Secondary (MEDIUM confidence)
- Historical docs under `docs/` - useful for original vision and drift detection, but not current source of truth.
- External accessibility, WebGL, OWASP, and search guidance cited in the research files - useful constraints for implementation and verification.

---
*Research completed: 2026-04-28*
*Ready for roadmap: yes*
