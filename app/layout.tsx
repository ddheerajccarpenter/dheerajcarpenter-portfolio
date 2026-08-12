import type { Metadata } from "next";
import { Inter, Geist, Geist_Mono, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { MotionProvider } from "@/components/providers/motion-provider";
import { ContentGuard } from "@/components/layout/content-guard";
import { getSettings } from "@/lib/data/public";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-hero-name",
  subsets: ["latin"],
  weight: ["700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Dheeraj Carpenter",
    template: "%s — Dheeraj Carpenter",
  },
  description: "Portfolio of Dheeraj Carpenter — projects, experience, and contact.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getSettings();
  const defaultTheme = (settings?.default_theme as "system" | "light" | "dark") || "system";

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${geistSans.variable} ${geistMono.variable} ${plusJakartaSans.variable} h-full antialiased`}
    >
      <head>
        <link rel="preconnect" href="https://cdn-uicons.flaticon.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://cdn-uicons.flaticon.com" />
        <link rel="stylesheet" href="https://cdn-uicons.flaticon.com/2.6.0/uicons-bold-rounded/css/uicons-bold-rounded.css" />
        <link rel="stylesheet" href="https://cdn-uicons.flaticon.com/2.6.0/uicons-bold-straight/css/uicons-bold-straight.css" />
        <link rel="stylesheet" href="https://cdn-uicons.flaticon.com/2.6.0/uicons-regular-rounded/css/uicons-regular-rounded.css" />
        <link rel="stylesheet" href="https://cdn-uicons.flaticon.com/2.6.0/uicons-solid-rounded/css/uicons-solid-rounded.css" />
      </head>
      <body className="min-h-full bg-background text-foreground flex flex-col">
        <ThemeProvider defaultTheme={defaultTheme}>
          <MotionProvider>
            <ContentGuard />
            {/* Skip link — first focusable element for keyboard users */}
            <a
              href="#main"
              className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:rounded-sm focus:bg-background focus:px-4 focus:py-2 focus:outline focus:outline-2 focus:outline-focus"
            >
              Skip to content
            </a>
            {children}
          </MotionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
