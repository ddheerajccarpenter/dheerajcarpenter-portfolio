"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { ADMIN_NAV } from "@/lib/constants";

const NAV_FLATICON_CLASSES: Record<string, string> = {
  "/admin": "fi fi-br-apps",
  "/admin/content": "fi fi-br-file",
  "/admin/notifications": "fi fi-br-bell",
  "/admin/projects": "fi fi-br-folder",
  "/admin/posts": "fi fi-br-edit",
  "/admin/services": "fi fi-br-cube",
  "/admin/testimonials": "fi fi-br-comment-alt",
  "/admin/experience": "fi fi-br-calendar",
  "/admin/skills": "fi fi-br-layers",
  "/admin/media": "fi fi-br-picture",
  "/admin/messages": "fi fi-br-envelope",
  "/admin/notes": "fi fi-br-copy",
  "/admin/audit-logs": "fi fi-br-shield-check",
  "/admin/seo": "fi fi-br-search",
  "/admin/settings": "fi fi-br-settings",
  "/admin/analytics": "fi fi-br-chart-histogram",
  "/admin/users": "fi fi-br-users",
};

/** Categorised navigation sections for clear administrative hierarchy */
const NAV_SECTIONS = [
  {
    title: "Core",
    items: ["/admin", "/admin/content", "/admin/notifications"],
  },
  {
    title: "Publishing",
    items: ["/admin/projects", "/admin/posts", "/admin/services", "/admin/testimonials"],
  },
  {
    title: "Portfolio Data",
    items: ["/admin/experience", "/admin/skills", "/admin/media"],
  },
  {
    title: "System & Management",
    items: [
      "/admin/messages",
      "/admin/notes",
      "/admin/audit-logs",
      "/admin/seo",
      "/admin/settings",
      "/admin/analytics",
      "/admin/users",
    ],
  },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  };

  // Map string array to actual ADMIN_NAV objects preserving order
  const navMap = new Map<string, (typeof ADMIN_NAV)[number]>(
    ADMIN_NAV.map((item) => [item.href, item])
  );

  return (
    <aside className="hidden md:flex flex-col w-64 border-r border-border bg-background h-screen sticky top-0 py-6 px-4 justify-between shrink-0">
      <div className="flex-1 min-h-0 flex flex-col space-y-4">
        {/* Brand Header */}
        <div className="shrink-0 pb-2 border-b border-border/60">
          <div className="flex items-center space-x-2.5 px-2">
            <div className="h-8 w-8 rounded-lg bg-foreground text-background flex items-center justify-center font-bold text-small shadow-xs">
              <i className="fi fi-br-settings text-sm" aria-hidden="true" />
            </div>
            <div>
              <h2 className="text-small font-bold tracking-tight text-foreground leading-tight">
                Portfolio CMS
              </h2>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-muted block">
                Admin Suite
              </span>
            </div>
          </div>
        </div>

        {/* Grouped Sidebar Navigation */}
        <nav
          className="flex-1 overflow-y-auto pr-1 custom-scrollbar space-y-5"
          aria-label="Admin sidebar navigation"
        >
          {NAV_SECTIONS.map((section) => (
            <div key={section.title} className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted/70 px-3 block mb-1.5">
                {section.title}
              </span>
              <div className="space-y-0.5">
                {section.items.map((href) => {
                  const item = navMap.get(href);
                  if (!item) return null;

                  const iconClass = NAV_FLATICON_CLASSES[item.href] || "fi fi-br-settings";
                  const isActive =
                    item.href === "/admin"
                      ? pathname === "/admin"
                      : pathname.startsWith(item.href);

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "relative flex items-center px-3 py-2 text-small font-medium rounded-md transition-all duration-200 group select-none",
                        isActive
                          ? "bg-surface text-foreground font-semibold shadow-2xs border border-border/80"
                          : "text-muted hover:text-foreground hover:bg-surface/50"
                      )}
                    >
                      {isActive && (
                        <motion.span
                          layoutId="sidebar-active-indicator"
                          className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-foreground rounded-r-full"
                          transition={{ type: "spring", stiffness: 380, damping: 30 }}
                        />
                      )}
                      <i
                        className={cn(
                          iconClass,
                          "mr-3 text-base leading-none shrink-0 transition-transform duration-200 group-hover:scale-110",
                          isActive ? "text-foreground" : "text-muted group-hover:text-foreground"
                        )}
                        aria-hidden="true"
                      />
                      <span className="truncate">{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </div>

      {/* Footer / Sign Out */}
      <div className="shrink-0 pt-3 border-t border-border">
        <button
          onClick={handleLogout}
          className="flex w-full items-center px-3 py-2 text-small font-medium text-muted hover:text-red-500 rounded-md transition-colors hover:bg-red-500/10 group"
        >
          <i
            className="fi fi-br-sign-out-alt mr-3 text-base leading-none shrink-0 transition-transform group-hover:-translate-x-0.5"
            aria-hidden="true"
          />
          Sign Out
        </button>
      </div>
    </aside>
  );
}

export function AdminMobileNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  };

  const primaryNav = [
    { href: "/admin", label: "Overview", icon: "fi fi-br-apps" },
    { href: "/admin/content", label: "Content", icon: "fi fi-br-file" },
    { href: "/admin/projects", label: "Projects", icon: "fi fi-br-folder" },
  ];

  return (
    <>
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-md border-t border-border h-16 px-4 pb-safe flex items-center shadow-lg"
        aria-label="Admin mobile navigation"
      >
        <div className="grid grid-cols-4 w-full h-full max-w-md mx-auto">
          {primaryNav.map((item) => {
            const isActive =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center justify-center h-full py-1 rounded-lg text-caption font-medium transition-all duration-150 border border-transparent select-none",
                  isActive
                    ? "text-foreground font-bold bg-surface/80 shadow-xs"
                    : "text-muted hover:text-foreground hover:bg-surface/30"
                )}
              >
                <i className={cn(item.icon, "text-base mb-0.5 leading-none")} aria-hidden="true" />
                <span className="text-[11px] tracking-tight">{item.label}</span>
              </Link>
            );
          })}

          <button
            onClick={() => setIsOpen(!isOpen)}
            className={cn(
              "flex flex-col items-center justify-center h-full py-1 rounded-lg text-caption font-medium transition-all duration-150 border border-transparent select-none",
              isOpen ? "text-foreground font-bold bg-surface" : "text-muted hover:text-foreground"
            )}
          >
            <i className="fi fi-br-menu-burger text-base mb-0.5 leading-none" aria-hidden="true" />
            <span className="text-[11px] tracking-tight">More</span>
          </button>
        </div>
      </nav>

      {/* Admin Mobile Menu Popover Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs md:hidden"
              onClick={() => setIsOpen(false)}
            />

            <motion.div
              initial={{ opacity: 0, y: "100%" }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: "100%" }}
              transition={{ type: "spring", stiffness: 360, damping: 32 }}
              className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border rounded-t-2xl p-4 max-h-[80vh] flex flex-col space-y-3 md:hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-border pb-3 px-1">
                <div className="flex items-center space-x-2">
                  <i className="fi fi-br-apps text-foreground text-sm" />
                  <span className="text-caption uppercase tracking-wider font-bold text-foreground">
                    Admin Navigation
                  </span>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-muted hover:text-foreground p-1 rounded-md"
                  aria-label="Close menu"
                >
                  <i className="fi fi-br-cross text-sm" />
                </button>
              </div>

              <div className="overflow-y-auto space-y-4 pr-1 custom-scrollbar flex-1 pb-4">
                {NAV_SECTIONS.map((section) => (
                  <div key={section.title} className="space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted px-2 block">
                      {section.title}
                    </span>
                    <div className="grid grid-cols-1 gap-1">
                      {section.items.map((href) => {
                        const item = ADMIN_NAV.find((i) => i.href === href);
                        if (!item) return null;

                        const iconClass = NAV_FLATICON_CLASSES[item.href] || "fi fi-br-settings";
                        const isActive =
                          item.href === "/admin"
                            ? pathname === "/admin"
                            : pathname.startsWith(item.href);

                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setIsOpen(false)}
                            className={cn(
                              "flex items-center space-x-3 px-3 py-2.5 rounded-lg text-small font-medium transition-all duration-150",
                              isActive
                                ? "bg-surface text-foreground font-semibold border border-border"
                                : "text-muted hover:text-foreground hover:bg-surface/40"
                            )}
                          >
                            <i className={cn(iconClass, "text-base leading-none text-foreground")} aria-hidden="true" />
                            <span>{item.label}</span>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                ))}

                <button
                  onClick={handleLogout}
                  className="flex w-full items-center space-x-3 px-3 py-2.5 rounded-lg text-small font-medium text-red-500 hover:bg-red-500/10 transition-colors border-t border-border mt-3"
                >
                  <i className="fi fi-br-sign-out-alt text-base leading-none" aria-hidden="true" />
                  <span>Logout</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
