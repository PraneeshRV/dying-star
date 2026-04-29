"use client";

import { getGPUTier } from "@pmndrs/detect-gpu";
import { Canvas } from "@react-three/fiber";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import { Suspense, useCallback, useEffect, useState } from "react";
import type { WebGLRenderer } from "three";
import { StarFallback } from "@/components/fallbacks/StarFallback";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useGlobalStore } from "@/stores/globalStore";
import {
  Constellation,
  DysonSphere,
  Megastructures,
  NeutronStar,
  OrbitalBodies,
  PathwayRemnants,
  Starfield,
  SystemCamera,
} from "./index";

type RenderMode = "fallback" | "canvas";

function hasWebGLSupport() {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl2") ?? canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

/**
 * SpaceCanvas — The primary 3D environment for the shattered-star archive.
 *
 * Features:
 * - GPU tier detection for performance scaling
 * - Post-processing Bloom for emissive glows
 * - Auto-rotating orbital view
 * - Suspense for async component loading
 */
export function SpaceCanvas() {
  const loadingComplete = useGlobalStore((state) => state.loadingComplete);
  const [tier, setTier] = useState<number>(2);
  const [renderMode, setRenderMode] = useState<RenderMode>("fallback");
  const [pageVisible, setPageVisible] = useState(true);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const updateVisibility = () => {
      setPageVisible(!document.hidden);
    };

    updateVisibility();
    document.addEventListener("visibilitychange", updateVisibility);
    return () => {
      document.removeEventListener("visibilitychange", updateVisibility);
    };
  }, []);

  useEffect(() => {
    if (!loadingComplete || reducedMotion) {
      setRenderMode("fallback");
      return;
    }

    if (!hasWebGLSupport()) {
      setRenderMode("fallback");
      return;
    }

    let cancelled = false;

    getGPUTier()
      .then((res) => {
        if (cancelled) return;
        setTier(res.tier);
        setRenderMode("canvas");
      })
      .catch(() => {
        if (cancelled) return;
        setTier(1);
        setRenderMode("canvas");
      });

    return () => {
      cancelled = true;
    };
  }, [loadingComplete, reducedMotion]);

  const handleCanvasCreated = useCallback(({ gl }: { gl: WebGLRenderer }) => {
    const handleContextLost = (event: Event) => {
      event.preventDefault();
      setRenderMode("fallback");
    };

    gl.domElement.addEventListener("webglcontextlost", handleContextLost, {
      once: true,
    });
  }, []);

  if (renderMode === "fallback") {
    return (
      <div className="absolute inset-0 z-0 bg-void">
        <StarFallback />
      </div>
    );
  }

  // Performance scaling based on GPU tier (tier 0 = detection failed → treat as low-end)
  const starCount = tier <= 1 ? 800 : tier === 2 ? 2000 : 3500;
  const constellationCount = tier <= 1 ? 250 : tier === 2 ? 500 : 750;
  const speedMultiplier = !pageVisible ? 0 : tier <= 1 ? 0.35 : 1;
  const useBloom = tier > 1 && !reducedMotion;

  return (
    <div className="absolute inset-0 z-0 bg-void">
      <Canvas
        dpr={tier <= 1 ? [1, 1.2] : [1, 2]}
        gl={{
          antialias: tier > 1,
          powerPreference: "high-performance",
          stencil: false,
          depth: true,
          alpha: false,
        }}
        onCreated={handleCanvasCreated}
      >
        <color attach="background" args={["#030406"]} />
        <SystemCamera
          reducedMotion={reducedMotion}
          speedMultiplier={speedMultiplier}
        />

        <ambientLight intensity={0.18} />
        <pointLight position={[0, 0, 0]} intensity={4.2} color="#dceeff" />
        <pointLight position={[-18, 7, 14]} intensity={0.55} color="#ff7a45" />

        <Suspense fallback={null}>
          <Starfield
            count={starCount}
            color="#c7d0d8"
            timeScale={speedMultiplier}
          />
          <Constellation
            count={constellationCount}
            timeScale={speedMultiplier}
          />
          <PathwayRemnants />
          <NeutronStar timeScale={speedMultiplier} />
          <DysonSphere
            color="#b8894d"
            destroyedFraction={0.33}
            panelFill={0.67}
            timeScale={speedMultiplier}
          />
          <OrbitalBodies speedMultiplier={speedMultiplier} renderMoons={true} />
          <Megastructures speedMultiplier={speedMultiplier} />

          {useBloom && (
            <EffectComposer enableNormalPass={false}>
              <Bloom
                intensity={1.15}
                luminanceThreshold={0.22}
                luminanceSmoothing={0.82}
                mipmapBlur
              />
            </EffectComposer>
          )}
        </Suspense>
      </Canvas>
    </div>
  );
}
