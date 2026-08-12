import { getPublishedCertifications } from "@/lib/data/public";
import { Container } from "@/components/layout/container";
import { Card, Badge, Button } from "@/components/ui";
import { SkeletonWrapper } from "@/components/ui/skeleton-wrapper";
import { AnimateIn } from "@/components/ui/animate-in";
import { Award, ExternalLink, Calendar, Download } from "lucide-react";

export const revalidate = 0; // Dynamic rendering for instant CMS updates
export const dynamic = "force-dynamic";

export default async function PublicCertificationsPage() {
  const certifications = await getPublishedCertifications();

  return (
    <SkeletonWrapper pageType="about">
      <div className="py-12 md:py-16 space-y-12">
        <Container className="space-y-4">
          <AnimateIn from="up" distance={20} duration={0.6} viewport={false}>
            <h1 className="text-h1 font-bold tracking-tight sm:text-[3rem]">
              Certifications & Diplomas
            </h1>
          </AnimateIn>
          <AnimateIn from="up" distance={14} delay={0.12} viewport={false}>
            <p className="prose-readable text-body-lg text-muted">
              Professional credentials, industry certifications, and course completions earned across software architecture, cloud platforms, and engineering.
            </p>
          </AnimateIn>
        </Container>

        <Container>
          {certifications.length === 0 ? (
            <div className="p-12 text-center border border-dashed border-border rounded-sm text-muted">
              <i className="fi fi-br-diploma text-2xl mb-3 block text-foreground" aria-hidden="true" />
              <p className="text-body font-medium">No certifications published yet.</p>
              <p className="text-small text-muted mt-1">Check back soon for updated professional credentials.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {certifications.map((cert, index) => (
                <AnimateIn key={cert.id} from="up" distance={20} staggerIndex={index}>
                  <Card className="p-6 md:p-8 flex flex-col justify-between h-full space-y-6 hover:border-border-strong transition-all shadow-xs">
                    <div className="space-y-4">
                      <div className="flex items-start space-x-4">
                        <div className="p-3 bg-surface border border-border rounded-lg shrink-0">
                          <Award className="h-6 w-6 text-foreground" />
                        </div>
                        <div className="space-y-1">
                          <h2 className="text-h3 font-bold text-foreground leading-snug">{cert.title}</h2>
                          <p className="text-body font-medium text-muted">{cert.issuer}</p>
                          {cert.issue_date && (
                            <p className="text-caption text-muted flex items-center space-x-1 pt-1 font-mono">
                              <Calendar className="h-3 w-3 inline mr-1" />
                              Issued: {new Date(cert.issue_date).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-3 pt-4 border-t border-border mt-auto">
                      {cert.credential_link && (
                        <Button asChild variant="primary" size="sm">
                          <a href={cert.credential_link} target="_blank" rel="noopener noreferrer">
                            Verify Credential
                            <ExternalLink className="h-3.5 w-3.5 ml-1.5" />
                          </a>
                        </Button>
                      )}

                      {cert.certificate_path && (
                        <Button asChild variant="secondary" size="sm">
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
