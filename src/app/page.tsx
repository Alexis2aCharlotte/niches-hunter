"use client";

import { useState } from "react";

export default function Home() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Email submitted:", email);
    setEmail("");
    alert("Welcome aboard! 🚀");
  };

  return (
    <main className="min-h-screen relative">
      {/* Liquid Background */}
      <div className="liquid-bg">
        <div className="liquid-blob blob-1" />
        <div className="liquid-blob blob-2" />
        <div className="liquid-blob blob-3" />
        <div className="liquid-blob blob-4" />
        <div className="liquid-blob blob-5" />
      </div>
      <div className="noise-overlay" />

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-5">
        <div className="max-w-6xl mx-auto">
          <div className="nav-glass px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#8b5cf6] to-[#06b6d4] flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="11" cy="11" r="8" />
                    <path d="M21 21l-4.35-4.35" />
                  </svg>
                </div>
                <span className="font-semibold text-lg">Niches Hunter</span>
              </div>

              <div className="hidden md:flex items-center gap-2">
                {["Features", "Pricing"].map((item) => (
                  <a
                    key={item}
                    href={`#${item.toLowerCase()}`}
                    className="px-5 py-2.5 text-sm text-white/50 hover:text-white hover:bg-white/5 rounded-xl transition-all"
                  >
                    {item}
                  </a>
                ))}
              </div>

              <a href="#subscribe" className="btn-glow text-sm py-3 px-6">
                Get Started
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-48 pb-24 px-6 z-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <div className="badge-glass mb-8 animate-fade-up">
              <span className="w-2 h-2 rounded-full bg-[#8b5cf6] animate-pulse" />
              Free weekly newsletter
            </div>

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold leading-[1.05] mb-8 animate-fade-up delay-1">
              Find iOS niches
              <br />
              <span className="gradient-text">that actually work</span>
            </h1>

            <p className="text-xl md:text-2xl text-white/40 max-w-2xl mx-auto mb-14 leading-relaxed animate-fade-up delay-2">
              Weekly insights on untapped App Store opportunities.
              Built for indie developers.
            </p>

            {/* Email Form - Big Liquid Glass Card */}
            <div
              id="subscribe"
              className="liquid-glass shine-effect p-4 max-w-xl mx-auto animate-fade-up delay-3"
            >
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="glass-input flex-1"
                />
                <button type="submit" className="btn-glow whitespace-nowrap">
                  Subscribe Free
                </button>
              </form>
            </div>

            <p className="text-sm text-white/25 mt-6 animate-fade-up delay-4">
              Join 2,000+ developers · No spam
            </p>
          </div>

          {/* Stats - Big Liquid Glass Card */}
          <div className="liquid-glass shine-effect p-12 md:p-16">
            <div className="grid md:grid-cols-4 gap-10 md:gap-6">
              {[
                { value: "50K+", label: "Niches analyzed" },
                { value: "2,000+", label: "Subscribers" },
                { value: "94%", label: "Open rate" },
                { value: "$12K", label: "Avg. revenue" },
              ].map((stat, i) => (
                <div key={i} className="text-center relative">
                  <div className="text-4xl md:text-5xl font-bold mb-3 gradient-text-subtle">
                    {stat.value}
                  </div>
                  <div className="text-white/30 text-sm">{stat.label}</div>
                  {i < 3 && (
                    <div className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 w-px h-16 bg-white/5" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features - 3 Big Liquid Glass Cards */}
      <section id="features" className="py-24 px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Everything you need
            </h2>
            <p className="text-xl text-white/30 max-w-lg mx-auto">
              Actionable insights, not just data
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: (
                  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <circle cx="11" cy="11" r="8" />
                    <path d="M21 21l-4.35-4.35" />
                    <path d="M11 8v6M8 11h6" />
                  </svg>
                ),
                title: "Niche Discovery",
                desc: "Hand-picked opportunities with low competition and high demand.",
                color: "#00d4ff",
              },
              {
                icon: (
                  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M3 3v18h18" />
                    <path d="M7 16l4-4 4 4 5-6" />
                  </svg>
                ),
                title: "Market Analysis",
                desc: "Deep insights into revenue potential and competition levels.",
                color: "#8b5cf6",
              },
              {
                icon: (
                  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                  </svg>
                ),
                title: "Instant Ideas",
                desc: "Concrete app concepts you can start building this weekend.",
                color: "#ec4899",
              },
            ].map((feature, i) => (
              <div key={i} className="liquid-glass shine-effect p-10 md:p-12 group">
                <div className="icon-glow mb-8" style={{ color: feature.color }}>
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-semibold mb-4 group-hover:text-white/90 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-white/35 text-lg leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works - Horizontal Liquid Glass Card */}
      <section className="py-24 px-6 relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="liquid-glass shine-effect p-12 md:p-20">
            <h2 className="text-3xl md:text-4xl font-bold mb-16 text-center">
              How it works
            </h2>

            <div className="grid md:grid-cols-3 gap-12 md:gap-8">
              {[
                { num: "01", title: "Subscribe", desc: "Enter your email and join the community." },
                { num: "02", title: "Get insights", desc: "Receive curated niches every Sunday." },
                { num: "03", title: "Build & ship", desc: "Pick an idea and start earning." },
              ].map((step, i) => (
                <div key={i} className="text-center">
                  <div className="text-7xl font-bold gradient-text opacity-20 mb-6">
                    {step.num}
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                  <p className="text-white/35">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing - Two Liquid Glass Cards */}
      <section id="pricing" className="py-24 px-6 relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Simple pricing
            </h2>
            <p className="text-xl text-white/30">
              Start free, upgrade when ready
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Free */}
            <div className="liquid-glass shine-effect p-10 md:p-12">
              <div className="mb-8">
                <div className="text-sm text-white/30 mb-2">Free forever</div>
                <h3 className="text-2xl font-bold">Starter</h3>
              </div>

              <div className="mb-10">
                <span className="text-6xl font-bold">$0</span>
                <span className="text-white/30 ml-2">/month</span>
              </div>

              <ul className="space-y-5 mb-10">
                {[
                  "Weekly niche reports",
                  "Market trend analysis",
                  "Basic app insights",
                  "Community access",
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-4">
                    <div className="check-circle">
                      <svg className="w-3 h-3 text-[#8b5cf6]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
                    </div>
                    <span className="text-white/50">{item}</span>
                  </li>
                ))}
              </ul>

              <a href="#subscribe" className="btn-ghost w-full flex items-center justify-center">
                Get started free
              </a>
            </div>

            {/* Pro */}
            <div className="liquid-glass shine-effect p-10 md:p-12 pricing-featured relative">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <div className="badge-glass text-xs py-2 px-4">
                  Most popular
                </div>
              </div>

              <div className="mb-8">
                <div className="text-sm text-[#8b5cf6] mb-2">For power users</div>
                <h3 className="text-2xl font-bold">Pro</h3>
              </div>

              <div className="mb-10">
                <span className="text-6xl font-bold gradient-text">$10</span>
                <span className="text-white/30 ml-2">/month</span>
              </div>

              <ul className="space-y-5 mb-10">
                {[
                  "Everything in Starter",
                  "Daily niche alerts",
                  "Revenue estimates",
                  "Competition scores",
                  "Priority support",
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-4">
                    <div className="check-circle">
                      <svg className="w-3 h-3 text-[#8b5cf6]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
                    </div>
                    <span className="text-white/50">{item}</span>
                  </li>
                ))}
              </ul>

              <button className="btn-glow w-full">
                Coming soon
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA - Big Liquid Glass Card */}
      <section className="py-24 px-6 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="liquid-glass shine-effect p-14 md:p-24 text-center relative overflow-hidden">
            {/* Inner glow */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: "radial-gradient(ellipse at 50% 50%, rgba(139, 92, 246, 0.1) 0%, transparent 60%)",
              }}
            />

            <div className="relative">
              <h2 className="text-4xl md:text-6xl font-bold mb-6">
                Ready to find your
                <br />
                <span className="gradient-text">next big idea?</span>
              </h2>

              <p className="text-xl text-white/35 mb-12 max-w-lg mx-auto">
                Join thousands of developers discovering profitable niches.
              </p>

              <form onSubmit={handleSubmit} className="max-w-md mx-auto">
                <div className="liquid-glass-sm p-2 flex flex-col sm:flex-row gap-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                    className="flex-1 bg-transparent px-5 py-4 text-white placeholder-white/25 outline-none"
                  />
                  <button type="submit" className="btn-glow whitespace-nowrap">
                    Subscribe
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-6 relative z-10 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#8b5cf6] to-[#06b6d4] flex items-center justify-center">
                <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8" />
                  <path d="M21 21l-4.35-4.35" />
                </svg>
              </div>
              <span className="font-medium">Niches Hunter</span>
            </div>

            <div className="flex items-center gap-8 text-sm text-white/25">
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Terms</a>
              <a href="#" className="hover:text-white transition-colors">Contact</a>
            </div>

            <div className="text-sm text-white/25">
              © 2024 Niches Hunter
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
