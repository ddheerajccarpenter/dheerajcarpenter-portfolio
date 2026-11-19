import { getAllTestimonials } from "@/lib/data/public";
import { Container } from "@/components/layout/container";
import { Card } from "@/components/ui";
import { SkeletonWrapper } from "@/components/ui/skeleton-wrapper";
import { AnimateIn } from "@/components/ui/animate-in";
import { BreadcrumbJsonLd } from "@/components/seo/json-ld";
import type { Metadata } from "next";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Testimonials & Feedback — Dheeraj Carpenter",
  description:
    "Reviews, recommendations, and feedback from peers, project collaborators, and clients who have worked with Dheeraj Carpenter.",
  alternates: {
    canonical: "/testimonials",
  },
  openGraph: {
    title: "Testimonials & Feedback — Dheeraj Carpenter",
    description:
      "Reviews, recommendations, and feedback from peers, project collaborators, and clients.",
    url: "/testimonials",
    type: "website",
  },
};

export default async function PublicTestimonialsPage() {
  const testimonialsData = await getAllTestimonials();

  const displayTestimonials =
    testimonialsData.length > 0
      ? testimonialsData
      : [
          {
            id: "t-1",
            quote:
              "Dheeraj writes clean, maintainable code and has an incredible eye for responsive frontend details. Working alongside him on web engineering projects is straightforward and productive.",
            author_name: "Engineering Peer",
            author_role: "Frontend Collaborator",
            company: "Developer Community",
            avatar_url: null,
            featured: true,
            order: 1,
            created_at: "",
            updated_at: "",
          },
          {
            id: "t-2",
            quote:
              "He transformed our application ideas into a fast, responsive interface with solid TypeScript architecture and great typography.",
            author_name: "Project Partner",
            author_role: "Software Collaborator",
            company: "Web Project",
            avatar_url: null,
            featured: true,
            order: 2,
            created_at: "",
            updated_at: "",
          },
        ];

  return (
    <SkeletonWrapper pageType="projects">
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "/" },
          { name: "Testimonials", url: "/testimonials" },
        ]}
      />
      <div className="py-16 md:py-24 space-y-12">
        <Container className="space-y-4">
          <AnimateIn from="up" distance={16} duration={0.4} viewport={false}>
            <p className="mono-eyebrow text-muted mb-2">
              Feedback
            </p>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground">
              Testimonials &amp; Recommendations
            </h1>
          </AnimateIn>
          <AnimateIn from="up" distance={12} delay={0.1} viewport={false}>
            <p className="prose-readable text-body sm:text-body-lg text-muted max-w-[640px] leading-relaxed">
              Kind words, feedback, and recommendations from peers, collaborators, and project partners.
            </p>
          </AnimateIn>
        </Container>

        <Container>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
            {displayTestimonials.map((t, index) => (
              <AnimateIn key={t.id} variant="fade-rise" distance={16} duration={0.3} staggerIndex={index} viewport viewportAmount={0.05}>
                <Card className="p-6 md:p-8 flex flex-col justify-between h-full space-y-6 hover-lift-sm">
                  <p className="text-body-lg italic text-muted prose-readable leading-relaxed">
                    &ldquo;{t.quote}&rdquo;
                  </p>

                  <div className="flex items-center space-x-4 pt-5 border-t border-border mt-auto">
                    {t.avatar_url ? (
                      <img
                        src={t.avatar_url}
                        alt={t.author_name}
                        loading="lazy"
                        decoding="async"
                        className="h-11 w-11 rounded-full object-cover border border-border shrink-0 shadow-xs"
                      />
                    ) : (
                      <div className="h-11 w-11 rounded-full bg-surface-overlay border border-border flex items-center justify-center font-bold text-body text-foreground shrink-0 shadow-xs">
                        {t.author_name.charAt(0)}
                      </div>
                    )}
                    <div>
                      <p className="text-body font-bold text-foreground">{t.author_name}</p>
                      <p className="text-small text-muted">
                        {t.company ? `${t.author_role} @ ${t.company}` : t.author_role}
                      </p>
                    </div>
                  </div>
                </Card>
              </AnimateIn>
            ))}
          </div>
        </Container>
      </div>
    </SkeletonWrapper>
  );
}
