"use client";

import { MotionConfig } from "motion/react";
import { type ReactNode } from "react";

/**
 * Global motion configuration.
 *
 * - 150ms baseline — instant feel, no perceptible lag.
 * - Expo-out easing [0.16, 1, 0.3, 1] — snaps off the mark, smooth tail.
 * - reducedMotion="user" — fully respects prefers-reduced-motion.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <MotionConfig
      transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
      reducedMotion="user"
    >
      {children}
    </MotionConfig>
  );
}
