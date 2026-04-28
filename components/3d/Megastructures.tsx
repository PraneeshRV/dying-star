"use client";

import { Line } from "@react-three/drei";
import type { ThreeEvent } from "@react-three/fiber";
import { useFrame } from "@react-three/fiber";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Group } from "three";
import * as THREE from "three";
import { useGlobalStore } from "@/stores/globalStore";
import {
  PATHWAY_POINTS_PER_ARC,
  writeMegastructurePosition,
  writeOrbitPositionAtAngle,
} from "./orbitMath";
import {
  type MegastructureConfig,
  SHATTERED_SYSTEM,
  scrollToSection,
} from "./shatteredSystem";
import { TacticalLabel } from "./TacticalLabel";

export interface MegastructuresProps {
  speedMultiplier?: number;
}

export function Megastructures({ speedMultiplier = 1 }: MegastructuresProps) {
  const structureRefs = useRef<(Group | null)[]>([]);
  const orbitRings = useMemo(
    () =>
      SHATTERED_SYSTEM.megastructures.map((structure) => ({
        id: structure.id,
        color: structure.emissive,
        points: buildOrbitPoints(structure.orbitRadius),
      })),
    [],
  );

  useFrame(({ clock }) => {
    const elapsed = clock.elapsedTime * speedMultiplier;

    for (
      let index = 0;
      index < SHATTERED_SYSTEM.megastructures.length;
      index++
    ) {
      const structure = SHATTERED_SYSTEM.megastructures[index];
      const body = structureRefs.current[index];

      if (body) {
        writeMegastructurePosition(body.position, structure, elapsed);
        body.rotation.y = elapsed * structure.rotationSpeed;
        body.rotation.z = Math.sin(elapsed * 0.18 + index) * 0.08;
      }
    }
  });

  return (
    <group>
      {orbitRings.map((ring) => (
        <Line
          key={ring.id}
          color={ring.color}
          lineWidth={1}
          opacity={0.075}
          points={ring.points}
          transparent
        />
      ))}

      {SHATTERED_SYSTEM.megastructures.map((structure, index) => (
        <StructureNode
          key={structure.id}
          refSetter={(element) => {
            structureRefs.current[index] = element;
          }}
          structure={structure}
        />
      ))}
    </group>
  );
}

function buildOrbitPoints(orbitRadius: number) {
  const points: THREE.Vector3[] = [];
  const segmentCount = PATHWAY_POINTS_PER_ARC * 2;

  for (let index = 0; index <= segmentCount; index++) {
    const point = new THREE.Vector3();
    writeOrbitPositionAtAngle(
      point,
      orbitRadius,
      (index / segmentCount) * Math.PI * 2,
    );
    points.push(point);
  }

  return points;
}

function useCursorHover(active: boolean) {
  useEffect(() => {
    if (!active || typeof document === "undefined") {
      return;
    }

    document.body.style.cursor = "pointer";

    return () => {
      document.body.style.cursor = "";
    };
  }, [active]);
}

function StructureNode({
  structure,
  refSetter,
}: {
  structure: MegastructureConfig;
  refSetter: (element: Group | null) => void;
}) {
  const [hovered, setHovered] = useState(false);
  const setFocusedSystemNodeId = useGlobalStore(
    (state) => state.setFocusedSystemNodeId,
  );
  useCursorHover(hovered);

  const handleClick = useCallback(
    (event: ThreeEvent<MouseEvent>) => {
      event.stopPropagation();
      setFocusedSystemNodeId(structure.id);
      scrollToSection(structure.sectionId);
    },
    [structure.id, structure.sectionId, setFocusedSystemNodeId],
  );

  return (
    <group
      ref={refSetter}
      onClick={handleClick}
      onPointerOut={() => {
        setHovered(false);
      }}
      onPointerOver={(event) => {
        event.stopPropagation();
        setHovered(true);
      }}
    >
      <StructureGeometry structure={structure} />
      <TacticalLabel
        color={structure.emissive}
        subtitle={structure.scan}
        title={structure.name}
        visible={hovered}
      />
    </group>
  );
}

function StructureGeometry({ structure }: { structure: MegastructureConfig }) {
  const material = (
    <meshStandardMaterial
      color={structure.color}
      emissive={structure.emissive}
      emissiveIntensity={0.62}
      metalness={0.86}
      roughness={0.32}
      wireframe
    />
  );
  const solidMaterial = (
    <meshStandardMaterial
      color={structure.color}
      emissive={structure.emissive}
      emissiveIntensity={0.38}
      metalness={0.8}
      roughness={0.38}
    />
  );

  switch (structure.kind) {
    case "gate":
      return (
        <group rotation={[Math.PI / 2, 0, 0]}>
          <mesh>
            <torusGeometry args={[0.54, 0.035, 8, 48]} />
            {material}
          </mesh>
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <torusGeometry args={[0.36, 0.014, 6, 36]} />
            {material}
          </mesh>
        </group>
      );
    case "ring":
      return (
        <group rotation={[Math.PI / 2, 0.2, 0]}>
          <mesh>
            <torusGeometry args={[0.62, 0.022, 6, 64]} />
            {material}
          </mesh>
          <mesh rotation={[0, Math.PI / 5, 0]}>
            <torusGeometry args={[0.44, 0.012, 6, 48]} />
            {material}
          </mesh>
        </group>
      );
    case "cylinder":
      return (
        <group rotation={[0, 0, Math.PI / 2]}>
          <mesh>
            <cylinderGeometry args={[0.24, 0.24, 0.96, 16, 3, true]} />
            {material}
          </mesh>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.24, 0.01, 6, 32]} />
            {solidMaterial}
          </mesh>
        </group>
      );
    case "spine":
    case "tether":
      return (
        <group rotation={[0, 0, Math.PI / 2]}>
          <mesh>
            <cylinderGeometry args={[0.025, 0.025, 1.35, 8]} />
            {solidMaterial}
          </mesh>
          <mesh position={[0, 0.54, 0]}>
            <boxGeometry args={[0.18, 0.12, 0.12]} />
            {material}
          </mesh>
          <mesh position={[0, -0.54, 0]}>
            <boxGeometry args={[0.18, 0.12, 0.12]} />
            {material}
          </mesh>
        </group>
      );
    case "fleet":
      return (
        <group>
          {[-0.34, 0, 0.34].map((offset, index) => (
            <mesh
              key={offset}
              position={[offset, (index - 1) * 0.1, index % 2 ? 0.14 : -0.12]}
              rotation={[0.32, offset, 0.72]}
            >
              <coneGeometry args={[0.08, 0.42, 4]} />
              {solidMaterial}
            </mesh>
          ))}
        </group>
      );
    case "shipyard":
    case "lattice":
    case "array":
      return (
        <group>
          <mesh>
            <boxGeometry args={[0.82, 0.08, 0.08]} />
            {solidMaterial}
          </mesh>
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <boxGeometry args={[0.62, 0.06, 0.06]} />
            {material}
          </mesh>
          <mesh rotation={[0, Math.PI / 2, 0]}>
            <boxGeometry args={[0.54, 0.05, 0.05]} />
            {material}
          </mesh>
        </group>
      );
  }
}
