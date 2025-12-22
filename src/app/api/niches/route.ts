import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'

// Client Supabase côté serveur (clé secrète)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// Niches gratuites accessibles sans abonnement
const FREE_NICHES = ["0030", "0024"]

// Masquer les données sensibles d'une niche verrouillée
function maskLockedNiche(niche: any) {
  return {
    id: niche.id,
    display_code: niche.display_code,
    category: niche.category,
    score: niche.score,
    // Masquer le titre et les données sensibles
    title: "🔒 Premium Niche",
    tags: niche.tags?.slice(0, 2) || [],
    opportunity: "Upgrade to Pro to unlock this niche opportunity...",
    gap: "",
    move: "",
    stats: {
      competition: niche.stats?.competition || "",
      potential: "",
      revenue: "💎 Pro",
      market: "",
      timeToMVP: "",
      difficulty: ""
    },
    market_analysis: null,
    key_learnings: [],
    improvements: [],
    marketing_strategies: [],
    monetization: null,
    tech_stack: [],
    risks: [],
    trending: [],
    locked: true,
    has_premium: niche.has_premium,
    created_at: niche.created_at,
    published_at: niche.published_at,
  }
}

export async function GET() {
  try {
    // Vérifier si l'utilisateur a un abonnement actif
    const cookieStore = await cookies()
    const customerId = cookieStore.get('stripe_customer_id')?.value

    let hasActiveSubscription = false

    if (customerId) {
      // Vérifier directement dans la table customers
      const { data: customer } = await supabaseAdmin
        .from('customers')
        .select('status')
        .eq('stripe_customer_id', customerId)
        .single()

      hasActiveSubscription = customer?.status === 'active'
    }

    // Récupérer toutes les niches depuis Supabase
    const { data: niches, error } = await supabaseAdmin
      .from('niches')
      .select('*')
      .order('published_at', { ascending: false, nullsFirst: false })

    if (error) {
      console.error('Error fetching niches:', error)
      return NextResponse.json({ niches: [], hasActiveSubscription }, { status: 500 })
    }

    // Transformer les niches : masquer celles qui sont verrouillées
    const processedNiches = (niches || []).map(niche => {
      const isFreeNiche = FREE_NICHES.includes(niche.display_code)
      
      // Si l'utilisateur est abonné OU si c'est une niche gratuite, renvoyer les données complètes
      if (hasActiveSubscription || isFreeNiche) {
        return niche
      }
      
      // Sinon, masquer les données sensibles
      return maskLockedNiche(niche)
    })

    return NextResponse.json({ 
      niches: processedNiches, 
      hasActiveSubscription 
    })

  } catch (error) {
    console.error('API /niches error:', error)
    return NextResponse.json(
      { error: 'Internal server error', niches: [], hasActiveSubscription: false },
      { status: 500 }
    )
  }
}

