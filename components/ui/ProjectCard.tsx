"use client";

import {
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
  useCallback,
  useRef,
} from "react";
import { cn } from "@/lib/utils";
import type { Project } from "@/types";
import styles from "./ProjectCard.module.css";

export type ProjectCardProps = {
  title: string;
  description: string;
  techStack: string[];
  status: Project["status"];
  sourceUrl?: string;
  proofLabel?: string;
  role?: string;
  year?: string;
  scope?: string;
  className?: string;
};

const STATUS_LABEL: Record<Project["status"], string> = {
  active: "Active",
  wip: "WIP",
  archived: "Archived",
};

const STATUS_CLASS: Record<Project["status"], string> = {
  active: styles.statusActive,
  wip: styles.statusWip,
  archived: styles.statusArchived,
};

// Tilt config — kept conservative so it feels premium, not nauseating
const MAX_TILT_DEG = 8;

/**
 * Project showcase card — glassmorphism + pointer-tracked 3D tilt
 * + glowing border on hover. Falls flat for reduced-motion users.
 */
export function ProjectCard({
  title,
  description,
  techStack,
  status,
  sourceUrl,
  proofLabel = "View Source",
  role,
  year,
  scope,
  className,
}: ProjectCardProps) {
  const cardRef = useRef<HTMLElement>(null);
  const rafRef = useRef<number | null>(null);

  const updateTilt = useCallback((clientX: number, clientY: number) => {
    const node = cardRef.current;
    if (!node) return;
    const rect = node.getBoundingClientRect();
    const x = (clientX - rect.left) / rect.width; // 0..1
    const y = (clientY - rect.top) / rect.height; // 0..1
    const ry = (x - 0.5) * 2 * MAX_TILT_DEG;
    const rx = -(y - 0.5) * 2 * MAX_TILT_DEG;
    node.style.setProperty("--rx", `${rx.toFixed(2)}deg`);
    node.style.setProperty("--ry", `${ry.toFixed(2)}deg`);
    node.style.setProperty("--mx", `${(x * 100).toFixed(2)}%`);
    node.style.setProperty("--my", `${(y * 100).toFixed(2)}%`);
  }, []);

  const handlePointerMove = useCallback(
    (e: ReactPointerEvent<HTMLElement>) => {
      // Skip on coarse pointers (touch)
      if (e.pointerType === "touch") return;
      const { clientX, clientY } = e;
      if (rafRef.current !== null) return;
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null;
        updateTilt(clientX, clientY);
      });
    },
    [updateTilt],
  );

  const handlePointerLeave = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    const node = cardRef.current;
    if (!node) return;
    node.style.setProperty("--rx", "0deg");
    node.style.setProperty("--ry", "0deg");
    node.style.setProperty("--mx", "50%");
    node.style.setProperty("--my", "50%");
  }, []);

  const initialStyle: CSSProperties = {
    ["--rx" as string]: "0deg",
    ["--ry" as string]: "0deg",
    ["--mx" as string]: "50%",
    ["--my" as string]: "50%",
  };

  return (
    <div className={cn(styles.wrapper, className)}>
      <article
        ref={cardRef}
        className={styles.card}
        style={initialStyle}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        onPointerCancel={handlePointerLeave}
      >
        <header className={styles.header}>
          <h3 className={styles.title}>{title}</h3>
          <output
            className={cn(styles.status, STATUS_CLASS[status])}
            aria-label={`Status: ${STATUS_LABEL[status]}`}
          >
            {STATUS_LABEL[status]}
          </output>
        </header>

        <p className={styles.description}>{description}</p>

        <footer className={styles.footer}>
          {(role || year || scope) && (
            <dl
              className={styles.metaList}
              aria-label={`Proof context for ${title}`}
            >
              {role && (
                <div className={styles.metaItem}>
                  <dt>Role</dt>
                  <dd>{role}</dd>
                </div>
              )}
              {year && (
                <div className={styles.metaItem}>
                  <dt>Year</dt>
                  <dd>{year}</dd>
                </div>
              )}
              {scope && (
                <div className={styles.metaItem}>
                  <dt>Scope</dt>
                  <dd>{scope}</dd>
                </div>
              )}
            </dl>
          )}

          {techStack.length > 0 && (
            <ul
              className={styles.techStack}
              aria-label={`Tech stack for ${title}`}
            >
              {techStack.map((tech) => (
                <li key={tech} className={styles.techPill}>
                  {tech}
                </li>
              ))}
            </ul>
          )}

          {sourceUrl && (
            <a
              href={sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.sourceLink}
              aria-label={`${proofLabel} for ${title}`}
            >
              {proofLabel}
            </a>
          )}
        </footer>
      </article>
    </div>
  );
}
