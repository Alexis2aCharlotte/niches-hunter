"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Vérifier si on a un token dans l'URL (Supabase le met dans le hash)
  useEffect(() => {
    // Supabase Auth met le token dans le hash de l'URL
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const accessToken = hashParams.get("access_token");
    const type = hashParams.get("type");

    if (accessToken && type === "recovery") {
      // Définir la session avec le token de récupération
      supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: hashParams.get("refresh_token") || "",
      });
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsLoading(true);

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password: password,
      });

      if (updateError) {
        setError(updateError.message);
      } else {
        setSuccess(true);
        // Redirect to login after 3 seconds
        setTimeout(() => {
          router.push("/login");
        }, 3000);
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
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

              {success ? (
                // Success State
                <div className="text-center relative z-10">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[var(--primary)]/20 mb-6">
                    <svg className="w-8 h-8 text-[var(--primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h1 className="text-2xl font-bold text-white mb-3">Password Updated!</h1>
                  <p className="text-sm text-white/50 mb-8 leading-relaxed">
                    Your password has been successfully reset. Redirecting you to login...
                  </p>
                  <Link 
                    href="/login"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--primary)] text-black font-bold rounded-xl hover:bg-[#00E847] transition-all"
                  >
                    Go to Login →
                  </Link>
                </div>
              ) : (
                // Form State
                <>
                  {/* Header */}
                  <div className="text-center mb-8 relative z-10">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[var(--primary)] to-[var(--primary)] mb-6 shadow-[0_0_40px_rgba(0,204,61,0.3)]">
                      <svg className="w-8 h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <h1 className="text-2xl font-bold text-white mb-2">Create new password</h1>
                    <p className="text-sm text-white/50">Enter your new password below</p>
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
                        New Password
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
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
                          {showPassword ? "🙈" : "👁"}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-white/40 uppercase tracking-wider mb-2">
                        Confirm Password
                      </label>
                      <input
                        type={showPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                        minLength={6}
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
                          Updating...
                        </span>
                      ) : (
                        "Update Password"
                      )}
                    </button>
                  </form>

                  {/* Back to Login */}
                  <p className="text-center mt-8 text-sm text-white/40 relative z-10">
                    <Link href="/login" className="text-[var(--primary)] hover:underline font-medium">
                      ← Back to login
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

export default function ResetPasswordConfirmPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen relative overflow-hidden text-white font-sans flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-8 h-8 border-2 border-[var(--primary)] border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-white/40">Loading...</p>
        </div>
      </main>
    }>
      <ResetPasswordForm />
    </Suspense>
  );
}

