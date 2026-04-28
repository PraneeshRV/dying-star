import type * as THREE from "three";
import type {
  MegastructureConfig,
  MoonConfig,
  PathwayConfig,
  PlanetConfig,
} from "./shatteredSystem";

export const PATHWAY_POINTS_PER_ARC = 56;
export const PATHWAY_BASE_Y = 1.4;
export const PATHWAY_ARC_HEIGHT = 0.5;

const TWO_PI = Math.PI * 2;
const INCLINATION_Y_SCALE = 0.22;

export function phaseOffsetForId(id: string) {
  let hash = 0;

  for (let index = 0; index < id.length; index++) {
    hash = (hash * 31 + id.charCodeAt(index)) >>> 0;
  }

  return (hash / 0xffffffff) * TWO_PI;
}

export function orbitAngle(
  orbitSpeed: number,
  elapsedTime: number,
  phaseOffset: number,
) {
  return elapsedTime * orbitSpeed + phaseOffset;
}

export function writeOrbitPositionAtAngle(
  target: THREE.Vector3,
  orbitRadius: number,
  angle: number,
  inclination = 0,
) {
  target.set(
    Math.cos(angle) * orbitRadius,
    Math.sin(angle) * Math.sin(inclination) * orbitRadius * INCLINATION_Y_SCALE,
    Math.sin(angle) * Math.cos(inclination) * orbitRadius,
  );
}

export function writeOrbitPosition(
  target: THREE.Vector3,
  orbitRadius: number,
  orbitSpeed: number,
  elapsedTime: number,
  inclination = 0,
  phaseOffset = 0,
) {
  writeOrbitPositionAtAngle(
    target,
    orbitRadius,
    orbitAngle(orbitSpeed, elapsedTime, phaseOffset),
    inclination,
  );
}

export function writePlanetPosition(
  target: THREE.Vector3,
  planet: PlanetConfig,
  elapsedTime: number,
) {
  writeOrbitPosition(
    target,
    planet.orbitRadius,
    planet.orbitSpeed,
    elapsedTime,
    planet.inclination,
    phaseOffsetForId(planet.id),
  );
}

export function writeMoonLocalPosition(
  target: THREE.Vector3,
  moon: MoonConfig,
  parent: PlanetConfig,
  elapsedTime: number,
) {
  writeOrbitPosition(
    target,
    moon.orbitRadius,
    moon.orbitSpeed,
    elapsedTime,
    parent.inclination,
    phaseOffsetForId(moon.id),
  );
}

export function writeMoonWorldPosition(
  target: THREE.Vector3,
  parentTarget: THREE.Vector3,
  moon: MoonConfig,
  parent: PlanetConfig,
  elapsedTime: number,
) {
  writePlanetPosition(parentTarget, parent, elapsedTime);
  writeMoonLocalPosition(target, moon, parent, elapsedTime);
  target.add(parentTarget);
}

export function writeMegastructurePosition(
  target: THREE.Vector3,
  structure: MegastructureConfig,
  elapsedTime: number,
) {
  writeOrbitPosition(
    target,
    structure.orbitRadius,
    structure.orbitSpeed,
    elapsedTime,
    0,
    phaseOffsetForId(structure.id),
  );
}

export function writePathwayPoint(
  target: THREE.Vector3,
  pathway: PathwayConfig,
  t: number,
) {
  const angle = pathway.arcStart + (pathway.arcEnd - pathway.arcStart) * t;

  target.set(
    Math.cos(angle) * pathway.radius,
    PATHWAY_BASE_Y + Math.sin(t * Math.PI) * PATHWAY_ARC_HEIGHT,
    Math.sin(angle) * pathway.radius,
  );
}

export function writePathwayFocusPosition(
  target: THREE.Vector3,
  pathway: PathwayConfig,
) {
  writePathwayPoint(target, pathway, 0.5);
}
