import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, extname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));

const capabilityPath = join(root, "lib/render/capability.ts");
const performancePolicyPath = join(root, "lib/render/performancePolicy.ts");
const renderRootPath = join(root, "components/sandbox/render/RenderRoot.tsx");
const testStarMaterialPath = join(
  root,
  "components/sandbox/render/materials/testStarMaterial.ts",
);

function fail(message) {
  console.error(`sandbox-render invalid: ${message}`);
  process.exit(1);
}

function assert(condition, message) {
  if (!condition) {
    fail(message);
  }
}

function readSource(path, label) {
  assert(existsSync(path), `${label} file is missing at ${path}`);
  return readFileSync(path, "utf8");
}

function walkSourceFiles(dir, files) {
  if (!existsSync(dir)) {
    return files;
  }
  for (const entry of readdirSync(dir)) {
    if (entry === "node_modules") {
      continue;
    }
    const fullPath = join(dir, entry);
    const stats = statSync(fullPath);
    if (stats.isDirectory()) {
      walkSourceFiles(fullPath, files);
    } else if ([".ts", ".tsx"].includes(extname(fullPath))) {
      files.push(fullPath);
    }
  }
  return files;
}

// 1. lib/render/capability.ts
const capabilitySource = readSource(capabilityPath, "capability");
assert(
  /export\s+async\s+function\s+detectCapability/.test(capabilitySource),
  "capability.ts must export an async function detectCapability",
);
assert(
  /requestAdapter/.test(capabilitySource),
  "capability.ts must reference requestAdapter for the adapter null-check",
);
for (const mode of ["webgpu", "webgl2", "static"]) {
  assert(
    capabilitySource.includes(`"${mode}"`) ||
      capabilitySource.includes(`'${mode}'`),
    `capability.ts must contain the mode literal "${mode}"`,
  );
}

// 2. lib/render/performancePolicy.ts
const performancePolicySource = readSource(
  performancePolicyPath,
  "performancePolicy",
);
assert(
  /export\s+function\s+policy/.test(performancePolicySource),
  "performancePolicy.ts must export a function policy",
);

const sourceFiles = [
  ...walkSourceFiles(join(root, "lib"), []),
  ...walkSourceFiles(join(root, "components"), []),
];
const filesWith60000 = sourceFiles.filter((file) =>
  readFileSync(file, "utf8").includes("60000"),
);
assert(
  filesWith60000.length === 1 && filesWith60000[0] === performancePolicyPath,
  `the literal 60000 must appear only in performancePolicy.ts (found in: ${filesWith60000.join(", ") || "no files"})`,
);

// 3. components/sandbox/render/RenderRoot.tsx
const renderRootSource = readSource(renderRootPath, "RenderRoot");
for (const marker of ["webgpu", "webgl2", "static"]) {
  assert(
    renderRootSource.includes(`"${marker}"`) ||
      renderRootSource.includes(`'${marker}'`),
    `RenderRoot.tsx must contain the branch marker "${marker}"`,
  );
}
assert(
  renderRootSource.includes("StarFallback"),
  "RenderRoot.tsx must reference the static fallback StarFallback",
);
assert(
  renderRootSource.includes('import("three/webgpu")') ||
    /import\(\s*["']three\/webgpu["']\s*\)/.test(renderRootSource),
  "RenderRoot.tsx must dynamically import three/webgpu",
);
const staticWebgpuImport =
  /^import\s+\{[^}]*\}\s+from\s+["']three\/webgpu["']/m;
const staticWebgpuMatch = renderRootSource.match(staticWebgpuImport);
assert(
  staticWebgpuMatch === null || /^import\s+type\b/.test(staticWebgpuMatch[0]),
  "RenderRoot.tsx must not statically import three/webgpu (type-only imports allowed)",
);
assert(
  /\.init\(\)/.test(renderRootSource),
  "RenderRoot.tsx must call renderer.init() before the first frame",
);

// 4. components/sandbox/render/materials/testStarMaterial.ts
const testStarMaterialSource = readSource(
  testStarMaterialPath,
  "testStarMaterial",
);
assert(
  /export\s+function\s+createTestStarMaterial/.test(testStarMaterialSource),
  "testStarMaterial.ts must export a function createTestStarMaterial",
);

console.log("sandbox-render OK");
