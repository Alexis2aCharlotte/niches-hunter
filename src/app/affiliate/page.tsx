'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import LiquidCard from '@/components/LiquidCard'

export default function AffiliatePage() {
  const [isPro, setIsPro] = useState(false)
  const [userEmail, setUserEmail] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  
  // Form state
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('')
  const [twitterHandle, setTwitterHandle] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [checkoutLoading, setCheckoutLoading] = useState(false)
  const [affiliateStatus, setAffiliateStatus] = useState<'none' | 'pending' | 'approved'>('none')
  const [affiliateCode, setAffiliateCode] = useState<string | null>(null)
  const [codeCopied, setCodeCopied] = useState(false)

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch('/api/auth/me', { credentials: 'include' })
        const data = await res.json()
        setIsPro(data.subscription?.status === 'active')
        setUserEmail(data.user?.email || '')

        // Check affiliate status
        if (data.subscription?.status === 'active') {
          const affiliateRes = await fetch('/api/affiliate/me')
          const affiliateData = await affiliateRes.json()
          if (affiliateData.affiliate) {
            setAffiliateStatus(affiliateData.affiliate.status)
            setAffiliateCode(affiliateData.affiliate.promo_code)
          }
        }
      } catch {
        setIsPro(false)
      } finally {
        setIsLoading(false)
      }
    }
    checkAuth()
  }, [])

  const handleCheckout = async () => {
    setCheckoutLoading(true)
    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          nicheId: 'affiliate-page',
          mode: 'lifetime'
        }),
      })
      const data = await response.json()
      if (data.url) {
        window.location.href = data.url
      }
    } catch (error) {
      console.error('Checkout error:', error)
      setCheckoutLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitError('')

    try {
      const response = await fetch('/api/affiliate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName,
          lastName,
          email: userEmail,
          paymentMethod,
          twitterHandle,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to submit')
      }

      setSubmitSuccess(true)
    } catch {
      setSubmitError('Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const benefits = [
    { title: '40% Commission', description: 'Earn $10 for every sale you refer' },
    { title: '$4 Off for Friends', description: 'Your referrals get a discount too' },
    { title: 'Lifetime Tracking', description: 'Your code works forever' },
    { title: 'Flexible Payouts', description: 'PayPal, Stripe, Wise, or Revolut' },
  ]

  const steps = [
    { step: '1', title: 'Apply Below', description: 'Fill out the quick form' },
    { step: '2', title: 'Get Your Code', description: 'We\'ll send your unique promo code' },
    { step: '3', title: 'Share & Earn', description: 'Promote and earn 40% per sale' },
  ]

  return (
    <main className="min-h-screen relative overflow-hidden text-white font-sans selection:bg-[#00CC3D] selection:text-black">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/3 w-[800px] h-[800px] bg-[var(--primary)]/5 blur-[200px] rounded-full" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-500/5 blur-[150px] rounded-full" />
      </div>

      {/* Hero */}
      <section className="relative pt-32 pb-8 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--primary)]/10 border border-[var(--primary)]/20 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary)] animate-pulse" />
            <span className="text-xs font-mono text-[var(--primary)] uppercase tracking-wider">Affiliate Program</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
            Earn <span className="text-flashy-green">$10</span> Per Referral
          </h1>
          
          <p className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto mb-10">
            Share Niches Hunter with your audience and earn <span className="text-white font-semibold">40% commission</span> on every sale. 
            Your friends get <span className="text-white font-semibold">$4 off</span> too.
          </p>

          <div className="flex flex-wrap justify-center gap-6 text-sm text-white/50">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-[var(--primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              No minimum payout
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-[var(--primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Weekly payouts
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-[var(--primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Real-time tracking
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="relative px-6 pb-20">
        <div className="max-w-5xl mx-auto grid md:grid-cols-4 gap-6">
          {benefits.map((benefit, i) => (
            <LiquidCard key={i} className="p-8 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-[var(--primary)]/10 blur-[50px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
              <h3 className="text-lg font-bold mb-2 relative z-10">{benefit.title}</h3>
              <p className="text-white/50 relative z-10">{benefit.description}</p>
            </LiquidCard>
          ))}
        </div>
      </section>

      {/* How it Works */}
      <section className="relative px-6 py-20">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
            How It <span className="text-flashy-green">Works</span>
          </h2>
          
          <div className="grid md:grid-cols-3 gap-12">
            {steps.map((item, i) => (
              <div key={i} className="text-center">
                <div className="w-16 h-16 rounded-full bg-[var(--primary)]/20 text-[var(--primary)] font-bold text-2xl flex items-center justify-center mx-auto mb-6">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                <p className="text-white/50">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Commission Timeline */}
      <section className="relative px-6 py-20">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">
            Commission <span className="text-flashy-green">Growth</span>
          </h2>
          <LiquidCard className="p-8 text-center">
            <p className="text-white/60 mb-6">
              Every <span className="text-white font-bold">50 users</span>, the price increases by <span className="text-white font-bold">$10</span>. 
              Your commission grows with it.
            </p>
            
            {/* Progress bar */}
            <div className="relative">
              {/* Labels - Commission amounts */}
              <div className="flex justify-between text-sm mb-2">
                <span className="text-white/30 line-through">$6/sale</span>
                <span className="text-[var(--primary)] font-bold">$10/sale</span>
                <span className="text-white/40">$14/sale</span>
                <span className="text-white/40">$18/sale</span>
              </div>
              
              {/* Bar background */}
              <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-[var(--primary)] to-[#00E847] rounded-full transition-all duration-1000"
                  style={{ width: '52%' }}
                />
              </div>
              
              {/* Markers */}
              <div className="flex justify-between mt-1">
                <span className="text-xs text-white/30">0</span>
                <span className="text-xs text-white/30">50</span>
                <span className="text-xs text-white/30">100</span>
                <span className="text-xs text-white/30">150</span>
              </div>
            </div>
            
            <p className="text-xs text-white/40 mt-4">
              <span className="text-[var(--primary)] font-bold">66 users</span> already joined • Next commission increase at 100 users
            </p>
            
            <p className="text-sm text-white/50 mt-6">
              Join now and lock in your affiliate status before commissions increase.
            </p>
          </LiquidCard>
        </div>
      </section>

      {/* Application Form / CTA */}
      <section className="relative px-6 py-20">
        <div className="max-w-2xl mx-auto">
          {isLoading ? (
            <LiquidCard className="p-10 text-center">
              <div className="w-8 h-8 border-2 border-white/20 border-t-[var(--primary)] rounded-full animate-spin mx-auto" />
            </LiquidCard>
          ) : isPro && affiliateStatus === 'approved' && affiliateCode ? (
            // Approved affiliate - show code
            <LiquidCard className="p-8 md:p-10 relative overflow-hidden border-2 border-[var(--primary)]/30">
              <div className="absolute top-0 right-0 w-40 h-40 bg-[var(--primary)]/20 blur-[80px] rounded-full pointer-events-none" />
              
              <div className="text-center relative z-10">
                <div className="w-20 h-20 rounded-full bg-[var(--primary)]/20 flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10 text-[var(--primary)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-[var(--primary)] mb-2">You&apos;re an Affiliate!</h2>
                <p className="text-white/60 mb-8">Share your code and earn 40% on every sale.</p>
                
                <div className="p-6 rounded-2xl bg-black/30 border border-white/10 mb-6">
                  <p className="text-sm text-white/40 mb-2">Your promo code</p>
                  <div className="flex items-center justify-center gap-4">
                    <span className="text-4xl font-mono font-bold text-[var(--primary)]">{affiliateCode}</span>
                    <button 
                      onClick={() => {
                        navigator.clipboard.writeText(affiliateCode!)
                        setCodeCopied(true)
                        setTimeout(() => setCodeCopied(false), 2000)
                      }}
                      className={`px-4 py-2 rounded-xl text-sm transition-all ${codeCopied ? 'bg-[var(--primary)]/20 text-[var(--primary)]' : 'bg-white/10 hover:bg-white/20 text-white'}`}
                    >
                      {codeCopied ? (
                        <span className="flex items-center gap-1.5">
                          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                          Copied!
                        </span>
                      ) : 'Copy'}
                    </button>
                  </div>
                </div>
                
                <p className="text-sm text-white/40">
                  Your referrals get <span className="text-white font-medium">$4 off</span> • You earn <span className="text-[var(--primary)] font-medium">$10 per sale</span>
                </p>
              </div>
            </LiquidCard>
          ) : isPro && affiliateStatus === 'pending' ? (
            // Pending application
            <LiquidCard className="p-8 md:p-10 relative overflow-hidden border-2 border-amber-500/30">
              <div className="absolute top-0 right-0 w-40 h-40 bg-amber-500/20 blur-[80px] rounded-full pointer-events-none" />
              
              <div className="text-center relative z-10">
                <div className="w-20 h-20 rounded-full bg-amber-500/20 flex items-center justify-center mx-auto mb-6">
                  <span className="text-4xl">⏳</span>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-amber-400 mb-2">Application Pending</h2>
                <p className="text-white/60 mb-4">We&apos;re reviewing your application.</p>
                <p className="text-sm text-white/40">
                  You&apos;ll receive your unique promo code at <span className="text-white font-medium">{userEmail}</span> within 24-48 hours.
                </p>
              </div>
            </LiquidCard>
          ) : isPro ? (
            // Form for Pro users
            <LiquidCard className="p-8 md:p-10 relative overflow-hidden border-2 border-[var(--primary)]/30">
              <div className="absolute top-0 right-0 w-40 h-40 bg-[var(--primary)]/20 blur-[80px] rounded-full pointer-events-none" />
              
              {submitSuccess ? (
                <div className="text-center py-8 relative z-10">
                  <div className="w-16 h-16 rounded-full bg-[var(--primary)]/20 flex items-center justify-center mx-auto mb-6">
                    <svg className="w-8 h-8 text-[var(--primary)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-[var(--primary)] mb-2">Application Received!</h3>
                  <p className="text-white/60">
                    We&apos;ll review your application and send your unique affiliate code to <span className="text-white font-medium">{userEmail}</span> within 24-48 hours.
                  </p>
                </div>
              ) : (
                <>
                  <div className="mb-8 relative z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--primary)]/20 text-[var(--primary)] text-xs font-bold mb-4">
                      <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary)]" />
                      PRO MEMBER
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold mb-2">Apply for Affiliate Program</h2>
                    <p className="text-white/50">Fill out the form below and we&apos;ll send you your unique promo code.</p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-white/70 mb-2">First Name *</label>
                        <input
                          type="text"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          required
                          className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-[var(--primary)]/50 focus:outline-none transition-colors"
                          placeholder="John"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-white/70 mb-2">Last Name *</label>
                        <input
                          type="text"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          required
                          className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-[var(--primary)]/50 focus:outline-none transition-colors"
                          placeholder="Doe"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-white/70 mb-2">Email</label>
                      <input
                        type="email"
                        value={userEmail}
                        disabled
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white/50 cursor-not-allowed"
                      />
                      <p className="text-xs text-white/30 mt-1">This is your account email</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-white/70 mb-2">Preferred Payment Method *</label>
                      <select
                        value={paymentMethod}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        required
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-[var(--primary)]/50 focus:outline-none transition-colors appearance-none cursor-pointer"
                      >
                        <option value="" className="bg-[#111]">Select payment method</option>
                        <option value="paypal" className="bg-[#111]">PayPal</option>
                        <option value="stripe" className="bg-[#111]">Stripe</option>
                        <option value="wise" className="bg-[#111]">Wise</option>
                        <option value="revolut" className="bg-[#111]">Revolut</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-white/70 mb-2">X (Twitter) Handle <span className="text-white/30">(optional)</span></label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30">@</span>
                        <input
                          type="text"
                          value={twitterHandle}
                          onChange={(e) => setTwitterHandle(e.target.value.replace('@', ''))}
                          className="w-full pl-8 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-[var(--primary)]/50 focus:outline-none transition-colors"
                          placeholder="yourhandle"
                        />
                      </div>
                      <p className="text-xs text-white/30 mt-1">We may reach out to you on X</p>
                    </div>

                    {submitError && (
                      <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                        {submitError}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-4 rounded-xl bg-[var(--primary)] text-black font-bold hover:bg-[#00E847] transition-all shadow-[0_0_30px_rgba(0,204,61,0.3)] hover:shadow-[0_0_40px_rgba(0,204,61,0.5)] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <span className="flex items-center justify-center gap-2">
                          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                          </svg>
                          Submitting...
                        </span>
                      ) : (
                        'Apply Now →'
                      )}
                    </button>
                  </form>
                </>
              )}
            </LiquidCard>
          ) : (
            // CTA for non-Pro users
            <LiquidCard className="p-8 md:p-12 text-center relative overflow-hidden">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-80 bg-[var(--primary)]/10 blur-[100px] rounded-full pointer-events-none" />
              
              <div className="relative z-10">
                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-white/40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                  </svg>
                </div>
                
                <h2 className="text-2xl md:text-3xl font-bold mb-4">
                  Become a <span className="text-flashy-green">Pro Member</span> First
                </h2>
                <p className="text-white/50 mb-8 max-w-md mx-auto">
                  The affiliate program is exclusive to Pro members. Get lifetime access and reimburse your subscription with just 3 referrals.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={handleCheckout}
                    disabled={checkoutLoading}
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[var(--primary)] text-black font-bold rounded-xl hover:bg-[#00E847] transition-all shadow-[0_0_30px_rgba(0,204,61,0.3)] hover:shadow-[0_0_40px_rgba(0,204,61,0.5)] disabled:opacity-50"
                  >
                    {checkoutLoading ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Processing...
                      </span>
                    ) : (
                      'Get Pro for $29 →'
                    )}
                  </button>
                </div>
                
                <p className="mt-6 text-xs text-white/30">
                  One-time payment • Lifetime access • Instant affiliate eligibility
                </p>
              </div>
            </LiquidCard>
          )}
        </div>
      </section>

      {/* FAQ */}
      <section className="relative px-6 py-20">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
            Affiliate <span className="text-flashy-green">FAQ</span>
          </h2>

          <div className="space-y-4">
            {[
              {
                q: "How much can I earn?",
                a: "You earn 40% commission on every sale. With the lifetime plan at $25 (after your referral's $4 discount), that's $10 per sale. There's no cap on earnings!"
              },
              {
                q: "When do I get paid?",
                a: "Payouts are processed weekly. We'll send your earnings via your preferred payment method (PayPal, Stripe, Wise, or Revolut) every week."
              },
              {
                q: "How do I track my referrals?",
                a: "Once approved, you'll receive a unique promo code. We track all sales made with your code and will provide you with regular updates on your earnings."
              },
              {
                q: "Is there a minimum payout?",
                a: "No minimum! Even if you refer just one person, we'll send you your $10 commission."
              },
              {
                q: "Can I promote on social media?",
                a: "Absolutely! Share your code on Twitter/X, YouTube, TikTok, newsletters, or anywhere your audience is. Just be transparent that it's an affiliate link."
              }
            ].map((faq, i) => (
              <details key={i} className="group liquid-card p-6 cursor-pointer">
                <summary className="flex items-center justify-between font-bold text-lg list-none">
                    {faq.q}
                    <span className="text-white/40 group-open:rotate-180 transition-transform">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </span>
                  </summary>
                  <p className="mt-4 text-white/60 leading-relaxed">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative px-6 py-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <span className="font-bold text-sm tracking-widest text-white/40">NICHES HUNTER</span>
          <div className="flex items-center gap-6 text-xs text-white/30">
            <Link href="/niches" className="hover:text-white transition-colors">Niches</Link>
            <Link href="/blog" className="hover:text-white transition-colors">Blog</Link>
            <Link href="/about" className="hover:text-white transition-colors">About</Link>
          </div>
          <span className="text-xs text-white/20">© 2026 Niches Hunter. All rights reserved.</span>
        </div>
      </footer>
    </main>
  )
}
