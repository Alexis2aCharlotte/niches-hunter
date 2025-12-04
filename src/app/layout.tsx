import type { Metadata } from "next";
import { Outfit, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
});

export const metadata: Metadata = {
  title: "Niches Hunter | Find Winning iOS App Niches",
  description:
    "Free weekly newsletter revealing untapped iOS App Store opportunities. Discover profitable niches before everyone else.",
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
      <body
        className={`${outfit.variable} ${jetbrainsMono.variable} font-sans antialiased`}
      >
        <div className="noise" />
        {children}
      </body>
    </html>
  );
}
