# Hybrid Sandbox Route Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build an opt-in `/sandbox` route with orbital ruins exploration, guided orbit plus optional free flight, scanner/object details, light mission ops, and a professional homepage entry point.

**Architecture:** Keep `/` as the canonical portfolio and add `/sandbox` as a separate App Router route. Use a thin Server Component page that mounts a focused client island; keep sandbox state local to the route instead of reusing the global homepage camera/focus state. Split data, HUD, scene, controls, and verification so multiple agents can work in parallel after the shared data contract lands.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Tailwind v4/global design tokens, CSS Modules, React Three Fiber, Three.js, Drei, `@pmndrs/detect-gpu`, existing Node verifier scripts, production browser smoke against `npm run start`.

---

## Parallel Agent Strategy

Run this as waves, not as one uncontrolled swarm.

**Wave 1, blocking foundation:** Task 1 only. It defines the shared JSON contract, typed adapter, and verifier.

**Wave 2, parallel after Task 1:** Tasks 2, 3, 4, and 5 can run in parallel because their primary write sets are disjoint:

- Task 2 owns `app/sandbox/page.tsx` and the base `components/sandbox/SandboxExperience.tsx`.
- Task 3 owns HUD files under `components/sandbox/`.
- Task 4 owns 3D sandbox scene files under `components/3d/sandbox/`.
- Task 5 owns the homepage CTA in `app/page.tsx`.

**Wave 3, integration:** Task 6 wires the route shell, HUD, and canvas together.

**Wave 4, verification:** Task 7 runs the full gates and browser smoke.

Do not dispatch two implementation agents with overlapping write scopes. Each worker must know that other agents may be editing the repo and must not revert unrelated changes.

## File Structure

Create:

- `content/data/sandbox-world.json`: static sandbox mission/object contract.
- `components/sandbox/sandboxWorld.ts`: typed adapter, selectors, and section/link helpers for sandbox data.
- `components/sandbox/SandboxExperience.tsx`: client route coordinator for selected object, scanner, control mode, objective state, and discovery state.
- `components/sandbox/SandboxHUD.tsx`: tactical console, mission ops, object list, object details, and route controls.
- `components/sandbox/SandboxHUD.module.css`: fixed full-screen HUD layout, responsive panels, scan/object states.
- `components/3d/sandbox/SandboxCanvas.tsx`: WebGL gate, GPU scaling, canvas shell, and scene composition for `/sandbox`.
- `components/3d/sandbox/SandboxCamera.tsx`: guided orbit and optional free-flight controls scoped to sandbox state.
- `components/3d/sandbox/SandboxObjects.tsx`: procedural Derelict Relay, artifact markers, ruined panels, hit targets, and labels.
- `components/3d/sandbox/SandboxScannerPulse.tsx`: visual scanner pulse tied to client state.
- `components/3d/sandbox/index.ts`: sandbox 3D barrel exports.
- `scripts/verify-sandbox-world.mjs`: static contract verifier.
- `app/sandbox/page.tsx`: App Router route for `/sandbox`.

Modify:

- `package.json`: include sandbox verifier in `verify:system`.
- `app/page.tsx`: add a restrained `Enter Sandbox` route CTA without demoting existing recruiter CTAs.

Do not modify:

- `components/3d/SpaceCanvas.tsx` for route-specific sandbox behavior.
- `components/3d/SystemCamera.tsx` for sandbox free flight.
- `components/ui/FloatingNav.tsx` unless a real homepage `#sandbox` section is added. This plan uses a route link, not an anchor.
- `stores/globalStore.ts` for sandbox per-frame or mission state.

## Task 1: Sandbox Data Contract And Verifier

**Files:**
- Create: `content/data/sandbox-world.json`
- Create: `components/sandbox/sandboxWorld.ts`
- Create: `scripts/verify-sandbox-world.mjs`
- Modify: `package.json`

- [ ] **Step 1: Create the sandbox world JSON contract**

Create `content/data/sandbox-world.json` with this structure:

```json
{
  "version": 1,
  "id": "orbital-ruins-sandbox",
  "name": "Orbital Ruins Sandbox",
  "route": "/sandbox",
  "entry": {
    "mode": "guided",
    "focusObjectId": "derelict-relay",
    "introObjectiveId": "scan-relay"
  },
  "controls": {
    "defaultMode": "guided",
    "freeFlightEnabled": true,
    "mobileFreeFlightEnabled": false
  },
  "palette": {
    "primary": "#58f3ff",
    "accent": "#6fa8ff",
    "warning": "#ff7a45",
    "danger": "#d94a4a",
    "metal": "#b8894d"
  },
  "zones": [
    {
      "id": "relay-field",
      "name": "Relay Field",
      "loreName": "Orison Wreck Belt",
      "description": "A damaged signal field orbiting the shattered star, still broadcasting portfolio proof fragments."
    }
  ],
  "objectives": [
    {
      "id": "scan-relay",
      "label": "Scan the Derelict Relay",
      "description": "Run the scanner on the central relay to restore the first signal.",
      "objectIds": ["derelict-relay"]
    },
    {
      "id": "inspect-proof",
      "label": "Inspect three proof artifacts",
      "description": "Open details for three portfolio artifacts in the ruins field.",
      "objectIds": [
        "redcalibur-artifact",
        "ctf-breach-vault",
        "skills-array"
      ]
    },
    {
      "id": "open-archive-route",
      "label": "Open a recovered archive route",
      "description": "Use one object detail action to jump to resume, contact, or a project proof link.",
      "objectIds": ["resume-vault", "contact-beacon", "redcalibur-artifact"]
    }
  ],
  "objects": [
    {
      "id": "derelict-relay",
      "kind": "relay",
      "zoneId": "relay-field",
      "name": "Derelict Relay",
      "loreName": "Orison Relay Husk",
      "status": "unstable",
      "sectionId": "about",
      "position": [0, 0.8, -2.4],
      "scale": 1.35,
      "color": "#58f3ff",
      "scanText": "Primary relay signal recovered. Operator profile, contact vector, and archive route map are readable.",
      "proofText": "Praneesh R V is a cybersecurity undergraduate focused on agentic AI red teaming, VAPT, CTF infrastructure, and Linux/cloud security workflows.",
      "actions": [
        {
          "label": "Read operator record",
          "href": "/#about",
          "kind": "section"
        },
        {
          "label": "Open contact channel",
          "href": "/#contact",
          "kind": "section"
        }
      ],
      "asset": {
        "type": "procedural",
        "runtimePath": "procedural:derelict-relay-v1",
        "fallback": "Derelict relay procedural lattice"
      }
    },
    {
      "id": "redcalibur-artifact",
      "kind": "project",
      "zoneId": "relay-field",
      "name": "RedCalibur Artifact",
      "loreName": "RedCalibur Drydock Fragment",
      "status": "active",
      "sectionId": "projects",
      "position": [-4.2, -0.6, 1.8],
      "scale": 0.7,
      "color": "#ff7a45",
      "scanText": "Recovered project shard: AI-assisted VAPT workflow, FastAPI backend, Next.js UI, Python tooling, and report artifacts.",
      "proofText": "RedCalibur is a flagship AI-assisted red teaming toolkit for authorized security testing.",
      "actions": [
        {
          "label": "View project section",
          "href": "/#projects",
          "kind": "section"
        },
        {
          "label": "Open GitHub",
          "href": "https://github.com/PraneeshRV/RedCalibur",
          "kind": "external"
        }
      ],
      "asset": {
        "type": "procedural",
        "runtimePath": "procedural:project-artifact-v1",
        "fallback": "Angular drydock shard"
      }
    },
    {
      "id": "ctf-breach-vault",
      "kind": "ctf",
      "zoneId": "relay-field",
      "name": "CTF Breach Vault",
      "loreName": "Kharon Redoubt Cache",
      "status": "quarantined",
      "sectionId": "ctf",
      "position": [4.8, -0.9, 2.1],
      "scale": 0.74,
      "color": "#d94a4a",
      "scanText": "Safe challenge telemetry only. No real secrets. CTF infrastructure and competition proof fragments are visible.",
      "proofText": "CTF proof includes Team Hunter competition work, L3m0nCTF infrastructure, and agentic AI security challenge building.",
      "actions": [
        {
          "label": "View CTF archive",
          "href": "/#ctf",
          "kind": "section"
        }
      ],
      "asset": {
        "type": "procedural",
        "runtimePath": "procedural:ctf-vault-v1",
        "fallback": "Quarantine vault shard"
      }
    },
    {
      "id": "skills-array",
      "kind": "skills",
      "zoneId": "relay-field",
      "name": "Skills Array",
      "loreName": "Mnemosyne Skill Matrix",
      "status": "degraded",
      "sectionId": "skills",
      "position": [-2.9, 1.2, 4.2],
      "scale": 0.84,
      "color": "#6fa8ff",
      "scanText": "Skill matrix resolves security, development, infrastructure, and tooling domains.",
      "proofText": "Core skills span AI red teaming, VAPT, web exploitation, OSINT, digital forensics, Docker, Linux, Azure, Next.js, and Python.",
      "actions": [
        {
          "label": "View skills matrix",
          "href": "/#skills",
          "kind": "section"
        }
      ],
      "asset": {
        "type": "procedural",
        "runtimePath": "procedural:skills-array-v1",
        "fallback": "Cold skill-array lattice"
      }
    },
    {
      "id": "resume-vault",
      "kind": "resume",
      "zoneId": "relay-field",
      "name": "Resume Vault",
      "loreName": "Recovered Dossier Vault",
      "status": "readable",
      "sectionId": "resume",
      "position": [2.7, 1.1, -4.2],
      "scale": 0.78,
      "color": "#c7d0d8",
      "scanText": "Dossier route stable. Static PDF and resume route are available.",
      "proofText": "The resume route exposes the static dossier and direct PDF download.",
      "actions": [
        {
          "label": "Open resume",
          "href": "/resume",
          "kind": "route"
        }
      ],
      "asset": {
        "type": "procedural",
        "runtimePath": "procedural:resume-vault-v1",
        "fallback": "Dossier vault primitive"
      }
    },
    {
      "id": "contact-beacon",
      "kind": "contact",
      "zoneId": "relay-field",
      "name": "Contact Beacon",
      "loreName": "Long-range Comms Beacon",
      "status": "online",
      "sectionId": "contact",
      "position": [0.2, -1.25, 5.4],
      "scale": 0.68,
      "color": "#b8894d",
      "scanText": "Comms beacon can route visitors to email, GitHub, LinkedIn, and collaboration paths.",
      "proofText": "Contact remains available through the homepage contact section and external professional links.",
      "actions": [
        {
          "label": "Open contact section",
          "href": "/#contact",
          "kind": "section"
        }
      ],
      "asset": {
        "type": "procedural",
        "runtimePath": "procedural:contact-beacon-v1",
        "fallback": "Gold comms beacon primitive"
      }
    }
  ]
}
```

