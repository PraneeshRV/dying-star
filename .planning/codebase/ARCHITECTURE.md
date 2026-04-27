# Architecture

**Analysis Date:** 2026-04-27

## Pattern Overview

**Overall:** Next.js App Router portfolio with server-rendered route shells and client-side interactive islands.

**Key Characteristics:**
- `app/layout.tsx`, `app/page.tsx`, `app/resume/page.tsx`, and `app/not-found.tsx` are App Router route files; pages and layouts are Server Components by default according to `node_modules/next/dist/docs/01-app/01-getting-started/05-server-and-client-components.md`.
- Client-only behavior is isolated behind `"use client"` boundaries in `app/MainContent.tsx`, `components/3d/*.tsx`, interactive section components, `components/ui/*.tsx`, `hooks/*.ts`, and `components/fallbacks/StarFallback.tsx`.
- The home route is a single-page portfolio experience with stable M3 section anchors: `home`, `about`, `projects`, `skills`, `experience`, `ctf`, and `contact` in `app/page.tsx`.
- Portfolio content is local and static: sections import JSON from `content/data/*.json`, cast to TypeScript interfaces from `types/index.ts`, and render directly without a database or API layer.
- The 3D hero is progressive enhancement: `app/page.tsx` wraps `components/3d/SpaceCanvas.tsx` in `components/3d/WebGLErrorBoundary.tsx` and falls back to `components/fallbacks/StarFallback.tsx`.
- Planned modules are represented by real placeholders or unused state/types: `components/game/.gitkeep`, `content/blog/.gitkeep`, `shaders/.gitkeep`, `stores/globalStore.ts` terminal/game fields, and `types/index.ts` blog/terminal types.

## Layers

**App Router Routes:**
- Purpose: Define public URL surfaces, metadata, root HTML/body shell, and page-level composition.
- Location: `app/`
- Contains: `app/layout.tsx`, `app/page.tsx`, `app/resume/page.tsx`, `app/not-found.tsx`, `app/MainContent.tsx`, `app/globals.css`
- Depends on: `next`, `next/font/google`, `components/ui/CustomCursor.tsx`, `app/MainContent.tsx`, `components/3d/index.ts`, `components/sections/*.tsx`, `components/fallbacks/StarFallback.tsx`
- Used by: Next.js runtime and all browser routes.

**Route-Level Client Shell:**
- Purpose: Gate initial route visibility behind the boot loader and mount shared floating UI after loading completes.
- Location: `app/MainContent.tsx`
- Contains: `MainContent`, mounted-state hydration guard, boot completion wiring, route `children` wrapper, `FloatingNav` mount.
- Depends on: `components/ui/BootLoader.tsx`, `components/ui/FloatingNav.tsx`, `stores/globalStore.ts`
- Used by: `app/layout.tsx` for every route, including `/` and `/resume`.

**M3 Section Components:**
- Purpose: Render the implemented portfolio content sections on the home route.
- Location: `components/sections/`
- Contains: `AboutSection.tsx`, `ProjectsSection.tsx`, `SkillsSection.tsx`, `ExperienceSection.tsx`, `CTFSection.tsx`, `ContactSection.tsx`
- Depends on: `content/data/profile.json`, `content/data/projects.json`, `content/data/skills.json`, `content/data/experience.json`, `content/data/ctf-achievements.json`, `types/index.ts`, `components/ui/*.tsx`, `lucide-react`
- Used by: `app/page.tsx`

**3D Scene Layer:**
- Purpose: Render the hero background and orbital navigation enhancement with React Three Fiber and custom Three.js/GLSL objects.
- Location: `components/3d/`
- Contains: `SpaceCanvas.tsx`, `Starfield.tsx`, `Constellation.tsx`, `NeutronStar.tsx`, `DysonSphere.tsx`, `OrbitalPlanets.tsx`, `WebGLErrorBoundary.tsx`, `index.ts`
- Depends on: `@react-three/fiber`, `@react-three/drei`, `@react-three/postprocessing`, `@pmndrs/detect-gpu`, `three`
- Used by: `app/page.tsx`

