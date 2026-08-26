"use client";

import { useRef, type ReactNode, type CSSProperties } from "react";
import { cn } from "@/lib/utils";

interface EdgeLightProps {
  children: ReactNode;
  className?: string;
  /** Radius of the radial gradient spotlight in px. Default: 220 */
  spotRadius?: number;
  /** Intensity 0–1. Default: 0.1 (restrained) */
  intensity?: number;
}

/**
 * EdgeLight — A pointer-aware subtle border highlight.
 *
 * Applied SELECTIVELY to 2–3 high-value surfaces (hero CTA panel, featured project cards).
 * NOT used globally. Creates the impression that the surface is aware of the pointer
 * without being controlled by it.
 *
 * Implementation: tracks pointer position → updates CSS custom properties →
 * radial gradient on a border-masked ::before pseudoelement (pure CSS rendering).
 *
 * Effect is restrained, monochrome, and dark-appropriate.
 * Automatically skips rendering on touch devices.
 */
export function EdgeLight({
  children,
  className,
  spotRadius = 220,
  intensity = 0.1,
}: EdgeLightProps) {
  const ref = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    ref.current.style.setProperty("--mouse-x", `${x}%`);
    ref.current.style.setProperty("--mouse-y", `${y}%`);
    ref.current.style.setProperty("--spot-radius", `${spotRadius}px`);
    ref.current.style.setProperty("--spot-intensity", String(intensity));
  };

  const handleMouseLeave = () => {
    if (!ref.current) return;
    ref.current.style.setProperty("--mouse-x", `50%`);
    ref.current.style.setProperty("--mouse-y", `50%`);
  };

  return (
    <div
      ref={ref}
      className={cn("edge-light", className)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </div>
  );
}
