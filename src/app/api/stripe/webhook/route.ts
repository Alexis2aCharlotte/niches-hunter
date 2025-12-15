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
        const customerId = session.customer as string
        const subscriptionId = session.subscription as string

        console.log('Checkout completed:', { customerEmail, customerId, subscriptionId })

        // Récupérer les détails de la subscription depuis Stripe
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

        // Sauvegarder dans la table subscriptions
        const { error: subError } = await supabaseAdmin
          .from('subscriptions')
          .insert({
            stripe_customer_id: customerId,
            stripe_subscription_id: subscriptionId,
            status: 'active',
            current_period_start: periodStart,
            current_period_end: periodEnd,
          })

        if (subError) {
          console.error('Error saving subscription:', subError)
        } else {
          console.log('Subscription saved successfully')
        }

        // Ajouter dans subscribers si l'email existe
        if (customerEmail) {
          const { data: existingSubscriber } = await supabaseAdmin
            .from('subscribers')
            .select('id')
            .eq('email', customerEmail)
            .single()

          if (!existingSubscriber) {
            const { error: subscriberError } = await supabaseAdmin
              .from('subscribers')
              .insert({
                email: customerEmail,
                source: 'stripe_checkout',
                is_active: true,
              })
            
            if (subscriberError) {
              console.error('Error saving subscriber:', subscriberError)
            } else {
              console.log('Subscriber saved successfully')
            }
          }
        }
        break
      }

      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object as unknown as {
          id: string
          status: string
          current_period_start: number
          current_period_end: number
          cancel_at_period_end: boolean
        }
        
        console.log('Subscription updated:', subscription.id, subscription.status)

        const { error } = await supabaseAdmin
          .from('subscriptions')
          .update({
            status: subscription.status as 'active' | 'canceled' | 'past_due' | 'trialing',
            current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
            current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
            cancel_at_period_end: subscription.cancel_at_period_end,
          })
          .eq('stripe_subscription_id', subscription.id)

        if (error) {
          console.error('Error updating subscription:', error)
        }
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as unknown as { id: string }
        
        console.log('Subscription deleted:', subscription.id)

        await supabaseAdmin
          .from('subscriptions')
          .update({
            status: 'canceled',
            canceled_at: new Date().toISOString(),
          })
          .eq('stripe_subscription_id', subscription.id)
        break
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as unknown as { subscription: string | null }
        const subscriptionId = invoice.subscription

        console.log('Payment failed for subscription:', subscriptionId)

        if (subscriptionId) {
          await supabaseAdmin
            .from('subscriptions')
            .update({ status: 'past_due' })
            .eq('stripe_subscription_id', subscriptionId)
        }
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

