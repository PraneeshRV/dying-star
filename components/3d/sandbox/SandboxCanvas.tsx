"use client";

import { getGPUTier } from "@pmndrs/detect-gpu";
import { Canvas } from "@react-three/fiber";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import type { WebGLRenderer } from "three";
import {
  Constellation,
  DysonSphere,
  NeutronStar,
  Starfield,
} from "@/components/3d";
import { StarFallback } from "@/components/fallbacks/StarFallback";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import type { SandboxControlMode } from "@/components/sandbox/sandboxWorld";
import { findSandboxObject } from "@/components/sandbox/sandboxWorld";
import { SandboxCamera } from "./SandboxCamera";
import { SandboxObjects } from "./SandboxObjects";
import { SandboxScannerPulse } from "./SandboxScannerPulse";

type RenderMode = "fallback" | "canvas";

function hasWebGLSupport() {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl2") ?? canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

export interface SandboxCanvasProps {
  selectedObjectId: string;
  scannerActive: boolean;
  controlMode: SandboxControlMode;
  onSelectObject: (objectId: string) => void;
  onExitFreeFlight: () => void;
}

export function SandboxCanvas({
  selectedObjectId,
  scannerActive,
  controlMode,
  onSelectObject,
  onExitFreeFlight,
}: SandboxCanvasProps) {
  const [tier, setTier] = useState(2);
  const [renderMode, setRenderMode] = useState<RenderMode>("fallback");
  const [compactViewport, setCompactViewport] = useState(false);
  const reducedMotion = useReducedMotion();
  const selectedObject = useMemo(
    () => findSandboxObject(selectedObjectId),
    [selectedObjectId],
  );

  useEffect(() => {
    const media = window.matchMedia("(max-width: 720px)");
    const update = () => setCompactViewport(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (reducedMotion || !hasWebGLSupport()) {
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
  }, [reducedMotion]);

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

  const starCount = compactViewport ? 1800 : tier <= 1 ? 2600 : 12000;
  const constellationCount = compactViewport ? 160 : tier <= 1 ? 220 : 520;

  return (
    <div className="absolute inset-0 z-0 bg-void" aria-hidden="true">
      <Canvas
        dpr={tier <= 1 ? [1, 1.2] : [1, 2]}
        gl={{
          alpha: false,
          antialias: tier > 1,
          depth: true,
          powerPreference: "high-performance",
          stencil: false,
        }}
        onCreated={handleCanvasCreated}
        shadows={tier > 1}
      >
        <color attach="background" args={["#030406"]} />
        <SandboxCamera
          controlMode={controlMode}
          selectedPosition={selectedObject?.position}
          reducedMotion={reducedMotion}
          onExitFreeFlight={onExitFreeFlight}
        />
        <ambientLight intensity={tier <= 1 ? 0.12 : 0.06} />
        <pointLight
          castShadow={tier > 1}
          color="#dceeff"
          decay={1.25}
          distance={80}
          intensity={tier <= 1 ? 4 : 6.8}
          position={[0, 0, 0]}
        />
        <Suspense fallback={null}>
          <Starfield count={starCount} color="#c7d0d8" timeScale={0.45} />
          <Constellation count={constellationCount} timeScale={0.28} />
          <NeutronStar timeScale={0.34} />
          <DysonSphere
            color="#b8894d"
            destroyedFraction={0.33}
            panelFill={0.56}
            timeScale={0.24}
          />
          <SandboxScannerPulse active={scannerActive} />
          <SandboxObjects
            selectedObjectId={selectedObjectId}
            scannerActive={scannerActive}
            onSelectObject={onSelectObject}
          />
          {tier > 1 ? (
            <EffectComposer enableNormalPass={false}>
              <Bloom
                intensity={tier >= 3 ? 1.15 : 0.9}
                luminanceThreshold={0.26}
                luminanceSmoothing={0.82}
                mipmapBlur
              />
            </EffectComposer>
          ) : null}
        </Suspense>
      </Canvas>
    </div>
  );
}
