"use client";

import Link from "next/link";
import LiquidCard from "@/components/LiquidCard";

interface ProModalProps {
  isOpen: boolean;
  onClose: () => void;
  feature?: string;
}

export default function ProModal({ isOpen, onClose, feature }: ProModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl"
      onClick={onClose}
    >
      <LiquidCard
        className="w-full max-w-sm p-1 !p-1 relative animate-scale-up shadow-[0_0_100px_rgba(0,204,61,0.15)]"
      >
        <div className="bg-[#050505] rounded-[22px] p-8 relative overflow-hidden" onClick={(e) => e.stopPropagation()}>
          <button onClick={onClose} className="absolute top-4 right-4 text-white/20 hover:text-white text-lg transition-colors z-20">
            ✕
          </button>

          <div className="flex justify-center mb-5">
            <div className="w-14 h-14 rounded-2xl bg-[var(--primary)]/10 border border-[var(--primary)]/20 flex items-center justify-center">
              <svg className="w-6 h-6 text-[var(--primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
              </svg>
            </div>
          </div>

          <div className="text-center mb-6">
            <h3 className="text-xl font-bold text-white mb-2">This is a demo</h3>
            <p className="text-sm text-white/50 leading-relaxed">
              {feature
                ? <>The <span className="text-white font-medium">{feature}</span> feature is available with a Pro subscription.</>
                : <>Get full access to all features with a Pro subscription.</>
              }
            </p>
          </div>

          <Link
            href="/pricing"
            className="block w-full py-3.5 text-sm font-bold tracking-wide rounded-xl bg-[var(--primary)] hover:bg-[#00E847] text-black transition-all shadow-[0_0_20px_rgba(0,204,61,0.3)] hover:shadow-[0_0_30px_rgba(0,204,61,0.5)] text-center"
          >
            Get Pro →
          </Link>

          <p className="mt-3 text-center text-[10px] text-white/25">
            Unlock all niches, workspace & tools
          </p>
        </div>
      </LiquidCard>
    </div>
  );
}
