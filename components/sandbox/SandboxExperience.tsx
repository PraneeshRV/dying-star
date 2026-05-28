"use client";

import { useMemo, useState } from "react";
import { SandboxCanvas } from "@/components/3d/sandbox";
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

  const completeObjective = (objectiveId: string) => {
    setCompletedObjectiveIds((current) =>
      current.includes(objectiveId) ? current : [...current, objectiveId],
    );
  };

  const handleSelectObject = (objectId: string) => {
    const nextDiscoveryCount = discoveredObjectIds.includes(objectId)
      ? discoveredObjectIds.length
      : discoveredObjectIds.length + 1;

    setSelectedObjectId(objectId);
    setDiscoveredObjectIds((current) =>
      current.includes(objectId) ? current : [...current, objectId],
    );

    if (nextDiscoveryCount >= 3) {
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

  return (
    <section
      aria-labelledby="sandbox-title"
      className="relative isolate min-h-dvh overflow-hidden bg-void"
    >
      <SandboxCanvas
        selectedObjectId={selectedObjectId}
        scannerActive={scannerActive}
        controlMode={controlMode}
        onSelectObject={handleSelectObject}
        onExitFreeFlight={() => setControlMode("guided")}
      />
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
        discoveredObjectIds={discoveredObjectIds}
        completedObjectiveIds={completedObjectiveIds}
        onSelectObject={handleSelectObject}
        onScan={handleScan}
        onResetView={handleResetView}
        onToggleControlMode={() =>
          setControlMode((mode) => (mode === "guided" ? "freefly" : "guided"))
        }
        onAction={handleAction}
      />
    </section>
  );
}
