"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Bell, Megaphone, AlertTriangle, CheckCircle2, X } from "lucide-react";
import type { PublicNotification } from "@/types/database";

interface PublicNotificationBannerProps {
  notification: PublicNotification | null;
}

export function PublicNotificationBanner({ notification }: PublicNotificationBannerProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!notification || !notification.active) {
      setVisible(false);
      return;
    }

    // Key unique to this notification ID
    const storageKey = `seen_notif_${notification.id}`;
    
    // Check if user already saw/dismissed this notification in this session
    try {
      const alreadySeen = sessionStorage.getItem(storageKey);
      if (!alreadySeen) {
        setVisible(true);
      }
    } catch {
      setVisible(true);
    }
  }, [notification]);

  const handleDismiss = () => {
    if (!notification) return;
    setVisible(false);
    try {
      sessionStorage.setItem(`seen_notif_${notification.id}`, "true");
    } catch {
      // ignore quota errors
    }
  };

  if (!notification || !notification.active || !visible) return null;

  const iconMap = {
    info: <Bell className="h-4 w-4 text-blue-500 shrink-0" />,
    announcement: <Megaphone className="h-4 w-4 text-indigo-500 shrink-0" />,
    alert: <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0" />,
    success: <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />,
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -16, scale: 0.96 }}
          transition={{ type: "spring", stiffness: 380, damping: 26 }}
          className="fixed top-20 right-4 sm:right-6 z-[9990] max-w-sm w-[calc(100vw-2rem)] p-4 rounded-xl border border-border bg-background/95 backdrop-blur-md shadow-2xl text-foreground select-none"
        >
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-surface border border-border shrink-0 mt-0.5">
              {iconMap[notification.type] || iconMap.info}
            </div>

            <div className="flex-1 min-w-0 space-y-1">
              <div className="flex items-center justify-between gap-2">
                <h4 className="text-small font-bold leading-tight text-foreground truncate">
                  {notification.title}
                </h4>
                <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded border border-border bg-surface text-muted shrink-0">
                  {notification.type}
                </span>
              </div>
              <p className="text-caption text-muted leading-relaxed whitespace-pre-line">
                {notification.message}
              </p>
            </div>

            <button
              onClick={handleDismiss}
              className="text-muted hover:text-foreground p-1 rounded-md transition-colors shrink-0 -mr-1 -mt-1"
              aria-label="Dismiss announcement"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
