import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import Stripe from 'stripe'

// Coupon IDs - Expire Jan 10, 2026
const COUPONS = {
  lifetime: 'iovmDFB9', // Early Hunter Lifetime - $20.99 off → $29
  monthly: '', // Désactivé
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { nicheId, mode = 'lifetime' } = body

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

    // Sélectionner le bon Price ID selon le mode
    const priceId = mode === 'monthly' 
      ? process.env.STRIPE_MONTHLY_PRICE_ID 
      : process.env.STRIPE_PRICE_ID // Lifetime

    console.log('Checkout attempt:', { priceId, appUrl, nicheId, mode })

    if (!priceId) {
      console.error(`STRIPE_${mode === 'monthly' ? 'MONTHLY_' : ''}PRICE_ID is not set`)
      return NextResponse.json(
        { error: 'Stripe price not configured' },
        { status: 500 }
      )
    }

    // Config selon le mode
    const isLifetime = mode === 'lifetime'
    const couponId = isLifetime ? COUPONS.lifetime : COUPONS.monthly

    // Vérifier si le coupon est valide
    let validCoupon: string | null = null
    if (couponId) {
      try {
        const coupon = await stripe.coupons.retrieve(couponId)
        console.log('Coupon check:', { couponId, valid: coupon.valid, name: coupon.name })
        if (coupon.valid) {
          validCoupon = couponId
        }
      } catch (err) {
        console.warn('Coupon error:', err)
      }
    }
    
    console.log('Using coupon:', validCoupon)

    // Créer la session Stripe Checkout
    let session: Stripe.Checkout.Session

    if (isLifetime) {
      // Lifetime - paiement unique
      session = await stripe.checkout.sessions.create({
        mode: 'payment',
        payment_method_types: ['card'],
        line_items: [{ price: priceId, quantity: 1 }],
        metadata: { nicheId: nicheId || 'homepage', mode: 'lifetime' },
        success_url: `${appUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${appUrl}/pricing`,
        billing_address_collection: 'auto',
        customer_creation: 'always', // Crée un vrai client Stripe (pas Guest)
        tax_id_collection: { enabled: true }, // Permet aux entreprises de saisir leur numéro de TVA
        invoice_creation: { enabled: true }, // Génère une facture PDF pour les paiements uniques
        payment_intent_data: {
          description: 'Niches Hunter - Lifetime Access',
          setup_future_usage: 'off_session', // Sauvegarde la méthode de paiement sur le client
        },
        ...(validCoupon && { discounts: [{ coupon: validCoupon }] }),
      })
    } else {
      // Monthly - subscription
      session = await stripe.checkout.sessions.create({
        mode: 'subscription',
        payment_method_types: ['card'],
        line_items: [{ price: priceId, quantity: 1 }],
        metadata: { nicheId: nicheId || 'homepage', mode: 'monthly' },
        success_url: `${appUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${appUrl}/pricing`,
        billing_address_collection: 'auto',
        tax_id_collection: { enabled: true }, // Permet aux entreprises de saisir leur numéro de TVA
        subscription_data: {
          description: 'Niches Hunter - Monthly Subscription',
        },
        ...(validCoupon && { discounts: [{ coupon: validCoupon }] }),
      })
    }

    console.log('Checkout session created:', session.id, session.url)

    if (!session.url) {
      console.error('Session created but no URL returned')
      return NextResponse.json(
        { error: 'No checkout URL returned from Stripe' },
        { status: 500 }
      )
    }

    return NextResponse.json({ url: session.url })
  } catch (error: unknown) {
    const err = error as Error & { type?: string; code?: string }
    console.error('Stripe checkout error:', {
      message: err.message,
      type: err.type,
      code: err.code,
    })
    return NextResponse.json(
      { error: `Stripe error: ${err.message}` },
      { status: 500 }
    )
  }
}
