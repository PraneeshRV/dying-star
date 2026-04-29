import { BookOpen, RadioTower } from "lucide-react";
import { GlitchText } from "@/components/ui/GlitchText";

const BLOG_CATEGORIES = [
  "technical writeups",
  "security notes",
  "project retrospectives",
  "research logs",
  "CTF analyses",
  "engineering breakdowns",
] as const;

export function BlogPreviewSection() {
  return (
    <section
      id="blog"
      aria-labelledby="blog-heading"
      className="relative overflow-hidden bg-void px-6 py-24 sm:py-32"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(88,243,255,0.12),transparent_30%),radial-gradient(circle_at_82%_36%,rgba(255,122,69,0.1),transparent_32%),linear-gradient(180deg,rgba(8,16,24,0.86),rgba(3,4,6,0.94))]" />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-ash/30 to-transparent"
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto grid max-w-[var(--content-max-width)] gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-stretch">
        <div className="glass-panel relative overflow-hidden rounded-lg border-ash/15 p-6 sm:p-8">
          <div
            className="absolute -right-16 -top-16 size-48 rounded-full border border-cherenkov/15"
            aria-hidden="true"
          />
          <div
            className="absolute -bottom-20 left-8 size-52 rounded-full border border-ember/10"
            aria-hidden="true"
          />

          <div className="relative">
            <div className="mb-6 inline-flex items-center gap-3 rounded border border-cherenkov/25 bg-cherenkov/10 px-3 py-2 font-[family-name:var(--font-mono)] text-xs uppercase tracking-[0.18em] text-cherenkov">
              <RadioTower className="size-4" aria-hidden="true" />
              recovered transmissions
            </div>
            <GlitchText
              as="h2"
              id="blog-heading"
              text="BLOG ARCHIVE"
              className="font-[family-name:var(--font-display)] text-3xl font-bold tracking-wider text-text-primary sm:text-5xl"
            />
            <p className="mt-5 max-w-xl text-base leading-7 text-text-secondary">
              Field notes from broken systems, competition rooms, and builds
              that survived the blast radius. The archive collects practical
              traces first: what failed, what worked, and what changed after
              contact.
            </p>
          </div>
        </div>

        <div className="glass-terminal rounded-lg border-ash/15 p-5 sm:p-7">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-cherenkov/15 pb-4">
            <div className="flex items-center gap-3">
              <BookOpen className="size-5 text-ember" aria-hidden="true" />
              <h3 className="font-[family-name:var(--font-display)] text-xl font-semibold text-text-primary">
                Transmission Classes
              </h3>
            </div>
            <span className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-[0.18em] text-text-dim">
              indexed signal lanes
            </span>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {BLOG_CATEGORIES.map((category, index) => (
              <article
                key={category}
                className="rounded border border-ash/15 bg-surface/70 p-4 transition duration-[var(--duration-normal)] hover:border-cherenkov/45 hover:bg-cherenkov/5"
              >
                <p className="font-[family-name:var(--font-mono)] text-[0.68rem] uppercase tracking-[0.2em] text-gravity">
                  packet {String(index + 1).padStart(2, "0")}
                </p>
                <p className="mt-3 text-sm font-medium capitalize leading-6 text-text-primary">
                  {category}
                </p>
              </article>
            ))}
          </div>

          <div className="mt-6 rounded border border-ember/25 bg-ember/10 p-4 font-[family-name:var(--font-mono)] text-sm leading-6 text-text-secondary">
            <p className="text-ember">$ tune --archive --latest</p>
            <p className="mt-2">
              The archive groups field notes by problem type, from exploit paths
              and lab traces to post-build retrospectives and CTF analysis.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
