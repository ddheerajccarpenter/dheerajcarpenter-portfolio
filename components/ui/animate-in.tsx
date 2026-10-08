"use client";

import { motion } from "motion/react";
import { useRef, type ReactNode } from "react";

type Direction = "up" | "down" | "left" | "right" | "none";
type AnimateInVariant =
  | "default"
  | "mask"
  | "structural"
  | "scale-zoom"
  | "slide-left"
  | "slide-right"
  | "fade-rise"
  | "iso"
  | "iso-card"
  | "jitter-pop"
  | "jitter-slide";

interface AnimateInProps {
  children: ReactNode;
  className?: string;
  from?: Direction;
  distance?: number;
  duration?: number;
  delay?: number;
  staggerIndex?: number;
  viewport?: boolean;
  viewportAmount?: number;
  as?: keyof typeof motion;
  ease?: [number, number, number, number];
  variant?: AnimateInVariant;
  initialScale?: number;
}

/**
 * High-performance, minimal entrance animation.
 *
 * Core principles:
 * - Only opacity + single-axis translate (strictly GPU compositor, 0 paint/layout cost).
 * - Snappy Apple-style durations (0.24s–0.32s) so scrolls feel instant and responsive.
 * - Minimal perceptual blur via 8% opacity trailing lag — zero shader/filter cost.
 * - Mobile-safe: distances clamped tightly (8–10px) to prevent disorienting fly-ins.
 * - Zero state/useEffect on mount: synchronous matchMedia check cached per instance.
 */
function isMobileViewport(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(max-width: 767px)").matches;
}

