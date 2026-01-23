"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import LiquidCard from "@/components/LiquidCard";
import { fetchNicheByCode, type Niche, type TrendingApp } from "../data";

export default function NicheDetailPage() {
  const params = useParams();
  const nicheCode = params.id as string;
  
  const [niche, setNiche] = useState<Niche | null>(null);
  const [isLocked, setIsLocked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState<TrendingApp | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'apps' | 'strategy' | 'aso'>('overview');
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [hasSubscription, setHasSubscription] = useState(false);
  const [subscriptionChecked, setSubscriptionChecked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);

  // Reset loading state when user comes back (browser back button from Stripe)
  useEffect(() => {
    const handlePageShow = (e: PageTransitionEvent) => {
      if (e.persisted) {
        setCheckoutLoading(false);
      }
    };
    window.addEventListener('pageshow', handlePageShow);
    return () => window.removeEventListener('pageshow', handlePageShow);
  }, []);

  // Vérifier si l'utilisateur a un abonnement actif (via /api/auth/me pour cohérence)
  useEffect(() => {
    async function checkSubscription() {
      try {
        const response = await fetch('/api/auth/me', {
          credentials: 'include',
        });
        const data = await response.json();
        setHasSubscription(data.subscription?.status === 'active');
      } catch (error) {
        console.error('Error checking subscription:', error);
      } finally {
        setSubscriptionChecked(true);
      }
    }
    checkSubscription();
  }, []);

  // Vérifier si la niche est sauvegardée
  useEffect(() => {
    async function checkSavedStatus() {
      if (!nicheCode) return;
      try {
        const response = await fetch('/api/user/saved-niches', {
          credentials: 'include', // Important pour mobile Safari
        });
        const data = await response.json();
        const savedIds = data.savedNiches?.map((n: { niche_id: string }) => n.niche_id) || [];
        setIsSaved(savedIds.includes(nicheCode));
      } catch (error) {
        console.error('Error checking saved status:', error);
      }
    }
    checkSavedStatus();
  }, [nicheCode]);

  // Fonction pour sauvegarder/supprimer des favoris
  const handleSaveToggle = async () => {
    if (!hasSubscription) {
      return; // Pas d'action si pas d'abonnement
    }

    setSaveLoading(true);
    try {
      const method = isSaved ? 'DELETE' : 'POST';
      const response = await fetch('/api/user/saved-niches', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nicheId: nicheCode }),
        credentials: 'include', // Important pour mobile Safari
      });
      
      if (response.ok) {
        setIsSaved(!isSaved);
      } else {
        console.error('Save failed:', await response.text());
      }
    } catch (error) {
      console.error('Error toggling save:', error);
    } finally {
      setSaveLoading(false);
    }
  };

  // Déterminer si la niche est verrouillée (vient de l'API)
  const isNicheLocked = isLocked;

  // Fonction pour rediriger vers Stripe Checkout
  const handleUnlock = async () => {
    setCheckoutLoading(true);
    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nicheId: nicheCode, mode: 'lifetime' }),
      });
      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Checkout error:', error);
      setCheckoutLoading(false);
    }
  };

  useEffect(() => {
    async function loadNiche() {
      setLoading(true);
      const { niche: nicheData, isLocked: locked } = await fetchNicheByCode(nicheCode);
      setNiche(nicheData);
      setIsLocked(locked);
      setLoading(false);
    }
    loadNiche();
  }, [nicheCode]);

  // Loading state
  if (loading) {
    return (
      <main className="min-h-screen relative overflow-hidden text-white font-sans bg-black">
        <div className="pt-32 px-6 text-center">
          <div className="inline-block w-8 h-8 border-2 border-[var(--primary)] border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-white/40">Loading niche...</p>
        </div>
      </main>
    );
  }

  // Si la niche n'existe pas, afficher 404
  if (!niche) {
    return (
      <main className="min-h-screen relative overflow-hidden text-white font-sans bg-black">
        <div className="pt-32 px-6 text-center">
          <h1 className="text-4xl font-bold mb-4">Niche not found</h1>
          <p className="text-white/50 mb-8">The niche you're looking for doesn't exist in the database.</p>
          <Link href="/niches" className="px-6 py-3 rounded-xl bg-[var(--primary)] text-black font-bold">
            ← Back to Niches
          </Link>
        </div>
      </main>
    );
  }

  // Si la niche est lockée (pas gratuite ET pas d'abonnement)
  // Afficher le faux contenu flouté avec CTA Get Pro
  if (isNicheLocked) {
    return (
      <main className="min-h-screen relative overflow-hidden text-white font-sans selection:bg-[#00CC3D] selection:text-black">
        {/* Background - Hidden on mobile for performance */}
        <div className="fixed inset-0 pointer-events-none hidden md:block">
          <div className="absolute top-0 left-1/3 w-[800px] h-[800px] bg-[var(--primary)]/3 blur-[200px] rounded-full" />
          <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-500/5 blur-[150px] rounded-full" />
        </div>

        <div className="relative pt-32 pb-20 px-6">
          <div className="max-w-5xl mx-auto">
            {/* Back Link */}
            <Link href="/niches" className="inline-flex items-center gap-2 text-white/50 hover:text-white mb-8 transition-colors">
              ← Back to Niches
            </Link>

            {/* Header - Visible */}
            <LiquidCard className="p-8 mb-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-xs font-mono text-white/30">#{niche.displayCode}</span>
                  <span className="px-3 py-1 rounded-full bg-white/10 text-xs text-white/70 font-medium">
                    {niche.category}
                  </span>
                </div>
                <div className="px-4 py-2 rounded-full bg-[var(--primary)] text-black text-sm font-bold shrink-0">
                  {niche.score}/100
                </div>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">{niche.title}</h1>
              <div className="flex flex-wrap items-center gap-2">
                {niche.tags.slice(0, 3).map(tag => (
                  <span key={tag} className="px-2 py-0.5 rounded border border-[var(--primary)]/20 bg-[var(--primary)]/10 text-[10px] text-[var(--primary)]">
                    {tag}
                  </span>
                ))}
              </div>
            </LiquidCard>

            {/* Faux contenu flouté */}
            <div className="relative">
              {/* Overlay avec CTA */}
              <div className="absolute inset-0 z-20 flex items-center justify-center">
                <div className="text-center p-8 rounded-3xl bg-black/80 backdrop-blur-sm border border-white/10 max-w-md mx-4">
                  <div className="text-5xl mb-4">🔒</div>
                  <h2 className="text-2xl font-bold text-white mb-3">Unlock Full Analysis</h2>
                  <p className="text-white/60 mb-6">
                    Get access to complete market research, competitor breakdown, marketing strategies, and revenue models.
                  </p>
                  
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    {[
                      { icon: "📊", label: "Market Analysis" },
                      { icon: "📈", label: "5+ Trending Apps" },
                      { icon: "🎯", label: "Marketing Strategy" },
                      { icon: "💰", label: "Revenue Models" },
                    ].map((item, i) => (
                      <div key={i} className="p-3 rounded-xl bg-white/5 border border-white/10 text-center">
                        <div className="text-xl mb-1">{item.icon}</div>
                        <div className="text-[10px] text-white/50">{item.label}</div>
                      </div>
                    ))}
                  </div>

                  <a 
                    href="/pricing"
                    className="w-full px-8 py-4 rounded-xl bg-[var(--primary)] text-black font-bold text-lg hover:bg-[#00E847] transition-all shadow-[0_0_30px_rgba(0,204,61,0.3)] text-center block"
                  >
                    Get Pro
                  </a>
                  <p className="mt-3 text-xs text-white/30">Cancel anytime • Instant access to all niches</p>
                </div>
              </div>

              {/* Faux contenu flouté en arrière-plan */}
              <div className="blur-md select-none pointer-events-none opacity-60">
                {/* Faux bloc Opportunity */}
                <LiquidCard className="p-8 mb-6">
                  <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-[var(--primary)]/20 flex items-center justify-center text-[var(--primary)]">🎯</span>
                    Opportunity Analysis
                  </h2>
                  <div className="grid md:grid-cols-3 gap-6">
                    <div>
                      <h4 className="text-xs font-bold text-[var(--primary)] uppercase tracking-wider mb-2">The Opportunity</h4>
                      <p className="text-white/70 leading-relaxed text-sm">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-yellow-400 uppercase tracking-wider mb-2">Market Gap</h4>
                      <p className="text-white/70 leading-relaxed text-sm">Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-2">Recommended Move</h4>
                      <p className="text-white/70 leading-relaxed text-sm">Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>
                    </div>
                  </div>
                </LiquidCard>

                {/* Faux Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-6 gap-3 md:gap-4 mb-6">
                  {[
                    { label: "Competition", value: "Low" },
                    { label: "Potential", value: "Very High" },
                    { label: "Est. MRR", value: "$8K-15K" },
                    { label: "Best Market", value: "🇺🇸 US" },
                    { label: "Time to MVP", value: "4-6 weeks" },
                    { label: "Difficulty", value: "Medium" },
                  ].map((stat, i) => (
                    <LiquidCard key={i} className="p-3 md:p-4">
                      <div className="text-[11px] md:text-[10px] text-white/50 uppercase tracking-wide mb-1.5 md:mb-1">{stat.label}</div>
                      <div className="text-sm md:text-base font-bold text-white">{stat.value}</div>
                    </LiquidCard>
                  ))}
                </div>

                {/* Faux Market Analysis */}
                <LiquidCard className="p-8 mb-6">
                  <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400">📊</span>
                    Market Analysis
                  </h2>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                        <div className="text-xs text-white/40 uppercase mb-1">Total Market Size</div>
                        <div className="text-lg font-bold text-white">$2.5B globally</div>
                      </div>
                      <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                        <div className="text-xs text-white/40 uppercase mb-1">Growth Rate</div>
                        <div className="text-lg font-bold text-[var(--primary)]">+24% YoY</div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                        <div className="text-xs text-white/40 uppercase mb-1">Target Audience</div>
                        <div className="text-sm text-white/80">Professionals aged 25-45 looking for productivity solutions</div>
                      </div>
                      <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                        <div className="text-xs text-white/40 uppercase mb-1">Geographic Focus</div>
                        <div className="flex flex-wrap gap-2 mt-2">
                          <span className="px-2 py-1 rounded bg-white/10 text-xs text-white/70">🇺🇸 US</span>
                          <span className="px-2 py-1 rounded bg-white/10 text-xs text-white/70">🇬🇧 UK</span>
                          <span className="px-2 py-1 rounded bg-white/10 text-xs text-white/70">🇩🇪 DE</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </LiquidCard>

                {/* Faux Trending Apps */}
                <LiquidCard className="p-8">
                  <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center text-purple-400">📈</span>
                    Trending Apps in this Niche
                  </h2>
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="p-6 rounded-xl bg-white/5 border border-white/10">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-6">
                            <span className="text-2xl font-mono text-white/20">0{i}</span>
                            <div>
                              <div className="flex items-center gap-3 mb-1">
                                <h3 className="text-lg font-bold text-white">App Name {i}</h3>
                                <span className="px-2 py-0.5 rounded bg-white/10 text-xs text-white/50">Category</span>
                              </div>
                              <p className="text-sm text-white/50">Lorem ipsum dolor sit amet consectetur adipiscing elit...</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold text-[var(--primary)]">+{20 + i * 5}%</div>
                            <div className="text-xs text-white/40">$10K MRR</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </LiquidCard>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="relative px-6 py-10 border-t border-white/5">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
            <span className="font-bold text-sm tracking-widest text-white/40">NICHES HUNTER</span>
            <div className="flex items-center gap-6 text-xs text-white/30">
              <Link href="#" className="hover:text-white transition-colors">Privacy</Link>
              <Link href="#" className="hover:text-white transition-colors">Terms</Link>
              <Link href="https://x.com/nicheshunter" className="hover:text-white transition-colors">Twitter</Link>
            </div>
            <span className="text-xs text-white/20">© 2026 Niches Hunter. All rights reserved.</span>
          </div>
        </footer>
      </main>
    );
  }

  return (
    <main className="min-h-screen relative overflow-hidden text-white font-sans selection:bg-[#00CC3D] selection:text-black">
      {/* Background - Hidden on mobile for performance */}
      <div className="fixed inset-0 pointer-events-none hidden md:block">
        <div className="absolute top-0 left-1/3 w-[800px] h-[800px] bg-[var(--primary)]/3 blur-[200px] rounded-full" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-500/5 blur-[150px] rounded-full" />
      </div>

      <div className="relative pt-32 pb-20 px-6">
        <div className="max-w-5xl mx-auto">
          {/* Back Link */}
          <Link href="/niches" className="inline-flex items-center gap-2 text-white/50 hover:text-white mb-8 transition-colors">
            ← Back to Niches
          </Link>

          {/* Header */}
          <LiquidCard className="p-8 mb-6">
            {/* Top row: Code, Category, Tags + Score */}
            <div className="flex justify-between items-start mb-4">
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-xs font-mono text-white/30">#{niche.displayCode}</span>
                <span className="px-3 py-1 rounded-full bg-white/10 text-xs text-white/70 font-medium">
                  {niche.category}
                </span>
                {niche.tags.map(tag => (
                  <span key={tag} className="px-2 py-0.5 rounded border border-[var(--primary)]/20 bg-[var(--primary)]/10 text-[10px] text-[var(--primary)]">
                    {tag}
                  </span>
                ))}
              </div>
              
              {/* Score - Top Right */}
              <div className="px-4 py-2 rounded-full bg-[var(--primary)] text-black text-sm font-bold shrink-0">
                {niche.score}/100
              </div>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">{niche.title}</h1>
            
            {/* Bottom row: Stats + Save Button */}
            <div className="flex flex-wrap justify-between items-center gap-3">
              <div className="flex flex-wrap items-center gap-2 md:gap-4">
                <div className="px-3 md:px-4 py-1.5 md:py-2 rounded-full bg-white/10 text-white/70 text-xs md:text-sm">
                  {niche.stats.market} Primary Market
                </div>
                <div className="px-3 md:px-4 py-1.5 md:py-2 rounded-full bg-white/10 text-white/70 text-xs md:text-sm">
                  {niche.stats.timeToMVP} to MVP
                </div>
              </div>
              
              {/* Save Button - Visible on all screens */}
              {hasSubscription && (
                <button
                  onClick={handleSaveToggle}
                  disabled={saveLoading}
                  className={`group flex items-center justify-center w-10 h-10 rounded-xl transition-all shrink-0 ${
                    isSaved 
                      ? 'bg-[var(--primary)]/20 text-[var(--primary)]' 
                      : 'bg-white/5 text-white/40 hover:bg-white/10 hover:text-white'
                  }`}
                  title={isSaved ? 'Remove from saved' : 'Save this niche'}
                >
                  {saveLoading ? (
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  ) : isSaved ? (
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
                    </svg>
                  )}
                </button>
              )}
            </div>
          </LiquidCard>

          {/* Tabs */}
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
            {[
              { id: 'overview', label: 'Overview & Analysis' },
              { id: 'apps', label: 'Trending Apps' },
              { id: 'strategy', label: 'Strategy & Execution' },
              ...(niche.asoOptimization ? [{ id: 'aso', label: 'ASO Optimization' }] : []),
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`px-6 py-3 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                  activeTab === tab.id 
                    ? 'bg-[var(--primary)] text-black' 
                    : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Opportunity Analysis */}
              <LiquidCard className="p-8">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-[var(--primary)]/20 flex items-center justify-center text-[var(--primary)]">🎯</span>
                  Opportunity Analysis
                </h2>
                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <h4 className="text-xs font-bold text-[var(--primary)] uppercase tracking-wider mb-2">The Opportunity</h4>
                    <p className="text-white/70 leading-relaxed text-sm">{niche.opportunity}</p>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-yellow-400 uppercase tracking-wider mb-2">Market Gap</h4>
                    <p className="text-white/70 leading-relaxed text-sm">{niche.gap}</p>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-2">Recommended Move</h4>
                    <p className="text-white/70 leading-relaxed text-sm">{niche.move}</p>
                  </div>
                </div>
              </LiquidCard>

              {/* Market Stats */}
              <div className="grid grid-cols-2 md:grid-cols-6 gap-3 md:gap-4">
                {[
                  { label: "Competition", value: niche.stats.competition, color: niche.stats.competition === "Low" ? "text-green-400" : niche.stats.competition === "Medium" ? "text-yellow-400" : "text-orange-400" },
                  { label: "Potential", value: niche.stats.potential, color: "text-[var(--primary)]" },
                  { label: "Est. MRR", value: niche.stats.revenue, color: "text-white" },
                  { label: "Best Market", value: niche.stats.market, color: "text-white" },
                  { label: "Time to MVP", value: niche.stats.timeToMVP, color: "text-white" },
                  { label: "Difficulty", value: niche.stats.difficulty, color: "text-white" },
                ].map((stat, i) => (
                  <LiquidCard key={i} className="p-3 md:p-4">
                    <div className="text-[11px] md:text-[10px] text-white/50 uppercase tracking-wide mb-1.5 md:mb-1">{stat.label}</div>
                    <div className={`text-sm md:text-base font-bold ${stat.color}`}>{stat.value}</div>
                  </LiquidCard>
                ))}
              </div>

              {/* Market Analysis */}
              <LiquidCard className="p-8">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400">📊</span>
                  Market Analysis
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                      <div className="text-xs text-white/40 uppercase mb-1">Total Market Size</div>
                      <div className="text-lg font-bold text-white">{niche.marketAnalysis.totalMarketSize}</div>
                    </div>
                    <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                      <div className="text-xs text-white/40 uppercase mb-1">Growth Rate</div>
                      <div className="text-lg font-bold text-[var(--primary)]">{niche.marketAnalysis.growthRate}</div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                      <div className="text-xs text-white/40 uppercase mb-1">Target Audience</div>
                      <div className="text-sm text-white/80">{niche.marketAnalysis.targetAudience}</div>
                    </div>
                    <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                      <div className="text-xs text-white/40 uppercase mb-1">Geographic Focus</div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {niche.marketAnalysis.geographicFocus.map((geo, i) => (
                          <span key={i} className="px-2 py-1 rounded bg-white/10 text-xs text-white/70">{geo}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </LiquidCard>

              {/* Key Learnings */}
              {niche.keyLearnings.length > 0 && (
                <LiquidCard className="p-8">
                  <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center text-purple-400">💡</span>
                    Key Learnings
                  </h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    {niche.keyLearnings.map((learning, i) => (
                      <div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-white/5 border border-white/5">
                        <span className="text-[var(--primary)] mt-0.5">✓</span>
                        <span className="text-sm text-white/70">{learning}</span>
                      </div>
                    ))}
                  </div>
                </LiquidCard>
              )}

              {/* Improvements */}
              {niche.improvements.length > 0 && (
                <LiquidCard className="p-8">
                  <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-orange-500/20 flex items-center justify-center text-orange-400">🚀</span>
                    Improvement Opportunities
                  </h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    {niche.improvements.map((improvement, i) => (
                      <div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-white/5 border border-white/5">
                        <span className="text-orange-400 mt-0.5">→</span>
                        <span className="text-sm text-white/70">{improvement}</span>
                      </div>
                    ))}
                  </div>
                </LiquidCard>
              )}

              {/* Risks */}
              {niche.risks.length > 0 && (
                <LiquidCard className="p-8">
                  <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center text-red-400">⚠️</span>
                    Risks to Consider
                  </h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    {niche.risks.map((risk, i) => (
                      <div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-red-500/5 border border-red-500/10">
                        <span className="text-red-400 mt-0.5">!</span>
                        <span className="text-sm text-white/70">{risk}</span>
                      </div>
                    ))}
                  </div>
                </LiquidCard>
              )}
            </div>
          )}

          {activeTab === 'apps' && (
            <div className="space-y-6">
              {selectedApp ? (
                // App Detail View
                <LiquidCard className="p-8">
                  <button 
                    onClick={() => setSelectedApp(null)}
                    className="text-white/50 hover:text-white mb-6 flex items-center gap-2 text-sm"
                  >
                    ← Back to all apps
                  </button>
                  
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h2 className="text-2xl font-bold text-white mb-1">{selectedApp.name}</h2>
                      <span className="text-sm text-white/40">{selectedApp.category}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-[var(--primary)]">{selectedApp.growth}</div>
                      <div className="text-xs text-white/40">Monthly Growth</div>
                    </div>
                  </div>
                  
                  <p className="text-white/70 mb-8 leading-relaxed">{selectedApp.description}</p>
                  
                  <div className="grid md:grid-cols-3 gap-4 mb-8">
                    <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                      <div className="text-xs text-white/40 uppercase mb-1">Est. MRR</div>
                      <div className="text-xl font-bold text-[var(--primary)]">{selectedApp.estimatedMRR}</div>
                    </div>
                    <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                      <div className="text-xs text-white/40 uppercase mb-1">Strong Market</div>
                      <div className="text-xl font-bold text-white">{selectedApp.strongMarket}</div>
                    </div>
                    <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                      <div className="text-xs text-white/40 uppercase mb-1">Category</div>
                      <div className="text-xl font-bold text-white">{selectedApp.category}</div>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-sm font-bold text-[var(--primary)] uppercase mb-4">Key Strengths</h4>
                      <div className="space-y-2">
                        {selectedApp.keyPoints.map((p, i) => (
                          <div key={i} className="flex items-start gap-2 text-sm text-white/70 p-3 rounded-lg bg-[var(--primary)]/5 border border-[var(--primary)]/10">
                            <span className="text-[var(--primary)]">✓</span> {p}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-orange-400 uppercase mb-4">Weaknesses</h4>
                      <div className="space-y-2">
                        {selectedApp.weakPoints.map((p, i) => (
                          <div key={i} className="flex items-start gap-2 text-sm text-white/70 p-3 rounded-lg bg-orange-500/5 border border-orange-500/10">
                            <span className="text-orange-400">!</span> {p}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </LiquidCard>
              ) : (
                // Apps Grid
                <div className="space-y-4">
                  <h2 className="text-xl font-bold mb-2">Trending Apps in this Niche</h2>
                  <p className="text-white/50 text-sm mb-4">Click on any app for detailed analysis</p>
                  {niche.trending.length === 0 ? (
                    <LiquidCard className="p-8 text-center">
                      <p className="text-white/50">No trending apps data available for this niche yet.</p>
                    </LiquidCard>
                  ) : (
                    niche.trending.map((app, i) => (
                      <LiquidCard 
                        key={i}
                        onClick={() => setSelectedApp(app)}
                        className="p-6 cursor-pointer md:hover:scale-[1.01] md:transition-all group"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-6">
                            <span className="text-2xl font-mono text-white/20 group-hover:text-[var(--primary)] transition-colors w-8">0{i + 1}</span>
                            <div>
                              <div className="flex items-center gap-3 mb-1">
                                <h3 className="text-lg font-bold text-white group-hover:text-[var(--primary)] transition-colors">{app.name}</h3>
                                <span className="px-2 py-0.5 rounded bg-white/10 text-xs text-white/50">{app.category}</span>
                              </div>
                              <p className="text-sm text-white/50 line-clamp-1">{app.description}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-6">
                            <div className="text-right">
                              <div className="text-lg font-bold text-[var(--primary)]">{app.growth}</div>
                              <div className="text-xs text-white/40">{app.estimatedMRR} MRR</div>
                            </div>
                            <span className="text-white/30 group-hover:text-white transition-colors">→</span>
                          </div>
                        </div>
                      </LiquidCard>
                    ))
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === 'strategy' && (
            <div className="space-y-6">
              {/* Marketing Strategies */}
              {niche.marketingStrategies.length > 0 && (
                <LiquidCard className="p-8">
                  <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-pink-500/20 flex items-center justify-center text-pink-400">📣</span>
                    Marketing Strategies
                  </h2>
                  <div className="space-y-4">
                    {niche.marketingStrategies.map((strategy, i) => (
                      <div key={i} className="p-5 rounded-xl bg-white/5 border border-white/10">
                        <div className="flex justify-between items-start mb-3">
                          <h4 className="font-bold text-white">{strategy.channel}</h4>
                          <span className="px-3 py-1 rounded-full bg-[var(--primary)]/20 text-[var(--primary)] text-xs font-medium">{strategy.estimatedCost}</span>
                        </div>
                        <p className="text-sm text-white/60">{strategy.strategy}</p>
                      </div>
                    ))}
                  </div>
                </LiquidCard>
              )}

              {/* Monetization */}
              <LiquidCard className="p-8">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center text-green-400">💰</span>
                  Monetization Strategy
                </h2>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="p-5 rounded-xl bg-white/5 border border-white/10">
                    <div className="text-xs text-white/40 uppercase mb-2">Business Model</div>
                    <div className="text-lg font-bold text-white">{niche.monetization.model}</div>
                  </div>
                  <div className="p-5 rounded-xl bg-white/5 border border-white/10">
                    <div className="text-xs text-white/40 uppercase mb-2">Recommended Pricing</div>
                    <div className="text-lg font-bold text-[var(--primary)]">{niche.monetization.pricing}</div>
                  </div>
                  <div className="p-5 rounded-xl bg-white/5 border border-white/10">
                    <div className="text-xs text-white/40 uppercase mb-2">Expected Conversion</div>
                    <div className="text-lg font-bold text-white">{niche.monetization.conversionRate}</div>
                  </div>
                </div>
              </LiquidCard>

              {/* Tech Stack */}
              {niche.techStack.length > 0 && (
                <LiquidCard className="p-8">
                  <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center text-cyan-400">🛠️</span>
                    Recommended Tech Stack
                  </h2>
                  <div className="flex flex-wrap gap-3">
                    {niche.techStack.map((tech, i) => (
                      <span key={i} className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-white/70">{tech}</span>
                    ))}
                  </div>
                </LiquidCard>
              )}

              {/* No Strategy Data */}
              {niche.marketingStrategies.length === 0 && niche.techStack.length === 0 && (
                <LiquidCard className="p-8 text-center">
                  <p className="text-white/50">Strategy data not available for this niche yet.</p>
                </LiquidCard>
              )}
            </div>
          )}

          {activeTab === 'aso' && niche.asoOptimization && (
            <div className="space-y-6">
              {/* Primary Keywords */}
              <LiquidCard className="p-8">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-[var(--primary)]/20 flex items-center justify-center text-[var(--primary)]">🔑</span>
                  Primary Keywords
                </h2>
                <div className="flex flex-wrap gap-3">
                  {niche.asoOptimization.primaryKeywords.map((keyword, i) => (
                    <span 
                      key={i} 
                      className="px-4 py-2 rounded-xl bg-[var(--primary)]/10 border border-[var(--primary)]/30 text-sm font-medium text-[var(--primary)]"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </LiquidCard>

              {/* Long-tail Keywords */}
              <LiquidCard className="p-8">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center text-purple-400">🎯</span>
                  Long-tail Keywords
                </h2>
                <div className="flex flex-wrap gap-3">
                  {niche.asoOptimization.secondaryKeywords.map((keyword, i) => (
                    <span 
                      key={i} 
                      className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-white/70"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </LiquidCard>

              {/* App Name Ideas */}
              <LiquidCard className="p-8">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400">💡</span>
                  App Name Ideas
                </h2>
                <div className="grid md:grid-cols-3 gap-4">
                  {niche.asoOptimization.appNameIdeas.map((name, i) => (
                    <div 
                      key={i} 
                      className="p-5 rounded-xl bg-white/5 border border-white/10 text-center"
                    >
                      <div className="text-xs text-white/40 uppercase mb-2">Suggestion {i + 1}</div>
                      <div className="text-lg font-bold text-white">{name}</div>
                    </div>
                  ))}
                </div>
              </LiquidCard>

              {/* Disclaimer */}
              <div className="flex items-center justify-center gap-2 text-xs text-white/30">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Validate keywords with an ASO tool</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="relative px-6 py-10 border-t border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <span className="font-bold text-sm tracking-widest text-white/40">NICHES HUNTER</span>
          <div className="flex items-center gap-6 text-xs text-white/30">
            <Link href="#" className="hover:text-white transition-colors">Privacy</Link>
            <Link href="#" className="hover:text-white transition-colors">Terms</Link>
            <Link href="https://x.com/nicheshunter" className="hover:text-white transition-colors">Twitter</Link>
          </div>
          <span className="text-xs text-white/20">© 2026 Niches Hunter. All rights reserved.</span>
        </div>
      </footer>
    </main>
  );
}
