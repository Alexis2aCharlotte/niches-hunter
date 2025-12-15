import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function GET() {
  try {
    const cookieStore = await cookies()
    const accessToken = cookieStore.get('access_token')?.value

    if (!accessToken) {
      return NextResponse.json({ niches: [] })
    }

    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(accessToken)

    if (authError || !user) {
      return NextResponse.json({ niches: [] })
    }

    // Récupérer les niches sauvegardées avec leurs détails
    const { data: savedNiches } = await supabaseAdmin
      .from('saved_niches')
      .select('niche_id')
      .eq('user_id', user.id)

    if (!savedNiches || savedNiches.length === 0) {
      return NextResponse.json({ niches: [] })
    }

    const nicheIds = savedNiches.map(s => s.niche_id)

    // Récupérer les détails des niches
    const { data: niches } = await supabaseAdmin
      .from('niches')
      .select('id, display_code, title, category, score')
      .in('id', nicheIds)

    const formattedNiches = niches?.map(n => ({
      id: n.id,
      displayCode: n.display_code,
      title: n.title,
      category: n.category,
      score: n.score,
    })) || []

    return NextResponse.json({ niches: formattedNiches })
  } catch (error) {
    console.error('Error fetching saved niches:', error)
    return NextResponse.json({ niches: [] })
  }
}

