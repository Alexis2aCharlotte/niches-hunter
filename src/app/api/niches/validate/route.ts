import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { stripe } from '@/lib/stripe'

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
}

// Vérifier l'abonnement Stripe
async function checkSubscription(): Promise<boolean> {
  try {
    const cookieStore = await cookies()
    const customerId = cookieStore.get('stripe_customer_id')?.value

    if (!customerId) return false

    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: 'active',
      limit: 1,
    })

    return subscriptions.data.length > 0
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

  const systemPrompt = `You are an expert iOS app market analyst. Your role is to analyze niche app ideas and provide actionable insights based on real market data.

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
  "marketInsights": "<A brief 2-3 sentence market insight specific to this niche>"
}

Scoring guidelines:
- 80-100: Excellent opportunity - Strong market demand, low competition, clear monetization
- 60-79: Good potential - Solid market with some challenges
- 40-59: Needs work - Significant challenges but not impossible
- 0-39: High risk - Very competitive or small market

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

