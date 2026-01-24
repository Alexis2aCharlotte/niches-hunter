'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import LiquidCard from '@/components/LiquidCard'

// Types
interface TrendingApp {
  name: string
  category: string
  growth: string
  description: string
  strongMarket: string
  estimatedMRR: string
  keyPoints: string[]
  weakPoints: string[]
}

interface MarketingStrategy {
  channel: string
  strategy: string
  estimatedCost: string
}

interface Niche {
  id: string
  displayCode: string
  title: string
  category: string
  tags: string[]
  score: number
  opportunity: string
  gap: string
  move: string
  stats: {
    competition: string
    potential: string
    revenue: string
    market: string
    timeToMVP: string
    difficulty: string
  }
  marketAnalysis: {
    totalMarketSize: string
    growthRate: string
    targetAudience: string
    geographicFocus: string[]
  }
  keyLearnings: string[]
  improvements: string[]
  marketingStrategies: MarketingStrategy[]
  monetization: {
    model: string
    pricing: string
    conversionRate: string
  }
  techStack: string[]
  risks: string[]
  trending: TrendingApp[]
}

// Transform API response to Niche type
function transformNiche(row: any): Niche {
  return {
    id: row.id,
    displayCode: row.display_code || row.id,
    title: row.title,
    category: row.category,
    tags: row.tags || [],
    score: row.score || 0,
    opportunity: row.opportunity,
    gap: row.gap,
    move: row.move,
    stats: row.stats || {},
    marketAnalysis: row.market_analysis || {},
    keyLearnings: row.key_learnings || [],
    improvements: row.improvements || [],
    marketingStrategies: row.marketing_strategies || [],
    monetization: row.monetization || {},
    techStack: row.tech_stack || [],
    risks: row.risks || [],
    trending: row.trending || [],
  }
}

