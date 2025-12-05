import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

export const metadata: Metadata = {
  title: "NICHES HUNTER | Hunt Profitable iOS Niches",
  description:
    "Free weekly intel on untapped iOS App Store opportunities. Discover profitable niches before the competition.",
  keywords: [
    "iOS niche",
    "app store",
    "app development",
    "market analysis",
    "newsletter",
    "indie developer",
  ],
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
      </body>
    </html>
  );
}
