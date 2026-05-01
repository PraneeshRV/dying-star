"use client";

/* ═══════════════════════════════════════════════════
   Starfield — twinkling background stars
   ─────────────────────────────────────────────────
   - One <points> draw call (no per-star objects)
   - Per-star phase + size baked into buffer attributes
   - Twinkle is purely shader-side via uTime + aPhase
   - `count` prop lets the GPU tier dial the population
   ═══════════════════════════════════════════════════ */

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

const STAR_VERT = /* glsl */ `
  attribute float aPhase;
  attribute float aSize;
  attribute vec3 aColor;
  uniform float uTime;
  uniform float uPixelRatio;
  varying vec3 vColor;
  varying float vTwinkle;

  void main() {
    // Per-star twinkle — fast hash + slow shimmer combined
    float t = uTime + aPhase;
    float twinkle = 0.55 + 0.45 * sin(t * 1.6);
    twinkle *= 0.85 + 0.15 * sin(t * 5.3 + aPhase * 7.0);
    vTwinkle = twinkle;
    vColor = aColor;

    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mv;

    // Size attenuated by depth (Three.js convention) + DPR
    gl_PointSize = aSize * uPixelRatio * (300.0 / -mv.z);
  }
`;

const STAR_FRAG = /* glsl */ `
  precision mediump float;
  uniform vec3 uColor;
  varying vec3 vColor;
  varying float vTwinkle;

  void main() {
    // Soft round point with falloff
    vec2 c = gl_PointCoord - vec2(0.5);
    float d = length(c);
    if (d > 0.5) discard;

    float core = smoothstep(0.5, 0.0, d);
    float halo = smoothstep(0.5, 0.15, d) * 0.6;
    float a = (core + halo) * vTwinkle;

    gl_FragColor = vec4(uColor * vColor, a);
  }
`;

export interface StarfieldProps {
  /** Number of stars. Tune via GPU tier (e.g. 500 / 1000 / 2000) */
  count?: number;
  /** Inner radius of the spherical shell */
  innerRadius?: number;
  /** Outer radius of the spherical shell */
  outerRadius?: number;
  color?: string;
  timeScale?: number;
}

function seededUnit(seed: number) {
  const x = Math.sin(seed * 127.1) * 43758.5453;
  return x - Math.floor(x);
}

export function Starfield({
  count = 2000,
  innerRadius = 60,
  outerRadius = 140,
  color = "#E8E8F0",
  timeScale = 1,
}: StarfieldProps) {
  const matRef = useRef<THREE.ShaderMaterial>(null);

  const { colors, positions, phases, sizes } = useMemo(() => {
    const colors = new Float32Array(count * 3);
    const positions = new Float32Array(count * 3);
    const phases = new Float32Array(count);
    const sizes = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      // Mix a realistic galactic plane band with deep-field stars.
      const u = seededUnit(i + 101);
      const v = seededUnit(i + 211);
      const theta = u * Math.PI * 2;
      const inGalacticBand = seededUnit(i + 811) < 0.38;
      const phi = inGalacticBand
        ? Math.PI / 2 + (v - 0.5) * 0.34 + Math.sin(theta * 2.0) * 0.045
        : Math.acos(2 * v - 1);
      const r = innerRadius + seededUnit(i + 307) * (outerRadius - innerRadius);

      const sinPhi = Math.sin(phi);
      positions[i * 3 + 0] = r * sinPhi * Math.cos(theta);
      positions[i * 3 + 1] = r * sinPhi * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);

      phases[i] = seededUnit(i + 409) * Math.PI * 2;

      // Size distribution skewed toward small stars, occasional bright ones
      const rs = seededUnit(i + 503);
      sizes[i] = rs < 0.92 ? 0.6 + rs * 1.2 : 1.6 + seededUnit(i + 601) * 1.8;

      const temp = seededUnit(i + 709);
      const warmth = temp < 0.16 ? 0.22 : temp > 0.88 ? -0.18 : 0;
      const bandBoost = inGalacticBand ? 1.16 : 1;
      colors[i * 3 + 0] = (1 + warmth) * bandBoost;
      colors[i * 3 + 1] = (0.96 + Math.abs(warmth) * 0.12) * bandBoost;
      colors[i * 3 + 2] = (1 - warmth * 0.35) * bandBoost;
    }

    return { colors, positions, phases, sizes };
  }, [count, innerRadius, outerRadius]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uColor: { value: new THREE.Color(color) },
      uPixelRatio: {
        value:
          typeof window !== "undefined"
            ? Math.min(window.devicePixelRatio, 2)
            : 1,
      },
    }),
    [color],
  );

  useFrame((state) => {
    if (matRef.current) {
      matRef.current.uniforms.uTime.value = state.clock.elapsedTime * timeScale;
    }
  });

  return (
    <points frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={count}
        />
        <bufferAttribute
          attach="attributes-aPhase"
          args={[phases, 1]}
          count={count}
        />
        <bufferAttribute
          attach="attributes-aSize"
          args={[sizes, 1]}
          count={count}
        />
        <bufferAttribute
          attach="attributes-aColor"
          args={[colors, 3]}
          count={count}
        />
      </bufferGeometry>
      <shaderMaterial
        ref={matRef}
        uniforms={uniforms}
        vertexShader={STAR_VERT}
        fragmentShader={STAR_FRAG}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        toneMapped={false}
      />
    </points>
  );
}
