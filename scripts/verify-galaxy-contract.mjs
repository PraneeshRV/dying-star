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
assert(
  galaxy.id === "black-hole-galaxy",
  "galaxy id must be black-hole-galaxy",
);
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

const currentSections = new Set(
  shattered.sections.map((section) => section.id),
);
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
  assert(
    ["full", "impostor", "fallback"].includes(system.detailMode),
    `system ${system.id} detailMode is invalid`,
  );
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