- [ ] **Step 2: Add TypeScript adapter and selectors**

Create `components/sandbox/sandboxWorld.ts`:

```ts
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

export const SANDBOX_WORLD = sandboxWorldData as SandboxWorldData;
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
```

- [ ] **Step 3: Add a static verifier**

Create `scripts/verify-sandbox-world.mjs` with the same fail-fast style used by existing verifiers:

```js
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const sandboxPath = join(root, "content/data/sandbox-world.json");
const hexColorPattern = /^#[0-9a-fA-F]{6}$/;
const sectionIds = new Set([
  "about",
  "projects",
  "skills",
  "experience",
  "certifications",
  "ctf",
  "blog",
  "contact",
  "resume",
]);
const actionKinds = new Set(["section", "route", "external"]);
const objectKinds = new Set([
  "relay",
  "project",
  "ctf",
  "skills",
  "resume",
  "contact",
]);
const statuses = new Set([
  "active",
  "degraded",
  "online",
  "quarantined",
  "readable",
  "unstable",
]);

function fail(message) {
  console.error(`sandbox-world invalid: ${message}`);
  process.exit(1);
}

function assert(condition, message) {
  if (!condition) {
    fail(message);
  }
}

function assertObject(value, label) {
  assert(
    value !== null && typeof value === "object" && !Array.isArray(value),
    `${label} must be an object`,
  );
}

function assertArray(value, label) {
  assert(Array.isArray(value), `${label} must be an array`);
}

function assertString(value, label) {
  assert(
    typeof value === "string" && value.length > 0,
    `${label} must be a non-empty string`,
  );
}

function assertNumber(value, label) {
  assert(
    typeof value === "number" && Number.isFinite(value),
    `${label} must be a finite number`,
  );
}

function assertHexColor(value, label) {
  assertString(value, label);
  assert(hexColorPattern.test(value), `${label} must be a #RRGGBB hex color`);
}

function assertVector3(value, label) {
  assertArray(value, label);
  assert(value.length === 3, `${label} must contain three values`);
  value.forEach((entry, index) => {
    assertNumber(entry, `${label}[${index}]`);
  });
}

function readJson(path, label) {
  assert(existsSync(path), `${label} file is missing`);
  return JSON.parse(readFileSync(path, "utf8"));
}

const world = readJson(sandboxPath, "sandbox-world");

assertObject(world, "world");
assert(world.version === 1, "world version must be 1");
assert(world.id === "orbital-ruins-sandbox", "world id mismatch");
assert(world.route === "/sandbox", "world route must be /sandbox");
assertObject(world.entry, "entry");
assert(world.entry.mode === "guided", "entry mode must be guided");
assertString(world.entry.focusObjectId, "entry focusObjectId");
assertString(world.entry.introObjectiveId, "entry introObjectiveId");
assertObject(world.controls, "controls");
assert(world.controls.defaultMode === "guided", "defaultMode must be guided");
assert(world.controls.freeFlightEnabled === true, "free flight must be enabled");
assertObject(world.palette, "palette");
assertArray(world.zones, "zones");
assertArray(world.objectives, "objectives");
assertArray(world.objects, "objects");

for (const [name, color] of Object.entries(world.palette)) {
  assertHexColor(color, `palette ${name}`);
}

assert(world.zones.length >= 1, "at least one zone is required");
assert(world.objectives.length >= 3, "at least three objectives are required");
assert(world.objects.length >= 6, "at least six objects are required");

const zoneIds = new Set();
for (const zone of world.zones) {
  assertObject(zone, "zone");
  assertString(zone.id, "zone id");
  assertString(zone.name, `zone ${zone.id} name`);
  assertString(zone.loreName, `zone ${zone.id} loreName`);
  assertString(zone.description, `zone ${zone.id} description`);
  assert(!zoneIds.has(zone.id), `duplicate zone id ${zone.id}`);
  zoneIds.add(zone.id);
}

