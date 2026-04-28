import systemData from "@/content/data/shattered-system.json";

export type SectionId =
  | "about"
  | "projects"
  | "skills"
  | "experience"
  | "certifications"
  | "ctf"
  | "blog"
  | "contact"
  | "resume";

export type MegastructureKind =
  | "shipyard"
  | "lattice"
  | "array"
  | "gate"
  | "spine"
  | "cylinder"
  | "ring"
  | "fleet"
  | "tether";

export interface SectionMapping {
  id: SectionId;
  label: string;
  lore: string;
  anchorId: string;
}

export interface PlanetConfig {
  id: string;
  name: string;
  lore: string;
  sectionId: SectionId;
  orbitRadius: number;
  orbitSpeed: number;
  rotationSpeed: number;
  size: number;
  inclination: number;
  color: string;
  emissive: string;
  status: string;
  scan: string;
}

export interface MoonConfig {
  id: string;
  parentId: string;
  name: string;
  sectionId: SectionId;
  orbitRadius: number;
  orbitSpeed: number;
  rotationSpeed: number;
  size: number;
  color: string;
  emissive: string;
  scan: string;
}

export interface MegastructureConfig {
  id: string;
  name: string;
  sectionId: SectionId;
  kind: MegastructureKind;
  orbitRadius: number;
  orbitSpeed: number;
  rotationSpeed: number;
  color: string;
  emissive: string;
  scan: string;
}

export interface PathwayConfig {
  id: string;
  name: string;
  sectionId: SectionId;
  kind: "beacon-chain" | "hyperlane" | "corridor";
  radius: number;
  arcStart: number;
  arcEnd: number;
  color: string;
  scan: string;
}

export interface ShatteredSystemData {
  name: string;
  subtitle: string;
  palette: Record<string, string>;
  dysonSphere: {
    id: string;
    name: string;
    intactFraction: number;
    destroyedFraction: number;
    scan: string;
  };
  sections: SectionMapping[];
  planets: PlanetConfig[];
  moons: MoonConfig[];
  megastructures: MegastructureConfig[];
  pathways: PathwayConfig[];
}

export const SHATTERED_SYSTEM = systemData as ShatteredSystemData;

export const SECTION_MAPPINGS = SHATTERED_SYSTEM.sections;

export const FOCUSABLE_SYSTEM_NODE_IDS = [
  ...SHATTERED_SYSTEM.planets.map((planet) => planet.id),
  ...SHATTERED_SYSTEM.moons.map((moon) => moon.id),
  ...SHATTERED_SYSTEM.megastructures.map((structure) => structure.id),
  ...SHATTERED_SYSTEM.pathways.map((pathway) => pathway.id),
] as const;

export function sectionForNode(id: string): SectionMapping | undefined {
  const directSection = SECTION_MAPPINGS.find(
    (section) => section.anchorId === id,
  );

  if (directSection) {
    return directSection;
  }

  const node =
    SHATTERED_SYSTEM.planets.find((planet) => planet.id === id) ??
    SHATTERED_SYSTEM.moons.find((moon) => moon.id === id) ??
    SHATTERED_SYSTEM.megastructures.find((structure) => structure.id === id) ??
    SHATTERED_SYSTEM.pathways.find((pathway) => pathway.id === id);

  return node
    ? SECTION_MAPPINGS.find((section) => section.id === node.sectionId)
    : undefined;
}

export function scrollToSection(sectionId: SectionId) {
  if (sectionId === "resume") {
    if (typeof window !== "undefined") {
      window.location.href = "/resume";
    }

    return;
  }

  if (typeof document === "undefined") {
    return;
  }

  document
    .getElementById(sectionId)
    ?.scrollIntoView({ behavior: "smooth", block: "start" });
}
