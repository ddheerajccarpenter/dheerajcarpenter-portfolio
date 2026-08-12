import { Skeleton } from "@/components/ui/skeleton";
import { Container } from "@/components/layout/container";

export default function HomeLoading() {
  return (
    <div className="flex flex-col space-y-24 py-16 md:py-24">

      {/* Hero */}
      <section aria-hidden>
        <Container>
          <div className="max-w-[800px] space-y-6">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-14 w-3/4" />
            <div className="space-y-2.5">
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-5/6" />
              <Skeleton className="h-5 w-4/6" />
            </div>
            <div className="flex gap-4 pt-2">
              <Skeleton className="h-12 w-36" />
              <Skeleton className="h-12 w-28" />
            </div>
          </div>
        </Container>
      </section>

      {/* About preview */}
      <section aria-hidden className="border-t border-border pt-16">
        <Container className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Skeleton className="h-9 w-24" />
          <div className="md:col-span-2 space-y-3">
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-5/6" />
            <Skeleton className="h-5 w-2/3" />
            <Skeleton className="h-4 w-44 mt-2" />
          </div>
        </Container>
      </section>

      {/* Featured projects */}
      <section aria-hidden className="border-t border-border pt-16">
        <Container className="space-y-10">
          <div className="flex justify-between items-end">
            <Skeleton className="h-9 w-48" />
            <Skeleton className="h-4 w-20" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[1, 2].map((i) => (
              <div key={i} className="border border-border rounded-sm p-6 space-y-4 bg-surface">
                <div className="flex justify-between items-start">
                  <Skeleton className="h-6 w-1/2" />
                  <Skeleton className="h-4 w-4" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
                <Skeleton className="h-10 w-28" />
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Skills preview */}
      <section aria-hidden className="border-t border-border pt-16">
        <Container className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Skeleton className="h-9 w-20" />
          <div className="md:col-span-2">
            <div className="flex flex-wrap gap-2.5">
              {[80, 64, 72, 56, 88, 60, 76, 68].map((w, i) => (
                <Skeleton key={i} className="h-8" style={{ width: w }} />
              ))}
            </div>
          </div>
        </Container>
      </section>

    </div>
  );
}
