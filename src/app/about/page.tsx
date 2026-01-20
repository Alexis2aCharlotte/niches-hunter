import { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "About | NICHES HUNTER",
  description: "NICHES HUNTER helps indie developers discover profitable iOS app opportunities before the competition.",
}

export default function AboutPage() {
  return (
    <main className="min-h-screen relative overflow-hidden text-white font-sans selection:bg-[#00CC3D] selection:text-black">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-blue-500/5 blur-[200px] rounded-full" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-[var(--primary)]/5 blur-[150px] rounded-full" />
      </div>

      {/* Content */}
      <section className="relative pt-32 pb-20 px-6">
        <div className="max-w-3xl mx-auto">
          
          <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
            About <span className="text-flashy-green">NICHES HUNTER</span>
          </h1>
          
          <div className="space-y-6 text-lg text-white/70 leading-relaxed">
            <p>
              <strong className="text-white">NICHES HUNTER</strong> helps indie developers discover profitable iOS app opportunities before the competition.
            </p>

            <p>
              Every day, we analyze thousands of apps across the App Store to identify emerging trends, underserved markets, and profitable niches you can actually build.
            </p>

            <p>
              Whether you're launching your first app or looking for your next idea, we provide the market intelligence you need to build with confidence.
            </p>
          </div>

          {/* What We Do */}
          <div className="mt-12 grid md:grid-cols-3 gap-6">
            {[
              {
                icon: "🔍",
                title: "Market Analysis",
                desc: "Daily insights on App Store trends and opportunities"
              },
              {
                icon: "📊",
                title: "Niche Intelligence",
                desc: "Detailed breakdowns of profitable app categories"
              },
              {
                icon: "🎯",
                title: "Actionable Data",
                desc: "Real metrics to validate your next app idea"
              }
            ].map((item, i) => (
              <div key={i} className="liquid-card p-6 text-center">
                <div className="text-4xl mb-3">{item.icon}</div>
                <h3 className="font-bold mb-2">{item.title}</h3>
                <p className="text-sm text-white/50">{item.desc}</p>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-16 text-center">
            <Link 
              href="/niches"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-[var(--primary)] text-black font-bold hover:bg-[#00E847] transition-all shadow-[0_0_30px_rgba(0,204,61,0.3)]"
            >
              Explore Niches →
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative px-6 py-10 border-t border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <span className="font-bold text-sm tracking-widest text-white/40">NICHES HUNTER</span>
          <div className="flex items-center gap-6 text-xs text-white/30">
            <Link href="/niches" className="hover:text-white transition-colors">Niches</Link>
            <Link href="/blog" className="hover:text-white transition-colors">Blog</Link>
            <Link href="/about" className="hover:text-white transition-colors">About</Link>
          </div>
          <span className="text-xs text-white/20">© 2026 Niches Hunter. All rights reserved.</span>
        </div>
      </footer>
    </main>
  )
}
