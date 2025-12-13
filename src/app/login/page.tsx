"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // TODO: Implémenter l'authentification réelle
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsLoading(false);
  };

  return (
    <main className="min-h-screen relative overflow-hidden text-white font-sans selection:bg-[#00CC3D] selection:text-black">
      <Navbar />

      {/* Coming Soon Overlay */}
      <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm">
        <div className="text-center px-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--primary)]/10 border border-[var(--primary)]/20 mb-6">
            <span className="w-2 h-2 rounded-full bg-[var(--primary)] animate-pulse" />
            <span className="text-sm font-mono text-[var(--primary)] uppercase tracking-wider">In Development</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
            Coming <span className="text-flashy-green">Soon</span>
          </h1>
          <p className="text-xl text-white/60 mb-10 max-w-md mx-auto">
            Authentication is on the way. Get notified when it's ready.
          </p>
          <Link 
            href="/"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-[var(--primary)] text-black font-bold hover:bg-[#00E847] transition-all shadow-[0_0_30px_rgba(0,204,61,0.3)]"
          >
            ← Back to Home
          </Link>
        </div>
      </div>

      {/* Blurred Content Behind */}
      <div className="blur-[8px] opacity-40 pointer-events-none select-none">

      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-[var(--primary)]/5 blur-[150px] rounded-full" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-purple-500/5 blur-[120px] rounded-full" />
      </div>

      {/* Login Container */}
      <section className="relative pt-32 pb-20 px-6 min-h-screen flex items-center justify-center">
        <div className="w-full max-w-md">
          
          {/* Card */}
          <div className="liquid-card p-1 rounded-3xl">
            <div className="bg-[#050505] rounded-[22px] p-8 md:p-10 relative overflow-hidden">
              
              {/* Glow Effect */}
              <div className="absolute top-0 right-0 w-40 h-40 bg-[var(--primary)]/10 blur-[80px] rounded-full pointer-events-none" />

              {/* Header */}
              <div className="text-center mb-10 relative z-10">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[var(--primary)] to-[var(--primary)] mb-6 shadow-[0_0_40px_rgba(0,204,61,0.3)]">
                  <span className="text-2xl font-bold text-black">NH</span>
                </div>
                <h1 className="text-3xl font-bold text-white mb-2">Welcome back</h1>
                <p className="text-sm text-white/50">Sign in to access your niche intelligence</p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
                
                {/* Email Input */}
                <div>
                  <label className="block text-xs font-medium text-white/40 uppercase tracking-wider mb-2">
                    Email
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

                {/* Password Input */}
                <div>
                  <label className="block text-xs font-medium text-white/40 uppercase tracking-wider mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-white focus:border-[var(--primary)] focus:bg-white/10 focus:ring-0 outline-none transition-all placeholder:text-white/20 pr-12"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                    >
                      {showPassword ? "🙈" : "👁"}
                    </button>
                  </div>
                </div>

                {/* Forgot Password */}
                <div className="flex justify-end">
                  <Link href="#" className="text-xs text-white/40 hover:text-[var(--primary)] transition-colors">
                    Forgot password?
                  </Link>
                </div>

                {/* Submit Button */}
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
                      Signing in...
                    </span>
                  ) : (
                    "Sign In"
                  )}
                </button>
              </form>

              {/* Divider */}
              <div className="flex items-center gap-4 my-8 relative z-10">
                <div className="flex-1 h-px bg-white/10" />
                <span className="text-xs text-white/30 uppercase tracking-wider">or</span>
                <div className="flex-1 h-px bg-white/10" />
              </div>

              {/* Social Login */}
              <button className="w-full py-4 px-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all flex items-center justify-center gap-3 text-sm font-medium text-white/80 hover:text-white relative z-10">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </button>

              {/* Sign Up Link */}
              <p className="text-center mt-8 text-sm text-white/40 relative z-10">
                Don't have an account?{" "}
                <Link href="#" className="text-[var(--primary)] hover:underline font-medium">
                  Start hunting free
                </Link>
              </p>
            </div>
          </div>

          {/* Footer Text */}
          <p className="text-center mt-6 text-xs text-white/20">
            Protected by enterprise-grade security 🔒
          </p>
        </div>
      </section>

      </div>{/* End Blurred Content */}
    </main>
  );
}

