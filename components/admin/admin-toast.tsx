"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { motion, AnimatePresence } from "motion/react";
import { CheckCircle2, XCircle, X } from "lucide-react";

export type ToastType = "success" | "error";

export interface ToastItem {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
}

interface ToastContextType {
  showToast: (params: { type: ToastType; title: string; message?: string }) => void;
  success: (title: string, message?: string) => void;
  error: (title: string, message?: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function AdminToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    ({ type, title, message }: { type: ToastType; title: string; message?: string }) => {
      const id = Math.random().toString(36).substring(2, 9);
      setToasts((prev) => [...prev.slice(-2), { id, type, title, message }]); // keep max 3

      setTimeout(() => {
        removeToast(id);
      }, 3000);
    },
    [removeToast]
  );

  const success = useCallback(
    (title: string, message?: string) => showToast({ type: "success", title, message }),
    [showToast]
  );

  const error = useCallback(
    (title: string, message?: string) => showToast({ type: "error", title, message }),
    [showToast]
  );

  return (
    <ToastContext.Provider value={{ showToast, success, error }}>
      {children}

      {/* Top Right Toast Notification Container */}
      <div
        aria-live="polite"
        className="fixed top-4 right-4 md:top-6 md:right-6 z-[9999] flex flex-col space-y-2 pointer-events-none max-w-[calc(100vw-2rem)] sm:max-w-xs"
      >
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: -16, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.94 }}
              transition={{ type: "spring", stiffness: 420, damping: 28 }}
              className="pointer-events-auto flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-lg border border-border bg-background/95 backdrop-blur-md shadow-xl text-small text-foreground select-none"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                {toast.type === "success" ? (
                  <div className="h-6 w-6 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                  </div>
                ) : (
                  <div className="h-6 w-6 rounded-full bg-red-500/15 border border-red-500/30 flex items-center justify-center shrink-0">
                    <XCircle className="h-3.5 w-3.5 text-red-500" />
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="text-small font-semibold leading-tight text-foreground truncate">
                    {toast.title}
                  </p>
                  {toast.message && (
                    <p className="text-caption text-muted leading-tight truncate mt-0.5">
                      {toast.message}
                    </p>
                  )}
                </div>
              </div>

              <button
                onClick={() => removeToast(toast.id)}
                className="text-muted hover:text-foreground p-0.5 rounded-md transition-colors shrink-0"
                aria-label="Dismiss notification"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useAdminToast() {
  const context = useContext(ToastContext);
  if (!context) {
    // Fallback stub if used outside provider
    return {
      showToast: () => {},
      success: () => {},
      error: () => {},
    };
  }
  return context;
}
