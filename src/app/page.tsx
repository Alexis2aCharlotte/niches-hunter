"use client";

import { useState } from "react";

export default function Home() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Email submitted:", email);
    setEmail("");
    alert("Welcome aboard! 🚀 Check your inbox.");
  };

  const features = [
    {
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8" />
          <path d="M21 21l-4.35-4.35" />
        </svg>
      ),
      title: "Niche Discovery",
      desc: "AI-powered scanning finds hidden opportunities in the App Store before they become mainstream.",
      tag: "Core Feature",
    },
    {
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 3v18h18" />
          <path d="M7 16l4-4 4 4 5-6" />
        </svg>
      ),
      title: "Market Analytics",
      desc: "Deep insights into revenue potential, competition density, and growth trajectories.",
      tag: "Data-Driven",
    },
    {
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
        </svg>
      ),
      title: "Instant Alerts",
      desc: "Get notified the moment a new opportunity emerges. First-mover advantage guaranteed.",
      tag: "Real-time",
    },
  ];

  return (
    <main className="min-h-screen relative">
      {/* Background effects */}
      <div className="noise" />
      <div className="hero-gradient" />
      <div className="grid-pattern" />

      {/* Floating orbs */}
      <div
        className="glow-orb w-96 h-96"
        style={{
          background: "radial-gradient(circle, rgba(191,255,0,0.4) 0%, transparent 70%)",
          top: "10%",
          left: "-10%",
        }}
      />
      <div
        className="glow-orb w-80 h-80"
        style={{
          background: "radial-gradient(circle, rgba(0,255,209,0.3) 0%, transparent 70%)",
          top: "60%",
          right: "-5%",
          animationDelay: "2s",
        }}
      />

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50">
        <div className="mx-6 mt-4">
          <div className="max-w-6xl mx-auto px-6 py-4 rounded-2xl bg-black/40 backdrop-blur-xl border border-white/5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#BFFF00] to-[#00FFD1] flex items-center justify-center">
                  <svg className="w-5 h-5 text-black" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                  </svg>
                </div>
                <span className="font-bold text-lg">Niches Hunter</span>
              </div>

              <div className="hidden md:flex items-center gap-1">
                {["Features", "Pricing", "About"].map((item) => (
                  <a
                    key={item}
                    href={`#${item.toLowerCase()}`}
                    className="px-4 py-2 text-sm text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition-all"
                  >
                    {item}
                  </a>
                ))}
              </div>

              <div className="flex items-center gap-3">
                <a href="#subscribe" className="btn-primary text-sm py-2.5 px-5">
                  Get Started
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <div className="badge badge-glow mb-6 reveal reveal-delay-1">
              <span className="w-2 h-2 rounded-full bg-[#BFFF00] animate-pulse" />
              Free newsletter for iOS indie developers
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.05] mb-6 reveal reveal-delay-2">
              Discover{" "}
              <span className="gradient-text">Profitable Niches</span>
              {" "}Before Anyone Else
            </h1>

            <p className="text-lg md:text-xl text-white/60 leading-relaxed mb-10 reveal reveal-delay-3">
              Weekly curated insights on untapped App Store opportunities.
              Data-driven analysis that helps you build apps people actually want.
            </p>

            {/* Email Form */}
            <form
              id="subscribe"
              onSubmit={handleSubmit}
              className="max-w-lg mx-auto reveal reveal-delay-4"
            >
              <div className="glass-card p-2 flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  required
                  className="flex-1 bg-transparent px-4 py-3 text-white placeholder-white/40 outline-none"
                />
                <button type="submit" className="btn-primary whitespace-nowrap">
                  Subscribe Free
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
              <p className="text-sm text-white/40 mt-4">
                Join 2,000+ indie developers · Unsubscribe anytime
              </p>
            </form>
          </div>

          {/* Hero Visual */}
          <div className="relative max-w-4xl mx-auto">
            <div className="glass-card p-6 md:p-8">
              {/* Mock dashboard header */}
              <div className="flex items-center justify-between mb-6 pb-6 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500/80" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                    <div className="w-3 h-3 rounded-full bg-green-500/80" />
                  </div>
                  <span className="text-sm text-white/40">Niches Hunter Dashboard</span>
                </div>
                <div className="badge text-xs py-1 px-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#BFFF00]" />
                  Live
                </div>
              </div>

              {/* Mock content */}
              <div className="grid md:grid-cols-3 gap-4 mb-6">
                {[
                  { label: "Niches Found", value: "847", trend: "+23%", color: "#BFFF00" },
                  { label: "Avg. Revenue", value: "$12.4K", trend: "+18%", color: "#00FFD1" },
                  { label: "Success Rate", value: "94%", trend: "+5%", color: "#A855F7" },
                ].map((stat, i) => (
                  <div
                    key={i}
                    className="bg-white/5 rounded-xl p-4 border border-white/5"
                  >
                    <div className="text-sm text-white/50 mb-2">{stat.label}</div>
                    <div className="flex items-end justify-between">
                      <span className="text-2xl font-bold">{stat.value}</span>
                      <span
                        className="text-xs font-medium px-2 py-1 rounded-full"
                        style={{ background: `${stat.color}20`, color: stat.color }}
                      >
                        {stat.trend}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Mock chart area */}
              <div className="bg-white/5 rounded-xl p-6 border border-white/5 relative overflow-hidden">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium">Trending Niches This Week</span>
                  <div className="flex gap-2">
                    {["Fitness", "Productivity", "Finance"].map((tag) => (
                      <span key={tag} className="text-xs px-2 py-1 rounded-full bg-white/10 text-white/60">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                {/* Animated bars */}
                <div className="flex items-end gap-3 h-32">
                  {[65, 85, 45, 90, 70, 95, 55, 80, 60, 75, 88, 50].map((h, i) => (
                    <div
                      key={i}
                      className="flex-1 rounded-t-md transition-all duration-500"
                      style={{
                        height: `${h}%`,
                        background: `linear-gradient(180deg, ${i % 2 === 0 ? "#BFFF00" : "#00FFD1"} 0%, transparent 100%)`,
                        opacity: 0.6 + (h / 200),
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Floating badges around the card */}
            <div className="absolute -top-4 -right-4 glass-card px-4 py-2 float-slow">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#BFFF00] to-[#00FFD1] flex items-center justify-center text-black text-xs font-bold">
                  AI
                </div>
                <div>
                  <div className="text-xs font-medium">AI-Powered</div>
                  <div className="text-xs text-white/50">Analysis</div>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-4 -left-4 glass-card px-4 py-2 float-slow" style={{ animationDelay: "1s" }}>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-[#BFFF00]" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
                <div>
                  <div className="text-xs font-medium">4.9 Rating</div>
                  <div className="text-xs text-white/50">2,000+ users</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Logos / Social proof marquee */}
      <section className="py-12 border-y border-white/5 overflow-hidden">
        <div className="flex gap-12 marquee">
          {[...Array(2)].map((_, setIndex) => (
            <div key={setIndex} className="flex gap-12 items-center shrink-0">
              {[
                "Featured on Product Hunt",
                "★★★★★ 4.9/5 Rating",
                "2,000+ Subscribers",
                "Weekly Insights",
                "Data-Driven Analysis",
                "Trusted by Indie Devs",
              ].map((text, i) => (
                <div key={i} className="flex items-center gap-3 text-white/30 whitespace-nowrap">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#BFFF00]" />
                  <span className="text-sm font-medium">{text}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-6 relative">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="badge mb-4">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
              Powerful Features
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Everything you need to{" "}
              <span className="gradient-text">find winning niches</span>
            </h2>
            <p className="text-white/50 text-lg max-w-2xl mx-auto">
              Our AI analyzes thousands of apps daily to surface the best opportunities
              for indie developers like you.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <div key={i} className="glass-card card-shine p-8 group">
                <div className="flex items-start justify-between mb-6">
                  <div className="feature-icon">{feature.icon}</div>
                  <span className="text-xs px-2 py-1 rounded-full bg-white/5 text-white/50">
                    {feature.tag}
                  </span>
                </div>
                <h3 className="text-xl font-semibold mb-3 group-hover:text-[#BFFF00] transition-colors">
                  {feature.title}
                </h3>
                <p className="text-white/50 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 px-6 relative">
        <div className="max-w-6xl mx-auto">
          <div className="glass-card p-12 md:p-16">
            <div className="grid md:grid-cols-4 gap-8 md:gap-4 text-center">
              {[
                { value: "50K+", label: "Niches Analyzed", icon: "📊" },
                { value: "2,000+", label: "Happy Subscribers", icon: "👥" },
                { value: "94%", label: "Open Rate", icon: "📬" },
                { value: "$12.4K", label: "Avg. Niche Revenue", icon: "💰" },
              ].map((stat, i) => (
                <div key={i} className="relative">
                  <div className="text-3xl mb-3">{stat.icon}</div>
                  <div className="stat-number mb-2">{stat.value}</div>
                  <div className="text-white/50 text-sm">{stat.label}</div>
                  {i < 3 && (
                    <div className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 w-px h-16 bg-white/10" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 px-6 relative">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <div className="badge mb-4">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
              </svg>
              Simple Pricing
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Start free,{" "}
              <span className="gradient-text-purple">scale when ready</span>
            </h2>
            <p className="text-white/50 text-lg">
              No credit card required. Upgrade anytime.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free */}
            <div className="pricing-card">
              <div className="mb-8">
                <div className="text-sm text-white/50 mb-2">Free forever</div>
                <h3 className="text-2xl font-bold mb-1">Starter</h3>
                <p className="text-white/50 text-sm">Perfect for getting started</p>
              </div>
              <div className="mb-8">
                <span className="text-5xl font-bold">$0</span>
                <span className="text-white/50 ml-2">/month</span>
              </div>
              <ul className="space-y-4 mb-8">
                {[
                  "Weekly niche reports",
                  "Market trend insights",
                  "Basic competition data",
                  "Community access",
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm">
                    <div className="w-5 h-5 rounded-full bg-[#BFFF00]/10 flex items-center justify-center">
                      <svg className="w-3 h-3 text-[#BFFF00]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
              <a href="#subscribe" className="btn-secondary w-full justify-center">
                Get Started Free
              </a>
            </div>

            {/* Pro */}
            <div className="pricing-card featured">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-[#BFFF00] to-[#00FFD1] text-black text-xs font-bold">
                Most Popular
              </div>
              <div className="mb-8">
                <div className="text-sm text-[#BFFF00] mb-2">Pro Plan</div>
                <h3 className="text-2xl font-bold mb-1">Hunter</h3>
                <p className="text-white/50 text-sm">For serious indie developers</p>
              </div>
              <div className="mb-8">
                <span className="text-5xl font-bold gradient-text">$10</span>
                <span className="text-white/50 ml-2">/month</span>
              </div>
              <ul className="space-y-4 mb-8">
                {[
                  "Everything in Starter",
                  "Daily niche alerts",
                  "Revenue estimates",
                  "Deep competition analysis",
                  "Priority support",
                  "Early access to features",
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm">
                    <div className="w-5 h-5 rounded-full bg-[#BFFF00]/10 flex items-center justify-center">
                      <svg className="w-3 h-3 text-[#BFFF00]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
              <button className="btn-primary w-full justify-center pulse-glow">
                Coming Soon
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-6 relative">
        <div className="max-w-4xl mx-auto">
          <div className="glass-card p-12 md:p-16 text-center relative overflow-hidden">
            {/* Background glow */}
            <div
              className="absolute inset-0 opacity-30"
              style={{
                background: "radial-gradient(ellipse at center, rgba(191,255,0,0.2) 0%, transparent 70%)",
              }}
            />

            <div className="relative">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Ready to find your{" "}
                <span className="gradient-text">next big idea?</span>
              </h2>
              <p className="text-white/50 text-lg mb-8 max-w-xl mx-auto">
                Join thousands of indie developers who receive actionable insights
                every week. 100% free.
              </p>

              <form onSubmit={handleSubmit} className="max-w-md mx-auto">
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                    className="input-glow flex-1"
                  />
                  <button type="submit" className="btn-primary whitespace-nowrap">
                    Subscribe
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-white/5">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#BFFF00] to-[#00FFD1] flex items-center justify-center">
              <svg className="w-4 h-4 text-black" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
            <span className="font-semibold">Niches Hunter</span>
          </div>

          <div className="flex items-center gap-6 text-sm text-white/40">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Contact</a>
          </div>

          <div className="text-sm text-white/40">
            © 2024 Niches Hunter. All rights reserved.
          </div>
        </div>
      </footer>
    </main>
  );
}
