"use client";

/* ═══════════════════════════════════════════════════
   Constellation — interactive stars + dynamic lines
   ─────────────────────────────────────────────────
   Strategy:
   - Generate N stars on a roughly spherical shell.
   - Pre-compute neighbor pairs ONCE based on rest-pose
     distances. Lines reuse those pairs every frame —
     just stream updated endpoint positions.
   - Mouse pointer is raycast onto a Z=0 plane and
     applies a smooth attraction to nearby stars.
   - All vec3 / raycaster instances are allocated once
     and mutated in-place inside useFrame.
   ═══════════════════════════════════════════════════ */

import { useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

export interface ConstellationProps {
  count?: number;
  /** Radius of the spherical shell stars sit on */
  radius?: number;
  /** Max distance for two stars to be linked */
  linkDistance?: number;
  /** Mouse interaction radius (world units) */
  mouseRadius?: number;
  /** + attracts toward mouse, - repels */
  mouseStrength?: number;
  starColor?: string;
  lineColor?: string;
}

export function Constellation({
  count = 500,
  radius = 28,
  linkDistance = 4.5,
  mouseRadius = 7,
  mouseStrength = 0.9,
  starColor = "#38BDF8",
  lineColor = "#8B5CF6",
}: ConstellationProps) {
  const { camera } = useThree();

  /* ────── Star positions (rest pose + live copy) ────── */
  const { rest, live, sizes, pairs, linePositions } = useMemo(() => {
    const rest = new Float32Array(count * 3);
    const live = new Float32Array(count * 3);
    const sizes = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      // Cluster slightly toward the camera-facing hemisphere for visual density
      const u = Math.random();
      const v = Math.random() * 0.85 + 0.15;
      const theta = u * Math.PI * 2;
      const phi = Math.acos(2 * v - 1);
      const r = radius * (0.85 + Math.random() * 0.3);
      const sinPhi = Math.sin(phi);

      const x = r * sinPhi * Math.cos(theta);
      const y = r * sinPhi * Math.sin(theta);
      const z = r * Math.cos(phi) - radius * 0.3; // shift forward

      rest[i * 3 + 0] = live[i * 3 + 0] = x;
      rest[i * 3 + 1] = live[i * 3 + 1] = y;
      rest[i * 3 + 2] = live[i * 3 + 2] = z;

      sizes[i] = 0.8 + Math.random() * 1.6;
    }

    // Pre-compute neighbor pairs (n^2 once at mount)
    const pairs: number[] = [];
    const linkSq = linkDistance * linkDistance;
    for (let i = 0; i < count; i++) {
      const ix = rest[i * 3 + 0];
      const iy = rest[i * 3 + 1];
      const iz = rest[i * 3 + 2];
      for (let j = i + 1; j < count; j++) {
        const dx = ix - rest[j * 3 + 0];
        const dy = iy - rest[j * 3 + 1];
        const dz = iz - rest[j * 3 + 2];
        if (dx * dx + dy * dy + dz * dz < linkSq) {
          pairs.push(i, j);
          // Cap edges to keep draw cost bounded on large counts
          if (pairs.length >= count * 8) break;
        }
      }
      if (pairs.length >= count * 8) break;
    }

    const linePositions = new Float32Array((pairs.length / 2) * 6);
    return { rest, live, sizes, pairs, linePositions };
  }, [count, radius, linkDistance]);

  /* ────── Refs to geometry attributes for streaming ────── */
  const starGeoRef = useRef<THREE.BufferGeometry>(null);
  const lineGeoRef = useRef<THREE.BufferGeometry>(null);
  const starMatRef = useRef<THREE.ShaderMaterial>(null);

  /* ────── Pre-allocated scratch objects ────── */
  const scratch = useMemo(
    () => ({
      raycaster: new THREE.Raycaster(),
      plane: new THREE.Plane(new THREE.Vector3(0, 0, 1), 0),
      mouseWorld: new THREE.Vector3(),
      tmp: new THREE.Vector3(),
      pointer: new THREE.Vector2(),
    }),
    [],
  );

  /* ────── Star shader (twinkle + size attenuation) ────── */
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uColor: { value: new THREE.Color(starColor) },
      uPixelRatio: {
        value:
          typeof window !== "undefined"
            ? Math.min(window.devicePixelRatio, 2)
            : 1,
      },
    }),
    [starColor],
  );

  const STAR_VERT = /* glsl */ `
    attribute float aSize;
    uniform float uTime;
    uniform float uPixelRatio;
    varying float vTwinkle;
    void main() {
      float t = uTime * 1.2 + float(gl_VertexID) * 0.13;
      vTwinkle = 0.6 + 0.4 * sin(t);
      vec4 mv = modelViewMatrix * vec4(position, 1.0);
      gl_Position = projectionMatrix * mv;
      gl_PointSize = aSize * uPixelRatio * (260.0 / -mv.z);
    }
  `;

  const STAR_FRAG = /* glsl */ `
    precision mediump float;
    uniform vec3 uColor;
    varying float vTwinkle;
    void main() {
      vec2 c = gl_PointCoord - 0.5;
      float d = length(c);
      if (d > 0.5) discard;
      float core = smoothstep(0.5, 0.0, d);
      float halo = smoothstep(0.5, 0.2, d) * 0.5;
      gl_FragColor = vec4(uColor, (core + halo) * vTwinkle);
    }
  `;

  /* ────── Frame loop ────── */
  useFrame((state, delta) => {
    if (starMatRef.current) {
      starMatRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    }

    // Project pointer onto a plane in front of the camera
    scratch.pointer.set(state.pointer.x, state.pointer.y);
    scratch.raycaster.setFromCamera(scratch.pointer, camera);
    const hit = scratch.raycaster.ray.intersectPlane(
      scratch.plane,
      scratch.mouseWorld,
    );

    const ease = Math.min(delta * 4, 1);
    const mouseR2 = mouseRadius * mouseRadius;

    for (let i = 0; i < count; i++) {
      const ix = i * 3;
      const rx = rest[ix];
      const ry = rest[ix + 1];
      const rz = rest[ix + 2];

      let tx = rx;
      let ty = ry;
      let tz = rz;

      if (hit) {
        const dx = scratch.mouseWorld.x - rx;
        const dy = scratch.mouseWorld.y - ry;
        const dz = scratch.mouseWorld.z - rz;
        const d2 = dx * dx + dy * dy + dz * dz;
        if (d2 < mouseR2 && d2 > 0.0001) {
          // Smooth radial falloff, attract toward mouse
          const falloff = 1 - d2 / mouseR2;
          const k = falloff * falloff * mouseStrength;
          tx += dx * k;
          ty += dy * k;
          tz += dz * k * 0.4; // damp Z to keep depth coherent
        }
      }

      // Critically-damped lerp toward target
      live[ix] += (tx - live[ix]) * ease;
      live[ix + 1] += (ty - live[ix + 1]) * ease;
      live[ix + 2] += (tz - live[ix + 2]) * ease;
    }

    // Stream star positions
    if (starGeoRef.current) {
      const attr = starGeoRef.current.getAttribute(
        "position",
      ) as THREE.BufferAttribute;
      attr.needsUpdate = true;
    }

    // Stream line endpoints (reuse precomputed pair indices)
    const lineCount = pairs.length / 2;
    for (let p = 0; p < lineCount; p++) {
      const a = pairs[p * 2] * 3;
      const b = pairs[p * 2 + 1] * 3;
      const o = p * 6;
      linePositions[o + 0] = live[a + 0];
      linePositions[o + 1] = live[a + 1];
      linePositions[o + 2] = live[a + 2];
      linePositions[o + 3] = live[b + 0];
      linePositions[o + 4] = live[b + 1];
      linePositions[o + 5] = live[b + 2];
    }
    if (lineGeoRef.current) {
      const attr = lineGeoRef.current.getAttribute(
        "position",
      ) as THREE.BufferAttribute;
      attr.needsUpdate = true;
    }
  });

  return (
    <group>
      {/* Stars */}
      <points frustumCulled={false}>
        <bufferGeometry ref={starGeoRef}>
          <bufferAttribute
            attach="attributes-position"
            args={[live, 3]}
            count={count}
          />
          <bufferAttribute
            attach="attributes-aSize"
            args={[sizes, 1]}
            count={count}
          />
        </bufferGeometry>
        <shaderMaterial
          ref={starMatRef}
          uniforms={uniforms}
          vertexShader={STAR_VERT}
          fragmentShader={STAR_FRAG}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          toneMapped={false}
        />
      </points>

      {/* Connecting lines */}
      <lineSegments frustumCulled={false}>
        <bufferGeometry ref={lineGeoRef}>
          <bufferAttribute
            attach="attributes-position"
            args={[linePositions, 3]}
            count={linePositions.length / 3}
          />
        </bufferGeometry>
        <lineBasicMaterial
          color={lineColor}
          transparent
          opacity={0.18}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          toneMapped={false}
        />
      </lineSegments>
    </group>
  );
}
