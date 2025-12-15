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

      {/* Coming Soon Content */}
      <section className="relative pt-32 pb-20 px-6 min-h-[80vh] flex items-center justify-center">
        <div className="max-w-2xl mx-auto text-center">
          {/* Soon Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/20 border border-blue-500/30 mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            <span className="text-sm font-bold text-blue-400 uppercase tracking-wider">Coming Soon</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
            About <span className="text-flashy-green">Us</span>
          </h1>
          
          <p className="text-lg text-white/50 max-w-xl mx-auto mb-10 leading-relaxed">
            We're building the future of app discovery. Our story is coming soon — but for now, let's focus on helping you find your next profitable niche.
          </p>

          {/* Quick Stats */}
          <div className="liquid-card p-8 mb-12">
            <div className="grid grid-cols-3 gap-6">
              {[
                { value: "40K+", label: "Apps tracked" },
                { value: "2,100+", label: "Builders" },
                { value: "12", label: "Markets" },
              ].map((stat, i) => (
                <div key={i}>
                  <div className="text-2xl md:text-3xl font-bold text-[var(--primary)] mb-1">{stat.value}</div>
                  <div className="text-xs text-white/50">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          <Link 
            href="/"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-[var(--primary)] text-black font-bold hover:bg-[#00E847] transition-all shadow-[0_0_30px_rgba(0,204,61,0.3)]"
          >
            ← Back to Home
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative px-6 py-10 border-t border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <span className="font-bold text-sm tracking-widest text-white/40">NICHES HUNTER</span>
          <span className="text-xs text-white/20">© 2024 Niches Hunter. All rights reserved.</span>
        </div>
      </footer>
    </main>
  );
}
