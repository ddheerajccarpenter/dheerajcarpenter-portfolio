"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import { NAV_ITEMS } from "@/lib/constants";
import {
  Home,
  User,
  Headphones,
  FolderGit2,
  Briefcase,
  FileText,
  Edit3,
  Mail,
  MoreHorizontal,
  HelpCircle,
  X,
  ChevronRight,
  ChevronDown,
  type LucideIcon,
} from "lucide-react";

/** Crisp inline icons for each destination */
const NAV_ICONS: Record<string, LucideIcon> = {
  "/": Home,
  "/about": User,
  "/services": Headphones,
  "/projects": FolderGit2,
  "/experience": Briefcase,
  "/notes": FileText,
  "/blog": Edit3,
  "/contact": Mail,
};

/** Primary links shown directly in the desktop nav bar */
const PRIMARY_HREFS = new Set(["/", "/about", "/projects", "/blog", "/contact"]);

const PRIMARY_NAV = NAV_ITEMS.filter((item) => PRIMARY_HREFS.has(item.href));
const SECONDARY_NAV = NAV_ITEMS.filter((item) => !PRIMARY_HREFS.has(item.href));

export function DesktopNav() {
  const pathname = usePathname();
  const [moreOpen, setMoreOpen] = useState(false);
  const moreRef = useRef<HTMLDivElement>(null);

  // Close "More" dropdown on route change
  useEffect(() => {
    setMoreOpen(false);
  }, [pathname]);

  // Close on click outside
  useEffect(() => {
    if (!moreOpen) return;
    const handler = (e: MouseEvent) => {
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) {
        setMoreOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [moreOpen]);

  const isSecondaryActive = SECONDARY_NAV.some(
    (item) => pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))
  );

  return (
    <nav className="hidden md:flex items-center space-x-1" aria-label="Desktop navigation">
      {PRIMARY_NAV.map((item) => {
        const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
        const Icon = NAV_ICONS[item.href] || FolderGit2;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "text-small font-medium transition-all duration-200 ease-out relative px-3 py-1.5 rounded-lg inline-flex items-center gap-2 group",
              isActive
                ? "text-foreground font-semibold bg-surface-raised border border-border shadow-xs"
                : "text-muted hover:text-foreground hover:bg-surface/80"
            )}
          >
            <Icon
              className={cn("h-3.5 w-3.5 shrink-0 transition-transform duration-200 group-hover:scale-110", isActive ? "text-foreground" : "text-muted")}
              aria-hidden="true"
            />
            {item.label}
            {isActive && (
              <motion.span
                layoutId="nav-indicator"
                className="absolute -bottom-1 left-3 right-3 h-[2px] bg-foreground rounded-full"
                transition={{ type: "spring", stiffness: 320, damping: 28, mass: 0.7 }}
              />
            )}
          </Link>
        );
      })}

      {/* "More" dropdown */}
      {SECONDARY_NAV.length > 0 && (
        <div className="relative" ref={moreRef}>
          <button
            onClick={() => setMoreOpen((prev) => !prev)}
            className={cn(
              "text-small font-medium transition-all duration-200 ease-out relative px-3 py-1.5 rounded-lg inline-flex items-center gap-1.5 cursor-pointer",
              isSecondaryActive
                ? "text-foreground font-semibold bg-surface-raised border border-border shadow-xs"
                : "text-muted hover:text-foreground hover:bg-surface/80"
            )}
            aria-expanded={moreOpen}
            aria-haspopup="true"
          >
            <MoreHorizontal className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            More
            <ChevronDown
              className={cn(
                "h-3.5 w-3.5 transition-transform duration-200",
                moreOpen && "rotate-180"
              )}
            />
            {isSecondaryActive && !moreOpen && (
              <motion.span
                layoutId="nav-indicator"
                className="absolute -bottom-1 left-2 right-2 h-[2px] bg-foreground rounded-full"
                transition={{ type: "spring", stiffness: 320, damping: 28, mass: 0.7 }}
              />
            )}
          </button>

          <AnimatePresence>
            {moreOpen && (
              <motion.div
                initial={{ opacity: 0, y: -6, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -4, scale: 0.98 }}
                transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
                className="absolute top-full right-0 mt-2 w-56 frosted-surface rounded-2xl shadow-xl overflow-hidden p-2 z-50 border border-border"
              >
                {SECONDARY_NAV.map((item) => {
                  const isActive =
                    pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
                  const Icon = NAV_ICONS[item.href] || FolderGit2;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMoreOpen(false)}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2 rounded-xl text-small font-medium transition-all duration-150",
                        isActive
                          ? "bg-surface-raised text-foreground font-semibold border border-border shadow-xs"
                          : "text-muted hover:text-foreground hover:bg-surface/60"
                      )}
                    >
                      <Icon
                        className={cn("h-4 w-4 shrink-0", isActive ? "text-foreground" : "text-muted")}
                        aria-hidden="true"
                      />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </nav>
  );
}

const MOBILE_BOTTOM_PRIMARY = [
  { href: "/", label: "Home", icon: Home },
  { href: "/about", label: "About", icon: User },
  { href: "/projects", label: "Work", icon: FolderGit2 },
  { href: "/contact", label: "Contact", icon: Mail },
] as const;

const MOBILE_MORE_ITEMS = [
  { href: "/experience", label: "Experience", icon: Briefcase, desc: "Career timeline & roles" },
  { href: "/blog", label: "Articles", icon: Edit3, desc: "Writing & tech thoughts" },
  { href: "/skills", label: "Skills", icon: FileText, desc: "Technologies & tools" },
  { href: "/services", label: "Services", icon: Headphones, desc: "Offerings & deliverables" },
  { href: "/notes", label: "Notes", icon: FileText, desc: "Quick notes & ideas" },
  { href: "/faq", label: "FAQ", icon: HelpCircle, desc: "Frequently asked questions" },
] as const;

export function MobileNav() {
  const pathname = usePathname();
  const [moreOpen, setMoreOpen] = useState(false);

  // Close sheet on route change
  useEffect(() => {
    setMoreOpen(false);
  }, [pathname]);

  // Lock scroll when More sheet is open
  useEffect(() => {
    if (moreOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [moreOpen]);

  const isMoreActive = MOBILE_MORE_ITEMS.some(
    (item) => pathname === item.href || pathname.startsWith(item.href)
  );

  return (
    <>
      {/* Lightweight Bottom Drawer for Secondary Navigation */}
      {moreOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex flex-col justify-end">
          {/* Backdrop — pure opacity, zero blur for GPU friendliness */}
          <div
            className="fixed inset-0 bg-black/60 transition-opacity"
            onClick={() => setMoreOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer content */}
          <div className="relative z-10 w-full max-w-lg mx-auto bg-background border-t border-border rounded-t-3xl p-5 pb-safe space-y-4 shadow-xl animate-drawer-up">
            <div className="flex items-center justify-between border-b border-border pb-3 px-1">
              <span className="text-caption uppercase tracking-wider font-bold text-muted">
                Explore More
              </span>
              <button
                onClick={() => setMoreOpen(false)}
                className="p-1.5 rounded-full hover:bg-surface text-muted hover:text-foreground transition-colors"
                aria-label="Close menu"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-1.5 max-h-[60vh] overflow-y-auto scroll-touch overscroll-contain">
              {MOBILE_MORE_ITEMS.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(item.href);
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMoreOpen(false)}
                    className={cn(
                      "flex items-center justify-between p-3 rounded-xl transition-colors",
                      isActive
                        ? "bg-surface-raised text-foreground font-semibold border border-border"
                        : "text-muted hover:text-foreground hover:bg-surface"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "p-2 rounded-lg",
                        isActive ? "bg-foreground text-background" : "bg-surface text-foreground"
                      )}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-small font-medium text-foreground">{item.label}</p>
                        <p className="text-[11px] text-muted">{item.desc}</p>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted opacity-60" />
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Modern Low-GPU Bottom Navigation Bar */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-background border-t border-border min-h-16 h-[calc(4rem+env(safe-area-inset-bottom,0px))] px-2 pb-safe flex items-center shadow-lg"
        aria-label="Mobile bottom navigation"
      >
        <div className="grid grid-cols-5 w-full h-full max-w-lg mx-auto items-center">
          {MOBILE_BOTTOM_PRIMARY.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center justify-center h-full py-1 transition-colors select-none relative",
                  isActive
                    ? "text-foreground font-semibold"
                    : "text-muted hover:text-foreground"
                )}
              >
                <Icon
                  className={cn("h-4.5 w-4.5 mb-1 shrink-0", isActive ? "text-foreground scale-105" : "text-muted")}
                  aria-hidden="true"
                />
                <span className="text-[11px] tracking-tight">{item.label}</span>
                {isActive && (
                  <span className="w-1 h-1 rounded-full bg-foreground mt-0.5" />
                )}
              </Link>
            );
          })}

          {/* 5th Tab: "More" Drawer Trigger */}
          <button
            onClick={() => setMoreOpen(!moreOpen)}
            className={cn(
              "flex flex-col items-center justify-center h-full py-1 transition-colors select-none cursor-pointer",
              isMoreActive || moreOpen
                ? "text-foreground font-semibold"
                : "text-muted hover:text-foreground"
            )}
            aria-label="More navigation options"
            aria-expanded={moreOpen}
          >
            <MoreHorizontal
              className={cn("h-4.5 w-4.5 mb-1 shrink-0", (isMoreActive || moreOpen) ? "text-foreground scale-105" : "text-muted")}
              aria-hidden="true"
            />
            <span className="text-[11px] tracking-tight">More</span>
            {isMoreActive && (
              <span className="w-1 h-1 rounded-full bg-foreground mt-0.5" />
            )}
          </button>
        </div>
      </nav>
    </>
  );
}

export function MobileHeaderMenu() {
  return null;
}
