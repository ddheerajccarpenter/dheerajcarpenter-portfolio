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
  Menu,
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

const MOBILE_BOTTOM_NAV = [
  { href: "/", label: "Home", icon: Home },
  { href: "/about", label: "About", icon: User },
  { href: "/projects", label: "Work", icon: FolderGit2 },
  { href: "/blog", label: "Blog", icon: Edit3 },
  { href: "/contact", label: "Contact", icon: Mail },
] as const;

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

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-background/90 backdrop-blur-xl border-t border-border/80 h-16 px-2 pb-safe flex items-center shadow-2xl"
      aria-label="Mobile bottom navigation"
    >
      <div className="grid grid-cols-5 w-full h-full max-w-lg mx-auto">
        {MOBILE_BOTTOM_NAV.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center h-full py-1 rounded-xl transition-all duration-200 select-none relative",
                isActive
                  ? "text-foreground font-bold"
                  : "text-muted hover:text-foreground"
              )}
            >
              <Icon
                className={cn("h-4 w-4 mb-0.5 shrink-0", isActive ? "text-foreground" : "text-muted")}
                aria-hidden="true"
              />
              <span className="text-[10px] tracking-tight font-medium">{item.label}</span>
              {isActive && (
                <motion.span
                  layoutId="mobile-nav-indicator"
                  className="absolute bottom-1 w-4 h-0.5 rounded-full bg-foreground"
                  transition={{ type: "spring", stiffness: 320, damping: 28, mass: 0.7 }}
                />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export function MobileHeaderMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <div className="md:hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center h-9 w-9 rounded-xl border border-border bg-surface text-foreground hover:bg-surface-raised transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus cursor-pointer"
        aria-label={isOpen ? "Close menu" : "Open menu"}
        aria-expanded={isOpen}
      >
        {isOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs md:hidden"
            />

            <motion.div
              initial={{ opacity: 0, y: -12, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.97 }}
              transition={{ type: "spring", stiffness: 380, damping: 30 }}
              className="fixed top-16 right-4 left-4 z-50 max-w-sm ml-auto frosted-surface rounded-2xl shadow-2xl overflow-hidden p-4 space-y-3 md:hidden max-h-[80vh] flex flex-col border border-border"
            >
              <div className="flex items-center justify-between border-b border-border pb-3 px-1">
                <span className="text-caption uppercase tracking-wider font-bold text-muted">
                  Menu
                </span>
                <span className="text-caption text-muted font-mono">
                  {NAV_ITEMS.length} Pages
                </span>
              </div>

              <div className="overflow-y-auto space-y-1 pr-1 custom-scrollbar flex-1">
                {NAV_ITEMS.map((item) => {
                  const isActive =
                    pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
                  const Icon = NAV_ICONS[item.href] || FolderGit2;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        "flex items-center justify-between px-3.5 py-2.5 rounded-xl text-small font-medium transition-all duration-150",
                        isActive
                          ? "bg-surface-raised text-foreground font-semibold border border-border shadow-xs"
                          : "text-muted hover:text-foreground hover:bg-surface/50"
                      )}
                    >
                      <div className="flex items-center space-x-3">
                        <Icon
                          className={cn("h-4 w-4 shrink-0", isActive ? "text-foreground" : "text-muted")}
                          aria-hidden="true"
                        />
                        <span>{item.label}</span>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted opacity-50" />
                    </Link>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
