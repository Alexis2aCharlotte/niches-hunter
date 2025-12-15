import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createClient } from '@supabase/supabase-js'

// Client Supabase Admin
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function GET(request: NextRequest) {
  const sessionId = request.nextUrl.searchParams.get('session_id')

  if (!sessionId) {
    return NextResponse.json(
      { error: 'Missing session_id' },
      { status: 400 }
    )
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId)
    const customerId = session.customer as string
    const subscriptionId = session.subscription as string

    // Récupérer les détails de la subscription si elle existe
    if (subscriptionId) {
      const subscriptionDetails = await stripe.subscriptions.retrieve(subscriptionId) as unknown as {
        current_period_start: number
        current_period_end: number
      }
      
      const periodStart = new Date(subscriptionDetails.current_period_start * 1000).toISOString()
      const periodEnd = new Date(subscriptionDetails.current_period_end * 1000).toISOString()
      
      // Sauvegarder/mettre à jour dans la DB
      const { data: existingSub } = await supabaseAdmin
        .from('subscriptions')
        .select('id')
        .eq('stripe_customer_id', customerId)
        .single()

      if (existingSub) {
        // Mettre à jour l'entrée existante
        await supabaseAdmin
          .from('subscriptions')
          .update({
            stripe_subscription_id: subscriptionId,
            current_period_start: periodStart,
            current_period_end: periodEnd,
          })
          .eq('stripe_customer_id', customerId)
      } else {
        // Créer une nouvelle entrée
        await supabaseAdmin
          .from('subscriptions')
          .insert({
            stripe_customer_id: customerId,
            stripe_subscription_id: subscriptionId,
            status: 'active',
            current_period_start: periodStart,
            current_period_end: periodEnd,
          })
      }
    }

    // Créer la réponse avec le cookie pour tracker l'abonnement
    const response = NextResponse.json({
      email: session.customer_details?.email || null,
      customerName: session.customer_details?.name || null,
      customerId: customerId,
      subscriptionId: subscriptionId,
    })

    // Stocker le customer ID dans un cookie (expire dans 1 an)
    if (customerId) {
      response.cookies.set('stripe_customer_id', customerId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 365, // 1 an
        path: '/',
      })
    }

    return response
  } catch (error) {
    console.error('Error retrieving session:', error)
    return NextResponse.json(
      { error: 'Failed to retrieve session' },
      { status: 500 }
    )
  }
}

