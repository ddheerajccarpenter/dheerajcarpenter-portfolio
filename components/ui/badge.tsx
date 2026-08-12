import { cn } from "@/lib/utils";
import { type HTMLAttributes } from "react";

/**
 * B&W badge — a small bordered label for tags, categories, and status.
 * No fill color — uses border only, consistent with the strict B&W palette.
 */
export function Badge({ className, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-sm border border-border px-2.5 py-0.5 text-caption font-semibold text-foreground bg-surface/50 tracking-wide",
        className,
      )}
      {...props}
    />
  );
}
