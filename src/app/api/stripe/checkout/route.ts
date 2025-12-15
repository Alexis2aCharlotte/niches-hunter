import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { nicheId } = body

    const priceId = process.env.STRIPE_PRICE_ID
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

    console.log('Checkout attempt:', { priceId, appUrl, nicheId })

    if (!priceId) {
      console.error('STRIPE_PRICE_ID is not set')
      return NextResponse.json(
        { error: 'Stripe price not configured' },
        { status: 500 }
      )
    }

    // Créer la session Stripe Checkout
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      // Metadata pour tracker la niche qui a déclenché l'achat
      metadata: {
        nicheId: nicheId || 'homepage',
      },
      // Redirection après paiement
      success_url: `${appUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/niches${nicheId ? `/${nicheId}` : ''}`,
      // Options pour une meilleure UX
      allow_promotion_codes: true,
      billing_address_collection: 'auto',
    })

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

