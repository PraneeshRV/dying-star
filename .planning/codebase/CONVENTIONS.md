# Coding Conventions

**Analysis Date:** 2026-04-27

## Naming Patterns

**Files:**
- Use route convention files under `app/`: `app/layout.tsx`, `app/page.tsx`, `app/not-found.tsx`, and `app/resume/page.tsx`.
- Use PascalCase component files for React components: `components/ui/Button.tsx`, `components/sections/ProjectsSection.tsx`, `components/3d/SpaceCanvas.tsx`.
- Pair reusable component styles with same-name CSS modules: `components/ui/Button.tsx` imports `components/ui/Button.module.css`; `components/ui/ProjectCard.tsx` imports `components/ui/ProjectCard.module.css`.
- Use camelCase hook files: `hooks/useMediaQuery.ts`, `hooks/useReducedMotion.ts`.
- Use lowercase utility and store files: `lib/utils.ts`, `stores/globalStore.ts`.
- Store typed static content as kebab-case or descriptive JSON files under `content/data/`: `content/data/projects.json`, `content/data/ctf-achievements.json`, `content/data/profile.json`.

**Functions:**
- Export React components as named PascalCase functions: `Button` in `components/ui/Button.tsx`, `ProjectsSection` in `components/sections/ProjectsSection.tsx`, `SpaceCanvas` in `components/3d/SpaceCanvas.tsx`.
- Export hooks as camelCase `use*` functions with explicit return types when useful: `useMediaQuery` in `hooks/useMediaQuery.ts`, `useReducedMotion` in `hooks/useReducedMotion.ts`.
- Use small helper functions near their consumers: `proficiencyLabel` in `components/sections/SkillsSection.tsx`.
- Use named utility functions from `lib/utils.ts`: `cn` for class composition and `formatDate` for display formatting.

**Variables:**
- Use `UPPER_SNAKE_CASE` for module constants and maps: `FILTERS`, `CATEGORY_LABEL`, `STATUS_CLASS`, `NAV_ITEMS`, `TARGET_FLAGS`.
- Use camelCase for local state and callbacks: `activeFilter`, `filteredProjects`, `handlePointerMove`, `setLoadingComplete`.
- Prefix refs with the thing they hold: `cardRef`, `rafRef`, `lastScrollY` in `components/ui/ProjectCard.tsx` and `components/ui/FloatingNav.tsx`.

**Types:**
- Use PascalCase for interfaces and exported type aliases: `Project`, `Skill`, `TimelineEntry`, `CTFAchievement` in `types/index.ts`.
- Keep component prop types next to the component: `ProjectCardProps` in `components/ui/ProjectCard.tsx`, `TypewriterTextProps` in `components/ui/TypewriterText.tsx`.
- Use union types for content enums and UI variants: `Project["status"]`, `Project["category"]`, `ButtonVariant`.
- Prefer `Record<Union, Value>` maps for enum display metadata: `CATEGORY_META` in `components/sections/SkillsSection.tsx`, `STATUS_LABEL` in `components/ui/ProjectCard.tsx`.

## Code Style

**Formatting:**
- Use Biome as the formatter: `package.json` defines `npm run format` as `biome format --write`.
- Biome settings live in `biome.json`: 2-space indentation, spaces, recommended lint rules, VCS ignore awareness, and source import organization.
- Use double quotes and semicolons in TypeScript, TSX, CSS imports, and config files, matching `app/MainContent.tsx`, `components/ui/Button.tsx`, and `next.config.ts`.
- Keep JSX props wrapped and trailing commas where Biome emits them, as in `components/ui/ProjectCard.tsx`.

**Linting:**
- Use Biome as the linter: `package.json` defines `npm run lint` as `biome check`.
- `biome.json` enables recommended rules plus the `next` and `react` domains.
- `biome.json` disables selected rules to match the UI-heavy codebase: `suspicious.noUnknownAtRules` for Tailwind CSS v4 at-rules, `suspicious.noArrayIndexKey`, `complexity.noImportantStyles`, and `a11y.noStaticElementInteractions`.
- `package.json` runs `biome check --write --no-errors-on-unmatched` through `lint-staged` for `*.ts`, `*.tsx`, `*.js`, `*.jsx`, `*.json`, and `*.css`.

## Next 16 Local-Docs Rule

**Required rule:**
- `AGENTS.md` states that this is not legacy Next.js and requires reading relevant guides in `node_modules/next/dist/docs/` before writing Next.js code.
- `CLAUDE.md` delegates to `AGENTS.md`, so the same rule applies when agent instructions are loaded through Claude-style files.
- For App Router Server/Client Component work, read `node_modules/next/dist/docs/01-app/01-getting-started/05-server-and-client-components.md` and `node_modules/next/dist/docs/01-app/03-api-reference/01-directives/use-client.md`.
- For styling changes, read `node_modules/next/dist/docs/01-app/01-getting-started/11-css.md` and, when Turbopack behavior matters, `node_modules/next/dist/docs/01-app/03-api-reference/08-turbopack.md`.
- For testing additions, read `node_modules/next/dist/docs/01-app/02-guides/testing/index.md`, `node_modules/next/dist/docs/01-app/02-guides/testing/vitest.md`, and `node_modules/next/dist/docs/01-app/02-guides/testing/playwright.md`.

