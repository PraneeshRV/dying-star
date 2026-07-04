# Portfolio Revamp — Mission Control Design Spec

Date: 2026-07-04
Status: approved direction, pending user spec review
Branch: `revamp/mission-control` (new branch off main; old site preserved in history)

## Goal

Replace current site (AI-slop feel) with restrained "Mission Control" design:
the site is an instrument observing a dying star. Space theme stays. Sandbox
world ambition is cut to ONE cinematic hero scene. Audience: AI red team /
offensive security recruiters.

## Aesthetic direction — Mission Control

- Palette: near-black base (#0A0A0C-ish), single ember/orange accent drawn from
  the star, muted gray text ramp. No neon green, no purple gradients.
- Type: strong grotesk for headings, monospace for telemetry labels/metadata
  ("TARGET: HTB", timestamps, section indices). Body: same grotesk, high
  legibility.
- Texture: thin 1px rules, sparse grid lines, data-density in cards. No
  glassmorphism, no glow-everything, no glitch effects.
- Motion: slow, physical, purposeful. Star rotates/pulses slowly. Scroll
  reveals are subtle fades/translates. `prefers-reduced-motion` honored
  everywhere (static star image fallback).

## Keep (salvage from current code)

- `components/ui/BootLoader.tsx` + module.css — boot sequence, loved. May
  restyle tokens to match new palette, behavior unchanged.
- `components/3d/NeutronStar.tsx`, `Starfield.tsx`, `SpaceCanvas.tsx` — trimmed
  to hero-only usage.
- Stack: Next 16, React 19, R3F, Tailwind 4, Biome, existing verify scripts
  (prune sandbox verify scripts that no longer apply).

## Kill (archive via branch history, delete on revamp branch)

- `components/ui/`: GlitchText, TypewriterText, CustomCursor, FloatingNav.
- `app/sandbox/` route, `components/sandbox/`, `components/game/`.
- `components/3d/`: DysonSphere, Megastructures, PlanetSurface, OrbitalBodies,
  OrbitalPlanets, Constellation, PathwayRemnants, SystemCamera, TacticalLabel,
  shatteredSystem, galaxyConfig (keep only what NeutronStar/Starfield/
  SpaceCanvas need — verify imports before deleting).
- `scripts/verify-sandbox-*.mjs`, `verify-shattered-system.mjs`,
  `verify-galaxy-contract.mjs` and their `package.json` wiring.
- Old section components get rewritten, not patched.

## Site structure

Single page + `/writeups` (existing blog content dir feeds it).

1. **Boot → Hero**: BootLoader masks 3D load. Hero: dying-star scene
   (NeutronStar + Starfield), name, role line "AI Red Team / Offensive
   Security", one CTA (contact or writeups). Parallax only; no camera controls.
2. **Research / Security**: AI red-teaming focus statement, CTF telemetry
   (HTB / TryHackMe / pwn.college stats sourced from vault), links to writeups.
3. **Projects**: 3–4 best only. Data-card style: mono metadata header + terse
   description + stack + link.
4. **Experience + Certifications**: compact telemetry table, one line each.
5. **Contact**: plain mailto + socials. No contact-form theatrics.

Content lives in `content/data/*.json` (or .ts) — components render data, no
hardcoded copy in JSX.

## Performance / quality bars

- 3D lazy-loads behind BootLoader; static image fallback for WebGL fail +
  reduced-motion.
- Lighthouse ≥90 all categories (mobile).
- `npm run verify` green (after pruning sandbox verify scripts).
- Responsive: 375px → desktop.
- Accessibility basics: focus states, contrast (ember on near-black must pass
  AA for text usage; accent-as-decoration exempt), semantic landmarks.

## Delegation map

| Actor | Work |
|---|---|
| Fable (orchestrator) | Spec, design tokens, hero 3D integration, all verification, merges |
| Sonnet subagents | Section components from spec + tokens |
| Haiku subagents | Deletions, mechanical migrations |
| Antigravity — Gemini 3.1 Pro high | Adversarial review of this spec + plan (before build) |
| Antigravity — Gemini 3.5 Flash high | Vault → `content/data/*.json` extraction (projects, certs, CTF stats), SEO meta, alt text |
| Antigravity — Opus 4.6 | Final diff review + browser visual QA (before merge) |

User drives Antigravity sessions at the marked checkpoints; Fable verifies all
subagent output personally (FABLE-PROTOCOL rule 4).

## Verification per phase

Every plan step carries a verify line. Phase gates:

- Phase 0 (branch + prune): `npm run lint && tsc --noEmit && npm run build` green with sandbox gone.
- Phase 1 (tokens + shell + boot/hero): build green + preview screenshot shows boot → hero.
- Phase 2 (sections + content): build green + snapshot shows all sections with real data.
- Phase 3 (polish + a11y + perf): Lighthouse ≥90, reduced-motion check, 375px screenshot.
- Phase 4 (reviews): Antigravity Opus findings fixed or explicitly rejected; merge.

## Out of scope

- Explorable sandbox world (archived, may return post-ship as separate route).
- Blog engine changes beyond wiring `/writeups` to existing content.
- CMS, analytics changes, new dependencies unless a section genuinely needs one.