const objectIds = new Set();
for (const object of world.objects) {
  assertObject(object, "object");
  assertString(object.id, "object id");
  assert(!objectIds.has(object.id), `duplicate object id ${object.id}`);
  objectIds.add(object.id);
  assert(objectKinds.has(object.kind), `object ${object.id} kind is invalid`);
  assert(zoneIds.has(object.zoneId), `object ${object.id} zone is invalid`);
  assertString(object.name, `object ${object.id} name`);
  assertString(object.loreName, `object ${object.id} loreName`);
  assert(statuses.has(object.status), `object ${object.id} status is invalid`);
  assert(
    sectionIds.has(object.sectionId),
    `object ${object.id} sectionId is invalid`,
  );
  assertVector3(object.position, `object ${object.id} position`);
  assertNumber(object.scale, `object ${object.id} scale`);
  assert(object.scale > 0, `object ${object.id} scale must be positive`);
  assertHexColor(object.color, `object ${object.id} color`);
  assertString(object.scanText, `object ${object.id} scanText`);
  assertString(object.proofText, `object ${object.id} proofText`);
  assertArray(object.actions, `object ${object.id} actions`);
  assert(object.actions.length >= 1, `object ${object.id} needs an action`);
  assertObject(object.asset, `object ${object.id} asset`);
  assertString(object.asset.type, `object ${object.id} asset type`);
  assert(
    ["procedural", "glb"].includes(object.asset.type),
    `object ${object.id} asset type is invalid`,
  );
  assertString(object.asset.runtimePath, `object ${object.id} runtimePath`);
  assertString(object.asset.fallback, `object ${object.id} fallback`);

  for (const action of object.actions) {
    assertObject(action, `object ${object.id} action`);
    assertString(action.label, `object ${object.id} action label`);
    assertString(action.href, `object ${object.id} action href`);
    assert(
      actionKinds.has(action.kind),
      `object ${object.id} action kind is invalid`,
    );
    if (action.kind === "section") {
      assert(action.href.startsWith("/#"), `section action must use /# anchor`);
    }
    if (action.kind === "route") {
      assert(action.href.startsWith("/"), `route action must use local path`);
    }
    if (action.kind === "external") {
      assert(action.href.startsWith("https://"), `external action must use https`);
    }
  }
}

assert(
  objectIds.has(world.entry.focusObjectId),
  "entry focusObjectId must point to an object",
);

const objectiveIds = new Set();
for (const objective of world.objectives) {
  assertObject(objective, "objective");
  assertString(objective.id, "objective id");
  assert(!objectiveIds.has(objective.id), `duplicate objective ${objective.id}`);
  objectiveIds.add(objective.id);
  assertString(objective.label, `objective ${objective.id} label`);
  assertString(objective.description, `objective ${objective.id} description`);
  assertArray(objective.objectIds, `objective ${objective.id} objectIds`);
  assert(objective.objectIds.length >= 1, `objective ${objective.id} needs objects`);
  for (const objectId of objective.objectIds) {
    assert(objectIds.has(objectId), `objective ${objective.id} has missing object ${objectId}`);
  }
}

assert(
  objectiveIds.has(world.entry.introObjectiveId),
  "entry introObjectiveId must point to an objective",
);

console.log(
  `sandbox-world ok: ${world.objects.length} objects, ${world.objectives.length} objectives`,
);
```

- [ ] **Step 4: Wire verifier into system verification**

Modify `package.json` so `verify:system` runs the sandbox verifier after existing scene and asset checks:

```json
"verify:system": "node scripts/verify-shattered-system.mjs && node scripts/verify-space-realism.mjs && node scripts/verify-galaxy-contract.mjs && node scripts/verify-space-assets.mjs && node scripts/verify-sandbox-world.mjs"
```

- [ ] **Step 5: Run the new verifier**

Run:

```bash
npm run verify:system
```

Expected:

```text
sandbox-world ok: 6 objects, 3 objectives
```

The earlier existing verifier messages should also pass.

- [ ] **Step 6: Commit Task 1**

```bash
git add -f content/data/sandbox-world.json components/sandbox/sandboxWorld.ts scripts/verify-sandbox-world.mjs package.json
git commit -m "feat: add sandbox world contract"
```

## Task 2: Sandbox Route And Base Experience Shell

**Files:**
- Create: `app/sandbox/page.tsx`
- Create: `components/sandbox/SandboxExperience.tsx`

- [ ] **Step 1: Create the App Router page**

Create `app/sandbox/page.tsx` as a Server Component:

```tsx
import type { Metadata } from "next";
import { SandboxExperience } from "@/components/sandbox/SandboxExperience";
import { SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: `Orbital Ruins Sandbox | ${SITE_NAME}`,
  description:
    "Explore Praneesh R V's cybersecurity portfolio as an opt-in 3D orbital ruins sandbox with scanner-driven proof artifacts.",
};

export default function SandboxPage() {
  return (
    <main className="min-h-dvh bg-void text-text-primary">
      <SandboxExperience />
    </main>
  );
}
```

- [ ] **Step 2: Create a compiling base client shell**

Create `components/sandbox/SandboxExperience.tsx`:

```tsx
"use client";

import { useMemo, useState } from "react";
import {
  DEFAULT_SANDBOX_OBJECT_ID,
  findSandboxObject,
  SANDBOX_WORLD,
  type SandboxControlMode,
} from "@/components/sandbox/sandboxWorld";

