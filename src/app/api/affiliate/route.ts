import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST(request: Request) {
  try {
    const { 
      firstName, 
      lastName, 
      email, 
      paymentMethod, 
      twitterHandle,
      affiliateType,
      promotionPlatform,
      promotionUrl,
      audienceSize
    } = await request.json()

    // Validation
    if (!firstName || !lastName || !email || !paymentMethod) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // External affiliates must have at least one platform
    if (affiliateType === 'external' && !promotionPlatform) {
      return NextResponse.json(
        { error: 'Please select at least one promotion platform' },
        { status: 400 }
      )
    }

    // Check if already applied
    const { data: existing } = await supabaseAdmin
      .from('affiliates')
      .select('id, status')
      .eq('user_email', email)
      .single()

    if (existing) {
      return NextResponse.json(
        { error: 'You have already applied to the affiliate program', status: existing.status },
        { status: 400 }
      )
    }

    // Save to Supabase
    const { error: insertError } = await supabaseAdmin
      .from('affiliates')
      .insert({
        user_email: email,
        first_name: firstName,
        last_name: lastName,
        payment_method: paymentMethod,
        twitter_handle: twitterHandle || null,
        affiliate_type: affiliateType || 'pro',
        promotion_platform: promotionPlatform || null,
        promotion_url: promotionUrl || null,
        audience_size: audienceSize || null,
        status: 'pending'
      })

    if (insertError) {
      console.error('Error saving affiliate application:', insertError)
      return NextResponse.json(
        { error: 'Failed to save application' },
        { status: 500 }
      )
    }

    // Application saved successfully - now send notifications (best-effort, don't block success)
    const isExternal = affiliateType === 'external'
    
    // Email configuration
    const RESEND_API_KEY = process.env.RESEND_API_KEY
    const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'contact@nicheshunter.com'
    const EMAIL_FROM_ADDRESS = process.env.EMAIL_FROM || 'onboarding@resend.dev'
    const EMAIL_FROM = `Niches Hunter <${EMAIL_FROM_ADDRESS}>`

    // Format payment method
    const paymentMethods: Record<string, string> = {
      paypal: '💳 PayPal',
      stripe: '💰 Stripe',
      wise: '🌍 Wise',
      revolut: '🔄 Revolut',
    }
    const paymentDisplay = paymentMethods[paymentMethod] || paymentMethod

    // Platform display names
    const platformNames: Record<string, string> = {
      twitter: '𝕏 Twitter',
      reddit: '🔴 Reddit',
      youtube: '▶️ YouTube',
      blog: '📝 Blog',
      newsletter: '📧 Newsletter',
    }
    const platformDisplay = promotionPlatform ? platformNames[promotionPlatform] || promotionPlatform : null

    // Try to send email (best-effort)
    let emailSent = false
    if (RESEND_API_KEY) {
      try {
        const response = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${RESEND_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: EMAIL_FROM,
            to: [ADMIN_EMAIL],
            reply_to: email,
            subject: `🤝 ${isExternal ? '[EXTERNAL]' : '[PRO]'} Affiliate Application - ${firstName} ${lastName}`,
            html: `
              <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <div style="background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%); border-radius: 16px; padding: 32px; color: white;">
                  <h1 style="margin: 0 0 8px 0; font-size: 24px; font-weight: 700;">
                    🤝 New Affiliate Application
                  </h1>
                  <p style="margin: 0 0 24px 0; color: rgba(255,255,255,0.5); font-size: 14px;">
                    ${isExternal ? '⚠️ EXTERNAL applicant (not a Pro member)' : '✅ Pro member wants to join the affiliate program'}
                  </p>
                  
                  <div style="background: rgba(34, 197, 94, 0.1); border: 1px solid rgba(34, 197, 94, 0.2); border-radius: 12px; padding: 20px; margin-bottom: 20px;">
                    <h2 style="margin: 0 0 16px 0; color: #22c55e; font-size: 16px; font-weight: 600;">
                      Applicant Details
                    </h2>
                    
                    <table style="width: 100%; border-collapse: collapse;">
                      <tr>
                        <td style="padding: 8px 0; color: rgba(255,255,255,0.5); font-size: 14px; width: 140px;">Type</td>
                        <td style="padding: 8px 0; color: ${isExternal ? '#f59e0b' : '#22c55e'}; font-size: 14px; font-weight: 700;">${isExternal ? '🌐 EXTERNAL' : '⭐ PRO MEMBER'}</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; color: rgba(255,255,255,0.5); font-size: 14px;">Name</td>
                        <td style="padding: 8px 0; color: white; font-size: 14px; font-weight: 500;">${firstName} ${lastName}</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; color: rgba(255,255,255,0.5); font-size: 14px;">Email</td>
                        <td style="padding: 8px 0; color: white; font-size: 14px; font-weight: 500;">
                          <a href="mailto:${email}" style="color: #22c55e; text-decoration: none;">${email}</a>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; color: rgba(255,255,255,0.5); font-size: 14px;">Payment Method</td>
                        <td style="padding: 8px 0; color: white; font-size: 14px; font-weight: 500;">${paymentDisplay}</td>
                      </tr>
                      ${twitterHandle ? `
                      <tr>
                        <td style="padding: 8px 0; color: rgba(255,255,255,0.5); font-size: 14px;">X (Twitter)</td>
                        <td style="padding: 8px 0; color: white; font-size: 14px; font-weight: 500;">
                          <a href="https://x.com/${twitterHandle}" style="color: #22c55e; text-decoration: none;">@${twitterHandle}</a>
                        </td>
                      </tr>
                      ` : ''}
                      ${isExternal && platformDisplay ? `
                      <tr>
                        <td style="padding: 8px 0; color: rgba(255,255,255,0.5); font-size: 14px;">Platform</td>
                        <td style="padding: 8px 0; color: white; font-size: 14px; font-weight: 500;">${platformDisplay}</td>
                      </tr>
                      ` : ''}
                      ${isExternal && promotionUrl ? `
                      <tr>
                        <td style="padding: 8px 0; color: rgba(255,255,255,0.5); font-size: 14px;">Profile/URL</td>
                        <td style="padding: 8px 0; color: white; font-size: 14px; font-weight: 500;">
                          <a href="${promotionUrl}" style="color: #22c55e; text-decoration: none;">${promotionUrl}</a>
                        </td>
                      </tr>
                      ` : ''}
                      ${isExternal && audienceSize ? `
                      <tr>
                        <td style="padding: 8px 0; color: rgba(255,255,255,0.5); font-size: 14px;">Audience Size</td>
                        <td style="padding: 8px 0; color: white; font-size: 14px; font-weight: 500;">${audienceSize} followers</td>
                      </tr>
                      ` : ''}
                    </table>
                  </div>
                  
                  <div style="background: rgba(255,255,255,0.05); border-radius: 12px; padding: 16px; margin-bottom: 20px;">
                    <h3 style="margin: 0 0 8px 0; color: rgba(255,255,255,0.7); font-size: 14px; font-weight: 600;">
                      📋 Next Steps
                    </h3>
                    <ol style="margin: 0; padding-left: 20px; color: rgba(255,255,255,0.6); font-size: 13px; line-height: 1.8;">
                      ${isExternal ? '<li>⚠️ Verify their platform/audience before approving</li>' : ''}
                      <li>Create a promotion code in Stripe (e.g., ${firstName.toUpperCase()}40)</li>
                      <li>Send the code to ${email}</li>
                      <li>Track their referrals in Stripe</li>
                    </ol>
                  </div>
                  
                  <div style="border-top: 1px solid rgba(255,255,255,0.1); padding-top: 16px;">
                    <p style="margin: 0; color: rgba(255,255,255,0.4); font-size: 13px;">
                      <strong style="color: rgba(255,255,255,0.6);">Submitted:</strong> ${new Date().toLocaleString('en-US', { dateStyle: 'full', timeStyle: 'short' })}
                    </p>
                  </div>
                </div>
                
                <p style="text-align: center; color: #666; font-size: 12px; margin-top: 20px;">
                  Niches Hunter Affiliate Program
                </p>
              </div>
            `,
          }),
        })
        emailSent = response.ok
        if (!response.ok) {
          const errorData = await response.json()
          console.error('Resend API error:', errorData)
        }
      } catch (e) {
        console.error('Email error:', e)
      }
    }

    // Telegram notification - only if email succeeded or as fallback
    const telegramToken = process.env.TELEGRAM_BOT_TOKEN
    const telegramChatId = process.env.TELEGRAM_CHAT_ID
    if (telegramToken && telegramChatId) {
      try {
        await fetch(`https://api.telegram.org/bot${telegramToken}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: telegramChatId,
            text: `🤝 New ${isExternal ? 'EXTERNAL' : 'Pro'} affiliate request${!emailSent ? ' (⚠️ email failed)' : ''}`
          })
        })
      } catch (e) {
        console.error('Telegram error:', e)
      }
    }

    // Success - application was saved (notifications are best-effort)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error submitting affiliate application:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
