import sandboxWorldData from "@/content/data/sandbox-world.json";

export type SandboxControlMode = "guided" | "freefly";
export type SandboxSectionId =
  | "about"
  | "projects"
  | "skills"
  | "experience"
  | "certifications"
  | "ctf"
  | "blog"
  | "contact"
  | "resume";
export type SandboxObjectKind =
  | "relay"
  | "project"
  | "ctf"
  | "skills"
  | "resume"
  | "contact";
export type SandboxObjectStatus =
  | "active"
  | "degraded"
  | "online"
  | "quarantined"
  | "readable"
  | "unstable";
export type SandboxActionKind = "section" | "route" | "external";
export type SandboxAssetType = "procedural" | "glb";

export interface SandboxAction {
  label: string;
  href: string;
  kind: SandboxActionKind;
}

export interface SandboxAssetReference {
  type: SandboxAssetType;
  runtimePath: string;
  fallback: string;
}

export interface SandboxObject {
  id: string;
  kind: SandboxObjectKind;
  zoneId: string;
  name: string;
  loreName: string;
  status: SandboxObjectStatus;
  sectionId: SandboxSectionId;
  position: [number, number, number];
  scale: number;
  color: string;
  scanText: string;
  proofText: string;
  actions: SandboxAction[];
  asset: SandboxAssetReference;
}

export interface SandboxObjective {
  id: string;
  label: string;
  description: string;
  objectIds: string[];
}

export interface SandboxZone {
  id: string;
  name: string;
  loreName: string;
  description: string;
}

export interface SandboxWorldData {
  version: 1;
  id: "orbital-ruins-sandbox";
  name: string;
  route: "/sandbox";
  entry: {
    mode: SandboxControlMode;
    focusObjectId: string;
    introObjectiveId: string;
  };
  controls: {
    defaultMode: SandboxControlMode;
    freeFlightEnabled: boolean;
    mobileFreeFlightEnabled: boolean;
  };
  palette: Record<string, string>;
  zones: SandboxZone[];
  objectives: SandboxObjective[];
  objects: SandboxObject[];
}

export const SANDBOX_WORLD = sandboxWorldData as unknown as SandboxWorldData;
export const DEFAULT_SANDBOX_OBJECT_ID = SANDBOX_WORLD.entry.focusObjectId;

export function findSandboxObject(
  objectId: string | null,
): SandboxObject | undefined {
  if (!objectId) {
    return undefined;
  }

  return SANDBOX_WORLD.objects.find((object) => object.id === objectId);
}

export function sandboxObjectsForObjective(objectiveId: string) {
  const objective = SANDBOX_WORLD.objectives.find(
    (entry) => entry.id === objectiveId,
  );

  if (!objective) {
    return [];
  }

  return SANDBOX_WORLD.objects.filter((object) =>
    objective.objectIds.includes(object.id),
  );
}

export function isExternalSandboxAction(action: SandboxAction) {
  return action.kind === "external" || /^https?:\/\//i.test(action.href);
}
