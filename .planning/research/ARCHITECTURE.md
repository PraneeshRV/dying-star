# Architecture Research: Dying Star Portfolio Launch

**Project:** dying-star cybersecurity portfolio
**Domain:** Immersive cybersecurity portfolio built on Next.js App Router
**Researched:** 2026-04-28
**Overall confidence:** HIGH

## Executive Summary

The launch architecture should preserve the current shape: App Router route files stay server-rendered by default, while browser-only behavior lives in narrow client islands. The current implementation already follows this pattern in `app/layout.tsx`, `app/page.tsx`, `app/resume/page.tsx`, `app/MainContent.tsx`, `components/3d/*`, `components/ui/*`, and the interactive sections. Finishing launch should extend this pattern rather than replacing it with a larger app shell or client-heavy route tree.

The strongest target boundary is a static content and server route layer backed by local JSON/MDX, plus client overlays for high-interaction features. `content/data/*.json` should continue feeding the home sections. The contact form should become the first real server integration through `app/api/contact/route.ts`. Blog content should live under `content/blog/*.mdx` and be indexed through server-only helpers in `lib/blog.ts`. Terminal and Packet Runner should not become App Router pages for v1; they should be global progressive-enhancement overlays mounted from `app/MainContent.tsx` and controlled by the existing Zustand store.

The most important launch architecture issue is route-aware chrome. `app/MainContent.tsx` currently mounts `FloatingNav` for every route, while `FloatingNav` defaults to home section ids. That is acceptable on the current small site because missing sections are ignored, but it will become wrong when `/blog`, `/blog/[slug]`, and other non-home pages exist. Fix this before adding blog routes: show the section dock only on `/`, or pass route-specific nav items.

## Target Route Boundaries

| URL | File | Type | Status | Responsibility |
|-----|------|------|--------|----------------|
| `/` | `app/page.tsx` | Server Component page | Existing | Home hero, 3D client island, and section stack. Add certifications here if it becomes a first-class section. |
| `/resume` | `app/resume/page.tsx` | Server Component page | Existing | Static resume viewer and direct `/resume.pdf` link. |
| App 404 | `app/not-found.tsx` | Server Component special route | Existing | Terminal-styled recovery page. |
| `/resume.pdf` | `public/resume.pdf` | Static asset | Existing | Public PDF delivery. |
| `/api/contact` | `app/api/contact/route.ts` | Route Handler | Planned Phase 2 | Validate contact submissions, rate-limit, call Resend, and return sanitized JSON. |
| `/blog` | `app/blog/page.tsx` | Server Component page | Planned Phase 6 | Blog index from local MDX metadata, category/tag filtering, and SEO metadata. |
| `/blog/[slug]` | `app/blog/[slug]/page.tsx` | Server Component page | Planned Phase 6 | MDX post render, `generateStaticParams`, `generateMetadata`, and not-found behavior for unknown slugs. |
| `/feed.xml` | `app/feed.xml/route.ts` | Route Handler | Planned Phase 6 | RSS XML from `lib/blog.ts`. |
| `/sitemap.xml` | `app/sitemap.ts` | Metadata Route Handler | Planned Phase 7 | Programmatic sitemap including home, resume, blog index, and posts. |
| `/robots.txt` | `app/robots.ts` | Metadata Route Handler | Planned Phase 7 | Crawl rules and sitemap pointer. |
| `/uses` | `app/uses/page.tsx` | Server Component page | Defer | v2 tooling page, not needed for launch unless roadmap scope changes. |

Route Handler rule for implementation: do not place a `route.ts` at the same segment level as a `page.tsx`. `app/api/contact/route.ts` and `app/feed.xml/route.ts` are valid because they do not conflict with current pages.

## Component Boundaries

### Existing Boundaries to Preserve

