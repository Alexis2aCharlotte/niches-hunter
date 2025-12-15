import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  try {
    // Récupérer le customer ID depuis le cookie (set après paiement)
    const cookieStore = await cookies()
    const customerId = cookieStore.get('stripe_customer_id')?.value

    if (!customerId) {
      return NextResponse.json({ hasActiveSubscription: false })
    }

    // Vérifier les abonnements actifs pour ce customer
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: 'active',
      limit: 1,
    })

    const hasActiveSubscription = subscriptions.data.length > 0

    return NextResponse.json({ hasActiveSubscription })
  } catch (error) {
    console.error('Error checking subscription:', error)
    return NextResponse.json({ hasActiveSubscription: false })
  }
}

