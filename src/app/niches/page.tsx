"use client";

import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import Link from "next/link";
import { fetchAllNiches, APPLE_CATEGORIES, type AppleCategory, type Niche } from "./data";

// Niches gratuites (accessibles sans abonnement)
const FREE_NICHES = ["0030", "0024", "0110"];

// ─────────────────────────────────────────────────────────────────
// FILTER TYPES & HELPERS
// ─────────────────────────────────────────────────────────────────

type CompetitionLevel = "Low" | "Medium" | "High";

type RevenueRange = "<$10K" | "$10K-$50K" | "$50K-$100K" | "$100K+";

const COMPETITION_OPTIONS: { value: CompetitionLevel; label: string; color: string }[] = [
  { value: "Low", label: "Low", color: "text-[var(--primary)]" },
  { value: "Medium", label: "Medium", color: "text-yellow-400" },
  { value: "High", label: "High", color: "text-orange-400" },
];

const REVENUE_OPTIONS: { value: RevenueRange; label: string }[] = [
  { value: "<$10K", label: "< $10K" },
  { value: "$10K-$50K", label: "$10K - $50K" },
  { value: "$50K-$100K", label: "$50K - $100K" },
  { value: "$100K+", label: "$100K+" },
];

function parseRevenueToNumber(revenue: string): number {
  if (!revenue || revenue === "💎 Pro" || revenue === "N/A") return -1;
  const cleaned = revenue.replace(/[^0-9KMBkmb.$\-+]/g, "");
  const match = cleaned.match(/\$?([\d.]+)\s*([KMBkmb])?/);
  if (!match) return -1;
  let num = parseFloat(match[1]);
  const unit = (match[2] || "").toUpperCase();
  if (unit === "K") num *= 1_000;
  else if (unit === "M") num *= 1_000_000;
  else if (unit === "B") num *= 1_000_000_000;
  return num;
}

function nicheMatchesRevenueRange(revenue: string, range: RevenueRange): boolean {
  const val = parseRevenueToNumber(revenue);
  if (val < 0) return false;
  switch (range) {
    case "<$10K": return val < 10_000;
    case "$10K-$50K": return val >= 10_000 && val < 50_000;
    case "$50K-$100K": return val >= 50_000 && val <= 100_000;
    case "$100K+": return val > 100_000;
    default: return false;
  }
}

// ─────────────────────────────────────────────────────────────────
// DROPDOWN FILTER COMPONENT
// ─────────────────────────────────────────────────────────────────

