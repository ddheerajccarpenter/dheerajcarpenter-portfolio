import Link from "next/link";
import { getSettings, getActivePublicNotification } from "@/lib/data/public";
import { ThemeToggle } from "./theme-toggle";
import { DesktopNav, MobileNav, MobileHeaderMenu } from "./public-nav";
import { Container } from "./container";
import { HiddenAdminTrigger } from "./hidden-admin-trigger";
import { ThemeInjector } from "./theme-injector";
import { PublicNotificationBanner } from "./public-notification-banner";
import { ScrollProgress } from "@/components/ui/scroll-progress";

export async function PublicShell({ children }: { children: React.ReactNode }) {
  const [settings, activeNotif] = await Promise.all([
    getSettings(),
    getActivePublicNotification(),
  ]);
  const siteTitle = settings?.site_title || "Portfolio";
  const contactEmail = settings?.contact_email;

  // Admin-controlled animation style & UI/UX design theme — applied server-side so all visitors get
  // the right style on first paint with no client-side flash.
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
      {/* Top Header */}
      <header className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur-none">
        <Container className="flex h-16 items-center justify-between">
          <Link
            href="/"
            className="text-body-lg font-bold font-hero-name tracking-tight hover:opacity-80 transition-opacity"
          >
            {siteTitle}
          </Link>

          <div className="flex items-center space-x-2 md:space-x-6">
            <DesktopNav />
            <ThemeToggle />
            <MobileHeaderMenu />
          </div>
        </Container>
      </header>

      {/* Main Content Area */}
      <main id="main" className="flex-1 pb-16 md:pb-0">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-background py-8 mt-auto hidden md:block">
        <Container className="flex flex-col md:flex-row items-center justify-between text-caption text-muted">
          <div>
            © {new Date().getFullYear()} {siteTitle}. All rights reserved.
          </div>
          <div className="flex items-center space-x-6 mt-4 md:mt-0">
            {contactEmail && (
              <a
                href={`mailto:${contactEmail}`}
                className="hover:text-foreground transition-colors underline underline-offset-4"
              >
                {contactEmail}
              </a>
            )}
            <a
              href="https://github.com/ddheerajccarpenter"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 hover:text-foreground transition-colors"
              aria-label="GitHub profile"
            >
              <i className="fi fi-brands-github text-base leading-none" aria-hidden="true" />
              <span className="underline underline-offset-4">GitHub</span>
            </a>
          </div>
        </Container>
      </footer>

      {/* Mobile Bottom Navigation */}
      <MobileNav />
    </div>
    </>
  );
}
