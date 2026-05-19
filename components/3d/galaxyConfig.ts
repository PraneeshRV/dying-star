import galaxyData from "@/content/data/black-hole-galaxy.json";
import type { SectionId } from "./shatteredSystem";

export type GalaxySectionId = SectionId | "home";
export type GalaxySystemId = "identity" | "build" | "proof" | "transmission";
export type GalaxyDetailMode = "full" | "impostor" | "fallback";

export interface BlackHoleCenterConfig {
  id: "null-archive";
  kind: "black-hole";
  name: string;
  plainLabel: string;
  loreLabel: string;
  description: string;
  fallback: string;
}

export interface GalaxyOrbitConfig {
  radius: number;
  speed: number;
  inclination: number;
  phase: number;
}

export interface GalaxySystemPalette {
  primary: string;
  accent: string;
  warning: string;
}

export interface GalaxySystemConfig {
  id: GalaxySystemId;
  name: string;
  plainLabel: string;
  loreLabel: string;
  purpose: string;
  center: [number, number, number];
  orbit: GalaxyOrbitConfig;
  detailMode: GalaxyDetailMode;
  palette: GalaxySystemPalette;
  sectionIds: GalaxySectionId[];
  primaryNodeIds: string[];
}

export interface InterSystemRouteConfig {
  id: string;
  fromSystemId: GalaxySystemId;
  toSystemId: GalaxySystemId;
  kind: "hyperlane-scar" | "signal-corridor" | "distress-signal" | "return-arc";
  color: string;
}

export interface GalaxyConfig {
  id: "black-hole-galaxy";
  name: string;
  center: BlackHoleCenterConfig;
  systems: GalaxySystemConfig[];
  routes: InterSystemRouteConfig[];
}

export type ScopedSystemNodeId = `${GalaxySystemId}:${string}`;

export const GALAXY_CONFIG = galaxyData as GalaxyConfig;

export function makeScopedNodeId(
  systemId: GalaxySystemId,
  nodeId: string,
): ScopedSystemNodeId {
  return `${systemId}:${nodeId}`;
}

export function parseScopedNodeId(
  scopedId: string,
): { systemId: GalaxySystemId; nodeId: string } | null {
  const [systemId, ...nodeParts] = scopedId.split(":");
  const nodeId = nodeParts.join(":");

  if (!isGalaxySystemId(systemId) || nodeId.length === 0) {
    return null;
  }

  return { systemId, nodeId };
}

export function isGalaxySystemId(value: string): value is GalaxySystemId {
  return GALAXY_CONFIG.systems.some((system) => system.id === value);
}

export function findGalaxySystemForSection(
  sectionId: GalaxySectionId,
): GalaxySystemConfig | undefined {
  return GALAXY_CONFIG.systems.find((system) =>
    system.sectionIds.includes(sectionId),
  );
}

export function allGalaxySectionIds() {
  return GALAXY_CONFIG.systems.flatMap((system) => system.sectionIds);
}
