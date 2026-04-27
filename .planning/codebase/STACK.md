# Technology Stack

**Analysis Date:** 2026-04-27

## Languages

**Primary:**
- TypeScript 5 - Next.js App Router pages/layouts, React components, hooks, Zustand store, and shared type definitions in `app/layout.tsx`, `app/page.tsx`, `app/resume/page.tsx`, `app/MainContent.tsx`, `components/`, `hooks/`, `stores/globalStore.ts`, and `types/index.ts`.
- CSS / Tailwind CSS 4 - global design tokens and utilities in `app/globals.css`, with component-scoped CSS Modules in `components/ui/*.module.css`.
- JSON - committed portfolio data in `content/data/profile.json`, `content/data/projects.json`, `content/data/skills.json`, `content/data/experience.json`, `content/data/ctf-achievements.json`, and `content/data/certifications.json`; package and tool config in `package.json`, `tsconfig.json`, and `biome.json`.

**Secondary:**
- GLSL - inline shader programs for the WebGL scene in `components/3d/Starfield.tsx`, `components/3d/Constellation.tsx`, and `components/3d/NeutronStar.tsx`.
- Markdown - project and planning documentation in `README.md`, `docs/*.md`, and `.planning/codebase/*.md`.
- PDF/static binary assets - resume files in `public/resume.pdf` and `docs/Praneesh_R_V_Resume.pdf`; favicon in `app/favicon.ico`.

## Runtime

**Environment:**
- Next.js runtime: `next` 16.2.4 from `package.json`.
- React runtime: `react` 19.2.4 and `react-dom` 19.2.4 from `package.json`.
- Node requirement: installed Next.js declares `node >=20.9.0` in `node_modules/next/package.json`.
- Local inspected runtime: Node v25.9.0 and npm 11.13.0.

**Package Manager:**
- npm is the active package manager.
- Lockfile: `package-lock.json` present with lockfileVersion 3.
- Package manifest: `package.json`.
- Note: the root package name is `dying-star` in `package.json`; the lockfile root package name is `praneesh-portfolio` in `package-lock.json`.

**Scripts:**
```bash
npm run dev       # next dev
npm run build     # next build
npm run start     # next start
npm run lint      # biome check
npm run format    # biome format --write
npm run prepare   # husky
```

**Git Hooks:**
- `.husky/pre-commit` runs `npx lint-staged`.
- `package.json` configures `lint-staged` to run `biome check --write --no-errors-on-unmatched` for staged `*.ts`, `*.tsx`, `*.js`, `*.jsx`, `*.json`, and `*.css` files.

## Frameworks

**Core:**
- Next.js 16.2.4 - App Router application using `app/layout.tsx`, `app/page.tsx`, `app/resume/page.tsx`, and `app/not-found.tsx`.
- React 19.2.4 - Server Components by default; client components use `"use client"` in `app/MainContent.tsx`, `components/3d/SpaceCanvas.tsx`, `components/sections/ProjectsSection.tsx`, `components/sections/CTFSection.tsx`, and reusable UI components that use browser state/effects.
- Tailwind CSS 4 - imported with `@import "tailwindcss"` in `app/globals.css`; theme tokens are defined through `@theme inline`.
- CSS Modules - reusable UI components use colocated modules such as `components/ui/Button.module.css`, `components/ui/FloatingNav.module.css`, `components/ui/BootLoader.module.css`, `components/ui/ProjectCard.module.css`, and `components/ui/GlitchText.module.css`.

**Testing:**
- Not detected. No `*.test.*`, `*.spec.*`, `jest.config.*`, `vitest.config.*`, or `playwright.config.*` files were detected outside `node_modules`.
- Verification commands documented in `docs/progress.md` are manual checks: `npm run lint`, `npx tsc --noEmit`, `npm run build`, and browser smoke against `npm run start`.

**Build/Dev:**
- Next.js CLI drives development, production builds, and production server startup through `package.json`.
- Turbopack is the default bundler for `next dev` and `next build` in Next.js 16; local docs at `node_modules/next/dist/docs/01-app/02-guides/upgrading/version-16.md` describe `--webpack` as the opt-out path.
- TypeScript strict mode is enabled in `tsconfig.json` with `strict: true`, `moduleResolution: "bundler"`, `jsx: "react-jsx"`, `resolveJsonModule: true`, and the `@/*` path alias to project root.
- Biome 2.2.0 handles linting, formatting, import organization, and Next/React rule domains through `biome.json`.
- PostCSS uses `@tailwindcss/postcss` via `postcss.config.mjs`.

