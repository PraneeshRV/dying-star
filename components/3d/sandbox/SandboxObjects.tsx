"use client";

import { Line } from "@react-three/drei";
import type { ThreeEvent } from "@react-three/fiber";
import { useMemo, useState } from "react";
import * as THREE from "three";
import { TacticalLabel } from "@/components/3d/TacticalLabel";
import type { SandboxObject } from "@/components/sandbox/sandboxWorld";
import { SANDBOX_WORLD } from "@/components/sandbox/sandboxWorld";

export interface SandboxObjectsProps {
  selectedObjectId: string;
  scannerActive: boolean;
  onSelectObject: (objectId: string) => void;
}

export function SandboxObjects({
  selectedObjectId,
  scannerActive,
  onSelectObject,
}: SandboxObjectsProps) {
  const orbitRing = useMemo(() => buildRingPoints(5.8), []);
  const debris = useMemo(() => buildDebris(), []);

  return (
    <group>
      <Line
        color="#58f3ff"
        lineWidth={1}
        opacity={0.18}
        points={orbitRing}
        transparent
      />
      {debris.map((piece) => (
        <mesh
          key={piece.id}
          position={piece.position}
          rotation={piece.rotation}
          scale={piece.scale}
        >
          <boxGeometry args={[1, 0.08, 0.34]} />
          <meshStandardMaterial
            color="#8a3f2d"
            emissive="#ff7a45"
            emissiveIntensity={0.08}
            metalness={0.72}
            roughness={0.48}
          />
        </mesh>
      ))}
      {SANDBOX_WORLD.objects.map((object) => (
        <SandboxObjectNode
          key={object.id}
          object={object}
          selected={selectedObjectId === object.id}
          scannerActive={scannerActive}
          onSelectObject={onSelectObject}
        />
      ))}
    </group>
  );
}

function SandboxObjectNode({
  object,
  selected,
  scannerActive,
  onSelectObject,
}: {
  object: SandboxObject;
  selected: boolean;
  scannerActive: boolean;
  onSelectObject: (objectId: string) => void;
}) {
  const [hovered, setHovered] = useState(false);
  const visibleLabel = selected || hovered || scannerActive;
  const handleSelect = (event: ThreeEvent<MouseEvent | PointerEvent>) => {
    event.stopPropagation();
    onSelectObject(object.id);
  };

  return (
    <group position={object.position} scale={object.scale}>
      <ProceduralShape object={object} selected={selected} />
      <mesh
        onClick={handleSelect}
        onPointerDown={handleSelect}
        onPointerOut={() => setHovered(false)}
        onPointerOver={(event) => {
          event.stopPropagation();
          setHovered(true);
        }}
      >
        <sphereGeometry args={[0.9, 18, 12]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
      <TacticalLabel
        color={object.color}
        title={object.name}
        subtitle={object.status}
        visible={visibleLabel}
      />
    </group>
  );
}

function ProceduralShape({
  object,
  selected,
}: {
  object: SandboxObject;
  selected: boolean;
}) {
  const material = (
    <meshStandardMaterial
      color={object.color}
      emissive={object.color}
      emissiveIntensity={selected ? 0.58 : 0.24}
      metalness={0.74}
      roughness={0.34}
      wireframe={object.kind !== "resume"}
    />
  );

  if (object.kind === "relay") {
    return (
      <group>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.78, 0.025, 8, 64]} />
          {material}
        </mesh>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.08, 0.08, 1.35, 10]} />
          {material}
        </mesh>
        <mesh>
          <octahedronGeometry args={[0.26, 0]} />
          {material}
        </mesh>
      </group>
    );
  }

  if (object.kind === "ctf") {
    return (
      <mesh>
        <dodecahedronGeometry args={[0.42, 0]} />
        {material}
      </mesh>
    );
  }

  if (object.kind === "skills") {
    return (
      <group>
        <mesh>
          <icosahedronGeometry args={[0.34, 1]} />
          {material}
        </mesh>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.52, 0.012, 6, 48]} />
          {material}
        </mesh>
      </group>
    );
  }

  if (object.kind === "resume") {
    return (
      <mesh>
        <boxGeometry args={[0.64, 0.42, 0.2]} />
        {material}
      </mesh>
    );
  }

  if (object.kind === "contact") {
    return (
      <group>
        <mesh>
          <cylinderGeometry args={[0.18, 0.3, 0.72, 8]} />
          {material}
        </mesh>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.46, 0.016, 6, 48]} />
          {material}
        </mesh>
      </group>
    );
  }

  return (
    <mesh>
      <tetrahedronGeometry args={[0.44, 0]} />
      {material}
    </mesh>
  );
}

function buildRingPoints(radius: number) {
  const points: THREE.Vector3[] = [];
  for (let index = 0; index <= 128; index++) {
    const angle = (index / 128) * Math.PI * 2;
    points.push(
      new THREE.Vector3(Math.cos(angle) * radius, 0, Math.sin(angle) * radius),
    );
  }
  return points;
}

function buildDebris() {
  return Array.from({ length: 38 }, (_, index) => {
    const angle = index * 1.914;
    const radius = 2.8 + (index % 9) * 0.42;
    return {
      id: `debris-${index}`,
      position: new THREE.Vector3(
        Math.cos(angle) * radius,
        ((index % 7) - 3) * 0.18,
        Math.sin(angle) * radius,
      ),
      rotation: [index * 0.17, angle, index * 0.11] as [
        number,
        number,
        number,
      ],
      scale: [0.28 + (index % 4) * 0.08, 1, 0.42] as [
        number,
        number,
        number,
      ],
    };
  });
}
