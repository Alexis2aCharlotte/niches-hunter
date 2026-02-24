import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import crypto from 'crypto'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export function hashApiKey(key: string): string {
  return crypto.createHash('sha256').update(key).digest('hex')
}

export function generateApiKey(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
  let key = 'nh_live_'
  for (let i = 0; i < 32; i++) {
    key += chars[Math.floor(Math.random() * chars.length)]
  }
  return key
}

const ENDPOINT_COSTS: Record<string, number> = {
  '/api/v1/niches': 5,
  '/api/v1/opportunities': 5,
  '/api/v1/rankings': 3,
  '/api/v1/categories': 1,
}

const NICHE_DETAIL_COST = 50

export function getEndpointCost(pathname: string): number {
  if (/^\/api\/v1\/niches\/[^/]+$/.test(pathname)) return NICHE_DETAIL_COST
  return ENDPOINT_COSTS[pathname] || 5
}

// In-memory rate limit store (resets on deploy, good enough for Vercel)
const rateLimitStore = new Map<string, { count: number; resetAt: number }>()
const RATE_LIMIT = 30
const RATE_WINDOW_MS = 60_000

function checkRateLimit(keyId: string): boolean {
  const now = Date.now()
  const entry = rateLimitStore.get(keyId)

  if (!entry || now > entry.resetAt) {
    rateLimitStore.set(keyId, { count: 1, resetAt: now + RATE_WINDOW_MS })
    return true
  }

  if (entry.count >= RATE_LIMIT) return false
  entry.count++
  return true
}

export interface ApiAuthResult {
  userId: string
  keyId: string
}

export async function authenticateApiRequest(
  request: NextRequest
): Promise<NextResponse | ApiAuthResult> {
  const authHeader = request.headers.get('Authorization')
  if (!authHeader?.startsWith('Bearer ')) {
    return NextResponse.json(
      { error: 'Missing or invalid Authorization header. Use: Bearer nh_live_xxx' },
      { status: 401 }
    )
  }

  const apiKey = authHeader.replace('Bearer ', '')
  const keyHash = hashApiKey(apiKey)

  const { data: key, error: keyError } = await supabaseAdmin
    .from('api_keys')
    .select('id, user_id, is_active')
    .eq('key_hash', keyHash)
    .single()

  if (keyError || !key || !key.is_active) {
    return NextResponse.json(
      { error: 'Invalid or revoked API key' },
      { status: 401 }
    )
  }

  if (!checkRateLimit(key.id)) {
    return NextResponse.json(
      { error: 'Rate limit exceeded. Max 30 requests per minute.' },
      { status: 429, headers: { 'Retry-After': '60' } }
    )
  }

  const cost = getEndpointCost(request.nextUrl.pathname)

  const { data: wallet } = await supabaseAdmin
    .from('api_wallets')
    .select('balance_cents')
    .eq('user_id', key.user_id)
    .single()

  if (!wallet || wallet.balance_cents < cost) {
    return NextResponse.json(
      {
        error: 'Insufficient credits',
        balance: wallet ? (wallet.balance_cents / 100).toFixed(2) : '0.00',
        cost: (cost / 100).toFixed(2),
        topup_url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://nicheshunter.com'}/developer`,
      },
      { status: 402 }
    )
  }

  const { data: debitResult, error: debitError } = await supabaseAdmin.rpc('debit_api_call', {
    p_user_id: key.user_id,
    p_cost: cost,
    p_api_key_id: key.id,
    p_endpoint: request.nextUrl.pathname,
  })

  if (debitError || debitResult === false) {
    return NextResponse.json(
      { error: 'Billing error. Please try again.' },
      { status: 500 }
    )
  }

  return { userId: key.user_id, keyId: key.id }
}

export function addCreditHeaders(response: NextResponse, balanceAfter: number, cost: number): NextResponse {
  response.headers.set('X-Credits-Remaining', (balanceAfter / 100).toFixed(2))
  response.headers.set('X-Credits-Used', (cost / 100).toFixed(2))
  return response
}

export { supabaseAdmin }
