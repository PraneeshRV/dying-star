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
  writeMoonLocalPosition,
  writeOrbitPositionAtAngle,
  writePlanetPosition,
} from "./orbitMath";
import {
  type MoonConfig,
  type PlanetConfig,
  SHATTERED_SYSTEM,
  scrollToSection,
} from "./shatteredSystem";
import { TacticalLabel } from "./TacticalLabel";

export interface OrbitalBodiesProps {
  speedMultiplier?: number;
  renderMoons?: boolean;
}

const PLANET_HIT_RADIUS_MULTIPLIER = 3.2;
const MOON_HIT_RADIUS_MULTIPLIER = 4.8;

export function OrbitalBodies({
  speedMultiplier = 1,
  renderMoons = true,
}: OrbitalBodiesProps) {
  const planetGroupRefs = useRef<(Group | null)[]>([]);
  const planetBodyRefs = useRef<(THREE.Mesh | null)[]>([]);
  const moonGroupRefs = useRef<(Group | null)[]>([]);
  const moonBodyRefs = useRef<(THREE.Mesh | null)[]>([]);
  const moonsByParent = useMemo(() => {
    const map = new Map<string, MoonConfig[]>();

    for (const moon of SHATTERED_SYSTEM.moons) {
      const siblings = map.get(moon.parentId);
      if (siblings) {
        siblings.push(moon);
      } else {
        map.set(moon.parentId, [moon]);
      }
    }

    return map;
  }, []);
  const moonParents = useMemo(
    () =>
      SHATTERED_SYSTEM.moons.map(
        (moon) =>
          SHATTERED_SYSTEM.planets.find(
            (planet) => planet.id === moon.parentId,
          ) ?? null,
      ),
    [],
  );
  const planetOrbitRings = useMemo(
    () =>
      SHATTERED_SYSTEM.planets.map((planet) => ({
        id: planet.id,
        color: planet.emissive,
        points: buildOrbitPoints(planet.orbitRadius, planet.inclination),
      })),
    [],
  );
  const moonOrbitRings = useMemo(() => {
    const map = new Map<string, THREE.Vector3[]>();

    for (const moon of SHATTERED_SYSTEM.moons) {
      const parent = SHATTERED_SYSTEM.planets.find(
        (planet) => planet.id === moon.parentId,
      );
      map.set(
        moon.id,
        buildOrbitPoints(moon.orbitRadius, parent?.inclination ?? 0),
      );
    }

    return map;
  }, []);

  useFrame(({ clock }) => {
    const elapsed = clock.elapsedTime * speedMultiplier;

    for (let index = 0; index < SHATTERED_SYSTEM.planets.length; index++) {
      const planet = SHATTERED_SYSTEM.planets[index];
      const planetGroup = planetGroupRefs.current[index];
      const planetBody = planetBodyRefs.current[index];

      if (planetGroup) {
        writePlanetPosition(planetGroup.position, planet, elapsed);
      }

      if (planetBody) {
        planetBody.rotation.y = elapsed * planet.rotationSpeed;
      }
    }

    if (!renderMoons) {
      return;
    }

    for (let index = 0; index < SHATTERED_SYSTEM.moons.length; index++) {
      const moon = SHATTERED_SYSTEM.moons[index];
      const parent = moonParents[index];
      const moonGroup = moonGroupRefs.current[index];
      const moonBody = moonBodyRefs.current[index];

      if (moonGroup && parent) {
        writeMoonLocalPosition(moonGroup.position, moon, parent, elapsed);
      }

      if (moonBody) {
        moonBody.rotation.y = elapsed * moon.rotationSpeed;
      }
    }
  });

  return (
    <group>
      {planetOrbitRings.map((ring) => (
        <Line
          key={ring.id}
          color={ring.color}
          lineWidth={1}
          opacity={0.11}
          points={ring.points}
          transparent
        />
      ))}

      {SHATTERED_SYSTEM.planets.map((planet, planetIndex) => (
        <group
          key={planet.id}
          ref={(element) => {
            planetGroupRefs.current[planetIndex] = element;
          }}
        >
          <PlanetBody
            planet={planet}
            refSetter={(element) => {
              planetBodyRefs.current[planetIndex] = element;
            }}
          />

          {renderMoons
            ? moonsByParent.get(planet.id)?.map((moon) => {
                const moonIndex = SHATTERED_SYSTEM.moons.indexOf(moon);
                const ringPoints = moonOrbitRings.get(moon.id);

                return (
                  <group key={moon.id}>
                    {ringPoints ? (
                      <Line
                        color={moon.emissive}
                        lineWidth={1}
                        opacity={0.16}
                        points={ringPoints}
                        transparent
                      />
                    ) : null}
                    <group
                      ref={(element) => {
                        moonGroupRefs.current[moonIndex] = element;
                      }}
                    >
                      <MoonBody
                        moon={moon}
                        refSetter={(element) => {
                          moonBodyRefs.current[moonIndex] = element;
                        }}
                      />
                    </group>
                  </group>
                );
              })
            : null}
        </group>
      ))}
    </group>
  );
}

