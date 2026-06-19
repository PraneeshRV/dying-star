import { getGPUTier } from "@pmndrs/detect-gpu";

/**
 * The rendering pipeline a client is capable of driving.
 *
 * - `"webgpu"`: WebGPU adapter available and GPU is strong enough for compute.
 * - `"webgl2"`: WebGL2 context creatable (or down-ranked WebGPU on weak GPUs).
 * - `"static"`: No suitable GPU path, or reduced-motion preference => static poster.
 */
export type RenderMode = "webgpu" | "webgl2" | "static";

/**
 * A snapshot of the client's rendering capability and environment, used by
 * {@link "./performancePolicy".policy} to derive concrete render budgets.
 */
export interface Capability {
  /** Selected rendering pipeline after probing and down-ranking. */
  mode: RenderMode;
  /** GPU tier from detect-gpu; 0 means detection failed => treat as low. */
  tier: 0 | 1 | 2 | 3;
  /** `prefers-reduced-motion: reduce` is active. */
  reducedMotion: boolean;
  /** Viewport matches `(max-width: 720px)`. */
  compactViewport: boolean;
  /** Document is currently visible (not a backgrounded tab). */
  pageVisible: boolean;
}

/**
 * Minimal structural types for the WebGPU surface this probe touches. The full
 * `GPU`/`GPUAdapter` lib types are not guaranteed to be present (no
 * `@webgpu/types`, and not in lib.dom at this target), so we model only what we
 * use rather than reaching for `any`.
 */
interface MinimalGPUAdapter {
  readonly __brand?: "GPUAdapter";
}
interface MinimalGPU {
  requestAdapter(): Promise<MinimalGPUAdapter | null>;
}

/** Clamp an arbitrary number to the discrete tier domain `0 | 1 | 2 | 3`. */
function clampTier(value: number): 0 | 1 | 2 | 3 {
  if (value >= 3) return 3;
  if (value >= 2) return 2;
  if (value >= 1) return 1;
  return 0;
}

/**
 * Probe the current client for its best available rendering pipeline and GPU
 * tier. Client-only: all browser globals are read inside the function, never at
 * module import time, so this file is safe in a `"use client"` boundary.
 *
 * Decision order:
 * 1. Read reduced-motion, compact-viewport, and page-visibility flags.
 * 2. If reduced-motion is set, force `"static"` (hero poster parity) but still
 *    probe the GPU tier below.
 * 3. Else if a WebGPU adapter resolves non-null, use `"webgpu"`. Note that
 *    `navigator.gpu` can exist while `requestAdapter()` resolves to `null`
 *    (disabled by flag/driver), so adapter truthiness is the real signal.
 * 4. Else if a WebGL2 context is creatable, use `"webgl2"`.
 * 5. Else use `"static"`.
 * 6. Probe the GPU tier via detect-gpu (tier falls back to 1 if a GL context
 *    exists, else 0, on failure).
 * 7. Down-rank `"webgpu"` to `"webgl2"` when tier <= 1 to avoid compute soup on
 *    weak integrated GPUs.
 *
 * @returns A resolved {@link Capability} describing the chosen pipeline.
 */
export async function detectCapability(): Promise<Capability> {
  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  const compactViewport = window.matchMedia("(max-width: 720px)").matches;
  const pageVisible = !document.hidden;

  // A creatable WebGL2 context is both a mode candidate and the tier fallback
  // signal, so probe it once and reuse the result.
  const hasWebgl2 =
    document.createElement("canvas").getContext("webgl2") !== null;

  let mode: RenderMode;
  if (reducedMotion) {
    mode = "static";
  } else {
    const nav = navigator as Navigator & { gpu?: MinimalGPU };
    let adapter: MinimalGPUAdapter | null = null;
    if ("gpu" in navigator && nav.gpu) {
      adapter = await nav.gpu.requestAdapter();
    }
    if (adapter) {
      mode = "webgpu";
    } else if (hasWebgl2) {
      mode = "webgl2";
    } else {
      mode = "static";
    }
  }

  let tier: 0 | 1 | 2 | 3;
  try {
    const result = await getGPUTier();
    tier = clampTier(result.tier);
  } catch {
    tier = hasWebgl2 ? 1 : 0;
  }

  // Avoid compute soup on weak integrated GPUs.
  if (mode === "webgpu" && tier <= 1) {
    mode = "webgl2";
  }

  return { mode, tier, reducedMotion, compactViewport, pageVisible };
}
