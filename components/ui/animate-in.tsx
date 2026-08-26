"use client";

import { motion, useInView } from "motion/react";
import { type ReactNode, useRef } from "react";

type Direction = "up" | "down" | "left" | "right" | "none";
type AnimateInVariant = "default" | "mask" | "structural";

interface AnimateInProps {
  children: ReactNode;
  className?: string;
  /** Direction the element slides in from. Default: "up" */
  from?: Direction;
  /** Slide distance in pixels. Default: 12 */
  distance?: number;
  /** Animation duration in seconds. Default: 0.3 */
  duration?: number;
  /** Delay in seconds before animation starts. Default: 0 */
  delay?: number;
  /** Stagger index — multiplied by 0.04s for subtle stagger */
  staggerIndex?: number;
  /** Whether to trigger when entering viewport. Default: false */
  viewport?: boolean;
  /** Fraction of element visible before triggering (0–1). Default: 0.01 */
  viewportAmount?: number;
  /** HTML tag to render. Default: "div" */
  as?: keyof typeof motion;
  /**
   * Custom cubic-bezier easing as [x1, y1, x2, y2].
   * Default: [0.16, 1, 0.3, 1] — expo-out (Apple-style snap).
   */
  ease?: [number, number, number, number];
  /**
   * Animation variant:
   * - "default": Opacity + translate (existing behavior)
   * - "mask": Clip-path reveal from bottom — structural heading reveal
   * - "structural": Opacity-only fade, no translate (for containers)
   */
  variant?: AnimateInVariant;
}

/**
 * Lightweight entrance animation wrapper.
 *
 * - "default": Expo-out opacity + translate. Fast off the mark, graceful tail.
 * - "mask": Clip-path reveal from below — cinematic, architectural heading reveal.
 * - "structural": Pure opacity transition for containers that shouldn't shift.
 *
 * GPU-only properties: opacity + transform + clip-path. No layout thrash.
 * Respects reduced-motion via MotionConfig reducedMotion="user".
 */
export function AnimateIn({
  children,
  className,
  from = "none",
  distance = 0,
  duration = 0.3,
  delay = 0,
  staggerIndex = 0,
  viewport = false,
  viewportAmount = 0.01,
  as = "div",
  ease = [0.16, 1, 0.3, 1],
  variant = "default",
}: AnimateInProps) {
  // Subtle stagger: 40ms per index so groups feel orchestrated, not sluggish
  const totalDelay = delay + staggerIndex * 0.04;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Component = (motion as any)[as];

  // ── Mask variant: structural clip-path reveal ─────────────────────────────
  if (variant === "mask") {
    const initial = { clipPath: "inset(100% 0% 0% 0%)", opacity: 0 };
    const animate = { clipPath: "inset(0% 0% 0% 0%)", opacity: 1 };

    return (
      <Component
        initial={initial}
        {...(viewport
          ? {
              whileInView: animate,
              viewport: { once: true, amount: viewportAmount },
            }
          : { animate })}
        transition={{ duration: duration * 1.8, delay: totalDelay, ease }}
        className={className}
        style={{ overflow: "hidden" }}
      >
        {children}
      </Component>
    );
  }

  // ── Structural variant: opacity-only, no translate ────────────────────────
  if (variant === "structural") {
    return (
      <Component
        initial={{ opacity: 0 }}
        {...(viewport
          ? {
              whileInView: { opacity: 1 },
              viewport: { once: true, amount: viewportAmount },
            }
          : { animate: { opacity: 1 } })}
        transition={{ duration: duration * 1.2, delay: totalDelay, ease }}
        className={className}
      >
        {children}
      </Component>
    );
  }

  // ── Default variant: opacity + translate ──────────────────────────────────
  const offset = {
    up:    { x: 0, y: distance },
    down:  { x: 0, y: -distance },
    left:  { x: distance, y: 0 },
    right: { x: -distance, y: 0 },
    none:  { x: 0, y: 0 },
  }[from];

  return (
    <Component
      initial={{ opacity: 0, x: offset.x, y: offset.y }}
      {...(viewport
        ? {
            whileInView: { opacity: 1, x: 0, y: 0 },
            viewport: { once: true, amount: viewportAmount },
          }
        : {
            animate: { opacity: 1, x: 0, y: 0 },
          })}
      transition={{
        duration,
        delay: totalDelay,
        ease,
      }}
      className={className}
    >
      {children}
    </Component>
  );
}
