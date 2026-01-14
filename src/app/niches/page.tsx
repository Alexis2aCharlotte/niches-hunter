"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { fetchAllNiches, APPLE_CATEGORIES, type AppleCategory, type Niche } from "./data";

// Niches gratuites (accessibles sans abonnement)
const FREE_NICHES = ["0030", "0024", "0110"];

// Composant carte avec effet de halo qui suit la souris
function NicheCard({ niche, index, isUnlocked }: { niche: Niche; index: number; isUnlocked: boolean }) {
  const isSafari = typeof navigator !== 'undefined' && /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
  const isDemandBased = niche.sourceType === 'demand_based';

  // Fonction pour rediriger vers la page pricing si verrouillé
  const handleLockedClick = (e: React.MouseEvent) => {
    if (!isUnlocked) {
      e.preventDefault();
      window.location.href = '/pricing';
    }
  };
  const cardRef = useRef<HTMLDivElement>(null);

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
    <Link 
      href={isUnlocked ? `/niches/${niche.displayCode}` : '#'} 
      onClick={handleLockedClick}
      className="block h-full"
    >
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        className={`liquid-card p-6 group transition-all duration-300 hover:scale-[1.02] relative h-full flex flex-col ${isDemandBased ? 'exclusive-card' : ''}`}
        style={{ animationDelay: `${index * 100}ms` }}
      >
        {/* Header - Toujours visible */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1 min-w-0 pr-3">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-mono text-white/30">#{niche.displayCode}</span>
              <span className="px-2 py-0.5 rounded bg-[var(--primary)]/10 text-[9px] text-[var(--primary)] font-medium">
                {niche.category}
              </span>
            </div>
            <h3 className={`text-lg font-bold text-white group-hover:text-[var(--primary)] transition-colors line-clamp-2 ${!isUnlocked ? 'blur-[6px] select-none' : ''}`}>
              {niche.title}
            </h3>
          </div>
          <div className={`px-3 py-1 rounded-full text-xs font-bold shrink-0 ${
            niche.score >= 95 ? "bg-[var(--primary)] text-black" :
            niche.score >= 90 ? "bg-[var(--primary)]/20 text-[var(--primary)]" :
            "bg-white/10 text-white/70"
          }`}>
            {niche.score}/100
          </div>
        </div>

        {/* Overlay cadenas - centré sur toute la carte */}
        {!isUnlocked && (
          <div className="absolute inset-0 z-10 flex items-center justify-center">
            <div className="text-center">
              <span className="text-4xl mb-2 block">🔒</span>
              <span className="text-xs font-bold text-[var(--primary)]">Get Pro</span>
            </div>
          </div>
        )}

        {/* Contenu */}
        <div className="relative flex-grow flex flex-col">

          {/* Contenu - flouté si locked */}
          <div className={`flex-grow flex flex-col ${!isUnlocked ? 'blur-[6px] select-none pointer-events-none' : ''}`}>
            <div className="flex flex-wrap gap-2 mb-4 h-6 overflow-hidden">
              {niche.tags.slice(0, 3).map(tag => (
                <span key={tag} className="px-2 py-0.5 rounded border border-white/10 bg-white/5 text-[10px] text-white/60">
                  {tag}
                </span>
              ))}
            </div>

            <p className="text-sm text-white/50 leading-relaxed mb-6 line-clamp-2 flex-grow">
              {niche.opportunity}
            </p>

            <div className="grid grid-cols-2 gap-3 mt-auto">
              <div className="p-3 rounded-lg bg-black/40 border border-white/5">
                <div className="text-[9px] text-white/30 uppercase mb-1">Competition</div>
                <div className={`text-sm font-bold ${
                  niche.stats.competition === "Low" ? "text-[var(--primary)]" :
                  niche.stats.competition === "Medium" ? "text-yellow-400" :
                  "text-orange-400"
                }`}>
                  {niche.stats.competition}
                </div>
              </div>
              <div className="p-3 rounded-lg bg-black/40 border border-white/5">
                <div className="text-[9px] text-white/30 uppercase mb-1">Est. Revenue</div>
                <div className="text-sm font-bold text-white">{niche.stats.revenue}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Flèche au hover - seulement si unlocked */}
        {isUnlocked && (
          <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="text-[var(--primary)]">→</span>
          </div>
        )}
      </div>
    </Link>
  );
}

