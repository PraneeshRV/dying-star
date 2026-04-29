import type { MetadataRoute } from "next";
import { SITE_DESCRIPTION, SITE_NAME } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Archive of the Shattered Star - Praneesh R V",
    short_name: SITE_NAME,
    description: SITE_DESCRIPTION,
    start_url: "/",
    display: "standalone",
    background_color: "#030406",
    theme_color: "#030406",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
