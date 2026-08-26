import { cn } from "@/lib/utils";
import { type HTMLAttributes } from "react";

type BadgeVariant = "default" | "pill" | "dot" | "accent";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

/**
 * Badge Component
 * Clean, optical label styling for tags, categories, and status indicators.
 */
export function Badge({ className, variant = "default", children, ...props }: BadgeProps) {
  if (variant === "dot") {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-2 text-caption font-medium text-foreground select-none",
          className,
        )}
        {...props}
      >
        <span
          className="inline-block h-1.5 w-1.5 rounded-full bg-foreground shrink-0 opacity-70"
          aria-hidden="true"
        />
        {children}
      </span>
    );
  }

  if (variant === "accent") {
    return (
      <span
        className={cn(
          "inline-flex items-center border border-border-strong px-2.5 py-1 text-[11px] font-medium text-foreground bg-surface-overlay rounded-full tracking-wide transition-all duration-200",
          className,
        )}
        {...props}
      >
        {children}
      </span>
    );
  }

  return (
    <span
      className={cn(
        "inline-flex items-center border border-border px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground bg-surface/80 tracking-wide transition-all duration-200 hover:border-border-strong hover:text-foreground",
        variant === "pill" ? "rounded-full" : "rounded-lg",
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}
