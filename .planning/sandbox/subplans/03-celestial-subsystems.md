# Subplan 03 — Celestial Subsystems

Covers phases S2–S5. Each section = one component family, its TSL technique, its WebGL2 fallback, and its exit gate.

---

## §A — Dying-star hero (Phase S2, AAA)

**Component:** `DyingStarCore` (new), refactoring the good bits of existing `NeutronStar.tsx`.

Layers (each a separate mesh/material — never one mega-shader):
1. **Photosphere** — TSL `MeshBasicNodeMaterial` over a sphere. Multi-octave `mx_noise` plasma in white-blue, advected by `time`. Pulsar pulse = global brightness `sin(time*ω)` band sweep. View-dependent limb darkening via `dot(normalView, viewDir)`.
2. **Magnetic scars** — irregular dark masks (domain-warped noise threshold) with ember edges (emissive ramp at the mask boundary). Animated slow drift. *Not* black decals.
3. **Corona shells** — 1–3 transparent additive shells (count from `Budget.coronaShells`), fresnel-driven opacity, slight scale pulsation, outward UV scroll.
4. **Polar jets** — two tapered cones, additive, braided filament look via stacked noise along axis; length pulse synced to core. Reuse existing jet geometry approach, upgrade material to TSL.
5. **Accretion disk** — tilted ring/torus. **Doppler asymmetry**: one side hotter/brighter/bluer, other dimmer/redder via `dot(tangentVelocity, viewDir)` sign. Banded turbulence, inner-edge bloom highlight.
6. **Approx gravitational lensing** (AAA→stylized): a transparent warped halo shell + screen-space ring distortion of the starfield behind the horizon. **No relativistic ray-marching.** On `!Budget.useLensing` → bloom-only halo.
7. **Magnetic arcs** — sparse curved emissive ribbons connecting core → accretion → nearest Dyson debris. Instanced curves, low count.

**Compute option (WebGPU):** jet + accretion sparks as a small TSL compute particle buffer. Fallback: `Sparkles` (drei) / instanced points.

**Exit gate S2:** renders in WebGPU and WebGL2; reads without bloom; pulse + Doppler visible; reduced-motion → static glow; no per-frame allocation (review `useFrame`).

---

## §B — Planets & atmospheres (Phase S3, stylized→AAA-leaning)

**Component:** `PlanetBody` (one component, profile-driven), replacing/extending `PlanetSurface.tsx`.

**Surface material (TSL `MeshStandardNodeMaterial`):**
- KTX2 maps when available (`acquire(id, lod)`): baseColor / normal / roughness / night / cloudAlpha. Procedural fallback = the existing DataTexture generator path (keep it!).
- TSL detail layer adds high-freq normal/roughness so mid-LOD textures still read sharp on focus.
- `caldera` (hero): damage/civilization mask blends ruined ash over the Earth base; night lights only on the dark terminator side (`smoothstep` on `dot(normal,lightDir)`).
- `helion` (gas giant): port `gasGiantSurface.ts` bands + storm vortex to TSL; add latitudinal flow advection.
- `vulcanis` (molten): emissive lava cracks in fissure noise valleys, no atmosphere.
- `cryos` (ice): high albedo, subtle subsurface blue, specular glints.

**Atmosphere (`PlanetAtmosphere`):** shell-based approximate scattering — a slightly larger back-side sphere, fresnel rim, Rayleigh-ish color by view angle, Mie forward-scatter near the sun direction. Port `planetAtmosphere.ts`; on AAA-leaning hero, do a short fixed-step shell raymarch (4–6 samples) for soft depth; degrade to single-shell fresnel on lower tiers.

**Clouds:** separate animated cloud shell (alpha map + drift) on hero only; off below mid LOD.

**Rings (`PlanetRings`):** PBR-ish — reuse the existing ring shader (Cassini gap, strata) ported to TSL; add approximate self-shadow (planet shadow band) and back-scatter brightening.

**LOD streaming:** `AssetRegistry` loads `hero` KTX2 on focus (camera within radius), `mid` when nearby, `low`/procedural when distant; dispose hero on defocus. Cap by `Budget.planetLodCap`.

**Moons:** instanced rocky `PlanetBody` with crater normal; cheap profile; tidally-locked rotation.

**Exit gate S3:** 4–5 planets + moons render with correct profiles; hero streams hero-LOD on focus and disposes on leave; every planet has a working procedural fallback (force-missing-asset test); atmospheres read on both render paths.

---

## §C — Dyson remnant (Phase S4, stylized)

**Component:** `DysonRemnant`, upgrading `DysonSphere.tsx` (currently 33%-destroyed panel sphere).

- **Swarm, not solid shell:** instanced panels on a spherical distribution (Fibonacci sphere). `Budget.dysonPanels`: 4000 (WebGPU compute) / 900 (instanced) / ring-band (cheap).
- **WebGPU compute:** per-panel slow libration + flicker of diagnostic lights in a storage buffer. Fallback: static instanced with per-instance attributes + vertex-shader wobble.
- **33% destruction:** deterministic mask removes a contiguous arc of panels (not random scatter) → a visible "wound"; ember-edged broken panels at the boundary; drifting debris into the `DebrisFields` belt.
- **Material:** oxidized metal PBR, dark ceramic, scorched edges, sparse cyan seams; emissive only where "powered."

**Exit gate S4a:** swarm renders both paths; destruction arc visible; panel count scales by tier; no frame allocation.

---

## §D — Megastructures (Phase S4, stylized, GLB)

**Component:** `Megastructure` (kind-driven), reusing `Megastructures.tsx` placement logic.

- **GLB kit** (`AssetRegistry`): `shipyard` truss + dock clamps, `lattice` geodesic frame, `comms` dish+mast, `gate` broken ring. Draco/meshopt compressed, lazy on focus/proximity.
- **Primitive fallback** per kind (the current procedural primitives become the fallback — good reuse) so the scene never depends on a GLB load.
- **Material:** oxidized metal + cyan diagnostic seams (emissive `step` lines), ember heat scars on damaged kinds, focus-only archive wireframe overlay.
- **Keep the invisible hit-target** sphere pattern for selection.

**Exit gate S4b:** each megastructure loads GLB or falls back to primitive; selection works; focus wireframe overlay toggles; budgets met.

---

## §E — Space depth & particles (Phase S5, cheap-compute)

**Component:** `SpaceDepth` + `DebrisFields`.

Layered parallax depth (from the approved VFX spec):
- **Deep field** — dense static stars, color variance (TSL compute points on WebGPU / instanced on WebGL2). Deterministic seed.
- **Mid dust** — slow drift, low opacity, deterministic.
- **Near glints** — small sparkles near systems.
- **Gravitational-arc stars** — points stretched/streaked tangentially near the star's lensing region (ties into §A lensing).
- **Debris belt** — instanced/compute hull shards & panels drifting on a torus volume; feeds off Dyson destruction.
- **Signal particles** — sparse directional packets along `routes`/`tours` lanes.

All counts from `Budget`; hidden-tab → `speedMultiplier 0`; reduced-motion → static, no twinkle.

**Exit gate S5:** scene reads as *vast* without a colorful nebula; deterministic positions (no reseed flicker on reload); all counts tier-scaled; both render paths.
