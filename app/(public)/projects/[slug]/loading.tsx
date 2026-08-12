import { Skeleton } from "@/components/ui/skeleton";
import { Container } from "@/components/layout/container";

export default function ProjectDetailLoading() {
  return (
    <div className="py-12 md:py-20 space-y-12">

      {/* Back link */}
      <Container>
        <Skeleton className="h-4 w-36" />
      </Container>

      {/* Header */}
      <Container className="space-y-6">
        <div className="space-y-4">
          <Skeleton className="h-14 w-3/4" />
          <div className="space-y-2">
            <Skeleton className="h-5 w-full max-w-[600px]" />
            <Skeleton className="h-5 w-4/6 max-w-[480px]" />
          </div>
        </div>
        <div className="flex gap-4">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-36" />
        </div>
      </Container>

      {/* Cover image */}
      <Container>
        <Skeleton className="aspect-[21/9] w-full rounded-none" />
      </Container>

      {/* Content + sidebar */}
      <Container className="grid grid-cols-1 lg:grid-cols-3 gap-12 pt-4">
        {/* Main */}
        <div className="lg:col-span-2 space-y-4">
          <Skeleton className="h-8 w-48 mb-2" />
          <div className="space-y-2.5">
            {[100, 96, 88, 100, 92, 76].map((w, i) => (
              <Skeleton key={i} className="h-4" style={{ width: `${w}%` }} />
            ))}
          </div>
          <div className="space-y-2.5 pt-4">
            {[100, 94, 82, 100, 78].map((w, i) => (
              <Skeleton key={i} className="h-4" style={{ width: `${w}%` }} />
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="border border-border p-6 rounded-sm bg-background space-y-3">
            <Skeleton className="h-3 w-36" />
            <div className="flex flex-wrap gap-2">
              {[60, 80, 56, 72, 64].map((w, i) => (
                <Skeleton key={i} className="h-7" style={{ width: w }} />
              ))}
            </div>
          </div>
          <div className="border border-border p-6 rounded-sm bg-background space-y-3">
            <Skeleton className="h-3 w-28" />
            <div className="space-y-2">
              <div className="flex justify-between">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-16" />
              </div>
              <div className="flex justify-between">
                <Skeleton className="h-4 w-10" />
                <Skeleton className="h-4 w-28" />
              </div>
            </div>
          </div>
        </div>
      </Container>

    </div>
  );
}
