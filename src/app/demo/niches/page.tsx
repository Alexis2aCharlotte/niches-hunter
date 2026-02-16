"use client";

import { useRef } from "react";
import Link from "next/link";
import { DEMO_NICHE } from "../data";

export default function DemoNichesPage() {
  return (
    <main className="min-h-screen relative overflow-hidden text-white font-sans selection:bg-[#00CC3D] selection:text-black">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none hidden md:block">
        <div className="absolute top-0 left-1/3 w-[800px] h-[800px] bg-[var(--primary)]/3 blur-[200px] rounded-full" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-500/5 blur-[150px] rounded-full" />
      </div>

      <section className="relative pb-8 px-6 pt-44">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--primary)]/10 border border-[var(--primary)]/20 mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary)] animate-pulse" />
                <span className="text-xs font-mono text-[var(--primary)] uppercase tracking-wider">Demo Mode</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
                Niche <span className="text-flashy-green">Ideas</span>
              </h1>
              <p className="text-lg text-white/50 max-w-xl">
                Explore a premium niche with full market analysis. This is what you get with Pro.
              </p>
            </div>

            <div className="flex items-center gap-3 px-4 py-2 rounded-full border border-white/10 bg-white/5 min-w-[140px] justify-center">
              <span className="w-2 h-2 rounded-full bg-[var(--primary)] animate-pulse" />
              <span className="text-xs font-mono text-white/70 tabular-nums">1 NICHE</span>
            </div>
          </div>

          {/* Niche Card */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <DemoNicheCard />
          </div>
        </div>
      </section>
    </main>
  );
}

function DemoNicheCard() {
  const niche = DEMO_NICHE;
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    cardRef.current.style.setProperty('--mouse-x', `${x}px`);
    cardRef.current.style.setProperty('--mouse-y', `${y}px`);
  };

  return (
    <Link href={`/demo/niches/${niche.displayCode}`} className="block h-full">
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        className="liquid-card p-6 group md:transition-all md:duration-300 md:hover:scale-[1.02] relative h-full flex flex-col"
        style={{ animationDelay: "0ms" }}
      >
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1 min-w-0 pr-3">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-mono text-white/30">#{niche.displayCode}</span>
              <span className="px-2 py-0.5 rounded bg-[var(--primary)]/10 text-[9px] text-[var(--primary)] font-medium">
                {niche.category}
              </span>
            </div>
            <h3 className="text-lg font-bold text-white group-hover:text-[var(--primary)] transition-colors line-clamp-2">
              {niche.title}
            </h3>
          </div>
          <div className="px-3 py-1 rounded-full text-xs font-bold bg-[var(--primary)]/20 text-[var(--primary)] shrink-0">
            {niche.score}/100
          </div>
        </div>

        <div className="relative flex-grow flex flex-col">
          <div className="flex-grow flex flex-col">
            <div className="flex flex-wrap gap-2 mb-4 h-6 overflow-hidden">
              {niche.tags.slice(0, 3).map(tag => (
                <span key={tag} className="px-2 py-0.5 rounded border border-white/10 bg-white/5 text-[10px] text-white/60">
                  {tag}
                </span>
              ))}
            </div>

            <p className="text-sm text-white/50 leading-relaxed mb-6 line-clamp-2 flex-grow">
              {niche.opportunity}
            </p>

            <div className="grid grid-cols-2 gap-3 mt-auto">
              <div className="p-3 rounded-lg bg-black/40 border border-white/5">
                <div className="text-[9px] text-white/30 uppercase mb-1">Competition</div>
                <div className="text-sm font-bold text-yellow-400">{niche.stats.competition}</div>
              </div>
              <div className="p-3 rounded-lg bg-black/40 border border-white/5">
                <div className="text-[9px] text-white/30 uppercase mb-1">Est. Revenue</div>
                <div className="text-sm font-bold text-white">{niche.stats.revenue}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
          <span className="text-[var(--primary)]">→</span>
        </div>
      </div>
    </Link>
  );
}
