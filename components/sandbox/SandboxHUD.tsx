"use client";

import { ArrowLeft, Crosshair, Gauge, Radar, RotateCcw } from "lucide-react";
import type {
  SandboxAction,
  SandboxControlMode,
  SandboxObject,
  SandboxObjective,
} from "@/components/sandbox/sandboxWorld";
import styles from "./SandboxHUD.module.css";
import { isExternalSandboxAction, SANDBOX_WORLD } from "./sandboxWorld";

export interface SandboxHUDProps {
  selectedObject: SandboxObject;
  selectedObjectId: string;
  scannerActive: boolean;
  controlMode: SandboxControlMode;
  discoveredObjectIds: string[];
  completedObjectiveIds: string[];
  onSelectObject: (objectId: string) => void;
  onScan: () => void;
  onResetView: () => void;
  onToggleControlMode: () => void;
  onAction: (action: SandboxAction) => void;
}

function objectiveComplete(
  objective: SandboxObjective,
  discoveredObjectIds: string[],
  completedObjectiveIds: string[],
) {
  return (
    completedObjectiveIds.includes(objective.id) ||
    objective.objectIds.every((id) => discoveredObjectIds.includes(id))
  );
}

function ActionLink({
  action,
  onAction,
}: {
  action: SandboxAction;
  onAction: (action: SandboxAction) => void;
}) {
  const external = isExternalSandboxAction(action);

  return (
    <a
      href={action.href}
      className={styles.actionLink}
      onClick={() => onAction(action)}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      {action.label}
    </a>
  );
}

export function SandboxHUD({
  selectedObject,
  selectedObjectId,
  scannerActive,
  controlMode,
  discoveredObjectIds,
  completedObjectiveIds,
  onSelectObject,
  onScan,
  onResetView,
  onToggleControlMode,
  onAction,
}: SandboxHUDProps) {
  const controlHint =
    controlMode === "freefly"
      ? "WASD moves, Space/E rises, Shift/Q descends, Escape exits free flight."
      : "Drag to orbit, scroll to zoom, select ruins from the scene or object archive.";

  return (
    <div className={styles.hud}>
      <header className={styles.topBar}>
        <a href="/" className={styles.homeLink}>
          <ArrowLeft aria-hidden="true" size={16} />
          Archive
        </a>
        <output className={styles.modeCluster} aria-label="Sandbox status">
          <span>
            <Gauge aria-hidden="true" size={14} />
            {controlMode === "guided" ? "Guided orbit" : "Free flight"}
          </span>
          <span>
            <Radar aria-hidden="true" size={14} />
            {scannerActive ? "Scanner active" : "Scanner idle"}
          </span>
        </output>
      </header>

      <aside className={styles.console} aria-labelledby="sandbox-console-title">
        <p className={styles.eyebrow}>Tactical Console</p>
        <h2 id="sandbox-console-title">{selectedObject.name}</h2>
        <p className={styles.loreName}>{selectedObject.loreName}</p>
        <p className={styles.statusLine}>{selectedObject.status}</p>
        <p className={styles.readout}>
          {scannerActive ? selectedObject.scanText : selectedObject.proofText}
        </p>
        <div className={styles.actionGrid}>
          {selectedObject.actions.map((action) => (
            <ActionLink
              key={`${selectedObject.id}-${action.label}-${action.href}`}
              action={action}
              onAction={onAction}
            />
          ))}
        </div>
        <p className={styles.controlHint}>{controlHint}</p>
      </aside>

      <section
        className={styles.objectPanel}
        aria-labelledby="sandbox-objects-title"
      >
        <p className={styles.eyebrow}>Object Archive</p>
        <h2 id="sandbox-objects-title">Recovered Objects</h2>
        <div className={styles.objectList}>
          {SANDBOX_WORLD.objects.map((object) => {
            const discovered = discoveredObjectIds.includes(object.id);
            const active = selectedObjectId === object.id;

            return (
              <button
                key={object.id}
                type="button"
                className={
                  active ? styles.objectButtonActive : styles.objectButton
                }
                aria-pressed={active}
                onClick={() => onSelectObject(object.id)}
              >
                <span>{discovered ? "discovered" : "unscanned"}</span>
                {object.name}
              </button>
            );
          })}
        </div>
      </section>

      <section
        className={styles.missionPanel}
        aria-labelledby="sandbox-mission-title"
      >
        <p className={styles.eyebrow}>Mission Ops</p>
        <h2 id="sandbox-mission-title">Relay Recovery</h2>
        <ol className={styles.objectives}>
          {SANDBOX_WORLD.objectives.map((objective) => (
            <li
              key={objective.id}
              className={
                objectiveComplete(
                  objective,
                  discoveredObjectIds,
                  completedObjectiveIds,
                )
                  ? styles.objectiveComplete
                  : styles.objective
              }
            >
              <span>{objective.label}</span>
              <p>{objective.description}</p>
            </li>
          ))}
        </ol>
      </section>

      <fieldset className={styles.bottomRail}>
        <legend className={styles.controlLegend}>Sandbox controls</legend>
        <button type="button" onClick={onScan}>
          <Crosshair aria-hidden="true" size={16} />
          Scan
        </button>
        <button type="button" onClick={onToggleControlMode}>
          <Gauge aria-hidden="true" size={16} />
          {controlMode === "guided" ? "Enter free flight" : "Exit free flight"}
        </button>
        <button type="button" onClick={onResetView}>
          <RotateCcw aria-hidden="true" size={16} />
          Reset
        </button>
      </fieldset>
    </div>
  );
}
