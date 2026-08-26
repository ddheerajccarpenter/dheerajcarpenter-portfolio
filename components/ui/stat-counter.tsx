"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "motion/react";

interface StatCounterProps {
  /** Target number to count to */
  value: number;
  /** Suffix string, e.g. "+" or "K+" */
  suffix?: string;
  /** Duration in seconds for the count-up. Default: 1.2 */
  duration?: number;
  /** Delay in seconds before counting begins. Default: 0 */
  delay?: number;
  className?: string;
}

/**
 * StatCounter — Viewport-triggered count-up from 0 to value.
 *
 * Uses spring physics for natural deceleration.
 * Triggers once when entering viewport.
 * Respects prefers-reduced-motion (shows final value immediately).
 * Used ONLY for hero section stat numbers.
 */
export function StatCounter({
  value,
  suffix = "",
  duration = 1.2,
  delay = 0,
  className,
}: StatCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  const [displayed, setDisplayed] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const reducedMotion = useRef(false);

  useEffect(() => {
    reducedMotion.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  useEffect(() => {
    if (!isInView || hasStarted) return;
    setHasStarted(true);

    // Respect reduced motion: jump to final value immediately
    if (reducedMotion.current) {
      setDisplayed(value);
      return;
    }

    const delayMs = delay * 1000;
    const startTime = performance.now() + delayMs;
    let raf: number;

    const tick = (now: number) => {
      if (now < startTime) {
        raf = requestAnimationFrame(tick);
        return;
      }

      const elapsed = now - startTime;
      const durationMs = duration * 1000;
      const progress = Math.min(elapsed / durationMs, 1);

      // Custom ease: expo-out feel for spring-like deceleration
      const eased = 1 - Math.pow(1 - progress, 4);
      const current = Math.round(eased * value);
      setDisplayed(current);

      if (progress < 1) {
        raf = requestAnimationFrame(tick);
      }
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [isInView, value, duration, delay, hasStarted]);

  return (
    <span ref={ref} className={className} aria-label={`${value}${suffix}`}>
      {displayed}
      {suffix}
    </span>
  );
}
