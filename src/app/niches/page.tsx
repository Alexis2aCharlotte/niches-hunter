"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";

// Types
interface TrendingApp {
  name: string;
  category: string;
  growth: string;
  description: string;
  strongMarket: string;
  keyPoints: string[];
  weakPoints: string[];
}

interface Niche {
  id: string;
  title: string;
  tags: string[];
  score: number;
  description: string;
  stats: {
    competition: string;
    potential: string;
    revenue: string;
    market: string;
  };
  trending: TrendingApp[];
  locked?: boolean;
}

// Mock Data
const nichesData: Niche[] = [
  {
    id: "842",
    title: "AI Education Tools",
    tags: ["SAAS", "B2C"],
    score: 98,
    description: "Rising demand for personalized study aids. Apps like Gauth (+24%) show high engagement with scalable subscription models. EU market significantly underserved — only 12% of US presence.",
    stats: { competition: "Low", potential: "Very High", revenue: "$8.2K/mo", market: "🇪🇺 EU" },
    trending: [
      { name: "Gauth", category: "Education", growth: "+24%", description: "AI homework helper", strongMarket: "🇺🇸 US", keyPoints: ["High retention", "Viral TikTok"], weakPoints: ["High churn"] },
      { name: "StudyHero", category: "Productivity", growth: "+18%", description: "Gamified focus timer", strongMarket: "🇰🇷 KR", keyPoints: ["Sticky gamification"], weakPoints: ["Niche audience"] },
    ],
  },
  {
    id: "905",
    title: "Micro-SaaS Kits",
    tags: ["DEV TOOLS", "B2B"],
    score: 94,
    description: "Explosion of indie hackers seeking rapid boilerplate solutions. High search volume for 'NextJS Starter' with low competition in specific vertical niches.",
    stats: { competition: "Medium", potential: "High", revenue: "$12.5K/mo", market: "🇺🇸 US" },
    trending: [
      { name: "ShipFast", category: "DevTools", growth: "+42%", description: "NextJS boilerplate", strongMarket: "🇺🇸 US", keyPoints: ["Cult following"], weakPoints: ["Price sensitivity"] },
    ],
  },
  {
    id: "773",
    title: "Crypto Arbitrage Bots",
    tags: ["FINTECH", "WEB3"],
    score: 91,
    description: "Automated trading tools are seeing a resurgence. Users are looking for simple, no-code interfaces to manage arbitrage across DEXs.",
    stats: { competition: "High", potential: "Very High", revenue: "$25K/mo", market: "🌏 ASIA" },
    trending: [
      { name: "ArbTrade", category: "DeFi", growth: "+65%", description: "Cross-chain arbitrage scanner", strongMarket: "🇻🇳 VN", keyPoints: ["Real-time alerts"], weakPoints: ["High barrier"] },
    ],
  },
  {
    id: "621",
    title: "Mental Health Journaling",
    tags: ["HEALTH", "B2C"],
    score: 89,
    description: "Growing awareness of mental health creates demand for AI-powered journaling and mood tracking apps with therapeutic insights.",
    stats: { competition: "Medium", potential: "High", revenue: "$6.8K/mo", market: "🇺🇸 US" },
    trending: [],
    locked: true,
  },
  {
    id: "534",
    title: "No-Code Website Builders",
    tags: ["TOOLS", "B2B"],
    score: 87,
    description: "Small businesses need simple landing page solutions. Vertical-specific builders (restaurants, gyms) show strong traction.",
    stats: { competition: "High", potential: "Medium", revenue: "$9.1K/mo", market: "🇪🇺 EU" },
    trending: [],
    locked: true,
  },
  {
    id: "412",
    title: "Pet Care Subscription",
    tags: ["E-COMMERCE", "B2C"],
    score: 85,
    description: "Pet owners spending more on premium products. Personalized subscription boxes based on pet preferences gaining momentum.",
    stats: { competition: "Low", potential: "High", revenue: "$15K/mo", market: "🇺🇸 US" },
    trending: [],
    locked: true,
  },
];

