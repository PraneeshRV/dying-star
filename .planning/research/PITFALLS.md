# Domain Pitfalls

**Domain:** Cybersecurity portfolio with immersive WebGL, terminal/game interactions, MDX writing, contact API, and public launch
**Project:** Dying Star Portfolio
**Researched:** 2026-04-28
**Overall confidence:** HIGH for repo-specific risks, MEDIUM for external service/deploy risks until Vercel/Resend choices are finalized

## Executive Risk Posture

This project is already past the blank-slate risk stage. The main danger is not "can it be built"; the danger is finishing it in a way that looks visually complete while the launch path remains fragile. The riskiest areas are progressive enhancement for the 3D scene, public contact API abuse controls, accessible interaction paths outside the canvas, and keeping planning/docs in sync while multiple agents or external generators contribute code.

The strongest roadmap ordering is still: finish content proof, secure the contact endpoint, harden WebGL fallbacks, then add motion/terminal/game/blog, and only then launch polish. Reordering terminal/game before contact or WebGL hardening will increase scope and regressions without improving recruiter trust.

## Critical Pitfalls

### Pitfall 1: Documentation Drift Becomes the Source of Bad Phase Work

**What goes wrong:** README and legacy docs describe old M0-M8 status while `.planning/PROJECT.md`, `.planning/REQUIREMENTS.md`, `.planning/ROADMAP.md`, and the codebase maps describe the current brownfield state. Future phases can duplicate implemented sections, delete working code, or plan from stale percentages.

**Why it happens:** The repo has both original planning docs and active GSD planning docs. `docs/task_plan.md` still says "Phase 5 - Sections (M3)" while `.planning/ROADMAP.md` uses Phase 0-7 launch phases.

**Warning signs:**
- A plan says About, Projects, Skills, Experience, CTF, or `/resume` are unimplemented.
- A phase references M numbers without mapping them to `.planning/ROADMAP.md`.
- README/progress docs disagree with `.planning/REQUIREMENTS.md` traceability.
- Agents edit `app/page.tsx` or `components/sections/*` as if current sections are throwaway scaffolding.

**Consequences:** Duplicate sections, broken navigation ids, accidental replacement of polished first-pass UI, wasted planning cycles, and launch docs that mislead future maintainers.

**Prevention:**
- Treat `.planning/PROJECT.md`, `.planning/REQUIREMENTS.md`, `.planning/ROADMAP.md`, and `.planning/codebase/*.md` as the current source of truth.
- During phase closeout, update legacy public docs in one explicit docs task, not opportunistically during feature work.
- Add a docs drift check to Phase 7: search for old statuses, old M labels, and claims that completed requirements are pending.
- Keep `docs/task_plan.md` as historical context unless a phase explicitly owns reconciling legacy docs.

**Detection:**
- Run `rg "M[0-9]|Phase [0-9]|0%|10%|in_progress|TODO|pending" README.md docs .planning` during planning and release review.
- Compare every phase plan against `.planning/REQUIREMENTS.md` traceability before implementation.

**Phase mapping:** All phases; especially Phase 1 content, Phase 7 `DEPLOY-02`.

**Confidence:** HIGH. Verified in project docs and codebase concerns.

### Pitfall 2: Next 16/Turbopack Dev Noise Gets Mistaken for Product Failure

**What goes wrong:** `npm run dev` with default Turbopack has documented smoke instability, while `npm run build` and `npm run start` pass. Contributors may spend hours rewriting healthy app code or weakening config because the dev server does not reach hydrated state within the current smoke timeout.

**Why it happens:** Next.js 16 uses Turbopack by default for both `next dev` and `next build`. This repo also sets `turbopack.root`, enables experimental view transitions, and uses a heavy client WebGL boot path.

**Warning signs:**
- `npm run build` and production smoke pass, but dev smoke times out before DOMContentLoaded or hydration.
- Edits target `next.config.ts`, `app/layout.tsx`, or `app/MainContent.tsx` without a small reproduction.
- Someone adds `pages/api`, `middleware.ts`, `experimental.turbo`, or `next lint` based on older Next assumptions.
- `--webpack` is treated as proof that production Turbopack behavior is broken.

**Consequences:** Regressions in a production-healthy app, loss of the pinned Next 16 configuration, and false negatives in local QA.

