import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Base skeleton block — a shimmer rectangle used to represent loading content.
 */
export function Skeleton({ className, style }: SkeletonProps) {
  return (
    <div
      className={cn(
        "bg-surface border border-border animate-shimmer rounded-sm",
        className
      )}
      style={style}
    />
  );
}
