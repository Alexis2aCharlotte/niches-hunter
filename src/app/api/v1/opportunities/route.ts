import { NextRequest, NextResponse } from 'next/server'
import { authenticateApiRequest, getEndpointCost, supabaseAdmin } from '@/lib/api-auth'

export async function GET(request: NextRequest) {
  const auth = await authenticateApiRequest(request)
  if (auth instanceof NextResponse) return auth

  const { searchParams } = request.nextUrl
  const page = Math.max(1, parseInt(searchParams.get('page') || '1'))
  const category = searchParams.get('category')
  const minScore = searchParams.get('min_score')
  const country = searchParams.get('country')
  const perPage = 50

  let query = supabaseAdmin
    .from('opportunities_v2')
    .select('app_id, name, developer, category_name, url, image, release_date, best_rank, avg_rank, days_in_top, country_count, countries, is_paid, is_new, total_score, first_seen, last_seen, analysis_date', { count: 'exact' })
    .order('total_score', { ascending: false })

  if (category) query = query.eq('category_name', category)
  if (minScore) query = query.gte('total_score', parseFloat(minScore))
  if (country) query = query.contains('countries', [country])

  query = query.range((page - 1) * perPage, page * perPage - 1)

  const { data, error, count } = await query

  if (error) {
    return NextResponse.json({ error: 'Failed to fetch opportunities' }, { status: 500 })
  }

  const { data: wallet } = await supabaseAdmin
    .from('api_wallets')
    .select('balance_cents')
    .eq('user_id', auth.userId)
    .single()

  const cost = getEndpointCost(request.nextUrl.pathname)
  const response = NextResponse.json({
    data: data || [],
    pagination: {
      page,
      per_page: perPage,
      total: count || 0,
      total_pages: Math.ceil((count || 0) / perPage),
    },
  })

  response.headers.set('X-Credits-Remaining', ((wallet?.balance_cents || 0) / 100).toFixed(2))
  response.headers.set('X-Credits-Used', (cost / 100).toFixed(2))
  return response
}
