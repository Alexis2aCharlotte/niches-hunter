"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

// --- Liquid Glass Card Component ---
function LiquidCard({
  children,
  className = "",
  style = {},
  animate = "",
  enableReveal = true,
  onClick,
  clickableOnMobile = false
}: {
  children: React.ReactNode,
  className?: string,
  style?: any,
  animate?: string,
  enableReveal?: boolean,
  onClick?: () => void,
  clickableOnMobile?: boolean
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  
  // Detect mobile/Safari once - disable mouse tracking for performance
  const isMobileOrSafari = typeof window !== 'undefined' && (
    window.innerWidth < 768 ||
    /^((?!chrome|android).)*safari/i.test(navigator.userAgent)
  );

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    // Disable mouse tracking on mobile/Safari
    if (isMobileOrSafari || !cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    cardRef.current.style.setProperty('--mouse-x', `${x}px`);
    cardRef.current.style.setProperty('--mouse-y', `${y}px`);
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={isMobileOrSafari ? undefined : handleMouseMove}
      onClick={onClick}
      className={`liquid-card ${animate} ${enableReveal ? 'reveal-base' : ''} ${clickableOnMobile ? 'lg:cursor-default cursor-pointer' : ''} ${className}`}
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

// --- Mobile Detection Hook ---
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  return isMobile;
}

export default function Home() {
  const router = useRouter();
  const isMobile = useIsMobile();
  const [email, setEmail] = useState("");
  const [modalEmail, setModalEmail] = useState("");
  const [activeBlip, setActiveBlip] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showSubscribeModal, setShowSubscribeModal] = useState(false);
  const [isLifetime, setIsLifetime] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // Handle Stripe Checkout
  const handleCheckout = async () => {
    setCheckoutLoading(true);
    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          nicheId: 'home-pricing',
          mode: isLifetime ? 'lifetime' : 'monthly'
        }),
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

  const [visibleBlips, setVisibleBlips] = useState<number[]>([]);

  // Carousel State
  const [activeFocusIndex, setActiveFocusIndex] = useState(0);
  // Selected App for Details View
  const [selectedApp, setSelectedApp] = useState<any>(null);

  // Trigger Scroll Animations
  useScrollReveal();

  // Redirection vers /niches sur mobile uniquement
  const handleNicheCardClick = () => {
    if (window.innerWidth < 1024) { // lg breakpoint
      router.push('/niches');
    }
  };

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
      id: "0110",
      title: "Flight Deals & Price Drop Alerts",
      tags: ["TRAVEL", "DEALS", "TIKTOK"],
      score: 85,
      opportunity: "People scroll TikTok looking for flight deals like they scroll for memes. High intent, zero friction. They want to buy.",
      gap: "Hopper predicts prices. Skyscanner compares. But nobody runs a deal feed like a TikTok account - daily drops, urgency, viral sharing.",
      move: "Build the deal feed app. TikTok-first distribution. One studio did $70K/month in 10 months with this exact model.",
      stats: { competition: "Medium", potential: "Very High", revenue: "$50K-$100K", market: "🌍 Global" },
      trending: [
        {
          name: "AirClub",
          category: "Travel",
          growth: "+340%",
          description: "Flight deal tracking app with viral TikTok distribution. $70K+ MRR proven.",
          strongMarket: "🇺🇸 US",
          keyPoints: ["TikTok-first growth", "$70K+ MRR proven"],
          weakPoints: ["Single platform risk"]
        },
        {
          name: "Hopper",
          category: "Travel",
          growth: "+25%",
          description: "AI-powered flight and hotel booking with price prediction technology.",
          strongMarket: "🇺🇸 US",
          keyPoints: ["Price prediction AI", "Massive user base"],
          weakPoints: ["Not deal-focused"]
        },
        {
          name: "Secret Flying",
          category: "Travel",
          growth: "+45%",
          description: "Website and newsletter sharing mistake fares and flight deals worldwide.",
          strongMarket: "🇺🇸 US",
          keyPoints: ["Error fare specialist", "Loyal community"],
          weakPoints: ["No app experience"]
        },
      ]
    },
    {
      id: "0069",
      title: "Virtual Pet Co-Parenting for Couples",
      tags: ["COUPLES", "VIRTUAL PET", "RELATIONSHIP"],
      score: 89,
      opportunity: "Long-distance couples text all day but have nothing to do together. They want shared rituals, not just messages.",
      gap: "Couple apps share photos. None let you raise something together. No app creates daily accountability through a shared virtual pet.",
      move: "A pet both partners must care for daily. If one forgets, the pet gets sad. Instant daily habit + emotional bond.",
      stats: { competition: "Low", potential: "Very High", revenue: "$60K-$180K", market: "🌍 Global" },
      trending: [
        {
          name: "Widgetable",
          category: "Lifestyle",
          growth: "+180%",
          description: "Widget app with virtual pets and couple features. Basic co-op mechanics.",
          strongMarket: "🇺🇸 US",
          keyPoints: ["Widget pets", "Couple features", "Cute design"],
          weakPoints: ["Pet not truly shared"]
        },
        {
          name: "Locket Widget",
          category: "Social",
          growth: "+120%",
          description: "Photo sharing widget for couples and close friends. Viral growth.",
          strongMarket: "🇺🇸 US",
          keyPoints: ["Viral growth", "Simple concept"],
          weakPoints: ["No shared activity"]
        },
        {
          name: "Between",
          category: "Lifestyle",
          growth: "+45%",
          description: "Private space for couples with chat, calendar, and memories.",
          strongMarket: "🇰🇷 KR",
          keyPoints: ["All-in-one couple app", "Strong in Asia"],
          weakPoints: ["No virtual pet"]
        },
      ]
    },
    {
      id: "0112",
      title: "AI Monk Prayer & Meditation Apps",
      tags: ["HEALTH", "AI INFLUENCER", "SPIRITUAL"],
      score: 88,
      opportunity: "Calm and Headspace own meditation. But spiritual/prayer apps? Wide open. And people are hungry for daily guidance.",
      gap: "No one has built an AI influencer to promote their app. Yang Mun did: 2.4M followers, zero ad spend, pure organic downloads.",
      move: "Create a fake AI monk posting daily wisdom. Build audience first. Then soft-launch your prayer app. Free distribution forever.",
      stats: { competition: "Low", potential: "Very High", revenue: "$60K-$120K", market: "🌍 Global" },
      trending: [
        {
          name: "Yang Mun App",
          category: "Health & Fitness",
          growth: "+250%",
          description: "Prayer and meditation app promoted entirely through AI monk influencer account.",
          strongMarket: "🌍 Global",
          keyPoints: ["2.4M organic followers", "Zero ad spend model"],
          weakPoints: ["Single persona risk"]
        },
        {
          name: "Hallow",
          category: "Health & Fitness",
          growth: "+85%",
          description: "Catholic prayer and meditation app with guided sessions and daily content.",
          strongMarket: "🇺🇸 US",
          keyPoints: ["Catholic focused", "Celebrity endorsements"],
          weakPoints: ["Single religion only"]
        },
        {
          name: "Pray.com",
          category: "Health & Fitness",
          growth: "+60%",
          description: "Christian prayer app with devotionals, sleep content and community features.",
          strongMarket: "🇺🇸 US",
          keyPoints: ["Multi-faith content", "Sleep stories"],
          weakPoints: ["No viral presence"]
        },
      ]
    }
  ];

  // Clear selected app when niche changes
  useEffect(() => {
    setSelectedApp(null);
  }, [activeFocusIndex]);

  // Radar blip animations - Desktop only
  useEffect(() => {
    // Skip on mobile - radar not rendered
    if (typeof window !== 'undefined' && window.innerWidth < 768) return;
    
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
      {/* Mobile: Ambient glow background effect */}
      {isMobile && (
        <div 
          className="fixed inset-0 pointer-events-none z-0"
          style={{
            background: `
              radial-gradient(
                ellipse 100% 70% at 50% 0%,
                rgba(0, 204, 61, 0.12) 0%,
                rgba(0, 204, 61, 0.05) 30%,
                transparent 70%
              )
            `
          }}
        />
      )}
      
      {/* Hero Section */}
      <section className="relative pt-40 pb-20 px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-start">

          {/* Left Content */}
          <div className="text-center lg:text-left z-10">
            <a 
              href="/niches"
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[var(--primary)]/30 bg-[var(--primary)]/10 mb-8 backdrop-blur-md animate-float hover:bg-[var(--primary)]/20 hover:border-[var(--primary)]/50 transition-all duration-300 shadow-[0_0_15px_rgba(0,204,61,0.15)] hover:shadow-[0_0_25px_rgba(0,204,61,0.25)] group"
            >
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-red-500"></span>
              </span>
              <span className="text-[10px] font-medium text-[var(--primary)] tracking-wide uppercase group-hover:text-white transition-colors">Browse all niches ideas available</span>
              <span className="text-[var(--primary)] text-xs group-hover:translate-x-1 transition-transform">→</span>
            </a>

            <h1 className="text-5xl md:text-7xl font-bold leading-[1.1] mb-8 tracking-tighter animate-title-enter">
              Spot Profitable <span className="text-flashy-green">iOS Niches</span> Before Anyone Else
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
                {isLoading ? 'Processing...' : 'Get My First Niche'}
              </button>
            </form>
            
            {/* Feedback Message */}
            {message && (
              <div className={`mt-4 p-3 rounded-xl text-center text-sm font-medium ${
                message.type === 'success' 
                  ? 'bg-[var(--primary)]/20 text-[var(--primary)] border border-[var(--primary)]/30' 
                  : 'bg-red-500/20 text-red-400 border border-red-500/30'
              }`}>
                {message.text}
              </div>
            )}

            {/* Social proof stats */}
            <div className="mt-8 flex flex-wrap items-center justify-center lg:justify-start gap-x-4 gap-y-2 text-xs text-[rgba(255,255,255,0.6)] font-mono">
              <span className="flex items-center gap-1.5">
                <span className="text-[var(--primary)]">●</span>
                <span className="font-bold text-white">71+</span> builders
              </span>
              <span className="flex items-center gap-1.5">
                <span className="text-[var(--primary)]">●</span>
                <span className="font-bold text-white">$2.4M</span> tracked
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary)]" />
                Live
              </span>
            </div>

          </div>

          {/* Right Visual - Radar (Desktop only, hidden on mobile via CSS) */}
          <div className="hidden md:flex relative flex-col items-center justify-center w-full h-auto mt-20 lg:mt-32">
            <div className="relative w-full h-[400px] flex items-center justify-center">
              {/* Ambient Glow */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-[var(--primary)]/5 blur-[80px] rounded-full pointer-events-none" />

              <div className="radar-stage">
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

      {/* Features Grid - Value Proposition */}
      <section id="features" className="py-16 md:py-24 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12 md:mb-20 reveal-base reveal-up">
            <h2 className="text-4xl md:text-6xl font-bold mb-6">Hunt <span className="text-flashy-green">Smarter</span> <br /><span className="text-flashy-green">Ship</span> Faster</h2>
            <p className="text-lg md:text-xl text-[rgba(255,255,255,0.6)]">99+ validated niches ready to build. We spot winners early so you can ship before competition hits.</p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
            {[
              { icon: "🔍", title: "Spot Winners Early", desc: "We track 40K apps daily. Find rising niches 3-6 months before they blow up." },
              { icon: "🎯", title: "Solo Dev Opportunities", desc: "1,500+ big corps filtered out. You only see what YOU can build." },
              { icon: "🌍", title: "Global Trend Detection", desc: "US trending ≠ EU trending. Find untapped markets before competition hits." },
              { icon: "🔥", title: "TikTok Viral Demand", desc: "Apps going viral on TikTok before hitting the charts. Spot demand-based opportunities early." },
            ].map((f, i) => (
              <LiquidCard key={i} animate="reveal-up" className="p-6 md:p-8 group" style={{ transitionDelay: `${i * 100}ms` }}>
                <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-[var(--primary)]/10 text-[var(--primary)] flex items-center justify-center text-xl md:text-2xl mb-4 md:mb-6 group-hover:scale-110 transition-transform duration-500 border border-[var(--primary)]/20 shadow-[0_0_30px_rgba(0,204,61,0.1)]">
                  {f.icon}
                </div>
                <h3 className="text-base md:text-xl font-bold mb-2 md:mb-3 text-white">{f.title}</h3>
                <p className="text-xs md:text-sm text-[rgba(255,255,255,0.5)] leading-relaxed group-hover:text-[rgba(255,255,255,0.8)] transition-colors">{f.desc}</p>
              </LiquidCard>
            ))}
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

          {/* MOBILE: 3 niches stacked */}
          {isMobile ? (
            <div className="space-y-4">
              {focusNiches.map((niche, index) => (
                <div 
                  key={niche.id}
                  className="p-5 rounded-2xl bg-white/[0.03] border border-white/10"
                  onClick={handleNicheCardClick}
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-white/40 font-mono">#{niche.id}</span>
                      <span className="px-2 py-0.5 rounded bg-white/10 text-[10px] text-white/70">{niche.tags[0]}</span>
                    </div>
                    <span className="text-sm font-bold text-[var(--primary)]">{niche.score}/100</span>
                  </div>
                  
                  {/* Title */}
                  <h3 className="text-lg font-bold text-white mb-2 leading-tight">{niche.title}</h3>
                  
                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {niche.tags.map(tag => (
                      <span key={tag} className="px-2 py-0.5 rounded bg-white/5 text-[10px] text-white/50">{tag}</span>
                    ))}
                  </div>
                  
                  {/* Description (shortened) */}
                  <p className="text-sm text-white/60 leading-relaxed mb-4 line-clamp-2">
                    {niche.opportunity}
                  </p>
                  
                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-3 rounded-xl bg-black/40 border border-white/5">
                      <div className="text-[9px] text-white/40 uppercase tracking-wider mb-1">Competition</div>
                      <div className={`text-sm font-bold ${niche.stats.competition === 'Low' ? 'text-[var(--primary)]' : niche.stats.competition === 'Medium' ? 'text-yellow-400' : 'text-orange-400'}`}>
                        {niche.stats.competition}
                      </div>
                    </div>
                    <div className="p-3 rounded-xl bg-black/40 border border-white/5">
                      <div className="text-[9px] text-white/40 uppercase tracking-wider mb-1">Est. Revenue</div>
                      <div className="text-sm font-bold text-white">{niche.stats.revenue}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* DESKTOP: Carousel with apps */
            <>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-stretch">
              {/* Feature Niche Card - CAROUSEL (Col 1 & 2) */}
              <LiquidCard
                key={activeFocusIndex}
                animate="animate-flip-in"
                className="col-span-1 lg:col-span-2 p-6 sm:p-8 lg:p-10 group deep-relief flex flex-col justify-between h-full"
                onClick={handleNicheCardClick}
                clickableOnMobile={true}
              >
                  <div>
                    {/* Glow */}
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
            <LiquidCard 
              animate="reveal-right" 
              className="col-span-1 p-6 sm:p-8 deep-relief overflow-hidden relative flex flex-col h-full"
              onClick={handleNicheCardClick}
              clickableOnMobile={true}
            >

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
                      <span className="text-2xl">📈</span> Competitors Apps
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

            {/* Pagination Dots */}
            <div className="flex justify-center gap-4 mt-8">
              {focusNiches.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveFocusIndex(i)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${activeFocusIndex === i ? 'bg-[var(--primary)] scale-125 shadow-[0_0_10px_#00CC3D]' : 'bg-white/20 hover:bg-white/40'}`}
                />
              ))}
            </div>
            </>
          )}
        </div>
      </section>

      {/* Hunter Toolkit Section */}
      <section id="toolkit" className="py-24 px-6 relative overflow-hidden">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16 reveal-base reveal-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[var(--primary)]/30 bg-[var(--primary)]/10 mb-6 backdrop-blur-md">
              <span className="text-sm font-medium text-[var(--primary)] tracking-wide uppercase">Free Tools</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              Test Our <span className="text-flashy-green">Hunter Toolkit</span>
            </h2>
            <p className="text-xl text-[rgba(255,255,255,0.6)] max-w-2xl mx-auto">
              Free tools to help you validate and find your next profitable niche idea.
            </p>
          </div>

          {/* Tools Grid */}
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
            {[
              { icon: "💡", title: "Niche Ideas", desc: "Browse our curated database of validated niche ideas with revenue potential.", cta: "Browse niches →", href: "/niches" },
              { icon: "🎰", title: "Niche Roulette", desc: "Can't decide? Let fate pick your next startup idea from our database.", cta: "Spin the wheel →", href: "/niche-roulette" },
              { icon: "💰", title: "Revenue Estimator", desc: "Estimate your potential MRR based on your niche and business model.", cta: "Estimate MRR →", href: "/revenue-estimator" },
              { icon: "✅", title: "Niche Validator", desc: "Validate your niche idea with AI. Get a score and recommendations.", cta: "Validate idea →", href: "/niche-validator" },
            ].map((tool, i) => (
              <Link key={i} href={tool.href} className="group">
                <LiquidCard animate={isMobile ? "" : "reveal-up"} className="p-4 md:p-8 group cursor-pointer h-full flex flex-col" style={{ transitionDelay: `${i * 100}ms` }}>
                  <div className="w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-[var(--primary)]/10 text-[var(--primary)] flex items-center justify-center text-xl md:text-2xl mb-3 md:mb-6 border border-[var(--primary)]/20">
                    {tool.icon}
                  </div>
                  <h3 className="text-sm md:text-xl font-bold mb-1 md:mb-3 text-white">{tool.title}</h3>
                  <p className="text-xs md:text-sm text-[rgba(255,255,255,0.5)] leading-relaxed flex-grow line-clamp-2 md:line-clamp-none">{tool.desc}</p>
                  <p className="text-xs md:text-sm text-[var(--primary)] font-medium mt-2 md:mt-4">{tool.cta}</p>
                </LiquidCard>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-16 md:py-24 px-4 sm:px-6 relative">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10 md:mb-16 reveal-base reveal-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--primary)]/10 border border-[var(--primary)]/20 mb-6">
              <span className="w-2 h-2 rounded-full bg-[var(--primary)] animate-pulse" />
              <span className="text-xs md:text-sm font-mono text-[var(--primary)] uppercase tracking-wider">Launch Offer</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              Simple <span className="text-flashy-green">Pricing</span>
            </h2>
            <p className="text-lg md:text-xl text-[rgba(255,255,255,0.6)] max-w-md mx-auto">
              Start free, upgrade when you need more power.
            </p>
          </div>

          {/* Toggle */}
          <div className="flex items-center justify-center gap-4 mb-8 md:mb-12">
            <span className={`text-sm md:text-base font-medium transition-colors ${!isLifetime ? 'text-white' : 'text-white/40'}`}>
              Monthly
            </span>
            <button
              onClick={() => setIsLifetime(!isLifetime)}
              className={`relative w-12 sm:w-14 h-6 sm:h-7 rounded-full transition-colors ${isLifetime ? 'bg-[var(--primary)]' : 'bg-white/20'}`}
            >
              <div className={`absolute top-0.5 sm:top-1 w-5 sm:w-5 h-5 sm:h-5 rounded-full bg-white shadow-lg transition-all ${isLifetime ? 'left-6 sm:left-8' : 'left-0.5 sm:left-1'}`} />
            </button>
            <span className={`text-sm md:text-base font-medium transition-colors flex items-center gap-2 ${isLifetime ? 'text-white' : 'text-white/40'}`}>
              Lifetime
              <span className="px-2 py-1 rounded-full bg-[var(--primary)]/20 text-[var(--primary)] text-[10px] md:text-xs font-bold">
                BEST
              </span>
            </span>
          </div>

          {/* Pricing Cards - Mobile Stack, Desktop Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            
            {/* Free Plan */}
            <LiquidCard animate="reveal-up" className="p-5 sm:p-6 md:p-8 relative overflow-hidden">
              <div className="flex flex-col h-full">
                <div className="mb-4 md:mb-6">
                  <h3 className="text-lg sm:text-xl font-bold mb-1">Free</h3>
                  <p className="text-white/50 text-xs sm:text-sm">Perfect to get started</p>
                </div>

                <div className="mb-4 md:mb-6">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl sm:text-4xl font-bold">$0</span>
                    <span className="text-white/40 text-sm">/forever</span>
                  </div>
                </div>

                <button
                  onClick={() => setShowSubscribeModal(true)}
                  className="w-full py-3 sm:py-3.5 text-center rounded-xl bg-white/10 text-white text-sm font-bold hover:bg-white/15 transition-all mb-4 md:mb-6"
                >
                  Get Started
                </button>

                {/* Features - Compact */}
                <div className="space-y-2 sm:space-y-2.5">
                  {[
                    { name: 'Daily newsletter on trend', included: true },
                    { name: 'Niche Roulette', included: true },
                    { name: 'Revenue Estimator', included: true },
                    { name: '99+ Niches Analyzed', included: false },
                    { name: 'TikTok Spot', included: false },
                    { name: 'AI Niche Validator', included: false },
                  ].map((feature, i) => (
                    <div key={i} className="flex items-center gap-2">
                      {feature.included ? (
                        <div className="w-4 h-4 rounded-full bg-[var(--primary)]/20 flex items-center justify-center shrink-0">
                          <svg className="w-2.5 h-2.5 text-[var(--primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                </div>
                      ) : (
                        <div className="w-4 h-4 rounded-full bg-white/5 flex items-center justify-center shrink-0">
                          <svg className="w-2.5 h-2.5 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </div>
                      )}
                      <span className={`text-xs sm:text-sm ${feature.included ? 'text-white/80' : 'text-white/30'}`}>
                        {feature.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              </LiquidCard>

            {/* Pro Plan */}
            <LiquidCard animate={isMobile ? "" : "reveal-up"} className="p-5 sm:p-6 md:p-8 relative overflow-hidden border-2 border-[var(--primary)]/30" style={{ transitionDelay: '100ms' }}>
              {/* Glow effect - Desktop only */}
              {!isMobile && <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--primary)]/20 blur-[60px] rounded-full pointer-events-none" />}
              
              {/* Badge - Only for Lifetime */}
              {isLifetime && (
                <div className="absolute top-3 right-3 sm:top-4 sm:right-4">
                  <span className="px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full bg-[var(--primary)] text-black text-[9px] sm:text-[10px] font-bold">
                    -40% LAUNCH
                  </span>
                </div>
              )}

              <div className="flex flex-col h-full">
                <div className="mb-4 md:mb-6">
                  <h3 className="text-lg sm:text-xl font-bold mb-1 flex items-center gap-2">
                    Pro {isLifetime ? 'Lifetime' : ''} 
                    <span className="text-base">{isLifetime ? '♾️' : ''}</span>
                  </h3>
                  <p className="text-white/50 text-xs sm:text-sm">
                    {isLifetime ? 'Pay once, access forever' : 'Full access, cancel anytime'}
                  </p>
                </div>

                <div className="mb-4 md:mb-6">
                  <div className="flex items-baseline gap-2">
                    {isLifetime && (
                      <span className="text-lg sm:text-xl text-white/40 line-through">$49</span>
                    )}
                    <span className="text-3xl sm:text-4xl font-bold text-[var(--primary)]">
                      ${isLifetime ? '29' : '9.99'}
                    </span>
                    {!isLifetime && <span className="text-white/40 text-sm">/mo</span>}
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  disabled={checkoutLoading}
                  className="block w-full py-3 sm:py-3.5 text-center rounded-xl bg-[var(--primary)] text-black text-sm font-bold hover:bg-[#00E847] transition-all mb-4 md:mb-6 shadow-[0_0_20px_rgba(0,204,61,0.3)] hover:shadow-[0_0_30px_rgba(0,204,61,0.5)] disabled:opacity-50"
                >
                  {checkoutLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    isLifetime ? 'Get Lifetime Access →' : 'Start Monthly →'
                  )}
                </button>

                {/* Features - Compact */}
                <div className="space-y-2 sm:space-y-2.5">
                  {[
                    { name: '99+ Niches Analyzed', included: true },
                    { name: 'Save & track niches', included: true },
                    { name: 'TikTok Spot', included: true },
                    { name: 'AI Niche Validator (unlimited)', included: true },
                    { name: 'Daily newsletter - Full analysis', included: true },
                    { name: 'Competitor deep-dive', included: true },
                  ].map((feature, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-[var(--primary)]/20 flex items-center justify-center shrink-0">
                        <svg className="w-2.5 h-2.5 text-[var(--primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-xs sm:text-sm text-white/80">{feature.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </LiquidCard>
          </div>

          {/* Trust badges - Mobile optimized */}
          <div className="mt-6 md:mt-10 flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-[10px] sm:text-xs text-white/40">
            <div className="flex items-center gap-1.5">
              <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Secure via Stripe
            </div>
            <div className="flex items-center gap-1.5">
              <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              7-day guarantee
            </div>
            <div className="flex items-center gap-1.5">
              <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Cancel anytime
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 md:py-24 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10 md:mb-14">
            <h2 className="text-3xl md:text-5xl font-bold mb-4 text-white">
              Frequently Asked <span className="text-flashy-green">Questions</span>
            </h2>
            <p className="text-base md:text-lg text-white/50">
              Everything you need to know about Niches Hunter
            </p>
          </div>

          <div className="space-y-3 md:space-y-4">
            {[
              {
                q: "What exactly is Niches Hunter?",
                a: "Niches Hunter is a tool that helps you find profitable app ideas by analyzing the App Store. We track 40,000+ apps daily and identify gaps in the market where you can build something people actually want. Think of it as your research assistant for finding your next app idea."
              },
              {
                q: "What do I get with the Pro plan?",
                a: "Full access to our database of 99+ validated niches with detailed analysis, competition scores, revenue estimates, and market gaps. You also get the Workspace to save and organize your favorite niches, track competitors, and take notes. Plus the daily newsletter with fresh insights."
              },
              {
                q: "How does the tool work?",
                a: "We analyze App Store data daily to spot trends, track revenue estimates, and identify niches with low competition but high demand. Each niche comes with detailed info: what's working, what's missing, competitor analysis, and actionable next steps."
              },
              {
                q: "What do I receive every day?",
                a: "A short email with 2-3 trending apps, market insights, and occasionally a new niche opportunity. It's designed to be quick to read — no fluff, just useful info you can act on."
              },
              {
                q: "Is this good for beginners?",
                a: "Yes! You don't need to be an expert. Each niche includes clear explanations of the opportunity, who the competitors are, and what you could build. It's perfect if you're looking for your first app idea or want to explore new markets."
              },
              {
                q: "Can I build my app from A to Z with this?",
                a: "That's exactly what the Workspace is for. You can save niches, add your own notes, track competitors, define milestones, and build a clear roadmap for your project. Everything is consolidated in one place so you always know what's next. It's designed to take you from idea to launch with a clear vision."
              },
              {
                q: "How often is the data updated?",
                a: "Daily. Our system tracks app rankings, reviews, and revenue estimates every day. New niches are added regularly based on emerging trends and market shifts."
              },
              {
                q: "Can I cancel anytime?",
                a: "Yes, no questions asked. If you're on monthly, just cancel before your next billing date. For lifetime, it's a one-time payment — no recurring charges ever."
              },
            ].map((faq, i) => (
              <details key={i} className="group p-4 md:p-6 rounded-2xl bg-white/[0.02] border border-white/10 cursor-pointer">
                <summary className="flex items-center justify-between font-medium text-sm md:text-base text-white list-none">
                  {faq.q}
                  <span className="text-white/40 group-open:rotate-180 transition-transform ml-4 shrink-0">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </span>
                </summary>
                <p className="mt-4 text-sm md:text-base text-white/60 leading-relaxed">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section - Loved by Builders */}
      <section className="py-16 md:py-24 overflow-hidden">
        <div className="text-center mb-12 px-6">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 text-white">
            Loved by <span className="text-flashy-green">Builders</span> Worldwide
          </h2>
          <p className="text-base md:text-lg text-white/50 max-w-xl mx-auto">
            Join 70+ developers and entrepreneurs building their app dreams with Niches Hunter
          </p>
        </div>

        {/* Scrolling Testimonials */}
        <div className="relative">
          {/* Gradient fade left */}
          <div className="absolute left-0 top-0 bottom-0 w-20 md:w-40 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none" />
          {/* Gradient fade right */}
          <div className="absolute right-0 top-0 bottom-0 w-20 md:w-40 bg-gradient-to-l from-black to-transparent z-10 pointer-events-none" />
          
          {/* Row 1 - Left to Right */}
          <div className="flex gap-4 md:gap-6 mb-4 md:mb-6 animate-scroll-left">
            {[
              { stars: 5, text: "I used to spend hours scrolling through the App Store trying to find gaps. Now I just check Niches Hunter in the morning with my coffee.", name: "Marc D.", role: "Indie Dev", source: "𝕏" },
              { stars: 5, text: "The workspace is so handy. I have all my notes, competitors, and ideas in one place. No more messy Notion pages.", name: "Sarah K.", role: "Solo Founder", source: "Email" },
              { stars: 5, text: "Honestly didn't expect much but the niche details are surprisingly thorough. Saved me a ton of research time.", name: "James L.", role: "iOS Developer", source: "𝕏" },
              { stars: 5, text: "Love that I can save niches and come back to them later. The workspace keeps everything organized.", name: "Anna M.", role: "App Builder", source: "Message" },
              { stars: 5, text: "Finally found a tool that actually shows what's working in the App Store. The competitor info is really useful.", name: "Tom B.", role: "Developer", source: "𝕏" },
            ].map((t, i) => (
              <div key={i} className="flex-shrink-0 w-[300px] md:w-[380px] p-5 md:p-6 rounded-2xl bg-white/[0.03] border border-white/10">
                <div className="flex gap-0.5 mb-3 text-yellow-400">
                  {Array.from({ length: t.stars }).map((_, j) => <span key={j}>★</span>)}
                </div>
                <p className="text-sm md:text-base text-white/80 mb-4 leading-relaxed">"{t.text}"</p>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-white text-sm">{t.name}</div>
                    <div className="text-xs text-white/40">{t.role}</div>
                  </div>
                  <div className="text-xs text-white/30">{t.source}</div>
                </div>
              </div>
            ))}
            {/* Duplicate for infinite scroll */}
            {[
              { stars: 5, text: "I used to spend hours scrolling through the App Store trying to find gaps. Now I just check Niches Hunter in the morning with my coffee.", name: "Marc D.", role: "Indie Dev", source: "𝕏" },
              { stars: 5, text: "The workspace is so handy. I have all my notes, competitors, and ideas in one place. No more messy Notion pages.", name: "Sarah K.", role: "Solo Founder", source: "Email" },
              { stars: 5, text: "Honestly didn't expect much but the niche details are surprisingly thorough. Saved me a ton of research time.", name: "James L.", role: "iOS Developer", source: "𝕏" },
              { stars: 5, text: "Love that I can save niches and come back to them later. The workspace keeps everything organized.", name: "Anna M.", role: "App Builder", source: "Message" },
              { stars: 5, text: "Finally found a tool that actually shows what's working in the App Store. The competitor info is really useful.", name: "Tom B.", role: "Developer", source: "𝕏" },
            ].map((t, i) => (
              <div key={`dup-${i}`} className="flex-shrink-0 w-[300px] md:w-[380px] p-5 md:p-6 rounded-2xl bg-white/[0.03] border border-white/10">
                <div className="flex gap-0.5 mb-3 text-yellow-400">
                  {Array.from({ length: t.stars }).map((_, j) => <span key={j}>★</span>)}
                </div>
                <p className="text-sm md:text-base text-white/80 mb-4 leading-relaxed">"{t.text}"</p>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-white text-sm">{t.name}</div>
                    <div className="text-xs text-white/40">{t.role}</div>
                  </div>
                  <div className="text-xs text-white/30">{t.source}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Row 2 - Right to Left */}
          <div className="flex gap-4 md:gap-6 animate-scroll-right">
            {[
              { stars: 5, text: "Super useful to have everything in one dashboard. I can track my progress, save ideas, and check competitors without switching tabs.", name: "David R.", role: "Maker", source: "𝕏" },
              { stars: 5, text: "The newsletter is actually good? Like I actually read it every morning. Short, useful, no fluff.", name: "Emily C.", role: "Product Designer", source: "Email" },
              { stars: 5, text: "Was skeptical at first but the data quality surprised me. Way better than doing manual research.", name: "Mike S.", role: "Founder", source: "Message" },
              { stars: 5, text: "Simple and clean. I know exactly what's trending and what's saturated. Helps me focus on the right stuff.", name: "Rachel W.", role: "Solo Dev", source: "𝕏" },
              { stars: 5, text: "The niche roulette thing is fun lol. Spun it a few times and actually found something interesting.", name: "Kevin T.", role: "Builder", source: "𝕏" },
            ].map((t, i) => (
              <div key={i} className="flex-shrink-0 w-[300px] md:w-[380px] p-5 md:p-6 rounded-2xl bg-white/[0.03] border border-white/10">
                <div className="flex gap-0.5 mb-3 text-yellow-400">
                  {Array.from({ length: t.stars }).map((_, j) => <span key={j}>★</span>)}
                </div>
                <p className="text-sm md:text-base text-white/80 mb-4 leading-relaxed">"{t.text}"</p>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-white text-sm">{t.name}</div>
                    <div className="text-xs text-white/40">{t.role}</div>
                  </div>
                  <div className="text-xs text-white/30">{t.source}</div>
                </div>
              </div>
            ))}
            {/* Duplicate for infinite scroll */}
            {[
              { stars: 5, text: "Super useful to have everything in one dashboard. I can track my progress, save ideas, and check competitors without switching tabs.", name: "David R.", role: "Maker", source: "𝕏" },
              { stars: 5, text: "The newsletter is actually good? Like I actually read it every morning. Short, useful, no fluff.", name: "Emily C.", role: "Product Designer", source: "Email" },
              { stars: 5, text: "Was skeptical at first but the data quality surprised me. Way better than doing manual research.", name: "Mike S.", role: "Founder", source: "Message" },
              { stars: 5, text: "Simple and clean. I know exactly what's trending and what's saturated. Helps me focus on the right stuff.", name: "Rachel W.", role: "Solo Dev", source: "𝕏" },
              { stars: 5, text: "The niche roulette thing is fun lol. Spun it a few times and actually found something interesting.", name: "Kevin T.", role: "Builder", source: "𝕏" },
            ].map((t, i) => (
              <div key={`dup-${i}`} className="flex-shrink-0 w-[300px] md:w-[380px] p-5 md:p-6 rounded-2xl bg-white/[0.03] border border-white/10">
                <div className="flex gap-0.5 mb-3 text-yellow-400">
                  {Array.from({ length: t.stars }).map((_, j) => <span key={j}>★</span>)}
                </div>
                <p className="text-sm md:text-base text-white/80 mb-4 leading-relaxed">"{t.text}"</p>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-white text-sm">{t.name}</div>
                    <div className="text-xs text-white/40">{t.role}</div>
                  </div>
                  <div className="text-xs text-white/30">{t.source}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Affiliate Section */}
      <section className="py-12 md:py-16 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <Link href="/affiliate" className="block group">
            <div className="relative overflow-hidden rounded-2xl md:rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] p-6 sm:p-8 md:p-10 hover:border-[var(--primary)]/30 transition-all duration-500">
              {/* Background glow on hover - Desktop only */}
              {!isMobile && <div className="absolute top-0 right-0 w-60 h-60 bg-[var(--primary)]/10 blur-[100px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />}
              
              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4 md:gap-6">
                  <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-[var(--primary)]/10 border border-[var(--primary)]/20 flex items-center justify-center text-2xl md:text-3xl shrink-0 group-hover:scale-110 transition-transform duration-500">
                    💸
                  </div>
                  <div className="text-center md:text-left">
                    <h3 className="text-xl md:text-2xl font-bold text-white mb-1 group-hover:text-[var(--primary)] transition-colors">
                      Become an Affiliate
                    </h3>
                    <p className="text-sm md:text-base text-white/50">
                      Earn <span className="text-[var(--primary)] font-semibold">$10</span> for every sale you refer • 40% commission
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[var(--primary)]/10 border border-[var(--primary)]/20 text-[var(--primary)] font-medium text-sm group-hover:bg-[var(--primary)] group-hover:text-black transition-all duration-300">
                  Join Program
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 px-4 sm:px-6 text-center">
        <div className="max-w-4xl mx-auto relative">
          {/* Glow behind container - Desktop only */}
          {!isMobile && <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-to-r from-[var(--primary)]/10 to-[#6366F1]/10 blur-[100px] rounded-full pointer-events-none" />}

          <LiquidCard animate={isMobile ? "" : "reveal-up"} className="p-8 sm:p-12 md:p-16 rounded-[30px] md:rounded-[40px] border-white/10 overflow-hidden">
            <div className="relative z-10">
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold mb-4 md:mb-6">Start The Hunt Now</h2>
              <p className="text-sm sm:text-base md:text-lg text-[rgba(255,255,255,0.7)] mb-6 md:mb-10 max-w-md mx-auto">
                One email with 3 rising apps and 2 validated ideas. Every day.
              </p>

              <button
                onClick={() => setShowSubscribeModal(true)}
                className="btn-primary text-sm sm:text-base md:text-lg px-6 sm:px-10 md:px-12 py-3 sm:py-4 md:py-5 shadow-[0_0_30px_rgba(0,204,61,0.3)] hover:shadow-[0_0_60px_rgba(0,204,61,0.5)]"
              >
                Send Me Niches →
              </button>
              <p className="mt-4 md:mt-6 text-xs sm:text-sm text-[rgba(255,255,255,0.3)]">Takes 10 seconds</p>
            </div>
          </LiquidCard>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-white/5 reveal-base">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 opacity-50">
            <span className="font-bold text-sm tracking-widest">NICHES HUNTER</span>
          </div>
          <div className="flex gap-8 text-sm text-[rgba(255,255,255,0.4)]">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="https://x.com/nicheshunter" className="hover:text-white transition-colors">Twitter</a>
          </div>
          <div className="text-xs text-[rgba(255,255,255,0.2)]">
            © 2026 Niches Hunter. All rights reserved.
          </div>
        </div>
      </footer>

      {/* SUBSCRIBE MODAL */}
      {showSubscribeModal && (
        <div className={`fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 ${isMobile ? '' : 'backdrop-blur-xl'}`}
          onClick={() => setShowSubscribeModal(false)}
        >
          <LiquidCard
            enableReveal={false}
            className={`w-full max-w-lg p-1 !p-1 relative ${isMobile ? '' : 'animate-scale-up shadow-[0_0_150px_rgba(0,204,61,0.2)]'}`}
          >
            <div className="bg-[#050505] rounded-[22px] p-8 md:p-10 relative overflow-hidden" onClick={(e) => e.stopPropagation()}>
              {/* Close Button */}
              <button onClick={(e) => { e.stopPropagation(); setShowSubscribeModal(false); }} className="absolute top-5 right-5 text-white/20 hover:text-white text-xl transition-colors z-20">✕</button>

              {/* Radar Top Icon - Simplified on mobile */}
              <div className="relative flex justify-center mb-6">
                <div className="w-16 h-16 rounded-full border border-[var(--primary)]/20 flex items-center justify-center relative">
                  {!isMobile && <div className="w-16 h-16 absolute border border-[var(--primary)]/10 rounded-full animate-ping opacity-30" />}
                  <div className="w-1.5 h-1.5 bg-[var(--primary)] rounded-full shadow-[0_0_10px_#00CC3D]" />
                  {!isMobile && <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[var(--primary)]/5 rounded-full" />}
                  {!isMobile && <div className="w-[1px] h-8 bg-[var(--primary)]/30 absolute shadow-[0_0_5px_rgba(0,204,61,0.5)] origin-bottom animate-spin-slow" />}
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

              <form onSubmit={async (e) => { 
                e.preventDefault();
                setIsLoading(true);
                try {
                  const response = await fetch('/api/subscribe', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: modalEmail }),
                  });
                  const data = await response.json();
                  if (response.ok) {
                    setModalEmail("");
                    setShowSubscribeModal(false);
                    setShowModal(true);
                  } else {
                    alert(data.error || 'Something went wrong.');
                  }
                } catch (error) {
                  alert('Network error. Please try again.');
                } finally {
                  setIsLoading(false);
                }
              }} className="space-y-4">
                <input
                  type="email"
                  value={modalEmail}
                  onChange={(e) => setModalEmail(e.target.value)}
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
                  Join <span className="text-white/60 font-medium">71+ indie devs</span> already hunting niches. <br />
                  <span className="opacity-50">100% free • Unsubscribe anytime • No spam ever</span>
                </p>
              </div>
            </div>
          </LiquidCard>
        </div>
      )}

      {showModal && (
        <div className={`fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 ${isMobile ? '' : 'backdrop-blur-sm'}`} onClick={() => setShowModal(false)}>
          <LiquidCard enableReveal={false} className={`p-10 rounded-3xl text-center max-w-sm ${isMobile ? '' : 'shadow-[0_0_50px_rgba(0,204,61,0.2)]'}`}>
            <div className="text-6xl mb-6">🎉</div>
            <h3 className="text-2xl font-bold text-white mb-3">You're In!</h3>
            <p className="text-[rgba(255,255,255,0.6)] mb-4 text-lg">{message?.text}</p>
            <div className="bg-[rgba(255,255,255,0.05)] border border-white/10 rounded-xl p-4 mb-6">
              <p className="text-sm text-white/80 flex items-center justify-center gap-2">
                <span>📬</span>
                <span>Don't forget to check your <strong className="text-[var(--primary)]">spam folder</strong>!</span>
              </p>
            </div>
            <button onClick={() => setShowModal(false)} className="btn-primary w-full py-3">Awesome</button>
          </LiquidCard>
        </div>
      )}
    </main>
  );
}
