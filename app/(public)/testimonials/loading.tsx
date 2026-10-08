import { Skeleton } from "@/components/ui/skeleton";
import { Container } from "@/components/layout/container";

export default function TestimonialsLoading() {
  return (
    <div className="py-16 md:py-24 space-y-12">
      {/* Page header */}
      <Container className="space-y-4">
        <Skeleton className="h-4 w-56 rounded-full" />
        <Skeleton className="h-11 w-80 rounded-xl" />
        <div className="space-y-2">
          <Skeleton className="h-5 w-full max-w-lg rounded-lg" />
          <Skeleton className="h-5 w-3/4 max-w-md rounded-lg" />
        </div>
      </Container>

      {/* Testimonial cards grid */}
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="border border-border rounded-2xl p-6 space-y-5 bg-surface"
            >
              {/* Quote lines */}
              <div className="space-y-2">
                <Skeleton className="h-4 w-full rounded-md" />
                <Skeleton className="h-4 w-full rounded-md" />
                <Skeleton className="h-4 w-5/6 rounded-md" />
                <Skeleton className="h-4 w-4/6 rounded-md" />
              </div>
              {/* Avatar + name */}
              <div className="flex items-center gap-3 pt-1">
                <Skeleton className="h-10 w-10 rounded-full flex-shrink-0" />
                <div className="space-y-1.5">
                  <Skeleton className="h-4 w-28 rounded-md" />
                  <Skeleton className="h-3 w-36 rounded-md" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}
