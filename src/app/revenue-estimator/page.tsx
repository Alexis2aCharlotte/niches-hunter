"use client";

import { useState, useRef, useEffect } from "react";
import Navbar from "@/components/Navbar";

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
type BusinessModel = 'subscription' | 'one-time' | 'freemium' | 'ads';
type Market = 'US' | 'EU' | 'UK' | 'Asia' | 'Global';

interface RevenueResult {
  minMRR: number;
  maxMRR: number;
  avgMRR: number;
  yearOneMin: number;
  yearOneMax: number;
  usersNeededMin: number;
  usersNeededMax: number;
  avgTicket: number;
  conversionRate: string;
  similarApps: number;
  factors: {
    name: string;
    input: string;
    impact: string;
  }[];
}

// Business model data
const businessModels = [
  { id: 'subscription' as BusinessModel, label: 'Subscription', desc: '$9-29/mo', icon: '🔄' },
  { id: 'one-time' as BusinessModel, label: 'One-time', desc: '$29-99', icon: '💎' },
  { id: 'freemium' as BusinessModel, label: 'Freemium + Premium', desc: 'Free + Paid', icon: '🎁' },
  { id: 'ads' as BusinessModel, label: 'Ads-based', desc: 'Free', icon: '📺' },
];

const markets = [
  { id: 'US' as Market, label: 'US', flag: '🇺🇸' },
  { id: 'EU' as Market, label: 'EU', flag: '🇪🇺' },
  { id: 'UK' as Market, label: 'UK', flag: '🇬🇧' },
  { id: 'Asia' as Market, label: 'Asia', flag: '🌏' },
  { id: 'Global' as Market, label: 'Global', flag: '🌍' },
];

// Loading messages
const loadingMessages = [
  "Analyzing market size...",
  "Comparing similar apps...",
  "Estimating conversions...",
  "Calculating revenue potential...",
];

