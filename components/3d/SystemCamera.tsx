"use client";

import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { SHATTERED_SYSTEM } from "@/components/3d/shatteredSystem";
import { useGlobalStore } from "@/stores/globalStore";

const DEFAULT_TARGET = new THREE.Vector3(0, 0, 0);
const DEFAULT_CAMERA = new THREE.Vector3(0, 8, 30);

function staticOrbitPosition(orbitRadius: number, inclination = 0) {
  return new THREE.Vector3(
    orbitRadius,
    Math.sin(inclination) * orbitRadius * 0.22,
    Math.cos(inclination) * orbitRadius * 0.18,
  );
}

function findFocusPosition(id: string | null) {
  if (!id) return DEFAULT_TARGET;

  const planet = SHATTERED_SYSTEM.planets.find((item) => item.id === id);
  if (planet) return staticOrbitPosition(planet.orbitRadius, planet.inclination);

  const moon = SHATTERED_SYSTEM.moons.find((item) => item.id === id);
  if (moon) {
    const parent = SHATTERED_SYSTEM.planets.find(
      (item) => item.id === moon.parentId,
    );
    if (!parent) return DEFAULT_TARGET;
    return staticOrbitPosition(
      parent.orbitRadius + moon.orbitRadius,
      parent.inclination,
    );
  }

  const structure = SHATTERED_SYSTEM.megastructures.find(
    (item) => item.id === id,
  );
  if (structure) return staticOrbitPosition(structure.orbitRadius, 0);

  const pathway = SHATTERED_SYSTEM.pathways.find((item) => item.id === id);
  if (pathway) {
    const angle = (pathway.arcStart + pathway.arcEnd) / 2;
    return new THREE.Vector3(
      Math.cos(angle) * pathway.radius,
      1.4,
      Math.sin(angle) * pathway.radius,
    );
  }

  return DEFAULT_TARGET;
}

export interface SystemCameraProps {
  reducedMotion?: boolean;
}

export function SystemCamera({ reducedMotion = false }: SystemCameraProps) {
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const focusedSystemNodeId = useGlobalStore(
    (state) => state.focusedSystemNodeId,
  );

  const scratch = useMemo(
    () => ({
      target: new THREE.Vector3(),
      camera: new THREE.Vector3(),
      offset: new THREE.Vector3(0, 3.2, 8),
    }),
    [],
  );

  useFrame(({ camera }, delta) => {
    const focusTarget = findFocusPosition(focusedSystemNodeId);

    if (!focusedSystemNodeId || reducedMotion) {
      controlsRef.current?.target.lerp(DEFAULT_TARGET, 0.035);
      return;
    }

    scratch.target.copy(focusTarget);
    scratch.camera.copy(focusTarget).add(scratch.offset);

    camera.position.lerp(scratch.camera, Math.min(delta * 1.8, 0.08));
    controlsRef.current?.target.lerp(scratch.target, Math.min(delta * 2.1, 0.1));
    controlsRef.current?.update();
  });

  return (
    <>
      <PerspectiveCamera
        makeDefault
        position={DEFAULT_CAMERA.toArray()}
        fov={54}
        near={0.1}
        far={260}
      />
      <OrbitControls
        ref={controlsRef}
        enableZoom
        enablePan
        enableRotate
        rotateSpeed={0.34}
        zoomSpeed={0.72}
        panSpeed={0.45}
        autoRotate={!reducedMotion && !focusedSystemNodeId}
        autoRotateSpeed={0.18}
        minDistance={4}
        maxDistance={78}
        minPolarAngle={Math.PI / 8}
        maxPolarAngle={Math.PI - Math.PI / 8}
      />
    </>
  );
}
