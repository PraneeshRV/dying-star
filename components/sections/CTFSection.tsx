"use client";

import { Flag, Radar, ShieldCheck, Trophy } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { GlitchText } from "@/components/ui/GlitchText";
import achievements from "@/content/data/ctf-achievements.json";
import type { CTFAchievement } from "@/types";

const CTF_ACHIEVEMENTS = achievements as CTFAchievement[];
const TARGET_FLAGS = 137;
const TEAM_STATS = [
  ["Rank", "Top 15 finishes"],
  ["CTFs Competed", String(CTF_ACHIEVEMENTS.length)],
  ["Scope", "Web / Forensics / Infra"],
  ["Specialties", "Linux, deploys, triage"],
] as const;

export function CTFSection() {
  const [flagCount, setFlagCount] = useState(0);
  const [flagClicks, setFlagClicks] = useState(0);
  const [challengeVisible, setChallengeVisible] = useState(false);

  const sortedAchievements = useMemo(
    () => [...CTF_ACHIEVEMENTS].sort((a, b) => b.year - a.year),
    [],
  );

  useEffect(() => {
    const step = Math.max(1, Math.ceil(TARGET_FLAGS / 36));
    const timer = window.setInterval(() => {
      setFlagCount((current) => {
        const next = current + step;
        if (next >= TARGET_FLAGS) {
          window.clearInterval(timer);
          return TARGET_FLAGS;
        }
        return next;
      });
    }, 35);

    return () => window.clearInterval(timer);
  }, []);

  const handleFlagClick = () => {
    setFlagClicks((current) => {
      const next = current + 1;
      if (next >= 3) setChallengeVisible(true);
      return next;
    });
  };

  return (
    <section
      id="ctf"
      aria-labelledby="ctf-heading"
      className="relative overflow-hidden bg-surface px-6 py-24 sm:py-32"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,51,102,0.14),transparent_28%),radial-gradient(circle_at_82%_28%,rgba(0,255,136,0.1),transparent_30%)]" />

      <div className="relative z-10 mx-auto max-w-[var(--content-max-width)]">
        <div className="mb-12 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-[0.28em] text-red">
              neon trophy room
            </p>
            <GlitchText
              as="h2"
              id="ctf-heading"
              text="CTF Hall of Fame"
              className="mt-4 block font-[family-name:var(--font-display)] text-3xl font-bold text-text-primary sm:text-5xl"
            />
            <p className="mt-5 max-w-2xl text-base leading-7 text-text-secondary">
              Competition results, operations work, and signal traces from
              capture-the-flag events.
            </p>
          </div>

          <button
            type="button"
            onClick={handleFlagClick}
            className="glass-terminal group flex w-full items-center justify-between rounded-lg px-5 py-4 text-left transition hover:border-green/50 hover:box-glow-green lg:max-w-sm"
            aria-label="Flag submission counter"
          >
            <span>
              <span className="block font-[family-name:var(--font-mono)] text-xs uppercase tracking-[0.2em] text-text-secondary">
                flags submitted
              </span>
              <span className="mt-1 block font-[family-name:var(--font-display)] text-4xl font-bold text-green glow-green">
                {flagCount}
              </span>
            </span>
            <Flag
              className="size-9 text-green transition group-hover:scale-110"
              aria-hidden="true"
            />
          </button>
        </div>

        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.4fr]">
          <aside className="glass-panel rounded-lg p-6">
            <div className="relative mx-auto mb-8 flex aspect-square max-w-72 items-center justify-center overflow-hidden rounded-lg border border-blue/20 bg-void">
              <div className="absolute size-4/5 rounded-full border border-blue/25" />
              <div className="absolute size-2/3 rounded-full border border-green/20" />
              <div className="absolute h-px w-full bg-blue/25" />
              <div className="absolute h-full w-px bg-blue/25" />
              <div className="absolute h-1/2 w-1/2 origin-bottom-right animate-spin bg-gradient-to-tr from-green/45 to-transparent" />
              <Radar className="relative z-10 size-12 text-blue-hot" />
            </div>

            <div className="grid gap-3">
              {TEAM_STATS.map(([label, value]) => (
                <div
                  key={label}
                  className="rounded border border-purple/15 bg-void/50 p-4"
                >
                  <dt className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-[0.18em] text-text-dim">
                    {label}
                  </dt>
                  <dd className="mt-1 text-sm font-medium text-text-primary">
                    {value}
                  </dd>
                </div>
              ))}
            </div>
          </aside>

          <div className="glass-terminal rounded-lg p-4 sm:p-6">
            <div className="mb-4 flex items-center gap-3">
              <Trophy className="size-5 text-gold" aria-hidden="true" />
              <h3 className="font-[family-name:var(--font-display)] text-xl font-semibold text-text-primary">
                Achievement Table
              </h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[560px] border-collapse text-left">
                <thead>
                  <tr className="border-b border-green/20 font-[family-name:var(--font-mono)] text-xs uppercase tracking-[0.16em] text-green">
                    <th className="py-3 pr-4 font-medium">Competition</th>
                    <th className="py-3 pr-4 font-medium">Result</th>
                    <th className="py-3 font-medium">Year</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedAchievements.map((achievement) => (
                    <tr
                      key={`${achievement.competition}-${achievement.year}`}
                      className="border-b border-green/10 text-sm text-text-secondary transition hover:bg-green/5 hover:text-text-primary"
                    >
                      <td className="py-4 pr-4">{achievement.competition}</td>
                      <td className="py-4 pr-4">{achievement.result}</td>
                      <td className="py-4 text-gold">{achievement.year}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {challengeVisible && (
              <div className="mt-5 rounded-lg border border-red/30 bg-red/10 p-4">
                <div className="flex items-center gap-2 font-[family-name:var(--font-mono)] text-xs uppercase tracking-[0.18em] text-red">
                  <ShieldCheck className="size-4" aria-hidden="true" />
                  mini challenge armed
                </div>
                <p className="mt-3 font-[family-name:var(--font-mono)] text-sm text-text-secondary">
                  flag{"{"}inspect_the_dom_for_signal_lock{"}"}
                </p>
                <p className="sr-only">Flag panel clicks: {flagClicks}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
