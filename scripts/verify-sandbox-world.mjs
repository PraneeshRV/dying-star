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
      assert(action.href.startsWith("/#"), "section action must use /# anchor");
    }
    if (action.kind === "route") {
      assert(action.href.startsWith("/"), "route action must use local path");
    }
    if (action.kind === "external") {
      assert(action.href.startsWith("https://"), "external action must use https");
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
  assert(
    objective.objectIds.length >= 1,
    `objective ${objective.id} needs objects`,
  );
  for (const objectId of objective.objectIds) {
    assert(
      objectIds.has(objectId),
      `objective ${objective.id} has missing object ${objectId}`,
    );
  }
}

assert(
  objectiveIds.has(world.entry.introObjectiveId),
  "entry introObjectiveId must point to an objective",
);

console.log(
  `sandbox-world ok: ${world.objects.length} objects, ${world.objectives.length} objectives`,
);
