import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Niche Roulette - Random App Idea Generator | NICHES HUNTER",
  description: "Can't decide what to build? Spin the wheel and discover a random profitable iOS app niche. Get instant inspiration with validated ideas.",
  keywords: [
    "random app idea generator",
    "app idea generator",
    "startup idea generator",
    "what app should i build",
    "random niche idea",
    "app inspiration",
    "ios app idea wheel",
  ],
  openGraph: {
    title: "Niche Roulette - Random App Idea Generator | NICHES HUNTER",
    description: "Spin the wheel and discover a random profitable iOS app niche. Get instant inspiration.",
    type: "website",
    url: "https://nicheshunter.app/niche-roulette",
  },
  twitter: {
    card: "summary_large_image",
    title: "Niche Roulette - Random App Idea Generator | NICHES HUNTER",
    description: "Spin the wheel and discover a random profitable iOS app niche. Get instant inspiration.",
  },
  alternates: {
    canonical: "https://nicheshunter.app/niche-roulette",
  },
}

export default function NicheRouletteLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
