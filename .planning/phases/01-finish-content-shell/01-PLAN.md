---
phase: 1
plan: 1
title: Finish Content Shell
type: execute
wave: 1
depends_on: []
files_modified:
  - components/sections/CertificationsSection.tsx
  - components/sections/ProjectsSection.tsx
  - components/ui/ProjectCard.tsx
  - components/ui/ProjectCard.module.css
  - components/ui/FloatingNav.tsx
  - app/page.tsx
  - content/data/projects.json
  - types/index.ts
autonomous: true
requirements:
  - CONT-07
  - CONT-09
must_haves:
  truths:
    - "Home page renders a first-class Certifications section from content/data/certifications.json."
    - "Certifications appear after Experience and before CTF in app/page.tsx."
    - "FloatingNav supports the certifications anchor without clipping at 360px; if necessary, the mobile dock deliberately omits that item while preserving the section."
    - "The three flagship projects remain filterable and use sharper, honest proof-oriented copy."
    - "Generic GitHub profile URLs are never labeled as repository source links."
  artifacts:
    - "components/sections/CertificationsSection.tsx"
    - "content/data/certifications.json"
    - "content/data/projects.json"
    - "components/ui/ProjectCard.tsx"
    - "components/ui/FloatingNav.tsx"
    - "app/page.tsx"
  key_links:
    - "app/page.tsx -> components/sections/CertificationsSection.tsx"
    - "FloatingNav NAV_ITEMS -> #certifications"
    - "ProjectsSection -> ProjectCard -> content/data/projects.json"
---

# Plan 01: Finish Content Shell

<objective>
Complete Phase 1 by rendering certifications/education as first-class portfolio proof, sharpening the existing flagship project cards, wiring section order/navigation, and validating responsive production behavior.
</objective>

<threat_model>
No backend, auth, database, or secret-bearing code changes are in scope. Main risks are client-side content misrepresentation and unsafe external links.

- Risk: fake or overstated credential/project claims. Mitigation: preserve `in-progress` wording and label generic GitHub URLs as `GitHub profile`.
- Risk: external links can tab-nab. Mitigation: all external anchors use `target="_blank"` with `rel="noopener noreferrer"`.
- Risk: content becomes inaccessible on mobile or without WebGL. Mitigation: all proof content is DOM text in semantic sections and verified at narrow viewports.
</threat_model>

<tasks>

<task id="1" type="execute">
<title>Add typed certifications section</title>
<files>
- `types/index.ts`
- `components/sections/CertificationsSection.tsx`
</files>
<read_first>
- `AGENTS.md`
- `.planning/PROJECT.md`
- `.planning/REQUIREMENTS.md`
- `.planning/ROADMAP.md`
- `.planning/STATE.md`
- `.planning/codebase/ARCHITECTURE.md`
- `.planning/codebase/STRUCTURE.md`
- `.planning/codebase/CONVENTIONS.md`
- `node_modules/next/dist/docs/01-app/01-getting-started/05-server-and-client-components.md`
- `node_modules/next/dist/docs/01-app/03-api-reference/01-directives/use-client.md`
- `.planning/phases/01-finish-content-shell/01-CONTEXT.md`
- `.planning/phases/01-finish-content-shell/01-UI-SPEC.md`
- `content/data/certifications.json`
- `types/index.ts`
- `components/sections/ExperienceSection.tsx`
- `components/sections/CTFSection.tsx`
</read_first>
<action>
Add `Certification` to `types/index.ts` with fields `id`, `title`, `issuer`, `status: "in-progress" | "completed"`, `year`, `description`, and `focus`.

Create `components/sections/CertificationsSection.tsx` as a Server Component that imports `content/data/certifications.json`, casts it to `Certification[]`, and renders:
- `<section id="certifications" aria-labelledby="certifications-heading">`
- eyebrow text `credential vault / certifications`
- `GlitchText` heading text `CERTIFICATIONS` with id `certifications-heading`
- one article per certification showing title, issuer, year/range, text status, description, and every `focus` tag
- PJPT and B.Tech entries as visibly in-progress/current, never completed
- decorative lucide icons with `aria-hidden="true"`
</action>
<acceptance_criteria>
- `types/index.ts` contains `export interface Certification`
- `components/sections/CertificationsSection.tsx` contains `id="certifications"`
- `components/sections/CertificationsSection.tsx` contains `aria-labelledby="certifications-heading"`
- `components/sections/CertificationsSection.tsx` contains `credential vault / certifications`
- `components/sections/CertificationsSection.tsx` contains `CERTIFICATIONS`
- `components/sections/CertificationsSection.tsx` maps `certification.focus.map`
</acceptance_criteria>
<verify>
- `rg "export interface Certification" types/index.ts`
- `rg "id=\"certifications\"|aria-labelledby=\"certifications-heading\"|credential vault / certifications|CERTIFICATIONS|certification.focus.map" components/sections/CertificationsSection.tsx`
</verify>
<done>
Certification type exists, the section file exists, and all JSON credentials render as semantic cards with non-completed in-progress wording.
</done>
</task>