## Key Dependencies

**Critical:**
- `@react-three/fiber` ^9.6.0, `three` ^0.184.0, `@react-three/drei` ^10.7.7, and `@react-three/postprocessing` ^3.0.4 - primary 3D/WebGL stack used by `components/3d/SpaceCanvas.tsx`, `components/3d/Starfield.tsx`, `components/3d/Constellation.tsx`, `components/3d/NeutronStar.tsx`, `components/3d/DysonSphere.tsx`, and `components/3d/OrbitalPlanets.tsx`.
- `@pmndrs/detect-gpu` ^6.0.1 - browser GPU tier detection in `components/3d/SpaceCanvas.tsx`; controls star counts, constellation density, DPR, antialiasing, and bloom.
- `zustand` ^5.0.12 - global UI state in `stores/globalStore.ts` for boot loading, GPU tier, terminal/game flags, and reduced-motion state.
- `motion` ^12.38.0 - floating navigation animation in `components/ui/FloatingNav.tsx`.
- `lucide-react` ^1.11.0 - icons across `components/ui/FloatingNav.tsx`, `components/sections/ProjectsSection.tsx`, `components/sections/ExperienceSection.tsx`, `components/sections/CTFSection.tsx`, and `components/sections/ContactSection.tsx`.
- `clsx` ^2.1.1 - class composition in `lib/utils.ts`.

**Infrastructure / Declared For Planned Work:**
- `gsap` ^3.15.0 and `@gsap/react` ^2.1.2 are declared in `package.json`; no imports are present in `app/`, `components/`, `hooks/`, `lib/`, `stores/`, or `types/`.
- `react-hook-form` ^7.73.1, `zod` ^4.3.6, and `react-hot-toast` ^2.6.0 are declared in `package.json`; current contact UI in `components/sections/ContactSection.tsx` uses a plain `mailto:` form instead of these libraries.
- `date-fns` ^4.1.0 is declared in `package.json`; no source imports were detected.
- `splitting` ^1.1.0 is declared in `package.json`; no source imports were detected.

## Application Surface

**Routes:**
- `/` is implemented by `app/page.tsx`.
- `/resume` is implemented by `app/resume/page.tsx` and embeds the static asset `public/resume.pdf` with an `<iframe>`.
- `app/not-found.tsx` implements the 404 page.
- No `app/api/**/route.ts`, `proxy.ts`, or `middleware.ts` files are present.

**M3 Sections:**
- `app/page.tsx` wires the M3 home sections after the hero: `AboutSection`, `ProjectsSection`, `SkillsSection`, `ExperienceSection`, `CTFSection`, and `ContactSection`.
- `components/sections/AboutSection.tsx` renders profile/HUD content from `content/data/profile.json`.
- `components/sections/ProjectsSection.tsx` renders filterable project cards from `content/data/projects.json`.
- `components/sections/SkillsSection.tsx` renders a CSS/SVG skill constellation and grouped skill grid from `content/data/skills.json`.
- `components/sections/ExperienceSection.tsx` renders a timeline from `content/data/experience.json`.
- `components/sections/CTFSection.tsx` renders the CTF hall of fame from `content/data/ctf-achievements.json` and includes a click-triggered mini challenge panel.
- `components/sections/ContactSection.tsx` renders a static contact form that submits through `mailto:` using profile data from `content/data/profile.json`.
- `content/data/certifications.json` exists, but no rendered certification section is wired into `app/page.tsx`.

**3D/WebGL:**
- `components/3d/SpaceCanvas.tsx` hosts the `Canvas`, GPU scaling, bloom, camera, lights, and orbital controls.
- `app/page.tsx` wraps `SpaceCanvas` with `components/3d/WebGLErrorBoundary.tsx` and `components/fallbacks/StarFallback.tsx`.
- `components/3d/index.ts` is the barrel export for 3D components.

