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

    // Récupérer le customer depuis la nouvelle table
    const { data: customer } = await supabaseAdmin
      .from('customers')
      .select('*')
      .eq('stripe_customer_id', customerId)
      .single()

    if (!customer) {
      return NextResponse.json({ user: null, subscription: null })
    }

    return NextResponse.json({
      user: {
        id: customer.user_id,
        email: customer.email,
        stripeCustomerId: customer.stripe_customer_id,
      },
      subscription: {
        id: customer.id,
        status: customer.status,
        planType: customer.plan_type,
        currentPeriodStart: customer.current_period_start,
        currentPeriodEnd: customer.current_period_end,
        cancelAtPeriodEnd: customer.cancel_at_period_end,
      },
    })
  } catch (error) {
    console.error('Error fetching user:', error)
    return NextResponse.json({ user: null, subscription: null })
  }
}

