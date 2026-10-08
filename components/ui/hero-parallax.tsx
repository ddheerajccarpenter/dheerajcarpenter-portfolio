import { type ReactNode } from "react";

interface HeroParallaxProps {
  children: ReactNode;
  speed?: number;
  className?: string;
}

/**
 * HeroParallax — Low-GPU static wrapper.
 * Completely eliminates scroll event listeners and compositor recalculations.
 */
export function HeroParallax({
  children,
  className,
}: HeroParallaxProps) {
  return (
    <div className={className}>
      {children}
    </div>
  );
}
