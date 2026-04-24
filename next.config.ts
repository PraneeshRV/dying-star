import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Performance */
  reactStrictMode: true,

  /* Image optimization for space textures */
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },

  /* Experimental features */
  experimental: {
    /* Enable View Transitions API for route changes */
    viewTransition: true,
  },
};

export default nextConfig;
