"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { StarFallback } from "@/components/fallbacks/StarFallback";
import { type Capability, detectCapability } from "@/lib/render/capability";

// RenderRoot owns the R3F <Canvas> and touches `navigator`/WebGPU APIs, so it
// must never run during SSR/prerender. Load it client-only.
const RenderRoot = dynamic(
  () => import("./RenderRoot").then((mod) => mod.RenderRoot),
  {
    ssr: false,
    loading: () => (
      <div className="absolute inset-0 z-0 bg-void">
        <StarFallback />
      </div>
    ),
  },
);

/**
 * Client entry for the S0 sandbox render foundation. Probes the client's
 * rendering capability once on mount, then mounts {@link RenderRoot} with the
 * result. Until the probe resolves it shows the static poster so there is never
 * a blank frame. A small perf badge reports the resolved mode and GPU tier.
 *
 * The accessible heading/intro lives in the DOM (not the canvas) so the page is
 * meaningful without WebGL and to screen readers.
 */
export function SandboxRenderHarness() {
  const [capability, setCapability] = useState<Capability | null>(null);

  useEffect(() => {
    let cancelled = false;
    detectCapability()
      .then((result) => {
        if (!cancelled) setCapability(result);
      })
      .catch(() => {
        if (!cancelled) {
          setCapability({
            mode: "static",
            tier: 0,
            reducedMotion: false,
            compactViewport: false,
            pageVisible: true,
          });
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section
      aria-labelledby="sandbox-render-title"
      className="relative isolate min-h-dvh overflow-hidden bg-void"
    >
      {capability ? (
        <RenderRoot capability={capability} />
      ) : (
        <div className="absolute inset-0 z-0 bg-void">
          <StarFallback />
        </div>
      )}

      <div className="pointer-events-none absolute left-1/2 top-20 z-10 -translate-x-1/2 text-center">
        <p className="font-[family-name:var(--font-jetbrains-mono)] text-xs uppercase tracking-[0.28em] text-cherenkov">
          /sandbox · render foundation (S0)
        </p>
        <h1
          id="sandbox-render-title"
          className="mt-2 font-[family-name:var(--font-orbitron)] text-2xl font-bold uppercase tracking-wider text-text-primary"
        >
          Dying Star — Render Foundation
        </h1>
        <p className="mx-auto mt-2 max-w-md px-4 text-sm text-text-secondary">
          Proving the bleeding-edge path: a single TSL test star authored once,
          rendered on WebGPU, degrading to WebGL2, then to a static poster.
        </p>
      </div>

      <p
        aria-live="polite"
        className="pointer-events-none absolute bottom-4 right-4 z-10 rounded border border-cherenkov/30 bg-void/70 px-2 py-1 font-[family-name:var(--font-jetbrains-mono)] text-[10px] uppercase tracking-[0.2em] text-cherenkov"
      >
        {capability
          ? `mode ${capability.mode} · gpu tier ${capability.tier}`
          : "probing…"}
      </p>
    </section>
  );
}
