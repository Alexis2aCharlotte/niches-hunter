import { Resend } from 'resend'

let resend: Resend | null = null

function getResend(): Resend {
  if (!resend) {
    const apiKey = process.env.RESEND_API_KEY
    if (!apiKey) throw new Error('RESEND_API_KEY is not set')
    resend = new Resend(apiKey)
  }
  return resend
}

const FROM_EMAIL = 'Niches Hunter API <api@nicheshunter.app>'

export async function sendDeveloperWelcomeEmail(email: string, balanceCents: number) {
  const balance = (balanceCents / 100).toFixed(2)

  await getResend().emails.send({
    from: FROM_EMAIL,
    to: email,
    subject: `Welcome to Niches Hunter API - $${balance} credit ready`,
    html: getDeveloperWelcomeHTML(balance),
  })
}

export async function sendTopupConfirmationEmail(email: string, amountCents: number, newBalanceCents: number) {
  const amount = (amountCents / 100).toFixed(2)
  const newBalance = (newBalanceCents / 100).toFixed(2)

  await getResend().emails.send({
    from: FROM_EMAIL,
    to: email,
    subject: `$${amount} credited to your Niches Hunter API account`,
    html: getTopupConfirmationHTML(amount, newBalance),
  })
}

function getDeveloperWelcomeHTML(balance: string): string {
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta content="width=device-width, initial-scale=1.0" name="viewport">
    <title>Welcome to Niches Hunter API</title>
  </head>
  <body style="margin: 0; padding: 0; background-color: #f5f5f7; font-family: -apple-system,BlinkMacSystemFont,'SF Pro Display','Segoe UI',Roboto,sans-serif">
    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f5f5f7; padding: 40px 16px">
      <tr>
        <td align="center">
          <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 560px">
            <tr>
              <td style="text-align: center; padding-bottom: 32px">
                <div style="display: inline-block; background: #111; padding: 10px 20px; border-radius: 100px">
                  <span style="font-size: 12px; font-weight: 700; color: #00FF88; letter-spacing: 2px">NICHES HUNTER API</span>
                </div>
              </td>
            </tr>
            <tr>
              <td>
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 2px 40px rgba(0,0,0,0.08)">
                  <tr>
                    <td style="padding: 48px 40px 32px; text-align: center">
                      <h1 style="margin: 0 0 12px; font-size: 32px; font-weight: 800; color: #111; letter-spacing: -1px; line-height: 1.1">You're all set</h1>
                      <p style="margin: 0; font-size: 17px; color: #00CC6A; font-weight: 600">Your API account is ready</p>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 0 40px 32px">
                      <p style="margin: 0 0 24px; font-size: 16px; line-height: 1.8; color: #444; text-align: center">
                        Welcome to the Niches Hunter Developer API. You have <strong>$${balance}</strong> in free credits to get started.
                      </p>
                      <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 24px; background: #f0fdf4; border-radius: 16px; border: 1px solid #bbf7d0">
                        <tr>
                          <td style="text-align: center; padding: 28px">
                            <div style="font-size: 14px; color: #15803d; font-weight: 600; margin-bottom: 8px">YOUR BALANCE</div>
                            <div style="font-size: 40px; font-weight: 800; color: #00CC6A">$${balance}</div>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 0 40px 32px">
                      <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 24px">
                        <tr>
                          <td style="padding: 14px 16px; background: #f8f9fa; border-radius: 12px">
                            <span style="color: #00CC6A; font-weight: 700; margin-right: 8px">1.</span>
                            <span style="color: #111; font-size: 15px; font-weight: 600">Generate your API key</span>
                            <span style="color: #888; font-size: 14px"> from your dashboard</span>
                          </td>
                        </tr>
                        <tr><td style="height: 8px"></td></tr>
                        <tr>
                          <td style="padding: 14px 16px; background: #f8f9fa; border-radius: 12px">
                            <span style="color: #00CC6A; font-weight: 700; margin-right: 8px">2.</span>
                            <span style="color: #111; font-size: 15px; font-weight: 600">Make your first API call</span>
                            <span style="color: #888; font-size: 14px"> using your key</span>
                          </td>
                        </tr>
                        <tr><td style="height: 8px"></td></tr>
                        <tr>
                          <td style="padding: 14px 16px; background: #f8f9fa; border-radius: 12px">
                            <span style="color: #00CC6A; font-weight: 700; margin-right: 8px">3.</span>
                            <span style="color: #111; font-size: 15px; font-weight: 600">Top up anytime</span>
                            <span style="color: #888; font-size: 14px"> when you need more credits</span>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 0 40px 40px; text-align: center">
                      <a href="https://nicheshunter.com/developer" style="display: inline-block; padding: 16px 40px; background: #00CC6A; color: #000; font-size: 16px; font-weight: 700; text-decoration: none; border-radius: 12px">
                        Open Dashboard
                      </a>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="text-align: center; padding: 32px 16px">
                <a href="https://nicheshunter.com/developer/docs" style="color: #00CC6A; text-decoration: none; font-size: 13px; font-weight: 600">View API Documentation</a>
                <p style="margin: 12px 0 0; font-size: 11px; color: #999">Niches Hunter - Developer API</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`
}

function getTopupConfirmationHTML(amount: string, newBalance: string): string {
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta content="width=device-width, initial-scale=1.0" name="viewport">
    <title>Credits Added</title>
  </head>
  <body style="margin: 0; padding: 0; background-color: #f5f5f7; font-family: -apple-system,BlinkMacSystemFont,'SF Pro Display','Segoe UI',Roboto,sans-serif">
    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f5f5f7; padding: 40px 16px">
      <tr>
        <td align="center">
          <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 560px">
            <tr>
              <td style="text-align: center; padding-bottom: 32px">
                <div style="display: inline-block; background: #111; padding: 10px 20px; border-radius: 100px">
                  <span style="font-size: 12px; font-weight: 700; color: #00FF88; letter-spacing: 2px">NICHES HUNTER API</span>
                </div>
              </td>
            </tr>
            <tr>
              <td>
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 2px 40px rgba(0,0,0,0.08)">
                  <tr>
                    <td style="padding: 48px 40px 32px; text-align: center">
                      <h1 style="margin: 0 0 12px; font-size: 32px; font-weight: 800; color: #111; letter-spacing: -1px; line-height: 1.1">Credits added</h1>
                      <p style="margin: 0; font-size: 17px; color: #00CC6A; font-weight: 600">$${amount} has been credited</p>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 0 40px 32px">
                      <table border="0" cellpadding="0" cellspacing="0" width="100%">
                        <tr>
                          <td width="50%" style="padding: 20px; background: #f8f9fa; border-radius: 16px 0 0 16px; text-align: center; border-right: 1px solid #eee">
                            <div style="font-size: 12px; color: #888; font-weight: 600; margin-bottom: 8px">ADDED</div>
                            <div style="font-size: 28px; font-weight: 800; color: #00CC6A">+$${amount}</div>
                          </td>
                          <td width="50%" style="padding: 20px; background: #f8f9fa; border-radius: 0 16px 16px 0; text-align: center">
                            <div style="font-size: 12px; color: #888; font-weight: 600; margin-bottom: 8px">NEW BALANCE</div>
                            <div style="font-size: 28px; font-weight: 800; color: #111">$${newBalance}</div>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 0 40px 40px; text-align: center">
                      <a href="https://nicheshunter.com/developer" style="display: inline-block; padding: 16px 40px; background: #00CC6A; color: #000; font-size: 16px; font-weight: 700; text-decoration: none; border-radius: 12px">
                        Open Dashboard
                      </a>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="text-align: center; padding: 32px 16px">
                <p style="margin: 0; font-size: 11px; color: #999">Niches Hunter - Developer API</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`
}
