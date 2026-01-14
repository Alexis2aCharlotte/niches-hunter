import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Client Supabase côté serveur (clé secrète)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// Transformer une niche pour la roulette (titre visible, détails masqués)
function transformForRoulette(niche: any) {
  return {
    id: niche.id,
    displayCode: niche.display_code, // camelCase pour le frontend
    title: niche.title, // Titre VISIBLE pour attirer
    category: niche.category,
    score: niche.score,
    tags: niche.tags?.slice(0, 4) || [],
    // Stats basiques visibles
    stats: {
      competition: niche.stats?.competition || "—",
      revenue: niche.stats?.revenue || "—",
      difficulty: niche.stats?.difficulty || "—",
      timeToMVP: niche.stats?.timeToMVP || "—",
    },
    // Détails masqués (juste un teaser tronqué)
    opportunity: niche.opportunity?.substring(0, 80) + "..." || "",
    gap: niche.gap?.substring(0, 80) + "..." || "",
  }
}

export async function GET() {
  try {
    // Récupérer toutes les niches publiées depuis Supabase
    const { data: niches, error } = await supabaseAdmin
      .from('niches')
      .select('*')
      .not('published_at', 'is', null) // Seulement les niches publiées
      .order('published_at', { ascending: false })

    if (error) {
      console.error('Error fetching niches for roulette:', error)
      return NextResponse.json({ niches: [] }, { status: 500 })
    }

    // Transformer toutes les niches pour la roulette
    const rouletteNiches = (niches || []).map(transformForRoulette)

    return NextResponse.json({ 
      niches: rouletteNiches,
      count: rouletteNiches.length 
    })

  } catch (error) {
    console.error('API /niches/roulette error:', error)
    return NextResponse.json(
      { error: 'Internal server error', niches: [] },
      { status: 500 }
    )
  }
}
