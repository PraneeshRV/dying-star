import { type ClassValue, clsx } from "clsx";

/**
 * Merge class names conditionally.
 * Lightweight alternative to clsx — using clsx if installed, else manual.
 */
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

/**
 * Format a date to human-readable string.
 */
export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(date));
}
