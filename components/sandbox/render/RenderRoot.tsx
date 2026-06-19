"use client";

import { Canvas } from "@react-three/fiber";
import { useCallback, useMemo, useState } from "react";
import type { WebGLRenderer } from "three";
import { StarFallback } from "@/components/fallbacks/StarFallback";
import type { Capability, RenderMode } from "@/lib/render/capability";
import { policy } from "@/lib/render/performancePolicy";
import { TestStar } from "./TestStar";

/** Props for {@link RenderRoot}. */
export interface RenderRootProps {
  /** Probed client capability that selects the initial render pipeline. */
  capability: Capability;
}

/**
 * The subset of R3F's `DefaultGLProps` the WebGPU factory actually needs. Typing
 * the parameter as this supertype keeps the factory assignable to R3F's
 * `(defaultProps: DefaultGLProps) => Promise<Renderer>` gl-factory signature
 * without depending on a `DefaultGLProps` re-export (it is not exported from the
 * package entry).
 */
interface GlFactoryProps {
  // R3F hands its own `HTMLCanvasElement | OffscreenCanvas` union, but its
  // `OffscreenCanvas` is a distinct minimal declaration from lib.dom's, so we
  // widen to their common supertype `EventTarget` to stay assignable, then
  // narrow back to `HTMLCanvasElement` at construction (R3F always passes the
  // real <canvas> at runtime).
  canvas: HTMLCanvasElement | EventTarget;
}

/**
 * Step a render mode down one rung on failure: webgpu -> webgl2 -> static.
 * Used when a renderer reports an unrecoverable error (context loss / device
 * error) so the experience degrades safely instead of going blank.
 */
function degradeMode(mode: RenderMode): RenderMode {
  if (mode === "webgpu") return "webgl2";
  return "static";
}

/**
 * S0 render foundation. Owns the R3F `<Canvas>` and the renderer factory, and
 * is the ONLY place where the WebGPU / WebGL2 / static split lives.
 *
 * - `webgpu`: an async `gl` factory lazily imports `three/webgpu`, constructs a
 *   `WebGPURenderer`, and `await`s `renderer.init()` before the first frame.
 * - `webgl2`: the default `WebGLRenderer` with the repo's standard gl options.
 * - `static`: no canvas, just the existing {@link StarFallback} poster.
 *
 * On an unrecoverable renderer error the active mode steps down one rung. The
 * `<Canvas>` is keyed on the active mode so a downgrade cleanly remounts it.
 */
export function RenderRoot({ capability }: RenderRootProps) {
  const [activeMode, setActiveMode] = useState<RenderMode>(capability.mode);
  const budget = useMemo(
    () => policy({ ...capability, mode: activeMode }),
    [capability, activeMode],
  );

  const handleDegrade = useCallback(() => {
    setActiveMode((mode) => degradeMode(mode));
  }, []);

  const handleCreated = useCallback(
    ({ gl }: { gl: WebGLRenderer }) => {
      const canvas = gl.domElement;
      canvas.addEventListener(
        "webglcontextlost",
        (event: Event) => {
          event.preventDefault();
          handleDegrade();
        },
        { once: true },
      );
    },
    [handleDegrade],
  );

  if (activeMode === "static") {
    return (
      <div className="absolute inset-0 z-0 bg-void">
        <StarFallback />
      </div>
    );
  }

  const glFactory =
    activeMode === "webgpu"
      ? async (defaultProps: GlFactoryProps) => {
          const { WebGPURenderer } = await import("three/webgpu");
          // Pass only the canvas plus our own flags. WebGPU's parameter type
          // rejects WebGL-only fields (precision, premultipliedAlpha,
          // powerPreference "default", …) that R3F's DefaultGLProps carries, so
          // spreading the full props object would not type-check.
          const renderer = new WebGPURenderer({
            canvas: defaultProps.canvas as HTMLCanvasElement,
            antialias: capability.tier > 1,
            alpha: false,
            powerPreference: "high-performance",
          });
          await renderer.init();
          return renderer;
        }
      : undefined;

  return (
    <div className="absolute inset-0 z-0 bg-void">
      <Canvas
        key={activeMode}
        camera={{ position: [0, 0, 5], fov: 50 }}
        dpr={budget.dpr}
        frameloop={budget.speedMultiplier === 0 ? "demand" : "always"}
        gl={
          glFactory ?? {
            antialias: capability.tier > 1,
            powerPreference: "high-performance",
            stencil: false,
            depth: true,
            alpha: false,
          }
        }
        onCreated={handleCreated}
      >
        <color attach="background" args={["#030406"]} />
        <ambientLight intensity={0.12} />
        <TestStar speedMultiplier={budget.speedMultiplier} />
      </Canvas>
    </div>
  );
}
