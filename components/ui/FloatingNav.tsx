"use client";

import {
  Award,
  BookOpen,
  Briefcase,
  Cpu,
  Flag,
  FolderGit2,
  Home,
  Mail,
  User,
} from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import styles from "./FloatingNav.module.css";

type NavItem = {
  id: string;
  label: string;
  Icon: typeof Home;
};

const NAV_ITEMS: readonly NavItem[] = [
  { id: "home", label: "Home", Icon: Home },
  { id: "about", label: "About", Icon: User },
  { id: "projects", label: "Projects", Icon: FolderGit2 },
  { id: "skills", label: "Skills", Icon: Cpu },
  { id: "experience", label: "Experience", Icon: Briefcase },
  {
    id: "certifications",
    label: "Certifications",
    Icon: Award,
  },
  { id: "ctf", label: "CTF", Icon: Flag },
  { id: "blog", label: "Blog", Icon: BookOpen },
  { id: "contact", label: "Contact", Icon: Mail },
] as const;

// Distance (in px) the user must scroll past before auto-hide kicks in.
// Prevents the nav from twitching on small wheel jitter near the top.
const SCROLL_HIDE_THRESHOLD = 12;
// Keep the nav hidden until the user scrolls past the hero so it doesn't
// overlap the "scroll to explore" indicator.
const HERO_REVEAL_OFFSET = 240;

export interface FloatingNavProps {
  /** Override default sections, e.g. on a docs subpage. */
  items?: readonly NavItem[];
  className?: string;
}

export function FloatingNav({
  items = NAV_ITEMS,
  className,
}: FloatingNavProps) {
  const [activeId, setActiveId] = useState<string>(items[0]?.id ?? "");
  const [visible, setVisible] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  // Track scroll direction for auto-hide.
  const lastScrollY = useRef(0);

  useEffect(() => {
    if (typeof window === "undefined") return;
    lastScrollY.current = window.scrollY;
    // Sync initial visibility to current scroll position (e.g. after refresh
    // mid-page or when navigating back with a scroll restoration).
    setVisible(window.scrollY >= HERO_REVEAL_OFFSET);

    const onScroll = () => {
      const current = window.scrollY;
      const delta = current - lastScrollY.current;

      // Hide while still inside the hero so we don't cover the scroll
      // indicator. Otherwise auto-hide on scroll down, reveal on scroll up.
      if (current < HERO_REVEAL_OFFSET) {
        setVisible(false);
      } else if (lastScrollY.current < HERO_REVEAL_OFFSET) {
        setVisible(true);
      } else if (Math.abs(delta) > SCROLL_HIDE_THRESHOLD) {
        setVisible(delta < 0);
      }

      lastScrollY.current = current;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Active section detection via IntersectionObserver.
  useEffect(() => {
    if (typeof window === "undefined") return;

    const sections = items
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => el !== null);

    if (sections.length === 0) return;

    // Track each section's current intersection ratio so we can pick the
    // most-visible one rather than reacting to single entries individually.
    const ratios = new Map<string, number>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          ratios.set(entry.target.id, entry.intersectionRatio);
        }

        let bestId = "";
        let bestRatio = 0;
        for (const [id, ratio] of ratios) {
          if (ratio > bestRatio) {
            bestRatio = ratio;
            bestId = id;
          }
        }

        if (bestId && bestRatio > 0) {
          setActiveId(bestId);
        }
      },
      {
        // A horizontal band centered vertically — the section that occupies
        // the viewport's middle region wins.
        rootMargin: "-35% 0px -55% 0px",
        threshold: [0, 0.25, 0.5, 0.75, 1],
      },
    );

    for (const section of sections) observer.observe(section);
    return () => observer.disconnect();
  }, [items]);

  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLAnchorElement>, id: string) => {
      const target = document.getElementById(id);
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({
        behavior: prefersReducedMotion ? "auto" : "smooth",
        block: "start",
      });
      // Optimistically set active so the indicator reacts immediately.
      setActiveId(id);
      // Update hash without jumping.
      if (typeof history !== "undefined") {
        history.replaceState(null, "", `#${id}`);
      }
    },
    [prefersReducedMotion],
  );

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="floating-nav"
          className={cn(styles.wrapper, className)}
          initial={prefersReducedMotion ? false : { y: 32, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={prefersReducedMotion ? { opacity: 0 } : { y: 32, opacity: 0 }}
          transition={{
            type: "spring",
            stiffness: 320,
            damping: 28,
            mass: 0.6,
          }}
        >
          <nav className={styles.dock} aria-label="Section navigation">
            {items.map(({ id, label, Icon }) => {
              const isActive = activeId === id;
              return (
                <a
                  key={id}
                  href={`#${id}`}
                  onClick={(e) => handleClick(e, id)}
                  className={cn(styles.item, isActive && styles.itemActive)}
                  aria-label={`Navigate to ${label} section`}
                  aria-current={isActive ? "page" : undefined}
                >
                  <Icon className={styles.icon} aria-hidden="true" />
                  <span className={styles.tooltip}>{label}</span>
                  {isActive && (
                    <motion.span
                      layoutId="floating-nav-active-dot"
                      className={styles.activeDot}
                      aria-hidden="true"
                      transition={{
                        type: "spring",
                        stiffness: 380,
                        damping: 30,
                      }}
                    />
                  )}
                </a>
              );
            })}
          </nav>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default FloatingNav;