**Prevention:**
- Keep production build plus production start smoke as the release gate until the dev issue has a small reproduction.
- For Next-specific work, read installed docs under `node_modules/next/dist/docs/` before editing framework behavior.
- Preserve `turbopack.root` unless a root-resolution issue is proven.
- Document exact reproduction details: Node version, command, port, browser, timeout, console output, and whether reduced motion is enabled.
- If a fallback is needed, use `npm run dev -- --webpack` only as a diagnostic path, not as the default release signal.

**Detection:**
- Maintain a focused dev smoke issue separate from feature phases.
- Compare `npm run dev`, `npm run dev -- --webpack`, `npm run build`, and `npm run start` outcomes before changing app code.

**Phase mapping:** Phase 3 owns fix or documentation; all phases touching Next config, routes, metadata, MDX, or API routes.

**Confidence:** HIGH. Verified in `.planning/codebase/CONCERNS.md`, `.planning/codebase/STACK.md`, local Next 16 upgrade docs, and local Turbopack config docs.

### Pitfall 3: WebGL Is Treated as Required Instead of Progressive Enhancement

**What goes wrong:** The hero can become blank, slow, battery-heavy, or motion-hostile on weak GPUs, mobile browsers, no-WebGL devices, hidden tabs, and reduced-motion contexts. The current error boundary catches React render errors, but it does not prevent expensive `<Canvas>` mount or handle WebGL context loss proactively.

**Why it happens:** `SpaceCanvas` renders `<Canvas>` before capability decisions are complete. GPU tier detection is local state inside the canvas component, `stores/globalStore.ts` uses an inverted tier comment, and `StarFallback` uses random positions on remount.

**Warning signs:**
- Canvas exists but pixels are blank or nearly black in screenshots.
- Mobile devices heat up, scroll janks, or the first viewport misses hero copy.
- `webglcontextlost`, shader, or GPU warnings appear in console.
- Reduced-motion users still get auto-rotation, particle motion, count-up effects, or boot motion.
- Screenshot tests are flaky because fallback stars change on every remount.

**Consequences:** The visual centerpiece becomes the main reason the portfolio feels broken. Recruiters on mobile or locked-down browsers may never reach the content.

**Prevention:**
- Add a pre-canvas capability gate that checks WebGL availability, reduced motion, mobile constraints, hidden-tab state, and GPU tier before mounting React Three Fiber.
- Normalize GPU capability into explicit states such as `none`, `low`, `medium`, and `high`; avoid raw numeric tier checks spread across store and scene.
- Listen for `webglcontextlost` and `webglcontextrestored`; render a deterministic fallback on loss.
- Use a seeded or static fallback starfield so screenshots and smoke tests are stable.
- Keep semantic hero copy and CTAs in DOM outside the canvas.
- Centralize animation policy so Three.js frames, CSS animations, custom cursor, counters, terminal effects, and game loops all obey reduced motion and hidden-tab pauses.

**Detection:**
- Playwright screenshots for desktop, mobile, reduced-motion, no-WebGL/fallback, and normal-motion passes.
- Canvas pixel checks that fail if the canvas is present but blank.
- A forced context-loss test using `WEBGL_lose_context` where supported.

**Phase mapping:** Phase 3 primary; Phase 4 motion and Phase 5 game must consume the same motion/performance policy.

**Confidence:** HIGH. Verified in source, codebase concerns, MDN WebGL context-loss docs, and MDN reduced-motion docs.

### Pitfall 4: The Contact API Becomes Public Spam Infrastructure

**What goes wrong:** A Resend-backed `POST` endpoint can be abused to send spam, exhaust provider quotas, leak contact details, or expose secrets if it ships with only client validation.

**Why it happens:** The current contact UI is a safe `mailto:` shell. Phase 2 will turn it into the first internet-facing server endpoint in a repo that currently has no `app/api/**/route.ts`, no rate limiting, no env usage, and no API tests.

**Warning signs:**
- Resend or API keys are imported into client components or appear in `NEXT_PUBLIC_*`.
- The endpoint accepts arbitrary recipients, subject lines, HTML, or long message bodies.
- Validation exists only in `ContactSection.tsx`.
- No IP/user-agent/origin rate strategy exists.
- CORS is permissive without a reason.
- Errors echo raw provider responses or stack traces.

