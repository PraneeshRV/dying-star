# Realistic Space — Full Upgrade Plan
**dying-star portfolio · React Three Fiber + Three.js r184**

---

## Overview

5 phases building on your existing stack. No technology switches — everything maps to deps you already have: GSAP for camera transitions, Zustand for state, `shaders/` for GLSL, `@pmndrs/detect-gpu` for quality tiers, `@react-three/postprocessing` for VFX.

**Suggested implementation order:** Textures → Atmosphere → Lighting/VFX → Camera → LOD/Performance

**Implementation status:** Complete for the `v0.2.5` release track.

- Phase 1/2 shipped with committed procedural texture generation for Earth, Mars, ice, and gas-giant profiles; Earth includes night lights and moving cloud shell; all realistic planets use atmosphere shells.
- Phase 3 shipped with Zustand camera mode state, GSAP focus transitions, click-to-orbit selection, `F`/double-click free-fly entry, WASD drift, pointer-lock mouse look, and Escape/empty-space return to overview.
- Phase 4 shipped with a dense color-varied procedural starfield, central star lighting, Bloom, SSAO, star sparkles, animated gas-giant bands, and a Cassini-gap ring shader.
- Phase 5 shipped with camera-distance LOD, high-detail displacement near the surface, GPU/mobile quality gates, no-WebGL/reduced-motion/context-loss fallbacks, and `/public/textures/` ignored so future large KTX2/CDN assets do not bloat git.
- Verification used `npm run verify:system`, `npm run lint`, `npx tsc --noEmit`, `npm run build`, and a production Playwright smoke against `npm run start -- -p 3001`.

---

## Phase 1 — Photorealistic Planet Surfaces

### What's wrong now
Current planets use flat `MeshStandardMaterial` with basic color — no surface detail, no normal maps, no specularity. They read as colored balls, not worlds.

### Textures to add (free, NASA/ESA sources)

**Diffuse map**
The base color. Download from Solar System Scope at 8K or 16K resolution (`solarsystemscope.com/textures`, free CC license). Earth, Mars, Jupiter, Saturn, Neptune all available at 8K.

**Normal map**
Surface bumps without extra geometry — craters, mountain ranges, tectonic ridges. Dramatically changes how light rakes across the surface. Earth has excellent free normal maps from NASA Blue Marble.

**Specular / roughness map**
Makes oceans reflective and continents matte. Earth's ocean glint in sunlight is one of the most realistic visual cues you can add.

**Night map (Earth)**
City lights on the dark side. Blend using a custom shader that checks `dot(normal, sunDir)` — blend to night texture where it falls below zero.

**Cloud layer**
A separate slightly-larger `Sphere` with cloud alpha texture. Rotate it at a slightly different rate than the planet to simulate differential movement. Use `MeshPhongMaterial` with `transparent: true`, `depthWrite: false`.

### Code changes

- Replace `MeshStandardMaterial` with a custom `ShaderMaterial` or use Drei's `<meshStandardMaterial>` with `map`, `normalMap`, `roughnessMap`, `metalnessMap` props.
- Use Three.js `TextureLoader` with `useLoader` from R3F. Pair with `Suspense` so a low-res placeholder shows while 8K textures stream in.
- **Progressive loading:** load 512px placeholder first → swap to 2K when in view → swap to 8K on zoom-in. Use `useTexture` from Drei with a custom LOD hook that watches camera distance.

### Key APIs
`useLoader`, `useTexture`, `TextureLoader`, `MeshStandardMaterial`, `ShaderMaterial` (night blend), `Suspense` boundaries

---

## Phase 2 — Atmosphere (the #1 Realism Upgrade)

### Why this matters most
Atmosphere is what makes a planet feel alive. The blue halo on Earth's limb, the red tint on Mars at sunset, the Jovian amber haze — instantly recognizable and completely absent from the current scene. This single addition will transform the portfolio more than anything else.

### Rayleigh + Mie atmospheric scattering shader

**Atmospheric shell**
Render a slightly-larger invisible sphere (scale 1.025× the planet) with a custom GLSL fragment shader. The shader ray-marches through the atmosphere volume and accumulates Rayleigh scattering (blue short wavelengths) and Mie scattering (haze/fog around the sun direction). This goes in your existing `shaders/` directory.

**Parameters per planet**
Each planet gets its own atmosphere uniforms: thickness, Rayleigh coefficient (controls color tint), Mie coefficient (controls haze), density falloff.
- Earth → thick blue
- Mars → thin reddish
- Gas giants → very deep amber/cream with no hard surface boundary

**Limb glow**
The soft ring of color visible around a planet from space. Achieved with a fresnel falloff in the shader:
```glsl
float fresnel = 1.0 - dot(viewDir, normal);
float glow = pow(fresnel, 3.0);
gl_FragColor = vec4(atmosphereColor * glow, glow);
```
Tint by the planet's atmospheric color. Render with `side: THREE.BackSide` and `blending: THREE.AdditiveBlending`.

