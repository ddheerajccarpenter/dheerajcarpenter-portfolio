import { PublicShell } from "@/components/layout/public-shell";
import { RouteTransition } from "@/components/layout/route-transition";

export const revalidate = 3600;

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PublicShell>
      <RouteTransition>{children}</RouteTransition>
    </PublicShell>
  );
}
