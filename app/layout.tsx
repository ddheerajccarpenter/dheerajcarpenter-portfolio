import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { MotionProvider } from "@/components/providers/motion-provider";
import { ContentGuard } from "@/components/layout/content-guard";
import { getPublicBootstrapData } from "@/lib/data/public";
import { PersonJsonLd, WebSiteJsonLd } from "@/components/seo/json-ld";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});


export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fafafa" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
};

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://dheerajcarpenter.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Dheeraj Carpenter — Software Engineer & Developer",
    template: "%s — Dheeraj Carpenter",
  },
  description:
    "Personal portfolio, web applications, engineering projects, and technical notes of Dheeraj Carpenter — software engineer and creator specializing in TypeScript, Next.js, and React.",
  keywords: [
    "Dheeraj Carpenter",
    "Software Engineer",
    "Full Stack Developer",
    "Frontend Developer",
    "Next.js Developer",
    "React Developer",
    "TypeScript",
    "Tailwind CSS",
    "Web Developer India",
    "Portfolio",
    "Open Source",
  ],
  authors: [{ name: "Dheeraj Carpenter", url: SITE_URL }],
  creator: "Dheeraj Carpenter",
  publisher: "Dheeraj Carpenter",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    title: "Dheeraj Carpenter — Software Engineer & Developer",
    description:
      "Personal portfolio, web applications, engineering projects, and technical notes of Dheeraj Carpenter.",
    siteName: "Dheeraj Carpenter",
  },
  twitter: {
    card: "summary_large_image",
    title: "Dheeraj Carpenter — Software Engineer & Developer",
    description:
      "Personal portfolio, web applications, engineering projects, and technical notes of Dheeraj Carpenter.",
    creator: "@dheerajcarpenter",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  other: {
    "geo.region": "IN",
    "geo.placename": "India",
    "apple-mobile-web-app-title": "Dheeraj Carpenter",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { settings } = await getPublicBootstrapData();
  const defaultTheme = (settings?.default_theme as "system" | "light" | "dark") || "system";
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  let supabaseOrigin: string | null = null;
  if (supabaseUrl) {
    try {
      supabaseOrigin = new URL(supabaseUrl).origin;
    } catch {
      supabaseOrigin = null;
    }
  }

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        {/* Entity Schemas for Google Knowledge Graph, Perplexity, Gemini, ChatGPT Search */}
        <PersonJsonLd />
        <WebSiteJsonLd />

        {/* DNS prefetch & Preconnect for high-speed Supabase data & assets */}
        {supabaseOrigin && (
          <>
            <link rel="preconnect" href={supabaseOrigin} crossOrigin="anonymous" />
            <link rel="dns-prefetch" href={supabaseOrigin} />
          </>
        )}
      </head>
      <body className="min-h-full bg-background text-foreground flex flex-col">
        <ThemeProvider defaultTheme={defaultTheme}>
          <MotionProvider>
            {/* Skip link — first focusable element for keyboard users */}
            <a
              href="#main"
              className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:rounded-sm focus:bg-background focus:px-4 focus:py-2 focus:outline focus:outline-2 focus:outline-focus"
            >
              Skip to content
            </a>
            <ContentGuard />
            {children}
          </MotionProvider>
        </ThemeProvider>
        {/* Google tag (gtag.js) */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-6NR7FKV3Y1"
          strategy="afterInteractive"
        />

        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){window.dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-6NR7FKV3Y1');
          `}
        </Script>
      </body>
    </html>
  );
}
