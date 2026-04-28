"use client";

/* ═══════════════════════════════════════════════════
   NeutronStar — Custom GLSL spinning quasar
   ─────────────────────────────────────────────────
   - Pulsating glowing core (sphere)
   - Volumetric accretion disk (rotating torus)
   - Relativistic jets (tapered cones, additive)
   ─────────────────────────────────────────────────
   Production notes:
   - All Vector3/Color allocations live in useMemo, never inside useFrame.
   - Uniform refs are mutated in place (no new objects per frame).
   - Materials use additive blending for the glow without depth-write fighting.
   ═══════════════════════════════════════════════════ */

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

/* ──────────────────────────────────────────────
   Shared GLSL helpers (hash + simplex-ish noise)
   Kept compact & branchless for GPU perf.
   ────────────────────────────────────────────── */
const GLSL_NOISE = /* glsl */ `
  float hash11(float p) {
    p = fract(p * 0.1031);
    p *= p + 33.33;
    p *= p + p;
    return fract(p);
  }
  float hash21(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }
  float noise2(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    float a = hash21(i);
    float b = hash21(i + vec2(1.0, 0.0));
    float c = hash21(i + vec2(0.0, 1.0));
    float d = hash21(i + vec2(1.0, 1.0));
    return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
  }
  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 4; i++) {
      v += a * noise2(p);
      p *= 2.02;
      a *= 0.5;
    }
    return v;
  }
`;

/* ──────────────────────────────────────────────
   CORE SHADER — pulsating sphere
   ────────────────────────────────────────────── */
const CORE_VERT = /* glsl */ `
  varying vec3 vPos;
  varying vec3 vNormal;
  varying vec3 vViewDir;

  void main() {
    vPos = position;
    vNormal = normalize(normalMatrix * normal);
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    vViewDir = normalize(-mvPosition.xyz);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const CORE_FRAG = /* glsl */ `
  precision highp float;
  uniform float uTime;
  uniform vec3 uColorPrimary;
  uniform vec3 uColorSecondary;
  uniform vec3 uColorScar;

  varying vec3 vPos;
  varying vec3 vNormal;
  varying vec3 vViewDir;

  ${GLSL_NOISE}

  void main() {
    // Surface turbulence
    vec3 p = normalize(vPos);
    float n = fbm(p.xy * 3.0 + uTime * 0.35) * 0.5
            + fbm(p.yz * 4.0 - uTime * 0.5) * 0.5;
    float magneticBand = abs(p.y);
    float scarNoise = fbm(p.xz * 7.0 + vec2(uTime * 0.08, -uTime * 0.04));
    float darkScar = smoothstep(0.58, 0.86, scarNoise) * smoothstep(0.12, 0.82, magneticBand);

    // Pulsating brightness
    float pulse = 0.85 + 0.15 * sin(uTime * 2.4)
                + 0.05 * sin(uTime * 7.1);

    // Two-color mix driven by noise
    vec3 base = mix(uColorPrimary, uColorSecondary, smoothstep(0.25, 0.75, n));

    // Fresnel rim — bright at glancing angles
    float rim = 1.0 - max(dot(vNormal, vViewDir), 0.0);
    rim = pow(rim, 2.4);

    vec3 color = base * (0.72 + 0.42 * n) * pulse;
    color = mix(color, uColorScar * 0.28, darkScar * 0.72);
    color += uColorPrimary * rim * 1.9 * pulse;
    color += vec3(1.0) * pow(rim, 5.0) * 0.92;

    gl_FragColor = vec4(color, 1.0);
  }
