import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// Sauvegarder une niche
export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const accessToken = cookieStore.get('access_token')?.value

    if (!accessToken) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(accessToken)

    if (authError || !user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const { nicheId } = await request.json()

    if (!nicheId) {
      return NextResponse.json({ error: 'Niche ID required' }, { status: 400 })
    }

    // Vérifier si déjà sauvegardé
    const { data: existing } = await supabaseAdmin
      .from('saved_niches')
      .select('id')
      .eq('user_id', user.id)
      .eq('niche_id', nicheId)
      .single()

    if (existing) {
      return NextResponse.json({ message: 'Already saved' })
    }

    // Sauvegarder
    const { error } = await supabaseAdmin
      .from('saved_niches')
      .insert({
        user_id: user.id,
        niche_id: nicheId,
      })

    if (error) {
      console.error('Error saving niche:', error)
      return NextResponse.json({ error: 'Failed to save' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Save niche error:', error)
    return NextResponse.json({ error: 'Failed to save' }, { status: 500 })
  }
}

// Supprimer une niche sauvegardée
export async function DELETE(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const accessToken = cookieStore.get('access_token')?.value

    if (!accessToken) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(accessToken)

    if (authError || !user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const { nicheId } = await request.json()

    if (!nicheId) {
      return NextResponse.json({ error: 'Niche ID required' }, { status: 400 })
    }

    const { error } = await supabaseAdmin
      .from('saved_niches')
      .delete()
      .eq('user_id', user.id)
      .eq('niche_id', nicheId)

    if (error) {
      console.error('Error removing niche:', error)
      return NextResponse.json({ error: 'Failed to remove' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Remove niche error:', error)
    return NextResponse.json({ error: 'Failed to remove' }, { status: 500 })
  }
}

