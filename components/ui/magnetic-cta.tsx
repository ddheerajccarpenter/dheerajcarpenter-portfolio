"use client";

import { useRef, useState, useEffect, type ReactNode } from "react";
import { motion, useSpring, useTransform } from "motion/react";

interface MagneticCtaProps {
  children: ReactNode;
  /** Maximum magnetic displacement in px. Default: 5 */
  strength?: number;
  /** Spring stiffness. Default: 200 */
  stiffness?: number;
  /** Spring damping. Default: 22 */
  damping?: number;
  className?: string;
}

/**
 * MagneticCta — A selective magnetic attraction wrapper.
 *
 * Applied to EXACTLY ONE primary CTA site-wide (the hero "View Projects" button).
 * Provides 2–5px magnetic pull toward cursor, feeling like slight physical attraction.
 *
 * Auto-disables:
 * - On touch devices (no hover capability)
 * - When prefers-reduced-motion is active
 * - On mobile viewports (<768px)
 *
 * The surrounding UI remains completely stable.
 */
export function MagneticCta({
  children,
  strength = 5,
  stiffness = 200,
  damping = 22,
  className,
}: MagneticCtaProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isEnabled, setIsEnabled] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Only enable on devices with fine pointer (mouse) and no reduced-motion preference
  useEffect(() => {
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const wideEnough = window.innerWidth >= 768;
    setIsEnabled(finePointer && !reducedMotion && wideEnough);
  }, []);

  // Spring physics for smooth, physical displacement
  const rawX = useSpring(0, { stiffness, damping, mass: 0.6 });
  const rawY = useSpring(0, { stiffness, damping, mass: 0.6 });

  // Clamp to max strength
  const x = useTransform(rawX, (v) => Math.max(-strength, Math.min(strength, v)));
  const y = useTransform(rawY, (v) => Math.max(-strength, Math.min(strength, v)));

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isEnabled || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;

    // Normalize displacement to [-strength, +strength] range
    const normalizedX = (dx / (rect.width / 2)) * strength;
    const normalizedY = (dy / (rect.height / 2)) * strength;

    rawX.set(normalizedX);
    rawY.set(normalizedY);
  };

  const handleMouseEnter = () => {
    if (isEnabled) setIsHovered(true);
  };

  const handleMouseLeave = () => {
    // Return to rest with spring settling naturally
    rawX.set(0);
    rawY.set(0);
    setIsHovered(false);
  };

  // Non-enabled: render without any wrapper overhead
  if (!isEnabled) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ x, y }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </motion.div>
  );
}
