# Dying Star — Realistic Cinematic Sandbox · Master Plan

**Created:** 2026-06-13
**Owner:** Praneesh R V
**Status:** Approved direction, ready for phased implementation
**Supersedes for `/sandbox`:** the wireframe "tactical console" currently on branch `black-hole-galaxy-foundation`.

---

## 1. Locked decisions (do not re-litigate)

| Axis | Decision | Consequence |
|------|----------|-------------|
| Interaction model | **Curated cinematic flythrough** — one hand-authored system, free-fly + guided tours, no user editing | No build/edit UI, no sim solver, no persistence/share-seed. Effort goes into per-object fidelity, not tooling. |
| Render stack | **WebGPU + TSL, automatic WebGL2 fallback** | Two render paths must stay in sync. TSL node materials are source of truth; GLSL fallbacks for WebGL2-only effects. Device floor: modern evergreen browsers; everything else degrades. |
| Scope | **Sandbox is the new flagship now; Four-Systems black-hole galaxy is a later wrapper** | Build on the galaxy architecture *contracts* (SceneRoot / SystemCluster / AssetRegistry / PerformancePolicy) so the galaxy can later mount this as "System 0" without a rewrite — but do **not** build the galaxy now. |
| Fidelity bar | **Stylized-realism** (reads real, art-directed, mobile-survivable) with a **per-object tier matrix** | Neutron star + hero planet = AAA-leaning; distant planets/structures = stylized; debris/swarm = cheap instanced. See §6. |

These four answers came from the user on 2026-06-13 and frame every subplan.

---

## 2. Where the project stands today (assessment)

**Strong, reusable foundation already in the repo:**
- Next.js 16.2.4 / React 19 / R3F 9.6 / three 0.184 / Zustand / Biome / strict TS.
- A genuinely good WebGL2 scene on `/` (`Archive of the Shattered Star`): GLSL neutron star (`NeutronStar.tsx`, 422 lines — plasma core, accretion disk, jets, sparkles), 33%-destroyed `DysonSphere.tsx`, procedural-realism planets (`PlanetSurface.tsx`, 847 lines — datatexture diffuse/normal/roughness/night/cloud, atmosphere + ring shaders), `Megastructures.tsx`, `Starfield`, `Constellation`, `SystemCamera` (overview/focus/freefly), GPU-tier scaling, Bloom/SSAO, WebGL preflight, reduced-motion + context-loss fallbacks.
- Asset governance precedent exists: `scripts/verify-space-assets.mjs`, a space-asset ledger, `verify:system` chained verifiers, GSD planning discipline.
- **An approved-but-unimplemented design package** (`docs/superpowers/specs/2026-05-01-*`, 7 specs): black-hole "Four Systems" galaxy architecture, shader/VFX direction, asset pipeline w/ GLB+KTX2+ledger, QA gates, system map. This plan deliberately reuses its architecture boundaries and QA gates.

**The current `/sandbox` (this branch):** a lightweight "Orbital Ruins" tactical console — wireframe procedural primitives (`SandboxObjects.tsx`), an orbit ring, box debris, a scanner pulse, guided/freefly camera, an HUD with objectives. It is a *navigation toy*, not a realistic scene. **It will be gutted and rebuilt** under this plan; the world-contract pattern (`sandboxWorld.ts` + JSON + verifier) is kept and upgraded.

**Open risk carried in:** `next dev` (Turbopack) hydration flakiness is documented; production preview (`next build` + `next start`) is the validated path. WebGPU work must be validated against production preview, not dev.

---

## 3. Target architecture (one diagram)

```
app/sandbox/page.tsx  (server) ── metadata, no-JS shell
  └─ SandboxExperience (client)
       ├─ CapabilityGate            detect: webgpu? | webgl2? | static  (+ reduced-motion, hidden-tab)
       ├─ RenderRoot (R3F <Canvas>) gl factory chooses WebGPURenderer | WebGLRenderer
       │    └─ SceneRoot            galaxy-ready boundary (future: one of N SystemClusters)
       │         ├─ SpaceDepth      compute starfield · dust · gravitational-arc stars (TSL compute / GLSL fallback)
       │         ├─ DyingStarCore   neutron star: photosphere · corona · scars · jets · accretion · lensing · arcs
       │         ├─ DysonRemnant    instanced panel swarm (compute) · 33% destruction · primitive fallback
       │         ├─ PlanetSystem    N PlanetBody (TSL surface + atmosphere + rings + moons) · LOD streaming
       │         ├─ Megastructures  GLB kit (shipyard/lattice/comms/gate) · primitive fallback
       │         ├─ DebrisFields    instanced/compute belts · signal particles along routes
       │         └─ PostStack       WebGPU post (bloom · TAA · focus-DoF · sensor grade) tier-gated
       ├─ CameraDirector            cinematic spline tours · free-fly (pointer-lock) · focus · reduced-motion static
       └─ SandboxHUD (DOM)          accessible nav/list · tour controls · object dossier · perf badge
```

