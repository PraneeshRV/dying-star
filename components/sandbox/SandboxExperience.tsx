"use client";

import { useEffect, useMemo, useState } from "react";
import { SandboxCanvas } from "@/components/3d/sandbox";
import { WebGLErrorBoundary } from "@/components/3d/WebGLErrorBoundary";
import { StarFallback } from "@/components/fallbacks/StarFallback";
import { SandboxHUD } from "@/components/sandbox/SandboxHUD";
import {
  DEFAULT_SANDBOX_OBJECT_ID,
  findSandboxObject,
  SANDBOX_WORLD,
  type SandboxAction,
  type SandboxControlMode,
} from "@/components/sandbox/sandboxWorld";

export function SandboxExperience() {
  const [selectedObjectId, setSelectedObjectId] = useState(
    DEFAULT_SANDBOX_OBJECT_ID,
  );
  const [mobileViewport, setMobileViewport] = useState(false);
  const [scannerActive, setScannerActive] = useState(false);
  const [controlMode, setControlMode] = useState<SandboxControlMode>("guided");
  const [discoveredObjectIds, setDiscoveredObjectIds] = useState<string[]>([
    DEFAULT_SANDBOX_OBJECT_ID,
  ]);
  const [completedObjectiveIds, setCompletedObjectiveIds] = useState<string[]>(
    [],
  );
  const selectedObject = useMemo(
    () => findSandboxObject(selectedObjectId) ?? SANDBOX_WORLD.objects[0],
    [selectedObjectId],
  );
  const freeFlightAvailable =
    SANDBOX_WORLD.controls.freeFlightEnabled &&
    (!mobileViewport || SANDBOX_WORLD.controls.mobileFreeFlightEnabled);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 720px)");
    const update = () => setMobileViewport(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (!freeFlightAvailable && controlMode === "freefly") {
      setControlMode("guided");
    }
  }, [controlMode, freeFlightAvailable]);

  const completeObjective = (objectiveId: string) => {
    setCompletedObjectiveIds((current) =>
      current.includes(objectiveId) ? current : [...current, objectiveId],
    );
  };

  const handleSelectObject = (objectId: string) => {
    const nextDiscoveredObjectIds = discoveredObjectIds.includes(objectId)
      ? discoveredObjectIds
      : [...discoveredObjectIds, objectId];
    const proofObjective = SANDBOX_WORLD.objectives.find(
      (objective) => objective.id === "inspect-proof",
    );

    setSelectedObjectId(objectId);
    setDiscoveredObjectIds(nextDiscoveredObjectIds);

    if (
      proofObjective?.objectIds.every((id) =>
        nextDiscoveredObjectIds.includes(id),
      )
    ) {
      completeObjective("inspect-proof");
    }
  };

  const handleScan = () => {
    setScannerActive(true);
    handleSelectObject(selectedObjectId);
    completeObjective("scan-relay");
  };

  const handleResetView = () => {
    setSelectedObjectId(DEFAULT_SANDBOX_OBJECT_ID);
    setControlMode("guided");
  };

  const handleAction = (action: SandboxAction) => {
    const archiveObjective = SANDBOX_WORLD.objectives.find(
      (objective) => objective.id === "open-archive-route",
    );

    if (action.href && archiveObjective?.objectIds.includes(selectedObjectId)) {
      completeObjective("open-archive-route");
    }
  };

  const handleToggleControlMode = () => {
    if (!freeFlightAvailable) return;
    setControlMode((mode) => (mode === "guided" ? "freefly" : "guided"));
  };

  return (
    <section
      aria-labelledby="sandbox-title"
      className="relative isolate min-h-dvh overflow-hidden bg-void"
    >
      <WebGLErrorBoundary
        fallback={
          <div className="absolute inset-0 z-0 bg-void">
            <StarFallback />
          </div>
        }
      >
        <SandboxCanvas
          selectedObjectId={selectedObjectId}
          scannerActive={scannerActive}
          controlMode={controlMode}
          onSelectObject={handleSelectObject}
          onExitFreeFlight={() => setControlMode("guided")}
        />
      </WebGLErrorBoundary>
      <div className="pointer-events-none absolute left-1/2 top-20 z-10 hidden -translate-x-1/2 text-center lg:block">
        <p className="font-[family-name:var(--font-jetbrains-mono)] text-xs uppercase tracking-[0.28em] text-cherenkov">
          /sandbox/orbital-ruins
        </p>
        <h1
          id="sandbox-title"
          className="mt-2 font-[family-name:var(--font-orbitron)] text-2xl font-bold uppercase tracking-wider text-text-primary"
        >
          {SANDBOX_WORLD.name}
        </h1>
      </div>
      <SandboxHUD
        selectedObject={selectedObject}
        selectedObjectId={selectedObjectId}
        scannerActive={scannerActive}
        controlMode={controlMode}
        freeFlightAvailable={freeFlightAvailable}
        discoveredObjectIds={discoveredObjectIds}
        completedObjectiveIds={completedObjectiveIds}
        onSelectObject={handleSelectObject}
        onScan={handleScan}
        onResetView={handleResetView}
        onToggleControlMode={handleToggleControlMode}
        onAction={handleAction}
      />
    </section>
  );
}
