import Link from "next/link";
import { notFound } from "next/navigation";
import { getProjectBySlug } from "@/lib/data/public";
import { Container } from "@/components/layout/container";
import { Button, Badge } from "@/components/ui";
import { Markdown } from "@/components/ui/markdown";
import { ExternalLink, Github, ArrowLeft } from "lucide-react";
import { SkeletonWrapper } from "@/components/ui/skeleton-wrapper";
import { AnimateIn } from "@/components/ui/animate-in";

export const revalidate = 0; // Dynamic rendering for instant CMS updates

interface ProjectPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function ProjectDetailPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  return (
    <SkeletonWrapper pageType="project-detail">
      <div className="py-12 md:py-20 space-y-12">
      {/* Back Button */}
      <Container>
        <AnimateIn from="left" distance={12} duration={0.4} viewport={false}>
          <Link
            href="/projects"
            className="inline-flex items-center text-small font-medium hover:underline underline-offset-4 text-muted hover:text-foreground transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to all projects
          </Link>
        </AnimateIn>
      </Container>

      {/* Hero Header */}
      <Container className="space-y-6">
        <div className="space-y-4">
          <AnimateIn from="up" distance={20} duration={0.6} viewport={false}>
            <h1 className="text-h1 font-bold tracking-tight sm:text-[3.5rem] leading-none">
              {project.title}
            </h1>
          </AnimateIn>
          <AnimateIn from="up" distance={14} delay={0.12} viewport={false}>
            <p className="prose-readable text-body-lg text-muted">
              {project.summary}
            </p>
          </AnimateIn>
        </div>

        {/* Action Buttons */}
        <AnimateIn from="up" distance={10} delay={0.24} viewport={false}>
          <div className="flex flex-wrap gap-4 pt-2">
            {project.live_url && (
              <Button asChild variant="primary" size="md" className="animate-btn-scale">
                <a href={project.live_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center">
                  Live Demo
                  <ExternalLink className="ml-2 h-4 w-4" />
                </a>
              </Button>
            )}
            {project.source_url && (
              <Button asChild variant="secondary" size="md" className="animate-btn-scale">
                <a href={project.source_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center">
                  Source Code
                  <Github className="ml-2 h-4 w-4" />
                </a>
              </Button>
            )}
          </div>
        </AnimateIn>
      </Container>

      {/* Cover Image */}
      {project.cover_url && (
        <Container>
          <AnimateIn from="up" distance={24} delay={0.15}>
            <div className="relative aspect-[21/9] w-full overflow-hidden border border-border bg-surface animate-grayscale-hover">
              <img
                src={project.cover_url}
                alt={`${project.title} cover image`}
                className="w-full h-full object-cover"
              />
            </div>
          </AnimateIn>
        </Container>
      )}

      {/* Main Content Layout */}
      <Container className="grid grid-cols-1 lg:grid-cols-3 gap-12 pt-4">
        {/* Left Column: Case Study */}
        <AnimateIn from="up" distance={20} className="lg:col-span-2 space-y-6">
          <h2 className="text-h2 font-bold tracking-tight border-b border-border pb-2">
            Project Overview
          </h2>
          <Markdown content={project.description || "No detailed description provided."} />
        </AnimateIn>

        {/* Right Column: Sidebar */}
        <div className="space-y-8">
          {/* Tech Stack */}
          {project.tags && project.tags.length > 0 && (
            <AnimateIn from="up" distance={16} delay={0.1}>
              <div className="space-y-3 border border-border p-6 rounded-sm bg-background">
                <h3 className="text-caption font-bold uppercase tracking-wider text-foreground">
                  Technologies Used
                </h3>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <Badge key={tag}>{tag}</Badge>
                  ))}
                </div>
              </div>
            </AnimateIn>
          )}

          {/* Additional details */}
          <AnimateIn from="up" distance={16} delay={0.2}>
            <div className="space-y-3 border border-border p-6 rounded-sm bg-background text-small text-muted">
              <h3 className="text-caption font-bold uppercase tracking-wider text-foreground">
                Project Details
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Published</span>
                  <span className="font-medium text-foreground">
                    {new Date(project.created_at).toLocaleDateString("en-US", { year: "numeric", month: "short" })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Role</span>
                  <span className="font-medium text-foreground">Lead Developer</span>
                </div>
              </div>
            </div>
          </AnimateIn>
        </div>
      </Container>

      {/* Gallery Section */}
      {project.gallery && project.gallery.length > 0 && (
        <section className="border-t border-border pt-16" aria-labelledby="gallery-title">
          <Container className="space-y-8">
            <AnimateIn from="up" distance={16}>
              <h2 id="gallery-title" className="text-h2 font-bold tracking-tight">
                Gallery
              </h2>
            </AnimateIn>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {project.gallery.map((url, index) => (
                <AnimateIn key={index} from="up" distance={20} staggerIndex={index}>
                  <div className="relative aspect-[16/10] overflow-hidden border border-border bg-surface animate-grayscale-hover">
                    <img
                      src={url}
                      alt={`${project.title} screenshot ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </AnimateIn>
              ))}
            </div>
          </Container>
        </section>
      )}
      </div>
    </SkeletonWrapper>
  );
}
