import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://nicheshunter.app"),
  title: {
    default: "NICHES HUNTER | Hunt Profitable iOS Niches",
    template: "%s | NICHES HUNTER",
  },
  description:
    "Free daily intel on untapped iOS App Store opportunities. Discover profitable niches before the competition. 2-3 niches analyzed daily.",
  keywords: [
    "iOS niche",
    "app store",
    "app development",
    "market analysis",
    "newsletter",
    "indie developer",
    "app store optimization",
    "iOS app ideas",
    "profitable app niches",
    "mobile app market",
  ],
  authors: [{ name: "Niches Hunter" }],
  creator: "Niches Hunter",
  publisher: "Niches Hunter",
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
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://nicheshunter.app",
    siteName: "NICHES HUNTER",
    title: "NICHES HUNTER | Hunt Profitable iOS Niches",
    description:
      "Free daily intel on untapped iOS App Store opportunities. Discover profitable niches before the competition.",
    images: [
      {
        url: "https://nicheshunter.app/og-image.png?v=2",
        width: 1200,
        height: 630,
        alt: "NICHES HUNTER - Spot Profitable iOS Niches Before Anyone Else",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "NICHES HUNTER | Hunt Profitable iOS Niches",
    description:
      "Free daily intel on untapped iOS App Store opportunities. Discover profitable niches before the competition.",
    images: ["https://nicheshunter.app/og-image.png?v=2"],
  },
  alternates: {
    canonical: "https://nicheshunter.app",
  },
  verification: {
    // Ajoute tes codes de vérification ici quand tu les auras
    // google: "ton-code-google-search-console",
    // yandex: "ton-code-yandex",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
