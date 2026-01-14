"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";

function UnsubscribeForm() {
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState("");

  // Pre-fill email from URL param if present
  useEffect(() => {
    const emailParam = searchParams.get('email');
    if (emailParam) {
      setEmail(emailParam);
    }
  }, [searchParams]);

  const handleUnsubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus('idle');

    try {
      const response = await fetch('/api/unsubscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('success');
        setMessage(data.message || 'You have been unsubscribed.');
      } else {
        setStatus('error');
        setMessage(data.error || 'Something went wrong.');
      }
    } catch (error) {
      setStatus('error');
      setMessage('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Logo */}
      <div className="flex items-center justify-center gap-2 mb-8">
        <div className="w-2 h-2" style={{ background: '#00FF88' }} />
        <span className="font-mono text-xs tracking-[0.15em]" style={{ color: '#00FF88' }}>
          NICHES HUNTER
        </span>
      </div>

      {status === 'success' ? (
        // Success State
        <div className="text-center">
          <div 
            className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-6"
            style={{ background: 'rgba(0, 255, 136, 0.1)', border: '2px solid #00FF88' }}
          >
            <span className="text-3xl" style={{ color: '#00FF88' }}>✓</span>
          </div>
          
          <h1 className="text-2xl font-bold mb-4" style={{ color: '#FFFFFF' }}>
            Unsubscribed
          </h1>
          
          <p className="mb-6" style={{ color: 'rgba(255, 255, 255, 0.5)' }}>
            {message}
          </p>

          <div 
            className="p-4 mb-6"
            style={{ background: 'rgba(0, 255, 136, 0.05)', border: '1px solid rgba(0, 255, 136, 0.2)' }}
          >
            <p className="font-mono text-sm" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
              We&apos;re sorry to see you go! 😢
            </p>
            <p className="text-xs mt-2" style={{ color: 'rgba(255, 255, 255, 0.4)' }}>
              You won&apos;t receive any more emails from us.
            </p>
          </div>

          <a 
            href="/"
            className="btn-terminal inline-block py-3 px-6 text-sm"
          >
            ← BACK TO HOME
          </a>
        </div>
      ) : (
        // Form State
        <>
          <div className="text-center mb-8">
            <h1 className="text-2xl md:text-3xl font-bold mb-3" style={{ color: '#FFFFFF' }}>
              Unsubscribe
            </h1>
            <p style={{ color: 'rgba(255, 255, 255, 0.5)' }}>
              Enter your email to unsubscribe from our newsletter.
            </p>
          </div>

          <form onSubmit={handleUnsubscribe} className="space-y-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              disabled={isLoading}
              className="terminal-input w-full py-4 text-center disabled:opacity-50"
              style={{ color: '#00FF88' }}
            />

            {status === 'error' && (
              <div 
                className="py-3 px-4 text-center font-mono text-sm"
                style={{ 
                  background: 'rgba(255, 0, 0, 0.1)', 
                  color: '#FF6B6B',
                  border: '1px solid rgba(255, 0, 0, 0.3)'
                }}
              >
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 font-mono text-sm font-bold transition-all disabled:opacity-50"
              style={{ 
                background: 'rgba(255, 100, 100, 0.1)', 
                border: '1px solid rgba(255, 100, 100, 0.5)',
                color: '#FF6B6B'
              }}
            >
              {isLoading ? 'PROCESSING...' : 'UNSUBSCRIBE'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <a 
              href="/"
              className="font-mono text-xs transition-colors hover:text-[#00FF88]"
              style={{ color: 'rgba(255, 255, 255, 0.4)' }}
            >
              ← Back to Niches Hunter
            </a>
          </div>
        </>
      )}
    </>
  );
}

export default function Unsubscribe() {
  return (
    <main className="min-h-screen relative flex items-center justify-center px-4" style={{ background: '#0A0A0A' }}>
      {/* Background */}
      <div className="grid-bg" />
      <div className="scanlines" />

      {/* Content */}
      <div className="relative w-full max-w-md">
        <div 
          className="p-8 md:p-10"
          style={{ 
            background: 'rgba(10, 10, 10, 0.95)', 
            border: '1px solid rgba(0, 255, 136, 0.3)',
            boxShadow: '0 0 60px rgba(0, 255, 136, 0.1)'
          }}
        >
          {/* Corner decorations */}
          <div className="corner-decoration corner-tl" />
          <div className="corner-decoration corner-tr" />
          <div className="corner-decoration corner-bl" />
          <div className="corner-decoration corner-br" />

          <Suspense fallback={
            <div className="text-center py-8">
              <div className="font-mono text-sm" style={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                Loading...
              </div>
            </div>
          }>
            <UnsubscribeForm />
          </Suspense>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center font-mono text-xs" style={{ color: 'rgba(255, 255, 255, 0.3)' }}>
          Changed your mind? You can always <a href="/" className="underline hover:text-[#00FF88]">resubscribe</a>.
        </div>
      </div>
    </main>
  );
}