**Consequences:** Email abuse, billing/provider throttling, privacy leakage, launch rollback, and a high-value target for bots.

**Prevention:**
- Implement only `app/api/contact/route.ts` in the App Router; do not add Pages Router API routes.
- Accept only `POST`; return `405` or rely on Route Handler method behavior for unsupported methods.
- Validate on the server with Zod: required name/email/message, strict length caps, normalized email, no arbitrary recipient, and safe text-only email content.
- Keep client validation with `react-hook-form` for UX, but never rely on it for security.
- Add rate limiting suitable for a public portfolio: per IP/fingerprint window, honeypot field, optional Turnstile-style challenge only if abuse appears, and provider spending alerts.
- Store `RESEND_API_KEY` and recipient config only in server environment variables managed by the host.
- Keep `mailto:` and social links as fallback paths.

**Detection:**
- Tests for empty, malformed, oversized, duplicate, and rapid submissions.
- Tests or manual checks proving secrets are absent from client bundles and public files.
- Production logs/analytics for `429`, provider failures, and unusual POST volume.

**Phase mapping:** Phase 2 `FORM-02`, `FORM-03`; Phase 7 deploy env verification.

**Confidence:** HIGH for endpoint design risks, MEDIUM for final rate-limit implementation until host/runtime is chosen. Verified with local Next route-handler docs and OWASP validation/resource-limit guidance.

### Pitfall 5: Accessibility Is Lost Behind Canvas, Motion, Terminal, and Game Interactions

**What goes wrong:** The site can look complete while keyboard users, screen-reader users, mobile users, and motion-sensitive users cannot navigate or understand key interactions.

**Why it happens:** The app intentionally leans into visual effects: canvas planets, hover labels, floating nav animation, boot loader, custom cursor, glitch/typewriter text, terminal overlay, and a future canvas game. Biome currently disables `a11y.noStaticElementInteractions`, so automated lint will not catch all interaction mistakes.

**Warning signs:**
- Planet clicks or hover labels are the only way to discover navigation.
- Floating nav hides while focused controls are active.
- Focus indicators are missing, obscured, or too subtle against glow effects.
- Terminal opens with a shortcut but has no visible trigger, no focus trap, or no focus restoration.
- Game controls require keyboard precision or pointer-only movement with no pause/exit path.
- Reduced-motion still shows auto-rotate, parallax, count-up, glitch, boot, or canvas effects.

**Consequences:** The portfolio fails launch accessibility checks and excludes visitors who may be evaluating professionalism as much as visuals.

**Prevention:**
- Treat DOM links, buttons, headings, and section ids as the canonical navigation; canvas interactions are decorative enhancements.
- Every terminal/game trigger needs a visible UI trigger and keyboard path.
- Terminal overlay must trap focus, restore focus on close, support Escape, expose useful output semantics, and not hide page content from assistive tech incorrectly.
- Game must be optional, pausable, dismissible, local-only, and not required to access portfolio content.
- Add reduced-motion equivalents for all major effects, not just CSS animations.
- Audit focus visibility and focus not obscured after sticky/floating UI appears.

**Detection:**
- Keyboard-only smoke for home, section nav, project filters, CTF interaction, contact, resume, terminal, and game launch/exit.
- Axe/Lighthouse accessibility checks plus manual screen-reader pass for terminal output and form errors.
- Reduced-motion browser test that verifies animations are removed, reduced, or replaced.

**Phase mapping:** Phase 1 content, Phase 3 fallback, Phase 4 motion/terminal, Phase 5 game, Phase 7 launch QA.

**Confidence:** HIGH. Verified in codebase concerns/testing map, W3C focus guidance, and MDN reduced-motion docs.

### Pitfall 6: Testing Remains a Temporary Smoke Script Instead of a Maintained Safety Net

**What goes wrong:** `npm run lint`, typecheck, and build stay green while browser behavior, accessibility, content schema, WebGL rendering, contact API abuse controls, and deploy behavior regress.

**Why it happens:** The repository has no in-repo test runner, no Playwright config, no Vitest/Jest setup, no content validation script, and the current production smoke harness lives in `/tmp`.

**Warning signs:**
- Phase summaries say "visually checked" without screenshots, console logs, or reproducible commands.
- New route/API/blog/game features land with no `tests/**/*.spec.ts` or unit coverage.
- Content JSON is edited without schema validation.
- WebGL tests only assert that a `<canvas>` element exists.
- Contact API ships without negative tests.

