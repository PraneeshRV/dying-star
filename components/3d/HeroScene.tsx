"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { StarFallback } from "@/components/fallbacks/StarFallback";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { WebGLErrorBoundary } from "./WebGLErrorBoundary";

const SpaceCanvas = dynamic(
  () => import("@/components/3d").then((m) => m.SpaceCanvas),
  { ssr: false, loading: () => <StarFallback /> },
);

/**
 * HeroScene — performance-gated 3D backdrop for the hero.
 *
 * Gate starts "undecided" and renders StarFallback so the dynamic
 * SpaceCanvas import is never triggered during SSR/first paint. A client
 * effect then resolves mobile/coarse-pointer + reduced-motion checks; the
 * Three.js/R3F chunk is only fetched if that effect flips the gate to
 * "canvas" and next/dynamic actually renders the component.
 */
export function HeroScene() {
  const prefersReducedMotion = useReducedMotion();
  const isCoarseOrMobile = useMediaQuery(
    "(max-width: 768px), (pointer: coarse)",
  );
  const [gate, setGate] = useState<"undecided" | "fallback" | "canvas">(
    "undecided",
  );

  useEffect(() => {
    if (prefersReducedMotion || isCoarseOrMobile) {
      setGate("fallback");
      return;
    }
    setGate("canvas");
  }, [prefersReducedMotion, isCoarseOrMobile]);

  if (gate !== "canvas") {
    return <StarFallback />;
  }

  return (
    <WebGLErrorBoundary fallback={<StarFallback />}>
      <SpaceCanvas />
    </WebGLErrorBoundary>
  );
}
