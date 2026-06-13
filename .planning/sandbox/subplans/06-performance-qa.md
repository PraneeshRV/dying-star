# Subplan 06 — Performance, QA & Ship Gates

**Phase:** S8, but every phase exits through these gates. Inherits `docs/superpowers/specs/2026-05-01-galaxy-qa-design.md`, scoped to the sandbox + the dual WebGPU/WebGL2 paths.

---

## 1. Hard gates (every phase, no exceptions)

- `npm run verify` (= `verify:system` chain + `lint` + `tsc --noEmit` + `build`).
- Production smoke against a **fresh `npm run start`** (NOT dev — `next dev` is flaky here).
- **Both render paths** checked: WebGPU-capable Chromium **and** forced WebGL2.
- Desktop, tablet, mobile, reduced-motion, no-WebGL/no-WebGPU.
- Canvas **pixel** validation, not just `<canvas>` existence.
- DOM navigation reaches every object + portfolio links.
- Asset ledger validation for every external/generated asset.

## 2. Viewport matrix

`1440×900` · `1280×800` · `768×1024` · `390×844` · `360×740`. Reduced-motion on ≥1 desktop + ≥1 mobile. No-WebGPU and no-WebGL simulated → fallback, never blank hero.

## 3. Canvas pixel checks

- Wait for boot/fallback visibility; assert canvas bbox nonzero + in viewport.
- Reject all-transparent / all-black / all-white / single-color frames.
- Sample after load and again after 800–1000 ms on normal-motion desktop; assert pixels changed where motion is expected.
- Reduced-motion → static or materially calmer (assert low delta).
- Mobile → simplified scene or fallback visible.
- Thresholds: ≥5 materially different color clusters in hero; near-black ≤85% of sampled hero pixels after load.
- **Dual-path:** run the color-cluster + motion checks on **both** WebGPU and forced-WebGL2 to catch TSL-fallback divergence.

## 4. Performance budgets

- DOMContentLoaded ≤ 3 s desktop production smoke.
- Non-blank canvas or visible fallback ≤ 2.5 s.
- No unexplained main-thread task > 200 ms during hero load (watch WebGPU `init()` + KTX2 transcode — keep off the critical path; procedural-first).
- Desktop ≥ 45–60 fps after load; mobile = simplified/fallback or stable 30 fps-class.
- DPR capped by tier; hidden/offscreen pauses or reduces animation.
- Asset transfer budgets per subplan 05.

## 5. Visual quality rubric (no dimension < 4 for a showcase phase)

Readability · Space Realism · Cohesion · Performance · Accessibility · Asset Governance — score 1–5 each (table in the approved QA spec). The "stylized-realism, per-object" bar means Space Realism = 4–5 on hero star/planet, ≥3 elsewhere, with Cohesion carried by the archival-sensor grade (subplan 04 §3).

## 6. Fallback gates

- No-WebGPU → WebGL2 path renders.
- No-WebGL → deterministic static poster.
- WebGPU device-lost / WebGL context-loss → visible fallback swap.
- GPU detection failure → treated as low tier.
- CDN/asset failure → procedural/static.
- Every fallback preserves brand, hero copy, section links, resume, contact.

## 7. Claude/reviewer reject checklist

Reject if it: uses old Next patterns without checking local Next 16 docs (`node_modules/next/dist/docs/`); passes lint/build but lacks production smoke; checks only `<canvas>` existence; checks only one render path; adds assets without source/license/provenance/fallback; makes 3D clicks the only navigation; regresses reduced-motion / no-WebGPU / no-WebGL / context-loss / mobile / keyboard; increases visual density without portfolio value; references ignored local texture/model files without a deployment strategy; fails to update verifiers/docs when contracts change.

## 8. Test harness additions

- Extend the Playwright production-smoke (already used for the home scene) with a `?renderMode=webgl2` / `?renderMode=static` query override (read in `capability.ts`) so CI can force each path deterministically without GPU flags.
- Add per-phase smoke specs under `scripts/` or a `tests/` dir; wire into `verify:system` where static-analyzable, keep pixel/browser checks as a documented manual+Playwright gate (no GPU in headless CI by default).