**Shared services (Zustand-scoped, NOT global dumping ground):**
- `AssetRegistry` — id→{glb, ktx2 LODs, procedural fallback}; lazy-loads on focus; disposes on defocus.
- `PerformancePolicy` — single source of truth for tier → counts, DPR, post toggles, LOD caps.
- `ScopedNodeIndex` — `system:object` ids, focus-target + DOM-section resolver (galaxy-ready).

**Why this shape:** every subsystem is independently revertible (a phase can be removed by deleting one component), the WebGPU/WebGL2 split lives only at `RenderRoot` + material factories, and the galaxy can later wrap `SceneRoot` as `SystemCluster[0]` with zero content rewrite.

---

## 4. The render pipeline in one paragraph

R3F `<Canvas>` receives an **async `gl` factory**. It probes `navigator.gpu`; on success it constructs `WebGPURenderer` (from `three/webgpu`), `await renderer.init()`, returns it — R3F 9 drives it natively. On failure it returns a classic `WebGLRenderer`. Materials are authored once in **TSL** (`three/tsl`); TSL compiles to WGSL on WebGPU and to GLSL on WebGL2, so most surfaces are write-once. The few effects WebGL2 can't do well (compute particles, some raymarch loops) get a **declared GLSL/instanced fallback** selected by `PerformancePolicy`. No WebGPU? → WebGL2 path (the existing GLSL components, upgraded). No WebGL2 / reduced-motion / no-JS? → static poster fallback. Full detail in `subplans/01-render-pipeline.md`.

---

## 5. Master phase roadmap

Each phase is independently shippable, independently revertible, and ends at the **hard gate**: `npm run verify` (verifiers + lint + tsc + build) **plus** production-preview browser smoke. No phase merges on dev-server state.

| # | Phase | Goal | Exit criterion | Subplan |
|---|-------|------|----------------|---------|
| **S0** | Render foundation & WebGPU spike | De-risk the bleeding edge before content | A TSL node material renders under WebGPU **and** falls back to WebGL2 and to static, all on production preview, across the viewport matrix | `01-render-pipeline.md` |
| **S1** | World contract & scene graph | Galaxy-ready data + boundaries; gut the wireframe console | New `sandboxSystem` v2 contract + verifier green; `SceneRoot`/`SystemCluster`/`AssetRegistry`/`PerformancePolicy` scaffolded with procedural fallbacks; old console removed behind it | `02-world-content.md` |
| **S2** | Dying-star hero (AAA) | The neutron star as the set-piece | Photosphere + corona + scars + jets + accretion (Doppler) + approx lensing + magnetic arcs render in WebGPU; GLSL fallback acceptable; reads without bloom | `03-celestial-subsystems.md` §A |
| **S3** | Planets & atmospheres | 4–5 authored worlds + moons, stylized-realism | TSL planet material (KTX2 maps + shader detail + shell atmosphere + fresnel + night + clouds + PBR rings); LOD streams on focus; procedural fallback per planet | `03-celestial-subsystems.md` §B |
| **S4** | Dyson remnant + megastructures | Damaged swarm + GLB structure kit | Instanced/compute panel swarm with 33% destruction; GLB shipyard/lattice/comms/gate with primitive fallback + invisible hit targets | `03-celestial-subsystems.md` §C–D |
| **S5** | Space depth & particles | Vastness + motion | Compute starfield, dust drift, gravitational-arc stars, debris belts, signal particles; deterministic, tier-scaled, GLSL/instanced fallback | `03-celestial-subsystems.md` §E |
| **S6** | Camera, tours & UX | Cinematic + accessible | Spline guided tours, free-fly pointer-lock, focus DoF, reduced-motion static; HUD with DOM list nav to every object; no hover-only info | `04-camera-and-ux.md` |
| **S7** | Post-processing & archival grade | Cohesion lens | WebGPU post (bloom/TAA/DoF/vignette/subtle CA + "damaged sensor" grade); per-tier gates; labels never washed out | `04-camera-and-ux.md` §Post |
| **S8** | Asset governance, perf & ship | Pass the gates, deploy | Asset ledger complete; budgets met; pixel + viewport + fallback gates green; CDN strategy; docs; production smoke | `05-asset-pipeline.md` + `06-performance-qa.md` |

**Sequencing logic:** S0 proves the tech (highest risk first). S1 makes everything data-driven so later phases only add components. S2 lands the single most-impressive object early (morale + a demoable artifact). S3–S5 fill the world. S6–S7 make it cinematic and accessible. S8 is the governance/ship gate that should *also* be checked incrementally, not just at the end.

---

## 6. Per-object fidelity matrix (the "stylized-realism, per-object" answer)

