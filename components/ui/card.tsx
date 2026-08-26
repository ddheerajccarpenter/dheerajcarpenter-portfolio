import { cn } from "@/lib/utils";
import { type HTMLAttributes, forwardRef } from "react";

type CardVariant = "default" | "lifted" | "flat" | "glass";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
}

const variantClasses: Record<CardVariant, string> = {
  /** Base tactile card with 1px hairline border and subtle surface layer */
  default:
    "tactile-card rounded-2xl p-6 md:p-7 relative overflow-hidden",
  /** Elevated card with stronger presence for featured elements */
  lifted:
    "tactile-card rounded-2xl p-6 md:p-7 relative overflow-hidden shadow-md hover:shadow-xl",
  /** Flat inset panel for structured content sections */
  flat:
    "tactile-panel rounded-2xl p-6 md:p-7 relative",
  /** Frosted translucent surface */
  glass:
    "frosted-surface rounded-2xl p-6 md:p-7 relative overflow-hidden",
};

/**
 * Card Component
 * A layered surface container designed with tactile borders, restrained depth,
 * and subtle micro-interactions.
 */
export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = "default", ...props }, ref) => (
    <div
      ref={ref}
      className={cn(variantClasses[variant], className)}
      {...props}
    />
  ),
);
Card.displayName = "Card";