## Import Organization

**Order:**
1. Framework, React, package, and Node imports: `import type { Metadata } from "next";`, `import { useEffect } from "react";`, `import { dirname } from "node:path";`.
2. Internal alias imports through `@/*`: `@/components/ui/Button`, `@/content/data/projects.json`, `@/types`, `@/lib/utils`.
3. Relative component or style imports: `./MainContent`, `./Button.module.css`, `./index`.

**Path Aliases:**
- Use `@/*` for project-root imports, configured in `tsconfig.json`.
- Prefer alias imports for cross-directory dependencies: `components/sections/ProjectsSection.tsx` imports `@/components/ui/Button`, `@/content/data/projects.json`, and `@/types`.
- Use relative imports for colocated CSS modules and barrel-local 3D composition: `components/3d/SpaceCanvas.tsx` imports scene components from `./index`.

**Type imports:**
- Use `import type` for pure types: `types` imports in `components/ui/Button.tsx`, `components/ui/ProjectCard.tsx`, `components/sections/ProjectsSection.tsx`, and `app/layout.tsx`.
- Mixed imports use Biome-supported inline type syntax: `import { type ClassValue, clsx } from "clsx";` in `lib/utils.ts`.

## React Server/Client Component Patterns

**Server Components:**
- App Router pages and layouts are Server Components unless marked otherwise: `app/layout.tsx`, `app/page.tsx`, `app/resume/page.tsx`, and `app/not-found.tsx`.
- Keep metadata exports in Server Component files: `metadata` and `viewport` in `app/layout.tsx`, `metadata` in `app/resume/page.tsx`, `metadata` in `app/not-found.tsx`.
- Compose Client Components from Server Components for interactivity: `app/page.tsx` renders `WebGLErrorBoundary`, `SpaceCanvas`, and interactive sections without marking the route itself as client.

**Client Components:**
- Put `"use client";` as the first statement in files that use state, effects, browser APIs, custom client hooks, animation libraries, Zustand, or React Three Fiber.
- Current client boundaries include `app/MainContent.tsx`, `components/ui/FloatingNav.tsx`, `components/ui/BootLoader.tsx`, `components/ui/ProjectCard.tsx`, `components/3d/SpaceCanvas.tsx`, `components/3d/WebGLErrorBoundary.tsx`, and `hooks/useReducedMotion.ts`.
- Keep client boundaries as specific as possible. Do not mark route files client when an inner component can own the browser behavior.
- Pass serializable props from Server Components into Client Components, following the local `use-client` docs. Current examples use strings, arrays, booleans, and renderable React nodes such as the `fallback` prop in `WebGLErrorBoundary`.

## Tailwind and CSS Module Usage

**Tailwind CSS v4:**
- Tailwind is configured CSS-first through `app/globals.css` with `@import "tailwindcss";` and `@theme inline`.
- PostCSS integration is configured in `postcss.config.mjs` with `@tailwindcss/postcss`.
- No `tailwind.config.*` file is detected. Put design tokens in `app/globals.css` unless a future feature needs a Tailwind config file.
- Use Tailwind utilities for page layout, responsive grids, spacing, typography, and one-off visual styling in route and section components: `app/page.tsx`, `app/resume/page.tsx`, `components/sections/AboutSection.tsx`, `components/sections/SkillsSection.tsx`.

**CSS Modules:**
- Use CSS modules for reusable UI components with stateful or pseudo-element-heavy styling: `components/ui/Button.module.css`, `components/ui/ProjectCard.module.css`, `components/ui/FloatingNav.module.css`, `components/ui/BootLoader.module.css`.
- Import module styles as `styles` and compose with `cn`: `components/ui/Button.tsx`, `components/ui/ProjectCard.tsx`, `components/ui/GlitchText.tsx`.
- Keep CSS custom properties for dynamic pointer and animation state inside modules: `components/ui/ProjectCard.tsx` sets `--rx`, `--ry`, `--mx`, and `--my` consumed by `components/ui/ProjectCard.module.css`.

**Global CSS:**
- Keep design-system tokens, base element styles, shared glass/glow utilities, keyframes, and reduced-motion policy in `app/globals.css`.
- Keep app-wide focus styling in `app/globals.css` through `:focus-visible`.
- Keep Tailwind theme color names aligned with token usage in TSX, such as `text-green`, `bg-void`, `text-purple-hot`, and `max-w-[var(--content-max-width)]`.

## Error Handling

**Patterns:**
- Wrap WebGL UI in an error boundary: `app/page.tsx` renders `WebGLErrorBoundary` around `SpaceCanvas` and supplies `StarFallback`.
- Use `getDerivedStateFromError` plus `componentDidCatch` for render failures in `components/3d/WebGLErrorBoundary.tsx`.
- Provide non-WebGL fallback visuals for canvas failures through `components/fallbacks/StarFallback.tsx`.
- Guard browser-only APIs inside effects or client components: `typeof window === "undefined"` checks in `components/ui/FloatingNav.tsx`; `window.matchMedia` access inside `useEffect` in `hooks/useMediaQuery.ts` and `hooks/useReducedMotion.ts`.
- Use mounted guards when SSR and hydration state need to align: `app/MainContent.tsx` returns a minimal `bg-void` shell until mounted.

