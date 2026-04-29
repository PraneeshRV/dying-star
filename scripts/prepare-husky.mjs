import { spawnSync } from "node:child_process";
import { accessSync, constants, existsSync } from "node:fs";

if (
  process.env.CI === "true" ||
  process.env.VERCEL ||
  process.env.HUSKY === "0"
) {
  console.log("husky skipped in CI/deployment environment");
  process.exit(0);
}

if (!existsSync(".git")) {
  console.log("husky skipped: .git directory not found");
  process.exit(0);
}

try {
  accessSync(".git/config", constants.W_OK);
} catch {
  console.log("husky skipped: .git/config is not writable");
  process.exit(0);
}

const result = spawnSync("husky", {
  shell: true,
  stdio: "inherit",
});

process.exit(result.status ?? 1);
