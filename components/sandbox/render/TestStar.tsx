"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import type { Mesh } from "three";
import { createTestStarMaterial } from "./materials/testStarMaterial";

/** Props for {@link TestStar}. */
export interface TestStarProps {
  /**
   * Rotation speed scalar. `0` disables rotation entirely (e.g. for
   * reduced-motion preferences or a hidden tab). Defaults to `1`.
   */
  speedMultiplier?: number;
  /** Hottest plasma color forwarded to the material. */
  colorHot?: string;
  /** Coolest plasma color forwarded to the material. */
  colorCool?: string;
}

/**
 * The S0 proof object: a single procedural "test star" sphere driven by a
 * TSL node material that compiles to both WebGPU (WGSL) and WebGL2 (GLSL).
 *
 * The emissive material is created once via {@link createTestStarMaterial} and
 * disposed on unmount. The mesh rotates slowly in the render loop, scaled by
 * {@link TestStarProps.speedMultiplier}; a multiplier of `0` skips rotation.
 */
export function TestStar(props: TestStarProps) {
  const { speedMultiplier, colorHot, colorCool } = props;
  const meshRef = useRef<Mesh>(null);

  const material = useMemo(
    () => createTestStarMaterial({ colorHot, colorCool }),
    [colorHot, colorCool],
  );

  useEffect(() => {
    return () => {
      material.dispose();
    };
  }, [material]);

  useFrame((_, delta) => {
    const speed = speedMultiplier ?? 1;
    if (speed === 0) {
      return;
    }
    const mesh = meshRef.current;
    if (mesh) {
      mesh.rotation.y += delta * 0.15 * speed;
      mesh.rotation.x += delta * 0.05 * speed;
    }
  });

  return (
    <mesh ref={meshRef}>
      <icosahedronGeometry args={[1.4, 24]} />
      <primitive object={material} attach="material" />
    </mesh>
  );
}
