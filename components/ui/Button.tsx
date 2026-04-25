"use client";

import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  ReactNode,
} from "react";
import { cn } from "@/lib/utils";
import styles from "./Button.module.css";

type ButtonVariant = "primary" | "secondary";

type CommonProps = {
  variant?: ButtonVariant;
  children: ReactNode;
  className?: string;
};

type AnchorProps = CommonProps & {
  href: string;
} & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "className">;

type ButtonProps = CommonProps & {
  href?: undefined;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className">;

export type ButtonComponentProps = AnchorProps | ButtonProps;

/**
 * Cybersecurity-styled action element with glassmorphism + neon glow.
 *
 * Renders an `<a>` when `href` is provided, otherwise a `<button>`.
 * - `primary` → Quasar Green border + glow
 * - `secondary` → Nebula Purple border + glow
 */
export function Button(props: ButtonComponentProps) {
  const { variant = "primary", children, className } = props;
  const classes = cn(
    styles.button,
    variant === "primary" ? styles.primary : styles.secondary,
    className,
  );

  if ("href" in props && props.href !== undefined) {
    const { href, variant: _v, children: _c, className: _cn, ...rest } = props;
    const isExternal = /^https?:\/\//i.test(href);
    return (
      <a
        href={href}
        className={classes}
        {...(isExternal
          ? { target: "_blank", rel: "noopener noreferrer" }
          : null)}
        {...rest}
      >
        {children}
      </a>
    );
  }

  const {
    variant: _v,
    children: _c,
    className: _cn,
    type = "button",
    ...rest
  } = props as ButtonProps;

  return (
    <button type={type} className={classes} {...rest}>
      {children}
    </button>
  );
}
