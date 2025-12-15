import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { stripe } from '@/lib/stripe'

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

    // Récupérer la subscription - d'abord par user_id
    const { data: subscriptionData } = await supabaseAdmin
      .from('subscriptions')
      .select('stripe_customer_id')
      .eq('user_id', authData.user.id)
      .single()

    let stripeCustomerId = subscriptionData?.stripe_customer_id || null

    // Si pas trouvé par user_id, chercher directement dans Stripe par email
    if (!stripeCustomerId) {
      console.log('No subscription found by user_id, searching Stripe by email...')
      
      try {
        // Chercher le customer Stripe par email
        const customers = await stripe.customers.list({
          email: email,
          limit: 1,
        })

        if (customers.data.length > 0) {
          const customerId = customers.data[0].id
          console.log('Found Stripe customer:', customerId)

          // Vérifier s'il a une subscription active
          const subscriptions = await stripe.subscriptions.list({
            customer: customerId,
            status: 'active',
            limit: 1,
          })

          if (subscriptions.data.length > 0) {
            console.log('Found active subscription, updating DB...')
            
            // Mettre à jour ou créer l'entrée dans la DB
            const { data: existingSub } = await supabaseAdmin
              .from('subscriptions')
              .select('id')
              .eq('stripe_customer_id', customerId)
              .single()

            if (existingSub) {
              // Mettre à jour avec le user_id
              await supabaseAdmin
                .from('subscriptions')
                .update({ user_id: authData.user.id })
                .eq('stripe_customer_id', customerId)
            } else {
              // Créer une nouvelle entrée
              await supabaseAdmin
                .from('subscriptions')
                .insert({
                  user_id: authData.user.id,
                  stripe_customer_id: customerId,
                  stripe_subscription_id: subscriptions.data[0].id,
                  status: 'active',
                })
            }

            stripeCustomerId = customerId
          }
        }
      } catch (stripeError) {
        console.error('Error searching Stripe:', stripeError)
      }
    }

    // Créer la réponse avec les cookies
    const response = NextResponse.json({
      success: true,
      user: {
        id: authData.user.id,
        email: authData.user.email,
      },
    })

    // Stocker le access_token pour authentifier les requêtes
    if (authData.session?.access_token) {
      console.log('Setting access_token cookie')
      response.cookies.set('access_token', authData.session.access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 jours
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
    } else {
      console.log('No subscription found for user')
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
