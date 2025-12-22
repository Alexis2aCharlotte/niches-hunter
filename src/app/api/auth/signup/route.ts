import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Client Supabase avec la clé service pour créer des utilisateurs
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const { email, password, stripeCustomerId } = await request.json()

    console.log('Signup attempt:', { email, stripeCustomerId })

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      )
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

    // Créer l'utilisateur avec Supabase Auth
    const { data: authData, error: authError } = await supabaseAdmin.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${appUrl}/login`,
        data: {
          stripe_customer_id: stripeCustomerId,
        },
      },
    })

    if (authError) {
      console.error('Auth error:', authError)
      return NextResponse.json(
        { error: authError.message },
        { status: 400 }
      )
    }

    // Mettre à jour le customer avec le user_id
    if (authData.user && stripeCustomerId) {
      const { error: updateError } = await supabaseAdmin
        .from('customers')
        .update({ user_id: authData.user.id })
        .eq('stripe_customer_id', stripeCustomerId)

      if (updateError) {
        console.error('Error updating customer with user_id:', updateError)
        
        // Essayer par email si pas trouvé par stripe_customer_id
        await supabaseAdmin
          .from('customers')
          .update({ user_id: authData.user.id })
          .eq('email', email)
      } else {
        console.log('Customer updated with user_id:', authData.user.id)
      }
    }

    // Créer la réponse avec les cookies
    const response = NextResponse.json({
      success: true,
      user: authData.user,
      message: 'Account created successfully',
    })

    // Stocker le access_token pour authentifier les requêtes
    if (authData.session?.access_token) {
      console.log('Setting access_token cookie')
      response.cookies.set('access_token', authData.session.access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 30, // 30 jours (augmenté)
        path: '/',
      })
    }

    // SET LE COOKIE stripe_customer_id pour que les niches soient déverrouillées
    if (stripeCustomerId) {
      console.log('Setting cookie for customer:', stripeCustomerId)
      response.cookies.set('stripe_customer_id', stripeCustomerId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 365, // 1 an
        path: '/',
      })
    }

    return response
  } catch (error) {
    console.error('Signup error:', error)
    return NextResponse.json(
      { error: 'Failed to create account' },
      { status: 500 }
    )
  }
}

