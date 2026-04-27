# Phase 1: Finish Content Shell - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-04-28
**Phase:** 1 - Finish Content Shell
**Mode:** `$gsd-discuss-phase 1 --auto --analyze --chain`
**Areas discussed:** Certifications Section, Project Proof, Visual Density and Layout, Responsive Quality

---

## Certifications Section

| Option | Description | Selected |
|--------|-------------|----------|
| First-class section | Add `CertificationsSection` with stable id and nav integration. Best for recruiter proof and roadmap requirement `CONT-07`. | yes |
| Fold into About | Smaller change, but hides credential proof and weakens scannability. | |
| Fold into Experience | Keeps timeline compact, but makes certification status harder to compare. | |

**Auto choice:** First-class section.
**Trade-off analysis:** First-class section costs one new component and possibly one nav item, but gives credentials enough surface area to satisfy `CONT-07`. Folding into existing sections is cheaper but would keep the MVP feeling incomplete.

---

## Project Proof

| Option | Description | Selected |
|--------|-------------|----------|
| Strengthen existing cards | Improve existing three project entries and lightly extend card/data shape if needed. | yes |
| Add many more cards | More volume, but risks shallow proof and fake-looking content. | |
| Build case-study routes now | Stronger proof, but belongs with blog/case-study work in a later phase. | |

**Auto choice:** Strengthen existing cards.
**Trade-off analysis:** Phase 1 should deepen proof, not broaden scope. Existing `ProjectsSection` and `ProjectCard` already provide the right surface; the missing piece is sharper content and honest status/context.

---

## Visual Density and Layout

| Option | Description | Selected |
|--------|-------------|----------|
| Compact credential badges | Scannable, consistent with operational portfolio UI, low layout risk. | yes |
| Large marketing band | More dramatic, but off-pattern and risks competing with hero/3D scene. | |
| Dense table | Efficient, but less polished for a visual portfolio. | |

**Auto choice:** Compact credential badges.
**Trade-off analysis:** Certifications should communicate credibility quickly. Badge/card hybrids fit the current glass-terminal system without turning Phase 1 into a redesign.

---

## Responsive Quality

| Option | Description | Selected |
|--------|-------------|----------|
| Validate as phase acceptance | Include desktop/mobile checks and fix overlap/clipping during Phase 1. | yes |
| Defer to launch polish | Saves time now, but risks carrying broken section layout into later phases. | |
| Only rely on build/lint | Too weak for UI content polish. | |

**Auto choice:** Validate as phase acceptance.
**Trade-off analysis:** Long certification names, status badges, tech pills, and nav density are likely failure points. Build and typecheck cannot catch those problems, so responsive validation belongs in this phase.

---

## the agent's Discretion

- Exact badge icons, minor copy, grid breakpoints, and small optional content-schema fields are delegated to implementation.

## Deferred Ideas

- Contact API, WebGL fallback, terminal, game, blog/case-study routes, SEO, analytics, and launch work remain in later roadmap phases.
