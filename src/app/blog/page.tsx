"use client";

import Link from "next/link";
import Navbar from "@/components/Navbar";

// Types
interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  date: string;
  image?: string;
}

// Mock Data
const blogPosts: BlogPost[] = [
  {
    id: "1",
    title: "How to Find Your First Profitable iOS Niche in 2024",
    excerpt: "Discover the step-by-step process we use to identify $10K+ MRR opportunities in the App Store before they become competitive.",
    category: "Strategy",
    readTime: "8 min",
    date: "Dec 12, 2024",
  },
  {
    id: "2",
    title: "The Rise of AI Education Apps: A Deep Dive",
    excerpt: "Why AI tutoring apps are exploding and how indie developers can capitalize on this $8B market opportunity.",
    category: "Market Analysis",
    readTime: "12 min",
    date: "Dec 10, 2024",
  },
  {
    id: "3",
    title: "From $0 to $50K MRR: 5 Indie Success Stories",
    excerpt: "Real stories from indie developers who built profitable iOS apps by targeting underserved niches.",
    category: "Case Study",
    readTime: "15 min",
    date: "Dec 8, 2024",
  },
  {
    id: "4",
    title: "Why Most App Ideas Fail (And How to Avoid It)",
    excerpt: "The 3 critical mistakes that kill 90% of app projects before they even launch. Learn how to validate before you build.",
    category: "Strategy",
    readTime: "6 min",
    date: "Dec 5, 2024",
  },
  {
    id: "5",
    title: "EU vs US: Where Should You Launch Your App?",
    excerpt: "A data-driven comparison of the two biggest app markets. Spoiler: the EU is massively underserved.",
    category: "Market Analysis",
    readTime: "10 min",
    date: "Dec 2, 2024",
  },
  {
    id: "6",
    title: "The Micro-SaaS Toolkit: What You Actually Need",
    excerpt: "Stop over-engineering. Here's the minimal tech stack to validate and launch your iOS app in 30 days.",
    category: "Guide",
    readTime: "7 min",
    date: "Nov 28, 2024",
  },
];

const categories = ["All", "Strategy", "Market Analysis", "Case Study", "Guide"];

export default function BlogPage() {
  return (
    <main className="min-h-screen relative overflow-hidden text-white font-sans selection:bg-[#00CC3D] selection:text-black">
      <Navbar />

      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-purple-500/5 blur-[200px] rounded-full" />
        <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] bg-[var(--primary)]/5 blur-[150px] rounded-full" />
      </div>

      {/* Header */}
      <section className="relative pt-32 pb-12 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 mb-6">
            <span className="text-sm">📝</span>
            <span className="text-xs font-mono text-purple-400 uppercase tracking-wider">Insights & Guides</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
            The Niche <span className="text-flashy-green">Blog</span>
          </h1>
          <p className="text-lg text-white/50 max-w-2xl mx-auto">
            Strategies, market analysis, and success stories to help you build profitable iOS apps.
          </p>
        </div>
      </section>

      {/* Categories */}
      <section className="relative px-6 pb-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((cat, i) => (
              <button
                key={cat}
                className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
                  i === 0
                    ? "bg-[var(--primary)] text-black shadow-[0_0_20px_rgba(0,204,61,0.3)]"
                    : "bg-white/5 text-white/60 border border-white/10 hover:bg-white/10 hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Post */}
      <section className="relative px-6 pb-12">
        <div className="max-w-5xl mx-auto">
          <div className="liquid-card p-1 rounded-3xl">
            <div className="bg-[#080808] rounded-[22px] p-8 md:p-12 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-80 h-80 bg-[var(--primary)]/10 blur-[100px] rounded-full pointer-events-none" />
              <div className="relative z-10 flex flex-col md:flex-row gap-8">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="px-3 py-1 rounded-full bg-[var(--primary)]/20 text-[var(--primary)] text-xs font-bold">
                      FEATURED
                    </span>
                    <span className="text-white/30 text-sm">{blogPosts[0].date}</span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold mb-4 hover:text-[var(--primary)] transition-colors cursor-pointer">
                    {blogPosts[0].title}
                  </h2>
                  <p className="text-white/50 mb-6 leading-relaxed">
                    {blogPosts[0].excerpt}
                  </p>
                  <div className="flex items-center gap-4">
                    <span className="px-3 py-1 rounded-full border border-white/10 bg-white/5 text-xs text-white/60">
                      {blogPosts[0].category}
                    </span>
                    <span className="text-xs text-white/40">{blogPosts[0].readTime} read</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="relative px-6 pb-24">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogPosts.slice(1).map((post) => (
              <article
                key={post.id}
                className="liquid-card p-6 cursor-pointer group transition-all duration-300 hover:scale-[1.02]"
              >
                <div className="flex items-center gap-3 mb-4">
                  <span className="px-2 py-0.5 rounded border border-white/10 bg-white/5 text-[10px] text-white/60">
                    {post.category}
                  </span>
                  <span className="text-[10px] text-white/30">{post.readTime}</span>
                </div>
                <h3 className="text-lg font-bold text-white group-hover:text-[var(--primary)] transition-colors mb-3 leading-snug">
                  {post.title}
                </h3>
                <p className="text-sm text-white/40 leading-relaxed line-clamp-3 mb-4">
                  {post.excerpt}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-white/30">{post.date}</span>
                  <span className="text-[var(--primary)] opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="relative px-6 pb-24">
        <div className="max-w-3xl mx-auto text-center">
          <div className="liquid-card p-1 rounded-3xl">
            <div className="bg-[#080808] rounded-[22px] p-10 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-[var(--primary)]/5 to-transparent" />
              <div className="relative z-10">
                <h3 className="text-2xl font-bold mb-3">Get Weekly Insights</h3>
                <p className="text-white/50 mb-6">Join 2,100+ builders receiving niche ideas and market analysis every week.</p>
                <Link 
                  href="/"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-[var(--primary)] text-black font-bold hover:bg-[#00E847] transition-all shadow-[0_0_30px_rgba(0,204,61,0.3)]"
                >
                  Subscribe Free →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative px-6 py-10 border-t border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <span className="font-bold text-sm tracking-widest text-white/40">NICHES HUNTER</span>
          <div className="flex items-center gap-6 text-xs text-white/30">
            <Link href="#" className="hover:text-white transition-colors">Privacy</Link>
            <Link href="#" className="hover:text-white transition-colors">Terms</Link>
            <Link href="#" className="hover:text-white transition-colors">Twitter</Link>
          </div>
          <span className="text-xs text-white/20">© 2024 Niches Hunter. All rights reserved.</span>
        </div>
      </footer>
    </main>
  );
}