**Existing infrastructure**
Your `shaders/` folder and `@react-three/postprocessing` dep mean the GLSL pipeline is already set up. The atmosphere shader slots right in.

### Reference implementations
- **three-atmosphere** by three.quarks — good starting point
- **Bruneton atmosphere model** — GPU precomputed LUT approach (more accurate, heavier)
- For this portfolio, a simplified single-pass Rayleigh/Mie shader is sufficient and runs at 60fps on mid-tier GPUs

### Key APIs
GLSL fragment shader, ray marching, Rayleigh scattering, Mie scattering, fresnel limb glow, `ShaderMaterial` uniforms, `THREE.BackSide`, `THREE.AdditiveBlending`

---

## Phase 3 — Free Camera Exploration + Zoom-to-Planet

### Three camera modes

**Overview mode**
The current orbital view — see the whole system, drag to rotate. Already exists, keep it.

**Focus mode**
Click any planet → camera GSAP-animates to orbit that planet at close distance. Planet fills ~60% of screen. Portfolio content overlays appear. Click back / press ESC → returns to overview.

**Free fly mode**
Press `F` or double-click empty space → first-person WASD + mouse look. Use Drei's `PointerLockControls` or a custom movement hook with `useFrame`. Velocity-based movement with subtle inertia (multiply velocity by 0.9 each frame) for space-like drift.

### Camera system architecture

**Zustand camera store** (you already use Zustand)
```ts
type CameraState = 'overview' | 'orbiting' | 'freefly'

interface CameraStore {
  mode: CameraState
  targetPlanet: string | null
  transitionProgress: number
  setMode: (mode: CameraState) => void
  setTarget: (planet: string | null) => void
}
```

**GSAP camera animation**
When transitioning to a planet, tween `camera.position` and `controls.target` simultaneously. Duration ~2.5s, ease `power3.inOut` — slow start, fast middle, slow end — mimics spacecraft deceleration.
```ts
gsap.to(camera.position, {
  x: targetPos.x,
  y: targetPos.y,
  z: targetPos.z,
  duration: 2.5,
  ease: 'power3.inOut',
  onUpdate: () => camera.lookAt(targetPlanet.position),
})
```

**LOD trigger on zoom**
Track `camera.position.distanceTo(planet.position)` in `useFrame`. Below threshold → swap to 8K textures, enable surface detail geometry, show terrain shader. Above threshold → LOD down. Thresholds are per-planet based on their radius.

**Near-surface detail**
When very close, add a `displacementMap` to the planet sphere geometry. Use `SphereGeometry(1, 256, 256)` — higher segment count is required for visible displacement. Mountains and craters will visually extrude from the surface.

### Key APIs
Zustand camera store, GSAP camera tweens (`power3.inOut`), `PointerLockControls`, `OrbitControls` (existing), LOD distance triggers, `displacementMap`, `useFrame`

---

## Phase 4 — Starfield, Lighting, and VFX

### Starfield

**Equirectangular HDR skybox (recommended)**
Use a real Milky Way panorama from ESO (European Southern Observatory — free for non-commercial use). Load with `RGBELoader` → `PMREMGenerator`. This gives you accurate IBL (image-based lighting) on your planets for free — reflections and ambient light from the galaxy itself.

**Procedural stars (fast fallback)**
`Points` geometry with `PointsMaterial` using a custom circular sprite texture. 50,000–100,000 points, random distribution on a sphere. Vary `size` and color slightly (some warmer/cooler stars) for realism. Use this as the fallback when detect-gpu returns a low tier.

### Lighting

**Single directional light = the star/sun**
Set at very high intensity (~3.0). No ambient light — space is black. The terminator line (day/night boundary) should be crisp. This alone makes planets look dramatically more realistic than a multi-light setup.

**Star glow**
Your neutron star / dying star: give it an additive bloom pass via `@react-three/postprocessing` `Bloom` effect with high luminance threshold. Add lens flare via Drei's `<Sparkles>` or a manual lens flare using a screen-space billboard with a radial gradient sprite.

**Planet self-shadow**
Enable `castShadow` / `receiveShadow` on all planets. Add a screen-space ambient occlusion (SSAO) pass from postprocessing for contact shadows near the surface in close-up view.

### Additional VFX

**Saturn rings**
Flat `RingGeometry` with a rings diffuse + alpha texture. Add a custom ring shader for the Cassini Division (dark gap) and ice particle shimmer effect.

**Gas giant bands (Jupiter/Saturn)**
Custom GLSL surface shader with procedural noise-based banding — no static texture is detailed enough on close-up zoom. Mix 2–3 octaves of fBm (fractal Brownian motion) noise in GLSL to generate swirling bands dynamically, animated slowly over time.

