import { getSettings, getSocialLinks } from "@/lib/data/public";
import { Container } from "@/components/layout/container";
import { ContactForm } from "@/components/public/contact-form";
import { Button } from "@/components/ui";
import { SkeletonWrapper } from "@/components/ui/skeleton-wrapper";
import { AnimateIn } from "@/components/ui/animate-in";
import {
  Mail,
  FileText,
  ArrowUpRight,
  Github,
  Linkedin,
  Twitter,
  Instagram,
  Youtube,
  Globe,
  type LucideIcon,
} from "lucide-react";

export const revalidate = 0;
export const dynamic = "force-dynamic";

const PLATFORM_ICONS: Record<string, LucideIcon> = {
  github: Github,
  linkedin: Linkedin,
  twitter: Twitter,
  instagram: Instagram,
  youtube: Youtube,
  email: Mail,
  website: Globe,
};

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
      <div className="py-16 md:py-24">
        <Container className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Left Side: Header, Info & Channels */}
          <div className="space-y-8">
            <div className="space-y-3">
              <AnimateIn from="up" distance={16} duration={0.4} viewport={false}>
                <div className="inline-flex items-center gap-2 text-caption font-bold uppercase tracking-[0.14em] text-muted mb-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-foreground inline-block opacity-60" />
                  Get In Touch
                </div>
                <h1 className="text-h1 font-bold tracking-tight sm:text-[3rem] text-editorial-gradient">
                  Contact
                </h1>
              </AnimateIn>
              <AnimateIn from="up" distance={12} delay={0.1} viewport={false}>
                <p className="prose-readable text-body-lg text-muted">
                  Available for engineering contracts, technical advisory, design consulting, or collaborative projects.
                </p>
              </AnimateIn>
            </div>

            <div className="space-y-6 pt-2">
              {/* Direct Email & Resume */}
              <div className="space-y-6 pt-4 border-t border-border/80">
                {contactEmail && (
                  <div className="space-y-1.5">
                    <span className="text-caption font-semibold uppercase tracking-wider text-muted flex items-center gap-2">
                      <Mail className="h-3.5 w-3.5 text-foreground opacity-80" />
                      Direct Email
                    </span>
                    <p className="text-body font-semibold">
                      <a href={`mailto:${contactEmail}`} className="underline underline-offset-4 hover:opacity-80 transition-opacity">
                        {contactEmail}
                      </a>
                    </p>
                  </div>
                )}

                {resumeUrl && (
                  <div className="space-y-3">
                    <span className="text-caption font-semibold uppercase tracking-wider text-muted flex items-center gap-2">
                      <FileText className="h-3.5 w-3.5 text-foreground opacity-80" />
                      Curriculum Vitae
                    </span>
                    <Button asChild variant="secondary" size="md">
                      <a href={resumeUrl} download={resumeFilename} target="_blank" rel="noopener noreferrer">
                        Download Resume (PDF)
                        <ArrowUpRight className="h-4 w-4 ml-1.5 opacity-80" />
                      </a>
                    </Button>
                  </div>
                )}
              </div>

              {/* Social Channels */}
              {socialLinks.length > 0 && (
                <div className="space-y-3 pt-6 border-t border-border/80">
                  <h3 className="text-caption font-bold uppercase tracking-wider text-muted flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-foreground inline-block opacity-60" />
                    Network & Profiles
                  </h3>
                  <div className="flex flex-col space-y-2.5 pt-1">
                    {socialLinks.map((link) => {
                      const Icon = PLATFORM_ICONS[link.platform as keyof typeof PLATFORM_ICONS] || Globe;
                      return (
                        <a
                          key={link.id}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-small text-muted hover:text-foreground transition-all duration-180 gap-3 group px-3 py-2 rounded-xl hover:bg-surface/60 border border-transparent hover:border-border/60"
                        >
                          <Icon className="h-4 w-4 text-muted group-hover:text-foreground shrink-0" aria-hidden="true" />
                          <span className="font-medium group-hover:underline underline-offset-4">{link.label}</span>
                          <ArrowUpRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-foreground ml-auto" />
                        </a>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Side: Contact Form Framed in Bento Card */}
          <AnimateIn from="up" distance={16} delay={0.15}>
            <div className="bento-card p-6 md:p-8 rounded-3xl space-y-6">
              <div>
                <h2 className="text-xl font-bold tracking-tight text-foreground">
                  Send a Message
                </h2>
                <p className="text-small text-muted mt-1">
                  Fill out the form below and I will respond within 24–48 hours.
                </p>
              </div>
              <ContactForm />
            </div>
          </AnimateIn>
        </Container>
      </div>
    </SkeletonWrapper>
  );
}
