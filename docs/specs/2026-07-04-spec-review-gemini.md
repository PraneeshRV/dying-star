# Adversarial Design & Tech Spec Review — Mission Control

This document contains the adversarial technical and design review of the "Mission Control" portfolio revamp spec (`docs/specs/2026-07-04-portfolio-revamp-design.md`) and the current implementation files in `revamp/mission-control`.

---

## Technical & Design Findings

### 1. Static Import of R3F/Three.js in Root Page
* **Severity:** BLOCKER
* **Evidence:** [app/page.tsx:1](file:///home/praneesh/Praneesh/Portfolio/dying-star/app/page.tsx#L1), [app/page.tsx:94](file:///home/praneesh/Praneesh/Portfolio/dying-star/app/page.tsx#L94)
* **Finding:** `SpaceCanvas` is imported statically. This forces the massive R3F, Three.js, and Postprocessing bundles into the main landing page bundle. On mobile devices, this will severely damage Lighthouse metrics (blocking the main thread for JS parse/compile and delaying First Contentful Paint).
* **Fix:** Convert the import of `SpaceCanvas` in `app/page.tsx` to a dynamic import using `next/dynamic` with `ssr: false` and render the `StarFallback` component during lazy-loading:
  ```typescript
  import dynamic from "next/dynamic";
  const SpaceCanvas = dynamic(
    () => import("@/components/3d/SpaceCanvas").then((m) => m.SpaceCanvas),
    { ssr: false, loading: () => <StarFallback /> }
  );
  ```

### 2. Redundant 3D Asset Loading under Fallback/Reduced-Motion
* **Severity:** MAJOR
* **Evidence:** [components/3d/SpaceCanvas.tsx:81-89](file:///home/praneesh/Praneesh/Portfolio/dying-star/components/3d/SpaceCanvas.tsx#L81-L89), [components/3d/SpaceCanvas.tsx:121-127](file:///home/praneesh/Praneesh/Portfolio/dying-star/components/3d/SpaceCanvas.tsx#L121-L127)
* **Finding:** `SpaceCanvas` checks for WebGL support and `reducedMotion` inside its `useEffect` hook, reverting to `<StarFallback />` by setting state. However, because the component itself was mounted, the dynamically imported R3F/Three.js chunks have *already* been fetched, parsed, and initialized by the browser. 
* **Fix:** Extract the `prefers-reduced-motion` and viewport/WebGL checks into a helper or parent level in `app/page.tsx`. If the checks trigger fallback conditions, render `StarFallback` directly, bypassing the `SpaceCanvas` mount and preventing the dynamic chunk fetch entirely:
  ```typescript
  const reducedMotion = useReducedMotion();
  const isMobile = useMediaQuery("(max-width: 768px)");
  
  if (reducedMotion || isMobile) {
    return <StarFallback />;
  }
  return <SpaceCanvas />;
  ```

### 3. Verification Script Failure: `verify-space-realism.mjs`
* **Severity:** BLOCKER
* **Evidence:** [scripts/verify-space-realism.mjs:26-30](file:///home/praneesh/Praneesh/Portfolio/dying-star/scripts/verify-space-realism.mjs#L26-L30)
* **Finding:** The spec lists `OrbitalBodies.tsx`, `PlanetSurface.tsx`, and `SystemCamera.tsx` in the kill list. However, `verify-space-realism.mjs` is NOT in the spec's kill list and directly imports these three files. Running `npm run verify` will crash with file-not-found errors during compilation.
* **Fix:** Add `verify-space-realism.mjs` to the Kill list in the spec, or update the script to only import and assert on `SpaceCanvas.tsx` and `NeutronStar.tsx`.

### 4. Asset Ledger Points to Killed Shaders and Geometries
* **Severity:** BLOCKER
* **Evidence:** [content/data/space-asset-ledger.json:17](file:///home/praneesh/Praneesh/Portfolio/dying-star/content/data/space-asset-ledger.json#L17), [content/data/space-asset-ledger.json:37](file:///home/praneesh/Praneesh/Portfolio/dying-star/content/data/space-asset-ledger.json#L37)
* **Finding:** The spec schedules the deletion of `PlanetSurface.tsx` and `DysonSphere.tsx`. However, `verify-space-assets.mjs` (which is kept) parses `space-asset-ledger.json` and asserts that every listed asset exists locally. Running `npm run verify` will crash during Phase 0 because these referenced components are missing.
* **Fix:** Prune the `procedural-planet-textures-v1` and `procedural-dyson-geometry-v1` assets from `content/data/space-asset-ledger.json` as part of the Phase 0 cleanup.

### 5. Early Deletion of `GlitchText` and `TypewriterText` Breaks Existing Sections
* **Severity:** MAJOR
* **Evidence:** [components/sections/AboutSection.tsx:1-2](file:///home/praneesh/Praneesh/Portfolio/dying-star/components/sections/AboutSection.tsx#L1-L2), [components/sections/ProjectsSection.tsx:6](file:///home/praneesh/Praneesh/Portfolio/dying-star/components/sections/ProjectsSection.tsx#L6) (and all other sections)
* **Finding:** The spec orders the deletion of `GlitchText`, `TypewriterText`, and `CustomCursor` in Phase 0 (hygiene/cut). However, all 8 existing section components statically import and render these UI elements. Deleting them immediately breaks the build and prevents local validation until Phase 2 is completed.
* **Fix:** Reschedule the deletion of UI utilities (`GlitchText`, `TypewriterText`) from Phase 0 to Phase 2 (sections + content) to align with when their consuming files are rewritten.

### 6. Root Layout Compilation Breakage: `CustomCursor`
* **Severity:** BLOCKER
* **Evidence:** [app/layout.tsx:4](file:///home/praneesh/Praneesh/Portfolio/dying-star/app/layout.tsx#L4), [app/layout.tsx:109](file:///home/praneesh/Praneesh/Portfolio/dying-star/app/layout.tsx#L109)
* **Finding:** Deleting `CustomCursor.tsx` in Phase 0 without updating `app/layout.tsx` causes a compiler crash because the root layout statically imports and mounts it.
* **Fix:** Update Phase 0 task definitions to explicitly remove `CustomCursor` imports and tags from `app/layout.tsx` during deletions.

### 7. Broken Barrel Exports in `components/3d/index.ts`
* **Severity:** MAJOR
* **Evidence:** [components/3d/index.ts:16-56](file:///home/praneesh/Praneesh/Portfolio/dying-star/components/3d/index.ts#L16-L56)
* **Finding:** The barrel file exports killed elements (e.g. `Megastructures`, `Constellation`, `PathwayRemnants`, `SystemCamera`). Deleting these files without editing `index.ts` leaves dead exports that fail Next.js compilation.
* **Fix:** Add a Phase 0 task to prune all killed 3D components from the `components/3d/index.ts` barrel file.

### 8. Styling Pollution: Gradients and Glows in `app/globals.css`
* **Severity:** MAJOR
* **Evidence:** [app/globals.css:24-34](file:///home/praneesh/Praneesh/Portfolio/dying-star/app/globals.css#L24-L34), [app/globals.css:73-79](file:///home/praneesh/Praneesh/Portfolio/dying-star/app/globals.css#L73-L79)
* **Finding:** `app/globals.css` contains legacy color mappings (e.g. `--color-green` mapping to cyan `#58f3ff` and `--color-purple`) and glow utilities. If left in place, these tokens will bleed into rebuilt sections, violating the "near-black + single ember/orange accent" palette constraint.
* **Fix:** Strip the legacy color mappings from `@theme inline` in `app/globals.css` and map all highlights/focus rings strictly to the ember accent (`--color-ember: #ff7a45`) and grayscale ramp.

### 9. Route Inconsistency Between Spec and Masterplan
* **Severity:** MINOR
* **Evidence:** [docs/specs/2026-07-04-portfolio-revamp-design.md:50](file:///home/praneesh/Praneesh/Portfolio/dying-star/docs/specs/2026-07-04-portfolio-revamp-design.md#L50), [docs/MASTERPLAN.md:82](file:///home/praneesh/Praneesh/Portfolio/dying-star/docs/MASTERPLAN.md#L82)
* **Finding:** The design spec lists the blog route as `/writeups` (lines 50, 102), whereas the `MASTERPLAN.md` strategy defines the route as `/blog` and `/blog/[slug]` (line 82). This mismatch will cause routing confusion or broken references during implementation.
* **Fix:** standardise the route name as `/blog` across both files, and keep `/writeups` as a legacy redirect if necessary.

### 10. Broken Mobile PDF Rendering on `/resume` Page
* **Severity:** MAJOR
* **Evidence:** [app/resume/page.tsx:81](file:///home/praneesh/Praneesh/Portfolio/dying-star/app/resume/page.tsx#L81)
* **Finding:** The `/resume` page embeds the PDF inside a raw `iframe`. Iframe PDF embeds are notoriously broken on iOS Safari and Android Chrome, often rendering empty or trapping the viewport scroll. Mobile-first recruiters will get a degraded experience.
* **Fix:** Wrap the iframe in a media query container that hides it on screens `<md` (768px), and render a highly visible download/view PDF CTA button instead.

### 11. AI Red Teaming Target Positioning Deficit
* **Severity:** MAJOR
* **Evidence:** [docs/specs/2026-07-04-portfolio-revamp-design.md:55-56](file:///home/praneesh/Praneesh/Portfolio/dying-star/docs/specs/2026-07-04-portfolio-revamp-design.md#L55-L56), [docs/MASTERPLAN.md:151-152](file:///home/praneesh/Praneesh/Portfolio/dying-star/docs/MASTERPLAN.md#L151-L152)
* **Finding:** AI Red Teaming requires specialized knowledge (LLM security, prompt injection, jailbreaks, data poisoning). The spec highlights TryHackMe/HTB stats as the primary telemetry. For AI red team recruiters, leading with standard network/web CTF stats obscures the AI-specific specialization.
* **Fix:** Restructure the "Research / Security" section telemetry to prioritize AI exploit research, LLM vulnerabilities, and tools (e.g. RedCalibur), and demote HTB/TryHackMe stats to a secondary "Security Foundations" tier.

### 12. Local Hook vs. Global Zustand Store Redundancy
* **Severity:** MINOR
* **Evidence:** [stores/globalStore.ts:32](file:///home/praneesh/Praneesh/Portfolio/dying-star/stores/globalStore.ts#L32), [stores/globalStore.ts:55-56](file:///home/praneesh/Praneesh/Portfolio/dying-star/stores/globalStore.ts#L55-L56)
* **Finding:** The Zustand store contains `reducedMotion` state and a `setReducedMotion` action that are never updated or read. Instead, components use the custom hook `useReducedMotion()`.
* **Fix:** Remove the dead state and actions from the Zustand global store to keep the state footprint clean.

### 13. SSAO Post-Processing Overhead on Mobile Viewports
* **Severity:** MAJOR
* **Evidence:** [components/3d/SpaceCanvas.tsx:149-150](file:///home/praneesh/Praneesh/Portfolio/dying-star/components/3d/SpaceCanvas.tsx#L149-L150)
* **Finding:** `SpaceCanvas` enables Bloom and SSAO post-processing based purely on the detected GPU tier (e.g., `tier >= 2`). Mid-range mobile devices can detect as tier 2 but will suffer significant frame rate drops and high thermal load when running full-screen post-processing.
* **Fix:** Force disable Bloom and SSAO post-processing passes on all mobile screen widths (e.g., `isMobile || compactViewport`) regardless of the GPU tier.

### 14. Heavy GLSL Shader Math on Mobile / Integrated GPUs
* **Severity:** MAJOR
* **Evidence:** [components/3d/NeutronStar.tsx:47-56](file:///home/praneesh/Praneesh/Portfolio/dying-star/components/3d/NeutronStar.tsx#L47-L56)
* **Finding:** The FBM noise helper functions in `NeutronStar.tsx` run 4 octaves of noise calculations per pixel. When rendered on mobile/high-DPI screens, this creates high fragment shader overhead, causing thermal throttling and lag.
* **Fix:** Limit the FBM loop inside the GLSL fragment shaders to 2 octaves on mobile viewports or low-end GPU tiers to reduce computation.

### 15. Performance Block: Rapid React State Updates in `BootLoader`
* **Severity:** MINOR
* **Evidence:** [components/ui/BootLoader.tsx:78-88](file:///home/praneesh/Praneesh/Portfolio/dying-star/components/ui/BootLoader.tsx#L78-L88)
* **Finding:** The terminal typing effect sets local state (`setActiveLine` and `setProgress`) on every single character change (every 28ms). This triggers constant React re-renders during the critical initial bundle evaluation and page load phase, locking the main thread.
* **Fix:** Throttle the progress indicator state changes (e.g. update progress only at the completion of each line) or increase the step interval to reduce the render frequency.
