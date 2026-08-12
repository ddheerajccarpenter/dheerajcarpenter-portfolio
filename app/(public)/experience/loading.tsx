import { Skeleton } from "@/components/ui/skeleton";
import { Container } from "@/components/layout/container";

export default function ExperienceLoading() {
  return (
    <div className="py-16 md:py-24 space-y-12">

      {/* Header */}
      <Container className="space-y-4">
        <Skeleton className="h-12 w-52" />
        <Skeleton className="h-5 w-96 max-w-full" />
      </Container>

      {/* Timeline */}
      <Container>
        <div className="relative border-l border-border pl-8 ml-4 space-y-14 py-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="relative space-y-3">
              {/* Dot */}
              <span className="absolute -left-[49px] top-1 bg-background border border-border rounded-full h-8 w-8 flex items-center justify-center">
                <Skeleton className="h-4 w-4 rounded-full border-0" />
              </span>

              {/* Date + type badge */}
              <div className="flex items-center gap-3">
                <Skeleton className="h-3.5 w-28" />
                <Skeleton className="h-5 w-20" />
              </div>

              {/* Role */}
              <Skeleton className="h-7 w-64" />
              {/* Org + location */}
              <div className="flex gap-4">
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-5 w-24" />
              </div>
              {/* Description */}
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-4/6" />
              </div>
            </div>
          ))}
        </div>
      </Container>

    </div>
  );
}
