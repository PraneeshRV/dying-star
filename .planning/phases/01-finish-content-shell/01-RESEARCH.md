# Phase 1: Finish Content Shell - Research

**Researched:** 2026-04-28 [VERIFIED: user environment current_date]
**Domain:** Brownfield Next.js 16 static content section and responsive portfolio proof pass [VERIFIED: .planning/ROADMAP.md; .planning/phases/01-finish-content-shell/01-CONTEXT.md]
**Confidence:** HIGH [VERIFIED: requested files, local Next.js docs, package registry checks]

<user_constraints>
## User Constraints (from CONTEXT.md)

All constraints in this section are copied from `.planning/phases/01-finish-content-shell/01-CONTEXT.md` and must be treated as locked planning input. [VERIFIED: .planning/phases/01-finish-content-shell/01-CONTEXT.md]

### Locked Decisions

#### Certifications Section

- **D-01:** Add a real `CertificationsSection` powered by `content/data/certifications.json`; do not leave certifications as raw data only.
- **D-02:** Treat certifications/education as first-class portfolio proof, not a tiny subsection hidden inside About.
- **D-03:** Place Certifications after Experience and before CTF. This keeps the narrative: profile -> projects -> skills -> experience -> credentials -> competition proof -> contact.
- **D-04:** Use a stable section id: `certifications`.
- **D-05:** Add Certifications to `FloatingNav` with a concise label and icon, unless visual testing proves the dock becomes too crowded on mobile. If crowded, keep the section id and add in-section links while preserving existing nav usability.
- **D-06:** Display honest status badges. `in-progress` should read as active/current, not completed.

#### Project Proof

- **D-07:** Improve existing project content in place instead of inventing new projects.
- **D-08:** Preserve the three current flagship projects as the core proof set: RedCalibur, Axec-CLI, and L3m0nCTF Infrastructure.
- **D-09:** Make descriptions more specific and outcome-oriented: what was built, what problem it solves, what technologies prove, and what status is honest.
- **D-10:** Do not fake live demos or repository URLs. If exact URLs are unavailable, label links conservatively or use the GitHub profile only as a fallback.
- **D-11:** Add lightweight proof metadata only if it improves display: highlights, role, year, proof links, or case-study hint. Keep schema changes small and typed.
- **D-12:** Keep project filtering. Do not add search, pagination, modal case studies, or new route pages in Phase 1.

#### Visual Density and Layout

- **D-13:** Match the existing glass/terminal/cosmic visual language used by About, Projects, Skills, Experience, CTF, and Contact.
- **D-14:** Keep cards at restrained radii and avoid nested decorative card structures where a simple section layout works.
- **D-15:** Favor compact, scannable credential badges over a marketing-style hero block.
- **D-16:** Avoid adding new major animation systems in this phase. Hover/focus states and existing transitions are fine; scroll animation belongs to Phase 4.

#### Responsive Quality

- **D-17:** Treat responsive polish as part of the phase deliverable, not a later cleanup.
- **D-18:** Validate desktop and mobile layouts for long certification titles, status badges, project descriptions, tech pills, and floating nav density.
- **D-19:** Production preview (`npm run start`) is the trusted browser validation path until the `next dev` issue is resolved in a later phase.

### Claude's Discretion

- Exact badge icon choices, minor wording, grid breakpoints, and card microcopy are delegated to the implementer, provided they remain consistent with the existing design system and the requirements above.
- The implementer may add small optional fields to `types/index.ts` and `content/data/*.json` if they reduce hard-coded content and improve proof quality.

### Deferred Ideas (OUT OF SCOPE)

- Resend-backed contact form - Phase 2.
- WebGL fallback hardening and dev-server investigation - Phase 3.
- Scroll animation and terminal overlay - Phase 4.
- Packet Runner - Phase 5.
- Blog/case-study routes or full writeups - Phase 6.
- SEO, analytics, and launch docs - Phase 7.
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| CONT-07 | Visitor can see certifications and education badges as a polished section, not just raw JSON data. [VERIFIED: .planning/REQUIREMENTS.md] | Add `components/sections/CertificationsSection.tsx`, render all entries from `content/data/certifications.json`, use `id="certifications"`, and place it between `ExperienceSection` and `CTFSection`. [VERIFIED: .planning/phases/01-finish-content-shell/01-CONTEXT.md; app/page.tsx; content/data/certifications.json] |
| CONT-09 | Visitor can distinguish the strongest projects through sharper descriptions, real links where available, and case-study depth for flagship work. [VERIFIED: .planning/REQUIREMENTS.md] | Keep the existing three projects in `content/data/projects.json`, sharpen copy/status/link labeling, and lightly extend `Project`/`ProjectCard` only if the added fields directly improve proof. [VERIFIED: content/data/projects.json; components/sections/ProjectsSection.tsx; components/ui/ProjectCard.tsx; types/index.ts] |
</phase_requirements>

## Project Constraints (from CLAUDE.md)

