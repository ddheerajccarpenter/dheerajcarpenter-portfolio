import { cn } from "@/lib/utils";
import { type HTMLAttributes, forwardRef } from "react";

/**
 * B&W card — a bordered, padded container. No shadows, no gradients.
 */
export const Card = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "rounded-sm border border-border bg-background p-6",
        className,
      )}
      {...props}
    />
  ),
);
Card.displayName = "Card";
