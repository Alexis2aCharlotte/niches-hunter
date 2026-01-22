import { Metadata } from "next"

export const metadata: Metadata = {
  title: "99+ Profitable iOS App Niches | Find Your Next App Idea",
  description: "Browse 99+ validated iOS app niches with revenue estimates, competition analysis, and market gaps. Find profitable app ideas before the competition.",
  keywords: [
    "profitable app ideas",
    "ios app niche ideas",
    "mobile app ideas that make money",
    "app store niche research",
    "find profitable app niches",
    "ios app market analysis",
    "app ideas 2026",
    "indie app ideas",
  ],
  openGraph: {
    title: "99+ Profitable iOS App Niches | NICHES HUNTER",
    description: "Browse 99+ validated iOS app niches with revenue estimates, competition analysis, and market gaps.",
    type: "website",
    url: "https://nicheshunter.app/niches",
  },
  twitter: {
    card: "summary_large_image",
    title: "99+ Profitable iOS App Niches | NICHES HUNTER",
    description: "Browse 99+ validated iOS app niches with revenue estimates, competition analysis, and market gaps.",
  },
  alternates: {
    canonical: "https://nicheshunter.app/niches",
  },
}

export default function NichesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
