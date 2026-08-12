"use client";

import { type ReactNode } from "react";

/**
 * Page transition — instant, zero-delay.
 * Navigation feels immediate; scroll-triggered AnimateIn handles
 * per-element entrances within each page.
 */
export function RouteTransition({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
