"use client";

import { useState, useEffect } from "react";

// Icons as SVG components
const RadarIcon = () => (
  <svg
    className="w-6 h-6"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
  >
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="6" />
    <circle cx="12" cy="12" r="2" />
    <line x1="12" y1="2" x2="12" y2="12" />
  </svg>
);

const ChartIcon = () => (
  <svg
    className="w-6 h-6"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
  >
    <path d="M3 3v18h18" />
    <path d="M7 16l4-4 4 4 5-6" />
  </svg>
);

const SparkleIcon = () => (
  <svg
    className="w-6 h-6"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
  >
    <path d="M12 3l1.5 5.5L19 10l-5.5 1.5L12 17l-1.5-5.5L5 10l5.5-1.5L12 3z" />
    <path d="M5 3l.5 2L7 5.5 5.5 6 5 8l-.5-2L3 5.5 4.5 5 5 3z" />
    <path d="M19 17l.5 2 1.5.5-1.5.5-.5 2-.5-2-1.5-.5 1.5-.5.5-2z" />
  </svg>
);

const CheckIcon = () => (
  <svg
    className="w-5 h-5 text-primary"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M20 6L9 17l-5-5" />
  </svg>
);

export default function Home() {
  const [scrollY, setScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState("");

  useEffect(() => {
    setIsVisible(true);
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle newsletter signup
    console.log("Email submitted:", email);
    setEmail("");
    alert("Thanks for subscribing! 🎉");
  };

  const freeFeatures = [
    "Weekly curated iOS niche opportunities",
    "Market trends & insights",
    "App Store algorithm updates",
    "Success stories & case studies",
  ];

  const proFeatures = [
    "Everything in Free",
    "Daily niche alerts",
    "Detailed market analysis",
    "Revenue estimates",
    "Competition scores",
    "Priority support",
  ];

  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* Background effects */}
      <div className="fixed inset-0 grid-bg opacity-50" />
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />

      {/* Navigation */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrollY > 50 ? "glass py-4" : "py-6"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary via-secondary to-accent flex items-center justify-center">
              <svg
                className="w-6 h-6 text-white"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
            <span className="text-xl font-bold tracking-tight">
              Niches<span className="gradient-text">Hunter</span>
            </span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <a
              href="#features"
              className="text-gray-400 hover:text-white transition-colors"
            >
              Features
            </a>
            <a
              href="#pricing"
              className="text-gray-400 hover:text-white transition-colors"
            >
              Pricing
            </a>
          </div>

          <a
            href="#subscribe"
            className="px-6 py-2.5 rounded-full bg-gradient-to-r from-primary to-secondary text-black font-semibold hover:opacity-90 transition-opacity glow-primary"
          >
            Subscribe Free
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-6 pt-20">
        <div
          className={`max-w-4xl mx-auto text-center transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8 text-sm">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-gray-300">Free Weekly Newsletter</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6">
            Find Your Next
            <br />
            <span className="gradient-text">Winning iOS Niche</span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-400 max-w-2xl mx-auto mb-12 leading-relaxed">
            Get weekly insights on untapped App Store opportunities. Discover
            profitable niches before everyone else.
          </p>

          {/* Newsletter Signup Form */}
          <form
            id="subscribe"
            onSubmit={handleSubmit}
            className="max-w-xl mx-auto mb-8"
          >
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="w-full px-6 py-4 rounded-full bg-dark-800 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>
              <button
                type="submit"
                className="px-8 py-4 rounded-full bg-gradient-to-r from-primary via-secondary to-accent text-black font-bold text-lg hover:scale-105 transition-transform glow-primary pulse-border whitespace-nowrap"
              >
                Subscribe Free
              </button>
            </div>
            <p className="text-gray-500 text-sm mt-4">
              Join 2,000+ indie developers. Unsubscribe anytime.
            </p>
          </form>

          {/* Social Proof */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/30 to-secondary/30 border-2 border-dark-900 flex items-center justify-center text-xs"
                  >
                    {["🚀", "💎", "⚡", "🎯"][i - 1]}
                  </div>
                ))}
              </div>
              <span>2,000+ subscribers</span>
            </div>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <svg
                  key={i}
                  className="w-4 h-4 text-yellow-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
              <span className="ml-1">Loved by devs</span>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <svg
            className="w-6 h-6 text-gray-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </div>
      </section>

      {/* What You Get Section */}
      <section id="features" className="relative py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <span className="inline-block px-4 py-1 rounded-full glass text-primary text-sm font-medium mb-4">
              WHAT YOU GET
            </span>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Everything you need to
              <br />
              <span className="gradient-text">spot opportunities</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <RadarIcon />,
                title: "Niche Discovery",
                description:
                  "Hand-picked iOS niches with low competition and high demand, delivered to your inbox weekly.",
              },
              {
                icon: <ChartIcon />,
                title: "Market Insights",
                description:
                  "Understand trends, seasonality, and what's working right now in the App Store.",
              },
              {
                icon: <SparkleIcon />,
                title: "Actionable Ideas",
                description:
                  "Not just data—concrete app ideas you can build and launch this month.",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="group gradient-border p-8 rounded-2xl hover:scale-[1.02] transition-all duration-300"
              >
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="relative py-32 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1 rounded-full glass text-accent text-sm font-medium mb-4">
              PRICING
            </span>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Start free,
              <br />
              <span className="gradient-text">upgrade when ready</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Free Plan */}
            <div className="gradient-border p-8 rounded-2xl">
              <div className="mb-6">
                <h3 className="text-2xl font-bold mb-2">Free</h3>
                <p className="text-gray-400">Perfect to get started</p>
              </div>
              <div className="mb-8">
                <span className="text-5xl font-bold">$0</span>
                <span className="text-gray-400">/month</span>
              </div>
              <ul className="space-y-4 mb-8">
                {freeFeatures.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckIcon />
                    <span className="text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>
              <a
                href="#subscribe"
                className="block w-full py-4 rounded-full glass text-white font-semibold text-center hover:bg-white/10 transition-colors"
              >
                Subscribe Free
              </a>
            </div>

            {/* Pro Plan */}
            <div className="relative gradient-border p-8 rounded-2xl overflow-hidden">
              <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-gradient-to-r from-primary to-secondary text-black text-xs font-bold">
                POPULAR
              </div>
              <div className="mb-6">
                <h3 className="text-2xl font-bold mb-2">Pro</h3>
                <p className="text-gray-400">For serious hunters</p>
              </div>
              <div className="mb-8">
                <span className="text-5xl font-bold gradient-text">$10</span>
                <span className="text-gray-400">/month</span>
              </div>
              <ul className="space-y-4 mb-8">
                {proFeatures.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckIcon />
                    <span className="text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>
              <button className="w-full py-4 rounded-full bg-gradient-to-r from-primary via-secondary to-accent text-black font-bold hover:scale-[1.02] transition-transform glow-primary">
                Coming Soon
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative py-32 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to find your
            <br />
            <span className="gradient-text">next big idea?</span>
          </h2>
          <p className="text-gray-400 text-lg mb-8">
            Join thousands of developers who receive our weekly insights.
          </p>

          <form onSubmit={handleSubmit} className="max-w-md mx-auto">
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="flex-1 px-6 py-4 rounded-full bg-dark-800 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all"
              />
              <button
                type="submit"
                className="px-8 py-4 rounded-full bg-gradient-to-r from-primary to-secondary text-black font-bold hover:scale-105 transition-transform glow-primary"
              >
                Join Free
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-16 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary via-secondary to-accent flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-white"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
              </div>
              <span className="font-bold">
                Niches<span className="gradient-text">Hunter</span>
              </span>
            </div>

            <div className="flex items-center gap-8 text-sm text-gray-500">
              <a href="#" className="hover:text-white transition-colors">
                Privacy
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Terms
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Contact
              </a>
            </div>

            <div className="text-gray-500 text-sm">
              © 2024 Niches Hunter. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
