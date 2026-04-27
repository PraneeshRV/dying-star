# Technology Stack Research

**Project:** dying-star cybersecurity portfolio  
**Research date:** 2026-04-28  
**Scope:** Stack dimension only, for continuing the existing brownfield repo  
**Overall confidence:** HIGH for implemented stack, MEDIUM for planned additions

## Executive Recommendation

Keep the current stack. This repo is already shaped around Next.js 16.2.4, React 19.2.4, TypeScript, Tailwind CSS v4, App Router, R3F/Three, Biome, npm, and static JSON content. The right roadmap move is not a framework migration. It is to harden the stack around validation, fallback behavior, testing, and launch tooling.

Use Next.js App Router conventions exclusively. Future backend work should use `app/api/**/route.ts` route handlers, not `pages/api`. Future request interception should use root-level `proxy.ts` if it is truly needed, not `middleware.ts`, unless local Next 16 docs say otherwise for the specific case.

Treat WebGL as progressive enhancement. The 3D scene is the visual centerpiece, but the stack should assume no-WebGL, weak mobile GPU, reduced motion, hidden tab, and context-loss scenarios are normal. Add capability gates before mounting expensive R3F work, not after the Canvas is already live.

Use npm as the package manager. `package-lock.json` is present, package scripts are npm-oriented, and the active repo state is npm despite older planning docs showing `pnpm` examples. Do not switch package managers during feature work.

Before any Next.js framework change, read the relevant local docs under `node_modules/next/dist/docs/`. `AGENTS.md` explicitly warns that this Next version has breaking changes, and the installed docs are the source of truth for routing, config, build, linting, proxy, caching, and App Router behavior.

## Implemented Stack

### Core Runtime

| Technology | Version / Config | Status | Recommendation |
|------------|------------------|--------|----------------|
| Next.js | `16.2.4` | Implemented | Stay on App Router. Use local Next docs before changing routes, metadata, images, Turbopack, route handlers, or proxy behavior. |
| React | `19.2.4` / `react-dom@19.2.4` | Implemented | Keep. Be cautious with experimental React/Next features until verified against R3F and production build. |
| TypeScript | `^5`, strict mode | Implemented | Keep strict mode. Add validation around imported content instead of widening types. |
| Node.js | Next local docs require `>=20.9.0` | Implemented requirement | Add an explicit project Node policy in a future config phase. Prefer a stable supported LTS in CI/deploy rather than relying on the local Node 25.x environment. |
| npm | `package-lock.json` lockfile v3 | Implemented | Keep npm. Use `npm install` for dependency changes and `npm ci` in CI once CI exists. |

### Next.js App Router

| Area | Implemented Now | Recommendation |
|------|-----------------|----------------|
| Routes | `/`, `/resume`, `not-found` | Continue with `app/` routes only. |
| API routes | None | Add `app/api/contact/route.ts` when Resend contact work starts. |
| Metadata | `app/layout.tsx` uses Metadata API and `metadataBase` | Keep. Add JSON-LD, sitemap, robots, and OG images in launch phase. |
| Fonts | `next/font/google` | Keep for now. Switch to `next/font/local` only if CI/deploy needs offline reproducible font builds. |
| Request interception | None | Use `proxy.ts` only if request-time redirects/headers are needed. Prefer `next.config.ts` redirects for simple redirects. |

### Styling

| Technology | Status | Recommendation |
|------------|--------|----------------|
| Tailwind CSS v4 | Implemented through `@import "tailwindcss"` and `@theme` in `app/globals.css` | Keep CSS-first Tailwind v4. Do not introduce Tailwind v3-style config unless a documented v4 feature requires it. |
| CSS Modules | Implemented in reusable UI components | Keep for complex component styling, animations, and hover states. |
| Global CSS tokens | Implemented in `app/globals.css` | Keep tokens centralized. Avoid one-off color systems in section files. |
| PostCSS | `@tailwindcss/postcss` | Keep minimal. Do not add PostCSS plugins unless a real build need appears. |

### 3D and Animation

