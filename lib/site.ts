export const SITE_URL = (
  process.env.SITE_URL ?? "https://praneeshrv.me"
).replace(/\/$/, "");

export const SITE_NAME = "Praneesh R V";
export const SITE_TITLE = "Archive of the Shattered Star - Praneesh R V";
export const SITE_DESCRIPTION =
  "Praneesh R V's cybersecurity portfolio: CTF results, security projects, skills, and technical writeups presented as a post-apocalyptic shattered-star archive.";
export const SITE_KEYWORDS = [
  "Praneesh R V",
  "cybersecurity portfolio",
  "CTF player India",
  "web exploitation",
  "OSINT",
  "Arch Linux",
  "security researcher",
] as const;

export function absoluteUrl(path = "/") {
  return new URL(path, SITE_URL).toString();
}