**Consequences:** Late launch regressions are expensive because the product depends on browser-only behavior, animation, WebGL, and public endpoint handling.

**Prevention:**
- Add Playwright before or during Phase 3, not at the very end. Use it for production smoke, mobile, reduced motion, route checks, console errors, canvas/fallback, keyboard navigation, `/resume`, and `/not-found`.
- Add Vitest for pure utilities, Zustand store, media hooks, Typewriter/animation timing, GPU tier mapping, and content schema validation.
- Promote the `/tmp` smoke into `tests/home-smoke.spec.ts` and run it against `npm run build` plus `npm run start`.
- Add API tests for Phase 2 validation, method handling, rate limits, and secret safety.

**Detection:**
- CI or local release checklist requires `npm run lint`, `npx tsc --noEmit`, `npm run build`, Playwright production smoke, and targeted unit/API tests for touched areas.

**Phase mapping:** Phase 3 should introduce browser smoke; Phase 2 needs API tests; Phase 7 completes Lighthouse/a11y/mobile/cross-browser QA.

**Confidence:** HIGH. Verified in `.planning/codebase/TESTING.md` and local Next testing docs.

## Moderate Pitfalls

### Pitfall 7: SEO and Social Sharing Are Treated as Metadata Text Only

**What goes wrong:** The site has a good `metadata` object but lacks launch assets: sitemap, robots, JSON-LD, custom OG/Twitter images, analytics, and per-post metadata once the blog exists.

**Warning signs:**
- `/sitemap.xml` or `/robots.txt` 404s.
- Social preview uses a generic/no image despite `summary_large_image`.
- Blog posts inherit only site-level title/description.
- Canonical URLs drift from `https://praneeshrv.me`.
- Search Console or social preview validators are not part of launch QA.

**Prevention:**
- Use App Router metadata file conventions: `app/sitemap.ts`, `app/robots.ts`, static or generated `opengraph-image`, and `twitter-image`.
- Add JSON-LD for `Person`, `WebSite`, and selected `CreativeWork`/`BlogPosting` content.
- Generate blog metadata from typed frontmatter and fail build on missing title, date, description, tags, or canonical slug.
- Keep analytics minimal; Vercel Analytics is enough for v1 unless a stronger product question appears.

**Phase mapping:** Phase 6 blog metadata; Phase 7 `SEO-01`, `SEO-02`.

**Confidence:** HIGH for missing assets, MEDIUM for final analytics implementation. Verified in app metadata source, integration map, and Next metadata docs.

### Pitfall 8: MDX Blog Scope Becomes a Content Platform Instead of a Local Proof Surface

**What goes wrong:** Blog work expands into remote MDX, CMS concerns, arbitrary JSX execution, complex plugin chains, or large syntax-highlighting overhead before there are strong posts.

**Warning signs:**
- Remote MDX or user-supplied markdown enters v1.
- `mdx-components.tsx` is missing while using `@next/mdx` with App Router.
- Frontmatter is parsed ad hoc and not validated.
- Blog routes compile but RSS, metadata, tags, and code blocks are inconsistent.
- Sample posts are placeholders instead of credible CTF/build writeups.

**Prevention:**
- Keep v1 local MDX only under `content/blog`.
- Use typed frontmatter/schema validation for title, description, date, tags, slug, canonical, and draft state.
- Add `mdx-components.tsx`, explicit MDX components, and code block handling.
- Use Shiki deliberately for code quality, but measure build cost and keep themes limited.
- Add RSS validation and route smoke for blog index and at least two posts.

**Phase mapping:** Phase 6 `BLOG-01`, `BLOG-02`, `BLOG-03`; Phase 7 SEO validation.

**Confidence:** HIGH for setup pitfalls from local/official docs; MEDIUM for final library choice until Velite vs `@next/mdx` is decided.

### Pitfall 9: Terminal and Packet Runner Steal Attention From Portfolio Proof

**What goes wrong:** Terminal and game features become the main project instead of an optional layer that supports cybersecurity credibility.

**Warning signs:**
- Terminal requires xterm-level fidelity before commands return portfolio content.
- Game blocks scroll, loads on first paint, or requires a backend leaderboard.
- Easter eggs use realistic secret names or real-looking tokens without documentation.
- Terminal/game triggers are hidden-only or keyboard-only.
- Scope includes auth, global scores, Supabase, or moderation in v1.

