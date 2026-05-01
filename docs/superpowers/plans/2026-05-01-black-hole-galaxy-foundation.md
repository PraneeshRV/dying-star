# Black Hole Galaxy Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add the data contracts, typed adapters, asset-governance skeleton, and verification gates needed before rendering the black-hole galaxy.

**Architecture:** This plan creates a non-visual foundation. The existing `Archive of the Shattered Star` renderer remains untouched while a new galaxy-level data contract wraps it as one of four portfolio systems. Asset governance is introduced as a ledger and verifier before external/generated textures or models are imported.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, React Three Fiber, Three.js, Node verification scripts, static JSON content.

---

## Scope

This is Plan 1 for the approved black-hole galaxy program. It produces working, testable software on its own:

- A checked-in galaxy config.
- A typed TypeScript adapter.
- Scoped node id helpers.
- A checked-in asset ledger skeleton.
- Verifiers wired into `npm run verify:system`.

It does not render the black hole, add GLB assets, add KTX2 loaders, rewrite the camera, or modify production visuals.

## File Map

- Create: `content/data/black-hole-galaxy.json`  
  Owns the galaxy-level contract: The Null Archive, four systems, route metadata, and section grouping.

- Create: `components/3d/galaxyConfig.ts`  
  Owns TypeScript types and helper functions for the galaxy contract.

- Create: `scripts/verify-galaxy-contract.mjs`  
  Validates the galaxy config, section coverage, system ids, anchors, and scoped ids.

- Create: `content/data/space-asset-ledger.json`  
  Defines the asset-governance policy and starts with no external runtime assets.

- Create: `scripts/verify-space-assets.mjs`  
  Validates the asset ledger and rejects incomplete or oversized asset records.

- Modify: `package.json`  
  Adds both new verifiers to `verify:system`.

- Modify: `components/3d/index.ts`  
  Exports the galaxy config adapter for future renderer work.

## Task 1: Add Galaxy Contract Verifier

**Files:**

- Create: `scripts/verify-galaxy-contract.mjs`

- [x] **Step 1: Write the failing verifier**

Create `scripts/verify-galaxy-contract.mjs` with this content:

