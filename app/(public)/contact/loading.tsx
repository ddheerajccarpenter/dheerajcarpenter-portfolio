import { Skeleton } from "@/components/ui/skeleton";
import { Container } from "@/components/layout/container";

export default function ContactLoading() {
  return (
    <div className="py-16 md:py-24 space-y-12">
      {/* Header */}
      <Container className="space-y-4">
        <Skeleton className="h-12 w-48" />
        <Skeleton className="h-5 w-96 max-w-full" />
      </Container>

      {/* Grid */}
      <Container className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
        {/* Left Column: Channels & Email */}
        <div className="space-y-8">
          <div className="space-y-4">
            <Skeleton className="h-7 w-44" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </div>

          <div className="space-y-3 pt-2">
            <Skeleton className="h-3 w-32" />
            <div className="space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center gap-3">
                  <Skeleton className="h-5 w-5 rounded-full" />
                  <Skeleton className="h-5 w-36" />
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-border">
            <div className="space-y-2">
              <Skeleton className="h-3 w-28" />
              <Skeleton className="h-6 w-48" />
            </div>
            <div className="space-y-2 pt-2">
              <Skeleton className="h-3 w-32" />
              <Skeleton className="h-10 w-44" />
            </div>
          </div>
        </div>

        {/* Right Column: Contact Form */}
        <div className="border border-border p-6 md:p-8 rounded-sm bg-background space-y-6">
          <Skeleton className="h-7 w-40" />
          <div className="space-y-4">
            <div className="space-y-2">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-28 w-full" />
            </div>
            <Skeleton className="h-11 w-32" />
          </div>
        </div>
      </Container>
    </div>
  );
}
