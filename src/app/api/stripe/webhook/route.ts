import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createClient } from '@supabase/supabase-js'
import Stripe from 'stripe'

// Client Supabase Admin pour bypasser RLS
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')

  if (!signature || !process.env.STRIPE_WEBHOOK_SECRET) {
    console.error('Missing signature or webhook secret')
    return NextResponse.json(
      { error: 'Missing signature or webhook secret' },
      { status: 400 }
    )
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    )
  } catch (error) {
    console.error('Webhook signature verification failed:', error)
    return NextResponse.json(
      { error: 'Invalid signature' },
      { status: 400 }
    )
  }

  console.log('Webhook received:', event.type)

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        
        // Récupérer les infos du client
        const customerEmail = session.customer_details?.email
        const customerId = session.customer as string | null
        const subscriptionId = session.subscription as string | null
        const paymentIntentId = session.payment_intent as string | null
        const mode = session.mode // 'payment' pour lifetime, 'subscription' pour monthly
        const isLifetime = mode === 'payment'

        console.log('Checkout completed:', { 
          customerEmail, 
          customerId, 
          subscriptionId, 
          paymentIntentId,
          mode,
          isLifetime 
        })

        // Vérifier qu'on a un email et un customer ID
        if (!customerEmail || !customerId) {
          console.error('No email or customer ID found in session')
          break
        }

        // Récupérer les détails de la subscription depuis Stripe (si subscription)
        let periodStart = new Date().toISOString()
        let periodEnd: string | null = null
        
        if (subscriptionId) {
          const subResponse = await stripe.subscriptions.retrieve(subscriptionId)
          const periodStartTs = (subResponse as unknown as Record<string, unknown>).current_period_start as number | undefined
          const periodEndTs = (subResponse as unknown as Record<string, unknown>).current_period_end as number | undefined
          
          if (periodStartTs) periodStart = new Date(periodStartTs * 1000).toISOString()
          if (periodEndTs) periodEnd = new Date(periodEndTs * 1000).toISOString()
          
          console.log('Subscription periods:', { periodStartTs, periodEndTs, periodStart, periodEnd })
        }

        // Créer/mettre à jour dans la table customers
        const customerData = {
          email: customerEmail,
          stripe_customer_id: customerId,
          stripe_subscription_id: subscriptionId || (isLifetime ? `lifetime_${paymentIntentId}` : null),
          plan_type: isLifetime ? 'lifetime' : 'monthly',
          status: 'active',
          current_period_start: periodStart,
          current_period_end: isLifetime ? null : periodEnd,
        }

        console.log('Upserting customer data:', customerData)

        // Upsert par email (clé unique)
        // Le trigger PostgreSQL synchronise automatiquement vers paid_newsletter_subscribers
        const { error: customerError } = await supabaseAdmin
          .from('customers')
          .upsert(customerData, { onConflict: 'email' })

        if (customerError) {
          console.error('Error saving customer:', customerError)
        } else {
          console.log('Customer saved successfully (trigger syncs to paid_newsletter)')
        }
        break
      }

      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object as unknown as {
          id: string
          customer: string
          status: string
          current_period_start: number
          current_period_end: number
          cancel_at_period_end: boolean
        }
        
        console.log('Subscription event:', event.type, subscription.id, subscription.status, subscription.customer)

        // Mettre à jour le customer par stripe_customer_id
        const { error } = await supabaseAdmin
          .from('customers')
          .update({
            stripe_subscription_id: subscription.id,
            status: subscription.status as 'active' | 'canceled' | 'past_due' | 'trialing',
            current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
            current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
            cancel_at_period_end: subscription.cancel_at_period_end,
          })
          .eq('stripe_customer_id', subscription.customer)

        if (error) {
          console.error('Error updating customer subscription:', error)
        } else {
          console.log('Customer subscription updated')
        }
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as unknown as { id: string; customer: string }
        
        console.log('Subscription deleted:', subscription.id)

        await supabaseAdmin
          .from('customers')
          .update({
            status: 'canceled',
            canceled_at: new Date().toISOString(),
          })
          .eq('stripe_customer_id', subscription.customer)
        break
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as unknown as { customer: string; subscription: string | null }

        console.log('Payment failed for customer:', invoice.customer)

        await supabaseAdmin
          .from('customers')
          .update({ status: 'past_due' })
          .eq('stripe_customer_id', invoice.customer)
        break
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook handler error:', error)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    )
  }
}

// Désactiver le body parsing pour les webhooks Stripe
export const config = {
  api: {
    bodyParser: false,
  },
}

