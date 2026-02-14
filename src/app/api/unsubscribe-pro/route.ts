import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

// Client Supabase Admin pour bypasser RLS
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      )
    }

    const normalizedEmail = email.toLowerCase().trim()

    // Vérifier que l'abonné existe et est actif
    const { data: subscriber, error: fetchError } = await supabaseAdmin
      .from('paid_newsletter_subscribers')
      .select('id, email, is_active, newsletter_opted_out')
      .eq('email', normalizedEmail)
      .single()

    if (fetchError || !subscriber) {
      return NextResponse.json(
        { error: 'Email not found in our paid subscribers list.' },
        { status: 404 }
      )
    }

    if (subscriber.newsletter_opted_out) {
      return NextResponse.json(
        { success: true, message: 'You are already unsubscribed from the newsletter.' },
        { status: 200 }
      )
    }

    // Mettre à jour newsletter_opted_out = true
    const { error: updateError } = await supabaseAdmin
      .from('paid_newsletter_subscribers')
      .update({ newsletter_opted_out: true })
      .eq('email', normalizedEmail)

    if (updateError) {
      console.error('Supabase update error:', updateError)
      return NextResponse.json(
        { error: 'Failed to unsubscribe. Please try again.' },
        { status: 500 }
      )
    }

    console.log(`✅ Pro subscriber unsubscribed from newsletter: ${normalizedEmail}`)

    return NextResponse.json(
      { success: true, message: 'You have been unsubscribed from the Pro newsletter. Your subscription remains active.' },
      { status: 200 }
    )

  } catch (error) {
    console.error('Unsubscribe-pro error:', error)
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    )
  }
}
