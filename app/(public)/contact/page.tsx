import { getSettings, getSocialLinks } from "@/lib/data/public";
import { Container } from "@/components/layout/container";
import { ContactForm } from "@/components/public/contact-form";
import { Button } from "@/components/ui";
import { SkeletonWrapper } from "@/components/ui/skeleton-wrapper";
import { AnimateIn } from "@/components/ui/animate-in";

export const revalidate = 0; // Dynamic rendering for instant CMS updates

const PLATFORM_FLATICONS = {
  github: "fi fi-br-code-branch",
  linkedin: "fi fi-br-share",
  twitter: "fi fi-br-comment-alt",
  instagram: "fi fi-br-camera",
  youtube: "fi fi-br-play-alt",
  email: "fi fi-br-envelope",
  website: "fi fi-br-globe",
} as const;

export default async function ContactPage() {
  const [settings, socialLinks] = await Promise.all([
    getSettings(),
    getSocialLinks(),
  ]);

  const contactEmail = settings?.contact_email;
  const resumeUrl = settings?.resume_url;
  const resumeFilename = settings?.resume_filename || "Resume.pdf";

  return (
    <SkeletonWrapper pageType="contact">
      <div className="py-12 md:py-16">
        <Container className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          {/* Left Side: Header, Info & Channels */}
          <div className="space-y-8">
            <div className="space-y-3">
              <AnimateIn from="up" distance={20} duration={0.6} viewport={false}>
                <h1 className="text-h1 font-bold tracking-tight sm:text-[3rem]">
                  Contact
                </h1>
              </AnimateIn>
              <AnimateIn from="up" distance={14} delay={0.12} viewport={false}>
                <p className="prose-readable text-body text-muted">
                  Get in touch for contract work, full-time positions, or just to say hello.
                </p>
              </AnimateIn>
            </div>

            <div className="space-y-6 pt-2">
              <div className="space-y-2">
                <h2 className="text-h3 font-bold tracking-tight">
                  Connect Channels
                </h2>
                <p className="text-body text-muted prose-readable">
                  Feel free to reach out via the contact form, drop an email directly, or connect through any of my professional networks listed below.
                </p>
              </div>

              {/* Social Channels */}
              {socialLinks.length > 0 && (
                <div className="space-y-3 pt-2">
                  <h3 className="text-caption font-bold uppercase tracking-wider text-foreground">
                    Social Profiles
                  </h3>
                  <div className="flex flex-col space-y-2.5">
                    {socialLinks.map((link) => {
                      const iconClass = PLATFORM_FLATICONS[link.platform as keyof typeof PLATFORM_FLATICONS] || "fi fi-br-globe";
                      return (
                        <a
                          key={link.id}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-body text-muted hover:text-foreground animate-social-hover"
                        >
                          <i className={`${iconClass} mr-3 text-base leading-none text-foreground shrink-0`} aria-hidden="true" />
                          <span className="underline underline-offset-4 font-medium">{link.label}</span>
                        </a>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Direct Email & Resume */}
              <div className="space-y-6 pt-6 border-t border-border">
                {contactEmail && (
                  <div className="space-y-1.5">
                    <span className="text-caption font-semibold uppercase tracking-wider text-muted block">
                      Direct Email
                    </span>
                    <p className="text-body font-semibold">
                      <a href={`mailto:${contactEmail}`} className="underline underline-offset-4 hover:opacity-85 transition-opacity">
                        {contactEmail}
                      </a>
                    </p>
                  </div>
                )}

                {resumeUrl && (
                  <div className="space-y-3">
                    <span className="text-caption font-semibold uppercase tracking-wider text-muted block">
                      Curriculum Vitae
                    </span>
                    <Button asChild variant="secondary" size="md" className="animate-btn-scale">
                      <a href={resumeUrl} download={resumeFilename} target="_blank" rel="noopener noreferrer">
                        <i className="fi fi-br-document mr-2 text-base leading-none" aria-hidden="true" />
                        Download Resume
                      </a>
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Side: Contact Form (Aligned at top) */}
          <AnimateIn from="up" distance={24} delay={0.15}>
            <div className="border border-border p-6 md:p-8 rounded-sm bg-background">
              <h2 className="text-h3 font-bold tracking-tight mb-6">
                Send a Message
              </h2>
              <ContactForm />
            </div>
          </AnimateIn>
        </Container>
      </div>
    </SkeletonWrapper>
  );
}