| Technology | Status | Recommendation |
|------------|--------|----------------|
| `three@^0.184.0` | Implemented | Keep as the core 3D engine. Do not add another 3D engine. |
| `@react-three/fiber@^9.6.0` | Implemented | Keep. Keep Canvas isolated to client components. |
| `@react-three/drei@^10.7.7` | Implemented | Keep for helpers already used, but avoid pulling in heavy abstractions casually. |
| `@react-three/postprocessing@^3.0.4` | Implemented | Keep Bloom only where GPU policy allows it. |
| `@pmndrs/detect-gpu@^6.0.1` | Implemented | Keep, but normalize tier handling behind a shared capability hook. Current tier semantics are easy to invert. |
| `motion@^12.38.0` | Implemented in floating nav | Keep for lightweight UI transitions. Do not add `framer-motion`; this package already provides the intended Motion API. |
| `gsap@^3.15.0`, `@gsap/react@^2.1.2` | Installed, not imported | Use only in M4 if ScrollTrigger orchestration is truly needed. For simple reveal/hover work, prefer CSS and Motion. |
| `splitting@^1.1.0` | Installed, not imported | Defer use until text reveal work. Remove if M4 is not near-term. |

### State, Content, and Utilities

| Technology | Status | Recommendation |
|------------|--------|----------------|
| Zustand `^5.0.12` | Implemented in `stores/globalStore.ts` | Keep for cross-cutting UI flags only. Do not turn it into a data cache. |
| Static JSON content | Implemented in `content/data/*.json` | Keep for v1. Add Zod validation before adding more content scale. |
| Zod `^4.3.6` | Installed, not imported | Use next for content schema validation and future contact API validation. |
| `clsx@^2.1.1` | Implemented | Keep as the class composition helper. |
| `lucide-react@^1.11.0` | Implemented | Keep for UI icons. |
| `date-fns@^4.1.0` | Installed, not imported | Use only when blog or timeline formatting needs it. Otherwise remove in dependency cleanup. |

### Tooling

| Technology | Version / Config | Status | Recommendation |
|------------|------------------|--------|----------------|
| Biome | `@biomejs/biome@2.2.0` | Implemented | Keep as linter, formatter, and import organizer. |
| Husky | `^9.1.7` | Implemented | Keep pre-commit hook lightweight. |
| lint-staged | `^16.4.0` | Implemented | Keep, but do not rely on it as the only quality gate. |
| TypeScript check | No script | Planned addition | Add `typecheck: tsc --noEmit`. |
| Testing | No runner or config | Missing | Add Playwright first, then Vitest where pure logic appears. |
| CI/CD | None | Missing | Add GitHub Actions or Vercel checks once launch work starts. |

## Planned or Unimplemented Stack

| Area | Planned Stack | Current Repo State | Prescriptive Decision |
|------|---------------|--------------------|----------------------|
| Contact form | Resend, React Hook Form, Zod, toast UX | RHF/Zod/toast installed; Resend/API route missing; form is `mailto:` | Implement with `app/api/contact/route.ts`, server-side Zod, abuse controls, and `resend`. Keep `mailto:` as fallback. |
| Analytics | Vercel Analytics | Not installed | Add `@vercel/analytics` in M8 launch phase, not before. Track page views, resume downloads, contact submits, terminal opens, and game starts. |
| Blog | MDX, syntax highlighting, RSS | No MDX engine or blog routes | Use `@next/mdx`, `gray-matter`, Shiki, and Zod frontmatter validation for this portfolio. Do not use Contentlayer. |
| Terminal | xterm.js overlay | Not installed | Add `@xterm/xterm` and `@xterm/addon-fit` only in M5. Keep command logic separate and testable. |
| Game | Pure Canvas Packet Runner | No game implementation | Keep pure Canvas. Do not add Kaboom, Phaser, or a physics engine unless the game scope changes. |
| Global leaderboard | Supabase optional | No database or env usage | Do not add Supabase until a global leaderboard or admin editing feature is explicitly in scope. Local storage is enough for first game phase. |
| SEO assets | sitemap, robots, JSON-LD, OG images | Metadata only | Use Next metadata file conventions first. Avoid extra SEO packages unless the local Next docs or implementation need them. |
| Deployment | Vercel planned | No config | Use standard Next deployment first. Add `vercel.json` only if defaults are insufficient. |
| Monitoring | None | Browser console only | For a personal portfolio, start with Vercel Analytics/Speed Insights. Add Sentry only if API/game errors justify it. |

## Recommended Additions

### Near-Term Additions

| Addition | Why | Suggested Phase |
|----------|-----|-----------------|
| `typecheck` script | `next build` does not replace an explicit typecheck/lint quality gate | Next maintenance phase |
| Playwright | Needed for route smoke, responsive checks, keyboard navigation, reduced motion, and WebGL/fallback screenshots | Before launch polish, ideally before more 3D changes |
| Content validation with Zod | Static JSON can break rendering or publish stale/malformed claims | Before adding certifications/blog/contact |
| Central GPU/motion policy hook | Current GPU tier meaning is split between store and scene | Before further 3D or animation phases |
| Resend package and API route | Needed to replace `mailto:` contact shell | Contact completion phase |

