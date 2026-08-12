import { Skeleton } from "@/components/ui/skeleton";
import { Container } from "@/components/layout/container";

export default function BlogPostLoading() {
  return (
    <div className="py-12 md:py-20 space-y-12">
      <Container>
        <Skeleton className="h-4 w-36" />
      </Container>

      <Container className="max-w-[800px] space-y-6">
        <Skeleton className="h-4 w-48" />
        <Skeleton className="h-14 w-3/4" />
        <Skeleton className="h-6 w-full" />
      </Container>

      <Container className="max-w-[900px]">
        <Skeleton className="aspect-[21/9] w-full" />
      </Container>

      <Container className="max-w-[800px] space-y-4 pt-4">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-11/12" />
        <Skeleton className="h-4 w-4/5" />
        <Skeleton className="h-4 w-full" />
      </Container>
    </div>
  );
}
