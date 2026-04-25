"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import styles from "./TypewriterText.module.css";

export type TypewriterTextProps = {
  /** Full text to type out, character by character. */
  text: string;
  /** Milliseconds per character. Default: 40ms. */
  speed?: number;
  /** Fired exactly once when the full text has been rendered. */
  onComplete?: () => void;
  /** Hide the trailing blinking cursor. */
  hideCursor?: boolean;
  className?: string;
};

/**
 * Renders text character-by-character driven by `requestAnimationFrame`,
 * so the timing stays smooth and pauses while the tab is hidden.
 */
export function TypewriterText({
  text,
  speed = 40,
  onComplete,
  hideCursor = false,
  className,
}: TypewriterTextProps) {
  const [rendered, setRendered] = useState("");
  const [done, setDone] = useState(false);

  // Always read the latest callback inside the rAF loop without re-running it.
  const onCompleteRef = useRef(onComplete);
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    setRendered("");
    setDone(false);

    // Honor reduced motion: render the whole string immediately.
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setRendered(text);
      setDone(true);
      onCompleteRef.current?.();
      return;
    }

    if (text.length === 0) {
      setDone(true);
      onCompleteRef.current?.();
      return;
    }

    const stepMs = Math.max(0, speed);
    let rafId = 0;
    let startTs: number | null = null;
    let cancelled = false;

    const tick = (ts: number) => {
      if (cancelled) return;
      if (startTs === null) startTs = ts;
      const elapsed = ts - startTs;
      const target =
        stepMs === 0
          ? text.length
          : Math.min(text.length, Math.floor(elapsed / stepMs));

      setRendered(text.slice(0, target));

      if (target >= text.length) {
        setDone(true);
        onCompleteRef.current?.();
        return;
      }
      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);

    return () => {
      cancelled = true;
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [text, speed]);

  return (
    <output
      className={cn(styles.root, className)}
      aria-live="polite"
      aria-label={text}
    >
      <span className={styles.text} aria-hidden="true">
        {rendered}
      </span>
      {!hideCursor && (
        <span
          className={styles.cursor}
          aria-hidden="true"
          data-typing={!done || undefined}
        />
      )}
    </output>
  );
}