- `CLAUDE.md` delegates to `AGENTS.md`; `AGENTS.md` is the operative local instruction file. [VERIFIED: CLAUDE.md; AGENTS.md]
- Next.js behavior must be checked against installed local docs under `node_modules/next/dist/docs/` before Next-specific code changes. [VERIFIED: AGENTS.md]
- GSD planning artifacts under `.planning/PROJECT.md`, `.planning/REQUIREMENTS.md`, `.planning/ROADMAP.md`, and `.planning/STATE.md` are required context before substantial planning work. [VERIFIED: AGENTS.md]
- `.planning/codebase/` must be read before changing architecture, framework configuration, data flow, tests, or integrations. [VERIFIED: AGENTS.md]
- Current execution target is Phase 1, "Finish Content Shell." [VERIFIED: AGENTS.md; .planning/ROADMAP.md]
- Planning commits must stay scoped to `.planning/` and instruction files, and code commits must stay scoped to implementation files. [VERIFIED: AGENTS.md]
- Minimum verification for user-facing changes is `npm run lint`, `npx tsc --noEmit`, `npm run build`, plus browser smoke against `npm run start` when UI/runtime behavior changes. [VERIFIED: AGENTS.md]

## Summary

Phase 1 is a content-shell completion pass, not an architecture or dependency phase. [VERIFIED: .planning/ROADMAP.md; .planning/phases/01-finish-content-shell/01-CONTEXT.md] The planner should preserve the existing App Router home composition, static JSON content flow, glass/terminal visual language, and client-island boundaries while adding one first-class certifications section and improving the proof quality of the three existing flagship projects. [VERIFIED: app/page.tsx; .planning/codebase/ARCHITECTURE.md; .planning/phases/01-finish-content-shell/01-UI-SPEC.md]

The safest implementation path is to add `CertificationsSection` as a Server Component using local JSON, import it into `app/page.tsx` after `ExperienceSection`, add a `Certification` type, and update `FloatingNav` only after checking eight-item dock density at 360px and 390px widths. [VERIFIED: node_modules/next/dist/docs/01-app/01-getting-started/05-server-and-client-components.md; app/page.tsx; components/ui/FloatingNav.tsx; components/ui/FloatingNav.module.css; .planning/phases/01-finish-content-shell/01-CONTEXT.md]

Project proof work should keep the current filterable gallery and `ProjectCard` tilt pattern, but improve content specificity, link labels, and optional typed proof metadata. [VERIFIED: components/sections/ProjectsSection.tsx; components/ui/ProjectCard.tsx; content/data/projects.json; .planning/phases/01-finish-content-shell/01-CONTEXT.md] Production preview is the trusted browser validation path for this phase because the repo state records `next dev`/Turbopack smoke instability while `next build` plus `next start` is healthy. [VERIFIED: .planning/STATE.md; .planning/codebase/CONCERNS.md; node_modules/next/dist/docs/01-app/02-guides/testing/playwright.md]

**Primary recommendation:** Implement Phase 1 as a narrow static-content UI pass: new `CertificationsSection`, typed content additions, conservative ProjectCard/ProjectsSection extension, deliberate FloatingNav density handling, and production browser smoke across the listed responsive viewports. [VERIFIED: .planning/phases/01-finish-content-shell/01-CONTEXT.md; .planning/phases/01-finish-content-shell/01-UI-SPEC.md]

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|--------------|----------------|-----------|
| Certifications rendering | Frontend Server (SSR) | Browser / Client for hover/focus CSS only | The data is local JSON and the section does not require state, effects, or browser APIs; pages/components are Server Components by default in App Router. [CITED: node_modules/next/dist/docs/01-app/01-getting-started/05-server-and-client-components.md; VERIFIED: content/data/certifications.json] |
| Project filtering | Browser / Client | Frontend Server for initial static content import | `ProjectsSection` already owns `useState`/`useMemo` filtering and is marked `"use client"`, so the planner should extend it rather than move filtering elsewhere. [VERIFIED: components/sections/ProjectsSection.tsx] |
| Project proof content | CDN / Static | Frontend Server (SSR) | Project facts live in committed JSON and render into the static page shell; there is no API/database layer in scope. [VERIFIED: content/data/projects.json; .planning/codebase/ARCHITECTURE.md] |
| FloatingNav certifications anchor | Browser / Client | Frontend Server provides the target DOM section | `FloatingNav` uses scroll listeners, `IntersectionObserver`, reduced-motion-aware scrolling, and hash updates in the browser. [VERIFIED: components/ui/FloatingNav.tsx] |
| Responsive/browser validation | Browser / Client | Frontend Server production build/start | The validation target is the rendered DOM in a production Next server, not unit-level rendering. [VERIFIED: .planning/STATE.md; node_modules/next/dist/docs/01-app/02-guides/testing/playwright.md] |

## Standard Stack

### Core

Use the installed stack and do not introduce new packages for Phase 1. [VERIFIED: package.json; npm ls; .planning/phases/01-finish-content-shell/01-CONTEXT.md]

