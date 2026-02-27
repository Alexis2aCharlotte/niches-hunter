'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import LiquidCard from '@/components/LiquidCard'

export default function PricingPage() {
  const [isLifetime, setIsLifetime] = useState(true)
  const [checkoutLoading, setCheckoutLoading] = useState(false)

  // Reset loading state when user comes back (browser back button)
  useEffect(() => {
    const handlePageShow = (e: PageTransitionEvent) => {
      if (e.persisted) {
        setCheckoutLoading(false)
      }
    }
    window.addEventListener('pageshow', handlePageShow)
    return () => window.removeEventListener('pageshow', handlePageShow)
  }, [])

  // Pricing
  const monthly = {
    price: 9.99,
  }
  const lifetime = {
    price: 29,
  }

  const currentPlan = isLifetime ? lifetime : monthly

  const handleCheckout = async () => {
    setCheckoutLoading(true)
    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          nicheId: 'pricing-page',
          mode: isLifetime ? 'lifetime' : 'monthly'
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

  const features = {
    free: [
      { name: 'Daily newsletter on trend', included: true },
      { name: 'Niche Roulette', included: true },
      { name: 'Revenue Estimator', included: true },
    ],
    // Features mises en avant pour Pro (highlights)
    proHighlights: [
      { 
        name: '99+ Niches Analyzed', 
        description: '',
        icon: '📊'
      },
      { 
        name: 'Save & track niches', 
        description: '',
        icon: '💾'
      },
      { 
        name: 'TikTok Spot', 
        description: 'Discover viral app trends',
        icon: '🔥'
      },
      { 
        name: 'AI Niche Validator', 
        description: 'Unlimited AI-powered validation',
        icon: '🤖'
      },
      { 
        name: 'Daily newsletter', 
        description: '3 apps/day with full analysis',
        icon: '📩'
      },
    ],
    // Autres features Pro
    proOthers: [
      'Full niche database access',
      'Niche Roulette',
      'Revenue Estimator',
      'Competitor deep-dive',
      'Priority support',
    ]
  }

  const faqs = [
    {
      q: "Can I cancel anytime?",
      a: "Yes! For monthly subscriptions, you can cancel at any time from your account page. You'll keep access until the end of your billing period. Lifetime access is forever - no cancellation needed!"
    },
    {
      q: "What payment methods do you accept?",
      a: "We accept all major credit cards (Visa, Mastercard, American Express) through Stripe's secure payment system."
    },
    {
      q: "Is there a free trial?",
      a: "We offer a free tier with limited features. You can upgrade to Pro anytime to unlock everything."
    },
    {
      q: "What's the difference between Monthly and Lifetime?",
      a: "Monthly is a recurring subscription at $9.99/month. Lifetime is a one-time payment of $29 for permanent access - no recurring fees ever! Note: lifetime access will only be available until we reach 150 users."
    },
    {
      q: "Do you offer refunds?",
      a: "Yes, we offer a 7-day money-back guarantee. If you're not satisfied, contact us within 7 days of your purchase."
    },
    {
      q: "What is the Developer API?",
      a: "The Developer API gives you programmatic access to our niche data, App Store rankings, and scored opportunities via REST endpoints. It's pay-as-you-go: you load credits starting from $10. Perfect for developers who want to integrate our data into their own tools or apps."
    },
    {
      q: "Can I use the API if I'm already a Pro subscriber?",
      a: "Yes! If you're a monthly subscriber, you'll get $5 in free API credits when you activate your API access. All new developer accounts receive $1 in free credits to get started."
    }
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
            <span className="text-xs font-mono text-[var(--primary)] uppercase tracking-wider">Launch Offer</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
            Unlock the Full <span className="text-flashy-green">Hunting Power</span>
          </h1>
          
          <p className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto mb-10">
            Get unlimited access to niche insights, AI validation, and competitor analysis. 
            Find your next profitable app idea faster.
          </p>

          {/* Toggle Monthly / Lifetime */}
          <div className="flex items-center justify-center gap-4">
            <span className={`text-sm font-medium transition-colors ${!isLifetime ? 'text-white' : 'text-white/40'}`}>
              Monthly
            </span>
            <button
              onClick={() => setIsLifetime(!isLifetime)}
              className={`relative w-16 h-8 rounded-full transition-colors ${isLifetime ? 'bg-[var(--primary)]' : 'bg-white/20'}`}
            >
              <div className={`absolute top-1 w-6 h-6 rounded-full bg-white shadow-lg transition-all ${isLifetime ? 'left-9' : 'left-1'}`} />
            </button>
            <span className={`text-sm font-medium transition-colors flex items-center gap-2 ${isLifetime ? 'text-white' : 'text-white/40'}`}>
              Lifetime
              <span className="px-2 py-0.5 rounded-full bg-[var(--primary)]/20 text-[var(--primary)] text-xs font-bold">
                BEST VALUE
              </span>
            </span>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="relative px-6 pb-20">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-6">
          
          {/* Free Plan */}
          <LiquidCard className="p-8 md:p-10 relative overflow-hidden flex flex-col h-full">
            <div className="mb-8">
              <h3 className="text-2xl font-bold mb-2">Free</h3>
              <p className="text-white/50 text-sm">Perfect to get started</p>
            </div>

            <div className="mb-8">
              <div className="flex items-baseline gap-1">
                <span className="text-5xl font-bold">$0</span>
                <span className="text-white/40">/forever</span>
              </div>
            </div>

            <div className="space-y-4 mb-8">
              {features.free.map((feature, i) => (
                <div key={i} className="flex items-center gap-3">
                  {feature.included ? (
                    <div className="w-5 h-5 rounded-full bg-[var(--primary)]/20 flex items-center justify-center">
                      <svg className="w-3 h-3 text-[var(--primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  ) : (
                    <div className="w-5 h-5 rounded-full bg-white/5 flex items-center justify-center">
                      <svg className="w-3 h-3 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </div>
                  )}
                  <span className={feature.included ? 'text-white/80' : 'text-white/30'}>
                    {feature.name}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-auto pt-6">
              <Link
                href="/"
                className="block w-full py-4 text-center rounded-xl bg-white/10 text-white font-bold hover:bg-white/15 transition-all"
              >
                Get Started Free
              </Link>
            </div>
          </LiquidCard>

          {/* Pro Plan */}
          <LiquidCard className="p-8 md:p-10 relative overflow-hidden border-2 border-[var(--primary)]/30 flex flex-col h-full">
            {/* Glow effect - Hidden on mobile */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-[var(--primary)]/20 blur-[80px] rounded-full pointer-events-none hidden md:block" />
            
            {/* Badge - only show for lifetime */}
            {isLifetime && (
              <div className="absolute top-4 right-4">
                <span className="px-3 py-1 rounded-full bg-[var(--primary)] text-black text-xs font-bold animate-pulse">
  LIFETIME DEAL
                </span>
              </div>
            )}

            <div className="mb-6">
              <h3 className="text-2xl font-bold mb-2 flex items-center gap-2">
                Pro {isLifetime ? 'Lifetime' : 'Monthly'}
                <span className="text-lg">{isLifetime ? '♾️' : '📅'}</span>
              </h3>
              <p className="text-white/50 text-sm">
                {isLifetime ? 'One-time payment, forever access' : 'Flexible monthly subscription'}
              </p>
            </div>

            <div className="mb-6">
              {isLifetime ? (
                <>
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-bold text-[var(--primary)]">
                      ${lifetime.price}
                    </span>
                  </div>
                  <p className="text-sm text-white/40 mt-2">One-time payment</p>
                </>
              ) : (
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-bold text-[var(--primary)]">
                    ${monthly.price}
                  </span>
                  <span className="text-white/40">/month</span>
                </div>
              )}
            </div>

            {/* HIGHLIGHTS - features clés en texte */}
            <div className="space-y-3 mb-6">
              {features.proHighlights.map((feature, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="text-[var(--primary)] text-lg mt-0.5">✓</span>
                  <div>
                    <span className="font-bold text-white">{feature.name}</span>
                    {feature.description && <span className="text-white/50"> - {feature.description}</span>}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-auto pt-6">
              <p className="text-sm text-white/40 text-center mb-6">
                + {features.proOthers.join(' • ')}
              </p>

              <button
                onClick={handleCheckout}
                disabled={checkoutLoading}
                className="block w-full py-4 text-center rounded-xl bg-[var(--primary)] text-black font-bold hover:bg-[#00E847] transition-all shadow-[0_0_30px_rgba(0,204,61,0.3)] hover:shadow-[0_0_40px_rgba(0,204,61,0.5)] disabled:opacity-50"
              >
                {checkoutLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Processing...
                  </span>
                ) : (
                  isLifetime ? 'Get Lifetime Access →' : 'Start Monthly →'
                )}
              </button>
            </div>
          </LiquidCard>

          {/* Developer API Plan */}
          <LiquidCard className="p-8 md:p-10 relative overflow-hidden flex flex-col h-full">
            <div className="absolute top-4 right-4">
              <span className="px-3 py-1 rounded-full bg-[var(--primary)]/20 text-[var(--primary)] text-xs font-bold">
                API
              </span>
            </div>

            <div className="mb-6">
              <h3 className="text-2xl font-bold mb-2 flex items-center gap-2">
                Developer API
              </h3>
              <p className="text-white/50 text-sm">
                Access raw data, pay as you go
              </p>
            </div>

            <div className="mb-6">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-[var(--primary)]">
                  Pay as you go
                </span>
              </div>
            </div>

            <div className="space-y-3 mb-6">
              {[
                { name: 'REST API access', description: '' },
                { name: '160+ niches data', description: 'Full analysis & insights' },
                { name: 'App Store rankings', description: 'Multi-country data' },
                { name: 'Scored opportunities', description: 'Filtered & ranked apps' },
                { name: 'Usage dashboard', description: 'Track your consumption' },
              ].map((feature, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="text-[var(--primary)] text-lg mt-0.5">✓</span>
                  <div>
                    <span className="font-bold text-white">{feature.name}</span>
                    {feature.description && <span className="text-white/50"> - {feature.description}</span>}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-auto pt-6">
              <p className="text-sm text-white/40 text-center mb-6">
                + Full documentation • Rate limits • Credit system
              </p>

              <Link
                href="/developer"
                className="block w-full py-4 text-center rounded-xl bg-white/10 text-white font-bold hover:bg-white/15 transition-all"
              >
                Get API Key →
              </Link>
            </div>
          </LiquidCard>
        </div>

        {/* Trust badges */}
        <div className="max-w-3xl mx-auto mt-12 flex flex-wrap items-center justify-center gap-6 text-sm text-white/40">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            Secure payment via Stripe
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            7-day money-back guarantee
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            {isLifetime ? 'Forever access' : 'Cancel anytime'}
          </div>
        </div>
      </section>

      {/* Price Timeline */}
      <section className="relative px-6 py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">
            Price <span className="text-flashy-green">Timeline</span>
          </h2>
          <LiquidCard className="p-8 text-center">
            <p className="text-white/60 mb-6">
              At <span className="text-white font-bold">150 users</span>, lifetime access goes away <span className="text-red-400 font-bold">forever</span>. The only option will be a monthly subscription.
            </p>
            
            {/* Timeline steps */}
            <div className="flex flex-col md:flex-row items-stretch gap-4 mb-6">
              {/* Step 1 - Done */}
              <div className="flex-1 rounded-xl bg-white/5 border border-white/10 p-5 opacity-50">
                <div className="text-xs text-white/40 uppercase tracking-wider mb-2">0 to 50 users</div>
                <div className="text-2xl font-bold text-white/40 line-through">$19</div>
                <div className="text-xs text-white/30 mt-1">Lifetime • Sold out</div>
              </div>
              
              {/* Step 2 - Current */}
              <div className="flex-1 rounded-xl bg-[var(--primary)]/10 border-2 border-[var(--primary)]/40 p-5 relative">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-[var(--primary)] text-black text-[10px] font-bold uppercase">
                  Current
                </div>
                <div className="text-xs text-[var(--primary)] uppercase tracking-wider mb-2">50 to 150 users</div>
                <div className="text-2xl font-bold text-[var(--primary)]">$29</div>
                <div className="text-xs text-white/50 mt-1">Lifetime • One-time payment</div>
              </div>
              
              {/* Step 3 - Future */}
              <div className="flex-1 rounded-xl bg-white/5 border border-white/10 border-dashed p-5">
                <div className="text-xs text-white/40 uppercase tracking-wider mb-2">150+ users</div>
                <div className="text-2xl font-bold text-white/40">Monthly only</div>
                <div className="text-xs text-white/30 mt-1">No more lifetime deal</div>
              </div>
            </div>
            
            {/* Progress bar */}
            <div className="relative">
              <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-[var(--primary)] to-[#00E847] rounded-full transition-all duration-1000"
                  style={{ width: '78%' }}
                />
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-xs text-white/30">0</span>
                <span className="text-xs text-[var(--primary)] font-bold">117 users</span>
                <span className="text-xs text-white/40">150</span>
              </div>
            </div>
            
            <p className="text-sm text-white/50 mt-5">
              <span className="text-[var(--primary)] font-bold">33 spots left</span> before lifetime access is gone forever.
            </p>
          </LiquidCard>
        </div>
      </section>

      {/* Feature Comparison */}
      <section className="relative px-6 py-20 border-t border-white/5">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Compare <span className="text-flashy-green">Plans</span>
          </h2>

          <LiquidCard className="overflow-hidden overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left p-6 text-white/50 font-medium">Features</th>
                  <th className="p-6 text-center font-bold">Free</th>
                  <th className="p-6 text-center font-bold text-[var(--primary)]">Pro</th>
                  <th className="p-6 text-center font-bold text-[var(--primary)]">Developer API</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { feature: 'Daily newsletter', free: 'On trend', pro: 'Full analysis', dev: 'On trend' },
                  { feature: 'Niche Roulette', free: '✓', pro: '✓', dev: '✗' },
                  { feature: 'Revenue Estimator', free: '✓', pro: '✓', dev: '✗' },
                  { feature: '160+ Niches Analyzed', free: '✗', pro: '✓', dev: 'Via API' },
                  { feature: 'Save & track niches', free: '✗', pro: '✓', dev: '✗' },
                  { feature: 'TikTok Spot', free: '✗', pro: '✓', dev: 'Via API' },
                  { feature: 'AI Niche Validator', free: '✗', pro: 'Unlimited', dev: '✗' },
                  { feature: 'Full niche database', free: '✗', pro: '✓', dev: 'Via API' },
                  { feature: 'App Store rankings', free: '✗', pro: '✗', dev: 'Via API' },
                  { feature: 'Scored opportunities', free: '✗', pro: '✗', dev: 'Via API' },
                  { feature: 'REST API access', free: '✗', pro: '✗', dev: '✓' },
                  { feature: 'Usage dashboard', free: '✗', pro: '✗', dev: '✓' },
                  { feature: 'Competitor deep-dive', free: '✗', pro: '✓', dev: '✗' },
                  { feature: 'Support', free: 'Community', pro: 'Priority', dev: 'Documentation' },
                ].map((row, i) => (
                  <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="p-5 text-white/70">{row.feature}</td>
                    <td className="p-5 text-center text-white/50">{row.free}</td>
                    <td className="p-5 text-center text-[var(--primary)] font-medium">{row.pro}</td>
                    <td className="p-5 text-center text-[var(--primary)] font-medium">{row.dev}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </LiquidCard>
        </div>
      </section>

      {/* FAQ */}
      <section className="relative px-6 py-20 border-t border-white/5">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Frequently Asked <span className="text-flashy-green">Questions</span>
          </h2>

          <div className="space-y-4">
            {faqs.map((faq, i) => (
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

      {/* Final CTA */}
      <section className="relative px-6 py-20">
        <div className="max-w-3xl mx-auto">
          <LiquidCard className="p-10 md:p-16 text-center relative overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-80 bg-[var(--primary)]/10 blur-[100px] rounded-full pointer-events-none hidden md:block" />
            
            <h2 className="text-3xl md:text-4xl font-bold mb-4 relative z-10">
              Ready to Find Your Next <span className="text-flashy-green">Winning Niche</span>?
            </h2>
            <p className="text-white/50 mb-8 relative z-10">
              Join 117+ indie developers already hunting profitable iOS niches.
            </p>
            
            <button
              onClick={handleCheckout}
              disabled={checkoutLoading}
              className="inline-flex items-center gap-2 px-10 py-5 bg-[var(--primary)] text-black font-bold rounded-xl hover:bg-[#00E847] transition-all shadow-[0_0_30px_rgba(0,204,61,0.3)] hover:shadow-[0_0_50px_rgba(0,204,61,0.5)] disabled:opacity-50 relative z-10"
            >
              {checkoutLoading ? 'Processing...' : (isLifetime ? 'Get Lifetime for $29 →' : 'Start Monthly for $9.99 →')}
            </button>
            
            <p className="mt-6 text-xs text-white/30 relative z-10">
              7-day money-back guarantee • {isLifetime ? 'One-time payment • Forever access' : 'Cancel anytime'}
            </p>
          </LiquidCard>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative px-6 py-10 border-t border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <span className="font-bold text-sm tracking-widest text-white/40">NICHES HUNTER</span>
          <div className="flex items-center gap-6 text-xs text-white/30">
            <Link href="/niches" className="hover:text-white transition-colors">Niches</Link>
            <Link href="/blog" className="hover:text-white transition-colors">Blog</Link>
            <Link href="/about" className="hover:text-white transition-colors">About</Link>
            <Link href="https://x.com/nicheshunter" className="hover:text-white transition-colors">Twitter</Link>
          </div>
          <span className="text-xs text-white/20">© 2026 Niches Hunter. All rights reserved.</span>
        </div>
      </footer>
    </main>
  )
}
