import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// GET - Récupérer les niches sauvegardées
export async function GET() {
  try {
    const cookieStore = await cookies()
    const customerId = cookieStore.get('stripe_customer_id')?.value

    if (!customerId) {
      return NextResponse.json({ savedNiches: [] })
    }

    // Récupérer les niches sauvegardées par stripe_customer_id
    const { data: savedNiches, error } = await supabaseAdmin
      .from('saved_niches')
      .select('niche_id, saved_at')
      .eq('stripe_customer_id', customerId)
      .order('saved_at', { ascending: false })

    if (error) {
      console.error('Error fetching saved niches:', error)
      return NextResponse.json({ savedNiches: [] })
    }

    return NextResponse.json({ savedNiches: savedNiches || [] })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ savedNiches: [] })
  }
}

// POST - Sauvegarder une niche
export async function POST(request: NextRequest) {
  try {
    const { nicheId } = await request.json()
    const cookieStore = await cookies()
    const customerId = cookieStore.get('stripe_customer_id')?.value

    console.log('Saving niche:', { nicheId, customerId })

    if (!customerId) {
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
      .eq('stripe_customer_id', customerId)
      .eq('niche_id', nicheId)
      .single()

    if (existing) {
      return NextResponse.json({ success: true, message: 'Already saved' })
    }

    // Sauvegarder avec stripe_customer_id
    const { error } = await supabaseAdmin
      .from('saved_niches')
      .insert({
        stripe_customer_id: customerId,
        niche_id: nicheId,
      })

    if (error) {
      console.error('Error saving niche:', error)
      return NextResponse.json(
        { error: 'Failed to save niche: ' + error.message },
        { status: 500 }
      )
    }

    console.log('Niche saved successfully:', nicheId)
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
    const cookieStore = await cookies()
    const customerId = cookieStore.get('stripe_customer_id')?.value

    if (!customerId) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

    // Supprimer par stripe_customer_id
    const { error } = await supabaseAdmin
      .from('saved_niches')
      .delete()
      .eq('stripe_customer_id', customerId)
      .eq('niche_id', nicheId)

    if (error) {
      console.error('Error removing saved niche:', error)
      return NextResponse.json(
        { error: 'Failed to remove niche' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { error: 'Failed to remove niche' },
      { status: 500 }
    )
  }
}