## Logging

**Framework:** `console`

**Patterns:**
- Central logging infrastructure is not detected.
- Use `console.error` only for real failure paths. Current usage is limited to `components/3d/WebGLErrorBoundary.tsx` for WebGL/render errors.
- Avoid logging content data, environment variables, or user-facing profile fields from `content/data/*.json`.

## Comments

**When to Comment:**
- Use comments for non-obvious rendering, 3D, animation, or accessibility decisions.
- Existing examples include performance notes in `components/3d/NeutronStar.tsx`, scroll behavior notes in `components/ui/FloatingNav.tsx`, and design-system section banners in `app/globals.css`.
- Keep comments short when explaining ordinary prop passing or JSX structure. Many route comments in `app/page.tsx` are simple visual section labels.

**JSDoc/TSDoc:**
- Use TSDoc for reusable APIs and props: `Button` in `components/ui/Button.tsx`, `TypewriterTextProps` in `components/ui/TypewriterText.tsx`, `useMediaQuery` in `hooks/useMediaQuery.ts`.
- Use interface comments for store fields when the state contract is shared: `stores/globalStore.ts`.

## Function Design

**Size:** 
- Keep small UI primitives focused: `components/ui/Button.tsx`, `components/ui/GlitchText.tsx`, and `hooks/useReducedMotion.ts`.
- Larger visual components are acceptable when they encapsulate a complete scene or section: `components/3d/NeutronStar.tsx`, `components/sections/SkillsSection.tsx`, and `components/ui/FloatingNav.tsx`.

**Parameters:**
- Use typed object props for components.
- Use discriminated prop unions for components with multiple render modes: `ButtonComponentProps` in `components/ui/Button.tsx` renders either an anchor or button.
- Use optional props for enhancement hooks and display options: `onComplete`, `hideCursor`, and `speed` in `components/ui/TypewriterText.tsx`.

**Return Values:**
- React components return JSX directly, with early returns for unavailable state: `app/MainContent.tsx`, `components/ui/FloatingNav.tsx`, `components/3d/WebGLErrorBoundary.tsx`.
- Hooks return primitive values where possible: `useMediaQuery` and `useReducedMotion` return booleans.

## Module Design

**Exports:**
- Prefer named exports for components and hooks.
- Use barrel exports selectively for cohesive groups: `components/3d/index.ts` exports the 3D scene components and prop types.
- A default export exists for `FloatingNav` in `components/ui/FloatingNav.tsx`; new components should prefer named exports unless a framework convention requires default exports.

**Barrel Files:**
- `components/3d/index.ts` is the only detected barrel file. Keep it scoped to 3D scene composition.
- Avoid broad app-wide barrels unless they reduce real duplication without hiding ownership.

## Data and Content Conventions

**Static content:**
- Store portfolio content in JSON under `content/data/`: `profile.json`, `projects.json`, `skills.json`, `experience.json`, `ctf-achievements.json`, `certifications.json`.
- Import JSON directly in components and cast to TypeScript shapes from `types/index.ts`: `const PROJECTS = projectsData as Project[];`, `const SKILLS = skillsData as Skill[];`.
- Keep content IDs stable for React keys and filters: `project.id` in `components/sections/ProjectsSection.tsx`, `TimelineEntry.id` in `types/index.ts`.
- Keep content enum values aligned with `types/index.ts`: `Project["category"]`, `Project["status"]`, `Skill["category"]`, `Skill["proficiency"]`.

**Validation:**
- Runtime schema validation is not detected for `content/data/*.json`, despite `zod` being present in `package.json`.
- Treat `types/index.ts` as the current source of truth for manual content validation.
- Add runtime validation before accepting external, CMS, user-authored, or API-loaded content.

## Accessibility and Motion Conventions

**Accessibility:**
- Use semantic sections with `aria-labelledby`: `components/sections/ProjectsSection.tsx`, `components/sections/SkillsSection.tsx`, `components/sections/CTFSection.tsx`.
- Use accessible names for icon buttons and links: `aria-label` in `components/ui/FloatingNav.tsx`, `components/ui/ProjectCard.tsx`, and `components/sections/ProjectsSection.tsx`.
- Hide decorative icons with `aria-hidden="true"` when text or labels carry the meaning.
- Preserve visible focus through global `:focus-visible` in `app/globals.css`.

**Motion:**
- Respect reduced motion globally in `app/globals.css`.
- Check reduced motion before custom animation behavior: `components/ui/FloatingNav.tsx` uses `motion/react`'s `useReducedMotion`; `components/ui/TypewriterText.tsx` renders immediately when reduced motion is requested.
- Keep WebGL allocations out of frame loops. `components/3d/NeutronStar.tsx` documents using `useMemo` for allocations and mutating uniforms through refs inside `useFrame`.

---

*Convention analysis: 2026-04-27*
