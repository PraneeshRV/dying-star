# Shattered Star Core Reforge Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the portfolio core into the approved `Archive of the Shattered Star` experience with a data-driven, zoomable, movable, observable, visitable, animated 3D ruin system.

**Architecture:** Keep the existing Next.js app and React Three Fiber scene, but split the star system into typed data, focused 3D components, camera controls, and section metadata. Preserve ordinary scroll navigation and readable portfolio labels while adding tactical lore subtitles, dense celestial bodies, ruined megastructures, pathway remnants, and performance fallbacks.

**Tech Stack:** Next.js 16.2.4, React 19.2.4, TypeScript strict mode, Tailwind v4 theme tokens, React Three Fiber, Three.js, drei, postprocessing Bloom, Zustand, Biome.

---

## Scope

This plan implements the first deliverable from the design spec: `Core Concept Reforge`.

Included:

- New tactical ruin palette.
- New hero copy and section framing.
- Blog preview section as `Recovered Transmissions` so navigation and lore mapping are present.
- Data-driven planets, moons, megastructures, pathway remnants, and tactical labels.
- Zoomable, pannable, orbitable camera controls.
- Focused "visit" behavior for section-linked celestial bodies.
- Animated rotations and revolutions for major celestial bodies and moons.
- Neutron star and Dyson sphere visual upgrades.
- Low-GPU and reduced-motion behavior.
- Verification script for the system-data contract.

Excluded from this phase:

- Contact API.
- Full blog engine and post routing.
- Archive console implementation.
- Signal Salvage minigame.

Those become later implementation plans after this phase is working and verified.

## File Structure

Create:

- `content/data/shattered-system.json` — structured source of truth for palette, section mapping, planets, moons, megastructures, and pathways.
- `scripts/verify-shattered-system.mjs` — no-dependency verifier for the data contract.
- `components/3d/shatteredSystem.ts` — typed loader and helpers for the JSON data.
- `components/3d/TacticalLabel.tsx` — shared 3D HTML label used by planets, moons, structures, and pathways.
- `components/3d/SystemCamera.tsx` — camera, orbit controls, zoom/pan configuration, and guided focus behavior.
- `components/3d/OrbitalBodies.tsx` — planets, moons, rotations, revolutions, section focus, and click-to-scroll.
- `components/3d/Megastructures.tsx` — ruined rings, gates, arrays, shipyards, cylinders, tethers, defense lattice, and fleet debris.
- `components/3d/PathwayRemnants.tsx` — damaged hyperlanes, beacon chains, and collapsed intergalactic routes.
- `components/sections/BlogPreviewSection.tsx` — visible `Blog` anchor with `Recovered Transmissions` lore framing.

Modify:

- `package.json` — add `verify:system`.
- `stores/globalStore.ts` — add selected/focused system node state.
- `components/3d/SpaceCanvas.tsx` — compose the expanded star system and controls.
- `components/3d/NeutronStar.tsx` — change shader palette and add realistic-feeling scars/corona/radiation.
- `components/3d/DysonSphere.tsx` — make destruction fraction explicit at 33% and add debris.
- `components/3d/index.ts` — export new scene components.
- `components/ui/FloatingNav.tsx` — add Blog and update labels/tooltips.
- `components/ui/FloatingNav.module.css` — tune palette to tactical ruin colors.
- `components/sections/AboutSection.tsx` — retheme as `Operator Record`.
- `components/sections/ProjectsSection.tsx` — retheme as `Recovered Megastructure Blueprints`.
- `components/sections/SkillsSection.tsx` — retheme as `Knowledge Matrix`.
- `components/sections/ExperienceSection.tsx` — retheme as `Signal Chronology`.
- `components/sections/CertificationsSection.tsx` — retheme as `Authority Seals`.
- `components/sections/CTFSection.tsx` — retheme as `Breach Archive`.
- `components/sections/ContactSection.tsx` — retheme as `Long-range Comms Array`.
- `app/page.tsx` — hero rewrite, Blog preview insertion, section order.
- `app/layout.tsx` — metadata and theme color rewrite.
- `app/globals.css` — palette tokens, glow utilities, tactical panel styling.
- `components/fallbacks/StarFallback.tsx` — static fallback matching the new ruined system.

## Task 1: System Data Contract

**Files:**
- Create: `scripts/verify-shattered-system.mjs`
- Create: `content/data/shattered-system.json`
- Modify: `package.json`

- [ ] **Step 1: Add the verifier before the data exists**

Create `scripts/verify-shattered-system.mjs`:

```js
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const dataPath = join(root, "content/data/shattered-system.json");
const system = JSON.parse(readFileSync(dataPath, "utf8"));

const requiredSections = [
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

function assert(condition, message) {
  if (!condition) {
    console.error(`System data invalid: ${message}`);
    process.exit(1);
  }
}

assert(system.name === "Archive of the Shattered Star", "system name mismatch");
assert(system.dysonSphere.destroyedFraction === 0.33, "Dyson destruction must be 0.33");
assert(system.planets.length >= 7 && system.planets.length <= 9, "expected 7-9 major planets");
assert(system.moons.length >= 12, "expected at least 12 moons");
assert(system.megastructures.length >= 8, "expected at least 8 megastructures");
assert(system.pathways.length >= 3, "expected at least 3 pathway remnants");

for (const sectionId of requiredSections) {
  assert(
    system.sections.some((section) => section.id === sectionId),
    `missing section mapping: ${sectionId}`,
  );
}

const bodyIds = new Set([
  ...system.planets.map((planet) => planet.id),
  ...system.moons.map((moon) => moon.id),
  ...system.megastructures.map((structure) => structure.id),
  ...system.pathways.map((pathway) => pathway.id),
]);

for (const section of system.sections) {
  assert(bodyIds.has(section.anchorId), `section ${section.id} points to missing anchor ${section.anchorId}`);
}

for (const moon of system.moons) {
  assert(
    system.planets.some((planet) => planet.id === moon.parentId),
    `moon ${moon.id} points to missing planet ${moon.parentId}`,
  );
}

for (const planet of system.planets) {
  assert(planet.rotationSpeed !== 0, `planet ${planet.id} must rotate`);
  assert(planet.orbitSpeed !== 0, `planet ${planet.id} must revolve`);
}

for (const moon of system.moons) {
  assert(moon.rotationSpeed !== 0, `moon ${moon.id} must rotate`);
  assert(moon.orbitSpeed !== 0, `moon ${moon.id} must revolve`);
}

console.log("shattered-system: data contract valid");
console.log(`planets=${system.planets.length}`);
console.log(`moons=${system.moons.length}`);
console.log(`megastructures=${system.megastructures.length}`);
console.log(`pathways=${system.pathways.length}`);
```

- [ ] **Step 2: Add the package script**