export default function RevenueEstimatorPage() {
  
  // Form state
  const [appIdea, setAppIdea] = useState("");
  const [businessModel, setBusinessModel] = useState<BusinessModel | null>(null);
  const [selectedMarkets, setSelectedMarkets] = useState<Market[]>([]);
  const [email, setEmail] = useState("");
  
  // UI state
  const [isCalculating, setIsCalculating] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingMessage, setLoadingMessage] = useState(loadingMessages[0]);
  const [result, setResult] = useState<RevenueResult | null>(null);
  
  // Auth state
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [hasActiveSubscription, setHasActiveSubscription] = useState<boolean>(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  
  // Check if user is logged in AND has active subscription
  useEffect(() => {
    async function checkAuth() {
      try {
        const response = await fetch('/api/auth/me', {
          credentials: 'include',
        });
        const data = await response.json();
        setIsLoggedIn(!!data.user);
        // Vérifier si l'abonnement est actif
        setHasActiveSubscription(data.subscription?.status === 'active');
      } catch {
        setIsLoggedIn(false);
        setHasActiveSubscription(false);
      }
    }
    checkAuth();
  }, []);

  // Handle Stripe checkout
  const handleCheckout = async () => {
    setCheckoutLoading(true);
    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nicheId: 'revenue-estimator', mode: 'lifetime' }),
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

  // Toggle market selection
  const toggleMarket = (market: Market) => {
    setSelectedMarkets(prev => 
      prev.includes(market) 
        ? prev.filter(m => m !== market)
        : [...prev, market]
    );
  };

  // Calculate revenue (mocked)
  const calculateRevenue = (): RevenueResult => {
    // Base MRR by business model
    let baseMin = 5000;
    let baseMax = 15000;
    
    switch (businessModel) {
      case 'subscription':
        baseMin = 5000;
        baseMax = 15000;
        break;
      case 'one-time':
        baseMin = 3000;
        baseMax = 8000;
        break;
      case 'freemium':
        baseMin = 2000;
        baseMax = 10000;
        break;
      case 'ads':
        baseMin = 500;
        baseMax = 2000;
        break;
    }

    // Market multipliers
    let marketMultiplier = 1;
    const marketFactors: string[] = [];
    
    if (selectedMarkets.includes('US')) {
      marketMultiplier *= 1.3;
      marketFactors.push('US +30%');
    }
    if (selectedMarkets.includes('EU')) {
      marketMultiplier *= 1.1;
      marketFactors.push('EU +10%');
    }
    if (selectedMarkets.includes('UK')) {
      marketMultiplier *= 1.05;
      marketFactors.push('UK +5%');
    }
    if (selectedMarkets.includes('Asia')) {
      marketMultiplier *= 1.15;
      marketFactors.push('Asia +15%');
    }
    if (selectedMarkets.includes('Global')) {
      marketMultiplier *= 1.5;
      marketFactors.push('Global +50%');
    }

    // Keyword multipliers
    const ideaLower = appIdea.toLowerCase();
    let keywordMultiplier = 1;
    const keywordFactors: string[] = [];
    
    if (ideaLower.includes('ai') || ideaLower.includes('artificial intelligence')) {
      keywordMultiplier *= 1.2;
      keywordFactors.push('AI trend +20%');
    }
    if (ideaLower.includes('b2b') || ideaLower.includes('business')) {
      keywordMultiplier *= 1.4;
      keywordFactors.push('B2B +40%');
    }
    if (ideaLower.includes('health') || ideaLower.includes('fitness')) {
      keywordMultiplier *= 1.15;
      keywordFactors.push('Health niche +15%');
    }
    if (ideaLower.includes('productivity') || ideaLower.includes('focus')) {
      keywordMultiplier *= 1.1;
      keywordFactors.push('Productivity +10%');
    }

    // Final calculations
    const minMRR = Math.round(baseMin * marketMultiplier * keywordMultiplier);
    const maxMRR = Math.round(baseMax * marketMultiplier * keywordMultiplier);
    const avgMRR = Math.round((minMRR + maxMRR) / 2);

    // Average ticket based on model
    const avgTicket = businessModel === 'subscription' ? 12 : 
                      businessModel === 'one-time' ? 49 : 
                      businessModel === 'freemium' ? 8 : 0.5;

    // Users needed
    const usersNeededMin = avgTicket > 0 ? Math.round(minMRR / avgTicket) : Math.round(minMRR * 1000);
    const usersNeededMax = avgTicket > 0 ? Math.round(maxMRR / avgTicket) : Math.round(maxMRR * 1000);

    // Build factors table
    const factors = [
      {
        name: 'Target Market',
        input: selectedMarkets.join(' + '),
        impact: marketMultiplier > 1 ? `+${Math.round((marketMultiplier - 1) * 100)}%` : '—'
      },
      {
        name: 'Business Model',
        input: businessModels.find(m => m.id === businessModel)?.label || '',
        impact: businessModel === 'subscription' ? '+40%' : 
                businessModel === 'freemium' ? '+20%' : 
                businessModel === 'one-time' ? '+10%' : '-20%'
      },
      {
        name: 'Your Niche',
        input: appIdea,
        impact: keywordMultiplier > 1 ? `+${Math.round((keywordMultiplier - 1) * 100)}%` : '—'
      },
      {
        name: 'Competition',
        input: 'Medium',
        impact: '-10%'
      }
    ];

    return {
      minMRR,
      maxMRR,
      avgMRR,
      yearOneMin: minMRR * 12,
      yearOneMax: maxMRR * 12,
      usersNeededMin,
      usersNeededMax,
      avgTicket,
      conversionRate: businessModel === 'freemium' ? '2-4%' : '3-5%',
      similarApps: Math.floor(Math.random() * 30) + 30,
      factors
    };
  };

  // Handle form submission
  const handleCalculate = async () => {
    // If no active subscription, require email
    if (!appIdea || !businessModel || selectedMarkets.length === 0) return;
    if (!hasActiveSubscription && !isValidEmail(email)) return;
    
    setIsCalculating(true);
    setLoadingProgress(0);
    
    // Subscribe email in background (only if no active subscription)
    if (!hasActiveSubscription && email) {
      try {
        await fetch('/api/subscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        });
      } catch (e) {
        // Continue even if subscribe fails
      }
    }
    
    // Simulate loading with progress
    for (let i = 0; i <= 100; i += 5) {
      await new Promise(resolve => setTimeout(resolve, 80));
      setLoadingProgress(i);
      
      // Update loading message
      if (i < 25) setLoadingMessage(loadingMessages[0]);
      else if (i < 50) setLoadingMessage(loadingMessages[1]);
      else if (i < 75) setLoadingMessage(loadingMessages[2]);
      else setLoadingMessage(loadingMessages[3]);
    }
    
    const calculatedResult = calculateRevenue();
    setResult(calculatedResult);
    setIsCalculating(false);
  };

  // Reset form
  const handleReset = () => {
    setResult(null);
    setAppIdea("");
    setBusinessModel(null);
    setSelectedMarkets([]);
    formRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Adjust parameters (scroll to form)
  const handleAdjust = () => {
    setResult(null);
    formRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(0)}K`;
    }
    return `$${amount}`;
  };

  // Validate email format
  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isFormValid = appIdea.length > 0 && businessModel !== null && selectedMarkets.length > 0 && (hasActiveSubscription || isValidEmail(email));

  return (
    <main className="min-h-screen relative overflow-hidden text-white font-sans selection:bg-[var(--primary)] selection:text-black">
      
      {/* Navigation */}
      <Navbar />

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
            <span className="text-sm font-medium text-[var(--primary)] tracking-wide uppercase">Free Tool</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold leading-[1.1] mb-6 tracking-tighter">
            Revenue <span className="text-flashy-green">Estimator</span>
          </h1>

          <p className="text-lg md:text-xl text-[rgba(255,255,255,0.6)] mb-8 max-w-2xl mx-auto leading-relaxed">
            Estimate your potential MRR before writing a single line of code. Based on real market data from similar apps.
          </p>
        </div>
      </section>

      {/* Main Form / Results Section */}
      <section className="py-8 px-6" ref={formRef}>
        <div className="max-w-4xl mx-auto">
          
          {/* Form State */}
          {!result && !isCalculating && (
            <LiquidCard className="p-8 md:p-12 relative overflow-hidden">
            {/* Background glow */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[var(--primary)]/5 blur-[120px] rounded-full pointer-events-none" />
              
              <div className="relative z-10 space-y-10">
                
                {/* Step 1 - Your Niche */}
                  <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 rounded-full bg-[var(--primary)]/20 text-[var(--primary)] flex items-center justify-center text-sm font-bold">1</div>
                    <h3 className="text-xl font-bold">Your Niche</h3>
                  </div>
                  <input
                    type="text"
                    value={appIdea}
                    onChange={(e) => setAppIdea(e.target.value)}
                    placeholder="Ex: Habit tracker for ADHD"
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-4 text-white text-lg focus:border-[var(--primary)] focus:ring-0 outline-none transition-all placeholder:text-white/30"
                  />
                </div>

                {/* Step 2 - Business Model */}
                  <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 rounded-full bg-[var(--primary)]/20 text-[var(--primary)] flex items-center justify-center text-sm font-bold">2</div>
                    <h3 className="text-xl font-bold">Business Model</h3>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {businessModels.map((model) => (
                      <button
                        key={model.id}
                        onClick={() => setBusinessModel(model.id)}
                        className={`p-4 rounded-xl border text-left transition-all ${
                          businessModel === model.id
                            ? 'bg-[var(--primary)]/20 border-[var(--primary)] shadow-[0_0_20px_rgba(0,204,61,0.2)]'
                            : 'bg-black/40 border-white/10 hover:border-white/30'
                        }`}
                      >
                        <div className="text-2xl mb-2">{model.icon}</div>
                        <div className="font-bold text-white text-sm">{model.label}</div>
                        <div className="text-xs text-white/50">{model.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Step 3 - Target Market */}
                  <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 rounded-full bg-[var(--primary)]/20 text-[var(--primary)] flex items-center justify-center text-sm font-bold">3</div>
                    <h3 className="text-xl font-bold">Target Market</h3>
                    <span className="text-xs text-white/40">(select multiple)</span>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {markets.map((market) => (
                      <button
                        key={market.id}
                        onClick={() => toggleMarket(market.id)}
                        className={`px-5 py-3 rounded-xl border text-sm font-medium transition-all flex items-center gap-2 ${
                          selectedMarkets.includes(market.id)
                            ? 'bg-[var(--primary)]/20 border-[var(--primary)] text-[var(--primary)] shadow-[0_0_15px_rgba(0,204,61,0.2)]'
                            : 'bg-black/40 border-white/10 text-white/70 hover:border-white/30 hover:text-white'
                        }`}
                      >
                        <span className="text-lg">{market.flag}</span>
                        {market.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Email (only if not logged in OR no active subscription) + Calculate Button */}
                <div className="flex flex-col sm:flex-row gap-3">
                  {!hasActiveSubscription && (
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      className="flex-1 bg-black/40 border border-white/10 rounded-xl px-5 py-4 text-white focus:border-[var(--primary)] focus:ring-0 outline-none transition-all placeholder:text-white/30"
                    />
                  )}
                  <button
                    onClick={handleCalculate}
                    disabled={!isFormValid || isLoggedIn === null}
                    className={`${hasActiveSubscription ? 'w-full' : ''} px-8 py-4 rounded-xl font-bold text-lg transition-all whitespace-nowrap ${
                      isFormValid && isLoggedIn !== null
                        ? 'bg-[var(--primary)] text-black hover:bg-[#00E847] shadow-[0_0_30px_rgba(0,204,61,0.3)] hover:shadow-[0_0_50px_rgba(0,204,61,0.5)]'
                        : 'bg-white/10 text-white/30 cursor-not-allowed'
                    }`}
                  >
                    {isLoggedIn === null ? 'Loading...' : hasActiveSubscription ? 'Generate Estimate →' : 'Calculate →'}
                  </button>
                </div>

              </div>
            </LiquidCard>
          )}

          {/* Loading State */}
          {isCalculating && (
            <LiquidCard className="p-12 md:p-16 text-center relative overflow-hidden">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[var(--primary)]/5 blur-[100px] rounded-full pointer-events-none animate-pulse" />
              
              <div className="relative z-10">
                <div className="w-20 h-20 mx-auto mb-8 rounded-full border-4 border-[var(--primary)]/20 border-t-[var(--primary)] animate-spin" />
                
                <h2 className="text-2xl font-bold mb-4">Calculating...</h2>
                <p className="text-white/60 mb-8">{loadingMessage}</p>
                
                {/* Progress bar */}
                <div className="max-w-md mx-auto">
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-[var(--primary)] transition-all duration-200 ease-out rounded-full"
                      style={{ width: `${loadingProgress}%` }}
                    />
                  </div>
                  <div className="text-sm text-white/40 mt-2">{loadingProgress}%</div>
                </div>
              </div>
            </LiquidCard>
          )}

          {/* Results State */}
          {result && !isCalculating && (
            <div className="space-y-6">
              {/* Main Result Card */}
              <LiquidCard className="p-8 md:p-12 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[var(--primary)]/10 blur-[100px] rounded-full pointer-events-none" />
                
                <div className="relative z-10">
                  {/* Headline Revenue */}
                  <div className="text-center mb-10">
                    <div className="text-sm text-white/50 uppercase tracking-wider mb-2">Estimated Monthly Revenue</div>
                    <div className="text-5xl md:text-7xl font-bold text-flashy-green mb-4">
                      {formatCurrency(result.minMRR)} - {formatCurrency(result.maxMRR)}
                    </div>
                    <div className="text-white/50">
                      Based on {result.similarApps} similar apps in this niche
                    </div>
                  </div>

                  {/* Breakdown Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                    <div className="p-5 rounded-xl bg-black/40 border border-white/10 text-center">
                      <div className="text-2xl mb-2">📈</div>
                      <div className="text-xs text-white/40 uppercase mb-1">Year 1 Revenue</div>
                      <div className="font-bold text-white">{formatCurrency(result.yearOneMin)} - {formatCurrency(result.yearOneMax)}</div>
                    </div>
                    <div className="p-5 rounded-xl bg-black/40 border border-white/10 text-center">
                      <div className="text-2xl mb-2">👥</div>
                      <div className="text-xs text-white/40 uppercase mb-1">Users Needed</div>
                      <div className="font-bold text-white">{result.usersNeededMin.toLocaleString()} - {result.usersNeededMax.toLocaleString()}</div>
                    </div>
                    <div className="p-5 rounded-xl bg-black/40 border border-white/10 text-center">
                      <div className="text-2xl mb-2">💵</div>
                      <div className="text-xs text-white/40 uppercase mb-1">Avg Ticket</div>
                      <div className="font-bold text-white">${result.avgTicket}/mo</div>
                    </div>
                    <div className="p-5 rounded-xl bg-black/40 border border-white/10 text-center">
                      <div className="text-2xl mb-2">📊</div>
                      <div className="text-xs text-white/40 uppercase mb-1">Conversion Rate</div>
                      <div className="font-bold text-white">{result.conversionRate}</div>
                    </div>
                  </div>

                  {/* Comparison Chart */}
                  <div className="mb-10">
                    <h3 className="text-lg font-bold mb-4">Revenue Comparison</h3>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-white/60">Your estimate</span>
                          <span className="text-[var(--primary)] font-bold">{formatCurrency(result.avgMRR)}/mo</span>
                        </div>
                        <div className="h-4 bg-white/10 rounded-full overflow-hidden">
                          <div className="h-full bg-[var(--primary)] rounded-full" style={{ width: '70%' }} />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-white/60">Average app</span>
                          <span className="text-white/70">$5K/mo</span>
                        </div>
                        <div className="h-4 bg-white/10 rounded-full overflow-hidden">
                          <div className="h-full bg-white/30 rounded-full" style={{ width: '40%' }} />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-white/60">Top performer</span>
                          <span className="text-white/70">$25K/mo</span>
                        </div>
                        <div className="h-4 bg-white/10 rounded-full overflow-hidden">
                          <div className="h-full bg-white/20 rounded-full" style={{ width: '100%' }} />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Revenue Factors Table */}
                  <div className="mb-10">
                    <h3 className="text-lg font-bold mb-4">Revenue Factors</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-white/10">
                            <th className="text-left py-3 text-sm text-white/40 font-medium">Factor</th>
                            <th className="text-left py-3 text-sm text-white/40 font-medium">Your Input</th>
                            <th className="text-right py-3 text-sm text-white/40 font-medium">Impact</th>
                          </tr>
                        </thead>
                        <tbody>
                          {result.factors.map((factor, i) => (
                            <tr key={i} className="border-b border-white/5">
                              <td className="py-3 text-white">{factor.name}</td>
                              <td className="py-3 text-white/60">{factor.input}</td>
                              <td className={`py-3 text-right font-bold ${
                                factor.impact.startsWith('+') ? 'text-[var(--primary)]' : 
                                factor.impact.startsWith('-') ? 'text-orange-400' : 'text-white/40'
                              }`}>
                                {factor.impact}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Get Pro CTA - Only for non-subscribers */}
                  {!hasActiveSubscription && (
                    <div className="p-6 rounded-xl bg-gradient-to-r from-[var(--primary)]/20 to-purple-500/20 border border-[var(--primary)]/30 mb-10">
                      <div className="flex flex-col md:flex-row items-center gap-6">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold mb-2">🚀 Want the Full Picture?</h3>
                          <p className="text-white/60 text-sm">
                            Get access to all 50+ validated niches with complete market analysis, competitor breakdown, and monetization strategies.
                          </p>
                        </div>
                        <button
                          onClick={handleCheckout}
                          disabled={checkoutLoading}
                          className="shrink-0 px-8 py-4 rounded-xl bg-[var(--primary)] text-black font-bold hover:bg-[#00E847] transition-all shadow-[0_0_20px_rgba(0,204,61,0.3)] whitespace-nowrap disabled:opacity-50"
                        >
                          {checkoutLoading ? 'Loading...' : 'Get Pro'}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* CTAs */}
                  <div className="flex flex-col sm:flex-row gap-4">
                    <button
                      onClick={handleAdjust}
                      className="flex-1 py-4 rounded-xl bg-white/10 border border-white/20 text-white font-bold hover:bg-white/20 transition-all"
                    >
                      Adjust Parameters
                    </button>
                  <button
                      onClick={handleReset}
                      className="flex-1 py-4 rounded-xl bg-white/5 border border-white/10 text-white/70 font-medium hover:bg-white/10 hover:text-white transition-all"
                  >
                      Try Different Niche
                  </button>
              </div>
            </div>
          </LiquidCard>
            </div>
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
              { icon: "📝", title: "Describe Your App", desc: "Tell us your niche and business model in a few words." },
              { icon: "🔍", title: "We Analyze", desc: "Compare with 10,000+ apps in our database to find patterns." },
              { icon: "💰", title: "Get Estimates", desc: "Realistic MRR projections based on real market data." },
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
              Revenue estimates based on data from <span className="text-white font-bold">40,000+ iOS apps</span> tracked daily
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
            <a href="/niche-validator" className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-medium hover:bg-white/10 transition-all flex items-center gap-2">
              ✅ Niche Validator
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

    </main>
  );
}
