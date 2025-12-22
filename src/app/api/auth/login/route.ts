import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    console.log('Login attempt for:', email)

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Authentifier avec Supabase
    const { data: authData, error: authError } = await supabaseAdmin.auth.signInWithPassword({
      email,
      password,
    })

    if (authError) {
      console.error('Login error:', authError)
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    if (!authData.user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    console.log('User authenticated:', authData.user.id)

    // Récupérer le customer par email (simple et direct)
    const { data: customer } = await supabaseAdmin
      .from('customers')
      .select('stripe_customer_id, status, plan_type')
      .eq('email', email)
      .single()

    let stripeCustomerId = customer?.stripe_customer_id || null

    // Si trouvé, mettre à jour le user_id si pas déjà fait
    if (customer && stripeCustomerId) {
      console.log('Found customer:', stripeCustomerId, 'status:', customer.status)
      
      await supabaseAdmin
        .from('customers')
        .update({ user_id: authData.user.id })
        .eq('email', email)
    } else {
      console.log('No customer found for email:', email)
    }

    // Créer la réponse avec les cookies
    const response = NextResponse.json({
      success: true,
      user: {
        id: authData.user.id,
        email: authData.user.email,
      },
      hasSubscription: customer?.status === 'active',
      planType: customer?.plan_type || null,
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

    // Stocker le customer ID dans un cookie si disponible
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
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Failed to sign in' },
      { status: 500 }
    )
  }
}