Modify `package.json` scripts:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "biome check",
    "format": "biome format --write",
    "verify:system": "node scripts/verify-shattered-system.mjs",
    "prepare": "husky"
  }
}
```

- [ ] **Step 3: Run the verifier and confirm it fails**

Run:

```bash
npm run verify:system
```

Expected:

```text
ENOENT
```

- [ ] **Step 4: Add the system data**

Create `content/data/shattered-system.json`:

```json
{
  "name": "Archive of the Shattered Star",
  "subtitle": "Tactical archive of a fallen intergalactic civilization",
  "palette": {
    "voidBlack": "#030406",
    "neutronAsh": "#c7d0d8",
    "cherenkovCyan": "#58f3ff",
    "dyingEmber": "#ff7a45",
    "oxidizedGold": "#b8894d",
    "ruinRust": "#8a3f2d",
    "gravityBlue": "#6fa8ff",
    "threatRed": "#d94a4a"
  },
  "dysonSphere": {
    "id": "dyson-breach",
    "name": "Aurelian Dyson Remnant",
    "intactFraction": 0.67,
    "destroyedFraction": 0.33,
    "scan": "67% shell continuity. 33% missing from impact, erosion, and unresolved siege events."
  },
  "sections": [
    { "id": "about", "label": "About", "lore": "Operator Record", "anchorId": "archive-moon" },
    { "id": "projects", "label": "Projects", "lore": "Recovered Megastructure Blueprints", "anchorId": "ark-shipyard" },
    { "id": "skills", "label": "Skills", "lore": "Knowledge Matrix", "anchorId": "defense-lattice" },
    { "id": "experience", "label": "Experience", "lore": "Signal Chronology", "anchorId": "beacon-chain" },
    { "id": "certifications", "label": "Certifications", "lore": "Authority Seals", "anchorId": "vault-moon" },
    { "id": "ctf", "label": "CTF", "lore": "Breach Archive", "anchorId": "tomb-world" },
    { "id": "blog", "label": "Blog", "lore": "Recovered Transmissions", "anchorId": "collapsed-gate" },
    { "id": "contact", "label": "Contact", "lore": "Long-range Comms Array", "anchorId": "comms-array" },
    { "id": "resume", "label": "Resume", "lore": "Recovered Dossier", "anchorId": "capital-ruin" }
  ],
  "planets": [
    {
      "id": "capital-ruin",
      "name": "Eidolon Prime",
      "lore": "Ruined capital world",
      "sectionId": "resume",
      "orbitRadius": 6.2,
      "orbitSpeed": 0.085,
      "rotationSpeed": 0.34,
      "size": 0.42,
      "inclination": 0.08,
      "color": "#c7d0d8",
      "emissive": "#58f3ff",
      "status": "fractured archives intact",
      "scan": "Capital crust glassed on one hemisphere. Dossier vault still broadcasts."
    },
    {
      "id": "forge-world",
      "name": "Vulcanis Ash",
      "lore": "Dead industrial forge",
      "sectionId": "projects",
      "orbitRadius": 8.1,
      "orbitSpeed": -0.064,
      "rotationSpeed": 0.29,
      "size": 0.5,
      "inclination": -0.12,
      "color": "#8a3f2d",
      "emissive": "#ff7a45",
      "status": "thermal scars active",
      "scan": "Foundry continents remain hot beneath collapsed orbital yards."
    },
    {
      "id": "garden-glass",
      "name": "Caldera Garden",
      "lore": "Glassed garden planet",
      "sectionId": "about",
      "orbitRadius": 10.4,
      "orbitSpeed": 0.052,
      "rotationSpeed": 0.2,
      "size": 0.46,
      "inclination": 0.16,
      "color": "#34484f",
      "emissive": "#b8894d",
      "status": "biosphere lost",
      "scan": "Former garden world with preserved city scars under ash and mineral glass."
    },
    {
      "id": "relay-planet",
      "name": "Orison Relay",
      "lore": "Pathway relay planet",
      "sectionId": "experience",
      "orbitRadius": 12.9,
      "orbitSpeed": -0.043,
      "rotationSpeed": 0.18,
      "size": 0.34,
      "inclination": -0.2,
      "color": "#1f3550",
      "emissive": "#6fa8ff",
      "status": "beacon fragments aligned",
      "scan": "Broken beacon chain records the chronology of outbound signals."
    },
    {
      "id": "tomb-world",
      "name": "Kharon Redoubt",
      "lore": "Quarantined war tomb",
      "sectionId": "ctf",
      "orbitRadius": 15.4,
      "orbitSpeed": 0.036,
      "rotationSpeed": 0.23,
      "size": 0.4,
      "inclination": 0.24,
      "color": "#4d1518",
      "emissive": "#d94a4a",
      "status": "quarantine active",
      "scan": "Breach records survive inside hardened war vaults and attack telemetry."
    },
    {
      "id": "machine-planet",
      "name": "Mnemosyne Engine",
      "lore": "Silent machine world",
      "sectionId": "skills",
      "orbitRadius": 18.2,
      "orbitSpeed": -0.03,
      "rotationSpeed": 0.14,
      "size": 0.48,
      "inclination": -0.08,
      "color": "#111b24",
      "emissive": "#58f3ff",
      "status": "knowledge matrix degraded",
      "scan": "Cold machine strata retain partial skill matrices and system maps."
    },
    {
      "id": "fortress-planet",
      "name": "Bastion Null",
      "lore": "Defense command planet",
      "sectionId": "certifications",
      "orbitRadius": 21.4,
      "orbitSpeed": 0.026,
      "rotationSpeed": 0.16,
      "size": 0.43,
      "inclination": 0.14,
      "color": "#20232d",
      "emissive": "#c7d0d8",
      "status": "authority seals readable",
      "scan": "Command rings preserve authority records and formal clearance fragments."
    },
    {
      "id": "ocean-vault",
      "name": "Pelagos Vault",
      "lore": "Frozen ocean archive",
      "sectionId": "contact",
      "orbitRadius": 24.3,
      "orbitSpeed": -0.021,
      "rotationSpeed": 0.12,
      "size": 0.38,
      "inclination": -0.18,
      "color": "#213b4f",
      "emissive": "#6fa8ff",
      "status": "relay aperture damaged",
      "scan": "Frozen sea hides the surviving long-range communication aperture."
    }
  ],
  "moons": [
    { "id": "archive-moon", "parentId": "garden-glass", "name": "Iris Archive", "sectionId": "about", "orbitRadius": 0.82, "orbitSpeed": 0.72, "rotationSpeed": 0.3, "size": 0.12, "color": "#c7d0d8", "emissive": "#58f3ff", "scan": "Identity fragments preserved in shielded lunar stacks." },
    { "id": "vault-moon", "parentId": "fortress-planet", "name": "Seal Vault", "sectionId": "certifications", "orbitRadius": 0.78, "orbitSpeed": -0.64, "rotationSpeed": 0.25, "size": 0.1, "color": "#b8894d", "emissive": "#c7d0d8", "scan": "Certification seals remain legible under oxidized plating." },
    { "id": "shipyard-moon", "parentId": "forge-world", "name": "Yard Moon", "sectionId": "projects", "orbitRadius": 0.95, "orbitSpeed": 0.52, "rotationSpeed": 0.21, "size": 0.11, "color": "#8a3f2d", "emissive": "#ff7a45", "scan": "Dock skeletons orbit a mined-out moon." },
    { "id": "mined-moon", "parentId": "forge-world", "name": "Ore Husk", "sectionId": "projects", "orbitRadius": 1.22, "orbitSpeed": -0.42, "rotationSpeed": 0.18, "size": 0.08, "color": "#5c4a42", "emissive": "#b8894d", "scan": "Matter extraction scars expose the core." },
    { "id": "breach-moon", "parentId": "tomb-world", "name": "Breach Moon", "sectionId": "ctf", "orbitRadius": 0.78, "orbitSpeed": 0.78, "rotationSpeed": 0.27, "size": 0.09, "color": "#d94a4a", "emissive": "#ff7a45", "scan": "Attack telemetry loops through cracked bunkers." },
    { "id": "quarantine-moon", "parentId": "tomb-world", "name": "Red Lock", "sectionId": "ctf", "orbitRadius": 1.02, "orbitSpeed": -0.58, "rotationSpeed": 0.2, "size": 0.08, "color": "#4d1518", "emissive": "#d94a4a", "scan": "Active quarantine marker. Do not approach without hardened parser." },
    { "id": "beacon-moon", "parentId": "relay-planet", "name": "Chronos Beacon", "sectionId": "experience", "orbitRadius": 0.86, "orbitSpeed": 0.66, "rotationSpeed": 0.22, "size": 0.1, "color": "#6fa8ff", "emissive": "#58f3ff", "scan": "Experience chronology encoded in beacon phase drift." },
    { "id": "dead-relay", "parentId": "relay-planet", "name": "Dead Relay", "sectionId": "experience", "orbitRadius": 1.15, "orbitSpeed": -0.48, "rotationSpeed": 0.19, "size": 0.08, "color": "#263445", "emissive": "#6fa8ff", "scan": "Relay chain severed during the last route collapse." },
    { "id": "matrix-moon", "parentId": "machine-planet", "name": "Lattice Node", "sectionId": "skills", "orbitRadius": 0.9, "orbitSpeed": 0.7, "rotationSpeed": 0.28, "size": 0.1, "color": "#0f2028", "emissive": "#58f3ff", "scan": "Skill matrix shard uses old defense geometry." },
    { "id": "compiler-moon", "parentId": "machine-planet", "name": "Compiler Husk", "sectionId": "skills", "orbitRadius": 1.18, "orbitSpeed": -0.45, "rotationSpeed": 0.24, "size": 0.09, "color": "#17242d", "emissive": "#c7d0d8", "scan": "Toolchain records survive in nonvolatile strata." },
    { "id": "dossier-moon", "parentId": "capital-ruin", "name": "Dossier Lens", "sectionId": "resume", "orbitRadius": 0.82, "orbitSpeed": 0.62, "rotationSpeed": 0.26, "size": 0.1, "color": "#c7d0d8", "emissive": "#58f3ff", "scan": "Recovered dossier mirror remains in stable orbit." },
    { "id": "city-moon", "parentId": "capital-ruin", "name": "City Moon", "sectionId": "resume", "orbitRadius": 1.08, "orbitSpeed": -0.44, "rotationSpeed": 0.18, "size": 0.09, "color": "#b8894d", "emissive": "#ff7a45", "scan": "Dark-side city lights flicker below broken transit rings." },
    { "id": "ocean-moon", "parentId": "ocean-vault", "name": "Tide Key", "sectionId": "contact", "orbitRadius": 0.74, "orbitSpeed": 0.75, "rotationSpeed": 0.22, "size": 0.09, "color": "#213b4f", "emissive": "#6fa8ff", "scan": "Relay authentication key frozen into tidal crust." },
    { "id": "ice-moon", "parentId": "ocean-vault", "name": "Frost Relay", "sectionId": "contact", "orbitRadius": 1.04, "orbitSpeed": -0.51, "rotationSpeed": 0.2, "size": 0.08, "color": "#c7d0d8", "emissive": "#58f3ff", "scan": "Backup comms optics survive inside fractured ice." }
  ],
  "megastructures": [
    { "id": "ark-shipyard", "name": "Ark Shipyard Skeleton", "sectionId": "projects", "kind": "shipyard", "orbitRadius": 9.4, "orbitSpeed": -0.036, "rotationSpeed": 0.08, "color": "#b8894d", "emissive": "#ff7a45", "scan": "Project blueprints recovered from dock frame memory." },
    { "id": "defense-lattice", "name": "Defense Lattice", "sectionId": "skills", "kind": "lattice", "orbitRadius": 16.5, "orbitSpeed": 0.028, "rotationSpeed": 0.12, "color": "#58f3ff", "emissive": "#6fa8ff", "scan": "Skill graph mapped through surviving defense geometry." },
    { "id": "comms-array", "name": "Long-range Comms Array", "sectionId": "contact", "kind": "array", "orbitRadius": 25.5, "orbitSpeed": 0.018, "rotationSpeed": 0.1, "color": "#6fa8ff", "emissive": "#58f3ff", "scan": "Damaged relay can still open a direct signal." },
    { "id": "collapsed-gate", "name": "Collapsed Gate", "sectionId": "blog", "kind": "gate", "orbitRadius": 27.5, "orbitSpeed": -0.016, "rotationSpeed": 0.07, "color": "#6fa8ff", "emissive": "#d94a4a", "scan": "Recovered transmissions leak through the collapsed route." },
    { "id": "mass-driver", "name": "Mass-driver Spine", "sectionId": "projects", "kind": "spine", "orbitRadius": 11.3, "orbitSpeed": 0.032, "rotationSpeed": 0.09, "color": "#c7d0d8", "emissive": "#ff7a45", "scan": "Projectile spine bent out of alignment during the siege." },
    { "id": "habitat-cylinder", "name": "Derelict Habitat Cylinder", "sectionId": "about", "kind": "cylinder", "orbitRadius": 13.6, "orbitSpeed": -0.026, "rotationSpeed": 0.18, "color": "#c7d0d8", "emissive": "#58f3ff", "scan": "Civilian archive pressure hull still answers pings." },
    { "id": "orbital-ring", "name": "Broken Orbital Ring", "sectionId": "experience", "kind": "ring", "orbitRadius": 19.7, "orbitSpeed": 0.022, "rotationSpeed": 0.06, "color": "#b8894d", "emissive": "#ff7a45", "scan": "Transit history burned into incomplete ring telemetry." },
    { "id": "fleet-graveyard", "name": "Fleet Graveyard", "sectionId": "ctf", "kind": "fleet", "orbitRadius": 22.6, "orbitSpeed": -0.019, "rotationSpeed": 0.05, "color": "#8a3f2d", "emissive": "#d94a4a", "scan": "War breach records scattered across derelict hulls." },
    { "id": "tether-ruin", "name": "Elevator Tether Ruin", "sectionId": "certifications", "kind": "tether", "orbitRadius": 23.4, "orbitSpeed": 0.021, "rotationSpeed": 0.04, "color": "#c7d0d8", "emissive": "#b8894d", "scan": "Authority markers remain along snapped orbital tether." }
  ],
  "pathways": [
    { "id": "beacon-chain", "name": "Severed Beacon Chain", "sectionId": "experience", "kind": "beacon-chain", "radius": 29.2, "arcStart": 0.25, "arcEnd": 1.22, "color": "#6fa8ff", "scan": "Chronology signals arrive out of phase." },
    { "id": "hyperlane-remnant", "name": "Broken Hyperlane Arc", "sectionId": "blog", "kind": "hyperlane", "radius": 31.5, "arcStart": 2.4, "arcEnd": 3.35, "color": "#58f3ff", "scan": "Transmission fragments repeat through route scars." },
    { "id": "navigation-corridor", "name": "Distorted Navigation Corridor", "sectionId": "contact", "kind": "corridor", "radius": 34.0, "arcStart": 4.25, "arcEnd": 5.15, "color": "#ff7a45", "scan": "Comms packets must route around gravity shear." }
  ]
}
```

- [ ] **Step 5: Run the verifier and confirm it passes**

Run:

```bash
npm run verify:system
```

Expected:

```text
shattered-system: data contract valid
planets=8
moons=14
megastructures=9
pathways=3
```

- [ ] **Step 6: Commit the data contract**

```bash
git add package.json scripts/verify-shattered-system.mjs content/data/shattered-system.json
git commit -m "feat: add shattered star system data"
```

## Task 2: Typed Scene Data And Focus State

**Files:**
- Create: `components/3d/shatteredSystem.ts`
- Modify: `stores/globalStore.ts`
- Test: `npm run verify:system`, `npx tsc --noEmit`

- [ ] **Step 1: Create typed exports for scene data**

Create `components/3d/shatteredSystem.ts`:

```ts
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
  return SECTION_MAPPINGS.find((section) => section.anchorId === id);
}

