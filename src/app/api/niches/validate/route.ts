import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createClient } from '@supabase/supabase-js'

// Client Supabase Admin pour vérifier les abonnements
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// Types pour la réponse de validation
interface ValidationResponse {
  score: number
  scoreLabel: string
  marketSize: string
  competition: string
  difficulty: string
  timeToMVP: string
  strengths: string[]
  weaknesses: string[]
  recommendations: string[]
  marketInsights: string
  asoKeywords: string[]
}

// Récupérer le user_id depuis le token
async function getUserId(): Promise<string | null> {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get('access_token')?.value
  
  if (!accessToken) return null
  
  const { data: { user } } = await supabaseAdmin.auth.getUser(accessToken)
  return user?.id || null
}

// Vérifier l'abonnement via access_token ET user_id (plus fiable)
async function checkSubscription(): Promise<boolean> {
  try {
    const cookieStore = await cookies()
    
    // Essayer d'abord via access_token (méthode principale)
    const accessToken = cookieStore.get('access_token')?.value
    
    if (accessToken) {
      const { data: { user } } = await supabaseAdmin.auth.getUser(accessToken)
      
      if (user) {
        const { data: customer } = await supabaseAdmin
          .from('customers')
          .select('status')
          .eq('user_id', user.id)
          .single()
        
        if (customer?.status === 'active') return true
      }
    }
    
    // Fallback: vérifier via stripe_customer_id cookie
    const customerId = cookieStore.get('stripe_customer_id')?.value
    
    if (customerId) {
      const { data: customer } = await supabaseAdmin
        .from('customers')
        .select('status')
        .eq('stripe_customer_id', customerId)
        .single()
      
      return customer?.status === 'active'
    }
    
    return false
  } catch {
    return false
  }
}

// Appel à OpenAI pour analyser la niche
async function analyzeNicheWithAI(nicheIdea: string): Promise<ValidationResponse> {
  const apiKey = process.env.OPENAI_API_KEY

  if (!apiKey) {
    throw new Error('OpenAI API key not configured')
  }

  const systemPrompt = `You are an expert iOS app market analyst. Your role is to analyze niche app ideas and provide actionable insights based on real market data. Be precise.

You must respond ONLY with valid JSON matching this exact structure:
{
  "score": <number 0-100>,
  "scoreLabel": "<Excellent opportunity|Good potential|Needs work|High risk>",
  "marketSize": "<Small|Medium|Large>",
  "competition": "<Low|Medium|High>",
  "difficulty": "<Easy|Medium|Hard>",
  "timeToMVP": "<2-4 weeks|4-6 weeks|6-8 weeks|8+ weeks>",
  "strengths": ["<strength 1>", "<strength 2>", "<strength 3>"],
  "weaknesses": ["<weakness 1>", "<weakness 2>", "<weakness 3>"],
  "recommendations": ["<recommendation 1>", "<recommendation 2>", "<recommendation 3>"],
  "marketInsights": "<A brief 2-3 sentence about who are users, what is the problem they are trying to solve, what is the solution you are proposing>",
  "asoKeywords": ["<keyword1>", "<keyword2>", "<keyword3>", "<keyword4>", "<keyword5>"]
}

Scoring guidelines:
- 80-100: Excellent opportunity - Strong market demand, low competition, clear monetization
- 60-79: Good potential - Solid market with some challenges
- 40-59: Needs work - Significant challenges but not impossible
- 0-39: High risk - Very competitive or small market

ASO Keywords guidelines:
- Provide exactly 5 relevant App Store keywords
- Keywords should be what users would search for to find this type of app
- Mix of broad and specific terms
- Single words or short phrases (2-3 words max)

Be realistic and data-driven. Consider:
- Current app market trends
- Competition from existing apps
- Monetization potential
- Technical complexity
- Target audience size`

  const userPrompt = `Analyze this app niche idea: "${nicheIdea}"

Provide a comprehensive analysis with score, market assessment, strengths, weaknesses, and actionable recommendations. Be specific to this exact niche, not generic advice.`

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.7,
      max_tokens: 1000,
    }),
  })

  if (!response.ok) {
    const error = await response.text()
    console.error('OpenAI API error:', error)
    throw new Error('Failed to analyze niche')
  }

  const data = await response.json()
  const content = data.choices[0]?.message?.content

  if (!content) {
    throw new Error('No response from OpenAI')
  }

  // Parse JSON response
  try {
    // Remove markdown code blocks if present
    const cleanedContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
    return JSON.parse(cleanedContent)
  } catch {
    console.error('Failed to parse OpenAI response:', content)
    throw new Error('Invalid response format from AI')
  }
}

export async function POST(request: NextRequest) {
  try {
    // Vérifier l'abonnement
    const hasSubscription = await checkSubscription()
    
    if (!hasSubscription) {
      return NextResponse.json(
        { error: 'Premium subscription required', code: 'SUBSCRIPTION_REQUIRED' },
        { status: 403 }
      )
    }

    // Récupérer le user_id pour sauvegarder la validation
    const userId = await getUserId()

    // Récupérer l'idée de niche
    const body = await request.json()
    const { nicheIdea } = body

    if (!nicheIdea || typeof nicheIdea !== 'string' || nicheIdea.trim().length < 3) {
      return NextResponse.json(
        { error: 'Please provide a valid niche idea (at least 3 characters)' },
        { status: 400 }
      )
    }

    // Limiter la longueur de l'input
    const sanitizedIdea = nicheIdea.trim().slice(0, 200)

    // Analyser avec l'IA
    const analysis = await analyzeNicheWithAI(sanitizedIdea)

    // Sauvegarder automatiquement la validation dans le workspace
    if (userId) {
      const { error: saveError } = await supabaseAdmin
        .from('niche_validations')
        .insert({
          user_id: userId,
          query: sanitizedIdea,
          score: analysis.score,
          score_label: analysis.scoreLabel,
          market_size: analysis.marketSize,
          competition: analysis.competition,
          difficulty: analysis.difficulty,
          time_to_mvp: analysis.timeToMVP,
          strengths: analysis.strengths,
          weaknesses: analysis.weaknesses,
          recommendations: analysis.recommendations,
          market_insights: analysis.marketInsights,
          aso_keywords: analysis.asoKeywords || null,
        })

      if (saveError) {
        console.error('Error saving validation:', saveError)
        // On continue quand même, la validation a réussi
      }
    }

    return NextResponse.json({ 
      success: true,
      analysis,
    })

  } catch (error) {
    console.error('Niche validation error:', error)
    
    if (error instanceof Error && error.message === 'OpenAI API key not configured') {
      return NextResponse.json(
        { error: 'Service temporarily unavailable' },
        { status: 503 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to analyze niche. Please try again.' },
      { status: 500 }
    )
  }
}

