---
phase: 1
slug: finish-content-shell
status: draft
shadcn_initialized: false
preset: none
created: 2026-04-28
---

# Phase 1 - UI Design Contract

> Visual and interaction contract for completing the content shell: certifications UI, sharper project proof, floating nav density, responsive validation, and accessibility.

---

## Design System

| Property | Value |
|----------|-------|
| Tool | none - existing manual Tailwind CSS v4 tokens plus CSS modules |
| Preset | not applicable |
| Component library | none - use existing custom components and section patterns |
| Icon library | lucide-react |
| Font | Orbitron for display headings, DM Sans for body, JetBrains Mono for labels/actions/data, Cinzel only where already established |

Source: `.planning/PROJECT.md`, `.planning/REQUIREMENTS.md`, `.planning/phases/01-finish-content-shell/01-CONTEXT.md`, `app/globals.css`, `app/layout.tsx`, and `components/ui/*`.

No `components.json` or `tailwind.config.*` is present. Do not initialize shadcn in this phase because the write scope is limited to the UI spec and source implementation must preserve the existing custom glass/terminal/cosmic language.

---

## Spacing Scale

Declared values (must be multiples of 4):

| Token | Value | Usage |
|-------|-------|-------|
| xs | 4px | Icon gaps, active nav dot, compact separators |
| sm | 8px | Filter gaps, pill padding, compact card internals |
| md | 16px | Default content gaps, mobile section padding, card internal stacks |
| lg | 24px | Card padding, section header gaps, desktop grid gaps |
| xl | 32px | Section header to content gap, mobile section rhythm |
| 2xl | 48px | Major content groups within a section |
| 3xl | 64px | Page-level breaks when a section needs extra breathing room |

Exceptions:
- Existing section vertical padding remains `96px` mobile and `128px` desktop where sections already use `py-24 sm:py-32`.
- Floating nav icon targets must remain at least `44px` on desktop and at least `40px` on narrow mobile; do not shrink below `40px` to fit the new Certifications item.
- Card border radius must stay restrained: `2px` for buttons/pills/status tags, `4px` preferred for cards, `8px` maximum for grouped controls or fallback panels.

---

## Typography

Use exactly these Phase 1 sizes for new or modified content surfaces:

| Role | Size | Weight | Line Height |
|------|------|--------|-------------|
| Body | 16px | 400 | 1.5 |
| Label | 12px | 600 | 1.4 |
| Heading | 32px | 600 | 1.2 |
| Display | 36px | 600 | 1.15 |

Rules:
- Body copy uses DM Sans. Labels, statuses, filter controls, nav tooltips, and proof metadata use JetBrains Mono.
- Section headings use Orbitron through the existing `GlitchText` pattern.
- Do not add viewport-scaled typography. Use breakpoint-based Tailwind sizes only where existing section headings already do this.
- Long certification titles and project descriptions must wrap naturally without clipping; do not force single-line titles except for short status pills.

---

## Color

| Role | Value | Usage |
|------|-------|-------|
| Dominant (60%) | `#000005` / `#03000d` | Page background, section bands, terminal void surfaces |
| Secondary (30%) | `#0a0a1a` / `rgba(10, 10, 26, 0.6)` | Glass cards, floating nav dock, proof panels, project metadata bars |
| Accent (10%) | `#00ff88` | Active nav state, focus ring, section eyebrow, primary proof action, current/in-progress status indicator |
| Destructive | `#ff3366` | Destructive actions only; Phase 1 has no destructive actions |

Accent reserved for:
- Active FloatingNav item and active dot.
- Focus-visible outlines.
- Section eyebrow text such as `credential vault / certifications`.
- Primary proof action when a real project or credential URL exists.
- Honest current/in-progress status markers.

Secondary semantic colors:
- `#8b5cf6` and `#a78bfa` for glass borders, secondary actions, and nebula/nav chrome.
- `#7dd3fc` for tech stack and focus-area pills.
- `#f5a623` for WIP/in-progress statuses when green would imply completion.

Do not introduce a new palette in Phase 1. Keep the page dark-cosmic with green/purple/blue highlights, not a one-hue green terminal wall.

---

## Copywriting Contract

| Element | Copy |
|---------|------|
| Primary CTA | View proof |
| Empty state heading | No signal found |
| Empty state body | This filter has no public proof yet. Switch filters or check back after the next project drop. |
| Error state | Proof link unavailable. Use the GitHub profile or resume while a direct source is being prepared. |
| Destructive confirmation | none - Phase 1 does not include destructive actions |

