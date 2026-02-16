"use client";

import { useState } from "react";
import { useParams, notFound } from "next/navigation";
import Link from "next/link";
import LiquidCard from "@/components/LiquidCard";
import { DEMO_PROJECT, DEMO_PROJECT_2 } from "../../../data";
import ProModal from "../../../ProModal";

const ALL_PROJECTS = [DEMO_PROJECT, DEMO_PROJECT_2];

const statusConfig: Record<string, { label: string; color: string; bg: string; icon: string }> = {
  idea: { label: "Idea", color: "text-white/60", bg: "bg-white/10", icon: "💡" },
  researching: { label: "Researching", color: "text-blue-400", bg: "bg-blue-500/20", icon: "🔍" },
  building: { label: "Building", color: "text-orange-400", bg: "bg-orange-500/20", icon: "🛠️" },
  launched: { label: "Launched", color: "text-[var(--primary)]", bg: "bg-[var(--primary)]/20", icon: "🚀" },
};

const statusOrder = ["idea", "researching", "building", "launched"] as const;

type TabId = "overview" | "tasks" | "milestones" | "competitors" | "notes" | "resources" | "swot" | "revenue" | "costs" | "market";

const TABS: { id: TabId; label: string; icon: string }[] = [
  { id: "overview", label: "Overview", icon: "📋" },
  { id: "tasks", label: "Tasks", icon: "✅" },
  { id: "milestones", label: "Milestones", icon: "🎯" },
  { id: "competitors", label: "Competitors", icon: "🏆" },
  { id: "notes", label: "Notes", icon: "📝" },
  { id: "resources", label: "Resources", icon: "🔗" },
  { id: "swot", label: "Analysis", icon: "📊" },
  { id: "revenue", label: "Revenue", icon: "💰" },
  { id: "costs", label: "Costs", icon: "💸" },
  { id: "market", label: "My App", icon: "🎯" },
];

