"use client";

import { useState, useEffect, useRef } from "react";
import Navbar from "@/components/Navbar";

// --- Liquid Glass Card Component ---
function LiquidCard({
  children,
  className = "",
  style = {},
  animate = "",
  enableReveal = true
}: {
  children: React.ReactNode,
  className?: string,
  style?: any,
  animate?: string,
  enableReveal?: boolean
}) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
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
      className={`liquid-card ${animate} ${enableReveal ? 'reveal-base' : ''} ${className}`}
      style={style}
    >
      {children}
    </div>
  );
}

// --- Scroll Observer Hook ---
function useScrollReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal-base').forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, []);
}

export default function Home() {
  const [email, setEmail] = useState("");
  const [activeBlip, setActiveBlip] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showSubscribeModal, setShowSubscribeModal] = useState(false);


  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const [visibleBlips, setVisibleBlips] = useState<number[]>([]);

  // Carousel State
  const [activeFocusIndex, setActiveFocusIndex] = useState(0);
  // Selected App for Details View
  const [selectedApp, setSelectedApp] = useState<any>(null);

  // Trigger Scroll Animations
  useScrollReveal();

  const niches = [
    { name: "Fitness AI", x: 25, y: 30 },
    { name: "EdTech", x: 72, y: 25 },
    { name: "DeFi Tools", x: 65, y: 68 },
    { name: "Gaming Helpers", x: 30, y: 72 },
    { name: "Mental Health", x: 78, y: 52 },
    { name: "B2B SaaS", x: 20, y: 50 },
  ];

  /* 
    NICHES FOCUS DATA (Dynamic Trending Apps per Niche) 
  */
  const focusNiches = [
    {
      id: "028",
      title: "AI Tutor for Shy Language Learners",
      tags: ["EDUCATION", "AI"],
      score: 96,
      opportunity: "Conversation-first language apps are climbing fast in KR, JP and EU markets.",
      gap: "Most apps teach grammar before confidence. Very few position around shyness or fear of speaking.",
      move: "Build an AI voice tutor for anxious learners with zero-pressure conversations and gradual exposure.",
      stats: { competition: "Medium", potential: "Very High", revenue: "$8K–$15K", market: "🇰🇷 KR" },
      trending: [
        {
          name: "Praktika",
          category: "Language",
          growth: "+32%",
          description: "AI avatars for spoken practice. Zero judgment, daily conversations with realistic characters.",
          strongMarket: "🇪🇺 EU",
          keyPoints: ["Avatar-based learning", "High engagement"],
          weakPoints: ["Limited languages"]
        },
        {
          name: "Speak",
          category: "Language",
          growth: "+28%",
          description: "Conversation-first approach, strong presence in Asia. Focus on speaking from day one.",
          strongMarket: "🇰🇷 KR",
          keyPoints: ["Massive user base", "Strong retention"],
          weakPoints: ["Crowded market"]
        },
        {
          name: "ELSA Speak",
          category: "Pronunciation",
          growth: "+22%",
          description: "Pronunciation & confidence focus. AI analyzes your accent in real-time.",
          strongMarket: "🇻🇳 VN",
          keyPoints: ["Unique tech", "B2B potential"],
          weakPoints: ["Narrow focus"]
        },
        {
          name: "TalkPal AI",
          category: "Conversation",
          growth: "+18%",
          description: "Free-form AI conversations on any topic. Practice without scripts.",
          strongMarket: "🇩🇪 DE",
          keyPoints: ["Flexible use cases", "Growing fast"],
          weakPoints: ["Monetization unclear"]
        },
        {
          name: "Loora",
          category: "Voice AI",
          growth: "+15%",
          description: "Voice-only AI English tutor. No text, pure conversation practice.",
          strongMarket: "🇯🇵 JP",
          keyPoints: ["Unique positioning", "High LTV"],
          weakPoints: ["English only"]
        },
      ]
    },
    {
      id: "012",
      title: "AI Homework Helper for Kids",
      tags: ["EDUCATION", "B2C"],
      score: 94,
      opportunity: "AI homework solvers dominate Education charts across US, India and LATAM.",
      gap: "Most apps optimize for quick answers, not genuine understanding. There's weak parental trust, no age-specific content, and zero curriculum alignment with local school systems.",
      move: "Build a homework AI focused on one age range and one school system, with built-in parent dashboards showing progress and learning gaps.",
      stats: { competition: "High", potential: "Very High", revenue: "$15K–$30K", market: "🇺🇸 US" },
      trending: [
        {
          name: "Gauth",
          category: "Homework",
          growth: "+45%",
          description: "Top charts, massive student adoption. Instant answers with step-by-step explanations.",
          strongMarket: "🇺🇸 US",
          keyPoints: ["Viral on TikTok", "High retention"],
          weakPoints: ["Trust issues with parents"]
        },
        {
          name: "Question AI",
          category: "Homework",
          growth: "+38%",
          description: "Fast answers, viral growth. Snap a photo, get the solution.",
          strongMarket: "🇮🇳 IN",
          keyPoints: ["Low CAC", "Mobile-first"],
          weakPoints: ["Commoditized"]
        },
        {
          name: "Photomath",
          category: "Math",
          growth: "+20%",
          description: "Still a monster in math. The OG camera calculator with deep explanations.",
          strongMarket: "🇺🇸 US",
          keyPoints: ["Brand trust", "Huge install base"],
          weakPoints: ["Math only"]
        },
        {
          name: "Socratic",
          category: "Homework",
          growth: "+12%",
          description: "Trusted brand backed by Google. Multi-subject support.",
          strongMarket: "🇺🇸 US",
          keyPoints: ["Google backing", "Quality content"],
          weakPoints: ["Slow innovation"]
        },
        {
          name: "Homework AI",
          category: "Homework",
          growth: "+25%",
          description: "Lightweight mobile-first clone. Fast and simple UX.",
          strongMarket: "🇲🇽 MX",
          keyPoints: ["LATAM focus", "Fast growth"],
          weakPoints: ["No moat"]
        },
      ]
    },
    {
      id: "041",
      title: "Vertical Episodic Drama",
      tags: ["ENTERTAINMENT", "ASIA"],
      score: 92,
      opportunity: "Vertical drama apps are exploding across Southeast Asia with Netflix-level retention and session times.",
      gap: "Most platforms are generic, poorly localized, and lack cultural nuance. Very little experimentation with interactive storytelling or genre-specific positioning like pure romance or thriller.",
      move: "Launch a genre-focused vertical drama app targeting one specific market. Double down on local actors, culturally relevant storylines, and addictive cliffhangers.",
      stats: { competition: "High", potential: "Very High", revenue: "$25K+", market: "🇮🇩 ID" },
      trending: [
        {
          name: "DramaBox",
          category: "Drama",
          growth: "+55%",
          description: "Leader in short episodic drama. Binge-worthy vertical series.",
          strongMarket: "🇨🇳 CN",
          keyPoints: ["Category leader", "Strong IP"],
          weakPoints: ["China-centric"]
        },
        {
          name: "ReelShort",
          category: "Drama",
          growth: "+48%",
          description: "Strong monetization model. Premium short-form drama content.",
          strongMarket: "🇺🇸 US",
          keyPoints: ["US traction", "High ARPU"],
          weakPoints: ["Content costs"]
        },
        {
          name: "My Drama",
          category: "Drama",
          growth: "+35%",
          description: "Massive Asian user base. Romance and revenge genres dominate.",
          strongMarket: "🇮🇩 ID",
          keyPoints: ["SEA dominance", "Genre variety"],
          weakPoints: ["Low monetization"]
        },
        {
          name: "ShortTV",
          category: "Drama",
          growth: "+28%",
          description: "Vertical series only. Pure focus on episodic format.",
          strongMarket: "🇵🇭 PH",
          keyPoints: ["Clear positioning", "Growing fast"],
          weakPoints: ["Limited content"]
        },
        {
          name: "Loklok Drama",
          category: "Drama",
          growth: "+22%",
          description: "Rapid regional growth. Multi-language support.",
          strongMarket: "🇹🇭 TH",
          keyPoints: ["Localization", "Free tier"],
          weakPoints: ["Ad-dependent"]
        },
      ]
    }
  ];

  // Clear selected app when niche changes
  useEffect(() => {
    setSelectedApp(null);
  }, [activeFocusIndex]);

  useEffect(() => {
    const blipInt = setInterval(() => {
      setActiveBlip(prev => (prev + 1) % niches.length);
    }, 2000);

    niches.forEach((_, i) => {
      setTimeout(() => {
        setVisibleBlips(prev => [...prev, i]);
      }, 500 + (i * 300));
    });

    return () => clearInterval(blipInt);
  }, []); // eslint-disable-next-line react-hooks/exhaustive-deps

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: data.message || 'Welcome aboard! 🎯' });
        setEmail("");
        setShowModal(true);
      } else {
        setMessage({ type: 'error', text: data.error || 'Something went wrong.' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Network error. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen relative overflow-hidden text-white font-sans selection:bg-[#00CC3D] selection:text-black">

      {/* Navigation */}
      <Navbar onSubscribeClick={() => setShowSubscribeModal(true)} />

      {/* Hero Section */}
      <section className="relative pt-40 pb-20 px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-start">

          {/* Left Content */}
          <div className="text-center lg:text-left z-10">
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-[var(--primary)]/20 bg-[var(--primary)]/10 mb-8 backdrop-blur-md animate-float">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--primary)] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--primary)]"></span>
              </span>
              <span className="text-xs font-bold text-[var(--primary)] tracking-wide uppercase">🎯 12 Niches Discovered Today</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold leading-[1.1] mb-8 tracking-tighter animate-title-enter">
              Build <span className="text-flashy-green">iOS Apps</span> Users Want
            </h1>

            <p className="text-lg md:text-xl text-[rgba(255,255,255,0.7)] mb-10 max-w-xl mx-auto lg:mx-0 leading-relaxed font-light">
              We track <span className="text-white font-medium">40,000+ iOS apps daily</span> going from $0 to $50K MRR.
              Get validated niche ideas, revenue estimates, and market gaps delivered to your inbox.
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto lg:mx-0 p-2 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-sm">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                required
                className="bg-transparent border-none text-white px-4 py-3 flex-1 focus:ring-0 outline-none placeholder:text-white/30"
              />
              <button type="submit" disabled={isLoading} className="btn-primary whitespace-nowrap py-3 px-6 rounded-xl">
                {isLoading ? 'Processing...' : 'Get Free Niches'}
              </button>
            </form>

            <div className="mt-8 flex items-center justify-center lg:justify-start gap-6 text-xs text-[rgba(255,255,255,0.4)] font-mono">
              <span className="flex items-center gap-2"><span className="text-[var(--primary)]">●</span> 2,100+ smart builders</span>
              <span className="flex items-center gap-2"><span className="text-[var(--primary)]">●</span> $2.4M revenue tracked</span>
              <span className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[var(--primary)] animate-pulse" /> Updated live</span>
            </div>
          </div>

          {/* Right Visual - PRO FLAT RADAR (No Status Cards) */}
          <div className="relative flex flex-col items-center justify-center w-full h-auto mt-20 lg:mt-32">

            {/* The Radar Itself */}
            <div className="relative w-full h-[400px] flex items-center justify-center">
              {/* Ambient Glow */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-[var(--primary)]/5 blur-[80px] rounded-full pointer-events-none" />

              <div className="radar-stage scale-90 md:scale-100">
                <div className="radar-plate">
                  {/* Rings */}
                  <div className="radar-ring" />
                  <div className="radar-ring" />
                  <div className="radar-ring" />
                  <div className="radar-ring" />

                  {/* Scanner */}
                  <div className="radar-sweep" />

                  {/* Blips */}
                  {niches.map((niche, i) => (
                    <div
                      key={i}
                      className={`radar-blip-animated transition-all duration-700 ease-out ${visibleBlips.includes(i) ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}`}
                      style={{ left: `${niche.x}%`, top: `${niche.y}%` }}
                    >
                      {/* Floating Label */}
                      <div
                        className={`absolute left-5 top-1/2 -translate-y-1/2 rounded-md bg-black/90 border border-white/10 px-3 py-1 text-[10px] font-mono whitespace-nowrap transition-all duration-500 shadow-xl z-30
                          ${visibleBlips.includes(i) && activeBlip === i ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'}
                          `}
                      >
                        <span className="text-white font-bold">{niche.name}</span> <span className="text-flashy-green">DETECTED</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Live Data Dashboard */}
      <section className="py-24 px-4 sm:px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between md:items-end items-start mb-16 gap-6 reveal-base reveal-up">
            <div className="w-full md:w-auto">
              <h2 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-4 md:mb-6 text-white tracking-tight">
                This Week's Top Niches
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-[rgba(255,255,255,0.7)] max-w-xl">3 niches. Real revenue. Apps you can copy. Updated daily.</p>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 shrink-0">
              <span className="w-2 h-2 rounded-full bg-[var(--primary)] animate-pulse" />
              <span className="text-xs font-mono text-white/70">UPDATED {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }).toUpperCase()}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-stretch">
            {/* Feature Niche Card - CAROUSEL (Col 1 & 2) */}
            <LiquidCard
              key={activeFocusIndex} // Animation key
              animate="animate-flip-in"
              className="col-span-1 lg:col-span-2 p-6 sm:p-8 lg:p-10 group deep-relief flex flex-col justify-between h-full"
            >
                <div>
                  <div className="absolute top-0 right-0 p-40 bg-[var(--primary)]/10 blur-[90px] rounded-full group-hover:bg-[var(--primary)]/20 transition-all duration-700 pointer-events-none" />

                  <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6 sm:mb-8 relative z-10">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4 break-words leading-tight">{focusNiches[activeFocusIndex].title}</h3>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[10px] sm:text-xs font-bold text-[var(--primary)] uppercase tracking-widest">#{focusNiches[activeFocusIndex].id}</span>
                        <span className="text-white/20">·</span>
                        {focusNiches[activeFocusIndex].tags.map(tag => (
                          <span key={tag} className="px-2 py-0.5 rounded border border-white/20 bg-white/10 text-[10px] text-white">{tag}</span>
                        ))}
                      </div>
                    </div>
                    <div className="px-3 sm:px-4 py-1 sm:py-1.5 rounded-full bg-[var(--primary)] text-black text-[10px] sm:text-xs font-bold shadow-[0_0_20px_rgba(0,204,61,0.4)] whitespace-nowrap shrink-0">
                      {focusNiches[activeFocusIndex].score}/100 SCORE
                    </div>
                  </div>

                  <div className="space-y-5 mb-8 sm:mb-10 relative z-10">
                    <p className="text-white text-lg sm:text-xl lg:text-2xl leading-relaxed">
                      {focusNiches[activeFocusIndex].opportunity}
                    </p>
                    <p className="text-[rgba(255,255,255,0.6)] text-base sm:text-lg lg:text-xl leading-relaxed">
                      {focusNiches[activeFocusIndex].gap}
                    </p>
                    <p className="text-[rgba(255,255,255,0.6)] text-base sm:text-lg lg:text-xl leading-relaxed">
                      {focusNiches[activeFocusIndex].move}
                    </p>
                  </div>
                </div>

                {/* BOTTOM BLOCK: Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 relative z-10">
                  {[
                    { label: "Competition", value: focusNiches[activeFocusIndex].stats.competition, color: "text-[var(--primary)]" },
                    { label: "Potential", value: focusNiches[activeFocusIndex].stats.potential, color: "text-[var(--primary)]" },
                    { label: "MRR", value: focusNiches[activeFocusIndex].stats.revenue, color: "text-white" },
                    { label: "Best Market", value: focusNiches[activeFocusIndex].stats.market, color: "text-white" },
                  ].map((stat, i) => (
                    <div key={i} className="p-3 sm:p-4 lg:p-5 rounded-xl bg-black/40 border border-white/10 backdrop-blur-md">
                      <div className="text-[10px] sm:text-xs text-white/40 uppercase mb-1 sm:mb-2 tracking-wider">{stat.label}</div>
                      <div className={`font-mono text-base sm:text-lg lg:text-xl font-bold ${stat.color} whitespace-nowrap`}>{stat.value}</div>
                    </div>
                  ))}
                </div>
            </LiquidCard>

            {/* Trending List / Detail View Switcher */}
            <LiquidCard animate="reveal-right" className="col-span-1 p-6 sm:p-8 deep-relief overflow-hidden relative flex flex-col h-full">

                {selectedApp ? (
                  // --- DETAIL VIEW ---
                  <div className="h-full flex flex-col justify-between animate-flip-in">
                    <div>
                      <div className="flex justify-between items-start mb-6">
                        <div>
                          <h3 className="text-2xl font-bold text-white mb-1">{selectedApp.name}</h3>
                          <div className="text-xs text-white/50 bg-white/10 px-2 py-1 rounded inline-block">{selectedApp.category}</div>
                        </div>
                        <button
                          onClick={() => setSelectedApp(null)}
                          className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/70 hover:text-white transition-colors"
                        >
                          ✕
                        </button>
                      </div>

                      <div className="mb-6">
                        <div className="text-sm text-[rgba(255,255,255,0.7)] leading-relaxed">
                          {selectedApp.description}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3 mb-6">
                        <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                          <div className="text-[10px] text-white/40 uppercase tracking-widest mb-1">Growth</div>
                          <div className="text-xl font-bold text-[var(--primary)]">{selectedApp.growth}</div>
                        </div>
                        <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                          <div className="text-[10px] text-white/40 uppercase tracking-widest mb-1">Strong Market</div>
                          <div className="text-xl font-bold text-white">{selectedApp.strongMarket}</div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <div className="text-[10px] text-[var(--primary)] font-bold uppercase mb-2">Key Strengths</div>
                          <ul className="space-y-1">
                            {selectedApp.keyPoints.map((p: string, i: number) => (
                              <li key={i} className="flex items-start gap-2 text-xs text-white/70">
                                <span className="text-[var(--primary)] mt-0.5">✓</span> {p}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <div className="text-[10px] text-orange-400 font-bold uppercase mb-2">Weaknesses</div>
                          <ul className="space-y-1">
                            {selectedApp.weakPoints.map((p: string, i: number) => (
                              <li key={i} className="flex items-start gap-2 text-xs text-white/70">
                                <span className="text-orange-400 mt-0.5">!</span> {p}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => setShowSubscribeModal(true)}
                      className="w-full py-3 mt-6 rounded-xl bg-[var(--primary)]/10 text-[var(--primary)] text-sm font-bold hover:bg-[var(--primary)]/20 transition-colors"
                    >
                      Track this App →
                    </button>
                  </div>
                ) : (
                  // --- LIST VIEW ---
                  <div className="flex flex-col h-full">
                    <h3 className="text-xl lg:text-2xl font-bold mb-6 flex items-center gap-3">
                      <span className="text-2xl">📈</span> Trending Apps
                    </h3>
                    <div className="flex-1 flex flex-col justify-between space-y-4">
                      {focusNiches[activeFocusIndex].trending.map((app, i) => (
                        <div
                          key={`${activeFocusIndex}-${i}`}
                          onClick={() => setSelectedApp(app)}
                          className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/20 transition-all cursor-pointer group animate-flap-drop"
                          style={{ animationDelay: `${i * 100}ms` }}
                        >
                          <div className="flex items-center gap-4">
                            <span className="text-sm lg:text-base font-mono text-white/30 group-hover:text-[var(--primary)] transition-colors">0{i + 1}</span>
                            <div>
                              <div className="text-base lg:text-lg font-bold text-white group-hover:text-[var(--primary)] transition-colors">{app.name}</div>
                              <div className="text-[10px] lg:text-xs text-white/50">{app.category}</div>
                            </div>
                          </div>
                          <div className="flex flex-col items-end">
                            <span className="text-sm lg:text-base font-bold text-[var(--primary)]">{app.growth}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

            </LiquidCard>
          </div>

          {/* Pagination Dots - Centered on full page width */}
          <div className="flex justify-center gap-4 mt-8">
            {focusNiches.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveFocusIndex(i)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${activeFocusIndex === i ? 'bg-[var(--primary)] scale-125 shadow-[0_0_10px_#00CC3D]' : 'bg-white/20 hover:bg-white/40'}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-20 reveal-base reveal-up">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Hunt <span className="text-flashy-green">Smarter</span>, <br /><span className="text-flashy-green">Ship</span> Faster</h2>
            <p className="text-[rgba(255,255,255,0.6)] text-lg">We track 40,000+ apps daily so you don't have to. Get the intel, skip the research.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: "📡", title: "Morning Radar", desc: "5 rising apps in your inbox everyday. Spot opportunities before they blow up." },
              { icon: "📍", title: "Market Scanner", desc: "US, EU, Asia - see where apps perform best and find untapped markets." },
              { icon: "💎", title: "Niche Ideas", desc: "2-3 validated opportunities with low competition scores." },
              { icon: "💰", title: "MRR Estimates", desc: "Know the money before you code. Real MRR ranges from similar apps." },
            ].map((f, i) => (
              <LiquidCard key={i} animate="reveal-up" className="p-8 group" style={{ transitionDelay: `${i * 100}ms` }}>
                <div className="w-14 h-14 rounded-2xl bg-[var(--primary)]/10 text-[var(--primary)] flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform duration-500 border border-[var(--primary)]/20 shadow-[0_0_30px_rgba(0,204,61,0.1)]">
                  {f.icon}
                </div>
                <h3 className="text-xl font-bold mb-3 text-white">{f.title}</h3>
                <p className="text-sm text-[rgba(255,255,255,0.5)] leading-relaxed group-hover:text-[rgba(255,255,255,0.8)] transition-colors">{f.desc}</p>
              </LiquidCard>
            ))}
          </div>
        </div>
      </section>

      {/* CTA / Pricing Preview */}
      <section id="pricing" className="py-24 px-6 text-center">
        <div className="max-w-5xl mx-auto relative">
          {/* Glow behind container */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-to-r from-[var(--primary)]/10 to-[#6366F1]/10 blur-[100px] rounded-full pointer-events-none" />

          <LiquidCard animate="reveal-up" className="p-12 md:p-20 rounded-[40px] border-white/10 overflow-hidden">
            <div className="relative z-10">
              <h2 className="text-4xl md:text-6xl font-bold mb-8">Start The Hunt Now</h2>
              <p className="text-xl text-[rgba(255,255,255,0.7)] mb-12 max-w-lg mx-auto">
                One email with 5 rising apps and 2 validated ideas.<br />Every day.
              </p>

              <button
                onClick={() => setShowSubscribeModal(true)}
                className="btn-primary text-xl px-12 py-5 shadow-[0_0_50px_rgba(0,204,61,0.3)] hover:shadow-[0_0_80px_rgba(0,204,61,0.5)]"
              >
                Send Me Niches →
              </button>
              <p className="mt-6 text-sm text-[rgba(255,255,255,0.3)]">Takes 10 seconds</p>
            </div>
          </LiquidCard>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-white/5 reveal-base">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 opacity-50">
            <div className="w-8 h-8 rounded bg-gradient-to-br from-[var(--primary)] to-[var(--primary)]" />
            <span className="font-bold text-sm tracking-widest">NICHES HUNTER</span>
          </div>
          <div className="flex gap-8 text-sm text-[rgba(255,255,255,0.4)]">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Twitter</a>
          </div>
          <div className="text-xs text-[rgba(255,255,255,0.2)]">
            © 2024 Niches Hunter. All rights reserved.
          </div>
        </div>
      </footer>

      {/* SUBSCRIBE MODAL */}
      {showSubscribeModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl"
          onClick={() => setShowSubscribeModal(false)}
        >
          <LiquidCard
            enableReveal={false}
            className="w-full max-w-lg p-1 !p-1 relative animate-scale-up shadow-[0_0_150px_rgba(0,204,61,0.2)]"
          >
            <div className="bg-[#050505] rounded-[22px] p-8 md:p-10 relative overflow-hidden">
              {/* Close Button */}
              <button onClick={(e) => { e.stopPropagation(); setShowSubscribeModal(false); }} className="absolute top-5 right-5 text-white/20 hover:text-white text-xl transition-colors z-20">✕</button>

              {/* Radar Top Icon */}
              <div className="relative flex justify-center mb-6">
                <div className="w-16 h-16 rounded-full border border-[var(--primary)]/20 flex items-center justify-center relative">
                  <div className="w-16 h-16 absolute border border-[var(--primary)]/10 rounded-full animate-ping opacity-30" />
                  <div className="w-1.5 h-1.5 bg-[var(--primary)] rounded-full shadow-[0_0_10px_#00CC3D]" />
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[var(--primary)]/5 rounded-full" />
                  <div className="w-[1px] h-8 bg-[var(--primary)]/30 absolute shadow-[0_0_5px_rgba(0,204,61,0.5)] origin-bottom animate-spin-slow" />
                </div>
              </div>

              <div className="text-center mb-8 relative z-10">
                <div className="inline-flex items-center gap-2 mb-3 px-3 py-1 rounded-full bg-[var(--primary)]/20 border border-[var(--primary)]/20 text-[10px] font-mono text-[var(--primary)] uppercase tracking-wider">
                  <span className="w-1 h-1 rounded-full bg-[var(--primary)] animate-pulse" />
                  Free Daily Intel
                </div>
                <h3 className="text-3xl font-bold text-white mb-2 leading-tight">
                  Spot <span className="text-flashy-green drop-shadow-[0_0_15px_rgba(0,204,61,0.4)]">Profitable iOS Niches</span> <br />Before Anyone Else.
                </h3>
                <p className="text-sm text-[rgba(255,255,255,0.6)]">
                  Get your first niche analysis <span className="text-white font-medium">instantly</span> in your inbox.
                </p>
              </div>

              {/* 3 Grid Items */}
              <div className="grid grid-cols-3 gap-3 mb-8">
                {[
                  { icon: "📈", label: "5 trending apps" },
                  { icon: "💎", label: "2-3 niches" },
                  { icon: "🌍", label: "US vs EU data" },
                ].map((item, i) => (
                  <div key={i} className="flex flex-col items-center justify-center p-3 rounded-xl bg-white/5 border border-white/5 backdrop-blur-sm text-center">
                    <span className="text-xl mb-2">{item.icon}</span>
                    <span className="text-[10px] text-white/50 font-mono uppercase leading-tight">{item.label}</span>
                  </div>
                ))}
              </div>

              <form onSubmit={(e) => { handleSubmit(e); setShowSubscribeModal(false); }} className="space-y-4">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  required
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-4 text-white text-center focus:border-[var(--primary)] focus:bg-black/80 focus:ring-0 outline-none transition-all placeholder:text-white/20 font-mono text-sm"
                  autoFocus
                />
                <button type="submit" disabled={isLoading} className="w-full py-4 text-sm font-bold tracking-wider uppercase rounded-xl bg-[var(--primary)] hover:bg-[#00E847] text-black transition-all shadow-[0_0_20px_rgba(0,204,61,0.3)] hover:shadow-[0_0_30px_rgba(0,204,61,0.5)]">
                  {isLoading ? 'Joining...' : '🚀 Send Me Niches Now'}
                </button>
              </form>

              <div className="mt-8 text-center">
                <div className="flex justify-center gap-1 mb-2 text-[var(--primary)] text-xs">★★★★★</div>
                <p className="text-[10px] text-white/30">
                  Join <span className="text-white/60 font-medium">2,100+ indie devs</span> already hunting niches. <br />
                  <span className="opacity-50">100% free • Unsubscribe anytime • No spam ever</span>
                </p>
              </div>
            </div>
          </LiquidCard>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm" onClick={() => setShowModal(false)}>
          <LiquidCard enableReveal={false} className="p-10 rounded-3xl text-center max-w-sm shadow-[0_0_50px_rgba(0,204,61,0.2)]">
            <div className="text-6xl mb-6">🎉</div>
            <h3 className="text-2xl font-bold text-white mb-3">You're In!</h3>
            <p className="text-[rgba(255,255,255,0.6)] mb-8 text-lg">{message?.text}</p>
            <button onClick={() => setShowModal(false)} className="btn-primary w-full py-3">Awesome</button>
          </LiquidCard>
        </div>
      )}
    </main>
  );
}
