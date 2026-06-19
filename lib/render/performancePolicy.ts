import type { Capability } from "./capability";

/**
 * A concrete, resolved render budget derived from a {@link Capability}. Every
 * downstream system (instancing counts, LOD selection, post pipeline, DPR
 * clamping, animation speed) reads its limits from here.
 */
export interface Budget {
  /** Number of background stars to instance. */
  starCount: number;
  /** Number of debris particles to instance. */
  debrisCount: number;
  /** Number of Dyson swarm panels to instance. */
  dysonPanels: number;
  /** Highest planet LOD permitted on this client. */
  planetLodCap: "hero" | "mid" | "low" | "fallback";
  /** Number of volumetric corona shells around the star. */
  coronaShells: number;
  /** Whether GPU compute passes (WebGPU only) may run. */
  useCompute: boolean;
  /** Whether any post-processing pipeline should run. */
  usePost: boolean;
  /** Whether gravitational lensing post-effect may run. */
  useLensing: boolean;
  /** Device-pixel-ratio clamp as `[min, max]`. */
  dpr: [number, number];
  /** Global animation speed multiplier; 0 freezes the scene. */
  speedMultiplier: number;
}

/**
 * Linearly scale a per-mode maximum count by GPU tier, then floor to an int.
 * Tier 3 yields the full `max`; lower tiers receive a proportional share so a
 * tier-2 WebGPU client isn't asked to drive the same load as a tier-3 one.
 */
function scaleByTier(max: number, tier: 0 | 1 | 2 | 3): number {
  return Math.floor((max * tier) / 3);
}

/**
 * The single source of truth for tier -> count budget tables. This is the only
 * module permitted to encode these tables.
 *
 * Reference anchors (webgpu tier3 -> webgl2 tier1 -> static):
 * - starCount:   60000 / 12000 / 0
 * - dysonPanels:  4000 /   900 / 0
 * - debrisCount:  6000 /  1500 / 0
 * - coronaShells:    3 /     1 / 0
 * - planetLodCap: "hero" / "low" / "fallback"
 *
 * Counts scale with tier within each mode. `static` is the poster: zero counts,
 * `"fallback"` LOD, no post, frozen animation.
 *
 * @param capability A probed {@link Capability} from `detectCapability`.
 * @returns The resolved {@link Budget} for this client.
 */
export function policy(capability: Capability): Budget {
  const { mode, tier, reducedMotion, pageVisible } = capability;

  // Hidden tab always freezes; otherwise reduced-motion / static poster freezes.
  let speedMultiplier: number;
  if (!pageVisible) {
    speedMultiplier = 0;
  } else if (reducedMotion || mode === "static") {
    speedMultiplier = 0;
  } else {
    speedMultiplier = 1;
  }

  const dpr: [number, number] = tier <= 1 ? [1, 1.2] : [1, 2];

  if (mode === "static") {
    return {
      starCount: 0,
      debrisCount: 0,
      dysonPanels: 0,
      planetLodCap: "fallback",
      coronaShells: 0,
      useCompute: false,
      usePost: false,
      useLensing: false,
      dpr,
      speedMultiplier,
    };
  }

  if (mode === "webgpu") {
    return {
      starCount: scaleByTier(60000, tier),
      debrisCount: scaleByTier(6000, tier),
      dysonPanels: scaleByTier(4000, tier),
      planetLodCap: "hero",
      coronaShells: tier >= 3 ? 3 : 2,
      useCompute: true,
      usePost: true,
      // Lensing only on capable WebGPU GPUs.
      useLensing: tier >= 2,
      dpr,
      speedMultiplier,
    };
  }

  // mode === "webgl2"
  return {
    starCount: scaleByTier(12000, tier),
    debrisCount: scaleByTier(1500, tier),
    dysonPanels: scaleByTier(900, tier),
    // WebGL2 weak GPUs (tier <= 1) get the lowest LOD; stronger ones get mid.
    planetLodCap: tier <= 1 ? "low" : "mid",
    coronaShells: tier <= 1 ? 1 : 2,
    useCompute: false,
    // Bloom-only is fine to signal as post.
    usePost: true,
    useLensing: false,
    dpr,
    speedMultiplier,
  };
}
