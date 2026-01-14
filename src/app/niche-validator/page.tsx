"use client";

import { useState, useRef, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Link from "next/link";

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

// Types
interface ValidationResult {
  score: number;
  scoreLabel: string;
  marketSize: string;
  competition: string;
  difficulty: string;
  timeToMVP: string;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  marketInsights: string;
}

// Loading messages (terminal style)
const loadingMessages = [
  "Connecting to AI...",
  "Analyzing market size...",
  "Evaluating competition...",
  "Assessing difficulty...",
  "Generating insights...",
];

export default function NicheValidatorPage() {
  const [showSubscribeModal, setShowSubscribeModal] = useState(false);
  const [modalEmail, setModalEmail] = useState("");
  
  // Form state
  const [nicheIdea, setNicheIdea] = useState("");
  
  // UI state
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [result, setResult] = useState<ValidationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [requiresSubscription, setRequiresSubscription] = useState(false);
  
  // Check subscription status on mount (via /api/auth/me pour cohérence)
  const [hasSubscription, setHasSubscription] = useState<boolean | null>(null);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  
  useEffect(() => {
    async function checkSubscription() {
      try {
        const response = await fetch('/api/auth/me', {
          credentials: 'include',
        });
        const data = await response.json();
        setHasSubscription(data.subscription?.status === 'active');
      } catch {
        setHasSubscription(false);
      }
    }
    checkSubscription();
  }, []);

  // Handle Stripe checkout
  const handleCheckout = async () => {
    setCheckoutLoading(true);
    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nicheId: 'niche-validator', mode: 'lifetime' }),
      });
      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Checkout error:', error);
    } finally {
      setCheckoutLoading(false);
    }
  };
  
  const formRef = useRef<HTMLDivElement>(null);

  // Handle form submission - animate then check subscription BEFORE calling API
  const handleValidate = async () => {
    if (!nicheIdea.trim()) return;
    
    setIsAnalyzing(true);
    setResult(null);
    setError(null);
    setRequiresSubscription(false);
    setCurrentMessageIndex(0);
    
    // Animate through loading messages (but STOP before last one if no subscription)
    // Messages: 0=Connecting, 1=Analyzing market, 2=Evaluating competition, 3=Assessing difficulty, 4=Generating insights
    for (let i = 0; i < loadingMessages.length - 1; i++) {
      setCurrentMessageIndex(i);
      await new Promise(resolve => setTimeout(resolve, 900));
    }
    
    // CHECK SUBSCRIPTION HERE - Before "Generating insights..."
    if (hasSubscription !== true) {
      // Small pause then block
      await new Promise(resolve => setTimeout(resolve, 500));
      setRequiresSubscription(true);
      setIsAnalyzing(false);
      return;
    }
    
    // Only subscribers get to see "Generating insights..."
    setCurrentMessageIndex(loadingMessages.length - 1);
    await new Promise(resolve => setTimeout(resolve, 900));
    
    // Small pause on last message
    await new Promise(resolve => setTimeout(resolve, 500));
    
    try {
      const response = await fetch('/api/niches/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ nicheIdea: nicheIdea.trim() }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        if (data.code === 'SUBSCRIPTION_REQUIRED') {
          setRequiresSubscription(true);
          setHasSubscription(false);
        } else {
          setError(data.error || 'Failed to analyze niche');
        }
        return;
      }
      
      setResult(data.analysis);
      
    } catch (err) {
      console.error('Validation error:', err);
      setError('Network error. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Reset form
  const handleReset = () => {
    setResult(null);
    setError(null);
    setRequiresSubscription(false);
    setNicheIdea("");
    formRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Get score color
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-[var(--primary)]';
    if (score >= 60) return 'text-yellow-400';
    if (score >= 40) return 'text-orange-400';
    return 'text-red-400';
  };

  // Get score ring color
  const getScoreRingColor = (score: number) => {
    if (score >= 80) return '#00CC3D';
    if (score >= 60) return '#FACC15';
    if (score >= 40) return '#FB923C';
    return '#EF4444';
  };

  return (
    <main className="min-h-screen relative overflow-hidden text-white font-sans selection:bg-[var(--primary)] selection:text-black">
      
      {/* Navigation */}
      <Navbar onSubscribeClick={() => setShowSubscribeModal(true)} />

      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/3 w-[800px] h-[800px] bg-[var(--primary)]/3 blur-[200px] rounded-full" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-500/5 blur-[150px] rounded-full" />
      </div>

      {/* Hero Section */}
      <section className="relative pt-32 pb-8 px-6">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[var(--primary)]/30 bg-[var(--primary)]/10 mb-8 backdrop-blur-md">
            <span className="text-sm font-medium text-[var(--primary)] tracking-wide uppercase">
              {hasSubscription ? 'Pro Tool' : 'Premium Tool'}
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold leading-[1.1] mb-6 tracking-tighter">
            Niche <span className="text-flashy-green">Validator</span>
          </h1>

          <p className="text-lg md:text-xl text-[rgba(255,255,255,0.6)] mb-8 max-w-2xl mx-auto leading-relaxed">
            Validate your niche idea with AI-powered market analysis. Get instant scoring, competition insights, and actionable recommendations.
          </p>
        </div>
      </section>

      {/* Main Form / Results Section */}
      <section className="py-8 px-6" ref={formRef}>
        <div className="max-w-4xl mx-auto">
          
          {/* Subscription Required State */}
          {requiresSubscription && !isAnalyzing && (
            <LiquidCard className="p-8 md:p-12 relative overflow-hidden">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[var(--primary)]/5 blur-[120px] rounded-full pointer-events-none" />
              
              <div className="relative z-10 text-center">
                <div className="w-24 h-24 mx-auto mb-6 rounded-2xl bg-[var(--primary)]/10 border border-[var(--primary)]/20 flex items-center justify-center">
                  <span className="text-5xl">🔒</span>
                </div>
                <h2 className="text-2xl font-bold mb-4">Premium Feature</h2>
                <p className="text-white/60 mb-8 max-w-md mx-auto">
                  The AI-powered Niche Validator is available for Pro subscribers. 
                  Get unlimited validations, detailed market analysis, and actionable recommendations.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    href="/pricing"
                    className="px-8 py-4 rounded-xl bg-[var(--primary)] text-black font-bold hover:bg-[#00E847] transition-all shadow-[0_0_30px_rgba(0,204,61,0.3)] text-center"
                  >
                    Upgrade to Pro →
                  </Link>
                  <button
                    onClick={handleReset}
                    className="px-8 py-4 rounded-xl bg-white/10 border border-white/20 text-white font-bold hover:bg-white/20 transition-all"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            </LiquidCard>
          )}

          {/* Error State */}
          {error && !isAnalyzing && !requiresSubscription && (
            <LiquidCard className="p-8 md:p-12 relative overflow-hidden">
              <div className="relative z-10 text-center">
                <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                  <span className="text-4xl">⚠️</span>
                </div>
                <h2 className="text-2xl font-bold mb-4 text-red-400">Analysis Failed</h2>
                <p className="text-white/60 mb-8">{error}</p>
                <button
                  onClick={handleReset}
                  className="px-8 py-4 rounded-xl bg-white/10 border border-white/20 text-white font-bold hover:bg-white/20 transition-all"
                >
                  Try Again
                </button>
              </div>
            </LiquidCard>
          )}

          {/* Form State - Accessible for everyone */}
          {!result && !isAnalyzing && !requiresSubscription && !error && (
            <LiquidCard className="p-8 md:p-12 relative overflow-hidden">
            {/* Background glow */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[var(--primary)]/5 blur-[120px] rounded-full pointer-events-none" />
              
              <div className="relative z-10">
                <div className="text-center mb-8">
                  <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-[var(--primary)]/10 border border-[var(--primary)]/20 flex items-center justify-center">
                    <span className="text-4xl">🎯</span>
                  </div>
                  <h2 className="text-2xl font-bold mb-2">What's your niche idea?</h2>
                  <p className="text-white/50">Describe your app or business concept in a few words</p>
              </div>

                <div className="space-y-6">
                  <input
                    type="text"
                    value={nicheIdea}
                    onChange={(e) => setNicheIdea(e.target.value)}
                    placeholder="Ex: Invoice generator for YouTubers"
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-6 py-5 text-white text-lg md:text-xl text-center focus:border-[var(--primary)] focus:ring-0 outline-none transition-all placeholder:text-white/30"
                    onKeyDown={(e) => e.key === 'Enter' && handleValidate()}
                    maxLength={200}
                  />
                  
                  <button
                    onClick={handleValidate}
                    disabled={!nicheIdea.trim()}
                    className={`w-full py-5 rounded-xl font-bold text-lg transition-all ${
                      nicheIdea.trim()
                        ? 'bg-[var(--primary)] text-black hover:bg-[#00E847] shadow-[0_0_30px_rgba(0,204,61,0.3)] hover:shadow-[0_0_50px_rgba(0,204,61,0.5)]'
                        : 'bg-white/10 text-white/30 cursor-not-allowed'
                    }`}
                  >
                    Validate My Niche →
                  </button>
                </div>

                {/* Examples */}
                <div className="mt-8 pt-6 border-t border-white/10">
                  <p className="text-xs text-white/40 text-center mb-3">Try these examples:</p>
                  <div className="flex flex-wrap justify-center gap-2">
                    {[
                      "AI writing assistant for students",
                      "Habit tracker for ADHD",
                      "B2B invoice automation",
                      "Social fitness app",
                    ].map((example, i) => (
                      <button
                        key={i}
                        onClick={() => setNicheIdea(example)}
                        className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-white/60 hover:bg-white/10 hover:text-white transition-all"
                      >
                        {example}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </LiquidCard>
          )}

          {/* Loading State */}
          {isAnalyzing && (
            <LiquidCard className="p-12 md:p-16 relative overflow-hidden">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[var(--primary)]/5 blur-[100px] rounded-full pointer-events-none animate-pulse" />
              
              <div className="relative z-10 text-center">
                {/* Terminal style loading */}
                <div className="max-w-md mx-auto mb-8 p-6 rounded-xl bg-black/60 border border-white/10 font-mono text-left">
                  <div className="flex items-center gap-2 mb-4 pb-3 border-b border-white/10">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                    <span className="text-xs text-white/40 ml-2">niche-validator-ai</span>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    {loadingMessages.map((msg, i) => {
                      const isActive = i === currentMessageIndex;
                      const isPast = i < currentMessageIndex;
                      
                      return (
                        <div 
                          key={i} 
                          className={`flex items-center gap-2 transition-opacity duration-300 ${
                            isPast ? 'text-[var(--primary)]' : 
                            isActive ? 'text-white' : 'text-white/20'
                          }`}
                        >
                          <span className="text-[var(--primary)]">$</span>
                          <span>{msg}</span>
                          {isActive && <span className="animate-pulse">▊</span>}
                          {isPast && <span className="text-[var(--primary)]">✓</span>}
                        </div>
                      );
                    })}
                  </div>
                </div>

                <h2 className="text-2xl font-bold mb-2">AI is analyzing your niche...</h2>
                <p className="text-white/50">"{nicheIdea}"</p>
              </div>
            </LiquidCard>
          )}

          {/* Results State */}
          {result && !isAnalyzing && (
            <LiquidCard className="p-8 md:p-12 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[var(--primary)]/10 blur-[100px] rounded-full pointer-events-none" />
              
              <div className="relative z-10">
                {/* Score Circle */}
                <div className="text-center mb-10">
                  <div className="relative w-40 h-40 mx-auto mb-6">
                    {/* Background ring */}
                    <svg className="w-full h-full" viewBox="0 0 100 100">
                      <circle
                        cx="50"
                        cy="50"
                        r="42"
                        fill="none"
                        stroke="rgba(255,255,255,0.1)"
                        strokeWidth="6"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r="42"
                        fill="none"
                        stroke={getScoreRingColor(result.score)}
                        strokeWidth="6"
                        strokeLinecap="round"
                        strokeDasharray={`${(result.score / 100) * 264} 264`}
                        transform="rotate(-90 50 50)"
                      />
                    </svg>
                    {/* Score number */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className={`text-5xl font-bold ${getScoreColor(result.score)}`}>{result.score}</span>
                      <span className="text-xs text-white/50">/100</span>
                    </div>
                  </div>
                  <h2 className={`text-2xl font-bold ${getScoreColor(result.score)}`}>{result.scoreLabel}</h2>
                  <p className="text-white/50 mt-2">"{nicheIdea}"</p>
                </div>

                {/* Market Insights */}
                {result.marketInsights && (
                  <div className="mb-10 p-6 rounded-xl bg-[var(--primary)]/5 border border-[var(--primary)]/20">
                    <h3 className="font-bold text-[var(--primary)] mb-3 flex items-center gap-2">
                      <span>🎯</span> Market Insight
                    </h3>
                    <p className="text-white/80 leading-relaxed">{result.marketInsights}</p>
                  </div>
                )}

                {/* Metrics Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                  <div className="p-5 rounded-xl bg-black/40 border border-white/10 text-center">
                    <div className="text-2xl mb-2">📊</div>
                    <div className="text-xs text-white/40 uppercase mb-1">Market Size</div>
                    <div className={`font-bold ${
                      result.marketSize === 'Large' ? 'text-[var(--primary)]' :
                      result.marketSize === 'Medium' ? 'text-yellow-400' : 'text-white/70'
                    }`}>{result.marketSize}</div>
                  </div>
                  <div className="p-5 rounded-xl bg-black/40 border border-white/10 text-center">
                    <div className="text-2xl mb-2">⚔️</div>
                    <div className="text-xs text-white/40 uppercase mb-1">Competition</div>
                    <div className={`font-bold ${
                      result.competition === 'Low' ? 'text-[var(--primary)]' :
                      result.competition === 'Medium' ? 'text-yellow-400' : 'text-orange-400'
                    }`}>{result.competition}</div>
                  </div>
                  <div className="p-5 rounded-xl bg-black/40 border border-white/10 text-center">
                    <div className="text-2xl mb-2">🎯</div>
                    <div className="text-xs text-white/40 uppercase mb-1">Difficulty</div>
                    <div className={`font-bold ${
                      result.difficulty === 'Easy' ? 'text-[var(--primary)]' :
                      result.difficulty === 'Medium' ? 'text-yellow-400' : 'text-orange-400'
                    }`}>{result.difficulty}</div>
                  </div>
                  <div className="p-5 rounded-xl bg-black/40 border border-white/10 text-center">
                    <div className="text-2xl mb-2">⏱️</div>
                    <div className="text-xs text-white/40 uppercase mb-1">Time to MVP</div>
                    <div className="font-bold text-white">{result.timeToMVP}</div>
                  </div>
                </div>

                {/* Why this score */}
                <div className="grid md:grid-cols-2 gap-6 mb-10">
                  {/* Strengths */}
                  <div className="p-6 rounded-xl bg-[var(--primary)]/5 border border-[var(--primary)]/20">
                    <h3 className="font-bold text-[var(--primary)] mb-4 flex items-center gap-2">
                      <span>✅</span> Strengths
                    </h3>
                    <div className="space-y-3">
                      {result.strengths.map((strength, i) => (
                        <div key={i} className="flex items-start gap-2 text-sm text-white/70">
                          <span className="text-[var(--primary)] mt-0.5">•</span>
                          <span>{strength}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Weaknesses */}
                  <div className="p-6 rounded-xl bg-orange-500/5 border border-orange-500/20">
                    <h3 className="font-bold text-orange-400 mb-4 flex items-center gap-2">
                      <span>⚠️</span> Challenges
                    </h3>
                    <div className="space-y-3">
                      {result.weaknesses.map((weakness, i) => (
                        <div key={i} className="flex items-start gap-2 text-sm text-white/70">
                          <span className="text-orange-400 mt-0.5">•</span>
                          <span>{weakness}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Recommendations */}
                <div className="p-6 rounded-xl bg-white/5 border border-white/10 mb-10">
                  <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                    <span>💡</span> Recommendations
                  </h3>
                  <div className="space-y-4">
                    {result.recommendations.map((rec, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-[var(--primary)]/20 text-[var(--primary)] flex items-center justify-center text-xs font-bold shrink-0">
                          {i + 1}
                        </div>
                        <span className="text-white/80">{rec}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CTAs */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    href="/niches"
                    className="flex-1 py-4 rounded-xl bg-[var(--primary)] text-black font-bold hover:bg-[#00E847] transition-all shadow-[0_0_20px_rgba(0,204,61,0.3)] text-center"
                  >
                    Explore Similar Niches →
                  </Link>
                  <button
                    onClick={handleReset}
                    className="flex-1 py-4 rounded-xl bg-white/10 border border-white/20 text-white font-bold hover:bg-white/20 transition-all"
                  >
                    Try Another Niche
                  </button>
              </div>
            </div>
          </LiquidCard>
          )}

        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            How It <span className="text-[var(--primary)]">Works</span>
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: "📝", title: "Enter Your Idea", desc: "Describe your niche in a few words. Be specific about your target audience." },
              { icon: "🤖", title: "AI Analysis", desc: "Our AI analyzes market potential, competition, and success patterns in real-time." },
              { icon: "🎯", title: "Get Insights", desc: "Receive a detailed score with strengths, weaknesses, and actionable recommendations." },
            ].map((item, i) => (
              <LiquidCard key={i} className="p-8 text-center">
                <div className="w-16 h-16 rounded-2xl bg-[var(--primary)]/10 text-4xl flex items-center justify-center mx-auto mb-6 border border-[var(--primary)]/20">
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                  <p className="text-white/50 text-sm leading-relaxed">{item.desc}</p>
              </LiquidCard>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-12 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-3 px-6 py-4 rounded-2xl bg-white/5 border border-white/10">
            <span className="w-2 h-2 rounded-full bg-[var(--primary)] animate-pulse" />
            <span className="text-white/60">
              Powered by <span className="text-white font-bold">GPT-5.2</span> • Trained on <span className="text-white font-bold">40,000+ iOS apps</span> data
            </span>
          </div>
        </div>
      </section>

      {/* Back to Tools */}
      <section className="py-12 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-white/40 mb-4">Explore more tools</p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="/niches" className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-medium hover:bg-white/10 transition-all flex items-center gap-2">
              💡 Niche Ideas
            </a>
            <a href="/niche-roulette" className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-medium hover:bg-white/10 transition-all flex items-center gap-2">
              🎰 Niche Roulette
            </a>
            <a href="/revenue-estimator" className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-medium hover:bg-white/10 transition-all flex items-center gap-2">
              💰 Revenue Estimator
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 opacity-50">
            <span className="font-bold text-sm tracking-widest">NICHES HUNTER</span>
          </div>
          <div className="flex gap-8 text-sm text-[rgba(255,255,255,0.4)]">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="https://x.com/Tobby_scraper" className="hover:text-white transition-colors">Twitter</a>
          </div>
          <div className="text-xs text-[rgba(255,255,255,0.2)]">
            © 2026 Niches Hunter. All rights reserved.
          </div>
        </div>
      </footer>

      {/* EMAIL CAPTURE MODAL */}
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

              <div className="text-center mb-6 relative z-10">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-[var(--primary)]/20 border border-[var(--primary)]/30 flex items-center justify-center">
                  <span className="text-3xl">🎯</span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  Get <span className="text-[var(--primary)]">Pro Access</span>
                </h3>
                <p className="text-sm text-white/50">
                  Unlock AI-powered niche validation and all premium features
                </p>
              </div>

              <div className="space-y-3 mb-8">
                {[
                  "Unlimited AI validations",
                  "50+ curated niche ideas",
                  "Full market analysis",
                  "Marketing playbooks"
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm text-white/70">
                    <span className="text-[var(--primary)]">✓</span>
                    {item}
                  </div>
                ))}
              </div>

              <form onSubmit={(e) => { e.preventDefault(); setShowSubscribeModal(false); }} className="space-y-4">
                <input
                  type="email"
                  value={modalEmail}
                  onChange={(e) => setModalEmail(e.target.value)}
                  placeholder="Enter your email address"
                  required
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-4 text-white text-center focus:border-[var(--primary)] focus:bg-black/80 focus:ring-0 outline-none transition-all placeholder:text-white/20 font-mono text-sm"
                  autoFocus
                />
                <button type="submit" className="w-full py-4 text-sm font-bold tracking-wider uppercase rounded-xl bg-[var(--primary)] hover:bg-[#00E847] text-black transition-all shadow-[0_0_20px_rgba(0,204,61,0.3)] hover:shadow-[0_0_30px_rgba(0,204,61,0.5)]">
                  🚀 Get Started
                </button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-[10px] text-white/30">
                  7-day free trial • Cancel anytime
                </p>
              </div>
            </div>
          </LiquidCard>
        </div>
      )}
    </main>
  );
}
