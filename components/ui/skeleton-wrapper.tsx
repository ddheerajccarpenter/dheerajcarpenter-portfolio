interface SkeletonWrapperProps {
  children: React.ReactNode;
  pageType: "home" | "about" | "projects" | "experience" | "contact" | "project-detail";
}

export function SkeletonWrapper({ children }: SkeletonWrapperProps) {
  return <>{children}</>;
}
