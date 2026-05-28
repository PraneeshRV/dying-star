"use client";

import { useMemo, useState } from "react";
import {
  DEFAULT_SANDBOX_OBJECT_ID,
  findSandboxObject,
  SANDBOX_WORLD,
  type SandboxControlMode,
} from "@/components/sandbox/sandboxWorld";

export function SandboxExperience() {
  const [selectedObjectId, setSelectedObjectId] = useState(
    DEFAULT_SANDBOX_OBJECT_ID,
  );
  const [scannerActive, setScannerActive] = useState(false);
  const [controlMode, setControlMode] =
    useState<SandboxControlMode>("guided");
  const [discoveredObjectIds, setDiscoveredObjectIds] = useState<string[]>([
    DEFAULT_SANDBOX_OBJECT_ID,
  ]);
  const selectedObject = useMemo(
    () => findSandboxObject(selectedObjectId) ?? SANDBOX_WORLD.objects[0],
    [selectedObjectId],
  );

  const handleSelectObject = (objectId: string) => {
    setSelectedObjectId(objectId);
    setDiscoveredObjectIds((current) =>
      current.includes(objectId) ? current : [...current, objectId],
    );
  };

  return (
    <section
      aria-labelledby="sandbox-title"
      className="relative isolate min-h-dvh overflow-hidden bg-void"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(88,243,255,0.16),transparent_32%),linear-gradient(180deg,#030406_0%,#07111a_56%,#030406_100%)]" />
      <div className="relative z-10 grid min-h-dvh gap-6 p-6 lg:grid-cols-[minmax(0,1fr)_24rem]">
        <div className="flex min-h-[46dvh] items-center justify-center rounded border border-cherenkov/20 bg-surface/50 p-6 text-center">
          <div>
            <p className="font-[family-name:var(--font-jetbrains-mono)] text-xs uppercase tracking-[0.28em] text-cherenkov">
              /sandbox/orbital-ruins
            </p>
            <h1
              id="sandbox-title"
              className="mt-3 font-[family-name:var(--font-orbitron)] text-3xl font-bold uppercase tracking-wider text-text-primary sm:text-5xl"
            >
              {SANDBOX_WORLD.name}
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-text-secondary sm:text-base">
              Guided orbit online. Scanner and tactical console are attached to
              the Derelict Relay.
            </p>
          </div>
        </div>

        <aside className="glass-terminal flex flex-col gap-4 p-4">
          <div>
            <p className="font-[family-name:var(--font-jetbrains-mono)] text-xs uppercase tracking-[0.24em] text-cherenkov">
              Tactical Console
            </p>
            <h2 className="mt-2 font-[family-name:var(--font-orbitron)] text-xl uppercase tracking-wider">
              {selectedObject.name}
            </h2>
            <p className="mt-2 text-sm text-text-secondary">
              {scannerActive
                ? selectedObject.scanText
                : selectedObject.proofText}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setScannerActive((value) => !value)}
              className="glass-panel px-3 py-2 font-[family-name:var(--font-jetbrains-mono)] text-xs uppercase tracking-widest text-cherenkov"
            >
              {scannerActive ? "Scanner active" : "Run scanner"}
            </button>
            <button
              type="button"
              onClick={() =>
                setControlMode((mode) =>
                  mode === "guided" ? "freefly" : "guided",
                )
              }
              className="glass-panel px-3 py-2 font-[family-name:var(--font-jetbrains-mono)] text-xs uppercase tracking-widest text-purple-hot"
            >
              {controlMode === "guided" ? "Enable free flight" : "Guided orbit"}
            </button>
          </div>

          <div className="grid gap-2">
            {SANDBOX_WORLD.objects.map((object) => (
              <button
                key={object.id}
                type="button"
                onClick={() => handleSelectObject(object.id)}
                className="border border-white/10 bg-white/[0.03] px-3 py-2 text-left text-sm text-text-secondary transition hover:border-cherenkov/40 hover:text-text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-cherenkov"
              >
                <span className="block font-[family-name:var(--font-jetbrains-mono)] text-xs uppercase tracking-[0.18em] text-text-dim">
                  {discoveredObjectIds.includes(object.id)
                    ? "discovered"
                    : "unscanned"}
                </span>
                {object.name}
              </button>
            ))}
          </div>

          <a
            href="/"
            className="mt-auto font-[family-name:var(--font-jetbrains-mono)] text-xs uppercase tracking-[0.2em] text-cherenkov underline-offset-4 hover:underline"
          >
            Return to archive
          </a>
        </aside>
      </div>
    </section>
  );
}
