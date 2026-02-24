import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const accessToken = request.cookies.get('access_token')?.value
    if (!accessToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: { user } } = await supabaseAdmin.auth.getUser(accessToken)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const amountCents = parseInt(String(body.amount_cents || '0'))

    if (!amountCents || amountCents < 1000) {
      return NextResponse.json({ error: 'Minimum top-up is $10' }, { status: 400 })
    }

    const { data: topup, error: topupError } = await supabaseAdmin
      .from('api_topups')
      .insert({
        user_id: user.id,
        amount_cents: amountCents,
        status: 'pending',
      })
      .select('id')
      .single()

    if (topupError || !topup) {
      return NextResponse.json({ error: 'Failed to create top-up' }, { status: 500 })
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            unit_amount: amountCents,
            product_data: {
              name: 'Niches Hunter - API Top Up',
              description: `$${(amountCents / 100).toFixed(0)} in API credits`,
            },
          },
          quantity: 1,
        },
      ],
      metadata: {
        type: 'api_topup',
        topup_id: topup.id,
        user_id: user.id,
        amount_cents: String(amountCents),
        customer_email: user.email || '',
      },
      payment_intent_data: {
        description: 'Niches Hunter - API Top Up',
      },
      success_url: `${appUrl}/developer?topup=success`,
      cancel_url: `${appUrl}/developer?topup=cancelled`,
      customer_email: user.email,
    })

    await supabaseAdmin
      .from('api_topups')
      .update({ stripe_session_id: session.id })
      .eq('id', topup.id)

    return NextResponse.json({ url: session.url })
  } catch (error: unknown) {
    const err = error as Error
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
