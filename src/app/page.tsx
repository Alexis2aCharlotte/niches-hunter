"use client";

import { useState, useEffect, useRef } from "react";

export default function Home() {
  const [email, setEmail] = useState("");
  const [currentTime, setCurrentTime] = useState("");
  const [typedText, setTypedText] = useState("");
  const [showCursor, setShowCursor] = useState(true);
  const radarRef = useRef<HTMLDivElement>(null);

  const fullText = "SCANNING APP STORE FOR OPPORTUNITIES...";

  useEffect(() => {
    // Update time
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString("en-US", {
          hour12: false,
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
    };
    updateTime();
    const timeInterval = setInterval(updateTime, 1000);

    // Typing effect
    let i = 0;
    const typingInterval = setInterval(() => {
      if (i < fullText.length) {
        setTypedText(fullText.slice(0, i + 1));
        i++;
      } else {
        clearInterval(typingInterval);
      }
    }, 100);

    // Cursor blink
    const cursorInterval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 530);

    return () => {
      clearInterval(timeInterval);
      clearInterval(typingInterval);
      clearInterval(cursorInterval);
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Email submitted:", email);
    setEmail("");
    alert("TARGET ACQUIRED ✓ Check your inbox.");
  };

  const stats = [
    { label: "NICHES SCANNED", value: "52,847" },
    { label: "SUCCESS RATE", value: "94.2%" },
    { label: "AVG. REVENUE", value: "$12.4K" },
    { label: "ACTIVE HUNTERS", value: "2,156" },
  ];

  const features = [
    {
      id: "01",
      title: "NICHE RADAR",
      desc: "Real-time scanning of App Store categories. Identify gaps before the competition.",
    },
    {
      id: "02",
      title: "THREAT ANALYSIS",
      desc: "Competition density mapping. Know exactly who you're up against.",
    },
    {
      id: "03",
      title: "SIGNAL BOOST",
      desc: "Weekly intel drops straight to your inbox. Actionable, not theoretical.",
    },
  ];

  return (
    <main className="relative min-h-screen bg-[#050505] overflow-hidden">
      {/* Overlays */}
      <div className="scanlines" />
      <div className="grid-overlay" />

      {/* Floating coordinates */}
      <div className="fixed top-4 left-4 font-mono text-xs text-[#39FF14]/40 z-50">
        <div>LAT: 37.7749° N</div>
        <div>LON: 122.4194° W</div>
      </div>

      {/* Time display */}
      <div className="fixed top-4 right-4 font-mono text-xs text-[#39FF14]/40 z-50">
        <div>SYS_TIME: {currentTime}</div>
        <div>STATUS: ONLINE</div>
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-40 border-b border-[#39FF14]/20">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-[#39FF14] status-pulse" />
            <span className="font-mono text-sm tracking-widest text-[#39FF14]">
              NICHES_HUNTER
            </span>
          </div>

          <div className="hidden md:flex items-center gap-8 font-mono text-xs">
            <a
              href="#features"
              className="text-white/60 hover:text-[#39FF14] transition-colors"
            >
              [FEATURES]
            </a>
            <a
              href="#pricing"
              className="text-white/60 hover:text-[#39FF14] transition-colors"
            >
              [PRICING]
            </a>
          </div>

          <a
            href="#terminal"
            className="font-mono text-xs px-4 py-2 border border-[#39FF14] text-[#39FF14] hover:bg-[#39FF14] hover:text-black transition-all"
          >
            {">"} SUBSCRIBE
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-6 pt-20">
        <div className="max-w-6xl mx-auto w-full">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left - Text content */}
            <div className="relative z-10">
              <div className="font-mono text-xs text-[#39FF14]/60 mb-4">
                {"// SYSTEM INITIALIZED"}
              </div>

              <h1 className="text-5xl md:text-7xl font-bold leading-[0.9] mb-6 tracking-tight">
                <span className="text-white">HUNT</span>
                <br />
                <span className="neon-green">PROFITABLE</span>
                <br />
                <span className="text-white">iOS NICHES</span>
              </h1>

              <div className="font-mono text-sm text-white/60 mb-8 max-w-md">
                <span className="text-[#39FF14]">{">"}</span> {typedText}
                <span
                  className={`${showCursor ? "opacity-100" : "opacity-0"} text-[#39FF14]`}
                >
                  █
                </span>
              </div>

              {/* Terminal Input */}
              <form
                id="terminal"
                onSubmit={handleSubmit}
                className="mb-8 max-w-md"
              >
                <div className="flex items-center gap-2 font-mono text-sm mb-2 text-[#39FF14]/60">
                  <span>user@nicheshunter:~$</span>
                </div>
                <div className="flex gap-4">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="enter_email@domain.com"
                    required
                    className="terminal-input flex-1"
                  />
                  <button
                    type="submit"
                    className="font-mono text-sm px-6 py-2 bg-[#39FF14] text-black hover:bg-[#00FFFF] transition-colors glitch"
                  >
                    EXECUTE
                  </button>
                </div>
                <div className="font-mono text-xs text-white/40 mt-3">
                  {"// FREE WEEKLY INTEL • NO SPAM • UNSUBSCRIBE ANYTIME"}
                </div>
              </form>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 max-w-md">
                {stats.map((stat, i) => (
                  <div
                    key={i}
                    className="border border-[#39FF14]/20 p-3 hover-lift"
                  >
                    <div className="font-mono text-xs text-white/40 mb-1">
                      {stat.label}
                    </div>
                    <div className="font-mono text-xl text-[#39FF14]">
                      {stat.value}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right - Radar visualization */}
            <div className="relative flex items-center justify-center">
              <div
                ref={radarRef}
                className="relative w-80 h-80 md:w-96 md:h-96"
              >
                {/* Radar circles */}
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="absolute inset-0 border border-[#39FF14]/20 rounded-full"
                    style={{
                      width: `${i * 25}%`,
                      height: `${i * 25}%`,
                      top: `${50 - (i * 25) / 2}%`,
                      left: `${50 - (i * 25) / 2}%`,
                    }}
                  />
                ))}

                {/* Radar sweep */}
                <div className="absolute inset-0 radar-sweep origin-center">
                  <div
                    className="absolute top-1/2 left-1/2 w-1/2 h-0.5"
                    style={{
                      background:
                        "linear-gradient(90deg, #39FF14 0%, transparent 100%)",
                      transformOrigin: "left center",
                    }}
                  />
                </div>

                {/* Center dot */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-[#39FF14] status-pulse" />

                {/* Blips */}
                {[
                  { x: 30, y: 25, delay: 0 },
                  { x: 70, y: 35, delay: 0.5 },
                  { x: 45, y: 70, delay: 1 },
                  { x: 65, y: 60, delay: 1.5 },
                  { x: 25, y: 55, delay: 2 },
                ].map((blip, i) => (
                  <div
                    key={i}
                    className="absolute w-2 h-2 bg-[#00FFFF] rounded-full animate-pulse"
                    style={{
                      left: `${blip.x}%`,
                      top: `${blip.y}%`,
                      animationDelay: `${blip.delay}s`,
                    }}
                  />
                ))}

                {/* Cross lines */}
                <div className="absolute top-1/2 left-0 right-0 h-px bg-[#39FF14]/20" />
                <div className="absolute top-0 bottom-0 left-1/2 w-px bg-[#39FF14]/20" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="font-mono text-xs text-[#39FF14]/60 mb-4">
            {"// CAPABILITIES"}
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-16">
            <span className="text-white">SYSTEM</span>{" "}
            <span className="neon-cyan">FEATURES</span>
          </h2>

          <div className="space-y-1">
            {features.map((feature, i) => (
              <div
                key={i}
                className="group border-t border-[#39FF14]/20 py-8 flex items-start gap-8 hover:bg-[#39FF14]/5 transition-colors px-4 -mx-4"
              >
                <div className="font-mono text-4xl text-[#39FF14]/20 group-hover:text-[#39FF14] transition-colors">
                  {feature.id}
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold mb-2 group-hover:text-[#39FF14] transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-white/50 font-mono text-sm max-w-xl">
                    {feature.desc}
                  </p>
                </div>
                <div className="font-mono text-[#39FF14] opacity-0 group-hover:opacity-100 transition-opacity">
                  [→]
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="relative py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="font-mono text-xs text-[#39FF14]/60 mb-4">
            {"// ACCESS LEVELS"}
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-16">
            <span className="text-white">CHOOSE YOUR</span>{" "}
            <span className="neon-pink">CLEARANCE</span>
          </h2>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl">
            {/* Free Tier */}
            <div className="border border-[#39FF14]/30 p-8 hover-lift relative">
              <div className="font-mono text-xs text-[#39FF14]/60 mb-4">
                TIER_00
              </div>
              <h3 className="text-3xl font-bold mb-2">RECON</h3>
              <div className="font-mono text-5xl text-[#39FF14] mb-6">
                $0<span className="text-lg text-white/40">/mo</span>
              </div>
              <ul className="space-y-3 mb-8 font-mono text-sm">
                {[
                  "Weekly niche reports",
                  "Market trend analysis",
                  "Community access",
                  "Basic app insights",
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-white/70">
                    <span className="text-[#39FF14]">[✓]</span>
                    {item}
                  </li>
                ))}
              </ul>
              <a
                href="#terminal"
                className="block w-full py-3 border border-[#39FF14] text-[#39FF14] font-mono text-sm text-center hover:bg-[#39FF14] hover:text-black transition-all"
              >
                {">"} INITIALIZE
              </a>
            </div>

            {/* Pro Tier */}
            <div className="border border-[#00FFFF] p-8 hover-lift relative animated-border bg-[#050505]">
              <div className="absolute -top-3 right-4 px-3 py-1 bg-[#00FFFF] text-black font-mono text-xs">
                RECOMMENDED
              </div>
              <div className="font-mono text-xs text-[#00FFFF]/60 mb-4">
                TIER_01
              </div>
              <h3 className="text-3xl font-bold mb-2">OPERATIVE</h3>
              <div className="font-mono text-5xl text-[#00FFFF] mb-6">
                $10<span className="text-lg text-white/40">/mo</span>
              </div>
              <ul className="space-y-3 mb-8 font-mono text-sm">
                {[
                  "Everything in RECON",
                  "Daily niche alerts",
                  "Revenue estimates",
                  "Competition scores",
                  "Priority intel",
                  "Direct support line",
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-white/70">
                    <span className="text-[#00FFFF]">[✓]</span>
                    {item}
                  </li>
                ))}
              </ul>
              <button className="w-full py-3 bg-[#00FFFF] text-black font-mono text-sm hover:bg-[#39FF14] transition-all">
                {">"} COMING SOON
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative py-32 px-6 border-t border-[#39FF14]/20">
        <div className="max-w-3xl mx-auto text-center">
          <div className="font-mono text-xs text-[#39FF14]/60 mb-4">
            {"// INITIATE SEQUENCE"}
          </div>
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="text-white">START</span>{" "}
            <span className="neon-green">HUNTING</span>
          </h2>
          <p className="font-mono text-white/50 mb-8">
            Join 2,000+ developers receiving weekly intel on untapped iOS
            opportunities.
          </p>

          <form
            onSubmit={handleSubmit}
            className="max-w-md mx-auto flex gap-4"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              className="terminal-input flex-1"
            />
            <button
              type="submit"
              className="font-mono text-sm px-6 py-2 bg-[#39FF14] text-black hover:bg-[#00FFFF] transition-colors"
            >
              DEPLOY
            </button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-8 px-6 border-t border-[#39FF14]/20">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-[#39FF14]" />
            <span className="font-mono text-xs text-white/40">
              NICHES_HUNTER v1.0.0
            </span>
          </div>

          <div className="flex items-center gap-6 font-mono text-xs text-white/40">
            <a href="#" className="hover:text-[#39FF14] transition-colors">
              PRIVACY
            </a>
            <a href="#" className="hover:text-[#39FF14] transition-colors">
              TERMS
            </a>
            <a href="#" className="hover:text-[#39FF14] transition-colors">
              CONTACT
            </a>
          </div>

          <div className="font-mono text-xs text-white/40">
            © 2024 ALL RIGHTS RESERVED
          </div>
        </div>
      </footer>
    </main>
  );
}
