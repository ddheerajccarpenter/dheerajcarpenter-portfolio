import { getActiveServices } from "@/lib/data/public";
import { Container } from "@/components/layout/container";
import { Card, Badge, Button } from "@/components/ui";
import { SkeletonWrapper } from "@/components/ui/skeleton-wrapper";
import { AnimateIn } from "@/components/ui/animate-in";
import Link from "next/link";
import { CheckCircle2, ArrowRight } from "lucide-react";

export const revalidate = 0; // Dynamic rendering for instant CMS updates
export const dynamic = "force-dynamic";

export default async function PublicServicesPage() {
  const services = await getActiveServices();

  return (
    <SkeletonWrapper pageType="about">
      <div className="py-12 md:py-16 space-y-12">
        <Container className="space-y-4">
          <AnimateIn from="up" distance={20} duration={0.6} viewport={false}>
            <h1 className="text-h1 font-bold tracking-tight sm:text-[3rem]">
              Services & Offerings
            </h1>
          </AnimateIn>
          <AnimateIn from="up" distance={14} delay={0.12} viewport={false}>
            <p className="prose-readable text-body-lg text-muted">
              Specialized engineering, design, and technical consulting solutions available for hire or project contracts.
            </p>
          </AnimateIn>
        </Container>

        <Container>
          {services.length === 0 ? (
            <div className="p-12 text-center border border-dashed border-border rounded-sm text-muted">
              <i className="fi fi-br-headset text-2xl mb-3 block text-foreground" aria-hidden="true" />
              <p className="text-body font-medium">No service offerings listed yet.</p>
              <p className="text-small text-muted mt-1">Check back soon for updated consulting & engineering services.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {services.map((service, index) => (
                <AnimateIn key={service.id} from="up" distance={20} staggerIndex={index}>
                  <Card className="p-6 md:p-8 flex flex-col justify-between h-full space-y-6 hover:border-border-strong transition-all shadow-xs">
                    <div className="space-y-4">
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <h2 className="text-h3 font-bold text-foreground">{service.title}</h2>
                          <p className="text-small font-semibold text-muted mt-1">{service.tagline}</p>
                        </div>
                        {service.price_range && (
                          <Badge className="shrink-0 font-mono text-xs px-3 py-1">
                            {service.price_range}
                          </Badge>
                        )}
                      </div>

                      <p className="text-body text-muted leading-relaxed">
                        {service.description}
                      </p>

                      {service.deliverables && service.deliverables.length > 0 && (
                        <div className="space-y-2 pt-2 border-t border-border">
                          <span className="text-caption font-bold uppercase tracking-wider text-muted block">
                            Key Deliverables
                          </span>
                          <ul className="space-y-1.5">
                            {service.deliverables.map((item, dIdx) => (
                              <li key={dIdx} className="flex items-start space-x-2 text-small text-foreground">
                                <CheckCircle2 className="h-4 w-4 text-foreground shrink-0 mt-0.5" />
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>

                    <div className="pt-4 border-t border-border mt-auto">
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
