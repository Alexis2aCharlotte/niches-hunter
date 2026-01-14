import { NextResponse } from 'next/server'

export async function POST() {
  const response = NextResponse.json({ success: true })
  
  // Supprimer le cookie stripe_customer_id
  response.cookies.set('stripe_customer_id', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0, // Expire immédiatement
    path: '/',
  })

  return response
}

