interface SkeletonWrapperProps {
  children: React.ReactNode;
  pageType: "home" | "about" | "projects" | "experience" | "contact" | "project-detail";
}

/**
 * Thin wrapper — previously showed a timed skeleton for 800ms on every navigation.
 * Removed: pages are server-rendered, content is already available on first paint.
 * Content now renders immediately with the standard crossfade animation class.
 */
export function SkeletonWrapper({ children }: SkeletonWrapperProps) {
  return <div className="animate-skeleton-crossfade">{children}</div>;
}