export function SandboxExperience() {
  const [selectedObjectId, setSelectedObjectId] = useState(
    DEFAULT_SANDBOX_OBJECT_ID,
  );
  const [scannerActive, setScannerActive] = useState(false);
  const [controlMode, setControlMode] = useState<SandboxControlMode>("guided");
  const [discoveredObjectIds, setDiscoveredObjectIds] = useState<string[]>([
    DEFAULT_SANDBOX_OBJECT_ID,
  ]);
  const selectedObject = useMemo(
    () => findSandboxObject(selectedObjectId) ?? SANDBOX_WORLD.objects[0],
    [selectedObjectId],
  );

  const handleSelectObject = (objectId: string) => {
    setSelectedObjectId(objectId);
    setDiscoveredObjectIds((current) =>
      current.includes(objectId) ? current : [...current, objectId],
    );
  };

  return (
    <section
      aria-labelledby="sandbox-title"
      className="relative isolate min-h-dvh overflow-hidden bg-void"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(88,243,255,0.16),transparent_32%),linear-gradient(180deg,#030406_0%,#07111a_56%,#030406_100%)]" />
      <div className="relative z-10 grid min-h-dvh gap-6 p-6 lg:grid-cols-[minmax(0,1fr)_24rem]">
        <div className="flex min-h-[46dvh] items-center justify-center rounded border border-cherenkov/20 bg-surface/50 p-6 text-center">
          <div>
            <p className="font-[family-name:var(--font-jetbrains-mono)] text-xs uppercase tracking-[0.28em] text-cherenkov">
              /sandbox/orbital-ruins
            </p>
            <h1
              id="sandbox-title"
              className="mt-3 font-[family-name:var(--font-orbitron)] text-3xl font-bold uppercase tracking-wider text-text-primary sm:text-5xl"
            >
              {SANDBOX_WORLD.name}
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-text-secondary sm:text-base">
              Guided orbit online. Scanner and tactical console are attached to
              the Derelict Relay.
            </p>
          </div>
        </div>

        <aside className="glass-terminal flex flex-col gap-4 p-4">
          <div>
            <p className="font-[family-name:var(--font-jetbrains-mono)] text-xs uppercase tracking-[0.24em] text-cherenkov">
              Tactical Console
            </p>
            <h2 className="mt-2 font-[family-name:var(--font-orbitron)] text-xl uppercase tracking-wider">
              {selectedObject.name}
            </h2>
            <p className="mt-2 text-sm text-text-secondary">
              {scannerActive ? selectedObject.scanText : selectedObject.proofText}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setScannerActive((value) => !value)}
              className="glass-panel px-3 py-2 font-[family-name:var(--font-jetbrains-mono)] text-xs uppercase tracking-widest text-cherenkov"
            >
              {scannerActive ? "Scanner active" : "Run scanner"}
            </button>
            <button
              type="button"
              onClick={() =>
                setControlMode((mode) =>
                  mode === "guided" ? "freefly" : "guided",
                )
              }
              className="glass-panel px-3 py-2 font-[family-name:var(--font-jetbrains-mono)] text-xs uppercase tracking-widest text-purple-hot"
            >
              {controlMode === "guided" ? "Enable free flight" : "Guided orbit"}
            </button>
          </div>

          <div className="grid gap-2">
            {SANDBOX_WORLD.objects.map((object) => (
              <button
                key={object.id}
                type="button"
                onClick={() => handleSelectObject(object.id)}
                className="border border-white/10 bg-white/[0.03] px-3 py-2 text-left text-sm text-text-secondary transition hover:border-cherenkov/40 hover:text-text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-cherenkov"
              >
                <span className="block font-[family-name:var(--font-jetbrains-mono)] text-xs uppercase tracking-[0.18em] text-text-dim">
                  {discoveredObjectIds.includes(object.id)
                    ? "discovered"
                    : "unscanned"}
                </span>
                {object.name}
              </button>
            ))}
          </div>

          <a
            href="/"
            className="mt-auto font-[family-name:var(--font-jetbrains-mono)] text-xs uppercase tracking-[0.2em] text-cherenkov underline-offset-4 hover:underline"
          >
            Return to archive
          </a>
        </aside>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Run typecheck for the shell**

Run:

```bash
npx tsc --noEmit
```

Expected: no TypeScript errors.

- [ ] **Step 4: Commit Task 2**

```bash
git add app/sandbox/page.tsx components/sandbox/SandboxExperience.tsx
git commit -m "feat: add sandbox route shell"
```

## Task 3: Tactical Console And Mission Ops HUD

**Files:**
- Create: `components/sandbox/SandboxHUD.tsx`
- Create: `components/sandbox/SandboxHUD.module.css`
- Modify: `components/sandbox/SandboxExperience.tsx`

- [ ] **Step 1: Create the HUD component contract**

Create `components/sandbox/SandboxHUD.tsx`:

```tsx
"use client";

import { ArrowLeft, Crosshair, Gauge, Radar, RotateCcw } from "lucide-react";
import type {
  SandboxAction,
  SandboxControlMode,
  SandboxObject,
  SandboxObjective,
} from "@/components/sandbox/sandboxWorld";
import { isExternalSandboxAction, SANDBOX_WORLD } from "./sandboxWorld";
import styles from "./SandboxHUD.module.css";

export interface SandboxHUDProps {
  selectedObject: SandboxObject;
  selectedObjectId: string;
  scannerActive: boolean;
  controlMode: SandboxControlMode;
  discoveredObjectIds: string[];
  completedObjectiveIds: string[];
  onSelectObject: (objectId: string) => void;
  onScan: () => void;
  onResetView: () => void;
  onToggleControlMode: () => void;
}

function objectiveComplete(
  objective: SandboxObjective,
  discoveredObjectIds: string[],
  completedObjectiveIds: string[],
) {
  return (
    completedObjectiveIds.includes(objective.id) ||
    objective.objectIds.every((id) => discoveredObjectIds.includes(id))
  );
}

function ActionLink({ action }: { action: SandboxAction }) {
  const external = isExternalSandboxAction(action);

  return (
    <a
      href={action.href}
      className={styles.actionLink}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : null)}
    >
      {action.label}
    </a>
  );
}

export function SandboxHUD({
  selectedObject,
  selectedObjectId,
  scannerActive,
  controlMode,
  discoveredObjectIds,
  completedObjectiveIds,
  onSelectObject,
  onScan,
  onResetView,
  onToggleControlMode,
}: SandboxHUDProps) {
  return (
    <div className={styles.hud}>
      <header className={styles.topBar}>
        <a href="/" className={styles.homeLink}>
          <ArrowLeft aria-hidden="true" size={16} />
          Archive
        </a>
        <div className={styles.modeCluster} aria-label="Sandbox status">
          <span>
            <Gauge aria-hidden="true" size={14} />
            {controlMode === "guided" ? "Guided orbit" : "Free flight"}
          </span>
          <span>
            <Radar aria-hidden="true" size={14} />
            {scannerActive ? "Scanner active" : "Scanner idle"}
          </span>
        </div>
      </header>

      <aside className={styles.console} aria-labelledby="sandbox-console-title">
        <p className={styles.eyebrow}>Tactical Console</p>
        <h2 id="sandbox-console-title">{selectedObject.name}</h2>
        <p className={styles.loreName}>{selectedObject.loreName}</p>
        <p className={styles.statusLine}>{selectedObject.status}</p>
        <p className={styles.readout}>
          {scannerActive ? selectedObject.scanText : selectedObject.proofText}
        </p>
        <div className={styles.actionGrid}>
          {selectedObject.actions.map((action) => (
            <ActionLink key={`${selectedObject.id}-${action.href}`} action={action} />
          ))}
        </div>
      </aside>

      <section className={styles.objectPanel} aria-labelledby="sandbox-objects-title">
        <p className={styles.eyebrow}>Object Archive</p>
        <h2 id="sandbox-objects-title">Recovered Objects</h2>
        <div className={styles.objectList}>
          {SANDBOX_WORLD.objects.map((object) => {
            const discovered = discoveredObjectIds.includes(object.id);
            const active = selectedObjectId === object.id;
            return (
              <button
                key={object.id}
                type="button"
                className={active ? styles.objectButtonActive : styles.objectButton}
                onClick={() => onSelectObject(object.id)}
              >
                <span>{discovered ? "discovered" : "unscanned"}</span>
                {object.name}
              </button>
            );
          })}
        </div>
      </section>

      <section className={styles.missionPanel} aria-labelledby="sandbox-mission-title">
        <p className={styles.eyebrow}>Mission Ops</p>
        <h2 id="sandbox-mission-title">Relay Recovery</h2>
        <ol className={styles.objectives}>
          {SANDBOX_WORLD.objectives.map((objective) => (
            <li
              key={objective.id}
              className={
                objectiveComplete(
                  objective,
                  discoveredObjectIds,
                  completedObjectiveIds,
                )
                  ? styles.objectiveComplete
                  : styles.objective
              }
            >
              <span>{objective.label}</span>
              <p>{objective.description}</p>
            </li>
          ))}
        </ol>
      </section>

      <div className={styles.bottomRail} aria-label="Sandbox controls">
        <button type="button" onClick={onScan}>
          <Crosshair aria-hidden="true" size={16} />
          Scan
        </button>
        <button type="button" onClick={onToggleControlMode}>
          <Gauge aria-hidden="true" size={16} />
          {controlMode === "guided" ? "Free flight" : "Guided"}
        </button>
        <button type="button" onClick={onResetView}>
          <RotateCcw aria-hidden="true" size={16} />
          Reset
        </button>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Add responsive HUD styles**

Create `components/sandbox/SandboxHUD.module.css`:

```css
.hud {
  pointer-events: none;
  position: absolute;
  inset: 0;
  z-index: 20;
  display: grid;
  grid-template-columns: minmax(16rem, 20rem) minmax(0, 1fr) minmax(18rem, 24rem);
  grid-template-rows: auto minmax(0, 1fr) auto;
  gap: 1rem;
  min-height: 100dvh;
  padding: max(1rem, env(safe-area-inset-top)) max(1rem, env(safe-area-inset-right)) max(1rem, env(safe-area-inset-bottom)) max(1rem, env(safe-area-inset-left));
}

.topBar,
.console,
.objectPanel,
.missionPanel,
.bottomRail {
  pointer-events: auto;
}

.topBar {
  grid-column: 1 / -1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.homeLink,
.modeCluster span,
.bottomRail button,
.actionLink {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.45rem;
  border: 1px solid rgba(88, 243, 255, 0.22);
  background: rgba(3, 4, 6, 0.78);
  color: var(--color-cherenkov);
  font-family: var(--font-mono), ui-monospace, monospace;
  font-size: 0.72rem;
  letter-spacing: 0.12em;
  line-height: 1.2;
  min-height: 2.5rem;
  padding: 0.65rem 0.85rem;
  text-decoration: none;
  text-transform: uppercase;
}

.modeCluster {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  justify-content: flex-end;
}

.console,
.objectPanel,
.missionPanel {
  border: 1px solid rgba(199, 208, 216, 0.12);
  background: rgba(3, 4, 6, 0.82);
  box-shadow:
    0 0 40px rgba(88, 243, 255, 0.07),
    inset 0 1px 0 rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(18px) saturate(150%);
}

.console {
  grid-column: 3;
  grid-row: 2;
  align-self: start;
  display: grid;
  gap: 0.75rem;
  padding: 1rem;
}

.objectPanel {
  grid-column: 1;
  grid-row: 2;
  align-self: start;
  display: grid;
  gap: 0.75rem;
  padding: 1rem;
}

.missionPanel {
  grid-column: 3;
  grid-row: 2;
  align-self: end;
  display: grid;
  gap: 0.75rem;
  margin-top: 1rem;
  padding: 1rem;
}

.eyebrow {
  color: var(--color-cherenkov);
  font-family: var(--font-mono), ui-monospace, monospace;
  font-size: 0.68rem;
  letter-spacing: 0.22em;
  text-transform: uppercase;
}

.console h2,
.objectPanel h2,
.missionPanel h2 {
  color: var(--color-text-primary);
  font-family: var(--font-display), system-ui, sans-serif;
  font-size: 1rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.loreName,
.statusLine,
.readout,
.objectives p {
  color: var(--color-text-secondary);
  font-size: 0.85rem;
  line-height: 1.55;
}

.statusLine {
  color: var(--color-oxidized);
  font-family: var(--font-mono), ui-monospace, monospace;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.actionGrid,
.objectList,
.objectives {
  display: grid;
  gap: 0.5rem;
}

.objectButton,
.objectButtonActive {
  border: 1px solid rgba(199, 208, 216, 0.12);
  background: rgba(255, 255, 255, 0.035);
  color: var(--color-text-secondary);
  cursor: pointer;
  padding: 0.7rem;
  text-align: left;
  transition:
    border-color var(--duration-normal) var(--ease-out),
    color var(--duration-normal) var(--ease-out),
    background-color var(--duration-normal) var(--ease-out);
}

.objectButton span,
.objectButtonActive span {
  display: block;
  color: var(--color-text-dim);
  font-family: var(--font-mono), ui-monospace, monospace;
  font-size: 0.65rem;
  letter-spacing: 0.16em;
  margin-bottom: 0.2rem;
  text-transform: uppercase;
}

.objectButton:hover,
.objectButtonActive {
  border-color: rgba(88, 243, 255, 0.45);
  background: rgba(88, 243, 255, 0.08);
  color: var(--color-text-primary);
}

.objective,
.objectiveComplete {
  border-left: 2px solid rgba(199, 208, 216, 0.18);
  padding-left: 0.75rem;
}

.objective span,
.objectiveComplete span {
  color: var(--color-text-primary);
  font-family: var(--font-mono), ui-monospace, monospace;
  font-size: 0.76rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.objectiveComplete {
  border-left-color: var(--color-cherenkov);
}

.objectiveComplete span {
  color: var(--color-cherenkov);
}

.bottomRail {
  grid-column: 1 / -1;
  display: flex;
  flex-wrap: wrap;
  gap: 0.65rem;
  justify-content: center;
}

@media (max-width: 980px) {
  .hud {
    grid-template-columns: minmax(0, 1fr);
    grid-template-rows: auto minmax(0, 1fr) auto auto;
    overflow-y: auto;
  }

  .console,
  .objectPanel,
  .missionPanel {
    grid-column: 1;
    grid-row: auto;
    align-self: auto;
  }

  .objectPanel {
    order: 3;
  }
}

@media (max-width: 560px) {
  .topBar,
  .modeCluster,
  .bottomRail {
    align-items: stretch;
    flex-direction: column;
  }

  .homeLink,
  .modeCluster span,
  .bottomRail button,
  .actionLink {
    width: 100%;
  }
}

@media (prefers-reduced-motion: reduce) {
  .objectButton,
  .objectButtonActive {
    transition: none;
  }
}
```

- [ ] **Step 3: Replace the inline shell panel with `SandboxHUD`**

Modify `components/sandbox/SandboxExperience.tsx` so the state remains there and the HUD is rendered through the new component. Keep the visual viewport area in place for Task 4 integration:

```tsx
"use client";

import { useMemo, useState } from "react";
import { SandboxHUD } from "@/components/sandbox/SandboxHUD";
import {
  DEFAULT_SANDBOX_OBJECT_ID,
  findSandboxObject,
  SANDBOX_WORLD,
  type SandboxControlMode,
} from "@/components/sandbox/sandboxWorld";

export function SandboxExperience() {
  const [selectedObjectId, setSelectedObjectId] = useState(
    DEFAULT_SANDBOX_OBJECT_ID,
  );
  const [scannerActive, setScannerActive] = useState(false);
  const [controlMode, setControlMode] = useState<SandboxControlMode>("guided");
  const [discoveredObjectIds, setDiscoveredObjectIds] = useState<string[]>([
    DEFAULT_SANDBOX_OBJECT_ID,
  ]);
  const [completedObjectiveIds, setCompletedObjectiveIds] = useState<string[]>(
    [],
  );
  const selectedObject = useMemo(
    () => findSandboxObject(selectedObjectId) ?? SANDBOX_WORLD.objects[0],
    [selectedObjectId],
  );

  const handleSelectObject = (objectId: string) => {
    setSelectedObjectId(objectId);
    setDiscoveredObjectIds((current) =>
      current.includes(objectId) ? current : [...current, objectId],
    );
  };

  const handleScan = () => {
    setScannerActive(true);
    handleSelectObject(selectedObjectId);
    setCompletedObjectiveIds((current) =>
      current.includes("scan-relay") ? current : [...current, "scan-relay"],
    );
  };

  const handleResetView = () => {
    setSelectedObjectId(DEFAULT_SANDBOX_OBJECT_ID);
    setControlMode("guided");
  };

  return (
    <section
      aria-labelledby="sandbox-title"
      className="relative isolate min-h-dvh overflow-hidden bg-void"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(88,243,255,0.16),transparent_32%),linear-gradient(180deg,#030406_0%,#07111a_56%,#030406_100%)]" />
      <div className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center p-6 text-center">
        <div>
          <p className="font-[family-name:var(--font-jetbrains-mono)] text-xs uppercase tracking-[0.28em] text-cherenkov">
            /sandbox/orbital-ruins
          </p>
          <h1
            id="sandbox-title"
            className="mt-3 font-[family-name:var(--font-orbitron)] text-3xl font-bold uppercase tracking-wider text-text-primary sm:text-5xl"
          >
            {SANDBOX_WORLD.name}
          </h1>
        </div>
      </div>
      <SandboxHUD
        selectedObject={selectedObject}
        selectedObjectId={selectedObjectId}
        scannerActive={scannerActive}
        controlMode={controlMode}
        discoveredObjectIds={discoveredObjectIds}
        completedObjectiveIds={completedObjectiveIds}
        onSelectObject={handleSelectObject}
        onScan={handleScan}
        onResetView={handleResetView}
        onToggleControlMode={() =>
          setControlMode((mode) => (mode === "guided" ? "freefly" : "guided"))
        }
      />
    </section>
  );
}
```

- [ ] **Step 4: Run lint and typecheck for the HUD**

Run:

```bash
npm run lint
npx tsc --noEmit
```

Expected: both pass.

- [ ] **Step 5: Commit Task 3**

```bash
git add components/sandbox/SandboxExperience.tsx components/sandbox/SandboxHUD.tsx components/sandbox/SandboxHUD.module.css
git commit -m "feat: add sandbox tactical console"
```

## Task 4: Procedural Sandbox Canvas

**Files:**
- Create: `components/3d/sandbox/SandboxCanvas.tsx`
- Create: `components/3d/sandbox/SandboxCamera.tsx`
- Create: `components/3d/sandbox/SandboxObjects.tsx`
- Create: `components/3d/sandbox/SandboxScannerPulse.tsx`
- Create: `components/3d/sandbox/index.ts`

- [ ] **Step 1: Create sandbox 3D barrel**

Create `components/3d/sandbox/index.ts`:

```ts
export { SandboxCamera } from "./SandboxCamera";
export { SandboxCanvas } from "./SandboxCanvas";
export { SandboxObjects } from "./SandboxObjects";
export { SandboxScannerPulse } from "./SandboxScannerPulse";
```

- [ ] **Step 2: Create the scanner pulse component**

Create `components/3d/sandbox/SandboxScannerPulse.tsx`:

```tsx
"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import type { Mesh } from "three";
import * as THREE from "three";

export interface SandboxScannerPulseProps {
  active: boolean;
  color?: string;
}

export function SandboxScannerPulse({
  active,
  color = "#58f3ff",
}: SandboxScannerPulseProps) {
  const meshRef = useRef<Mesh>(null);
  const material = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color,
        depthWrite: false,
        opacity: 0,
        transparent: true,
        wireframe: true,
      }),
    [color],
  );

  useFrame(({ clock }) => {
    const mesh = meshRef.current;
    if (!mesh) return;

    if (!active) {
      mesh.visible = false;
      material.opacity = 0;
      return;
    }

    const pulse = (clock.elapsedTime % 1.7) / 1.7;
    mesh.visible = true;
    mesh.scale.setScalar(2.2 + pulse * 8.8);
    material.opacity = Math.max(0, 0.32 * (1 - pulse));
  });

  return (
    <mesh ref={meshRef} material={material}>
      <sphereGeometry args={[1, 32, 16]} />
    </mesh>
  );
}
```

- [ ] **Step 3: Create procedural sandbox objects**

Create `components/3d/sandbox/SandboxObjects.tsx`:

```tsx
"use client";

import { Line } from "@react-three/drei";
import type { ThreeEvent } from "@react-three/fiber";
import { useMemo, useState } from "react";
import * as THREE from "three";
import { TacticalLabel } from "@/components/3d/TacticalLabel";
import type { SandboxObject } from "@/components/sandbox/sandboxWorld";
import { SANDBOX_WORLD } from "@/components/sandbox/sandboxWorld";

export interface SandboxObjectsProps {
  selectedObjectId: string;
  scannerActive: boolean;
  onSelectObject: (objectId: string) => void;
}

export function SandboxObjects({
  selectedObjectId,
  scannerActive,
  onSelectObject,
}: SandboxObjectsProps) {
  const orbitRing = useMemo(() => buildRingPoints(5.8), []);
  const debris = useMemo(() => buildDebris(), []);

  return (
    <group>
      <Line
        color="#58f3ff"
        lineWidth={1}
        opacity={0.18}
        points={orbitRing}
        transparent
      />
      {debris.map((piece) => (
        <mesh
          key={piece.id}
          position={piece.position}
          rotation={piece.rotation}
          scale={piece.scale}
        >
          <boxGeometry args={[1, 0.08, 0.34]} />
          <meshStandardMaterial
            color="#8a3f2d"
            emissive="#ff7a45"
            emissiveIntensity={0.08}
            metalness={0.72}
            roughness={0.48}
          />
        </mesh>
      ))}
      {SANDBOX_WORLD.objects.map((object) => (
        <SandboxObjectNode
          key={object.id}
          object={object}
          selected={selectedObjectId === object.id}
          scannerActive={scannerActive}
          onSelectObject={onSelectObject}
        />
      ))}
    </group>
  );
}

function SandboxObjectNode({
  object,
  selected,
  scannerActive,
  onSelectObject,
}: {
  object: SandboxObject;
  selected: boolean;
  scannerActive: boolean;
  onSelectObject: (objectId: string) => void;
}) {
  const [hovered, setHovered] = useState(false);
  const position = object.position as [number, number, number];
  const visibleLabel = selected || hovered || scannerActive;
  const handleSelect = (event: ThreeEvent<MouseEvent | PointerEvent>) => {
    event.stopPropagation();
    onSelectObject(object.id);
  };

  return (
    <group position={position} scale={object.scale}>
      <ProceduralShape object={object} selected={selected} />
      <mesh
        onClick={handleSelect}
        onPointerDown={handleSelect}
        onPointerOut={() => setHovered(false)}
        onPointerOver={(event) => {
          event.stopPropagation();
          setHovered(true);
        }}
      >
        <sphereGeometry args={[0.9, 18, 12]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
      <TacticalLabel
        color={object.color}
        title={object.name}
        subtitle={object.status}
        visible={visibleLabel}
      />
    </group>
  );
}

function ProceduralShape({
  object,
  selected,
}: {
  object: SandboxObject;
  selected: boolean;
}) {
  const material = (
    <meshStandardMaterial
      color={object.color}
      emissive={object.color}
      emissiveIntensity={selected ? 0.58 : 0.24}
      metalness={0.74}
      roughness={0.34}
      wireframe={object.kind !== "resume"}
    />
  );

  if (object.kind === "relay") {
    return (
      <group>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.78, 0.025, 8, 64]} />
          {material}
        </mesh>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.08, 0.08, 1.35, 10]} />
          {material}
        </mesh>
        <mesh>
          <octahedronGeometry args={[0.26, 0]} />
          {material}
        </mesh>
      </group>
    );
  }

  if (object.kind === "ctf") {
    return (
      <mesh>
        <dodecahedronGeometry args={[0.42, 0]} />
        {material}
      </mesh>
    );
  }

  if (object.kind === "skills") {
    return (
      <group>
        <mesh>
          <icosahedronGeometry args={[0.34, 1]} />
          {material}
        </mesh>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.52, 0.012, 6, 48]} />
          {material}
        </mesh>
      </group>
    );
  }

  if (object.kind === "resume") {
    return (
      <mesh>
        <boxGeometry args={[0.64, 0.42, 0.2]} />
        {material}
      </mesh>
    );
  }

  return (
    <mesh>
      <tetrahedronGeometry args={[0.44, 0]} />
      {material}
    </mesh>
  );
}

