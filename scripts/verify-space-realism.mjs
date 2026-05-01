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
  gitignore: readRequiredSource(".gitignore"),
  globalStore: readRequiredSource("stores/globalStore.ts"),
  gasGiantShader: readRequiredSource("shaders/gasGiantSurface.ts"),
  orbitalBodies: readRequiredSource("components/3d/OrbitalBodies.tsx"),
  planetSurface: readRequiredSource("components/3d/PlanetSurface.tsx"),
  spaceCanvas: readRequiredSource("components/3d/SpaceCanvas.tsx"),
  starfield: readRequiredSource("components/3d/Starfield.tsx"),
  systemCamera: readRequiredSource("components/3d/SystemCamera.tsx"),
  atmosphereShader: readRequiredSource("shaders/planetAtmosphere.ts"),
};

const hexColorPattern = /^#[0-9a-fA-F]{6}$/;
const expectedTextureIds = {
  earth: {
    diffuseMap: "procedural:earth-diffuse-v1",
    normalMap: "procedural:earth-normal-v1",
    roughnessMap: "procedural:earth-roughness-v1",
  },
  "gas-giant": {
    diffuseMap: "procedural:gas-giant-diffuse-v1",
    normalMap: "procedural:gas-giant-normal-v1",
    roughnessMap: "procedural:gas-giant-roughness-v1",
  },
  ice: {
    diffuseMap: "procedural:ice-diffuse-v1",
    normalMap: "procedural:ice-normal-v1",
    roughnessMap: "procedural:ice-roughness-v1",
  },
  mars: {
    diffuseMap: "procedural:mars-diffuse-v1",
    normalMap: "procedural:mars-normal-v1",
    roughnessMap: "procedural:mars-roughness-v1",
  },
};

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
  realisticPlanets.length >= 4,
  `expected at least 4 realistic planets, got ${realisticPlanets.length}`,
);

const profiles = new Set(
  realisticPlanets.map((planet) => planet.realism.profile),
);
assert(profiles.has("earth"), "missing earth realism profile");
assert(profiles.has("gas-giant"), "missing gas-giant realism profile");
assert(profiles.has("ice"), "missing ice realism profile");
assert(profiles.has("mars"), "missing mars realism profile");

for (const planet of realisticPlanets) {
  const realism = planet.realism;
  assertString(realism.profile, `planet ${planet.id} realism profile`);
  assertString(realism.diffuseMap, `planet ${planet.id} diffuseMap`);
  assertString(realism.normalMap, `planet ${planet.id} normalMap`);
  assertString(realism.roughnessMap, `planet ${planet.id} roughnessMap`);
  const expected = expectedTextureIds[realism.profile];
  assert(expected, `planet ${planet.id} uses unsupported realism profile`);
  assert(
    realism.diffuseMap === expected.diffuseMap,
    `planet ${planet.id} diffuseMap must be ${expected.diffuseMap}`,
  );
  assert(
    realism.normalMap === expected.normalMap,
    `planet ${planet.id} normalMap must be ${expected.normalMap}`,
  );
  assert(
    realism.roughnessMap === expected.roughnessMap,
    `planet ${planet.id} roughnessMap must be ${expected.roughnessMap}`,
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
  assertFiniteNumber(
    realism.atmosphere.shellScale,
    `planet ${planet.id} atmosphere shellScale`,
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

const ringedPlanets = system.planets.filter((planet) => planet.rings);
assert(ringedPlanets.length >= 1, "expected at least one ringed planet");

for (const planet of ringedPlanets) {
  assertHexColor(planet.rings.color, `planet ${planet.id} ring color`);
  assertRange(planet.rings.innerRadius, 1, 3, `planet ${planet.id} ring inner`);
  assertRange(planet.rings.outerRadius, 1, 4, `planet ${planet.id} ring outer`);
  assert(
    planet.rings.outerRadius > planet.rings.innerRadius,
    `planet ${planet.id} ring outer must exceed inner`,
  );
  assertRange(planet.rings.gap, 0, 1, `planet ${planet.id} ring gap`);
  assertRange(
    planet.rings.opacity,
    0.05,
    0.9,
    `planet ${planet.id} ring opacity`,
  );
  assertFiniteNumber(planet.rings.tilt, `planet ${planet.id} ring tilt`);
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
  "displacementMap",
  "near-surface displacement material wiring",
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
  "planetSurface",
  "usePlanetLOD",
  "camera-distance LOD hook",
);
assertSourceIncludes(
  "planetSurface",
  "RING_FRAGMENT_SHADER",
  "ring shader with Cassini-style gap",
);
assertSourceIncludes(
  "gasGiantShader",
  "fbm",
  "gas giant animated fBm band shader",
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
assertSourceIncludes("spaceCanvas", "SSAO", "screen-space ambient occlusion");
assertSourceIncludes(
  "spaceCanvas",
  "50000",
  "high-tier dense procedural starfield",
);
assertSourceIncludes("spaceCanvas", "shadows={tier > 1}", "tiered shadows");
assertSourceIncludes("starfield", "aColor", "star color temperature variation");
assertSourceIncludes("systemCamera", "gsap.timeline", "GSAP camera tweening");
assertSourceIncludes("systemCamera", "freefly", "free-fly camera mode");
assertSourceIncludes(
  "systemCamera",
  "requestPointerLock",
  "pointer-lock free-fly entry",
);
assertSourceIncludes("globalStore", "SystemCameraMode", "camera mode store");
assertSourceIncludes(
  "gitignore",
  "/public/textures/",
  "large texture asset git ignore",
);

console.log("space-realism: planet surface contract valid");
console.log(`realisticPlanets=${realisticPlanets.length}`);
console.log(`profiles=${Array.from(profiles).sort().join(",")}`);
console.log(`ringedPlanets=${ringedPlanets.length}`);