| Object | Tier target | Technique headline | Cheap-tier degrade |
|--------|-------------|--------------------|--------------------|
| Neutron star core | **AAA** | TSL multi-octave plasma photosphere, 3 corona shells, animated magnetic scars, braided polar jets, accretion disk w/ Doppler hot/cold asymmetry | 1 core shader + 1 corona shell + static jets |
| Approx gravitational lensing | AAA→stylized | Warped transparent halo shell + screen-space distortion around horizon of star field | drop to bloom-only halo |
| Hero planet (Earth-like "Caldera Garden") | **AAA-leaning** | KTX2 NASA-derived maps + TSL detail, shell-raymarch atmosphere, fresnel rim, night/civilization lights, animated cloud shell, damage mask | mid KTX2, single atmosphere shell, no clouds |
| Gas giant + rings | stylized | TSL banded flow + storm vortex; PBR ring with self-shadow approximation, Cassini gap | banded shader, flat ring alpha |
| Ice / rocky / scorched worlds | stylized | Procedural TSL surface + tiered KTX2 where available | procedural DataTexture (existing path) |
| Moons | stylized→cheap | Instanced rocky surface, crater normal | low-poly emissive primitive |
| Dyson remnant | stylized | Compute/instanced panel swarm, oxidized PBR, 33% destruction holes, ember edges | instanced ring band, no per-panel anim |
| Megastructures | stylized | GLB kit, oxidized metal + cyan diagnostic seams, focus wireframe overlay | primitive truss + invisible hit target |
| Starfield / dust / arcs | cheap-compute | TSL compute points, layered parallax depth, deterministic | instanced points / fewer counts |
| Debris belts / signal particles | cheap | Instanced + compute drift along routes | static instanced shards |

---

## 7. Bleeding-edge tech inventory (what "all bleeding edge tech" concretely means here)

- **Three.js WebGPURenderer** (`three/webgpu`) + **TSL node materials** (`three/tsl`) — compute + WGSL, write-once materials.
- **GPU compute shaders** for particle systems (starfield, Dyson swarm, debris, jets) via TSL `compute()` storage buffers.
- **Shell / sphere-tracing atmospheres** (approximate volumetric scattering) instead of flat fresnel decals.
- **KTX2 / Basis Universal** GPU-compressed textures with on-focus **LOD streaming** + disposal.
- **GLB + Draco/meshopt** megastructure kit, lazy-loaded.
- **WebGPU post-processing** (PostProcessing node pipeline: bloom, TAA, focus DoF, grade).
- **Pointer-Lock free-flight** + spline-driven cinematic camera (catmull-rom tours).
- **View Transitions API** (already enabled in `next.config.ts`) for route enter/exit.
- **detect-gpu + WebGPU adapter probe** feeding a single `PerformancePolicy`.
- Guardrail: every one of the above has a declared fallback. Bleeding edge is the *ceiling*, not the *floor*.

---

## 8. Top risks & mitigations

| Risk | Likelihood | Mitigation |
|------|-----------|------------|
| R3F 9 + WebGPU init flakiness / SSR mismatch | High | S0 spike isolates it; client-only, `await renderer.init()` before first render; keep WebGL2 path always shippable |
| TSL fallback divergence (looks great on WebGPU, broken on WebGL2) | High | Author in TSL first (compiles both ways); only hand-write GLSL for compute-only effects; pixel-check **both** paths in QA matrix |
| Mobile can't do WebGPU compute | Medium | PerformancePolicy forces WebGL2/instanced or static on low tier; mobile budget = 3 MB, simplified scene |
| Asset bloat / license ambiguity (NASA/ESA/ESO) | Medium | Reuse existing ledger discipline; budgets in §05; procedural fallback for every asset; no raw 4K in git, CDN for big packs |
| `next dev` instability bites WebGPU debugging | Medium | Validate on `next build && next start`; treat dev as best-effort |
| Scope creep back toward "build-your-own" sim | Medium | Locked decision §1: no edit UI. Park any sim idea in a v2 doc |
| Bloom washes out recruiter-readable labels | Low | QA gate: labels legible without and with post; bloom reserved for emission only |

---

## 9. The immediate next step (start here)

1. **Stabilize the branch.** Commit or stash the in-flight scanner-loop changes (`SandboxExperience.tsx`, `SandboxHUD.*`) so S0 starts from a clean tree. Branch a fresh `sandbox-render-foundation` off `black-hole-galaxy-foundation`.
2. **Execute Phase S0** (`subplans/01-render-pipeline.md`): add `lib/render/capability.ts` (WebGPU/WebGL2/static probe), a `RenderRoot` that swaps the R3F `gl` factory, and **one** TSL test material (a procedural star sphere) proving WebGPU → WebGL2 → static all render on production preview across the 5-viewport matrix. Add a `verify-sandbox-render.mjs` stub to the verify chain.
3. **Do not touch content yet.** S0 is pure plumbing; its only deliverable is "the bleeding-edge path renders and degrades safely." Everything downstream depends on that being proven first.

Detailed, file-by-file subplans live in `.planning/sandbox/subplans/`. Read order: 01 → 02 → 03 → 04 → 05 → 06.
