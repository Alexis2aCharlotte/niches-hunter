import { NextRequest, NextResponse } from 'next/server'
import { authenticateApiRequest, getEndpointCost, supabaseAdmin } from '@/lib/api-auth'

export async function GET(request: NextRequest) {
  const auth = await authenticateApiRequest(request)
  if (auth instanceof NextResponse) return auth

  const { data, error } = await supabaseAdmin
    .from('category_scores')
    .select('category_name, bonus, tier')
    .order('bonus', { ascending: false })

  if (error) {
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 })
  }

  const { data: wallet } = await supabaseAdmin
    .from('api_wallets')
    .select('balance_cents')
    .eq('user_id', auth.userId)
    .single()

  const cost = getEndpointCost(request.nextUrl.pathname)
  const response = NextResponse.json({ data: data || [] })

  response.headers.set('X-Credits-Remaining', ((wallet?.balance_cents || 0) / 100).toFixed(2))
  response.headers.set('X-Credits-Used', (cost / 100).toFixed(2))
  return response
}
