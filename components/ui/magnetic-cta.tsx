import { type ReactNode } from "react";

interface MagneticCtaProps {
  children: ReactNode;
  strength?: number;
  stiffness?: number;
  damping?: number;
  className?: string;
}

/**
 * MagneticCta — Lightweight low-GPU wrapper.
 */
export function MagneticCta({
  children,
  className,
}: MagneticCtaProps) {
  return (
    <div className={className}>
      {children}
    </div>
  );
}
