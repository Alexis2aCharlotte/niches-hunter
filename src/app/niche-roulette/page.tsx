"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { type Niche } from "../niches/data";

// Fetch niches for roulette (shows title but hides details)
async function fetchRouletteNiches(): Promise<Niche[]> {
  try {
    const response = await fetch('/api/niches/roulette', {
      method: 'GET',
    });
    if (!response.ok) return [];
    const data = await response.json();
    return data.niches || [];
  } catch (error) {
    console.error('Error fetching roulette niches:', error);
    return [];
  }
}

// --- Liquid Glass Card Component ---
function LiquidCard({
  children,
  className = "",
  style = {},
}: {
  children: React.ReactNode,
  className?: string,
  style?: React.CSSProperties,
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const isSafari = typeof navigator !== 'undefined' && /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    // Disable mouse tracking on Safari to prevent memory issues
    if (isSafari || !cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    cardRef.current.style.setProperty('--mouse-x', `${x}px`);
    cardRef.current.style.setProperty('--mouse-y', `${y}px`);
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      className={`liquid-card ${className}`}
      style={style}
    >
      {children}
    </div>
  );
}

const FREE_SPIN_LIMIT = 3;
const SPIN_COUNT_KEY = 'niche_roulette_spins';

export default function NicheRoulettePage() {
  const [showSubscribeModal, setShowSubscribeModal] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const [currentNiche, setCurrentNiche] = useState<Niche | null>(null);
  const [rouletteEmail, setRouletteEmail] = useState("");
  const [spinCount, setSpinCount] = useState(0);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("All");
  
  // Real niches from DB
  const [niches, setNiches] = useState<Niche[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Auth state
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [hasActiveSubscription, setHasActiveSubscription] = useState<boolean>(false);

  const hasReachedLimit = !hasActiveSubscription && spinCount >= FREE_SPIN_LIMIT;
  const remainingSpins = Math.max(0, FREE_SPIN_LIMIT - spinCount);

  // Load persisted spin count from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(SPIN_COUNT_KEY);
      if (stored) setSpinCount(parseInt(stored, 10) || 0);
    } catch {}
  }, []);

  // Check if user is logged in AND has active subscription
  useEffect(() => {
    async function checkAuth() {
      try {
        const response = await fetch('/api/auth/me', {
          credentials: 'include',
        });
        const data = await response.json();
        setIsLoggedIn(!!data.user);
        setHasActiveSubscription(data.subscription?.status === 'active');
      } catch {
        setIsLoggedIn(false);
        setHasActiveSubscription(false);
      }
    }
    checkAuth();
  }, []);

  // Fetch niches for roulette on mount
  useEffect(() => {
    async function loadNiches() {
      setLoading(true);
      const data = await fetchRouletteNiches();
      setNiches(data);
      setLoading(false);
    }
    loadNiches();
  }, []);

  // Spin the roulette
  const handleSpin = () => {
    if (isSpinning || niches.length === 0 || hasReachedLimit) return;
    
    setIsSpinning(true);
    setCurrentNiche(null);
    
    const filteredNiches = selectedDifficulty === "All" 
      ? niches 
      : niches.filter(n => n.stats?.difficulty === selectedDifficulty);
    
    const nichesToUse = filteredNiches.length > 0 ? filteredNiches : niches;
    
    let spins = 0;
    const maxSpins = 15 + Math.floor(Math.random() * 10);
    const spinInterval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * nichesToUse.length);
      setCurrentNiche(nichesToUse[randomIndex]);
      spins++;
      
      if (spins >= maxSpins) {
        clearInterval(spinInterval);
        const finalIndex = Math.floor(Math.random() * nichesToUse.length);
        setCurrentNiche(nichesToUse[finalIndex]);
        setIsSpinning(false);
        setSpinCount(prev => {
          const newCount = prev + 1;
          try { localStorage.setItem(SPIN_COUNT_KEY, String(newCount)); } catch {}
          return newCount;
        });
      }
    }, 100);
  };

  // Validate email format
  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Handle email form submit
  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidEmail(rouletteEmail) || !currentNiche) return;
    
    try {
      await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: rouletteEmail }),
      });
    } catch (error) {
      console.error('Subscribe error:', error);
    }
    
    // Redirect to niche detail page
    window.location.href = `/niches/${currentNiche.displayCode}`;
  };

  return (
    <main className="min-h-screen relative overflow-hidden text-white font-sans selection:bg-[var(--primary)] selection:text-black">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/3 w-[800px] h-[800px] bg-[var(--primary)]/3 blur-[200px] rounded-full" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-500/5 blur-[150px] rounded-full" />
      </div>

      {/* Hero Section */}
      <section className="relative pt-32 pb-12 px-6">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[var(--primary)]/30 bg-[var(--primary)]/10 mb-8 backdrop-blur-md">
            <span className="text-sm font-medium text-[var(--primary)] tracking-wide uppercase">Free Tool</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold leading-[1.1] mb-6 tracking-tighter">
            Niche <span className="text-flashy-green">Roulette</span>
          </h1>

          <p className="text-lg md:text-xl text-[rgba(255,255,255,0.6)] mb-8 max-w-2xl mx-auto leading-relaxed">
            Can't decide what to build? Spin the wheel and let fate pick your next profitable niche idea.
          </p>
        </div>
      </section>

      {/* Main Roulette Section */}
      <section className="py-12 px-6">
        <div className="max-w-4xl mx-auto">
          <LiquidCard className="p-8 md:p-12 relative overflow-hidden">
            {/* Background glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[var(--primary)]/5 blur-[120px] rounded-full pointer-events-none" />
            
            {/* Loading state - Skeleton avec même dimensions que l'état initial */}
            {loading ? (
              <div className="text-center relative z-10 min-h-[400px] flex flex-col items-center justify-center">
                <div className="mb-8">
                  <div className="w-44 h-44 md:w-52 md:h-52 rounded-full mx-auto bg-white/5 border-2 border-white/10 animate-pulse flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-white/10" />
                  </div>
                </div>
                <div className="h-4 w-48 bg-white/10 rounded mb-8 animate-pulse" />
                <div className="flex flex-wrap justify-center gap-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-10 w-20 bg-white/5 rounded-full animate-pulse" />
                  ))}
                </div>
              </div>
            ) : hasReachedLimit && !currentNiche ? (
              // Limit reached - no result showing
              <div className="text-center relative z-10 min-h-[400px] flex flex-col items-center justify-center">
                <div className="mb-8">
                  <div className="w-44 h-44 md:w-52 md:h-52 rounded-full mx-auto bg-black/60 border-2 border-white/10 flex items-center justify-center">
                    <div className="flex flex-col items-center">
                      <span className="text-4xl mb-3">🔒</span>
                      <span className="text-white/40 font-bold text-lg">0 left</span>
                    </div>
                  </div>
                </div>

                <h3 className="text-xl md:text-2xl font-bold text-white mb-3">
                  You've used your {FREE_SPIN_LIMIT} free spins
                </h3>
                <p className="text-white/50 text-sm mb-8 max-w-md">
                  Unlock unlimited spins and access all {niches.length}+ validated niches with full analysis, competitor data, and marketing playbooks.
                </p>

                <Link
                  href="/pricing"
                  className="inline-block px-10 py-4 rounded-xl bg-[var(--primary)] text-black font-bold text-lg hover:bg-[#00E847] transition-all shadow-[0_0_30px_rgba(0,204,61,0.3)]"
                >
                  Unlock Unlimited Spins →
                </Link>
              </div>
            ) : !currentNiche ? (
              // Initial State - Spin Button
              <div className="text-center relative z-10 min-h-[400px] flex flex-col items-center justify-center">
                <div className="mb-8">
                  <button
                    onClick={handleSpin}
                    disabled={isSpinning || niches.length === 0}
                    className={`group relative w-44 h-44 md:w-52 md:h-52 rounded-full mx-auto
                      bg-black/60 border-2 border-[var(--primary)]/50
                      flex items-center justify-center
                      transition-all duration-300 hover:scale-105 active:scale-95
                      hover:border-[var(--primary)] hover:shadow-[0_0_40px_rgba(0,204,61,0.3)]
                      ${isSpinning ? 'cursor-not-allowed' : 'cursor-pointer'}
                    `}
                  >
                    <div className="absolute inset-0 rounded-full bg-[var(--primary)]/5 group-hover:bg-[var(--primary)]/10 transition-colors" />
                    
                    <div className="relative z-10 flex flex-col items-center">
                      {isSpinning ? (
                        <>
                          <div className="w-12 h-12 md:w-14 md:h-14 border-3 border-[var(--primary)]/30 border-t-[var(--primary)] rounded-full animate-spin mb-3" />
                          <span className="text-white/60 text-sm font-medium tracking-wider">SPINNING...</span>
                        </>
                      ) : (
                        <>
                          <svg className="w-12 h-12 md:w-14 md:h-14 text-[var(--primary)] mb-3 group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <rect x="3" y="3" width="18" height="18" rx="3" />
                            <circle cx="8" cy="8" r="1.5" fill="currentColor" />
                            <circle cx="16" cy="8" r="1.5" fill="currentColor" />
                            <circle cx="8" cy="16" r="1.5" fill="currentColor" />
                            <circle cx="16" cy="16" r="1.5" fill="currentColor" />
                            <circle cx="12" cy="12" r="1.5" fill="currentColor" />
                          </svg>
                          <span className="text-white font-bold text-xl md:text-2xl tracking-wider">SPIN</span>
                          <span className="text-white/40 text-xs mt-1">Click to roll</span>
                        </>
                      )}
                    </div>
                  </button>
                </div>

                <p className="text-white/50 text-sm mb-2">
                  {niches.length} validated niches in the wheel
                </p>

                {!hasActiveSubscription && (
                  <p className="text-white/30 text-xs mb-8">
                    {remainingSpins} free spin{remainingSpins !== 1 ? 's' : ''} remaining
                  </p>
                )}
                {hasActiveSubscription && <div className="mb-8" />}

                {/* Filter chips */}
                <div className="flex flex-wrap justify-center gap-3">
                  {['All', 'Easy', 'Medium', 'Hard'].map((filter) => (
                    <button
                      key={filter}
                      onClick={() => setSelectedDifficulty(filter)}
                      className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all
                        ${selectedDifficulty === filter 
                          ? 'bg-[var(--primary)]/20 text-[var(--primary)] border border-[var(--primary)]/30 shadow-[0_0_20px_rgba(0,204,61,0.2)]' 
                          : 'bg-white/5 text-white/50 border border-white/10 hover:bg-white/10 hover:text-white/70'
                        }`}
                    >
                      {filter}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              // Result State - TEASER VERSION - Hauteur minimale pour stabilité
              <div className="relative z-10 min-h-[400px]">
                <div className="text-center mb-8 pt-4">
                  {/* Category badge */}
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/10 mb-4">
                    <span className="text-xs text-white/60">#{currentNiche.displayCode}</span>
                    <span className="text-white/20">•</span>
                    <span className="text-xs text-[var(--primary)]">{currentNiche.category}</span>
                  </div>
                  
                  <h2 className={`text-3xl md:text-4xl font-bold text-white mb-4 transition-all duration-200 ${isSpinning ? 'blur-sm' : ''}`}>
                    {currentNiche.title}
                  </h2>
                  
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--primary)]/20 border border-[var(--primary)]/30">
                    <span className="text-[var(--primary)] font-bold text-lg">{currentNiche.score}/100</span>
                    <span className="text-white/40">Score</span>
                  </div>
                </div>

                {!isSpinning && (
                  <>
                    {/* Tags */}
                    <div className="flex flex-wrap justify-center gap-2 mb-8">
                      {currentNiche.tags.slice(0, 4).map((tag, i) => (
                        <span key={i} className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-white/60">
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Stats Grid - VISIBLE */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                      <div className="p-5 rounded-xl bg-black/40 border border-white/10 text-center">
                        <div className="text-xs text-white/40 uppercase tracking-wider mb-2">Revenue</div>
                        <div className="text-white font-bold text-lg">{currentNiche.stats?.revenue || '—'}</div>
                      </div>
                      <div className="p-5 rounded-xl bg-black/40 border border-white/10 text-center">
                        <div className="text-xs text-white/40 uppercase tracking-wider mb-2">Competition</div>
                        <div className={`font-bold text-lg ${
                          currentNiche.stats?.competition === 'Low' ? 'text-[var(--primary)]' :
                          currentNiche.stats?.competition === 'Medium' ? 'text-yellow-400' : 'text-orange-400'
                        }`}>{currentNiche.stats?.competition || '—'}</div>
                      </div>
                      <div className="p-5 rounded-xl bg-black/40 border border-white/10 text-center">
                        <div className="text-xs text-white/40 uppercase tracking-wider mb-2">Difficulty</div>
                        <div className={`font-bold text-lg ${
                          currentNiche.stats?.difficulty === 'Easy' ? 'text-[var(--primary)]' :
                          currentNiche.stats?.difficulty === 'Medium' ? 'text-yellow-400' : 'text-orange-400'
                        }`}>{currentNiche.stats?.difficulty || '—'}</div>
                      </div>
                      <div className="p-5 rounded-xl bg-black/40 border border-white/10 text-center">
                        <div className="text-xs text-white/40 uppercase tracking-wider mb-2">Time to MVP</div>
                        <div className="text-white font-bold text-lg">{currentNiche.stats?.timeToMVP || '—'}</div>
                      </div>
                    </div>

                    {/* HIDDEN CONTENT - Blurred teaser (only for users without active subscription) */}
                    {!hasActiveSubscription && (
                      <div className="relative mb-8 p-6 rounded-xl bg-black/40 border border-white/10 overflow-hidden">
                        {/* Blur overlay */}
                        <div className="absolute inset-0 backdrop-blur-md bg-black/40 z-10 flex flex-col items-center justify-center">
                          <span className="text-3xl mb-2">🔒</span>
                          <span className="text-white/70 font-medium">Full Analysis Hidden</span>
                          <span className="text-white/40 text-sm">Enter your email to unlock</span>
                        </div>
                        {/* Blurred content preview */}
                        <div className="blur-sm select-none pointer-events-none">
                          <h4 className="font-bold text-white mb-2">The Opportunity</h4>
                          <p className="text-white/60 text-sm mb-4">{currentNiche.opportunity?.substring(0, 100)}...</p>
                          <h4 className="font-bold text-white mb-2">Market Gap</h4>
                          <p className="text-white/60 text-sm">{currentNiche.gap?.substring(0, 100)}...</p>
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 mb-8">
                      {hasReachedLimit ? (
                        <Link
                          href="/pricing"
                          className="flex-1 px-8 py-4 rounded-xl bg-[var(--primary)] text-black font-bold hover:bg-[#00E847] transition-all shadow-[0_0_30px_rgba(0,204,61,0.3)] text-center"
                        >
                          Unlock Unlimited Spins →
                        </Link>
                      ) : (
                        <button
                          onClick={handleSpin}
                          className="flex-1 px-8 py-4 rounded-xl bg-white/10 border border-white/20 text-white font-bold hover:bg-white/20 transition-all flex items-center justify-center gap-2"
                        >
                          🎲 Spin Again {!hasActiveSubscription && <span className="text-white/40 text-sm ml-1">({remainingSpins} left)</span>}
                        </button>
                      )}
                      
                      {hasActiveSubscription && (
                        <Link
                          href={`/niches/${currentNiche.displayCode}`}
                          className="flex-1 px-8 py-4 rounded-xl bg-[var(--primary)] text-black font-bold hover:bg-[#00E847] transition-all shadow-[0_0_30px_rgba(0,204,61,0.3)] text-center"
                        >
                          View Full Analysis →
                        </Link>
                      )}
                    </div>

                    {/* Email Capture - Only for users without active subscription */}
                    {!hasActiveSubscription && (
                      <div className="max-w-lg mx-auto p-8 rounded-2xl bg-[var(--primary)]/5 border border-[var(--primary)]/20">
                        <div className="text-center mb-6">
                          <span className="text-4xl mb-3 block">🔓</span>
                          <h3 className="text-xl font-bold text-white mb-2">Unlock Full Analysis</h3>
                          <p className="text-sm text-white/60">
                            Enter your email to access the complete niche report with market research, competitor analysis, and marketing playbook.
                          </p>
                        </div>
                        <form onSubmit={handleEmailSubmit} className="space-y-4">
                          <input
                            type="email"
                            value={rouletteEmail}
                            onChange={(e) => setRouletteEmail(e.target.value)}
                            placeholder="your@email.com"
                            required
                            className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-4 text-white text-center focus:border-[var(--primary)] focus:ring-0 outline-none transition-all placeholder:text-white/30"
                          />
                          <button
                            type="submit"
                            disabled={!isValidEmail(rouletteEmail)}
                            className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${
                              isValidEmail(rouletteEmail)
                                ? 'bg-[var(--primary)] text-black hover:bg-[#00E847] shadow-[0_0_30px_rgba(0,204,61,0.3)]'
                                : 'bg-white/10 text-white/30 cursor-not-allowed'
                            }`}
                          >
                            View Full Analysis →
                          </button>
                        </form>
                        <p className="text-center text-xs text-white/30 mt-4">
                          Free • No spam • Unsubscribe anytime
                        </p>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </LiquidCard>

          {/* Social proof - Largeur fixe pour éviter CLS */}
          <div className="text-center mt-8 text-sm text-white/30 font-mono min-h-[20px]">
            <span className="tabular-nums">{loading ? '-- real niches • Spun ----- times today' : `${niches.length} real niches • Spun ${12847 + spinCount} times today`}</span>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            How It <span className="text-[var(--primary)]">Works</span>
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { step: "1", title: "Spin the Wheel", desc: "Click the button and let fate choose a niche from our curated database of validated ideas." },
              { step: "2", title: "Preview the Niche", desc: "See key metrics like revenue potential, competition level, and time to MVP at a glance." },
              { step: "3", title: "Unlock Full Analysis", desc: "Enter your email to access the complete market research, strategy, and competitor breakdown." },
            ].map((item, i) => (
              <LiquidCard key={i} className="p-8 text-center">
                <div className="w-12 h-12 rounded-full bg-[var(--primary)]/20 text-[var(--primary)] flex items-center justify-center text-lg font-bold mx-auto mb-6">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{item.desc}</p>
              </LiquidCard>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <LiquidCard className="p-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Want More <span className="text-[var(--primary)]">Validated Niches</span>?
            </h2>
            <p className="text-white/60 text-lg mb-8">
              Access our full database of {niches.length}+ pre-validated niche ideas with detailed reports, competition analysis, and marketing playbooks.
            </p>
            <Link
              href="/niches"
              className="inline-block btn-primary text-lg px-10 py-5"
            >
              Browse All Niches →
            </Link>
          </LiquidCard>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 opacity-50">
            <span className="font-bold text-sm tracking-widest">NICHES HUNTER</span>
          </div>
          <div className="flex gap-8 text-sm text-[rgba(255,255,255,0.4)]">
            <a href="/privacy" className="hover:text-white transition-colors">Privacy</a>
            <a href="/terms" className="hover:text-white transition-colors">Terms</a>
            <a href="https://x.com/nicheshunter" className="hover:text-white transition-colors">Twitter</a>
          </div>
          <div className="text-xs text-[rgba(255,255,255,0.2)]">
            © 2026 Niches Hunter. All rights reserved.
          </div>
        </div>
      </footer>

      {/* SUBSCRIBE MODAL */}
      {showSubscribeModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl"
          onClick={() => setShowSubscribeModal(false)}
        >
          <LiquidCard
            className="w-full max-w-lg p-1 !p-1 relative shadow-[0_0_150px_rgba(0,204,61,0.2)]"
          >
            <div className="bg-[#050505] rounded-[22px] p-8 md:p-10 relative overflow-hidden" onClick={(e) => e.stopPropagation()}>
              {/* Close Button */}
              <button onClick={(e) => { e.stopPropagation(); setShowSubscribeModal(false); }} className="absolute top-5 right-5 text-white/20 hover:text-white text-xl transition-colors z-20">✕</button>

              <div className="text-center mb-8 relative z-10">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-[var(--primary)]/20 border border-[var(--primary)]/30 flex items-center justify-center">
                  <span className="text-3xl">🎰</span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  Get <span className="text-[var(--primary)]">Daily Niche Ideas</span>
                </h3>
                <p className="text-sm text-[rgba(255,255,255,0.6)]">
                  Join 2,100+ indie devs getting validated niches in their inbox.
                </p>
              </div>

              <form onSubmit={async (e) => { 
                e.preventDefault();
                try {
                  await fetch('/api/subscribe', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: rouletteEmail }),
                  });
                  setShowSubscribeModal(false);
                } catch (error) {
                  console.error('Subscribe error:', error);
                }
              }} className="space-y-4">
                <input
                  type="email"
                  value={rouletteEmail}
                  onChange={(e) => setRouletteEmail(e.target.value)}
                  placeholder="Enter your email address"
                  required
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-4 text-white text-center focus:border-[var(--primary)] focus:bg-black/80 focus:ring-0 outline-none transition-all placeholder:text-white/20 font-mono text-sm"
                  autoFocus
                />
                <button 
                  type="submit" 
                  disabled={!isValidEmail(rouletteEmail)}
                  className={`w-full py-4 text-sm font-bold tracking-wider uppercase rounded-xl transition-all ${
                    isValidEmail(rouletteEmail)
                      ? 'bg-[var(--primary)] hover:bg-[#00E847] text-black shadow-[0_0_20px_rgba(0,204,61,0.3)] hover:shadow-[0_0_30px_rgba(0,204,61,0.5)]'
                      : 'bg-white/10 text-white/30 cursor-not-allowed'
                  }`}
                >
                  🚀 Subscribe Now
                </button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-[10px] text-white/30">
                  100% free • Unsubscribe anytime • No spam ever
                </p>
              </div>
            </div>
          </LiquidCard>
        </div>
      )}
    </main>
  );
}
