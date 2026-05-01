import { existsSync, readFileSync, statSync } from "node:fs";
import { dirname, extname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const ledgerPath = join(root, "content/data/space-asset-ledger.json");

const sourceTypes = new Set([
  "procedural",
  "external",
  "generated",
  "authored",
]);
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
  assert(existsSync(path), `${label} file is missing`);
  return JSON.parse(readFileSync(path, "utf8"));
}

function validateAsset(asset) {
  assertObject(asset, "asset entry");
  assertString(asset.id, "asset id");
  assertString(asset.sourceType, `asset ${asset.id} sourceType`);
  assert(
    sourceTypes.has(asset.sourceType),
    `asset ${asset.id} sourceType is invalid`,
  );
  assertString(asset.runtimeFormat, `asset ${asset.id} runtimeFormat`);
  assert(
    runtimeFormats.has(asset.runtimeFormat),
    `asset ${asset.id} runtimeFormat is invalid`,
  );
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
        extension === asset.runtimeFormat ||
          asset.runtimeFormat === "procedural",
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
assertNumber(
  ledger.policy.initialDesktopTransferKb,
  "initialDesktopTransferKb",
);
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
