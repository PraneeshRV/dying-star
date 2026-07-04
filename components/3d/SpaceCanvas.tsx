"use client";

import { getGPUTier } from "@pmndrs/detect-gpu";
import { Canvas } from "@react-three/fiber";
import { Bloom, EffectComposer, SSAO } from "@react-three/postprocessing";
import { Suspense, useCallback, useEffect, useState } from "react";
import type { WebGLRenderer } from "three";
import { StarFallback } from "@/components/fallbacks/StarFallback";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useGlobalStore } from "@/stores/globalStore";
import { NeutronStar, Starfield } from "./index";

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
  const [compactViewport, setCompactViewport] = useState(false);
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
    const media = window.matchMedia("(max-width: 720px)");
    const updateViewport = () => {
      setCompactViewport(media.matches);
    };

    updateViewport();
    media.addEventListener("change", updateViewport);
    return () => {
      media.removeEventListener("change", updateViewport);
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
  const starCount = compactViewport
    ? tier <= 1
      ? 1200
      : 6000
    : tier <= 1
      ? 2200
      : tier === 2
        ? 18000
        : 50000;
  const speedMultiplier = !pageVisible ? 0 : tier <= 1 ? 0.35 : 1;
  const useBloom = tier > 1 && !reducedMotion;
  const useSSAO = tier >= 2 && !compactViewport && !reducedMotion;

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
        shadows={tier > 1}
        camera={{ position: [0, 4, 14], fov: 55 }}
      >
        <color attach="background" args={["#030406"]} />

        <ambientLight intensity={tier <= 1 ? 0.05 : 0.018} />
        <pointLight
          castShadow={tier > 1}
          color="#dceeff"
          decay={1.25}
          distance={90}
          intensity={tier <= 1 ? 4.6 : 7.8}
          position={[0, 0, 0]}
          shadow-bias={-0.0001}
          shadow-mapSize-height={tier >= 3 ? 1024 : 512}
          shadow-mapSize-width={tier >= 3 ? 1024 : 512}
        />

        <Suspense fallback={null}>
          <Starfield
            count={starCount}
            color="#c7d0d8"
            timeScale={speedMultiplier}
          />
          <NeutronStar timeScale={speedMultiplier} />

          {useBloom ? (
            <SpacePostProcessing tier={tier} useSSAO={useSSAO} />
          ) : null}
        </Suspense>
      </Canvas>
    </div>
  );
}

function SpacePostProcessing({
  tier,
  useSSAO,
}: {
  tier: number;
  useSSAO: boolean;
}) {
  if (useSSAO) {
    return (
      <EffectComposer enableNormalPass>
        <Bloom
          intensity={tier >= 3 ? 1.35 : 1.05}
          luminanceThreshold={0.24}
          luminanceSmoothing={0.82}
          mipmapBlur
        />
        <SSAO
          bias={0.18}
          intensity={0.42}
          luminanceInfluence={0.68}
          radius={0.42}
          rings={4}
          samples={18}
        />
      </EffectComposer>
    );
  }

  return (
    <EffectComposer enableNormalPass={false}>
      <Bloom
        intensity={tier >= 3 ? 1.35 : 1.05}
        luminanceThreshold={0.24}
        luminanceSmoothing={0.82}
        mipmapBlur
      />
    </EffectComposer>
  );
}