```js
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const galaxyPath = join(root, "content/data/black-hole-galaxy.json");
const shatteredPath = join(root, "content/data/shattered-system.json");

const requiredGalaxySections = [
  "home",
  "about",
  "projects",
  "skills",
  "experience",
  "certifications",
  "ctf",
  "blog",
  "contact",
  "resume",
];

const requiredSystemIds = ["identity", "build", "proof", "transmission"];
const hexColorPattern = /^#[0-9a-fA-F]{6}$/;

function fail(message) {
  console.error(`galaxy-contract invalid: ${message}`);
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

function assertFiniteNumber(value, label) {
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
  assert(value.length === 3, `${label} must contain three numbers`);
  value.forEach((entry, index) => {
    assertFiniteNumber(entry, `${label}[${index}]`);
  });
}

function readJson(path, label) {
  assert(existsSync(path), `${label} file is missing at ${path}`);
  return JSON.parse(readFileSync(path, "utf8"));
}

const galaxy = readJson(galaxyPath, "black-hole-galaxy");
const shattered = readJson(shatteredPath, "shattered-system");

assertObject(galaxy, "galaxy");
assert(galaxy.id === "black-hole-galaxy", "galaxy id must be black-hole-galaxy");
assertString(galaxy.name, "galaxy name");
assertObject(galaxy.center, "galaxy center");
assert(galaxy.center.id === "null-archive", "center id must be null-archive");
assert(galaxy.center.kind === "black-hole", "center kind must be black-hole");
assertString(galaxy.center.name, "center name");
assertString(galaxy.center.plainLabel, "center plainLabel");
assertString(galaxy.center.loreLabel, "center loreLabel");
assertString(galaxy.center.fallback, "center fallback");
assertArray(galaxy.systems, "galaxy systems");
assertArray(galaxy.routes, "galaxy routes");

assert(
  galaxy.systems.length === requiredSystemIds.length,
  `expected ${requiredSystemIds.length} systems, got ${galaxy.systems.length}`,
);

const currentSections = new Set(shattered.sections.map((section) => section.id));
const currentBodies = new Set([
  ...shattered.planets.map((planet) => planet.id),
  ...shattered.moons.map((moon) => moon.id),
  ...shattered.megastructures.map((structure) => structure.id),
  ...shattered.pathways.map((pathway) => pathway.id),
]);

const seenSystemIds = new Set();
const seenSections = new Set();
const scopedIds = new Set();

for (const system of galaxy.systems) {
  assertObject(system, "system entry");
  assertString(system.id, "system id");
  assert(
    requiredSystemIds.includes(system.id),
    `unexpected system id ${system.id}`,
  );
  assert(!seenSystemIds.has(system.id), `duplicate system id ${system.id}`);
  seenSystemIds.add(system.id);

  assertString(system.name, `system ${system.id} name`);
  assertString(system.plainLabel, `system ${system.id} plainLabel`);
  assertString(system.loreLabel, `system ${system.id} loreLabel`);
  assertString(system.purpose, `system ${system.id} purpose`);
  assertVector3(system.center, `system ${system.id} center`);
  assertObject(system.orbit, `system ${system.id} orbit`);
  assertFiniteNumber(system.orbit.radius, `system ${system.id} orbit radius`);
  assertFiniteNumber(system.orbit.speed, `system ${system.id} orbit speed`);
  assertFiniteNumber(
    system.orbit.inclination,
    `system ${system.id} orbit inclination`,
  );
  assertFiniteNumber(system.orbit.phase, `system ${system.id} orbit phase`);
  assert(["full", "impostor", "fallback"].includes(system.detailMode), `system ${system.id} detailMode is invalid`);
  assertObject(system.palette, `system ${system.id} palette`);
  assertHexColor(system.palette.primary, `system ${system.id} palette primary`);
  assertHexColor(system.palette.accent, `system ${system.id} palette accent`);
  assertHexColor(system.palette.warning, `system ${system.id} palette warning`);
  assertArray(system.sectionIds, `system ${system.id} sectionIds`);
  assertArray(system.primaryNodeIds, `system ${system.id} primaryNodeIds`);

  for (const sectionId of system.sectionIds) {
    assert(
      requiredGalaxySections.includes(sectionId),
      `system ${system.id} has unknown section ${sectionId}`,
    );
    assert(!seenSections.has(sectionId), `section ${sectionId} mapped twice`);
    seenSections.add(sectionId);

    if (sectionId !== "home") {
      assert(
        currentSections.has(sectionId),
        `section ${sectionId} is missing from shattered-system sections`,
      );
    }
  }

  for (const nodeId of system.primaryNodeIds) {
    assertString(nodeId, `system ${system.id} primary node id`);
    assert(
      nodeId === "black-hole-core" || currentBodies.has(nodeId),
      `system ${system.id} points to missing node ${nodeId}`,
    );
    const scopedId = `${system.id}:${nodeId}`;
    assert(!scopedIds.has(scopedId), `duplicate scoped node id ${scopedId}`);
    scopedIds.add(scopedId);
  }
}

for (const systemId of requiredSystemIds) {
  assert(seenSystemIds.has(systemId), `missing system ${systemId}`);
}

for (const sectionId of requiredGalaxySections) {
  assert(seenSections.has(sectionId), `missing galaxy section ${sectionId}`);
}

for (const route of galaxy.routes) {
  assertObject(route, "route entry");
  assertString(route.id, "route id");
  assertString(route.fromSystemId, `route ${route.id} fromSystemId`);
  assertString(route.toSystemId, `route ${route.id} toSystemId`);
  assert(
    seenSystemIds.has(route.fromSystemId),
    `route ${route.id} points from missing system ${route.fromSystemId}`,
  );
  assert(
    seenSystemIds.has(route.toSystemId),
    `route ${route.id} points to missing system ${route.toSystemId}`,
  );
  assertString(route.kind, `route ${route.id} kind`);
  assertHexColor(route.color, `route ${route.id} color`);
}

console.log(
  `galaxy-contract ok: ${galaxy.systems.length} systems, ${seenSections.size} sections, ${scopedIds.size} scoped nodes`,
);
```

