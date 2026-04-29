import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import type { NextConfig } from "next";

const projectRoot = dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  /* Performance */
  reactStrictMode: true,

  /* Keep Turbopack scoped to this app even if parent folders have lockfiles. */
  turbopack: {
    root: projectRoot,
  },

  /* Experimental features */
  experimental: {
    /* Enable View Transitions API for route changes */
    viewTransition: true,
  },
};

export default nextConfig;
