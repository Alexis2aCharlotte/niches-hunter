'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import LiquidCard from '@/components/LiquidCard'

interface Validation {
  id: string
  query: string
  score: number
  score_label: string
  market_size: string
  competition: string
  difficulty: string
  time_to_mvp: string
  strengths: string[]
  weaknesses: string[]
  recommendations: string[]
  market_insights: string
  created_at: string
}

export default function WorkspaceValidationPage() {
  const params = useParams()
  const router = useRouter()
  const validationId = params.id as string

  const [validation, setValidation] = useState<Validation | null>(null)
  const [loading, setLoading] = useState(true)
  
  // Project creation
  const [showProjectModal, setShowProjectModal] = useState(false)
  const [projectName, setProjectName] = useState('')
  const [projectLoading, setProjectLoading] = useState(false)
  const [hasProject, setHasProject] = useState(false)

  // Delete modal
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)

  // Load validation data
  useEffect(() => {
    async function loadValidation() {
      try {
        const res = await fetch(`/api/validations/${validationId}`, {
          credentials: 'include',
        })
        
        if (!res.ok) {
          router.push('/workspace')
          return
        }
        
        const data = await res.json()
        if (data.validation) {
          setValidation(data.validation)
          setProjectName(data.validation.query.slice(0, 50))
        }
        
        // Check if project exists for this validation
        const projRes = await fetch('/api/projects', { credentials: 'include' })
        if (projRes.ok) {
          const projData = await projRes.json()
          setHasProject(projData.projects?.some((p: any) => p.validation_id === validationId))
        }
      } catch (error) {
        console.error('Error loading validation:', error)
        router.push('/workspace')
      } finally {
        setLoading(false)
      }
    }
    
    loadValidation()
  }, [validationId, router])

  // Create project from validation
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
          validation_id: validationId,
          notes: `Score: ${validation?.score}/100 - ${validation?.score_label}`,
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

  // Delete validation
  const handleDelete = async () => {
    setDeleteLoading(true)
    try {
      const res = await fetch(`/api/validations/${validationId}`, {
        method: 'DELETE',
        credentials: 'include',
      })
      
      if (res.ok) {
        router.push('/workspace')
      }
    } catch (error) {
      console.error('Error deleting validation:', error)
    } finally {
      setDeleteLoading(false)
    }
  }

  // Get score color
  const getScoreColor = (score: number) => {
    if (score >= 75) return 'text-[var(--primary)]'
    if (score >= 50) return 'text-orange-400'
    return 'text-red-400'
  }

  const getScoreBg = (score: number) => {
    if (score >= 75) return 'bg-[var(--primary)]/20'
    if (score >= 50) return 'bg-orange-500/20'
    return 'bg-red-500/20'
  }

  if (loading) {
    return (
      <main className="workspace-page min-h-screen text-white font-sans">
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-[var(--primary)]/5 blur-[150px] rounded-full" />
        </div>
        <section className="relative pt-12 pb-20 px-6">
          <div className="max-w-4xl mx-auto">
            <div className="h-8 w-32 bg-white/5 rounded-lg animate-pulse mb-8" />
            <div className="h-64 bg-white/5 rounded-2xl animate-pulse" />
          </div>
        </section>
      </main>
    )
  }

  if (!validation) {
    return null
  }

  return (
    <main className="workspace-page min-h-screen text-white font-sans selection:bg-[var(--primary)] selection:text-black">
      {/* Workspace Header */}
      <header className="sticky top-0 z-40 bg-[var(--bg-deep)]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between relative">
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

      {/* Ambient Glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-purple-500/5 blur-[150px] rounded-full" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-[var(--primary)]/5 blur-[120px] rounded-full" />
      </div>

      <section className="relative pt-8 pb-20 px-6">
        <div className="max-w-4xl mx-auto">

          {/* Header Card */}
          <LiquidCard className="p-8 mb-6">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex items-center gap-3">
                <span className="text-3xl">✅</span>
                <span className="text-xs text-white/30 font-mono">
                  {new Date(validation.created_at).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className={`px-4 py-2 rounded-full text-lg font-bold ${getScoreBg(validation.score)} ${getScoreColor(validation.score)}`}>
                  {validation.score}/100
                </div>
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="p-2 rounded-lg hover:bg-red-500/20 text-white/30 hover:text-red-400 transition-all"
                  title="Delete validation"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
                  </svg>
                </button>
              </div>
            </div>
            
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-4">{validation.query}</h1>
            
            <div className="flex flex-wrap justify-between items-center gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className={`px-3 py-1.5 rounded-full text-sm font-medium ${getScoreBg(validation.score)} ${getScoreColor(validation.score)}`}>
                  {validation.score_label}
                </span>
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

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <LiquidCard className="p-4">
              <div className="text-xs text-white/40 uppercase mb-1">Market Size</div>
              <div className="text-lg font-bold text-white">{validation.market_size}</div>
            </LiquidCard>
            <LiquidCard className="p-4">
              <div className="text-xs text-white/40 uppercase mb-1">Competition</div>
              <div className={`text-lg font-bold ${
                validation.competition === 'Low' ? 'text-[var(--primary)]' :
                validation.competition === 'Medium' ? 'text-yellow-400' :
                'text-orange-400'
              }`}>{validation.competition}</div>
            </LiquidCard>
            <LiquidCard className="p-4">
              <div className="text-xs text-white/40 uppercase mb-1">Difficulty</div>
              <div className="text-lg font-bold text-white">{validation.difficulty}</div>
            </LiquidCard>
            <LiquidCard className="p-4">
              <div className="text-xs text-white/40 uppercase mb-1">Time to MVP</div>
              <div className="text-lg font-bold text-white">{validation.time_to_mvp}</div>
            </LiquidCard>
          </div>

          {/* Market Insights */}
          {validation.market_insights && (
            <LiquidCard className="p-8 mb-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-3">
                <span className="text-2xl">📊</span>
                Market Insights
              </h2>
              <p className="text-white/70 leading-relaxed">{validation.market_insights}</p>
            </LiquidCard>
          )}

          {/* Strengths & Weaknesses */}
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            {/* Strengths */}
            {validation.strengths && validation.strengths.length > 0 && (
              <LiquidCard className="p-8">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-3">
                  <span className="text-2xl">💪</span>
                  Strengths
                </h2>
                <div className="space-y-3">
                  {validation.strengths.map((strength, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-[var(--primary)]/5 border border-[var(--primary)]/10">
                      <span className="text-[var(--primary)] mt-0.5">✓</span>
                      <span className="text-sm text-white/70">{strength}</span>
                    </div>
                  ))}
                </div>
              </LiquidCard>
            )}

            {/* Weaknesses */}
            {validation.weaknesses && validation.weaknesses.length > 0 && (
              <LiquidCard className="p-8">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-3">
                  <span className="text-2xl">⚠️</span>
                  Weaknesses
                </h2>
                <div className="space-y-3">
                  {validation.weaknesses.map((weakness, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-orange-500/5 border border-orange-500/10">
                      <span className="text-orange-400 mt-0.5">!</span>
                      <span className="text-sm text-white/70">{weakness}</span>
                    </div>
                  ))}
                </div>
              </LiquidCard>
            )}
          </div>

          {/* Recommendations */}
          {validation.recommendations && validation.recommendations.length > 0 && (
            <LiquidCard className="p-8">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-3">
                <span className="text-2xl">💡</span>
                Recommendations
              </h2>
              <div className="space-y-3">
                {validation.recommendations.map((rec, i) => (
                  <div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-purple-500/5 border border-purple-500/10">
                    <span className="text-purple-400 font-bold">{i + 1}.</span>
                    <span className="text-white/70">{rec}</span>
                  </div>
                ))}
              </div>
            </LiquidCard>
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
              <span className="text-2xl">🚀</span>
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
            
            <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 mb-6">
              <p className="text-xs text-purple-400">
                ✅ Linked to this validation
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

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => !deleteLoading && setShowDeleteModal(false)}
          />
          
          <div className="relative w-full max-w-sm bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 shadow-2xl text-center">
            <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-red-500/20 flex items-center justify-center">
              <svg className="w-7 h-7 text-red-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
              </svg>
            </div>
            
            <h3 className="text-lg font-bold mb-2">Delete Validation?</h3>
            <p className="text-sm text-white/50 mb-6">
              This action cannot be undone.
            </p>
            
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                disabled={deleteLoading}
                className="flex-1 px-4 py-3 rounded-xl bg-white/5 text-white/60 font-medium hover:bg-white/10 hover:text-white transition-all disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleteLoading}
                className="flex-1 px-4 py-3 rounded-xl bg-red-500 text-white font-bold hover:bg-red-600 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {deleteLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Deleting...
                  </>
                ) : (
                  'Delete'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
