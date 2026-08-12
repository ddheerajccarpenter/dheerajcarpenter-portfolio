"use client";

import { useTheme } from "next-themes";
import { useEffect, useState, useRef } from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "motion/react";

export function ThemeToggle({ className }: { className?: string }) {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isHolding, setIsHolding] = useState(false);

  const holdTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isLongPressRef = useRef(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted ? resolvedTheme === "dark" : false;

  const triggerThemeToggle = (element: HTMLElement, isSlow: boolean) => {
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), isSlow ? 2300 : 600);

    const nextIsDark = !isDark;
    const nextTheme = nextIsDark ? "dark" : "light";

    const rect = element.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );

    document.documentElement.style.setProperty("--reveal-x", `${x}px`);
    document.documentElement.style.setProperty("--reveal-y", `${y}px`);
    document.documentElement.style.setProperty("--reveal-radius", `${endRadius}px`);
    document.documentElement.style.setProperty("--reveal-duration", isSlow ? "2200ms" : "550ms");

    const applyThemeChange = () => {
      document.documentElement.classList.toggle("dark", nextIsDark);
      setTheme(nextTheme);
    };

    if (typeof document !== "undefined" && (document as any).startViewTransition) {
      try {
        (document as any).startViewTransition(() => {
          applyThemeChange();
        });
      } catch {
        applyThemeChange();
      }
    } else {
      applyThemeChange();
    }
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLButtonElement>) => {
    isLongPressRef.current = false;
    const targetElement = event.currentTarget;

    holdTimerRef.current = setTimeout(() => {
      isLongPressRef.current = true;
      setIsHolding(true);
      // Trigger slow motion theme transition on press & hold (>250ms)
      triggerThemeToggle(targetElement, true);
    }, 250);
  };

  const handlePointerUp = (event: React.PointerEvent<HTMLButtonElement>) => {
    if (holdTimerRef.current) {
      clearTimeout(holdTimerRef.current);
      holdTimerRef.current = null;
    }

    setIsHolding(false);

    // If released quickly before 250ms hold, trigger fast transition
    if (!isLongPressRef.current) {
      triggerThemeToggle(event.currentTarget, false);
    }
  };

  const handlePointerCancel = () => {
    if (holdTimerRef.current) {
      clearTimeout(holdTimerRef.current);
      holdTimerRef.current = null;
    }
    setIsHolding(false);
  };

  return (
    <button
      type="button"
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
      aria-label="Toggle theme (Hold for slow-motion cinematic transition)"
      title="Tap for fast toggle, Hold for slow-motion cinematic transition"
      className={cn(
        "relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface/90 backdrop-blur-md text-foreground transition-all duration-300 hover:scale-115 hover:border-foreground/40 hover:shadow-md active:scale-90 select-none touch-none",
        isHolding && "scale-125 border-amber-400 ring-4 ring-amber-400/20 shadow-lg",
        className
      )}
    >
      <AnimatePresence mode="wait" initial={false}>
        {!mounted ? (
          <span key="skeleton" className="h-5 w-5 rounded-full bg-muted/30 animate-pulse" />
        ) : isDark ? (
          /* Flaticon Animated Night Mode Icon */
          <motion.div
            key="night-mode"
            initial={{ opacity: 0, rotate: -180, scale: 0.2 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: 180, scale: 0.2 }}
            transition={{ duration: 0.45, ease: [0.34, 1.56, 0.64, 1] }}
            className="relative flex items-center justify-center"
          >
            <motion.svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              animate={isAnimating ? { rotate: 360 } : { rotate: [0, -8, 8, 0] }}
              transition={
                isAnimating
                  ? { duration: isHolding ? 2.2 : 0.6, ease: "easeInOut" }
                  : { duration: 4, repeat: Infinity, ease: "easeInOut" }
              }
              className="text-amber-300 drop-shadow-[0_0_8px_rgba(252,211,77,0.5)]"
            >
              <path
                d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
                fill="currentColor"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <motion.circle
                cx="19"
                cy="4"
                r="1.5"
                fill="#FDE68A"
                animate={{ scale: [0.6, 1.2, 0.6], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
              />
              <motion.circle
                cx="15"
                cy="2"
                r="1"
                fill="#FDE68A"
                animate={{ scale: [1, 0.5, 1], opacity: [1, 0.4, 1] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
              />
            </motion.svg>
          </motion.div>
        ) : (
          /* Flaticon Animated Day Mode Icon */
          <motion.div
            key="day-mode"
            initial={{ opacity: 0, rotate: 180, scale: 0.2 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: -180, scale: 0.2 }}
            transition={{ duration: 0.45, ease: [0.34, 1.56, 0.64, 1] }}
            className="relative flex items-center justify-center"
          >
            <motion.svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              animate={isAnimating ? { rotate: 360 } : { rotate: [0, 45, 90, 135, 180] }}
              transition={
                isAnimating
                  ? { duration: isHolding ? 2.2 : 0.6, ease: "easeInOut" }
                  : { duration: 12, repeat: Infinity, ease: "linear" }
              }
              className="text-amber-500 drop-shadow-[0_0_8px_rgba(245,158,11,0.4)]"
            >
              <circle cx="12" cy="12" r="5" fill="currentColor" />
              <g stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="12" y1="1" x2="12" y2="3" />
                <line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" />
                <line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </g>
            </motion.svg>
          </motion.div>
        )}
      </AnimatePresence>
    </button>
  );
}
