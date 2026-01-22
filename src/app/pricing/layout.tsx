import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Pricing - Unlock All Niche Ideas | NICHES HUNTER",
  description: "Get lifetime access to 99+ validated iOS app niches, AI niche validator, TikTok viral trends, and competitor analysis. One-time payment, forever access.",
  keywords: [
    "niches hunter pricing",
    "app niche research tool",
    "ios app market research",
    "app idea validation tool",
    "niche finder pricing",
  ],
  openGraph: {
    title: "Pricing - Unlock All Niche Ideas | NICHES HUNTER",
    description: "Get lifetime access to 99+ validated iOS app niches, AI niche validator, and competitor analysis.",
    type: "website",
    url: "https://nicheshunter.app/pricing",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pricing - Unlock All Niche Ideas | NICHES HUNTER",
    description: "Get lifetime access to 99+ validated iOS app niches, AI niche validator, and competitor analysis.",
  },
  alternates: {
    canonical: "https://nicheshunter.app/pricing",
  },
}

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