const categories = ["All", "SAAS", "B2C", "B2B", "FINTECH", "HEALTH", "DEV TOOLS"];

export default function NichesPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedNiche, setSelectedNiche] = useState<Niche | null>(null);
  const [showProModal, setShowProModal] = useState(false);

  const filteredNiches = selectedCategory === "All" 
    ? nichesData 
    : nichesData.filter(n => n.tags.includes(selectedCategory));

  const handleNicheClick = (niche: Niche) => {
    if (niche.locked) {
      setShowProModal(true);
    } else {
      setSelectedNiche(niche);
    }
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
            We're building something special. Get notified when it's ready.
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
        <div className="absolute top-0 left-1/3 w-[800px] h-[800px] bg-[var(--primary)]/3 blur-[200px] rounded-full" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-500/5 blur-[150px] rounded-full" />
      </div>

      {/* Header */}
      <section className="relative pt-32 pb-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--primary)]/10 border border-[var(--primary)]/20 mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary)] animate-pulse" />
                <span className="text-xs font-mono text-[var(--primary)] uppercase tracking-wider">Updated Daily</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold mb-4 tracking-tight">
                Niche <span className="text-flashy-green">Ideas</span>
              </h1>
              <p className="text-lg text-white/50 max-w-xl">
                Curated opportunities detected by our AI. Click any niche to explore trending apps and market insights.
              </p>
            </div>
            
            <div className="flex items-center gap-3 px-4 py-2 rounded-full border border-white/10 bg-white/5">
              <span className="w-2 h-2 rounded-full bg-[var(--primary)] animate-pulse" />
              <span className="text-xs font-mono text-white/70">{nichesData.length} NICHES TRACKED</span>
            </div>
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-3 mb-12">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
                  selectedCategory === cat
                    ? "bg-[var(--primary)] text-black shadow-[0_0_20px_rgba(0,204,61,0.3)]"
                    : "bg-white/5 text-white/60 border border-white/10 hover:bg-white/10 hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Niches Grid */}
      <section className="relative px-6 pb-24">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNiches.map((niche, index) => (
              <div
                key={niche.id}
                onClick={() => handleNicheClick(niche)}
                className={`liquid-card p-6 cursor-pointer group transition-all duration-300 hover:scale-[1.02] ${
                  niche.locked ? "opacity-60" : ""
                }`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Locked Overlay */}
                {niche.locked && (
                  <div className="absolute inset-0 backdrop-blur-sm bg-black/40 rounded-3xl flex items-center justify-center z-10">
                    <div className="text-center">
                      <span className="text-3xl mb-2 block">🔒</span>
                      <span className="text-xs font-bold text-[var(--primary)]">PRO ONLY</span>
                    </div>
                  </div>
                )}

                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="text-[10px] font-mono text-white/30 mb-1">#{niche.id}</div>
                    <h3 className="text-xl font-bold text-white group-hover:text-[var(--primary)] transition-colors">
                      {niche.title}
                    </h3>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                    niche.score >= 95 ? "bg-[var(--primary)] text-black" :
                    niche.score >= 90 ? "bg-[var(--primary)]/20 text-[var(--primary)]" :
                    "bg-white/10 text-white/70"
                  }`}>
                    {niche.score}/100
                  </div>
                </div>

                {/* Tags */}
                <div className="flex gap-2 mb-4">
                  {niche.tags.map(tag => (
                    <span key={tag} className="px-2 py-0.5 rounded border border-white/10 bg-white/5 text-[10px] text-white/60">
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Description */}
                <p className="text-sm text-white/50 leading-relaxed mb-6 line-clamp-3">
                  {niche.description}
                </p>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-3">
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
                    <div className="text-[9px] text-white/30 uppercase mb-1">Revenue</div>
                    <div className="text-sm font-bold text-white">{niche.stats.revenue}</div>
                  </div>
                </div>

                {/* Hover Arrow */}
                <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-[var(--primary)]">→</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      </div>{/* End Blurred Content */}

      {/* Niche Detail Modal */}
      {selectedNiche && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl"
          onClick={() => setSelectedNiche(null)}
        >
          <div 
            className="liquid-card w-full max-w-2xl max-h-[90vh] overflow-y-auto p-1 animate-scale-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-[#050505] rounded-[22px] p-8 relative">
              {/* Close Button */}
              <button 
                onClick={() => setSelectedNiche(null)}
                className="absolute top-4 right-4 text-white/30 hover:text-white text-xl transition-colors"
              >
                ✕
              </button>

              {/* Header */}
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-xs font-mono text-white/30">#{selectedNiche.id}</span>
                  <div className="flex gap-2">
                    {selectedNiche.tags.map(tag => (
                      <span key={tag} className="px-2 py-0.5 rounded border border-[var(--primary)]/20 bg-[var(--primary)]/10 text-[10px] text-[var(--primary)]">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <h2 className="text-3xl font-bold text-white mb-2">{selectedNiche.title}</h2>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--primary)] text-black text-xs font-bold">
                  {selectedNiche.score}/100 SCORE
                </div>
              </div>

              {/* Description */}
              <p className="text-white/70 leading-relaxed mb-8">
                {selectedNiche.description}
              </p>

              {/* Stats */}
              <div className="grid grid-cols-4 gap-3 mb-8">
                {[
                  { label: "Competition", value: selectedNiche.stats.competition },
                  { label: "Potential", value: selectedNiche.stats.potential },
                  { label: "Avg Revenue", value: selectedNiche.stats.revenue },
                  { label: "Best Market", value: selectedNiche.stats.market },
                ].map((stat, i) => (
                  <div key={i} className="p-4 rounded-xl bg-white/5 border border-white/10">
                    <div className="text-[10px] text-white/40 uppercase mb-1">{stat.label}</div>
                    <div className="font-bold text-[var(--primary)]">{stat.value}</div>
                  </div>
                ))}
              </div>

              {/* Trending Apps */}
              {selectedNiche.trending.length > 0 && (
                <div>
                  <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <span>📈</span> Trending Apps
                  </h3>
                  <div className="space-y-3">
                    {selectedNiche.trending.map((app, i) => (
                      <div key={i} className="p-4 rounded-xl bg-white/5 border border-white/10">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <div className="font-bold text-white">{app.name}</div>
                            <div className="text-xs text-white/40">{app.category}</div>
                          </div>
                          <span className="text-[var(--primary)] font-bold">{app.growth}</span>
                        </div>
                        <p className="text-sm text-white/50">{app.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* CTA */}
              <div className="mt-8 pt-6 border-t border-white/10">
                <button className="w-full py-4 rounded-xl bg-[var(--primary)] text-black font-bold hover:bg-[#00E847] transition-all shadow-[0_0_20px_rgba(0,204,61,0.3)]">
                  🚀 Start Building in This Niche
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Pro Modal */}
      {showProModal && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl"
          onClick={() => setShowProModal(false)}
        >
          <div 
            className="liquid-card w-full max-w-md p-1 animate-scale-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-[#050505] rounded-[22px] p-8 text-center relative">
              <button 
                onClick={() => setShowProModal(false)}
                className="absolute top-4 right-4 text-white/30 hover:text-white text-xl"
              >
                ✕
              </button>

              <div className="text-6xl mb-6">💎</div>
              <h3 className="text-2xl font-bold text-white mb-3">Unlock All Niches</h3>
              <p className="text-white/50 mb-8">
                Get access to 50+ curated niches, detailed analytics, and weekly updates with Niches Hunter Pro.
              </p>

              <div className="space-y-3 text-left mb-8">
                {[
                  "All niche ideas unlocked",
                  "Detailed app analysis",
                  "Weekly trend reports",
                  "Discord community access",
                ].map((feature, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm">
                    <span className="text-[var(--primary)]">✓</span>
                    <span className="text-white/70">{feature}</span>
                  </div>
                ))}
              </div>

              <button className="w-full py-4 rounded-xl bg-[var(--primary)] text-black font-bold hover:bg-[#00E847] transition-all">
                Get Pro — $29/month
              </button>
              <p className="mt-4 text-xs text-white/30">Cancel anytime • 7-day money-back guarantee</p>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

