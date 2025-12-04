"use client";

import { useState, useEffect } from "react";

export default function Home() {
  const [email, setEmail] = useState("");
  const [time, setTime] = useState("");
  const [activeBlip, setActiveBlip] = useState(0);

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
      setTime(new Date().toLocaleTimeString("en-US", { hour12: false }));
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Welcome aboard! Check your inbox 🎯");
    setEmail("");
  };

  const trendingApps = [
    { name: "GoWish", rank: "#32", category: "Lifestyle", market: "🇺🇸 US", trend: "+12%" },
    { name: "Call ID", rank: "#38", category: "Utility", market: "🇪🇺 EU", trend: "+8%" },
    { name: "Gauth", rank: "#63", category: "Education", market: "🇺🇸 US", trend: "+24%" },
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

          <a href="#subscribe" className="btn-terminal text-xs py-2 px-3 md:px-4">
            GET ACCESS
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-24 md:pt-28 pb-8 md:pb-12 px-4 md:px-6">
        <div className="max-w-7xl mx-auto">
          {/* RADAR - Now visible on mobile too */}
          <div className="flex items-center justify-center mb-8 md:hidden">
            <div className="relative" style={{ width: '280px', height: '280px' }}>
              {/* Circles */}
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

              {/* Cross lines */}
              <div className="absolute" style={{ width: '100%', height: '1px', background: 'rgba(0, 255, 136, 0.1)', top: '50%', left: 0 }} />
              <div className="absolute" style={{ width: '1px', height: '100%', background: 'rgba(0, 255, 136, 0.1)', top: 0, left: '50%' }} />

              {/* Sweep */}
              <div className="radar-sweep" />

              {/* Center */}
              <div className="radar-center" />

              {/* Niche Blips - Mobile */}
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

              {/* Status text mobile */}
              <div className="absolute -bottom-8 left-0 right-0 text-center">
                <span className="font-mono text-[10px]" style={{ color: 'rgba(0, 255, 136, 0.5)' }}>
                  DETECTED: <span style={{ color: '#00FF88' }}>{niches[activeBlip].name}</span>
                </span>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left - Content */}
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 md:px-4 py-2 rounded-full mb-4 md:mb-6" style={{ border: '1px solid rgba(0, 255, 136, 0.3)', background: 'rgba(0, 255, 136, 0.05)' }}>
                <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#00FF88' }} />
                <span className="font-mono text-[10px] md:text-xs" style={{ color: '#00FF88' }}>DAILY NEWSLETTER - FREE</span>
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
                    className="terminal-input flex-1 py-4 text-sm md:text-base"
                    style={{ color: '#00FF88' }}
                  />
                  <button type="submit" className="btn-terminal py-4 px-6 neon-glow whitespace-nowrap text-sm md:text-base">
                    SUBSCRIBE FREE →
                  </button>
                </form>
                <div className="flex items-center justify-center lg:justify-start gap-3 md:gap-4 mt-3 font-mono text-[10px] md:text-xs" style={{ color: 'rgba(255, 255, 255, 0.4)' }}>
                  <span>✓ Daily insights</span>
                  <span>✓ 2,100+ devs</span>
                  <span>✓ Free</span>
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
      <section className="py-8 md:py-12 px-4 md:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-3 gap-2 md:gap-4">
            {[
              { icon: "📈", title: "Trending Apps", desc: "5 apps daily" },
              { icon: "🌍", title: "US vs EU", desc: "Market intel" },
              { icon: "💎", title: "Niches", desc: "2-3 per day" },
            ].map((pillar, i) => (
              <div key={i} className="stat-box text-center py-4 md:py-6">
                <div className="text-2xl md:text-3xl mb-2 md:mb-3">{pillar.icon}</div>
                <h3 className="font-mono font-bold text-[10px] md:text-sm mb-1" style={{ color: '#00FF88' }}>{pillar.title}</h3>
                <p className="text-[9px] md:text-xs" style={{ color: 'rgba(255, 255, 255, 0.4)' }}>{pillar.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TODAY'S BRIEF - Preview */}
      <section id="today" className="py-12 md:py-16 px-4 md:px-6" style={{ borderTop: '1px solid rgba(0, 255, 136, 0.2)', borderBottom: '1px solid rgba(0, 255, 136, 0.2)', background: 'rgba(0, 255, 136, 0.02)' }}>
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6 md:mb-8">
            <div>
              <div className="font-mono text-[10px] md:text-xs mb-2" style={{ color: 'rgba(0, 255, 136, 0.5)' }}>// PREVIEW</div>
              <h2 className="text-2xl md:text-4xl font-bold">
                <span style={{ color: '#FFFFFF' }}>Today's </span>
                <span className="neon-text">Brief</span>
              </h2>
            </div>
            <div className="font-mono text-[10px] md:text-xs text-right" style={{ color: 'rgba(255, 255, 255, 0.3)' }}>
              <div>DEC 04, 2024</div>
              <div style={{ color: '#00FF88' }}>LIVE</div>
            </div>
          </div>

          {/* Newsletter Preview */}
          <div className="terminal-card overflow-hidden">
            <div className="terminal-header">
              <div className="terminal-dot bg-red-500/70" />
              <div className="terminal-dot bg-yellow-500/70" />
              <div className="terminal-dot bg-green-500/70" />
              <span className="font-mono text-[10px] md:text-xs ml-4" style={{ color: 'rgba(255, 255, 255, 0.3)' }}>daily.email</span>
            </div>

            <div className="p-4 md:p-8">
              {/* Key Insight */}
              <div className="mb-6 md:mb-8 p-3 md:p-4" style={{ borderLeft: '2px solid #00FF88', background: 'rgba(0, 255, 136, 0.05)' }}>
                <div className="font-mono text-[10px] md:text-xs mb-2" style={{ color: '#00FF88' }}>💡 KEY INSIGHT</div>
                <p className="text-xs md:text-sm" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                  <strong style={{ color: '#FFFFFF' }}>US-led growth is strong</strong> — apps like GoWish performing well domestically with limited EU presence
                  <span style={{ color: '#00FF88' }}> = expansion opportunity.</span>
                </p>
              </div>

              {/* Trending Apps - Mobile optimized */}
              <div className="mb-6 md:mb-8">
                <div className="font-mono text-[10px] md:text-xs mb-3 md:mb-4" style={{ color: 'rgba(0, 255, 136, 0.5)' }}>📊 TRENDING TODAY</div>
                <div className="space-y-2">
                  {trendingApps.map((app, i) => (
                    <div key={i} className="flex items-center justify-between py-2 md:py-3" style={{ borderBottom: '1px solid rgba(0, 255, 136, 0.1)' }}>
                      <div>
                        <span className="font-mono text-xs md:text-sm font-medium" style={{ color: '#FFFFFF' }}>{app.name}</span>
                        <span className="font-mono text-[10px] md:text-xs ml-2" style={{ color: 'rgba(255, 255, 255, 0.4)' }}>{app.category}</span>
                      </div>
                      <div className="flex items-center gap-2 md:gap-3">
                        <span className="text-[10px] md:text-xs">{app.market}</span>
                        <span className="font-mono text-[10px] md:text-xs" style={{ color: '#00FF88' }}>{app.trend}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Niche to Explore */}
              <div className="p-3 md:p-5" style={{ border: '1px solid rgba(0, 255, 136, 0.2)', background: 'rgba(0, 0, 0, 0.3)' }}>
                <div className="font-mono text-[10px] md:text-xs mb-2 md:mb-3" style={{ color: '#00FF88' }}>🎯 NICHE TO EXPLORE</div>
                <h4 className="text-sm md:text-lg font-bold mb-2" style={{ color: '#FFFFFF' }}>AI-powered Education Tools</h4>
                <p className="text-[11px] md:text-sm mb-3 md:mb-4" style={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                  Rising demand for personalized study aids. High engagement, scalable market.
                </p>
                <div className="flex flex-wrap gap-2 md:gap-4 font-mono text-[9px] md:text-xs" style={{ color: '#00FF88' }}>
                  <span>Competition: Low</span>
                  <span>Potential: High</span>
                </div>
              </div>

              {/* CTA */}
              <div className="relative mt-4 md:mt-6 pt-4 md:pt-6" style={{ borderTop: '1px solid rgba(0, 255, 136, 0.1)' }}>
                <div className="blur-sm opacity-50">
                  <div className="font-mono text-[10px] md:text-xs" style={{ color: 'rgba(255, 255, 255, 0.3)' }}>+ 2 more niches...</div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <a href="#subscribe" className="btn-terminal text-xs md:text-sm py-2 px-4">
                    GET FULL ACCESS →
                  </a>
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

              <a href="#subscribe" className="btn-outline w-full block text-center text-xs md:text-sm">
                SUBSCRIBE FREE →
              </a>
            </div>

            {/* Pro */}
            <div className="terminal-card neon-border p-5 md:p-8 relative">
              <div className="corner-decoration corner-tl" />
              <div className="corner-decoration corner-tr" />
              <div className="corner-decoration corner-bl" />
              <div className="corner-decoration corner-br" />

              <div className="absolute -top-3 md:-top-4 left-1/2 -translate-x-1/2 font-mono text-[10px] md:text-xs font-bold px-3 md:px-4 py-1" style={{ background: '#00FF88', color: '#000' }}>
                COMING SOON
              </div>

              <div className="font-mono text-[10px] md:text-xs mb-2 md:mb-3" style={{ color: 'rgba(0, 255, 136, 0.4)' }}>PRO ACCESS</div>
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
            <span style={{ color: '#FFFFFF' }}>Ready to Find Your </span>
            <span className="neon-text">Next App Idea?</span>
          </h2>
          <p className="mb-6 md:mb-8" style={{ color: 'rgba(255, 255, 255, 0.4)' }}>
            Join 2,100+ developers getting daily insights.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              className="terminal-input flex-1 py-4"
              style={{ color: '#00FF88' }}
            />
            <button type="submit" className="btn-terminal py-4 px-6 md:px-8 neon-glow">
              JOIN FREE →
            </button>
          </form>
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
    </main>
  );
}
