# Phase 1: Finish Content Shell - Context

**Gathered:** 2026-04-28
**Status:** Ready for planning
**Mode:** auto-selected decisions with `--analyze`

<domain>

## Phase Boundary

Phase 1 completes the remaining M3 content shell work so the already-built portfolio reads as a complete MVP. The phase delivers a polished certifications/education section, improves flagship project proof and credibility, and validates responsive section quality.

This phase does not add the Resend API, terminal, Packet Runner, blog engine, SEO launch work, or WebGL fallback hardening. Those are later roadmap phases.

</domain>

<decisions>

## Implementation Decisions

### Certifications Section

- **D-01:** Add a real `CertificationsSection` powered by `content/data/certifications.json`; do not leave certifications as raw data only.
- **D-02:** Treat certifications/education as first-class portfolio proof, not a tiny subsection hidden inside About.
- **D-03:** Place Certifications after Experience and before CTF. This keeps the narrative: profile -> projects -> skills -> experience -> credentials -> competition proof -> contact.
- **D-04:** Use a stable section id: `certifications`.
- **D-05:** Add Certifications to `FloatingNav` with a concise label and icon, unless visual testing proves the dock becomes too crowded on mobile. If crowded, keep the section id and add in-section links while preserving existing nav usability.
- **D-06:** Display honest status badges. `in-progress` should read as active/current, not completed.

### Project Proof

- **D-07:** Improve existing project content in place instead of inventing new projects.
- **D-08:** Preserve the three current flagship projects as the core proof set: RedCalibur, Axec-CLI, and L3m0nCTF Infrastructure.
- **D-09:** Make descriptions more specific and outcome-oriented: what was built, what problem it solves, what technologies prove, and what status is honest.
- **D-10:** Do not fake live demos or repository URLs. If exact URLs are unavailable, label links conservatively or use the GitHub profile only as a fallback.
- **D-11:** Add lightweight proof metadata only if it improves display: highlights, role, year, proof links, or case-study hint. Keep schema changes small and typed.
- **D-12:** Keep project filtering. Do not add search, pagination, modal case studies, or new route pages in Phase 1.

### Visual Density and Layout

- **D-13:** Match the existing glass/terminal/cosmic visual language used by About, Projects, Skills, Experience, CTF, and Contact.
- **D-14:** Keep cards at restrained radii and avoid nested decorative card structures where a simple section layout works.
- **D-15:** Favor compact, scannable credential badges over a marketing-style hero block.
- **D-16:** Avoid adding new major animation systems in this phase. Hover/focus states and existing transitions are fine; scroll animation belongs to Phase 4.

### Responsive Quality

- **D-17:** Treat responsive polish as part of the phase deliverable, not a later cleanup.
- **D-18:** Validate desktop and mobile layouts for long certification titles, status badges, project descriptions, tech pills, and floating nav density.
- **D-19:** Production preview (`npm run start`) is the trusted browser validation path until the `next dev` issue is resolved in a later phase.

### the agent's Discretion

- Exact badge icon choices, minor wording, grid breakpoints, and card microcopy are delegated to the implementer, provided they remain consistent with the existing design system and the requirements above.
- The implementer may add small optional fields to `types/index.ts` and `content/data/*.json` if they reduce hard-coded content and improve proof quality.

</decisions>

<canonical_refs>

## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project Scope

- `.planning/PROJECT.md` - Current product vision, constraints, and active requirements.
- `.planning/REQUIREMENTS.md` - Phase 1 requirements `CONT-07` and `CONT-09`.
- `.planning/ROADMAP.md` - Phase 1 boundary, success criteria, and out-of-scope later phases.
- `.planning/STATE.md` - Current implementation snapshot and known verification state.

### Codebase Map

- `.planning/codebase/ARCHITECTURE.md` - App Router, server/client component boundaries, section composition, and data flow.
- `.planning/codebase/STRUCTURE.md` - Current file layout and where section/data changes belong.
- `.planning/codebase/CONVENTIONS.md` - TypeScript, Tailwind, CSS module, and component conventions.
- `.planning/codebase/TESTING.md` - Current verification commands and browser smoke expectations.
- `.planning/codebase/CONCERNS.md` - Known issues, including dev-server behavior and UI/content gaps.

### Research

- `.planning/research/SUMMARY.md` - Phase 1 implications: certifications, project proof, responsive checks, avoid architecture churn.
- `.planning/research/FEATURES.md` - Portfolio feature expectations and Phase 1 proof priorities.
- `.planning/research/ARCHITECTURE.md` - Target architecture for content sections and future phases.

### Source Files

- `app/page.tsx` - Home section composition and insertion point for Certifications.
- `components/sections/ProjectsSection.tsx` - Current project rendering and filter behavior.
- `components/ui/ProjectCard.tsx` - Reusable project card and existing card interaction pattern.
- `components/ui/FloatingNav.tsx` - Current nav item list and section id tracking.
- `content/data/certifications.json` - Source data for certifications/education.
- `content/data/projects.json` - Source data for flagship projects.
- `types/index.ts` - Shared content types to extend if needed.

</canonical_refs>

<code_context>

## Existing Code Insights

### Reusable Assets

- `components/ui/GlitchText.tsx`: Use for the Certifications heading to match other sections.
- `components/ui/Button.tsx`: Use only if a credential/project proof link needs a command-style action.
- `components/ui/ProjectCard.tsx`: Reuse or lightly extend for stronger project proof rather than replacing the project gallery.
- `components/ui/FloatingNav.tsx`: Add a certifications item if the dock remains usable.
- `content/data/certifications.json`: Already contains PJPT and B.Tech CSE Cybersecurity entries with status, year, description, and focus tags.

### Established Patterns

- Sections live in `components/sections/*Section.tsx` and are composed in `app/page.tsx`.
- Static portfolio content lives in `content/data/*.json` and is imported into section components.
- Server Components are preferred unless a component needs hooks, browser APIs, pointer events, or interactive filters.
- Existing sections use Tailwind v4 tokens, `glass-panel` / `glass-terminal`, and constrained max-width containers.
- Existing proof sections use stable ids for nav and anchor scrolling.

### Integration Points

- Add `components/sections/CertificationsSection.tsx`.
- Import and place `CertificationsSection` in `app/page.tsx` after `ExperienceSection`.
- Update `components/ui/FloatingNav.tsx` if certifications becomes a nav item.
- Extend `types/index.ts` with a `Certification` shape if typed imports are useful.
- Update `content/data/projects.json` and project rendering only within the existing project gallery scope.

</code_context>

<specifics>

## Specific Ideas

- Certifications should feel like clearance/credential badges, but still be honest and readable.
- `PJPT` is in progress, so the UI should not imply completion.
- `B.Tech CSE Cybersecurity` is education/credential proof and can live in the same section.
- RedCalibur should be framed as an in-progress AI-assisted VAPT automation framework, not a finished commercial product.
- L3m0nCTF infrastructure should emphasize GCP, Docker, CTFd, Nginx, Linux operations, and organizer/infrastructure role.
- Axec-CLI should emphasize Rust, Linux, AppImage management, and CLI utility value.

</specifics>

<deferred>

## Deferred Ideas

- Resend-backed contact form - Phase 2.
- WebGL fallback hardening and dev-server investigation - Phase 3.
- Scroll animation and terminal overlay - Phase 4.
- Packet Runner - Phase 5.
- Blog/case-study routes or full writeups - Phase 6.
- SEO, analytics, and launch docs - Phase 7.

</deferred>

---

*Phase: 01-finish-content-shell*
*Context gathered: 2026-04-28*
