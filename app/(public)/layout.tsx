import { PublicShell } from "@/components/layout/public-shell";
import { RouteTransition } from "@/components/layout/route-transition";

export const dynamic = "force-dynamic";
export const revalidate = 0;

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