<task id="2" type="execute">
<title>Wire certifications into page flow and floating nav</title>
<files>
- `app/page.tsx`
- `components/ui/FloatingNav.tsx`
- `components/ui/FloatingNav.module.css`
</files>
<read_first>
- `AGENTS.md`
- `.planning/PROJECT.md`
- `.planning/REQUIREMENTS.md`
- `.planning/ROADMAP.md`
- `.planning/STATE.md`
- `.planning/codebase/ARCHITECTURE.md`
- `.planning/codebase/STRUCTURE.md`
- `.planning/codebase/CONVENTIONS.md`
- `node_modules/next/dist/docs/01-app/01-getting-started/05-server-and-client-components.md`
- `node_modules/next/dist/docs/01-app/03-api-reference/01-directives/use-client.md`
- `app/page.tsx`
- `components/ui/FloatingNav.tsx`
- `components/ui/FloatingNav.module.css`
- `.planning/phases/01-finish-content-shell/01-UI-SPEC.md`
</read_first>
<action>
Import `CertificationsSection` in `app/page.tsx` and render it after `ExperienceSection` and before `CTFSection`.

Update `components/ui/FloatingNav.tsx` so `NAV_ITEMS` includes `{ id: "certifications", label: "Certifications", Icon: Award }` after Experience and before CTF. Keep the existing icon-only dock and accessible label pattern.

Preserve mobile density by adding a CSS class or item flag that can hide only the Certifications dock item at very narrow widths if eight 40px tap targets plus dock padding exceed `calc(100vw - 32px)`. The section must remain in document flow and the anchor must remain usable even if the mobile dock omits the item.
</action>
<acceptance_criteria>
- `app/page.tsx` contains `import { CertificationsSection }`
- In `app/page.tsx`, `ExperienceSection` appears before `CertificationsSection`
- In `app/page.tsx`, `CertificationsSection` appears before `CTFSection`
- `components/ui/FloatingNav.tsx` imports `Award`
- `components/ui/FloatingNav.tsx` contains `id: "certifications"`
- `components/ui/FloatingNav.tsx` contains `label: "Certifications"`
- `components/ui/FloatingNav.module.css` contains an explicit narrow viewport rule for the certifications nav item or the dock width is proven to fit at `360x740`
- production smoke at `360x740` reports `document.documentElement.scrollWidth <= window.innerWidth`
</acceptance_criteria>
<verify>
- `rg "CertificationsSection|ExperienceSection|CTFSection" app/page.tsx`
- `rg "Award|id: \"certifications\"|label: \"Certifications\"" components/ui/FloatingNav.tsx`
- production browser smoke checks nav fit at `360x740`
</verify>
<done>
The page section order is correct, the certifications anchor is observed by nav when present, and the dock does not clip or overflow on narrow mobile.
</done>
</task>

<task id="3" type="execute">
<title>Sharpen project proof content and rendering</title>
<files>
- `types/index.ts`
- `content/data/projects.json`
- `components/ui/ProjectCard.tsx`
- `components/ui/ProjectCard.module.css`
- `components/sections/ProjectsSection.tsx`
</files>
<read_first>
- `AGENTS.md`
- `.planning/PROJECT.md`
- `.planning/REQUIREMENTS.md`
- `.planning/ROADMAP.md`
- `.planning/STATE.md`
- `.planning/codebase/ARCHITECTURE.md`
- `.planning/codebase/STRUCTURE.md`
- `.planning/codebase/CONVENTIONS.md`
- `node_modules/next/dist/docs/01-app/03-api-reference/01-directives/use-client.md`
- `node_modules/next/dist/docs/01-app/01-getting-started/11-css.md`
- `content/data/projects.json`
- `types/index.ts`
- `components/ui/ProjectCard.tsx`
- `components/ui/ProjectCard.module.css`
- `components/sections/ProjectsSection.tsx`
- `.planning/phases/01-finish-content-shell/01-CONTEXT.md`
- `.planning/phases/01-finish-content-shell/01-UI-SPEC.md`
</read_first>
<action>
Extend `Project` with optional `proofLabel`, `role`, `year`, and `scope` fields.

Update the three entries in `content/data/projects.json`:
- RedCalibur description: `In-progress AI-assisted VAPT automation framework for reconnaissance, findings triage, and report scaffolding during practical assessments.`
- Axec-CLI description: `Rust CLI for installing, updating, and managing AppImages on Linux with a terminal-first workflow.`
- L3m0nCTF Infrastructure description: `Organizer-built CTFd infrastructure on GCP with Docker, Nginx, and Linux operations for L3m0nCTF 2025.`
- Generic GitHub URLs use `"proofLabel": "GitHub profile"`.

