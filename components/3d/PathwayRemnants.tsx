"use client";

import { Line } from "@react-three/drei";
import { useMemo } from "react";
import * as THREE from "three";
import { PATHWAY_POINTS_PER_ARC, writePathwayPoint } from "./orbitMath";
import { SHATTERED_SYSTEM } from "./shatteredSystem";

export function PathwayRemnants() {
  const arcs = useMemo(
    () =>
      SHATTERED_SYSTEM.pathways.map((pathway) => {
        const points: THREE.Vector3[] = [];

        for (let index = 0; index <= PATHWAY_POINTS_PER_ARC; index++) {
          const point = new THREE.Vector3();
          writePathwayPoint(point, pathway, index / PATHWAY_POINTS_PER_ARC);
          points.push(point);
        }

        return {
          id: pathway.id,
          color: pathway.color,
          points,
        };
      }),
    [],
  );

  return (
    <group>
      {arcs.map((arc) => (
        <Line
          key={arc.id}
          color={arc.color}
          dashed
          dashScale={8}
          dashSize={0.42}
          gapSize={0.26}
          lineWidth={1}
          opacity={0.58}
          points={arc.points}
          transparent
        />
      ))}
    </group>
  );
}
