# Subplan 01 — Render Pipeline (WebGPU + TSL, WebGL2 fallback)

**Phase:** S0 (foundation) — must land before any content phase.
**Goal:** prove the bleeding-edge path renders and degrades safely, and give every later phase a single material/factory pattern to follow.

---

## 1. Capability detection (`lib/render/capability.ts`)

A pure, client-only async probe returning one of three modes plus inputs for `PerformancePolicy`.

```ts
export type RenderMode = "webgpu" | "webgl2" | "static";
export interface Capability {
  mode: RenderMode;
  tier: 0 | 1 | 2 | 3;        // from detect-gpu, 0 = detection failed → treat as low
  reducedMotion: boolean;
  compactViewport: boolean;   // matchMedia max-width:720px
  pageVisible: boolean;
}
```

Decision order:
1. `reducedMotion || !pageVisible-on-load` → still allow canvas but `PerformancePolicy` zeroes motion; reduced-motion stays **static poster** for hero parity with the existing site.
2. `navigator.gpu` present → `await navigator.gpu.requestAdapter()`; success → `webgpu`.
3. else WebGL2 context creatable → `webgl2`.
4. else → `static`.
5. In parallel run `getGPUTier()` (already a dependency) → `tier`. WebGPU + tier≤1 (e.g. weak integrated) may be down-ranked to `webgl2` by policy to avoid compute soup.

**Gotcha:** `requestAdapter()` can resolve to `null` even when `navigator.gpu` exists (disabled by flag/driver). Always check the adapter, not just `navigator.gpu`.

---

## 2. RenderRoot (`components/sandbox/render/RenderRoot.tsx`)

Owns the R3F `<Canvas>` and the renderer factory. Client component.

```tsx
// WebGPU path — async gl factory (R3F 9 awaits it)
const glFactory = async (props) => {
  const { WebGPURenderer } = await import("three/webgpu");
  const renderer = new WebGPURenderer({ ...props, antialias: tier > 1, alpha: false });
  await renderer.init();            // REQUIRED before first frame
  return renderer;
};
```

- WebGPU branch: `gl={glFactory}` + `frameloop` managed by R3F. Lazy `import("three/webgpu")` keeps it out of the WebGL2 bundle.
- WebGL2 branch: omit factory (default `WebGLRenderer`), reuse the existing `SpaceCanvas` gl options.
- `static` branch: render `<StarFallback />` (existing) — no Canvas.
- `onCreated`: wire `webglcontextlost`/WebGPU `uncapturederror` → flip to `webgl2` then `static`.
- DPR capped by tier (`tier<=1 ? [1,1.2] : [1,2]`).

**SSR:** `RenderRoot` is `"use client"` and dynamically imported with `ssr:false` from `SandboxExperience` to avoid `navigator`/`GPUDevice` access during prerender. The server page renders only metadata + a no-JS DOM shell.

---

## 3. Material authoring pattern (TSL-first)

Author **every** surface as a TSL node material so it compiles to WGSL (WebGPU) and GLSL (WebGL2) from one source.

```ts
import { Fn, vec3, positionLocal, time, mx_noise_float, mix, dot, normalView } from "three/tsl";
import { MeshStandardNodeMaterial } from "three/webgpu";
```

Rules:
- One factory per object: `createNeutronStarMaterial(opts)`, `createPlanetMaterial(opts)`, returning a `*NodeMaterial`.
- Compute-only effects (storage-buffer particles) live behind a capability check: TSL `compute()` on WebGPU, **instanced BufferGeometry + GLSL** fallback on WebGL2. Declare the fallback in the same file.
- No per-frame allocation: uniforms via `uniform()` nodes mutated in place; reuse the existing repo discipline (all `Vector3/Color` in `useMemo`).
- Keep a `MATERIAL_PARITY.md` note per object listing "WebGPU has X, WebGL2 fallback does Y" so QA can verify both paths.

---

## 4. PerformancePolicy (`lib/render/performancePolicy.ts`)

Single source of truth. Pure function `policy(capability) → Budget`.

```ts
interface Budget {
  starCount: number; debrisCount: number; dysonPanels: number;
  planetLodCap: "hero" | "mid" | "low" | "fallback";
  coronaShells: number; useCompute: boolean; usePost: boolean;
  useLensing: boolean; dpr: [number, number]; speedMultiplier: number;
}
```

Reference values (WebGPU tier3 → webgl2 tier1 → static):
- starCount: 60000 → 12000 → 0 (poster)
- dysonPanels: 4000 (compute) → 900 (instanced) → ring band
- coronaShells: 3 → 1 → n/a
- useCompute: true → false → false
- usePost: bloom+TAA+DoF → bloom → none
- speedMultiplier: 1 → 1 → 0 (hidden tab → 0 always)

Every later component reads from `Budget`, never re-derives tier logic. This kills the "tier math copy-pasted in five files" smell already starting in `SpaceCanvas`/`SandboxCanvas`.

---

## 5. S0 verification (`scripts/verify-sandbox-render.mjs`)

Added to the `verify:system` chain. Static checks (no GPU in CI):
- `RenderRoot` exports all three branches; `static` path imports `StarFallback`.
- `capability.ts` checks adapter (regex `requestAdapter`), not just `navigator.gpu`.
- `three/webgpu` import is dynamic (`await import`), not top-level (bundle guard).
- `performancePolicy` is the only file with tier→count tables (grep guard).

Browser smoke (production preview, manual + Playwright later):
- WebGPU-capable Chromium: canvas non-blank, ≥5 color clusters, pixels change after 800 ms.
- Force WebGL2 (flag off): fallback material renders, non-blank.
- Force no-WebGL / reduced-motion: static poster, hero copy + DOM nav present.
- Viewport matrix `1440×900 / 1280×800 / 768×1024 / 390×844 / 360×740`, no horizontal overflow.

**Exit gate for S0:** all three modes render the single TSL test star on `next build && next start`, verifier green, matrix clean. Only then proceed to S1.
