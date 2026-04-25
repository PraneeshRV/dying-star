"use client";

import { getGPUTier } from "@pmndrs/detect-gpu";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import { Suspense, useEffect, useState } from "react";
import {
  Constellation,
  DysonSphere,
  NeutronStar,
  OrbitalPlanets,
  Starfield,
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

  useEffect(() => {
    // Detect GPU capability to scale population and resolution
    getGPUTier().then((res) => {
      setTier(res.tier);
    });
  }, []);

  // Performance scaling based on GPU tier (tier 0 = detection failed → treat as low-end)
  const starCount = tier <= 1 ? 800 : tier === 2 ? 2000 : 3500;
  const constellationCount = tier <= 1 ? 250 : tier === 2 ? 500 : 750;
  const useBloom = tier > 1;

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
        <color attach="background" args={["#000005"]} />
        <PerspectiveCamera makeDefault position={[0, 4, 18]} fov={55} />

        {/* Environment Lighting */}
        <ambientLight intensity={0.35} />
        <pointLight position={[0, 0, 0]} intensity={3} color="#00FF88" />

        <Suspense fallback={null}>
          {/* Background Population */}
          <Starfield count={starCount} />
          <Constellation count={constellationCount} />

          {/* Main Subject */}
          <NeutronStar />

          {/* Decorative Bodies */}
          <DysonSphere />
          <OrbitalPlanets />

          {/* Post-processing: Make the neon glows pop */}
          {useBloom && (
            <EffectComposer enableNormalPass={false}>
              <Bloom
                intensity={1.5}
                luminanceThreshold={0.2}
                luminanceSmoothing={0.9}
                mipmapBlur
              />
            </EffectComposer>
          )}
        </Suspense>

        {/* Subtle camera movement */}
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          rotateSpeed={0.3}
          autoRotate
          autoRotateSpeed={0.4}
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={Math.PI / 1.5}
        />
      </Canvas>
    </div>
  );
}
