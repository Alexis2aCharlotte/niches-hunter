import type { Metadata } from "next";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import Navbar from "@/components/Navbar";
import "./globals.css";

const GA_MEASUREMENT_ID = "G-MV228L76KT";
const REDDIT_PIXEL_ID = "a2_idm7qyipkyo1";
const X_PIXEL_ID = "r2hs9";

export const metadata: Metadata = {
  metadataBase: new URL("https://nicheshunter.app"),
  title: {
    default: "NICHES HUNTER | Find Profitable iOS App Ideas Before Anyone Else",
    template: "%s | NICHES HUNTER",
  },
  description:
    "Discover profitable iOS app niches before the competition. We track 40,000+ apps daily to find untapped opportunities. Validate ideas with AI, estimate revenue, and find your next winning app.",
  keywords: [
    "profitable app ideas",
    "ios app ideas that make money",
    "mobile app niche ideas",
    "find profitable app ideas",
    "app store niche research",
    "validate app ideas",
    "ios app market analysis",
    "indie hacker app ideas",
    "app revenue estimator",
    "niche validation tool",
    "app ideas 2026",
    "solo developer app ideas",
    "ios app opportunities",
    "app store trends",
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
        url: "https://nicheshunter.app/og-image.png?v=4",
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
    images: ["https://nicheshunter.app/og-image.png?v=4"],
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

// JSON-LD Schema for the entire site
const jsonLdWebsite = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "NICHES HUNTER",
  url: "https://nicheshunter.app",
  description: "Find profitable iOS app niches before the competition. Validate ideas with AI, estimate revenue, and discover untapped opportunities.",
  potentialAction: {
    "@type": "SearchAction",
    target: "https://nicheshunter.app/niches?search={search_term_string}",
    "query-input": "required name=search_term_string",
  },
};

const jsonLdOrganization = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "NICHES HUNTER",
  url: "https://nicheshunter.app",
  logo: "https://nicheshunter.app/og-image.png",
  sameAs: [
    "https://x.com/nicheshunter",
  ],
  description: "We track 40,000+ iOS apps daily to find profitable niche opportunities for indie developers.",
};

const jsonLdSoftwareApplication = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "NICHES HUNTER",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  offers: {
    "@type": "Offer",
    price: "29",
    priceCurrency: "USD",
    availability: "https://schema.org/InStock",
    priceValidUntil: "2026-12-31",
  },
  description: "Find profitable iOS app niches with AI-powered validation, revenue estimates, and competitor analysis.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Google Analytics */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}');
          `}
        </Script>

        {/* Reddit Pixel */}
        <Script id="reddit-pixel" strategy="afterInteractive">
          {`
            !function(w,d){if(!w.rdt){var p=w.rdt=function(){p.sendEvent?p.sendEvent.apply(p,arguments):p.callQueue.push(arguments)};p.callQueue=[];var t=d.createElement("script");t.src="https://www.redditstatic.com/ads/pixel.js",t.async=!0;var s=d.getElementsByTagName("script")[0];s.parentNode.insertBefore(t,s)}}(window,document);
            rdt('init','${REDDIT_PIXEL_ID}');
            rdt('track', 'PageVisit');
          `}
        </Script>

        {/* X (Twitter) Pixel */}
        <Script id="x-pixel" strategy="afterInteractive">
          {`
            !function(e,t,n,s,u,a){e.twq||(s=e.twq=function(){s.exe?s.exe.apply(s,arguments):s.queue.push(arguments);
            },s.version='1.1',s.queue=[],u=t.createElement(n),u.async=!0,u.src='https://static.ads-twitter.com/uwt.js',
            a=t.getElementsByTagName(n)[0],a.parentNode.insertBefore(u,a))}(window,document,'script');
            twq('config','${X_PIXEL_ID}');
            twq('track','PageView');
          `}
        </Script>
        
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdWebsite) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdOrganization) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdSoftwareApplication) }}
        />
      </head>
      <body className="antialiased">
        <Navbar />
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
