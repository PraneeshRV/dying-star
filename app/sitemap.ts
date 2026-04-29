import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/site";

const LAST_MODIFIED = new Date("2026-04-29T00:00:00.000Z");

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: absoluteUrl("/"),
      lastModified: LAST_MODIFIED,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: absoluteUrl("/resume"),
      lastModified: LAST_MODIFIED,
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];
}
