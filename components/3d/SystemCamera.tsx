"use client";

import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import {
  writeMegastructurePosition,
  writeMoonWorldPosition,
  writePathwayFocusPosition,
  writePlanetPosition,
} from "@/components/3d/orbitMath";
import { SHATTERED_SYSTEM } from "@/components/3d/shatteredSystem";
import { useGlobalStore } from "@/stores/globalStore";

const DEFAULT_TARGET = new THREE.Vector3(0, 0, 0);
const DEFAULT_CAMERA = new THREE.Vector3(0, 8, 30);
const FOCUS_OFFSET = new THREE.Vector3(0, 3.2, 8);
const MAX_GUIDE_DURATION = 2.4;

function writeFocusPosition(
  id: string | null,
  elapsedTime: number,
  target: THREE.Vector3,
  parentTarget: THREE.Vector3,
) {
  if (!id) {
    target.copy(DEFAULT_TARGET);
    return;
  }

  const planet = SHATTERED_SYSTEM.planets.find((item) => item.id === id);
  if (planet) {
    writePlanetPosition(target, planet, elapsedTime);
    return;
  }

  const moon = SHATTERED_SYSTEM.moons.find((item) => item.id === id);
  if (moon) {
    const parent = SHATTERED_SYSTEM.planets.find(
      (item) => item.id === moon.parentId,
    );

    if (!parent) {
      target.copy(DEFAULT_TARGET);
      return;
    }

    writeMoonWorldPosition(target, parentTarget, moon, parent, elapsedTime);
    return;
  }

  const structure = SHATTERED_SYSTEM.megastructures.find(
    (item) => item.id === id,
  );
  if (structure) {
    writeMegastructurePosition(target, structure, elapsedTime);
    return;
  }

  const pathway = SHATTERED_SYSTEM.pathways.find((item) => item.id === id);
  if (pathway) {
    writePathwayFocusPosition(target, pathway);
    return;
  }

  target.copy(DEFAULT_TARGET);
}

export interface SystemCameraProps {
  reducedMotion?: boolean;
  speedMultiplier?: number;
}

export function SystemCamera({
  reducedMotion = false,
  speedMultiplier = 1,
}: SystemCameraProps) {
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const activeFocusRef = useRef<string | null>(null);
  const guidingRef = useRef(false);
  const guideStartedAtRef = useRef(0);
  const focusedSystemNodeId = useGlobalStore(
    (state) => state.focusedSystemNodeId,
  );

  const scratch = useMemo(
    () => ({
      target: new THREE.Vector3(),
      parentTarget: new THREE.Vector3(),
      camera: new THREE.Vector3(),
    }),
    [],
  );

  useFrame(({ camera, clock }, delta) => {
    const controls = controlsRef.current;

    if (focusedSystemNodeId !== activeFocusRef.current) {
      activeFocusRef.current = focusedSystemNodeId;
      guidingRef.current = Boolean(focusedSystemNodeId && !reducedMotion);
      guideStartedAtRef.current = clock.elapsedTime;
    }

    writeFocusPosition(
      focusedSystemNodeId,
      clock.elapsedTime * speedMultiplier,
      scratch.target,
      scratch.parentTarget,
    );

    if (!focusedSystemNodeId || reducedMotion) {
      guidingRef.current = false;
      controls?.target.lerp(DEFAULT_TARGET, 0.035);
      controls?.update();
      return;
    }

    controls?.target.lerp(scratch.target, Math.min(delta * 2.1, 0.1));

    if (guidingRef.current) {
      scratch.camera.copy(scratch.target).add(FOCUS_OFFSET);
      camera.position.lerp(scratch.camera, Math.min(delta * 1.8, 0.08));

      const cameraSettled = camera.position.distanceTo(scratch.camera) < 0.08;
      const targetSettled = controls
        ? controls.target.distanceTo(scratch.target) < 0.05
        : true;
      const guideExpired =
        clock.elapsedTime - guideStartedAtRef.current > MAX_GUIDE_DURATION;

      if (guideExpired || (cameraSettled && targetSettled)) {
        guidingRef.current = false;
      }
    }

    controls?.update();
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
        onStart={() => {
          guidingRef.current = false;
        }}
        minDistance={4}
        maxDistance={78}
        minPolarAngle={Math.PI / 8}
        maxPolarAngle={Math.PI - Math.PI / 8}
      />
    </>
  );
}