**UI Primitive Layer:**
- Purpose: Provide reusable styled client widgets and animation primitives used by pages and sections.
- Location: `components/ui/`
- Contains: `BootLoader.tsx`, `Button.tsx`, `CustomCursor.tsx`, `FloatingNav.tsx`, `GlitchText.tsx`, `ProjectCard.tsx`, `TypewriterText.tsx`, paired `*.module.css` files.
- Depends on: `motion/react`, `lucide-react`, `hooks/useReducedMotion.ts`, `lib/utils.ts`, `types/index.ts`
- Used by: `app/layout.tsx`, `app/MainContent.tsx`, `components/sections/*.tsx`

**Fallback Layer:**
- Purpose: Provide non-WebGL visual backup for the hero when the 3D subtree throws.
- Location: `components/fallbacks/`
- Contains: `StarFallback.tsx`
- Depends on: React client hooks and global CSS animation `twinkle` from `app/globals.css`
- Used by: `app/page.tsx` through `WebGLErrorBoundary`.

**State Layer:**
- Purpose: Hold cross-cutting UI flags that need to survive component boundaries.
- Location: `stores/globalStore.ts`
- Contains: Zustand store fields for `loadingComplete`, `gpuTier`, `terminalOpen`, `gameActive`, and `reducedMotion`.
- Depends on: `zustand`, `types/index.ts`
- Used by: `app/MainContent.tsx` currently uses only `loadingComplete` and `setLoadingComplete`.

**Content/Data Layer:**
- Purpose: Store portfolio facts in versioned local files rather than remote services.
- Location: `content/data/`
- Contains: `profile.json`, `projects.json`, `skills.json`, `experience.json`, `ctf-achievements.json`, `certifications.json`
- Depends on: TypeScript `resolveJsonModule` in `tsconfig.json`
- Used by: `components/sections/AboutSection.tsx`, `components/sections/ProjectsSection.tsx`, `components/sections/SkillsSection.tsx`, `components/sections/ExperienceSection.tsx`, `components/sections/CTFSection.tsx`, `components/sections/ContactSection.tsx`

**Shared Types and Utilities:**
- Purpose: Centralize data contracts and small cross-component helpers.
- Location: `types/index.ts`, `lib/utils.ts`, `hooks/`
- Contains: `Project`, `Skill`, `TimelineEntry`, `CTFAchievement`, `BlogPost`, `TerminalCommand`, `NavItem`, `GPUTier`, `cn`, `formatDate`, `useMediaQuery`, `useReducedMotion`
- Depends on: `clsx`, React client hooks for `hooks/*.ts`
- Used by: sections, UI primitives, and the Zustand store.

**Static Assets:**
- Purpose: Serve route-independent files directly from the public filesystem.
- Location: `public/`
- Contains: `public/resume.pdf`, default SVG assets, empty `public/fonts/.gitkeep`, empty `public/textures/.gitkeep`
- Depends on: Next.js public-folder serving.
- Used by: `app/resume/page.tsx` and the `/resume.pdf` static URL.

## Data Flow

**Home Route Render Flow:**

1. Next.js renders `app/layout.tsx`, applies Google fonts through `next/font/google`, exports root `metadata` and `viewport`, imports `app/globals.css`, and mounts `components/ui/CustomCursor.tsx`.
2. `app/layout.tsx` passes route `children` into the client shell `app/MainContent.tsx`.
3. `app/MainContent.tsx` waits for client mount, reads `loadingComplete` from `stores/globalStore.ts`, displays `components/ui/BootLoader.tsx`, fades route content in after `setLoadingComplete(true)`, then mounts `components/ui/FloatingNav.tsx`.
4. For `/`, `app/page.tsx` renders the hero section with `components/3d/WebGLErrorBoundary.tsx`, `components/3d/SpaceCanvas.tsx`, and hero CTAs.
5. `app/page.tsx` then renders the M3 section stack from `components/sections/AboutSection.tsx`, `ProjectsSection.tsx`, `SkillsSection.tsx`, `ExperienceSection.tsx`, `CTFSection.tsx`, and `ContactSection.tsx`.
6. Static content enters each section through JSON imports from `content/data/` and type casts against `types/index.ts`.
7. Client islands hydrate where needed: the 3D canvas, project filters, CTF counter/challenge, typewriter text, floating nav, custom cursor, boot loader, and project-card tilt.