| Boundary | Current Files | Target Role |
|----------|---------------|-------------|
| Root document and metadata | `app/layout.tsx` | Keep as the server root layout. It owns fonts, global metadata, `viewport`, `app/globals.css`, `CustomCursor`, and `MainContent`. |
| Global client chrome | `app/MainContent.tsx` | Keep as the only global client wrapper. It owns boot reveal, route-level overlays, and route-aware nav mounting. |
| Home composition | `app/page.tsx` | Keep as a Server Component. It imports client islands but should not get `"use client"`. |
| Home content sections | `components/sections/*.tsx` | Keep mostly server-rendered. Split only interactive controls into client children. |
| 3D hero | `components/3d/*`, `components/fallbacks/StarFallback.tsx` | Keep fully client-side and progressive. The page should only compose the boundary. |
| Shared UI primitives | `components/ui/*` | Keep reusable client widgets and CSS modules here. Do not put feature engines here. |
| Static content | `content/data/*.json` | Keep as versioned portfolio data. Add runtime validation only where data becomes external or user-submitted. |
| Global UI state | `stores/globalStore.ts` | Keep for cross-cutting UI flags: boot, GPU, terminal, and game. Use local state for isolated widgets. |

### New Boundaries for Launch

| Boundary | Planned Files | Responsibility | Notes |
|----------|---------------|----------------|-------|
| Certifications section | `components/sections/CertificationsSection.tsx` | Render `content/data/certifications.json` in the home flow. | Server Component unless it adds filters or animated counters. |
| Contact form island | `components/sections/ContactForm.tsx` | Client form state, validation display, submit/fallback UI. | Import from `ContactSection.tsx` so the section shell can stay server-rendered. |
| Contact server domain | `app/api/contact/route.ts`, `lib/contact/schema.ts`, `lib/contact/rate-limit.ts`, `lib/contact/email.ts` | Validate, rate-limit, send email, and normalize responses. | This is the only v1 server-side mutation path. |
| Blog content domain | `content/blog/*.mdx`, `lib/blog.ts`, `mdx-components.tsx`, `components/blog/*` | Local technical writing, metadata indexing, MDX components, and presentation. | Keep `lib/blog.ts` server-only in practice; never import it into client components. |
| Terminal overlay | `components/terminal/TerminalOverlay.tsx`, `components/terminal/TerminalTrigger.tsx`, `hooks/useTerminalHotkeys.ts`, `lib/terminal-commands.ts` | Global terminal UI and command interpretation. | Mount from `MainContent`, not from individual pages. |
| Packet Runner | `components/game/PacketRunner.tsx`, `components/game/usePacketRunner.ts`, `components/game/game-types.ts` | Client-only canvas game, controls, scoring, pause/resume. | Lazy-load only when `gameActive` is true. |
| Launch metadata | `app/sitemap.ts`, `app/robots.ts`, optional `app/opengraph-image.tsx` | Search and social metadata surfaces. | Build after blog so posts are included. |

## Server and Client Component Strategy

Use Server Components for route files, metadata, static content composition, MDX indexing, and anything that may touch secrets. Use Client Components only when a file owns React state, effects, browser APIs, event handlers, animation libraries, Zustand usage, React Three Fiber, localStorage, or form submission UX.

Server Component targets:

- `app/layout.tsx`: keep root metadata, fonts, global CSS, and body structure here.
- `app/page.tsx`: keep home page composition here; add `CertificationsSection` here when Phase 1 lands.
- `app/resume/page.tsx`: keep static PDF viewer route here.
- `app/blog/page.tsx`: server-render the post list from `lib/blog.ts`.
- `app/blog/[slug]/page.tsx`: server-render imported MDX content and use `generateMetadata`.
- `components/sections/AboutSection.tsx`, `SkillsSection.tsx`, `ExperienceSection.tsx`, `ContactSection.tsx`, and planned `CertificationsSection.tsx`: keep server-rendered unless they directly own interactivity.

Client Component targets:

- `app/MainContent.tsx`: global boot/chrome/overlay client shell.
- `components/ui/FloatingNav.tsx`: scroll observer and section scrolling.
- `components/ui/BootLoader.tsx`, `CustomCursor.tsx`, `ProjectCard.tsx`, `TypewriterText.tsx`: browser effects and animation.
- `components/3d/*.tsx` and `components/fallbacks/StarFallback.tsx`: WebGL, frame loops, and fallback visuals.
- `components/sections/ProjectsSection.tsx`: filter state.
- `components/sections/CTFSection.tsx`: challenge state.
- `components/sections/ContactForm.tsx`: form state and fetch to `/api/contact`.
- `components/terminal/*`: terminal UI, keyboard handling, command history.
- `components/game/*`: canvas loop, controls, localStorage high score.

