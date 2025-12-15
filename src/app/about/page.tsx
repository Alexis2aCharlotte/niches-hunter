"use client";

import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function AboutPage() {
  return (
    <main className="min-h-screen relative overflow-hidden text-white font-sans selection:bg-[#00CC3D] selection:text-black">
      <Navbar />

      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-blue-500/5 blur-[200px] rounded-full" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-[var(--primary)]/5 blur-[150px] rounded-full" />
      </div>

      {/* Hero */}
      <section className="relative pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 mb-6">
            <span className="text-sm">👋</span>
            <span className="text-xs font-mono text-blue-400 uppercase tracking-wider">Our Story</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
            Building the <span className="text-flashy-green">Future</span> of App Discovery
          </h1>
          <p className="text-xl text-white/50 max-w-2xl mx-auto leading-relaxed">
            We're on a mission to help indie developers find profitable opportunities before they become overcrowded.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="relative px-6 pb-20">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">
                Why We <span className="text-[var(--primary)]">Exist</span>
              </h2>
              <div className="space-y-4 text-white/60 leading-relaxed">
                <p>
                  Every day, thousands of developers build apps that nobody downloads. Not because they lack skill, but because they lack <strong className="text-white">market intelligence</strong>.
                </p>
                <p>
                  We've been there. We've built apps that flopped. We've wasted months on ideas that were either too competitive or had no demand.
                </p>
                <p>
                  So we built Niches Hunter — the tool we wished existed when we started. <strong className="text-white">Real data. Real opportunities. Zero guesswork.</strong>
                </p>
              </div>
            </div>
            <div className="liquid-card p-8 text-center">
              <div className="text-6xl mb-4">🎯</div>
              <div className="text-4xl font-bold text-[var(--primary)] mb-2">40,000+</div>
              <div className="text-white/50">Apps tracked daily</div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="relative px-6 pb-20">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Our <span className="text-[var(--primary)]">Values</span>
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: "🔍",
                title: "Data Over Hype",
                description: "We don't chase trends. We analyze data to find real opportunities before they're obvious to everyone.",
              },
              {
                icon: "⚡",
                title: "Speed Matters",
                description: "In the app world, timing is everything. We help you move fast with validated insights.",
              },
              {
                icon: "🤝",
                title: "Indie First",
                description: "We're indie developers ourselves. Everything we build is designed for solo founders and small teams.",
              },
            ].map((value, i) => (
              <div key={i} className="liquid-card p-8 text-center">
                <div className="text-4xl mb-4">{value.icon}</div>
                <h3 className="text-xl font-bold mb-3">{value.title}</h3>
                <p className="text-sm text-white/50 leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="relative px-6 pb-20">
        <div className="max-w-5xl mx-auto">
          <div className="liquid-card p-1 rounded-3xl">
            <div className="bg-[#080808] rounded-[22px] p-10 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-[var(--primary)]/5 to-transparent" />
              <div className="relative z-10 grid md:grid-cols-4 gap-8 text-center">
                {[
                  { value: "2,100+", label: "Builders subscribed" },
                  { value: "$2.4M", label: "Revenue tracked" },
                  { value: "40K+", label: "Apps monitored" },
                  { value: "12", label: "Markets covered" },
                ].map((stat, i) => (
                  <div key={i}>
                    <div className="text-3xl md:text-4xl font-bold text-[var(--primary)] mb-2">{stat.value}</div>
                    <div className="text-sm text-white/50">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="relative px-6 pb-20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">
            Built by <span className="text-[var(--primary)]">Indie Hackers</span>
          </h2>
          <p className="text-white/50 mb-10 max-w-xl mx-auto">
            We're a small team of developers who got tired of building apps nobody wanted. Now we help others avoid our mistakes.
          </p>
          <div className="flex justify-center gap-6">
            <div className="liquid-card p-6 text-center">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[var(--primary)] to-[var(--primary)]/50 flex items-center justify-center text-3xl mx-auto mb-4">
                🧑‍💻
              </div>
              <div className="font-bold mb-1">Founder</div>
              <div className="text-xs text-white/40">Data & Product</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative px-6 pb-24">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Hunt?</h2>
          <p className="text-white/50 mb-8">Join 2,100+ builders getting daily niche ideas.</p>
          <Link 
            href="/"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-[var(--primary)] text-black font-bold hover:bg-[#00E847] transition-all shadow-[0_0_30px_rgba(0,204,61,0.3)]"
          >
            Start Hunting Free →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative px-6 py-10 border-t border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <span className="font-bold text-sm tracking-widest text-white/40">NICHES HUNTER</span>
          <div className="flex items-center gap-6 text-xs text-white/30">
            <Link href="#" className="hover:text-white transition-colors">Privacy</Link>
            <Link href="#" className="hover:text-white transition-colors">Terms</Link>
            <Link href="#" className="hover:text-white transition-colors">Twitter</Link>
          </div>
          <span className="text-xs text-white/20">© 2024 Niches Hunter. All rights reserved.</span>
        </div>
      </footer>
    </main>
  );
}