function buildRingPoints(radius: number) {
  const points: THREE.Vector3[] = [];
  for (let index = 0; index <= 128; index++) {
    const angle = (index / 128) * Math.PI * 2;
    points.push(new THREE.Vector3(Math.cos(angle) * radius, 0, Math.sin(angle) * radius));
  }
  return points;
}

function buildDebris() {
  return Array.from({ length: 38 }, (_, index) => {
    const angle = index * 1.914;
    const radius = 2.8 + (index % 9) * 0.42;
    return {
      id: `debris-${index}`,
      position: new THREE.Vector3(
        Math.cos(angle) * radius,
        ((index % 7) - 3) * 0.18,
        Math.sin(angle) * radius,
      ),
      rotation: [index * 0.17, angle, index * 0.11] as [number, number, number],
      scale: [0.28 + (index % 4) * 0.08, 1, 0.42] as [number, number, number],
    };
  });
}
```

- [ ] **Step 4: Create sandbox camera**

Create `components/3d/sandbox/SandboxCamera.tsx`:

```tsx
"use client";

import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import type { SandboxControlMode } from "@/components/sandbox/sandboxWorld";

const DEFAULT_CAMERA = new THREE.Vector3(0, 5.4, 11.5);
const DEFAULT_TARGET = new THREE.Vector3(0, 0, 0);
const FREEFLY_ACCELERATION = 12;
const FREEFLY_MAX_SPEED = 10;

