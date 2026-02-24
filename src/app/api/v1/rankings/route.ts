import { NextRequest, NextResponse } from 'next/server'
import { authenticateApiRequest, getEndpointCost, supabaseAdmin } from '@/lib/api-auth'

export async function GET(request: NextRequest) {
  const auth = await authenticateApiRequest(request)
  if (auth instanceof NextResponse) return auth

  const { searchParams } = request.nextUrl
  const country = searchParams.get('country')
  const category = searchParams.get('category')
  const date = searchParams.get('date')
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '50')))

  if (!country && !category) {
    return NextResponse.json(
      { error: 'At least one filter required: country or category' },
      { status: 400 }
    )
  }

  let query = supabaseAdmin
    .from('app_rankings_clean_v2')
    .select('app_id, name, developer, category, rank, country, source_type, run_date, release_date, url, image')
    .order('rank', { ascending: true })
    .limit(limit)

  if (country) query = query.eq('country', country)
  if (category) query = query.eq('category_name', category)
  if (date) query = query.eq('run_date', date)

  const { data, error } = await query

  if (error) {
    return NextResponse.json({ error: 'Failed to fetch rankings' }, { status: 500 })
  }

  const { data: wallet } = await supabaseAdmin
    .from('api_wallets')
    .select('balance_cents')
    .eq('user_id', auth.userId)
    .single()

  const cost = getEndpointCost(request.nextUrl.pathname)
  const response = NextResponse.json({
    data: data || [],
    count: data?.length || 0,
  })

  response.headers.set('X-Credits-Remaining', ((wallet?.balance_cents || 0) / 100).toFixed(2))
  response.headers.set('X-Credits-Used', (cost / 100).toFixed(2))
  return response
}