| Library | Installed Version | Registry Check | Purpose | Why Standard |
|---------|-------------------|----------------|---------|--------------|
| `next` | 16.2.4 | latest 16.2.4, registry modified 2026-04-27T17:29:20.993Z | App Router, route composition, production build/start | The repo already uses Next 16 App Router and local docs are mandated before framework changes. [VERIFIED: npm ls; npm view; AGENTS.md] |
| `react` / `react-dom` | 19.2.4 | `react` latest 19.2.5, registry modified 2026-04-24T16:35:06.177Z | Component runtime | Phase 1 should not upgrade React because no dependency change is needed to render static content. [VERIFIED: npm ls; npm view; package.json] |
| `typescript` | 5.9.3 | latest 6.0.3, registry modified 2026-04-16T23:38:28.092Z | Strict types and JSON import contracts | Current strict TypeScript is sufficient; small interface additions belong in `types/index.ts`. [VERIFIED: npm ls; npm view; tsconfig.json; types/index.ts] |
| `tailwindcss` | 4.2.4 | latest 4.2.4, registry modified 2026-04-26T22:27:56.437Z | CSS-first utility styling | The repo already defines Tailwind v4 tokens in `app/globals.css` and uses Tailwind utilities in sections. [VERIFIED: npm ls; npm view; app/globals.css; node_modules/next/dist/docs/01-app/01-getting-started/11-css.md] |
| `@biomejs/biome` | 2.2.0 | latest 2.4.13, registry modified 2026-04-23T15:40:57.889Z | Lint/format/import organization | Existing scripts use `biome check`; Phase 1 should satisfy Biome rather than introduce ESLint or `next lint`. [VERIFIED: npm ls; npm view; package.json; biome.json] |
| `lucide-react` | 1.11.0 | latest 1.11.0, registry modified 2026-04-24T13:58:18.642Z | Section/nav/card icons | Existing sections and nav use lucide icons; the UI spec names lucide credential icons for Phase 1. [VERIFIED: npm ls; npm view; components/ui/FloatingNav.tsx; .planning/phases/01-finish-content-shell/01-UI-SPEC.md] |

### Supporting

| Library | Installed Version | Registry Check | Purpose | When to Use |
|---------|-------------------|----------------|---------|-------------|
| `motion` | 12.38.0 | latest 12.38.0, registry modified 2026-03-17T08:27:20.641Z | Existing FloatingNav entrance/exit animation | Reuse only where already present; do not add a new animation system in Phase 1. [VERIFIED: npm ls; npm view; components/ui/FloatingNav.tsx; .planning/phases/01-finish-content-shell/01-CONTEXT.md] |
| `clsx` through `cn` | 2.1.1 | installed via package.json | Class composition | Use existing `cn` when extending reusable components with conditional classes. [VERIFIED: package.json; lib/utils.ts] |
| Python Playwright package | system package at `/usr/lib/python3.14/site-packages/playwright` | local import succeeded | External production browser smoke | Use the existing `/tmp/dying_star_smoke.py` pattern or a phase-specific equivalent until an in-repo Playwright suite is added. [VERIFIED: python3 import; /tmp/dying_star_smoke.py; .planning/codebase/TESTING.md] |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Existing custom section/component system | shadcn/ui or another component library | Rejected for Phase 1 because no `components.json` exists and the UI spec forbids registry blocks for this phase. [VERIFIED: .planning/phases/01-finish-content-shell/01-UI-SPEC.md] |
| Local JSON content | CMS/API/database | Rejected for Phase 1 because v1 content is static JSON/MDX and no database exists today. [VERIFIED: .planning/PROJECT.md; .planning/codebase/ARCHITECTURE.md] |
| Existing `ProjectCard` and filter UI | Modal case studies, new routes, pagination, search | Rejected by locked decisions D-12 and deferred Phase 6 case-study/blog scope. [VERIFIED: .planning/phases/01-finish-content-shell/01-CONTEXT.md] |

**Installation:**

```bash
# No package installation is recommended for Phase 1. [VERIFIED: package.json; .planning/phases/01-finish-content-shell/01-CONTEXT.md]
```

**Version verification:** `npm view` initially failed inside the restricted sandbox with DNS `EAI_AGAIN`, then succeeded with approved network access for registry lookups. [VERIFIED: npm view command outputs] `npm ls` verified installed package versions from the current workspace. [VERIFIED: npm ls command output]

## Architecture Patterns

### System Architecture Diagram

```text
content/data/certifications.json ──┐
                                   ├──> Server Components render static section DOM
content/data/projects.json ────────┘        │
                                            │
                                            v
app/page.tsx section stack: About -> Projects -> Skills -> Experience -> Certifications -> CTF -> Contact
                                            │
                                            ├── CertificationsSection: no browser state required
                                            │
                                            ├── ProjectsSection: existing client filter island
                                            │
                                            └── FloatingNav: client scroll observer and hash navigation
                                            │
                                            v
npm run build -> npm run start -> browser smoke at desktop/mobile/reduced-motion viewports
```

This data flow matches the current local JSON-to-section architecture and keeps browser-only behavior in existing client islands. [VERIFIED: .planning/codebase/ARCHITECTURE.md; app/page.tsx; components/sections/ProjectsSection.tsx; components/ui/FloatingNav.tsx]

### Recommended Project Structure

```text
components/
├── sections/
│   ├── CertificationsSection.tsx     # New static section for credential/education proof. [VERIFIED: .planning/phases/01-finish-content-shell/01-CONTEXT.md]
│   └── ProjectsSection.tsx           # Existing client filter owner; extend lightly if proof metadata is displayed. [VERIFIED: components/sections/ProjectsSection.tsx]
├── ui/
│   ├── ProjectCard.tsx               # Existing card interaction; extend only if project proof needs it. [VERIFIED: components/ui/ProjectCard.tsx]
│   └── FloatingNav.tsx               # Existing nav item array and observer; add certifications deliberately. [VERIFIED: components/ui/FloatingNav.tsx]
content/
└── data/
    ├── certifications.json           # Existing credential data source. [VERIFIED: content/data/certifications.json]
    └── projects.json                 # Existing flagship project data source. [VERIFIED: content/data/projects.json]
types/
└── index.ts                          # Add Certification and optional Project proof fields here. [VERIFIED: types/index.ts]
```

