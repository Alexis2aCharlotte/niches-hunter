"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface NavbarProps {
  onSubscribeClick?: () => void;
}

export default function Navbar({ onSubscribeClick }: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Vérifier si l'utilisateur est connecté
    async function checkAuth() {
      try {
        const res = await fetch('/api/user/me');
        const data = await res.json();
        setIsLoggedIn(!!data.user);
      } catch {
        setIsLoggedIn(false);
      }
    }
    checkAuth();
  }, []);

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
            {isLoggedIn ? (
              <Link href="/account" className="hover:text-[var(--primary)] transition-colors flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[var(--primary)]"></span>
                My Account
              </Link>
            ) : (
              <Link href="/login" className="hover:text-[var(--primary)] transition-colors">
                Login
              </Link>
            )}

            {/* Niches Toolkit Dropdown */}
            <div className="relative group">
              <button className="flex items-center gap-2 text-white font-bold hover:text-[var(--primary)] transition-colors">
                Niches Toolkit
                <svg className="w-3.5 h-3.5 opacity-40 group-hover:opacity-100 group-hover:rotate-180 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
              </button>
              {/* Dropdown Menu */}
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-64 py-2 rounded-2xl bg-[#111111] border border-white/[0.08] shadow-[0_20px_50px_rgba(0,0,0,0.8)] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-3 group-hover:translate-y-0">
                <div className="px-3 py-2">
                  <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest px-2">Free Tools</span>
                </div>
                <Link href="/niches" className="flex items-center gap-3 mx-2 px-3 py-2.5 rounded-xl hover:bg-[var(--primary)]/10 text-white/80 hover:text-white transition-all group/item">
                  <div>
                    <div className="text-sm font-semibold">Niche Ideas</div>
                    <div className="text-[10px] text-white/40">Browse validated niches</div>
                  </div>
                </Link>
                <Link href="/niche-roulette" className="flex items-center gap-3 mx-2 px-3 py-2.5 rounded-xl hover:bg-[var(--primary)]/10 text-white/80 hover:text-white transition-all group/item">
                  <div>
                    <div className="text-sm font-semibold">Niche Roulette</div>
                    <div className="text-[10px] text-white/40">Let fate pick your niche</div>
                  </div>
                </Link>
                <Link href="/revenue-estimator" className="flex items-center gap-3 mx-2 px-3 py-2.5 rounded-xl hover:bg-[var(--primary)]/10 text-white/80 hover:text-white transition-all group/item">
                  <div>
                    <div className="text-sm font-semibold">Revenue Estimator</div>
                    <div className="text-[10px] text-white/40">Estimate your MRR potential</div>
                  </div>
                </Link>
                <Link href="/niche-validator" className="flex items-center gap-3 mx-2 px-3 py-2.5 rounded-xl hover:bg-[var(--primary)]/10 text-white/80 hover:text-white transition-all group/item">
                  <div>
                    <div className="text-sm font-semibold flex items-center gap-2">
                      Niche Validator
                      <span className="text-[8px] px-1.5 py-0.5 rounded bg-[var(--primary)]/20 text-[var(--primary)] font-bold">PRO</span>
                    </div>
                    <div className="text-[10px] text-white/40">Validate your idea with AI</div>
                  </div>
                </Link>
              </div>
            </div>

            {/* Resources Dropdown */}
            <div className="relative group">
              <button className="flex items-center gap-2 hover:text-[var(--primary)] transition-colors">
                Resources
                <svg className="w-3.5 h-3.5 opacity-40 group-hover:opacity-100 group-hover:rotate-180 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
              </button>
              {/* Dropdown Menu */}
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-56 py-2 rounded-2xl bg-[#111111] border border-white/[0.08] shadow-[0_20px_50px_rgba(0,0,0,0.8)] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-3 group-hover:translate-y-0">
                {!isLoggedIn && (
                  <>
                    <div className="px-3 py-2">
                      <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest px-2">Upgrade</span>
                    </div>
                    <Link 
                      href="/pricing"
                      className="flex items-center gap-3 mx-2 px-3 py-2.5 rounded-xl hover:bg-[var(--primary)]/10 text-white/80 hover:text-white transition-all"
                    >
                      <div>
                        <div className="text-sm font-semibold flex items-center gap-2">
                          Get Pro
                          <span className="text-[8px] px-1.5 py-0.5 rounded bg-[var(--primary)]/20 text-[var(--primary)] font-bold">PRO</span>
                        </div>
                        <div className="text-[10px] text-white/40">Unlock all features</div>
                      </div>
                    </Link>
                    <div className="my-2 mx-4 h-px bg-white/[0.06]" />
                  </>
                )}
                <div className="px-3 py-2">
                  <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest px-2">Explore</span>
                </div>
                <Link href="/blog" className="block mx-2 px-3 py-2.5 rounded-xl hover:bg-[var(--primary)]/10 text-white/80 hover:text-white transition-all">
                  <div className="text-sm font-semibold">Blog</div>
                </Link>
                <div className="my-2 mx-4 h-px bg-white/[0.06]" />
                <div className="px-3 py-2">
                  <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest px-2">Company</span>
                </div>
                <Link href="/about" className="block mx-2 px-3 py-2.5 rounded-xl hover:bg-[var(--primary)]/10 text-white/80 hover:text-white transition-all">
                  <div className="text-sm font-semibold">About</div>
                </Link>
              </div>
            </div>
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

          <nav className="flex flex-col items-center gap-8 text-2xl font-bold tracking-tight">
            {isLoggedIn ? (
              <Link href="/account" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-[var(--primary)] transition-colors flex items-center gap-3">
                <span className="w-3 h-3 rounded-full bg-[var(--primary)]"></span>
                My Account
              </Link>
            ) : (
              <Link href="/login" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-[var(--primary)] transition-colors">
                Login
              </Link>
            )}
            {/* Niches Toolkit Section */}
            <div className="text-center">
              <div className="text-xs text-white/30 uppercase tracking-widest mb-4">Niches Toolkit</div>
              <div className="flex flex-col gap-4">
                <Link href="/niches" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-[var(--primary)] transition-colors">
                  Niche Ideas
                </Link>
                <Link href="/niche-roulette" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-[var(--primary)] transition-colors">
                  Niche Roulette
                </Link>
                <Link href="/revenue-estimator" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-[var(--primary)] transition-colors">
                  Revenue Estimator
                </Link>
                <Link href="/niche-validator" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-[var(--primary)] transition-colors flex items-center justify-center gap-2 text-lg">
                  Niche Validator <span className="text-[10px] px-2 py-0.5 rounded bg-[var(--primary)]/20 text-[var(--primary)]">PRO</span>
                </Link>
              </div>
            </div>
            <div className="w-24 h-px bg-white/10 my-2"></div>
            {/* Resources Section */}
            <div className="text-center">
              <div className="text-xs text-white/30 uppercase tracking-widest mb-4">Resources</div>
              <div className="flex flex-col gap-4">
                {!isLoggedIn && (
                  <Link 
                    href="/pricing"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="hover:text-[var(--primary)] transition-colors flex items-center justify-center gap-2 text-lg"
                  >
                    Get Pro <span className="text-[10px] px-2 py-0.5 rounded bg-[var(--primary)]/20 text-[var(--primary)]">PRO</span>
                  </Link>
                )}
                <Link href="/blog" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-[var(--primary)] transition-colors">
                  Blog
                </Link>
                <Link href="/about" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-[var(--primary)] transition-colors">
                  About
                </Link>
              </div>
            </div>
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

