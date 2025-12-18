"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitted(true);
      } else {
        setError(data.error || 'Something went wrong');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen relative overflow-hidden text-white font-sans selection:bg-[#00CC3D] selection:text-black">
      <Navbar />

      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-[var(--primary)]/5 blur-[150px] rounded-full" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-purple-500/5 blur-[120px] rounded-full" />
      </div>

      {/* Content */}
      <section className="relative pt-32 pb-20 px-6 min-h-screen flex items-center justify-center">
        <div className="w-full max-w-md">
          
          {/* Card */}
          <div className="liquid-card p-1 rounded-3xl">
            <div className="bg-[#050505] rounded-[22px] p-8 md:p-10 relative overflow-hidden">
              
              {/* Glow Effect */}
              <div className="absolute top-0 right-0 w-40 h-40 bg-[var(--primary)]/10 blur-[80px] rounded-full pointer-events-none" />

              {submitted ? (
                // Success State
                <div className="text-center relative z-10">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[var(--primary)]/20 mb-6">
                    <svg className="w-8 h-8 text-[var(--primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h1 className="text-2xl font-bold text-white mb-3">Check your email</h1>
                  <p className="text-sm text-white/50 mb-8 leading-relaxed">
                    If an account exists for <span className="text-white">{email}</span>, you'll receive a password reset link shortly.
                  </p>
                  <Link 
                    href="/login"
                    className="inline-flex items-center gap-2 text-[var(--primary)] text-sm font-medium hover:underline"
                  >
                    ← Back to login
                  </Link>
                </div>
              ) : (
                // Form State
                <>
                  {/* Header */}
                  <div className="text-center mb-8 relative z-10">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[var(--primary)] to-[var(--primary)] mb-6 shadow-[0_0_40px_rgba(0,204,61,0.3)]">
                      <svg className="w-8 h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                      </svg>
                    </div>
                    <h1 className="text-2xl font-bold text-white mb-2">Reset your password</h1>
                    <p className="text-sm text-white/50">Enter your email and we'll send you a reset link</p>
                  </div>

                  {/* Error Message */}
                  {error && (
                    <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm text-center relative z-10">
                      {error}
                    </div>
                  )}

                  {/* Form */}
                  <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
                    <div>
                      <label className="block text-xs font-medium text-white/40 uppercase tracking-wider mb-2">
                        Email address
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        required
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-white focus:border-[var(--primary)] focus:bg-white/10 focus:ring-0 outline-none transition-all placeholder:text-white/20"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-4 text-sm font-bold tracking-wider uppercase rounded-xl bg-[var(--primary)] hover:bg-[#00E847] text-black transition-all shadow-[0_0_20px_rgba(0,204,61,0.3)] hover:shadow-[0_0_30px_rgba(0,204,61,0.5)] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? (
                        <span className="flex items-center justify-center gap-2">
                          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                          </svg>
                          Sending...
                        </span>
                      ) : (
                        "Send Reset Link"
                      )}
                    </button>
                  </form>

                  {/* Back to Login */}
                  <p className="text-center mt-8 text-sm text-white/40 relative z-10">
                    Remember your password?{" "}
                    <Link href="/login" className="text-[var(--primary)] hover:underline font-medium">
                      Sign in
                    </Link>
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

