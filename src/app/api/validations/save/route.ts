import { NextRequest, NextResponse } from 'next/server'
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

export async function POST(request: NextRequest) {
  try {
    const userId = await getUserId()
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { 
      query,
      score,
      scoreLabel,
      marketSize,
      competition,
      difficulty,
      timeToMVP,
      strengths,
      weaknesses,
      recommendations,
      marketInsights,
      asoKeywords
    } = body

    if (!query) {
      return NextResponse.json(
        { error: 'Query is required' },
        { status: 400 }
      )
    }

    // Insérer dans la table niche_validations
    const { data, error } = await supabaseAdmin
      .from('niche_validations')
      .insert({
        user_id: userId,
        query,
        score,
        score_label: scoreLabel,
        market_size: marketSize,
        competition,
        difficulty,
        time_to_mvp: timeToMVP,
        strengths,
        weaknesses,
        recommendations,
        market_insights: marketInsights,
        aso_keywords: asoKeywords || null,
      })
      .select()
      .single()

    if (error) {
      console.error('Error saving validation:', error)
      return NextResponse.json(
        { error: 'Failed to save validation' },
        { status: 500 }
      )
    }

    return NextResponse.json({ 
      success: true, 
      validation: data 
    })

  } catch (error) {
    console.error('Save validation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