### Pattern 1: Static Server Section for Certifications

**What:** Create `components/sections/CertificationsSection.tsx` without `"use client"` unless a real browser-only interaction is added. [CITED: node_modules/next/dist/docs/01-app/01-getting-started/05-server-and-client-components.md]

**When to use:** Use this pattern for credential cards because the section only needs static JSON, semantic markup, icons, and CSS hover/focus states. [VERIFIED: content/data/certifications.json; .planning/phases/01-finish-content-shell/01-UI-SPEC.md]

**Example:**

```tsx
// Source pattern: components/sections/ExperienceSection.tsx and local Next Server Component docs. [VERIFIED: components/sections/ExperienceSection.tsx; CITED: node_modules/next/dist/docs/01-app/01-getting-started/05-server-and-client-components.md]
import { Award } from "lucide-react";
import { GlitchText } from "@/components/ui/GlitchText";
import certificationsData from "@/content/data/certifications.json";
import type { Certification } from "@/types";

const CERTIFICATIONS = certificationsData as Certification[];

export function CertificationsSection() {
  return (
    <section id="certifications" aria-labelledby="certifications-heading">
      <GlitchText as="h2" id="certifications-heading" text="CERTIFICATIONS" />
      {CERTIFICATIONS.map((credential) => (
        <article key={credential.id}>
          <Award aria-hidden="true" />
          <h3>{credential.title}</h3>
          <p>{credential.issuer}</p>
        </article>
      ))}
    </section>
  );
}
```

### Pattern 2: Keep Existing Client Islands Narrow

**What:** Add `"use client"` only to files that use state, effects, event handlers, browser APIs, custom client hooks, or animation libraries. [CITED: node_modules/next/dist/docs/01-app/03-api-reference/01-directives/use-client.md]

**When to use:** Keep `ProjectsSection`, `ProjectCard`, and `FloatingNav` as client components because they already use state, pointer events, scroll observers, and Motion; do not mark `app/page.tsx` or the new static certifications section as client. [VERIFIED: components/sections/ProjectsSection.tsx; components/ui/ProjectCard.tsx; components/ui/FloatingNav.tsx; app/page.tsx]

### Pattern 3: Typed Static Content Extension

**What:** Extend `types/index.ts` with a `Certification` interface and only add optional `Project` fields that the UI will actually render. [VERIFIED: types/index.ts; .planning/phases/01-finish-content-shell/01-CONTEXT.md]

**When to use:** Use this pattern if adding fields such as `role`, `year`, `proofLabel`, `proofUrl`, `proofType`, or `highlights` reduces hard-coded copy in components. [VERIFIED: .planning/phases/01-finish-content-shell/01-CONTEXT.md; .planning/phases/01-finish-content-shell/01-UI-SPEC.md]

### Pattern 4: Production Browser Smoke as Layout Gate

**What:** Validate after `npm run build` and `npm run start`, then inspect DOM, console errors, section ids, hash navigation, horizontal overflow, and screenshots/viewports in Chromium. [VERIFIED: AGENTS.md; .planning/STATE.md; /tmp/dying_star_smoke.py]

**When to use:** Use this for Phase 1 because the risk is responsive/visual regressions and `next dev` is not the trusted signal in this repo. [VERIFIED: .planning/STATE.md; .planning/phases/01-finish-content-shell/01-CONTEXT.md]

### Anti-Patterns to Avoid

- **Marking `app/page.tsx` as client:** This would enlarge the client bundle and contradict local Next guidance on keeping static route composition server-rendered. [CITED: node_modules/next/dist/docs/01-app/01-getting-started/05-server-and-client-components.md; VERIFIED: app/page.tsx]
- **Folding certifications into About:** Locked decisions require a first-class certifications/education proof section, not a hidden subsection. [VERIFIED: .planning/phases/01-finish-content-shell/01-CONTEXT.md]
- **Presenting generic GitHub profile links as repository source links:** Current project data uses `https://github.com/praneeshrv` for all three projects, so the UI must label generic profile fallbacks conservatively. [VERIFIED: content/data/projects.json; .planning/phases/01-finish-content-shell/01-UI-SPEC.md]
- **Adding case-study routes/modals/search:** These are explicitly out of scope for Phase 1. [VERIFIED: .planning/phases/01-finish-content-shell/01-CONTEXT.md]
- **Relying on `next dev` smoke:** Production preview is the trusted validation path until the documented dev-server issue is handled later. [VERIFIED: .planning/STATE.md; .planning/codebase/CONCERNS.md]

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Credential content storage | CMS/database/admin editor | Existing `content/data/certifications.json` plus `Certification` type | The project is static JSON today and Phase 1 has no data-layer scope. [VERIFIED: .planning/PROJECT.md; content/data/certifications.json] |
| Project filtering | New search/pagination/modal system | Existing `ProjectsSection` filter tabs | Filtering already works and D-12 says to keep it. [VERIFIED: components/sections/ProjectsSection.tsx; .planning/phases/01-finish-content-shell/01-CONTEXT.md] |
| Navigation behavior | New scroll spy implementation | Existing `FloatingNav` `NAV_ITEMS` and `IntersectionObserver` behavior | The nav already owns active-section selection and reduced-motion-aware scrolling. [VERIFIED: components/ui/FloatingNav.tsx] |
| Animation layer | GSAP or new scroll animation system | Existing hover/focus transitions and reduced-motion CSS | Major animation work belongs to Phase 4. [VERIFIED: .planning/phases/01-finish-content-shell/01-CONTEXT.md; app/globals.css] |
| Browser validation harness | In-repo E2E framework setup inside Phase 1 implementation | Existing external Python Playwright smoke or a focused temporary smoke script | The repo has no test framework configured; Phase 1 should validate the UI without turning into a test-infrastructure phase unless the planner explicitly creates a Wave 0 gap. [VERIFIED: .planning/codebase/TESTING.md; /tmp/dying_star_smoke.py] |

