import { NextRequest, NextResponse } from 'next/server'
import { authenticateApiRequest, getEndpointCost, supabaseAdmin } from '@/lib/api-auth'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  const auth = await authenticateApiRequest(request)
  if (auth instanceof NextResponse) return auth

  const { code } = await params

  const { data: niche, error } = await supabaseAdmin
    .from('niches')
    .select('*')
    .eq('display_code', code)
    .single()

  if (error || !niche) {
    return NextResponse.json({ error: 'Niche not found' }, { status: 404 })
  }

  const { data: wallet } = await supabaseAdmin
    .from('api_wallets')
    .select('balance_cents')
    .eq('user_id', auth.userId)
    .single()

  const cost = getEndpointCost(request.nextUrl.pathname)
  const response = NextResponse.json({
    data: {
      code: niche.display_code,
      title: niche.title,
      category: niche.category,
      tags: niche.tags,
      score: niche.score,
      opportunity: niche.opportunity,
      gap: niche.gap,
      move: niche.move,
      stats: niche.stats,
      market_analysis: niche.market_analysis,
      key_learnings: niche.key_learnings,
      improvements: niche.improvements,
      risks: niche.risks,
      tech_stack: niche.tech_stack,
      marketing_strategies: niche.marketing_strategies,
      monetization: niche.monetization,
      trending: niche.trending,
      aso_optimization: niche.aso_optimization,
      source_type: niche.source_type,
      published_at: niche.published_at,
    },
  })

  response.headers.set('X-Credits-Remaining', ((wallet?.balance_cents || 0) / 100).toFixed(2))
  response.headers.set('X-Credits-Used', (cost / 100).toFixed(2))
  return response
}
