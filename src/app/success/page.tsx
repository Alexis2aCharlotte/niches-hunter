'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'

interface SessionData {
  email: string | null
  customerName: string | null
  customerId: string | null
}

function SuccessContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')
  
  const [sessionData, setSessionData] = useState<SessionData | null>(null)
  const [loading, setLoading] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [formLoading, setFormLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    if (sessionId) {
      // Récupérer les infos de la session pour pré-remplir l'email
      fetch(`/api/stripe/session?session_id=${sessionId}`)
        .then(res => res.json())
        .then(data => {
          setSessionData(data)
          if (data.email) {
            setEmail(data.email)
          }
          setLoading(false)
        })
        .catch(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [sessionId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setFormLoading(true)

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
          stripeCustomerId: sessionData?.customerId,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Failed to create account')
        setFormLoading(false)
        return
      }

      setSuccess(true)
      // Rediriger vers les niches après 2 secondes
      setTimeout(() => {
        router.push('/niches')
      }, 2000)
    } catch {
      setError('Something went wrong. Please try again.')
      setFormLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[rgba(0,255,136,0.1)] flex items-center justify-center">
            <svg 
              className="w-10 h-10 text-[#00ff88]" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M5 13l4 4L19 7" 
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white mb-4">Account Created! 🎉</h1>
          <p className="text-[rgba(255,255,255,0.6)] mb-4">
            Redirecting you to explore all niches...
          </p>
          <div className="w-8 h-8 border-2 border-[#00ff88] border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Success Card */}
        <div className="bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.1)] rounded-2xl p-8 text-center">
          {/* Animated Check Icon */}
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[rgba(0,255,136,0.1)] flex items-center justify-center">
            <svg 
              className="w-10 h-10 text-[#00ff88]" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M5 13l4 4L19 7" 
              />
            </svg>
          </div>

          <h1 className="text-3xl font-bold text-white mb-2">
            Welcome to the Hunt! 🎯
          </h1>
          
          <p className="text-[rgba(255,255,255,0.6)] mb-8">
            Your payment was successful. You now have full access to all niches.
          </p>

          {/* What's included */}
          <div className="bg-[rgba(255,255,255,0.02)] rounded-xl p-4 mb-8 text-left">
            <h3 className="text-sm font-semibold text-white mb-3">Your access includes:</h3>
            <ul className="space-y-2 text-sm text-[rgba(255,255,255,0.6)]">
              <li className="flex items-center gap-2">
                <span className="text-[#00ff88]">✓</span> 50+ validated app niches
              </li>
              <li className="flex items-center gap-2">
                <span className="text-[#00ff88]">✓</span> Daily trending apps & insights
              </li>
              <li className="flex items-center gap-2">
                <span className="text-[#00ff88]">✓</span> Competitor analysis data
              </li>
              <li className="flex items-center gap-2">
                <span className="text-[#00ff88]">✓</span> 2 fresh app ideas daily in your inbox
              </li>
            </ul>
          </div>

          {/* Create Account Section */}
          <div className="border-t border-[rgba(255,255,255,0.1)] pt-6">
            <h3 className="text-lg font-semibold text-white mb-4">
              Create your account
            </h3>
            <p className="text-sm text-[rgba(255,255,255,0.5)] mb-4">
              Save your progress and access your niches from any device
            </p>

            {error && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                {error}
              </div>
            )}

            {loading ? (
              <div className="animate-pulse space-y-3">
                <div className="h-12 bg-[rgba(255,255,255,0.05)] rounded-lg"></div>
                <div className="h-12 bg-[rgba(255,255,255,0.05)] rounded-lg"></div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  required
                  className="w-full px-4 py-3 bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-lg text-white placeholder-[rgba(255,255,255,0.3)] focus:outline-none focus:border-[#00ff88] transition-colors"
                  readOnly={!!sessionData?.email}
                />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a password (min 6 characters)"
                  required
                  minLength={6}
                  className="w-full px-4 py-3 bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-lg text-white placeholder-[rgba(255,255,255,0.3)] focus:outline-none focus:border-[#00ff88] transition-colors"
                />
                <button
                  type="submit"
                  disabled={formLoading}
                  className="w-full py-3 bg-[#00ff88] text-black font-semibold rounded-lg hover:bg-[#00e67a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {formLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                      Creating...
                    </>
                  ) : (
                    'Create Account'
                  )}
                </button>
              </form>
            )}

            {/* Divider */}
            <div className="flex items-center gap-3 my-4">
              <div className="flex-1 h-px bg-[rgba(255,255,255,0.1)]"></div>
              <span className="text-sm text-[rgba(255,255,255,0.4)]">or</span>
              <div className="flex-1 h-px bg-[rgba(255,255,255,0.1)]"></div>
            </div>

            {/* Google Sign In - Disabled for now */}
            <button 
              className="w-full py-3 bg-white/50 text-black/50 font-medium rounded-lg cursor-not-allowed flex items-center justify-center gap-2"
              disabled
            >
              <svg className="w-5 h-5 opacity-50" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Google (coming soon)
            </button>
          </div>

        </div>

        {/* Support */}
        <p className="text-center text-sm text-[rgba(255,255,255,0.3)] mt-6">
          Need help? Contact us at{' '}
          <a href="mailto:support@nicheshunter.com" className="text-[#00ff88] hover:underline">
            support@nicheshunter.com
          </a>
        </p>
      </div>
    </div>
  )
}

// Loading fallback
function LoadingFallback() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4">
      <div className="w-8 h-8 border-2 border-[#00ff88] border-t-transparent rounded-full animate-spin" />
    </div>
  )
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <SuccessContent />
    </Suspense>
  )
}
