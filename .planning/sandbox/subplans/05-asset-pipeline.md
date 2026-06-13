# Subplan 05 — Asset Pipeline & Governance

**Phase:** S8 (but enforced incrementally from S3 onward — the first KTX2/GLB triggers it).
**Inherits:** the approved `docs/superpowers/specs/2026-05-01-asset-pipeline-design.md` wholesale. This file is the sandbox-scoped application of it.

---

## 1. Formats (bleeding-edge, web-correct)

- Models: **GLB / glTF** with **Draco** or **meshopt** compression. Loaded via `GLTFLoader` + `DRACOLoader`/meshopt decoder.
- Textures: **KTX2 / Basis Universal** via `KTX2Loader` (GPU-compressed, mip-mapped). Never raw 4K PNG/JPG at runtime.
- Planet LODs: `hero` 4096×2048 → `mid` 2048×1024 → `low` 1024×512 → `fallback` procedural DataTexture (existing path).
- Everything has a **procedural fallback** — the scene must fully render with zero external assets.

## 2. Storage layout

```
source/raw        # original downloads/generations + provenance sidecar
source/working    # Blender/GIMP/Substance, prompts, masks, LUTs
public/runtime/models     # small committed GLB (<500 KB each)
public/runtime/textures   # small committed KTX2
runtime-cdn/      # large packs → content-hashed on R2/CDN, NOT in git
content/data/asset-ledger.json   # the ledger (see §4)
```

Runtime code reads an **asset base URL** env (`NEXT_PUBLIC_ASSET_BASE`) so big packs live on a CDN; **CDN failure must degrade to procedural**.

## 3. Budgets (hard, enforced in verifier + PR notes)

- Initial mobile 3D transfer ≤ **3 MB** compressed; desktop ≤ **8 MB**.
- Single lazy GLB ≤ 10 MB; single runtime KTX2 ≤ 4 MB; high-detail lazy pack ≤ 25 MB.
- Committed visual asset ≤ **500 KB** each; total new public visual assets/PR ≤ 2 MB (except asset-pipeline PRs).
- Any PR raising first-load JS / route output / public assets > 15% needs written review notes.
- No raw 4K/8K dumps in git.

## 4. Asset ledger (`content/data/asset-ledger.json`, verified)

Every non-procedural asset needs an entry **before** it is referenced. Reuse the existing `verify-space-assets.mjs` precedent; extend its schema:

Required fields: `id, sourceUrl, sourceOrg, author/credit, license, licenseUrl, downloadDate, localPath|cdnPath, checksum, transformations[], generated(bool), tool/model/prompt/seed (if generated), workingFile, compression, runtimeBudgetBytes, fallback (assetId|"procedural"), reviewer, approvalDate`.

`verify-sandbox-world.mjs` rejects any `asset` id in `sandbox-system.json` lacking a ledger entry **or** a declared fallback.

## 5. Source policy (legal guardrails)

- **NASA** (Blue Marble, Black Marble, CGI Moon Kit, MOLA Mars): allowed per-asset, record credit, no logos/endorsement implication.
- **ESA**: mixed — only assets with explicit reusable terms; avoid ShareAlike unless willing to comply.
- **ESO**: attribution-friendly but needs visible/reachable credit for hero imagery.
- **Generated (AI)**: full provenance (tool/model/date/prompt/seed/inputs/human-edits); **must not** be falsely attributed to NASA/ESA/ESO.
- Visible hero attribution lives in a reachable credits panel (HUD "Sources"), not only a hidden README.

## 6. First asset slice (matches approved spec)

- **Caldera Garden** = first hero planet: NASA-derived Earth base + night mask + cloud shell + atmosphere + damage mask + ash/glass treatment, KTX2 LODs, procedural fallback.
- **Ark Shipyard** = first GLB pilot: modular truss + dock clamps + hull silhouettes + emissive diagnostics, large invisible hit target, primitive fallback.

## 7. Rejection criteria (auto-fail review)

No source URL · no license · no exact credit · unclear third-party rights · NASA/ESA/ESO logo/endorsement · AI falsely attributed · missing AI/Blender provenance · oversized raw texture in git · no compression · no mobile fallback · no CDN-failure fallback · over budget without written exception.
