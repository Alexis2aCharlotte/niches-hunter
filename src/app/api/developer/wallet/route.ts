import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { sendDeveloperWelcomeEmail } from '@/lib/email'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function GET(request: NextRequest) {
  try {
    const accessToken = request.cookies.get('access_token')?.value
    if (!accessToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: { user } } = await supabaseAdmin.auth.getUser(accessToken)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    let { data: wallet } = await supabaseAdmin
      .from('api_wallets')
      .select('*')
      .eq('user_id', user.id)
      .single()

    // Auto-create wallet with $1 free credit on first visit
    if (!wallet) {
      let initialBalance = 100 // $1 free for everyone

      // Monthly subscribers get $5 instead
      const { data: customer } = await supabaseAdmin
        .from('customers')
        .select('plan_type, status')
        .eq('user_id', user.id)
        .single()

      if (customer?.plan_type === 'monthly' && customer?.status === 'active') {
        initialBalance = 500
      } else if (!customer && user.email) {
        const { data: customerByEmail } = await supabaseAdmin
          .from('customers')
          .select('plan_type, status')
          .eq('email', user.email)
          .single()

        if (customerByEmail?.plan_type === 'monthly' && customerByEmail?.status === 'active') {
          initialBalance = 500
        }
      }

      const { data: newWallet } = await supabaseAdmin
        .from('api_wallets')
        .insert({
          user_id: user.id,
          balance_cents: initialBalance,
          bonus_claimed: true,
        })
        .select('*')
        .single()

      wallet = newWallet

      // Register in api_developers table + send welcome email
      if (user.email) {
        await supabaseAdmin
          .from('api_developers')
          .upsert({ user_id: user.id, email: user.email, source: 'signup' }, { onConflict: 'user_id' })

        sendDeveloperWelcomeEmail(user.email, initialBalance).catch(console.error)

        // Telegram notification
        const tgToken = process.env.TELEGRAM_BOT_TOKEN
        const tgChat = process.env.TELEGRAM_CHAT_ID
        if (tgToken && tgChat) {
          fetch(`https://api.telegram.org/bot${tgToken}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ chat_id: tgChat, text: 'New API account created ⚙️' }),
          }).catch(console.error)
        }
      }
    }

    const { data: keys } = await supabaseAdmin
      .from('api_keys')
      .select('id, name, key_prefix, is_active, last_used_at, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    const { data: recentCalls } = await supabaseAdmin
      .from('api_calls')
      .select('endpoint, cost_cents, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(50)

    // Aggregate usage stats for last 30 days
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const { count: totalCalls30d } = await supabaseAdmin
      .from('api_calls')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .gte('created_at', thirtyDaysAgo.toISOString())

    return NextResponse.json({
      wallet: wallet ? {
        balance: (wallet.balance_cents / 100).toFixed(2),
        balance_cents: wallet.balance_cents,
        total_spent: (wallet.total_spent_cents / 100).toFixed(2),
        bonus_claimed: wallet.bonus_claimed,
      } : null,
      keys: keys || [],
      recent_calls: recentCalls || [],
      stats: {
        calls_30d: totalCalls30d || 0,
      },
    })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
