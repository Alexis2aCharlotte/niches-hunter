import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { stripe } from '@/lib/stripe'
import { cookies } from 'next/headers'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

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

    // Récupérer le customer
    const { data: customer } = await supabaseAdmin
      .from('customers')
      .select('*')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .single()

    if (!customer || !customer.stripe_subscription_id) {
      return NextResponse.json({ error: 'No active subscription found' }, { status: 404 })
    }

    // Les lifetime ne peuvent pas être annulés
    if (customer.plan_type === 'lifetime') {
      return NextResponse.json({ error: 'Lifetime subscriptions cannot be canceled' }, { status: 400 })
    }

    // Annuler sur Stripe (à la fin de la période)
    await stripe.subscriptions.update(customer.stripe_subscription_id, {
      cancel_at_period_end: true,
    })

    // Mettre à jour dans la DB
    await supabaseAdmin
      .from('customers')
      .update({ cancel_at_period_end: true })
      .eq('id', customer.id)

    return NextResponse.json({
      success: true,
      message: 'Subscription will be canceled at the end of the billing period',
      cancelAt: customer.current_period_end,
    })
  } catch (error) {
    console.error('Cancel subscription error:', error)
    return NextResponse.json({ error: 'Failed to cancel subscription' }, { status: 500 })
  }
}