**Key insight:** The hard part is truthful, scannable proof and responsive polish, not new infrastructure. [VERIFIED: .planning/REQUIREMENTS.md; .planning/research/SUMMARY.md; .planning/phases/01-finish-content-shell/01-CONTEXT.md]

## Common Pitfalls

### Pitfall 1: In-Progress Credentials Looking Completed

**What goes wrong:** PJPT or B.Tech is styled or labeled as completed/certified. [VERIFIED: content/data/certifications.json; .planning/phases/01-finish-content-shell/01-CONTEXT.md]

**Why it happens:** `status: "in-progress"` and `year: "WIP"` require explicit display logic; color alone is ambiguous. [VERIFIED: content/data/certifications.json; .planning/phases/01-finish-content-shell/01-UI-SPEC.md]

**How to avoid:** Render status text such as `In progress` or `Active track`, and use gold/current styling rather than completion language. [VERIFIED: .planning/phases/01-finish-content-shell/01-UI-SPEC.md]

**Warning signs:** UI text says `Certified`, `Completed`, or uses only a green check without status copy. [VERIFIED: .planning/phases/01-finish-content-shell/01-UI-SPEC.md]

### Pitfall 2: FloatingNav Overcrowds at Mobile Widths

**What goes wrong:** Adding Certifications creates eight dock items that clip, shrink below accessible tap targets, or obscure content. [VERIFIED: components/ui/FloatingNav.tsx; components/ui/FloatingNav.module.css; .planning/phases/01-finish-content-shell/01-UI-SPEC.md]

**Why it happens:** Current mobile item width is `2.5rem`, tooltips are hidden under 480px, and the UI spec requires at least 40px tap targets. [VERIFIED: components/ui/FloatingNav.module.css; .planning/phases/01-finish-content-shell/01-UI-SPEC.md]

**How to avoid:** Test 360px and 390px widths; if eight items do not fit cleanly, keep `#certifications` in document flow and omit the nav item on narrow mobile. [VERIFIED: .planning/phases/01-finish-content-shell/01-CONTEXT.md; .planning/phases/01-finish-content-shell/01-UI-SPEC.md]

**Warning signs:** Horizontal overflow, clipped active dots, hidden focus rings, or bottom nav covering final lines of CTF/Contact content. [VERIFIED: .planning/phases/01-finish-content-shell/01-UI-SPEC.md]

### Pitfall 3: Project Links Overpromise

**What goes wrong:** Generic profile URLs are rendered as `SOURCE`, implying repository-specific proof that is not actually present. [VERIFIED: content/data/projects.json; components/sections/ProjectsSection.tsx; components/ui/ProjectCard.tsx]

**Why it happens:** Current `sourceUrl` fields all point to the same GitHub profile, while both `ProjectCard` and `ProjectsSection` render source actions. [VERIFIED: content/data/projects.json; components/sections/ProjectsSection.tsx; components/ui/ProjectCard.tsx]

**How to avoid:** Add label/type metadata or component logic that distinguishes repository URLs from profile fallbacks; reserve `Source` for real repo links and use `GitHub profile` for generic fallback. [VERIFIED: .planning/phases/01-finish-content-shell/01-UI-SPEC.md]

**Warning signs:** Two source links per project, `SOURCE` text pointing to a profile root, or fake demo/writeup links. [VERIFIED: components/sections/ProjectsSection.tsx; components/ui/ProjectCard.tsx; .planning/phases/01-finish-content-shell/01-CONTEXT.md]

### Pitfall 4: Client Boundary Creep

**What goes wrong:** Static content sections become client components unnecessarily. [CITED: node_modules/next/dist/docs/01-app/03-api-reference/01-directives/use-client.md]

**Why it happens:** Existing neighboring components include client islands, which can make it tempting to copy `"use client"` into the new section. [VERIFIED: components/sections/ProjectsSection.tsx; components/sections/CTFSection.tsx]

**How to avoid:** Use Server Components by default and only add `"use client"` when state/effects/browser APIs are needed. [CITED: node_modules/next/dist/docs/01-app/01-getting-started/05-server-and-client-components.md]

**Warning signs:** New certifications section imports `useState`, `useEffect`, Motion, or browser APIs without a functional requirement. [CITED: node_modules/next/dist/docs/01-app/03-api-reference/01-directives/use-client.md]

### Pitfall 5: Responsive Proof Copy Breaks Card Layout

**What goes wrong:** Longer descriptions, focus tags, and status pills overflow or cause uneven card heights/filter jumps. [VERIFIED: .planning/phases/01-finish-content-shell/01-UI-SPEC.md]