Implementation rule: a `"use client"` directive pulls that file and its imports into the client bundle. Do not mark `app/page.tsx`, blog route files, or `ContactSection.tsx` as client when a smaller child component can own the interactive behavior. Keep metadata exports in Server Component files only.

## Data Flow

### Home Route Flow

1. `app/layout.tsx` renders the root shell, fonts, metadata, `CustomCursor`, and `MainContent`.
2. `app/MainContent.tsx` waits for mount, runs `BootLoader`, fades in route children, and mounts route-aware overlays.
3. `app/page.tsx` renders the hero and wraps `SpaceCanvas` in `WebGLErrorBoundary` with `StarFallback`.
4. Section components import static JSON from `content/data/*.json` and type against `types/index.ts`.
5. Client islands hydrate only for canvas, filters, CTF interaction, floating nav, cursor, boot loader, and project-card tilt.

Target additions:

- Insert `CertificationsSection` after `ExperienceSection` or before `CTFSection` depending on narrative priority.
- Add a nav item for certifications only if it has a stable `id="certifications"` and the route-aware nav fix is already in place.
- Keep `OrbitalPlanets` as enhancement only. The accessible primary navigation remains DOM links in `FloatingNav`.

### Contact Flow

1. `ContactSection.tsx` remains the server-rendered layout and imports static identity/social data from `content/data/profile.json`.
2. `ContactSection.tsx` renders `ContactForm.tsx` as a client child with serializable props: recipient label, fallback mailto URL, and optional copy strings.
3. `ContactForm.tsx` uses `react-hook-form` plus `zod` validation. If resolver integration is desired, add `@hookform/resolvers`; otherwise call the shared schema directly before submit.
4. On submit, `ContactForm.tsx` sends JSON to `POST /api/contact`.
5. `app/api/contact/route.ts` parses the request, validates through `lib/contact/schema.ts`, checks abuse controls through `lib/contact/rate-limit.ts`, and sends through `lib/contact/email.ts`.
6. `lib/contact/email.ts` is the only module that reads server-only env such as `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, and `CONTACT_FROM_EMAIL`.
7. The route returns a narrow JSON envelope such as `{ ok: true }` or `{ ok: false, error: "validation" | "rate_limited" | "send_failed" }`.
8. `ContactForm.tsx` shows success/error UI and preserves the direct `mailto:` path as a fallback.

Security boundary:

- Never expose `RESEND_API_KEY` or recipient secrets through `NEXT_PUBLIC_*`, JSON content, terminal commands, client props, or error messages.
- Validate name/email/message lengths server-side even if client validation passed.
- Add a honeypot or timestamp field in the client form, but treat it as advisory. The server route remains authoritative.
- In-memory rate limiting is acceptable only as a v1 best-effort guard. Keep it behind `lib/contact/rate-limit.ts` so a durable KV-backed limiter can replace it later without changing the API route.

### Blog and MDX Flow

Recommended v1 approach: use local MDX under `content/blog/*.mdx` with `@next/mdx`, a required root `mdx-components.tsx`, and server-only indexing in `lib/blog.ts`.

Planned files:

- `content/blog/<slug>.mdx`: post content.
- `mdx-components.tsx`: required global MDX component mapping for App Router MDX.
- `components/mdx/Callout.tsx`, `components/mdx/CodeBlock.tsx`: custom MDX render components if needed.
- `components/blog/BlogCard.tsx`, `components/blog/PostShell.tsx`, `components/blog/TagList.tsx`: blog presentation.
- `lib/blog.ts`: post discovery, metadata normalization, sorting, slug lookup, RSS data.
- `app/blog/page.tsx`: index page.
- `app/blog/[slug]/page.tsx`: post page.
- `app/feed.xml/route.ts`: RSS feed.

Metadata recommendation:

- Prefer MDX module exports for v1 post metadata, for example `export const metadata = { title, date, excerpt, category, tags, readTime }`.
- Do not rely on YAML frontmatter unless the phase deliberately adds `gray-matter` or remark frontmatter support. The installed Next docs state `@next/mdx` does not support frontmatter by default.
- Validate normalized metadata in `lib/blog.ts` with a small `zod` schema before rendering the index or feed.

Route behavior:

- `app/blog/page.tsx` should be a Server Component that calls `getAllPosts()` and renders static links.
- Category/tag filtering can be server-driven through `searchParams` first. Add a small client filter only if the UX needs instant filtering without navigation.
- `app/blog/[slug]/page.tsx` should use `generateStaticParams()` and `export const dynamicParams = false` so unknown slugs 404 instead of creating runtime surprises.
- In Next 16 docs examples, dynamic route `params` are promises. Type page props accordingly, for example `params: Promise<{ slug: string }>`.
- Use `generateMetadata()` for post-level title, description, Open Graph, and canonical data. Keep this in the server route file.
- `app/feed.xml/route.ts` should read from `lib/blog.ts` and return XML with `Content-Type: application/rss+xml; charset=utf-8`.

Build implications:

- Add MDX config in `next.config.ts` only during Phase 6, after reading the local Next MDX docs again.
- If remark/rehype plugins are used with Turbopack, keep plugin configuration serializable as documented by the installed Next docs.
- Build blog before final sitemap/robots so Phase 7 can include all posts in `app/sitemap.ts`.

### Terminal Flow

Terminal should be global UI, not route content.

1. `stores/globalStore.ts` expands from `toggleTerminal` to explicit `openTerminal`, `closeTerminal`, and `toggleTerminal` actions. Explicit actions prevent accidental state flips from hotkeys and command effects.
2. `app/MainContent.tsx` mounts `TerminalTrigger` and lazy-loads `TerminalOverlay` after `loadingComplete`.
3. `hooks/useTerminalHotkeys.ts` handles `Ctrl+\`` and any safe open shortcuts. It must ignore shortcuts while typing in inputs, textareas, contenteditable elements, or the terminal input itself.
4. `components/terminal/TerminalOverlay.tsx` owns focus trap, Escape/exit close behavior, command history, and visible accessible controls.
5. `lib/terminal-commands.ts` maps commands to pure outputs and declared effects. Example effects: `openGame`, `closeTerminal`, `clear`, `matrix`.
6. `TerminalOverlay` executes effects through the Zustand store. The command library should not directly import Zustand or DOM APIs.

Terminal content sources:

- `whoami`, `ls projects/`, `ls skills/`, and `ctf --stats` can read public static data from `content/data/*.json`.
- `flag` must return fake challenge material only. Do not store real secrets in command handlers, JSON, comments, or client bundles.
- `play` should set `gameActive=true` through a declared effect. It should not import the game component.

Placement:

- Use `components/terminal/` rather than `components/ui/` because the terminal is a feature, not a primitive.
- Keep terminal styles in `components/terminal/TerminalOverlay.module.css` if styling becomes stateful or pseudo-element-heavy.
- Add terminal entry points to `app/MainContent.tsx`, not `app/page.tsx`, so it works on `/blog` and `/resume` too.

### Packet Runner Flow

Packet Runner is a client-only overlay for v1.

1. `components/game/PacketRunner.tsx` is lazy-loaded when `gameActive` is true.
2. `components/game/usePacketRunner.ts` owns the animation loop, input state, collision checks, score, pause/resume, and cleanup.
3. `components/game/game-types.ts` owns small shared game types.
4. `stores/globalStore.ts` keeps only global launch/close state: `gameActive`, `setGameActive`.
5. Local game state stays inside the game hook. Do not put per-frame entities or score ticks into Zustand.
6. High score persists through localStorage only, inside client code.
7. Triggers are terminal `play`, a visible UI launcher, and Konami code. All triggers should call the same store action.

Do not add a database, Supabase leaderboard, or `/game` route for v1. A global leaderboard changes the architecture from static portfolio plus one contact endpoint into a data-backed app and should be a separate milestone with schema, abuse controls, and RLS.

## Route-Aware Chrome Recommendation

Current issue: `MainContent` mounts `<FloatingNav />` globally after boot. `FloatingNav` defaults to home ids: `home`, `about`, `projects`, `skills`, `experience`, `ctf`, and `contact`. On `/resume` and future `/blog` routes, those ids are absent.

Recommended fix before adding blog:

- In `app/MainContent.tsx`, use the current pathname and mount the home dock only on `/`.
- Keep terminal trigger and game overlay global.
- If non-home pages need navigation, add a separate lightweight top/back nav in their route content instead of reusing the section dock.
- When certifications is added, update `FloatingNav` in the same phase only if the new section id is stable.

This keeps the portfolio's home-scroll navigation from leaking into document-style pages.

## Error Handling and Fallbacks

| Area | Target Behavior | Files |
|------|-----------------|-------|
| WebGL render error | Render static star fallback and log only the error path. | `components/3d/WebGLErrorBoundary.tsx`, `components/fallbacks/StarFallback.tsx` |
| GPU detection failure | Treat as low capability and avoid expensive effects. | `components/3d/SpaceCanvas.tsx`, optional `hooks/useGPUTier.ts` |
| Reduced motion | Disable or simplify boot, scroll, terminal, game, and 3D motion. | `app/globals.css`, `hooks/useReducedMotion.ts`, feature components |
| Contact validation | Return 400 with field-safe error details; no stack traces. | `app/api/contact/route.ts`, `lib/contact/schema.ts` |
| Contact abuse | Return 429 with generic copy. | `lib/contact/rate-limit.ts` |
| Contact send failure | Return sanitized 500 and keep mailto fallback visible. | `lib/contact/email.ts`, `ContactForm.tsx` |
| Blog unknown slug | Use `notFound()` and `dynamicParams=false`. | `app/blog/[slug]/page.tsx` |
| Terminal command error | Print terminal-styled error, keep overlay responsive. | `components/terminal/TerminalOverlay.tsx` |
| Game loop crash | Close game overlay or show static error panel without blocking the page. | `components/game/PacketRunner.tsx` |

## Verification Flow

Minimum gate for each launch phase:

1. `npm run lint`
2. `npx tsc --noEmit`
3. `npm run build`
4. Production smoke against `npm run start`, not only `next dev`, because the project notes a current dev reliability issue.

Feature-specific verification:

| Feature | Verification |
|---------|--------------|
| Certifications/content shell | Desktop and mobile visual check for section order, nav anchor behavior, no overlap, and content shape alignment with `types/index.ts`. |
| Contact API | POST invalid payload returns 400, valid payload with missing/disabled Resend config fails safely, valid configured payload returns success, rate limit path returns 429, no secrets appear in client bundle or responses. |
| 3D fallback | Browser smoke confirms nonblank canvas on desktop, acceptable fallback on mobile/low tier/no WebGL, and reduced-motion behavior. |
| Terminal | Open through visible trigger and keyboard, run each command, verify command history, exit/Escape, focus restore, and fake-only challenge output. |
| Packet Runner | Launch through terminal/UI/Konami, movement, collision, scoring, pause/resume, localStorage high score, mobile controls, and cleanup on close. |
| Blog | `/blog`, at least two `/blog/[slug]` posts, unknown slug 404, RSS XML validity, syntax-highlighted code, post metadata, and no client import of `fs` or server-only helpers. |
| Launch SEO | Inspect generated metadata, `/sitemap.xml`, `/robots.txt`, OG image route/assets, canonical URLs, and analytics script boundaries. |

Recommended committed smoke locations:

- `scripts/smoke-home.mjs` for `/`, route shell, canvas/fallback, core sections, and console errors.
- `scripts/smoke-routes.mjs` for `/resume`, `/blog`, sample post, `/feed.xml`, `/sitemap.xml`, and `/robots.txt`.
- `scripts/smoke-contact.mjs` for route handler response contracts without logging secrets.

Do not block the launch roadmap on a full test framework migration. Add focused scripts or Playwright only where browser verification catches real risks.

## Build Order Implications

Recommended order matches the current roadmap with two architecture-sensitive adjustments:

1. **Finish Content Shell**
   - Add `CertificationsSection`.
   - Improve project content.
   - Fix route-aware `FloatingNav` behavior before new non-home routes arrive.

2. **Contact API**
   - Introduce the first server mutation path.
   - Split `ContactForm.tsx` as a client island.
   - Add `app/api/contact/route.ts` plus `lib/contact/*` helpers.
   - Establish env and sanitized response conventions before analytics or deployment work.

3. **3D Fallbacks and Validation**
   - Centralize GPU/reduced-motion/no-WebGL policy.
   - Verify canvas and fallback behavior before adding more overlays.

4. **Motion and Terminal**
   - Add scroll/entrance animation carefully.
   - Add terminal as a global overlay after route-aware chrome is fixed.
   - Keep commands pure and fake-only.

5. **Packet Runner**
   - Build after terminal because one launch path is the `play` command.
   - Keep it lazy, client-only, and localStorage-only.

6. **Blog Engine**
   - Add MDX config, `mdx-components.tsx`, `content/blog/*.mdx`, `lib/blog.ts`, `/blog`, `/blog/[slug]`, and `/feed.xml`.
   - Keep post pages server-rendered with static params.

7. **Launch Polish**
   - Add `app/sitemap.ts`, `app/robots.ts`, JSON-LD, OG assets, analytics, Lighthouse/accessibility checks, and deployment documentation.
   - Run after blog so metadata and sitemap include final routes.

## Anti-Patterns to Avoid

### Marking Route Files as Client Components

**What goes wrong:** Metadata exports break or move out of route files, client bundle grows, and server-only helpers become easy to import accidentally.
**Instead:** Keep route files server-rendered and add child client islands.

### Embedding Contact Logic in the Client

**What goes wrong:** Secrets leak, validation can be bypassed, and failures expose implementation details.
**Instead:** Use `app/api/contact/route.ts` with server-only env reads and a narrow client form.

### Treating Terminal Flags as Secrets

**What goes wrong:** Client bundles and source maps are public. Anything in terminal commands can be discovered.
**Instead:** Make all terminal challenges intentionally fake and document that constraint in the command module.

### Global Section Nav on Every Route

**What goes wrong:** `/blog` and `/resume` show home-section controls that point to missing DOM ids or wrong hash behavior.
**Instead:** Gate `FloatingNav` to `/` or pass route-specific items.

### Turning Packet Runner into a Data-Backed Feature Too Early

**What goes wrong:** Leaderboards require database schema, abuse controls, rate limits, and privacy decisions.
**Instead:** Keep v1 localStorage-only and treat Supabase as a later milestone.

### Frontmatter Without MDX Support

**What goes wrong:** Post metadata silently disappears or requires ad hoc parsing.
**Instead:** Use MDX metadata exports for v1, or explicitly add and validate `gray-matter`/remark frontmatter support.

## Scalability Considerations

| Concern | Launch | Later |
|---------|--------|-------|
| Content | Local JSON and MDX in git. | CMS only if editing cadence outgrows git review. |
| Contact | Resend route handler, server validation, best-effort abuse controls. | Durable KV/database-backed rate limiting if spam appears. |
| Blog | Static params and local MDX. | Search index or tags pages if post count grows. |
| Terminal | Client-only static command outputs. | Optional server-backed commands only with explicit security review. |
| Game | Client overlay, localStorage high score. | Supabase leaderboard only with schema, RLS, and abuse plan. |
| 3D | Progressive enhancement and fallback. | Extract shaders/assets only when inline code becomes hard to maintain. |

## Sources

- `.planning/codebase/ARCHITECTURE.md`
- `.planning/codebase/STRUCTURE.md`
- `.planning/codebase/INTEGRATIONS.md`
- `.planning/codebase/CONVENTIONS.md`
- `docs/MODULE_BREAKDOWN.md`
- `.planning/PROJECT.md`
- `.planning/ROADMAP.md`
- `app/layout.tsx`
- `app/page.tsx`
- `app/MainContent.tsx`
- `app/resume/page.tsx`
- `components/sections/ContactSection.tsx`
- `components/ui/FloatingNav.tsx`
- `components/3d/SpaceCanvas.tsx`
- `stores/globalStore.ts`
- `types/index.ts`
- `next.config.ts`
- `package.json`
- `node_modules/next/dist/docs/01-app/01-getting-started/05-server-and-client-components.md`
- `node_modules/next/dist/docs/01-app/03-api-reference/01-directives/use-client.md`
- `node_modules/next/dist/docs/01-app/01-getting-started/15-route-handlers.md`
- `node_modules/next/dist/docs/01-app/02-guides/mdx.md`
- `node_modules/next/dist/docs/01-app/03-api-reference/04-functions/generate-metadata.md`
- `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/01-metadata/sitemap.md`
- `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/01-metadata/robots.md`
