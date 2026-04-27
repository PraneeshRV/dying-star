# Codebase Structure

**Analysis Date:** 2026-04-27

## Directory Layout

```text
dying-star/
├── app/                    # Next.js App Router routes, root layout, client shell, global CSS
│   ├── resume/             # `/resume` route
│   ├── MainContent.tsx     # Client shell for boot reveal and floating nav
│   ├── globals.css         # Tailwind v4 import, design tokens, global utilities
│   ├── layout.tsx          # Root layout, metadata, fonts, body shell
│   ├── not-found.tsx       # Framework 404 UI
│   └── page.tsx            # `/` home route with hero, 3D scene, and M3 sections
├── components/
│   ├── 3d/                 # React Three Fiber scene objects and WebGL boundary
│   ├── fallbacks/          # Non-WebGL visual fallback components
│   ├── game/               # Planned Packet Runner module; currently placeholder only
│   ├── sections/           # Home-page M3 portfolio sections
│   └── ui/                 # Reusable client UI primitives and CSS modules
├── content/
│   ├── blog/               # Planned local MDX posts; currently placeholder only
│   └── data/               # Static JSON portfolio data
├── docs/                   # Product plans, module docs, source resume PDF
├── hooks/                  # Browser media-query hooks
├── lib/                    # Shared helpers
├── public/                 # Static public assets, including `resume.pdf`
├── shaders/                # Planned extracted shader assets; currently placeholder only
├── stores/                 # Zustand global UI state
├── types/                  # Shared TypeScript data contracts
├── .planning/              # GSD project state and codebase maps
├── next.config.ts          # Next.js config
├── package.json            # npm scripts and dependencies
├── postcss.config.mjs      # Tailwind v4 PostCSS plugin
├── tsconfig.json           # TypeScript config and `@/*` path alias
└── biome.json              # Biome formatter/linter config
```

## Directory Purposes

**`app/`:**
- Purpose: Own App Router route files, route-level metadata, root document shell, and global styling.
- Contains: `app/layout.tsx`, `app/page.tsx`, `app/resume/page.tsx`, `app/not-found.tsx`, `app/MainContent.tsx`, `app/globals.css`, `app/favicon.ico`
- Key files: `app/layout.tsx` for fonts/metadata/body wrapper, `app/page.tsx` for `/`, `app/resume/page.tsx` for `/resume`, `app/MainContent.tsx` for shared client shell.

**`app/resume/`:**
- Purpose: Route segment for the resume viewer.
- Contains: `app/resume/page.tsx`
- Key files: `app/resume/page.tsx` embeds `public/resume.pdf` and links to `/resume.pdf`.

**`components/3d/`:**
- Purpose: Client-only 3D scene layer for the home hero.
- Contains: `SpaceCanvas.tsx`, `Starfield.tsx`, `Constellation.tsx`, `NeutronStar.tsx`, `DysonSphere.tsx`, `OrbitalPlanets.tsx`, `WebGLErrorBoundary.tsx`, `index.ts`
- Key files: `components/3d/SpaceCanvas.tsx` composes the scene; `components/3d/index.ts` is the 3D barrel export; `components/3d/WebGLErrorBoundary.tsx` catches WebGL subtree failures.

**`components/fallbacks/`:**
- Purpose: Client-side visual fallbacks for heavy rendering paths.
- Contains: `components/fallbacks/StarFallback.tsx`
- Key files: `components/fallbacks/StarFallback.tsx` renders randomized CSS stars when the WebGL boundary fails.

**`components/sections/`:**
- Purpose: Render the implemented M3 home-page content sections.
- Contains: `AboutSection.tsx`, `ProjectsSection.tsx`, `SkillsSection.tsx`, `ExperienceSection.tsx`, `CTFSection.tsx`, `ContactSection.tsx`
- Key files: `components/sections/ProjectsSection.tsx` owns project filtering; `components/sections/CTFSection.tsx` owns the CTF counter/challenge; `components/sections/ContactSection.tsx` owns the current mailto contact shell.

**`components/ui/`:**
- Purpose: Reusable UI primitives, shared interactive widgets, and component-scoped CSS modules.
- Contains: `BootLoader.tsx`, `Button.tsx`, `CustomCursor.tsx`, `FloatingNav.tsx`, `GlitchText.tsx`, `ProjectCard.tsx`, `TypewriterText.tsx`, and paired `*.module.css` files.
- Key files: `components/ui/FloatingNav.tsx` defines the home section dock; `components/ui/BootLoader.tsx` owns route reveal boot animation; `components/ui/ProjectCard.tsx` owns pointer-tilt card behavior.

**`components/game/`:**
- Purpose: Placeholder for the planned Packet Runner canvas minigame.
- Contains: `components/game/.gitkeep`
- Key files: Not detected beyond placeholder.

**`content/data/`:**
- Purpose: Store static structured portfolio content.
- Contains: `profile.json`, `projects.json`, `skills.json`, `experience.json`, `ctf-achievements.json`, `certifications.json`
- Key files: `content/data/profile.json` feeds About/Contact, `content/data/projects.json` feeds Projects, `content/data/certifications.json` is present but not rendered.

**`content/blog/`:**
- Purpose: Placeholder for planned local MDX blog posts.
- Contains: `content/blog/.gitkeep`
- Key files: Not detected beyond placeholder.

**`hooks/`:**
- Purpose: Small client hooks for browser media queries and motion preferences.
- Contains: `hooks/useMediaQuery.ts`, `hooks/useReducedMotion.ts`
- Key files: `hooks/useReducedMotion.ts` is used by `components/ui/BootLoader.tsx`.

**`lib/`:**
- Purpose: Shared framework-neutral helpers.
- Contains: `lib/utils.ts`
- Key files: `lib/utils.ts` exports `cn` and `formatDate`.

**`stores/`:**
- Purpose: Global UI state through Zustand.
- Contains: `stores/globalStore.ts`
- Key files: `stores/globalStore.ts` defines boot, GPU, terminal, game, and reduced-motion flags.

**`types/`:**
- Purpose: Shared TypeScript contracts for content, UI, terminal, blog, and scene state.
- Contains: `types/index.ts`
- Key files: `types/index.ts` defines `Project`, `Skill`, `TimelineEntry`, `CTFAchievement`, `BlogPost`, `TerminalCommand`, `NavItem`, and `GPUTier`.

**`public/`:**
- Purpose: Static assets served from site root.
- Contains: `public/resume.pdf`, default SVGs, `public/fonts/.gitkeep`, `public/textures/.gitkeep`
- Key files: `public/resume.pdf` is the current resume asset for `/resume` and `/resume.pdf`.

**`shaders/`:**
- Purpose: Placeholder for extracted shader files if GLSL grows beyond inline component strings.
- Contains: `shaders/.gitkeep`
- Key files: Not detected beyond placeholder; current GLSL lives inline in `components/3d/NeutronStar.tsx`, `components/3d/Starfield.tsx`, and `components/3d/Constellation.tsx`.

**`docs/`:**
- Purpose: Human planning/reference documents and source resume PDF.
- Contains: `docs/MODULE_BREAKDOWN.md`, `docs/PERFECTED_PLAN.md`, `docs/OUTSOURCING_PLAN.md`, `docs/task_plan.md`, `docs/Praneesh_R_V_Resume.pdf`, and related planning docs.
- Key files: `docs/MODULE_BREAKDOWN.md` and `.planning/ROADMAP.md` describe planned modules; `docs/Praneesh_R_V_Resume.pdf` is the source copy for `public/resume.pdf`.

**`.planning/`:**
- Purpose: GSD project state, requirements, roadmap, research, and codebase maps.
- Contains: `.planning/PROJECT.md`, `.planning/REQUIREMENTS.md`, `.planning/ROADMAP.md`, `.planning/STATE.md`, `.planning/research/FEATURES.md`, `.planning/codebase/*.md`
- Key files: `.planning/ROADMAP.md` lists pending modules; `.planning/STATE.md` records current route/content status.

## Key File Locations

**Entry Points:**
- `app/layout.tsx`: Root layout for all routes; exports global metadata and viewport, configures Google fonts, mounts `CustomCursor` and `MainContent`.
- `app/page.tsx`: Home route `/`; renders hero, 3D scene boundary, and M3 section stack.
- `app/resume/page.tsx`: Resume route `/resume`; embeds and links `public/resume.pdf`.
- `app/not-found.tsx`: App Router 404 UI.
- `app/MainContent.tsx`: Client wrapper for boot loader, content opacity, and floating nav.

**Configuration:**
- `package.json`: npm scripts, dependencies, lint-staged config, and Husky prepare script.
- `next.config.ts`: Next.js strict mode, Turbopack root, image config, and experimental view transitions.
- `tsconfig.json`: strict TypeScript, JSON imports, bundler module resolution, and `@/*` path alias.
- `postcss.config.mjs`: Tailwind v4 PostCSS plugin.
- `biome.json`: formatter/linter/import organization settings.
- `AGENTS.md`: Local instruction to consult installed Next docs before Next-specific code changes.

**Core Logic:**
- `components/3d/SpaceCanvas.tsx`: Canvas composition and GPU-tier scaling.
- `components/3d/NeutronStar.tsx`: Core GLSL quasar object with accretion disk and jets.
- `components/3d/Constellation.tsx`: Interactive star/line field with pointer attraction.
- `components/3d/OrbitalPlanets.tsx`: Orbital section-navigation enhancement.
- `components/ui/FloatingNav.tsx`: DOM section navigation dock and active-section observer.
- `components/ui/BootLoader.tsx`: Boot sequence and completion callback.
- `stores/globalStore.ts`: Shared UI state for current and planned interactions.
- `types/index.ts`: Content and feature data contracts.
- `lib/utils.ts`: Shared `cn` and `formatDate` helpers.

**M3 Sections:**
- `components/sections/AboutSection.tsx`: Profile/identity section using `content/data/profile.json`.
- `components/sections/ProjectsSection.tsx`: Filterable project gallery using `content/data/projects.json`.
- `components/sections/SkillsSection.tsx`: Skills graph/grid using `content/data/skills.json`.
- `components/sections/ExperienceSection.tsx`: Timeline using `content/data/experience.json`.
- `components/sections/CTFSection.tsx`: CTF achievements and fake flag interaction using `content/data/ctf-achievements.json`.
- `components/sections/ContactSection.tsx`: Contact mailto form and social links using `content/data/profile.json`.

**Content:**
- `content/data/profile.json`: Profile, identity, operator profile, personal log, email, social links.
- `content/data/projects.json`: Project cards, categories, statuses, source URLs.
- `content/data/skills.json`: Skill names, categories, proficiency values, icon ids.
- `content/data/experience.json`: Timeline entries.
- `content/data/ctf-achievements.json`: Competition result table.
- `content/data/certifications.json`: Planned certifications/education section data; not rendered by current routes.

**Assets:**
- `public/resume.pdf`: Public resume asset.
- `public/textures/.gitkeep`: Planned texture directory; empty.
- `public/fonts/.gitkeep`: Planned self-hosted font directory; empty.
- `shaders/.gitkeep`: Planned extracted shader directory; empty.

**Testing:**
- Not detected: no `*.test.*`, `*.spec.*`, Playwright, Jest, or Vitest files exist in the current source tree.
- Current verification entry points are npm scripts in `package.json`: `npm run lint`, `npm run build`, and `npm run start`.
- Planning notes in `.planning/STATE.md` mention production browser smoke coverage, but the smoke script is not committed in the inspected source tree.

## Route Structure

**Current App Routes:**
- `/`: `app/page.tsx`
- `/resume`: `app/resume/page.tsx`
- 404 fallback: `app/not-found.tsx`

**Current Static Routes:**
- `/resume.pdf`: `public/resume.pdf`
- `/favicon.ico`: `app/favicon.ico`
- Default SVG assets: `public/file.svg`, `public/globe.svg`, `public/next.svg`, `public/vercel.svg`, `public/window.svg`

**Current Home Anchors:**
- `#home`: hero section in `app/page.tsx`
- `#about`: `components/sections/AboutSection.tsx`
- `#projects`: `components/sections/ProjectsSection.tsx`
- `#skills`: `components/sections/SkillsSection.tsx`
- `#experience`: `components/sections/ExperienceSection.tsx`
- `#ctf`: `components/sections/CTFSection.tsx`
- `#contact`: `components/sections/ContactSection.tsx`

**Planned Routes Not Present:**
- `app/api/contact/route.ts` for contact submission.
- `app/blog/page.tsx` for blog index.
- `app/blog/[slug]/page.tsx` for individual blog posts.
- `app/feed.xml/route.ts` for RSS.
- `app/uses/page.tsx` for the v2 tooling page.
- `app/sitemap.ts` and `app/robots.ts` for launch SEO.

## Naming Conventions

**Files:**
- React components use PascalCase file names: `components/ui/FloatingNav.tsx`, `components/sections/AboutSection.tsx`, `components/3d/NeutronStar.tsx`.
- Component CSS modules colocate with components and match the component name: `components/ui/FloatingNav.module.css`, `components/ui/BootLoader.module.css`.
- App Router route files use framework conventions: `app/page.tsx`, `app/layout.tsx`, `app/resume/page.tsx`, `app/not-found.tsx`.
- Hooks use `use*.ts`: `hooks/useMediaQuery.ts`, `hooks/useReducedMotion.ts`.
- Stores use camelCase plus `Store`: `stores/globalStore.ts`.
- Static data files use lowercase/kebab-case JSON names: `content/data/ctf-achievements.json`, `content/data/projects.json`.
- Shared index barrels are named `index.ts`: `components/3d/index.ts`, `types/index.ts`.

**Directories:**
- Top-level feature/support directories are lowercase plural nouns: `components/`, `content/`, `hooks/`, `stores/`, `types/`.
- Component domain directories are short and explicit: `components/3d/`, `components/ui/`, `components/sections/`, `components/fallbacks/`, `components/game/`.
- App Router URL segments are lowercase route folders: `app/resume/`; future segments should follow this pattern.

**Exports:**
- Prefer named exports for components and helpers: `export function SpaceCanvas`, `export function AboutSection`, `export function cn`.
- Use default exports only for App Router page/layout/not-found files and compatibility cases: `app/page.tsx`, `app/layout.tsx`, `app/resume/page.tsx`, `components/ui/FloatingNav.tsx`.
- Re-export 3D scene objects through `components/3d/index.ts` when they are intended for composition.

## Where to Add New Code

**New App Route:**
- Primary code: `app/<segment>/page.tsx`
- Nested route code: `app/<segment>/<child>/page.tsx`
- Route metadata: export `metadata` from the route page where needed.
- Next-specific guidance: read `node_modules/next/dist/docs/01-app/01-getting-started/03-layouts-and-pages.md` and related route docs before changing route behavior.

**New API Endpoint:**
- Primary code: `app/api/<name>/route.ts`
- Shared validation/helpers: `lib/<domain>.ts`
- Types: `types/index.ts` or a focused type file if the domain grows.
- Current planned contact endpoint: `app/api/contact/route.ts`

**New Home Section:**
- Implementation: `components/sections/<Name>Section.tsx`
- Data source: `content/data/<domain>.json`
- Type contract: `types/index.ts`
- Integration: import and render in `app/page.tsx`
- Navigation: add an item in `components/ui/FloatingNav.tsx` only when the section has a stable `id`.
- Current next section candidate: `components/sections/CertificationsSection.tsx` using `content/data/certifications.json`.

**New Client Interaction:**
- Implementation: colocate in the owning component or a new `components/ui/*.tsx` primitive.
- Boundary: add `"use client"` at the top of files that use state, effects, event handlers, browser APIs, Motion, or React Three Fiber.
- State: use local React state first; use `stores/globalStore.ts` for cross-route/shell state.

**New 3D Object:**
- Implementation: `components/3d/<ObjectName>.tsx`
- Export: add named export and prop type export to `components/3d/index.ts`
- Composition: mount inside `components/3d/SpaceCanvas.tsx`
- Large shared shaders: extract to `shaders/` only when inline GLSL becomes hard to maintain.
- Fallbacks: add non-WebGL fallback UI under `components/fallbacks/`.

**New Content File:**
- Static JSON: `content/data/<domain>.json`
- Blog MDX: `content/blog/<slug>.mdx` once the blog engine exists.
- Types: update `types/index.ts` or generated content types.
- Rendering: import JSON directly in server sections or parse MDX through a future `lib/blog.ts`.

**Terminal Feature:**
- UI: `components/ui/Terminal.tsx` for a compact overlay, or `components/terminal/` if multiple files are needed.
- Commands: `lib/terminal-commands.ts`
- State: `stores/globalStore.ts` already contains `terminalOpen` and `toggleTerminal`.
- Types: `types/index.ts` already contains `TerminalCommand`.

**Packet Runner Game:**
- UI: `components/game/PacketRunner.tsx`
- Engine/helpers: `components/game/gameEngine.ts` or focused helper files under `components/game/`.
- Global launch state: `stores/globalStore.ts` already contains `gameActive` and `setGameActive`.
- Persistence: localStorage access belongs in client-only files.

**Blog Engine:**
- Routes: `app/blog/page.tsx`, `app/blog/[slug]/page.tsx`
- Content: `content/blog/*.mdx`
- Helpers: `lib/blog.ts`
- RSS: `app/feed.xml/route.ts`
- Types: `types/index.ts` has `BlogPost`; expand or replace with generated types when the parser is introduced.

**Contact API:**
- Route handler: `app/api/contact/route.ts`
- Client form: continue in `components/sections/ContactSection.tsx` or split to `components/ui/ContactForm.tsx` if it gains validation/toast state.
- Validation: create `lib/contact.ts` or `lib/validation.ts`.
- Secrets: use server-only environment variables; never expose API keys to client components or public files.

**Utilities:**
- Shared helpers: `lib/utils.ts` for generic helpers.
- Domain helpers: split into explicit files such as `lib/blog.ts`, `lib/contact.ts`, `lib/terminal-commands.ts`, or `lib/gpu-detection.ts`.
- Hooks: add browser-only hooks under `hooks/use*.ts` with `"use client"`.

**Assets:**
- Public static files: `public/`
- Resume updates: replace `public/resume.pdf` and keep `app/resume/page.tsx` links unchanged.
- Textures: `public/textures/`
- Self-hosted fonts: `public/fonts/`
- OG/social images: `public/` or App Router metadata image conventions after reading local Next docs.

## Special Directories

**`.planning/`:**
- Purpose: GSD planning state and generated codebase documentation.
- Generated: Yes
- Committed: Yes
- Notes: Current write ownership for this mapping is limited to `.planning/codebase/ARCHITECTURE.md` and `.planning/codebase/STRUCTURE.md`.

**`node_modules/`:**
- Purpose: Installed npm dependencies and local Next.js docs under `node_modules/next/dist/docs/`.
- Generated: Yes
- Committed: No
- Notes: Read local Next docs before Next-specific changes because `AGENTS.md` warns this Next version differs from familiar APIs.

**`.next/`:**
- Purpose: Next.js build/dev output.
- Generated: Yes
- Committed: No
- Notes: Do not place source files here.

**`components/game/`:**
- Purpose: Planned Packet Runner feature area.
- Generated: No
- Committed: Yes
- Notes: Currently contains only `components/game/.gitkeep`.

**`content/blog/`:**
- Purpose: Planned local MDX blog content.
- Generated: No
- Committed: Yes
- Notes: Currently contains only `content/blog/.gitkeep`.

**`public/textures/`:**
- Purpose: Planned static texture assets for 3D scenes.
- Generated: No
- Committed: Yes
- Notes: Currently contains only `public/textures/.gitkeep`.

**`public/fonts/`:**
- Purpose: Planned self-hosted font assets if the app moves away from `next/font/google`.
- Generated: No
- Committed: Yes
- Notes: Currently contains only `public/fonts/.gitkeep`; active fonts are loaded in `app/layout.tsx`.

**`shaders/`:**
- Purpose: Planned extracted GLSL shader storage.
- Generated: No
- Committed: Yes
- Notes: Currently contains only `shaders/.gitkeep`; active shader strings are inline in `components/3d/*.tsx`.

**`docs/`:**
- Purpose: Product planning, module breakdowns, research notes, and source resume PDF.
- Generated: No
- Committed: Yes
- Notes: Treat `docs/Praneesh_R_V_Resume.pdf` as source/reference; public serving uses `public/resume.pdf`.

**`.env.example`:**
- Purpose: Environment configuration example file.
- Generated: No
- Committed: Yes
- Notes: Existence only noted; contents were not read for this mapping.

---

*Structure analysis: 2026-04-27*
