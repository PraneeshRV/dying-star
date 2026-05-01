# Galaxy QA And Evaluation Design

## Status

Companion spec for `2026-05-01-black-hole-galaxy-design.md`. Awaiting user review before implementation planning.

## Goal

Make the future 3D showcase reviewable by objective gates, not only subjective taste.

Claude or a human reviewer should be able to reject a change with concrete evidence:

- Broken fallback.
- Blank canvas.
- Asset license gap.
- Mobile overflow.
- Accessibility regression.
- Excessive asset budget.
- Missing production smoke.
- Visual density that hurts portfolio comprehension.

## Hard Gates

Any 3D galaxy implementation must pass:

- `npm run verify`
- `npm run lint`
- `npx tsc --noEmit`
- `npm run build`
- Production smoke against a fresh `npm run start`, not stale dev state.
- Desktop, tablet, mobile, reduced-motion, and no-WebGL checks.
- Canvas pixel validation, not just canvas existence.
- DOM navigation to every portfolio section.
- Asset ledger validation for every external/generated asset.

## Viewport Matrix

Required viewport checks:

- `1440x900`
- `1280x800`
- `768x1024`
- `390x844`
- `360x740`

Reduced motion should be checked on at least one desktop and one mobile viewport.

No-WebGL simulation should render fallback, not blank hero.

## Canvas Pixel Checks

Canvas tests should:

- Wait for boot completion or fallback visibility.
- Assert canvas bounding box is nonzero and in viewport.
- Reject all-transparent, all-black, all-white, or single-color frames.
- Sample after load and again after 500-1000ms on normal-motion desktop.
- Confirm animation changes pixels only where motion is expected.
- Confirm reduced-motion is static or materially calmer.
- Confirm mobile simplified scene or fallback is visible.

Initial visual threshold:

- At least 5 materially different color clusters in the hero canvas.
- Near-black should not occupy more than 85% of sampled hero pixels after load unless fallback design explicitly accounts for it.

## Visual Quality Rubric

Score each dimension from 1 to 5.

Passing target: no dimension below 4 for a visual showcase phase.

| Dimension | 1 | 3 | 5 |
| --- | --- | --- | --- |
| Readability | Portfolio content is obscured | Content is reachable but visually noisy | Projects, Skills, Resume, Contact remain obvious |
| Space Realism | Flat toy-like objects | Some depth and material cues | Strong depth, lighting, surfaces, atmosphere, scale cues |
| Cohesion | Mixed asset-pack look | Mostly consistent | One archival sensor art lens unifies everything |
| Performance | Jank, blank frames, long blocking work | Acceptable on desktop only | Scales cleanly by GPU/mobile/reduced motion |
| Accessibility | Canvas-only or hover-only | DOM fallback exists but weak | DOM navigation, keyboard, reduced motion, fallback all complete |
| Asset Governance | Missing source/license | Source recorded inconsistently | Full ledger, attribution, budget, fallback |

## Performance Budgets

Initial local budgets:

- DOMContentLoaded within 3s on desktop Chromium production smoke.
- Hero reaches nonblank canvas or visible fallback within 2.5s.
- No unexplained main-thread task over 200ms during initial hero load.
- Desktop perceived motion target: 45-60 fps after load.
- Mobile target: simplified scene/fallback or stable 30 fps-class behavior.
- Renderer DPR capped by tier.
- Hidden/offscreen state pauses or materially reduces animation.

Asset budgets are defined in `2026-05-01-asset-pipeline-design.md`.

## Accessibility Gates

Required:

- DOM nav reaches every section.
- Keyboard tab order reaches hero CTAs, nav, project filters/cards, resume/contact links, and any terminal/free-fly controls.
- Canvas labels have DOM equivalents.
- No hover-only critical information.
- Reduced-motion disables camera flights and free-fly prompts.
- Mobile uses DOM map/list for destinations instead of precision mesh picking.
- No horizontal overflow at required mobile widths.

## Fallback Gates

Required:

- No-WebGL renders deterministic fallback.
- WebGL context loss swaps to visible fallback.
- GPU detection failure is treated as low capability.
- CDN/asset failure falls back to procedural/static visuals.
- Fallback preserves brand, hero copy, section links, resume, and contact.

## Claude Review Checklist

Reject the implementation if it:

- Uses old Next/router/API patterns without checking local Next 16 docs.
- Passes lint/build but lacks production browser smoke.
- Checks only `<canvas>` existence.
- Adds assets without source/license/attribution/provenance.
- Makes 3D clicks the only way to navigate.
- Regresses reduced motion, no-WebGL, context loss, mobile, or keyboard.
- Increases visual density without improving portfolio value.
- References ignored local texture/model files without deployment strategy.
- Fails to update verifiers/docs when scene contracts change.

## Residual Risks To Track

- Planning docs may need reconciliation before implementation planning.
- Contact API remains a separate security-sensitive roadmap item.
- Terminal/game/blog features should not be mixed into the first galaxy implementation phase.
- Global state should not become a dumping ground for galaxy, terminal, game, and contact state.

