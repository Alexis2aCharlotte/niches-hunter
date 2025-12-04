"use client";

import { useState } from "react";

export default function Home() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Email submitted:", email);
    setEmail("");
    alert("You're in! Check your inbox 🎉");
  };

  return (
    <main className="min-h-screen bg-gradient-subtle">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-[#262626] bg-[#0C0C0C]/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#FF6B35] flex items-center justify-center">
              <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35" />
              </svg>
            </div>
            <span className="font-semibold text-lg">Niches Hunter</span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-[#A1A1A1] hover:text-white transition-colors text-sm">
              Features
            </a>
            <a href="#pricing" className="text-[#A1A1A1] hover:text-white transition-colors text-sm">
              Pricing
            </a>
          </div>

          <a href="#subscribe" className="btn-primary text-sm py-2.5 px-5">
            Subscribe Free
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="badge mb-6 opacity-0 animate-fade-in">
            <span className="w-2 h-2 rounded-full bg-[#FF6B35]" />
            Free weekly newsletter for iOS developers
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] mb-6 opacity-0 animate-fade-in animation-delay-100">
            Spot profitable iOS
            <br />
            <span className="text-accent">niches before anyone</span>
          </h1>

          <p className="text-lg md:text-xl text-[#A1A1A1] max-w-2xl mx-auto mb-10 leading-relaxed opacity-0 animate-fade-in animation-delay-200">
            Every week, get curated insights on untapped App Store opportunities.
            Data-driven niche ideas that actually work.
          </p>

          {/* Email Form */}
          <form
            id="subscribe"
            onSubmit={handleSubmit}
            className="max-w-md mx-auto mb-6 opacity-0 animate-fade-in animation-delay-300"
          >
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="input-field flex-1"
              />
              <button type="submit" className="btn-primary whitespace-nowrap">
                Get Free Access
              </button>
            </div>
          </form>

          <p className="text-sm text-[#A1A1A1] opacity-0 animate-fade-in animation-delay-400">
            Join 2,000+ indie developers · No spam, unsubscribe anytime
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-6 border-y border-[#262626]">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4">
            {[
              { value: "50K+", label: "Niches analyzed" },
              { value: "2,000+", label: "Subscribers" },
              { value: "94%", label: "Open rate" },
              { value: "Weekly", label: "Fresh insights" },
            ].map((stat, i) => (
              <div key={i} className="text-center stats-line">
                <div className="text-3xl md:text-4xl font-bold mb-1">{stat.value}</div>
                <div className="text-sm text-[#A1A1A1]">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-accent text-sm font-medium mb-3">What you get</p>
            <h2 className="text-3xl md:text-4xl font-bold">
              Everything to find your next winning app
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                num: "01",
                title: "Niche Discovery",
                desc: "Hand-picked niches with low competition and proven demand. No guesswork, just opportunities.",
                icon: (
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="11" cy="11" r="8" />
                    <path d="M21 21l-4.35-4.35" />
                  </svg>
                ),
              },
              {
                num: "02",
                title: "Market Insights",
                desc: "Understand what's trending, what's dying, and where the real money is being made.",
                icon: (
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 3v18h18" />
                    <path d="M7 16l4-4 4 4 5-6" />
                  </svg>
                ),
              },
              {
                num: "03",
                title: "Actionable Ideas",
                desc: "Not just data—concrete app concepts you can start building this weekend.",
                icon: (
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2L2 7l10 5 10-5-10-5z" />
                    <path d="M2 17l10 5 10-5M2 12l10 5 10-5" />
                  </svg>
                ),
              },
            ].map((feature, i) => (
              <div key={i} className="card p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-[#1C1C1C] flex items-center justify-center text-accent">
                    {feature.icon}
                  </div>
                  <span className="feature-number">{feature.num}</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-[#A1A1A1] text-sm leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 px-6 border-t border-[#262626]">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-accent text-sm font-medium mb-3">Simple process</p>
            <h2 className="text-3xl md:text-4xl font-bold">
              How it works
            </h2>
          </div>

          <div className="space-y-8">
            {[
              {
                step: "1",
                title: "Subscribe for free",
                desc: "Enter your email and you're in. Takes 5 seconds.",
              },
              {
                step: "2",
                title: "Get weekly insights",
                desc: "Every Sunday, receive a curated list of niches with market data.",
              },
              {
                step: "3",
                title: "Build & launch",
                desc: "Pick a niche, build your app, and start generating revenue.",
              },
            ].map((item, i) => (
              <div key={i} className="flex gap-6 items-start">
                <div className="w-10 h-10 rounded-full bg-[#161616] border border-[#262626] flex items-center justify-center font-mono text-sm text-accent shrink-0">
                  {item.step}
                </div>
                <div className="pt-1">
                  <h3 className="font-semibold text-lg mb-1">{item.title}</h3>
                  <p className="text-[#A1A1A1]">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 px-6 border-t border-[#262626]">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-accent text-sm font-medium mb-3">Pricing</p>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Start free, upgrade when ready
            </h2>
            <p className="text-[#A1A1A1]">
              The free tier gives you everything you need to get started.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {/* Free */}
            <div className="card p-8">
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-1">Free</h3>
                <p className="text-sm text-[#A1A1A1]">For indie devs getting started</p>
              </div>
              <div className="mb-6">
                <span className="text-4xl font-bold">$0</span>
                <span className="text-[#A1A1A1] ml-1">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                {[
                  "Weekly niche reports",
                  "Market trend analysis",
                  "App Store insights",
                  "Community access",
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm">
                    <svg className="w-4 h-4 text-accent shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
              <a href="#subscribe" className="btn-secondary block text-center text-sm">
                Get started free
              </a>
            </div>

            {/* Pro */}
            <div className="card p-8 relative border-accent glow">
              <div className="popular-badge">Popular</div>
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-1">Pro</h3>
                <p className="text-sm text-[#A1A1A1]">For serious niche hunters</p>
              </div>
              <div className="mb-6">
                <span className="text-4xl font-bold">$10</span>
                <span className="text-[#A1A1A1] ml-1">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                {[
                  "Everything in Free",
                  "Daily niche alerts",
                  "Revenue estimates",
                  "Competition analysis",
                  "Priority support",
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm">
                    <svg className="w-4 h-4 text-accent shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
              <button className="btn-primary w-full text-sm">
                Coming soon
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-6 border-t border-[#262626]">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to find your next app idea?
          </h2>
          <p className="text-[#A1A1A1] mb-8">
            Join thousands of indie devs who receive actionable insights every week.
          </p>

          <form onSubmit={handleSubmit} className="max-w-md mx-auto">
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="input-field flex-1"
              />
              <button type="submit" className="btn-primary whitespace-nowrap">
                Subscribe Free
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-[#262626]">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-[#FF6B35] flex items-center justify-center">
              <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35" />
              </svg>
            </div>
            <span className="font-medium text-sm">Niches Hunter</span>
          </div>

          <div className="flex items-center gap-6 text-sm text-[#A1A1A1]">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Contact</a>
          </div>

          <div className="text-sm text-[#A1A1A1]">
            © 2024 Niches Hunter
          </div>
        </div>
      </footer>
    </main>
  );
}
