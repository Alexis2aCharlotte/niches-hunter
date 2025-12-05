"use client";

import { useState, useEffect } from "react";

export default function Home() {
  const [email, setEmail] = useState("");
  const [time, setTime] = useState("");
  const [currentDate, setCurrentDate] = useState("");
  const [activeBlip, setActiveBlip] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showSubscribeModal, setShowSubscribeModal] = useState(false);

  const niches = [
    { name: "Fitness", x: 25, y: 30 },
    { name: "Education", x: 72, y: 25 },
    { name: "Finance", x: 65, y: 68 },
    { name: "Gaming", x: 30, y: 72 },
    { name: "Health", x: 78, y: 52 },
    { name: "Productivity", x: 20, y: 50 },
  ];

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString("en-US", { hour12: false }));
      setCurrentDate(now.toLocaleDateString("en-US", { 
        month: 'short', 
        day: '2-digit', 
        year: 'numeric' 
      }).toUpperCase().replace(',', ''));
    };
    updateTime();
    const timeInt = setInterval(updateTime, 1000);

    const blipInt = setInterval(() => {
      setActiveBlip(prev => (prev + 1) % niches.length);
    }, 1500);

    return () => {
      clearInterval(timeInt);
      clearInterval(blipInt);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: data.message || 'Welcome aboard! 🎯' });
        setEmail("");
        setShowModal(true);
      } else {
        setMessage({ type: 'error', text: data.error || 'Something went wrong' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Network error. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const trendingApps = [
    { name: "GoWish", rank: "#32", category: "Lifestyle", market: "🇺🇸 US", trend: "+12%" },
    { name: "Call ID", rank: "#38", category: "Utility", market: "🇪🇺 EU", trend: "+8%" },
    { name: "Gauth", rank: "#63", category: "Education", market: "🇺🇸 US", trend: "+24%" },
    { name: "FocusFlow", rank: "#89", category: "Productivity", market: "🇺🇸 US", trend: "+31%" },
    { name: "PetTrack", rank: "#45", category: "Lifestyle", market: "🇪🇺 EU", trend: "+15%" },
  ];

  return (
    <main className="min-h-screen relative" style={{ background: '#0A0A0A' }}>
      {/* Background */}
      <div className="grid-bg" />
      <div className="scanlines" />

      {/* System info - Desktop only */}
      <div className="fixed top-6 left-6 z-50 font-mono text-xs space-y-1 hidden md:block" style={{ color: 'rgba(0, 255, 136, 0.4)' }}>
        <div>SYS.TIME: {time}</div>
        <div>STATUS: SCANNING</div>
      </div>

      <div className="fixed top-6 right-6 z-50 hidden md:block">
        <div className="status-online" style={{ color: '#00FF88' }}>LIVE DATA</div>
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-40" style={{ borderBottom: '1px solid rgba(0, 255, 136, 0.2)', background: 'rgba(10, 10, 10, 0.9)', backdropFilter: 'blur(8px)' }}>
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 md:gap-3">
            <div className="w-2.5 h-2.5 md:w-3 md:h-3 animate-pulse" style={{ background: '#00FF88' }} />
            <span className="font-mono text-xs md:text-sm tracking-[0.1em] md:tracking-[0.15em]" style={{ color: '#00FF88' }}>
              NICHES HUNTER
            </span>
          </div>

          <div className="hidden md:flex items-center gap-6 font-mono text-xs">
            <a href="#today" className="transition-colors" style={{ color: 'rgba(255,255,255,0.4)' }}>[TODAY]</a>
            <a href="#features" className="transition-colors" style={{ color: 'rgba(255,255,255,0.4)' }}>[FEATURES]</a>
            <a href="#pricing" className="transition-colors" style={{ color: 'rgba(255,255,255,0.4)' }}>[PRICING]</a>
          </div>

          <button onClick={() => setShowSubscribeModal(true)} className="btn-terminal text-xs py-2 px-3 md:px-4">
            START HUNTING
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-24 md:pt-28 pb-8 md:pb-12 px-4 md:px-6">
        <div className="max-w-7xl mx-auto">
          {/* RADAR - Mobile */}
          <div className="flex items-center justify-center mb-8 md:hidden">
            <div className="relative" style={{ width: '280px', height: '280px' }}>
              {[25, 50, 75, 100].map((size, i) => (
                <div
                  key={i}
                  className="absolute rounded-full"
                  style={{ 
                    width: `${size}%`, 
                    height: `${size}%`,
                    border: '1px solid rgba(0, 255, 136, 0.2)',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)'
                  }}
                />
              ))}
              <div className="absolute" style={{ width: '100%', height: '1px', background: 'rgba(0, 255, 136, 0.1)', top: '50%', left: 0 }} />
              <div className="absolute" style={{ width: '1px', height: '100%', background: 'rgba(0, 255, 136, 0.1)', top: 0, left: '50%' }} />
              <div className="radar-sweep" />
              <div className="radar-center" />

              {niches.map((niche, i) => {
                const isActive = activeBlip === i;
                return (
                  <div
                    key={i}
                    className="absolute"
                    style={{
                      left: `${niche.x}%`,
                      top: `${niche.y}%`,
                      transform: 'translate(-50%, -50%)',
                    }}
                  >
                    <div
                      className="transition-all duration-700 ease-out rounded-full"
                      style={{
                        width: isActive ? '12px' : '6px',
                        height: isActive ? '12px' : '6px',
                        backgroundColor: isActive ? '#00FF88' : 'rgba(0, 255, 136, 0.2)',
                        boxShadow: isActive ? '0 0 10px #00FF88, 0 0 20px #00FF88' : 'none',
                      }}
                    />
                    {isActive && (
                      <div 
                        className="absolute inset-0 rounded-full animate-ping"
                        style={{ backgroundColor: 'rgba(0, 255, 136, 0.3)', animationDuration: '1s' }}
                      />
                    )}
                    <div
                      className="absolute left-5 top-1/2 whitespace-nowrap transition-all duration-500 ease-out"
                      style={{
                        opacity: isActive ? 1 : 0,
                        transform: `translateY(-50%) translateX(${isActive ? '0' : '-10px'})`,
                      }}
                    >
                      <div className="font-mono text-[10px] font-bold px-2 py-1" style={{ background: '#00FF88', color: '#000' }}>
                        {niche.name}
                      </div>
                    </div>
                  </div>
                );
              })}

            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left - Content */}
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 md:px-4 py-2 rounded-full mb-4 md:mb-6" style={{ border: '1px solid rgba(0, 255, 136, 0.3)', background: 'rgba(0, 255, 136, 0.05)' }}>
                <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#00FF88' }} />
                <span className="font-mono text-[10px] md:text-xs" style={{ color: '#00FF88' }}>2-3 NEW NICHES IN YOUR INBOX DAILY</span>
              </div>

              <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold leading-[1.1] mb-4 md:mb-6">
                <span style={{ color: '#FFFFFF' }}>Spot </span>
                <span className="neon-text">Profitable iOS Niches</span>
                <span style={{ color: '#FFFFFF' }}> Before Anyone Else</span>
              </h1>

              <p className="text-base md:text-lg mb-6" style={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                Every day, get <span style={{ color: '#00FF88' }}>trending apps</span>, <span style={{ color: '#00FF88' }}>market insights</span> (US vs EU), 
                and <span style={{ color: '#00FF88' }}>2-3 niches</span> with full analysis.
              </p>

              {/* EMAIL SUBSCRIBE */}
              <div id="subscribe" className="mb-6">
                <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    disabled={isLoading}
                    className="terminal-input flex-1 py-4 text-sm md:text-base disabled:opacity-50"
                    style={{ color: '#00FF88' }}
                  />
                  <button 
                    type="submit" 
                    disabled={isLoading}
                    className="btn-terminal py-4 px-6 neon-glow whitespace-nowrap text-sm md:text-base disabled:opacity-50"
                  >
                    {isLoading ? 'CONNECTING...' : 'GET MY FIRST NICHE →'}
                  </button>
                </form>
                
                {/* Message feedback */}
                {message && (
                  <div 
                    className="mt-3 font-mono text-sm py-2 px-4 rounded"
                    style={{ 
                      background: message.type === 'success' ? 'rgba(0, 255, 136, 0.1)' : 'rgba(255, 0, 0, 0.1)',
                      color: message.type === 'success' ? '#00FF88' : '#FF6B6B',
                      border: `1px solid ${message.type === 'success' ? 'rgba(0, 255, 136, 0.3)' : 'rgba(255, 0, 0, 0.3)'}`
                    }}
                  >
                    {message.text}
                  </div>
                )}
                
                <div className="flex items-center justify-center lg:justify-start gap-3 md:gap-4 mt-3 font-mono text-[10px] md:text-xs" style={{ color: 'rgba(255, 255, 255, 0.4)' }}>
                  <span>✓ Instant first brief</span>
                  <span>✓ 2,100+ hunters</span>
                  <span>✓ 100% free</span>
                </div>
              </div>
            </div>

            {/* Right - RADAR Desktop */}
            <div className="hidden lg:flex items-center justify-center">
              <div className="radar-container relative">
                {[25, 50, 75, 100].map((size, i) => (
                  <div
                    key={i}
                    className="radar-circle"
                    style={{ width: `${size}%`, height: `${size}%` }}
                  />
                ))}
                <div className="radar-line radar-line-h" />
                <div className="radar-line radar-line-v" />
                <div className="radar-sweep" />
                <div className="radar-center" />

                {niches.map((niche, i) => {
                  const isActive = activeBlip === i;
                  return (
                    <div
                      key={i}
                      className="absolute"
                      style={{
                        left: `${niche.x}%`,
                        top: `${niche.y}%`,
                        transform: 'translate(-50%, -50%)',
                      }}
                    >
                      <div
                        className="transition-all duration-700 ease-out rounded-full"
                        style={{
                          width: isActive ? '14px' : '8px',
                          height: isActive ? '14px' : '8px',
                          backgroundColor: isActive ? '#00FF88' : 'rgba(0, 255, 136, 0.2)',
                          boxShadow: isActive ? '0 0 10px #00FF88, 0 0 20px #00FF88, 0 0 30px #00FF88' : 'none',
                        }}
                      />
                      {isActive && (
                        <div 
                          className="absolute inset-0 rounded-full animate-ping"
                          style={{ backgroundColor: 'rgba(0, 255, 136, 0.3)', animationDuration: '1s' }}
                        />
                      )}
                      <div
                        className="absolute left-6 top-1/2 whitespace-nowrap transition-all duration-500 ease-out"
                        style={{
                          opacity: isActive ? 1 : 0,
                          transform: `translateY(-50%) translateX(${isActive ? '0' : '-10px'})`,
                        }}
                      >
                        <div className="flex items-center gap-2">
                          <div className="h-px transition-all duration-500" style={{ width: isActive ? '20px' : '0px', background: '#00FF88' }} />
                          <div className="font-mono text-xs font-bold px-3 py-1.5" style={{ background: '#00FF88', color: '#000', boxShadow: '0 0 20px rgba(0, 255, 136, 0.3)' }}>
                            {niche.name}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}

                <div className="absolute -top-6 left-1/2 -translate-x-1/2 font-mono text-xs" style={{ color: 'rgba(0, 255, 136, 0.4)' }}>N</div>
                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 font-mono text-xs" style={{ color: 'rgba(0, 255, 136, 0.4)' }}>S</div>
                <div className="absolute top-1/2 -left-6 -translate-y-1/2 font-mono text-xs" style={{ color: 'rgba(0, 255, 136, 0.4)' }}>W</div>
                <div className="absolute top-1/2 -right-6 -translate-y-1/2 font-mono text-xs" style={{ color: 'rgba(0, 255, 136, 0.4)' }}>E</div>

                <div className="absolute -bottom-12 left-0 right-0 text-center">
                  <span className="font-mono text-xs" style={{ color: 'rgba(0, 255, 136, 0.5)' }}>
                    DETECTED: <span style={{ color: '#00FF88' }}>{niches[activeBlip].name}</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3 PILLARS */}
      <section className="py-10 md:py-14 px-4 md:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-3 gap-3 md:gap-6">
            {[
              { icon: "📈", title: "Trending Apps", desc: "5 apps daily" },
              { icon: "🌍", title: "US vs EU", desc: "Market intel" },
              { icon: "💎", title: "Niches", desc: "2-3 per day" },
            ].map((pillar, i) => (
              <div key={i} className="stat-box text-center py-6 md:py-8 px-2 md:px-4">
                <div className="text-3xl md:text-4xl mb-3 md:mb-4">{pillar.icon}</div>
                <h3 className="font-mono font-bold text-sm md:text-lg mb-1 md:mb-2" style={{ color: '#00FF88' }}>{pillar.title}</h3>
                <p className="text-xs md:text-sm" style={{ color: 'rgba(255, 255, 255, 0.5)' }}>{pillar.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TODAY'S BRIEF - Preview */}
      <section id="today" className="py-12 md:py-16 px-4 md:px-6" style={{ borderTop: '1px solid rgba(0, 255, 136, 0.2)', borderBottom: '1px solid rgba(0, 255, 136, 0.2)', background: 'rgba(0, 255, 136, 0.02)' }}>
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4 mb-6 md:mb-8">
            <div>
              <div className="font-mono text-[10px] md:text-xs mb-2" style={{ color: 'rgba(0, 255, 136, 0.5)' }}>// PREVIEW</div>
              <h2 className="text-xl sm:text-2xl md:text-4xl font-bold">
                <span style={{ color: '#FFFFFF' }}>Today's </span>
                <span className="neon-text">Brief</span>
              </h2>
            </div>
            <div className="font-mono text-[10px] md:text-xs sm:text-right flex-shrink-0" style={{ color: 'rgba(255, 255, 255, 0.3)' }}>
              <div className="flex sm:block gap-2">
                <span>{currentDate || 'LOADING...'}</span>
                <span className="sm:hidden">•</span>
                <span style={{ color: '#00FF88' }}>LIVE</span>
              </div>
            </div>
          </div>

          {/* Newsletter Preview */}
          <div className="terminal-card overflow-hidden">
            <div className="terminal-header">
              <div className="terminal-dot bg-red-500/70" />
              <div className="terminal-dot bg-yellow-500/70" />
              <div className="terminal-dot bg-green-500/70" />
              <span className="font-mono text-[10px] md:text-xs ml-4" style={{ color: 'rgba(255, 255, 255, 0.3)' }}>daily_brief.email</span>
            </div>

            <div className="p-4 md:p-8">
              {/* Key Insight */}
              <div className="mb-6 md:mb-8 p-4 md:p-5" style={{ borderLeft: '3px solid #00FF88', background: 'rgba(0, 255, 136, 0.05)' }}>
                <div className="font-mono text-xs md:text-sm mb-2" style={{ color: '#00FF88' }}>💡 KEY INSIGHT OF THE DAY</div>
                <p className="text-sm md:text-base leading-relaxed" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                  <strong style={{ color: '#FFFFFF' }}>US-led growth is strong</strong> — apps like GoWish performing well domestically with limited EU presence
                  <span style={{ color: '#00FF88' }}> = expansion opportunity.</span> Education apps seeing <span style={{ color: '#00FF88' }}>+31% surge</span> this week.
                </p>
              </div>


              {/* Trending Apps */}
              <div className="mb-6 md:mb-8">
                <div className="font-mono text-xs md:text-sm mb-3 md:mb-4" style={{ color: 'rgba(0, 255, 136, 0.5)' }}>📊 TOP 5 TRENDING TODAY</div>
                <div className="space-y-1 md:space-y-2">
                  <div className="hidden sm:grid grid-cols-5 gap-2 py-3 font-mono text-xs md:text-sm" style={{ color: 'rgba(255, 255, 255, 0.4)', borderBottom: '1px solid rgba(0, 255, 136, 0.15)' }}>
                    <span>APP</span>
                    <span>CATEGORY</span>
                    <span>MARKET</span>
                    <span className="text-center">RANK</span>
                    <span className="text-right">TREND</span>
                  </div>
                  {trendingApps.map((app, i) => (
                    <div key={i} className="flex flex-col sm:grid sm:grid-cols-5 gap-1 sm:gap-2 py-3 md:py-4" style={{ borderBottom: '1px solid rgba(0, 255, 136, 0.1)' }}>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs w-5" style={{ color: 'rgba(0, 255, 136, 0.4)' }}>#{i+1}</span>
                        <span className="font-mono text-sm md:text-base font-semibold" style={{ color: '#FFFFFF' }}>{app.name}</span>
                      </div>
                      <span className="font-mono text-xs md:text-sm hidden sm:block self-center" style={{ color: 'rgba(255, 255, 255, 0.5)' }}>{app.category}</span>
                      <span className="text-xs md:text-sm hidden sm:block self-center">{app.market}</span>
                      <span className="font-mono text-xs md:text-sm hidden sm:block text-center self-center" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>{app.rank}</span>
                      <div className="flex sm:justify-end items-center gap-2 sm:gap-0">
                        <span className="sm:hidden font-mono text-xs" style={{ color: 'rgba(255, 255, 255, 0.4)' }}>{app.category} • {app.market}</span>
                        <span className="font-mono text-xs md:text-sm font-bold" style={{ color: '#00FF88' }}>{app.trend}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Niche to Explore */}
              <div className="p-4 md:p-6 mb-4 md:mb-6" style={{ border: '1px solid rgba(0, 255, 136, 0.3)', background: 'rgba(0, 0, 0, 0.3)' }}>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
                  <div className="font-mono text-xs md:text-sm" style={{ color: '#00FF88' }}>🎯 NICHE #1 — HIGH POTENTIAL</div>
                  <div className="flex gap-2">
                    <span className="font-mono text-[10px] md:text-xs px-2 py-1" style={{ background: 'rgba(0, 255, 136, 0.15)', color: '#00FF88' }}>LOW COMPETITION</span>
                    <span className="font-mono text-[10px] md:text-xs px-2 py-1" style={{ background: 'rgba(0, 255, 136, 0.15)', color: '#00FF88' }}>TRENDING</span>
                  </div>
                </div>
                <h4 className="text-base md:text-xl font-bold mb-2" style={{ color: '#FFFFFF' }}>AI-powered Education Tools</h4>
                <p className="text-sm md:text-base mb-4 leading-relaxed" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                  Rising demand for personalized study aids. Apps like Gauth (+24%) show high engagement with scalable subscription models. 
                  EU market significantly underserved — only 12% of US presence.
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4 font-mono text-xs md:text-sm">
                  <div className="p-3" style={{ background: 'rgba(0, 255, 136, 0.05)' }}>
                    <div style={{ color: 'rgba(255, 255, 255, 0.5)' }}>Competition</div>
                    <div className="font-semibold mt-1" style={{ color: '#00FF88' }}>Low (3/10)</div>
                  </div>
                  <div className="p-3" style={{ background: 'rgba(0, 255, 136, 0.05)' }}>
                    <div style={{ color: 'rgba(255, 255, 255, 0.5)' }}>Potential</div>
                    <div className="font-semibold mt-1" style={{ color: '#00FF88' }}>High (8/10)</div>
                  </div>
                  <div className="p-3" style={{ background: 'rgba(0, 255, 136, 0.05)' }}>
                    <div style={{ color: 'rgba(255, 255, 255, 0.5)' }}>Avg Revenue</div>
                    <div className="font-semibold mt-1" style={{ color: '#00FF88' }}>$8.2K/mo</div>
                  </div>
                  <div className="p-3" style={{ background: 'rgba(0, 255, 136, 0.05)' }}>
                    <div style={{ color: 'rgba(255, 255, 255, 0.5)' }}>Best Market</div>
                    <div className="font-semibold mt-1" style={{ color: '#00FF88' }}>🇪🇺 EU</div>
                  </div>
                </div>
              </div>

              {/* Second Niche Preview */}
              <div className="p-4 md:p-6 mb-4 md:mb-6" style={{ border: '1px solid rgba(0, 255, 136, 0.15)', background: 'rgba(0, 0, 0, 0.2)' }}>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
                  <div className="font-mono text-xs md:text-sm" style={{ color: 'rgba(0, 255, 136, 0.7)' }}>🎯 NICHE #2 — GROWING FAST</div>
                  <div className="flex gap-2">
                    <span className="font-mono text-[10px] md:text-xs px-2 py-1" style={{ background: 'rgba(0, 255, 136, 0.1)', color: 'rgba(0, 255, 136, 0.7)' }}>MEDIUM COMPETITION</span>
                  </div>
                </div>
                <h4 className="text-base md:text-xl font-bold mb-2" style={{ color: '#FFFFFF' }}>Pet Care & Tracking Apps</h4>
                <p className="text-sm md:text-base leading-relaxed" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                  Health monitoring and activity tracking for pets. PetTrack showing strong EU traction (+15%). 
                  Premium subscriptions with 68% retention rate.
                </p>
              </div>

              {/* CTA */}
              <div className="relative pt-5 md:pt-6" style={{ borderTop: '1px solid rgba(0, 255, 136, 0.1)' }}>
                <div className="blur-sm opacity-50 mb-4">
                  <div className="font-mono text-xs md:text-sm mb-1" style={{ color: 'rgba(255, 255, 255, 0.3)' }}>🎯 NICHE #3 — Sleep & Wellness tracking...</div>
                  <div className="font-mono text-xs md:text-sm" style={{ color: 'rgba(255, 255, 255, 0.2)' }}>+ Full revenue breakdown, keyword analysis, competitor deep-dive...</div>
                </div>
                <div className="flex items-center justify-center">
                  <button onClick={() => setShowSubscribeModal(true)} className="btn-terminal text-sm md:text-base py-3 px-8">
                    UNLOCK ALL NICHES FREE →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-12 md:py-20 px-4 md:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8 md:mb-12">
            <div className="font-mono text-[10px] md:text-xs mb-2" style={{ color: 'rgba(0, 255, 136, 0.5)' }}>// WHAT YOU GET</div>
            <h2 className="text-2xl md:text-4xl font-bold">
              <span style={{ color: '#FFFFFF' }}>Everything to </span>
              <span className="neon-text">Find Your Niche</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-3 md:gap-4">
            {[
              { num: "01", title: "Daily Trending Apps", desc: "5 rising apps with rankings and growth metrics." },
              { num: "02", title: "Market Intelligence", desc: "US vs EU comparison. Spot regional gaps." },
              { num: "03", title: "Niche Deep Dives", desc: "2-3 analyzed niches per day with potential." },
              { num: "04", title: "Actionable Insights", desc: "Recommendations you can act on today." },
            ].map((feature, i) => (
              <div key={i} className="feature-card">
                <span className="feature-number">{feature.num}</span>
                <h3 className="text-sm md:text-lg font-bold mb-1 md:mb-2 font-mono" style={{ color: '#00FF88' }}>{feature.title}</h3>
                <p className="text-xs md:text-sm" style={{ color: 'rgba(255, 255, 255, 0.4)' }}>{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-8 md:py-12 px-4 md:px-6" style={{ borderTop: '1px solid rgba(0, 255, 136, 0.2)', borderBottom: '1px solid rgba(0, 255, 136, 0.2)' }}>
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-4 gap-2 md:gap-4">
            {[
              { value: "2.1K+", label: "SUBS" },
              { value: "50K+", label: "APPS" },
              { value: "Daily", label: "UPDATES" },
              { value: "94%", label: "OPEN" },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="font-mono text-lg md:text-3xl font-bold mb-1" style={{ color: '#00FF88' }}>{stat.value}</div>
                <div className="font-mono text-[8px] md:text-xs" style={{ color: 'rgba(255, 255, 255, 0.3)' }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-12 md:py-20 px-4 md:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8 md:mb-12">
            <div className="font-mono text-[10px] md:text-xs mb-2" style={{ color: 'rgba(0, 255, 136, 0.5)' }}>// PRICING</div>
            <h2 className="text-2xl md:text-4xl font-bold mb-2 md:mb-4">
              <span style={{ color: '#FFFFFF' }}>Start Free, </span>
              <span className="neon-text">Upgrade for More</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-4 md:gap-6">
            {/* Free */}
            <div className="terminal-card p-5 md:p-8 relative">
              <div className="corner-decoration corner-tl" />
              <div className="corner-decoration corner-tr" />
              <div className="corner-decoration corner-bl" />
              <div className="corner-decoration corner-br" />

              <div className="font-mono text-[10px] md:text-xs mb-2 md:mb-3" style={{ color: 'rgba(0, 255, 136, 0.4)' }}>FREE FOREVER</div>
              <h3 className="text-xl md:text-2xl font-bold mb-2 font-mono" style={{ color: '#FFFFFF' }}>Daily Newsletter</h3>
              <div className="font-mono text-3xl md:text-4xl mb-4 md:mb-6" style={{ color: '#00FF88' }}>
                $0<span className="text-sm md:text-base" style={{ color: 'rgba(255, 255, 255, 0.3)' }}>/mo</span>
              </div>

              <ul className="space-y-2 md:space-y-3 mb-6 md:mb-8 font-mono text-xs md:text-sm">
                {["Daily insights", "5 trending apps/day", "2-3 niches/day", "US vs EU intel"].map((item, i) => (
                  <li key={i} className="flex items-center gap-2 md:gap-3" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                    <span style={{ color: '#00FF88' }}>✓</span>
                    {item}
                  </li>
                ))}
              </ul>

              <button onClick={() => setShowSubscribeModal(true)} className="btn-outline w-full text-center text-xs md:text-sm">
                GET DAILY NICHES →
              </button>
            </div>

            {/* Pro */}
            <div className="terminal-card overflow-visible neon-border p-5 md:p-8 relative mt-6 md:mt-0">
              <div className="corner-decoration corner-tl" />
              <div className="corner-decoration corner-tr" />
              <div className="corner-decoration corner-bl" />
              <div className="corner-decoration corner-br" />

              <div className="absolute -top-3 left-1/2 -translate-x-1/2 font-mono text-[10px] font-bold px-3 py-1 z-10" style={{ background: '#00FF88', color: '#000' }}>
                COMING SOON
              </div>

              <div className="font-mono text-[10px] md:text-xs mb-2 md:mb-3 mt-2 md:mt-0" style={{ color: 'rgba(0, 255, 136, 0.4)' }}>PRO ACCESS</div>
              <h3 className="text-xl md:text-2xl font-bold mb-2 font-mono" style={{ color: '#FFFFFF' }}>Hunter Dashboard</h3>
              <div className="font-mono text-3xl md:text-4xl neon-text mb-4 md:mb-6">
                $10<span className="text-sm md:text-base" style={{ color: 'rgba(255, 255, 255, 0.3)' }}>/mo</span>
              </div>

              <ul className="space-y-2 md:space-y-3 mb-6 md:mb-8 font-mono text-xs md:text-sm">
                {["Everything in Free", "Full dashboard", "Niche database", "Revenue estimates", "Custom alerts"].map((item, i) => (
                  <li key={i} className="flex items-center gap-2 md:gap-3" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                    <span style={{ color: '#00FF88' }}>✓</span>
                    {item}
                  </li>
                ))}
              </ul>

              <button className="btn-terminal w-full text-xs md:text-sm neon-glow" disabled>
                COMING SOON
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-12 md:py-20 px-4 md:px-6" style={{ borderTop: '1px solid rgba(0, 255, 136, 0.2)' }}>
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl md:text-4xl font-bold mb-3 md:mb-4">
            <span style={{ color: '#FFFFFF' }}>Your Next </span>
            <span className="neon-text">Profitable App</span>
            <span style={{ color: '#FFFFFF' }}> Starts Here</span>
          </h2>
          <p className="mb-6 md:mb-8" style={{ color: 'rgba(255, 255, 255, 0.4)' }}>
            Get 2-3 validated niches in your inbox every morning. Like 2,100+ indie devs already do.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              disabled={isLoading}
              className="terminal-input flex-1 py-4 disabled:opacity-50"
              style={{ color: '#00FF88' }}
            />
            <button 
              type="submit" 
              disabled={isLoading}
              className="btn-terminal py-4 px-6 md:px-8 neon-glow disabled:opacity-50"
            >
              {isLoading ? 'CONNECTING...' : 'SEND ME NICHES →'}
            </button>
          </form>
          
          {/* Message feedback for bottom form */}
          {message && (
            <div 
              className="mt-4 font-mono text-sm py-2 px-4 rounded inline-block"
              style={{ 
                background: message.type === 'success' ? 'rgba(0, 255, 136, 0.1)' : 'rgba(255, 0, 0, 0.1)',
                color: message.type === 'success' ? '#00FF88' : '#FF6B6B',
                border: `1px solid ${message.type === 'success' ? 'rgba(0, 255, 136, 0.3)' : 'rgba(255, 0, 0, 0.3)'}`
              }}
            >
              {message.text}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 md:py-8 px-4 md:px-6" style={{ borderTop: '1px solid rgba(0, 255, 136, 0.2)' }}>
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2" style={{ background: '#00FF88' }} />
            <span className="font-mono text-xs" style={{ color: 'rgba(255, 255, 255, 0.3)' }}>NICHES HUNTER</span>
          </div>

          <div className="flex gap-4 md:gap-6 font-mono text-xs" style={{ color: 'rgba(255, 255, 255, 0.3)' }}>
            <a href="#" className="hover:text-[#00FF88] transition-colors">PRIVACY</a>
            <a href="#" className="hover:text-[#00FF88] transition-colors">TERMS</a>
            <a href="#" className="hover:text-[#00FF88] transition-colors">CONTACT</a>
          </div>

          <div className="font-mono text-xs" style={{ color: 'rgba(255, 255, 255, 0.3)' }}>© 2024</div>
        </div>
      </footer>

      {/* SUBSCRIBE MODAL - Powerful CTA */}
      {showSubscribeModal && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          style={{ background: 'rgba(0, 0, 0, 0.95)', backdropFilter: 'blur(20px)' }}
          onClick={() => setShowSubscribeModal(false)}
        >
          <div 
            className="relative w-full max-w-lg p-6 md:p-10"
            style={{ 
              background: 'linear-gradient(180deg, #0A0A0A 0%, #0D1A0F 100%)', 
              border: '2px solid #00FF88',
              boxShadow: '0 0 100px rgba(0, 255, 136, 0.4), inset 0 0 60px rgba(0, 255, 136, 0.05)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Corner decorations */}
            <div className="corner-decoration corner-tl" style={{ width: '30px', height: '30px' }} />
            <div className="corner-decoration corner-tr" style={{ width: '30px', height: '30px' }} />
            <div className="corner-decoration corner-bl" style={{ width: '30px', height: '30px' }} />
            <div className="corner-decoration corner-br" style={{ width: '30px', height: '30px' }} />

            {/* Close button */}
            <button 
              onClick={() => setShowSubscribeModal(false)}
              className="absolute top-4 right-4 font-mono text-xl transition-colors hover:text-[#00FF88]"
              style={{ color: 'rgba(255, 255, 255, 0.4)' }}
            >
              ✕
            </button>

            {/* Animated radar icon */}
            <div className="flex justify-center mb-6">
              <div className="relative w-16 h-16">
                <div className="absolute inset-0 rounded-full" style={{ border: '2px solid rgba(0, 255, 136, 0.3)' }} />
                <div className="absolute inset-2 rounded-full" style={{ border: '1px solid rgba(0, 255, 136, 0.2)' }} />
                <div className="absolute top-1/2 left-1/2 w-3 h-3 -translate-x-1/2 -translate-y-1/2 rounded-full animate-pulse" style={{ background: '#00FF88', boxShadow: '0 0 20px #00FF88' }} />
                <div className="absolute top-1/2 left-1/2 w-1/2 h-0.5 origin-left animate-spin" style={{ background: 'linear-gradient(90deg, #00FF88, transparent)', animationDuration: '2s' }} />
              </div>
            </div>

            {/* Headline */}
            <div className="text-center mb-6">
              <div className="font-mono text-[10px] md:text-xs mb-3 tracking-widest" style={{ color: '#00FF88' }}>
                🎯 FREE DAILY INTEL
              </div>
              <h3 className="text-2xl md:text-3xl font-bold leading-tight mb-3">
                <span style={{ color: '#FFFFFF' }}>Spot </span>
                <span className="neon-text">Profitable iOS Niches</span>
                <span style={{ color: '#FFFFFF' }}> Before Anyone Else</span>
              </h3>
              <p className="text-sm md:text-base" style={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                Get your first niche analysis <span style={{ color: '#00FF88' }}>instantly</span> in your inbox.
              </p>
            </div>

            {/* What you get */}
            <div className="grid grid-cols-3 gap-2 mb-6">
              {[
                { icon: "📈", text: "5 trending apps" },
                { icon: "💎", text: "2-3 niches" },
                { icon: "🌍", text: "US vs EU data" },
              ].map((item, i) => (
                <div key={i} className="text-center py-3 px-2" style={{ background: 'rgba(0, 255, 136, 0.05)', border: '1px solid rgba(0, 255, 136, 0.15)' }}>
                  <div className="text-lg mb-1">{item.icon}</div>
                  <div className="font-mono text-[9px] md:text-[10px]" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>{item.text}</div>
                </div>
              ))}
            </div>

            {/* Form */}
            <form onSubmit={(e) => {
              handleSubmit(e);
              setShowSubscribeModal(false);
            }} className="space-y-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                disabled={isLoading}
                className="terminal-input w-full py-4 text-sm md:text-base text-center disabled:opacity-50"
                style={{ color: '#00FF88', background: 'rgba(0, 255, 136, 0.08)', border: '1px solid rgba(0, 255, 136, 0.4)' }}
              />
              <button 
                type="submit" 
                disabled={isLoading}
                className="btn-terminal w-full py-4 text-sm md:text-base neon-glow disabled:opacity-50 font-bold"
                style={{ boxShadow: '0 0 30px rgba(0, 255, 136, 0.5)' }}
              >
                {isLoading ? 'CONNECTING...' : '🚀 SEND ME NICHES NOW'}
              </button>
            </form>

            {/* Social proof */}
            <div className="mt-5 text-center">
              <div className="flex items-center justify-center gap-1 mb-2">
                {[1,2,3,4,5].map((_, i) => (
                  <span key={i} style={{ color: '#00FF88' }}>★</span>
                ))}
              </div>
              <p className="font-mono text-[10px] md:text-xs" style={{ color: 'rgba(255, 255, 255, 0.4)' }}>
                Join <span style={{ color: '#00FF88' }}>2,100+ indie devs</span> already hunting niches
              </p>
            </div>

            {/* Guarantee */}
            <div className="mt-4 text-center font-mono text-[10px]" style={{ color: 'rgba(255, 255, 255, 0.3)' }}>
              100% free • Unsubscribe anytime • No spam ever
            </div>
          </div>
        </div>
      )}

      {/* SUCCESS MODAL */}
      {showModal && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          style={{ background: 'rgba(0, 0, 0, 0.9)', backdropFilter: 'blur(10px)' }}
          onClick={() => setShowModal(false)}
        >
          <div 
            className="relative w-full max-w-md p-6 md:p-8"
            style={{ 
              background: '#0A0A0A', 
              border: '1px solid #00FF88',
              boxShadow: '0 0 60px rgba(0, 255, 136, 0.3)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Corner decorations */}
            <div className="corner-decoration corner-tl" />
            <div className="corner-decoration corner-tr" />
            <div className="corner-decoration corner-bl" />
            <div className="corner-decoration corner-br" />

            {/* Close button */}
            <button 
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 font-mono text-xl transition-colors"
              style={{ color: 'rgba(255, 255, 255, 0.4)' }}
            >
              ✕
            </button>

            {/* Success icon */}
            <div className="text-center mb-6">
              <div 
                className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4"
                style={{ background: 'rgba(0, 255, 136, 0.1)', border: '2px solid #00FF88' }}
              >
                <span className="text-3xl">✓</span>
              </div>
              <h3 className="text-2xl md:text-3xl font-bold" style={{ color: '#00FF88' }}>
                You're In! 🎯
              </h3>
            </div>

            {/* Check inbox message */}
            <div 
              className="p-4 mb-6 text-center"
              style={{ background: 'rgba(0, 255, 136, 0.05)', border: '1px solid rgba(0, 255, 136, 0.2)' }}
            >
              <p className="font-mono text-sm mb-2" style={{ color: '#FFFFFF' }}>
                📬 Check your inbox (and spam folder!)
              </p>
              <p className="text-xs" style={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                Your welcome email + first newsletter are on the way.
              </p>
            </div>

            {/* PRO upgrade */}
            <div 
              className="p-4 text-center"
              style={{ background: 'rgba(0, 0, 0, 0.5)', border: '1px solid rgba(0, 255, 136, 0.3)' }}
            >
              <div className="font-mono text-[10px] mb-2" style={{ color: 'rgba(0, 255, 136, 0.5)' }}>
                🚀 WANT MORE?
              </div>
              <h4 className="font-bold text-lg mb-2" style={{ color: '#FFFFFF' }}>
                Upgrade to Hunter Pro
              </h4>
              <div className="font-mono text-2xl mb-3" style={{ color: '#00FF88' }}>
                $10<span className="text-sm" style={{ color: 'rgba(255, 255, 255, 0.4)' }}>/month</span>
              </div>
              <ul className="text-left space-y-2 mb-4 font-mono text-xs" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                <li className="flex items-center gap-2">
                  <span style={{ color: '#00FF88' }}>✓</span> Full niche database
                </li>
                <li className="flex items-center gap-2">
                  <span style={{ color: '#00FF88' }}>✓</span> Revenue estimates
                </li>
                <li className="flex items-center gap-2">
                  <span style={{ color: '#00FF88' }}>✓</span> Custom alerts
                </li>
                <li className="flex items-center gap-2">
                  <span style={{ color: '#00FF88' }}>✓</span> Priority support
                </li>
              </ul>
              <button 
                className="w-full py-3 font-mono text-sm font-bold"
                style={{ background: 'rgba(0, 255, 136, 0.1)', border: '1px solid #00FF88', color: '#00FF88' }}
                disabled
              >
                COMING SOON
              </button>
            </div>

            {/* Continue button */}
            <button 
              onClick={() => setShowModal(false)}
              className="w-full mt-4 py-3 font-mono text-sm transition-colors"
              style={{ color: 'rgba(255, 255, 255, 0.4)' }}
            >
              Continue to site →
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