### Later Additions

| Addition | Why | Suggested Phase |
|----------|-----|-----------------|
| Vitest + Testing Library | Useful for pure command interpreter, game logic, content schemas, and utility tests | Terminal/game/blog phases |
| `@next/mdx`, `gray-matter`, Shiki | Blog posts need MDX rendering, frontmatter, and code highlighting | Blog phase |
| `@xterm/xterm`, `@xterm/addon-fit` | Terminal overlay needs a real terminal emulator | Terminal phase |
| `@vercel/analytics` | Launch telemetry with minimal stack overhead | Polish/launch phase |
| Optional Supabase client | Only if global leaderboard survives scope review | Game stretch phase |

## Things Not To Use

| Do Not Use | Why |
|------------|-----|
| Pages Router or `pages/api` | This is an App Router codebase. Route handlers belong under `app/api/**/route.ts`. |
| `middleware.ts` by default | Local Next 16 docs rename Middleware to Proxy. Use `proxy.ts` for new request interception unless docs require otherwise. |
| `next lint` | Removed in Next 16. Use `npm run lint` with Biome directly. |
| Package manager switching | The repo is npm + `package-lock.json`. Switching to pnpm/yarn/bun adds noise and lockfile churn. |
| Tailwind v3 config patterns | The repo is Tailwind v4 CSS-first with `@theme`. Keep that model. |
| Contentlayer | Project docs already rejected it, and the portfolio does not need that maintenance risk. |
| Kaboom, Phaser, physics engines | Packet Runner is scoped as a simple pure Canvas game. |
| D3 for the skills graph | Current implementation already has a CSS/SVG/R3F-adjacent visual direction. D3 is extra weight unless data interaction requirements change. |
| Framer Motion package | The repo uses `motion`. Do not install overlapping animation packages. |
| GSAP Club plugins | Budget and licensing do not fit this project. Use free GSAP, Motion, CSS, or native APIs. |
| Client-side secrets | Contact, analytics, and future database secrets must stay server-side or host-managed. |
| Wildcard remote images long-term | `images.remotePatterns` currently allows all HTTPS hosts. Restrict it before introducing real `next/image` remote usage. |
| React Compiler by default | Not part of the implemented stack. Enable only after local docs review and R3F/build validation. |

## Current Stack Risks

### Critical

1. **No automated application tests.** Biome and TypeScript will not catch route rendering, hydration, Canvas blank states, keyboard traps, or contact behavior. Add Playwright as the first test layer.
2. **WebGL fallback is reactive, not proactive.** The app mounts Canvas before fully deciding no-WebGL/low-tier/reduced-motion behavior. This can blank or overload weak devices.
3. **Contact is not launch-grade.** The UI looks like a form but submits through `mailto:`. The planned email stack needs server validation, rate limiting, and spam controls.
4. **Next.js 16 conventions are easy to get wrong from memory.** Local docs confirm Turbopack defaults, `next lint` removal, App Router route handler conventions, and `proxy.ts` naming. Read local docs before framework work.

### Moderate

1. **Dev-server smoke is unstable.** Existing concerns note `npm run dev`/Turbopack smoke did not reliably reach hydrated state in the recorded session. Use `npm run build` plus `npm run start` for production confidence until the dev issue is isolated.
2. **Unused dependencies increase maintenance surface.** GSAP, `@gsap/react`, RHF, Zod, toast, Splitting, and date-fns should either be used in near-term phases or removed until needed.
3. **Remote image wildcard is broader than the current app needs.** It is harmless while unused, but risky once `next/image` remote content lands.
4. **Experimental view transitions are enabled.** Keep the flag only if route transition work actively uses it and build/smoke tests stay stable.
5. **Static content lacks schema checks.** JSON imports are easy to break or drift from TypeScript assumptions.

### Minor

1. **Planning docs contain package-manager drift.** Older docs use `pnpm`; actual repo uses npm.
2. **Root package name drift may exist in lock metadata.** `.planning/codebase/STACK.md` noted `package.json` and lockfile root names differ. Let npm regenerate lock metadata naturally during the next dependency change.
3. **No deploy config exists.** This is fine for standard Vercel deployment, but launch docs should define the expected Node/npm/build commands.

## Phase Stack Guidance

### M3 Completion

