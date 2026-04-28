"use client";

import { getGPUTier } from "@pmndrs/detect-gpu";
import { Canvas } from "@react-three/fiber";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import { Suspense, useEffect, useState } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
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

/**
 * SpaceCanvas — The primary 3D environment for the Dying Star portfolio.
 *
 * Features:
 * - GPU tier detection for performance scaling
 * - Post-processing Bloom for emissive glows
 * - Auto-rotating orbital view
 * - Suspense for async component loading
 */
export function SpaceCanvas() {
  const [tier, setTier] = useState<number>(2);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    // Detect GPU capability to scale population and resolution
    getGPUTier().then((res) => {
      setTier(res.tier);
    });
  }, []);

  // Performance scaling based on GPU tier (tier 0 = detection failed → treat as low-end)
  const starCount = tier <= 1 ? 800 : tier === 2 ? 2000 : 3500;
  const constellationCount = tier <= 1 ? 250 : tier === 2 ? 500 : 750;
  const speedMultiplier = reducedMotion ? 0 : tier <= 1 ? 0.35 : 1;
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
