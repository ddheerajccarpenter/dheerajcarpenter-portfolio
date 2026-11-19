import { getActiveServices } from "@/lib/data/public";
import { Container } from "@/components/layout/container";
import { Card, Badge, Button } from "@/components/ui";
import { SkeletonWrapper } from "@/components/ui/skeleton-wrapper";
import { AnimateIn } from "@/components/ui/animate-in";
import { BreadcrumbJsonLd } from "@/components/seo/json-ld";
import Link from "next/link";
import { CheckCircle2, ArrowRight } from "lucide-react";
import type { Metadata } from "next";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Services & Capabilities — Dheeraj Carpenter",
  description:
    "Full-stack web development, user interface design, performance optimization, and video editing services by Dheeraj Carpenter.",
  alternates: {
    canonical: "/services",
  },
  openGraph: {
    title: "Services & Capabilities — Dheeraj Carpenter",
    description:
      "Full-stack web development, user interface design, performance optimization, and video editing services.",
    url: "/services",
    type: "website",
  },
};

export default async function PublicServicesPage() {
  const servicesData = await getActiveServices();

  const displayServices =
    servicesData.length > 0
      ? servicesData
      : [
          {
            id: "serv-1",
            title: "Full-Stack Web Development",
            tagline: "Next.js, TypeScript, React, and Supabase",
            description:
              "End-to-end web applications built with type-safety, modular architecture, and high performance. From database design to responsive frontend interfaces.",
            deliverables: [
              "Custom Next.js & React Web Apps",
              "PostgreSQL & Supabase Database Setup",
              "REST & Server Action Integration",
              "SEO & Performance Optimization",
            ],
            price_range: null,
            icon: null,
            active: true,
            order: 1,
            created_at: "",
            updated_at: "",
          },
          {
            id: "serv-2",
            title: "UI & Frontend Engineering",
            tagline: "Accessible, responsive, and tactile interfaces",
            description:
              "Translating complex ideas into clean, fast, and accessible user interfaces using Tailwind CSS and modern CSS token systems with fluid micro-interactions.",
            deliverables: [
              "Design-to-Code Implementation",
              "Responsive Layout Architecture",
              "Dark & Light Mode Systems",
              "Smooth Motion & Micro-interactions",
            ],
            price_range: null,
            icon: null,
            active: true,
            order: 2,
            created_at: "",
            updated_at: "",
          },
          {
            id: "serv-3",
            title: "Video Editing & Multimedia",
            tagline: "Engaging visual pacing and storytelling",
            description:
              "Creative video editing for tech demonstrations, product walkthroughs, social channels, and brand content with attention to timing, rhythm, and color.",
            deliverables: [
              "Video Pacing & Sequencing",
              "Visual Storytelling & Cuts",
              "Audio Cleanup & Sound Design",
              "Multi-format Social Video Renders",
            ],
            price_range: null,
            icon: null,
            active: true,
            order: 3,
            created_at: "",
            updated_at: "",
          },
          {
            id: "serv-4",
            title: "Interface Prototyping & UX",
            tagline: "Figma wireframing and user experience design",
            description:
              "Designing thoughtful software interfaces in Figma with a focus on simplicity, clear typographic hierarchy, and intuitive user flows.",
            deliverables: [
              "High-Fidelity UI Mockups",
              "Interactive Figma Prototypes",
              "Design System Guidelines",
              "Clean Developer Handoff",
            ],
            price_range: null,
            icon: null,
            active: true,
            order: 4,
            created_at: "",
            updated_at: "",
          },
        ];

  return (
    <SkeletonWrapper pageType="about">
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "/" },
          { name: "Services", url: "/services" },
        ]}
      />
      <div className="py-16 md:py-24 space-y-12">
        <Container className="space-y-4">
          <AnimateIn from="up" distance={16} duration={0.4} viewport={false}>
            <p className="mono-eyebrow text-muted mb-2">
              Capabilities
            </p>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground">
              Services &amp; Focus
            </h1>
          </AnimateIn>
          <AnimateIn from="up" distance={12} delay={0.1} viewport={false}>
            <p className="prose-readable text-body sm:text-body-lg text-muted max-w-[640px] leading-relaxed">
              Web application development, UI design, video editing, and technical project builds.
            </p>
          </AnimateIn>
        </Container>

        <Container>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
            {displayServices.map((service, index) => (
              <AnimateIn key={service.id} variant="fade-rise" distance={16} duration={0.3} staggerIndex={index} viewport viewportAmount={0.05}>
                <Card className="p-6 md:p-8 flex flex-col justify-between h-full space-y-6 card-accent-bar hover-lift-sm">
                  <div className="space-y-5">
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <h2 className="text-xl font-bold text-foreground">{service.title}</h2>
                        {service.tagline && (
                          <p className="text-small font-medium text-muted mt-1">{service.tagline}</p>
                        )}
                      </div>
                    </div>

                    <p className="text-small text-muted leading-relaxed prose-readable">
                      {service.description}
                    </p>

                    {service.deliverables && service.deliverables.length > 0 && (
                      <div className="space-y-2 pt-2 border-t border-border/60">
                        <p className="mono-eyebrow text-[11px] text-muted">Core Focus &amp; Deliverables</p>
                        <ul className="space-y-1.5 pt-1">
                          {service.deliverables.map((item, i) => (
                            <li key={i} className="flex items-center gap-2 text-small text-foreground/90">
                              <CheckCircle2 className="h-4 w-4 text-foreground/60 shrink-0" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  <div className="pt-4 border-t border-border flex items-center justify-between">
                    <Button asChild variant="secondary" size="sm" className="w-full justify-center">
                      <Link href="/contact" className="gap-2">
                        <span>Discuss a Project</span>
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
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
                        {service.price_range && (
                          <Badge variant="pill" className="shrink-0 font-mono text-xs px-3 py-1 badge-breathe">
                            {service.price_range}
                          </Badge>
                        )}
                      </div>

                      <p className="text-body text-muted leading-relaxed">
                        {service.description}
                      </p>

                      {service.deliverables && service.deliverables.length > 0 && (
                        <div className="space-y-2.5 pt-3 border-t border-border">
                          <span className="mono-eyebrow text-muted">
                            Key Deliverables
                          </span>
                          <ul className="space-y-2 pt-1">
                            {service.deliverables.map((item, dIdx) => (
                              <li key={dIdx} className="flex items-start space-x-2.5 text-small text-foreground">
                                <CheckCircle2 className="h-4 w-4 text-foreground shrink-0 mt-0.5 opacity-80" />
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>

                    <div className="pt-5 border-t border-border mt-auto">
                      <Button asChild variant="primary" size="md" className="w-full justify-center group icon-nudge press-active">
                        <Link href="/contact">
                          Inquire About {service.title}
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </Link>
                      </Button>
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