export function scrollToSection(sectionId: SectionId) {
  document
    .getElementById(sectionId)
    ?.scrollIntoView({ behavior: "smooth", block: "start" });
}
```

- [ ] **Step 2: Add focused system node state**

Modify `stores/globalStore.ts` by adding this to `GlobalState`:

```ts
  /** Focused celestial body or relic in the 3D system */
  focusedSystemNodeId: string | null;
  setFocusedSystemNodeId: (id: string | null) => void;
```

Add this inside the `create<GlobalState>` object:

```ts
  focusedSystemNodeId: null,
  setFocusedSystemNodeId: (id) => set({ focusedSystemNodeId: id }),
```

- [ ] **Step 3: Verify data and types**

Run:

```bash
npm run verify:system
npx tsc --noEmit
```

Expected:

```text
shattered-system: data contract valid
```

`npx tsc --noEmit` exits with code `0`.

- [ ] **Step 4: Commit typed data access**

```bash
git add components/3d/shatteredSystem.ts stores/globalStore.ts
git commit -m "feat: type shattered star scene data"
```

## Task 3: Zoomable And Visitable System Camera

**Files:**
- Create: `components/3d/SystemCamera.tsx`
- Modify: `components/3d/index.ts`
- Modify: `components/3d/SpaceCanvas.tsx`
- Test: `npx tsc --noEmit`

- [ ] **Step 1: Add the camera controller**

Create `components/3d/SystemCamera.tsx`:

```tsx
"use client";

import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { SHATTERED_SYSTEM } from "@/components/3d/shatteredSystem";
import { useGlobalStore } from "@/stores/globalStore";

const DEFAULT_TARGET = new THREE.Vector3(0, 0, 0);
const DEFAULT_CAMERA = new THREE.Vector3(0, 8, 30);

