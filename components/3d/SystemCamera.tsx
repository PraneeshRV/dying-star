"use client";

import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import gsap from "gsap";
import type { MutableRefObject } from "react";
import { useCallback, useEffect, useMemo, useRef } from "react";
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
const DEFAULT_FOCUS_RADIUS = 0.5;
const FREEFLY_ACCELERATION = 18;
const FREEFLY_MAX_SPEED = 14;
const MOUSE_SENSITIVITY = 0.0021;

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

function focusRadiusForNode(id: string | null) {
  if (!id) {
    return DEFAULT_FOCUS_RADIUS;
  }

  const planet = SHATTERED_SYSTEM.planets.find((item) => item.id === id);
  if (planet) {
    return planet.size;
  }

  const moon = SHATTERED_SYSTEM.moons.find((item) => item.id === id);
  if (moon) {
    return moon.size;
  }

  return DEFAULT_FOCUS_RADIUS;
}

function writeFocusCameraPosition(
  id: string | null,
  target: THREE.Vector3,
  cameraPosition: THREE.Vector3,
) {
  const radius = focusRadiusForNode(id);
  cameraPosition.set(
    target.x + radius * 0.85,
    target.y + radius * 2.8 + 0.55,
    target.z + Math.max(2.65, radius * 5.4),
  );
}

function isTypingTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) {
    return false;
  }

  return (
    target.isContentEditable ||
    target.tagName === "INPUT" ||
    target.tagName === "TEXTAREA" ||
    target.tagName === "SELECT"
  );
}

function syncAnglesFromCamera(
  camera: THREE.Camera,
  yawRef: MutableRefObject<number>,
  pitchRef: MutableRefObject<number>,
) {
  const euler = new THREE.Euler().setFromQuaternion(camera.quaternion, "YXZ");
  pitchRef.current = euler.x;
  yawRef.current = euler.y;
}

function applyFreeFlyRotation(
  camera: THREE.Camera,
  yaw: number,
  pitch: number,
) {
  camera.quaternion.setFromEuler(new THREE.Euler(pitch, yaw, 0, "YXZ"));
}

export interface SystemCameraProps {
  reducedMotion?: boolean;
  speedMultiplier?: number;
}

