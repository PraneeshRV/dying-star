# Shader And VFX Design

## Status

Companion spec for `2026-05-01-black-hole-galaxy-design.md`. Awaiting user review before implementation planning.

## Goal

Create cinematic, hyperreal, browser-feasible space VFX:

- Central black hole.
- Photon ring.
- Accretion disk.
- Lensing approximation.
- Neutron-star plasma.
- Corona shells.
- Dark magnetic spots.
- Magnetic arcs.
- Starfield depth and twinkle.
- Debris and signal particles.

The implementation should be art-directed and performant, not a full physics simulation.

## The Null Archive

The black hole should be the galaxy hub and first-viewport set piece.

Visual layers:

- Event horizon silhouette.
- Thin photon ring.
- Tilted accretion disk.
- Doppler asymmetry: one side hotter/brighter, one side dimmer/redder.
- Starfield distortion halo.
- Sparse vertical data jets.
- Infalling debris and signal particles.
- Last Safe Orbit guide path.

First-pass lensing should be approximate:

- Transparent warped shell.
- Distorted halo mesh.
- Shader displacement around the object.
- No expensive relativistic ray marching.

## Neutron Star Upgrade

The existing neutron-star system remains a hero system.

Upgrade ideas:

- Dense white-blue plasma photosphere.
- Dark magnetic scars with ember edges.
- 2-3 transparent corona shells.
- Fresnel rim.
- Pulsing radiation bands.
- Polar jets with braided filament look.
- Magnetic arcs connecting star, accretion material, and Dyson debris.

Dark spots should be irregular shader masks, not simple black decals.

## Starfield And Space Depth

Use layered depth:

- Deep field: dense static stars with color variance.
- Mid dust: slow drift, low opacity, deterministic positions.
- Near glints: small sparkles near systems.
- Gravitational arc stars: stretched points around The Null Archive.
- Debris silhouettes: occasional panels, antenna fragments, hull shards.
- Signal particles: sparse directional packets along routes.

The scene should feel vast without relying on a colorful nebula background.

## Megastructure VFX

Megastructures use materials and state effects:

- Oxidized metal.
- Dark ceramic.
- Scorched edges.
- Tiny cyan diagnostic seams.
- Ember heat scars.
- Sparse archive wireframe overlay on focus.
- Pulsing status lights only where meaningful.

Avoid making every object emissive. Glow should indicate active scan, heat, threat, or power.

## GPU Tier Degradation

High tier:

- Full black-hole shader stack.
- Bloom/SSAO when stable.
- Dense starfield.
- Lensing halo.
- Magnetic arcs.
- Plasma ribbons.
- High LOD active planet/structure.

Medium tier:

- Simplified lensing halo.
- Fewer arcs.
- Lower star/debris counts.
- Lower shader noise complexity.
- Bloom but SSAO optional.

Low/mobile:

- No postprocess lensing.
- Baked-looking black-hole halo.
- One core shader and one corona shell.
- Fewer stars and no heavy particle soup.
- Simplified active system or static fallback.

Reduced motion/no-WebGL:

- Static or lightly animated poster-like fallback.
- No aggressive twinkle.
- No camera flights.
- No free-fly.
- DOM navigation remains complete.

## Composition Rules

Lighting hierarchy:

1. The Null Archive or current active star as primary visual mass.
2. Active system as mid-ground detail.
3. Selected object as focus.
4. Distant systems as silhouettes or impostors.
5. UI overlays as sparse forensic instrumentation.

Black holes should not glow like UI buttons. They should read through silhouette, lensing, accretion, and starfield distortion.

Bloom is reserved for:

- Neutron emission.
- Photon ring/accretion highlights.
- Hot breaches.
- Active scan overlays.
- Selected diagnostic seams.

## Implementation Constraints

- Split effects by responsibility; avoid a single mega-shader component.
- Do not allocate vectors, arrays, colors, or materials inside frame loops.
- Prefer buffer geometry, instancing, uniforms, and memoized assets.
- Keep shader precision conservative for mobile unless gated.
- Scene must read without bloom/postprocessing.
- Every VFX element needs reduced-motion and low-tier behavior.

## Acceptance Criteria

VFX is acceptable only if:

- Canvas is nonblank and visually differentiated.
- Scene still reads without postprocessing.
- Hero copy and CTAs remain readable.
- No label is washed out by bloom.
- Mobile either renders a simplified scene or fallback.
- Reduced motion avoids continuous camera flights and aggressive twinkle.
- Production smoke catches console errors and blank canvas frames.

