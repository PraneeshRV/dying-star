import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

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

const expectedCounts = {
  planets: 8,
  moons: 14,
  megastructures: 9,
  pathways: 3,
};

const hexColorPattern = /^#[0-9a-fA-F]{6}$/;

function assert(condition, message) {
  if (!condition) {
    console.error(`System data invalid: ${message}`);
    process.exit(1);
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

function assertPositiveNumber(value, label) {
  assertFiniteNumber(value, label);
  assert(value > 0, `${label} must be positive`);
}

function assertNonzeroNumber(value, label) {
  assertFiniteNumber(value, label);
  assert(value !== 0, `${label} must be nonzero`);
}

function assertHexColor(value, label) {
  assertString(value, label);
  assert(hexColorPattern.test(value), `${label} must be a #RRGGBB hex color`);
}

function assertExactCount(collection, label) {
  assert(
    collection.length === expectedCounts[label],
    `expected ${expectedCounts[label]} ${label}, got ${collection.length}`,
  );
}

function assertSceneBody(body, collectionName, sectionIds) {
  assertObject(body, `${collectionName} entry`);
  assertString(body.id, `${collectionName} entry id`);
  assertString(body.sectionId, `${collectionName} ${body.id} sectionId`);
  assert(
    sectionIds.has(body.sectionId),
    `${collectionName} ${body.id} points to invalid section ${body.sectionId}`,
  );

  assertHexColor(body.color, `${collectionName} ${body.id} color`);

  if (collectionName !== "pathways") {
    assertHexColor(body.emissive, `${collectionName} ${body.id} emissive`);
  }
}

assertObject(system, "system");
assertObject(system.palette, "palette");
assertObject(system.dysonSphere, "dysonSphere");
assertArray(system.sections, "sections");
assertArray(system.planets, "planets");
assertArray(system.moons, "moons");
assertArray(system.megastructures, "megastructures");
assertArray(system.pathways, "pathways");

assert(system.name === "Archive of the Shattered Star", "system name mismatch");
assert(
  system.dysonSphere.destroyedFraction === 0.33,
  "Dyson destruction must be 0.33",
);
assertExactCount(system.planets, "planets");
assertExactCount(system.moons, "moons");
assertExactCount(system.megastructures, "megastructures");
assertExactCount(system.pathways, "pathways");

for (const [colorName, colorValue] of Object.entries(system.palette)) {
  assertHexColor(colorValue, `palette ${colorName}`);
}

const sectionIds = new Set(requiredSections);

for (const section of system.sections) {
  assertObject(section, "section entry");
  assertString(section.id, "section entry id");
  assert(
    sectionIds.has(section.id),
    `section ${section.id} is not a required section`,
  );
  assertString(section.anchorId, `section ${section.id} anchorId`);
}

assert(
  system.sections.length === requiredSections.length,
  `expected ${requiredSections.length} sections, got ${system.sections.length}`,
);

const seenSectionIds = new Set();

for (const section of system.sections) {
  assert(
    !seenSectionIds.has(section.id),
    `duplicate section id: ${section.id}`,
  );
  seenSectionIds.add(section.id);
}

for (const sectionId of requiredSections) {
  assert(
    seenSectionIds.has(sectionId),
    `missing section mapping: ${sectionId}`,
  );
}

const bodyIds = new Set();

for (const [collectionName, collection] of [
  ["planets", system.planets],
  ["moons", system.moons],
  ["megastructures", system.megastructures],
  ["pathways", system.pathways],
]) {
  for (const body of collection) {
    assertSceneBody(body, collectionName, sectionIds);
    assert(!bodyIds.has(body.id), `duplicate scene body id: ${body.id}`);
    bodyIds.add(body.id);
  }
}

for (const section of system.sections) {
  assert(
    bodyIds.has(section.anchorId),
    `section ${section.id} points to missing anchor ${section.anchorId}`,
  );
}

for (const moon of system.moons) {
  assertString(moon.parentId, `moon ${moon.id} parentId`);
  assert(
    system.planets.some((planet) => planet.id === moon.parentId),
    `moon ${moon.id} points to missing planet ${moon.parentId}`,
  );
}

for (const planet of system.planets) {
  assertPositiveNumber(planet.orbitRadius, `planet ${planet.id} orbitRadius`);
  assertPositiveNumber(planet.size, `planet ${planet.id} size`);
  assertFiniteNumber(planet.inclination, `planet ${planet.id} inclination`);
  assertNonzeroNumber(
    planet.rotationSpeed,
    `planet ${planet.id} rotationSpeed`,
  );
  assertNonzeroNumber(planet.orbitSpeed, `planet ${planet.id} orbitSpeed`);
}

for (const moon of system.moons) {
  assertPositiveNumber(moon.orbitRadius, `moon ${moon.id} orbitRadius`);
  assertPositiveNumber(moon.size, `moon ${moon.id} size`);
  assertNonzeroNumber(moon.rotationSpeed, `moon ${moon.id} rotationSpeed`);
  assertNonzeroNumber(moon.orbitSpeed, `moon ${moon.id} orbitSpeed`);
}

for (const structure of system.megastructures) {
  assertPositiveNumber(
    structure.orbitRadius,
    `megastructure ${structure.id} orbitRadius`,
  );
  assertNonzeroNumber(
    structure.rotationSpeed,
    `megastructure ${structure.id} rotationSpeed`,
  );
  assertNonzeroNumber(
    structure.orbitSpeed,
    `megastructure ${structure.id} orbitSpeed`,
  );
}

for (const pathway of system.pathways) {
  assertPositiveNumber(pathway.radius, `pathway ${pathway.id} radius`);
  assertFiniteNumber(pathway.arcStart, `pathway ${pathway.id} arcStart`);
  assertFiniteNumber(pathway.arcEnd, `pathway ${pathway.id} arcEnd`);
  assert(
    pathway.arcEnd > pathway.arcStart,
    `pathway ${pathway.id} arcEnd must be greater than arcStart`,
  );
}

console.log("shattered-system: data contract valid");
console.log(`planets=${system.planets.length}`);
console.log(`moons=${system.moons.length}`);
console.log(`megastructures=${system.megastructures.length}`);
console.log(`pathways=${system.pathways.length}`);
