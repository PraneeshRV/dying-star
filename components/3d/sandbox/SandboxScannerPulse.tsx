"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import type { Mesh } from "three";
import * as THREE from "three";

export interface SandboxScannerPulseProps {
  active: boolean;
  color?: string;
}

export function SandboxScannerPulse({
  active,
  color = "#58f3ff",
}: SandboxScannerPulseProps) {
  const meshRef = useRef<Mesh>(null);
  const material = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color,
        depthWrite: false,
        opacity: 0,
        transparent: true,
        wireframe: true,
      }),
    [color],
  );

  useFrame(({ clock }) => {
    const mesh = meshRef.current;
    if (!mesh) return;

    if (!active) {
      mesh.visible = false;
      material.opacity = 0;
      return;
    }

    const pulse = (clock.elapsedTime % 1.7) / 1.7;
    mesh.visible = true;
    mesh.scale.setScalar(2.2 + pulse * 8.8);
    material.opacity = Math.max(0, 0.32 * (1 - pulse));
  });

  return (
    <mesh ref={meshRef} material={material}>
      <sphereGeometry args={[1, 32, 16]} />
    </mesh>
  );
}
