"use client";

/* ═══════════════════════════════════════════════════
   DysonSphere — wireframe icosahedron shell
   ─────────────────────────────────────────────────
   - Massive purple wireframe rotating around the scene
   - Two layers (outer + denser inner) for depth
   - Subtle scale + opacity pulse driven by useFrame
   - All scratch values mutated in place — no allocs
   ═══════════════════════════════════════════════════ */

import { Icosahedron } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import type { Mesh, MeshBasicMaterial } from "three";

export interface DysonSphereProps {
  radius?: number;
  /** Geometry detail. Higher = more triangles (and more wires). */
  detail?: number;
  color?: string;
  baseOpacity?: number;
  rotationSpeed?: number;
}

export function DysonSphere({
  radius = 30,
  detail = 2,
  color = "#8B5CF6",
  baseOpacity = 0.13,
  rotationSpeed = 0.04,
}: DysonSphereProps) {
  const outerRef = useRef<Mesh>(null);
  const innerRef = useRef<Mesh>(null);
  const outerMatRef = useRef<MeshBasicMaterial>(null);
  const innerMatRef = useRef<MeshBasicMaterial>(null);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;

    if (outerRef.current) {
      outerRef.current.rotation.y += delta * rotationSpeed;
      outerRef.current.rotation.x += delta * rotationSpeed * 0.35;
      const s = 1 + Math.sin(t * 0.5) * 0.012;
      outerRef.current.scale.set(s, s, s);
    }

    if (innerRef.current) {
      innerRef.current.rotation.y -= delta * rotationSpeed * 0.6;
      innerRef.current.rotation.z += delta * rotationSpeed * 0.4;
    }

    // Opacity pulse — subtle breathing
    const pulse = baseOpacity + Math.sin(t * 0.7) * 0.02;
    if (outerMatRef.current) outerMatRef.current.opacity = pulse;
    if (innerMatRef.current) innerMatRef.current.opacity = pulse * 0.55;
  });

  return (
    <group>
      <Icosahedron ref={outerRef} args={[radius, detail]}>
        <meshBasicMaterial
          ref={outerMatRef}
          color={color}
          wireframe
          transparent
          opacity={baseOpacity}
          depthWrite={false}
          toneMapped={false}
        />
      </Icosahedron>

      <Icosahedron ref={innerRef} args={[radius * 0.78, detail + 1]}>
        <meshBasicMaterial
          ref={innerMatRef}
          color={color}
          wireframe
          transparent
          opacity={baseOpacity * 0.55}
          depthWrite={false}
          toneMapped={false}
        />
      </Icosahedron>
    </group>
  );
}