function staticOrbitPosition(orbitRadius: number, inclination = 0) {
  return new THREE.Vector3(
    orbitRadius,
    Math.sin(inclination) * orbitRadius * 0.22,
    Math.cos(inclination) * orbitRadius * 0.18,
  );
}

function findFocusPosition(id: string | null) {
  if (!id) return DEFAULT_TARGET;

  const planet = SHATTERED_SYSTEM.planets.find((item) => item.id === id);
  if (planet) return staticOrbitPosition(planet.orbitRadius, planet.inclination);

  const moon = SHATTERED_SYSTEM.moons.find((item) => item.id === id);
  if (moon) {
    const parent = SHATTERED_SYSTEM.planets.find((item) => item.id === moon.parentId);
    if (!parent) return DEFAULT_TARGET;
    return staticOrbitPosition(parent.orbitRadius + moon.orbitRadius, parent.inclination);
  }

  const structure = SHATTERED_SYSTEM.megastructures.find((item) => item.id === id);
  if (structure) return staticOrbitPosition(structure.orbitRadius, 0);

  const pathway = SHATTERED_SYSTEM.pathways.find((item) => item.id === id);
  if (pathway) {
    const angle = (pathway.arcStart + pathway.arcEnd) / 2;
    return new THREE.Vector3(Math.cos(angle) * pathway.radius, 1.4, Math.sin(angle) * pathway.radius);
  }

  return DEFAULT_TARGET;
}

export interface SystemCameraProps {
  reducedMotion?: boolean;
}

export function SystemCamera({ reducedMotion = false }: SystemCameraProps) {
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const focusedSystemNodeId = useGlobalStore((state) => state.focusedSystemNodeId);

  const scratch = useMemo(
    () => ({
      target: new THREE.Vector3(),
      camera: new THREE.Vector3(),
      offset: new THREE.Vector3(0, 3.2, 8),
    }),
    [],
  );

  useFrame(({ camera }, delta) => {
    const focusTarget = findFocusPosition(focusedSystemNodeId);

    if (!focusedSystemNodeId || reducedMotion) {
      controlsRef.current?.target.lerp(DEFAULT_TARGET, 0.035);
      return;
    }

    scratch.target.copy(focusTarget);
    scratch.camera.copy(focusTarget).add(scratch.offset);

    camera.position.lerp(scratch.camera, Math.min(delta * 1.8, 0.08));
    controlsRef.current?.target.lerp(scratch.target, Math.min(delta * 2.1, 0.1));
    controlsRef.current?.update();
  });

  return (
    <>
      <PerspectiveCamera makeDefault position={DEFAULT_CAMERA.toArray()} fov={54} near={0.1} far={260} />
      <OrbitControls
        ref={controlsRef}
        enableZoom
        enablePan
        enableRotate
        rotateSpeed={0.34}
        zoomSpeed={0.72}
        panSpeed={0.45}
        autoRotate={!reducedMotion && !focusedSystemNodeId}
        autoRotateSpeed={0.18}
        minDistance={4}
        maxDistance={78}
        minPolarAngle={Math.PI / 8}
        maxPolarAngle={Math.PI - Math.PI / 8}
      />
    </>
  );
}
```

- [ ] **Step 2: Export the camera**

Add this to `components/3d/index.ts`:

```ts
export { SystemCamera } from "./SystemCamera";
```

- [ ] **Step 3: Replace the disabled controls in `SpaceCanvas`**

In `components/3d/SpaceCanvas.tsx`, remove the current `PerspectiveCamera` import and delete the existing `<OrbitControls>` element at the bottom of the `<Canvas>` tree. Import and render:

```tsx
import { SystemCamera } from "./SystemCamera";
```

Inside `<Canvas>`:

```tsx
<SystemCamera reducedMotion={false} />
```

Reduced-motion wiring is completed in Task 8 after the scene composition is changed.

- [ ] **Step 4: Verify types**

Run:

```bash
npx tsc --noEmit
```

Expected: command exits with code `0`.

- [ ] **Step 5: Commit camera controls**

```bash
git add components/3d/SystemCamera.tsx components/3d/index.ts components/3d/SpaceCanvas.tsx
git commit -m "feat: add visitable star system camera controls"
```

## Task 4: Realistic Neutron Star Upgrade

**Files:**
- Modify: `components/3d/NeutronStar.tsx`
- Test: `npx tsc --noEmit`

- [ ] **Step 1: Change the default palette and prop comments**

In `NeutronStarProps`, replace the color comments and defaults:

```ts
  /** Hot neutron emission color */
  primaryColor?: string;
  /** Corona and magnetic field color */
  secondaryColor?: string;
  /** Attack-scar and accretion ember color */
  scarColor?: string;
