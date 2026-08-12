import { getAllTestimonials } from "@/lib/data/public";
import { Container } from "@/components/layout/container";
import { Card } from "@/components/ui";
import { SkeletonWrapper } from "@/components/ui/skeleton-wrapper";
import { AnimateIn } from "@/components/ui/animate-in";

export const revalidate = 0; // Dynamic rendering for instant CMS updates
export const dynamic = "force-dynamic";

export default async function PublicTestimonialsPage() {
  const testimonials = await getAllTestimonials();

  return (
    <SkeletonWrapper pageType="projects">
      <div className="py-12 md:py-16 space-y-12">
        <Container className="space-y-4">
          <AnimateIn from="up" distance={20} duration={0.6} viewport={false}>
            <h1 className="text-h1 font-bold tracking-tight sm:text-[3rem]">
              Testimonials & Endorsements
            </h1>
          </AnimateIn>
          <AnimateIn from="up" distance={14} delay={0.12} viewport={false}>
            <p className="prose-readable text-body-lg text-muted">
              Recommendations and feedback from clients, managers, and engineering teammates.
            </p>
          </AnimateIn>
        </Container>

        <Container>
          {testimonials.length === 0 ? (
            <div className="p-12 text-center border border-dashed border-border rounded-sm text-muted">
              <i className="fi fi-br-comment-alt text-2xl mb-3 block text-foreground" aria-hidden="true" />
              <p className="text-body font-medium">No testimonials published yet.</p>
              <p className="text-small text-muted mt-1">Check back soon for new client recommendations.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {testimonials.map((t, index) => (
                <AnimateIn key={t.id} from="up" distance={20} staggerIndex={index}>
                  <Card className="p-6 md:p-8 flex flex-col justify-between h-full space-y-6 hover:border-border-strong transition-all shadow-xs">
                    <p className="text-body-lg italic text-muted prose-readable leading-relaxed">
                      "{t.quote}"
                    </p>

                    <div className="flex items-center space-x-4 pt-4 border-t border-border mt-auto">
                      {t.avatar_url ? (
                        <img
                          src={t.avatar_url}
                          alt={t.author_name}
                          className="h-12 w-12 rounded-full object-cover border border-border shrink-0"
                        />
                      ) : (
                        <div className="h-12 w-12 rounded-full bg-surface border border-border flex items-center justify-center font-bold text-body text-foreground shrink-0">
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
