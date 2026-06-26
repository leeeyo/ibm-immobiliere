import type { Metadata, Viewport } from "next";
import { Suspense } from "react";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import AnalyticsInteractionTracker from "@/components/AnalyticsInteractionTracker";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import MetaPixelBootstrap from "@/components/MetaPixelBootstrap";
import ThirdPartyAnalytics from "@/components/ThirdPartyAnalytics";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import CookieConsent from "@/components/CookieConsent";
import SiteJsonLd from "@/components/SiteJsonLd";
import { SITE } from "@/lib/constants/site";

const googleSiteVerification = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION;

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} — Promoteur immobilier en Tunisie`,
    template: `%s · ${SITE.name}`,
  },
  description: SITE.description,
  keywords: [
    "promoteur immobilier",
    "immobilier Tunisie",
    "appartements Ariana",
    "appartements Tunis",
    "vente appartement Tunisie",
    "résidences neuves",
    "IBM Immobilière",
    "Immobilière Ben Mokhtar",
  ],
  authors: [{ name: SITE.legalName }],
  creator: SITE.legalName,
  publisher: SITE.legalName,
  category: "Immobilier",
  formatDetection: { telephone: false, address: false, email: false },
  openGraph: {
    type: "website",
    locale: "fr_TN",
    url: SITE.url,
    siteName: SITE.name,
    title: `${SITE.name} — ${SITE.tagline}`,
    description: SITE.description,
    images: [
      {
        url: "/hero/hero-tower.jpg",
        width: 1600,
        height: 1000,
        alt: `${SITE.name}, promoteur immobilier en Tunisie`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE.name,
    description: SITE.description,
    images: ["/hero/hero-tower.jpg"],
  },
  robots: { index: true, follow: true },
  icons: { icon: "/favicon.ico", apple: "/IBM_logo_black_transparent.png" },
  ...(googleSiteVerification
    ? { verification: { google: googleSiteVerification } }
    : {}),
};

export const viewport: Viewport = {
  themeColor: "#0b1733",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={`${inter.variable} ${playfair.variable}`}>
      <body className="bg-white text-[var(--color-foreground)] antialiased" suppressHydrationWarning>
        <SiteJsonLd />
        {children}
        <WhatsAppFloat />
        <CookieConsent />
        <MetaPixelBootstrap />
        <Suspense fallback={null}>
          <GoogleAnalytics />
          <ThirdPartyAnalytics />
        </Suspense>
        <AnalyticsInteractionTracker />
      </body>
    </html>
  );
}