```

Update the function signature:

```ts
export function NeutronStar({
  position = [0, 0, 0],
  scale = 1,
  primaryColor = "#dceeff",
  secondaryColor = "#58f3ff",
  scarColor = "#ff7a45",
  spinSpeed = 0.42,
}: NeutronStarProps) {
```

- [ ] **Step 2: Add dark scar color to uniforms**

Add `scar` to the preallocated color object:

```ts
const colors = useMemo(
  () => ({
    primary: new THREE.Color(primaryColor),
    secondary: new THREE.Color(secondaryColor),
    scar: new THREE.Color(scarColor),
  }),
  [primaryColor, secondaryColor, scarColor],
);
```

Add `uColorScar` to each shader uniform group that renders the core and disk:

```ts
uColorScar: { value: colors.scar },
```

- [ ] **Step 3: Add scar shading to the core fragment shader**

In `CORE_FRAG`, add:

```glsl
uniform vec3 uColorScar;
```

Inside `main()`, after the existing surface turbulence calculation assigned to `float n`, add:

```glsl
float magneticBand = abs(p.y);
float scarNoise = fbm(p.xz * 7.0 + vec2(uTime * 0.08, -uTime * 0.04));
float darkScar = smoothstep(0.58, 0.86, scarNoise) * smoothstep(0.12, 0.82, magneticBand);
```

Replace the final color block with:

```glsl
vec3 color = base * (0.72 + 0.42 * n) * pulse;
color = mix(color, uColorScar * 0.28, darkScar * 0.72);
color += uColorPrimary * rim * 1.9 * pulse;
color += vec3(1.0) * pow(rim, 5.0) * 0.92;
```

- [ ] **Step 4: Add corona and radiation geometry**

Inside the returned group, after the outer halo mesh, add:

```tsx
<mesh rotation={[Math.PI / 2.4, 0, Math.PI / 7]}>
  <torusGeometry args={[1.75, 0.015, 8, 192]} />
  <meshBasicMaterial
    color={secondaryColor}
    transparent
    opacity={0.28}
    blending={THREE.AdditiveBlending}
    depthWrite={false}
    toneMapped={false}
  />
</mesh>

<mesh rotation={[Math.PI / 2.1, 0, -Math.PI / 5]}>
  <torusGeometry args={[2.05, 0.01, 8, 192]} />
  <meshBasicMaterial
    color={scarColor}
    transparent
    opacity={0.14}
    blending={THREE.AdditiveBlending}
    depthWrite={false}
    toneMapped={false}
  />
</mesh>
```

- [ ] **Step 5: Verify types**

Run:

```bash
npx tsc --noEmit
```

Expected: command exits with code `0`.

- [ ] **Step 6: Commit the neutron star upgrade**

```bash
git add components/3d/NeutronStar.tsx
git commit -m "feat: upgrade neutron star visuals"
```

## Task 5: Dyson Sphere Destruction Model

**Files:**
- Modify: `components/3d/DysonSphere.tsx`
- Test: `npx tsc --noEmit`

- [ ] **Step 1: Make destruction explicit in props**

Update `DysonSphereProps`:

```ts
  /** Fraction of shell visibly destroyed. 0.33 means 33% structural loss. */
  destroyedFraction?: number;
  debrisCount?: number;
```

Update the function signature:

```ts
export function DysonSphere({
  radius = 30,
  detail = 2,
  color = "#b8894d",
  baseOpacity = 0.16,
  rotationSpeed = 0.032,
  panelFill = 0.67,
  destroyedFraction = 0.33,
  debrisCount = 180,
}: DysonSphereProps) {
```

- [ ] **Step 2: Bias missing panels into a destroyed arc**

Inside the panel geometry loop, replace the keep condition with:

```ts
const vx = srcPos.getX(i * 3);
const vy = srcPos.getY(i * 3);
const vz = srcPos.getZ(i * 3);
const angle = Math.atan2(vz, vx);
const damageCenter = Math.PI * 0.18;
const damageWidth = Math.PI * destroyedFraction * 1.55;
const angularDistance = Math.abs(Math.atan2(Math.sin(angle - damageCenter), Math.cos(angle - damageCenter)));
const inDamageArc = angularDistance < damageWidth;
const erosion = inDamageArc ? 0.82 : 0.18;
const keepPanel = seededRandom(i) < panelFill * (1 - erosion);

if (keepPanel) {
  indices.push(i * 3, i * 3 + 1, i * 3 + 2);
}
```

Add `destroyedFraction` to the `useMemo` dependency list.

- [ ] **Step 3: Add deterministic debris**

Before `useFrame`, create debris data:

```ts
const debris = useMemo(() => {
  return Array.from({ length: debrisCount }, (_, index) => {
    const t = index / debrisCount;
    const angle = Math.PI * 0.18 + (t - 0.5) * Math.PI * destroyedFraction * 2.1;
    const distance = radius * (0.9 + seededUnit(index + 900) * 0.42);
    return {
      id: `dyson-debris-${index}`,
      position: [
        Math.cos(angle) * distance,
        (seededUnit(index + 1200) - 0.5) * radius * 0.44,
        Math.sin(angle) * distance,
      ] as [number, number, number],
      size: 0.035 + seededUnit(index + 1500) * 0.12,
    };
  });
}, [debrisCount, destroyedFraction, radius]);
```

Add this helper above the component:

```ts
function seededUnit(seed: number) {
  const x = Math.sin(seed * 127.1) * 43758.5453;
  return x - Math.floor(x);
}
```

Render debris before the wireframe shell:

```tsx
{debris.map((piece) => (
  <mesh key={piece.id} position={piece.position}>
    <boxGeometry args={[piece.size, piece.size * 0.42, piece.size * 1.8]} />
    <meshBasicMaterial
      color="#ff7a45"
      transparent
      opacity={0.55}
      toneMapped={false}
    />
  </mesh>
))}
```

- [ ] **Step 4: Verify types**

Run:

```bash
npx tsc --noEmit
```

Expected: command exits with code `0`.

- [ ] **Step 5: Commit Dyson destruction**

```bash
git add components/3d/DysonSphere.tsx
git commit -m "feat: show destroyed dyson sphere sectors"
```

## Task 6: Orbital Bodies, Megastructures, And Pathways

**Files:**
- Create: `components/3d/TacticalLabel.tsx`
- Create: `components/3d/OrbitalBodies.tsx`
- Create: `components/3d/Megastructures.tsx`
- Create: `components/3d/PathwayRemnants.tsx`
- Modify: `components/3d/index.ts`
- Test: `npm run verify:system`, `npx tsc --noEmit`

- [ ] **Step 1: Create shared tactical labels**

Create `components/3d/TacticalLabel.tsx`:

```tsx
"use client";

import { Html } from "@react-three/drei";

export interface TacticalLabelProps {
  title: string;
  subtitle: string;
  color: string;
  visible: boolean;
}

export function TacticalLabel({ title, subtitle, color, visible }: TacticalLabelProps) {
  if (!visible) return null;

  return (
    <Html center distanceFactor={11} style={{ pointerEvents: "none" }}>
      <div
        style={{
          background: "rgba(3, 4, 6, 0.86)",
          border: `1px solid ${color}`,
          borderRadius: "4px",
          boxShadow: `0 0 18px ${color}55`,
          color,
          fontFamily: "var(--font-jetbrains-mono), monospace",
          fontSize: "10px",
          letterSpacing: "0.12em",
          minWidth: "180px",
          padding: "8px 10px",
          textTransform: "uppercase",
          whiteSpace: "normal",
        }}
      >
        <strong style={{ display: "block", marginBottom: "4px" }}>{title}</strong>
        <span style={{ color: "rgba(199, 208, 216, 0.82)" }}>{subtitle}</span>
      </div>
    </Html>
  );
}
```

- [ ] **Step 2: Create orbital body renderer**

Create `components/3d/OrbitalBodies.tsx` with these responsibilities:

```tsx
"use client";

import { useFrame } from "@react-three/fiber";
import { useCallback, useMemo, useRef, useState } from "react";
import type * as THREE from "three";
import type { Group } from "three";
import {
  SHATTERED_SYSTEM,
  scrollToSection,
  type MoonConfig,
  type PlanetConfig,
} from "./shatteredSystem";
import { TacticalLabel } from "./TacticalLabel";
import { useGlobalStore } from "@/stores/globalStore";

export interface OrbitalBodiesProps {
  speedMultiplier?: number;
  renderMoons?: boolean;
}

export function OrbitalBodies({ speedMultiplier = 1, renderMoons = true }: OrbitalBodiesProps) {
  const pivotRefs = useRef<(Group | null)[]>([]);
  const phases = useMemo(
    () => SHATTERED_SYSTEM.planets.map((planet, index) => index * 0.74 + planet.orbitRadius * 0.11),
    [],
  );

  useFrame((_, delta) => {
    for (let i = 0; i < pivotRefs.current.length; i++) {
      const pivot = pivotRefs.current[i];
      const planet = SHATTERED_SYSTEM.planets[i];
      if (!pivot || !planet) continue;
      pivot.rotation.y += delta * planet.orbitSpeed * speedMultiplier;
    }
  });

  return (
    <group>
      {SHATTERED_SYSTEM.planets.map((planet, index) => {
        const moons = SHATTERED_SYSTEM.moons.filter((moon) => moon.parentId === planet.id);
        return (
          <group key={planet.id} rotation={[planet.inclination, phases[index], 0]}>
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[planet.orbitRadius, 0.01, 8, 192]} />
              <meshBasicMaterial color={planet.emissive} transparent opacity={0.13} toneMapped={false} />
            </mesh>

            <group ref={(element) => { pivotRefs.current[index] = element; }}>
              <PlanetMesh planet={planet} moons={renderMoons ? moons : []} speedMultiplier={speedMultiplier} />
            </group>
          </group>
        );
      })}
    </group>
  );
}

function PlanetMesh({
  planet,
  moons,
  speedMultiplier,
}: {
  planet: PlanetConfig;
  moons: MoonConfig[];
  speedMultiplier: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const moonPivotRefs = useRef<(Group | null)[]>([]);
  const [hovered, setHovered] = useState(false);
  const setFocusedSystemNodeId = useGlobalStore((state) => state.setFocusedSystemNodeId);

  useFrame((_, delta) => {
    if (meshRef.current) meshRef.current.rotation.y += delta * planet.rotationSpeed * speedMultiplier;
    for (let i = 0; i < moonPivotRefs.current.length; i++) {
      const pivot = moonPivotRefs.current[i];
      const moon = moons[i];
      if (!pivot || !moon) continue;
      pivot.rotation.y += delta * moon.orbitSpeed * speedMultiplier;
    }
  });

  const handleClick = useCallback(() => {
    setFocusedSystemNodeId(planet.id);
    scrollToSection(planet.sectionId);
  }, [planet, setFocusedSystemNodeId]);

  return (
    <group position={[planet.orbitRadius, 0, 0]}>
      <mesh
        ref={meshRef}
        onClick={handleClick}
        onPointerOver={() => {
          setHovered(true);
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          setHovered(false);
          document.body.style.cursor = "";
        }}
      >
        <sphereGeometry args={[planet.size, 32, 32]} />
        <meshStandardMaterial
          color={planet.color}
          emissive={planet.emissive}
          emissiveIntensity={hovered ? 0.75 : 0.28}
          metalness={0.48}
          roughness={0.68}
        />
        <TacticalLabel title={planet.name} subtitle={planet.scan} color={planet.emissive} visible={hovered} />
      </mesh>

      {moons.map((moon, index) => (
        <group key={moon.id} ref={(element) => { moonPivotRefs.current[index] = element; }}>
          <MoonMesh moon={moon} />
        </group>
      ))}
    </group>
  );
}

function MoonMesh({ moon }: { moon: MoonConfig }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const setFocusedSystemNodeId = useGlobalStore((state) => state.setFocusedSystemNodeId);

  useFrame((_, delta) => {
    if (meshRef.current) meshRef.current.rotation.y += delta * moon.rotationSpeed;
  });

  const handleClick = useCallback(() => {
    setFocusedSystemNodeId(moon.id);
    scrollToSection(moon.sectionId);
  }, [moon, setFocusedSystemNodeId]);

  return (
    <mesh
      ref={meshRef}
      position={[moon.orbitRadius, 0, 0]}
      onClick={handleClick}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <sphereGeometry args={[moon.size, 16, 16]} />
      <meshStandardMaterial
        color={moon.color}
        emissive={moon.emissive}
        emissiveIntensity={hovered ? 0.55 : 0.18}
        metalness={0.38}
        roughness={0.76}
      />
      <TacticalLabel title={moon.name} subtitle={moon.scan} color={moon.emissive} visible={hovered} />
    </mesh>
  );
}
```

- [ ] **Step 3: Create megastructure renderer**

Create `components/3d/Megastructures.tsx`:

```tsx
"use client";

import { useFrame } from "@react-three/fiber";
import { useCallback, useMemo, useRef, useState } from "react";
import type * as THREE from "three";
import type { Group } from "three";
import { useGlobalStore } from "@/stores/globalStore";
import { SHATTERED_SYSTEM, scrollToSection, type MegastructureConfig } from "./shatteredSystem";
import { TacticalLabel } from "./TacticalLabel";

export interface MegastructuresProps {
  speedMultiplier?: number;
}

export function Megastructures({ speedMultiplier = 1 }: MegastructuresProps) {
  const pivotRefs = useRef<(Group | null)[]>([]);
  const phases = useMemo(
    () => SHATTERED_SYSTEM.megastructures.map((structure, index) => index * 0.53 + structure.orbitRadius * 0.05),
    [],
  );

  useFrame((_, delta) => {
    for (let i = 0; i < pivotRefs.current.length; i++) {
      const pivot = pivotRefs.current[i];
      const structure = SHATTERED_SYSTEM.megastructures[i];
      if (!pivot || !structure) continue;
      pivot.rotation.y += delta * structure.orbitSpeed * speedMultiplier;
    }
  });

  return (
    <group>
      {SHATTERED_SYSTEM.megastructures.map((structure, index) => (
        <group key={structure.id} rotation={[0, phases[index], 0]}>
          <group ref={(element) => { pivotRefs.current[index] = element; }}>
            <StructureMesh structure={structure} speedMultiplier={speedMultiplier} />
          </group>
        </group>
      ))}
    </group>
  );
}

function StructureMesh({
  structure,
  speedMultiplier,
}: {
  structure: MegastructureConfig;
  speedMultiplier: number;
}) {
  const groupRef = useRef<Group>(null);
  const [hovered, setHovered] = useState(false);
  const setFocusedSystemNodeId = useGlobalStore((state) => state.setFocusedSystemNodeId);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y += delta * structure.rotationSpeed * speedMultiplier;
    groupRef.current.rotation.z += delta * structure.rotationSpeed * 0.24 * speedMultiplier;
  });

  const handleClick = useCallback(() => {
    setFocusedSystemNodeId(structure.id);
    scrollToSection(structure.sectionId);
  }, [structure, setFocusedSystemNodeId]);

  return (
    <group
      ref={groupRef}
      position={[structure.orbitRadius, 0, 0]}
      onClick={handleClick}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <StructureGeometry structure={structure} hovered={hovered} />
      <TacticalLabel title={structure.name} subtitle={structure.scan} color={structure.emissive} visible={hovered} />
    </group>
  );
}

