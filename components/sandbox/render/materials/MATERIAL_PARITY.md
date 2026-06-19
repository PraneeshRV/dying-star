# Test Star — Material Parity (S0)

The S0 test star is authored **once in TSL** (`testStarMaterial.ts`) and
compiles to both backend shading languages from that single source. There is no
hand-written GLSL fallback for S0 because every node used (`mx_noise_float`,
`mix`, `positionLocal`, `time`, `uniform`, `vec3`) compiles cleanly down both
paths.

| Feature                | WebGPU (TSL→WGSL) | WebGL2 (TSL→GLSL) |
| ---------------------- | ----------------- | ----------------- |
| Emissive plasma noise  | ✅ from TSL        | ✅ from TSL        |
| Time animation         | ✅ from TSL        | ✅ from TSL        |
| Color mix (cool ↔ hot) | ✅ from TSL        | ✅ from TSL        |

## Notes

- The same `MeshStandardNodeMaterial` instance renders under either
  `WebGPURenderer` (WGSL) or `WebGLRenderer` (GLSL) in three `0.184` — no
  per-backend branching in this material.
- **Deferred to later phases:** compute-only effects (GPU particle sims,
  storage-buffer passes) do **not** transpile to WebGL2 automatically. Those
  will require explicitly declared instanced / hand-written GLSL fallbacks when
  introduced; S0 intentionally avoids them.
