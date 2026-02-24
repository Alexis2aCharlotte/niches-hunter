import { NextRequest, NextResponse } from 'next/server'
import { authenticateApiRequest, getEndpointCost, supabaseAdmin } from '@/lib/api-auth'

export async function GET(request: NextRequest) {
  const auth = await authenticateApiRequest(request)
  if (auth instanceof NextResponse) return auth

  const { searchParams } = request.nextUrl
  const page = Math.max(1, parseInt(searchParams.get('page') || '1'))
  const category = searchParams.get('category')
  const minScore = searchParams.get('min_score')
  const perPage = 20

  let query = supabaseAdmin
    .from('niches')
    .select('display_code, title, category, tags, score, opportunity, source_type, created_at, published_at', { count: 'exact' })
    .order('published_at', { ascending: false, nullsFirst: false })

  if (category) query = query.eq('category', category)
  if (minScore) query = query.gte('score', parseInt(minScore))

  query = query.range((page - 1) * perPage, page * perPage - 1)

  const { data: niches, error, count } = await query

  if (error) {
    return NextResponse.json({ error: 'Failed to fetch niches' }, { status: 500 })
  }

  const { data: wallet } = await supabaseAdmin
    .from('api_wallets')
    .select('balance_cents')
    .eq('user_id', auth.userId)
    .single()

  const cost = getEndpointCost(request.nextUrl.pathname)
  const response = NextResponse.json({
    data: niches || [],
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