function StructureGeometry({ structure, hovered }: { structure: MegastructureConfig; hovered: boolean }) {
  const opacity = hovered ? 0.86 : 0.5;

  if (structure.kind === "gate") {
    return (
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.52, 0.035, 8, 48, Math.PI * 1.38]} />
        <meshBasicMaterial color={structure.color} transparent opacity={opacity} toneMapped={false} />
      </mesh>
    );
  }

  if (structure.kind === "ring") {
    return (
      <mesh rotation={[Math.PI / 2.15, 0, Math.PI / 6]}>
        <torusGeometry args={[0.62, 0.018, 8, 80, Math.PI * 1.55]} />
        <meshBasicMaterial color={structure.color} transparent opacity={opacity} toneMapped={false} />
      </mesh>
    );
  }

  if (structure.kind === "cylinder") {
    return (
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.16, 0.16, 0.95, 18, 1, true]} />
        <meshBasicMaterial color={structure.color} transparent opacity={opacity} wireframe toneMapped={false} />
      </mesh>
    );
  }

  if (structure.kind === "spine" || structure.kind === "tether") {
    return (
      <mesh rotation={[0, 0, Math.PI / 3]}>
        <boxGeometry args={[1.45, 0.035, 0.035]} />
        <meshBasicMaterial color={structure.emissive} transparent opacity={opacity} toneMapped={false} />
      </mesh>
    );
  }

  if (structure.kind === "fleet") {
    return (
      <group>
        {Array.from({ length: 9 }, (_, index) => (
          <mesh key={`${structure.id}-hull-${index}`} position={[(index - 4) * 0.14, Math.sin(index) * 0.08, Math.cos(index) * 0.08]}>
            <boxGeometry args={[0.16, 0.035, 0.05]} />
            <meshBasicMaterial color={structure.color} transparent opacity={opacity * 0.72} toneMapped={false} />
          </mesh>
        ))}
      </group>
    );
  }

  return (
    <group>
      <mesh>
        <boxGeometry args={[0.86, 0.05, 0.05]} />
        <meshBasicMaterial color={structure.color} transparent opacity={opacity} toneMapped={false} />
      </mesh>
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <boxGeometry args={[0.36, 0.04, 0.04]} />
        <meshBasicMaterial color={structure.emissive} transparent opacity={opacity * 0.7} toneMapped={false} />
      </mesh>
    </group>
  );
}
```

- [ ] **Step 4: Create pathway remnants renderer**

Create `components/3d/PathwayRemnants.tsx`:

```tsx
"use client";

import { Line } from "@react-three/drei";
import { useMemo } from "react";
import * as THREE from "three";
import { SHATTERED_SYSTEM } from "./shatteredSystem";

function arcPoints(radius: number, start: number, end: number) {
  return Array.from({ length: 56 }, (_, index) => {
    const t = index / 55;
    const angle = start + (end - start) * t;
    const shear = Math.sin(t * Math.PI * 3) * 0.28;
    return new THREE.Vector3(Math.cos(angle) * radius, shear, Math.sin(angle) * radius);
  });
}

export function PathwayRemnants() {
  const pathways = useMemo(
    () =>
      SHATTERED_SYSTEM.pathways.map((pathway) => ({
        ...pathway,
        points: arcPoints(pathway.radius, pathway.arcStart, pathway.arcEnd),
      })),
    [],
  );

  return (
    <group>
      {pathways.map((pathway) => (
        <Line
          key={pathway.id}
          points={pathway.points}
          color={pathway.color}
          lineWidth={1}
          transparent
          opacity={0.42}
          dashed
          dashScale={18}
          dashSize={0.8}
          gapSize={0.45}
        />
      ))}
    </group>
  );
}
```

- [ ] **Step 5: Export new scene pieces**

Add to `components/3d/index.ts`:

```ts
export { Megastructures } from "./Megastructures";
export { OrbitalBodies } from "./OrbitalBodies";
export { PathwayRemnants } from "./PathwayRemnants";
export { TacticalLabel } from "./TacticalLabel";
export type { ShatteredSystemData } from "./shatteredSystem";
export { SHATTERED_SYSTEM, SECTION_MAPPINGS } from "./shatteredSystem";
```

- [ ] **Step 6: Verify data and types**

Run:

```bash
npm run verify:system
npx tsc --noEmit
```

Expected: both commands exit with code `0`.

- [ ] **Step 7: Commit system objects**

```bash
git add components/3d/TacticalLabel.tsx components/3d/OrbitalBodies.tsx components/3d/Megastructures.tsx components/3d/PathwayRemnants.tsx components/3d/index.ts
git commit -m "feat: add tactical ruin system objects"
```

## Task 7: Compose The Expanded 3D Scene

**Files:**
- Modify: `components/3d/SpaceCanvas.tsx`
- Modify: `components/fallbacks/StarFallback.tsx`
- Test: `npx tsc --noEmit`

- [ ] **Step 1: Replace old orbital planets in `SpaceCanvas`**

Update imports in `components/3d/SpaceCanvas.tsx`:

```tsx
import { useReducedMotion } from "@/hooks/useReducedMotion";
import {
  Constellation,
  DysonSphere,
  Megastructures,
  NeutronStar,
  OrbitalBodies,
  PathwayRemnants,
  Starfield,
  SystemCamera,
} from "./index";
```

Inside `SpaceCanvas`, add:

```tsx
const reducedMotion = useReducedMotion();
const speedMultiplier = reducedMotion ? 0 : tier <= 1 ? 0.35 : 1;
const renderDenseObjects = tier > 1 && !reducedMotion;
```

Replace the current main scene body with:

```tsx
<color attach="background" args={["#030406"]} />
<SystemCamera reducedMotion={reducedMotion} />

