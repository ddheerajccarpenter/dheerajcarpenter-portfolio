import { getActiveServices } from "@/lib/data/public";
import { Container } from "@/components/layout/container";
import { Card, Badge, Button } from "@/components/ui";
import { SkeletonWrapper } from "@/components/ui/skeleton-wrapper";
import { AnimateIn } from "@/components/ui/animate-in";
import Link from "next/link";
import { CheckCircle2, ArrowRight } from "lucide-react";

export const revalidate = 0;
export const dynamic = "force-dynamic";

export default async function PublicServicesPage() {
  const services = await getActiveServices();

  return (
    <SkeletonWrapper pageType="about">
      <div className="py-16 md:py-24 space-y-12">
        <Container className="space-y-4">
          <AnimateIn from="up" distance={16} duration={0.4} viewport={false}>
            <div className="inline-flex items-center gap-2 text-caption font-bold uppercase tracking-[0.14em] text-muted mb-2">
              <span className="h-1.5 w-1.5 rounded-full bg-foreground inline-block opacity-60" />
              Capabilities & Offerings
            </div>
            <h1 className="text-h1 font-bold tracking-tight sm:text-[3rem] text-editorial-gradient">
              Services & Solutions
            </h1>
          </AnimateIn>
          <AnimateIn from="up" distance={12} delay={0.1} viewport={false}>
            <p className="prose-readable text-body-lg text-muted">
              Specialized engineering, full-stack architecture, and technical consulting solutions available for contracts.
            </p>
          </AnimateIn>
        </Container>

        <Container>
          {services.length === 0 ? (
            <div className="p-16 text-center border border-dashed border-border rounded-2xl text-muted bg-surface/30">
              <p className="text-body font-medium">No service offerings listed yet.</p>
              <p className="text-small text-muted mt-1">Check back soon for updated consulting & engineering services.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
              {services.map((service, index) => (
                <AnimateIn key={service.id} from="up" distance={16} staggerIndex={index}>
                  <Card className="p-6 md:p-8 flex flex-col justify-between h-full space-y-6 card-accent-bar">
                    <div className="space-y-5">
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <h2 className="text-h3 font-bold text-foreground">{service.title}</h2>
                          {service.tagline && (
                            <p className="text-small font-medium text-muted mt-1">{service.tagline}</p>
                          )}
                        </div>
                        {service.price_range && (
                          <Badge variant="pill" className="shrink-0 font-mono text-xs px-3 py-1">
                            {service.price_range}
                          </Badge>
                        )}
                      </div>

                      <p className="text-body text-muted leading-relaxed">
                        {service.description}
                      </p>

                      {service.deliverables && service.deliverables.length > 0 && (
                        <div className="space-y-2.5 pt-3 border-t border-border">
                          <span className="text-caption font-bold uppercase tracking-wider text-muted flex items-center gap-2">
                            <span className="h-1 w-1 rounded-full bg-foreground inline-block opacity-60" />
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
                      <Button asChild variant="primary" size="md" className="w-full justify-center">
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
