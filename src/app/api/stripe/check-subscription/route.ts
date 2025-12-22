import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
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

    let hasActiveSubscription = false

    // 1. Vérifier les subscriptions Stripe (pour abonnements mensuels)
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: 'active',
      limit: 1,
    })

    if (subscriptions.data.length > 0) {
      hasActiveSubscription = true
    } else {
      // 2. Vérifier les paiements one-time (pour achats lifetime)
      const payments = await stripe.paymentIntents.list({
        customer: customerId,
        limit: 10,
      })
      
      hasActiveSubscription = payments.data.some(
        payment => payment.status === 'succeeded'
      )
    }

    // 3. Fallback: vérifier dans notre DB
    if (!hasActiveSubscription) {
      const { data: dbSubscription } = await supabaseAdmin
        .from('subscriptions')
        .select('status')
        .eq('stripe_customer_id', customerId)
        .eq('status', 'active')
        .single()
      
      if (dbSubscription) {
        hasActiveSubscription = true
      }
    }

    console.log('Has active subscription:', hasActiveSubscription)

    return NextResponse.json({ hasActiveSubscription })
  } catch (error) {
    console.error('Error checking subscription:', error)
    return NextResponse.json({ hasActiveSubscription: false })
  }
}