- [x] **Step 2: Run the verifier to confirm it fails**

Run:

```bash
node scripts/verify-galaxy-contract.mjs
```

Expected:

```text
galaxy-contract invalid: black-hole-galaxy file is missing
```

The absolute path after `missing at` may differ.

## Task 2: Add Galaxy Config And Typed Adapter

**Files:**

- Create: `content/data/black-hole-galaxy.json`
- Create: `components/3d/galaxyConfig.ts`
- Modify: `components/3d/index.ts`

- [x] **Step 1: Add the galaxy JSON contract**

Create `content/data/black-hole-galaxy.json` with this content:

```json
{
  "id": "black-hole-galaxy",
  "name": "Four Systems of the Event Horizon",
  "center": {
    "id": "null-archive",
    "kind": "black-hole",
    "name": "The Null Archive",
    "plainLabel": "Home",
    "loreLabel": "Archive Kernel",
    "description": "A black-hole navigation hub that pulls the portfolio evidence into four readable systems.",
    "fallback": "static-black-hole-poster"
  },
  "systems": [
    {
      "id": "identity",
      "name": "Identity System",
      "plainLabel": "Identity",
      "loreLabel": "Operator Records",
      "purpose": "Communicate who Praneesh is and provide the direct resume path.",
      "center": [-18, 4, -6],
      "orbit": {
        "radius": 18,
        "speed": 0.006,
        "inclination": 0.08,
        "phase": 0.2
      },
      "detailMode": "full",
      "palette": {
        "primary": "#c7d0d8",
        "accent": "#58f3ff",
        "warning": "#ff7a45"
      },
      "sectionIds": ["home", "about", "resume"],
      "primaryNodeIds": [
        "black-hole-core",
        "garden-glass",
        "archive-moon",
        "capital-ruin",
        "dossier-moon"
      ]
    },
    {
      "id": "build",
      "name": "Build System",
      "plainLabel": "Build",
      "loreLabel": "Recovered Blueprints",
      "purpose": "Communicate flagship projects and the skills that support them.",
      "center": [18, 2, -8],
      "orbit": {
        "radius": 22,
        "speed": -0.005,
        "inclination": -0.12,
        "phase": 1.8
      },
      "detailMode": "impostor",
      "palette": {
        "primary": "#b8894d",
        "accent": "#ff7a45",
        "warning": "#d94a4a"
      },
      "sectionIds": ["projects", "skills"],
      "primaryNodeIds": [
        "forge-world",
        "ark-shipyard",
        "shipyard-moon",
        "machine-planet",
        "defense-lattice",
        "compiler-moon"
      ]
    },
    {
      "id": "proof",
      "name": "Proof System",
      "plainLabel": "Proof",
      "loreLabel": "Breach And Authority Archive",
      "purpose": "Communicate experience, certifications, and CTF proof.",
      "center": [-14, -3, 18],
      "orbit": {
        "radius": 26,
        "speed": 0.004,
        "inclination": 0.16,
        "phase": 3.4
      },
      "detailMode": "impostor",
      "palette": {
        "primary": "#6fa8ff",
        "accent": "#b8894d",
        "warning": "#d94a4a"
      },
      "sectionIds": ["experience", "certifications", "ctf"],
      "primaryNodeIds": [
        "relay-planet",
        "beacon-chain",
        "fortress-planet",
        "vault-moon",
        "tomb-world",
        "fleet-graveyard",
        "quarantine-moon"
      ]
    },
    {
      "id": "transmission",
      "name": "Transmission System",
      "plainLabel": "Transmission",
      "loreLabel": "Recovered Signals",
      "purpose": "Communicate writing and contact paths.",
      "center": [16, -2, 20],
      "orbit": {
        "radius": 30,
        "speed": -0.0035,
        "inclination": -0.1,
        "phase": 5.1
      },
      "detailMode": "impostor",
      "palette": {
        "primary": "#213b4f",
        "accent": "#6fa8ff",
        "warning": "#58f3ff"
      },
      "sectionIds": ["blog", "contact"],
      "primaryNodeIds": [
        "collapsed-gate",
        "ocean-vault",
        "comms-array",
        "ocean-moon",
        "ice-moon"
      ]
    }
  ],
  "routes": [
    {
      "id": "identity-build-route",
      "fromSystemId": "identity",
      "toSystemId": "build",
      "kind": "hyperlane-scar",
      "color": "#ff7a45"
    },
    {
      "id": "build-proof-route",
      "fromSystemId": "build",
      "toSystemId": "proof",
      "kind": "signal-corridor",
      "color": "#6fa8ff"
    },
    {
      "id": "proof-transmission-route",
      "fromSystemId": "proof",
      "toSystemId": "transmission",
      "kind": "distress-signal",
      "color": "#58f3ff"
    },
    {
      "id": "transmission-identity-route",
      "fromSystemId": "transmission",
      "toSystemId": "identity",
      "kind": "return-arc",
      "color": "#b8894d"
    }
  ]
}
```

