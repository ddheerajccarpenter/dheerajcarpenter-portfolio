import { getAllTestimonials } from "@/lib/data/public";
import { Container } from "@/components/layout/container";
import { Card } from "@/components/ui";
import { SkeletonWrapper } from "@/components/ui/skeleton-wrapper";
import { AnimateIn } from "@/components/ui/animate-in";

export const revalidate = 0;
export const dynamic = "force-dynamic";

export default async function PublicTestimonialsPage() {
  const testimonials = await getAllTestimonials();

  return (
    <SkeletonWrapper pageType="projects">
      <div className="py-16 md:py-24 space-y-12">
        <Container className="space-y-4">
          <AnimateIn from="up" distance={16} duration={0.4} viewport={false}>
            <div className="inline-flex items-center gap-2 text-caption font-bold uppercase tracking-[0.14em] text-muted mb-2">
              <span className="h-1.5 w-1.5 rounded-full bg-foreground inline-block opacity-60" />
              Client & Teammate Endorsements
            </div>
            <h1 className="text-h1 font-bold tracking-tight sm:text-[3rem] text-editorial-gradient">
              Testimonials & Endorsements
            </h1>
          </AnimateIn>
          <AnimateIn from="up" distance={12} delay={0.1} viewport={false}>
            <p className="prose-readable text-body-lg text-muted">
              Recommendations and feedback from clients, managers, and engineering collaborators.
            </p>
          </AnimateIn>
        </Container>

        <Container>
          {testimonials.length === 0 ? (
            <div className="p-16 text-center border border-dashed border-border rounded-2xl text-muted bg-surface/30">
              <p className="text-body font-medium">No testimonials published yet.</p>
              <p className="text-small text-muted mt-1">Check back soon for new client recommendations.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
              {testimonials.map((t, index) => (
                <AnimateIn key={t.id} from="up" distance={16} staggerIndex={index}>
                  <Card className="p-6 md:p-8 flex flex-col justify-between h-full space-y-6">
                    <p className="text-body-lg italic text-muted prose-readable leading-relaxed">
                      &ldquo;{t.quote}&rdquo;
                    </p>

                    <div className="flex items-center space-x-4 pt-5 border-t border-border mt-auto">
                      {t.avatar_url ? (
                        <img
                          src={t.avatar_url}
                          alt={t.author_name}
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
          )}
        </Container>
      </div>
    </SkeletonWrapper>
  );
}
