import { getPublishedCertifications } from "@/lib/data/public";
import { Container } from "@/components/layout/container";
import { Card, Button } from "@/components/ui";
import { SkeletonWrapper } from "@/components/ui/skeleton-wrapper";
import { AnimateIn } from "@/components/ui/animate-in";
import { BreadcrumbJsonLd } from "@/components/seo/json-ld";
import { Award, ExternalLink, Calendar, Download } from "lucide-react";
import type { Metadata } from "next";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Certifications & Credentials — Dheeraj Carpenter",
  description:
    "Technical certifications, verified course completions, and software credentials earned by Dheeraj Carpenter.",
  alternates: {
    canonical: "/certifications",
  },
  openGraph: {
    title: "Certifications & Credentials — Dheeraj Carpenter",
    description:
      "Technical certifications, verified course completions, and software credentials earned by Dheeraj Carpenter.",
    url: "/certifications",
    type: "profile",
  },
};

export default async function PublicCertificationsPage() {
  const certifications = await getPublishedCertifications();

  return (
    <SkeletonWrapper pageType="about">
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "/" },
          { name: "Certifications", url: "/certifications" },
        ]}
      />
      <div className="py-16 md:py-24 space-y-12">
        <Container className="space-y-4">
          <AnimateIn from="up" distance={16} duration={0.4} viewport={false}>
            <p className="mono-eyebrow text-muted mb-2">
              Learning &amp; Milestones
            </p>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground">
              Certifications &amp; Credentials
            </h1>
          </AnimateIn>
          <AnimateIn from="up" distance={12} delay={0.1} viewport={false}>
            <p className="prose-readable text-body sm:text-body-lg text-muted max-w-[640px] leading-relaxed">
              Technical courses, verified credentials, and software milestones earned along the way.
            </p>
          </AnimateIn>
        </Container>

        <Container>
          {certifications.length === 0 ? (
            <AnimateIn variant="fade-rise" distance={14}>
              <div className="border border-border p-12 sm:p-16 text-center text-muted rounded-2xl bg-surface/40 space-y-3">
                <Award className="mx-auto h-10 w-10 text-foreground/50" />
                <h3 className="text-lg font-bold text-foreground">Credentials &amp; Coursework</h3>
                <p className="text-small text-muted max-w-md mx-auto leading-relaxed">
                  Verified coursework and technical certificates in software development and computer engineering are currently being cataloged.
                </p>
              </div>
            </AnimateIn>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
              {certifications.map((cert, index) => (
                <AnimateIn key={cert.id} variant="fade-rise" distance={16} duration={0.3} staggerIndex={index} viewport viewportAmount={0.05}>
                  <Card className="p-6 md:p-8 flex flex-col justify-between h-full space-y-6 card-accent-bar hover-lift-sm">
                    <div className="space-y-4">
                      <div className="flex items-start space-x-4">
                        <div className="p-3 bg-surface-overlay border border-border rounded-xl shrink-0 shadow-xs">
                          <Award className="h-6 w-6 text-foreground opacity-80" />
                        </div>
                        <div className="space-y-1">
                          <h2 className="text-h3 font-bold text-foreground leading-snug">{cert.title}</h2>
                          <p className="text-body font-medium text-muted">{cert.issuer}</p>
                          {cert.issue_date && (
                            <p className="text-caption text-muted flex items-center gap-1.5 pt-1 font-mono">
                              <Calendar className="h-3 w-3 text-muted shrink-0" />
                              <span>Issued: {new Date(cert.issue_date).toLocaleDateString("en-US", { month: "long", year: "numeric" })}</span>
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-3 pt-5 border-t border-border mt-auto">
                      {cert.credential_link && (
                        <Button asChild variant="primary" size="sm" className="group icon-nudge press-active">
                          <a href={cert.credential_link} target="_blank" rel="noopener noreferrer">
                            Verify Credential
                            <ExternalLink className="h-3.5 w-3.5 ml-1.5" />
                          </a>
                        </Button>
                      )}

                      {cert.certificate_path && (
                        <Button asChild variant="secondary" size="sm" className="group icon-nudge press-active">
                          <a href={cert.certificate_path} target="_blank" rel="noopener noreferrer">
                            View Certificate PDF
                            <Download className="h-3.5 w-3.5 ml-1.5" />
                          </a>
                        </Button>
                      )}
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
