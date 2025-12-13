"use client";

import { useState } from "react";
import Link from "next/link";

interface NavbarProps {
  onSubscribeClick?: () => void;
}

export default function Navbar({ onSubscribeClick }: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 nav-blur">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between relative">

          {/* Left: Logo */}
          <Link href="/" className="flex items-center relative z-50">
            <span className="font-bold text-base md:text-lg tracking-widest text-white">NICHES HUNTER</span>
          </Link>

          {/* Center: Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-[rgba(255,255,255,0.6)] absolute left-1/2 -translate-x-1/2 overflow-visible">
            <Link href="/login" className="hover:text-[var(--primary)] transition-colors flex items-center gap-2">
              Login <span className="px-1.5 py-0.5 rounded bg-white/10 text-[10px] text-white/50 border border-white/10">SOON</span>
            </Link>

            {/* Resources Dropdown */}
            <div className="relative group">
              <button className="flex items-center gap-1 hover:text-[var(--primary)] transition-colors">
                Resources
                <span className="px-1.5 py-0.5 rounded bg-white/10 text-[10px] text-white/50 border border-white/10 ml-1">SOON</span>
                <svg className="w-3 h-3 opacity-50 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
              </button>
              {/* Dropdown Menu */}
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-4 w-48 p-2 rounded-xl bg-[#0a0a0a] border border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.5)] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0 backdrop-blur-xl">
                <Link href="/niches" className="block px-4 py-3 rounded-lg hover:bg-white/5 text-white transition-colors text-xs font-bold">
                  ⚡️ Niches Ideas
                </Link>
              </div>
            </div>

            <Link href="#" className="text-white hover:text-[var(--primary)] transition-colors flex items-center gap-2">
              Get Pro <span className="px-1.5 py-0.5 rounded bg-white/10 text-[10px] text-white/50 border border-white/10">SOON</span>
            </Link>
          </div>

          {/* Right: CTA & Mobile Button */}
          <div className="flex items-center gap-4">
            <div className="hidden md:block">
              <button 
                onClick={onSubscribeClick} 
                className="btn-primary text-sm px-8 py-4 shadow-[0_0_20px_rgba(0,255,148,0.2)] hover:shadow-[0_0_30px_rgba(0,255,148,0.4)] transition-all font-bold"
              >
                Start Hunting
              </button>
            </div>

            {/* Mobile Hamburger Button */}
            <button
              className="md:hidden relative z-50 text-white p-2 hover:text-[var(--primary)] transition-colors"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <span className="text-2xl">☰</span>
            </button>
          </div>
        </div>
      </nav>

      {/* MOBILE MENU OVERLAY */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center p-8 animate-fade-in-up">
          {/* Close Button */}
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors"
          >
            <span className="text-3xl">✕</span>
          </button>

          <nav className="flex flex-col items-center gap-10 text-2xl font-bold tracking-tight">
            <Link href="/login" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-[var(--primary)] transition-colors flex items-center gap-3">
              Login <span className="px-2 py-1 rounded bg-white/10 text-[10px] text-white/50 border border-white/10 uppercase tracking-widest font-mono">SOON</span>
            </Link>
            <Link href="/niches" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-[var(--primary)] transition-colors flex items-center gap-3">
              Niches <span className="px-2 py-1 rounded bg-white/10 text-[10px] text-white/50 border border-white/10 uppercase tracking-widest font-mono">SOON</span>
            </Link>
            <Link href="#" onClick={() => setIsMobileMenuOpen(false)} className="text-white hover:text-[var(--primary)] transition-colors flex items-center gap-3">
              Get Pro <span className="px-2 py-1 rounded bg-white/10 text-[10px] text-white/50 border border-white/10 uppercase tracking-widest font-mono">SOON</span>
            </Link>
            <button
              onClick={() => { onSubscribeClick?.(); setIsMobileMenuOpen(false); }}
              className="btn-primary text-lg px-10 py-5 mt-4 shadow-[0_0_30px_rgba(0,255,148,0.3)]"
            >
              Start Hunting
            </button>
          </nav>

          <div className="absolute bottom-10 text-xs text-white/20 font-mono">
            NICHES HUNTER INTELLIGENCE
          </div>
        </div>
      )}
    </>
  );
}

