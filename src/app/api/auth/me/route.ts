import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const accessToken = cookieStore.get('access_token')?.value

    if (!accessToken) {
      return NextResponse.json({ user: null, subscription: null })
    }

    // Vérifier le token
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(accessToken)

    if (error || !user) {
      return NextResponse.json({ user: null, subscription: null })
    }

    // Récupérer le customer par user_id
    let { data: customer } = await supabaseAdmin
      .from('customers')
      .select('*')
      .eq('user_id', user.id)
      .single()

    // Fallback: chercher par email si pas trouvé par user_id
    if (!customer && user.email) {
      const { data: customerByEmail } = await supabaseAdmin
        .from('customers')
        .select('*')
        .eq('email', user.email)
        .single()
      customer = customerByEmail
    }

    // Récupérer les niches sauvegardées
    const { data: savedNiches } = await supabaseAdmin
      .from('saved_niches')
      .select('niche_id')
      .eq('user_id', user.id)

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        created_at: user.created_at,
      },
      subscription: customer ? {
        status: customer.status,
        planType: customer.plan_type,
        currentPeriodStart: customer.current_period_start,
        currentPeriodEnd: customer.current_period_end,
        cancelAtPeriodEnd: customer.cancel_at_period_end,
      } : null,
      savedNiches: savedNiches?.map(s => s.niche_id) || [],
    })
  } catch (error) {
    console.error('Get user error:', error)
    return NextResponse.json({ user: null, subscription: null })
  }
}

