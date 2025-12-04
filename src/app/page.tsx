"use client";

import { useState, useEffect } from "react";

export default function Home() {
  const [email, setEmail] = useState("");
  const [time, setTime] = useState("");
  const [typedText, setTypedText] = useState("");
  const [showCursor, setShowCursor] = useState(true);

  const fullText = "SCANNING APP STORE FOR OPPORTUNITIES...";

  useEffect(() => {
    // Time update
    const updateTime = () => {
      setTime(new Date().toLocaleTimeString("en-US", { hour12: false }));
    };
    updateTime();
    const timeInt = setInterval(updateTime, 1000);

    // Typing effect
    let i = 0;
    const typeInt = setInterval(() => {
      if (i <= fullText.length) {
        setTypedText(fullText.slice(0, i));
        i++;
      }
    }, 80);

    // Cursor blink
    const cursorInt = setInterval(() => setShowCursor((p) => !p), 500);

    return () => {
      clearInterval(timeInt);
      clearInterval(typeInt);
      clearInterval(cursorInt);
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("TARGET ACQUIRED ✓");
    setEmail("");
  };

  return (
    <main className="min-h-screen relative">
      {/* Background */}
      <div className="grid-bg" />
      <div className="scanlines" />

      {/* System info overlay */}
      <div className="fixed top-6 left-6 z-50 font-mono text-xs text-[#00FF88]/40 space-y-1">
        <div>SYS.TIME: {time}</div>
        <div>LAT: 37.7749°N</div>
        <div>LON: 122.4194°W</div>
      </div>

      <div className="fixed top-6 right-6 z-50">
        <div className="status-online">SYSTEM ONLINE</div>
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-40 border-b border-[#00FF88]/20 bg-[#0A0A0A]/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-[#00FF88] animate-pulse" />
            <span className="font-mono text-sm tracking-[0.2em] text-[#00FF88]">
              NICHES_HUNTER
            </span>
          </div>

          <div className="hidden md:flex items-center gap-6 font-mono text-xs">
            <a href="#features" className="text-white/40 hover:text-[#00FF88] transition-colors">
              [FEATURES]
            </a>
            <a href="#pricing" className="text-white/40 hover:text-[#00FF88] transition-colors">
              [PRICING]
            </a>
          </div>

          <a href="#terminal" className="btn-outline text-xs py-2 px-4">
            {">"} SUBSCRIBE
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center px-6 pt-20">
        <div className="max-w-7xl mx-auto w-full">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left - Content */}
            <div className="relative z-10">
              <div className="font-mono text-xs text-[#00FF88]/50 mb-6 animate-in">
                {"// INITIALIZING NICHE DETECTION PROTOCOL"}
              </div>

              <h1 className="text-5xl md:text-7xl font-bold leading-[0.95] mb-8 animate-in delay-100">
                <span className="text-white">HUNT</span>
                <br />
                <span className="neon-text">PROFITABLE</span>
                <br />
                <span className="text-white">iOS NICHES</span>
              </h1>

              <div className="font-mono text-sm text-white/50 mb-8 h-6 animate-in delay-200">
                <span className="text-[#00FF88]">{">"}</span> {typedText}
                <span className={`text-[#00FF88] ${showCursor ? "opacity-100" : "opacity-0"}`}>
                  █
                </span>
              </div>

              {/* Terminal Input */}
              <div id="terminal" className="terminal-card p-6 mb-8 animate-in delay-300">
                <div className="terminal-header -mx-6 -mt-6 mb-6">
                  <div className="terminal-dot bg-red-500/70" />
                  <div className="terminal-dot bg-yellow-500/70" />
                  <div className="terminal-dot bg-green-500/70" />
                  <span className="font-mono text-xs text-white/30 ml-4">terminal</span>
                </div>

                <div className="font-mono text-xs text-[#00FF88]/50 mb-3">
                  user@nicheshunter:~$
                </div>

                <form onSubmit={handleSubmit} className="flex gap-3">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="enter_email@domain.com"
                    required
                    className="terminal-input flex-1"
                  />
                  <button type="submit" className="btn-terminal text-sm">
                    EXECUTE
                  </button>
                </form>

                <div className="font-mono text-xs text-white/30 mt-4">
                  // FREE INTEL • WEEKLY DROPS • NO SPAM
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 animate-in delay-400">
                {[
                  { value: "50K+", label: "SCANNED" },
                  { value: "94%", label: "ACCURACY" },
                  { value: "2.1K", label: "HUNTERS" },
                  { value: "24/7", label: "UPTIME" },
                ].map((stat, i) => (
                  <div key={i} className="stat-box">
                    <div className="stat-value">{stat.value}</div>
                    <div className="stat-label">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right - Radar */}
            <div className="hidden lg:flex items-center justify-center animate-in delay-500">
              <div className="radar-container">
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

                {/* Blips */}
                {[
                  { x: 25, y: 30, delay: 0 },
                  { x: 70, y: 25, delay: 0.5 },
                  { x: 60, y: 65, delay: 1 },
                  { x: 35, y: 70, delay: 1.5 },
                  { x: 80, y: 50, delay: 2 },
                  { x: 20, y: 55, delay: 0.8 },
                ].map((blip, i) => (
                  <div
                    key={i}
                    className="radar-blip"
                    style={{
                      left: `${blip.x}%`,
                      top: `${blip.y}%`,
                      animationDelay: `${blip.delay}s`,
                    }}
                  />
                ))}

                {/* Labels */}
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 font-mono text-xs text-[#00FF88]/50">
                  N
                </div>
                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 font-mono text-xs text-[#00FF88]/50">
                  S
                </div>
                <div className="absolute top-1/2 -left-8 -translate-y-1/2 font-mono text-xs text-[#00FF88]/50">
                  W
                </div>
                <div className="absolute top-1/2 -right-8 -translate-y-1/2 font-mono text-xs text-[#00FF88]/50">
                  E
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Marquee */}
      <div className="border-y border-[#00FF88]/20 py-4 overflow-hidden">
        <div className="flex gap-12 scroll-text whitespace-nowrap">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex gap-12 font-mono text-xs text-[#00FF88]/40">
              {[
                "◆ REAL-TIME SCANNING",
                "◆ AI-POWERED ANALYSIS",
                "◆ 50,000+ NICHES TRACKED",
                "◆ WEEKLY INTEL DROPS",
                "◆ 2,100+ ACTIVE HUNTERS",
                "◆ 94% ACCURACY RATE",
              ].map((text, j) => (
                <span key={j}>{text}</span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Features */}
      <section id="features" className="py-32 px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="mb-16">
            <div className="font-mono text-xs text-[#00FF88]/50 mb-4">
              {"// SYSTEM CAPABILITIES"}
            </div>
            <h2 className="text-4xl md:text-5xl font-bold">
              <span className="text-white">CORE</span>{" "}
              <span className="neon-text">FEATURES</span>
            </h2>
          </div>

          <div className="space-y-4">
            {[
              {
                num: "01",
                title: "NICHE RADAR",
                desc: "Real-time App Store scanning identifies untapped opportunities before they become saturated.",
              },
              {
                num: "02",
                title: "THREAT ANALYSIS",
                desc: "Competition mapping and risk assessment for every niche. Know exactly what you're up against.",
              },
              {
                num: "03",
                title: "REVENUE INTEL",
                desc: "Estimated earnings potential based on historical data and market trends.",
              },
              {
                num: "04",
                title: "SIGNAL BOOST",
                desc: "Weekly drops straight to your inbox. Actionable insights, not just data dumps.",
              },
            ].map((feature, i) => (
              <div key={i} className="feature-card">
                <span className="feature-number">{feature.num}</span>
                <h3 className="text-xl font-bold mb-3 text-[#00FF88] font-mono">
                  {feature.title}
                </h3>
                <p className="text-white/40 max-w-2xl">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-32 px-6 relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="mb-16">
            <div className="font-mono text-xs text-[#00FF88]/50 mb-4">
              {"// ACCESS LEVELS"}
            </div>
            <h2 className="text-4xl md:text-5xl font-bold">
              <span className="text-white">SELECT</span>{" "}
              <span className="neon-text">CLEARANCE</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Free */}
            <div className="terminal-card p-8 relative">
              <div className="corner-decoration corner-tl" />
              <div className="corner-decoration corner-tr" />
              <div className="corner-decoration corner-bl" />
              <div className="corner-decoration corner-br" />

              <div className="font-mono text-xs text-[#00FF88]/40 mb-4">TIER_00</div>
              <h3 className="text-2xl font-bold mb-2 font-mono">RECON</h3>
              <div className="font-mono text-4xl text-[#00FF88] mb-6">
                $0<span className="text-base text-white/30">/mo</span>
              </div>

              <div className="space-y-3 mb-8">
                {[
                  "Weekly niche reports",
                  "Market trend analysis",
                  "Basic competition data",
                  "Community access",
                ].map((item, i) => (
                  <div key={i} className="data-row">
                    <span className="data-label">[✓]</span>
                    <span className="text-white/60">{item}</span>
                  </div>
                ))}
              </div>

              <a href="#terminal" className="btn-outline w-full block text-center text-sm">
                {">"} INITIALIZE
              </a>
            </div>

            {/* Pro */}
            <div className="terminal-card neon-border p-8 relative">
              <div className="corner-decoration corner-tl" />
              <div className="corner-decoration corner-tr" />
              <div className="corner-decoration corner-bl" />
              <div className="corner-decoration corner-br" />

              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#00FF88] text-black font-mono text-xs px-4 py-1">
                RECOMMENDED
              </div>

              <div className="font-mono text-xs text-[#00FF88]/40 mb-4">TIER_01</div>
              <h3 className="text-2xl font-bold mb-2 font-mono">OPERATIVE</h3>
              <div className="font-mono text-4xl text-[#00FF88] mb-6 neon-text">
                $10<span className="text-base text-white/30">/mo</span>
              </div>

              <div className="space-y-3 mb-8">
                {[
                  "Everything in RECON",
                  "Daily niche alerts",
                  "Revenue estimates",
                  "Competition scores",
                  "Priority support",
                ].map((item, i) => (
                  <div key={i} className="data-row">
                    <span className="data-label">[✓]</span>
                    <span className="text-white/60">{item}</span>
                  </div>
                ))}
              </div>

              <button className="btn-terminal w-full text-sm neon-glow">
                {">"} COMING SOON
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 px-6 relative z-10 border-t border-[#00FF88]/20">
        <div className="max-w-3xl mx-auto text-center">
          <div className="font-mono text-xs text-[#00FF88]/50 mb-4">
            {"// INITIATE SEQUENCE"}
          </div>
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="text-white">START</span>{" "}
            <span className="neon-text">HUNTING</span>
          </h2>
          <p className="text-white/40 mb-10 font-mono">
            Join 2,100+ developers receiving weekly intel.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              className="terminal-input flex-1"
            />
            <button type="submit" className="btn-terminal">
              DEPLOY
            </button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-[#00FF88]/20 relative z-10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-[#00FF88]" />
            <span className="font-mono text-xs text-white/30">NICHES_HUNTER v2.0</span>
          </div>

          <div className="flex gap-6 font-mono text-xs text-white/30">
            <a href="#" className="hover:text-[#00FF88] transition-colors">PRIVACY</a>
            <a href="#" className="hover:text-[#00FF88] transition-colors">TERMS</a>
            <a href="#" className="hover:text-[#00FF88] transition-colors">CONTACT</a>
          </div>

          <div className="font-mono text-xs text-white/30">
            © 2024 ALL RIGHTS RESERVED
          </div>
        </div>
      </footer>
    </main>
  );
}
