import { GlitchText } from "@/components/ui/GlitchText";
import skillsData from "@/content/data/skills.json";
import type { Skill } from "@/types";

const SKILLS = skillsData as Skill[];

const CATEGORY_META: Record<
  Skill["category"],
  { label: string; color: string; ring: string; bg: string }
> = {
  security: {
    label: "Security",
    color: "text-red",
    ring: "border-red/40",
    bg: "bg-red/10",
  },
  development: {
    label: "Dev",
    color: "text-blue-hot",
    ring: "border-blue/40",
    bg: "bg-blue/10",
  },
  infrastructure: {
    label: "Infrastructure",
    color: "text-green",
    ring: "border-green/40",
    bg: "bg-green/10",
  },
  tools: {
    label: "Tools",
    color: "text-purple-hot",
    ring: "border-purple/40",
    bg: "bg-purple/10",
  },
};

const GRAPH_POSITIONS = [
  { x: 16, y: 34 },
  { x: 31, y: 18 },
  { x: 43, y: 42 },
  { x: 57, y: 22 },
  { x: 72, y: 36 },
  { x: 84, y: 18 },
  { x: 20, y: 72 },
  { x: 39, y: 63 },
  { x: 55, y: 78 },
  { x: 69, y: 65 },
  { x: 82, y: 82 },
  { x: 91, y: 55 },
];

const GRAPH_NODES = GRAPH_POSITIONS.map((position, index) => ({
  ...position,
  skill: SKILLS[index],
})).filter(
  (node): node is { x: number; y: number; skill: Skill } =>
    node.skill !== undefined,
);

const GRAPH_EDGES = [
  [0, 1],
  [1, 2],
  [2, 3],
  [3, 4],
  [4, 5],
  [6, 7],
  [7, 8],
  [8, 9],
  [9, 10],
  [9, 11],
  [2, 7],
  [4, 9],
] as const;

const groupedSkills = SKILLS.reduce(
  (groups, skill) => {
    groups[skill.category].push(skill);
    return groups;
  },
  {
    security: [],
    development: [],
    infrastructure: [],
    tools: [],
  } as Record<Skill["category"], Skill[]>,
);

function proficiencyLabel(value: Skill["proficiency"]) {
  return `${value}/5`;
}

export function SkillsSection() {
  return (
    <section
      id="skills"
      aria-labelledby="skills-heading"
      className="relative px-6 py-24 sm:py-32"
    >
      <div className="mx-auto w-full max-w-[var(--content-max-width)]">
        <div className="mb-10">
          <p className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-[0.28em] text-purple-hot">
            constellation / skills
          </p>
          <GlitchText
            as="h2"
            id="skills-heading"
            text="SKILLS"
            className="mt-3 font-[family-name:var(--font-display)] text-3xl font-bold tracking-wider text-text-primary sm:text-4xl"
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(320px,0.95fr)]">
          <div className="glass-panel relative hidden min-h-[440px] overflow-hidden rounded-lg p-6 lg:block">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.12),transparent_58%)]" />
            <svg
              className="absolute inset-0 size-full"
              viewBox="0 0 100 100"
              role="img"
              aria-label="Skill constellation graph"
              preserveAspectRatio="none"
            >
              {GRAPH_EDGES.map(([from, to]) => (
                <line
                  key={`${from}-${to}`}
                  x1={GRAPH_NODES[from].x}
                  y1={GRAPH_NODES[from].y}
                  x2={GRAPH_NODES[to].x}
                  y2={GRAPH_NODES[to].y}
                  stroke="rgba(136, 136, 170, 0.28)"
                  strokeWidth="0.22"
                />
              ))}
            </svg>

            {GRAPH_NODES.map(({ skill, x, y }) => {
              const meta = CATEGORY_META[skill.category];
              return (
                <div
                  key={skill.name}
                  className="group absolute -translate-x-1/2 -translate-y-1/2"
                  style={{ left: `${x}%`, top: `${y}%` }}
                >
                  <div
                    className={`grid size-16 place-items-center rounded-full border ${meta.ring} ${meta.bg} font-[family-name:var(--font-mono)] text-xs font-semibold ${meta.color} shadow-[0_0_24px_rgba(255,255,255,0.08)] transition-transform duration-[var(--duration-normal)] group-hover:scale-110`}
                  >
                    {proficiencyLabel(skill.proficiency)}
                  </div>
                  <div className="pointer-events-none absolute left-1/2 top-full mt-2 w-max -translate-x-1/2 rounded-lg border border-text-dim/40 bg-void/95 px-3 py-2 font-[family-name:var(--font-mono)] text-xs text-text-primary opacity-0 shadow-xl transition-opacity duration-[var(--duration-normal)] group-hover:opacity-100">
                    {skill.name} / {meta.label}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {(Object.keys(groupedSkills) as Array<Skill["category"]>).map(
              (category) => {
                const meta = CATEGORY_META[category];
                return (
                  <article
                    key={category}
                    className={`rounded-lg border ${meta.ring} ${meta.bg} p-5`}
                  >
                    <h3
                      className={`font-[family-name:var(--font-mono)] text-sm uppercase tracking-[0.2em] ${meta.color}`}
                    >
                      {meta.label}
                    </h3>
                    <ul className="mt-5 space-y-4">
                      {groupedSkills[category].map((skill) => (
                        <li key={skill.name}>
                          <div className="mb-2 flex items-center justify-between gap-3">
                            <span className="text-sm font-medium text-text-primary">
                              {skill.name}
                            </span>
                            <span className="font-[family-name:var(--font-mono)] text-xs text-text-dim">
                              {proficiencyLabel(skill.proficiency)}
                            </span>
                          </div>
                          <div
                            className="h-2 overflow-hidden rounded-full bg-void/70"
                            aria-hidden="true"
                          >
                            <div
                              className={`h-full rounded-full ${meta.bg} shadow-[0_0_16px_currentColor]`}
                              style={{
                                width: `${(skill.proficiency / 5) * 100}%`,
                              }}
                            />
                          </div>
                        </li>
                      ))}
                    </ul>
                  </article>
                );
              },
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
