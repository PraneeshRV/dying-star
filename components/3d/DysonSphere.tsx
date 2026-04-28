"use client";

/* ═══════════════════════════════════════════════════
   DysonSphere — damaged shell remnant + debris
   ─────────────────────────────────────────────────
   - Outer structural grid with a visibly missing sector
   - Mostly intact filled panels outside the destroyed arc
   - Instanced debris locked to the damaged shell rotation
   - Counter-rotating inner wireframe for depth
   - Subtle opacity pulse (breathing)
   - Memoized geometries are disposed on replacement/unmount
   ═══════════════════════════════════════════════════ */

import { Icosahedron } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
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
  timeScale?: number;
}

const DAMAGE_CENTER = Math.PI * 0.18;

function seededUnit(seed: number) {
  const x = Math.sin(seed * 127.1) * 43758.5453;
  return x - Math.floor(x);
}

function angularDistance(angle: number, center: number) {
  return Math.abs(
    Math.atan2(Math.sin(angle - center), Math.cos(angle - center)),
  );
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
  timeScale = 1,
}: DysonSphereProps) {
  const outerRef = useRef<THREE.LineSegments>(null);
  const innerRef = useRef<THREE.Mesh>(null);
  const panelRef = useRef<THREE.Mesh>(null);
  const debrisRef = useRef<THREE.InstancedMesh>(null);
  const outerMatRef = useRef<THREE.LineBasicMaterial>(null);
  const innerMatRef = useRef<THREE.MeshBasicMaterial>(null);
  const panelMatRef = useRef<THREE.MeshBasicMaterial>(null);
  const clampedPanelFill = THREE.MathUtils.clamp(panelFill, 0, 1);
  const clampedDestroyedFraction = THREE.MathUtils.clamp(
    destroyedFraction,
    0,
    1,
  );
  const clampedDebrisCount = Math.max(0, Math.floor(debrisCount));

  // Filled hull panels remain dense outside the destroyed sector.
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
      const vz = srcPos.getZ(i * 3);
      const angle = Math.atan2(vz, vx);
      const damageWidth = Math.PI * clampedDestroyedFraction;
      const inDamageArc = angularDistance(angle, DAMAGE_CENTER) < damageWidth;
      const erosion = inDamageArc ? 0.86 : 0;
      const keepPanel = seededRandom(i) < clampedPanelFill * (1 - erosion);

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
  }, [radius, detail, clampedPanelFill, clampedDestroyedFraction]);

  const outerWireGeometry = useMemo(() => {
    const base = new THREE.IcosahedronGeometry(radius, detail);
    const nonIndexed = base.toNonIndexed();
    const srcPos = nonIndexed.attributes.position;
    const faceCount = srcPos.count / 3;
    const linePositions: number[] = [];
    const damageWidth = Math.PI * clampedDestroyedFraction;

    const pushEdge = (from: number, to: number) => {
      linePositions.push(
        srcPos.getX(from),
        srcPos.getY(from),
        srcPos.getZ(from),
        srcPos.getX(to),
        srcPos.getY(to),
        srcPos.getZ(to),
      );
    };

    for (let i = 0; i < faceCount; i++) {
      const a = i * 3;
      const cx = (srcPos.getX(a) + srcPos.getX(a + 1) + srcPos.getX(a + 2)) / 3;
      const cz = (srcPos.getZ(a) + srcPos.getZ(a + 1) + srcPos.getZ(a + 2)) / 3;
      const angle = Math.atan2(cz, cx);
      const inDamageArc = angularDistance(angle, DAMAGE_CENTER) < damageWidth;
      const keepBrokenFragment = inDamageArc && seededUnit(i + 300) < 0.1;

      if (!inDamageArc || keepBrokenFragment) {
        pushEdge(a, a + 1);
        pushEdge(a + 1, a + 2);
        pushEdge(a + 2, a);
      }
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(linePositions, 3),
    );

    base.dispose();
    nonIndexed.dispose();

    return geometry;
  }, [radius, detail, clampedDestroyedFraction]);

  const debris = useMemo(() => {
    return Array.from({ length: clampedDebrisCount }, (_, index) => {
      const t = index / Math.max(1, clampedDebrisCount);
      const angle =
        DAMAGE_CENTER + (t - 0.5) * Math.PI * clampedDestroyedFraction * 2.1;
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
  }, [clampedDebrisCount, clampedDestroyedFraction, radius]);

  useEffect(() => {
    return () => {
      const geometry = panelGeometry;
      window.setTimeout(() => {
        if (panelRef.current?.geometry !== geometry) {
          geometry.dispose();
        }
      }, 0);
    };
  }, [panelGeometry]);

  useEffect(() => {
    return () => {
      const geometry = outerWireGeometry;
      window.setTimeout(() => {
        if (outerRef.current?.geometry !== geometry) {
          geometry.dispose();
        }
      }, 0);
    };
  }, [outerWireGeometry]);

  useEffect(() => {
    if (!debrisRef.current) return;

    const matrix = new THREE.Matrix4();
    const position = new THREE.Vector3();
    const rotation = new THREE.Euler();
    const quaternion = new THREE.Quaternion();
    const scale = new THREE.Vector3();

    debris.forEach((piece, index) => {
      position.fromArray(piece.position);
      rotation.set(
        seededUnit(index + 1800) * Math.PI,
        seededUnit(index + 2100) * Math.PI,
        seededUnit(index + 2400) * Math.PI,
      );
      quaternion.setFromEuler(rotation);
      scale.set(piece.size, piece.size * 0.42, piece.size * 1.8);
      matrix.compose(position, quaternion, scale);
      debrisRef.current?.setMatrixAt(index, matrix);
    });

    debrisRef.current.instanceMatrix.needsUpdate = true;
    debrisRef.current.computeBoundingSphere();
  }, [debris]);

  useFrame((state, delta) => {
    const scaledDelta = delta * timeScale;
    const t = state.clock.elapsedTime * timeScale;

    if (outerRef.current) {
      outerRef.current.rotation.y += scaledDelta * rotationSpeed;
      outerRef.current.rotation.x += scaledDelta * rotationSpeed * 0.35;
      const s = 1 + Math.sin(t * 0.5) * 0.012;
      outerRef.current.scale.set(s, s, s);
    }

    // Panels follow outer shell rotation
    if (panelRef.current && outerRef.current) {
      panelRef.current.rotation.copy(outerRef.current.rotation);
      panelRef.current.scale.copy(outerRef.current.scale);
    }

    if (debrisRef.current && outerRef.current) {
      debrisRef.current.rotation.copy(outerRef.current.rotation);
      debrisRef.current.scale.copy(outerRef.current.scale);
    }

    if (innerRef.current) {
      innerRef.current.rotation.y -= scaledDelta * rotationSpeed * 0.6;
      innerRef.current.rotation.z += scaledDelta * rotationSpeed * 0.4;
    }

    // Opacity pulse — subtle breathing
    const pulse = baseOpacity + Math.sin(t * 0.7) * 0.02;
    if (outerMatRef.current) outerMatRef.current.opacity = pulse;
    if (innerMatRef.current) innerMatRef.current.opacity = pulse * 0.55;
    if (panelMatRef.current) panelMatRef.current.opacity = pulse * 1.8;
  });

  return (
    <group>
      {/* Filled remnant panels, sparse inside the destroyed arc. */}
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

      {debris.length > 0 && (
        <instancedMesh
          ref={debrisRef}
          args={[undefined, undefined, debris.length]}
        >
          <boxGeometry args={[1, 1, 1]} />
          <meshBasicMaterial
            color="#ff7a45"
            transparent
            opacity={0.55}
            toneMapped={false}
          />
        </instancedMesh>
      )}

      {/* Outer structural grid with the damaged sector removed. */}
      <lineSegments ref={outerRef} geometry={outerWireGeometry}>
        <lineBasicMaterial
          ref={outerMatRef}
          color={color}
          transparent
          opacity={baseOpacity}
          depthWrite={false}
          toneMapped={false}
        />
      </lineSegments>

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
