"use client";

import { useEffect, useMemo, useState } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/utils";
import styles from "./BootLoader.module.css";

const BOOT_LINES = [
  "Initializing core systems...",
  "Mounting /dev/void...",
  "Bypassing firewall...",
  "Establishing quantum link...",
  "Loading neutron star renderer...",
  "Connection established.",
] as const;

const BAR_SEGMENTS = 10;
const TYPE_SPEED_MS = 28;
const LINE_PAUSE_MS = 140;
const FADE_MS = 500;

type BootLoaderProps = {
  className?: string;
  onComplete: () => void;
};

function buildProgressBar(progress: number) {
  const filledSegments = Math.round((progress / 100) * BAR_SEGMENTS);
  const filled = "█".repeat(filledSegments);
  const empty = "░".repeat(BAR_SEGMENTS - filledSegments);

  return `[${filled}${empty}] ${progress}%`;
}

/**
 * Full-screen Arch-inspired terminal boot sequence for initial page reveal.
 */
export function BootLoader({ className, onComplete }: BootLoaderProps) {
  const prefersReducedMotion = useReducedMotion();
  const [completedLines, setCompletedLines] = useState<string[]>([]);
  const [activeLine, setActiveLine] = useState("");
  const [progress, setProgress] = useState(0);
  const [isFading, setIsFading] = useState(false);

  const progressBar = useMemo(() => buildProgressBar(progress), [progress]);

  useEffect(() => {
    let isCancelled = false;
    const timeouts = new Set<ReturnType<typeof setTimeout>>();

    const wait = (duration: number) =>
      new Promise<void>((resolve) => {
        const timeout = setTimeout(resolve, duration);
        timeouts.add(timeout);
      });

    const finish = async () => {
      setProgress(100);
      setIsFading(true);
      await wait(prefersReducedMotion ? 1 : FADE_MS);

      if (!isCancelled) {
        onComplete();
      }
    };

    const runBootSequence = async () => {
      if (prefersReducedMotion) {
        setCompletedLines([...BOOT_LINES]);
        setActiveLine("");
        await finish();
        return;
      }

      for (let lineIndex = 0; lineIndex < BOOT_LINES.length; lineIndex += 1) {
        const line = BOOT_LINES[lineIndex];

        for (let charIndex = 1; charIndex <= line.length; charIndex += 1) {
          if (isCancelled) {
            return;
          }

          setActiveLine(line.slice(0, charIndex));
          const typedRatio =
            (lineIndex + charIndex / line.length) / BOOT_LINES.length;
          setProgress(Math.min(99, Math.round(typedRatio * 100)));
          await wait(TYPE_SPEED_MS);
        }

        setCompletedLines((currentLines) => [...currentLines, line]);
        setActiveLine("");
        await wait(LINE_PAUSE_MS);
      }

      await finish();
    };

    runBootSequence();

    return () => {
      isCancelled = true;
      for (const timeout of timeouts) {
        clearTimeout(timeout);
      }
    };
  }, [onComplete, prefersReducedMotion]);

  return (
    <div
      className={cn(styles.bootLoader, isFading && styles.complete, className)}
    >
      <section
        aria-label="System boot sequence"
        aria-live="polite"
        className={styles.terminal}
      >
        <div className={styles.header}>
          <span>arch@dying-star tty1</span>
          <span className={styles.prompt}>kernel: void-portfolio</span>
        </div>

        <pre className={styles.lines}>
          {completedLines.map((line) => (
            <span className={styles.line} key={line}>
              {"> "}
              {line}
              {"\n"}
            </span>
          ))}
          {!isFading && (
            <span className={styles.line}>
              {"> "}
              {activeLine}
              <span className={styles.cursor} />
            </span>
          )}
        </pre>

        <div className={styles.progress}>
          <div className={styles.progressMeta}>
            <span>neutron-renderer.service</span>
            <span>{progress}%</span>
          </div>
          <div className={styles.progressBar}>{progressBar}</div>
        </div>
      </section>
    </div>
  );
}
