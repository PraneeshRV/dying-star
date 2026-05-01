# Asset Pipeline Design

## Status

Companion spec for `2026-05-01-black-hole-galaxy-design.md`. Awaiting user review before implementation planning.

## Goal

Use external/generated assets aggressively, but with strong governance so the portfolio does not become slow, legally ambiguous, or impossible to deploy.

Runtime assets should use:

- `.glb` / glTF for models.
- KTX2 / Basis Universal for WebGL textures.
- Meshopt or Draco compression where useful.
- Procedural fallback for every important visual.

## Asset Taxonomy

Recommended storage categories:

```text
source/raw
source/working
runtime/models
runtime/textures
runtime/lod
runtime/manifest
```

### `source/raw`

Original downloaded/generated files. Keep source URL, author, license, and checksum.

### `source/working`

Blender, GIMP, Krita, Substance, prompt records, masks, LUTs, and intermediate files.

### `runtime/models`

Compressed GLB assets:

- Megastructure modules.
- Shipyard trusses.
- Dyson fragments.
- Gate pieces.
- Vault plates.
- Antenna dishes.
- Dock clamps.
- Hull shards.

### `runtime/textures`

KTX2 texture sets:

- Base color.
- Normal.
- Roughness.
- Ambient occlusion.
- Height/displacement when tier-gated.
- Emissive/night.
- Cloud alpha.
- Damage mask.
- Civilization mask.

### `runtime/lod`

Recommended planet LODs:

- `hero`: 4096x2048 KTX2, focused desktop only.
- `mid`: 2048x1024 KTX2, nearby desktop.
- `low`: 1024x512 or 512x256 KTX2, mobile/distant.
- `fallback`: existing procedural DataTexture path.

## Asset Ledger

Every non-procedural asset requires a ledger entry before being referenced.

Required fields:

- Asset id.
- Source URL.
- Source organization.
- Original author/credit line.
- License.
- License URL.
- Download date.
- Local path or CDN path.
- Checksum.
- Transformations.
- Generated/AI status.
- Tool/model/prompt/seed for generated assets.
- Blender or source working file.
- Compression pipeline.
- Runtime budget.
- Fallback asset or procedural fallback.
- Reviewer.
- Approval date.

## Source Policy

### NASA

NASA assets may be used only after per-asset review. Record source and credit. Do not imply endorsement. Do not use NASA logos or insignia.

Useful source families:

- Blue Marble.
- Black Marble.
- NASA cloud maps.
- CGI Moon Kit.
- Mars topography/MOLA-style data.

### ESA

ESA assets are mixed-risk. Use only assets with explicit reusable license terms on the asset page. Avoid ShareAlike assets unless the project is willing to satisfy those terms for adaptations.

### ESO

ESO imagery is often attribution-friendly but still requires clear credit. Visible hero imagery needs visible or easily reachable attribution, not only a hidden README note.

### Generated Assets

Generated assets require provenance:

- Tool/model.
- Date.
- Prompt.
- Seed/settings where available.
- Source inputs.
- Human modification notes.
- Whether user-visible attribution/marking is needed.

Generated assets must not be falsely attributed to NASA, ESA, ESO, or any other source agency.

## Runtime Strategy

Default behavior:

- Load procedural or low LOD first.
- Lazy-load higher LOD only on focus or high GPU tier.
- Dispose unused high-detail textures after focus changes.
- Never block hero text, nav, resume, contact, or fallback rendering on an asset.
- Missing assets fall back to procedural texture or primitive mesh.

Asset base:

- Core app and small metadata stay in the Next/Vercel app.
- Large immutable 3D packs should use content-hashed filenames on a CDN/R2-style bucket.
- Runtime code should support explicit asset base URL.
- CDN failure must degrade to procedural/static visuals.

## Budgets

Initial budgets:

- Initial mobile 3D transfer: max 3 MB compressed.
- Initial desktop 3D transfer: max 8 MB compressed.
- Single lazy GLB: max 10 MB compressed unless approved.
- Single normal runtime KTX2 texture: max 4 MB compressed.
- High-detail lazy pack: max 25 MB compressed.
- Any PR increasing first-load JS, route build output, or public visual assets by more than 15% needs review notes.

Committed assets:

- No individual committed visual asset over 500 KB without justification.
- Total new public visual assets per PR under 2 MB unless it is an asset-pipeline PR.
- No raw 4K/8K PNG/JPG dumps in git.

## First Asset Slice

Start with Caldera Garden as the hero-quality planet:

- NASA-derived Earth-like base.
- Night/civilization mask.
- Cloud shell.
- Atmosphere.
- Damage mask.
- Ash/glass treatment.
- KTX2 LODs.
- Procedural fallback.

Start with Ark Shipyard Skeleton as the GLB megastructure pilot:

- Modular truss kit.
- Dock clamps.
- Hull silhouettes.
- Emissive diagnostics.
- Large invisible hit target preserved.
- Primitive fallback.

## Rejection Criteria

Reject an asset if:

- No direct source URL.
- No license.
- No exact credit text.
- Unclear third-party rights.
- NASA/ESA/ESO logo or endorsement implication.
- AI output falsely attributed to a source agency.
- Missing AI provenance.
- Missing Blender/source provenance.
- Raw oversized texture in git.
- No compression.
- No mobile fallback.
- No CDN-failure fallback.
- Exceeds budget without written exception.

## Reference Links

- Three.js GLTFLoader: https://threejs.org/docs/pages/GLTFLoader.html
- Three.js KTX2Loader: https://threejs.org/docs/pages/KTX2Loader.html
- Khronos KTX: https://www.khronos.org/ktx/
- Blender glTF exporter: https://docs.blender.org/manual/en/latest/addons/import_export/scene_gltf2.html
- NASA media guidelines: https://www.nasa.gov/nasa-brand-center/images-and-media/
- ESA media terms: https://www.esa.int/ESA_Multimedia/Terms_and_conditions_of_use_of_images_and_videos_available_on_the_esa_website
- ESO copyright: https://eso.org/public/copyright/

