"use client";

import { useState } from "react";
import Link from "next/link";
import LiquidCard from "@/components/LiquidCard";
import { DEMO_PROJECT, DEMO_PROJECT_2, DEMO_SAVED_NICHES, DEMO_VALIDATIONS } from "../data";
import ProModal from "../ProModal";

const statusConfig: Record<string, { label: string; color: string; bg: string; icon: string }> = {
  idea: { label: "Idea", color: "text-white/60", bg: "bg-white/10", icon: "💡" },
  researching: { label: "Researching", color: "text-blue-400", bg: "bg-blue-500/20", icon: "🔍" },
  building: { label: "Building", color: "text-orange-400", bg: "bg-orange-500/20", icon: "🛠️" },
  launched: { label: "Launched", color: "text-[var(--primary)]", bg: "bg-[var(--primary)]/20", icon: "🚀" },
};

const statusOrder = ["idea", "researching", "building", "launched"] as const;

export default function DemoWorkspacePage() {
  const [showProModal, setShowProModal] = useState(false);
  const [proFeature, setProFeature] = useState("");

  const projects = [DEMO_PROJECT, DEMO_PROJECT_2];
  const launchedProject = DEMO_PROJECT_2;

  const handleProAction = (feature: string) => {
    setProFeature(feature);
    setShowProModal(true);
  };

  return (
    <main className="workspace-page min-h-screen text-white font-sans selection:bg-[var(--primary)] selection:text-black pt-20">

      {/* Ambient Glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-[var(--primary)]/5 blur-[150px] rounded-full" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-purple-500/5 blur-[120px] rounded-full" />
      </div>

      <section className="relative pt-16 pb-20 px-4 md:px-6">
        <div className="max-w-6xl mx-auto">

          {/* Page Title */}
          <div className="mb-8 md:mb-10">
            <h1 className="text-3xl md:text-5xl font-bold mb-2 md:mb-3">
              Work<span className="text-flashy-green">space</span>
            </h1>
            <p className="text-white/50 text-sm md:text-lg">Your projects, validations, and saved niches in one place.</p>
          </div>

          {/* Main Grid - Dashboard Style (same as real) */}
          <div className="grid md:grid-cols-2 gap-6">

            {/* Projects Card */}
            <LiquidCard className="p-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold flex items-center gap-3">
                    <span className="text-2xl">📁</span>
                    My Projects
                  </h2>
                  <p className="text-xs text-white/30 ml-11 mt-0.5">Build and track your app ideas</p>
                </div>
                <button
                  onClick={() => handleProAction("Create Project")}
                  className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-white/60 hover:bg-white/10 hover:text-white transition-all"
                >
                  + New
                </button>
              </div>

              <div className="space-y-3">
                {projects.map((project) => {
                  const st = statusConfig[project.status];
                  return (
                    <Link
                      key={project.id}
                      href={`/demo/workspace/project/${project.id}`}
                      className={`workspace-item-card status-${project.status} p-3 group relative cursor-pointer block`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <span className="text-lg">{st.icon}</span>
                          <span className="font-medium text-sm text-white group-hover:text-[var(--primary)] transition-colors truncate">
                            {project.name}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        {statusOrder.map((s) => (
                          <button
                            key={s}
                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleProAction("Change Status"); }}
                            className={`px-2 py-0.5 rounded text-[10px] font-medium transition-all ${
                              project.status === s
                                ? `${statusConfig[s].bg} ${statusConfig[s].color}`
                                : "bg-transparent text-white/20 hover:bg-white/5 hover:text-white/40"
                            }`}
                          >
                            {statusConfig[s].label}
                          </button>
                        ))}
                      </div>
                    </Link>
                  );
                })}
              </div>
            </LiquidCard>

            {/* Revenue Card */}
            <LiquidCard className="p-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold flex items-center gap-3">
                    <span className="text-2xl">💰</span>
                    Revenue
                  </h2>
                  <p className="text-xs text-white/30 ml-11 mt-0.5">Track your app earnings</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-end gap-2">
                  <span className="text-3xl font-bold text-[var(--primary)]">${launchedProject.monthlyRevenue.toLocaleString()}</span>
                  <span className="text-sm text-white/30 mb-1">/mo</span>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-white/40">
                    <span>Goal: ${launchedProject.revenueGoal.toLocaleString()}/mo</span>
                    <span>{Math.round((launchedProject.monthlyRevenue / launchedProject.revenueGoal) * 100)}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                    <div className="h-full rounded-full bg-[var(--primary)] transition-all" style={{ width: `${Math.min(100, (launchedProject.monthlyRevenue / launchedProject.revenueGoal) * 100)}%` }} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-3">
                  <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                    <div className="text-[10px] text-white/30 uppercase">Users</div>
                    <div className="text-sm font-bold text-white">{launchedProject.totalUsers.toLocaleString()}</div>
                  </div>
                  <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                    <div className="text-[10px] text-white/30 uppercase">Paid</div>
                    <div className="text-sm font-bold text-[var(--primary)]">{launchedProject.paidUsers} <span className="text-white/20 font-normal">({launchedProject.conversionRate}%)</span></div>
                  </div>
                </div>

                <Link
                  href={`/demo/workspace/project/${launchedProject.id}`}
                  className="block text-center text-xs text-white/30 hover:text-white/60 transition-colors mt-2"
                >
                  {launchedProject.name} →
                </Link>
              </div>
            </LiquidCard>
          </div>

          {/* Validations Card - Full Width */}
          <LiquidCard className="mt-6 p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold flex items-center gap-3">
                  <span className="text-2xl">✅</span>
                  Niche Validations
                </h2>
                <p className="text-xs text-white/30 ml-11 mt-0.5">Validate your own niche idea with Niche Validator</p>
              </div>
              <button
                onClick={() => handleProAction("Niche Validator")}
                className="px-4 py-2 rounded-lg bg-purple-500/10 text-purple-400 text-sm font-medium hover:bg-purple-500/20 transition-all flex items-center gap-2"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 5v14M5 12h14"/>
                </svg>
                New Validation
              </button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {DEMO_VALIDATIONS.map((v) => (
                <div
                  key={v.id}
                  className="workspace-item-card validation-card p-4 group cursor-pointer relative"
                  onClick={() => handleProAction("Validation Details")}
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <p className="text-sm text-white/80 line-clamp-2 group-hover:text-white transition-colors">
                      {v.idea}
                    </p>
                    <div className={`px-2.5 py-1 rounded-lg text-xs font-bold shrink-0 ${
                      v.score >= 80 ? "bg-[var(--primary)]/20 text-[var(--primary)]" :
                      v.score >= 70 ? "bg-blue-500/20 text-blue-400" :
                      "bg-orange-500/20 text-orange-400"
                    }`}>
                      {v.score}
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs text-white/30 mb-3">
                    <span>{v.market}</span>
                    <span className="font-mono">{new Date(v.date).toLocaleDateString()}</span>
                  </div>
                  {v.hasProject ? (
                    <span className="inline-flex items-center gap-1 text-xs text-[var(--primary)]">
                      <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M9 12l2 2 4-4"/>
                      </svg>
                      Project started
                    </span>
                  ) : (
                    <button
                      onClick={(e) => { e.stopPropagation(); handleProAction("Start Project"); }}
                      className="inline-flex items-center gap-1.5 text-xs text-purple-400 hover:text-purple-300 transition-colors"
                    >
                      <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 5v14M5 12h14"/>
                      </svg>
                      Start project
                    </button>
                  )}
                </div>
              ))}
            </div>
          </LiquidCard>

          {/* Saved Niches Card - Full Width */}
          <LiquidCard className="mt-6 p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold flex items-center gap-3">
                  <span className="w-10 h-10 rounded-xl bg-[var(--primary)]/20 flex items-center justify-center">
                    <svg className="w-5 h-5 text-[var(--primary)]" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
                    </svg>
                  </span>
                  Saved Niches
                </h2>
                <p className="text-xs text-white/30 ml-[52px] mt-0.5">Niches you bookmarked for later</p>
              </div>
              <Link
                href="/demo/niches"
                className="px-4 py-2 rounded-lg bg-[var(--primary)]/10 text-[var(--primary)] text-sm font-medium hover:bg-[var(--primary)]/20 transition-all flex items-center gap-2"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
                Browse Niches
              </Link>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {DEMO_SAVED_NICHES.map((saved) => (
                <Link
                  key={saved.nicheId}
                  href={`/demo/niches/${saved.nicheId}`}
                  className="workspace-item-card niche-card p-4 group cursor-pointer relative block"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-[var(--primary)] text-sm">
                      #{saved.nicheId}
                    </span>
                    <span className="text-xs text-white/30 font-mono">
                      {new Date(saved.savedAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-white/60 text-sm mb-3 group-hover:text-white transition-colors line-clamp-2">
                    {saved.title}
                  </p>
                  {saved.hasProject ? (
                    <span className="inline-flex items-center gap-1 text-xs text-[var(--primary)]">
                      <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M9 12l2 2 4-4"/>
                      </svg>
                      Project started
                    </span>
                  ) : (
                    <button
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleProAction("Start Project"); }}
                      className="inline-flex items-center gap-1.5 text-xs text-purple-400 hover:text-purple-300 transition-colors"
                    >
                      <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 5v14M5 12h14"/>
                      </svg>
                      Start project
                    </button>
                  )}
                </Link>
              ))}
            </div>
          </LiquidCard>

        </div>
      </section>

      {/* Pro Modal */}
      <ProModal isOpen={showProModal} onClose={() => setShowProModal(false)} feature={proFeature} />
    </main>
  );
}
