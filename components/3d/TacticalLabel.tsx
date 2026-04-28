"use client";

import { Html } from "@react-three/drei";

export interface TacticalLabelProps {
  title: string;
  subtitle?: string;
  color: string;
  visible: boolean;
}

export function TacticalLabel({
  title,
  subtitle,
  color,
  visible,
}: TacticalLabelProps) {
  if (!visible) {
    return null;
  }

  return (
    <Html center distanceFactor={10} style={{ pointerEvents: "none" }}>
      <div
        style={{
          minWidth: "180px",
          maxWidth: "240px",
          border: `1px solid ${color}`,
          borderRadius: "4px",
          background: "rgba(3, 4, 6, 0.82)",
          boxShadow: `0 0 14px ${color}55, inset 0 0 10px ${color}18`,
          color,
          fontFamily: "var(--font-jetbrains-mono), monospace",
          fontSize: "10px",
          lineHeight: 1.35,
          padding: "6px 9px",
          textTransform: "uppercase",
          whiteSpace: "normal",
        }}
      >
        <div style={{ fontWeight: 700 }}>{title}</div>
        {subtitle ? (
          <div style={{ color: "rgba(232, 232, 240, 0.78)", marginTop: 2 }}>
            {subtitle}
          </div>
        ) : null}
      </div>
    </Html>
  );
}
