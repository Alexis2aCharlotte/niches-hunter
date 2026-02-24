import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { generateApiKey, hashApiKey } from '@/lib/api-auth'

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

    const body = await request.json().catch(() => ({}))
    const name = body.name || 'Default'

    const { count } = await supabaseAdmin
      .from('api_keys')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('is_active', true)

    if ((count || 0) >= 5) {
      return NextResponse.json({ error: 'Maximum 5 active API keys' }, { status: 400 })
    }

    // Create wallet if not exists — $1 free credit for everyone
    const { data: existingWallet } = await supabaseAdmin
      .from('api_wallets')
      .select('id')
      .eq('user_id', user.id)
      .single()

    if (!existingWallet) {
      let initialBalance = 100 // $1 free credit for all new developer accounts

      // Monthly subscribers get $5 bonus instead
      const { data: customer } = await supabaseAdmin
        .from('customers')
        .select('plan_type, status')
        .eq('user_id', user.id)
        .single()

      if (!customer && user.email) {
        const { data: customerByEmail } = await supabaseAdmin
          .from('customers')
          .select('plan_type, status')
          .eq('email', user.email)
          .single()

        if (customerByEmail?.plan_type === 'monthly' && customerByEmail?.status === 'active') {
          initialBalance = 500
        }
      } else if (customer?.plan_type === 'monthly' && customer?.status === 'active') {
        initialBalance = 500
      }

      await supabaseAdmin.from('api_wallets').insert({
        user_id: user.id,
        balance_cents: initialBalance,
        bonus_claimed: true,
      })
    }

    const rawKey = generateApiKey()
    const keyHash = hashApiKey(rawKey)
    const keyPrefix = rawKey.substring(0, 12)

    const { error: insertError } = await supabaseAdmin.from('api_keys').insert({
      user_id: user.id,
      name,
      key_hash: keyHash,
      key_prefix: keyPrefix,
    })

    if (insertError) {
      return NextResponse.json({ error: 'Failed to generate key' }, { status: 500 })
    }

    return NextResponse.json({
      key: rawKey,
      prefix: keyPrefix,
      name,
      message: 'Save this key now. It will not be shown again.',
    })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
