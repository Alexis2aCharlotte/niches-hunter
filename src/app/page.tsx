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
    <main className="min-h-screen relative">
      {/* Background */}
      <div className="bg-mesh" />

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
        <div className="max-w-6xl mx-auto">
          <div className="nav-blur rounded-2xl border border-white/5 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#818CF8] to-[#38BDF8] flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="11" cy="11" r="8" />
                    <path d="M21 21l-4.35-4.35" />
                  </svg>
                </div>
                <span className="font-semibold text-lg">Niches Hunter</span>
              </div>

              <div className="hidden md:flex items-center gap-8">
                <a href="#features" className="text-white/50 hover:text-white transition-colors text-sm">Features</a>
                <a href="#pricing" className="text-white/50 hover:text-white transition-colors text-sm">Pricing</a>
              </div>

              <a href="#subscribe" className="btn-gradient text-sm py-3 px-6">
                Get Started
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-44 pb-24 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Hero content */}
          <div className="text-center mb-20">
            <div className="badge mb-8 animate-fade-up">
              <span className="w-2 h-2 rounded-full bg-[#818CF8]" />
              Free weekly newsletter
            </div>

            <h1 className="text-5xl md:text-7xl font-bold leading-[1.1] mb-8 animate-fade-up delay-100">
              Find winning iOS niches
              <br />
              <span className="gradient-text">before the crowd</span>
            </h1>

            <p className="text-xl text-white/50 max-w-2xl mx-auto mb-12 leading-relaxed animate-fade-up delay-200">
              Every week, receive curated insights on untapped App Store opportunities.
              Built for indie developers who want to ship profitable apps.
            </p>

            {/* Email signup - Big glass card */}
            <div className="glass p-3 max-w-xl mx-auto animate-fade-up delay-300" id="subscribe">
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="glass-input flex-1 text-center sm:text-left"
                />
                <button type="submit" className="btn-gradient whitespace-nowrap">
                  Subscribe Free
                </button>
              </form>
            </div>

            <p className="text-sm text-white/30 mt-6 animate-fade-up delay-400">
              Join 2,000+ developers · No spam · Unsubscribe anytime
            </p>
          </div>

          {/* Big glass stats card */}
          <div className="glass p-10 md:p-14 animate-fade-up delay-400">
            <div className="grid md:grid-cols-4 gap-10 md:gap-6">
              {[
                { value: "50K+", label: "Niches analyzed weekly" },
                { value: "2,000+", label: "Happy subscribers" },
                { value: "94%", label: "Email open rate" },
                { value: "$12K", label: "Avg. niche revenue" },
              ].map((stat, i) => (
                <div key={i} className="text-center stat-glow pt-6">
                  <div className="text-4xl md:text-5xl font-bold mb-3 gradient-text">
                    {stat.value}
                  </div>
                  <div className="text-white/40 text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features - Big glass cards */}
      <section id="features" className="py-24 px-6 relative">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Everything you need
            </h2>
            <p className="text-xl text-white/40 max-w-xl mx-auto">
              Actionable insights delivered straight to your inbox
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: (
                  <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <circle cx="11" cy="11" r="8" />
                    <path d="M21 21l-4.35-4.35" />
                    <path d="M11 8v6M8 11h6" />
                  </svg>
                ),
                title: "Niche Discovery",
                description: "Hand-picked opportunities with low competition and high potential. Updated every week.",
              },
              {
                icon: (
                  <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M3 3v18h18" />
                    <path d="M7 16l4-4 4 4 5-6" />
                  </svg>
                ),
                title: "Market Analysis",
                description: "Deep-dive into revenue potential, competition levels, and growth trends.",
              },
              {
                icon: (
                  <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M12 2L2 7l10 5 10-5-10-5z" />
                    <path d="M2 17l10 5 10-5" />
                    <path d="M2 12l10 5 10-5" />
                  </svg>
                ),
                title: "App Ideas",
                description: "Concrete concepts you can start building right away. Not just data—real ideas.",
              },
            ].map((feature, i) => (
              <div key={i} className="glass glass-hover p-10">
                <div className="icon-box mb-8">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-4">{feature.title}</h3>
                <p className="text-white/40 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works - Big horizontal glass card */}
      <section className="py-24 px-6 relative">
        <div className="max-w-6xl mx-auto">
          <div className="glass p-10 md:p-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
              How it works
            </h2>

            <div className="grid md:grid-cols-3 gap-12 md:gap-8">
              {[
                {
                  step: "01",
                  title: "Subscribe",
                  description: "Enter your email and join 2,000+ indie developers.",
                },
                {
                  step: "02",
                  title: "Get insights",
                  description: "Receive curated niche opportunities every Sunday.",
                },
                {
                  step: "03",
                  title: "Build & ship",
                  description: "Pick an idea, build your app, and start earning.",
                },
              ].map((item, i) => (
                <div key={i} className="text-center">
                  <div className="text-6xl font-bold gradient-text mb-6 opacity-30">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                  <p className="text-white/40">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing - Two big glass cards */}
      <section id="pricing" className="py-24 px-6 relative">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Simple pricing
            </h2>
            <p className="text-xl text-white/40">
              Start free, upgrade when you need more
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Free */}
            <div className="glass glass-hover p-10">
              <div className="mb-8">
                <div className="text-sm text-white/40 mb-2">Free forever</div>
                <h3 className="text-2xl font-bold">Starter</h3>
              </div>

              <div className="mb-8">
                <span className="text-5xl font-bold">$0</span>
                <span className="text-white/40 ml-2">/month</span>
              </div>

              <div className="divider mb-8" />

              <ul className="space-y-4 mb-10">
                {[
                  "Weekly niche reports",
                  "Market trend analysis",
                  "Basic app insights",
                  "Community access",
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-4">
                    <div className="check-icon">
                      <svg className="w-3 h-3 text-[#818CF8]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
                    </div>
                    <span className="text-white/70">{item}</span>
                  </li>
                ))}
              </ul>

              <a href="#subscribe" className="btn-ghost w-full flex items-center justify-center">
                Get started free
              </a>
            </div>

            {/* Pro */}
            <div className="glass glass-hover p-10 pricing-featured">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <div className="badge text-xs py-2 px-4">
                  Most popular
                </div>
              </div>

              <div className="mb-8">
                <div className="text-sm text-[#818CF8] mb-2">For power users</div>
                <h3 className="text-2xl font-bold">Pro</h3>
              </div>

              <div className="mb-8">
                <span className="text-5xl font-bold gradient-text">$10</span>
                <span className="text-white/40 ml-2">/month</span>
              </div>

              <div className="divider mb-8" />

              <ul className="space-y-4 mb-10">
                {[
                  "Everything in Starter",
                  "Daily niche alerts",
                  "Revenue estimates",
                  "Competition scores",
                  "Priority support",
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-4">
                    <div className="check-icon">
                      <svg className="w-3 h-3 text-[#818CF8]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
                    </div>
                    <span className="text-white/70">{item}</span>
                  </li>
                ))}
              </ul>

              <button className="btn-gradient w-full">
                Coming soon
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA - Big glass card */}
      <section className="py-24 px-6 relative">
        <div className="max-w-4xl mx-auto">
          <div className="glass p-12 md:p-20 text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to find your
              <br />
              <span className="gradient-text">next winning app?</span>
            </h2>

            <p className="text-xl text-white/40 mb-10 max-w-xl mx-auto">
              Join thousands of indie developers discovering profitable niches every week.
            </p>

            <form onSubmit={handleSubmit} className="max-w-md mx-auto">
              <div className="glass p-2 flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  className="flex-1 bg-transparent px-5 py-4 text-white placeholder-white/30 outline-none text-center sm:text-left"
                />
                <button type="submit" className="btn-gradient whitespace-nowrap">
                  Subscribe
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-6 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#818CF8] to-[#38BDF8] flex items-center justify-center">
                <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8" />
                  <path d="M21 21l-4.35-4.35" />
                </svg>
              </div>
              <span className="font-medium">Niches Hunter</span>
            </div>

            <div className="flex items-center gap-8 text-sm text-white/30">
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Terms</a>
              <a href="#" className="hover:text-white transition-colors">Contact</a>
            </div>

            <div className="text-sm text-white/30">
              © 2024 Niches Hunter
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
