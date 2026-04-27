import { BriefcaseBusiness, GitBranch, Mail, Satellite } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { GlitchText } from "@/components/ui/GlitchText";
import profile from "@/content/data/profile.json";

const CONTACT_EMAIL = profile.email;

const SOCIAL_LINKS = [
  {
    label: "GitHub",
    href: profile.social.github,
    Icon: GitBranch,
  },
  {
    label: "LinkedIn",
    href: profile.social.linkedin,
    Icon: BriefcaseBusiness,
  },
  {
    label: "Email",
    href: `mailto:${CONTACT_EMAIL}`,
    Icon: Mail,
  },
  {
    label: "Website",
    href: profile.social.website,
    Icon: Satellite,
  },
] as const;

export function ContactSection() {
  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="relative overflow-hidden bg-void px-6 py-24 sm:py-32"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_76%_18%,rgba(56,189,248,0.14),transparent_30%),linear-gradient(180deg,rgba(139,92,246,0.08),transparent_45%)]" />

      <div className="relative z-10 mx-auto grid max-w-[var(--content-max-width)] gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
        <div>
          <p className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-[0.28em] text-blue">
            deep space comms array
          </p>
          <GlitchText
            as="h2"
            id="contact-heading"
            text="Contact"
            className="mt-4 block font-[family-name:var(--font-display)] text-3xl font-bold text-text-primary sm:text-5xl"
          />
          <p className="mt-5 max-w-xl text-base leading-7 text-text-secondary">
            Open a signal for security projects, CTF collaboration,
            infrastructure work, or research conversations.
          </p>

          <div className="mt-10 glass-panel rounded-lg p-6">
            <div className="relative mx-auto flex aspect-square max-w-80 items-center justify-center overflow-hidden rounded-lg border border-blue/20 bg-surface">
              <div className="absolute size-56 rounded-full border border-blue/20" />
              <div className="absolute size-40 rounded-full border border-purple/20" />
              <div className="absolute size-24 rounded-full border border-green/20" />
              <div className="absolute h-24 w-1 origin-bottom animate-pulse bg-blue/50" />
              <div className="absolute size-20 animate-ping rounded-full border border-green/40" />
              <Satellite className="relative z-10 size-16 rotate-12 text-blue-hot drop-shadow-[0_0_18px_rgba(56,189,248,0.55)]" />
            </div>
          </div>
        </div>

        <div className="glass-terminal rounded-lg p-5 sm:p-7">
          <form
            action={`mailto:${CONTACT_EMAIL}`}
            method="post"
            encType="text/plain"
            className="grid gap-5"
          >
            <label className="grid gap-2">
              <span className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-[0.18em] text-green">
                Callsign
              </span>
              <input
                name="callsign"
                type="text"
                autoComplete="name"
                className="rounded border border-green/20 bg-void px-4 py-3 text-text-primary outline-none transition placeholder:text-text-dim focus:border-green focus:box-glow-green"
                placeholder="Your name"
              />
            </label>

            <label className="grid gap-2">
              <span className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-[0.18em] text-green">
                Frequency
              </span>
              <input
                name="frequency"
                type="email"
                autoComplete="email"
                className="rounded border border-green/20 bg-void px-4 py-3 text-text-primary outline-none transition placeholder:text-text-dim focus:border-green focus:box-glow-green"
                placeholder="you@example.com"
              />
            </label>

            <label className="grid gap-2">
              <span className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-[0.18em] text-green">
                Message
              </span>
              <textarea
                name="message"
                rows={6}
                className="resize-y rounded border border-green/20 bg-void px-4 py-3 text-text-primary outline-none transition placeholder:text-text-dim focus:border-green focus:box-glow-green"
                placeholder="Transmit payload"
              />
            </label>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <Button type="submit">send signal</Button>
              <Button
                href={`mailto:${CONTACT_EMAIL}`}
                variant="secondary"
                aria-label="Open email client"
              >
                direct mail
              </Button>
            </div>
          </form>

          <div className="mt-8 border-t border-green/10 pt-6">
            <p className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-[0.18em] text-text-dim">
              social relays
            </p>
            <div className="mt-4 grid grid-cols-2 gap-3">
              {SOCIAL_LINKS.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel={
                    href.startsWith("http") ? "noopener noreferrer" : undefined
                  }
                  className="flex items-center gap-3 rounded border border-purple/20 bg-surface/70 px-4 py-3 text-sm text-text-secondary transition hover:border-purple hover:text-text-primary hover:box-glow-purple"
                >
                  <Icon className="size-4 text-purple-hot" aria-hidden="true" />
                  {label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
