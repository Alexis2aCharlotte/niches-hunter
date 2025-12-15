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

    // Récupérer la subscription
    const { data: subscription } = await supabaseAdmin
      .from('subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .single()

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
      subscription: subscription || null,
      savedNiches: savedNiches?.map(s => s.niche_id) || [],
    })
  } catch (error) {
    console.error('Get user error:', error)
    return NextResponse.json({ user: null, subscription: null })
  }
}

