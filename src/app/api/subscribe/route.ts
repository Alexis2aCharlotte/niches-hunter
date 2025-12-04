import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

// Server-side Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    // Validate email
    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      )
    }

    // Insert into Supabase
    const { data, error } = await supabase
      .from('newsletter_subscribers')
      .insert({
        email: email.toLowerCase().trim(),
        status: 'subscribed'
      })
      .select()
      .single()

    if (error) {
      // Check if email already exists (unique constraint)
      if (error.code === '23505') {
        return NextResponse.json(
          { error: 'This email is already subscribed!' },
          { status: 409 }
        )
      }
      
      console.error('Supabase error:', error)
      return NextResponse.json(
        { error: 'Failed to subscribe. Please try again.' },
        { status: 500 }
      )
    }

    // Success - Supabase webhook will trigger n8n automatically
    return NextResponse.json(
      { 
        success: true, 
        message: 'Welcome aboard! Check your inbox 🎯',
        data 
      },
      { status: 201 }
    )

  } catch (error) {
    console.error('Subscribe error:', error)
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    )
  }
}