**Prevention:**
- Build a small command interpreter first: `help`, `whoami`, `projects`, `skills`, `ctf`, `resume`, `contact`, `blog`, `theme`, `clear`, `exit`.
- Keep all flags/tokens fake and documented as client-visible.
- Keep Packet Runner localStorage-only for v1; no Supabase until analytics or usage proves value.
- Lazy-load terminal and game code; do not add them to the initial hero cost.
- Provide visible triggers, mobile controls, pause/resume, and a clean exit path.

**Phase mapping:** Phase 4 terminal, Phase 5 game.

**Confidence:** HIGH. Verified in requirements, roadmap, integration map, and security concerns.

### Pitfall 10: Content Proof Remains Too Thin for Recruiter Evaluation

**What goes wrong:** The site feels impressive but does not prove enough. Certifications data remains hidden, project cards link to generic profiles, and flagship work lacks case-study depth.

**Warning signs:**
- `content/data/certifications.json` is still not rendered.
- Project URLs point only to a GitHub profile or generic link.
- Claims such as rankings, tools, and project status have no context.
- Visual sections outrun the actual evidence a recruiter can inspect in 30 seconds.

**Prevention:**
- Phase 1 should render certifications/education and improve flagship project descriptions before adding more spectacle.
- Add schema validation and freshness fields for content that can stale.
- Prefer specific repo/demo/writeup links over broad profile links.
- Add at least one flagship case-study path before expanding decorative integrations.

**Phase mapping:** Phase 1 `CONT-07`, `CONT-09`; Phase 6 blog for proof depth.

**Confidence:** HIGH. Verified in requirements, codebase concerns, and integration map.

### Pitfall 11: Deployment Readiness Is Assumed Because `next start` Works Locally

**What goes wrong:** Vercel/domain launch fails or ships incomplete due to missing environment variables, no CI, Node/version mismatch, missing SEO files, unchecked `/resume.pdf`, Google font/build assumptions, or no production smoke after deploy.

**Warning signs:**
- No Vercel project/domain checklist exists.
- `RESEND_API_KEY` is set locally but not in hosting env, or vice versa.
- No `.github/workflows/*` or equivalent deploy gate exists.
- `docs/Praneesh_R_V_Resume.pdf` and `public/resume.pdf` differ unintentionally.
- Remote image wildcard remains while real external images are introduced.
- Package metadata drift continues (`package.json` and lockfile root names differ).

**Prevention:**
- Phase 7 should create an explicit deployment checklist: Node >=20.9, npm lockfile, env vars, domain, analytics, contact route, SEO routes, resume asset, production smoke URL.
- Run smoke against the deployed preview URL, not only local `next start`.
- Restrict `images.remotePatterns` to known hosts before using `next/image` with remote content.
- Add a resume checksum/update note so the source and public PDF cannot drift silently.
- Keep Google fonts unless deployment proves brittle; switch to `next/font/local` only if reproducibility requires it.

**Phase mapping:** Phase 7 `DEPLOY-01`, `DEPLOY-02`; Phase 2 env; Phase 6/7 SEO.

**Confidence:** MEDIUM. Repo gaps are verified; final deployment platform behavior depends on Vercel setup.

### Pitfall 12: Dependency and Config Sprawl Adds Risk Before Features Need It

**What goes wrong:** Unused packages and experimental flags increase audit burden and confuse future contributors.

**Warning signs:**
- `gsap`, `@gsap/react`, `splitting`, `date-fns`, `react-hook-form`, `zod`, or `react-hot-toast` remain unused after related phases.
- Experimental `viewTransition` causes route or hydration issues without visible value.
- `images.remotePatterns` allows all HTTPS hosts while remote images are unused.

**Prevention:**
- Keep planned packages only if their phase is near-term; otherwise remove and re-add when needed.
- Every dependency should have an owner phase and a first import.
- Keep experimental framework flags only when a user-visible feature depends on them and tests cover them.
- Tighten image remote patterns before adding external media.

**Phase mapping:** Phase 2 contact dependencies; Phase 4 motion dependencies; Phase 6 blog dependencies; Phase 7 audit.

**Confidence:** HIGH. Verified in `package.json`, `next.config.ts`, and codebase integration map.

