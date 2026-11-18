"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Check, Copy, Mail, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

interface CopyEmailBadgeProps {
  email: string;
  className?: string;
  variant?: "pill" | "inline";
}

/**
 * CopyEmailBadge — Interactive 1-click email copy with animated micro-feedback.
 *
 * - Copies email to clipboard instantly
 * - Animated icon swap (Copy → Check) with spring physics
 * - Shows status pill ("Copied!")
 * - Includes direct mailto fallback link for mail apps
 * - Pure GPU compositor transitions
 */
export function CopyEmailBadge({
  email,
  className,
  variant = "pill",
}: CopyEmailBadgeProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      if (typeof navigator !== "undefined" && navigator.clipboard) {
        await navigator.clipboard.writeText(email);
        setCopied(true);
        setTimeout(() => setCopied(false), 2200);
      }
    } catch {
      // Fallback for restricted clipboard contexts
      const textarea = document.createElement("textarea");
      textarea.value = email;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      try {
        document.execCommand("copy");
        setCopied(true);
        setTimeout(() => setCopied(false), 2200);
      } finally {
        document.body.removeChild(textarea);
      }
    }
  };

  if (variant === "inline") {
    return (
      <div className={cn("inline-flex items-center gap-2", className)}>
        <button
          type="button"
          onClick={handleCopy}
          aria-label={copied ? "Email copied to clipboard" : `Copy ${email} to clipboard`}
          className="group inline-flex items-center gap-1.5 font-mono text-small text-foreground hover:text-muted transition-colors cursor-pointer select-none"
        >
          <span className="underline underline-offset-4">{email}</span>
          <span className="p-1 rounded-md border border-border bg-surface group-hover:bg-surface-raised transition-colors">
            {copied ? (
              <Check className="h-3 w-3 text-emerald-500 animate-in zoom-in-50 duration-150" />
            ) : (
              <Copy className="h-3 w-3 text-muted group-hover:text-foreground transition-colors" />
            )}
          </span>
        </button>
        <span aria-live="polite" className="sr-only">
          {copied ? "Copied to clipboard" : ""}
        </span>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-xl border border-border bg-surface/80 p-1 text-xs shadow-xs transition-all duration-200 hover:border-border-strong group",
        className
      )}
    >
      {/* Interactive Copy Button */}
      <button
        type="button"
        onClick={handleCopy}
        aria-label={copied ? "Email copied to clipboard" : `Copy ${email} to clipboard`}
        className={cn(
          "inline-flex items-center gap-2 px-3 py-1.5 rounded-lg font-mono text-caption font-medium transition-all duration-150 cursor-pointer select-none active:scale-[0.96]",
          copied
            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold"
            : "text-foreground hover:bg-surface-raised"
        )}
      >
        <AnimatePresence mode="wait" initial={false}>
          {copied ? (
            <motion.span
              key="check"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ type: "spring", stiffness: 450, damping: 20 }}
              className="inline-flex items-center gap-1.5"
            >
              <Check className="h-3.5 w-3.5 text-emerald-500" />
              <span>Copied to clipboard!</span>
            </motion.span>
          ) : (
            <motion.span
              key="copy"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="inline-flex items-center gap-2"
            >
              <Copy className="h-3.5 w-3.5 text-muted group-hover:text-foreground transition-colors" />
              <span>{email}</span>
            </motion.span>
          )}
        </AnimatePresence>
      </button>

      {/* Direct Mailto Launcher */}
      <a
        href={`mailto:${email}`}
        aria-label={`Open email client to send email to ${email}`}
        title="Open in email client"
        className="p-1.5 rounded-lg text-muted hover:text-foreground hover:bg-surface-raised transition-all duration-150 cursor-pointer active:scale-95"
      >
        <Mail className="h-3.5 w-3.5" />
      </a>
      <span aria-live="polite" className="sr-only">
        {copied ? "Copied email address to clipboard" : ""}
      </span>
    </div>
  );
}
