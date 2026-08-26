import Link from "next/link";
import { getSettings, getActivePublicNotification, getSocialLinks } from "@/lib/data/public";
import { ThemeToggle } from "./theme-toggle";
import { DesktopNav, MobileNav, MobileHeaderMenu } from "./public-nav";
import { Container } from "./container";
import { HiddenAdminTrigger } from "./hidden-admin-trigger";
import { ThemeInjector } from "./theme-injector";
import { PublicNotificationBanner } from "./public-notification-banner";
import { ScrollProgress } from "@/components/ui/scroll-progress";

export async function PublicShell({ children }: { children: React.ReactNode }) {
  const [settings, activeNotif, socialLinks] = await Promise.all([
    getSettings(),
    getActivePublicNotification(),
    getSocialLinks(),
  ]);
  const siteTitle = settings?.site_title || "Dheeraj Carpenter";
  const contactEmail = settings?.contact_email;

  const animStyle = settings?.animation_style ?? "new";
  const uiDesign = settings?.ui_design ?? "minimalist";

  return (
    <>
      <ThemeInjector uiDesign={uiDesign} />
      <PublicNotificationBanner notification={activeNotif} />
      <ScrollProgress />
      <div
        className="flex min-h-screen flex-col bg-background text-foreground transition-colors duration-200"
        data-anim={animStyle}
        data-ui-design={uiDesign}
      >
        <HiddenAdminTrigger />

        {/* Top Header — Frosted translucent bar */}
        <header className="sticky top-0 z-40 w-full border-b border-border/80 bg-background/80 backdrop-blur-xl">
          <Container className="flex h-16 items-center justify-between">
            <Link
              href="/"
              className="text-small font-bold font-hero-name tracking-tight hover:opacity-80 transition-opacity flex items-center gap-2"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-foreground inline-block shrink-0 opacity-70" />
              <span>{siteTitle}</span>
            </Link>

            <div className="flex items-center space-x-1 md:space-x-3">
              <DesktopNav />
              <div className="h-4 w-px bg-border hidden md:block" />
              <ThemeToggle />
              <MobileHeaderMenu />
            </div>
          </Container>
        </header>

        {/* Main Content Area */}
        <main id="main" className="flex-1 pb-24 md:pb-0">
          {children}
        </main>

        {/* Footer — Editorial & Minimalist */}
        <footer className="border-t border-border/80 bg-surface/40 py-12 mt-auto pb-28 md:pb-12">
          <Container>
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
              {/* Brand + copyright */}
              <div className="space-y-1.5">
                <p className="text-small font-bold text-foreground font-hero-name tracking-tight flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-foreground inline-block shrink-0 opacity-70" />
                  {siteTitle}
                </p>
                <p className="text-caption text-muted">
                  © {new Date().getFullYear()} All rights reserved. Built with modern, tactile design.
                </p>
              </div>

              {/* Footer nav — desktop only */}
              <nav className="hidden md:flex items-center gap-6" aria-label="Footer navigation">
                <Link href="/about" className="text-caption text-muted hover:text-foreground transition-colors">About</Link>
                <Link href="/projects" className="text-caption text-muted hover:text-foreground transition-colors">Projects</Link>
                <Link href="/experience" className="text-caption text-muted hover:text-foreground transition-colors">Experience</Link>
                <Link href="/blog" className="text-caption text-muted hover:text-foreground transition-colors">Blog</Link>
                <Link href="/contact" className="text-caption text-muted hover:text-foreground transition-colors">Contact</Link>
              </nav>

              {/* Social links */}
              <div className="flex flex-wrap items-center gap-4">
                {contactEmail && (
                  <a
                    href={`mailto:${contactEmail}`}
                    className="text-caption text-muted hover:text-foreground transition-colors underline underline-offset-4"
                  >
                    {contactEmail}
                  </a>
                )}
                {socialLinks.length > 0 ? (
                  socialLinks.map((link) => (
                    <a
                      key={link.id}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-caption text-muted hover:text-foreground transition-colors"
                      aria-label={link.label}
                    >
                      <span className="underline underline-offset-4">{link.label}</span>
                    </a>
                  ))
                ) : (
                  <a
                    href="https://github.com/ddheerajccarpenter"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-caption text-muted hover:text-foreground transition-colors"
                    aria-label="GitHub profile"
                  >
                    <i className="fi fi-brands-github text-sm leading-none" aria-hidden="true" />
                    <span className="underline underline-offset-4">GitHub</span>
                  </a>
                )}
              </div>
            </div>
          </Container>
        </footer>

        {/* Mobile Bottom Navigation */}
        <MobileNav />
      </div>
    </>
  );
}
