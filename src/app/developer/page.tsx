'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import LiquidCard from '@/components/LiquidCard'

interface WalletData {
  balance: string
  balance_cents: number
  total_spent: string
  bonus_claimed: boolean
}

interface ApiKey {
  id: string
  name: string
  key_prefix: string
  is_active: boolean
  last_used_at: string | null
  created_at: string
}

interface ApiCall {
  endpoint: string
  cost_cents: number
  created_at: string
}

export default function DeveloperPage() {
  const [loading, setLoading] = useState(true)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userEmail, setUserEmail] = useState('')
  const [planType, setPlanType] = useState<string | null>(null)

  const [authMode, setAuthMode] = useState<'login' | 'signup'>('signup')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [authLoading, setAuthLoading] = useState(false)
  const [authError, setAuthError] = useState('')

  const [wallet, setWallet] = useState<WalletData | null>(null)
  const [keys, setKeys] = useState<ApiKey[]>([])
  const [recentCalls, setRecentCalls] = useState<ApiCall[]>([])
  const [calls30d, setCalls30d] = useState(0)

  const [newKeyValue, setNewKeyValue] = useState<string | null>(null)
  const [keyCopied, setKeyCopied] = useState(false)
  const [generateLoading, setGenerateLoading] = useState(false)
  const [topupAmount, setTopupAmount] = useState('10')
  const [topupLoading, setTopupLoading] = useState(false)
  const [revokeLoading, setRevokeLoading] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState('')

  const fetchDashboard = useCallback(async () => {
    try {
      const res = await fetch('/api/developer/wallet', { credentials: 'include' })
      if (!res.ok) return
      const data = await res.json()
      setWallet(data.wallet)
      setKeys(data.keys || [])
      setRecentCalls(data.recent_calls || [])
      setCalls30d(data.stats?.calls_30d || 0)
    } catch { /* ignore */ }
  }, [])

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch('/api/auth/me', { credentials: 'include', cache: 'no-store' })
        const data = await res.json()
        if (data.user) {
          setIsLoggedIn(true)
          setUserEmail(data.user.email)
          setPlanType(data.subscription?.planType || null)
        }
      } catch { /* Not logged in */ } finally {
        setLoading(false)
      }
    }
    checkAuth()
  }, [])

  useEffect(() => {
    if (isLoggedIn) fetchDashboard()
  }, [isLoggedIn, fetchDashboard])

  // Handle ?topup=success
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get('topup') === 'success') {
      setSuccessMsg('Credits added successfully!')
      setTimeout(() => setSuccessMsg(''), 5000)
      window.history.replaceState({}, '', '/developer')
      if (isLoggedIn) fetchDashboard()
    }
  }, [isLoggedIn, fetchDashboard])

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setAuthLoading(true)
    setAuthError('')
    try {
      const endpoint = authMode === 'login' ? '/api/auth/login' : '/api/auth/signup'
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (!res.ok) {
        setAuthError(data.error || 'Something went wrong')
        return
      }
      setIsLoggedIn(true)
      setUserEmail(email)
    } catch {
      setAuthError('Something went wrong. Please try again.')
    } finally {
      setAuthLoading(false)
    }
  }

  const handleGenerateKey = async () => {
    setGenerateLoading(true)
    try {
      const res = await fetch('/api/developer/generate-key', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'Default' }),
      })
      const data = await res.json()
      if (!res.ok) {
        setAuthError(data.error || 'Failed to generate key')
        return
      }
      setNewKeyValue(data.key)
      await fetchDashboard()
    } catch {
      setAuthError('Failed to generate key')
    } finally {
      setGenerateLoading(false)
    }
  }

  const handleCopyKey = (key: string) => {
    navigator.clipboard.writeText(key)
    setKeyCopied(true)
    setTimeout(() => setKeyCopied(false), 2000)
  }

  const handleRevoke = async (keyId: string) => {
    setRevokeLoading(keyId)
    try {
      await fetch('/api/developer/revoke-key', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keyId }),
      })
      await fetchDashboard()
    } catch { /* ignore */ } finally {
      setRevokeLoading(null)
    }
  }

  const handleTopup = async () => {
    const dollars = parseFloat(topupAmount)
    if (isNaN(dollars) || dollars < 10) return
    const cents = Math.round(dollars * 100)
    setTopupLoading(true)
    try {
      const res = await fetch('/api/stripe/api-topup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount_cents: cents }),
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      }
    } catch { /* ignore */ } finally {
      setTopupLoading(false)
    }
  }

  const activeKeys = keys.filter(k => k.is_active)

  if (loading) {
    return (
      <main className="min-h-screen text-white font-sans pt-20">
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-[var(--primary)]/5 blur-[150px] rounded-full" />
        </div>
        <section className="relative pt-16 pb-20 px-6">
          <div className="max-w-4xl mx-auto">
            <div className="h-10 w-48 bg-white/5 rounded-lg animate-pulse mb-4" />
            <div className="h-6 w-72 bg-white/5 rounded animate-pulse mb-10" />
            <div className="grid md:grid-cols-3 gap-4">
              <div className="h-28 bg-white/5 rounded-2xl animate-pulse" />
              <div className="h-28 bg-white/5 rounded-2xl animate-pulse" />
              <div className="h-28 bg-white/5 rounded-2xl animate-pulse" />
            </div>
          </div>
        </section>
      </main>
    )
  }

  if (!isLoggedIn) {
    return (
      <main className="min-h-screen relative overflow-hidden text-white font-sans selection:bg-[#00CC3D] selection:text-black">
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-[var(--primary)]/5 blur-[150px] rounded-full" />
        </div>

        <section className="relative pt-32 pb-20 px-6 min-h-screen flex items-center justify-center">
          <div className="w-full max-w-md">
            <div className="liquid-card p-1 rounded-3xl">
              <div className="bg-[#050505] rounded-[22px] p-8 md:p-10 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 bg-[var(--primary)]/10 blur-[80px] rounded-full pointer-events-none" />

                <div className="text-center mb-10 relative z-10">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[var(--primary)] to-[var(--primary)] mb-6 shadow-[0_0_40px_rgba(0,204,61,0.3)]">
                    <span className="text-xl font-bold text-black">{'</>'}</span>
                  </div>
                  <h1 className="text-3xl font-bold text-white mb-2">Developer API</h1>
                  <p className="text-sm text-white/50">
                    {authMode === 'login'
                      ? 'Sign in to access your API dashboard'
                      : 'Create an account to get your API key'}
                  </p>
                </div>

                <div className={`mb-6 p-4 rounded-xl text-sm text-center relative z-10 transition-all duration-200 ${
                  authError
                    ? 'bg-red-500/10 border border-red-500/20 text-red-400 opacity-100'
                    : 'h-0 p-0 mb-0 opacity-0 overflow-hidden'
                }`}>
                  {authError || '\u00A0'}
                </div>

                <form onSubmit={handleAuth} className="space-y-5 relative z-10">
                  <div>
                    <label className="block text-xs font-medium text-white/40 uppercase tracking-wider mb-2">Email</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      required
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-white focus:border-[var(--primary)] focus:bg-white/10 focus:ring-0 outline-none transition-all placeholder:text-white/20"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-white/40 uppercase tracking-wider mb-2">Password</label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                        minLength={6}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-white focus:border-[var(--primary)] focus:bg-white/10 focus:ring-0 outline-none transition-all placeholder:text-white/20 pr-12"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                      >
                        {showPassword ? '🙈' : '👁'}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={authLoading}
                    className="w-full py-4 text-sm font-bold tracking-wider uppercase rounded-xl bg-[var(--primary)] hover:bg-[#00E847] text-black transition-all shadow-[0_0_20px_rgba(0,204,61,0.3)] hover:shadow-[0_0_30px_rgba(0,204,61,0.5)] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {authLoading ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        {authMode === 'login' ? 'Signing in...' : 'Creating account...'}
                      </span>
                    ) : (
                      authMode === 'login' ? 'Sign In' : 'Create Account'
                    )}
                  </button>
                </form>

                <div className="flex items-center gap-4 my-8 relative z-10">
                  <div className="flex-1 h-px bg-white/10" />
                  <span className="text-xs text-white/30 uppercase tracking-wider">or</span>
                  <div className="flex-1 h-px bg-white/10" />
                </div>

                <p className="text-center text-sm text-white/40 relative z-10">
                  {authMode === 'login' ? (
                    <>
                      Don&apos;t have an account?{' '}
                      <button onClick={() => { setAuthMode('signup'); setAuthError('') }} className="text-[var(--primary)] hover:underline font-medium">
                        Create one
                      </button>
                    </>
                  ) : (
                    <>
                      Already have an account?{' '}
                      <button onClick={() => { setAuthMode('login'); setAuthError('') }} className="text-[var(--primary)] hover:underline font-medium">
                        Sign in
                      </button>
                    </>
                  )}
                </p>
              </div>
            </div>

            <p className="text-center mt-6 text-xs text-white/20">
              Developer accounts include free newsletter access
            </p>
          </div>
        </section>
      </main>
    )
  }

  return (
    <main className="min-h-screen text-white font-sans selection:bg-[var(--primary)] selection:text-black pt-20">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-[var(--primary)]/5 blur-[150px] rounded-full" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-[var(--primary)]/3 blur-[120px] rounded-full" />
      </div>

      {/* Success toast */}
      {successMsg && (
        <div className="fixed top-6 right-6 z-50 animate-slide-up">
          <div className="liquid-card p-4 flex items-center gap-3 bg-green-500/10 border-green-500/30">
            <span className="text-xl">✓</span>
            <span className="font-bold text-green-400">{successMsg}</span>
          </div>
        </div>
      )}

      <section className="relative pt-8 pb-20 px-4 md:px-6">
        <div className="max-w-5xl mx-auto">

          {/* Header */}
          <div className="mb-10">
            <div className="mb-2">
              <h1 className="text-3xl md:text-4xl font-bold">
                API <span className="text-[var(--primary)]">Dashboard</span>
              </h1>
            </div>
            <p className="text-white/40 text-sm">{userEmail}</p>
            {planType && (
              <p className="text-white/30 text-xs mt-1">
                Pro {planType === 'lifetime' ? 'Lifetime' : 'Monthly'} subscriber
              </p>
            )}
          </div>

          {/* Newly generated key banner */}
          {newKeyValue && (
            <div className="mb-6 p-6 rounded-2xl bg-[var(--primary)]/10 border border-[var(--primary)]/30">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-[var(--primary)] font-bold">New API Key Generated</span>
                <span className="text-xs text-white/40">- Save it now, it won&apos;t be shown again</span>
              </div>
              <div className="flex items-center gap-3">
                <code className="flex-1 p-3 rounded-xl bg-black/40 border border-white/10 font-mono text-sm text-[var(--primary)] break-all">
                  {newKeyValue}
                </code>
                <button
                  onClick={() => handleCopyKey(newKeyValue)}
                  className={`px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    keyCopied
                      ? 'bg-[var(--primary)]/20 text-[var(--primary)]'
                      : 'bg-white/10 text-white hover:bg-white/15'
                  }`}
                >
                  {keyCopied ? 'Copied!' : 'Copy'}
                </button>
              </div>
            </div>
          )}

          {/* Stats Cards */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <LiquidCard className="p-6">
              <p className="text-xs text-white/40 uppercase tracking-wider mb-2">Balance</p>
              <p className="text-3xl font-bold text-[var(--primary)]">${wallet?.balance || '0.00'}</p>
            </LiquidCard>
            <LiquidCard className="p-6">
              <p className="text-xs text-white/40 uppercase tracking-wider mb-2">Calls (30d)</p>
              <p className="text-3xl font-bold">{calls30d}</p>
            </LiquidCard>
            <LiquidCard className="p-6">
              <p className="text-xs text-white/40 uppercase tracking-wider mb-2">Total spent</p>
              <p className="text-3xl font-bold">${wallet?.total_spent || '0.00'}</p>
            </LiquidCard>
          </div>

          <div className="grid md:grid-cols-2 gap-6">

            {/* Add Credits */}
            <LiquidCard className="p-8">
              <h2 className="text-xl font-bold mb-2">Add Credits</h2>
              <p className="text-white/40 text-sm mb-6">Minimum $10 per top-up</p>

              <div className="mb-6">
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 text-lg font-bold">$</span>
                  <input
                    type="number"
                    min="10"
                    step="1"
                    value={topupAmount}
                    onChange={(e) => setTopupAmount(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-4 text-white text-lg font-bold focus:border-[var(--primary)] focus:bg-white/10 focus:ring-0 outline-none transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                </div>
                {parseFloat(topupAmount) > 0 && parseFloat(topupAmount) < 10 && (
                  <p className="text-red-400/70 text-xs mt-2">Minimum top-up is $10</p>
                )}
              </div>

              <button
                onClick={handleTopup}
                disabled={topupLoading || isNaN(parseFloat(topupAmount)) || parseFloat(topupAmount) < 10}
                className="w-full py-4 text-center rounded-xl bg-[var(--primary)] text-black font-bold hover:bg-[#00E847] transition-all shadow-[0_0_20px_rgba(0,204,61,0.2)] hover:shadow-[0_0_30px_rgba(0,204,61,0.4)] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {topupLoading ? 'Redirecting...' : 'Top Up'}
              </button>
            </LiquidCard>

            {/* API Keys */}
            <LiquidCard className="p-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold mb-1">API Keys</h2>
                  <p className="text-white/40 text-sm">{activeKeys.length}/5 active</p>
                </div>
                {activeKeys.length < 5 && (
                  <button
                    onClick={handleGenerateKey}
                    disabled={generateLoading}
                    className="px-4 py-2 rounded-xl bg-[var(--primary)]/10 text-[var(--primary)] font-bold text-sm hover:bg-[var(--primary)]/20 transition-all border border-[var(--primary)]/20 disabled:opacity-50"
                  >
                    {generateLoading ? 'Generating...' : '+ New Key'}
                  </button>
                )}
              </div>

              {activeKeys.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-white/20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M15 7h2a2 2 0 012 2v8a2 2 0 01-2 2H7a2 2 0 01-2-2V9a2 2 0 012-2h2" />
                      <rect x="9" y="3" width="6" height="7" rx="1" />
                    </svg>
                  </div>
                  <p className="text-white/40 text-sm mb-4">No API keys yet</p>
                  <button
                    onClick={handleGenerateKey}
                    disabled={generateLoading}
                    className="px-6 py-3 rounded-xl bg-[var(--primary)]/10 text-[var(--primary)] font-bold text-sm hover:bg-[var(--primary)]/20 transition-all border border-[var(--primary)]/20 disabled:opacity-50"
                  >
                    {generateLoading ? 'Generating...' : 'Generate API Key'}
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {activeKeys.map((key) => (
                    <div key={key.id} className="p-4 rounded-xl bg-black/30 border border-white/10">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">{key.name}</span>
                        <button
                          onClick={() => handleRevoke(key.id)}
                          disabled={revokeLoading === key.id}
                          className="text-xs text-red-400/60 hover:text-red-400 transition-colors"
                        >
                          {revokeLoading === key.id ? 'Revoking...' : 'Revoke'}
                        </button>
                      </div>
                      <code className="text-xs text-white/50 font-mono">{key.key_prefix}{'•'.repeat(20)}</code>
                      {key.last_used_at && (
                        <p className="text-xs text-white/30 mt-2">
                          Last used: {new Date(key.last_used_at).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </LiquidCard>
          </div>

          {/* Usage History */}
          <LiquidCard className="p-8 mt-6">
            <h2 className="text-xl font-bold mb-6">Recent API Calls</h2>

            {recentCalls.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white/20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M3 3v18h18" />
                    <path d="M7 16l4-8 4 4 4-6" />
                  </svg>
                </div>
                <p className="text-white/40 text-sm mb-1">No API calls yet</p>
                <p className="text-white/25 text-xs">Your usage history will appear here</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/10 text-white/40 text-xs uppercase tracking-wider">
                      <th className="text-left pb-3 font-medium">Endpoint</th>
                      <th className="text-right pb-3 font-medium">Credits</th>
                      <th className="text-right pb-3 font-medium">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentCalls.map((call, i) => (
                      <tr key={i} className="border-b border-white/5 hover:bg-white/[0.02]">
                        <td className="py-3 font-mono text-white/70">{call.endpoint}</td>
                        <td className="py-3 text-right text-[var(--primary)]">{call.cost_cents} credits</td>
                        <td className="py-3 text-right text-white/40">
                          {new Date(call.created_at).toLocaleString('en-US', {
                            month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
                          })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </LiquidCard>

          {/* Quick Start */}
          <LiquidCard className="p-8 mt-6">
            <h2 className="text-xl font-bold mb-6">Quick Start</h2>

            <div className="space-y-4">
              <div>
                <p className="text-xs text-white/40 uppercase tracking-wider mb-2">List all niches</p>
                <div className="p-4 rounded-xl bg-black/40 border border-white/10 font-mono text-sm overflow-x-auto">
                  <span className="text-[var(--primary)]">curl</span>
                  <span className="text-white/60"> -H </span>
                  <span className="text-white">&quot;Authorization: Bearer {activeKeys[0]?.key_prefix ? activeKeys[0].key_prefix + '...' : 'nh_live_your_key_here'}&quot;</span>
                  <span className="text-white/60"> \</span>
                  <br />
                  <span className="text-white/60">  </span>
                  <span className="text-white">https://nicheshunter.com/api/v1/niches</span>
                </div>
              </div>

              <div>
                <p className="text-xs text-white/40 uppercase tracking-wider mb-2">Get niche details</p>
                <div className="p-4 rounded-xl bg-black/40 border border-white/10 font-mono text-sm overflow-x-auto">
                  <span className="text-[var(--primary)]">curl</span>
                  <span className="text-white/60"> -H </span>
                  <span className="text-white">&quot;Authorization: Bearer {activeKeys[0]?.key_prefix ? activeKeys[0].key_prefix + '...' : 'nh_live_your_key_here'}&quot;</span>
                  <span className="text-white/60"> \</span>
                  <br />
                  <span className="text-white/60">  </span>
                  <span className="text-white">https://nicheshunter.com/api/v1/niches/0042</span>
                </div>
              </div>

            </div>

            <div className="mt-6 pt-6 border-t border-white/10 flex items-center justify-between">
              <p className="text-sm text-white/40">Need more details?</p>
              <Link
                href="/developer/docs"
                className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-sm font-medium text-white/60 hover:bg-white/10 hover:text-white transition-all"
              >
                View Full Documentation →
              </Link>
            </div>
          </LiquidCard>

        </div>
      </section>
    </main>
  )
}
