import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// Récupérer le user_id depuis le token
async function getUserId(): Promise<string | null> {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get('access_token')?.value
  
  if (!accessToken) return null
  
  const { data: { user } } = await supabaseAdmin.auth.getUser(accessToken)
  return user?.id || null
}

export async function GET() {
  try {
    const userId = await getUserId()
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const { data: validations, error } = await supabaseAdmin
      .from('niche_validations')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching validations:', error)
      return NextResponse.json(
        { error: 'Failed to fetch validations' },
        { status: 500 }
      )
    }

    return NextResponse.json({ validations })

  } catch (error) {
    console.error('Validations error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