**State and Hooks:**
- `stores/globalStore.ts` owns app-wide UI flags.
- `hooks/useMediaQuery.ts` and `hooks/useReducedMotion.ts` provide browser preference/media helpers.
- `app/MainContent.tsx` gates initial render behind `BootLoader` and then displays `FloatingNav`.

## Configuration

**Environment:**
- No implemented source reads `process.env` or `NEXT_PUBLIC_*`; search coverage included `app/`, `components/`, `hooks/`, `lib/`, `stores/`, `types/`, and `content/`.
- `.env.example` is present and was not read; `.env*` files are treated as secret-bearing configuration.
- `.gitignore` excludes `.env*`, `.next/`, `out/`, `build/`, `coverage/`, `*.pem`, and `tsconfig.tsbuildinfo`.

**Build:**
- `next.config.ts` enables `reactStrictMode`, sets `turbopack.root` to the local project directory, enables AVIF/WebP image formats, allows wildcard HTTPS `images.remotePatterns`, and turns on `experimental.viewTransition`.
- `tsconfig.json` enables strict TypeScript, Next plugin support, JSON imports, bundler resolution, and `@/*` path imports.
- `biome.json` enables Biome formatting and linting with recommended Next/React domains.
- `postcss.config.mjs` registers Tailwind 4's PostCSS plugin.

**Styling:**
- `app/globals.css` defines the dark space design system: CSS color tokens, font aliases, z-index scale, spacing, animation durations, glass utilities, glow utilities, scanlines, and reduced-motion behavior.
- `app/layout.tsx` imports Google font families through `next/font/google`: Orbitron, DM Sans, JetBrains Mono, and Cinzel.

## Platform Requirements

**Development:**
- Use Node.js >=20.9.0 with npm and `package-lock.json`.
- Use `npm run lint` explicitly; local Next 16 docs at `node_modules/next/dist/docs/01-app/01-getting-started/01-installation.md` state that `next build` does not run linting automatically.
- Use `npm run build` for production builds and `npm run start` for local production preview.
- `docs/progress.md` notes `npm run dev` needs investigation because production preview worked while dev-server smoke timed out or hydrated slowly during the recorded session.

**Production:**
- Production runtime is a standard Next.js server via `npm run start`.
- Deployment platform is not configured in repo. No `vercel.json`, `.github/workflows/*`, Dockerfile, or `netlify.toml` was detected.
- Planning docs mention Vercel deployment in `docs/praneesh_portfolio_masterplan.md` and `docs/MODULE_BREAKDOWN.md`, but the implemented repo has no deployment-specific config.

## Next 16 Local-Doc Requirement

- `AGENTS.md` requires reading relevant local Next.js docs under `node_modules/next/dist/docs/` before writing Next-specific code; `CLAUDE.md` points to `AGENTS.md`.
- Use local docs, not framework memory, for Next 16 behavior in this repo.
- Relevant docs already present locally:
  - `node_modules/next/dist/docs/01-app/01-getting-started/01-installation.md` - scripts, linting, Biome/ESLint setup, Turbopack default.
  - `node_modules/next/dist/docs/01-app/02-guides/upgrading/version-16.md` - Next 16 migration changes, Turbopack default, `next lint` removal, Proxy rename, `cacheComponents`.
  - `node_modules/next/dist/docs/01-app/03-api-reference/05-config/01-next-config-js/turbopack.md` - Turbopack config.
  - `node_modules/next/dist/docs/01-app/03-api-reference/05-config/01-next-config-js/viewTransition.md` - `experimental.viewTransition`.
  - `node_modules/next/dist/docs/01-app/01-getting-started/15-route-handlers.md` - App Router route handlers for future APIs.
  - `node_modules/next/dist/docs/01-app/01-getting-started/16-proxy.md` - Proxy convention replacing Middleware naming.
  - `node_modules/next/dist/docs/01-app/01-getting-started/12-images.md` - remote image safety and `images.remotePatterns`.
- For future API work, add `app/api/**/route.ts` route handlers per local docs; do not add Pages Router `pages/api` routes to this App Router codebase.
- For future request interception, add root-level `proxy.ts` per local docs; do not introduce `middleware.ts` naming without checking Next 16 guidance.

---

*Stack analysis: 2026-04-27*