**Resume Route Flow:**

1. Next.js renders `/resume` from `app/resume/page.tsx` as a Server Component with route-specific `metadata`.
2. The global `app/layout.tsx` still wraps `/resume` with `components/ui/CustomCursor.tsx` and `app/MainContent.tsx`, so the boot loader behavior is shared with the home route.
3. `app/resume/page.tsx` embeds `public/resume.pdf` in an `<iframe>` using `/resume.pdf#toolbar=1&navpanes=0` and provides direct links to `/` and `/resume.pdf`.

**3D Scene Flow:**

1. `app/page.tsx` creates the 3D boundary: `<WebGLErrorBoundary fallback={<StarFallback />}><SpaceCanvas /></WebGLErrorBoundary>`.
2. `components/3d/SpaceCanvas.tsx` calls `getGPUTier()` in a client effect and stores the detected tier in local React state.
3. The tier controls star population, constellation population, DPR, antialiasing, and bloom usage in `components/3d/SpaceCanvas.tsx`.
4. `SpaceCanvas` creates one `<Canvas>`, default camera, lights, `Suspense`, `Starfield`, `Constellation`, `NeutronStar`, `DysonSphere`, `OrbitalPlanets`, optional `EffectComposer/Bloom`, and `OrbitControls`.
5. Scene objects allocate geometry data and shader uniforms with `useMemo`, mutate refs/uniforms inside `useFrame`, and avoid per-frame object allocation in `components/3d/Starfield.tsx`, `Constellation.tsx`, `NeutronStar.tsx`, and `DysonSphere.tsx`.
6. `components/3d/OrbitalPlanets.tsx` maps planet clicks to DOM section anchors via `document.querySelector(p.section)?.scrollIntoView(...)`; the accessible primary path remains `components/ui/FloatingNav.tsx`.

**Navigation Flow:**

1. `components/ui/FloatingNav.tsx` owns its `NAV_ITEMS` array for `home`, `about`, `projects`, `skills`, `experience`, `ctf`, and `contact`.
2. It hides while the hero is near the top, reveals based on scroll direction, and uses `IntersectionObserver` to select the active section.
3. Anchor clicks call `scrollIntoView`, use reduced-motion-aware smooth scrolling, and update the hash through `history.replaceState`.
4. Because `app/MainContent.tsx` mounts `FloatingNav` for every route, future non-home routes should pass route-specific `items` or disable the dock when the home section ids are absent.

**Content Update Flow:**

1. Edit `content/data/profile.json` for About and Contact identity data.
2. Edit `content/data/projects.json` for Projects cards and filters.
3. Edit `content/data/skills.json` for Skills graph/grid.
4. Edit `content/data/experience.json` for Experience timeline.
5. Edit `content/data/ctf-achievements.json` for the CTF achievement table.
6. Edit `content/data/certifications.json` for planned Certifications UI; it is not rendered by any current route.
7. Keep shapes aligned with `types/index.ts`; there is no runtime schema validation in the current data flow.

