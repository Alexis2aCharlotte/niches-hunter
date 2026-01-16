import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { type, message, userEmail } = await request.json()

    if (!message || !message.trim()) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      )
    }

    // Email configuration
    const RESEND_API_KEY = process.env.RESEND_API_KEY
    const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'contact@nicheshunter.com'
    const EMAIL_FROM_ADDRESS = process.env.EMAIL_FROM || 'onboarding@resend.dev'
    const EMAIL_FROM = `Niches Hunter Feedback <${EMAIL_FROM_ADDRESS}>`

    if (!RESEND_API_KEY) {
      console.error('RESEND_API_KEY not configured')
      return NextResponse.json(
        { error: 'Email service not configured' },
        { status: 500 }
      )
    }

    // Format the feedback type
    const typeEmoji = {
      bug: '🐛 Bug Report',
      feature: '✨ Feature Request',
      general: '💬 General Feedback',
    }[type] || '💬 Feedback'

    // Send email via Resend
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: EMAIL_FROM,
        to: [ADMIN_EMAIL],
        reply_to: userEmail || undefined,
        subject: `${typeEmoji} - ${userEmail || 'Anonymous'}`,
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%); border-radius: 16px; padding: 32px; color: white;">
              <h1 style="margin: 0 0 8px 0; font-size: 24px; font-weight: 700;">
                ${typeEmoji}
              </h1>
              <p style="margin: 0 0 24px 0; color: rgba(255,255,255,0.5); font-size: 14px;">
                New feedback from Niches Hunter
              </p>
              
              <div style="background: rgba(255,255,255,0.05); border-radius: 12px; padding: 20px; margin-bottom: 20px;">
                <p style="margin: 0; color: rgba(255,255,255,0.9); font-size: 15px; line-height: 1.6; white-space: pre-wrap;">
                  ${message}
                </p>
              </div>
              
              <div style="border-top: 1px solid rgba(255,255,255,0.1); padding-top: 16px;">
                <p style="margin: 0; color: rgba(255,255,255,0.4); font-size: 13px;">
                  <strong style="color: rgba(255,255,255,0.6);">From:</strong> ${userEmail || 'Anonymous'}
                </p>
                <p style="margin: 8px 0 0 0; color: rgba(255,255,255,0.4); font-size: 13px;">
                  <strong style="color: rgba(255,255,255,0.6);">Date:</strong> ${new Date().toLocaleString('en-US', { dateStyle: 'full', timeStyle: 'short' })}
                </p>
              </div>
            </div>
            
            <p style="text-align: center; color: #666; font-size: 12px; margin-top: 20px;">
              This email was sent from Niches Hunter feedback system
            </p>
          </div>
        `,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error('Resend API error:', errorData)
      return NextResponse.json(
        { error: 'Failed to send feedback' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error sending feedback:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