Required copy specifics:
- Certifications heading: `CERTIFICATIONS`.
- Certifications eyebrow: `credential vault / certifications`.
- PJPT status must read `In progress` or `Active track`, never `Certified`, `Completed`, or equivalent.
- B.Tech status must read `In progress` or `2023-2027`, never imply graduation.
- Generic GitHub profile fallbacks must be labeled `GitHub profile`; reserve `Source` for repository-specific links.
- RedCalibur must be framed as an in-progress AI-assisted VAPT automation framework.
- Axec-CLI must emphasize Rust, Linux, AppImage management, and terminal utility.
- L3m0nCTF Infrastructure must emphasize GCP, Docker, CTFd, Nginx, Linux operations, and organizer/infrastructure role.

---

## Registry Safety

| Registry | Blocks Used | Safety Gate |
|----------|-------------|-------------|
| shadcn official | none | not required - shadcn is not initialized |
| third-party registries | none | no third-party registry code allowed in Phase 1 |

Safety gate evidence: `components.json` absent on 2026-04-28; no registry blocks declared; no `npx shadcn add` or `npx shadcn view` required.

---

## Phase Scope

Phase 1 owns only:
- A first-class Certifications section powered by `content/data/certifications.json`.
- Sharper proof display for the existing RedCalibur, Axec-CLI, and L3m0nCTF Infrastructure project cards.
- FloatingNav density decisions for the new `certifications` section anchor.
- Responsive, keyboard, screen-reader, and reduced-motion validation for the changed sections.

Phase 1 does not own:
- Resend contact API, form success/error workflow, or spam controls.
- Terminal overlay, Packet Runner, blog/case-study routes, SEO launch assets, or new animation systems.
- WebGL fallback hardening beyond preserving existing readable content and reduced-motion behavior.

---

## Certifications Section Contract

| Property | Contract |
|----------|----------|
| Component | `components/sections/CertificationsSection.tsx` |
| Section id | `certifications` |
| Placement | After `ExperienceSection` and before `CTFSection` |
| Data source | `content/data/certifications.json` |
| Heading | Existing `GlitchText` pattern with `CERTIFICATIONS` |
| Visual model | Credential/clearance badges inside glass panels, not a marketing hero |
| Layout | One column on mobile; two-column grid from medium widths when two or more entries exist |
| Card radius | 4px preferred, 8px maximum |
| Card padding | 24px desktop, 16px mobile |
| Icons | lucide `Award`, `GraduationCap`, `ShieldCheck`, or `BadgeCheck`; decorative icons use `aria-hidden="true"` |

Each credential card must show:
- Title.
- Issuer.
- Year or range.
- Text status.
- Description.
- Focus tags from `focus`.

Visual rules:
- Status must be text plus color, never color alone.
- In-progress credentials use gold or green-dim treatment without implying completion.
- Focus tags use the existing blue tech-pill language.
- Do not nest card-like panels inside each credential card. Use separators, rows, or simple inline groups for metadata.
- Do not add scroll-triggered animation. Hover/focus glow is acceptable and must respect reduced motion.

---

## Project Proof Contract

Keep the existing filterable Projects section and `ProjectCard` interaction pattern. Phase 1 may lightly extend content shape and rendering, but must not add search, pagination, modals, or route-level case studies.

Required project proof display:
- The three flagship projects remain visible in the `All` filter: RedCalibur, Axec-CLI, L3m0nCTF Infrastructure.
- Each card shows a sharper description with concrete domain, problem, technologies, and honest status.
- Status badges stay visible above the fold of each project card and are never replaced by color-only indicators.
- Technology pills wrap without increasing card width.
- If optional proof metadata is added, limit it to scannable chips such as role, year, scope, or proof type.
- If links are generic profile URLs, the UI label must say `GitHub profile`; do not present them as repository source links.
- Do not create fake demo, repo, writeup, or case-study links.

Recommended project copy baseline:
- RedCalibur: `In-progress AI-assisted VAPT automation framework for reconnaissance, findings triage, and report scaffolding during practical assessments.`
- Axec-CLI: `Rust CLI for installing, updating, and managing AppImages on Linux with a terminal-first workflow.`
- L3m0nCTF Infrastructure: `Organizer-built CTFd infrastructure on GCP with Docker, Nginx, and Linux operations for L3m0nCTF 2025.`

---

## Floating Nav Contract

Default desktop order:
1. Home
2. About
3. Projects
4. Skills
5. Experience
6. Certifications
7. CTF
8. Contact

Contract:
- The Certifications item uses a lucide credential icon such as `Award` or `BadgeCheck`.
- The target anchor is `#certifications`.
- The accessible label is `Navigate to Certifications section`.
- The active observer must include `certifications` when the item is present.
- The dock must fit inside `calc(100vw - 32px)` with no clipped item, tooltip, or active dot.
- On narrow mobile widths, prefer preserving tap target size over forcing eight items into the dock. If the dock exceeds the viewport at `360px`, hide the Certifications item from the mobile dock while keeping the section id and normal document flow.
- Do not replace icons with text chips inside the dock.

---

## Responsive Contract

Validate these viewports against production preview (`npm run build` then `npm run start`), because `next dev` is currently documented as unreliable:

