/* ═══════════════════════════════════════════════════
   Type Definitions — Praneesh Portfolio
   ═══════════════════════════════════════════════════ */

/** GPU performance tier for progressive enhancement */
export type GPUTier = 1 | 2 | 3 | 4;

/** Project data shape */
export interface Project {
  id: string;
  title: string;
  description: string;
  techStack: string[];
  category: "security" | "tools" | "infrastructure" | "ctf" | "wip";
  status: "active" | "wip" | "archived";
  liveUrl?: string;
  sourceUrl?: string;
  image?: string;
}

/** Skill data shape */
export interface Skill {
  name: string;
  category: "security" | "development" | "infrastructure" | "tools";
  proficiency: 1 | 2 | 3 | 4 | 5;
  icon?: string;
}

/** Experience/Timeline entry */
export interface TimelineEntry {
  id: string;
  year: string;
  title: string;
  description: string;
  type: "education" | "ctf" | "project" | "certification" | "milestone";
}

/** CTF Achievement */
export interface CTFAchievement {
  competition: string;
  result: string;
  year: number;
  url?: string;
}

/** Blog post frontmatter */
export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  category: "writeup" | "research" | "arch" | "build" | "thoughts";
  tags: string[];
  readTime: string;
}

/** Terminal command handler */
export interface TerminalCommand {
  name: string;
  description: string;
  handler: () => string | string[];
}

/** Navigation item */
export interface NavItem {
  label: string;
  href: string;
  icon?: string;
}
