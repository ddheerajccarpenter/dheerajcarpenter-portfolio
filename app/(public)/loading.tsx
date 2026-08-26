import { Skeleton } from "@/components/ui/skeleton";
import { Container } from "@/components/layout/container";

export default function HomeLoading() {
  return (
    <div className="flex flex-col space-y-24 py-16 md:py-24">

      {/* Hero */}
      <section aria-hidden>
        <Container>
          <div className="max-w-[800px] space-y-6">
            <Skeleton className="h-6 w-36 rounded-full" />
            <Skeleton className="h-14 w-3/4 rounded-2xl" />
            <div className="space-y-2.5">
              <Skeleton className="h-5 w-full rounded-lg" />
              <Skeleton className="h-5 w-5/6 rounded-lg" />
              <Skeleton className="h-5 w-4/6 rounded-lg" />
            </div>
            <div className="flex gap-4 pt-2">
              <Skeleton className="h-11 w-36 rounded-xl" />
              <Skeleton className="h-11 w-28 rounded-xl" />
            </div>
          </div>
        </Container>
      </section>

      {/* About preview */}
      <section aria-hidden className="border-t border-border/80 pt-16">
        <Container className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Skeleton className="h-9 w-24 rounded-lg" />
          <div className="md:col-span-2 space-y-3">
            <Skeleton className="h-5 w-full rounded-lg" />
            <Skeleton className="h-5 w-5/6 rounded-lg" />
            <Skeleton className="h-5 w-2/3 rounded-lg" />
            <Skeleton className="h-4 w-44 mt-2 rounded-lg" />
          </div>
        </Container>
      </section>

      {/* Featured projects */}
      <section aria-hidden className="border-t border-border/80 pt-16">
        <Container className="space-y-10">
          <div className="flex justify-between items-end">
            <Skeleton className="h-9 w-48 rounded-lg" />
            <Skeleton className="h-4 w-20 rounded-lg" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[1, 2].map((i) => (
              <div key={i} className="border border-border rounded-2xl p-6 space-y-4 bg-surface">
                <div className="flex justify-between items-start">
                  <Skeleton className="h-6 w-1/2 rounded-lg" />
                  <Skeleton className="h-4 w-4 rounded-md" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full rounded-md" />
                  <Skeleton className="h-4 w-5/6 rounded-md" />
                  <Skeleton className="h-4 w-3/4 rounded-md" />
                </div>
                <Skeleton className="h-10 w-28 rounded-xl" />
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Skills preview */}
      <section aria-hidden className="border-t border-border/80 pt-16">
        <Container className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Skeleton className="h-9 w-20 rounded-lg" />
          <div className="md:col-span-2">
            <div className="flex flex-wrap gap-2.5">
              {[80, 64, 72, 56, 88, 60, 76, 68].map((w, i) => (
                <Skeleton key={i} className="h-8 rounded-full" style={{ width: w }} />
              ))}
            </div>
          </div>
        </Container>
      </section>

    </div>
  );
}