## Minor Pitfalls

### Pitfall 13: Visual Polish Creates Layout or Readability Regressions

**What goes wrong:** Glow, glass, terminal labels, long project names, and responsive grids can overlap or become hard to scan on mobile.

**Prevention:** Add mobile screenshots for every section, keep stable card dimensions, avoid hover-only content, and test the longest real content strings from JSON.

**Phase mapping:** Phase 1, Phase 4, Phase 7.

**Confidence:** HIGH.

### Pitfall 14: Boot Loader and Global Client Gate Hide Useful SSR Output

**What goes wrong:** `MainContent` hides all routes until mount and boot completion. This can delay `/resume`, reduce perceived performance, and make smoke/accessibility checks noisy.

**Prevention:** Keep boot decorative and skippable, avoid gating non-home routes, and ensure essential content remains available to SSR and assistive technologies.

**Phase mapping:** Phase 3 performance/fallback, Phase 7 launch QA.

**Confidence:** HIGH. Verified in `app/MainContent.tsx`.

### Pitfall 15: CTF/Easter Egg Language Looks Like Real Secret Exposure

**What goes wrong:** Fake tokens can look like accidental real secrets to scanners, reviewers, or recruiters if undocumented.

**Prevention:** Namespace challenge strings as fake/demo content, document all client-visible flags, and never put API keys, deploy secrets, private writeups, or real challenge material in `app/`, `components/`, `content/`, or `public/`.

**Phase mapping:** Phase 4 terminal, Phase 5 game, Phase 7 security review.

**Confidence:** HIGH.

## Phase-Specific Warnings

| Phase | Main Pitfalls | Warning Signs | Required Mitigation |
|-------|---------------|---------------|---------------------|
| Phase 1: Finish Content Shell | Docs drift, shallow proof, visual layout regressions | Certifications still hidden; project links generic; old docs drive tasks | Render certifications, improve flagship projects, validate responsive layout, reconcile phase labels before planning |
| Phase 2: Contact API | Spam endpoint, secret leakage, missing API tests | Client-only validation; no rate limit; secrets in client/public files | App Router `app/api/contact/route.ts`, server Zod validation, rate limit, honeypot, safe env, negative tests |
| Phase 3: 3D Fallbacks and Validation | Canvas mounts too early, no context-loss path, dev smoke confusion | Blank canvas, hot mobile, reduced-motion still animates, dev-only timeouts | Pre-canvas capability gate, deterministic fallback, context-loss handling, Playwright screenshots, documented dev repro |
| Phase 4: Motion and Terminal | Accessibility regressions, overbuilt terminal, fake secrets confusion | Hidden-only triggers; focus trap missing; animation ignores reduced motion | Central motion policy, visible terminal trigger, focus restore, semantic command output, fake-token documentation |
| Phase 5: Packet Runner | Game scope creep, performance cost, inaccessible controls | Game loads on first paint; backend leaderboard proposed; no mobile controls | Lazy-load, optional launch, localStorage-only v1, pause/exit, mobile and keyboard controls, no auth/database |
| Phase 6: Blog Engine | MDX platform sprawl, unsafe/unvalidated content, weak SEO | Remote MDX; missing `mdx-components.tsx`; untyped frontmatter | Local MDX, typed frontmatter, Shiki measured, RSS validation, per-post metadata, two credible sample posts |
| Phase 7: Launch Polish | SEO gaps, deploy surprises, test gaps, stale docs | `/sitemap.xml` 404; no OG image; no deploy smoke; README stale | Sitemap, robots, JSON-LD, OG/Twitter assets, Vercel env/domain checklist, deployed smoke, docs drift pass |

## Minimum Launch Gate

Before public launch, require:

1. `npm run lint`
2. `npx tsc --noEmit`
3. `npm run build`
4. Production Playwright smoke against `npm run start`
5. Mobile and desktop screenshots for home, fallback, `/resume`, `/not-found`, and blog if present
6. Reduced-motion smoke
7. Keyboard-only navigation pass
8. Contact API negative tests if Phase 2 has shipped
9. Sitemap/robots/OG/social preview validation
10. Deployed preview smoke on the actual hosting URL

## Research Flags for Deeper Phase Work

