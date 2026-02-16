"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

interface Step {
  id: string;
  label: string;
  description: string;
  href: string;
  checkKey: string;
}

const STEPS: Step[] = [
  {
    id: "1",
    label: "Pick a Niche",
    description: "Browse and select a niche to explore.",
    href: "/demo/niches",
    checkKey: "demo_step_niche",
  },
  {
    id: "2",
    label: "Explore all Tabs",
    description: "Visit all 4 tabs in the niche analysis.",
    href: "/demo/niches/0110",
    checkKey: "demo_step_tabs",
  },
  {
    id: "3",
    label: "Visit your Workspace",
    description: "See projects, tasks & saved niches.",
    href: "/demo/workspace",
    checkKey: "demo_step_workspace",
  },
  {
    id: "4",
    label: "Explore a Project",
    description: "Dive into a project and browse its tabs.",
    href: "/demo/workspace/project/demo-project-1",
    checkKey: "demo_step_project",
  },
];

const STORAGE_KEY = "demo_guide_progress";
const TABS_KEY = "demo_tabs_visited";
const ALL_TABS = ["overview", "apps", "strategy", "aso"];

function getProgress(): Record<string, boolean> {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(sessionStorage.getItem(STORAGE_KEY) || "{}");
  } catch {
    return {};
  }
}

function markComplete(key: string) {
  if (typeof window === "undefined") return;
  const progress = getProgress();
  progress[key] = true;
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

function getVisitedTabs(): string[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(sessionStorage.getItem(TABS_KEY) || "[]");
  } catch {
    return [];
  }
}

function addVisitedTab(tab: string) {
  if (typeof window === "undefined") return;
  const tabs = new Set(getVisitedTabs());
  tabs.add(tab);
  sessionStorage.setItem(TABS_KEY, JSON.stringify([...tabs]));
  if (ALL_TABS.every(t => tabs.has(t))) {
    markComplete("demo_step_tabs");
  }
}

export default function DemoGuide() {
  const pathname = usePathname();
  const [progress, setProgress] = useState<Record<string, boolean>>({});
  const [collapsed, setCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setProgress(getProgress());
  }, []);

  // Auto-mark steps based on navigation
  useEffect(() => {
    if (!mounted) return;

    // Step 1: user visited a niche detail
    if (pathname.startsWith("/demo/niches/") && pathname !== "/demo/niches") {
      markComplete("demo_step_niche");
    }

    // Step 3: user visited workspace
    if (pathname === "/demo/workspace") {
      markComplete("demo_step_workspace");
    }

    // Step 4: user visited a project detail
    if (pathname.startsWith("/demo/workspace/project/")) {
      markComplete("demo_step_workspace");
      markComplete("demo_step_project");
    }

    setProgress(getProgress());
  }, [pathname, mounted]);

  // Track tabs visited from niche detail page
  useEffect(() => {
    if (!mounted) return;

    const handler = (e: Event) => {
      const tabName = (e as CustomEvent).detail;
      if (tabName) addVisitedTab(tabName);
      setProgress(getProgress());
    };

    window.addEventListener("demo_tab_switched", handler);
    return () => window.removeEventListener("demo_tab_switched", handler);
  }, [mounted]);

  if (!mounted) return null;

  const completedCount = STEPS.filter((s) => progress[s.checkKey]).length;
  const allDone = completedCount === STEPS.length;
  const nextStep = STEPS.find((s) => !progress[s.checkKey]);
  const visitedTabs = getVisitedTabs();
  const tabsCount = visitedTabs.length;

  return (
    <div className="fixed bottom-6 left-6 z-[55] w-[300px] select-none">
      {/* Collapsed pill */}
      {collapsed ? (
        <button
          onClick={() => setCollapsed(false)}
          className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-[#111] border border-white/10 shadow-2xl shadow-black/50 hover:border-white/20 transition-all group"
        >
          <div className="relative w-8 h-8 rounded-full bg-[var(--primary)]/20 flex items-center justify-center shrink-0">
            <span className="text-[var(--primary)] text-xs font-bold">{completedCount}/{STEPS.length}</span>
          </div>
          <div className="text-left">
            <div className="text-xs font-bold text-white">Demo Guide</div>
            <div className="text-[10px] text-white/40">{allDone ? "All done!" : nextStep?.label}</div>
          </div>
          <svg className="w-4 h-4 text-white/30 group-hover:text-white/60 ml-auto transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
          </svg>
        </button>
      ) : (
        /* Expanded panel */
        <div className="rounded-2xl bg-[#111] border border-white/10 shadow-2xl shadow-black/50 overflow-hidden">
          {/* Header */}
          <div className="px-5 pt-5 pb-3">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-white">Demo Guide</span>
                <span className="text-[10px] text-white/40 bg-white/5 px-2 py-0.5 rounded-full">{completedCount}/{STEPS.length} done</span>
              </div>
              <button
                onClick={() => setCollapsed(true)}
                className="text-white/30 hover:text-white/60 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
              </button>
            </div>

            {/* Progress bar */}
            <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full rounded-full bg-[var(--primary)] transition-all duration-500"
                style={{ width: `${(completedCount / STEPS.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Steps */}
          <div className="px-5 pb-4 space-y-1">
            {STEPS.map((step) => {
              const done = progress[step.checkKey];
              const isNext = nextStep?.id === step.id;

              return (
                <div
                  key={step.id}
                  className={`flex items-start gap-3 p-3 rounded-xl transition-all ${
                    isNext ? "bg-white/5" : ""
                  }`}
                >
                  {/* Check circle */}
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                    done
                      ? "bg-[var(--primary)] text-black"
                      : isNext
                        ? "border-2 border-[var(--primary)] text-[var(--primary)]"
                        : "border-2 border-white/15 text-white/20"
                  }`}>
                    {done ? (
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                    ) : (
                      <span className="text-[10px] font-bold">{step.id}</span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className={`text-sm font-medium ${done ? "text-white/40 line-through" : "text-white"}`}>
                      {step.label}
                    </div>
                    <div className="text-[11px] text-white/30 mt-0.5">
                      {step.id === "2" && !done && tabsCount > 0
                        ? `${tabsCount}/4 tabs explored`
                        : step.description
                      }
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* CTA */}
          <div className="px-5 pb-5">
            {allDone ? (
              <Link
                href="/pricing"
                className="block w-full py-3 text-center text-sm font-bold rounded-xl bg-[var(--primary)] text-black hover:bg-[#00E847] transition-all"
              >
                Get Pro — Unlock Everything →
              </Link>
            ) : nextStep ? (
              <Link
                href={nextStep.href}
                className="block w-full py-3 text-center text-sm font-bold rounded-xl bg-white/10 text-white hover:bg-white/15 transition-all"
              >
                Continue →
              </Link>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}
