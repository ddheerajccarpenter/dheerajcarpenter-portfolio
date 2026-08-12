import Link from "next/link";
import { getPublishedProjects } from "@/lib/data/public";
import { Container } from "@/components/layout/container";
import { Card, Badge, Button } from "@/components/ui";
import { SkeletonWrapper } from "@/components/ui/skeleton-wrapper";
import { AnimateIn } from "@/components/ui/animate-in";

export const revalidate = 0; // Dynamic rendering for instant CMS updates
export const dynamic = "force-dynamic";

export default async function ProjectsPage() {
  const projects = await getPublishedProjects();

  return (
    <SkeletonWrapper pageType="projects">
      <div className="py-16 md:py-24 space-y-12">
        <Container className="space-y-4">
        <AnimateIn from="up" distance={20} duration={0.6} viewport={false}>
          <h1 className="text-h1 font-bold tracking-tight sm:text-[3rem]">
            Projects
          </h1>
        </AnimateIn>
        <AnimateIn from="up" distance={14} delay={0.12} viewport={false}>
          <p className="prose-readable text-body-lg text-muted">
            A selection of my professional work, personal side-projects, and open source experiments.
          </p>
        </AnimateIn>
      </Container>

      <Container>
        {projects.length === 0 ? (
          <AnimateIn from="up" distance={12}>
            <div className="border border-dashed border-border p-16 text-center text-muted rounded-sm">
              No projects published yet. Please add them in the admin dashboard.
            </div>
          </AnimateIn>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <AnimateIn key={project.id} from="up" distance={20} staggerIndex={index} viewportAmount={0.05}>
                <Card
                  className="flex flex-col h-full hover:border-border-strong transition-colors duration-200 animate-card-float"
                >
                {/* Cover Image Wrapper */}
                {project.cover_url ? (
                  <div className="relative aspect-[16/10] -mx-6 -mt-6 mb-6 overflow-hidden border-b border-border animate-grayscale-hover">
                    <img
                      src={project.cover_url}
                      alt={project.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="relative aspect-[16/10] -mx-6 -mt-6 mb-6 bg-surface border-b border-border flex items-center justify-center text-caption text-muted">
                    No preview image
                  </div>
                )}

                <div className="flex flex-col flex-1 justify-between space-y-4">
                  <div className="space-y-2">
                    <h2 className="text-h3 font-bold tracking-tight hover:underline">
                      <Link href={`/projects/${project.slug}`}>
                        {project.title}
                      </Link>
                    </h2>
                    <p className="text-body-sm text-muted line-clamp-3">
                      {project.summary}
                    </p>
                  </div>

                  <div className="space-y-4 pt-4 mt-auto">
                    {project.tags && project.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {project.tags.map((tag) => (
                          <Badge key={tag}>{tag}</Badge>
                        ))}
                      </div>
                    )}
                    <Button asChild variant="secondary" size="sm" className="w-full animate-btn-scale">
                      <Link href={`/projects/${project.slug}`}>
                        View Case Study
                      </Link>
                    </Button>
                  </div>
                </div>
              </Card>
              </AnimateIn>
            ))}
          </div>
        )}
      </Container>
      </div>
    </SkeletonWrapper>
  );
}