function buildOrbitPoints(orbitRadius: number, inclination: number) {
  const points: THREE.Vector3[] = [];
  const segmentCount = PATHWAY_POINTS_PER_ARC * 2;

  for (let index = 0; index <= segmentCount; index++) {
    const point = new THREE.Vector3();
    writeOrbitPositionAtAngle(
      point,
      orbitRadius,
      (index / segmentCount) * Math.PI * 2,
      inclination,
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

function PlanetBody({
  planet,
  refSetter,
}: {
  planet: PlanetConfig;
  refSetter: (element: THREE.Mesh | null) => void;
}) {
  const [hovered, setHovered] = useState(false);
  const setFocusedSystemNodeId = useGlobalStore(
    (state) => state.setFocusedSystemNodeId,
  );
  useCursorHover(hovered);

  const handleClick = useCallback(
    (event: ThreeEvent<MouseEvent>) => {
      event.stopPropagation();
      setFocusedSystemNodeId(planet.id);
      scrollToSection(planet.sectionId);
    },
    [planet.id, planet.sectionId, setFocusedSystemNodeId],
  );

  return (
    <group>
      <mesh ref={refSetter}>
        <sphereGeometry args={[planet.size, 24, 18]} />
        <meshStandardMaterial
          color={planet.color}
          emissive={planet.emissive}
          emissiveIntensity={hovered ? 0.82 : 0.42}
          metalness={0.72}
          roughness={0.46}
        />
      </mesh>
      <mesh
        onClick={handleClick}
        onPointerOut={() => {
          setHovered(false);
        }}
        onPointerOver={(event) => {
          event.stopPropagation();
          setHovered(true);
        }}
      >
        <sphereGeometry
          args={[planet.size * PLANET_HIT_RADIUS_MULTIPLIER, 16, 12]}
        />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
      <TacticalLabel
        color={planet.emissive}
        subtitle={planet.scan}
        title={planet.name}
        visible={hovered}
      />
    </group>
  );
}

function MoonBody({
  moon,
  refSetter,
}: {
  moon: MoonConfig;
  refSetter: (element: THREE.Mesh | null) => void;
}) {
  const [hovered, setHovered] = useState(false);
  const setFocusedSystemNodeId = useGlobalStore(
    (state) => state.setFocusedSystemNodeId,
  );
  useCursorHover(hovered);

  const handleClick = useCallback(
    (event: ThreeEvent<MouseEvent>) => {
      event.stopPropagation();
      setFocusedSystemNodeId(moon.id);
      scrollToSection(moon.sectionId);
    },
    [moon.id, moon.sectionId, setFocusedSystemNodeId],
  );

  return (
    <group>
      <mesh ref={refSetter}>
        <sphereGeometry args={[moon.size, 14, 10]} />
        <meshStandardMaterial
          color={moon.color}
          emissive={moon.emissive}
          emissiveIntensity={hovered ? 0.9 : 0.48}
          metalness={0.68}
          roughness={0.52}
        />
      </mesh>
      <mesh
        onClick={handleClick}
        onPointerOut={() => {
          setHovered(false);
        }}
        onPointerOver={(event) => {
          event.stopPropagation();
          setHovered(true);
        }}
      >
        <sphereGeometry
          args={[moon.size * MOON_HIT_RADIUS_MULTIPLIER, 12, 8]}
        />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
      <TacticalLabel
        color={moon.emissive}
        subtitle={moon.scan}
        title={moon.name}
        visible={hovered}
      />
    </group>
  );
}