- [x] **Step 2: Add the TypeScript adapter**

Create `components/3d/galaxyConfig.ts` with this content:

```ts
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
```

- [x] **Step 3: Export the adapter**

Modify `components/3d/index.ts` by adding this export near the other 3D exports:

```ts
export {
  allGalaxySectionIds,
  findGalaxySystemForSection,
  GALAXY_CONFIG,
  isGalaxySystemId,
  makeScopedNodeId,
  parseScopedNodeId,
} from "./galaxyConfig";
export type {
  BlackHoleCenterConfig,
  GalaxyConfig,
  GalaxyDetailMode,
  GalaxyOrbitConfig,
  GalaxySectionId,
  GalaxySystemConfig,
  GalaxySystemId,
  InterSystemRouteConfig,
  ScopedSystemNodeId,
} from "./galaxyConfig";
```

- [x] **Step 4: Run contract verifier**

Run:

```bash
node scripts/verify-galaxy-contract.mjs
```

Expected:

```text
galaxy-contract ok: 4 systems, 10 sections, 23 scoped nodes
```

If the scoped node count differs because the JSON was changed intentionally, confirm every `primaryNodeIds` entry resolves before accepting the result.

- [x] **Step 5: Typecheck the adapter**

Run:

```bash
npx tsc --noEmit
```

Expected: command exits with code `0`.

- [x] **Step 6: Commit**

Run:

```bash
git add content/data/black-hole-galaxy.json components/3d/galaxyConfig.ts components/3d/index.ts scripts/verify-galaxy-contract.mjs
git commit -m "feat: add galaxy scene contract"
```

Expected: commit succeeds.

## Task 3: Add Asset Ledger And Verifier

**Files:**

- Create: `content/data/space-asset-ledger.json`
- Create: `scripts/verify-space-assets.mjs`

- [x] **Step 1: Write the failing asset verifier**

Create `scripts/verify-space-assets.mjs` with this content:

