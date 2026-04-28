"use client";

/* ═══════════════════════════════════════════════════
   DysonSphere — wireframe + partial panels
   ─────────────────────────────────────────────────
   - Outer wireframe icosahedron (structural grid)
   - Partial filled panels (~55% of faces) layered
     underneath for "under construction" megastructure
   - Counter-rotating inner wireframe for depth
   - Subtle opacity pulse (breathing)
   - Panel geometry built once in useMemo
   ═══════════════════════════════════════════════════ */

import { Icosahedron } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

export interface DysonSphereProps {
  radius?: number;
  /** Geometry detail. Higher = more triangles (and more wires). */
  detail?: number;
  color?: string;
  baseOpacity?: number;
  rotationSpeed?: number;
  /** Fraction of faces to fill (0–1). 0.55 = "under construction" */
  panelFill?: number;
  /** Fraction of shell visibly destroyed. 0.33 means 33% structural loss. */
  destroyedFraction?: number;
  debrisCount?: number;
}

function seededUnit(seed: number) {
  const x = Math.sin(seed * 127.1) * 43758.5453;
  return x - Math.floor(x);
}

export function DysonSphere({
  radius = 30,
  detail = 2,
  color = "#b8894d",
  baseOpacity = 0.16,
  rotationSpeed = 0.032,
  panelFill = 0.67,
  destroyedFraction = 0.33,
  debrisCount = 180,
}: DysonSphereProps) {
  const outerRef = useRef<THREE.Mesh>(null);
  const innerRef = useRef<THREE.Mesh>(null);
  const panelRef = useRef<THREE.Mesh>(null);
  const outerMatRef = useRef<THREE.MeshBasicMaterial>(null);
  const innerMatRef = useRef<THREE.MeshBasicMaterial>(null);
  const panelMatRef = useRef<THREE.MeshBasicMaterial>(null);

  // Build partial-panel geometry — randomly keep ~55% of faces
  const panelGeometry = useMemo(() => {
    const base = new THREE.IcosahedronGeometry(radius, detail);
    // toNonIndexed so every 3 vertices = 1 face
    const nonIndexed = base.toNonIndexed();
    const srcPos = nonIndexed.attributes.position;
    const faceCount = srcPos.count / 3;

    // Deterministic seed so panels don't flicker on re-render
    const seed = 42;
    const seededRandom = (i: number) => {
      const x = Math.sin(seed + i * 127.1) * 43758.5453;
      return x - Math.floor(x);
    };

    const indices: number[] = [];
    for (let i = 0; i < faceCount; i++) {
      const vx = srcPos.getX(i * 3);
      const vy = srcPos.getY(i * 3);
      const vz = srcPos.getZ(i * 3);
      const angle = Math.atan2(vz, vx);
      const damageCenter = Math.PI * 0.18;
      const damageWidth = Math.PI * destroyedFraction * 1.55;
      const angularDistance = Math.abs(
        Math.atan2(
          Math.sin(angle - damageCenter),
          Math.cos(angle - damageCenter),
        ),
      );
      const inDamageArc = angularDistance < damageWidth;
      const erosion = inDamageArc ? 0.82 : 0.18;
      const keepPanel = seededRandom(i) < panelFill * (1 - erosion);

      if (keepPanel) {
        indices.push(i * 3, i * 3 + 1, i * 3 + 2);
      }
    }

    const newPos = new Float32Array(indices.length * 3);
    for (let j = 0; j < indices.length; j++) {
      newPos[j * 3] = srcPos.getX(indices[j]);
      newPos[j * 3 + 1] = srcPos.getY(indices[j]);
      newPos[j * 3 + 2] = srcPos.getZ(indices[j]);
    }

    const filled = new THREE.BufferGeometry();
    filled.setAttribute("position", new THREE.BufferAttribute(newPos, 3));
    filled.computeVertexNormals();

    // Clean up
    base.dispose();
    nonIndexed.dispose();

    return filled;
  }, [radius, detail, panelFill, destroyedFraction]);

  const debris = useMemo(() => {
    return Array.from({ length: debrisCount }, (_, index) => {
      const t = index / debrisCount;
      const angle =
        Math.PI * 0.18 + (t - 0.5) * Math.PI * destroyedFraction * 2.1;
      const distance = radius * (0.9 + seededUnit(index + 900) * 0.42);
      return {
        id: `dyson-debris-${index}`,
        position: [
          Math.cos(angle) * distance,
          (seededUnit(index + 1200) - 0.5) * radius * 0.44,
          Math.sin(angle) * distance,
        ] as [number, number, number],
        size: 0.035 + seededUnit(index + 1500) * 0.12,
      };
    });
  }, [debrisCount, destroyedFraction, radius]);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;

    if (outerRef.current) {
      outerRef.current.rotation.y += delta * rotationSpeed;
      outerRef.current.rotation.x += delta * rotationSpeed * 0.35;
      const s = 1 + Math.sin(t * 0.5) * 0.012;
      outerRef.current.scale.set(s, s, s);
    }

    // Panels follow outer shell rotation
    if (panelRef.current && outerRef.current) {
      panelRef.current.rotation.copy(outerRef.current.rotation);
      panelRef.current.scale.copy(outerRef.current.scale);
    }

    if (innerRef.current) {
      innerRef.current.rotation.y -= delta * rotationSpeed * 0.6;
      innerRef.current.rotation.z += delta * rotationSpeed * 0.4;
    }

    // Opacity pulse — subtle breathing
    const pulse = baseOpacity + Math.sin(t * 0.7) * 0.02;
    if (outerMatRef.current) outerMatRef.current.opacity = pulse;
    if (innerMatRef.current) innerMatRef.current.opacity = pulse * 0.55;
    if (panelMatRef.current) panelMatRef.current.opacity = pulse * 1.8;
  });

  return (
    <group>
      {/* Partial panels — "under construction" filled faces */}
      <mesh ref={panelRef} geometry={panelGeometry}>
        <meshBasicMaterial
          ref={panelMatRef}
          color={color}
          transparent
          opacity={baseOpacity * 1.8}
          side={THREE.DoubleSide}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>

      {debris.map((piece) => (
        <mesh key={piece.id} position={piece.position}>
          <boxGeometry args={[piece.size, piece.size * 0.42, piece.size * 1.8]} />
          <meshBasicMaterial
            color="#ff7a45"
            transparent
            opacity={0.55}
            toneMapped={false}
          />
        </mesh>
      ))}

      {/* Outer wireframe shell */}
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

      {/* Inner counter-rotating wireframe for depth */}
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