export default function NichesPage() {
  const [niches, setNiches] = useState<Niche[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<AppleCategory>("All");
  const [hasSubscription, setHasSubscription] = useState(false);
  const [subscriptionChecked, setSubscriptionChecked] = useState(false);
  const [showExclusiveOnly, setShowExclusiveOnly] = useState(false);

  // Charger les niches depuis l'API sécurisée (inclut la vérification d'abonnement)
  useEffect(() => {
    async function loadNiches() {
      setLoading(true);
      const { niches: data, hasActiveSubscription } = await fetchAllNiches();
      setNiches(data);
      setHasSubscription(hasActiveSubscription);
      setSubscriptionChecked(true);
      setLoading(false);
    }
    loadNiches();
  }, []);

  // Vérifier si une niche est déverrouillée (gratuite OU abonné)
  // Pendant le chargement, seules les niches gratuites sont accessibles
  const isNicheUnlocked = (displayCode: string) => {
    if (!subscriptionChecked) {
      return FREE_NICHES.includes(displayCode);
    }
    return FREE_NICHES.includes(displayCode) || hasSubscription;
  };

  // Filtrer et trier les niches (Exclusive en premier, puis déverrouillées)
  const filteredNiches = useMemo(() => {
    let filtered = selectedCategory === "All" 
      ? niches 
      : niches.filter(niche => niche.category === selectedCategory);
    
    // Filtre Exclusive Only
    if (showExclusiveOnly) {
      filtered = filtered.filter(niche => niche.sourceType === 'demand_based');
    }
    
    // Trier: gratuites en premier si non abonné (pas de tri pour les Exclusive)
    if (!hasSubscription) {
      return [...filtered].sort((a, b) => {
        const aFree = FREE_NICHES.includes(a.displayCode);
        const bFree = FREE_NICHES.includes(b.displayCode);
        if (aFree && !bFree) return -1;
        if (!aFree && bFree) return 1;
        return 0;
      });
    }
    return filtered;
  }, [selectedCategory, niches, hasSubscription, showExclusiveOnly]);

  // Compter les niches par catégorie
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { All: niches.length };
    niches.forEach(niche => {
      counts[niche.category] = (counts[niche.category] || 0) + 1;
    });
    return counts;
  }, [niches]);

  // Compter les niches Exclusive (demand_based)
  const exclusiveCount = useMemo(() => {
    return niches.filter(niche => niche.sourceType === 'demand_based').length;
  }, [niches]);

  return (
    <main className="min-h-screen relative overflow-hidden text-white font-sans selection:bg-[#00CC3D] selection:text-black">
      <Navbar />

      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/3 w-[800px] h-[800px] bg-[var(--primary)]/3 blur-[200px] rounded-full" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-500/5 blur-[150px] rounded-full" />
      </div>

      {/* Header */}
      <section className="relative pt-32 pb-8 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--primary)]/10 border border-[var(--primary)]/20 mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary)] animate-pulse" />
                <span className="text-xs font-mono text-[var(--primary)] uppercase tracking-wider">Updated Daily</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
                Niche <span className="text-flashy-green">Ideas</span>
              </h1>
              <p className="text-lg text-white/50 max-w-xl">
                Curated opportunities with full market analysis. Click any niche for the complete breakdown.
              </p>
            </div>
            
            <div className="flex items-center gap-3 px-4 py-2 rounded-full border border-white/10 bg-white/5">
              <span className="w-2 h-2 rounded-full bg-[var(--primary)] animate-pulse" />
              <span className="text-xs font-mono text-white/70">{filteredNiches.length} NICHES</span>
            </div>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="relative px-6 pb-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <svg className="w-4 h-4 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            <span className="text-sm text-white/40">Filter by App Store category</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {APPLE_CATEGORIES.map((category) => {
              const count = categoryCounts[category] || 0;
              const isSelected = selectedCategory === category;
              
              if (category !== "All" && count === 0) return null;
              
              return (
              <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    isSelected
                      ? "bg-[var(--primary)] text-black"
                      : "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white border border-white/10"
                  }`}
                >
                  {category}
                  {count > 0 && (
                    <span className={`ml-2 text-xs ${isSelected ? "text-black/60" : "text-white/40"}`}>
                      {count}
                    </span>
                  )}
              </button>
              );
            })}
          </div>

          {/* Filtre Exclusive */}
          {exclusiveCount > 0 && (
            <div className="mt-4 flex items-center gap-3">
              <button
                onClick={() => setShowExclusiveOnly(!showExclusiveOnly)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  showExclusiveOnly
                    ? "bg-gradient-to-r from-amber-500 to-yellow-400 text-black shadow-lg shadow-amber-500/20"
                    : "bg-white/5 text-white/60 hover:bg-amber-500/10 hover:text-amber-400 border border-white/10 hover:border-amber-500/30"
                }`}
              >
                <span>🔥</span>
                <span>TikTok Spot</span>
                <span className={`text-xs ${showExclusiveOnly ? "text-black/60" : "text-white/40"}`}>
                  {exclusiveCount}
                </span>
                {showExclusiveOnly && <span className="ml-1">×</span>}
              </button>
              
            </div>
          )}
        </div>
      </section>

      {/* Niches Grid */}
      <section className="relative px-6 pb-24">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="text-center py-16">
              <div className="inline-block w-8 h-8 border-2 border-[var(--primary)] border-t-transparent rounded-full animate-spin mb-4" />
              <p className="text-white/40">Loading niches...</p>
            </div>
          ) : filteredNiches.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-white/40">No niches found yet. Add some in Supabase!</p>
            </div>
          ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNiches.map((niche, index) => (
                <NicheCard key={niche.id} niche={niche} index={index} isUnlocked={isNicheUnlocked(niche.displayCode)} />
              ))}
                  </div>
                )}
        </div>
      </section>

      {/* Footer */}
      <footer className="relative px-6 py-10 border-t border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <span className="font-bold text-sm tracking-widest text-white/40">NICHES HUNTER</span>
          <div className="flex items-center gap-6 text-xs text-white/30">
            <Link href="#" className="hover:text-white transition-colors">Privacy</Link>
            <Link href="#" className="hover:text-white transition-colors">Terms</Link>
            <Link href="https://x.com/Tobby_scraper" className="hover:text-white transition-colors">Twitter</Link>
          </div>
          <span className="text-xs text-white/20">© 2026 Niches Hunter. All rights reserved.</span>
        </div>
      </footer>
    </main>
  );
}
