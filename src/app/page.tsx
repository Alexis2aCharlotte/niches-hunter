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

    // Rotate through niches one by one
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
    <main className="min-h-screen relative">
      {/* Background */}
      <div className="grid-bg" />
      <div className="scanlines" />

      {/* System info */}
      <div className="fixed top-6 left-6 z-50 font-mono text-xs text-[#00FF88]/40 space-y-1 hidden md:block">
        <div>SYS.TIME: {time}</div>
        <div>STATUS: SCANNING</div>
      </div>

      <div className="fixed top-6 right-6 z-50 hidden md:block">
        <div className="status-online">LIVE DATA</div>
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-40 border-b border-[#00FF88]/20 bg-[#0A0A0A]/90 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-[#00FF88] animate-pulse" />
            <span className="font-mono text-sm tracking-[0.15em] text-[#00FF88]">
              NICHES HUNTER
            </span>
          </div>

          <div className="hidden md:flex items-center gap-6 font-mono text-xs">
            <a href="#today" className="text-white/40 hover:text-[#00FF88] transition-colors">[TODAY]</a>
            <a href="#features" className="text-white/40 hover:text-[#00FF88] transition-colors">[FEATURES]</a>
            <a href="#pricing" className="text-white/40 hover:text-[#00FF88] transition-colors">[PRICING]</a>
          </div>

          <a href="#subscribe" className="btn-terminal text-xs py-2 px-4">
            GET ACCESS
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-28 pb-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left - Content */}
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#00FF88]/30 bg-[#00FF88]/5 mb-6">
                <span className="w-2 h-2 rounded-full bg-[#00FF88] animate-pulse" />
                <span className="font-mono text-xs text-[#00FF88]">DAILY NEWSLETTER - FREE</span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1] mb-6">
                <span className="text-white">Spot </span>
                <span className="neon-text">Profitable iOS Niches</span>
                <span className="text-white"> Before Anyone Else</span>
              </h1>

              <p className="text-lg text-white/50 mb-6">
                Every day, get <span className="text-[#00FF88]">trending apps</span>, <span className="text-[#00FF88]">market insights</span> (US vs EU), 
                and <span className="text-[#00FF88]">2-3 niches</span> with full analysis.
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
                    className="terminal-input flex-1 py-4"
                  />
                  <button type="submit" className="btn-terminal py-4 px-6 neon-glow whitespace-nowrap">
                    SUBSCRIBE FREE →
                  </button>
                </form>
                <div className="flex items-center gap-4 mt-3 font-mono text-xs text-white/40">
                  <span>✓ Daily insights</span>
                  <span>✓ 2,100+ devs</span>
                  <span>✓ 100% Free</span>
                </div>
              </div>
            </div>

            {/* Right - RADAR */}
            <div className="hidden lg:flex items-center justify-center">
              <div className="radar-container relative">
                {/* Circles */}
                {[25, 50, 75, 100].map((size, i) => (
                  <div
                    key={i}
                    className="radar-circle"
                    style={{ width: `${size}%`, height: `${size}%` }}
                  />
                ))}

                {/* Cross lines */}
                <div className="radar-line radar-line-h" />
                <div className="radar-line radar-line-v" />

                {/* Sweep */}
                <div className="radar-sweep" />

                {/* Center */}
                <div className="radar-center" />

                {/* Niche Blips with Labels - One at a time */}
                {niches.map((niche, i) => {
                  const isActive = activeBlip === i;
                  const wasActive = activeBlip === (i + 1) % niches.length; // Fading out
                  
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
                      {/* Blip dot */}
                      <div
                        className="transition-all duration-700 ease-out"
                        style={{
                          width: isActive ? '14px' : '8px',
                          height: isActive ? '14px' : '8px',
                          borderRadius: '50%',
                          backgroundColor: isActive ? '#00FF88' : 'rgba(0, 255, 136, 0.2)',
                          boxShadow: isActive 
                            ? '0 0 10px #00FF88, 0 0 20px #00FF88, 0 0 30px #00FF88' 
                            : 'none',
                        }}
                      />
                      
                      {/* Pulse ring when active */}
                      {isActive && (
                        <div 
                          className="absolute inset-0 rounded-full animate-ping"
                          style={{
                            backgroundColor: 'rgba(0, 255, 136, 0.3)',
                            animationDuration: '1s',
                          }}
                        />
                      )}
                      
                      {/* Label */}
                      <div
                        className="absolute left-6 top-1/2 -translate-y-1/2 whitespace-nowrap transition-all duration-500 ease-out"
                        style={{
                          opacity: isActive ? 1 : 0,
                          transform: `translateY(-50%) translateX(${isActive ? '0' : '-10px'})`,
                        }}
                      >
                        <div className="flex items-center gap-2">
                          <div 
                            className="h-px bg-[#00FF88] transition-all duration-500"
                            style={{ width: isActive ? '20px' : '0px' }}
                          />
                          <div className="bg-[#00FF88] text-black font-mono text-xs font-bold px-3 py-1.5 shadow-lg shadow-[#00FF88]/30">
                            {niche.name}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* Radar labels */}
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 font-mono text-xs text-[#00FF88]/40">N</div>
                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 font-mono text-xs text-[#00FF88]/40">S</div>
                <div className="absolute top-1/2 -left-6 -translate-y-1/2 font-mono text-xs text-[#00FF88]/40">W</div>
                <div className="absolute top-1/2 -right-6 -translate-y-1/2 font-mono text-xs text-[#00FF88]/40">E</div>

                {/* Status text */}
                <div className="absolute -bottom-12 left-0 right-0 text-center">
                  <span className="font-mono text-xs text-[#00FF88]/50">
                    DETECTED: <span className="text-[#00FF88]">{niches[activeBlip].name}</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3 PILLARS */}
      <section className="py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { icon: "📈", title: "Trending Apps", desc: "5 rising apps daily with rankings" },
              { icon: "🌍", title: "US vs EU Intel", desc: "Compare markets, spot opportunities" },
              { icon: "💎", title: "Niche Analysis", desc: "2-3 niches/day with full breakdown" },
            ].map((pillar, i) => (
              <div key={i} className="stat-box text-center py-6">
                <div className="text-3xl mb-3">{pillar.icon}</div>
                <h3 className="font-mono text-[#00FF88] font-bold text-sm mb-1">{pillar.title}</h3>
                <p className="text-white/40 text-xs">{pillar.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TODAY'S BRIEF - Preview */}
      <section id="today" className="py-16 px-6 border-y border-[#00FF88]/20 bg-[#00FF88]/[0.02]">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="font-mono text-xs text-[#00FF88]/50 mb-2">// PREVIEW</div>
              <h2 className="text-3xl md:text-4xl font-bold">
                <span className="text-white">Today's</span>{" "}
                <span className="neon-text">Brief</span>
              </h2>
            </div>
            <div className="font-mono text-xs text-white/30 text-right">
              <div>DEC 04, 2024</div>
              <div className="text-[#00FF88]">LIVE</div>
            </div>
          </div>

          {/* Newsletter Preview */}
          <div className="terminal-card overflow-hidden">
            <div className="terminal-header">
              <div className="terminal-dot bg-red-500/70" />
              <div className="terminal-dot bg-yellow-500/70" />
              <div className="terminal-dot bg-green-500/70" />
              <span className="font-mono text-xs text-white/30 ml-4">niches-hunter-daily.email</span>
            </div>

            <div className="p-6 md:p-8">
              {/* Key Insight */}
              <div className="mb-8 p-4 border-l-2 border-[#00FF88] bg-[#00FF88]/5">
                <div className="font-mono text-xs text-[#00FF88] mb-2">💡 KEY INSIGHT</div>
                <p className="text-white/70 text-sm">
                  <strong className="text-white">US-led growth is strong</strong> with apps like GoWish and Youtify 
                  performing well domestically but with limited EU presence — 
                  <span className="text-[#00FF88]"> indicating opportunities for regional expansion.</span>
                </p>
              </div>

              {/* Trending Apps Table */}
              <div className="mb-8">
                <div className="font-mono text-xs text-[#00FF88]/50 mb-4">📊 TRENDING APPS TODAY</div>
                <div className="overflow-x-auto">
                  <table className="w-full font-mono text-sm">
                    <thead>
                      <tr className="text-white/40 text-xs border-b border-[#00FF88]/20">
                        <th className="text-left py-3 px-4">APP</th>
                        <th className="text-left py-3 px-4">RANK</th>
                        <th className="text-left py-3 px-4">CATEGORY</th>
                        <th className="text-left py-3 px-4">MARKET</th>
                        <th className="text-right py-3 px-4">TREND</th>
                      </tr>
                    </thead>
                    <tbody>
                      {trendingApps.map((app, i) => (
                        <tr key={i} className="border-b border-[#00FF88]/10 hover:bg-[#00FF88]/5 transition-colors">
                          <td className="py-4 px-4 text-white font-medium">{app.name}</td>
                          <td className="py-4 px-4 text-[#00FF88]">{app.rank}</td>
                          <td className="py-4 px-4 text-white/50">{app.category}</td>
                          <td className="py-4 px-4">{app.market}</td>
                          <td className="py-4 px-4 text-right text-[#00FF88]">{app.trend}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Niche to Explore */}
              <div className="p-5 border border-[#00FF88]/20 bg-black/30">
                <div className="font-mono text-xs text-[#00FF88] mb-3">🎯 NICHE TO EXPLORE</div>
                <h4 className="text-lg font-bold text-white mb-2">AI-powered Education Tools</h4>
                <p className="text-white/50 text-sm mb-4">
                  With increasing demand for personalized study aids, AI-driven education apps represent a promising niche.
                </p>
                <div className="flex flex-wrap gap-4 font-mono text-xs">
                  <span className="text-[#00FF88]">Competition: Low</span>
                  <span className="text-white/30">|</span>
                  <span className="text-[#00FF88]">Potential: High</span>
                  <span className="text-white/30">|</span>
                  <span className="text-[#00FF88]">Market: US + EU</span>
                </div>
              </div>

              {/* Blur overlay */}
              <div className="relative mt-6 pt-6 border-t border-[#00FF88]/10">
                <div className="blur-sm opacity-50">
                  <div className="font-mono text-xs text-white/30 mb-2">+ 2 more niches...</div>
                  <div className="font-mono text-xs text-white/30">+ Regional market breakdown...</div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <a href="#subscribe" className="btn-terminal text-sm">
                    GET FULL ACCESS →
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="font-mono text-xs text-[#00FF88]/50 mb-2">// WHAT YOU GET</div>
            <h2 className="text-3xl md:text-4xl font-bold">
              <span className="text-white">Everything to</span>{" "}
              <span className="neon-text">Find Your Niche</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {[
              { num: "01", title: "Daily Trending Apps", desc: "5 rising apps with rankings, categories, and growth metrics." },
              { num: "02", title: "Market Intelligence", desc: "US vs EU comparison. Spot regional opportunities." },
              { num: "03", title: "Niche Deep Dives", desc: "2-3 analyzed niches per day with competition & potential." },
              { num: "04", title: "Actionable Insights", desc: "Concrete recommendations you can act on today." },
            ].map((feature, i) => (
              <div key={i} className="feature-card">
                <span className="feature-number">{feature.num}</span>
                <h3 className="text-lg font-bold mb-2 text-[#00FF88] font-mono">{feature.title}</h3>
                <p className="text-white/40 text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 px-6 border-y border-[#00FF88]/20">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { value: "2,100+", label: "SUBSCRIBERS" },
              { value: "50K+", label: "APPS TRACKED" },
              { value: "Daily", label: "UPDATES" },
              { value: "94%", label: "OPEN RATE" },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="font-mono text-2xl md:text-3xl font-bold text-[#00FF88] mb-1">{stat.value}</div>
                <div className="font-mono text-xs text-white/30">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <div className="font-mono text-xs text-[#00FF88]/50 mb-2">// PRICING</div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="text-white">Start Free,</span>{" "}
              <span className="neon-text">Upgrade for More</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Free */}
            <div className="terminal-card p-8 relative">
              <div className="corner-decoration corner-tl" />
              <div className="corner-decoration corner-tr" />
              <div className="corner-decoration corner-bl" />
              <div className="corner-decoration corner-br" />

              <div className="font-mono text-xs text-[#00FF88]/40 mb-3">FREE FOREVER</div>
              <h3 className="text-2xl font-bold mb-2 font-mono">Daily Newsletter</h3>
              <div className="font-mono text-4xl text-[#00FF88] mb-6">
                $0<span className="text-base text-white/30">/month</span>
              </div>

              <ul className="space-y-3 mb-8 font-mono text-sm">
                {[
                  "Daily email with insights",
                  "5 trending apps/day",
                  "2-3 niche analyses/day",
                  "US vs EU market intel",
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-white/60">
                    <span className="text-[#00FF88]">✓</span>
                    {item}
                  </li>
                ))}
              </ul>

              <a href="#subscribe" className="btn-outline w-full block text-center text-sm">
                SUBSCRIBE FREE →
              </a>
            </div>

            {/* Pro */}
            <div className="terminal-card neon-border p-8 relative">
              <div className="corner-decoration corner-tl" />
              <div className="corner-decoration corner-tr" />
              <div className="corner-decoration corner-bl" />
              <div className="corner-decoration corner-br" />

              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#00FF88] text-black font-mono text-xs font-bold px-4 py-1">
                COMING SOON
              </div>

              <div className="font-mono text-xs text-[#00FF88]/40 mb-3">PRO ACCESS</div>
              <h3 className="text-2xl font-bold mb-2 font-mono">Hunter Dashboard</h3>
              <div className="font-mono text-4xl text-[#00FF88] neon-text mb-6">
                $10<span className="text-base text-white/30">/month</span>
              </div>

              <ul className="space-y-3 mb-8 font-mono text-sm">
                {[
                  "Everything in Free",
                  "Full dashboard access",
                  "Historical niche database",
                  "Revenue estimates",
                  "Custom alerts",
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-white/60">
                    <span className="text-[#00FF88]">✓</span>
                    {item}
                  </li>
                ))}
              </ul>

              <button className="btn-terminal w-full text-sm neon-glow" disabled>
                COMING SOON
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-6 border-t border-[#00FF88]/20">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="text-white">Ready to Find Your</span>{" "}
            <span className="neon-text">Next App Idea?</span>
          </h2>
          <p className="text-white/40 mb-8">
            Join 2,100+ developers getting daily niche insights.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              className="terminal-input flex-1 py-4"
            />
            <button type="submit" className="btn-terminal py-4 px-8 neon-glow">
              JOIN FREE →
            </button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-[#00FF88]/20">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-[#00FF88]" />
            <span className="font-mono text-xs text-white/30">NICHES HUNTER</span>
          </div>

          <div className="flex gap-6 font-mono text-xs text-white/30">
            <a href="#" className="hover:text-[#00FF88] transition-colors">PRIVACY</a>
            <a href="#" className="hover:text-[#00FF88] transition-colors">TERMS</a>
            <a href="#" className="hover:text-[#00FF88] transition-colors">CONTACT</a>
          </div>

          <div className="font-mono text-xs text-white/30">© 2024</div>
        </div>
      </footer>
    </main>
  );
}
