import { Skeleton } from "@/components/ui/skeleton";
import { Container } from "@/components/layout/container";

export default function SkillsLoading() {
  // Representative category widths and badge widths to mimic real content rhythm
  const categories = [
    { headerW: 120, badges: [72, 88, 64, 96, 76, 80, 60] },
    { headerW: 100, badges: [80, 64, 92, 68, 84, 72] },
    { headerW: 140, badges: [70, 86, 60, 78, 88, 66, 74] },
  ];

  return (
    <div className="py-16 md:py-24 space-y-12">
      {/* Page header */}
      <Container className="space-y-4">
        <Skeleton className="h-4 w-44 rounded-full" />
        <Skeleton className="h-11 w-72 rounded-xl" />
        <Skeleton className="h-5 w-96 max-w-full rounded-lg" />
      </Container>

      {/* Category groups */}
      <Container className="space-y-10">
        {categories.map((cat, ci) => (
          <div key={ci} className="space-y-4 border-t border-border pt-8">
            {/* Category heading */}
            <Skeleton className="h-7 rounded-lg" style={{ width: cat.headerW }} />
            {/* Badge cloud */}
            <div className="flex flex-wrap gap-2.5">
              {cat.badges.map((w, bi) => (
                <Skeleton key={bi} className="h-8 rounded-full" style={{ width: w }} />
              ))}
            </div>
          </div>
        ))}
      </Container>
    </div>
  );
}
