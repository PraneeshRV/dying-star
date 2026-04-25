"use client";

/* ═══════════════════════════════════════════════════
   OrbitalPlanets — six dark metallic worlds
   ─────────────────────────────────────────────────
   - Each planet orbits an invisible pivot group
   - Pivots rotate independently (separate refs array)
   - Each orbit has a faint torus ring on the orbital plane
   - Standard PBR material with low-saturation metallics
     and a subtle emissive rim for the cyber-glow
   ═══════════════════════════════════════════════════ */

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import type { Group } from "three";

interface PlanetConfig {
  radius: number;
  speed: number;
  size: number;
  color: string;
  emissive: string;
  emissiveIntensity: number;
  metalness: number;
  roughness: number;
  inclination: number;
  ringColor: string;
  ringOpacity: number;
}

const PLANETS: readonly PlanetConfig[] = [
  {
    radius: 5.5,
    speed: 0.42,
    size: 0.18,
    color: "#0d1f2c",
    emissive: "#38BDF8",
    emissiveIntensity: 0.55,
    metalness: 0.85,
    roughness: 0.35,
    inclination: 0.05,
    ringColor: "#38BDF8",
    ringOpacity: 0.16,
  },
  {
    radius: 7.2,
    speed: -0.31,
    size: 0.26,
    color: "#1a1224",
    emissive: "#8B5CF6",
    emissiveIntensity: 0.6,
    metalness: 0.9,
    roughness: 0.42,
    inclination: -0.12,
    ringColor: "#8B5CF6",
    ringOpacity: 0.18,
  },
  {
    radius: 9.0,
    speed: 0.24,
    size: 0.34,
    color: "#091a13",
    emissive: "#00FF88",
    emissiveIntensity: 0.5,
    metalness: 0.78,
    roughness: 0.5,
    inclination: 0.18,
    ringColor: "#00FF88",
    ringOpacity: 0.14,
  },
  {
    radius: 11.4,
    speed: -0.18,
    size: 0.22,
    color: "#1a1a26",
    emissive: "#E8E8F0",
    emissiveIntensity: 0.35,
    metalness: 0.92,
    roughness: 0.28,
    inclination: 0.08,
    ringColor: "#E8E8F0",
    ringOpacity: 0.1,
  },
  {
    radius: 13.8,
    speed: 0.14,
    size: 0.4,
    color: "#0f0a1c",
    emissive: "#8B5CF6",
    emissiveIntensity: 0.4,
    metalness: 0.85,
    roughness: 0.55,
    inclination: -0.22,
    ringColor: "#8B5CF6",
    ringOpacity: 0.12,
  },
  {
    radius: 16.5,
    speed: -0.09,
    size: 0.3,
    color: "#0c1a1c",
    emissive: "#38BDF8",
    emissiveIntensity: 0.3,
    metalness: 0.88,
    roughness: 0.45,
    inclination: 0.14,
    ringColor: "#38BDF8",
    ringOpacity: 0.1,
  },
];

export interface OrbitalPlanetsProps {
  /** Optional override for orbit speeds (multiplier) */
  speedMultiplier?: number;
}

export function OrbitalPlanets({ speedMultiplier = 1 }: OrbitalPlanetsProps) {
  const pivotRefs = useRef<(Group | null)[]>([]);

  // Phase offsets — randomized once so planets aren't synchronized
  const phases = useMemo(
    () => PLANETS.map(() => Math.random() * Math.PI * 2),
    [],
  );

  useFrame((_, delta) => {
    for (let i = 0; i < pivotRefs.current.length; i++) {
      const pivot = pivotRefs.current[i];
      if (!pivot) continue;
      pivot.rotation.y += delta * PLANETS[i].speed * speedMultiplier;
    }
  });

  return (
    <group>
      {PLANETS.map((p, i) => (
        <group key={i} rotation={[p.inclination, phases[i], 0]}>
          {/* Orbital ring — sits on the inclined plane */}
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[p.radius, 0.012, 8, 192]} />
            <meshBasicMaterial
              color={p.ringColor}
              transparent
              opacity={p.ringOpacity}
              toneMapped={false}
            />
          </mesh>

          {/* Pivot rotates around Y; planet is offset on X */}
          <group
            ref={(el) => {
              pivotRefs.current[i] = el;
            }}
          >
            <mesh position={[p.radius, 0, 0]}>
              <sphereGeometry args={[p.size, 16, 16]} />
              <meshStandardMaterial
                color={p.color}
                emissive={p.emissive}
                emissiveIntensity={p.emissiveIntensity}
                metalness={p.metalness}
                roughness={p.roughness}
              />
            </mesh>
          </group>
        </group>
      ))}
    </group>
  );
}
