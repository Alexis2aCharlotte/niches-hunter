import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'

// Client Supabase côté serveur
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// Niches gratuites accessibles sans abonnement
const FREE_NICHES = ["0030", "0024", "0110"]

// Masquer les données sensibles d'une niche verrouillée
// MAIS garder le titre visible pour donner envie
function maskLockedNiche(niche: any) {
  return {
    id: niche.id,
    display_code: niche.display_code,
    category: niche.category,
    score: niche.score,
    title: niche.title, // Titre VISIBLE pour attirer
    tags: niche.tags?.slice(0, 3) || [],
    // Stats basiques visibles
    stats: {
      competition: niche.stats?.competition || "Medium",
      revenue: "💎 Pro",
      difficulty: niche.stats?.difficulty || "",
      timeToMVP: "",
      potential: "",
      market: "",
    },
    // Reste masqué
    opportunity: "Upgrade to Pro to unlock this niche opportunity...",
    gap: "",
    move: "",
    market_analysis: null,
    key_learnings: [],
    improvements: [],
    marketing_strategies: [],
    monetization: null,
    tech_stack: [],
    risks: [],
    trending: [],
    published_at: niche.published_at,
    locked: true,
    has_premium: niche.has_premium,
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params
    
    // Récupérer la niche depuis Supabase
    const { data: niche, error } = await supabaseAdmin
      .from('niches')
      .select('*')
      .eq('display_code', code)
      .single()

    if (error || !niche) {
      return NextResponse.json(
        { error: 'Niche not found' },
        { status: 404 }
      )
    }

    // Vérifier si c'est une niche gratuite
    if (FREE_NICHES.includes(niche.display_code)) {
      return NextResponse.json({ niche, isLocked: false })
    }

    // Vérifier l'abonnement via access_token (cohérent avec /api/auth/me)
    const cookieStore = await cookies()
    const accessToken = cookieStore.get('access_token')?.value
    
    let hasActiveSubscription = false

    if (accessToken) {
      // Récupérer l'utilisateur depuis le token
      const { data: { user } } = await supabaseAdmin.auth.getUser(accessToken)
      
      if (user) {
        // Vérifier l'abonnement via user_id
        const { data: customer } = await supabaseAdmin
          .from('customers')
          .select('status')
          .eq('user_id', user.id)
          .single()

        hasActiveSubscription = customer?.status === 'active'
        
        // Fallback: vérifier aussi par email si pas trouvé par user_id
        if (!customer && user.email) {
          const { data: customerByEmail } = await supabaseAdmin
            .from('customers')
            .select('status')
            .eq('email', user.email)
            .single()
          
          hasActiveSubscription = customerByEmail?.status === 'active'
        }
      }
    }
    
    // Fallback: vérifier aussi via stripe_customer_id cookie (ancien système)
    if (!hasActiveSubscription) {
      const customerId = cookieStore.get('stripe_customer_id')?.value
      if (customerId) {
        const { data: customer } = await supabaseAdmin
          .from('customers')
          .select('status')
          .eq('stripe_customer_id', customerId)
          .single()

        hasActiveSubscription = customer?.status === 'active'
      }
    }

    // Si pas d'abonnement, masquer les données
    if (!hasActiveSubscription) {
      return NextResponse.json({ 
        niche: maskLockedNiche(niche), 
        isLocked: true 
      })
    }

    // Abonnement actif : retourner toutes les données
    return NextResponse.json({ niche, isLocked: false })

  } catch (error) {
    console.error('Error fetching niche:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

