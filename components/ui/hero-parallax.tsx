"use client";

import { useEffect, useRef, type ReactNode } from "react";

interface HeroParallaxProps {
  children: ReactNode;
  /** Scroll speed ratio (0 = static, 1 = follows scroll). Default: 0.04 */
  speed?: number;
  className?: string;
}

/**
 * HeroParallax — Very subtle scroll-linked vertical offset.
 *
 * Applied ONLY to the hero name/headline. Speed 0.04 creates a barely
 * perceptible depth shift — the heading lifts very slightly as you scroll down.
 * This suggests depth without being a flashy parallax effect.
 *
 * Performance: uses transform only (GPU composited), reads scrollY
 * in a passive event listener. No layout recalculation.
 *
 * Automatically disabled when prefers-reduced-motion is active.
 */
export function HeroParallax({
  children,
  speed = 0.04,
  className,
}: HeroParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);
  const ticking = useRef(false);
  const enabled = useRef(true);

  useEffect(() => {
    enabled.current = !window.matchMedia("(prefers-reduced-motion: reduce)").matches
      && window.innerWidth >= 768;

    if (!enabled.current) return;

    const onScroll = () => {
      if (ticking.current) return;
      ticking.current = true;

      requestAnimationFrame(() => {
        if (ref.current && enabled.current) {
          const offset = window.scrollY * speed;
          ref.current.style.transform = `translateY(${-offset}px)`;
          ref.current.setAttribute("data-parallax", "true");
        }
        ticking.current = false;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (ref.current) {
        ref.current.style.transform = "";
      }
    };
  }, [speed]);

  return (
    <div ref={ref} className={className} style={{ willChange: "transform" }}>
      {children}
    </div>
  );
}
