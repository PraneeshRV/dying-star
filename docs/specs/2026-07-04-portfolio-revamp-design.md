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

## Amendments — 2026-07-04 Gemini 3.1 Pro adversarial review

All 15 findings adjudicated (`docs/specs/2026-07-04-spec-review-gemini.md`);
14 accepted, #3/#4 merged into a broader cut:

1. **Mobile = static hero image, desktop = 3D** (resolves findings 2, 13, 14).
   Reduced-motion/WebGL/mobile checks happen at parent level in `page.tsx`
   BEFORE the dynamic import mounts — fallback path never fetches Three.js.
2. `SpaceCanvas` loads via `next/dynamic` `ssr:false` with `StarFallback`
   as loading state (finding 1).
3. **All 6 verify-space scripts killed** + `verify:system` wiring +
   `content/data/space-asset-ledger.json` pruned (findings 3, 4 broadened).
   Verify = `biome check && tsc --noEmit && next build`.
4. Deletion ordering: gimmick UI components (GlitchText, TypewriterText,
   CustomCursor, FloatingNav) die in Phase 2 with their consuming sections,
   not Phase 0. `app/layout.tsx` CustomCursor mount and
   `components/3d/index.ts` barrel exports pruned in the same commits as
   their targets (findings 5, 6, 7).
5. `app/globals.css`: legacy cyan/purple tokens + glow utilities stripped in
   Phase 1 token work; all accents map to ember + grayscale ramp (finding 8).
6. Route is **`/blog`** (matches MASTERPLAN + existing content dir); spec
   references to `/writeups` are superseded (finding 9).
7. `/resume`: hide PDF iframe under 768px, show download CTA (finding 10).
8. **Research section hierarchy inverted** (finding 11): tier 1 = AI red team
   work — LLM vulns, prompt injection, RedCalibur, AI security research;
   tier 2 "Foundations" = HTB/THM/pwn.college telemetry.
9. Dead `reducedMotion` state/action removed from `stores/globalStore.ts`
   (finding 12).
10. BootLoader progress state throttled to per-line updates, visuals
    unchanged (finding 15).

## Out of scope

- Explorable sandbox world (archived, may return post-ship as separate route).
- Blog engine changes beyond wiring `/writeups` to existing content.
- CMS, analytics changes, new dependencies unless a section genuinely needs one.
