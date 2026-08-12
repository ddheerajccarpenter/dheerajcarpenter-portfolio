"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import { NAV_ITEMS } from "@/lib/constants";
import { Menu, X, ChevronRight, ChevronDown } from "lucide-react";

/** Flaticon icon class for each route — used in nav + mobile menu */
const NAV_FLATICON_CLASSES: Record<string, string> = {
  "/": "fi fi-br-home",
  "/about": "fi fi-br-user",
  "/services": "fi fi-br-headset",
  "/projects": "fi fi-br-folder",
  "/experience": "fi fi-br-briefcase",
  "/notes": "fi fi-br-copy",
  "/blog": "fi fi-br-edit",
  "/contact": "fi fi-br-envelope",
};

/** Primary links shown directly in the desktop nav bar (with icons) */
const PRIMARY_HREFS = new Set(["/", "/about", "/projects", "/blog", "/contact"]);

/** Derived: primary items stay in the bar, secondary go into "More" dropdown */
const PRIMARY_NAV = NAV_ITEMS.filter((item) => PRIMARY_HREFS.has(item.href));
const SECONDARY_NAV = NAV_ITEMS.filter((item) => !PRIMARY_HREFS.has(item.href));

// 3 Most Important Buttons for Mobile Bottom Navigation
const MOBILE_BOTTOM_NAV = [
  { href: "/", label: "Home", icon: "fi fi-br-home" },
  { href: "/about", label: "About", icon: "fi fi-br-user" },
  { href: "/projects", label: "Projects", icon: "fi fi-br-folder" },
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

  // Check if any secondary link is currently active
  const isSecondaryActive = SECONDARY_NAV.some(
    (item) => pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))
  );

  return (
    <nav className="hidden md:flex items-center space-x-1" aria-label="Desktop navigation">
      {PRIMARY_NAV.map((item) => {
        const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
        const iconClass = NAV_FLATICON_CLASSES[item.href] || "fi fi-br-link";
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "text-small font-medium transition-all duration-250 ease-out relative px-3 py-1.5 rounded-md border border-transparent inline-flex items-center gap-1.5",
              isActive ? "text-foreground font-semibold" : "text-muted hover:text-foreground"
            )}
          >
            <i
              className={cn(iconClass, "text-xs leading-none")}
              aria-hidden="true"
            />
            {item.label}
            {isActive && (
              <motion.span
                layoutId="nav-indicator"
                className="absolute bottom-0 left-2 right-2 h-[2px] bg-foreground rounded-full"
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}
          </Link>
        );
      })}

      {/* "More" dropdown for secondary links */}
      {SECONDARY_NAV.length > 0 && (
        <div className="relative" ref={moreRef}>
          <button
            onClick={() => setMoreOpen((prev) => !prev)}
            className={cn(
              "text-small font-medium transition-all duration-250 ease-out relative px-3 py-1.5 rounded-md border border-transparent inline-flex items-center gap-1.5",
              isSecondaryActive
                ? "text-foreground font-semibold"
                : "text-muted hover:text-foreground"
            )}
            aria-expanded={moreOpen}
            aria-haspopup="true"
          >
            <i className="fi fi-br-menu-dots text-xs leading-none" aria-hidden="true" />
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
                className="absolute bottom-0 left-2 right-2 h-[2px] bg-foreground rounded-full"
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}
          </button>

          <AnimatePresence>
            {moreOpen && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -6, scale: 0.97 }}
                transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                className="absolute top-full right-0 mt-2 w-56 bg-background border border-border rounded-xl shadow-lg overflow-hidden p-2 z-50"
              >
                {SECONDARY_NAV.map((item) => {
                  const isActive =
                    pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
                  const iconClass = NAV_FLATICON_CLASSES[item.href] || "fi fi-br-link";

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMoreOpen(false)}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2.5 rounded-lg text-small font-medium transition-all duration-150",
                        isActive
                          ? "bg-surface text-foreground font-semibold border border-border"
                          : "text-muted hover:text-foreground hover:bg-surface/50"
                      )}
                    >
                      <i
                        className={cn(iconClass, "text-sm leading-none text-foreground")}
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

/**
 * Mobile Bottom Navigation:
 * Keeps ONLY 3 important buttons (Home, About, Projects) evenly spaced with clean touch targets.
 */
export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-md border-t border-border h-16 px-4 pb-safe flex items-center shadow-lg"
      aria-label="Mobile bottom navigation"
    >
      <div className="grid grid-cols-3 w-full h-full max-w-md mx-auto">
        {MOBILE_BOTTOM_NAV.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center h-full py-1 rounded-lg text-caption font-medium transition-all duration-200 border border-transparent select-none",
                isActive
                  ? "text-foreground font-bold bg-surface/80 shadow-xs"
                  : "text-muted hover:text-foreground hover:bg-surface/30"
              )}
            >
              <i className={cn(item.icon, "text-lg mb-0.5 leading-none")} aria-hidden="true" />
              <span className="text-[11px] tracking-tight">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

/**
 * Top Right Menu for Mobile:
 * Hamburger / Menu trigger in top right header that opens slide-out drawer with all navigation options.
 */
export function MobileHeaderMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Close menu automatically on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Lock body scroll when mobile menu is open
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
        className="flex items-center justify-center h-9 w-9 rounded-md border border-border bg-surface/60 text-foreground hover:bg-surface transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
        aria-label={isOpen ? "Close menu" : "Open menu"}
        aria-expanded={isOpen}
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs md:hidden"
            />

            {/* Slide-over Menu Content */}
            <motion.div
              initial={{ opacity: 0, y: -16, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.96 }}
              transition={{ type: "spring", stiffness: 350, damping: 28 }}
              className="fixed top-16 right-4 left-4 z-50 max-w-sm ml-auto bg-background border border-border rounded-xl shadow-2xl overflow-hidden p-4 space-y-4 md:hidden max-h-[80vh] flex flex-col"
            >
              <div className="flex items-center justify-between border-b border-border pb-3 px-1">
                <span className="text-caption uppercase tracking-wider font-bold text-muted">
                  Navigation Menu
                </span>
                <span className="text-caption text-muted font-mono">
                  {NAV_ITEMS.length} Options
                </span>
              </div>

              <div className="overflow-y-auto space-y-1 pr-1 custom-scrollbar flex-1">
                {NAV_ITEMS.map((item) => {
                  const isActive =
                    pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
                  const iconClass = NAV_FLATICON_CLASSES[item.href] || "fi fi-br-link";

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        "flex items-center justify-between px-3 py-2.5 rounded-lg text-small font-medium transition-all duration-150",
                        isActive
                          ? "bg-surface text-foreground font-semibold border border-border"
                          : "text-muted hover:text-foreground hover:bg-surface/40"
                      )}
                    >
                      <div className="flex items-center space-x-3">
                        <i className={cn(iconClass, "text-base leading-none text-foreground")} aria-hidden="true" />
                        <span>{item.label}</span>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted opacity-60" />
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
