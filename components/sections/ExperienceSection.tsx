import { CalendarDays, GraduationCap, Server, Trophy } from "lucide-react";
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
            A running log of security work, competition pressure, and systems
            built while moving deeper into offensive and defensive engineering.
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
                    <div className="mb-4 inline-flex items-center gap-2 rounded border border-gold/30 bg-gold/10 px-3 py-1 font-[family-name:var(--font-mono)] text-xs uppercase tracking-[0.18em] text-gold">
                      <CalendarDays className="size-3.5" aria-hidden="true" />
                      {entry.year}
                    </div>
                    <h3 className="font-[family-name:var(--font-display)] text-xl font-semibold text-text-primary">
                      {entry.title}
                    </h3>
                    <details className="group mt-3">
                      <summary className="cursor-pointer list-none font-[family-name:var(--font-mono)] text-xs uppercase tracking-[0.18em] text-blue transition hover:text-blue-hot">
                        Open checkpoint
                      </summary>
                      <p className="mt-4 text-sm leading-7 text-text-secondary">
                        {entry.description}
                      </p>
                    </details>
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
