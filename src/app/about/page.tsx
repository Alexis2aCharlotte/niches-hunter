import { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "About Niches Hunter - The Story Behind the #1 App Niche Finder Tool",
  description: "Discover how Niches Hunter was built by an indie developer frustrated with endless market research. We analyze 40,000+ iOS apps daily to help you find profitable app ideas fast.",
  keywords: [
    "about niches hunter",
    "app niche finder tool",
    "ios app market research",
    "find profitable app ideas",
    "indie developer tools",
    "app store opportunity finder",
    "mobile app market analysis",
    "app idea validation tool",
    "solo developer resources",
    "app store trends analysis"
  ],
  openGraph: {
    title: "About Niches Hunter - Built by an Indie Dev, for Indie Devs",
    description: "We analyze 40,000+ iOS apps daily to help indie developers discover profitable app opportunities before the competition.",
    type: "website",
    url: "https://nicheshunter.app/about",
    images: [
      {
        url: "https://nicheshunter.app/og-about.png",
        width: 1200,
        height: 630,
        alt: "Niches Hunter - App Niche Finder Tool"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "About Niches Hunter - The Story Behind the Tool",
    description: "Built by an indie developer who was tired of spending weeks on market research instead of coding.",
    creator: "@Tobby_scraper"
  },
  alternates: {
    canonical: "https://nicheshunter.app/about",
  },
}

export default function AboutPage() {
  const stats = [
    { value: "40,000+", label: "Apps Analyzed Daily" },
    { value: "99+", label: "Validated Niches" },
    { value: "75+", label: "Happy Builders" },
    { value: "24/7", label: "Market Monitoring" },
  ]

  const timeline = [
    {
      year: "The Problem",
      title: "Endless Research, Zero Code",
      description: "Like many indie developers, I spent weeks researching app ideas before writing a single line of code. Analyzing competitors, checking revenue estimates, validating market demand... It was exhausting and killed my momentum."
    },
    {
      year: "The Frustration",
      title: "I Just Wanted to Build",
      description: "I'm impatient. I love coding. But I couldn't justify diving into a project without knowing if the market was there. The gap between 'having an idea' and 'confidently starting to code' was way too long."
    },
    {
      year: "The Solution",
      title: "Building Niches Hunter",
      description: "So I built the tool I wished existed. A system that analyzes 40,000+ apps daily, spots emerging opportunities, and gives me everything I need to validate a niche in minutes instead of weeks."
    },
    {
      year: "Today",
      title: "Helping 80+ Builders Ship Faster",
      description: "Now I can focus on what I love: coding. And I'm sharing this tool with other indie developers who want to skip the research phase and go straight to building profitable apps."
    },
  ]

  const values = [
    {
      title: "Speed Over Perfection",
      description: "In the app world, timing is everything. We help you validate ideas fast so you can ship before the competition catches on."
    },
    {
      title: "Data-Driven Decisions",
      description: "No more gut feelings. Every niche we surface is backed by real App Store data, revenue estimates, and competitive analysis."
    },
    {
      title: "Built for Solo Devs",
      description: "We filter out opportunities that require big teams or massive budgets. Every niche is something YOU can actually build."
    },
    {
      title: "Always Fresh",
      description: "The App Store changes daily. Our data does too. We continuously monitor trends so you never miss an emerging opportunity."
    },
  ]

  const faqs = [
    {
      q: "What exactly does Niches Hunter do?",
      a: "Niches Hunter analyzes over 40,000 iOS apps daily to identify profitable opportunities for indie developers. We track revenue estimates, competition levels, market trends, and emerging niches so you can find your next app idea without spending weeks on research."
    },
    {
      q: "Who is Niches Hunter for?",
      a: "Niches Hunter is built specifically for indie developers, solo founders, and small studios who want to build profitable iOS apps. Whether you're launching your first app or looking for your next project, we help you find validated opportunities that match your skills and resources."
    },
    {
      q: "How is this different from other market research tools?",
      a: "Most tools give you raw data and expect you to figure it out. Niches Hunter does the analysis for you. We don't just show you what's trending—we identify specific opportunities, explain why they're worth pursuing, and give you a clear path to compete."
    },
    {
      q: "How often is the data updated?",
      a: "Our system analyzes the App Store 24/7. Niche opportunities are updated daily, and our trending data refreshes continuously. You're always seeing the latest market intelligence."
    },
    {
      q: "Can I really build a profitable app with this?",
      a: "We can't guarantee success—that depends on your execution. But we can guarantee you'll start with validated market demand, clear competitive insights, and a much higher chance of building something people actually want to pay for."
    },
  ]

  return (
    <main className="min-h-screen relative overflow-hidden text-white font-sans selection:bg-[#00CC3D] selection:text-black">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-blue-500/5 blur-[200px] rounded-full" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-[var(--primary)]/5 blur-[150px] rounded-full" />
      </div>

      {/* Hero Section */}
      <section className="relative pt-32 pb-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--primary)]/10 border border-[var(--primary)]/20 mb-6">
            <span className="w-2 h-2 rounded-full bg-[var(--primary)] animate-pulse" />
            <span className="text-xs font-mono text-[var(--primary)] uppercase tracking-wider">Our Story</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight leading-tight">
            Built by an Indie Dev <br />
            <span className="text-flashy-green">For Indie Devs</span>
          </h1>
          
          <p className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto leading-relaxed">
            I was tired of spending weeks on market research instead of coding. So I built Niches Hunter: the tool that lets you validate app ideas in minutes, not months.
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {stats.map((stat, i) => (
              <div 
                key={i} 
                className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 text-center"
              >
                <div className="text-2xl md:text-3xl font-bold text-[var(--primary)] mb-1">{stat.value}</div>
                <div className="text-xs md:text-sm text-white/50">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The Story Section */}
      <section className="relative py-16 md:py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              The Story Behind <span className="text-flashy-green">Niches Hunter</span>
            </h2>
            <p className="text-white/50 max-w-xl mx-auto">
              From frustrated developer to building the tool I always needed
            </p>
          </div>

          <div className="space-y-8 md:space-y-12">
            {timeline.map((item, i) => (
              <div key={i} className="flex gap-6 md:gap-8">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-[var(--primary)]/20 border border-[var(--primary)]/30 flex items-center justify-center text-[var(--primary)] font-bold text-sm">
                    {i + 1}
                  </div>
                  {i < timeline.length - 1 && (
                    <div className="w-px h-full bg-gradient-to-b from-[var(--primary)]/30 to-transparent mt-4" />
                  )}
                </div>
                <div className="flex-1 pb-8">
                  <div className="text-xs font-mono text-[var(--primary)] uppercase tracking-wider mb-2">
                    {item.year}
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-white mb-3">
                    {item.title}
                  </h3>
                  <p className="text-white/60 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="relative py-16 md:py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Our <span className="text-flashy-green">Mission</span>
            </h2>
          </div>

          <div className="p-8 md:p-12 rounded-3xl bg-gradient-to-br from-[var(--primary)]/10 to-transparent border border-[var(--primary)]/20">
            <p className="text-xl md:text-2xl text-white/90 leading-relaxed text-center">
              "To help every indie developer <span className="text-[var(--primary)] font-semibold">skip the guesswork</span> and start building apps with confidence. 
              We believe the best ideas deserve to be built—not buried under weeks of market research."
            </p>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="relative py-16 md:py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              What We <span className="text-flashy-green">Believe</span>
            </h2>
            <p className="text-white/50 max-w-xl mx-auto">
              The principles that guide everything we build
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {values.map((value, i) => (
              <div 
                key={i} 
                className="p-6 md:p-8 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-white/20 transition-all"
              >
                <h3 className="text-xl font-bold text-white mb-3">{value.title}</h3>
                <p className="text-white/60 leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Founder Section */}
      <section className="relative py-16 md:py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Meet the <span className="text-flashy-green">Founder</span>
            </h2>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12 p-8 md:p-12 rounded-3xl bg-white/[0.03] border border-white/10">
            <div className="flex-shrink-0">
              <img 
                src="/founder.jpg" 
                alt="Tobby - Founder of Niches Hunter"
                className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-[var(--primary)]/30"
              />
            </div>
            <div className="text-center md:text-left">
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">Tobby</h3>
              <p className="text-[var(--primary)] font-medium mb-4">Founder & Developer</p>
              <p className="text-white/60 leading-relaxed mb-6">
                I'm an indie developer who loves building apps but hates the endless research phase. 
                I created Niches Hunter to solve my own problem: spending more time coding and less time 
                wondering if my idea was worth pursuing. Now I'm on a mission to help other developers 
                do the same.
              </p>
              <a 
                href="https://x.com/Tobby_scraper" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 transition-all text-sm"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
                @Tobby_scraper
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="relative py-16 md:py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              How Niches Hunter <span className="text-flashy-green">Works</span>
            </h2>
            <p className="text-white/50 max-w-xl mx-auto">
              From idea to validated niche in minutes
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            {[
              {
                step: "1",
                title: "We Analyze the Market",
                description: "Our system scans 40,000+ iOS apps daily, tracking downloads, revenue estimates, ratings, and competitive dynamics across every category."
              },
              {
                step: "2",
                title: "We Spot Opportunities",
                description: "Using our proprietary algorithms, we identify niches with high demand, low competition, and realistic revenue potential for solo developers."
              },
              {
                step: "3",
                title: "You Build with Confidence",
                description: "Browse validated niches, dive into detailed analysis, and start coding knowing your idea has real market potential."
              }
            ].map((item, i) => (
              <div key={i} className="p-6 md:p-8 rounded-2xl bg-white/[0.03] border border-white/10">
                <div className="w-8 h-8 rounded-full bg-[var(--primary)]/20 text-[var(--primary)] flex items-center justify-center text-sm font-bold mb-4">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                <p className="text-white/60 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="relative py-16 md:py-24 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Frequently Asked <span className="text-flashy-green">Questions</span>
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <details 
                key={i} 
                className="group p-6 rounded-2xl bg-white/[0.03] border border-white/10 cursor-pointer"
              >
                <summary className="flex items-center justify-between font-semibold text-white list-none">
                  {faq.q}
                  <span className="ml-4 text-[var(--primary)] group-open:rotate-45 transition-transform">+</span>
                </summary>
                <p className="mt-4 text-white/60 leading-relaxed">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-16 md:py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Ready to Find Your <span className="text-flashy-green">Next App Idea</span>?
          </h2>
          <p className="text-lg text-white/60 mb-8 max-w-xl mx-auto">
            Stop researching. Start building. Join 75+ indie developers who are already hunting profitable niches.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              href="/niches"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-[var(--primary)] text-black font-bold hover:bg-[#00E847] transition-all shadow-[0_0_30px_rgba(0,204,61,0.3)]"
            >
              Explore Niches →
            </Link>
            <Link 
              href="/pricing"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-white/10 text-white font-bold hover:bg-white/20 transition-all"
            >
              View Pricing
            </Link>
          </div>
        </div>
      </section>

      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "Niches Hunter",
            "url": "https://nicheshunter.app",
            "logo": "https://nicheshunter.app/logo.png",
            "description": "Niches Hunter helps indie developers discover profitable iOS app opportunities by analyzing 40,000+ apps daily.",
            "founder": {
              "@type": "Person",
              "name": "Tobby",
              "sameAs": "https://x.com/Tobby_scraper"
            },
            "sameAs": [
              "https://x.com/nicheshunter",
              "https://x.com/Tobby_scraper"
            ]
          })
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": faqs.map(faq => ({
              "@type": "Question",
              "name": faq.q,
              "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.a
              }
            }))
          })
        }}
      />

      {/* Footer */}
      <footer className="relative px-6 py-10 border-t border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <span className="font-bold text-sm tracking-widest text-white/40">NICHES HUNTER</span>
          <div className="flex items-center gap-6 text-xs text-white/30">
            <Link href="/niches" className="hover:text-white transition-colors">Niches</Link>
            <Link href="/blog" className="hover:text-white transition-colors">Blog</Link>
            <Link href="/about" className="hover:text-white transition-colors">About</Link>
            <Link href="https://x.com/nicheshunter" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Twitter</Link>
          </div>
          <span className="text-xs text-white/20">© 2026 Niches Hunter. All rights reserved.</span>
        </div>
      </footer>
    </main>
  )
}