`;

/* ──────────────────────────────────────────────
   DISK SHADER — volumetric accretion ring
   ────────────────────────────────────────────── */
const DISK_VERT = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vPos;
  void main() {
    vUv = uv;
    vPos = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const DISK_FRAG = /* glsl */ `
  precision highp float;
  uniform float uTime;
  uniform vec3 uColorPrimary;
  uniform vec3 uColorSecondary;

  varying vec2 vUv;
  varying vec3 vPos;

  ${GLSL_NOISE}

  void main() {
    // Torus uv: x = around tube, y = around ring (we treat y as "across" thickness)
    float across = abs(vUv.y - 0.5) * 2.0;        // 0 at centerline, 1 at edges
    float around = vUv.x;                          // 0..1 around the ring

    // Doppler-like asymmetry (one side brighter)
    float doppler = 0.5 + 0.5 * cos(around * 6.2831 - uTime * 0.6);

    // Swirling streaks
    float streaks = fbm(vec2(around * 18.0 - uTime * 1.4, across * 4.0));
    streaks = pow(streaks, 1.4);

    // Soft falloff across the tube (volumetric glow)
    float thickness = exp(-across * across * 4.5);

    // Two-tone gradient: green core fading into purple outer halo
    vec3 col = mix(uColorPrimary, uColorSecondary, smoothstep(0.1, 0.9, across));
    col *= 0.6 + 1.6 * streaks;
    col *= 0.5 + 1.2 * doppler;

    float alpha = thickness * (0.55 + 0.45 * streaks);
    alpha *= 0.92;

    gl_FragColor = vec4(col, alpha);
  }
`;

/* ──────────────────────────────────────────────
   JET SHADER — tapered relativistic beam
   ────────────────────────────────────────────── */
const JET_VERT = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const JET_FRAG = /* glsl */ `
  precision highp float;
  uniform float uTime;
  uniform vec3 uColorPrimary;
  uniform vec3 uColorSecondary;

  varying vec2 vUv;

  ${GLSL_NOISE}

  void main() {
    // vUv.y = 0 at base (near star), 1 at tip
    float along = vUv.y;
    float across = abs(vUv.x - 0.5) * 2.0;        // 0 center, 1 edge

    // Length falloff — bright near the star, fades at the tip
    float lengthFalloff = pow(1.0 - along, 1.8);

    // Soft cylindrical falloff to the edges
    float radial = exp(-across * across * 5.0);

    // Turbulence streaks travelling outward
    float streak = fbm(vec2(across * 6.0, along * 8.0 - uTime * 2.2));
    streak = pow(streak, 2.0);

    // Pulsing core
    float pulse = 0.75 + 0.25 * sin(uTime * 5.0 + along * 12.0);

    vec3 col = mix(uColorSecondary, uColorPrimary, lengthFalloff);
    col += uColorPrimary * pow(1.0 - across, 8.0) * 1.8 * pulse;

    float alpha = radial * (0.35 + 0.65 * lengthFalloff) * (0.55 + 0.6 * streak);
    alpha *= 0.95;

    gl_FragColor = vec4(col * (1.0 + streak * 0.7), alpha);
  }
