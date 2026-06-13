# Subplan 04 — Camera, Tours, UX & Post-Processing

Covers phases S6 (camera/UX) and S7 (post). Reuses concepts from existing `SystemCamera.tsx` (530 lines: overview/focus/freefly) and `SandboxCamera.tsx`.

---

## §1 CameraDirector (Phase S6)

States (extend the existing camera state machine):
- `intro` — one-time cinematic establishing move on load (skippable; disabled on reduced-motion).
- `overview` — slow auto-orbit framing the whole system (current default).
- `tour` — plays a named cinematic spline (`TourConfig`): Catmull-Rom path through control points with look-at targets and dwell times; eases between beats. Tours authored in `sandbox-system.json` (e.g. "Grand Tour", "Dying Star Close Pass", "Dyson Wound").
- `focus` — frame a single node (`ScopedNodeIndex.focusTarget/focusRadius`); triggers LOD streaming + focus DoF.
- `freefly` — pointer-lock WASD + mouse-look, momentum + soft bounds (keep existing freefly, add pointer-lock). Disabled on mobile/reduced-motion.
- `static` — no camera motion (reduced-motion / fallback).

Rules:
- All target vectors/quaternions memoized; `lerp`/`slerp` in `useFrame`, **no allocation**.
- Reduced-motion: no flights, no auto-orbit drift beyond a tiny parallax; `intro`/`tour` disabled.
- Hidden tab: pause.
- Camera never traps the user — `Esc` exits freefly/tour to overview; HUD always offers "Reset view".

---

## §2 SandboxHUD redesign (Phase S6) — accessibility is a hard gate

Keep DOM-based (current HUD is already a CSS-module DOM overlay — good). Provide:
- **Object list / map** — every body reachable by keyboard (tab order), not just by clicking the mesh. Selecting focuses the camera. This is the accessibility spine: 3D picking is an enhancement, the DOM list is the source of truth.
- **Dossier panel** — on select/scan: plain name, lore name, one concrete line (type/scale/"recovered" flavor), and (if `sectionId` set) a link to the portfolio section. No hover-only critical info.
- **Tour controls** — play/stop named tours, scrubber-free (play/skip), with text describing the tour.
- **Mode toggle** — guided ⇆ free-fly (hidden/disabled when not available, e.g. mobile).
- **Perf badge** (dev/optional) — current render mode (WebGPU/WebGL2/static) + tier, for QA.
- **Reset view** always visible.

Accessibility checklist (from QA spec): DOM nav reaches every object; keyboard tab order complete; canvas labels have DOM equivalents; reduced-motion disables flights/free-fly prompts; mobile uses DOM list not precision mesh-picking; no horizontal overflow at 360–390px.

---

## §3 PostStack (Phase S7) — WebGPU post-processing + archival grade

Use the WebGPU `PostProcessing` node pipeline (TSL) on WebGPU; the existing `@react-three/postprocessing` Bloom/SSAO on WebGL2. Tier-gated via `Budget.usePost`.

Passes (high → low):
- **Bloom** — emission-only (threshold tuned so labels/CTAs never bloom). Reserved for neutron emission, photon-ring/accretion highlights, hot breaches, active scan, selected seams.
- **TAA** (WebGPU) — temporal anti-alias for stable thin geometry (rings, trusses, arcs). Off on low tier.
- **Focus DoF** — subtle depth-of-field locked to the focused node; off in overview/freefly to keep navigation crisp.
- **Archival sensor grade** — the unifying "damaged archive sensor" lens: slight vignette, faint scanlines/CA at edges only, subtle chromatic fringe, filmic tone-map. This is what makes mixed asset sources (KTX2, GLB, procedural) read as one coherent image (Cohesion rubric = 5).
- Reduced-motion / low tier: grade allowed (static), heavy temporal/DoF off.

**Hard gate (QA rubric):** the scene must **read without post** (bloom off ≠ broken), and **no label is washed out** with post on. Pixel checks sample both states.

---

## §4 Route-level UX

- `app/sandbox/page.tsx` (server): metadata, JSON-LD optional, no-JS DOM shell listing the system + link back to portfolio + resume/contact (so the route is never a dead end without WebGL).
- View Transitions (already enabled) for enter/exit between `/` and `/sandbox`.
- Loading: stream the scene — show fallback poster immediately, swap to canvas when capability + first frame ready; never block on assets (procedural first, KTX2/GLB on focus).

**Exit gates:** S6 — every object keyboard-reachable, tours play, freefly + Esc work, reduced-motion static, mobile DOM-nav, no overflow. S7 — post tier-gated, scene reads with and without post, labels legible in both, pixel checks pass on the viewport matrix.
