"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import styles from "./CustomCursor.module.css";

const HOVER_SELECTOR =
  'a, button, input, textarea, select, summary, [role="button"], [data-cursor-hover]';

function isHoverTarget(target: EventTarget | null) {
  return target instanceof Element && Boolean(target.closest(HOVER_SELECTOR));
}

/**
 * Replaces the system cursor with a requestAnimationFrame-driven reticle.
 */
export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const targetPosition = useRef({ x: 0, y: 0 });
  const currentPosition = useRef({ x: 0, y: 0 });
  const rafId = useRef<number | null>(null);
  const visibilityRef = useRef(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const supportsFinePointer = window.matchMedia("(pointer: fine)").matches;
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (!supportsFinePointer || prefersReducedMotion) {
      return;
    }

    document.documentElement.classList.add("custom-cursor-enabled");

    const animate = () => {
      const cursor = cursorRef.current;

      if (cursor) {
        currentPosition.current.x +=
          (targetPosition.current.x - currentPosition.current.x) * 0.22;
        currentPosition.current.y +=
          (targetPosition.current.y - currentPosition.current.y) * 0.22;

        cursor.style.transform = `translate3d(${currentPosition.current.x}px, ${currentPosition.current.y}px, 0) translate3d(-50%, -50%, 0)`;
      }

      rafId.current = requestAnimationFrame(animate);
    };

    const handlePointerMove = (event: PointerEvent) => {
      targetPosition.current = { x: event.clientX, y: event.clientY };

      if (!visibilityRef.current) {
        visibilityRef.current = true;
        currentPosition.current = { x: event.clientX, y: event.clientY };
        setIsVisible(true);
      }

      setIsHovering(isHoverTarget(event.target));
    };

    const handlePointerLeave = () => {
      visibilityRef.current = false;
      setIsVisible(false);
    };
    const handlePointerOver = (event: PointerEvent) => {
      setIsHovering(isHoverTarget(event.target));
    };

    window.addEventListener("pointermove", handlePointerMove, {
      passive: true,
    });
    window.addEventListener("pointerover", handlePointerOver, {
      passive: true,
    });
    document.documentElement.addEventListener(
      "pointerleave",
      handlePointerLeave,
    );
    rafId.current = requestAnimationFrame(animate);

    return () => {
      document.documentElement.classList.remove("custom-cursor-enabled");
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerover", handlePointerOver);
      document.documentElement.removeEventListener(
        "pointerleave",
        handlePointerLeave,
      );

      if (rafId.current !== null) {
        cancelAnimationFrame(rafId.current);
      }
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className={cn(
        styles.cursor,
        isVisible && styles.visible,
        isHovering && styles.hovering,
      )}
      ref={cursorRef}
    >
      <span className={styles.ring} />
    </div>
  );
}
