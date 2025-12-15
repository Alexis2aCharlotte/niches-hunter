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
    const customerId = cookieStore.get('stripe_customer_id')?.value

    if (!customerId) {
      return NextResponse.json({ user: null, subscription: null })
    }

    // Récupérer la subscription
    const { data: subscription } = await supabaseAdmin
      .from('subscriptions')
      .select('*')
      .eq('stripe_customer_id', customerId)
      .single()

    if (!subscription) {
      return NextResponse.json({ user: null, subscription: null })
    }

    // Récupérer les infos user depuis auth.users
    let userEmail = null
    if (subscription.user_id) {
      const { data: userData } = await supabaseAdmin.auth.admin.getUserById(
        subscription.user_id
      )
      userEmail = userData?.user?.email
    }

    return NextResponse.json({
      user: {
        id: subscription.user_id,
        email: userEmail,
        stripeCustomerId: subscription.stripe_customer_id,
      },
      subscription: {
        id: subscription.id,
        status: subscription.status,
        currentPeriodEnd: subscription.current_period_end,
        cancelAtPeriodEnd: subscription.cancel_at_period_end,
      },
    })
  } catch (error) {
    console.error('Error fetching user:', error)
    return NextResponse.json({ user: null, subscription: null })
  }
}

