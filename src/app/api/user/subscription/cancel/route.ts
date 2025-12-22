import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST() {
  try {
    const cookieStore = await cookies()
    const customerId = cookieStore.get('stripe_customer_id')?.value

    if (!customerId) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

    // Récupérer le customer depuis la DB
    const { data: customer } = await supabaseAdmin
      .from('customers')
      .select('stripe_subscription_id, plan_type')
      .eq('stripe_customer_id', customerId)
      .single()

    if (!customer?.stripe_subscription_id) {
      return NextResponse.json(
        { error: 'No active subscription found' },
        { status: 404 }
      )
    }

    // Les lifetime ne peuvent pas être annulés
    if (customer.plan_type === 'lifetime') {
      return NextResponse.json(
        { error: 'Lifetime subscriptions cannot be canceled' },
        { status: 400 }
      )
    }

    // Annuler sur Stripe (à la fin de la période)
    const canceledSubscription = await stripe.subscriptions.update(
      customer.stripe_subscription_id,
      { cancel_at_period_end: true }
    ) as unknown as { current_period_end: number }

    // Mettre à jour la DB
    await supabaseAdmin
      .from('customers')
      .update({
        cancel_at_period_end: true,
        status: 'active', // Reste active jusqu'à la fin de la période
      })
      .eq('stripe_subscription_id', customer.stripe_subscription_id)

    return NextResponse.json({
      success: true,
      cancelAt: new Date(canceledSubscription.current_period_end * 1000).toISOString(),
    })
  } catch (error) {
    console.error('Error canceling subscription:', error)
    return NextResponse.json(
      { error: 'Failed to cancel subscription' },
      { status: 500 }
    )
  }
}

