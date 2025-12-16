import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// Fonction helper pour récupérer le user_id
async function getUserId(): Promise<string | null> {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get('access_token')?.value

  if (!accessToken) {
    console.log('No access_token cookie found')
    return null
  }

  const { data: { user }, error } = await supabaseAdmin.auth.getUser(accessToken)
  
  if (error || !user) {
    console.error('Error getting user from token:', error)
    return null
  }

  return user.id
}

// GET - Récupérer les niches sauvegardées
export async function GET() {
  try {
    const userId = await getUserId()

    if (!userId) {
      console.log('No user found for saved niches GET')
      return NextResponse.json({ savedNiches: [] })
    }

    // Récupérer les niches sauvegardées par user_id
    const { data: savedNiches, error } = await supabaseAdmin
      .from('saved_niches')
      .select('niche_id, saved_at')
      .eq('user_id', userId)
      .order('saved_at', { ascending: false })

    if (error) {
      console.error('Error fetching saved niches:', error)
      return NextResponse.json({ savedNiches: [] })
    }

    // Récupérer les détails des niches (titre)
    if (savedNiches && savedNiches.length > 0) {
      const nicheIds = savedNiches.map(n => n.niche_id)
      
      const { data: nichesData } = await supabaseAdmin
        .from('niches')
        .select('display_code, title')
        .in('display_code', nicheIds)

      // Fusionner les données
      const enrichedNiches = savedNiches.map(saved => {
        const nicheDetail = nichesData?.find(n => n.display_code === saved.niche_id)
        return {
          ...saved,
          title: nicheDetail?.title || null
        }
      })

      console.log('Fetched saved niches for user:', userId, enrichedNiches.length, 'niches')
      return NextResponse.json({ savedNiches: enrichedNiches })
    }

    console.log('Fetched saved niches for user:', userId, '0 niches')
    return NextResponse.json({ savedNiches: [] })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ savedNiches: [] })
  }
}

// POST - Sauvegarder une niche
export async function POST(request: NextRequest) {
  try {
    const { nicheId } = await request.json()
    const userId = await getUserId()

    console.log('Saving niche:', { nicheId, userId })

    if (!userId) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

    if (!nicheId) {
      return NextResponse.json(
        { error: 'Niche ID required' },
        { status: 400 }
      )
    }

    // Vérifier si déjà sauvegardé
    const { data: existing } = await supabaseAdmin
      .from('saved_niches')
      .select('id')
      .eq('user_id', userId)
      .eq('niche_id', nicheId)
      .single()

    if (existing) {
      console.log('Niche already saved:', nicheId)
      return NextResponse.json({ success: true, message: 'Already saved' })
    }

    // Sauvegarder avec user_id
    const { error } = await supabaseAdmin
      .from('saved_niches')
      .insert({
        user_id: userId,
        niche_id: nicheId,
      })

    if (error) {
      console.error('Error saving niche:', error)
      return NextResponse.json(
        { error: 'Failed to save niche: ' + error.message },
        { status: 500 }
      )
    }

    console.log('Niche saved successfully:', nicheId, 'for user:', userId)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { error: 'Failed to save niche' },
      { status: 500 }
    )
  }
}

// DELETE - Supprimer une niche sauvegardée
export async function DELETE(request: NextRequest) {
  try {
    const { nicheId } = await request.json()
    const userId = await getUserId()

    console.log('Deleting saved niche:', { nicheId, userId })

    if (!userId) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

    // Supprimer par user_id
    const { error } = await supabaseAdmin
      .from('saved_niches')
      .delete()
      .eq('user_id', userId)
      .eq('niche_id', nicheId)

    if (error) {
      console.error('Error removing saved niche:', error)
      return NextResponse.json(
        { error: 'Failed to remove niche' },
        { status: 500 }
      )
    }

    console.log('Niche removed successfully:', nicheId)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { error: 'Failed to remove niche' },
      { status: 500 }
    )
  }
}