export default function WorkspaceNichePage() {
  const params = useParams()
  const router = useRouter()
  const nicheId = params.id as string

  const [niche, setNiche] = useState<Niche | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'overview' | 'apps' | 'strategy'>('overview')
  const [selectedApp, setSelectedApp] = useState<TrendingApp | null>(null)
  
  // Project creation
  const [showProjectModal, setShowProjectModal] = useState(false)
  const [projectName, setProjectName] = useState('')
  const [projectLoading, setProjectLoading] = useState(false)
  const [hasProject, setHasProject] = useState(false)

  // Load niche data
  useEffect(() => {
    async function loadNiche() {
      try {
        const res = await fetch(`/api/niches/${nicheId}`, {
          credentials: 'include',
        })
        
        if (!res.ok) {
          router.push('/workspace')
          return
        }
        
        const data = await res.json()
        if (data.niche) {
          setNiche(transformNiche(data.niche))
          setProjectName(data.niche.title || `Niche #${nicheId}`)
        }
        
        // Check if project exists for this niche
        const projRes = await fetch('/api/projects', { credentials: 'include' })
        if (projRes.ok) {
          const projData = await projRes.json()
          setHasProject(projData.projects?.some((p: any) => p.saved_niche_id === nicheId))
        }
      } catch (error) {
        console.error('Error loading niche:', error)
        router.push('/workspace')
      } finally {
        setLoading(false)
      }
    }
    
    loadNiche()
  }, [nicheId, router])

  // Create project from niche
  const handleCreateProject = async () => {
    if (!projectName.trim()) return
    
    setProjectLoading(true)
    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          name: projectName.trim(),
          saved_niche_id: nicheId,
        }),
      })
      
      if (res.ok) {
        const data = await res.json()
        router.push(`/workspace/project/${data.project.id}`)
      }
    } catch (error) {
      console.error('Error creating project:', error)
    } finally {
      setProjectLoading(false)
    }
  }

  if (loading) {
    return (
      <main className="workspace-page min-h-screen text-white font-sans pt-20">
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-[var(--primary)]/5 blur-[150px] rounded-full" />
        </div>
        <section className="relative pt-8 pb-20 px-6">
          <div className="max-w-5xl mx-auto">
            <div className="h-8 w-32 bg-white/5 rounded-lg animate-pulse mb-8" />
            <div className="h-64 bg-white/5 rounded-2xl animate-pulse" />
          </div>
        </section>
      </main>
    )
  }

  if (!niche) {
    return null
  }

  return (
    <main className="workspace-page min-h-screen text-white font-sans selection:bg-[var(--primary)] selection:text-black pt-20">
      {/* Ambient Glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-[var(--primary)]/5 blur-[150px] rounded-full" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-purple-500/5 blur-[120px] rounded-full" />
      </div>

      {/* Workspace Header */}
      <header className="sticky top-20 z-40 bg-[var(--bg-deep)]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between relative">
          <Link 
            href="/workspace"
            className="text-sm text-white/40 hover:text-white transition-colors"
          >
            ← Go back
          </Link>
          <Link 
            href="/workspace"
            className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2 text-white hover:text-[var(--primary)] transition-colors"
          >
            <span className="font-bold text-lg tracking-wider">NICHES HUNTER</span>
          </Link>
          <div className="w-20"></div>
        </div>
      </header>

      <section className="relative pt-8 pb-20 px-6">
        <div className="max-w-5xl mx-auto">

          {/* Header */}
          <LiquidCard className="p-8 mb-6">
            <div className="flex justify-between items-start mb-4">
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-xs font-mono text-white/30">#{niche.displayCode}</span>
                <span className="px-3 py-1 rounded-full bg-white/10 text-xs text-white/70 font-medium">
                  {niche.category}
                </span>
                {niche.tags.slice(0, 3).map(tag => (
                  <span key={tag} className="px-2 py-0.5 rounded border border-[var(--primary)]/20 bg-[var(--primary)]/10 text-[10px] text-[var(--primary)]">
                    {tag}
                  </span>
                ))}
              </div>
              
              <div className="px-4 py-2 rounded-full bg-[var(--primary)] text-black text-sm font-bold shrink-0">
                {niche.score}/100
              </div>
            </div>
            
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-4">{niche.title}</h1>
            
            <div className="flex flex-wrap justify-between items-center gap-3">
              <div className="flex flex-wrap items-center gap-2 md:gap-4">
                <div className="px-3 md:px-4 py-1.5 md:py-2 rounded-full bg-white/10 text-white/70 text-xs md:text-sm">
                  {niche.stats.market} Primary Market
                </div>
                <div className="px-3 md:px-4 py-1.5 md:py-2 rounded-full bg-white/10 text-white/70 text-xs md:text-sm">
                  {niche.stats.timeToMVP} to MVP
                </div>
              </div>
              
              {/* Start Project Button */}
              {hasProject ? (
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--primary)]/20 text-[var(--primary)] text-sm font-medium">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 12l2 2 4-4"/>
                  </svg>
                  Project Created
                </span>
              ) : (
                <button
                  onClick={() => setShowProjectModal(true)}
                  className="px-4 py-2 rounded-xl bg-[var(--primary)] text-black text-sm font-bold hover:bg-[#00E847] transition-all"
                >
                  Start Project →
                </button>
              )}
            </div>
          </LiquidCard>

          {/* Tabs */}
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
            {[
              { id: 'overview', label: 'Overview & Analysis' },
              { id: 'apps', label: 'Trending Apps' },
              { id: 'strategy', label: 'Strategy & Execution' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`px-6 py-3 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                  activeTab === tab.id 
                    ? 'bg-[var(--primary)] text-black' 
                    : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Opportunity Analysis */}
              <LiquidCard className="p-8">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-[var(--primary)]/20 flex items-center justify-center text-[var(--primary)]">🎯</span>
                  Opportunity Analysis
                </h2>
                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <h4 className="text-xs font-bold text-[var(--primary)] uppercase tracking-wider mb-2">The Opportunity</h4>
                    <p className="text-white/70 leading-relaxed text-sm">{niche.opportunity}</p>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-yellow-400 uppercase tracking-wider mb-2">Market Gap</h4>
                    <p className="text-white/70 leading-relaxed text-sm">{niche.gap}</p>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-2">Recommended Move</h4>
                    <p className="text-white/70 leading-relaxed text-sm">{niche.move}</p>
                  </div>
                </div>
              </LiquidCard>

              {/* Market Stats */}
              <div className="grid grid-cols-2 md:grid-cols-6 gap-3 md:gap-4">
                {[
                  { label: "Competition", value: niche.stats.competition, color: niche.stats.competition === "Low" ? "text-green-400" : niche.stats.competition === "Medium" ? "text-yellow-400" : "text-orange-400" },
                  { label: "Potential", value: niche.stats.potential, color: "text-[var(--primary)]" },
                  { label: "Est. MRR", value: niche.stats.revenue, color: "text-white" },
                  { label: "Best Market", value: niche.stats.market, color: "text-white" },
                  { label: "Time to MVP", value: niche.stats.timeToMVP, color: "text-white" },
                  { label: "Difficulty", value: niche.stats.difficulty, color: "text-white" },
                ].map((stat, i) => (
                  <LiquidCard key={i} className="p-3 md:p-4">
                    <div className="text-[11px] md:text-[10px] text-white/50 uppercase tracking-wide mb-1.5 md:mb-1">{stat.label}</div>
                    <div className={`text-sm md:text-base font-bold ${stat.color}`}>{stat.value}</div>
                  </LiquidCard>
                ))}
              </div>

              {/* Market Analysis */}
              <LiquidCard className="p-8">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400">📊</span>
                  Market Analysis
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                      <div className="text-xs text-white/40 uppercase mb-1">Total Market Size</div>
                      <div className="text-lg font-bold text-white">{niche.marketAnalysis.totalMarketSize}</div>
                    </div>
                    <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                      <div className="text-xs text-white/40 uppercase mb-1">Growth Rate</div>
                      <div className="text-lg font-bold text-[var(--primary)]">{niche.marketAnalysis.growthRate}</div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                      <div className="text-xs text-white/40 uppercase mb-1">Target Audience</div>
                      <div className="text-sm text-white/80">{niche.marketAnalysis.targetAudience}</div>
                    </div>
                    <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                      <div className="text-xs text-white/40 uppercase mb-1">Geographic Focus</div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {niche.marketAnalysis.geographicFocus?.map((geo, i) => (
                          <span key={i} className="px-2 py-1 rounded bg-white/10 text-xs text-white/70">{geo}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </LiquidCard>

              {/* Key Learnings */}
              {niche.keyLearnings.length > 0 && (
                <LiquidCard className="p-8">
                  <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center text-purple-400">💡</span>
                    Key Learnings
                  </h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    {niche.keyLearnings.map((learning, i) => (
                      <div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-white/5 border border-white/5">
                        <span className="text-[var(--primary)] mt-0.5">✓</span>
                        <span className="text-sm text-white/70">{learning}</span>
                      </div>
                    ))}
                  </div>
                </LiquidCard>
              )}

              {/* Improvements */}
              {niche.improvements.length > 0 && (
                <LiquidCard className="p-8">
                  <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-orange-500/20 flex items-center justify-center text-orange-400">🚀</span>
                    Improvement Opportunities
                  </h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    {niche.improvements.map((improvement, i) => (
                      <div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-white/5 border border-white/5">
                        <span className="text-orange-400 mt-0.5">→</span>
                        <span className="text-sm text-white/70">{improvement}</span>
                      </div>
                    ))}
                  </div>
                </LiquidCard>
              )}

              {/* Risks */}
              {niche.risks.length > 0 && (
                <LiquidCard className="p-8">
                  <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center text-red-400">⚠️</span>
                    Risks to Consider
                  </h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    {niche.risks.map((risk, i) => (
                      <div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-red-500/5 border border-red-500/10">
                        <span className="text-red-400 mt-0.5">!</span>
                        <span className="text-sm text-white/70">{risk}</span>
                      </div>
                    ))}
                  </div>
                </LiquidCard>
              )}
            </div>
          )}

          {activeTab === 'apps' && (
            <div className="space-y-6">
              {selectedApp ? (
                <LiquidCard className="p-8">
                  <button 
                    onClick={() => setSelectedApp(null)}
                    className="text-white/50 hover:text-white mb-6 flex items-center gap-2 text-sm"
                  >
                    ← Back to all apps
                  </button>
                  
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h2 className="text-2xl font-bold text-white mb-1">{selectedApp.name}</h2>
                      <span className="text-sm text-white/40">{selectedApp.category}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-[var(--primary)]">{selectedApp.growth}</div>
                      <div className="text-xs text-white/40">Monthly Growth</div>
                    </div>
                  </div>
                  
                  <p className="text-white/70 mb-8 leading-relaxed">{selectedApp.description}</p>
                  
                  <div className="grid md:grid-cols-3 gap-4 mb-8">
                    <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                      <div className="text-xs text-white/40 uppercase mb-1">Est. MRR</div>
                      <div className="text-xl font-bold text-[var(--primary)]">{selectedApp.estimatedMRR}</div>
                    </div>
                    <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                      <div className="text-xs text-white/40 uppercase mb-1">Strong Market</div>
                      <div className="text-xl font-bold text-white">{selectedApp.strongMarket}</div>
                    </div>
                    <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                      <div className="text-xs text-white/40 uppercase mb-1">Category</div>
                      <div className="text-xl font-bold text-white">{selectedApp.category}</div>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-sm font-bold text-[var(--primary)] uppercase mb-4">Key Strengths</h4>
                      <div className="space-y-2">
                        {selectedApp.keyPoints.map((p, i) => (
                          <div key={i} className="flex items-start gap-2 text-sm text-white/70 p-3 rounded-lg bg-[var(--primary)]/5 border border-[var(--primary)]/10">
                            <span className="text-[var(--primary)]">✓</span> {p}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-orange-400 uppercase mb-4">Weaknesses</h4>
                      <div className="space-y-2">
                        {selectedApp.weakPoints.map((p, i) => (
                          <div key={i} className="flex items-start gap-2 text-sm text-white/70 p-3 rounded-lg bg-orange-500/5 border border-orange-500/10">
                            <span className="text-orange-400">!</span> {p}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </LiquidCard>
              ) : (
                <div className="space-y-4">
                  <h2 className="text-xl font-bold mb-2">Trending Apps in this Niche</h2>
                  <p className="text-white/50 text-sm mb-4">Click on any app for detailed analysis</p>
                  {niche.trending.length === 0 ? (
                    <LiquidCard className="p-8 text-center">
                      <p className="text-white/50">No trending apps data available for this niche yet.</p>
                    </LiquidCard>
                  ) : (
                    niche.trending.map((app, i) => (
                      <LiquidCard 
                        key={i}
                        onClick={() => setSelectedApp(app)}
                        className="p-6 cursor-pointer hover:scale-[1.01] transition-all group"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-6">
                            <span className="text-2xl font-mono text-white/20 group-hover:text-[var(--primary)] transition-colors w-8">0{i + 1}</span>
                            <div>
                              <div className="flex items-center gap-3 mb-1">
                                <h3 className="text-lg font-bold text-white group-hover:text-[var(--primary)] transition-colors">{app.name}</h3>
                                <span className="px-2 py-0.5 rounded bg-white/10 text-xs text-white/50">{app.category}</span>
                              </div>
                              <p className="text-sm text-white/50 line-clamp-1">{app.description}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-6">
                            <div className="text-right">
                              <div className="text-lg font-bold text-[var(--primary)]">{app.growth}</div>
                              <div className="text-xs text-white/40">{app.estimatedMRR} MRR</div>
                            </div>
                            <span className="text-white/30 group-hover:text-white transition-colors">→</span>
                          </div>
                        </div>
                      </LiquidCard>
                    ))
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === 'strategy' && (
            <div className="space-y-6">
              {/* Marketing Strategies */}
              {niche.marketingStrategies.length > 0 && (
                <LiquidCard className="p-8">
                  <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-pink-500/20 flex items-center justify-center text-pink-400">📣</span>
                    Marketing Strategies
                  </h2>
                  <div className="space-y-4">
                    {niche.marketingStrategies.map((strategy, i) => (
                      <div key={i} className="p-5 rounded-xl bg-white/5 border border-white/10">
                        <div className="flex justify-between items-start mb-3">
                          <h4 className="font-bold text-white">{strategy.channel}</h4>
                          <span className="px-3 py-1 rounded-full bg-[var(--primary)]/20 text-[var(--primary)] text-xs font-medium">{strategy.estimatedCost}</span>
                        </div>
                        <p className="text-sm text-white/60">{strategy.strategy}</p>
                      </div>
                    ))}
                  </div>
                </LiquidCard>
              )}

              {/* Monetization */}
              <LiquidCard className="p-8">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center text-green-400">💰</span>
                  Monetization Strategy
                </h2>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="p-5 rounded-xl bg-white/5 border border-white/10">
                    <div className="text-xs text-white/40 uppercase mb-2">Business Model</div>
                    <div className="text-lg font-bold text-white">{niche.monetization.model}</div>
                  </div>
                  <div className="p-5 rounded-xl bg-white/5 border border-white/10">
                    <div className="text-xs text-white/40 uppercase mb-2">Recommended Pricing</div>
                    <div className="text-lg font-bold text-[var(--primary)]">{niche.monetization.pricing}</div>
                  </div>
                  <div className="p-5 rounded-xl bg-white/5 border border-white/10">
                    <div className="text-xs text-white/40 uppercase mb-2">Expected Conversion</div>
                    <div className="text-lg font-bold text-white">{niche.monetization.conversionRate}</div>
                  </div>
                </div>
              </LiquidCard>

              {/* Tech Stack */}
              {niche.techStack.length > 0 && (
                <LiquidCard className="p-8">
                  <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center text-cyan-400">🛠️</span>
                    Recommended Tech Stack
                  </h2>
                  <div className="flex flex-wrap gap-3">
                    {niche.techStack.map((tech, i) => (
                      <span key={i} className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-white/70">{tech}</span>
                    ))}
                  </div>
                </LiquidCard>
              )}

              {/* No Strategy Data */}
              {niche.marketingStrategies.length === 0 && niche.techStack.length === 0 && (
                <LiquidCard className="p-8 text-center">
                  <p className="text-white/50">Strategy data not available for this niche yet.</p>
                </LiquidCard>
              )}
            </div>
          )}

        </div>
      </section>

      {/* Create Project Modal */}
      {showProjectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setShowProjectModal(false)}
          />
          
          <div className="relative w-full max-w-md bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 shadow-2xl">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
              <span className="w-10 h-10 rounded-xl bg-[var(--primary)]/20 flex items-center justify-center">🚀</span>
              Start Project
            </h2>
            
            <div className="mb-4">
              <label className="block text-sm text-white/60 mb-2">Project Name</label>
              <input
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-[var(--primary)]/50 transition-colors"
                autoFocus
              />
            </div>
            
            <div className="p-3 rounded-xl bg-[var(--primary)]/10 border border-[var(--primary)]/20 mb-6">
              <p className="text-xs text-[var(--primary)]">
                🔖 Linked to niche #{nicheId}
              </p>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => setShowProjectModal(false)}
                className="flex-1 px-4 py-3 rounded-xl bg-white/5 text-white/60 font-medium hover:bg-white/10 hover:text-white transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateProject}
                disabled={!projectName.trim() || projectLoading}
                className="flex-1 px-4 py-3 rounded-xl bg-[var(--primary)] text-black font-bold hover:bg-[#00E847] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {projectLoading ? 'Creating...' : 'Create Project'}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
