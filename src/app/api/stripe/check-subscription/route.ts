import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function GET() {
  try {
    // Récupérer le customer ID depuis le cookie (set après paiement)
    const cookieStore = await cookies()
    const customerId = cookieStore.get('stripe_customer_id')?.value

    console.log('Check subscription - Cookie customerId:', customerId)

    if (!customerId) {
      console.log('No stripe_customer_id cookie found')
      return NextResponse.json({ hasActiveSubscription: false })
    }

    // Vérifier directement dans la table customers
    const { data: customer } = await supabaseAdmin
      .from('customers')
      .select('status, plan_type')
      .eq('stripe_customer_id', customerId)
      .single()

    const hasActiveSubscription = customer?.status === 'active'

    console.log('Has active subscription:', hasActiveSubscription, customer)

    return NextResponse.json({ 
      hasActiveSubscription,
      planType: customer?.plan_type || null
    })
  } catch (error) {
    console.error('Error checking subscription:', error)
    return NextResponse.json({ hasActiveSubscription: false })
  }
}