**Dying star / neutron star**
Custom GLSL shader with animated magnetic field lines, polar jets as elongated glowing geometry, surface flicker. Hot plasma color gradient — dark core to blinding white-blue rim.

### Key APIs
`RGBELoader`, `PMREMGenerator` (IBL), `Bloom` postprocessing, SSAO, `RingGeometry`, fBm procedural noise, shadow maps

---

## Phase 5 — Performance, LOD, and Mobile

### The realism/performance tension
Eight 8K textures for six planets = ~600MB of GPU memory if unmanaged. Your stack already has `@pmndrs/detect-gpu` which gives a GPU tier score — use it to gate quality levels.

### LOD strategy per GPU tier

| Tier | GPU type | Textures | Atmosphere | Starfield | Postprocessing |
|------|----------|----------|------------|-----------|----------------|
| 0 | Integrated | Static HTML fallback (already implemented) | — | — | — |
| 1 | Entry GPU | 2K | Disabled | Procedural only | Bloom (low) |
| 2 | Mid GPU (most users) | 4K | Enabled | HDR skybox | Bloom + SSAO |
| 3 | High GPU | 8K | Full ray-march | HDR skybox | Full stack |

### Texture compression (critical)

**Convert all textures to KTX2 / Basis format**
Use the `toktx` CLI tool (free, part of KhronosGroup's KTX-Software). Three.js `KTX2Loader` decompresses on the GPU, cutting VRAM usage by 4–8×. An "8K" texture in KTX2 uses less GPU memory than a 2K JPEG. Drei provides a ready hook: `useKTX2`.

```bash
# Convert a diffuse texture
toktx --encode uastc --uastc_quality 2 earth_diffuse_8k.ktx2 earth_diffuse_8k.png

# Convert normal map (use zstd compression for normals)
toktx --encode uastc --uastc_quality 2 --assign_oetf linear earth_normal_8k.ktx2 earth_normal_8k.png
```

### `usePlanetLOD` hook (camera-distance LOD)

```ts
function usePlanetLOD(planetRef: RefObject<THREE.Mesh>, planetRadius: number) {
  const { camera } = useThree()
  const [lod, setLod] = useState<'low' | 'mid' | 'high'>('low')

  useFrame(() => {
    if (!planetRef.current) return
    const dist = camera.position.distanceTo(planetRef.current.position)
    const normalized = dist / planetRadius

    if (normalized > 40) setLod('low')       // 512px textures, 32-seg geometry
    else if (normalized > 10) setLod('mid')  // 2K textures, 64-seg geometry
    else setLod('high')                       // 8K textures, 256-seg geometry + displacement
  })

  return lod
}
```

### Frame budget estimate (Tier-2 GPU, 60fps target = 16.6ms)

| Pass | Estimated cost |
|------|---------------|
| Planet textures + materials | ~4ms |
| Atmosphere shader | ~3ms |
| Postprocessing (Bloom + SSAO) | ~2ms |
| HDR skybox IBL | ~1ms |
| Scene traversal + overhead | ~2ms |
| **Remaining budget** | **~4ms** |

### Critical deployment note

> Texture assets must NOT be committed to git. Store them in `/public/textures/` but add a `.gitignore` entry and serve from a CDN — Cloudflare R2 (free tier) or Vercel's edge network. Eight 8K PNGs will exceed Vercel's deploy size limit otherwise.

---

## Free Texture Sources

| Source | URL | License | Best for |
|--------|-----|---------|----------|
| Solar System Scope | `solarsystemscope.com/textures` | CC BY 4.0 | All planets — diffuse, normal, specular, night, clouds |
| NASA Visible Earth | `visibleearth.nasa.gov` | Public domain | Earth — seasonal variants, very high fidelity |
| ESO | `eso.org/public/images` | Free non-commercial | Milky Way panoramas, nebulae for skybox |
| Poly Haven | `polyhaven.com` | CC0 | HDR environment maps |

---

## Recommended Implementation Order

1. **Textures** — biggest immediate visual win with the least code. Replace `MeshStandardMaterial`, add all maps. Estimated: 1 day.
2. **Atmosphere shader** — second biggest win. Write the GLSL, start with Earth, then generalize. Estimated: 2–3 days.
3. **Lighting + postprocessing** — HDR skybox, single sun directional light, Bloom. One afternoon once textures and atmosphere are done.
4. **Camera system** — zoom-to-planet with GSAP. You have GSAP already; it's mostly Zustand store plumbing. Estimated: 1–2 days.
5. **LOD + compression** — convert textures to KTX2, wire up detect-gpu tiers, build `usePlanetLOD`. Do this last so you know what you're optimizing.

---

## Quick Start (First Weekend)

Download the Solar System Scope 8K textures for Earth and Mars only. Swap `MeshStandardMaterial` to use `map` + `normalMap` + `roughnessMap`. Write the Rayleigh atmosphere shader for Earth. That alone will make the portfolio look like a completely different project — then expand outward from there.
