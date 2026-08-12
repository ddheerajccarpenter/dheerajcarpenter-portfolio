import { requireAdmin } from "@/lib/auth";
import { AdminSidebar, AdminMobileNav } from "@/components/admin/admin-nav";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { GlobalSearch } from "@/components/admin/global-search";
import { AdminToastProvider } from "@/components/admin/admin-toast";
import Link from "next/link";
import { ExternalLink, ShieldCheck } from "lucide-react";

export const revalidate = 0; // Dynamic rendering for admin routes

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Enforce admin check at server component boundary
  const session = await requireAdmin();

  return (
    <AdminToastProvider>
      <div className="flex min-h-screen bg-background text-foreground transition-colors duration-200">
        {/* Desktop Sidebar */}
        <AdminSidebar />

        {/* Main Panel */}
        <div className="flex-1 flex flex-col min-w-0 pb-16 md:pb-0">
          {/* Top Header */}
          <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/95 backdrop-blur-md px-4 md:px-8">
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2 text-caption text-muted font-medium">
                <span className="inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded bg-surface border border-border text-foreground">
                  <ShieldCheck className="h-3 w-3 mr-1 text-emerald-500" />
                  Admin
                </span>
                <span className="hidden sm:inline text-muted/40">/</span>
                <span className="hidden sm:inline text-foreground font-semibold">
                  {session.name || session.email}
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-3 md:space-x-4">
              <GlobalSearch />
              <Link
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-caption font-semibold text-muted hover:text-foreground transition-colors border border-border px-3 py-1.5 rounded-md hover:bg-surface"
              >
                <span>View Site</span>
                <ExternalLink className="h-3 w-3 ml-1.5 opacity-70" />
              </Link>
              <ThemeToggle />
            </div>
          </header>

          {/* Content Container with Entrance Animation */}
          <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto animate-page-reveal">
            {children}
          </main>
        </div>

        {/* Mobile Bottom Navigation */}
        <AdminMobileNav />
      </div>
    </AdminToastProvider>
  );
}