**Why it happens:** Phase 1 intentionally sharpens content copy, and current project cards have fixed interaction styling plus a `min-height: 16rem`. [VERIFIED: components/ui/ProjectCard.module.css; .planning/phases/01-finish-content-shell/01-CONTEXT.md]

**How to avoid:** Validate long content at 1440x900, 1280x800, 768x1024, 390x844, and 360x740 against production preview. [VERIFIED: .planning/phases/01-finish-content-shell/01-UI-SPEC.md]

**Warning signs:** Horizontal scroll, clipped tech pills, overlapping status badges, or filter changes that resize the layout unexpectedly. [VERIFIED: .planning/phases/01-finish-content-shell/01-UI-SPEC.md]

## Code Examples

### Add Certifications to the Home Stack

```tsx
// Source pattern: app/page.tsx current section composition. [VERIFIED: app/page.tsx]
import { CertificationsSection } from "@/components/sections/CertificationsSection";

// Insert after ExperienceSection and before CTFSection. [VERIFIED: .planning/phases/01-finish-content-shell/01-CONTEXT.md]
<ExperienceSection />
<CertificationsSection />
<CTFSection />
```

### Define the Certification Type

```ts
// Source data shape: content/data/certifications.json. [VERIFIED: content/data/certifications.json]
export interface Certification {
  id: string;
  title: string;
  issuer: string;
  status: "in-progress" | "completed";
  year: string;
  description: string;
  focus: string[];
}
```

### Conservative Project Proof Link Labeling

```tsx
// Source risk: all current sourceUrl values point to https://github.com/praneeshrv. [VERIFIED: content/data/projects.json]
const isProfileFallback = project.sourceUrl === "https://github.com/praneeshrv";
const proofLabel = isProfileFallback ? "GitHub profile" : "Source";
```

### Browser Smoke Checks to Extend