**State Management:**
- Global state: `stores/globalStore.ts` uses Zustand for `loadingComplete`, `gpuTier`, `terminalOpen`, `gameActive`, and `reducedMotion`.
- Active global usage: `app/MainContent.tsx` reads and writes only `loadingComplete`.
- Local client state: `components/3d/SpaceCanvas.tsx` stores GPU tier locally; `components/sections/ProjectsSection.tsx` stores active filter; `components/sections/CTFSection.tsx` stores flag count/click/reveal state; `components/ui/FloatingNav.tsx` stores active section and visibility; `components/ui/BootLoader.tsx` stores boot progress; `components/ui/CustomCursor.tsx` stores cursor visibility/hover state.
- DOM/browser state: `components/ui/FloatingNav.tsx`, `components/ui/CustomCursor.tsx`, `hooks/useReducedMotion.ts`, `hooks/useMediaQuery.ts`, and `components/3d/OrbitalPlanets.tsx` access browser APIs only inside client components.

## Key Abstractions

**Root Layout Shell:**
- Purpose: Configure fonts, SEO metadata, body styling, cursor, and route reveal wrapper.
- Examples: `app/layout.tsx`, `app/MainContent.tsx`
- Pattern: Server root layout imports narrow client components for browser-only behavior.

**Client Island Boundary:**
- Purpose: Keep most route markup server-rendered while enabling hooks, event handlers, browser APIs, and R3F where required.
- Examples: `app/MainContent.tsx`, `components/3d/SpaceCanvas.tsx`, `components/sections/ProjectsSection.tsx`, `components/sections/CTFSection.tsx`, `components/ui/FloatingNav.tsx`
- Pattern: Add `"use client"` only to files that own state/effects/events or import browser-only libraries.

**M3 Content Section:**
- Purpose: Encapsulate a home-page portfolio section with a stable `id`, static JSON data, themed visuals, and optional client behavior.
- Examples: `components/sections/AboutSection.tsx`, `components/sections/ProjectsSection.tsx`, `components/sections/SkillsSection.tsx`, `components/sections/ExperienceSection.tsx`, `components/sections/CTFSection.tsx`, `components/sections/ContactSection.tsx`
- Pattern: Use `content/data/*.json` plus type casts from `types/index.ts`; split client-only interactions into client section files or child UI components.

**3D Scene Object:**
- Purpose: Represent a self-contained Three.js object inside one shared R3F canvas.
- Examples: `components/3d/Starfield.tsx`, `components/3d/Constellation.tsx`, `components/3d/NeutronStar.tsx`, `components/3d/DysonSphere.tsx`, `components/3d/OrbitalPlanets.tsx`
- Pattern: Export typed props, memoize buffers/uniforms, mutate refs in `useFrame`, and expose objects through `components/3d/index.ts`.

**JSON Content Model:**
- Purpose: Keep portfolio copy and facts reviewable without a CMS.
- Examples: `content/data/profile.json`, `content/data/projects.json`, `content/data/skills.json`, `content/data/experience.json`, `content/data/ctf-achievements.json`, `content/data/certifications.json`
- Pattern: Import JSON directly from sections and cast to interfaces from `types/index.ts`; add runtime validation only when content becomes user-submitted or remotely sourced.

**Global UI Store:**
- Purpose: Share cross-cutting UI state for shell, terminal, game, GPU, and motion preferences.
- Examples: `stores/globalStore.ts`
- Pattern: Zustand store with small setter/toggler actions; use only from client components.

**Design Token Surface:**
- Purpose: Centralize the cyber/space theme across Tailwind v4 and custom CSS utilities.
- Examples: `app/globals.css`, `components/ui/*.module.css`
- Pattern: Define colors, fonts, z-indexes, durations, glass utilities, glow utilities, focus rings, scanlines, and reduced-motion defaults in `app/globals.css`; keep component-specific interaction styling in CSS modules.

## Entry Points

**Root Layout:**
- Location: `app/layout.tsx`
- Triggers: Every App Router request.
- Responsibilities: Export global metadata/viewport, configure fonts, include global CSS, render `<html>`/`<body>`, mount `CustomCursor`, and wrap routes with `MainContent`.