export default function DemoProjectPage() {
  const params = useParams();
  const p = ALL_PROJECTS.find(proj => proj.id === params.id);
  if (!p) { notFound(); return null; }
  const status = statusConfig[p.status];
  const [activeTab, setActiveTab] = useState<TabId>("overview");
  const [showProModal, setShowProModal] = useState(false);
  const [proFeature, setProFeature] = useState("");

  const pro = (feature: string) => { setProFeature(feature); setShowProModal(true); };

  const completedTasks = p.tasks.filter(t => t.done).length;
  const taskPercent = Math.round((completedTasks / p.tasks.length) * 100);
  const completedMilestones = p.milestones.filter(m => m.done).length;
  const milestonePercent = Math.round((completedMilestones / p.milestones.length) * 100);
  const monthlyCosts = p.costs.filter(c => c.frequency === "monthly").reduce((s, c) => s + c.amount, 0);
  const yearlyCosts = p.costs.filter(c => c.frequency === "yearly").reduce((s, c) => s + c.amount, 0);

  return (
    <main className="workspace-page min-h-screen text-white font-sans selection:bg-[var(--primary)] selection:text-black pt-20">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-[var(--primary)]/5 blur-[150px] rounded-full" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-purple-500/5 blur-[120px] rounded-full" />
      </div>

      <section className="relative pt-16 pb-20 px-4 md:px-6">
        <div className="max-w-5xl mx-auto">

          {/* Back */}
          <Link href="/demo/workspace" className="inline-flex items-center gap-2 text-white/40 hover:text-white text-sm mb-6 transition-colors">
            ← Back to Workspace
          </Link>

          {/* Header */}
          <div className="flex items-start gap-3 md:gap-4 mb-6">
            <span className="text-3xl md:text-4xl">{status.icon}</span>
            <div className="flex-1 min-w-0">
              <h1 className="text-xl md:text-3xl font-bold text-white mb-1">{p.name}</h1>
              <div className="flex items-center gap-3">
                <span className={`px-3 py-1 rounded-lg text-xs font-medium ${status.bg} ${status.color}`}>{status.label}</span>
                <span className="text-xs text-white/30">Created {new Date(p.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-6 overflow-x-auto scrollbar-hide pb-2">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap border transition-all ${
                  activeTab === tab.id
                    ? "bg-[var(--primary)]/10 border-[var(--primary)] text-[var(--primary)]"
                    : "bg-white/5 border-white/10 text-white/50 hover:text-white hover:border-white/20"
                }`}
              >
                <span>{tab.icon}</span>
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>

          {/* ─── OVERVIEW ─── */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Status Selector */}
              <LiquidCard className="p-6">
                <h3 className="text-sm font-bold text-white/60 uppercase tracking-wider mb-4">Project Status</h3>
                <div className="flex gap-2">
                  {statusOrder.map(s => (
                    <button key={s} onClick={() => pro("Change Status")} className={`flex-1 py-3 rounded-xl text-sm font-medium transition-all ${
                      p.status === s ? `${statusConfig[s].bg} ${statusConfig[s].color} border border-current` : "bg-white/5 text-white/30 hover:bg-white/10"
                    }`}>
                      <span className="mr-1">{statusConfig[s].icon}</span> {statusConfig[s].label}
                    </button>
                  ))}
                </div>
              </LiquidCard>

              {/* Source */}
              <LiquidCard className="p-6">
                <h3 className="text-sm font-bold text-white/60 uppercase tracking-wider mb-4">Source</h3>
                <Link href="/demo/niches/0110" className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--primary)]/10 text-[var(--primary)] text-sm hover:bg-[var(--primary)]/20 transition-all">
                  🔖 Niche #{p.nicheCode} — {p.nicheTitle}
                </Link>
              </LiquidCard>

              {/* Quick Notes */}
              <LiquidCard className="p-6">
                <h3 className="text-sm font-bold text-white/60 uppercase tracking-wider mb-4">Quick Notes</h3>
                <div onClick={() => pro("Edit Notes")} className="cursor-pointer p-4 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-all">
                  <p className="text-sm text-white/60 whitespace-pre-line leading-relaxed">{p.quickNotes}</p>
                </div>
              </LiquidCard>
            </div>
          )}

          {/* ─── TASKS ─── */}
          {activeTab === "tasks" && (
            <div className="space-y-6">
              <LiquidCard className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-sm font-bold text-white/60 uppercase tracking-wider">Progress</h3>
                  <span className="text-sm text-white/40">{completedTasks}/{p.tasks.length} tasks</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex-1 h-3 rounded-full bg-white/10 overflow-hidden">
                    <div className="h-full rounded-full bg-[var(--primary)] transition-all" style={{ width: `${taskPercent}%` }} />
                  </div>
                  <span className="text-sm font-bold text-[var(--primary)]">{taskPercent}%</span>
                </div>
              </LiquidCard>

              <LiquidCard className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-white">Pending</h3>
                  <button onClick={() => pro("Add Task")} className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-white/60 hover:bg-white/10 transition-all">+ Add</button>
                </div>
                <div className="space-y-2">
                  {p.tasks.filter(t => !t.done).map(task => (
                    <div key={task.id} onClick={() => pro("Edit Task")} className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/5 cursor-pointer hover:border-white/10 transition-all">
                      <div className="w-5 h-5 rounded-md border-2 border-white/20 shrink-0" />
                      <span className="text-sm text-white/70">{task.text}</span>
                    </div>
                  ))}
                </div>
              </LiquidCard>

              <LiquidCard className="p-6">
                <h3 className="font-bold text-white/40 mb-4">Completed</h3>
                <div className="space-y-2">
                  {p.tasks.filter(t => t.done).map(task => (
                    <div key={task.id} className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/5">
                      <div className="w-5 h-5 rounded-md border-2 border-[var(--primary)] bg-[var(--primary)]/20 flex items-center justify-center shrink-0">
                        <span className="text-[var(--primary)] text-xs">✓</span>
                      </div>
                      <span className="text-sm text-white/40 line-through">{task.text}</span>
                    </div>
                  ))}
                </div>
              </LiquidCard>
            </div>
          )}

          {/* ─── MILESTONES ─── */}
          {activeTab === "milestones" && (
            <div className="space-y-6">
              <LiquidCard className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-sm font-bold text-white/60 uppercase tracking-wider">Progress</h3>
                  <span className="text-sm text-white/40">{completedMilestones}/{p.milestones.length}</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex-1 h-3 rounded-full bg-white/10 overflow-hidden">
                    <div className="h-full rounded-full bg-[var(--primary)] transition-all" style={{ width: `${milestonePercent}%` }} />
                  </div>
                  <span className="text-sm font-bold text-[var(--primary)]">{milestonePercent}%</span>
                </div>
              </LiquidCard>

              <LiquidCard className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-white">Upcoming</h3>
                  <button onClick={() => pro("Add Milestone")} className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-white/60 hover:bg-white/10 transition-all">+ Add</button>
                </div>
                <div className="space-y-3">
                  {p.milestones.filter(m => !m.done).map(m => {
                    const isOverdue = new Date(m.date) < new Date();
                    return (
                      <div key={m.id} onClick={() => pro("Edit Milestone")} className="p-4 rounded-xl bg-white/5 border border-white/10 cursor-pointer hover:border-white/20 transition-all">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-3">
                            <div className="w-6 h-6 rounded-full border-2 border-white/20" />
                            <span className="font-medium text-white">{m.title}</span>
                          </div>
                          <span className={`text-xs font-mono ${isOverdue ? "text-red-400" : "text-white/30"}`}>
                            {new Date(m.date).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </LiquidCard>

              <LiquidCard className="p-6">
                <h3 className="font-bold text-white/40 mb-4">Completed</h3>
                <div className="space-y-3">
                  {p.milestones.filter(m => m.done).map(m => (
                    <div key={m.id} className="p-4 rounded-xl bg-[var(--primary)]/5 border border-[var(--primary)]/20">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <div className="w-6 h-6 rounded-full bg-[var(--primary)] flex items-center justify-center">
                            <span className="text-black text-xs font-bold">✓</span>
                          </div>
                          <span className="font-medium text-[var(--primary)]">{m.title}</span>
                        </div>
                        <span className="text-xs font-mono text-white/30">{new Date(m.date).toLocaleDateString("en-US", { month: "short", year: "numeric" })}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </LiquidCard>
            </div>
          )}

          {/* ─── COMPETITORS ─── */}
          {activeTab === "competitors" && (
            <div className="space-y-6">
              <div className="grid grid-cols-3 gap-4">
                <LiquidCard className="p-4 text-center">
                  <div className="text-2xl font-bold text-white">{p.competitors.length}</div>
                  <div className="text-[10px] text-white/40 uppercase">Tracked</div>
                </LiquidCard>
                <LiquidCard className="p-4 text-center">
                  <div className="text-2xl font-bold text-[var(--primary)]">$4.2B</div>
                  <div className="text-[10px] text-white/40 uppercase">Market Size</div>
                </LiquidCard>
                <LiquidCard className="p-4 text-center">
                  <div className="text-2xl font-bold text-white">Medium</div>
                  <div className="text-[10px] text-white/40 uppercase">Competition</div>
                </LiquidCard>
              </div>

              <div className="flex justify-end">
                <button onClick={() => pro("Add Competitor")} className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-white/60 hover:bg-white/10 transition-all">+ Add Competitor</button>
              </div>

              {p.competitors.map(c => (
                <LiquidCard key={c.id} className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-bold text-white text-lg">{c.name}</h3>
                      <span className="text-xs text-white/30">{c.url}</span>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-[var(--primary)]/20 text-[var(--primary)] text-xs font-bold">{c.revenue}</span>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4 mb-3">
                    <div className="p-3 rounded-lg bg-[var(--primary)]/5 border border-[var(--primary)]/10">
                      <div className="text-[10px] text-[var(--primary)] uppercase font-bold mb-1">Strengths</div>
                      <p className="text-sm text-white/60">{c.strengths}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-orange-500/5 border border-orange-500/10">
                      <div className="text-[10px] text-orange-400 uppercase font-bold mb-1">Weaknesses</div>
                      <p className="text-sm text-white/60">{c.weaknesses}</p>
                    </div>
                  </div>
                  {c.notes && <p className="text-xs text-white/40 italic">{c.notes}</p>}
                </LiquidCard>
              ))}
            </div>
          )}

          {/* ─── NOTES ─── */}
          {activeTab === "notes" && (
            <div className="space-y-6">
              <div className="flex justify-end">
                <button onClick={() => pro("Add Note")} className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-white/60 hover:bg-white/10 transition-all">+ Add Note</button>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                {p.notes.map(n => (
                  <LiquidCard key={n.id} className="p-5 cursor-pointer hover:scale-[1.01] transition-all" onClick={() => pro("Edit Note")}>
                    <div className="flex items-center gap-2 mb-3">
                      {n.pinned && <span className="text-[var(--primary)] text-xs">📌</span>}
                      <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${
                        n.category === "Idea" ? "bg-blue-500/20 text-blue-400" :
                        n.category === "Research" ? "bg-purple-500/20 text-purple-400" :
                        n.category === "To Do" ? "bg-orange-500/20 text-orange-400" :
                        "bg-white/10 text-white/50"
                      }`}>{n.category}</span>
                    </div>
                    <h3 className="font-bold text-white mb-2">{n.title}</h3>
                    <p className="text-sm text-white/50 line-clamp-3 whitespace-pre-line">{n.content}</p>
                  </LiquidCard>
                ))}
              </div>
            </div>
          )}

          {/* ─── RESOURCES ─── */}
          {activeTab === "resources" && (
            <div className="space-y-6">
              <div className="flex justify-end">
                <button onClick={() => pro("Add Resource")} className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-white/60 hover:bg-white/10 transition-all">+ Add Resource</button>
              </div>
              {["Tool", "Article", "Course"].map(type => {
                const items = p.resources.filter(r => r.type === type);
                if (items.length === 0) return null;
                return (
                  <LiquidCard key={type} className="p-6">
                    <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                      <span>{type === "Tool" ? "🔧" : type === "Article" ? "📄" : "🎓"}</span> {type}s
                    </h3>
                    <div className="space-y-3">
                      {items.map(r => (
                        <div key={r.id} className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-all cursor-pointer" onClick={() => pro("Edit Resource")}>
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <h4 className="font-medium text-white text-sm">{r.title}</h4>
                              <p className="text-xs text-white/30 mt-1">{r.url}</p>
                              {r.description && <p className="text-xs text-white/50 mt-2">{r.description}</p>}
                            </div>
                            <svg className="w-4 h-4 text-white/20 shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                          </div>
                        </div>
                      ))}
                    </div>
                  </LiquidCard>
                );
              })}
            </div>
          )}

          {/* ─── SWOT ─── */}
          {activeTab === "swot" && (
            <div className="grid md:grid-cols-2 gap-6">
              {([
                { key: "strengths" as const, title: "Strengths", color: "green", emoji: "💪" },
                { key: "weaknesses" as const, title: "Weaknesses", color: "red", emoji: "⚡" },
                { key: "opportunities" as const, title: "Opportunities", color: "blue", emoji: "🌟" },
                { key: "threats" as const, title: "Threats", color: "orange", emoji: "⚠️" },
              ]).map(section => (
                <LiquidCard key={section.key} className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className={`font-bold flex items-center gap-2 text-${section.color}-400`}>
                      <span>{section.emoji}</span> {section.title}
                    </h3>
                    <button onClick={() => pro(`Add ${section.title}`)} className="text-xs text-white/30 hover:text-white/60 transition-colors">+ Add</button>
                  </div>
                  <div className="space-y-2">
                    {p.swot[section.key].map((item, i) => (
                      <div key={i} className={`p-3 rounded-lg bg-${section.color}-500/5 border border-${section.color}-500/10 text-sm text-white/70`}>
                        {item}
                      </div>
                    ))}
                  </div>
                </LiquidCard>
              ))}
            </div>
          )}

          {/* ─── REVENUE ─── */}
          {activeTab === "revenue" && (
            <>
              {p.status !== "launched" ? (
                <div className="space-y-6 relative">
                  <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/40 rounded-2xl backdrop-blur-sm">
                    <LiquidCard className="p-8 text-center max-w-sm">
                      <span className="text-4xl mb-3 block">🚀</span>
                      <h3 className="text-lg font-bold text-white mb-2">Not launched yet</h3>
                      <p className="text-sm text-white/50">Revenue tracking is available once your project status is set to &quot;Launched&quot;.</p>
                    </LiquidCard>
                  </div>
                  <LiquidCard className="p-6 opacity-30">
                    <h3 className="text-sm font-bold text-white/60 uppercase tracking-wider mb-4">Monthly Revenue</h3>
                    <div className="text-4xl font-bold text-white/20">$0 /mo</div>
                  </LiquidCard>
                  <LiquidCard className="p-6 opacity-30">
                    <h3 className="text-sm font-bold text-white/60 uppercase tracking-wider mb-4">Revenue Goal</h3>
                    <div className="text-2xl font-bold text-white/20">$10,000 /mo</div>
                  </LiquidCard>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* MRR + Goal */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <LiquidCard className="p-6">
                      <h3 className="text-sm font-bold text-white/60 uppercase tracking-wider mb-3">Monthly Revenue</h3>
                      <div className="text-4xl font-bold text-[var(--primary)]">${p.monthlyRevenue.toLocaleString()}<span className="text-lg text-white/30 font-normal">/mo</span></div>
                    </LiquidCard>
                    <LiquidCard className="p-6">
                      <h3 className="text-sm font-bold text-white/60 uppercase tracking-wider mb-3">Revenue Goal</h3>
                      <div className="flex items-end gap-3 mb-3">
                        <span className="text-4xl font-bold text-white">${("revenueGoal" in p ? p.revenueGoal : 0).toLocaleString()}<span className="text-lg text-white/30 font-normal">/mo</span></span>
                      </div>
                      <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                        <div className="h-full rounded-full bg-[var(--primary)]" style={{ width: `${Math.min(100, (p.monthlyRevenue / ("revenueGoal" in p ? (p.revenueGoal as number) : 1)) * 100)}%` }} />
                      </div>
                      <p className="text-xs text-white/30 mt-2">{Math.round((p.monthlyRevenue / ("revenueGoal" in p ? (p.revenueGoal as number) : 1)) * 100)}% of goal</p>
                    </LiquidCard>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4">
                    <LiquidCard className="p-5 text-center">
                      <div className="text-2xl font-bold text-white">{"totalUsers" in p ? (p.totalUsers as number).toLocaleString() : "—"}</div>
                      <div className="text-[10px] text-white/40 uppercase mt-1">Total Users</div>
                    </LiquidCard>
                    <LiquidCard className="p-5 text-center">
                      <div className="text-2xl font-bold text-[var(--primary)]">{"paidUsers" in p ? p.paidUsers as number : "—"}</div>
                      <div className="text-[10px] text-white/40 uppercase mt-1">Paid Users</div>
                    </LiquidCard>
                    <LiquidCard className="p-5 text-center">
                      <div className="text-2xl font-bold text-white">{"conversionRate" in p ? `${p.conversionRate}%` : "—"}</div>
                      <div className="text-[10px] text-white/40 uppercase mt-1">Conversion</div>
                    </LiquidCard>
                  </div>

                  {/* Revenue History */}
                  {"revenueHistory" in p && (
                    <LiquidCard className="p-6">
                      <h3 className="text-sm font-bold text-white/60 uppercase tracking-wider mb-4">Revenue History</h3>
                      <div className="space-y-3">
                        {(p.revenueHistory as Array<{month: string; amount: number}>).map((entry, i) => (
                          <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                            <span className="text-sm text-white/60">{entry.month}</span>
                            <span className="text-sm font-bold text-[var(--primary)]">${entry.amount.toLocaleString()}</span>
                          </div>
                        ))}
                      </div>
                    </LiquidCard>
                  )}
                </div>
              )}
            </>
          )}

          {/* ─── COSTS ─── */}
          {activeTab === "costs" && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <LiquidCard className="p-5 text-center">
                  <div className="text-xs text-white/40 uppercase mb-1">Monthly Costs</div>
                  <div className="text-2xl font-bold text-white">${monthlyCosts}<span className="text-sm text-white/40">/mo</span></div>
                </LiquidCard>
                <LiquidCard className="p-5 text-center">
                  <div className="text-xs text-white/40 uppercase mb-1">Yearly Costs</div>
                  <div className="text-2xl font-bold text-white">${yearlyCosts}<span className="text-sm text-white/40">/yr</span></div>
                </LiquidCard>
              </div>

              <div className="flex justify-end">
                <button onClick={() => pro("Add Cost")} className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-white/60 hover:bg-white/10 transition-all">+ Add Cost</button>
              </div>

              {["Tools", "APIs", "Hosting", "Subscriptions"].map(cat => {
                const items = p.costs.filter(c => c.category === cat);
                if (items.length === 0) return null;
                return (
                  <LiquidCard key={cat} className="p-6">
                    <h3 className="font-bold text-white mb-4">{cat}</h3>
                    <div className="space-y-2">
                      {items.map(c => (
                        <div key={c.id} className="flex justify-between items-center p-3 rounded-lg bg-white/5 border border-white/5">
                          <span className="text-sm text-white/70">{c.name}</span>
                          <span className="text-sm font-mono text-white/60">${c.amount}<span className="text-white/30">/{c.frequency === "monthly" ? "mo" : "yr"}</span></span>
                        </div>
                      ))}
                    </div>
                  </LiquidCard>
                );
              })}
            </div>
          )}

          {/* ─── MARKET / MY APP ─── */}
          {activeTab === "market" && (
            <div className="space-y-6">
              <LiquidCard className="p-6">
                <h3 className="text-sm font-bold text-white/60 uppercase tracking-wider mb-4">App Identity</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10 cursor-pointer hover:border-white/20 transition-all" onClick={() => pro("Edit App Name")}>
                    <div className="text-xs text-white/40 uppercase mb-1">App Name</div>
                    <div className="text-lg font-bold text-white">{p.appName}</div>
                  </div>
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10 cursor-pointer hover:border-white/20 transition-all" onClick={() => pro("Edit Tagline")}>
                    <div className="text-xs text-white/40 uppercase mb-1">Tagline</div>
                    <div className="text-lg font-bold text-[var(--primary)]">{p.appTagline}</div>
                  </div>
                </div>
              </LiquidCard>

              <LiquidCard className="p-6">
                <h3 className="text-sm font-bold text-white/60 uppercase tracking-wider mb-4">Target Market</h3>
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10 cursor-pointer hover:border-white/20 transition-all" onClick={() => pro("Edit Target Audience")}>
                    <div className="text-xs text-white/40 uppercase mb-1">Target Audience</div>
                    <p className="text-sm text-white/70">{p.targetAudience}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10 cursor-pointer hover:border-white/20 transition-all" onClick={() => pro("Edit USP")}>
                    <div className="text-xs text-white/40 uppercase mb-1">Unique Selling Point</div>
                    <p className="text-sm text-white/70">{p.uniqueSellingPoint}</p>
                  </div>
                </div>
              </LiquidCard>

              <LiquidCard className="p-6">
                <h3 className="text-sm font-bold text-white/60 uppercase tracking-wider mb-4">Keywords</h3>
                <div className="flex flex-wrap gap-2">
                  {p.keywords.map((kw, i) => (
                    <span key={i} className="px-3 py-1.5 rounded-lg bg-[var(--primary)]/10 border border-[var(--primary)]/30 text-sm text-[var(--primary)]">{kw}</span>
                  ))}
                </div>
              </LiquidCard>

              <LiquidCard className="p-6">
                <h3 className="text-sm font-bold text-white/60 uppercase tracking-wider mb-4">Market Notes</h3>
                <div className="p-4 rounded-xl bg-white/5 border border-white/10 cursor-pointer hover:border-white/20 transition-all" onClick={() => pro("Edit Market Notes")}>
                  <p className="text-sm text-white/60 leading-relaxed">{p.marketNotes}</p>
                </div>
              </LiquidCard>
            </div>
          )}

        </div>
      </section>

      <ProModal isOpen={showProModal} onClose={() => setShowProModal(false)} feature={proFeature} />
    </main>
  );
}
