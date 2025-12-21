import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'

// Coupon IDs - Expire Jan 10, 2026
const COUPONS = {
  lifetime: 'fX7iNTxL', // Early Hunter Lifetime - $30 off
  monthly: 'dJ1e9n03', // Early Hunter Monthly - $8 off
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

    // Créer la session Stripe Checkout
    const sessionConfig: Parameters<typeof stripe.checkout.sessions.create>[0] = {
      mode: isLifetime ? 'payment' : 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      // Metadata pour tracker
      metadata: {
        nicheId: nicheId || 'homepage',
        mode: mode,
      },
      // Redirection après paiement
      success_url: `${appUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/pricing`,
      // Options pour une meilleure UX
      billing_address_collection: 'auto',
    }

    // Ajouter le coupon si valide (ne pas planter si coupon expiré)
    if (couponId) {
      try {
        // Vérifier que le coupon existe et est valide
        const coupon = await stripe.coupons.retrieve(couponId)
        if (coupon.valid) {
          sessionConfig.discounts = [{ coupon: couponId }]
        }
      } catch (couponError) {
        console.warn('Coupon invalid or expired, proceeding without discount:', couponError)
        // Continue sans coupon
      }
    }

    const session = await stripe.checkout.sessions.create(sessionConfig)

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
