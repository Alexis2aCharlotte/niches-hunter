import { Metadata } from "next"

// Metadata template pour les pages de niche individuelles
// Le titre sera remplacé par le template du parent: "Niche #XXX | NICHES HUNTER"
export const metadata: Metadata = {
  title: "Niche Analysis - Full Market Research & Strategy",
  description: "Complete niche analysis with market research, competitor breakdown, revenue estimates, marketing strategies, and tech stack recommendations.",
  keywords: [
    "app niche analysis",
    "ios app market research",
    "app competitor analysis",
    "app monetization strategy",
    "mobile app market gap",
  ],
  openGraph: {
    title: "Niche Analysis | NICHES HUNTER",
    description: "Complete niche analysis with market research, competitor breakdown, and monetization strategies.",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "Niche Analysis | NICHES HUNTER",
    description: "Complete niche analysis with market research, competitor breakdown, and monetization strategies.",
  },
}

export default function NicheDetailLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