<ambientLight intensity={0.18} />
<pointLight position={[0, 0, 0]} intensity={4.2} color="#dceeff" />
<pointLight position={[4, 2, 5]} intensity={0.55} color="#ff7a45" />

<Suspense fallback={null}>
  <Starfield count={starCount} color="#c7d0d8" />
  <Constellation count={constellationCount} />
  <PathwayRemnants />
  <NeutronStar />
  <DysonSphere color="#b8894d" destroyedFraction={0.33} panelFill={0.67} />
  <OrbitalBodies speedMultiplier={speedMultiplier} renderMoons={renderDenseObjects} />
  {renderDenseObjects && <Megastructures speedMultiplier={speedMultiplier} />}

  {useBloom && (
    <EffectComposer enableNormalPass={false}>
      <Bloom
        intensity={1.15}
        luminanceThreshold={0.22}
        luminanceSmoothing={0.82}
        mipmapBlur
      />
    </EffectComposer>
  )}
</Suspense>
```

- [ ] **Step 2: Update the fallback concept**

In `components/fallbacks/StarFallback.tsx`, change the root class from `bg-void` to a layered ruin-system background:

```tsx
<div className="absolute inset-0 overflow-hidden bg-[radial-gradient(circle_at_50%_48%,rgba(220,238,255,0.95)_0_0.45rem,rgba(88,243,255,0.24)_1.6rem,transparent_11rem),radial-gradient(circle_at_62%_42%,rgba(255,122,69,0.12),transparent_18rem),#030406] pointer-events-none">
```

Add two non-interactive orbital rings before the star list mapping:

```tsx
<div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rotate-12 rounded-full border border-cherenkov/20" />
<div className="absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 -rotate-12 rounded-full border border-ember/20" />
```

Task 8 defines the `cherenkov` and `ember` Tailwind tokens.

- [ ] **Step 3: Verify types**

Run:

```bash
npx tsc --noEmit
```

Expected: command exits with code `0`.

- [ ] **Step 4: Commit scene composition**

```bash
git add components/3d/SpaceCanvas.tsx components/fallbacks/StarFallback.tsx
git commit -m "feat: compose expanded shattered star scene"
```

## Task 8: Tactical Palette And Global Styling

**Files:**
- Modify: `app/globals.css`
- Modify: `components/ui/FloatingNav.module.css`
- Test: `npm run lint`, `npx tsc --noEmit`

- [ ] **Step 1: Replace core color tokens**

In `app/globals.css`, replace the current color token section with:

```css
  --color-void: #030406;
  --color-void-2: #07111a;
  --color-surface: #081018;
  --color-surface-2: #101821;

  --color-ash: #c7d0d8;
  --color-cherenkov: #58f3ff;
  --color-ember: #ff7a45;
  --color-oxidized: #b8894d;
  --color-rust: #8a3f2d;
  --color-gravity: #6fa8ff;
  --color-threat: #d94a4a;

  --color-green: #58f3ff;
  --color-green-dim: #3fb8c6;
  --color-purple: #6fa8ff;
  --color-purple-hot: #9ec3ff;
  --color-purple-deep: #21314d;
  --color-blue: #58f3ff;
  --color-blue-hot: #dceeff;
  --color-blue-deep: #17303f;
  --color-red: #d94a4a;
  --color-orange: #ff7a45;

  --color-text-primary: #e6eef5;
  --color-text-secondary: #9aa8b4;
  --color-text-dim: #55616c;
  --color-text-mono: #58f3ff;

  --color-gold: #b8894d;
  --color-neutron: #ffffff;
```

- [ ] **Step 2: Replace glow custom properties**

In `:root`, replace the glow variables:

```css
  --green-glow: rgba(88, 243, 255, 0.16);
  --purple-glow: rgba(111, 168, 255, 0.18);
  --blue-glow: rgba(88, 243, 255, 0.14);
  --ember-glow: rgba(255, 122, 69, 0.18);
```

- [ ] **Step 3: Retune panels**

Update `.glass-panel`:

```css
.glass-panel {
  background: rgba(8, 16, 24, 0.66);
  backdrop-filter: blur(16px) saturate(145%);
  border: 1px solid rgba(199, 208, 216, 0.12);
  box-shadow:
    0 0 42px rgba(88, 243, 255, 0.05),
    inset 0 1px 0 rgba(255, 255, 255, 0.05);
}
```

Update `.glass-terminal`:

```css
.glass-terminal {
  background: rgba(3, 4, 6, 0.88);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(88, 243, 255, 0.18);
  box-shadow: 0 0 22px rgba(88, 243, 255, 0.08);
}
```

- [ ] **Step 4: Retune FloatingNav CSS**

In `components/ui/FloatingNav.module.css`, change the dock border and hover colors from purple/green to ash/cyan:

```css
  background: rgba(8, 16, 24, 0.66);
  border: 1px solid rgba(199, 208, 216, 0.14);
  box-shadow:
    0 0 40px rgba(88, 243, 255, 0.1),
    0 8px 32px rgba(0, 0, 0, 0.44),
    inset 0 1px 0 rgba(255, 255, 255, 0.05);
```

Set `.item:hover`, `.item:focus-visible`, `.itemActive`, and `.activeDot` to use `var(--color-cherenkov)`.

- [ ] **Step 5: Verify styling**

Run:

```bash
npm run lint
npx tsc --noEmit
```

Expected: both commands exit with code `0`.

- [ ] **Step 6: Commit palette**

```bash
git add app/globals.css components/ui/FloatingNav.module.css
git commit -m "style: apply shattered star tactical palette"
```

## Task 9: Content Reframe And Blog Anchor

**Files:**
- Create: `components/sections/BlogPreviewSection.tsx`
- Modify: `app/page.tsx`
- Modify: `app/layout.tsx`
- Modify: `components/ui/FloatingNav.tsx`
- Modify: `components/sections/AboutSection.tsx`
- Modify: `components/sections/ProjectsSection.tsx`
- Modify: `components/sections/SkillsSection.tsx`
- Modify: `components/sections/ExperienceSection.tsx`
- Modify: `components/sections/CertificationsSection.tsx`
- Modify: `components/sections/CTFSection.tsx`
- Modify: `components/sections/ContactSection.tsx`
- Test: `npm run lint`, `npx tsc --noEmit`

- [ ] **Step 1: Add Blog preview section**

Create `components/sections/BlogPreviewSection.tsx`:

```tsx
import { BookOpen, RadioTower } from "lucide-react";
import { GlitchText } from "@/components/ui/GlitchText";

const TRANSMISSIONS = [
  "technical writeups",
  "security notes",
  "project retrospectives",
  "research logs",
  "CTF analyses",
  "engineering breakdowns",
];

