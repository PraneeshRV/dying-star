export const SITE_URL = (
  process.env.SITE_URL ?? "https://praneeshrv.me"
).replace(/\/$/, "");

export const SITE_NAME = "Praneesh R V";
export const SITE_TITLE = "Archive of the Shattered Star - Praneesh R V";
export const SITE_DESCRIPTION =
  "Praneesh R V's cybersecurity portfolio: agentic AI red teaming, VAPT tooling, Azure/IAM internship work, CTF infrastructure, and Team Hunter competition results presented as an interactive shattered-star archive.";
export const SITE_KEYWORDS = [
  "Praneesh R V",
  "cybersecurity portfolio",
  "CTF player India",
  "agentic AI red teaming",
  "AI security",
  "VAPT",
  "Azure IAM",
  "web exploitation",
  "OSINT",
  "security researcher",
] as const;

export function absoluteUrl(path = "/") {
  return new URL(path, SITE_URL).toString();
}