function FilterDropdown<T extends string>({
  label,
  icon,
  options,
  selected,
  onToggle,
  renderOption,
  singleSelect,
  className,
}: {
  label: string;
  icon?: React.ReactNode;
  options: { value: T; label: string }[];
  selected: Set<T>;
  onToggle: (value: T) => void;
  renderOption?: (opt: { value: T; label: string }, isSelected: boolean) => React.ReactNode;
  singleSelect?: boolean;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const activeCount = selected.size;
  const activeLabel = singleSelect && activeCount === 1
    ? options.find(o => selected.has(o.value))?.label
    : null;

  return (
    <div ref={ref} className={`relative ${className || ""}`}>
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
          activeCount > 0
            ? "bg-[var(--primary)]/15 text-[var(--primary)] border border-[var(--primary)]/30"
            : "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white border border-white/10"
        }`}
      >
        {icon}
        <span>{activeLabel || label}</span>
        {!singleSelect && activeCount > 0 && (
          <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[var(--primary)] text-black text-[10px] font-bold">
            {activeCount}
          </span>
        )}
        <svg className={`w-3.5 h-3.5 transition-transform ${open ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-2 min-w-[200px] max-h-[320px] overflow-y-auto rounded-xl bg-[#1a1a1a] border border-white/10 shadow-2xl shadow-black/50 z-50">
          <div className="p-1.5">
            {options.map((opt) => {
              const isSelected = selected.has(opt.value);
              return (
                <button
                  key={opt.value}
                  onClick={() => {
                    onToggle(opt.value);
                    if (singleSelect) setOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                    isSelected
                      ? "bg-[var(--primary)]/10 text-white"
                      : "text-white/60 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  {!singleSelect && (
                    <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all shrink-0 ${
                      isSelected
                        ? "bg-[var(--primary)] border-[var(--primary)]"
                        : "border-white/20"
                    }`}>
                      {isSelected && (
                        <svg className="w-2.5 h-2.5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                  )}
                  {singleSelect && isSelected && (
                    <svg className="w-3.5 h-3.5 text-[var(--primary)] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                  {singleSelect && !isSelected && <div className="w-3.5 shrink-0" />}
                  {renderOption ? renderOption(opt, isSelected) : <span>{opt.label}</span>}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// Composant carte avec effet de halo qui suit la souris
function NicheCard({ niche, index, isUnlocked }: { niche: Niche; index: number; isUnlocked: boolean }) {
  const isDemandBased = niche.sourceType === 'demand_based';
  const cardRef = useRef<HTMLDivElement>(null);
  
  // Check if mobile or Safari (disable mouse tracking for performance)
  const isMobileOrSafari = typeof window !== 'undefined' && (
    window.innerWidth < 768 ||
    /^((?!chrome|android).)*safari/i.test(navigator.userAgent)
  );

  // Fonction pour rediriger vers la page pricing si verrouillé
  const handleLockedClick = (e: React.MouseEvent) => {
    if (!isUnlocked) {
      e.preventDefault();
      window.location.href = '/pricing';
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    // Disable mouse tracking on mobile/Safari to prevent performance issues
    if (isMobileOrSafari || !cardRef.current) return;
    
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
        className={`liquid-card p-6 group md:transition-all md:duration-300 md:hover:scale-[1.02] relative h-full flex flex-col ${isDemandBased ? 'exclusive-card' : ''}`}
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

const NICHES_PER_PAGE = 20;

export default function NichesPage() {
  const [niches, setNiches] = useState<Niche[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<AppleCategory>("All");
  const [hasSubscription, setHasSubscription] = useState(false);
  const [subscriptionChecked, setSubscriptionChecked] = useState(false);
  const [showExclusiveOnly, setShowExclusiveOnly] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCompetition, setSelectedCompetition] = useState<Set<CompetitionLevel>>(new Set());
  const [selectedRevenue, setSelectedRevenue] = useState<Set<RevenueRange>>(new Set());

  const toggleCompetition = useCallback((val: CompetitionLevel) => {
    setSelectedCompetition(prev => {
      const next = new Set(prev);
      if (next.has(val)) next.delete(val);
      else next.add(val);
      return next;
    });
  }, []);

  const toggleRevenue = useCallback((val: RevenueRange) => {
    setSelectedRevenue(prev => {
      const next = new Set(prev);
      if (next.has(val)) next.delete(val);
      else next.add(val);
      return next;
    });
  }, []);

  const hasActiveFilters = selectedCompetition.size > 0 || selectedRevenue.size > 0 || showExclusiveOnly || selectedCategory !== "All";

  const clearAllFilters = useCallback(() => {
    setSelectedCategory("All");
    setSelectedCompetition(new Set());
    setSelectedRevenue(new Set());
    setShowExclusiveOnly(false);
  }, []);

  const handleCategorySelect = useCallback((val: AppleCategory) => {
    setSelectedCategory(val);
  }, []);

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

  // Filtrer et trier les niches
  const filteredNiches = useMemo(() => {
    let filtered = selectedCategory === "All" 
      ? niches 
      : niches.filter(niche => niche.category === selectedCategory);
    
    // Filtre Exclusive Only
    if (showExclusiveOnly) {
      filtered = filtered.filter(niche => niche.sourceType === 'demand_based');
    }

    // Filtre Competition
    if (selectedCompetition.size > 0) {
      filtered = filtered.filter(niche => 
        niche.stats?.competition && selectedCompetition.has(niche.stats.competition as CompetitionLevel)
      );
    }

    // Filtre Revenue
    if (selectedRevenue.size > 0) {
      filtered = filtered.filter(niche => {
        if (!niche.stats?.revenue || niche.stats.revenue === "💎 Pro") return false;
        return Array.from(selectedRevenue).some(range => nicheMatchesRevenueRange(niche.stats.revenue, range));
      });
    }
    
    // Trier: gratuites en premier si non abonné
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
  }, [selectedCategory, niches, hasSubscription, showExclusiveOnly, selectedCompetition, selectedRevenue]);

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

  // Pagination
  const totalPages = Math.ceil(filteredNiches.length / NICHES_PER_PAGE);
  const paginatedNiches = useMemo(() => {
    const startIndex = (currentPage - 1) * NICHES_PER_PAGE;
    return filteredNiches.slice(startIndex, startIndex + NICHES_PER_PAGE);
  }, [filteredNiches, currentPage]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, showExclusiveOnly, selectedCompetition, selectedRevenue]);

  return (
    <main className="min-h-screen relative overflow-hidden text-white font-sans selection:bg-[#00CC3D] selection:text-black">
      {/* Background Effects - Hidden on mobile for performance */}
      <div className="fixed inset-0 pointer-events-none hidden md:block">
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
            
            <div className="flex items-center gap-3 px-4 py-2 rounded-full border border-white/10 bg-white/5 min-w-[140px] justify-center">
              <span className="w-2 h-2 rounded-full bg-[var(--primary)] animate-pulse" />
              <span className="text-xs font-mono text-white/70 tabular-nums">{loading ? '---' : filteredNiches.length} NICHES</span>
            </div>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="relative px-6 pb-8">
        <div className="max-w-7xl mx-auto space-y-3">

          {/* ── MOBILE: All filters as dropdowns in one row ── */}
          <div className="flex md:hidden flex-wrap gap-2">
            {/* Category Dropdown (mobile) */}
            <FilterDropdown<AppleCategory>
              label="Category"
              singleSelect
              icon={
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                </svg>
              }
              options={APPLE_CATEGORIES.filter(c => c === "All" || (categoryCounts[c] || 0) > 0).map(c => ({
                value: c,
                label: c === "All" ? `All (${categoryCounts["All"] || 0})` : `${c} (${categoryCounts[c] || 0})`,
              }))}
              selected={new Set([selectedCategory])}
              onToggle={handleCategorySelect}
            />

            {/* Competition Dropdown (mobile) */}
            <FilterDropdown<CompetitionLevel>
              label="Competition"
              icon={
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              }
              options={COMPETITION_OPTIONS}
              selected={selectedCompetition}
              onToggle={toggleCompetition}
              renderOption={(opt) => (
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${
                    opt.value === "Low" ? "bg-[var(--primary)]" :
                    opt.value === "Medium" ? "bg-yellow-400" : "bg-orange-400"
                  }`} />
                  <span>{opt.label}</span>
                </div>
              )}
            />

            {/* Revenue Dropdown (mobile) */}
            <FilterDropdown<RevenueRange>
              label="Revenue"
              icon={
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
              options={REVENUE_OPTIONS}
              selected={selectedRevenue}
              onToggle={toggleRevenue}
            />

            {/* TikTok Spot (mobile) */}
            {exclusiveCount > 0 && (
              <button
                onClick={() => setShowExclusiveOnly(!showExclusiveOnly)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
                  showExclusiveOnly
                    ? "bg-gradient-to-r from-amber-500/20 to-yellow-400/20 text-amber-400 border border-amber-500/30"
                    : "bg-white/5 text-white/60 border border-white/10"
                }`}
              >
                <span className="text-sm">🔥</span>
                <span>TikTok Spot</span>
              </button>
            )}

            {/* Clear (mobile) */}
            {hasActiveFilters && (
              <button
                onClick={clearAllFilters}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-white/40 hover:text-white/70 hover:bg-white/5 transition-all whitespace-nowrap"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Clear
              </button>
            )}
          </div>

          {/* ── DESKTOP: Category pills + advanced dropdowns ── */}
          <div className="hidden md:block space-y-4">
            {/* Row 1: Category pills */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <svg className="w-3.5 h-3.5 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                </svg>
                <span className="text-xs text-white/30 uppercase tracking-wider font-mono">Category</span>
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
                      className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
                        isSelected
                          ? "bg-[var(--primary)] text-black"
                          : "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white border border-white/10"
                      }`}
                    >
                      {category}
                      {count > 0 && (
                        <span className={`ml-1.5 text-xs ${isSelected ? "text-black/60" : "text-white/40"}`}>
                          {count}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Row 2: Advanced Filters */}
            <div className="flex items-center gap-2">
              <FilterDropdown<CompetitionLevel>
                label="Competition"
                icon={
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                }
                options={COMPETITION_OPTIONS}
                selected={selectedCompetition}
                onToggle={toggleCompetition}
                renderOption={(opt) => (
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${
                      opt.value === "Low" ? "bg-[var(--primary)]" :
                      opt.value === "Medium" ? "bg-yellow-400" : "bg-orange-400"
                    }`} />
                    <span>{opt.label}</span>
                  </div>
                )}
              />

              <FilterDropdown<RevenueRange>
                label="Revenue"
                icon={
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                }
                options={REVENUE_OPTIONS}
                selected={selectedRevenue}
                onToggle={toggleRevenue}
              />

              {exclusiveCount > 0 && (
                <button
                  onClick={() => setShowExclusiveOnly(!showExclusiveOnly)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
                    showExclusiveOnly
                      ? "bg-gradient-to-r from-amber-500/20 to-yellow-400/20 text-amber-400 border border-amber-500/30"
                      : "bg-white/5 text-white/60 hover:bg-amber-500/10 hover:text-amber-400 border border-white/10 hover:border-amber-500/30"
                  }`}
                >
                  <span className="text-sm">🔥</span>
                  <span>TikTok Spot</span>
                  <span className={`text-xs ${showExclusiveOnly ? "text-amber-400/60" : "text-white/40"}`}>
                    {exclusiveCount}
                  </span>
                </button>
              )}

              {hasActiveFilters && (
                <>
                  <div className="w-px h-6 bg-white/10 shrink-0" />
                  <button
                    onClick={clearAllFilters}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-white/40 hover:text-white/70 hover:bg-white/5 transition-all whitespace-nowrap"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Clear filters
                  </button>
                </>
              )}
            </div>
          </div>

        </div>
      </section>

      {/* Niches Grid */}
      <section className="relative px-6 pb-12">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            // Skeleton cards - même taille que les vraies cartes pour éviter le CLS
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="liquid-card p-6 h-[280px] animate-pulse">
                  {/* Header skeleton */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="h-3 w-10 bg-white/10 rounded" />
                        <div className="h-4 w-16 bg-white/10 rounded-full" />
                      </div>
                      <div className="h-6 w-3/4 bg-white/10 rounded mb-1" />
                      <div className="h-6 w-1/2 bg-white/10 rounded" />
                    </div>
                    <div className="h-7 w-16 bg-white/10 rounded-full" />
                  </div>
                  {/* Tags skeleton */}
                  <div className="flex gap-2 mb-4">
                    <div className="h-5 w-14 bg-white/5 rounded" />
                    <div className="h-5 w-16 bg-white/5 rounded" />
                    <div className="h-5 w-12 bg-white/5 rounded" />
                  </div>
                  {/* Description skeleton */}
                  <div className="space-y-2 mb-6">
                    <div className="h-4 w-full bg-white/5 rounded" />
                    <div className="h-4 w-4/5 bg-white/5 rounded" />
                  </div>
                  {/* Stats skeleton */}
                  <div className="grid grid-cols-2 gap-3 mt-auto">
                    <div className="p-3 rounded-lg bg-black/40 border border-white/5">
                      <div className="h-2 w-16 bg-white/10 rounded mb-2" />
                      <div className="h-4 w-10 bg-white/10 rounded" />
                    </div>
                    <div className="p-3 rounded-lg bg-black/40 border border-white/5">
                      <div className="h-2 w-16 bg-white/10 rounded mb-2" />
                      <div className="h-4 w-14 bg-white/10 rounded" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredNiches.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-white/40">No niches found yet. Add some in Supabase!</p>
            </div>
          ) : (
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginatedNiches.map((niche, index) => (
                  <NicheCard key={niche.id} niche={niche} index={index} isUnlocked={isNicheUnlocked(niche.displayCode)} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-12">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white/60 hover:bg-white/10 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                  >
                    ← Previous
                  </button>
                  
                  <div className="flex items-center gap-1 mx-4">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => {
                      // Show first, last, current, and adjacent pages
                      if (
                        page === 1 ||
                        page === totalPages ||
                        (page >= currentPage - 1 && page <= currentPage + 1)
                      ) {
                        return (
                          <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`w-10 h-10 rounded-lg text-sm font-medium transition-all ${
                              currentPage === page
                                ? "bg-[var(--primary)] text-black"
                                : "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white"
                            }`}
                          >
                            {page}
                          </button>
                        );
                      } else if (
                        page === currentPage - 2 ||
                        page === currentPage + 2
                      ) {
                        return <span key={page} className="text-white/30 px-1">...</span>;
                      }
                      return null;
                    })}
                  </div>

                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white/60 hover:bg-white/10 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                  >
                    Next →
                  </button>
                </div>
              )}

              {/* Page indicator */}
              <div className="text-center mt-4 text-sm text-white/30">
                Showing {((currentPage - 1) * NICHES_PER_PAGE) + 1}-{Math.min(currentPage * NICHES_PER_PAGE, filteredNiches.length)} of {filteredNiches.length} niches
              </div>
            </>
          )}
        </div>
      </section>

      {/* Learn More */}
      <section className="relative px-6 pb-20">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-px flex-1 bg-white/10" />
            <span className="text-xs font-mono text-white/30 uppercase tracking-wider">Learn more</span>
            <div className="h-px flex-1 bg-white/10" />
          </div>
          
          <div className="space-y-3">
            <Link 
              href="/blog/how-to-find-profitable-ios-app-ideas"
              className="group flex items-center justify-between py-3 border-b border-white/5 hover:border-[var(--primary)]/20 transition-colors"
            >
              <span className="text-white/70 group-hover:text-white transition-colors">How to Find Profitable iOS App Ideas</span>
              <span className="text-white/20 group-hover:text-[var(--primary)] transition-colors">→</span>
            </Link>

            <Link 
              href="/blog/why-app-ideas-fail"
              className="group flex items-center justify-between py-3 border-b border-white/5 hover:border-[var(--primary)]/20 transition-colors"
            >
              <span className="text-white/70 group-hover:text-white transition-colors">Why 90% of App Ideas Fail</span>
              <span className="text-white/20 group-hover:text-[var(--primary)] transition-colors">→</span>
            </Link>

            <Link 
              href="/blog/best-tools-find-profitable-app-ideas"
              className="group flex items-center justify-between py-3 border-b border-white/5 hover:border-[var(--primary)]/20 transition-colors"
            >
              <span className="text-white/70 group-hover:text-white transition-colors">Best Tools for App Research</span>
              <span className="text-white/20 group-hover:text-[var(--primary)] transition-colors">→</span>
            </Link>

            <Link 
              href="/blog/app-ideas-indie-hackers-solo-devs-studios"
              className="group flex items-center justify-between py-3 border-b border-white/5 hover:border-[var(--primary)]/20 transition-colors"
            >
              <span className="text-white/70 group-hover:text-white transition-colors">Guide for Indie Hackers & Solo Devs</span>
              <span className="text-white/20 group-hover:text-[var(--primary)] transition-colors">→</span>
            </Link>
          </div>

          <div className="mt-6 text-center">
            <Link 
              href="/blog"
              className="text-sm text-white/40 hover:text-[var(--primary)] transition-colors"
            >
              View all articles
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative px-6 py-10 border-t border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <span className="font-bold text-sm tracking-widest text-white/40">NICHES HUNTER</span>
          <div className="flex items-center gap-6 text-xs text-white/30">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
            <Link href="https://x.com/nicheshunter" className="hover:text-white transition-colors">Twitter</Link>
          </div>
          <span className="text-xs text-white/20">© 2026 Niches Hunter. All rights reserved.</span>
        </div>
      </footer>
    </main>
  );
}
