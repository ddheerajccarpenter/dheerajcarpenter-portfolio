import { getPublishedCertifications } from "@/lib/data/public";
import { Container } from "@/components/layout/container";
import { Card, Button } from "@/components/ui";
import { SkeletonWrapper } from "@/components/ui/skeleton-wrapper";
import { AnimateIn } from "@/components/ui/animate-in";
import { Award, ExternalLink, Calendar, Download } from "lucide-react";

export const revalidate = 0;
export const dynamic = "force-dynamic";

export default async function PublicCertificationsPage() {
  const certifications = await getPublishedCertifications();

  return (
    <SkeletonWrapper pageType="about">
      <div className="py-16 md:py-24 space-y-12">
        <Container className="space-y-4">
          <AnimateIn from="up" distance={16} duration={0.4} viewport={false}>
            <div className="inline-flex items-center gap-2 text-caption font-bold uppercase tracking-[0.14em] text-muted mb-2">
              <span className="h-1.5 w-1.5 rounded-full bg-foreground inline-block opacity-60" />
              Accreditations & Certificates
            </div>
            <h1 className="text-h1 font-bold tracking-tight sm:text-[3rem] text-editorial-gradient">
              Certifications & Diplomas
            </h1>
          </AnimateIn>
          <AnimateIn from="up" distance={12} delay={0.1} viewport={false}>
            <p className="prose-readable text-body-lg text-muted">
              Professional credentials, industry certifications, and completions earned across software architecture and engineering.
            </p>
          </AnimateIn>
        </Container>

        <Container>
          {certifications.length === 0 ? (
            <div className="p-16 text-center border border-dashed border-border rounded-2xl text-muted bg-surface/30">
              <p className="text-body font-medium">No certifications published yet.</p>
              <p className="text-small text-muted mt-1">Check back soon for updated professional credentials.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
              {certifications.map((cert, index) => (
                <AnimateIn key={cert.id} from="up" distance={16} staggerIndex={index}>
                  <Card className="p-6 md:p-8 flex flex-col justify-between h-full space-y-6 card-accent-bar">
                    <div className="space-y-4">
                      <div className="flex items-start space-x-4">
                        <div className="p-3 bg-surface-overlay border border-border rounded-xl shrink-0 shadow-xs">
                          <Award className="h-6 w-6 text-foreground opacity-80" />
                        </div>
                        <div className="space-y-1">
                          <h2 className="text-h3 font-bold text-foreground leading-snug">{cert.title}</h2>
                          <p className="text-body font-medium text-muted">{cert.issuer}</p>
                          {cert.issue_date && (
                            <p className="text-caption text-muted flex items-center space-x-1 pt-1 font-mono">
                              <Calendar className="h-3 w-3 inline mr-1 text-muted" />
                              Issued: {new Date(cert.issue_date).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-3 pt-5 border-t border-border mt-auto">
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