```js
import { existsSync, readFileSync, statSync } from "node:fs";
import { dirname, extname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const ledgerPath = join(root, "content/data/space-asset-ledger.json");

const sourceTypes = new Set(["procedural", "external", "generated", "authored"]);
const runtimeFormats = new Set(["procedural", "glb", "ktx2", "webp", "avif"]);
const maxCommittedAssetBytes = 500 * 1024;

function fail(message) {
  console.error(`space-assets invalid: ${message}`);
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

function readJson(path, label) {
  assert(existsSync(path), `${label} file is missing at ${path}`);
  return JSON.parse(readFileSync(path, "utf8"));
}

function validateAsset(asset) {
  assertObject(asset, "asset entry");
  assertString(asset.id, "asset id");
  assertString(asset.sourceType, `asset ${asset.id} sourceType`);
  assert(sourceTypes.has(asset.sourceType), `asset ${asset.id} sourceType is invalid`);
  assertString(asset.runtimeFormat, `asset ${asset.id} runtimeFormat`);
  assert(runtimeFormats.has(asset.runtimeFormat), `asset ${asset.id} runtimeFormat is invalid`);
  assertString(asset.runtimePath, `asset ${asset.id} runtimePath`);
  assertString(asset.fallback, `asset ${asset.id} fallback`);
  assertString(asset.license, `asset ${asset.id} license`);
  assertString(asset.credit, `asset ${asset.id} credit`);
  assertString(asset.reviewStatus, `asset ${asset.id} reviewStatus`);
  assert(
    ["approved", "internal", "blocked"].includes(asset.reviewStatus),
    `asset ${asset.id} reviewStatus is invalid`,
  );

  if (asset.sourceType !== "procedural") {
    assertString(asset.sourceUrl, `asset ${asset.id} sourceUrl`);
    assertString(asset.licenseUrl, `asset ${asset.id} licenseUrl`);
    assertString(asset.checksum, `asset ${asset.id} checksum`);
    assertString(asset.transformations, `asset ${asset.id} transformations`);
  }

  if (asset.runtimePath.startsWith("/")) {
    const localPath = join(root, asset.runtimePath.slice(1));

    if (existsSync(localPath)) {
      const stats = statSync(localPath);
      assert(
        stats.size <= maxCommittedAssetBytes,
        `asset ${asset.id} exceeds committed file budget at ${stats.size} bytes`,
      );
      const extension = extname(localPath).slice(1);
      assert(
        extension === asset.runtimeFormat || asset.runtimeFormat === "procedural",
        `asset ${asset.id} runtimeFormat does not match file extension`,
      );
    }
  }
}

const ledger = readJson(ledgerPath, "space-asset-ledger");

assertObject(ledger, "asset ledger");
assert(ledger.version === 1, "asset ledger version must be 1");
assertObject(ledger.policy, "asset ledger policy");
assertNumber(ledger.policy.initialMobileTransferKb, "initialMobileTransferKb");
assertNumber(ledger.policy.initialDesktopTransferKb, "initialDesktopTransferKb");
assertNumber(ledger.policy.maxLazyGlbKb, "maxLazyGlbKb");
assertNumber(ledger.policy.maxRuntimeKtx2Kb, "maxRuntimeKtx2Kb");
assertString(ledger.policy.cdnFailureFallback, "cdnFailureFallback");
assertArray(ledger.assets, "asset ledger assets");

const seenIds = new Set();

for (const asset of ledger.assets) {
  validateAsset(asset);
  assert(!seenIds.has(asset.id), `duplicate asset id ${asset.id}`);
  seenIds.add(asset.id);
}

console.log(`space-assets ok: ${ledger.assets.length} ledger entries`);
```

- [x] **Step 2: Run the verifier to confirm it fails**

Run:

```bash
node scripts/verify-space-assets.mjs
```

Expected:

```text
space-assets invalid: space-asset-ledger file is missing
```

The absolute path after `missing at` may differ.

- [x] **Step 3: Add the ledger**

Create `content/data/space-asset-ledger.json` with this content:

```json
{
  "version": 1,
  "policy": {
    "initialMobileTransferKb": 3072,
    "initialDesktopTransferKb": 8192,
    "maxLazyGlbKb": 10240,
    "maxRuntimeKtx2Kb": 4096,
    "maxHighDetailLazyPackKb": 25600,
    "maxCommittedAssetKb": 500,
    "cdnFailureFallback": "procedural-or-static-scene"
  },
  "assets": [
    {
      "id": "procedural-planet-textures-v1",
      "sourceType": "procedural",
      "runtimeFormat": "procedural",
      "runtimePath": "components/3d/PlanetSurface.tsx",
      "fallback": "same-procedural-generator",
      "license": "project-authored",
      "credit": "Generated at runtime by project code",
      "reviewStatus": "internal"
    },
    {
      "id": "procedural-neutron-star-shaders-v1",
      "sourceType": "procedural",
      "runtimeFormat": "procedural",
      "runtimePath": "components/3d/NeutronStar.tsx",
      "fallback": "StarFallback",
      "license": "project-authored",
      "credit": "Generated at runtime by project shaders",
      "reviewStatus": "internal"
    },
    {
      "id": "procedural-dyson-geometry-v1",
      "sourceType": "procedural",
      "runtimeFormat": "procedural",
      "runtimePath": "components/3d/DysonSphere.tsx",
      "fallback": "StarFallback",
      "license": "project-authored",
      "credit": "Generated at runtime by project geometry",
      "reviewStatus": "internal"
    }
  ]
}
```

