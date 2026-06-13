# Subplan 02 — World Contract & Scene Graph

**Phase:** S1. **Goal:** make the cinematic system fully data-driven on galaxy-ready boundaries, and remove the wireframe console.

---

## 1. The authored system: "The Dying Star"

One curated system, no procedural generation of layout (positions are authored for cinematic framing). Bodies, in rough orbital order:

| Id | Name (plain) | Lore name | Type | Fidelity | Notes |
|----|--------------|-----------|------|----------|-------|
| `core` | Dying Star | The Pyre Heart | neutron star / pulsar | AAA | hero set-piece, accretion + jets + lensing |
| `dyson` | Dyson Remnant | Aurelian Shroud | dyson swarm | stylized | 33% destroyed, partial swarm, ember edges |
| `vulcanis` | Scorched World | Vulcanis Ash | molten rocky | stylized | inner, lava emissive, no atmosphere |
| `caldera` | Garden World | Caldera Garden | Earth-like (ruined) | **AAA-leaning** | hero planet: KTX2 maps, clouds, night lights, atmosphere, damage mask |
| `caldera-moon` | — | Iris Archive | rocky moon | cheap | cratered, tidally locked |
| `helion` | Banded Giant | Helion | gas giant + rings | stylized | banded TSL flow, storm vortex, PBR rings |
| `helion-moons` | — | (2–3) | icy/rocky moons | cheap | instanced |
| `cryos` | Ice World | Cryos Pale | ice planet | stylized | high albedo, subsurface tint, thin atmosphere |
| `shipyard` | Ark Shipyard | Ark Skeleton | megastructure (GLB) | stylized | truss kit, dock clamps |
| `lattice` | Defense Lattice | Bastion Null | megastructure (GLB) | stylized | geodesic frame, diagnostic seams |
| `comms` | Comms Array | Orison Relay | megastructure (GLB) | stylized | dish + mast |
| `gate` | Collapsed Gate | Kharon Gate | megastructure (GLB) | stylized | broken ring/hyperlane remnant |
| belts | Debris Belt + signal lanes | — | particles | cheap | compute drift |

Scale is **art-directed/compressed**, not astronomical — believable Keplerian *relationships* (inner = faster), cinematic *distances*. Per locked decision this is a flythrough, so framing beats physical accuracy.

> Portfolio coupling is **optional** in this flagship (cinematic, not navigation-first). Keep an optional `sectionId` field per body so the future galaxy wrapper can map bodies → portfolio sections without a schema change. Do not gate resume/contact/projects behind the sandbox.

---

## 2. Data contract v2 (`components/sandbox/sandboxSystem.ts` + `content/data/sandbox-system.json`)

Reuse the *shape* of the approved galaxy `SystemConfig` so the galaxy can later treat this as `systems[0]`.

```ts
interface SandboxSystem {
  version: 2;
  id: "dying-star";
  name: string; subtitle: string;
  palette: Record<string, string>;
  star: StarConfig;                 // neutron-star params (see subplan 03 §A)
  dyson: DysonConfig;               // destroyedFraction, panelCount, radius
  bodies: BodyConfig[];             // planets (with realism profile + LOD asset ids)
  moons: MoonConfig[];
  megastructures: MegastructureConfig[];  // kind + glb asset id + primitive fallback
  fields: FieldConfig[];            // debris belts, signal lanes
  tours: TourConfig[];              // cinematic camera splines (subplan 04)
  routes: RouteConfig[];            // optional inter-node arcs (galaxy-ready)
}
```

- **Scoped ids**: `dying-star:caldera` internally so a multi-system galaxy never collides.
- Each `BodyConfig.asset` = `{ glb?, ktx2Lods?: {hero,mid,low}, proceduralFallback: ProfileId }`.
- Keep the existing realism-profile idea from `shatteredSystem.ts` (`earth|gas-giant|ice|mars`) and extend (`molten`, `neutron`).

---

## 3. Scene-graph boundaries (galaxy-ready)

Create these components even though there's only one system today — so the galaxy wrapper is a later *addition*, not a *refactor*:

- `SceneRoot` — composes SpaceDepth + one `SystemCluster` + PostStack + CameraDirector. (Future galaxy: `systems.map(s => <SystemCluster/>)` + `CentralBlackHole`.)
- `SystemCluster` — owns one system's star/bodies/structures/fields/labels; reads its own LOD budget. Local origin so it can be translated to an orbit position later.
- `ScopedNodeIndex` — `lib/sandbox/nodeIndex.ts`: `focusTarget(id)`, `worldPosition(id)`, `focusRadius(id)`, `domSectionFor(id)`. Replaces flat array searches (the pattern currently scattered in `SystemCamera`).
- `AssetRegistry` — `lib/render/assetRegistry.ts`: `acquire(id, lod)` returns cached GLB/KTX2 or kicks lazy load; `release(id)` disposes; **always** resolves to procedural fallback if missing/over-budget/CDN-down.

---

## 4. Removing the wireframe console

- Replace `SandboxObjects.tsx` (wireframe primitives) with real `SystemCluster` content — but **preserve two patterns** that already work:
  1. The **invisible hit-target sphere** for reliable selection (keep it, scale per body).
  2. `TacticalLabel` + HUD dossier (upgrade visuals in subplan 04).
- Keep `sandboxWorld.ts`'s objective/scan scaffolding *only if* we keep light "scan to reveal" interaction; otherwise retire it. Default: keep a minimal "scan reveals dossier" because it's cheap and on-theme, but it is not navigation-critical.
- Old files to delete after parity: `SandboxObjects.tsx` (wireframe shapes), debris box generator. New debris is in `DebrisFields` (subplan 03 §E).

---

## 5. Verifier (`scripts/verify-sandbox-world.mjs`, upgrade existing)

- Schema-validate `sandbox-system.json` against the v2 contract (zod is already a dep — reuse it in a tiny node script or hand-rolled checks).
- Unique scoped ids; every `focusTarget` resolves; every `domSectionFor` (if set) points to a real section id.
- Every non-procedural asset id has a ledger entry (subplan 05) and a declared fallback.
- Every tour references existing node ids.

**S1 exit gate:** contract + verifier green, `SceneRoot` renders procedural-fallback placeholders for all bodies (no assets yet), old console gone, production smoke clean.