`;

/* ──────────────────────────────────────────────
   Component
   ────────────────────────────────────────────── */
export interface NeutronStarProps {
  position?: [number, number, number];
  scale?: number;
  /** Hot neutron emission color */
  primaryColor?: string;
  /** Corona and magnetic field color */
  secondaryColor?: string;
  /** Attack-scar and accretion ember color */
  scarColor?: string;
  /** Spin speed in rad/sec for the disk */
  spinSpeed?: number;
  timeScale?: number;
}

export function NeutronStar({
  position = [0, 0, 0],
  scale = 1,
  primaryColor = "#dceeff",
  secondaryColor = "#58f3ff",
  scarColor = "#ff7a45",
  spinSpeed = 0.42,
  timeScale = 1,
}: NeutronStarProps) {
  const groupRef = useRef<THREE.Group>(null);
  const diskRef = useRef<THREE.Mesh>(null);
  const coreMatRef = useRef<THREE.ShaderMaterial>(null);
  const diskMatRef = useRef<THREE.ShaderMaterial>(null);
  const jetTopMatRef = useRef<THREE.ShaderMaterial>(null);
  const jetBottomMatRef = useRef<THREE.ShaderMaterial>(null);

  // Pre-allocated colors — never re-created per frame
  const colors = useMemo(
    () => ({
      primary: new THREE.Color(primaryColor),
      secondary: new THREE.Color(secondaryColor),
      scar: new THREE.Color(scarColor),
    }),
    [primaryColor, secondaryColor, scarColor],
  );

  const coreUniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uColorPrimary: { value: colors.primary },
      uColorSecondary: { value: colors.secondary },
      uColorScar: { value: colors.scar },
    }),
    [colors],
  );

  const diskUniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uColorPrimary: { value: colors.primary },
      uColorSecondary: { value: colors.secondary },
      uColorScar: { value: colors.scar },
    }),
    [colors],
  );

  const jetTopUniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uColorPrimary: { value: colors.primary },
      uColorSecondary: { value: colors.secondary },
    }),
    [colors],
  );

  const jetBottomUniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uColorPrimary: { value: colors.primary },
      uColorSecondary: { value: colors.secondary },
    }),
    [colors],
  );

  useFrame((state, delta) => {
    const scaledDelta = delta * timeScale;
    const t = state.clock.elapsedTime * timeScale;
    if (coreMatRef.current) coreMatRef.current.uniforms.uTime.value = t;
    if (diskMatRef.current) diskMatRef.current.uniforms.uTime.value = t;
    if (jetTopMatRef.current) jetTopMatRef.current.uniforms.uTime.value = t;
    if (jetBottomMatRef.current)
      jetBottomMatRef.current.uniforms.uTime.value = t;

    if (diskRef.current) diskRef.current.rotation.z += scaledDelta * spinSpeed;
    if (groupRef.current)
      groupRef.current.rotation.y += scaledDelta * spinSpeed * 0.18;
  });

  return (
    <group ref={groupRef} position={position} scale={scale}>
      {/* Glowing core */}
      <mesh>
        <sphereGeometry args={[1, 64, 64]} />
        <shaderMaterial
          ref={coreMatRef}
          uniforms={coreUniforms}
          vertexShader={CORE_VERT}
          fragmentShader={CORE_FRAG}
          toneMapped={false}
        />
      </mesh>

      {/* Outer halo — purely additive bloom feeder */}
      <mesh>
        <sphereGeometry args={[1.35, 32, 32]} />
        <meshBasicMaterial
          color={primaryColor}
          transparent
          opacity={0.08}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>

      <mesh rotation={[Math.PI / 2.4, 0, Math.PI / 7]}>
        <torusGeometry args={[1.75, 0.015, 8, 192]} />
        <meshBasicMaterial
          color={secondaryColor}
          transparent
          opacity={0.28}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>

      <mesh rotation={[Math.PI / 2.1, 0, -Math.PI / 5]}>
        <torusGeometry args={[2.05, 0.01, 8, 192]} />
        <meshBasicMaterial
          color={scarColor}
          transparent
          opacity={0.14}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>

      {/* Accretion disk */}
      <mesh ref={diskRef} rotation={[Math.PI / 2.25, 0, 0]}>
        <torusGeometry args={[2.6, 0.65, 24, 192]} />
        <shaderMaterial
          ref={diskMatRef}
          uniforms={diskUniforms}
          vertexShader={DISK_VERT}
          fragmentShader={DISK_FRAG}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          side={THREE.DoubleSide}
          toneMapped={false}
        />
      </mesh>

      {/* North polar jet */}
      <mesh position={[0, 3.2, 0]}>
        <coneGeometry args={[0.32, 4.6, 32, 1, true]} />
        <shaderMaterial
          ref={jetTopMatRef}
          uniforms={jetTopUniforms}
          vertexShader={JET_VERT}
          fragmentShader={JET_FRAG}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          side={THREE.DoubleSide}
          toneMapped={false}
        />
      </mesh>

      {/* South polar jet */}
      <mesh position={[0, -3.2, 0]} rotation={[Math.PI, 0, 0]}>
        <coneGeometry args={[0.32, 4.6, 32, 1, true]} />
        <shaderMaterial
          ref={jetBottomMatRef}
          uniforms={jetBottomUniforms}
          vertexShader={JET_VERT}
          fragmentShader={JET_FRAG}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          side={THREE.DoubleSide}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}