- [x] **Step 4: Run the asset verifier**

Run:

```bash
node scripts/verify-space-assets.mjs
```

Expected:

```text
space-assets ok: 3 ledger entries
```

- [x] **Step 5: Commit**

Run:

```bash
git add content/data/space-asset-ledger.json scripts/verify-space-assets.mjs
git commit -m "feat: add space asset ledger"
```

Expected: commit succeeds.

## Task 4: Wire New Verifiers Into Project Verification

**Files:**

- Modify: `package.json`

- [x] **Step 1: Update `verify:system`**

Change the `verify:system` script in `package.json` to:

```json
"verify:system": "node scripts/verify-shattered-system.mjs && node scripts/verify-space-realism.mjs && node scripts/verify-galaxy-contract.mjs && node scripts/verify-space-assets.mjs"
```

- [x] **Step 2: Run system verification**

Run:

```bash
npm run verify:system
```

Expected output includes:

```text
galaxy-contract ok: 4 systems, 10 sections, 23 scoped nodes
space-assets ok: 3 ledger entries
```

The existing shattered-system and space-realism verifiers should also pass.

- [x] **Step 3: Run full non-browser gate**

Run:

```bash
npm run lint
npx tsc --noEmit
npm run build
```

Expected: all three commands exit with code `0`.

- [x] **Step 4: Commit**

Run:

```bash
git add package.json
git commit -m "chore: verify galaxy foundation contracts"
```

Expected: commit succeeds.

## Task 5: Record The Foundation Handoff

**Files:**

- Modify: `docs/superpowers/plans/2026-05-01-black-hole-galaxy-foundation.md`

- [x] **Step 1: Mark completed task checkboxes during execution**

As each task is executed, change its checkboxes from:

```md
- [ ] **Step name**
```

to:

```md
- [x] **Step name**
```

This keeps the plan file as a durable execution record.

- [x] **Step 2: Add the final execution note**

Append this section to the end of the plan after all tasks pass:

```md
## Execution Result

- Galaxy config added and verified.
- Galaxy TypeScript adapter added and typechecked.
- Asset ledger added and verified.
- `npm run verify:system` includes galaxy and asset verifiers.
- Full verification completed: `npm run lint`, `npx tsc --noEmit`, `npm run build`.
- Next implementation plan: isolated `CentralBlackHole` renderer and fallback.
```

- [x] **Step 3: Commit the updated execution record**

Run:

```bash
git add docs/superpowers/plans/2026-05-01-black-hole-galaxy-foundation.md
git commit -m "docs: record galaxy foundation execution"
```

Expected: commit succeeds.

## Execution Result

- Galaxy config added and verified.
- Galaxy TypeScript adapter added and typechecked.
- Asset ledger added and verified.
- `npm run verify:system` includes galaxy and asset verifiers.
- Full verification completed: `npm run lint`, `npx tsc --noEmit`, `npm run build`.
- Next implementation plan: isolated `CentralBlackHole` renderer and fallback.

## Verification Summary

The executing worker must run these commands before claiming completion:

```bash
npm run verify:system
npm run lint
npx tsc --noEmit
npm run build
```

For this non-visual foundation phase, production browser smoke is not required because no rendering behavior changes. Browser smoke becomes mandatory in the next visual plan that touches `SpaceCanvas`, camera behavior, shaders, or scene rendering.

## Next Plans After This Foundation

Create separate implementation plans in this order:

1. `CentralBlackHole` isolated renderer and fallback.
2. `SystemCluster` and scoped camera focus.
3. Caldera Garden KTX2 texture pilot.
4. Ark Shipyard GLB megastructure pilot.
5. Four-system progressive renderer.
6. Galaxy visual QA and production smoke harness.
