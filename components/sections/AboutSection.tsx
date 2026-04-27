import { GlitchText } from "@/components/ui/GlitchText";
import { TypewriterText } from "@/components/ui/TypewriterText";
import profileData from "@/content/data/profile.json";

type ProfileData = {
  name: string;
  role: string;
  location: string;
  clearance: string;
  summary: string;
  identity: {
    affiliation: string;
    program: string;
    graduation: string;
  };
  operatorProfile: {
    primary: string;
    secondary: string[];
    tertiary: string[];
    team: string;
  };
  personalLog: string[];
};

const PROFILE = profileData as ProfileData;

const PROFILE_PANELS = [
  {
    label: "IDENTITY",
    command: "id praneesh",
    lines: [
      `uid=${PROFILE.name.toLowerCase().replaceAll(" ", "-")}`,
      `role=${PROFILE.role.toLowerCase()}`,
      `track=${PROFILE.clearance}`,
    ],
  },
  {
    label: "OPERATOR PROFILE",
    command: "cat operator.profile",
    lines: [
      PROFILE.operatorProfile.primary,
      `Secondary: ${PROFILE.operatorProfile.secondary.join(", ")}`,
      `Systems: ${PROFILE.operatorProfile.tertiary.join(", ")}`,
    ],
  },
  {
    label: "PERSONAL LOG",
    command: "tail personal.log",
    lines: PROFILE.personalLog.slice(0, 3),
  },
];

const ASCII_PORTRAIT = [
  "        .-.",
  "       /___\\",
  "       |o o|",
  "       |_-_|",
  "    .-'|   |'-.",
  "   /   |___|   \\",
  "  /_/|  PRV  |\\_\\",
  "     |_______|",
];

export function AboutSection() {
  return (
    <section
      id="about"
      aria-labelledby="about-heading"
      className="relative isolate px-6 py-24 sm:py-32"
    >
      <div className="mx-auto grid w-full max-w-[var(--content-max-width)] gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)]">
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <div
              className="size-12 rounded-full border border-blue/40 bg-blue/10 shadow-[0_0_32px_rgba(56,189,248,0.18)]"
              aria-hidden="true"
            >
              <div className="m-3 size-6 rounded-full border border-green/60 bg-green/20 shadow-[0_0_18px_rgba(0,255,136,0.35)]" />
            </div>
            <div>
              <p className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-[0.28em] text-blue">
                cockpit hud / about
              </p>
              <GlitchText
                as="h2"
                id="about-heading"
                text="ABOUT"
                className="font-[family-name:var(--font-display)] text-3xl font-bold tracking-wider text-text-primary sm:text-4xl"
              />
            </div>
          </div>

          <div className="glass-terminal rounded-lg p-5 sm:p-6">
            <div className="mb-5 flex items-center justify-between border-b border-green/15 pb-3 font-[family-name:var(--font-mono)] text-xs uppercase tracking-[0.22em]">
              <span className="text-green">cat about.txt</span>
              <span className="text-text-dim">tty-03</span>
            </div>
            <div className="space-y-5 font-[family-name:var(--font-mono)] text-sm leading-7 text-text-secondary sm:text-base">
              <TypewriterText
                text={PROFILE.summary}
                speed={12}
                className="block text-text-primary"
              />
              <p>
                Current orbit: {PROFILE.operatorProfile.team},{" "}
                {PROFILE.identity.affiliation}, and hands-on work across{" "}
                {PROFILE.operatorProfile.tertiary.join(", ")}.
              </p>
              <p className="text-green">
                root@cosmos:~$ inspect --profile --quiet
              </p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {PROFILE_PANELS.map((panel, index) => (
              <article
                key={panel.label}
                className="glass-panel rounded-lg p-4"
                style={{ animationDelay: `${index * 90}ms` }}
              >
                <p className="mb-3 font-[family-name:var(--font-mono)] text-[0.68rem] uppercase tracking-[0.22em] text-purple-hot">
                  {panel.label}
                </p>
                <p className="mb-3 font-[family-name:var(--font-mono)] text-xs text-green">
                  $ {panel.command}
                </p>
                <ul className="space-y-2 text-sm leading-6 text-text-secondary">
                  {panel.lines.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>

        <aside className="glass-panel relative overflow-hidden rounded-lg p-5 sm:p-6">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-green/60 to-transparent" />
          <div className="mb-5 flex items-center justify-between font-[family-name:var(--font-mono)] text-xs uppercase tracking-[0.2em]">
            <span className="text-purple-hot">visual feed</span>
            <span className="text-text-dim">stable</span>
          </div>
          <pre className="overflow-hidden rounded-lg border border-green/15 bg-void/70 p-5 font-[family-name:var(--font-mono)] text-xs leading-5 text-green shadow-[inset_0_0_28px_rgba(0,255,136,0.08)] sm:text-sm">
            {ASCII_PORTRAIT.join("\n")}
          </pre>
          <dl className="mt-6 grid grid-cols-2 gap-3 font-[family-name:var(--font-mono)] text-xs">
            <div className="rounded-lg border border-blue/20 bg-blue/10 p-3">
              <dt className="mb-1 text-text-dim">Base</dt>
              <dd className="text-blue-hot">{PROFILE.location}</dd>
            </div>
            <div className="rounded-lg border border-green/20 bg-green/10 p-3">
              <dt className="mb-1 text-text-dim">Shell</dt>
              <dd className="text-green">Arch</dd>
            </div>
            <div className="rounded-lg border border-purple/20 bg-purple/10 p-3">
              <dt className="mb-1 text-text-dim">Focus</dt>
              <dd className="text-purple-hot">
                {PROFILE.operatorProfile.secondary[0]}
              </dd>
            </div>
            <div className="rounded-lg border border-red/20 bg-red/10 p-3">
              <dt className="mb-1 text-text-dim">Arena</dt>
              <dd className="text-red">{PROFILE.operatorProfile.team}</dd>
            </div>
          </dl>
        </aside>
      </div>
    </section>
  );
}
