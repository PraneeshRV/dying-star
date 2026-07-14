import type { MetadataRoute } from "next";
import { SITE_DESCRIPTION, SITE_NAME } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Praneesh R V — Cybersecurity researcher",
    short_name: SITE_NAME,
    description: SITE_DESCRIPTION,
    start_url: "/",
    display: "standalone",
    background_color: "#0a0a0c",
    theme_color: "#0a0a0c",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
