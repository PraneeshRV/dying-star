"use client";

import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import type { SandboxControlMode } from "@/components/sandbox/sandboxWorld";

const DEFAULT_CAMERA = new THREE.Vector3(0, 5.4, 11.5);
const DEFAULT_TARGET = new THREE.Vector3(0, 0, 0);
const FREEFLY_ACCELERATION = 12;
const FREEFLY_MAX_SPEED = 10;

function isTypingTarget(target: EventTarget | null) {
  return target instanceof HTMLElement
    ? target.isContentEditable ||
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.tagName === "SELECT"
    : false;
}

export interface SandboxCameraProps {
  controlMode: SandboxControlMode;
  selectedPosition?: [number, number, number];
  reducedMotion?: boolean;
  onExitFreeFlight: () => void;
}

export function SandboxCamera({
  controlMode,
  selectedPosition,
  reducedMotion = false,
  onExitFreeFlight,
}: SandboxCameraProps) {
  const { camera } = useThree();
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const keysRef = useRef(new Set<string>());
  const scratch = useMemo(
    () => ({
      target: new THREE.Vector3(),
      cameraTarget: new THREE.Vector3(),
      forward: new THREE.Vector3(),
      right: new THREE.Vector3(),
      up: new THREE.Vector3(0, 1, 0),
      velocity: new THREE.Vector3(),
    }),
    [],
  );

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (isTypingTarget(event.target)) return;
      if (event.code === "Escape") {
        onExitFreeFlight();
        return;
      }
      keysRef.current.add(event.code);
    };
    const handleKeyUp = (event: KeyboardEvent) => {
      keysRef.current.delete(event.code);
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [onExitFreeFlight]);

  useFrame((_, delta) => {
    const controls = controlsRef.current;
    const selected = selectedPosition
      ? scratch.target.fromArray(selectedPosition)
      : DEFAULT_TARGET;

    if (controlMode === "freefly") {
      if (controls) controls.enabled = false;
      const keys = keysRef.current;
      const thrustForward = Number(keys.has("KeyW")) - Number(keys.has("KeyS"));
      const thrustRight = Number(keys.has("KeyD")) - Number(keys.has("KeyA"));
      const thrustUp =
        Number(keys.has("Space") || keys.has("KeyE")) -
        Number(
          keys.has("ShiftLeft") || keys.has("ControlLeft") || keys.has("KeyQ"),
        );

      scratch.forward.set(0, 0, -1).applyQuaternion(camera.quaternion);
      scratch.right.set(1, 0, 0).applyQuaternion(camera.quaternion);
      scratch.velocity.addScaledVector(
        scratch.forward,
        thrustForward * FREEFLY_ACCELERATION * delta,
      );
      scratch.velocity.addScaledVector(
        scratch.right,
        thrustRight * FREEFLY_ACCELERATION * delta,
      );
      scratch.velocity.addScaledVector(
        scratch.up,
        thrustUp * FREEFLY_ACCELERATION * delta,
      );

      if (scratch.velocity.length() > FREEFLY_MAX_SPEED) {
        scratch.velocity.setLength(FREEFLY_MAX_SPEED);
      }

      camera.position.addScaledVector(scratch.velocity, delta);
      scratch.velocity.multiplyScalar(0.9);
      return;
    }

    if (controls) {
      controls.enabled = true;
      controls.target.lerp(selected, reducedMotion ? 1 : 0.08);
      controls.update();
    }

    scratch.cameraTarget.set(
      selected.x + 2.2,
      selected.y + 1.8,
      selected.z + 5.5,
    );
    camera.position.lerp(scratch.cameraTarget, reducedMotion ? 1 : 0.025);
  });

  return (
    <>
      <PerspectiveCamera
        makeDefault
        position={DEFAULT_CAMERA.toArray()}
        fov={56}
        near={0.1}
        far={180}
      />
      <OrbitControls
        ref={controlsRef}
        enabled={controlMode === "guided"}
        enablePan={controlMode === "guided"}
        enableRotate={controlMode === "guided"}
        enableZoom={controlMode === "guided"}
        autoRotate={!reducedMotion && controlMode === "guided"}
        autoRotateSpeed={0.22}
        minDistance={3.2}
        maxDistance={24}
        rotateSpeed={0.38}
        zoomSpeed={0.72}
      />
    </>
  );
}