function isTypingTarget(target: EventTarget | null) {
  return target instanceof HTMLElement
    ? target.isContentEditable ||
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.tagName === "SELECT"
    : false;
}

export interface SandboxCameraProps {
  controlMode: SandboxControlMode;
  selectedPosition?: [number, number, number];
  reducedMotion?: boolean;
  onExitFreeFlight: () => void;
}

export function SandboxCamera({
  controlMode,
  selectedPosition,
  reducedMotion = false,
  onExitFreeFlight,
}: SandboxCameraProps) {
  const { camera } = useThree();
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const keysRef = useRef(new Set<string>());
  const scratch = useMemo(
    () => ({
      target: new THREE.Vector3(),
      cameraTarget: new THREE.Vector3(),
      forward: new THREE.Vector3(),
      right: new THREE.Vector3(),
      up: new THREE.Vector3(0, 1, 0),
      velocity: new THREE.Vector3(),
    }),
    [],
  );

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (isTypingTarget(event.target)) return;
      if (event.code === "Escape") {
        onExitFreeFlight();
        return;
      }
      keysRef.current.add(event.code);
    };
    const handleKeyUp = (event: KeyboardEvent) => {
      keysRef.current.delete(event.code);
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [onExitFreeFlight]);

  useFrame((_, delta) => {
    const controls = controlsRef.current;
    const selected = selectedPosition
      ? scratch.target.fromArray(selectedPosition)
      : DEFAULT_TARGET;

    if (controlMode === "freefly") {
      if (controls) controls.enabled = false;
      const keys = keysRef.current;
      const thrustForward = Number(keys.has("KeyW")) - Number(keys.has("KeyS"));
      const thrustRight = Number(keys.has("KeyD")) - Number(keys.has("KeyA"));
      const thrustUp =
        Number(keys.has("Space") || keys.has("KeyE")) -
        Number(keys.has("ShiftLeft") || keys.has("ControlLeft") || keys.has("KeyQ"));

      scratch.forward.set(0, 0, -1).applyQuaternion(camera.quaternion);
      scratch.right.set(1, 0, 0).applyQuaternion(camera.quaternion);
      scratch.velocity.addScaledVector(
        scratch.forward,
        thrustForward * FREEFLY_ACCELERATION * delta,
      );
      scratch.velocity.addScaledVector(
        scratch.right,
        thrustRight * FREEFLY_ACCELERATION * delta,
      );
      scratch.velocity.addScaledVector(
        scratch.up,
        thrustUp * FREEFLY_ACCELERATION * delta,
      );

      if (scratch.velocity.length() > FREEFLY_MAX_SPEED) {
        scratch.velocity.setLength(FREEFLY_MAX_SPEED);
      }

      camera.position.addScaledVector(scratch.velocity, delta);
      scratch.velocity.multiplyScalar(0.9);
      return;
    }

    if (controls) {
      controls.enabled = true;
      controls.target.lerp(selected, reducedMotion ? 1 : 0.08);
      controls.update();
    }

    scratch.cameraTarget.set(selected.x + 2.2, selected.y + 1.8, selected.z + 5.5);
    camera.position.lerp(scratch.cameraTarget, reducedMotion ? 1 : 0.025);
  });

  return (
    <>
      <PerspectiveCamera
        makeDefault
        position={DEFAULT_CAMERA.toArray()}
        fov={56}
        near={0.1}
        far={180}
      />
      <OrbitControls
        ref={controlsRef}
        enabled={controlMode === "guided"}
        enablePan={controlMode === "guided"}
        enableRotate={controlMode === "guided"}
        enableZoom={controlMode === "guided"}
        autoRotate={!reducedMotion && controlMode === "guided"}
        autoRotateSpeed={0.22}
        minDistance={3.2}
        maxDistance={24}
        rotateSpeed={0.38}
        zoomSpeed={0.72}
      />
    </>
  );
}
```

- [ ] **Step 5: Create sandbox canvas shell**

Create `components/3d/sandbox/SandboxCanvas.tsx`:

```tsx
"use client";

