import { Skeleton } from "@/components/ui/skeleton";
import { Container } from "@/components/layout/container";

export default function BlogLoading() {
  return (
    <div className="py-16 md:py-24 space-y-12">
      <Container className="space-y-4">
        <Skeleton className="h-12 w-64" />
        <Skeleton className="h-5 w-96 max-w-full" />
      </Container>

      <Container>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="border border-border p-6 md:p-8 rounded-sm bg-surface space-y-4">
              <Skeleton className="h-4 w-44" />
              <Skeleton className="h-8 w-3/4" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
              </div>
              <div className="flex gap-2 pt-2">
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-6 w-20" />
              </div>
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}
