import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function GET() {
  try {
    // Get access token from cookie
    const cookieStore = await cookies()
    const accessToken = cookieStore.get('access_token')?.value

    if (!accessToken) {
      return NextResponse.json({ affiliate: null })
    }

    // Get user from token
    const { data: { user }, error: userError } = await supabaseAdmin.auth.getUser(accessToken)

    if (userError || !user?.email) {
      return NextResponse.json({ affiliate: null })
    }

    // Get affiliate data
    const { data: affiliate, error } = await supabaseAdmin
      .from('affiliates')
      .select('*')
      .eq('user_email', user.email)
      .single()

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching affiliate:', error)
      return NextResponse.json({ affiliate: null })
    }

    return NextResponse.json({ affiliate })
  } catch (error) {
    console.error('Error in affiliate/me:', error)
    return NextResponse.json({ affiliate: null })
  }
}
