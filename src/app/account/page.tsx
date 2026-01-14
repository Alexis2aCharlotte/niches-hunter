'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import LiquidCard from '@/components/LiquidCard'

interface User {
  id: string
  email: string
  stripeCustomerId: string
}

interface Subscription {
  id: string
  status: string
  planType: 'monthly' | 'lifetime' | null
  currentPeriodStart: string | null
  currentPeriodEnd: string | null
  cancelAtPeriodEnd: boolean
}

interface SavedNiche {
  niche_id: string
  saved_at: string
  title?: string
  category?: string
  score?: number
}

export default function AccountPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [savedNiches, setSavedNiches] = useState<SavedNiche[]>([])
  const [loading, setLoading] = useState(true)
  const [cancelLoading, setCancelLoading] = useState(false)
  const [portalLoading, setPortalLoading] = useState(false)
  const [showCancelConfirm, setShowCancelConfirm] = useState(false)
  const [showCancelSuccess, setShowCancelSuccess] = useState(false)

  useEffect(() => {
    async function fetchUserData() {
      try {
        // Récupérer les infos utilisateur
        const userRes = await fetch('/api/user/me')
        const userData = await userRes.json()

        if (!userData.user) {
          router.push('/login')
          return
        }

        setUser(userData.user)
        setSubscription(userData.subscription)

        // Récupérer les niches sauvegardées
        const nichesRes = await fetch('/api/user/saved-niches', {
          credentials: 'include', // Important pour mobile Safari
        })
        const nichesData = await nichesRes.json()
        setSavedNiches(nichesData.savedNiches || [])
      } catch (error) {
        console.error('Error fetching user data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [router])

  const handleCancelSubscription = async () => {
    setCancelLoading(true)
    try {
      const res = await fetch('/api/user/subscription/cancel', {
        method: 'POST',
      })
      const data = await res.json()

      if (data.success) {
        setSubscription(prev => prev ? { ...prev, cancelAtPeriodEnd: true } : null)
        setShowCancelConfirm(false)
        setShowCancelSuccess(true)
        setTimeout(() => setShowCancelSuccess(false), 5000)
      }
    } catch (error) {
      console.error('Error canceling subscription:', error)
    } finally {
      setCancelLoading(false)
    }
  }

  const handleOpenPortal = async () => {
    setPortalLoading(true)
    try {
      const res = await fetch('/api/stripe/portal', {
        method: 'POST',
      })
      const data = await res.json()

      if (data.url) {
        window.location.href = data.url
      } else {
        console.error('No portal URL returned:', data.error)
      }
    } catch (error) {
      console.error('Error opening portal:', error)
    } finally {
      setPortalLoading(false)
    }
  }

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/')
  }

  const handleRemoveSavedNiche = async (nicheId: string) => {
    try {
      await fetch('/api/user/saved-niches', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nicheId }),
        credentials: 'include', // Important pour mobile Safari
      })
      setSavedNiches(prev => prev.filter(n => n.niche_id !== nicheId))
    } catch (error) {
      console.error('Error removing niche:', error)
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen text-white font-sans selection:bg-[var(--primary)] selection:text-black">
        <Navbar />
        
        {/* Ambient Glows */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-[var(--primary)]/5 blur-[150px] rounded-full" />
          <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-purple-500/5 blur-[120px] rounded-full" />
        </div>

        <section className="relative pt-32 pb-20 px-6">
          <div className="max-w-5xl mx-auto">
            {/* Header Skeleton */}
            <div className="mb-12 text-center">
              <div className="h-12 w-64 mx-auto bg-white/5 rounded-lg animate-pulse mb-3" />
              <div className="h-4 w-48 mx-auto bg-white/5 rounded animate-pulse" />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Card Skeletons */}
              <div className="liquid-card p-8">
                <div className="h-6 w-32 bg-white/5 rounded animate-pulse mb-6" />
                <div className="space-y-4">
                  <div className="h-4 w-full bg-white/5 rounded animate-pulse" />
                  <div className="h-4 w-3/4 bg-white/5 rounded animate-pulse" />
                  <div className="h-4 w-1/2 bg-white/5 rounded animate-pulse" />
                </div>
              </div>
              <div className="liquid-card p-8">
                <div className="h-6 w-32 bg-white/5 rounded animate-pulse mb-6" />
                <div className="space-y-3">
                  <div className="h-14 w-full bg-white/5 rounded-xl animate-pulse" />
                  <div className="h-14 w-full bg-white/5 rounded-xl animate-pulse" />
                </div>
              </div>
            </div>

            {/* Saved Niches Skeleton */}
            <div className="liquid-card mt-6 p-8">
              <div className="h-6 w-40 bg-white/5 rounded animate-pulse mb-6" />
              <div className="h-32 w-full bg-white/5 rounded-xl animate-pulse" />
            </div>
          </div>
        </section>
      </main>
    )
  }

  if (!user) {
    return null
  }

  return (
    <main className="min-h-screen text-white font-sans selection:bg-[var(--primary)] selection:text-black">
      <Navbar />

      {/* Ambient Glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-[var(--primary)]/5 blur-[150px] rounded-full" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-purple-500/5 blur-[120px] rounded-full" />
      </div>

      <section className="relative pt-32 pb-20 px-6">
        <div className="max-w-5xl mx-auto">
          
          {/* Header */}
          <div className="mb-12 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-3">My Account</h1>
            <p className="text-white/40 text-sm">{user.email}</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            
            {/* Subscription Card */}
            <LiquidCard className="p-8">
              <h2 className="text-xl font-bold mb-6">
                Subscription
              </h2>

              <div className="space-y-5">
                <div className="flex justify-between items-center">
                  <span className="text-white/50 text-sm">Status</span>
                  <span className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                    subscription?.status === 'active' 
                      ? 'bg-[var(--primary)]/20 text-[var(--primary)] border border-[var(--primary)]/30' 
                      : 'bg-red-500/20 text-red-400 border border-red-500/30'
                  }`}>
                    {subscription?.cancelAtPeriodEnd ? 'Canceling' : subscription?.status || 'None'}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-white/50 text-sm">Plan</span>
                  <span className="text-white font-semibold">
                    {subscription?.planType === 'lifetime' ? 'Pro Lifetime' : 'Pro Monthly'}
                  </span>
                </div>

                {subscription?.currentPeriodStart && (
                  <div className="flex justify-between items-center">
                    <span className="text-white/50 text-sm">Payment date</span>
                    <span className="text-white font-mono text-sm">
                      {new Date(subscription.currentPeriodStart).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                )}

                {subscription?.planType !== 'lifetime' && subscription?.currentPeriodEnd && (
                  <div className="flex justify-between items-center">
                    <span className="text-white/50 text-sm">
                      {subscription.cancelAtPeriodEnd ? 'Access until' : 'Renewal date'}
                    </span>
                    <span className="text-white font-mono text-sm">
                      {new Date(subscription.currentPeriodEnd).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                )}

                <div className="pt-5 border-t border-white/10 space-y-3">
                  {subscription?.planType === 'lifetime' ? (
                    <div className="text-center py-2">
                      <p className="text-xs text-[var(--primary)] font-semibold mb-1">✨ Lifetime Access</p>
                      <p className="text-xs text-white/40">You have permanent access to all premium features</p>
                    </div>
                  ) : (
                    <>
                      {/* Bouton Manage Subscription - Portail Stripe */}
                      <button
                        onClick={handleOpenPortal}
                        disabled={portalLoading}
                        className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[var(--primary)]/10 text-[var(--primary)] text-sm font-semibold hover:bg-[var(--primary)]/20 transition-all disabled:opacity-50"
                      >
                        {portalLoading ? (
                          <>
                            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                            Opening...
                          </>
                        ) : (
                          <>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            Manage Subscription
                          </>
                        )}
                      </button>

                      {subscription?.cancelAtPeriodEnd ? (
                        <p className="text-xs text-white/40 leading-relaxed text-center">
                          Your subscription will end on the date above. You'll keep access until then.
                        </p>
                      ) : (
                        <button
                          onClick={() => setShowCancelConfirm(true)}
                          className="w-full text-red-400/70 hover:text-red-400 text-xs font-medium transition-colors text-center"
                        >
                          Cancel subscription →
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
            </LiquidCard>

            {/* Account Actions */}
            <LiquidCard className="p-8">
              <h2 className="text-xl font-bold mb-6">
                Quick Actions
              </h2>

              <div className="space-y-3">
                <Link
                  href="/niches"
                  className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 transition-all group"
                >
                  <span className="flex items-center gap-3">
                    <span className="text-xl">🎯</span>
                    <span className="font-medium">Browse Niches</span>
                  </span>
                  <span className="text-white/30 group-hover:text-[var(--primary)] group-hover:translate-x-1 transition-all">→</span>
                </Link>

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-red-500/10 hover:border-red-500/20 transition-all text-left group"
                >
                  <span className="flex items-center gap-3">
                    <span className="text-xl">🚪</span>
                    <span className="font-medium group-hover:text-red-400 transition-colors">Log out</span>
                  </span>
                  <span className="text-white/30 group-hover:text-red-400 group-hover:translate-x-1 transition-all">→</span>
                </button>
              </div>
            </LiquidCard>
          </div>

          {/* Saved Niches */}
          <LiquidCard className="mt-6 p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold flex items-center gap-3">
                <span className="w-10 h-10 rounded-xl bg-[var(--primary)]/20 flex items-center justify-center">
                  <svg className="w-5 h-5 text-[var(--primary)]" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
                  </svg>
                </span>
                Saved Niches
              </h2>
              <span className="px-3 py-1 rounded-full bg-white/10 text-xs font-mono text-white/50">
                {savedNiches.length} saved
              </span>
            </div>

            {savedNiches.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-white/5 flex items-center justify-center">
                  <svg className="w-8 h-8 text-white/20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
                  </svg>
                </div>
                <p className="text-white/40 mb-6 text-sm">No saved niches yet</p>
                <Link
                  href="/niches"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--primary)] text-black text-sm font-bold rounded-xl hover:bg-[#00E847] transition-all shadow-[0_0_20px_rgba(0,204,61,0.3)]"
                >
                  Explore Niches →
                </Link>
              </div>
            ) : (
              <div className="grid gap-3">
                {savedNiches.map((niche) => (
                  <div
                    key={niche.niche_id}
                    className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/8 transition-all group"
                  >
                    <Link
                      href={`/niches/${niche.niche_id}`}
                      className="flex-1 hover:text-[var(--primary)] transition-colors"
                    >
                      <span className="font-mono text-[var(--primary)] text-sm">#{niche.niche_id}</span>
                      {niche.title && (
                        <span className="text-white/60 ml-3">{niche.title}</span>
                      )}
                    </Link>
                    <div className="flex items-center gap-4">
                      <span className="text-xs text-white/30 font-mono">
                        {new Date(niche.saved_at).toLocaleDateString()}
                      </span>
                      <button
                        onClick={() => handleRemoveSavedNiche(niche.niche_id)}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-white/30 hover:text-red-400 hover:bg-red-500/10 transition-all"
                      >
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M18 6L6 18M6 6l12 12"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </LiquidCard>
        </div>
      </section>

      {/* Success Message */}
      {showCancelSuccess && (
        <div className="fixed top-6 right-6 z-50 animate-slide-up">
          <div className="liquid-card p-4 flex items-center gap-3 bg-green-500/10 border-green-500/30">
            <span className="text-2xl">✓</span>
            <div>
              <div className="font-bold text-green-400">Subscription Canceled</div>
              <div className="text-sm text-white/60">You'll keep access until the end of your billing period</div>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Confirmation Modal */}
      {showCancelConfirm && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="liquid-card p-1 rounded-3xl max-w-md w-full">
            <div className="bg-[#0a0a0a] rounded-[22px] p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 blur-[60px] rounded-full pointer-events-none" />
              
              <h3 className="text-2xl font-bold mb-4 relative z-10">Cancel Subscription?</h3>
              <p className="text-white/50 mb-8 text-sm leading-relaxed relative z-10">
                You'll keep access until the end of your billing period. After that, all premium niches will be locked.
              </p>
              
              <div className="flex gap-3 relative z-10">
                <button
                  onClick={() => setShowCancelConfirm(false)}
                  className="flex-1 py-3.5 rounded-xl font-semibold bg-white/10 hover:bg-white/15 transition-all text-sm"
                >
                  Keep Plan
                </button>
                <button
                  onClick={handleCancelSubscription}
                  disabled={cancelLoading}
                  className="flex-1 py-3.5 rounded-xl font-semibold bg-red-500 text-white hover:bg-red-600 transition-all disabled:opacity-50 text-sm"
                >
                  {cancelLoading ? 'Processing...' : 'Cancel'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
