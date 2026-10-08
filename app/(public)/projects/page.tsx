import { getPublishedProjects } from "@/lib/data/public";
import { Container } from "@/components/layout/container";
import { SkeletonWrapper } from "@/components/ui/skeleton-wrapper";
import { AnimateIn } from "@/components/ui/animate-in";
import { ProjectsView } from "@/components/public/projects-view";

export const revalidate = 3600;

export default async function ProjectsPage() {
  const projects = await getPublishedProjects();

  return (
    <SkeletonWrapper pageType="projects">
      <div className="py-12 md:py-20 space-y-10">
        <Container className="space-y-4">
          <AnimateIn from="up" distance={16} duration={0.4} viewport={false}>
            <p className="mono-eyebrow text-muted mb-2">
              Selected Portfolio
            </p>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground">
              Projects
            </h1>
          </AnimateIn>
          <AnimateIn from="up" distance={12} delay={0.1} viewport={false}>
            <p className="prose-readable text-body-lg text-muted max-w-[620px]">
              A curated collection of production engineering projects, architectural systems, and open-source work.
            </p>
          </AnimateIn>
        </Container>

        <Container>
          <ProjectsView projects={projects} />
        </Container>
      </div>
    </SkeletonWrapper>
  );
}
