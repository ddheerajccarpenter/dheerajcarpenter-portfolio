import { cn } from "@/lib/utils";
import { type InputHTMLAttributes, forwardRef } from "react";

export type InputProps = InputHTMLAttributes<HTMLInputElement>;

/**
 * Tactile Text Input Component
 * Uses layered surface tokens with subtle border transitions and monochrome focus highlights.
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", ...props }, ref) => (
    <input
      ref={ref}
      type={type}
      className={cn(
        "h-11 w-full rounded-xl border border-border bg-surface px-3.5 text-small text-foreground placeholder:text-muted/70 transition-all duration-200",
        "hover:border-border-strong",
        "focus-visible:outline-none focus-visible:border-foreground focus-visible:ring-2 focus-visible:ring-foreground/15",
        "disabled:cursor-not-allowed disabled:opacity-40",
        className,
      )}
      {...props}
    />
  ),
);
Input.displayName = "Input";
