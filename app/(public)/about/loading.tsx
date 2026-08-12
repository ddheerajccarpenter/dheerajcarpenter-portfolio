import { Skeleton } from "@/components/ui/skeleton";
import { Container } from "@/components/layout/container";

export default function AboutLoading() {
  return (
    <div className="py-16 md:py-24 space-y-20">

      {/* Bio & headline */}
      <section aria-hidden>
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-start">
            <div className="space-y-5 md:col-span-2">
              <Skeleton className="h-12 w-2/3" />
              <div className="space-y-2.5 pt-2">
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-5/6" />
                <Skeleton className="h-5 w-4/6" />
              </div>
            </div>
            {/* Photo placeholder */}
            <Skeleton className="aspect-[4/5] w-full max-w-[320px] mx-auto md:mx-0" />
          </div>
        </Container>
      </section>

      {/* Skills */}
      <section aria-hidden className="border-t border-border pt-16">
        <Container className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Skeleton className="h-9 w-40" />
          <div className="md:col-span-2 space-y-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="h-3 w-28" />
                <div className="flex flex-wrap gap-2">
                  {[80, 96, 64, 88, 72, 56].map((w, j) => (
                    <Skeleton key={j} className="h-8" style={{ width: w }} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Education */}
      <section aria-hidden className="border-t border-border pt-16">
        <Container className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Skeleton className="h-9 w-36" />
          <div className="md:col-span-2 space-y-8 border-l border-border pl-6">
            {[1, 2].map((i) => (
              <div key={i} className="relative space-y-2">
                <span className="absolute -left-[31px] top-1 bg-background border border-border rounded-full h-6 w-6" />
                <Skeleton className="h-3 w-32" />
                <Skeleton className="h-6 w-56" />
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-4 w-full" />
              </div>
            ))}
          </div>
        </Container>
      </section>

    </div>
  );
}
