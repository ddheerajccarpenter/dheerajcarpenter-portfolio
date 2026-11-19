import { getPublishedProjects } from "@/lib/data/public";
import { Container } from "@/components/layout/container";
import { SkeletonWrapper } from "@/components/ui/skeleton-wrapper";
import { AnimateIn } from "@/components/ui/animate-in";
import { ProjectsView } from "@/components/public/projects-view";
import { BreadcrumbJsonLd } from "@/components/seo/json-ld";
import type { Metadata } from "next";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Projects & Builds — Dheeraj Carpenter",
  description:
    "Explore web applications, interactive software tools, creative builds, and open-source experiments built by Dheeraj Carpenter.",
  alternates: {
    canonical: "/projects",
  },
  openGraph: {
    title: "Projects & Builds — Dheeraj Carpenter",
    description:
      "Explore web applications, interactive software tools, creative builds, and open-source experiments built by Dheeraj Carpenter.",
    url: "/projects",
    type: "website",
  },
};

export default async function ProjectsPage() {
  const projects = await getPublishedProjects();

  return (
    <SkeletonWrapper pageType="projects">
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "/" },
          { name: "Projects", url: "/projects" },
        ]}
      />
      <div className="py-12 md:py-20 space-y-10">
        <Container className="space-y-4">
          <AnimateIn from="up" distance={16} duration={0.4} viewport={false}>
            <p className="mono-eyebrow text-muted mb-2">
              Work &amp; Builds
            </p>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground">
              Projects
            </h1>
          </AnimateIn>
          <AnimateIn from="up" distance={12} delay={0.1} viewport={false}>
            <p className="prose-readable text-body-lg text-muted max-w-[620px]">
              Web applications, tools, creative projects, and open-source experiments.
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