import { getGPUTier } from "@pmndrs/detect-gpu";
import { Canvas } from "@react-three/fiber";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import type { WebGLRenderer } from "three";
import { Constellation, DysonSphere, NeutronStar, Starfield } from "@/components/3d";
import { StarFallback } from "@/components/fallbacks/StarFallback";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import type { SandboxControlMode } from "@/components/sandbox/sandboxWorld";
import { findSandboxObject } from "@/components/sandbox/sandboxWorld";
import { SandboxCamera } from "./SandboxCamera";
import { SandboxObjects } from "./SandboxObjects";
import { SandboxScannerPulse } from "./SandboxScannerPulse";

type RenderMode = "fallback" | "canvas";

function hasWebGLSupport() {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl2") ?? canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

export interface SandboxCanvasProps {
  selectedObjectId: string;
  scannerActive: boolean;
  controlMode: SandboxControlMode;
  onSelectObject: (objectId: string) => void;
  onExitFreeFlight: () => void;
}

export function SandboxCanvas({
  selectedObjectId,
  scannerActive,
  controlMode,
  onSelectObject,
  onExitFreeFlight,
}: SandboxCanvasProps) {
  const [tier, setTier] = useState(2);
  const [renderMode, setRenderMode] = useState<RenderMode>("fallback");
  const [compactViewport, setCompactViewport] = useState(false);
  const reducedMotion = useReducedMotion();
  const selectedObject = useMemo(
    () => findSandboxObject(selectedObjectId),
    [selectedObjectId],
  );

  useEffect(() => {
    const media = window.matchMedia("(max-width: 720px)");
    const update = () => setCompactViewport(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (reducedMotion || !hasWebGLSupport()) {
      setRenderMode("fallback");
      return;
    }

    let cancelled = false;
    getGPUTier()
      .then((res) => {
        if (cancelled) return;
        setTier(res.tier);
        setRenderMode("canvas");
      })
      .catch(() => {
        if (cancelled) return;
        setTier(1);
        setRenderMode("canvas");
      });

    return () => {
      cancelled = true;
    };
  }, [reducedMotion]);

  const handleCanvasCreated = useCallback(({ gl }: { gl: WebGLRenderer }) => {
    const handleContextLost = (event: Event) => {
      event.preventDefault();
      setRenderMode("fallback");
    };
    gl.domElement.addEventListener("webglcontextlost", handleContextLost, {
      once: true,
    });
  }, []);

  if (renderMode === "fallback") {
    return (
      <div className="absolute inset-0 z-0 bg-void">
        <StarFallback />
      </div>
    );
  }

  const starCount = compactViewport ? 1800 : tier <= 1 ? 2600 : 12000;
  const constellationCount = compactViewport ? 160 : tier <= 1 ? 220 : 520;

  return (
    <div className="absolute inset-0 z-0 bg-void" aria-hidden="true">
      <Canvas
        dpr={tier <= 1 ? [1, 1.2] : [1, 2]}
        gl={{
          alpha: false,
          antialias: tier > 1,
          depth: true,
          powerPreference: "high-performance",
          stencil: false,
        }}
        onCreated={handleCanvasCreated}
        shadows={tier > 1}
      >
        <color attach="background" args={["#030406"]} />
        <SandboxCamera
          controlMode={controlMode}
          selectedPosition={selectedObject?.position}
          reducedMotion={reducedMotion}
          onExitFreeFlight={onExitFreeFlight}
        />
        <ambientLight intensity={tier <= 1 ? 0.12 : 0.06} />
        <pointLight
          castShadow={tier > 1}
          color="#dceeff"
          decay={1.25}
          distance={80}
          intensity={tier <= 1 ? 4 : 6.8}
          position={[0, 0, 0]}
        />
        <Suspense fallback={null}>
          <Starfield count={starCount} color="#c7d0d8" timeScale={0.45} />
          <Constellation count={constellationCount} timeScale={0.28} />
          <NeutronStar timeScale={0.34} />
          <DysonSphere
            color="#b8894d"
            destroyedFraction={0.33}
            panelFill={0.56}
            timeScale={0.24}
          />
          <SandboxScannerPulse active={scannerActive} />
          <SandboxObjects
            selectedObjectId={selectedObjectId}
            scannerActive={scannerActive}
            onSelectObject={onSelectObject}
          />
          {tier > 1 ? (
            <EffectComposer enableNormalPass={false}>
              <Bloom
                intensity={tier >= 3 ? 1.15 : 0.9}
                luminanceThreshold={0.26}
                luminanceSmoothing={0.82}
                mipmapBlur
              />
            </EffectComposer>
          ) : null}
        </Suspense>
      </Canvas>
    </div>
  );
}
```

- [ ] **Step 6: Run typecheck for isolated canvas files**

Run:

```bash
npx tsc --noEmit
```

Expected: no TypeScript errors.

- [ ] **Step 7: Commit Task 4**

```bash
git add components/3d/sandbox
git commit -m "feat: add procedural sandbox scene"
```

## Task 5: Homepage Sandbox Entry

**Files:**
- Modify: `app/page.tsx`

- [ ] **Step 1: Add a restrained sandbox CTA to the hero**

Modify the CTA button group in `app/page.tsx` so it keeps the existing `Recover archive` and `view dossier` actions, then adds `enter sandbox` as a third route link:

```tsx
<div className="pointer-events-auto flex flex-col justify-center gap-4 sm:flex-row sm:flex-wrap">
  <a
    href="#about"
    className="glass-terminal px-8 py-3 font-[family-name:var(--font-jetbrains-mono)] text-green text-sm uppercase tracking-widest
    hover:box-glow-green transition-all duration-[var(--duration-normal)] hover:scale-105
    focus-visible:outline-2 focus-visible:outline-green focus-visible:outline-offset-2"
  >
    Recover archive
  </a>
  <a
    href="/resume"
    className="glass-panel px-8 py-3 font-[family-name:var(--font-jetbrains-mono)] text-purple-hot text-sm uppercase tracking-widest
    hover:box-glow-purple transition-all duration-[var(--duration-normal)] hover:scale-105
    focus-visible:outline-2 focus-visible:outline-purple focus-visible:outline-offset-2"
  >
    view dossier
  </a>
  <a
    href="/sandbox"
    className="glass-panel px-8 py-3 font-[family-name:var(--font-jetbrains-mono)] text-oxidized text-sm uppercase tracking-widest
    hover:shadow-[0_0_30px_rgba(184,137,77,0.28)] transition-all duration-[var(--duration-normal)] hover:scale-105
    focus-visible:outline-2 focus-visible:outline-oxidized focus-visible:outline-offset-2"
  >
    enter sandbox
  </a>
</div>
```

- [ ] **Step 2: Run typecheck for the route link**

Run:

```bash
npx tsc --noEmit
```

Expected: no TypeScript errors.

- [ ] **Step 3: Commit Task 5**

```bash
git add app/page.tsx
git commit -m "feat: add sandbox entry point"
```

## Task 6: Integrate Canvas, HUD, Scanner, And Mission State

**Files:**
- Modify: `components/sandbox/SandboxExperience.tsx`
- Modify: `components/sandbox/SandboxHUD.tsx`
- Modify: `components/sandbox/SandboxHUD.module.css`
- Modify: `components/3d/sandbox/SandboxCanvas.tsx`

- [ ] **Step 1: Import and render `SandboxCanvas` behind the HUD**

Modify `components/sandbox/SandboxExperience.tsx` so the canvas replaces the static decorative background:

```tsx
import { SandboxCanvas } from "@/components/3d/sandbox";
```

Inside the section, render:

```tsx
<SandboxCanvas
  selectedObjectId={selectedObjectId}
  scannerActive={scannerActive}
  controlMode={controlMode}
  onSelectObject={handleSelectObject}
  onExitFreeFlight={() => setControlMode("guided")}
/>
```

Keep the text heading visually hidden or small if the canvas and HUD make the screen too crowded, but keep `id="sandbox-title"` available for `aria-labelledby`.

- [ ] **Step 2: Complete objective tracking**

In `SandboxExperience`, replace the scan handler with objective-aware state:

```tsx
const completeObjective = (objectiveId: string) => {
  setCompletedObjectiveIds((current) =>
    current.includes(objectiveId) ? current : [...current, objectiveId],
  );
};

const handleSelectObject = (objectId: string) => {
  setSelectedObjectId(objectId);
  setDiscoveredObjectIds((current) => {
    const next = current.includes(objectId) ? current : [...current, objectId];
    if (next.length >= 3) {
      completeObjective("inspect-proof");
    }
    return next;
  });
};

const handleScan = () => {
  setScannerActive(true);
  handleSelectObject(selectedObjectId);
  completeObjective("scan-relay");
};
```

When rendering action links in `SandboxHUD`, add an optional `onAction` prop so opening a route/link can complete `open-archive-route`:

```tsx
onAction={() => completeObjective("open-archive-route")}
```

- [ ] **Step 3: Ensure free-flight is visible and escapable**

Make the HUD mode button copy explicit:

```tsx
{controlMode === "guided" ? "Enter free flight" : "Exit free flight"}
```

Add helper text in the console readout or bottom rail:

```tsx
<p className={styles.controlHint}>
  {controlMode === "freefly"
    ? "WASD moves, Space/E rises, Shift/Q descends, Escape exits free flight."
    : "Drag to orbit, scroll to zoom, select ruins from the scene or object archive."}
</p>
```

- [ ] **Step 4: Add CSS for control hints and visually stable title**

Add to `SandboxHUD.module.css`:

```css
.controlHint {
  color: var(--color-text-dim);
  font-family: var(--font-mono), ui-monospace, monospace;
  font-size: 0.72rem;
  line-height: 1.5;
}
```

If the visible central title overlaps the HUD, move it to a compact top-center title with Tailwind classes in `SandboxExperience`, not a card.

- [ ] **Step 5: Run integration checks**

Run:

```bash
npm run verify:system
npm run lint
npx tsc --noEmit
npm run build
```

Expected: all pass.

- [ ] **Step 6: Commit Task 6**

```bash
git add components/sandbox/SandboxExperience.tsx components/sandbox/SandboxHUD.tsx components/sandbox/SandboxHUD.module.css components/3d/sandbox/SandboxCanvas.tsx
git commit -m "feat: integrate sandbox scanner loop"
```

## Task 7: Production Smoke And Final Verification

**Files:**
- Create temporary smoke script: `/tmp/dying_star_sandbox_smoke.py`
- No committed file is required unless the team decides to add maintained browser tests.

- [ ] **Step 1: Create the browser smoke script in `/tmp`**

Create `/tmp/dying_star_sandbox_smoke.py` with Playwright checks for `/`, `/sandbox`, desktop/mobile, and reduced motion. Use the existing external webapp-testing runner to execute it.

The script should check:

- `/sandbox` returns 200.
- No console errors occur.
- A `canvas` or fallback text is visible.
- The HUD exposes `Tactical Console`, `Mission Ops`, and `Recovered Objects`.
- Clicking `Run scanner` changes scanner state.
- Selecting `RedCalibur Artifact` changes the selected object detail.
- The `Archive` link returns to `/`.
- Mobile viewport has no horizontal overflow.
- Reduced-motion path renders fallback or calm HUD content.

- [ ] **Step 2: Run full static gates**

Run:

```bash
npm run verify:system
npm run lint
npx tsc --noEmit
npm run build
```

Expected: all pass.

- [ ] **Step 3: Run production browser smoke**

Run:

```bash
python3 /home/praneesh/antigravity-skills/skills/webapp-testing/scripts/with_server.py --server "npm run start -- -p 3001" --port 3001 --timeout 60 -- python3 /tmp/dying_star_sandbox_smoke.py
```

Expected:

```text
sandbox smoke ok
```

- [ ] **Step 4: Review git diff for unrelated churn**

Run:

```bash
git status --short
git diff --stat
```

Expected: only sandbox route, sandbox components, sandbox data, verifier, package script, and homepage CTA changed.

- [ ] **Step 5: Commit final verification artifacts if any committed test/docs files were added**

If no committed smoke script was added, do not commit `/tmp` files. If a maintained in-repo browser test is added, commit it separately:

```bash
git add tests package.json package-lock.json
git commit -m "test: add sandbox browser smoke"
```

Skip this commit when no committed test file exists.

## Plan Self-Review Checklist

- Spec coverage: `/sandbox` route, orbital ruins, guided/free-flight controls, tactical console, mission ops, discovery tracking, portfolio-first objects, homepage entry, fallbacks, and verification are covered.
- Parallel safety: only Task 1 is blocking; Tasks 2 through 5 have disjoint primary write scopes after Task 1.
- Shared state risk: plan avoids reusing `SystemCamera` and global `focusedSystemNodeId`/`cameraMode` for sandbox behavior.
- Homepage safety: plan adds a route CTA but does not add `/sandbox` to `FloatingNav`.
- Asset safety: v1 uses procedural objects only; future `.glb` relay work remains behind the asset ledger.
