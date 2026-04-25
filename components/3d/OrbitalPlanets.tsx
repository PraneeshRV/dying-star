"use client";

/* ═══════════════════════════════════════════════════
   OrbitalPlanets — five named navigational worlds
   ─────────────────────────────────────────────────
   - Each planet is a section anchor (CTF, Projects, etc.)
   - Hover shows a label via drei <Html>
   - Click scrolls to the matching section
   - Pivot group pattern for clean orbital rotation
   - All scratch values mutated in place — no allocs
   ═══════════════════════════════════════════════════ */

import { Html } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useCallback, useMemo, useRef, useState } from "react";
import type * as THREE from "three";
import type { Group } from "three";

interface PlanetConfig {
  name: string;
  section: string;
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
    name: "TERRA-HACK",
    section: "#ctf",
    radius: 5.5,
    speed: 0.42,
    size: 0.22,
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
    name: "NEBULA-BUILD",
    section: "#projects",
    radius: 7.2,
    speed: -0.31,
    size: 0.3,
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
    name: "CIPHER-WORLD",
    section: "#skills",
    radius: 9.0,
    speed: 0.24,
    size: 0.38,
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
    name: "ECHO-9",
    section: "#experience",
    radius: 11.4,
    speed: -0.18,
    size: 0.26,
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
    name: "ARCH-PRIME",
    section: "#about",
    radius: 13.8,
    speed: 0.14,
    size: 0.44,
    color: "#0f0a1c",
    emissive: "#8B5CF6",
    emissiveIntensity: 0.4,
    metalness: 0.85,
    roughness: 0.55,
    inclination: -0.22,
    ringColor: "#8B5CF6",
    ringOpacity: 0.12,
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
        <group key={p.name} rotation={[p.inclination, phases[i], 0]}>
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
            <Planet config={p} />
          </group>
        </group>
      ))}
    </group>
  );
}

/* ────── Individual Planet with hover/click ────── */

function Planet({ config: p }: { config: PlanetConfig }) {
  const [hovered, setHovered] = useState(false);
  const meshRef = useRef<THREE.Mesh>(null);

  const handleClick = useCallback(() => {
    document.querySelector(p.section)?.scrollIntoView({ behavior: "smooth" });
  }, [p.section]);

  const handlePointerOver = useCallback(() => {
    setHovered(true);
    document.body.style.cursor = "pointer";
  }, []);

  const handlePointerOut = useCallback(() => {
    setHovered(false);
    document.body.style.cursor = "";
  }, []);

  // Animate emissive intensity on hover
  useFrame(() => {
    if (!meshRef.current) return;
    const mat = meshRef.current.material as THREE.MeshStandardMaterial;
    const target = hovered ? p.emissiveIntensity * 2.5 : p.emissiveIntensity;
    mat.emissiveIntensity += (target - mat.emissiveIntensity) * 0.08;
  });

  return (
    <mesh
      ref={meshRef}
      position={[p.radius, 0, 0]}
      onClick={handleClick}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
    >
      <sphereGeometry args={[p.size, 16, 16]} />
      <meshStandardMaterial
        color={p.color}
        emissive={p.emissive}
        emissiveIntensity={p.emissiveIntensity}
        metalness={p.metalness}
        roughness={p.roughness}
      />

      {/* Hover label — rendered in DOM, positioned in 3D space */}
      {hovered && (
        <Html center distanceFactor={10} style={{ pointerEvents: "none" }}>
          <div
            style={{
              background: "rgba(0, 0, 5, 0.85)",
              border: `1px solid ${p.emissive}`,
              borderRadius: "4px",
              padding: "4px 10px",
              fontFamily: "var(--font-jetbrains-mono), monospace",
              fontSize: "11px",
              color: p.emissive,
              whiteSpace: "nowrap",
              textTransform: "uppercase",
              letterSpacing: "0.15em",
              boxShadow: `0 0 12px ${p.emissive}40`,
            }}
          >
            {p.name}
          </div>
        </Html>
      )}
    </mesh>
  );
}
