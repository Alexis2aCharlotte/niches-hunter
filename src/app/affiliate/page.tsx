'use client'

import { useState, useEffect, useCallback, memo } from 'react'
import Link from 'next/link'
import LiquidCard from '@/components/LiquidCard'

// Composant FAQ mémorisé pour éviter les re-renders
const FAQItem = memo(function FAQItem({ question, answer }: { question: string; answer: string }) {
  return (
    <details className="group liquid-card p-6 cursor-pointer">
      <summary className="flex items-center justify-between font-bold text-lg list-none">
        {question}
        <span className="text-white/40 group-open:rotate-180 transition-transform">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </span>
      </summary>
      <p className="mt-4 text-white/60 leading-relaxed">{answer}</p>
    </details>
  )
})

export default function AffiliatePage() {
  // Auth state groupé
  const [authState, setAuthState] = useState({
    isPro: false,
    userEmail: '',
    isLoading: true,
    affiliateStatus: 'none' as 'none' | 'pending' | 'approved',
    affiliateCode: null as string | null,
  })
  
  // Form state groupé
  const [formState, setFormState] = useState({
    firstName: '',
    lastName: '',
    paymentMethod: '',
    twitterHandle: '',
    promotionPlatform: '',
    promotionUrl: '',
    audienceSize: '',
    externalEmail: '',
  })
  
  // UI state
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [checkoutLoading, setCheckoutLoading] = useState(false)
  const [codeCopied, setCodeCopied] = useState(false)

  // Helper pour update le form
  const updateForm = useCallback((field: string, value: string) => {
    setFormState(prev => ({ ...prev, [field]: value }))
  }, [])

  useEffect(() => {
    async function checkAuth() {
      try {
        // Fetch auth en premier
        const res = await fetch('/api/auth/me', { credentials: 'include' })
        const data = await res.json()
        
        const isPro = data.subscription?.status === 'active'
        const userEmail = data.user?.email || ''
        
        // Si Pro, fetch affiliate status en parallèle
        if (isPro) {
          const affiliateRes = await fetch('/api/affiliate/me')
          const affiliateData = await affiliateRes.json()
          
          setAuthState({
            isPro,
            userEmail,
            isLoading: false,
            affiliateStatus: affiliateData.affiliate?.status || 'none',
            affiliateCode: affiliateData.affiliate?.promo_code || null,
          })
        } else {
          setAuthState({
            isPro: false,
            userEmail,
            isLoading: false,
            affiliateStatus: 'none',
            affiliateCode: null,
          })
        }
      } catch {
        setAuthState(prev => ({ ...prev, isPro: false, isLoading: false }))
      }
    }
    checkAuth()
  }, [])

  // Destructure pour faciliter l'usage
  const { isPro, userEmail, isLoading, affiliateStatus, affiliateCode } = authState
  const { firstName, lastName, paymentMethod, twitterHandle, promotionPlatform, promotionUrl, audienceSize, externalEmail } = formState

  const handleCheckout = useCallback(async () => {
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
  }, [])

  const handleSubmit = useCallback(async (e: React.FormEvent, isExternal: boolean = false) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitError('')

    const emailToUse = isExternal ? externalEmail : userEmail

    try {
      const response = await fetch('/api/affiliate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName,
          lastName,
          email: emailToUse,
          paymentMethod,
          twitterHandle,
          affiliateType: isExternal ? 'external' : 'pro',
          promotionPlatform: isExternal ? promotionPlatform : null,
          promotionUrl: isExternal ? promotionUrl : null,
          audienceSize: isExternal ? audienceSize : null,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit')
      }

      setSubmitSuccess(true)
      setAuthState(prev => ({ ...prev, affiliateStatus: 'pending' }))
    } catch (err: any) {
      setSubmitError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }, [firstName, lastName, paymentMethod, twitterHandle, promotionPlatform, promotionUrl, audienceSize, externalEmail, userEmail])

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
      {/* Background Effects - Hidden on mobile for performance */}
      <div className="fixed inset-0 pointer-events-none hidden md:block">
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
              <div className="absolute top-0 right-0 w-24 h-24 bg-[var(--primary)]/10 blur-[50px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none hidden md:block" />
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
                {/* 97 users sur 150 = 65% */}
                <div 
                  className="h-full bg-gradient-to-r from-[var(--primary)] to-[#00E847] rounded-full transition-all duration-1000"
                  style={{ width: '65%' }}
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
              <span className="text-[var(--primary)] font-bold">97 users</span> already joined • Next commission increase at 100 users
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
              <div className="absolute top-0 right-0 w-40 h-40 bg-[var(--primary)]/20 blur-[80px] rounded-full pointer-events-none hidden md:block" />
              
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
              <div className="absolute top-0 right-0 w-40 h-40 bg-amber-500/20 blur-[80px] rounded-full pointer-events-none hidden md:block" />
              
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
              <div className="absolute top-0 right-0 w-40 h-40 bg-[var(--primary)]/20 blur-[80px] rounded-full pointer-events-none hidden md:block" />
              
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
                          onChange={(e) => updateForm('firstName', e.target.value)}
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
                          onChange={(e) => updateForm('lastName', e.target.value)}
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
                        onChange={(e) => updateForm('paymentMethod', e.target.value)}
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
                          onChange={(e) => updateForm('twitterHandle', e.target.value.replace('@', ''))}
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
            // Form for external affiliates (non-Pro users)
            <LiquidCard className="p-8 md:p-10 relative overflow-hidden border-2 border-[var(--primary)]/30">
              <div className="absolute top-0 right-0 w-40 h-40 bg-[var(--primary)]/20 blur-[80px] rounded-full pointer-events-none hidden md:block" />
              
              {submitSuccess ? (
                <div className="text-center py-8 relative z-10">
                  <div className="w-16 h-16 rounded-full bg-[var(--primary)]/20 flex items-center justify-center mx-auto mb-6">
                    <svg className="w-8 h-8 text-[var(--primary)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-[var(--primary)] mb-2">Application Received!</h3>
                  <p className="text-white/60 mb-6">
                    We&apos;ll review your application and send your unique affiliate code to <span className="text-white font-medium">{externalEmail}</span> within 24-48 hours.
                  </p>
                  <a 
                    href="https://x.com/nicheshunter" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white/80 hover:bg-white/10 hover:text-white transition-all"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                    Follow @nicheshunter for updates
                  </a>
                </div>
              ) : (
                <>
                  <div className="mb-8 relative z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--primary)]/20 text-[var(--primary)] text-xs font-bold mb-4">
                      <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary)]" />
                      EXTERNAL AFFILIATE
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold mb-2">Apply as External Affiliate</h2>
                    <p className="text-white/50">Share Niches Hunter with your audience and earn 40% commission on every sale.</p>
                  </div>

                  <form onSubmit={(e) => handleSubmit(e, true)} className="space-y-6 relative z-10">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-white/70 mb-2">First Name *</label>
                        <input
                          type="text"
                          value={firstName}
                          onChange={(e) => updateForm('firstName', e.target.value)}
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
                          onChange={(e) => updateForm('lastName', e.target.value)}
                          required
                          className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-[var(--primary)]/50 focus:outline-none transition-colors"
                          placeholder="Doe"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-white/70 mb-2">Email *</label>
                      <input
                        type="email"
                        value={externalEmail}
                        onChange={(e) => updateForm('externalEmail', e.target.value)}
                        required
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-[var(--primary)]/50 focus:outline-none transition-colors"
                        placeholder="you@example.com"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-white/70 mb-2">Promotion Platform *</label>
                      <select
                        value={promotionPlatform}
                        onChange={(e) => updateForm('promotionPlatform', e.target.value)}
                        required
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-[var(--primary)]/50 focus:outline-none transition-colors appearance-none cursor-pointer"
                      >
                        <option value="" className="bg-[#111]">Select your main platform</option>
                        <option value="twitter" className="bg-[#111]">𝕏 Twitter</option>
                        <option value="reddit" className="bg-[#111]">Reddit</option>
                        <option value="youtube" className="bg-[#111]">YouTube</option>
                        <option value="blog" className="bg-[#111]">Blog</option>
                        <option value="newsletter" className="bg-[#111]">Newsletter</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-white/70 mb-2">Profile / Platform URL *</label>
                      <input
                        type="url"
                        value={promotionUrl}
                        onChange={(e) => updateForm('promotionUrl', e.target.value)}
                        required
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-[var(--primary)]/50 focus:outline-none transition-colors"
                        placeholder="https://twitter.com/yourhandle"
                      />
                      <p className="text-xs text-white/30 mt-1">Link to your profile or platform where you&apos;ll promote</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-white/70 mb-2">Audience Size</label>
                      <select
                        value={audienceSize}
                        onChange={(e) => updateForm('audienceSize', e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-[var(--primary)]/50 focus:outline-none transition-colors appearance-none cursor-pointer"
                      >
                        <option value="" className="bg-[#111]">Select your audience size</option>
                        <option value="500-1K" className="bg-[#111]">500 - 1K followers</option>
                        <option value="1K-5K" className="bg-[#111]">1K - 5K followers</option>
                        <option value="5K-10K" className="bg-[#111]">5K - 10K followers</option>
                        <option value="10K-50K" className="bg-[#111]">10K - 50K followers</option>
                        <option value="50K+" className="bg-[#111]">50K+ followers</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-white/70 mb-2">
                        {promotionPlatform === 'twitter' ? '𝕏 Twitter' : 
                         promotionPlatform === 'youtube' ? 'YouTube' :
                         promotionPlatform === 'reddit' ? 'Reddit' :
                         promotionPlatform === 'newsletter' ? 'Newsletter' :
                         promotionPlatform === 'blog' ? 'Blog' : 'Platform'} Handle <span className="text-white/30">(optional)</span>
                      </label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30">@</span>
                        <input
                          type="text"
                          value={twitterHandle}
                          onChange={(e) => updateForm('twitterHandle', e.target.value.replace('@', ''))}
                          className="w-full pl-8 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-[var(--primary)]/50 focus:outline-none transition-colors"
                          placeholder="yourhandle"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-white/70 mb-2">Preferred Payment Method *</label>
                      <select
                        value={paymentMethod}
                        onChange={(e) => updateForm('paymentMethod', e.target.value)}
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

                    <p className="text-xs text-white/30 text-center">
                      Applications are reviewed within 24-48 hours
                    </p>
                  </form>
                </>
              )}
            </LiquidCard>
          )}
        </div>
      </section>

      {/* FAQ - Composants mémorisés pour performance */}
      <section className="relative px-6 py-20">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
            Affiliate <span className="text-flashy-green">FAQ</span>
          </h2>

          <div className="space-y-4">
            <FAQItem 
              question="How much can I earn?"
              answer="You earn 40% commission on every sale. With the lifetime plan at $25 (after your referral's $4 discount), that's $10 per sale. There's no cap on earnings!"
            />
            <FAQItem 
              question="When do I get paid?"
              answer="Payouts are processed weekly. We'll send your earnings via your preferred payment method (PayPal, Stripe, Wise, or Revolut) every week."
            />
            <FAQItem 
              question="How do I track my referrals?"
              answer="Once approved, you'll receive a unique promo code. We track all sales made with your code and will provide you with regular updates on your earnings."
            />
            <FAQItem 
              question="Is there a minimum payout?"
              answer="No minimum! Even if you refer just one person, we'll send you your $10 commission."
            />
            <FAQItem 
              question="Can I promote on social media?"
              answer="Absolutely! Share your code on Twitter/X, YouTube, TikTok, newsletters, or anywhere your audience is. Just be transparent that it's an affiliate link."
            />
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
