"use client";

import { ExternalLink, Filter, GitBranch } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { GlitchText } from "@/components/ui/GlitchText";
import { ProjectCard } from "@/components/ui/ProjectCard";
import projectsData from "@/content/data/projects.json";
import { cn } from "@/lib/utils";
import type { Project } from "@/types";

const PROJECTS = projectsData as Project[];

const FILTERS: Array<{ label: string; value: Project["category"] | "all" }> = [
  { label: "All", value: "all" },
  { label: "Security", value: "security" },
  { label: "Tools", value: "tools" },
  { label: "Infrastructure", value: "infrastructure" },
  { label: "CTF", value: "ctf" },
  { label: "WIP", value: "wip" },
];

const CATEGORY_LABEL: Record<Project["category"], string> = {
  security: "Security",
  tools: "Tools",
  infrastructure: "Infrastructure",
  ctf: "CTF",
  wip: "WIP",
};

export function ProjectsSection() {
  const [activeFilter, setActiveFilter] =
    useState<(typeof FILTERS)[number]["value"]>("all");

  const filteredProjects = useMemo(() => {
    if (activeFilter === "all") return PROJECTS;
    if (activeFilter === "wip") {
      return PROJECTS.filter(
        (project) => project.category === "wip" || project.status === "wip",
      );
    }
    return PROJECTS.filter((project) => project.category === activeFilter);
  }, [activeFilter]);

  return (
    <section
      id="projects"
      aria-labelledby="projects-heading"
      className="relative px-6 py-24 sm:py-32"
    >
      <div className="mx-auto w-full max-w-[var(--content-max-width)]">
        <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-[0.28em] text-green">
              docking bay / projects
            </p>
            <GlitchText
              as="h2"
              id="projects-heading"
              text="PROJECTS"
              className="mt-3 font-[family-name:var(--font-display)] text-3xl font-bold tracking-wider text-text-primary sm:text-4xl"
            />
          </div>

          <div
            className="flex flex-wrap gap-2"
            role="tablist"
            aria-label="Project filters"
          >
            {FILTERS.map((filter) => {
              const isActive = activeFilter === filter.value;
              return (
                <button
                  key={filter.value}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActiveFilter(filter.value)}
                  className={cn(
                    "inline-flex h-9 items-center gap-2 rounded-lg border px-3 font-[family-name:var(--font-mono)] text-xs uppercase tracking-[0.16em] transition-colors duration-[var(--duration-normal)]",
                    isActive
                      ? "border-green bg-green/15 text-green shadow-[0_0_18px_rgba(0,255,136,0.14)]"
                      : "border-purple/20 bg-surface/70 text-text-secondary hover:border-purple/50 hover:text-purple-hot",
                  )}
                >
                  <Filter className="size-3.5" aria-hidden="true" />
                  {filter.label}
                </button>
              );
            })}
          </div>
        </div>

        {filteredProjects.length > 0 ? (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {filteredProjects.map((project) => (
              <div key={project.id} className="space-y-3">
                <ProjectCard
                  title={project.title}
                  description={project.description}
                  techStack={project.techStack}
                  status={project.status}
                  sourceUrl={project.sourceUrl}
                  proofLabel={project.proofLabel}
                  role={project.role}
                  year={project.year}
                  scope={project.scope}
                />
                <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-purple/15 bg-surface/50 px-4 py-3">
                  <span className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-[0.18em] text-text-dim">
                    {CATEGORY_LABEL[project.category]}
                  </span>
                  <div className="flex gap-2">
                    {project.liveUrl && (
                      <Button
                        href={project.liveUrl}
                        variant="primary"
                        className="min-h-0 px-3 py-2 text-[0.68rem]"
                        aria-label={`Open live project for ${project.title}`}
                      >
                        <ExternalLink className="size-3.5" aria-hidden="true" />
                        BREACH
                      </Button>
                    )}
                    {project.sourceUrl && (
                      <Button
                        href={project.sourceUrl}
                        variant="secondary"
                        className="min-h-0 px-3 py-2 text-[0.68rem]"
                        aria-label={`Open ${project.proofLabel ?? "source repository"} for ${project.title}`}
                      >
                        <GitBranch className="size-3.5" aria-hidden="true" />
                        {project.proofLabel ?? "SOURCE"}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="glass-terminal rounded-lg p-6 font-[family-name:var(--font-mono)] text-sm text-text-secondary">
            <p className="text-green">$ scan --category {activeFilter}</p>
            <p className="mt-3">
              No public project is docked in this bay yet. Placeholder reserved
              for the next build.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