Update `ProjectCard` so it accepts and displays optional metadata chips for `role`, `year`, and `scope`, and displays the source/proof link label from `proofLabel` instead of always `View Source`.

Update `ProjectsSection` to pass the new fields to `ProjectCard` and label the secondary project action as `GitHub profile` when `proofLabel` is that value. Keep all filters unchanged.
</action>
<acceptance_criteria>
- `types/index.ts` contains `proofLabel?: string`
- `types/index.ts` contains `role?: string`
- `types/index.ts` contains `scope?: string`
- `content/data/projects.json` contains `In-progress AI-assisted VAPT automation framework`
- `content/data/projects.json` contains `Rust CLI for installing, updating, and managing AppImages`
- `content/data/projects.json` contains `Organizer-built CTFd infrastructure on GCP`
- `content/data/projects.json` contains `"proofLabel": "GitHub profile"`
- `components/ui/ProjectCard.tsx` contains `proofLabel`
- `components/sections/ProjectsSection.tsx` still contains labels `All`, `Security`, `Tools`, `Infrastructure`, `CTF`, and `WIP`
- rendered RedCalibur, Axec-CLI, and L3m0nCTF cards remain visible in the `All` filter
- rendered project cards show visible status badges and metadata chips when `role`, `year`, or `scope` exist
- rendered generic GitHub profile links display `GitHub profile`, not `View Source` or `SOURCE`
- project proof links use `target="_blank"` and `rel="noopener noreferrer"`
</acceptance_criteria>
<verify>
- `rg "proofLabel\\?: string|role\\?: string|scope\\?: string" types/index.ts`
- `rg "In-progress AI-assisted VAPT automation framework|Rust CLI for installing, updating, and managing AppImages|Organizer-built CTFd infrastructure on GCP|\\\"proofLabel\\\": \\\"GitHub profile\\\"" content/data/projects.json`
- `rg "proofLabel|role|year|scope|noopener noreferrer|target=\" components/ui/ProjectCard.tsx components/sections/ProjectsSection.tsx`
- production browser smoke checks all three flagship project titles are visible in the All filter
</verify>
<done>
Project copy is specific and honest, proof labels are conservative, metadata is visible without breaking filters, and external project links are safe.
</done>
</task>

<task id="4" type="verify">
<title>Verify Phase 1 implementation</title>
<files>
- changed implementation files
- optional temporary smoke script in `/tmp`
</files>
<read_first>
- `AGENTS.md`
- `.planning/PROJECT.md`
- `.planning/REQUIREMENTS.md`
- `.planning/ROADMAP.md`
- `.planning/STATE.md`
- `.planning/codebase/TESTING.md`
- `.planning/codebase/TESTING.md`
- `.planning/phases/01-finish-content-shell/01-UI-SPEC.md`
- `package.json`
</read_first>
<action>
Run:
- `npm run lint`
- `npx tsc --noEmit`
- `npm run build`
- production browser smoke against `npm run start`, checking `#certifications`, project filters, no console errors, and mobile/desktop layout sanity.
</action>
<acceptance_criteria>
- `npm run lint` exits 0
- `npx tsc --noEmit` exits 0
- `npm run build` exits 0
- browser smoke confirms `#certifications` exists after `#experience` and before `#ctf`
- browser smoke covers `1440x900`, `1280x800`, `768x1024`, `390x844`, and `360x740`
- browser smoke reports no horizontal overflow at every listed viewport
- browser smoke reports no clipped or overlapping text in Certifications cards, project cards, status badges, filter buttons, and FloatingNav
- browser smoke confirms FloatingNav does not obscure readable content in Certifications, CTF, or Contact
- keyboard tab smoke reaches project filters, project links, credential links if any, and visible nav items with a visible focus outline
- reduced-motion smoke confirms smooth scrolling is disabled or equivalent behavior remains accessible
- browser console has no errors during the smoke run
</acceptance_criteria>
<verify>
- `npm run lint`
- `npx tsc --noEmit`
- `npm run build`
- production browser smoke via `npm run start`
</verify>
<done>
All static checks and production browser checks pass for the full UI spec viewport and accessibility gate.
</done>
</task>

</tasks>

<verification>
- Confirm `CONT-07` through rendered certifications and education badges.
- Confirm `CONT-09` through sharper project copy, honest status, and conservative proof labels.
- Run lint, typecheck, production build, and production browser smoke.
</verification>

<success_criteria>
- Certifications render from JSON as a polished section.
- Floating navigation and section flow include certifications without breaking existing sections.
- Flagship project descriptions are specific, honest, and scannable.
- Desktop/mobile validation shows no overlap, clipping, or horizontal overflow in changed UI.
</success_criteria>
