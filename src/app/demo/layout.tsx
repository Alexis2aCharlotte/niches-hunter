"use client";

import Link from "next/link";
import DemoGuide from "./DemoGuide";

export default function DemoLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* Bandeau demo permanent */}
      <div className="fixed top-0 left-0 right-0 z-[60] bg-gradient-to-r from-[var(--primary)] to-emerald-500">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-2 sm:py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-1.5 sm:gap-2 text-black text-xs sm:text-sm font-medium">
            <span className="flex items-center justify-center w-5 h-5 rounded-full bg-black/15 text-[10px] shrink-0">▶</span>
            <span className="hidden sm:inline">Interactive Demo — Explore the full Pro experience</span>
            <span className="sm:hidden">Demo</span>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/demo/workspace"
              className="px-2.5 sm:px-3 py-1 rounded-lg bg-black/10 hover:bg-black/20 text-black text-[11px] sm:text-xs font-medium transition-all"
            >
              Workspace
            </Link>
            <Link
              href="/pricing"
              className="px-2.5 sm:px-3 py-1 rounded-lg bg-black/20 hover:bg-black/30 text-black text-[11px] sm:text-xs font-bold transition-all whitespace-nowrap"
            >
              Get Pro →
            </Link>
          </div>
        </div>
      </div>
      {children}
      <DemoGuide />
    </>
  );
}
