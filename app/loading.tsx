import { Skeleton } from "@/components/ui/skeleton";
import { Container } from "@/components/layout/container";
import { Loader2 } from "lucide-react";

export default function RootLoading() {
  return (
    <div className="py-16 md:py-24 space-y-12">
      {/* Top spinner status indicator */}
      <div className="flex items-center justify-center space-x-2 text-muted pb-4">
        <Loader2 className="h-5 w-5 animate-spin text-foreground" />
        <span className="text-caption font-semibold uppercase tracking-widest">
          Loading Page...
        </span>
      </div>

      {/* General Skeleton Layout */}
      <Container className="space-y-6">
        <Skeleton className="h-12 w-64" />
        <Skeleton className="h-5 w-96 max-w-full" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6">
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-48 w-full" />
        </div>
      </Container>
    </div>
  );
}
