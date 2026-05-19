# Galaxy Architecture Design

## Status

Companion spec for `2026-05-01-black-hole-galaxy-design.md`. Awaiting user review before implementation planning.

## Architecture Goal

Scale the current single-system React Three Fiber scene into a data-driven galaxy without breaking the verified neutron-star experience.

The design should introduce new boundaries before heavy visuals:

- `GalaxyScene`
- `CentralBlackHole`
- `SystemCluster`
- `ScopedNodeIndex`
- `AssetRegistry`
- `PerformancePolicy`

## Current Constraints

Current architecture assumes one shared origin:

- `SpaceCanvas.tsx` composes all scene objects directly.
- `shatteredSystem.ts` adapts one flat JSON system.
- `SystemCamera.tsx` resolves focus by searching planets, moons, megastructures, and pathways.
- `orbitMath.ts` writes positions relative to one origin.
- Verification scripts hard-code current data expectations.

The galaxy design should not jump straight to four full systems. The first safe step is a v2 data contract.

## Data Contract

Recommended top-level model:

```ts
interface GalaxyConfig {
  id: string;
  name: string;
  center: BlackHoleConfig;
  systems: SystemConfig[];
  routes: InterSystemRouteConfig[];
  palettes: Record<string, string>;
}
```

Recommended system model:

```ts
interface SystemConfig {
  id: string;
  name: string;
  plainLabel: string;
  loreLabel: string;
  purpose: string;
  center: [number, number, number];
  orbit: GalaxyOrbitConfig;
  palette: SystemPalette;
  detailMode: "full" | "impostor" | "fallback";
  sections: SectionMapping[];
  bodies: PlanetConfig[];
  moons: MoonConfig[];
  megastructures: MegastructureConfig[];
  pathways: PathwayConfig[];
}
```

Use scoped ids internally:

```text
identity:garden-glass
build:ark-shipyard
proof:kharon-redoubt
transmission:comms-array
```

This prevents duplicate ids when systems grow.

## Component Boundaries

### `GalaxyScene`

Owns galaxy-level composition:

- Central black hole.
- Four system clusters.
- Inter-system routes.
- Starfield/deep-field layers.
- Global performance policy.
- Postprocessing gates.

### `CentralBlackHole`

Owns:

- Event horizon silhouette.
- Photon ring.
- Accretion disk.
- Lensing halo approximation.
- Particle/data jets.
- Low-tier baked halo fallback.

It should not own portfolio navigation.

### `SystemCluster`

Owns one system:

- Local star/core object.
- Bodies.
- Moons.
- Structures.
- Local pathways.
- Labels.
- Local LOD rules.

The current neutron-star scene can be wrapped by `SystemCluster` before being refactored internally.

### `ScopedNodeIndex`

Provides lookup helpers:

- Focus target by scoped id.
- Section mapping by node id.
- World position resolver.
- Focus radius.
- DOM section target.

This replaces flat searches scattered through `SystemCamera`.

### `SystemCamera`

Future camera states:

- `galaxy-overview`
- `system-focus`
- `node-focus`
- `freefly`
- `fallback-static`

The camera must support system centers, object focus, and DOM section sync. It must also retain stable non-canvas navigation.

## Rendering Strategy

High tier:

- Black hole full shader stack.
- Active system full geometry.
- Distant systems as simplified clusters unless focused.
- Rich starfield and route particles.
- Bloom and SSAO only where stable.

Medium tier:

- Black hole silhouette, photon ring, simpler accretion disk.
- Active system full geometry with lower counts.
- Distant systems as impostors.
- Fewer stars, arcs, and labels.

Low/mobile:

- One active system or static fallback.
- No postprocess lensing.
- Simplified black-hole halo.
- Reduced star/debris counts.
- DOM map/list for navigation.

Reduced motion/no-WebGL:

- Static or lightly animated fallback.
- No camera flights.
- No free-fly.
- All section access through DOM controls.

## Rollback Boundaries

Each phase should be revertible:

- Data contract only: revert JSON/types/scripts.
- Asset pipeline only: revert manifest/verifier.
- Black hole only: remove one isolated component.
- Camera/scoping: keep old single-system path until new path passes.
- Four systems: feature/data flag per system.
- Asset fidelity: per-asset fallback to procedural texture or primitive mesh.

## Verification Requirements

Architecture work must update verification, not just rendering:

- System contract verifier.
- Asset manifest verifier.
- Scoped node id uniqueness check.
- Section target existence check.
- Fallback path check for every external asset.
- Production browser smoke for camera and canvas behavior.