**Home Route:**
- Location: `app/page.tsx`
- Triggers: `GET /`
- Responsibilities: Render hero, 3D canvas/fallback boundary, resume/explore CTAs, and the M3 section stack.

**Resume Route:**
- Location: `app/resume/page.tsx`
- Triggers: `GET /resume`
- Responsibilities: Export resume metadata, present static PDF details, embed `/resume.pdf`, and link back home.

**Static Resume Asset:**
- Location: `public/resume.pdf`
- Triggers: `GET /resume.pdf`
- Responsibilities: Serve the resume PDF directly from Next.js public assets.

**Not Found Route:**
- Location: `app/not-found.tsx`
- Triggers: App Router 404 rendering.
- Responsibilities: Export 404 metadata and render terminal-styled recovery UI with a home link.

**Global Styles:**
- Location: `app/globals.css`
- Triggers: Imported by `app/layout.tsx`.
- Responsibilities: Tailwind v4 import, theme tokens, base document styles, glass/glow utilities, focus styles, reduced-motion policy, custom cursor document state, and `twinkle` keyframes.

**3D Scene Barrel:**
- Location: `components/3d/index.ts`
- Triggers: Imports from `app/page.tsx` and `components/3d/SpaceCanvas.tsx`.
- Responsibilities: Export 3D objects and their prop types from a single module.

**Framework Config:**
- Location: `next.config.ts`
- Triggers: Next.js build/dev/start.
- Responsibilities: Enable `reactStrictMode`, set `turbopack.root`, configure image formats/remote patterns, and enable experimental `viewTransition`.

## Route and Component Boundaries

**Current Routes:**
- `/`: `app/page.tsx`
- `/resume`: `app/resume/page.tsx`
- Framework 404: `app/not-found.tsx`
- Static PDF: `public/resume.pdf` served at `/resume.pdf`

**Missing Planned Routes and Handlers:**
- `/api/contact`: planned as `app/api/contact/route.ts` for Resend-backed form submission.
- `/blog`: planned as `app/blog/page.tsx`.
- `/blog/[slug]`: planned as `app/blog/[slug]/page.tsx`.
- `/feed.xml`: planned as `app/feed.xml/route.ts`.
- `/uses`: v2 planned route, no current `app/uses/page.tsx`.
- Sitemap/robots: planned launch SEO, no current `app/sitemap.ts`, `app/robots.ts`, `public/sitemap.xml`, or `public/robots.txt` found.

**Server Components:**
- `app/layout.tsx`: server root layout with metadata, fonts, and static shell.
- `app/page.tsx`: server home composition that imports client islands.
- `app/resume/page.tsx`: server resume route with static iframe markup.
- `app/not-found.tsx`: server 404 route.
- `components/sections/AboutSection.tsx`, `SkillsSection.tsx`, `ExperienceSection.tsx`, and `ContactSection.tsx`: server section components that render client UI children where needed.

**Client Components:**
- `app/MainContent.tsx`: hydration guard, boot loader state, route reveal, nav mounting.
- `components/sections/ProjectsSection.tsx`: project filtering UI.
- `components/sections/CTFSection.tsx`: flag counter, challenge reveal, timer.
- `components/3d/*.tsx`: R3F canvas, shaders, frame loops, orbit interactions, WebGL boundary.
- `components/fallbacks/StarFallback.tsx`: randomized star fallback.
- `components/ui/*.tsx`: cursor, boot loader, nav, buttons/cards/text effects.
- `hooks/useMediaQuery.ts` and `hooks/useReducedMotion.ts`: browser media-query hooks.

## Planned Missing Modules

**Certifications Section:**
- Current data: `content/data/certifications.json`
- Missing UI: `components/sections/CertificationsSection.tsx`
- Integration point: `app/page.tsx` section stack and `components/ui/FloatingNav.tsx` if it becomes a first-class anchor.

