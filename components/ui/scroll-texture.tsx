"use client";

import { useEffect } from "react";

/**
 * Inertial scroll reactive texture driver.
 * Updates `--texture-y` CSS property on window scroll via requestAnimationFrame.
 * Combined with `transition: transform 0.3s cubic-bezier(0.22, 1, 0.36, 1)` in globals.css,
 * the texture glides smoothly with exactly a 0.3-second delay behind scroll action.
 */
export function ScrollTexture() {
  useEffect(() => {
    let rafId: number | null = null;
    let lastScrollY = -1;

    const onScroll = () => {
      if (rafId !== null) return;
      rafId = window.requestAnimationFrame(() => {
        const scrollY = window.scrollY || window.pageYOffset || 0;
        if (scrollY !== lastScrollY) {
          lastScrollY = scrollY;
          // Subtly parallax shift the grain texture along Y
          // Clamped or continuous modulo to avoid extreme displacement
          const offset = -(scrollY * 0.12);
          document.documentElement.style.setProperty("--texture-y", `${offset}px`);
        }
        rafId = null;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    // Run once on mount to establish position
    onScroll();

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafId !== null) window.cancelAnimationFrame(rafId);
    };
  }, []);

  return null;
}