Finish certifications and contact without broad stack churn. Use existing components, CSS Modules, Tailwind tokens, JSON content, Lucide, and Zustand. For contact, introduce Resend only with the route handler and abuse controls in the same phase.

### M4 Animation

Default to CSS scroll-driven animations and Motion. Use GSAP only where timeline coordination, ScrollTrigger, or section pinning creates real value. Do not scatter animation state across components; route reduced-motion through a shared policy.

### M5 Terminal

Add xterm packages in this phase only. Keep terminal state in Zustand if it must be globally openable, but keep command parsing in pure TypeScript so it can be unit tested.

### M6 Packet Runner

Use pure Canvas and localStorage first. Add no database. If a global leaderboard becomes real, add Supabase through server route handlers and environment variables, not directly from game UI.

### M7 Blog

Use `@next/mdx`, `gray-matter`, Shiki, and Zod frontmatter validation. Keep posts build-time/static unless a later reason for dynamic content appears. Add RSS through an App Router route handler.

### M8 Polish and Launch

Add Playwright coverage, analytics, SEO metadata files, robots, sitemap, JSON-LD, and launch deployment docs. Use Next metadata/file conventions before adding packages.

## Installation Guidance

Do not run these until the owning phase starts.

```bash
# Testing baseline
npm install -D @playwright/test

# Unit/component tests when pure logic exists
npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom

# Contact phase
npm install resend

# Terminal phase
npm install @xterm/xterm @xterm/addon-fit

# Blog phase
npm install @next/mdx gray-matter shiki

# Launch analytics
npm install @vercel/analytics
```

Keep all dependency changes npm-based and commit the resulting `package-lock.json` with the feature that uses the dependency.

## Required Local Next Docs

Before changing any Next.js behavior, read the relevant installed documentation under `node_modules/next/dist/docs/`. For this repo, the most relevant files are:

| Topic | Local doc |
|-------|-----------|
| Next 16 upgrade behavior | `node_modules/next/dist/docs/01-app/02-guides/upgrading/version-16.md` |
| Installation, scripts, linting, App Router basics | `node_modules/next/dist/docs/01-app/01-getting-started/01-installation.md` |
| Turbopack config | `node_modules/next/dist/docs/01-app/03-api-reference/05-config/01-next-config-js/turbopack.md` |
| View transitions flag | `node_modules/next/dist/docs/01-app/03-api-reference/05-config/01-next-config-js/viewTransition.md` |
| Route handlers | `node_modules/next/dist/docs/01-app/01-getting-started/15-route-handlers.md` |
| Proxy convention | `node_modules/next/dist/docs/01-app/01-getting-started/16-proxy.md` |

Observed local-doc implications:

- Next 16 uses Turbopack by default for `next dev` and `next build`.
- `turbopack` config belongs at the top level of `next.config.ts`, matching this repo.
- `next lint` is removed; Biome or ESLint must run directly.
- `next build` no longer runs linting automatically.
- Route handlers belong in `app/**/route.ts`.
- Middleware naming is deprecated in favor of `proxy.ts` for new request interception.
- `experimental.viewTransition` is still experimental and should be treated as such.

## Sources Read

- `.planning/codebase/STACK.md`
- `.planning/codebase/INTEGRATIONS.md`
- `.planning/codebase/CONCERNS.md`
- `docs/task_plan.md`
- `docs/MODULE_BREAKDOWN.md`
- `package.json`
- `next.config.ts`
- `tsconfig.json`
- `biome.json`
- `postcss.config.mjs`
- `node_modules/next/dist/docs/01-app/02-guides/upgrading/version-16.md`
- `node_modules/next/dist/docs/01-app/01-getting-started/01-installation.md`
- `node_modules/next/dist/docs/01-app/03-api-reference/05-config/01-next-config-js/turbopack.md`
- `node_modules/next/dist/docs/01-app/03-api-reference/05-config/01-next-config-js/viewTransition.md`
- `node_modules/next/dist/docs/01-app/01-getting-started/15-route-handlers.md`
- `node_modules/next/dist/docs/01-app/01-getting-started/16-proxy.md`

## Confidence Assessment

| Area | Confidence | Reason |
|------|------------|--------|
| Implemented stack | HIGH | Verified from package/config files and codebase map. |
| Next.js 16 conventions | HIGH | Verified against installed local Next docs. |
| Planned phase stack | MEDIUM | Based on project docs and current repo shape; should be rechecked when each phase starts. |
| Dependency cleanup guidance | MEDIUM | Import search confirms unused packages now, but near-term phase ordering determines whether to keep or remove them. |