- Phase 2 needs a concrete rate-limit decision based on Vercel runtime constraints and whether a serverless KV/upstash-like store is allowed.
- Phase 3 needs browser-level exploration for no-WebGL and forced context loss in the actual R3F stack.
- Phase 4 needs terminal accessibility design before implementation, especially focus management and screen-reader output.
- Phase 5 needs a scoped game-loop architecture decision before code starts; avoid adding a general engine unless a specific need appears.
- Phase 6 needs a final MDX stack choice: `@next/mdx` is straightforward, while Velite may be better if typed content indexing becomes the priority.
- Phase 7 needs deployment-platform verification after the Vercel project/domain actually exist.

## Sources

**Local project sources:**
- `.planning/codebase/CONCERNS.md` - HIGH confidence risk map for docs drift, dev smoke, WebGL fallback, contact security, accessibility, performance, and testing gaps.
- `.planning/codebase/TESTING.md` - HIGH confidence test coverage map and recommended Playwright/Vitest targets.
- `.planning/codebase/INTEGRATIONS.md` - HIGH confidence current/planned integration map.
- `.planning/codebase/STACK.md` - HIGH confidence stack, Next 16 local-doc requirement, dependencies, and config details.
- `.planning/PROJECT.md` - HIGH confidence product constraints and active requirements.
- `.planning/REQUIREMENTS.md` - HIGH confidence requirement to phase traceability.
- `.planning/ROADMAP.md` - HIGH confidence phase ownership.
- `docs/task_plan.md` - MEDIUM confidence historical plan; useful for drift detection, not current source of truth.
- `package.json`, `next.config.ts`, `app/layout.tsx`, `app/MainContent.tsx`, `components/3d/SpaceCanvas.tsx`, `components/3d/WebGLErrorBoundary.tsx`, `components/fallbacks/StarFallback.tsx`, `components/sections/ContactSection.tsx`, `components/sections/CTFSection.tsx`, `stores/globalStore.ts`, `biome.json` - HIGH confidence implementation evidence.

**Installed Next.js 16 docs:**
- `node_modules/next/dist/docs/01-app/02-guides/upgrading/version-16.md` - Turbopack default, Node/runtime requirements, webpack opt-out, Next 16 migration notes.
- `node_modules/next/dist/docs/01-app/03-api-reference/05-config/01-next-config-js/turbopack.md` - Turbopack config/root behavior and loader limitations.
- `node_modules/next/dist/docs/01-app/01-getting-started/15-route-handlers.md` - App Router route handler placement and behavior.
- `node_modules/next/dist/docs/01-app/02-guides/testing/index.md` and `playwright.md` - Next testing guidance and production-code Playwright recommendation.
- `node_modules/next/dist/docs/01-app/02-guides/mdx.md` - App Router MDX setup and `mdx-components.tsx` requirement.
- `node_modules/next/dist/docs/01-app/01-getting-started/14-metadata-and-og-images.md`, `.../metadata/sitemap.md`, and `.../metadata/robots.md` - metadata, sitemap, robots, and OG conventions.
- `node_modules/next/dist/docs/01-app/01-getting-started/12-images.md` - remote image pattern safety guidance.
- `node_modules/next/dist/docs/01-app/03-api-reference/05-config/01-next-config-js/viewTransition.md` - experimental view transition flag behavior.

**External authoritative sources checked:**
- Next.js Route Handlers: https://nextjs.org/docs/app/api-reference/file-conventions/route
- Next.js MDX guide: https://nextjs.org/docs/app/guides/mdx
- Next.js metadata/OG guide: https://nextjs.org/docs/app/getting-started/metadata-and-og-images
- Next.js sitemap docs: https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap
- Next.js robots docs: https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots
- MDN `prefers-reduced-motion`: https://developer.mozilla.org/docs/Web/CSS/@media/prefers-reduced-motion
- MDN `webglcontextlost`: https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/webglcontextlost_event
- MDN `WEBGL_lose_context`: https://developer.mozilla.org/en-US/docs/Web/API/WEBGL_lose_context
- W3C WCAG focus visible understanding: https://www.w3.org/WAI/WCAG22/Understanding/focus-visible.html
- OWASP Input Validation Cheat Sheet: https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html
- OWASP API4:2023 Unrestricted Resource Consumption: https://owasp.org/API-Security/editions/2023/en/0xa4-unrestricted-resource-consumption/
