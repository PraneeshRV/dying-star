import { Award, BadgeCheck, GraduationCap, ShieldCheck } from "lucide-react";
import { GlitchText } from "@/components/ui/GlitchText";
import certificationsData from "@/content/data/certifications.json";
import type { Certification } from "@/types";

const CERTIFICATIONS = certificationsData as Certification[];

const STATUS_LABEL: Record<Certification["status"], string> = {
  "in-progress": "In progress",
  completed: "Completed",
};

const STATUS_CLASS: Record<Certification["status"], string> = {
  "in-progress": "border-gold/50 bg-gold/10 text-gold",
  completed: "border-green/50 bg-green/10 text-green",
};

const ICONS = [ShieldCheck, GraduationCap, BadgeCheck, Award] as const;

export function CertificationsSection() {
  return (
    <section
      id="certifications"
      aria-labelledby="certifications-heading"
      className="relative px-6 py-24 sm:py-32"
    >
      <div className="mx-auto w-full max-w-[var(--content-max-width)]">
        <div className="mb-10 max-w-3xl">
          <p className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-[0.28em] text-green">
            authority seals / certifications
          </p>
          <GlitchText
            as="h2"
            id="certifications-heading"
            text="CERTIFICATIONS"
            className="mt-3 font-[family-name:var(--font-display)] text-3xl font-bold tracking-wider text-text-primary sm:text-4xl"
          />
          <p className="mt-4 text-base leading-7 text-text-secondary">
            Current certification tracks and academic credentials that back the
            security work, labs, and infrastructure projects shown above.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {CERTIFICATIONS.map((certification, index) => {
            const Icon = ICONS[index % ICONS.length];
            return (
              <article
                key={certification.id}
                className="glass-panel relative overflow-hidden rounded p-4 sm:p-6"
              >
                <div className="absolute right-4 top-4 text-purple/20">
                  <Icon className="size-10" aria-hidden="true" />
                </div>

                <div className="relative pr-12">
                  <div className="mb-4 flex flex-wrap items-center gap-2">
                    <span
                      className={`inline-flex items-center gap-2 rounded-sm border px-2.5 py-1 font-[family-name:var(--font-mono)] text-[0.68rem] font-semibold uppercase tracking-[0.14em] ${STATUS_CLASS[certification.status]}`}
                    >
                      <span
                        className="size-1.5 rounded-full bg-current shadow-[0_0_8px_currentColor]"
                        aria-hidden="true"
                      />
                      {STATUS_LABEL[certification.status]}
                    </span>
                    <span className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-[0.16em] text-text-dim">
                      {certification.year}
                    </span>
                  </div>

                  <h3 className="font-[family-name:var(--font-display)] text-xl font-bold leading-snug tracking-wide text-text-primary">
                    {certification.title}
                  </h3>
                  <p className="mt-2 font-[family-name:var(--font-mono)] text-xs uppercase tracking-[0.18em] text-purple-hot">
                    {certification.issuer}
                  </p>
                  <p className="mt-4 text-sm leading-6 text-text-secondary">
                    {certification.description}
                  </p>

                  <ul
                    className="mt-5 flex flex-wrap gap-2"
                    aria-label={`Focus areas for ${certification.title}`}
                  >
                    {certification.focus.map((item) => (
                      <li
                        key={item}
                        className="rounded-sm border border-blue-hot/25 bg-blue-hot/10 px-2.5 py-1 font-[family-name:var(--font-mono)] text-[0.68rem] uppercase tracking-[0.12em] text-blue-hot"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
