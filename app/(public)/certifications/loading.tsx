import { Skeleton } from "@/components/ui/skeleton";
import { Container } from "@/components/layout/container";

export default function CertificationsLoading() {
  return (
    <div className="py-16 md:py-24 space-y-12">
      {/* Page header */}
      <Container className="space-y-4">
        <Skeleton className="h-4 w-52 rounded-full" />
        <Skeleton className="h-11 w-80 rounded-xl" />
        <div className="space-y-2">
          <Skeleton className="h-5 w-full max-w-lg rounded-lg" />
          <Skeleton className="h-5 w-4/5 max-w-md rounded-lg" />
        </div>
      </Container>

      {/* Certification cards grid */}
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="border border-border rounded-2xl p-6 space-y-4 bg-surface"
            >
              {/* Icon + badge row */}
              <div className="flex items-start justify-between">
                <Skeleton className="h-10 w-10 rounded-xl" />
                <Skeleton className="h-6 w-20 rounded-full" />
              </div>
              {/* Title */}
              <div className="space-y-1.5">
                <Skeleton className="h-6 w-4/5 rounded-lg" />
                <Skeleton className="h-6 w-3/5 rounded-lg" />
              </div>
              {/* Issuer + date */}
              <div className="flex items-center gap-3">
                <Skeleton className="h-4 w-28 rounded-md" />
                <Skeleton className="h-4 w-20 rounded-md" />
              </div>
              {/* CTA */}
              <Skeleton className="h-9 w-36 rounded-lg" />
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}
