"use client";

import { useEffect, useRef } from "react";

/**
 * Scroll progress bar — a thin 2px line at the very top of the viewport
 * that fills left-to-right as the user scrolls down the page.
 * Linear style, no label, completely invisible until you scroll.
 */
export function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const bar = barRef.current;
    if (!bar) return;

    const onScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      bar.style.width = `${pct}%`;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll(); // initialise

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      aria-hidden
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: "2px",
        zIndex: 9999,
        pointerEvents: "none",
        background: "transparent",
      }}
    >
      <div
        ref={barRef}
        style={{
          height: "100%",
          width: "0%",
          background: "var(--foreground)",
          opacity: 0.55,
          transition: "width 0.08s linear",
          transformOrigin: "left",
        }}
      />
    </div>
  );
}