export function BlogPreviewSection() {
  return (
    <section
      id="blog"
      aria-labelledby="blog-heading"
      className="relative overflow-hidden px-6 py-24 sm:py-32"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_22%_28%,rgba(111,168,255,0.12),transparent_30%),radial-gradient(circle_at_82%_60%,rgba(255,122,69,0.1),transparent_34%)]" />

      <div className="relative z-10 mx-auto grid w-full max-w-[var(--content-max-width)] gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div>
          <p className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-[0.28em] text-gravity">
            recovered transmissions / blog
          </p>
          <GlitchText
            as="h2"
            id="blog-heading"
            text="BLOG"
            className="mt-3 font-[family-name:var(--font-display)] text-3xl font-bold tracking-wider text-text-primary sm:text-4xl"
          />
          <p className="mt-5 max-w-xl text-base leading-7 text-text-secondary">
            Decoded technical transmissions from collapsed pathway relays:
            writeups, experiments, retrospectives, and field notes.
          </p>
        </div>

        <div className="glass-terminal rounded-lg p-5 sm:p-6">
          <div className="mb-5 flex items-center justify-between border-b border-cherenkov/15 pb-3 font-[family-name:var(--font-mono)] text-xs uppercase tracking-[0.2em]">
            <span className="text-cherenkov">signal buffer</span>
            <span className="text-text-dim">routing damaged</span>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {TRANSMISSIONS.map((item) => (
              <div key={item} className="flex items-center gap-3 rounded border border-ash/10 bg-surface/60 px-4 py-3 text-sm text-text-secondary">
                <RadioTower className="size-4 text-ember" aria-hidden="true" />
                {item}
              </div>
            ))}
          </div>
          <div className="mt-5 flex items-center gap-3 text-sm text-text-dim">
            <BookOpen className="size-4 text-gravity" aria-hidden="true" />
            Full recovered-transmissions route follows in the blog phase.
          </div>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Insert Blog and rewrite the hero**

In `app/page.tsx`, import:

```ts
import { BlogPreviewSection } from "@/components/sections/BlogPreviewSection";
```

Replace the hero tagline and role with:

```tsx
<p className="font-[family-name:var(--font-jetbrains-mono)] text-cherenkov text-sm sm:text-base md:text-lg tracking-widest mb-8">
  <span className="text-text-secondary">archive@shattered-star:~$</span>{" "}
  <span className="text-cherenkov">scan operator-record</span>
</p>

<p className="font-[family-name:var(--font-dm-sans)] text-text-secondary text-lg sm:text-xl md:text-2xl mb-12">
  Cybersecurity Student · CTF Player · Builder · Recovered System Operator
</p>
```

Replace CTA labels:

```tsx
Recover archive
```

and:

```tsx
view dossier
```

Insert Blog before Contact:

```tsx
<CTFSection />
<BlogPreviewSection />
<ContactSection />
```

- [ ] **Step 3: Add Blog to FloatingNav**

In `components/ui/FloatingNav.tsx`, add `BookOpen` to the lucide import and insert this nav item before Contact:

```ts
{ id: "blog", label: "Blog", Icon: BookOpen },
```

- [ ] **Step 4: Update metadata**

In `app/layout.tsx`, set:

```ts
default: "Archive of the Shattered Star — Praneesh R V",
```

Use this description:

```ts
"Cybersecurity portfolio presented as a post-apocalyptic tactical archive around a shattered neutron-star civilization."
```

Set `viewport.themeColor` to:

```ts
themeColor: "#030406",
```

- [ ] **Step 5: Retheme section subtitles**

Make these text replacements:

```text
cockpit hud / about -> operator record / about
docking bay / projects -> recovered blueprints / projects
constellation / skills -> knowledge matrix / skills
deep space comms array -> long-range comms array
```

For `ExperienceSection.tsx`, set the eyebrow to:

```text
signal chronology / experience
```

For `CertificationsSection.tsx`, set the eyebrow to:

```text
authority seals / certifications
```

For `CTFSection.tsx`, set the eyebrow to:

```text
breach archive / ctf
```

- [ ] **Step 6: Verify content changes**

Run:

```bash
npm run lint
npx tsc --noEmit
```

Expected: both commands exit with code `0`.

- [ ] **Step 7: Commit content reframe**

```bash
git add app/page.tsx app/layout.tsx components/ui/FloatingNav.tsx components/sections/BlogPreviewSection.tsx components/sections/AboutSection.tsx components/sections/ProjectsSection.tsx components/sections/SkillsSection.tsx components/sections/ExperienceSection.tsx components/sections/CertificationsSection.tsx components/sections/CTFSection.tsx components/sections/ContactSection.tsx
git commit -m "feat: reframe portfolio as shattered star archive"
```

## Task 10: Final Verification And Browser Smoke

**Files:**
- No source files expected unless verification reveals a defect.
- Test: full local verification.

- [ ] **Step 1: Run static verification**

Run:

```bash
npm run verify:system
npm run lint
npx tsc --noEmit
npm run build
```

Expected:

```text
shattered-system: data contract valid
```

`npm run lint`, `npx tsc --noEmit`, and `npm run build` exit with code `0`.

- [ ] **Step 2: Start production server**

Run:

```bash
npm run start
```

Expected: Next serves the app on port `3000` or reports the active port.

- [ ] **Step 3: Browser smoke desktop**

Open the served URL in Playwright or a browser and verify:

- Hero text says `archive@shattered-star`.
- Canvas is nonblank.
- Mouse wheel zoom changes camera distance.
- Drag rotates the system.
- Right drag or two-finger gesture pans the view where supported.
- Planets and moons revolve.
- Major bodies rotate.
- Hovering a body reveals tactical label text.
- Clicking a section-linked body scrolls to the matching section.
- Blog section exists and is reachable by nav.
- Contact section remains reachable.

- [ ] **Step 4: Browser smoke mobile viewport**

Use viewport width `390` and height `844`. Verify:

- Hero text does not overlap.
- Floating nav fits or hides narrow items.
- Canvas remains nonblank.
- Scroll navigation works.
- Reduced density does not remove access to sections.

- [ ] **Step 5: Reduced motion check**

Use a reduced-motion browser context or OS setting. Verify:

- Auto-rotation stops or becomes minimal.
- Focus transitions do not make aggressive camera moves.
- Normal scroll navigation still works.

- [ ] **Step 6: Commit verification fixes when verification produces source edits**

If verification required source edits, commit only the edited files from this phase. Use the specific file paths reported by `git status --short`; do not stage unrelated dirty files.

```bash
git status --short
git add components/3d/SpaceCanvas.tsx components/3d/NeutronStar.tsx components/3d/DysonSphere.tsx components/3d/SystemCamera.tsx components/3d/OrbitalBodies.tsx components/3d/Megastructures.tsx components/3d/PathwayRemnants.tsx components/3d/TacticalLabel.tsx components/3d/shatteredSystem.ts components/3d/index.ts components/fallbacks/StarFallback.tsx components/ui/FloatingNav.tsx components/ui/FloatingNav.module.css components/sections/AboutSection.tsx components/sections/ProjectsSection.tsx components/sections/SkillsSection.tsx components/sections/ExperienceSection.tsx components/sections/CertificationsSection.tsx components/sections/CTFSection.tsx components/sections/ContactSection.tsx components/sections/BlogPreviewSection.tsx app/page.tsx app/layout.tsx app/globals.css content/data/shattered-system.json scripts/verify-shattered-system.mjs package.json stores/globalStore.ts
git commit -m "fix: stabilize shattered star core reforge"
```

If no fixes were required, do not run `git commit`.

## Self-Review

Spec coverage:

- Core concept and palette are covered in Tasks 8 and 9.
- Data-driven planets, moons, megastructures, and pathways are covered in Tasks 1, 2, and 6.
- Zoomable, movable, observable, and visitable space is covered in Task 3.
- Rotations and revolutions are covered in Tasks 1 and 6.
- Neutron star realism upgrade is covered in Task 4.
- Dyson sphere 33% destruction is covered in Task 5.
- Blog mapping is covered in Task 9.
- Accessibility and fallback behavior are covered in Tasks 7, 9, and 10.
- Performance scaling is covered in Tasks 7 and 10.

Placeholder scan:

- No placeholder markers, incomplete steps, or unspecified file paths remain.
- Future-phase features are explicitly excluded from this plan and retained in the design spec.

Type consistency:

- `sectionId`, `anchorId`, and `focusedSystemNodeId` names are consistent across data, store, and components.
- `MegastructureKind`, `PlanetConfig`, `MoonConfig`, and `PathwayConfig` are defined before use.
- The verifier enforces the user-approved counts and Dyson destruction fraction before the 3D scene consumes the data.
