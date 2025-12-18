import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

    // Envoyer l'email de reset via Supabase Auth
    const { error } = await supabaseAdmin.auth.resetPasswordForEmail(email, {
      redirectTo: `${appUrl}/reset-password/confirm`,
    })

    if (error) {
      console.error('Reset password error:', error)
      // Ne pas révéler si l'email existe ou non pour des raisons de sécurité
      // On renvoie toujours un succès
    }

    // Toujours renvoyer un succès pour ne pas révéler si l'email existe
    return NextResponse.json({
      success: true,
      message: 'If an account with this email exists, you will receive a password reset link.',
    })
  } catch (error) {
    console.error('Reset password error:', error)
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    )
  }
}

