'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import LiquidCard from '@/components/LiquidCard'

// Types
interface Validation {
  id: string
  query: string
  score: number
  score_label: string
  market_size: string
  competition: string
  created_at: string
}

interface Project {
  id: string
  name: string
  status: 'idea' | 'researching' | 'building' | 'launched'
  notes?: string
  validation_id?: string
  saved_niche_id?: string
  monthly_revenue: number
  updated_at: string
}

interface SavedNiche {
  niche_id: string
  saved_at: string
  title?: string
}

const statusConfig: Record<string, { label: string; color: string; bg: string; icon: string }> = {
  idea: { label: 'Idea', color: 'text-white/60', bg: 'bg-white/10', icon: '💡' },
  researching: { label: 'Researching', color: 'text-blue-400', bg: 'bg-blue-500/20', icon: '🔍' },
  building: { label: 'Building', color: 'text-orange-400', bg: 'bg-orange-500/20', icon: '🛠️' },
  launched: { label: 'Launched', color: 'text-[var(--primary)]', bg: 'bg-[var(--primary)]/20', icon: '🚀' },
}

const statusOrder: Project['status'][] = ['idea', 'researching', 'building', 'launched']

export default function WorkspacePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [hasAccess, setHasAccess] = useState(false)
  
  // Data
  const [validations, setValidations] = useState<Validation[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [savedNiches, setSavedNiches] = useState<SavedNiche[]>([])
  
  // Modal state
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [createLoading, setCreateLoading] = useState(false)
  const [newProject, setNewProject] = useState({
    name: '',
    notes: '',
    validation_id: '',
    saved_niche_id: '',
  })
  
  // Delete modal state - Projects
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)
  
  // Delete modal state - Validations
  const [showDeleteValidationModal, setShowDeleteValidationModal] = useState(false)
  const [validationToDelete, setValidationToDelete] = useState<string | null>(null)
  const [deleteValidationLoading, setDeleteValidationLoading] = useState(false)
  
  // Delete modal state - Saved Niches
  const [showDeleteNicheModal, setShowDeleteNicheModal] = useState(false)
  const [nicheToDelete, setNicheToDelete] = useState<string | null>(null)
  const [deleteNicheLoading, setDeleteNicheLoading] = useState(false)

  // Check access and load data
  useEffect(() => {
    async function init() {
      try {
        // Check subscription
        const subRes = await fetch('/api/stripe/check-subscription', {
          credentials: 'include',
        })
        const subData = await subRes.json()
        
        if (!subData.hasActiveSubscription) {
          router.push('/pricing')
          return
        }
        
        setHasAccess(true)
        
        // Load all data in parallel
        const [valRes, nichesRes, projRes] = await Promise.all([
          fetch('/api/validations', { credentials: 'include' }),
          fetch('/api/user/saved-niches', { credentials: 'include' }),
          fetch('/api/projects', { credentials: 'include' }),
        ])
        
        if (valRes.ok) {
          const valData = await valRes.json()
          setValidations(valData.validations || [])
        }
        
        if (nichesRes.ok) {
          const nichesData = await nichesRes.json()
          setSavedNiches(nichesData.savedNiches || [])
        }
        
        if (projRes.ok) {
          const projData = await projRes.json()
          setProjects(projData.projects || [])
        }
        
      } catch (error) {
        console.error('Error loading workspace:', error)
      } finally {
        setLoading(false)
      }
    }
    
    init()
  }, [router])

  // Calculate total revenue
  const totalRevenue = projects
    .filter(p => p.status === 'launched')
    .reduce((sum, p) => sum + (p.monthly_revenue || 0), 0)

  // Créer un nouveau projet
  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newProject.name.trim()) return
    
    setCreateLoading(true)
    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          name: newProject.name.trim(),
          notes: newProject.notes.trim() || null,
          validation_id: newProject.validation_id || null,
          saved_niche_id: newProject.saved_niche_id || null,
        }),
      })
      
      if (res.ok) {
        const data = await res.json()
        setProjects([data.project, ...projects])
        setShowCreateModal(false)
        setNewProject({ name: '', notes: '', validation_id: '', saved_niche_id: '' })
      }
    } catch (error) {
      console.error('Error creating project:', error)
    } finally {
      setCreateLoading(false)
    }
  }

  // Démarrer un projet depuis une validation
  const handleStartFromValidation = (validation: Validation) => {
    setNewProject({
      name: validation.query.slice(0, 50),
      notes: `Score: ${validation.score}/100 - ${validation.score_label}`,
      validation_id: validation.id,
      saved_niche_id: '',
    })
    setShowCreateModal(true)
  }

  // Démarrer un projet depuis une niche sauvegardée
  const handleStartFromNiche = (niche: SavedNiche) => {
    setNewProject({
      name: niche.title || `Niche #${niche.niche_id}`,
      notes: '',
      validation_id: '',
      saved_niche_id: niche.niche_id,
    })
    setShowCreateModal(true)
  }

  // Mettre à jour le statut d'un projet
  const handleUpdateStatus = async (projectId: string, newStatus: Project['status']) => {
    try {
      const res = await fetch(`/api/projects/${projectId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ status: newStatus }),
      })
      
      if (res.ok) {
        setProjects(projects.map(p => 
          p.id === projectId ? { ...p, status: newStatus } : p
        ))
      }
    } catch (error) {
      console.error('Error updating project:', error)
    }
  }

  // Ouvrir modal de suppression
  const openDeleteModal = (projectId: string) => {
    setProjectToDelete(projectId)
    setShowDeleteModal(true)
  }

  // Supprimer un projet
  const handleDeleteProject = async () => {
    if (!projectToDelete) return
    
    setDeleteLoading(true)
    try {
      const res = await fetch(`/api/projects/${projectToDelete}`, {
        method: 'DELETE',
        credentials: 'include',
      })
      
      if (res.ok) {
        setProjects(projects.filter(p => p.id !== projectToDelete))
      }
    } catch (error) {
      console.error('Error deleting project:', error)
    } finally {
      setDeleteLoading(false)
      setShowDeleteModal(false)
      setProjectToDelete(null)
    }
  }

  // Supprimer une validation
  const handleDeleteValidation = async () => {
    if (!validationToDelete) return
    
    setDeleteValidationLoading(true)
    try {
      const res = await fetch(`/api/validations/${validationToDelete}`, {
        method: 'DELETE',
        credentials: 'include',
      })
      
      if (res.ok) {
        setValidations(validations.filter(v => v.id !== validationToDelete))
      }
    } catch (error) {
      console.error('Error deleting validation:', error)
    } finally {
      setDeleteValidationLoading(false)
      setShowDeleteValidationModal(false)
      setValidationToDelete(null)
    }
  }

  // Supprimer une niche sauvegardée
  const handleDeleteNiche = async () => {
    if (!nicheToDelete) return
    
    setDeleteNicheLoading(true)
    try {
      const res = await fetch('/api/user/saved-niches', {
        method: 'DELETE',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nicheId: nicheToDelete }),
      })
      
      if (res.ok) {
        setSavedNiches(savedNiches.filter(n => n.niche_id !== nicheToDelete))
      }
    } catch (error) {
      console.error('Error deleting saved niche:', error)
    } finally {
      setDeleteNicheLoading(false)
      setShowDeleteNicheModal(false)
      setNicheToDelete(null)
    }
  }

  if (loading) {
    return (
      <main className="workspace-page min-h-screen text-white font-sans pt-20">
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-[var(--primary)]/5 blur-[150px] rounded-full" />
          <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-purple-500/5 blur-[120px] rounded-full" />
        </div>
        <section className="relative pt-8 pb-20 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="h-8 w-32 bg-white/5 rounded-lg animate-pulse mb-8" />
            <div className="h-12 w-48 bg-white/5 rounded-lg animate-pulse mb-8" />
            <div className="grid md:grid-cols-2 gap-6">
              <div className="h-64 bg-white/5 rounded-2xl animate-pulse" />
              <div className="h-64 bg-white/5 rounded-2xl animate-pulse" />
            </div>
          </div>
        </section>
      </main>
    )
  }

  if (!hasAccess) {
    return null
  }

  return (
    <main className="workspace-page min-h-screen text-white font-sans selection:bg-[var(--primary)] selection:text-black pt-20">

      {/* Workspace Header - Hidden on mobile, navbar handles navigation */}
      <header className="hidden md:block sticky top-20 z-40 bg-[var(--bg-deep)]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link 
            href="/account"
            className="text-sm text-white/40 hover:text-white transition-colors flex items-center gap-2"
          >
            ← Account
          </Link>
          <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2 text-white">
            <span className="font-bold text-lg tracking-wider">NICHES HUNTER</span>
          </div>
          <div className="w-20"></div>
        </div>
      </header>

      {/* Ambient Glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-[var(--primary)]/5 blur-[150px] rounded-full" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-purple-500/5 blur-[120px] rounded-full" />
      </div>

      <section className="relative pt-24 md:pt-8 pb-20 px-4 md:px-6">
        <div className="max-w-6xl mx-auto">

          {/* Mobile Back Button */}
          <Link 
            href="/account"
            className="md:hidden flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors mb-6"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 18l-6-6 6-6"/>
            </svg>
            Account
          </Link>

          {/* Page Title */}
          <div className="mb-8 md:mb-10">
            <h1 className="text-3xl md:text-5xl font-bold mb-2 md:mb-3">
              Work<span className="text-flashy-green">space</span>
            </h1>
            <p className="text-white/50 text-sm md:text-lg">Your projects, validations, and saved niches in one place.</p>
          </div>

          {/* Main Grid - Dashboard Style */}
          <div className="grid md:grid-cols-2 gap-6">
            
            {/* Projects Card */}
            <LiquidCard className="p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold flex items-center gap-3">
                  <span className="text-2xl">📁</span>
                  My Projects
                </h2>
                <button 
                  onClick={() => setShowCreateModal(true)}
                  className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-white/60 hover:bg-white/10 hover:text-white transition-all"
                >
                  + New
                </button>
              </div>

              {projects.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-white/40 text-sm mb-4">No projects yet</p>
                  <p className="text-xs text-white/30">Start a project from a validation or niche</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {projects.slice(0, 5).map((project) => (
                    <Link
                      key={project.id}
                      href={`/workspace/project/${project.id}`}
                      className={`workspace-item-card status-${project.status} p-3 group relative cursor-pointer block`}
                    >
                      
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <span className="text-lg">{statusConfig[project.status].icon}</span>
                          <span className="font-medium text-sm text-white group-hover:text-[var(--primary)] transition-colors truncate">
                            {project.name}
                          </span>
                        </div>
                        <button
                          onClick={(e) => { e.preventDefault(); e.stopPropagation(); openDeleteModal(project.id); }}
                          className="p-1 rounded opacity-0 group-hover:opacity-100 hover:bg-red-500/20 text-white/30 hover:text-red-400 transition-all"
                        >
                          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
                          </svg>
                        </button>
                      </div>
                      {/* Status buttons */}
                      <div className="flex gap-1">
                        {statusOrder.map((status) => (
                          <button
                            key={status}
                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleUpdateStatus(project.id, status); }}
                            className={`px-2 py-0.5 rounded text-[10px] font-medium transition-all ${
                              project.status === status 
                                ? `${statusConfig[status].bg} ${statusConfig[status].color}` 
                                : 'bg-transparent text-white/20 hover:bg-white/5 hover:text-white/40'
                            }`}
                          >
                            {statusConfig[status].label}
                          </button>
                        ))}
                      </div>
                    </Link>
                  ))}
                  {projects.length > 5 && (
                    <p className="text-center text-xs text-white/30 pt-2">
                      +{projects.length - 5} more projects
                    </p>
                  )}
                </div>
              )}
            </LiquidCard>

            {/* Revenue Card */}
            <LiquidCard className="p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold flex items-center gap-3">
                  <span className="text-2xl">💰</span>
                  Revenue
                </h2>
              </div>

              {(() => {
                const launchedProjects = projects.filter(p => p.status === 'launched')
                const maxRevenue = Math.max(...launchedProjects.map(p => p.monthly_revenue), 1)
                
                if (launchedProjects.length === 0) {
                  return (
                    <div className="text-center py-8">
                      <p className="text-white/40 text-sm mb-2">No launched apps yet</p>
                      <p className="text-xs text-white/30">Launch your first app to track revenue</p>
                    </div>
                  )
                }
                
                return (
                  <>
                    {/* Total Revenue Header */}
                    <div className="text-center mb-6 p-4 rounded-xl bg-[var(--primary)]/5 border border-[var(--primary)]/20">
                      <p className="text-xs text-white/40 mb-1">Monthly Revenue</p>
                      <p className="text-3xl font-bold text-[var(--primary)]">
                        ${totalRevenue.toLocaleString()}
                        <span className="text-sm font-normal text-white/40">/mo</span>
                      </p>
                    </div>
                    
                    {/* Stats Row */}
                    <div className="grid grid-cols-2 gap-3 mb-6">
                      <div className="p-3 rounded-xl bg-white/5 text-center">
                        <p className="text-2xl font-bold text-white">{launchedProjects.length}</p>
                        <p className="text-[10px] text-white/40">Launched Apps</p>
                      </div>
                      <div className="p-3 rounded-xl bg-white/5 text-center">
                        <p className="text-2xl font-bold text-white">
                          ${launchedProjects.length > 0 ? Math.round(totalRevenue / launchedProjects.length).toLocaleString() : 0}
                        </p>
                        <p className="text-[10px] text-white/40">Avg per App</p>
                      </div>
                    </div>
                    
                    {/* Revenue List - Horizontal Bars */}
                    <div className="space-y-3">
                      <p className="text-xs text-white/40 mb-2">Revenue by App</p>
                      {launchedProjects
                        .sort((a, b) => b.monthly_revenue - a.monthly_revenue)
                        .map((project) => {
                          const percentage = maxRevenue > 0 ? (project.monthly_revenue / maxRevenue) * 100 : 0
                          return (
                            <Link
                              key={project.id}
                              href={`/workspace/project/${project.id}`}
                              className="block workspace-item-card status-launched p-3 group"
                            >
                              <div className="flex items-center justify-between mb-2">
                                <span className="font-medium text-sm group-hover:text-[var(--primary)] transition-colors truncate flex-1 mr-3">
                                  {project.name}
                                </span>
                                <span className="font-mono text-[var(--primary)] text-sm shrink-0">
                                  ${project.monthly_revenue.toLocaleString()}
                                </span>
                              </div>
                              {/* Progress bar */}
                              <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                                <div 
                                  className="h-full rounded-full bg-gradient-to-r from-[var(--primary)]/60 to-[var(--primary)] transition-all duration-500"
                                  style={{ width: `${percentage}%` }}
                                />
                              </div>
                            </Link>
                          )
                        })}
                    </div>
                  </>
                )
              })()}
            </LiquidCard>
          </div>

          {/* Validations Card - Full Width */}
          <LiquidCard className="mt-6 p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold flex items-center gap-3">
                <span className="text-2xl">✅</span>
                Niche Validations
              </h2>
              <Link
                href="/niche-validator"
                className="px-4 py-2 rounded-lg bg-purple-500/10 text-purple-400 text-sm font-medium hover:bg-purple-500/20 transition-all flex items-center gap-2"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 5v14M5 12h14"/>
                </svg>
                New Validation
              </Link>
            </div>

            {validations.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-purple-500/10 flex items-center justify-center">
                  <svg className="w-8 h-8 text-purple-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M9 12l2 2 4-4"/>
                    <circle cx="12" cy="12" r="10"/>
                  </svg>
                </div>
                <h3 className="text-lg font-bold mb-2">No validations yet</h3>
                <p className="text-white/40 mb-6 text-sm">Validate your first niche idea with AI</p>
                <Link
                  href="/niche-validator"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-purple-500 text-white text-sm font-bold rounded-xl hover:bg-purple-600 transition-all"
                >
                  Open Niche Validator
                </Link>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {validations.map((validation) => {
                  const hasProject = projects.some(p => p.validation_id === validation.id)
                  return (
                    <div
                      key={validation.id}
                      className="workspace-item-card validation-card p-4 group cursor-pointer relative"
                    >
                      {/* Lien cliquable sur toute la carte */}
                      <Link href={`/workspace/validation/${validation.id}`} className="absolute inset-0 z-0" />
                      
                      {/* Delete button */}
                      <button
                        onClick={(e) => { e.stopPropagation(); e.preventDefault(); setValidationToDelete(validation.id); setShowDeleteValidationModal(true); }}
                        className="absolute top-3 right-3 z-20 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-red-500/20 text-white/30 hover:text-red-400 transition-all pointer-events-auto"
                      >
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
                        </svg>
                      </button>
                      
                      <div className="relative z-10 pointer-events-none">
                        <div className="flex items-start justify-between gap-3 mb-3 pr-6">
                          <p className="text-sm text-white/80 line-clamp-2 group-hover:text-white transition-colors">{validation.query}</p>
                          <div className={`px-2.5 py-1 rounded-lg text-xs font-bold shrink-0 ${
                            validation.score >= 75 ? 'bg-[var(--primary)]/20 text-[var(--primary)]' :
                            validation.score >= 50 ? 'bg-orange-500/20 text-orange-400' :
                            'bg-red-500/20 text-red-400'
                          }`}>
                            {validation.score}
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-xs text-white/30 mb-3">
                          <span>{validation.market_size} market</span>
                          <span className="font-mono">{new Date(validation.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                      
                      {/* Action button - cliquable par dessus */}
                      <div className="relative z-10">
                        {hasProject ? (
                          <span className="inline-flex items-center gap-1 text-xs text-[var(--primary)]">
                            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M9 12l2 2 4-4"/>
                            </svg>
                            Project started
                          </span>
                        ) : (
                          <button
                            onClick={(e) => { e.stopPropagation(); handleStartFromValidation(validation); }}
                            className="px-3 py-1.5 rounded-lg bg-amber-500/10 text-amber-400 text-xs font-medium hover:bg-amber-500/20 transition-all pointer-events-auto"
                          >
                            Start Project →
                          </button>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </LiquidCard>

          {/* Saved Niches Card - Full Width */}
          <LiquidCard className="mt-6 p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold flex items-center gap-3">
                <span className="w-10 h-10 rounded-xl bg-[var(--primary)]/20 flex items-center justify-center">
                  <svg className="w-5 h-5 text-[var(--primary)]" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
                  </svg>
                </span>
                Saved Niches
              </h2>
              <Link
                href="/niches"
                className="px-4 py-2 rounded-lg bg-[var(--primary)]/10 text-[var(--primary)] text-sm font-medium hover:bg-[var(--primary)]/20 transition-all flex items-center gap-2"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
                Browse Niches
              </Link>
            </div>

            {savedNiches.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-[var(--primary)]/10 flex items-center justify-center">
                  <svg className="w-8 h-8 text-[var(--primary)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
                  </svg>
                </div>
                <h3 className="text-lg font-bold mb-2">No saved niches yet</h3>
                <p className="text-white/40 mb-6 text-sm">Save niches from our curated collection</p>
                <Link
                  href="/niches"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--primary)] text-black text-sm font-bold rounded-xl hover:bg-[#00E847] transition-all"
                >
                  Browse Niches
                </Link>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {savedNiches.map((niche) => {
                  const hasProject = projects.some(p => p.saved_niche_id === niche.niche_id)
                  return (
                    <div
                      key={niche.niche_id}
                      className="workspace-item-card niche-card p-4 group cursor-pointer relative"
                    >
                      {/* Lien cliquable sur toute la carte */}
                      <Link href={`/workspace/niche/${niche.niche_id}`} className="absolute inset-0 z-0" />
                      
                      {/* Delete button */}
                      <button
                        onClick={(e) => { e.stopPropagation(); e.preventDefault(); setNicheToDelete(niche.niche_id); setShowDeleteNicheModal(true); }}
                        className="absolute top-3 right-3 z-20 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-red-500/20 text-white/30 hover:text-red-400 transition-all pointer-events-auto"
                      >
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
                        </svg>
                      </button>
                      
                      <div className="relative z-10 pointer-events-none">
                        <div className="flex items-center justify-between mb-2 pr-6">
                          <span className="font-mono text-[var(--primary)] text-sm">
                            #{niche.niche_id}
                          </span>
                          <span className="text-xs text-white/30 font-mono">
                            {new Date(niche.saved_at).toLocaleDateString()}
                          </span>
                        </div>
                        {niche.title && (
                          <p className="text-white/60 text-sm mb-3 group-hover:text-white transition-colors line-clamp-2">{niche.title}</p>
                        )}
                      </div>
                      
                      {/* Action button - cliquable par dessus */}
                      <div className="relative z-10">
                        {hasProject ? (
                          <span className="inline-flex items-center gap-1 text-xs text-[var(--primary)]">
                            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M9 12l2 2 4-4"/>
                            </svg>
                            Project started
                          </span>
                        ) : (
                          <button
                            onClick={(e) => { e.stopPropagation(); handleStartFromNiche(niche); }}
                            className="px-3 py-1.5 rounded-lg bg-amber-500/10 text-amber-400 text-xs font-medium hover:bg-amber-500/20 transition-all pointer-events-auto"
                          >
                            Start Project →
                          </button>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </LiquidCard>

        </div>
      </section>

      {/* Create Project Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setShowCreateModal(false)}
          />
          
          {/* Modal */}
          <div className="relative w-full max-w-md bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 shadow-2xl">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
              <span className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 5v14M5 12h14"/>
                </svg>
              </span>
              New Project
            </h2>
            
            <form onSubmit={handleCreateProject}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-white/60 mb-2">Project Name *</label>
                  <input
                    type="text"
                    value={newProject.name}
                    onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                    placeholder="My Awesome App"
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-[var(--primary)]/50 transition-colors"
                    autoFocus
                  />
                </div>
                
                <div>
                  <label className="block text-sm text-white/60 mb-2">Notes (optional)</label>
                  <textarea
                    value={newProject.notes}
                    onChange={(e) => setNewProject({ ...newProject, notes: e.target.value })}
                    placeholder="Initial ideas, goals..."
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-[var(--primary)]/50 transition-colors resize-none"
                  />
                </div>
                
                {(newProject.validation_id || newProject.saved_niche_id) && (
                  <div className="p-3 rounded-xl bg-[var(--primary)]/10 border border-[var(--primary)]/20">
                    <p className="text-xs text-[var(--primary)]">
                      {newProject.validation_id 
                        ? '📊 Linked to a validation' 
                        : `🔖 Linked to niche #${newProject.saved_niche_id}`
                      }
                    </p>
                  </div>
                )}
              </div>
              
              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false)
                    setNewProject({ name: '', notes: '', validation_id: '', saved_niche_id: '' })
                  }}
                  className="flex-1 px-4 py-3 rounded-xl bg-white/5 text-white/60 font-medium hover:bg-white/10 hover:text-white transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!newProject.name.trim() || createLoading}
                  className="flex-1 px-4 py-3 rounded-xl bg-[var(--primary)] text-black font-bold hover:bg-[#00E847] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {createLoading ? 'Creating...' : 'Create Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => !deleteLoading && setShowDeleteModal(false)}
          />
          
          {/* Modal */}
          <div className="relative w-full max-w-sm bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 shadow-2xl text-center">
            <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-red-500/20 flex items-center justify-center">
              <svg className="w-7 h-7 text-red-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
              </svg>
            </div>
            
            <h3 className="text-lg font-bold mb-2">Delete Project?</h3>
            <p className="text-sm text-white/50 mb-6">
              This action cannot be undone.
            </p>
            
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false)
                  setProjectToDelete(null)
                }}
                disabled={deleteLoading}
                className="flex-1 px-4 py-3 rounded-xl bg-white/5 text-white/60 font-medium hover:bg-white/10 hover:text-white transition-all disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteProject}
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

      {/* Delete Validation Confirmation Modal */}
      {showDeleteValidationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => !deleteValidationLoading && setShowDeleteValidationModal(false)}
          />
          <div className="relative w-full max-w-sm bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 shadow-2xl text-center">
            <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-red-500/20 flex items-center justify-center">
              <svg className="w-7 h-7 text-red-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
              </svg>
            </div>
            <h3 className="text-lg font-bold mb-2">Delete Validation?</h3>
            <p className="text-sm text-white/50 mb-6">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button
                onClick={() => { setShowDeleteValidationModal(false); setValidationToDelete(null); }}
                disabled={deleteValidationLoading}
                className="flex-1 px-4 py-3 rounded-xl bg-white/5 text-white/60 font-medium hover:bg-white/10 hover:text-white transition-all disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteValidation}
                disabled={deleteValidationLoading}
                className="flex-1 px-4 py-3 rounded-xl bg-red-500 text-white font-bold hover:bg-red-600 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {deleteValidationLoading ? (
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

      {/* Delete Saved Niche Confirmation Modal */}
      {showDeleteNicheModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => !deleteNicheLoading && setShowDeleteNicheModal(false)}
          />
          <div className="relative w-full max-w-sm bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 shadow-2xl text-center">
            <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-red-500/20 flex items-center justify-center">
              <svg className="w-7 h-7 text-red-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
              </svg>
            </div>
            <h3 className="text-lg font-bold mb-2">Remove Saved Niche?</h3>
            <p className="text-sm text-white/50 mb-6">This will unsave the niche from your workspace.</p>
            <div className="flex gap-3">
              <button
                onClick={() => { setShowDeleteNicheModal(false); setNicheToDelete(null); }}
                disabled={deleteNicheLoading}
                className="flex-1 px-4 py-3 rounded-xl bg-white/5 text-white/60 font-medium hover:bg-white/10 hover:text-white transition-all disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteNiche}
                disabled={deleteNicheLoading}
                className="flex-1 px-4 py-3 rounded-xl bg-red-500 text-white font-bold hover:bg-red-600 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {deleteNicheLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Removing...
                  </>
                ) : (
                  'Remove'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