**Contact API:**
- Current shell: `components/sections/ContactSection.tsx` uses `mailto:` form action and social links from `content/data/profile.json`.
- Missing route handler: `app/api/contact/route.ts`
- Missing helper boundary: likely `lib/contact.ts` or `lib/validation.ts` for server-side validation/rate limiting.
- Planned dependencies already installed: `react-hook-form`, `zod`, `react-hot-toast` in `package.json`.

**Terminal Overlay:**
- Current state hooks: `terminalOpen` and `toggleTerminal` in `stores/globalStore.ts`; `TerminalCommand` type in `types/index.ts`.
- Missing UI: `components/ui/Terminal.tsx` or a dedicated `components/terminal/` folder if the feature grows.
- Missing command map: `lib/terminal-commands.ts`.

**Packet Runner Game:**
- Current placeholder: `components/game/.gitkeep`
- Current state hook: `gameActive` and `setGameActive` in `stores/globalStore.ts`
- Missing UI/engine: `components/game/PacketRunner.tsx` and game loop helpers under `components/game/` or `lib/`.

**Blog/MDX Engine:**
- Current placeholder: `content/blog/.gitkeep`
- Current type: `BlogPost` in `types/index.ts`
- Missing routes: `app/blog/page.tsx`, `app/blog/[slug]/page.tsx`
- Missing helpers: `lib/blog.ts`, MDX parsing/config, syntax highlighting, RSS route.

**3D Fallback and Asset Modules:**
- Current fallback: `components/fallbacks/StarFallback.tsx`
- Current empty asset folders: `public/textures/.gitkeep`, `shaders/.gitkeep`
- Missing behavior: centralized no-WebGL/low-GPU/reduced-motion/hidden-tab fallback policy and screenshot validation path.

**Launch SEO and Analytics:**
- Current metadata: `app/layout.tsx`, `app/resume/page.tsx`, `app/not-found.tsx`
- Missing files: `app/sitemap.ts`, `app/robots.ts`, OG image assets, analytics wiring.

## Error Handling

**Strategy:** Route-level static fallbacks plus client-side cleanup and WebGL boundary handling.

**Patterns:**
- `components/3d/WebGLErrorBoundary.tsx` catches errors thrown by the WebGL subtree and renders the provided `fallback` from `components/fallbacks/StarFallback.tsx`.
- `app/not-found.tsx` handles unknown routes through the App Router not-found convention.
- Client effects in `components/ui/BootLoader.tsx`, `components/ui/FloatingNav.tsx`, `components/ui/CustomCursor.tsx`, `hooks/useMediaQuery.ts`, `hooks/useReducedMotion.ts`, and 3D components clean up timers, event listeners, animation frames, or observers.
- `components/sections/ContactSection.tsx` has no server error path because submissions are currently delegated to `mailto:`.
- `content/data/*.json` imports have compile-time TypeScript shape expectations but no runtime schema validation.

## Cross-Cutting Concerns

**Logging:** `components/3d/WebGLErrorBoundary.tsx` logs WebGL errors with `console.error`; no structured logging or remote observability is present.

**Validation:** Static JSON is cast to TypeScript types from `types/index.ts`; no `zod` or runtime validation is used in current routes.

**Authentication:** Not applicable; no user accounts, auth provider, protected routes, or database exist.

**Accessibility:** `app/globals.css` defines focus-visible styles and reduced-motion defaults; `components/ui/FloatingNav.tsx` exposes labeled section navigation; `components/3d/OrbitalPlanets.tsx` is enhancement only and should not become the only navigation path.

**Performance:** The heavy visual path is isolated to `components/3d/SpaceCanvas.tsx`; it uses GPU-tier scaling, DPR limits, optional bloom, memoized buffers/uniforms, and ref mutation in `useFrame`.

**Security:** No secrets are read by current code. Future `app/api/contact/route.ts`, terminal commands, game flags, and analytics should keep secrets server-only and use fake-only public challenge content.

---

*Architecture analysis: 2026-04-27*
