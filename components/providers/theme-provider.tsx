"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { type ComponentProps } from "react";

/**
 * Theme provider wrapping the app with next-themes.
 *
 * Strategy: "class" — toggles the `.dark` class on <html>, which switches
 * the B&W design tokens defined in globals.css. No colours beyond black/
 * white in either mode. System preference is respected by default; the user
 * can override, and the choice is persisted.
 */
export function ThemeProvider({
  children,
  ...props
}: ComponentProps<typeof NextThemesProvider>) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      {...props}
    >
      {children}
    </NextThemesProvider>
  );
}
