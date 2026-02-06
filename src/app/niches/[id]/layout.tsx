import { Metadata } from "next"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params

  const { data: niche } = await supabase
    .from("niches")
    .select("title, category, score, opportunity, stats, tags, display_code")
    .eq("display_code", id)
    .single()

  if (!niche) {
    return {
      title: "Niche Analysis",
      description: "Complete niche analysis with market research and strategy.",
    }
  }

  const competition = niche.stats?.competition || ""
  const revenue = niche.stats?.revenue || ""
  const title = `${niche.title} — iOS App Niche Analysis`
  const description = `Score ${niche.score}/100. ${competition} competition, ${revenue} revenue potential. Full market analysis, competitor breakdown, and strategy for this ${niche.category} niche.`

  return {
    title,
    description,
    keywords: [
      niche.title.toLowerCase(),
      `${niche.category} app ideas`,
      "ios app niche analysis",
      "profitable app ideas",
      "app market research",
      ...(niche.tags || []).map((t: string) => t.toLowerCase()),
    ],
    openGraph: {
      title: `${niche.title} | NICHES HUNTER`,
      description,
      type: "article",
      url: `https://nicheshunter.app/niches/${niche.display_code}`,
    },
    twitter: {
      card: "summary_large_image",
      title: `${niche.title} | NICHES HUNTER`,
      description,
    },
    alternates: {
      canonical: `https://nicheshunter.app/niches/${niche.display_code}`,
    },
  }
}

export default function NicheDetailLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