| Viewport | Required Result |
|----------|-----------------|
| 1440x900 | Certifications sits cleanly between Experience and CTF; project cards align without large empty gaps |
| 1280x800 | FloatingNav does not cover active section content or clip tooltips |
| 768x1024 | Certifications cards form a readable tablet layout; project filters wrap cleanly |
| 390x844 | Single-column credentials, project cards, filter buttons, and nav fit without horizontal scroll |
| 360x740 | Long certification titles, status pills, project descriptions, and tech pills wrap without overlap |

Hard requirements:
- No horizontal page overflow at any listed viewport.
- No text overlap inside cards, pills, buttons, nav tooltips, or status badges.
- No layout jump when project filters change.
- Credential and project cards keep stable dimensions while hover/focus effects run.
- Bottom FloatingNav must not obscure the final line of readable content in Certifications, CTF, or Contact.

---

## Accessibility Contract

Required semantics:
- Certifications section uses `<section id="certifications" aria-labelledby="certifications-heading">`.
- The heading id is stable: `certifications-heading`.
- Credential entries render as semantic cards (`article` or list items) with real text content.
- Decorative icons have `aria-hidden="true"`.
- External proof links open safely with `target="_blank"` and `rel="noopener noreferrer"` where applicable.

Required interaction behavior:
- Keyboard users can reach project filters, project proof links, credential proof links if any, and FloatingNav items.
- Focus-visible styling remains the global green 2px outline or an equivalent with at least equal contrast.
- Active/current/in-progress states are conveyed through text and accessible names, not color alone.
- Reduced-motion users receive no tilt-dependent or scroll-animation-dependent information.
- FloatingNav smooth scrolling uses reduced-motion-aware behavior.
- The 3D scene and orbital navigation remain enhancement only; all Phase 1 content must be reachable through DOM scrolling and links.

---

## Visual Constraints

Use the existing glass/terminal/cosmic portfolio language:
- `glass-panel` and `glass-terminal` surfaces.
- Dark void backgrounds.
- Purple glass borders and green active/focus glow.
- Blue tech/focus tags.
- Monospace terminal labels for metadata.
- Restrained card radii and compact, scannable proof density.

Avoid:
- New landing-page hero blocks.
- Nested decorative cards.
- Large marketing copy panels.
- New gradient-orb or bokeh decorations.
- New major animation libraries or scroll animation systems.
- Inflated security claims, fake source links, fake demos, or fake completion statuses.

---

## UI Acceptance Criteria

- `#certifications` renders after `#experience` and before `#ctf` on the home page.
- All entries from `content/data/certifications.json` render with title, issuer, status, year/range, description, and focus tags.
- PJPT and B.Tech CSE Cybersecurity are visibly marked in progress/current, not completed.
- Project filtering still works for `All`, `Security`, `Tools`, `Infrastructure`, `CTF`, and `WIP`.
- RedCalibur, Axec-CLI, and L3m0nCTF Infrastructure have specific proof-oriented descriptions and honest statuses.
- Generic GitHub profile links are labeled as profile links; repository/source labels are used only for repository-specific URLs.
- FloatingNav includes Certifications on viewports where eight items fit without clipping, or deliberately omits it on narrow mobile while preserving the section anchor and document flow.
- Keyboard tab order reaches project filters, project links, credential links if present, and visible nav items with a visible focus ring.
- No changed UI depends on hover, color, canvas, or animation as the only way to access information.
- Desktop and mobile checks at 1440x900, 1280x800, 768x1024, 390x844, and 360x740 show no horizontal overflow, clipped text, or overlapping nav/content.
- `npm run lint`, `npx tsc --noEmit`, `npm run build`, and production browser smoke against `npm run start` remain the implementation verification gate for this phase.

---

## Pre-Populated From

| Source | Decisions Used |
|--------|----------------|
| `.planning/phases/01-finish-content-shell/01-CONTEXT.md` | certifications placement/id/nav policy, project proof rules, visual density, responsive expectations |
| `.planning/REQUIREMENTS.md` | `CONT-07`, `CONT-09`, responsive/mobile/a11y launch direction |
| `.planning/ROADMAP.md` | Phase 1 scope and success criteria |
| `.planning/codebase/*.md` | component locations, section composition, static JSON pattern, verification path |
| `app/globals.css` | colors, fonts, glass utilities, focus rings, reduced-motion policy |
| `components/ui/*` | ProjectCard, FloatingNav, Button, GlitchText visual contracts |
| `content/data/*.json` | concrete certifications and flagship project content |
| User prompt | required coverage areas and write scope |

---

## Checker Sign-Off

- [ ] Dimension 1 Copywriting: PASS
- [ ] Dimension 2 Visuals: PASS
- [ ] Dimension 3 Color: PASS
- [ ] Dimension 4 Typography: PASS
- [ ] Dimension 5 Spacing: PASS
- [ ] Dimension 6 Registry Safety: PASS

**Approval:** pending