export function SystemCamera({
  reducedMotion = false,
  speedMultiplier = 1,
}: SystemCameraProps) {
  const { camera, gl } = useThree();
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const activeFocusRef = useRef<string | null>(null);
  const cameraTweenRef = useRef<gsap.core.Timeline | null>(null);
  const keysRef = useRef(new Set<string>());
  const modeRef = useRef(useGlobalStore.getState().cameraMode);
  const elapsedTimeRef = useRef(0);
  const yawRef = useRef(0);
  const pitchRef = useRef(0);
  const focusedSystemNodeId = useGlobalStore(
    (state) => state.focusedSystemNodeId,
  );
  const cameraMode = useGlobalStore((state) => state.cameraMode);
  const setCameraMode = useGlobalStore((state) => state.setCameraMode);
  const setFocusedSystemNodeId = useGlobalStore(
    (state) => state.setFocusedSystemNodeId,
  );

  const scratch = useMemo(
    () => ({
      target: new THREE.Vector3(),
      parentTarget: new THREE.Vector3(),
      camera: new THREE.Vector3(),
      forward: new THREE.Vector3(),
      right: new THREE.Vector3(),
      up: new THREE.Vector3(0, 1, 0),
      velocity: new THREE.Vector3(),
    }),
    [],
  );

  const stopCameraTween = useCallback(() => {
    cameraTweenRef.current?.kill();
    cameraTweenRef.current = null;
  }, []);

  const startOverviewTween = useCallback(() => {
    const controls = controlsRef.current;
    stopCameraTween();

    if (reducedMotion) {
      camera.position.copy(DEFAULT_CAMERA);
      controls?.target.copy(DEFAULT_TARGET);
      controls?.update();
      return;
    }

    cameraTweenRef.current = gsap.timeline({
      defaults: { duration: 1.35, ease: "power3.inOut" },
      onComplete: () => {
        cameraTweenRef.current = null;
      },
    });

    cameraTweenRef.current.to(
      camera.position,
      { x: DEFAULT_CAMERA.x, y: DEFAULT_CAMERA.y, z: DEFAULT_CAMERA.z },
      0,
    );

    if (controls) {
      cameraTweenRef.current.to(
        controls.target,
        { x: DEFAULT_TARGET.x, y: DEFAULT_TARGET.y, z: DEFAULT_TARGET.z },
        0,
      );
    }
  }, [camera, reducedMotion, stopCameraTween]);

  const startFocusTween = useCallback(
    (id: string) => {
      const controls = controlsRef.current;
      stopCameraTween();

      writeFocusPosition(
        id,
        elapsedTimeRef.current * speedMultiplier,
        scratch.target,
        scratch.parentTarget,
      );
      writeFocusCameraPosition(id, scratch.target, scratch.camera);

      if (reducedMotion) {
        camera.position.copy(scratch.camera);
        controls?.target.copy(scratch.target);
        controls?.update();
        return;
      }

      cameraTweenRef.current = gsap.timeline({
        defaults: { duration: 2.35, ease: "power3.inOut" },
        onComplete: () => {
          cameraTweenRef.current = null;
        },
        onUpdate: () => {
          controls?.update();
        },
      });

      cameraTweenRef.current.to(
        camera.position,
        { x: scratch.camera.x, y: scratch.camera.y, z: scratch.camera.z },
        0,
      );

      if (controls) {
        cameraTweenRef.current.to(
          controls.target,
          { x: scratch.target.x, y: scratch.target.y, z: scratch.target.z },
          0,
        );
      }
    },
    [camera, reducedMotion, scratch, speedMultiplier, stopCameraTween],
  );

  const requestFreeFlyLock = useCallback(() => {
    if (document.pointerLockElement === gl.domElement) {
      return;
    }

    try {
      gl.domElement.requestPointerLock();
    } catch {
      // Pointer lock requires a user gesture; keyboard flight still works if denied.
    }
  }, [gl.domElement]);

  useEffect(() => {
    modeRef.current = cameraMode;
  }, [cameraMode]);

  useEffect(() => {
    if (
      focusedSystemNodeId &&
      cameraMode !== "freefly" &&
      cameraMode !== "orbiting"
    ) {
      setCameraMode("orbiting");
    }

    if (!focusedSystemNodeId && cameraMode === "orbiting") {
      setCameraMode("overview");
    }
  }, [cameraMode, focusedSystemNodeId, setCameraMode]);

  useEffect(() => {
    if (cameraMode === "freefly") {
      stopCameraTween();
      syncAnglesFromCamera(camera, yawRef, pitchRef);
      controlsRef.current?.update();
      return;
    }

    if (cameraMode === "orbiting" && focusedSystemNodeId) {
      startFocusTween(focusedSystemNodeId);
      return;
    }

    startOverviewTween();
  }, [
    camera,
    cameraMode,
    focusedSystemNodeId,
    startFocusTween,
    startOverviewTween,
    stopCameraTween,
  ]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (isTypingTarget(event.target)) {
        return;
      }

      if (event.code === "KeyF") {
        event.preventDefault();
        setFocusedSystemNodeId(null);
        setCameraMode("freefly");
        requestFreeFlyLock();
        return;
      }

      if (event.code === "Escape") {
        setFocusedSystemNodeId(null);
        setCameraMode("overview");
        if (document.pointerLockElement === gl.domElement) {
          document.exitPointerLock();
        }
        return;
      }

      keysRef.current.add(event.code);
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      keysRef.current.delete(event.code);
    };

    const handleDoubleClick = () => {
      setFocusedSystemNodeId(null);
      setCameraMode("freefly");
      requestFreeFlyLock();
    };

    const handleMouseMove = (event: MouseEvent) => {
      if (
        modeRef.current !== "freefly" ||
        document.pointerLockElement !== gl.domElement
      ) {
        return;
      }

      yawRef.current -= event.movementX * MOUSE_SENSITIVITY;
      pitchRef.current = THREE.MathUtils.clamp(
        pitchRef.current - event.movementY * MOUSE_SENSITIVITY,
        -Math.PI / 2 + 0.05,
        Math.PI / 2 - 0.05,
      );
      applyFreeFlyRotation(camera, yawRef.current, pitchRef.current);
    };

    const handlePointerLockChange = () => {
      if (
        modeRef.current === "freefly" &&
        document.pointerLockElement !== gl.domElement
      ) {
        setCameraMode("overview");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("pointerlockchange", handlePointerLockChange);
    gl.domElement.addEventListener("dblclick", handleDoubleClick);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener(
        "pointerlockchange",
        handlePointerLockChange,
      );
      gl.domElement.removeEventListener("dblclick", handleDoubleClick);
    };
  }, [
    camera,
    gl.domElement,
    requestFreeFlyLock,
    setCameraMode,
    setFocusedSystemNodeId,
  ]);

  useEffect(() => {
    return () => {
      stopCameraTween();
    };
  }, [stopCameraTween]);

  useFrame(({ camera, clock }, delta) => {
    const controls = controlsRef.current;
    elapsedTimeRef.current = clock.elapsedTime;

    if (cameraMode === "freefly") {
      if (controls) {
        controls.enabled = false;
      }

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

      if (thrustForward !== 0) {
        scratch.velocity.addScaledVector(
          scratch.forward,
          thrustForward * FREEFLY_ACCELERATION * delta,
        );
      }

      if (thrustRight !== 0) {
        scratch.velocity.addScaledVector(
          scratch.right,
          thrustRight * FREEFLY_ACCELERATION * delta,
        );
      }

      if (thrustUp !== 0) {
        scratch.velocity.addScaledVector(
          scratch.up,
          thrustUp * FREEFLY_ACCELERATION * delta,
        );
      }

      if (scratch.velocity.length() > FREEFLY_MAX_SPEED) {
        scratch.velocity.setLength(FREEFLY_MAX_SPEED);
      }

      camera.position.addScaledVector(scratch.velocity, delta);
      scratch.velocity.multiplyScalar(0.9);
      return;
    }

    if (focusedSystemNodeId !== activeFocusRef.current) {
      activeFocusRef.current = focusedSystemNodeId;

      if (focusedSystemNodeId) {
        startFocusTween(focusedSystemNodeId);
      }
    }

    writeFocusPosition(
      focusedSystemNodeId,
      clock.elapsedTime * speedMultiplier,
      scratch.target,
      scratch.parentTarget,
    );

    if (!focusedSystemNodeId || cameraMode === "overview") {
      if (controls) {
        controls.enabled = true;
      }
      controls?.target.lerp(DEFAULT_TARGET, 0.035);
      controls?.update();
      return;
    }

    if (controls) {
      controls.enabled = true;
    }

    controls?.target.lerp(scratch.target, Math.min(delta * 2.1, 0.1));

    if (!cameraTweenRef.current) {
      writeFocusCameraPosition(
        focusedSystemNodeId,
        scratch.target,
        scratch.camera,
      );
      camera.position.lerp(scratch.camera, Math.min(delta * 0.75, 0.05));
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
        enabled={cameraMode !== "freefly"}
        enableZoom={cameraMode !== "freefly"}
        enablePan={cameraMode !== "freefly"}
        enableRotate={cameraMode !== "freefly"}
        rotateSpeed={0.34}
        zoomSpeed={0.72}
        panSpeed={0.45}
        autoRotate={!reducedMotion && cameraMode === "overview"}
        autoRotateSpeed={0.18}
        onStart={() => {
          stopCameraTween();
        }}
        minDistance={4}
        maxDistance={78}
        minPolarAngle={Math.PI / 8}
        maxPolarAngle={Math.PI - Math.PI / 8}
      />
    </>
  );
}
