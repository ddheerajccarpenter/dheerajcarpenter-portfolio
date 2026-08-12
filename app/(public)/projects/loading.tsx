import { Skeleton } from "@/components/ui/skeleton";
import { Container } from "@/components/layout/container";

export default function ProjectsLoading() {
  return (
    <div className="py-16 md:py-24 space-y-12">

      {/* Header */}
      <Container className="space-y-4">
        <Skeleton className="h-12 w-48" />
        <Skeleton className="h-5 w-96 max-w-full" />
      </Container>

      {/* Grid */}
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="border border-border rounded-sm bg-surface overflow-hidden flex flex-col"
            >
              {/* Cover */}
              <Skeleton className="aspect-[16/10] w-full rounded-none border-0 border-b border-border" />
              {/* Body */}
              <div className="p-6 flex flex-col flex-1 space-y-4">
                <Skeleton className="h-6 w-3/4" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                  <Skeleton className="h-4 w-4/6" />
                </div>
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {[60, 72, 56].map((w, j) => (
                    <Skeleton key={j} className="h-6" style={{ width: w }} />
                  ))}
                </div>
                <Skeleton className="h-9 w-full mt-auto" />
              </div>
            </div>
          ))}
        </div>
      </Container>

    </div>
  );
}
