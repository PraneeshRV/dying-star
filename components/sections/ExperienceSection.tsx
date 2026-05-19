import {
  CalendarDays,
  ExternalLink,
  GraduationCap,
  Server,
  Trophy,
} from "lucide-react";
import { GlitchText } from "@/components/ui/GlitchText";
import experienceData from "@/content/data/experience.json";
import type { TimelineEntry } from "@/types";

const EXPERIENCE_ENTRIES = experienceData as TimelineEntry[];

const TYPE_ICON = {
  education: GraduationCap,
  ctf: Trophy,
  project: Server,
  certification: CalendarDays,
  milestone: Trophy,
} satisfies Record<TimelineEntry["type"], typeof CalendarDays>;

export function ExperienceSection() {
  return (
    <section
      id="experience"
      aria-labelledby="experience-heading"
      className="relative overflow-hidden bg-void px-6 py-24 sm:py-32"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(245,166,35,0.12),transparent_34%),linear-gradient(90deg,transparent,rgba(56,189,248,0.08),transparent)]" />
      <div className="pointer-events-none absolute inset-x-0 top-1/2 h-px bg-gradient-to-r from-transparent via-blue/50 to-transparent" />

      <div className="relative z-10 mx-auto max-w-[var(--content-max-width)]">
        <div className="mb-14 max-w-3xl">
          <p className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-[0.28em] text-gold">
            signal chronology / experience
          </p>
          <GlitchText
            as="h2"
            id="experience-heading"
            text="Experience Timeline"
            className="mt-4 block font-[family-name:var(--font-display)] text-3xl font-bold text-text-primary sm:text-5xl"
          />
          <p className="mt-5 max-w-2xl text-base leading-7 text-text-secondary">
            A detailed chronology of education, public GitHub work, CTF growth,
            AI red teaming research, internship work, hackathon prototypes, and
            security infrastructure.
          </p>
        </div>

        <div className="relative">
          <div className="absolute left-4 top-0 h-full w-px bg-gradient-to-b from-transparent via-gold to-transparent sm:left-1/2" />

          <div className="space-y-8">
            {EXPERIENCE_ENTRIES.map((entry, index) => {
              const Icon = TYPE_ICON[entry.type];
              const alignRight = index % 2 === 0;

              return (
                <article
                  key={entry.id}
                  className={`relative grid gap-5 sm:grid-cols-[1fr_4rem_1fr] ${
                    alignRight ? "" : "sm:[&>*:first-child]:col-start-3"
                  }`}
                >
                  <div
                    className={`glass-panel rounded-lg border-gold/20 p-5 transition duration-[var(--duration-normal)] hover:-translate-y-1 hover:border-gold/50 hover:shadow-[0_0_34px_rgba(245,166,35,0.12)] ${
                      alignRight ? "sm:text-right" : ""
                    }`}
                  >
                    <div
                      className={`mb-4 flex flex-wrap items-center gap-2 ${
                        alignRight ? "sm:justify-end" : ""
                      }`}
                    >
                      <span className="inline-flex items-center gap-2 rounded border border-gold/30 bg-gold/10 px-3 py-1 font-[family-name:var(--font-mono)] text-xs uppercase tracking-[0.18em] text-gold">
                        <CalendarDays className="size-3.5" aria-hidden="true" />
                        {entry.period ?? entry.year}
                      </span>
                      {entry.role && (
                        <span className="rounded border border-purple/25 bg-purple/10 px-3 py-1 font-[family-name:var(--font-mono)] text-xs uppercase tracking-[0.16em] text-purple-hot">
                          {entry.role}
                        </span>
                      )}
                    </div>
                    <h3 className="font-[family-name:var(--font-display)] text-xl font-semibold text-text-primary">
                      {entry.title}
                    </h3>
                    {(entry.organization || entry.location) && (
                      <p className="mt-2 font-[family-name:var(--font-mono)] text-xs uppercase tracking-[0.16em] text-blue-hot">
                        {[entry.organization, entry.location]
                          .filter(Boolean)
                          .join(" / ")}
                      </p>
                    )}
                    <p className="mt-4 text-sm leading-7 text-text-secondary">
                      {entry.description}
                    </p>
                    {entry.impact && (
                      <p className="mt-4 rounded border border-green/20 bg-green/10 p-3 text-sm leading-6 text-text-primary">
                        <span className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-[0.16em] text-green">
                          impact:
                        </span>{" "}
                        {entry.impact}
                      </p>
                    )}
                    {entry.highlights && entry.highlights.length > 0 && (
                      <ul
                        className={`mt-4 space-y-2 text-sm leading-6 text-text-secondary ${
                          alignRight ? "sm:list-inside" : ""
                        }`}
                      >
                        {entry.highlights.map((highlight) => (
                          <li
                            key={highlight}
                            className="relative pl-4 before:absolute before:left-0 before:top-[0.7em] before:size-1.5 before:rounded-full before:bg-gold sm:before:hidden"
                          >
                            {highlight}
                          </li>
                        ))}
                      </ul>
                    )}
                    {entry.tags && entry.tags.length > 0 && (
                      <ul
                        className={`mt-5 flex flex-wrap gap-2 ${
                          alignRight ? "sm:justify-end" : ""
                        }`}
                        aria-label={`Tags for ${entry.title}`}
                      >
                        {entry.tags.map((tag) => (
                          <li
                            key={tag}
                            className="rounded-sm border border-blue-hot/25 bg-blue-hot/10 px-2.5 py-1 font-[family-name:var(--font-mono)] text-[0.68rem] uppercase tracking-[0.12em] text-blue-hot"
                          >
                            {tag}
                          </li>
                        ))}
                      </ul>
                    )}
                    {entry.links && entry.links.length > 0 && (
                      <div
                        className={`mt-5 flex flex-wrap gap-3 ${
                          alignRight ? "sm:justify-end" : ""
                        }`}
                      >
                        {entry.links.map((link) => (
                          <a
                            key={`${entry.id}-${link.href}`}
                            href={link.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 rounded border border-green/25 bg-green/10 px-3 py-2 font-[family-name:var(--font-mono)] text-xs uppercase tracking-[0.14em] text-green transition hover:border-green hover:box-glow-green"
                          >
                            {link.label}
                            <ExternalLink
                              className="size-3.5"
                              aria-hidden="true"
                            />
                          </a>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="absolute left-4 top-6 -translate-x-1/2 sm:static sm:flex sm:translate-x-0 sm:items-start sm:justify-center">
                    <div className="flex size-12 items-center justify-center rounded-lg border border-gold/50 bg-void shadow-[0_0_28px_rgba(245,166,35,0.25)]">
                      <Icon className="size-5 text-gold" aria-hidden="true" />
                    </div>
                  </div>

                  <div className="hidden sm:block" aria-hidden="true" />
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
