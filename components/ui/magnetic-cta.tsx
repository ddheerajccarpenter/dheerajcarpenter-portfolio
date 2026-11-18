import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface MagneticCtaProps {
  children: ReactNode;
  strength?: number;
  stiffness?: number;
  damping?: number;
  className?: string;
}

/**
 * MagneticCta — Clean wrapper with zero gimmicks or button displacement.
 */
export function MagneticCta({ children, className }: MagneticCtaProps) {
  return <div className={cn("inline-block", className)}>{children}</div>;
}
