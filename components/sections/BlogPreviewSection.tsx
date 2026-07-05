import { ExternalLink } from "lucide-react";
import writeupsData from "@/content/data/writeups.json";
import type { Writeup } from "@/types";

// TODO-PRANEESH: 3 entries below are grounded in repo artifacts (experience.json /
// projects.json). These dispatcher-named writeup sources live in 2nd-brain and
// were not reachable from this sandbox — add them once the source text is supplied:
//   - ActiveDirectory/  (category likely "Active Directory")
//   - HTB Apocalypse Blockchain  (category "Blockchain")
//   - Echoes of the Abyss OSINT  (category "OSINT")
//   - Expressway  (category likely "Networking" or "Web")
const WRITEUPS = writeupsData as Writeup[];

const CATEGORY_BADGE: Record<Writeup["category"], string> = {
  OSINT: "border-cherenkov/40 bg-cherenkov/10 text-cherenkov",
  "AI Security": "border-ember/40 bg-ember/10 text-ember",
  Forensics: "border-gravity/40 bg-gravity/10 text-gravity",
  Web: "border-ember/40 bg-ember/10 text-ember",
  Blockchain: "border-ash/40 bg-ash/10 text-ash",
  Networking: "border-blue/40 bg-blue/10 text-blue-hot",
  "Active Directory": "border-red/40 bg-red/10 text-red",
};

export function BlogPreviewSection() {
  return (
    <section
      id="blog"
      aria-labelledby="blog-heading"
      className="relative overflow-hidden bg-void px-6 py-24 sm:py-32"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(88,243,255,0.12),transparent_30%),radial-gradient(circle_at_82%_36%,rgba(255,122,69,0.1),transparent_32%),linear-gradient(180deg,rgba(8,16,24,0.86),rgba(3,4,6,0.94))]"
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto w-full max-w-[var(--content-max-width)]">
        <div className="mb-10 max-w-3xl">
          <p className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-[0.28em] text-cherenkov">
            proof of work / writeups
          </p>
          <h2
            id="blog-heading"
            className="mt-3 font-[family-name:var(--font-display)] text-3xl font-bold tracking-wider text-text-primary sm:text-4xl"
          >
            WRITEUPS
          </h2>
          <p className="mt-4 text-base leading-7 text-text-secondary">
            Public artifacts from CTF solves and security research — challenge
            writeups, attack-scenario builds, and reproducible red-team proof.
          </p>
        </div>

        <ul className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {WRITEUPS.map((writeup) => (
            <li key={writeup.id}>
              <article className="glass-panel flex h-full flex-col rounded-lg p-5 transition duration-[var(--duration-normal)] hover:border-cherenkov/45">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <span
                    className={`inline-flex items-center rounded-sm border px-2.5 py-1 font-[family-name:var(--font-mono)] text-[0.68rem] font-semibold uppercase tracking-[0.14em] ${CATEGORY_BADGE[writeup.category]}`}
                  >
                    {writeup.category}
                  </span>
                  <span className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-[0.16em] text-text-dim">
                    {writeup.date}
                  </span>
                </div>

                <h3 className="font-[family-name:var(--font-display)] text-lg font-semibold leading-snug text-text-primary">
                  {writeup.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-text-secondary">
                  {writeup.excerpt}
                </p>

                {writeup.tags && writeup.tags.length > 0 && (
                  <ul
                    className="mt-4 flex flex-wrap gap-2"
                    aria-label={`Tags for ${writeup.title}`}
                  >
                    {writeup.tags.map((tag) => (
                      <li
                        key={tag}
                        className="rounded-sm border border-blue-hot/25 bg-blue-hot/10 px-2 py-0.5 font-[family-name:var(--font-mono)] text-[0.64rem] uppercase tracking-[0.12em] text-blue-hot"
                      >
                        {tag}
                      </li>
                    ))}
                  </ul>
                )}

                <a
                  href={writeup.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 inline-flex items-center gap-2 self-start font-[family-name:var(--font-mono)] text-xs uppercase tracking-[0.16em] text-cherenkov transition hover:text-ember"
                  aria-label={`Open writeup: ${writeup.title}`}
                >
                  Read writeup
                  <ExternalLink className="size-3.5" aria-hidden="true" />
                </a>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