// Smooth ease — not too snappy, not too slow
const DEFAULT_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export function AnimateIn({
  children,
  className,
  from = "none",
  distance = 0,
  duration = 0.42,
  delay = 0,
  staggerIndex = 0,
  viewport = false,
  viewportAmount = 0.05,
  as = "div",
  ease = DEFAULT_EASE,
  variant = "default",
  initialScale = 3.0,
}: AnimateInProps) {
  // Read once synchronously on render — zero re-renders, SSR safe
  const mobile = useRef(isMobileViewport()).current;

  // Stagger: comfortable and readable (28ms mobile, 55ms desktop)
  const stagger = mobile ? 0.028 : 0.055;
  const totalDelay = delay + staggerIndex * stagger;

  // Duration: smooth (0.36s on mobile, 0.42s on desktop)
  const d = mobile ? Math.min(duration, 0.36) : duration;

  // Distance: grounded and legible (max 12px on mobile, max 20px on desktop)
  const dist = mobile ? Math.min(distance || 12, 12) : (distance || 18);

  // Subtle opacity trail: finishes 8% after translate for zero-cost motion blur
  const opacityDuration = d * 1.08;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Component = (motion as any)[as];

  // ── Scale-Zoom ─────────────────────────────────────────────────────────────
  if (variant === "scale-zoom") {
    const scale = mobile ? Math.min(initialScale, 1.8) : initialScale;
    return (
      <Component
        initial={{ scale, opacity: 1 }}
        {...(viewport
          ? { whileInView: { scale: 1 }, viewport: { once: true, amount: viewportAmount } }
          : { animate: { scale: 1 } })}
        transition={{ scale: { delay: totalDelay, duration: d * 3.5, ease } }}
        className={className}
        style={{ transformOrigin: "top" }}
      >
        {children}
      </Component>
    );
  }

  // ── Slide-Left: desktop=x slide, mobile=gentle y rise ─────────────────────
  if (variant === "slide-left") {
    if (mobile) {
      return (
        <Component
          initial={{ opacity: 0, y: 8 }}
          {...(viewport
            ? { whileInView: { opacity: 1, y: 0 }, viewport: { once: true, amount: viewportAmount } }
            : { animate: { opacity: 1, y: 0 } })}
          transition={{
            y: { duration: d, delay: totalDelay, ease },
            opacity: { duration: opacityDuration, delay: totalDelay, ease },
          }}
          className={className}
        >
          {children}
        </Component>
      );
    }
    const dx = distance || 24;
    return (
      <Component
        initial={{ opacity: 0, x: dx }}
        {...(viewport
          ? { whileInView: { opacity: 1, x: 0 }, viewport: { once: true, amount: viewportAmount } }
          : { animate: { opacity: 1, x: 0 } })}
        transition={{
          x: { duration: d, delay: totalDelay, ease },
          opacity: { duration: opacityDuration, delay: totalDelay, ease },
        }}
        className={className}
      >
        {children}
      </Component>
    );
  }

  // ── Slide-Right: desktop=x slide, mobile=gentle y rise ────────────────────
  if (variant === "slide-right") {
    if (mobile) {
      return (
        <Component
          initial={{ opacity: 0, y: 8 }}
          {...(viewport
            ? { whileInView: { opacity: 1, y: 0 }, viewport: { once: true, amount: viewportAmount } }
            : { animate: { opacity: 1, y: 0 } })}
          transition={{
            y: { duration: d, delay: totalDelay, ease },
            opacity: { duration: opacityDuration, delay: totalDelay, ease },
          }}
          className={className}
        >
          {children}
        </Component>
      );
    }
    const dx = distance || 24;
    return (
      <Component
        initial={{ opacity: 0, x: -dx }}
        {...(viewport
          ? { whileInView: { opacity: 1, x: 0 }, viewport: { once: true, amount: viewportAmount } }
          : { animate: { opacity: 1, x: 0 } })}
        transition={{
          x: { duration: d, delay: totalDelay, ease },
          opacity: { duration: opacityDuration, delay: totalDelay, ease },
        }}
        className={className}
      >
        {children}
      </Component>
    );
  }

  // ── Fade-Rise: opacity + gentle Y rise ───────────────────────────────────
  if (variant === "fade-rise") {
    const dy = mobile ? Math.min(distance || 14, 10) : (distance || 18);
    return (
      <Component
        initial={{ opacity: 0, y: dy }}
        {...(viewport
          ? { whileInView: { opacity: 1, y: 0 }, viewport: { once: true, amount: viewportAmount } }
          : { animate: { opacity: 1, y: 0 } })}
        transition={{
          y: { duration: d, delay: totalDelay, ease },
          opacity: { duration: opacityDuration, delay: totalDelay, ease },
        }}
        className={className}
      >
        {children}
      </Component>
    );
  }

  // ── Mask: clip-path reveal ────────────────────────────────────────────────
  if (variant === "mask") {
    return (
      <Component
        initial={{ clipPath: "inset(100% 0% 0% 0%)", opacity: 0 }}
        {...(viewport
          ? {
              whileInView: { clipPath: "inset(0% 0% 0% 0%)", opacity: 1 },
              viewport: { once: true, amount: viewportAmount },
            }
          : { animate: { clipPath: "inset(0% 0% 0% 0%)", opacity: 1 } })}
        transition={{
          clipPath: { duration: d * 1.25, delay: totalDelay, ease },
          opacity: { duration: d * 1.35, delay: totalDelay, ease },
        }}
        className={className}
        style={{ overflow: "hidden" }}
      >
        {children}
      </Component>
    );
  }

  // ── Structural: opacity fade only ─────────────────────────────────────────
  if (variant === "structural") {
    return (
      <Component
        initial={{ opacity: 0 }}
        {...(viewport
          ? { whileInView: { opacity: 1 }, viewport: { once: true, amount: viewportAmount } }
          : { animate: { opacity: 1 } })}
        transition={{ duration: d, delay: totalDelay, ease }}
        className={className}
      >
        {children}
      </Component>
    );
  }

  // ── Isometric 3D (Jitter UI): 3D perspective entrance ────────────────────
  if (variant === "iso") {
    const rx = mobile ? 6 : 14;
    const ry = mobile ? -6 : -12;
    const dy = mobile ? 12 : 24;
    return (
      <Component
        initial={{
          opacity: 0,
          rotateX: rx,
          rotateY: ry,
          y: dy,
          scale: 0.94,
        }}
        {...(viewport
          ? {
              whileInView: { opacity: 1, rotateX: 0, rotateY: 0, y: 0, scale: 1 },
              viewport: { once: true, amount: viewportAmount },
            }
          : { animate: { opacity: 1, rotateX: 0, rotateY: 0, y: 0, scale: 1 } })}
        transition={{
          duration: d * 1.15,
          delay: totalDelay,
          ease: [0.16, 1, 0.3, 1],
        }}
        className={className}
        style={{ transformStyle: "preserve-3d", perspective: 1200 }}
      >
        {children}
      </Component>
    );
  }

  // ── Isometric Card (Jitter UI): 3D perspective + interactive hover lift ──
  if (variant === "iso-card") {
    return (
      <Component
        initial={{ opacity: 0, rotateX: 10, rotateY: -8, y: 16, scale: 0.96 }}
        {...(viewport
          ? {
              whileInView: { opacity: 1, rotateX: 0, rotateY: 0, y: 0, scale: 1 },
              viewport: { once: true, amount: viewportAmount },
            }
          : { animate: { opacity: 1, rotateX: 0, rotateY: 0, y: 0, scale: 1 } })}
        whileHover={
          mobile
            ? undefined
            : {
                rotateX: 3.5,
                rotateY: -4,
                y: -6,
                scale: 1.015,
                transition: { duration: 0.28, ease: [0.16, 1, 0.3, 1] },
              }
        }
        whileTap={{ scale: 0.97 }}
        transition={{
          duration: d * 1.1,
          delay: totalDelay,
          ease: [0.16, 1, 0.3, 1],
        }}
        className={className}
        style={{ transformStyle: "preserve-3d", perspective: 1000 }}
      >
        {children}
      </Component>
    );
  }

  // ── Jitter Pop: bouncy spring overshoot for badges and buttons ───────────
  if (variant === "jitter-pop") {
    return (
      <Component
        initial={{ opacity: 0, scale: 0.84 }}
        {...(viewport
          ? {
              whileInView: { opacity: 1, scale: 1 },
              viewport: { once: true, amount: viewportAmount },
            }
          : { animate: { opacity: 1, scale: 1 } })}
        transition={{
          duration: d,
          delay: totalDelay,
          ease: [0.34, 1.56, 0.64, 1],
        }}
        className={className}
      >
        {children}
      </Component>
    );
  }

  // ── Jitter Slide: snappy slide with subtle spring overshoot ──────────────
  if (variant === "jitter-slide") {
    const dy = distance || 20;
    return (
      <Component
        initial={{ opacity: 0, y: dy, scale: 0.98 }}
        {...(viewport
          ? {
              whileInView: { opacity: 1, y: 0, scale: 1 },
              viewport: { once: true, amount: viewportAmount },
            }
          : { animate: { opacity: 1, y: 0, scale: 1 } })}
        transition={{
          duration: d,
          delay: totalDelay,
          ease: [0.25, 1.25, 0.5, 1],
        }}
        className={className}
      >
        {children}
      </Component>
    );
  }

  // ── Default: opacity + single-axis translate ──────────────────────────────
  const offset = {
    up:    { x: 0, y: dist },
    down:  { x: 0, y: -dist },
    left:  { x: dist, y: 0 },
    right: { x: -dist, y: 0 },
    none:  { x: 0, y: 0 },
  }[from];

  const isAxisMove = from !== "none";

  return (
    <Component
      initial={{ opacity: 0, x: offset.x, y: offset.y }}
      {...(viewport
        ? {
            whileInView: { opacity: 1, x: 0, y: 0 },
            viewport: { once: true, amount: viewportAmount },
          }
        : { animate: { opacity: 1, x: 0, y: 0 } })}
      transition={isAxisMove
        ? {
            x: { duration: d, delay: totalDelay, ease },
            y: { duration: d, delay: totalDelay, ease },
            opacity: { duration: opacityDuration, delay: totalDelay, ease },
          }
        : { duration: d, delay: totalDelay, ease }
      }
      className={className}
    >
      {children}
    </Component>
  );
}
