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

function assert(condition, message) {
  if (!condition) {
    console.error(`System data invalid: ${message}`);
    process.exit(1);
  }
}

assert(system.name === "Archive of the Shattered Star", "system name mismatch");
assert(
  system.dysonSphere.destroyedFraction === 0.33,
  "Dyson destruction must be 0.33",
);
assert(
  system.planets.length >= 7 && system.planets.length <= 9,
  "expected 7-9 major planets",
);
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
  assert(
    bodyIds.has(section.anchorId),
    `section ${section.id} points to missing anchor ${section.anchorId}`,
  );
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
