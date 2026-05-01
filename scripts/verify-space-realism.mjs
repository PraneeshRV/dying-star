import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const system = JSON.parse(
  readFileSync(join(root, "content/data/shattered-system.json"), "utf8"),
);
function readRequiredSource(relativePath) {
  const fullPath = join(root, relativePath);

  if (!existsSync(fullPath)) {
    console.error(
      `space-realism invalid: missing required file ${relativePath}`,
    );
    process.exit(1);
  }

  return readFileSync(fullPath, "utf8");
}

const source = {
  orbitalBodies: readRequiredSource("components/3d/OrbitalBodies.tsx"),
  planetSurface: readRequiredSource("components/3d/PlanetSurface.tsx"),
  spaceCanvas: readRequiredSource("components/3d/SpaceCanvas.tsx"),
  atmosphereShader: readRequiredSource("shaders/planetAtmosphere.ts"),
};

const hexColorPattern = /^#[0-9a-fA-F]{6}$/;

function assert(condition, message) {
  if (!condition) {
    console.error(`space-realism invalid: ${message}`);
    process.exit(1);
  }
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

function assertRange(value, min, max, label) {
  assertFiniteNumber(value, label);
  assert(
    value >= min && value <= max,
    `${label} must be between ${min} and ${max}`,
  );
}

function assertHexColor(value, label) {
  assertString(value, label);
  assert(hexColorPattern.test(value), `${label} must be a #RRGGBB hex color`);
}

function assertSourceIncludes(fileKey, expected, label) {
  assert(
    source[fileKey].includes(expected),
    `${label} must include ${expected}`,
  );
}

assert(Array.isArray(system.planets), "system planets must be an array");

const realisticPlanets = system.planets.filter((planet) => planet.realism);
assert(
  realisticPlanets.length === 2,
  `expected 2 realistic planets, got ${realisticPlanets.length}`,
);

const profiles = new Set(
  realisticPlanets.map((planet) => planet.realism.profile),
);
assert(profiles.has("earth"), "missing earth realism profile");
assert(profiles.has("mars"), "missing mars realism profile");

for (const planet of realisticPlanets) {
  const realism = planet.realism;
  assertString(realism.profile, `planet ${planet.id} realism profile`);
  assertString(realism.diffuseMap, `planet ${planet.id} diffuseMap`);
  assertString(realism.normalMap, `planet ${planet.id} normalMap`);
  assertString(realism.roughnessMap, `planet ${planet.id} roughnessMap`);
  assert(
    realism.diffuseMap.startsWith("procedural:"),
    `planet ${planet.id} diffuseMap should use procedural tracked texture fallback`,
  );
  assert(
    realism.normalMap.startsWith("procedural:"),
    `planet ${planet.id} normalMap should use procedural tracked texture fallback`,
  );
  assert(
    realism.roughnessMap.startsWith("procedural:"),
    `planet ${planet.id} roughnessMap should use procedural tracked texture fallback`,
  );

  assert(realism.atmosphere, `planet ${planet.id} must define atmosphere`);
  assertHexColor(
    realism.atmosphere.color,
    `planet ${planet.id} atmosphere color`,
  );
  assertRange(
    realism.atmosphere.opacity,
    0.05,
    0.9,
    `planet ${planet.id} atmosphere opacity`,
  );
  assertRange(
    realism.atmosphere.rayleigh,
    0.1,
    2,
    `planet ${planet.id} atmosphere rayleigh`,
  );
  assertRange(
    realism.atmosphere.mie,
    0,
    1,
    `planet ${planet.id} atmosphere mie`,
  );
  assertPositiveNumber(
    realism.atmosphere.falloff,
    `planet ${planet.id} atmosphere falloff`,
  );
  assert(
    realism.atmosphere.shellScale > 1,
    `planet ${planet.id} atmosphere shellScale must exceed 1`,
  );

  if (realism.profile === "earth") {
    assertString(realism.nightMap, `planet ${planet.id} nightMap`);
    assertString(realism.cloudMap, `planet ${planet.id} cloudMap`);
  }
}

assertSourceIncludes(
  "orbitalBodies",
  "PlanetSurfaceLayer",
  "OrbitalBodies realistic surface integration",
);
assertSourceIncludes(
  "planetSurface",
  "meshStandardMaterial",
  "realistic planet base material",
);
assertSourceIncludes(
  "planetSurface",
  "normalMap",
  "normal map material wiring",
);
assertSourceIncludes(
  "planetSurface",
  "roughnessMap",
  "roughness map material wiring",
);
assertSourceIncludes(
  "planetSurface",
  "NightSideLights",
  "earth night map shader layer",
);
assertSourceIncludes("planetSurface", "PlanetCloudLayer", "earth cloud layer");
assertSourceIncludes(
  "planetSurface",
  "DataTexture",
  "procedural texture generation",
);
assertSourceIncludes(
  "atmosphereShader",
  "ATMOSPHERE_FRAGMENT_SHADER",
  "atmosphere shader export",
);
assertSourceIncludes(
  "atmosphereShader",
  "Rayleigh",
  "atmosphere Rayleigh scattering note",
);
assertSourceIncludes(
  "atmosphereShader",
  "Mie",
  "atmosphere Mie scattering note",
);
assertSourceIncludes(
  "spaceCanvas",
  "position={[0, 0, 0]}",
  "central star light model",
);

console.log("space-realism: planet surface contract valid");
console.log(`realisticPlanets=${realisticPlanets.length}`);
console.log(`profiles=${Array.from(profiles).sort().join(",")}`);
