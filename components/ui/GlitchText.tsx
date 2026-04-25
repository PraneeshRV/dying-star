"use client";

import type { ComponentPropsWithoutRef, ElementType } from "react";
import { cn } from "@/lib/utils";
import styles from "./GlitchText.module.css";

type GlitchTextProps<TTag extends ElementType = "span"> = {
  as?: TTag;
  text: string;
} & Omit<ComponentPropsWithoutRef<TTag>, "as" | "children">;

/**
 * Cyberpunk hover/focus text treatment using CSS clip-path slices.
 */
export function GlitchText<TTag extends ElementType = "span">({
  as,
  className,
  text,
  ...props
}: GlitchTextProps<TTag>) {
  const Component = as ?? "span";

  return (
    <Component
      className={cn(styles.glitchText, className)}
      data-text={text}
      {...props}
    >
      {text}
    </Component>
  );
}