```python
# Source pattern: /tmp/dying_star_smoke.py. [VERIFIED: /tmp/dying_star_smoke.py]
required_ids = [
    "home",
    "about",
    "projects",
    "skills",
    "experience",
    "certifications",
    "ctf",
    "contact",
]
missing = [section_id for section_id in required_ids if page.locator(f"#{section_id}").count() == 0]
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Treat sections as generic client-side React views | App Router pages are Server Components by default and client behavior lives behind `"use client"` boundaries | Current installed Next 16 docs | New static sections should remain server-rendered unless they need browser behavior. [CITED: node_modules/next/dist/docs/01-app/01-getting-started/05-server-and-client-components.md] |
| Trust local dev server smoke for UI validation | Trust `next build` plus `next start` for production-like browser smoke | Documented in current project state on 2026-04-28 | Planner should not block Phase 1 on `next dev` hydration behavior. [VERIFIED: .planning/STATE.md; .planning/phases/01-finish-content-shell/01-CONTEXT.md] |
| Use raw content data as proof | Render polished proof sections from typed local JSON | Phase 1 scope | Certifications and project proof must be visible and scannable, not just stored. [VERIFIED: .planning/REQUIREMENTS.md; content/data/certifications.json; content/data/projects.json] |

**Deprecated/outdated for this repo:**

- `next lint` is not the configured lint path; `npm run lint` runs `biome check`. [VERIFIED: package.json]
- Adding a component library or registry blocks is out of scope for Phase 1. [VERIFIED: .planning/phases/01-finish-content-shell/01-UI-SPEC.md]

## Assumptions Log

No `[ASSUMED]` claims are required for this research. [VERIFIED: all claims are tied to local project files, local Next docs, or command outputs]

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| — | All claims in this research were verified or cited in this session. | All sections | Planner can proceed without routing any assumption back to discuss-phase. [VERIFIED: source list below] |

## Open Questions

1. **Do project-specific repository, demo, or writeup URLs exist for RedCalibur, Axec-CLI, or L3m0nCTF Infrastructure?** [VERIFIED: content/data/projects.json]
   - What we know: Current `sourceUrl` values are all the generic GitHub profile. [VERIFIED: content/data/projects.json]
   - What's unclear: Exact repo/demo/writeup URLs are not present in the provided files. [VERIFIED: content/data/projects.json; rg output]
   - Recommendation: If exact URLs are unavailable during execution, label profile links as `GitHub profile` and avoid fake proof links. [VERIFIED: .planning/phases/01-finish-content-shell/01-CONTEXT.md; .planning/phases/01-finish-content-shell/01-UI-SPEC.md]

2. **Should the planner add an in-repo smoke test in Wave 0 or keep using the external smoke harness for this phase?** [VERIFIED: .planning/codebase/TESTING.md; /tmp/dying_star_smoke.py]
   - What we know: No in-repo test runner or Playwright config exists, but Python Playwright and `/tmp/dying_star_smoke.py` are available. [VERIFIED: rg --files test search; python3 import; /tmp/dying_star_smoke.py]
   - What's unclear: Whether Phase 1 should spend implementation time committing test infrastructure. [VERIFIED: .planning/ROADMAP.md]
   - Recommendation: Keep Phase 1 focused and use a phase-specific external/temporary browser smoke unless the planner creates an explicit Wave 0 validation task. [VERIFIED: .planning/phases/01-finish-content-shell/01-CONTEXT.md; .planning/codebase/TESTING.md]

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|-------------|-----------|---------|----------|
| Node.js | `npm run build`, `npm run start`, TypeScript tooling | yes | v25.9.0 | Use installed Node; no phase-specific fallback needed. [VERIFIED: node -p process.version] |
| npm | Package scripts and registry checks | yes | 11.13.0 | Use npm only; do not introduce pnpm/yarn. [VERIFIED: npm --version; package-lock.json; .planning/PROJECT.md] |
| Chromium | Production browser smoke | yes | `/usr/bin/chromium` exists | Python Playwright can launch Chromium headless. [VERIFIED: command -v chromium; /tmp/dying_star_smoke.py] |
| Python | External `with_server.py` and smoke script | yes | 3.14.4 | No fallback needed for current external smoke path. [VERIFIED: python3 --version] |
| Python Playwright | External browser smoke | yes | installed at `/usr/lib/python3.14/site-packages/playwright` | Use the existing Python smoke path rather than npm Playwright in Phase 1. [VERIFIED: python3 import playwright] |
| `with_server.py` | Start `npm run start` and wait for port 3000 before smoke | yes | script help available | Start server manually if helper fails. [VERIFIED: /home/praneesh/antigravity-skills/skills/webapp-testing/scripts/with_server.py --help] |
| `@playwright/test` npm package | In-repo Playwright suite | no | — | Use Python Playwright/external smoke unless Wave 0 adds npm Playwright. [VERIFIED: node_modules checks; package.json] |
| `gsd-sdk` | Optional GSD init/commit helper | no | permission denied in shell | Use explicit files and avoid GSD commit because user write scope allows only the research file. [VERIFIED: gsd-sdk query init.phase-op 1 command output; user write_scope] |

**Missing dependencies with no fallback:**

- None for researching or planning Phase 1. [VERIFIED: environment audit commands]

**Missing dependencies with fallback:**

- `@playwright/test` is missing, but Python Playwright plus `with_server.py` can support production smoke. [VERIFIED: package.json; python3 import playwright; /tmp/dying_star_smoke.py]
- `gsd-sdk` is unavailable, but all required phase context was available from explicit files. [VERIFIED: gsd-sdk command output; requested files]

## Validation Architecture

### Test Framework

| Property | Value |
|----------|-------|
| Framework | No in-repo test framework; external Python Playwright is available for smoke. [VERIFIED: .planning/codebase/TESTING.md; python3 import playwright] |
| Config file | none in repo; no `playwright.config.*`, `vitest.config.*`, or `jest.config.*` found. [VERIFIED: rg --files test/config search] |
| Quick run command | `npm run lint && npx tsc --noEmit` for static checks, then focused browser smoke after build/start for UI behavior. [VERIFIED: AGENTS.md; package.json] |
| Full suite command | `npm run lint`, `npx tsc --noEmit`, `npm run build`, then `python3 /home/praneesh/antigravity-skills/skills/webapp-testing/scripts/with_server.py --server "npm run start" --port 3000 --timeout 60 -- python3 /tmp/dying_star_smoke.py` with Phase 1 smoke additions. [VERIFIED: AGENTS.md; .planning/codebase/TESTING.md; /tmp/dying_star_smoke.py] |

### Phase Requirements -> Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|--------------|
| CONT-07 | `#certifications` exists after `#experience` and before `#ctf`, and renders every credential title, issuer, status, year, description, and focus tags. [VERIFIED: .planning/REQUIREMENTS.md; content/data/certifications.json] | browser smoke + manual responsive screenshot | Production smoke via `with_server.py` and a Phase 1 Python Playwright script. [VERIFIED: /tmp/dying_star_smoke.py] | no in-repo file; external pattern exists. [VERIFIED: .planning/codebase/TESTING.md; /tmp/dying_star_smoke.py] |
| CONT-09 | Project cards preserve filters and show stronger proof descriptions plus honest link/status labeling for RedCalibur, Axec-CLI, and L3m0nCTF Infrastructure. [VERIFIED: .planning/REQUIREMENTS.md; content/data/projects.json] | browser smoke + static content review | Production smoke should click each filter and assert flagship titles remain visible in correct filters. [VERIFIED: components/sections/ProjectsSection.tsx] | no in-repo file; external pattern exists. [VERIFIED: .planning/codebase/TESTING.md; /tmp/dying_star_smoke.py] |

### Sampling Rate

- **Per task commit:** `npm run lint` and `npx tsc --noEmit` for any typed/content/component change. [VERIFIED: AGENTS.md]
- **Per wave merge:** `npm run build` plus production smoke against `npm run start`. [VERIFIED: AGENTS.md; .planning/STATE.md]
- **Phase gate:** Full suite green, plus desktop/mobile responsive checks at 1440x900, 1280x800, 768x1024, 390x844, and 360x740. [VERIFIED: .planning/phases/01-finish-content-shell/01-UI-SPEC.md]

### Wave 0 Gaps

- [ ] Optional: create a temporary or committed Phase 1 browser smoke that adds `#certifications`, project filter, horizontal overflow, and link-label checks. [VERIFIED: .planning/codebase/TESTING.md; /tmp/dying_star_smoke.py]
- [ ] Optional: add npm Playwright infrastructure only if the planner deliberately scopes test setup; it is not required to implement Phase 1 content. [VERIFIED: package.json; .planning/codebase/TESTING.md]

