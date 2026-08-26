"use client";

import { useTheme } from "next-themes";
import { useEffect, useState, useRef } from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "motion/react";
import { Sun, Moon } from "lucide-react";

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
    setTimeout(() => setIsAnimating(false), isSlow ? 2200 : 500);

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
    document.documentElement.style.setProperty("--reveal-duration", isSlow ? "2000ms" : "500ms");

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
      triggerThemeToggle(targetElement, true);
    }, 280);
  };

  const handlePointerUp = (event: React.PointerEvent<HTMLButtonElement>) => {
    if (holdTimerRef.current) {
      clearTimeout(holdTimerRef.current);
      holdTimerRef.current = null;
    }

    setIsHolding(false);

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
      aria-label="Toggle theme"
      title="Tap for fast toggle, Hold for cinematic transition"
      className={cn(
        "relative inline-flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-surface text-foreground transition-all duration-200 hover:bg-surface-raised hover:border-border-strong active:scale-95 select-none touch-none cursor-pointer",
        isHolding && "scale-110 ring-2 ring-border-strong shadow-md",
        className
      )}
    >
      <AnimatePresence mode="wait" initial={false}>
        {!mounted ? (
          <span key="skeleton" className="h-4 w-4 rounded-full bg-muted/20 animate-pulse" />
        ) : isDark ? (
          <motion.div
            key="moon"
            initial={{ opacity: 0, rotate: -90, scale: 0.5 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: 90, scale: 0.5 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center justify-center"
          >
            <Moon className="h-4 w-4 text-foreground" />
          </motion.div>
        ) : (
          <motion.div
            key="sun"
            initial={{ opacity: 0, rotate: 90, scale: 0.5 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: -90, scale: 0.5 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center justify-center"
          >
            <Sun className="h-4 w-4 text-foreground" />
          </motion.div>
        )}
      </AnimatePresence>
    </button>
  );
}
