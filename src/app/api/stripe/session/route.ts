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
    console.log('Retrieving Stripe session:', sessionId)
    const session = await stripe.checkout.sessions.retrieve(sessionId)
    const customerId = session.customer as string
    const customerEmail = session.customer_details?.email
    const subscriptionId = session.subscription as string | null
    const paymentIntentId = session.payment_intent as string | null
    const isLifetime = session.mode === 'payment'

    console.log('Session retrieved:', { customerId, customerEmail, subscriptionId, isLifetime })

    if (!customerEmail || !customerId) {
      console.error('No email or customer ID in session')
      return NextResponse.json(
        { error: 'No email or customer ID in session' },
        { status: 400 }
      )
    }

    // Récupérer les détails de la subscription si elle existe
    let periodStart = new Date().toISOString()
    let periodEnd: string | null = null

    if (subscriptionId) {
      const subResponse = await stripe.subscriptions.retrieve(subscriptionId)
      const periodStartTs = (subResponse as unknown as Record<string, unknown>).current_period_start as number | undefined
      const periodEndTs = (subResponse as unknown as Record<string, unknown>).current_period_end as number | undefined
      
      if (periodStartTs) periodStart = new Date(periodStartTs * 1000).toISOString()
      if (periodEndTs) periodEnd = new Date(periodEndTs * 1000).toISOString()
    }

    // Upsert dans la table customers
    const customerData = {
      email: customerEmail,
      stripe_customer_id: customerId,
      stripe_subscription_id: subscriptionId || (isLifetime ? `lifetime_${paymentIntentId}` : null),
      plan_type: isLifetime ? 'lifetime' : 'monthly',
      status: 'active',
      current_period_start: periodStart,
      current_period_end: isLifetime ? null : periodEnd,
    }

    console.log('Upserting customer:', customerData)

    // Le trigger PostgreSQL synchronise automatiquement vers paid_newsletter_subscribers
    const { error: upsertError } = await supabaseAdmin
      .from('customers')
      .upsert(customerData, { onConflict: 'email' })

    if (upsertError) {
      console.error('Error upserting customer:', upsertError)
    } else {
      console.log('Customer upserted successfully (trigger syncs to paid_newsletter)')
    }

    // Créer la réponse avec le cookie pour tracker l'abonnement
    const response = NextResponse.json({
      email: customerEmail,
      customerName: session.customer_details?.name || null,
      customerId: customerId,
      subscriptionId: subscriptionId,
    })

    // Stocker le customer ID dans un cookie (expire dans 1 an)
    response.cookies.set('stripe_customer_id', customerId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 365, // 1 an
      path: '/',
    })

    return response
  } catch (error) {
    console.error('Error retrieving session:', error)
    return NextResponse.json(
      { error: 'Failed to retrieve session' },
      { status: 500 }
    )
  }
}