## Security Domain

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|---------------|---------|------------------|
| V2 Authentication | no | Public portfolio has no user accounts in v1. [VERIFIED: .planning/PROJECT.md; .planning/REQUIREMENTS.md] |
| V3 Session Management | no | No sessions are in Phase 1 scope. [VERIFIED: .planning/ROADMAP.md] |
| V4 Access Control | no | Phase 1 renders public static content only. [VERIFIED: .planning/ROADMAP.md; content/data/*.json] |
| V5 Input Validation | limited | Validate typed static JSON through TypeScript shape and manual content review; runtime validation is not currently configured. [VERIFIED: types/index.ts; .planning/codebase/CONCERNS.md] |
| V6 Cryptography | no | No crypto or secret handling belongs to Phase 1. [VERIFIED: .planning/ROADMAP.md] |

### Known Threat Patterns for This Phase

| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| Misleading credential/project claims | Spoofing | Honest status text, no fake demos/repos, and conservative generic-link labels. [VERIFIED: .planning/phases/01-finish-content-shell/01-CONTEXT.md; .planning/phases/01-finish-content-shell/01-UI-SPEC.md] |
| Unsafe external links | Tampering / Spoofing | External links should use `target="_blank"` and `rel="noopener noreferrer"` where applicable; existing ProjectCard source links already do this. [VERIFIED: components/ui/ProjectCard.tsx; .planning/phases/01-finish-content-shell/01-UI-SPEC.md] |
| Client-visible secrets in proof/easter egg content | Information Disclosure | Keep Phase 1 content public-only and avoid real secrets, tokens, or private challenge material. [VERIFIED: .planning/PROJECT.md; .planning/REQUIREMENTS.md] |
| Layout hiding focus or content | Denial of Service for keyboard/mobile users | Check keyboard tab order, focus-visible rings, no horizontal overflow, and nav/content overlap in production browser smoke. [VERIFIED: app/globals.css; .planning/phases/01-finish-content-shell/01-UI-SPEC.md] |

## Sources

### Primary (HIGH confidence)

- `.planning/phases/01-finish-content-shell/01-CONTEXT.md` - locked Phase 1 decisions, scope, source files, and deferred work. [VERIFIED: file read]
- `.planning/phases/01-finish-content-shell/01-UI-SPEC.md` - UI contract for certifications, project proof, nav density, responsive viewports, accessibility, and visual constraints. [VERIFIED: file read]
- `.planning/PROJECT.md`, `.planning/REQUIREMENTS.md`, `.planning/ROADMAP.md`, `.planning/STATE.md` - product constraints, requirements `CONT-07`/`CONT-09`, Phase 1 success criteria, and production smoke preference. [VERIFIED: file reads]
- `.planning/codebase/ARCHITECTURE.md`, `.planning/codebase/STRUCTURE.md`, `.planning/codebase/CONVENTIONS.md`, `.planning/codebase/TESTING.md`, `.planning/codebase/CONCERNS.md` - existing code organization, conventions, testing state, and risks. [VERIFIED: file reads]
- `app/page.tsx`, `components/sections/ProjectsSection.tsx`, `components/ui/ProjectCard.tsx`, `components/ui/FloatingNav.tsx`, `components/ui/FloatingNav.module.css`, `content/data/certifications.json`, `content/data/projects.json`, `types/index.ts` - exact implementation touch points and current data shapes. [VERIFIED: file reads]
- `node_modules/next/dist/docs/01-app/01-getting-started/05-server-and-client-components.md`, `node_modules/next/dist/docs/01-app/03-api-reference/01-directives/use-client.md`, `node_modules/next/dist/docs/01-app/01-getting-started/11-css.md`, `node_modules/next/dist/docs/01-app/02-guides/testing/playwright.md`, `node_modules/next/dist/docs/01-app/02-guides/testing/index.md` - installed local Next.js docs for server/client boundaries, styling, and production-like E2E testing. [CITED: local Next docs]
- `npm ls` and `npm view` command outputs - installed and registry package versions. [VERIFIED: command outputs]

### Secondary (MEDIUM confidence)

- `.planning/research/SUMMARY.md` - broader project research summary and Phase 1 implications. [VERIFIED: file read]
- `/tmp/dying_star_smoke.py` - current external smoke harness; useful but not committed to the repo. [VERIFIED: file read]

### Tertiary (LOW confidence)

- None. [VERIFIED: no low-confidence web-only sources used]

## Metadata

**Confidence breakdown:**

- Standard stack: HIGH - Installed versions were checked with `npm ls`, selected registry versions were checked with `npm view`, and no new dependency is recommended. [VERIFIED: npm ls; npm view; package.json]
- Architecture: HIGH - Phase 1 maps directly to existing App Router section composition and static JSON patterns. [VERIFIED: app/page.tsx; .planning/codebase/ARCHITECTURE.md]
- Pitfalls: HIGH - Risks are documented in the phase context, UI spec, codebase concerns, and current source files. [VERIFIED: .planning/phases/01-finish-content-shell/01-CONTEXT.md; .planning/phases/01-finish-content-shell/01-UI-SPEC.md; .planning/codebase/CONCERNS.md]
- Validation: MEDIUM - Static checks are well defined, but no in-repo browser test suite exists and responsive smoke requires an external or temporary Playwright harness. [VERIFIED: .planning/codebase/TESTING.md; /tmp/dying_star_smoke.py]

**Research date:** 2026-04-28 [VERIFIED: user environment current_date]
**Valid until:** 2026-05-05 for package-version currency and Phase 1 planning; local codebase findings remain valid until implementation files change. [VERIFIED: npm registry modified dates; git status --short]
