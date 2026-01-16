'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import LiquidCard from '@/components/LiquidCard'

// ============================================
// TYPES
// ============================================

interface Project {
  id: string
  name: string
  status: 'idea' | 'researching' | 'building' | 'launched'
  notes: string | null
  validation_id: string | null
  saved_niche_id: string | null
  app_store_url: string | null
  monthly_revenue: number
  created_at: string
  updated_at: string
  // New fields
  swot_strengths: string[] | null
  swot_weaknesses: string[] | null
  swot_opportunities: string[] | null
  swot_threats: string[] | null
  revenue_goal: number | null
  revenue_goal_deadline: string | null
  market_notes: string | null
  target_audience: string | null
  unique_selling_point: string | null
  app_name: string | null
  app_tagline: string | null
  keywords: string[] | null
}

interface Task {
  id: string
  content: string
  is_completed: boolean
  completed_at: string | null
  category: string | null
  position: number
  created_at: string
}

interface Milestone {
  id: string
  title: string
  description: string | null
  target_date: string | null
  is_completed: boolean
  completed_at: string | null
  created_at: string
}

interface Competitor {
  id: string
  name: string
  app_store_url: string | null
  website_url: string | null
  estimated_revenue: number | null
  strengths: string[] | null
  weaknesses: string[] | null
  notes: string | null
  created_at: string
}

interface Note {
  id: string
  title: string | null
  content: string
  category: string | null
  is_pinned: boolean
  created_at: string
  updated_at: string
}

// Source data types (from niche or validation)
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

interface NicheSource {
  id: string
  title: string
  category: string
  opportunity: string
  gap: string
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
  risks: string[]
  trending: TrendingApp[]
  monetization: {
    model: string
    pricing: string
    conversionRate: string
  }
}

interface ValidationSource {
  id: string
  niche_idea: string
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
}

type SourceData = {
  type: 'niche' | 'validation'
  niche?: NicheSource
  validation?: ValidationSource
} | null

interface Resource {
  id: string
  title: string
  url: string | null
  type: string | null
  description: string | null
  created_at: string
}

// ============================================
// CONFIG
// ============================================

const statusConfig: Record<string, { label: string; color: string; bg: string; icon: string; description: string }> = {
  idea: { 
    label: 'Idea', 
    color: 'text-white/60', 
    bg: 'bg-white/10', 
    icon: '💡',
    description: 'Initial concept, brainstorming'
  },
  researching: { 
    label: 'Researching', 
    color: 'text-blue-400', 
    bg: 'bg-blue-500/20', 
    icon: '🔍',
    description: 'Market research, competitor analysis'
  },
  building: { 
    label: 'Building', 
    color: 'text-orange-400', 
    bg: 'bg-orange-500/20', 
    icon: '🛠️',
    description: 'Development in progress'
  },
  launched: { 
    label: 'Launched', 
    color: 'text-[var(--primary)]', 
    bg: 'bg-[var(--primary)]/20', 
    icon: '🚀',
    description: 'Live on the App Store'
  },
}

const statusOrder: Project['status'][] = ['idea', 'researching', 'building', 'launched']

type TabId = 'overview' | 'tasks' | 'milestones' | 'competitors' | 'notes' | 'resources' | 'swot' | 'revenue' | 'costs' | 'market'

const tabs: { id: TabId; label: string; icon: string }[] = [
  { id: 'overview', label: 'Overview', icon: '📋' },
  { id: 'tasks', label: 'Tasks', icon: '✅' },
  { id: 'milestones', label: 'Milestones', icon: '🎯' },
  { id: 'competitors', label: 'Competitors', icon: '🏆' },
  { id: 'notes', label: 'Notes', icon: '📝' },
  { id: 'resources', label: 'Resources', icon: '🔗' },
  { id: 'swot', label: 'Analysis', icon: '📊' },
  { id: 'revenue', label: 'Revenue', icon: '💰' },
  { id: 'costs', label: 'Costs', icon: '💸' },
  { id: 'market', label: 'My App', icon: '🎯' },
]

// ============================================
// MAIN COMPONENT
// ============================================

export default function ProjectDetailPage() {
  const router = useRouter()
  const params = useParams()
  const projectId = params.id as string

  // Core states
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [project, setProject] = useState<Project | null>(null)
  const [activeTab, setActiveTab] = useState<TabId>('overview')
  
  // Editable fields (Overview)
  const [name, setName] = useState('')
  const [quickNotes, setQuickNotes] = useState('')
  const [appStoreUrl, setAppStoreUrl] = useState('')
  const [monthlyRevenue, setMonthlyRevenue] = useState('')
  
  // Tasks
  const [tasks, setTasks] = useState<Task[]>([])
  const [loadingTasks, setLoadingTasks] = useState(false)
  const [newTaskContent, setNewTaskContent] = useState('')
  
  // Milestones
  const [milestones, setMilestones] = useState<Milestone[]>([])
  const [loadingMilestones, setLoadingMilestones] = useState(false)
  
  // Competitors
  const [competitors, setCompetitors] = useState<Competitor[]>([])
  const [loadingCompetitors, setLoadingCompetitors] = useState(false)
  
  // Notes
  const [notes, setNotes] = useState<Note[]>([])
  const [loadingNotes, setLoadingNotes] = useState(false)
  
  // Resources
  const [resources, setResources] = useState<Resource[]>([])
  const [loadingResources, setLoadingResources] = useState(false)
  
  // Source data (niche or validation)
  const [sourceData, setSourceData] = useState<SourceData>(null)
  const [loadingSource, setLoadingSource] = useState(false)
  
  // Delete confirmation modal
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleting, setDeleting] = useState(false)

  // ============================================
  // DATA LOADING
  // ============================================

  // Load project
  useEffect(() => {
    async function loadProject() {
      try {
        const res = await fetch(`/api/projects/${projectId}`, {
          credentials: 'include',
        })
        
        if (!res.ok) {
          router.push('/workspace')
          return
        }
        
        const data = await res.json()
        setProject(data.project)
        setName(data.project.name)
        setQuickNotes(data.project.notes || '')
        setAppStoreUrl(data.project.app_store_url || '')
        setMonthlyRevenue(data.project.monthly_revenue?.toString() || '0')
      } catch (error) {
        console.error('Error loading project:', error)
        router.push('/workspace')
      } finally {
        setLoading(false)
      }
    }
    
    loadProject()
  }, [projectId, router])

  // Load tasks when tab changes to tasks
  const loadTasks = useCallback(async () => {
    if (!projectId) return
    setLoadingTasks(true)
    try {
      const res = await fetch(`/api/projects/${projectId}/tasks`, {
        credentials: 'include',
      })
      if (res.ok) {
        const data = await res.json()
        setTasks(data.tasks || [])
      }
    } catch (error) {
      console.error('Error loading tasks:', error)
    } finally {
      setLoadingTasks(false)
    }
  }, [projectId])

  useEffect(() => {
    if (activeTab === 'tasks' && tasks.length === 0) {
      loadTasks()
    }
  }, [activeTab, tasks.length, loadTasks])

  // Load milestones when tab changes to milestones
  const loadMilestones = useCallback(async () => {
    if (!projectId) return
    setLoadingMilestones(true)
    try {
      const res = await fetch(`/api/projects/${projectId}/milestones`, {
        credentials: 'include',
      })
      if (res.ok) {
        const data = await res.json()
        setMilestones(data.milestones || [])
      }
    } catch (error) {
      console.error('Error loading milestones:', error)
    } finally {
      setLoadingMilestones(false)
    }
  }, [projectId])

  useEffect(() => {
    if (activeTab === 'milestones' && milestones.length === 0) {
      loadMilestones()
    }
  }, [activeTab, milestones.length, loadMilestones])

  // Load competitors when tab changes to competitors
  const loadCompetitors = useCallback(async () => {
    if (!projectId) return
    setLoadingCompetitors(true)
    try {
      const res = await fetch(`/api/projects/${projectId}/competitors`, {
        credentials: 'include',
      })
      if (res.ok) {
        const data = await res.json()
        setCompetitors(data.competitors || [])
      }
    } catch (error) {
      console.error('Error loading competitors:', error)
    } finally {
      setLoadingCompetitors(false)
    }
  }, [projectId])

  useEffect(() => {
    if (activeTab === 'competitors' && competitors.length === 0) {
      loadCompetitors()
    }
  }, [activeTab, competitors.length, loadCompetitors])

  // Load notes when tab changes to notes
  const loadNotes = useCallback(async () => {
    if (!projectId) return
    setLoadingNotes(true)
    try {
      const res = await fetch(`/api/projects/${projectId}/notes`, {
        credentials: 'include',
      })
      if (res.ok) {
        const data = await res.json()
        setNotes(data.notes || [])
      }
    } catch (error) {
      console.error('Error loading notes:', error)
    } finally {
      setLoadingNotes(false)
    }
  }, [projectId])

  useEffect(() => {
    if (activeTab === 'notes' && notes.length === 0) {
      loadNotes()
    }
  }, [activeTab, notes.length, loadNotes])

  // Load resources when tab changes to resources
  const loadResources = useCallback(async () => {
    if (!projectId) return
    setLoadingResources(true)
    try {
      const res = await fetch(`/api/projects/${projectId}/resources`, {
        credentials: 'include',
      })
      if (res.ok) {
        const data = await res.json()
        setResources(data.resources || [])
      }
    } catch (error) {
      console.error('Error loading resources:', error)
    } finally {
      setLoadingResources(false)
    }
  }, [projectId])

  useEffect(() => {
    if (activeTab === 'resources' && resources.length === 0) {
      loadResources()
    }
  }, [activeTab, resources.length, loadResources])

  // Load source data (niche or validation) when project is loaded
  const loadSourceData = useCallback(async () => {
    if (!project) return
    if (!project.saved_niche_id && !project.validation_id) return
    if (sourceData) return // Already loaded
    
    setLoadingSource(true)
    try {
      if (project.saved_niche_id) {
        // Load niche data directly from the niche API
        // saved_niche_id is the display_code (e.g., "0030")
        const res = await fetch(`/api/niches/${project.saved_niche_id}`, {
          credentials: 'include',
        })
        if (res.ok) {
          const data = await res.json()
          if (data.niche) {
            // Map the API response to our NicheSource interface
            setSourceData({
              type: 'niche',
              niche: {
                id: data.niche.id,
                title: data.niche.title,
                category: data.niche.category,
                opportunity: data.niche.opportunity || '',
                gap: data.niche.gap || '',
                stats: data.niche.stats || {},
                marketAnalysis: data.niche.market_analysis || {},
                keyLearnings: data.niche.key_learnings || [],
                improvements: data.niche.improvements || [],
                risks: data.niche.risks || [],
                trending: data.niche.trending || [],
                monetization: data.niche.monetization || {},
              } as NicheSource
            })
          }
        }
      } else if (project.validation_id) {
        // Load validation data
        const res = await fetch(`/api/validations/${project.validation_id}`, {
          credentials: 'include',
        })
        if (res.ok) {
          const data = await res.json()
          if (data.validation) {
            setSourceData({
              type: 'validation',
              validation: data.validation as ValidationSource
            })
          }
        }
      }
    } catch (error) {
      console.error('Error loading source data:', error)
    } finally {
      setLoadingSource(false)
    }
  }, [project, sourceData])

  useEffect(() => {
    if (project && (project.saved_niche_id || project.validation_id) && !sourceData) {
      loadSourceData()
    }
  }, [project, sourceData, loadSourceData])

  // ============================================
  // HANDLERS
  // ============================================

  // Update status
  const handleUpdateStatus = async (newStatus: Project['status']) => {
    if (!project) return
    
    try {
      const res = await fetch(`/api/projects/${projectId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ status: newStatus }),
      })
      
      if (res.ok) {
        setProject({ ...project, status: newStatus })
      }
    } catch (error) {
      console.error('Error updating status:', error)
    }
  }

  // Save changes (Overview)
  const handleSave = async () => {
    if (!project) return
    
    setSaving(true)
    try {
      const res = await fetch(`/api/projects/${projectId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          name: name.trim(),
          notes: quickNotes.trim() || null,
          app_store_url: appStoreUrl.trim() || null,
          monthly_revenue: parseFloat(monthlyRevenue) || 0,
        }),
      })
      
      if (res.ok) {
        const data = await res.json()
        setProject(data.project)
      }
    } catch (error) {
      console.error('Error saving project:', error)
    } finally {
      setSaving(false)
    }
  }

  // Delete project
  const handleDelete = async () => {
    setDeleting(true)
    try {
      const res = await fetch(`/api/projects/${projectId}`, {
        method: 'DELETE',
        credentials: 'include',
      })
      
      if (res.ok) {
        router.push('/workspace')
      }
    } catch (error) {
      console.error('Error deleting project:', error)
    } finally {
      setDeleting(false)
      setShowDeleteModal(false)
    }
  }

  // ============================================
  // TASK HANDLERS
  // ============================================

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTaskContent.trim()) return

    try {
      const res = await fetch(`/api/projects/${projectId}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ content: newTaskContent.trim() }),
      })

      if (res.ok) {
        const data = await res.json()
        setTasks([...tasks, data.task])
        setNewTaskContent('')
      }
    } catch (error) {
      console.error('Error adding task:', error)
    }
  }

  // Add task directly without form
  const handleAddTaskDirect = async (content: string): Promise<boolean> => {
    if (!content.trim()) return false

    try {
      const res = await fetch(`/api/projects/${projectId}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ content: content.trim() }),
      })

      if (res.ok) {
        const data = await res.json()
        setTasks(prev => [...prev, data.task])
        return true
      }
      return false
    } catch (error) {
      console.error('Error adding task:', error)
      return false
    }
  }

  const handleToggleTask = async (taskId: string, isCompleted: boolean) => {
    try {
      const res = await fetch(`/api/projects/${projectId}/tasks`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ taskId, is_completed: !isCompleted }),
      })

      if (res.ok) {
        setTasks(tasks.map(t => 
          t.id === taskId ? { ...t, is_completed: !isCompleted } : t
        ))
      }
    } catch (error) {
      console.error('Error toggling task:', error)
    }
  }

  const handleDeleteTask = async (taskId: string) => {
    try {
      const res = await fetch(`/api/projects/${projectId}/tasks?taskId=${taskId}`, {
        method: 'DELETE',
        credentials: 'include',
      })

      if (res.ok) {
        setTasks(tasks.filter(t => t.id !== taskId))
      }
    } catch (error) {
      console.error('Error deleting task:', error)
    }
  }

  // ============================================
  // MILESTONE HANDLERS
  // ============================================

  const handleAddMilestone = async (title: string, targetDate: string | null) => {
    if (!title.trim()) return

    try {
      const res = await fetch(`/api/projects/${projectId}/milestones`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ title: title.trim(), target_date: targetDate }),
      })

      if (res.ok) {
        const data = await res.json()
        // Use functional update to ensure we have the latest state
        setMilestones(prev => [...prev, { ...data.milestone, is_completed: false }])
      }
    } catch (error) {
      console.error('Error adding milestone:', error)
    }
  }

  const handleToggleMilestone = async (milestoneId: string, isCompleted: boolean) => {
    try {
      const res = await fetch(`/api/projects/${projectId}/milestones`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ milestoneId, is_completed: !isCompleted }),
      })

      if (res.ok) {
        setMilestones(milestones.map(m => 
          m.id === milestoneId ? { ...m, is_completed: !isCompleted } : m
        ))
      }
    } catch (error) {
      console.error('Error toggling milestone:', error)
    }
  }

  const handleDeleteMilestone = async (milestoneId: string) => {
    try {
      const res = await fetch(`/api/projects/${projectId}/milestones?milestoneId=${milestoneId}`, {
        method: 'DELETE',
        credentials: 'include',
      })

      if (res.ok) {
        setMilestones(milestones.filter(m => m.id !== milestoneId))
      }
    } catch (error) {
      console.error('Error deleting milestone:', error)
    }
  }

  // ============================================
  // COMPETITOR HANDLERS
  // ============================================

  const handleAddCompetitor = async (data: { 
    name: string
    app_store_url?: string
    website_url?: string
    estimated_revenue?: number
    strengths?: string
    weaknesses?: string
    notes?: string
  }) => {
    if (!data.name.trim()) return

    try {
      const res = await fetch(`/api/projects/${projectId}/competitors`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data),
      })

      if (res.ok) {
        const result = await res.json()
        // Use functional update to ensure we have the latest state
        setCompetitors(prev => [...prev, result.competitor])
      }
    } catch (error) {
      console.error('Error adding competitor:', error)
    }
  }

  const handleDeleteCompetitor = async (competitorId: string) => {
    try {
      const res = await fetch(`/api/projects/${projectId}/competitors?competitorId=${competitorId}`, {
        method: 'DELETE',
        credentials: 'include',
      })

      if (res.ok) {
        setCompetitors(competitors.filter(c => c.id !== competitorId))
      }
    } catch (error) {
      console.error('Error deleting competitor:', error)
    }
  }

  // ============================================
  // NOTE HANDLERS
  // ============================================

  const handleAddNote = async (data: { title?: string; content: string; category?: string }) => {
    if (!data.content.trim()) return

    try {
      const res = await fetch(`/api/projects/${projectId}/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data),
      })

      if (res.ok) {
        const result = await res.json()
        setNotes([result.note, ...notes])
      }
    } catch (error) {
      console.error('Error adding note:', error)
    }
  }

  const handleTogglePinNote = async (noteId: string, isPinned: boolean) => {
    try {
      const res = await fetch(`/api/projects/${projectId}/notes`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ noteId, is_pinned: !isPinned }),
      })

      if (res.ok) {
        setNotes(notes.map(n => 
          n.id === noteId ? { ...n, is_pinned: !isPinned } : n
        ))
      }
    } catch (error) {
      console.error('Error toggling note pin:', error)
    }
  }

  const handleDeleteNote = async (noteId: string) => {
    try {
      const res = await fetch(`/api/projects/${projectId}/notes?noteId=${noteId}`, {
        method: 'DELETE',
        credentials: 'include',
      })

      if (res.ok) {
        setNotes(notes.filter(n => n.id !== noteId))
      }
    } catch (error) {
      console.error('Error deleting note:', error)
    }
  }

  // ============================================
  // RESOURCE HANDLERS
  // ============================================

  const handleAddResource = async (data: { title: string; url?: string; type?: string; description?: string }) => {
    if (!data.title.trim()) return

    try {
      const res = await fetch(`/api/projects/${projectId}/resources`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data),
      })

      if (res.ok) {
        const result = await res.json()
        setResources([...resources, result.resource])
      }
    } catch (error) {
      console.error('Error adding resource:', error)
    }
  }

  const handleDeleteResource = async (resourceId: string) => {
    try {
      const res = await fetch(`/api/projects/${projectId}/resources?resourceId=${resourceId}`, {
        method: 'DELETE',
        credentials: 'include',
      })

      if (res.ok) {
        setResources(resources.filter(r => r.id !== resourceId))
      }
    } catch (error) {
      console.error('Error deleting resource:', error)
    }
  }

  // Check if there are unsaved changes
  const hasChanges = project && (
    name !== project.name ||
    quickNotes !== (project.notes || '') ||
    appStoreUrl !== (project.app_store_url || '') ||
    monthlyRevenue !== (project.monthly_revenue?.toString() || '0')
  )

  // ============================================
  // RENDER: LOADING STATE
  // ============================================

  if (loading) {
    return (
      <main className="workspace-page min-h-screen text-white font-sans">
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-[var(--primary)]/5 blur-[150px] rounded-full" />
        </div>
        <section className="relative pt-12 pb-20 px-6">
          <div className="max-w-5xl mx-auto">
            <div className="h-8 w-32 bg-white/5 rounded-lg animate-pulse mb-8" />
            <div className="h-12 bg-white/5 rounded-xl animate-pulse mb-6" />
            <div className="h-64 bg-white/5 rounded-2xl animate-pulse" />
          </div>
        </section>
      </main>
    )
  }

  if (!project) {
    return null
  }

  // ============================================
  // RENDER: TAB CONTENT
  // ============================================

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab 
          project={project}
          name={name}
          setName={setName}
          quickNotes={quickNotes}
          setQuickNotes={setQuickNotes}
          appStoreUrl={appStoreUrl}
          setAppStoreUrl={setAppStoreUrl}
          monthlyRevenue={monthlyRevenue}
          setMonthlyRevenue={setMonthlyRevenue}
          statusConfig={statusConfig}
          statusOrder={statusOrder}
          onUpdateStatus={handleUpdateStatus}
        />

      case 'tasks':
        return <TasksTab 
          tasks={tasks}
          loading={loadingTasks}
          newTaskContent={newTaskContent}
          setNewTaskContent={setNewTaskContent}
          onAddTask={handleAddTask}
          onAddTaskDirect={handleAddTaskDirect}
          onToggleTask={handleToggleTask}
          onDeleteTask={handleDeleteTask}
          sourceData={sourceData}
        />

      case 'milestones':
        return <MilestonesTab 
          milestones={milestones}
          loading={loadingMilestones}
          onAddMilestone={handleAddMilestone}
          onToggleMilestone={handleToggleMilestone}
          onDeleteMilestone={handleDeleteMilestone}
          sourceData={sourceData}
        />

      case 'competitors':
        return <CompetitorsTab 
          competitors={competitors}
          loading={loadingCompetitors}
          onAddCompetitor={handleAddCompetitor}
          onDeleteCompetitor={handleDeleteCompetitor}
          sourceData={sourceData}
          loadingSource={loadingSource}
        />

      case 'notes':
        return <NotesTab 
          notes={notes}
          loading={loadingNotes}
          onAddNote={handleAddNote}
          onTogglePin={handleTogglePinNote}
          onDeleteNote={handleDeleteNote}
        />

      case 'resources':
        return <ResourcesTab 
          resources={resources}
          loading={loadingResources}
          onAddResource={handleAddResource}
          onDeleteResource={handleDeleteResource}
        />

      case 'swot':
        return <SwotTab 
          project={project}
          projectId={projectId}
          onUpdate={(updates) => setProject({ ...project, ...updates })}
          sourceData={sourceData}
        />

      case 'revenue':
        return <RevenueTab 
          project={project}
          projectId={projectId}
          onUpdate={(updates) => setProject({ ...project, ...updates })}
        />

      case 'costs':
        return <CostsTab 
          projectId={projectId}
        />

      case 'market':
        return <MarketTab 
          project={project}
          projectId={projectId}
          onUpdate={(updates) => setProject({ ...project, ...updates })}
          sourceData={sourceData}
        />

      default:
        return (
          <LiquidCard className="p-8 text-center">
            <span className="text-4xl mb-4 block">{tabs.find(t => t.id === activeTab)?.icon}</span>
            <h3 className="text-lg font-bold mb-2">{tabs.find(t => t.id === activeTab)?.label}</h3>
            <p className="text-white/40">Cette section arrive bientôt...</p>
          </LiquidCard>
        )
    }
  }

  // ============================================
  // RENDER: MAIN
  // ============================================

  return (
    <main className="workspace-page min-h-screen text-white font-sans selection:bg-[var(--primary)] selection:text-black">
      {/* Ambient Glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-[var(--primary)]/5 blur-[150px] rounded-full" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-purple-500/5 blur-[120px] rounded-full" />
      </div>

      {/* Workspace Header */}
      <header className="sticky top-0 z-40 bg-[var(--bg-deep)]/80 backdrop-blur-xl border-b border-white/5">
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
          
          {/* Project Header */}
          <div className="mb-6">
            <div className="flex items-start gap-4">
              <span className="text-4xl shrink-0">{statusConfig[project.status].icon}</span>
              <div className="flex-1 min-w-0">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="text-2xl md:text-3xl font-bold bg-transparent border-none focus:outline-none focus:ring-0 w-full truncate"
                  placeholder="Project name"
                />
                <div className="flex items-center gap-3 mt-1">
                  <span className={`text-xs px-2 py-1 rounded-lg ${statusConfig[project.status].bg} ${statusConfig[project.status].color}`}>
                    {statusConfig[project.status].label}
                  </span>
                  <span className="text-sm text-white/40">
                    Created {new Date(project.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
              
              <button
                onClick={() => setShowDeleteModal(true)}
                className="p-2 rounded-lg hover:bg-red-500/20 text-white/30 hover:text-red-400 transition-all shrink-0"
                title="Delete project"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
                </svg>
              </button>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="mb-6">
            <div className="flex gap-2 p-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center px-3 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all border ${
                    activeTab === tab.id
                      ? 'bg-[var(--primary)]/10 border-[var(--primary)] text-[var(--primary)]'
                      : 'bg-white/5 border-white/10 text-white/50 hover:text-white hover:border-white/20'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          {renderTabContent()}

          {/* Save Button (only for Overview) */}
          {activeTab === 'overview' && hasChanges && (
            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-8 py-3 rounded-xl bg-[var(--primary)] text-black font-bold shadow-lg shadow-[var(--primary)]/30 hover:bg-[#00E847] transition-all disabled:opacity-50 flex items-center gap-2"
              >
                {saving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/>
                      <polyline points="17 21 17 13 7 13 7 21"/>
                      <polyline points="7 3 7 8 15 8"/>
                    </svg>
                    Save Changes
                  </>
                )}
              </button>
            </div>
          )}

        </div>
      </section>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => !deleting && setShowDeleteModal(false)}
          />
          
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
                onClick={() => setShowDeleteModal(false)}
                disabled={deleting}
                className="flex-1 px-4 py-3 rounded-xl bg-white/5 text-white/60 font-medium hover:bg-white/10 hover:text-white transition-all disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 px-4 py-3 rounded-xl bg-red-500 text-white font-bold hover:bg-red-600 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {deleting ? (
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

// ============================================
// OVERVIEW TAB COMPONENT
// ============================================

function OverviewTab({ 
  project, 
  name, 
  setName,
  quickNotes, 
  setQuickNotes,
  appStoreUrl,
  setAppStoreUrl,
  monthlyRevenue,
  setMonthlyRevenue,
  statusConfig,
  statusOrder,
  onUpdateStatus,
}: {
  project: Project
  name: string
  setName: (v: string) => void
  quickNotes: string
  setQuickNotes: (v: string) => void
  appStoreUrl: string
  setAppStoreUrl: (v: string) => void
  monthlyRevenue: string
  setMonthlyRevenue: (v: string) => void
  statusConfig: Record<string, { label: string; color: string; bg: string; icon: string; description: string }>
  statusOrder: Project['status'][]
  onUpdateStatus: (status: Project['status']) => void
}) {
  return (
    <div className="space-y-6">
      {/* Status */}
      <LiquidCard className="p-6">
        <h3 className="text-sm font-bold text-white/60 uppercase tracking-wider mb-4">Status</h3>
        <div className="flex flex-wrap gap-2">
          {statusOrder.map((status) => (
            <button
              key={status}
              onClick={() => onUpdateStatus(status)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                project.status === status 
                  ? `${statusConfig[status].bg} ${statusConfig[status].color} ring-2 ring-white/10` 
                  : 'bg-white/5 text-white/40 hover:bg-white/10 hover:text-white'
              }`}
            >
              <span>{statusConfig[status].icon}</span>
              <span>{statusConfig[status].label}</span>
            </button>
          ))}
        </div>
        <p className="text-xs text-white/30 mt-3">
          {statusConfig[project.status].description}
        </p>
      </LiquidCard>

      {/* Source Links */}
      {(project.validation_id || project.saved_niche_id) && (
        <LiquidCard className="p-6">
          <h3 className="text-sm font-bold text-white/60 uppercase tracking-wider mb-4">Source</h3>
          {project.validation_id && (
            <Link 
              href={`/workspace/validation/${project.validation_id}`}
              className="flex items-center gap-3 p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 hover:bg-purple-500/15 transition-colors"
            >
              <span className="text-xl">📊</span>
              <div>
                <p className="text-sm text-purple-400 font-medium">From Niche Validation</p>
                <p className="text-xs text-white/40">Click to view validation analysis</p>
              </div>
            </Link>
          )}
          {project.saved_niche_id && (
            <Link 
              href={`/workspace/niche/${project.saved_niche_id}`}
              className="flex items-center gap-3 p-3 rounded-xl bg-[var(--primary)]/10 border border-[var(--primary)]/20 hover:bg-[var(--primary)]/15 transition-colors"
            >
              <span className="text-xl">🔖</span>
              <div>
                <p className="text-sm text-[var(--primary)] font-medium">From Saved Niche</p>
                <p className="text-xs text-white/40">Click to view niche details</p>
              </div>
            </Link>
          )}
        </LiquidCard>
      )}

      {/* Notes */}
      <LiquidCard className="p-6">
        <h3 className="text-sm font-bold text-white/60 uppercase tracking-wider mb-4">Quick Notes</h3>
        <textarea
          value={quickNotes}
          onChange={(e) => setQuickNotes(e.target.value)}
          placeholder="Add notes, ideas, progress updates..."
          rows={4}
          className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-[var(--primary)]/50 transition-colors resize-none"
        />
      </LiquidCard>

      {/* Revenue (only for launched projects) */}
      {project.status === 'launched' && (
        <LiquidCard className="p-6">
          <h3 className="text-sm font-bold text-white/60 uppercase tracking-wider mb-4">Revenue Tracking</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-white/40 mb-2">App Store URL</label>
              <input
                type="url"
                value={appStoreUrl}
                onChange={(e) => setAppStoreUrl(e.target.value)}
                placeholder="https://apps.apple.com/..."
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-[var(--primary)]/50 transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs text-white/40 mb-2">Monthly Revenue (USD)</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30">$</span>
                <input
                  type="number"
                  value={monthlyRevenue}
                  onChange={(e) => setMonthlyRevenue(e.target.value)}
                  placeholder="0"
                  min="0"
                  step="0.01"
                  className="w-full pl-8 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-[var(--primary)]/50 transition-colors"
                />
              </div>
            </div>
          </div>
        </LiquidCard>
      )}
    </div>
  )
}

// ============================================
// TASKS TAB COMPONENT
// ============================================

// Suggested tasks for app launch
const SUGGESTED_TASKS = [
  { category: 'Research', tasks: [
    'Define target audience and user personas',
    'Analyze top 5 competitors in detail',
    'Identify unique value proposition',
    'Research monetization strategies',
  ]},
  { category: 'Design', tasks: [
    'Create app wireframes',
    'Design UI mockups',
    'Prepare App Store screenshots',
    'Design app icon',
  ]},
  { category: 'Development', tasks: [
    'Set up development environment',
    'Implement core features',
    'Add analytics tracking',
    'Implement in-app purchases/subscriptions',
  ]},
  { category: 'Launch', tasks: [
    'Write App Store description',
    'Prepare keywords for ASO',
    'Set up App Store Connect',
    'Submit for App Review',
  ]},
  { category: 'Marketing', tasks: [
    'Create landing page',
    'Set up social media accounts',
    'Prepare press kit',
    'Plan launch day promotion',
  ]},
]

function TasksTab({
  tasks,
  loading,
  newTaskContent,
  setNewTaskContent,
  onAddTask,
  onAddTaskDirect,
  onToggleTask,
  onDeleteTask,
  sourceData,
}: {
  tasks: Task[]
  loading: boolean
  newTaskContent: string
  setNewTaskContent: (v: string) => void
  onAddTask: (e: React.FormEvent) => void
  onAddTaskDirect: (content: string) => Promise<boolean>
  onToggleTask: (taskId: string, isCompleted: boolean) => void
  onDeleteTask: (taskId: string) => void
  sourceData: SourceData
}) {
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [importingCategory, setImportingCategory] = useState<string | null>(null)
  const [recentlyImported, setRecentlyImported] = useState<Set<string>>(new Set())

  const completedTasks = tasks.filter(t => t.is_completed)
  const pendingTasks = tasks.filter(t => !t.is_completed)
  const progress = tasks.length > 0 ? Math.round((completedTasks.length / tasks.length) * 100) : 0

  // Check if a task already exists
  const taskExists = (taskContent: string) => {
    return tasks.some(t => t.content.toLowerCase() === taskContent.toLowerCase())
  }

  // Import tasks from a category with cascade animation
  const handleImportCategory = async (category: { category: string; tasks: string[] }) => {
    setImportingCategory(category.category)
    
    for (const taskContent of category.tasks) {
      if (!taskExists(taskContent)) {
        // Add to recently imported for animation
        setRecentlyImported(prev => new Set(prev).add(taskContent))
        
        // Wait a bit for animation
        await new Promise(resolve => setTimeout(resolve, 150))
        
        // Add directly to DB
        await onAddTaskDirect(taskContent)
        
        await new Promise(resolve => setTimeout(resolve, 100))
      }
    }
    
    setImportingCategory(null)
    
    // Clear recently imported after animation
    setTimeout(() => {
      setRecentlyImported(new Set())
    }, 1000)
  }
  
  // Import single task with animation
  const handleImportSingleTask = async (taskContent: string) => {
    if (taskExists(taskContent)) return
    
    setRecentlyImported(prev => new Set(prev).add(taskContent))
    
    // Add directly to DB
    await onAddTaskDirect(taskContent)
    
    // Clear animation after a delay
    setTimeout(() => {
      setRecentlyImported(prev => {
        const newSet = new Set(prev)
        newSet.delete(taskContent)
        return newSet
      })
    }, 500)
  }

  if (loading) {
    return (
      <LiquidCard className="p-6">
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-12 bg-white/5 rounded-xl animate-pulse" />
          ))}
        </div>
      </LiquidCard>
    )
  }

  return (
    <div className="space-y-6">
      {/* Progress Bar */}
      <LiquidCard className="p-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-white/60 uppercase tracking-wider">Progress</h3>
          <span className="text-sm font-mono text-[var(--primary)]">{progress}%</span>
        </div>
        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
          <div 
            className="h-full bg-[var(--primary)] rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-xs text-white/40 mt-2">
          {completedTasks.length} of {tasks.length} tasks completed
        </p>
      </LiquidCard>

      {/* Suggested Tasks - Collapsible */}
      {sourceData && (
        <LiquidCard className="p-6 border border-[var(--primary)]/20 bg-[var(--primary)]/5">
          {/* Header - Clickable to expand/collapse */}
          <div 
            className="flex items-center justify-between cursor-pointer select-none"
            onClick={() => setShowSuggestions(!showSuggestions)}
          >
            <h3 className="text-sm font-bold text-[var(--primary)] uppercase tracking-wider flex items-center gap-2">
              <span>💡</span>
              Launch Checklist Templates
              <svg 
                className={`w-4 h-4 transition-transform duration-200 ${showSuggestions ? 'rotate-180' : ''}`}
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2"
              >
                <path d="M6 9l6 6 6-6"/>
              </svg>
            </h3>
          </div>
          
          {/* Collapsible content */}
          <div className={`overflow-hidden transition-all duration-300 ease-in-out ${showSuggestions ? 'max-h-[2000px] opacity-100 mt-4' : 'max-h-0 opacity-0 mt-0'}`}>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {SUGGESTED_TASKS.map((category) => (
                <div 
                  key={category.category}
                  className="p-5 rounded-xl bg-black/30 border border-white/10 hover:border-[var(--primary)]/40 hover:bg-black/40 hover:shadow-lg hover:shadow-[var(--primary)]/10 hover:-translate-y-1 transition-all duration-200 cursor-default"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-bold text-white text-base">{category.category}</h4>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleImportCategory(category) }}
                      disabled={importingCategory !== null}
                      className={`text-sm px-3 py-1.5 rounded-lg font-medium transition-all duration-300 ${
                        importingCategory === category.category 
                          ? 'bg-[var(--primary)] text-black scale-95' 
                          : 'bg-[var(--primary)]/20 text-[var(--primary)] hover:bg-[var(--primary)] hover:text-black'
                      } disabled:opacity-50`}
                    >
                      {importingCategory === category.category ? (
                        <span className="flex items-center gap-2">
                          <svg className="w-3 h-3 animate-spin" viewBox="0 0 24 24" fill="none">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                          </svg>
                          Importing...
                        </span>
                      ) : 'Import All'}
                    </button>
                  </div>
                  <ul className="space-y-2">
                    {category.tasks.map((task, i) => {
                      const exists = taskExists(task)
                      const isAnimating = recentlyImported.has(task)
                      return (
                        <li 
                          key={i} 
                          onClick={(e) => {
                            e.stopPropagation()
                            if (!exists) {
                              handleImportSingleTask(task)
                            }
                          }}
                          className={`text-sm flex items-start gap-2 rounded-lg px-2 py-1.5 -mx-2 transition-all duration-300 ${
                            exists 
                              ? 'cursor-default' 
                              : 'text-white/70 hover:text-[var(--primary)] hover:bg-[var(--primary)]/10 cursor-pointer'
                          } ${isAnimating ? 'scale-[1.02] bg-[var(--primary)]/20' : ''}`}
                        >
                          <span className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all duration-300 ${
                            exists 
                              ? 'bg-[var(--primary)] border-[var(--primary)]' 
                              : 'border-white/30'
                          } ${isAnimating ? 'scale-110' : ''}`}>
                            {exists && (
                              <svg className="w-2.5 h-2.5 text-black" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4">
                                <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                            )}
                          </span>
                          <span className={`transition-all duration-300 ${exists ? 'line-through text-[var(--primary)]/70' : ''}`}>{task}</span>
                        </li>
                      )
                    })}
                  </ul>
                </div>
              ))}
            </div>
            <p className="text-xs text-white/40 mt-4 text-center">
              Click on any task to add it, or use &quot;Import All&quot; to add all tasks from a category
            </p>
          </div>
        </LiquidCard>
      )}

      {/* Add Task */}
      <LiquidCard className="p-6">
        <h3 className="text-sm font-bold text-white/60 uppercase tracking-wider mb-4">Add Task</h3>
        <form onSubmit={onAddTask} className="flex gap-3">
          <input
            type="text"
            value={newTaskContent}
            onChange={(e) => setNewTaskContent(e.target.value)}
            placeholder="What needs to be done?"
            className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-[var(--primary)]/50 transition-colors"
          />
          <button
            type="submit"
            disabled={!newTaskContent.trim()}
            className="px-6 py-3 rounded-xl bg-[var(--primary)] text-black font-bold hover:bg-[#00E847] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Add
          </button>
        </form>
      </LiquidCard>

      {/* Pending Tasks */}
      {pendingTasks.length > 0 && (
        <LiquidCard className="p-6">
          <h3 className="text-sm font-bold text-white/60 uppercase tracking-wider mb-4">
            To Do ({pendingTasks.length})
          </h3>
          <div className="space-y-2">
            {pendingTasks.map((task) => (
              <div 
                key={task.id}
                className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10 group hover:border-white/20 transition-all"
              >
                <button
                  onClick={() => onToggleTask(task.id, task.is_completed)}
                  className="w-5 h-5 rounded-md border-2 border-white/30 hover:border-[var(--primary)] transition-colors flex items-center justify-center shrink-0"
                >
                  {/* Empty checkbox */}
                </button>
                <span className="flex-1 text-white/90">{task.content}</span>
                <button
                  onClick={() => onDeleteTask(task.id)}
                  className="p-1.5 rounded-lg text-white/20 hover:text-red-400 hover:bg-red-500/10 opacity-0 group-hover:opacity-100 transition-all"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 6L6 18M6 6l12 12"/>
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </LiquidCard>
      )}

      {/* Completed Tasks */}
      {completedTasks.length > 0 && (
        <LiquidCard className="p-6">
          <h3 className="text-sm font-bold text-white/60 uppercase tracking-wider mb-4">
            Completed ({completedTasks.length})
          </h3>
          <div className="space-y-2">
            {completedTasks.map((task) => (
              <div 
                key={task.id}
                className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5 group"
              >
                <button
                  onClick={() => onToggleTask(task.id, task.is_completed)}
                  className="w-5 h-5 rounded-md bg-[var(--primary)] flex items-center justify-center shrink-0"
                >
                  <svg className="w-3 h-3 text-black" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <path d="M20 6L9 17l-5-5"/>
                  </svg>
                </button>
                <span className="flex-1 text-white/40 line-through">{task.content}</span>
                <button
                  onClick={() => onDeleteTask(task.id)}
                  className="p-1.5 rounded-lg text-white/20 hover:text-red-400 hover:bg-red-500/10 opacity-0 group-hover:opacity-100 transition-all"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 6L6 18M6 6l12 12"/>
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </LiquidCard>
      )}

      {/* Empty State */}
      {tasks.length === 0 && (
        <div className="text-center py-12">
          <span className="text-4xl mb-4 block">✅</span>
          <h3 className="text-lg font-bold mb-2">No tasks yet</h3>
          <p className="text-white/40">Add your first task to start tracking progress</p>
        </div>
      )}
    </div>
  )
}

// ============================================
// MILESTONES TAB COMPONENT
// ============================================

function MilestonesTab({
  milestones,
  loading,
  onAddMilestone,
  onToggleMilestone,
  onDeleteMilestone,
  sourceData,
}: {
  milestones: Milestone[]
  loading: boolean
  onAddMilestone: (title: string, targetDate: string | null) => void
  onToggleMilestone: (milestoneId: string, isCompleted: boolean) => void
  onDeleteMilestone: (milestoneId: string) => void
  sourceData: SourceData
}) {
  const [newTitle, setNewTitle] = useState('')
  const [newTargetDate, setNewTargetDate] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [importedMilestones, setImportedMilestones] = useState<Set<string>>(new Set())

  const completedMilestones = milestones.filter(m => m.is_completed)
  const pendingMilestones = milestones.filter(m => !m.is_completed)
  const progress = milestones.length > 0 ? Math.round((completedMilestones.length / milestones.length) * 100) : 0

  // Get timeToMVP from source data
  const timeToMVP = sourceData?.type === 'niche' 
    ? sourceData.niche?.stats?.timeToMVP 
    : sourceData?.type === 'validation' 
    ? sourceData.validation?.time_to_mvp 
    : null

  // Generate suggested milestones based on timeToMVP
  const suggestedMilestones = [
    { title: 'Complete Market Research', weeks: 1 },
    { title: 'Finalize App Concept & Features', weeks: 2 },
    { title: 'Design UI/UX Mockups', weeks: 3 },
    { title: 'MVP Development Complete', weeks: timeToMVP ? parseInt(timeToMVP) || 8 : 8 },
    { title: 'Internal Beta Testing', weeks: (timeToMVP ? parseInt(timeToMVP) || 8 : 8) + 2 },
    { title: 'App Store Submission', weeks: (timeToMVP ? parseInt(timeToMVP) || 8 : 8) + 3 },
    { title: 'Public Launch', weeks: (timeToMVP ? parseInt(timeToMVP) || 8 : 8) + 4 },
    { title: 'First 100 Users', weeks: (timeToMVP ? parseInt(timeToMVP) || 8 : 8) + 6 },
  ]

  // Calculate target date from weeks
  const getTargetDate = (weeks: number) => {
    const date = new Date()
    date.setDate(date.getDate() + weeks * 7)
    return date.toISOString().split('T')[0]
  }

  const [isImporting, setIsImporting] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)

  const handleImportMilestone = async (milestone: { title: string; weeks: number }) => {
    await onAddMilestone(milestone.title, getTargetDate(milestone.weeks))
    setImportedMilestones(prev => new Set([...prev, milestone.title]))
  }

  const handleImportAll = async () => {
    setIsImporting(true)
    const toImport = suggestedMilestones.filter(m => !importedMilestones.has(m.title))
    
    for (const milestone of toImport) {
      await handleImportMilestone(milestone)
      // Small delay for smooth transition
      await new Promise(resolve => setTimeout(resolve, 100))
    }
    setIsImporting(false)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTitle.trim()) return
    onAddMilestone(newTitle.trim(), newTargetDate || null)
    setNewTitle('')
    setNewTargetDate('')
    setShowForm(false)
  }

  // Helper to format date
  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return null
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  // Check if milestone is overdue
  const isOverdue = (dateStr: string | null) => {
    if (!dateStr) return false
    return new Date(dateStr) < new Date() 
  }

  if (loading) {
    return (
      <LiquidCard className="p-6">
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-16 bg-white/5 rounded-xl animate-pulse" />
          ))}
        </div>
      </LiquidCard>
    )
  }

  return (
    <div className="space-y-6">
      {/* Progress */}
      <LiquidCard className="p-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-white/60 uppercase tracking-wider">Milestone Progress</h3>
          <span className="text-sm font-mono text-[var(--primary)]">{progress}%</span>
        </div>
        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
          <div 
            className="h-full bg-[var(--primary)] rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-xs text-white/40 mt-2">
          {completedMilestones.length} of {milestones.length} milestones reached
        </p>
      </LiquidCard>

      {/* Suggested Milestones - Collapsible */}
      {sourceData && (
        <LiquidCard className="p-6 border border-[var(--primary)]/20 bg-[var(--primary)]/5">
          {/* Header - Clickable to expand/collapse */}
          <div 
            className="flex items-center justify-between cursor-pointer select-none"
            onClick={() => setShowSuggestions(!showSuggestions)}
          >
            <h3 className="text-sm font-bold text-[var(--primary)] uppercase tracking-wider flex items-center gap-2">
              <span>💡</span>
              Suggested Timeline {timeToMVP && `(~${timeToMVP} weeks to MVP)`}
              <svg 
                className={`w-4 h-4 transition-transform duration-200 ${showSuggestions ? 'rotate-180' : ''}`} 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2"
              >
                <path d="M6 9l6 6 6-6"/>
              </svg>
            </h3>
            {showSuggestions && suggestedMilestones.some(m => !importedMilestones.has(m.title) && !milestones.some(mi => mi.title === m.title)) && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleImportAll()
                }}
                disabled={isImporting}
                className="text-xs px-3 py-1.5 rounded-lg bg-[var(--primary)] text-black font-medium hover:bg-[#00E847] transition-colors disabled:opacity-50"
              >
                {isImporting ? 'Importing...' : 'Import All'}
              </button>
            )}
          </div>
          
          {/* Collapsible content */}
          <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
            showSuggestions ? 'max-h-[1000px] opacity-100 mt-4' : 'max-h-0 opacity-0 mt-0'
          }`}>
            <div className="space-y-2">
              {suggestedMilestones.map((milestone, index) => {
                const isImported = importedMilestones.has(milestone.title) || milestones.some(m => m.title === milestone.title)
                return (
                  <div 
                    key={index}
                    className={`flex items-center gap-3 p-3 rounded-xl border transition-all duration-300 ${
                      isImported 
                        ? 'bg-white/5 border-white/10 opacity-50' 
                        : 'bg-black/20 border-[var(--primary)]/20 hover:border-[var(--primary)]/40 hover:bg-black/30 cursor-pointer'
                    }`}
                    onClick={() => !isImported && handleImportMilestone(milestone)}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-all ${
                      isImported ? 'bg-white/10 text-white/40' : 'bg-[var(--primary)]/20 text-[var(--primary)]'
                    }`}>
                      {isImported ? '✓' : index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium transition-colors ${isImported ? 'text-white/40 line-through' : 'text-white'}`}>
                        {milestone.title}
                      </p>
                      <p className="text-xs text-white/40">Week {milestone.weeks}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </LiquidCard>
      )}

      {/* Add Milestone Button / Form */}
      <LiquidCard className="p-6">
        {!showForm ? (
          <button
            onClick={() => setShowForm(true)}
            className="w-full py-3 rounded-xl border-2 border-dashed border-white/10 text-white/40 hover:text-white hover:border-[var(--primary)]/50 transition-all flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 5v14M5 12h14"/>
            </svg>
            Add Milestone
          </button>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs text-white/40 mb-2">Milestone Title *</label>
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g., MVP Launch, Beta Testing..."
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-[var(--primary)]/50 transition-colors"
                autoFocus
              />
            </div>
            <div>
              <label className="block text-xs text-white/40 mb-2">Target Date (optional)</label>
              <input
                type="date"
                value={newTargetDate}
                onChange={(e) => setNewTargetDate(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[var(--primary)]/50 transition-colors"
              />
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="flex-1 px-4 py-3 rounded-xl bg-white/5 text-white/60 font-medium hover:bg-white/10 hover:text-white transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!newTitle.trim()}
                className="flex-1 px-4 py-3 rounded-xl bg-[var(--primary)] text-black font-bold hover:bg-[#00E847] transition-all disabled:opacity-50"
              >
                Add Milestone
              </button>
            </div>
          </form>
        )}
      </LiquidCard>

      {/* Pending Milestones */}
      {pendingMilestones.length > 0 && (
        <LiquidCard className="p-6">
          <h3 className="text-sm font-bold text-white/60 uppercase tracking-wider mb-4">
            Upcoming ({pendingMilestones.length})
          </h3>
          <div className="space-y-3">
            {pendingMilestones.map((milestone) => (
              <div 
                key={milestone.id}
                className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/10 group hover:border-white/20 transition-all"
              >
                <button
                  onClick={() => onToggleMilestone(milestone.id, milestone.is_completed)}
                  className="w-6 h-6 rounded-full border-2 border-white/30 hover:border-[var(--primary)] transition-colors flex items-center justify-center shrink-0 mt-0.5"
                >
                  {/* Empty circle */}
                </button>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-white">{milestone.title}</h4>
                  {milestone.target_date && (
                    <p className={`text-xs mt-1 ${isOverdue(milestone.target_date) ? 'text-red-400' : 'text-white/40'}`}>
                      {isOverdue(milestone.target_date) ? '⚠️ Overdue: ' : '📅 '}
                      {formatDate(milestone.target_date)}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => onDeleteMilestone(milestone.id)}
                  className="p-1.5 rounded-lg text-white/20 hover:text-red-400 hover:bg-red-500/10 opacity-0 group-hover:opacity-100 transition-all shrink-0"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 6L6 18M6 6l12 12"/>
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </LiquidCard>
      )}

      {/* Completed Milestones */}
      {completedMilestones.length > 0 && (
        <LiquidCard className="p-6">
          <h3 className="text-sm font-bold text-white/60 uppercase tracking-wider mb-4">
            Completed ({completedMilestones.length})
          </h3>
          <div className="space-y-3">
            {completedMilestones.map((milestone) => (
              <div 
                key={milestone.id}
                className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/5 group"
              >
                <button
                  onClick={() => onToggleMilestone(milestone.id, milestone.is_completed)}
                  className="w-6 h-6 rounded-full bg-[var(--primary)] flex items-center justify-center shrink-0 mt-0.5"
                >
                  <svg className="w-3 h-3 text-black" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <path d="M20 6L9 17l-5-5"/>
                  </svg>
                </button>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-white/40 line-through">{milestone.title}</h4>
                  {milestone.target_date && (
                    <p className="text-xs text-white/30 mt-1">
                      {formatDate(milestone.target_date)}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => onDeleteMilestone(milestone.id)}
                  className="p-1.5 rounded-lg text-white/20 hover:text-red-400 hover:bg-red-500/10 opacity-0 group-hover:opacity-100 transition-all shrink-0"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 6L6 18M6 6l12 12"/>
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </LiquidCard>
      )}

      {/* Empty State */}
      {milestones.length === 0 && !showForm && (
        <div className="text-center py-12">
          <span className="text-4xl mb-4 block">🎯</span>
          <h3 className="text-lg font-bold mb-2">No milestones yet</h3>
          <p className="text-white/40">Set milestones to track your project&apos;s progress</p>
        </div>
      )}
    </div>
  )
}

// ============================================
// COMPETITORS TAB COMPONENT
// ============================================

function CompetitorsTab({
  competitors,
  loading,
  onAddCompetitor,
  onDeleteCompetitor,
  sourceData,
  loadingSource,
}: {
  competitors: Competitor[]
  loading: boolean
  onAddCompetitor: (data: { 
    name: string
    app_store_url?: string
    website_url?: string
    estimated_revenue?: number
    strengths?: string
    weaknesses?: string
    notes?: string
  }) => void
  onDeleteCompetitor: (competitorId: string) => void
  sourceData: SourceData
  loadingSource: boolean
}) {
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    app_store_url: '',
    website_url: '',
    estimated_revenue: '',
    strengths: '',
    weaknesses: '',
    notes: '',
  })
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [importedApps, setImportedApps] = useState<Set<string>>(new Set())

  // Get suggested competitors from source data
  const suggestedCompetitors = sourceData?.type === 'niche' && sourceData.niche?.trending 
    ? sourceData.niche.trending 
    : []

  // Parse estimated MRR string to number (e.g., "$50K" -> 50000)
  const parseRevenue = (mrr: string): number | undefined => {
    if (!mrr) return undefined
    const cleaned = mrr.replace(/[$,]/g, '')
    if (cleaned.includes('K')) return parseFloat(cleaned) * 1000
    if (cleaned.includes('M')) return parseFloat(cleaned) * 1000000
    return parseFloat(cleaned) || undefined
  }

  const [isImporting, setIsImporting] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)

  // Import a suggested competitor
  const handleImportCompetitor = async (app: TrendingApp) => {
    await onAddCompetitor({
      name: app.name,
      estimated_revenue: parseRevenue(app.estimatedMRR),
      strengths: app.keyPoints?.join('\n') || undefined,
      weaknesses: app.weakPoints?.join('\n') || undefined,
      notes: `${app.description || ''}\n\nCategory: ${app.category || ''}\nGrowth: ${app.growth || ''}\nStrong Market: ${app.strongMarket || ''}`.trim(),
    })
    setImportedApps(prev => new Set([...prev, app.name]))
  }

  // Import all suggested competitors
  const handleImportAll = async () => {
    setIsImporting(true)
    const toImport = suggestedCompetitors.filter(app => !importedApps.has(app.name))
    
    for (const app of toImport) {
      await handleImportCompetitor(app)
      await new Promise(resolve => setTimeout(resolve, 100))
    }
    setIsImporting(false)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name.trim()) return

    onAddCompetitor({
      name: formData.name.trim(),
      app_store_url: formData.app_store_url.trim() || undefined,
      website_url: formData.website_url.trim() || undefined,
      estimated_revenue: formData.estimated_revenue ? parseFloat(formData.estimated_revenue) : undefined,
      strengths: formData.strengths.trim() || undefined,
      weaknesses: formData.weaknesses.trim() || undefined,
      notes: formData.notes.trim() || undefined,
    })

    setFormData({
      name: '',
      app_store_url: '',
      website_url: '',
      estimated_revenue: '',
      strengths: '',
      weaknesses: '',
      notes: '',
    })
    setShowForm(false)
  }

  const formatRevenue = (revenue: number | null | undefined) => {
    const num = Number(revenue) || 0
    if (num === 0) return null
    if (num >= 1000000) return `$${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `$${(num / 1000).toFixed(0)}K`
    return `$${num.toFixed(0)}`
  }

  // Calculate total revenue safely (handles string values from DB)
  const totalRevenue = competitors.reduce((sum, c) => sum + (Number(c.estimated_revenue) || 0), 0)
  const avgRevenue = competitors.length > 0 ? totalRevenue / competitors.length : 0

  if (loading) {
    return (
      <LiquidCard className="p-6">
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-20 bg-white/5 rounded-xl animate-pulse" />
          ))}
        </div>
      </LiquidCard>
    )
  }

  return (
    <div className="space-y-6">
      {/* Summary */}
      {competitors.length > 0 && (
        <LiquidCard className="p-6">
          <h3 className="text-sm font-bold text-white/60 uppercase tracking-wider mb-4">Competition Overview</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-white/5">
              <p className="text-2xl font-bold text-white">{competitors.length}</p>
              <p className="text-xs text-white/40">Competitors tracked</p>
            </div>
            <div className="p-4 rounded-xl bg-white/5">
              <p className="text-2xl font-bold text-[var(--primary)]">
                {formatRevenue(totalRevenue) || '$0'}
              </p>
              <p className="text-xs text-white/40">Total market size (est.)</p>
            </div>
            <div className="p-4 rounded-xl bg-white/5 col-span-2 md:col-span-1">
              <p className="text-2xl font-bold text-orange-400">
                {formatRevenue(avgRevenue) || '$0'}
              </p>
              <p className="text-xs text-white/40">Avg revenue/competitor</p>
            </div>
          </div>
        </LiquidCard>
      )}

      {/* Suggested Competitors from Niche - Collapsible */}
      {suggestedCompetitors.length > 0 && (
        <LiquidCard className="p-6 border border-[var(--primary)]/20 bg-[var(--primary)]/5">
          {/* Header - Clickable to expand/collapse */}
          <div 
            className="flex items-center justify-between cursor-pointer select-none"
            onClick={() => setShowSuggestions(!showSuggestions)}
          >
            <h3 className="text-sm font-bold text-[var(--primary)] uppercase tracking-wider flex items-center gap-2">
              <span>💡</span>
              Suggested from Niche ({suggestedCompetitors.length})
              <svg 
                className={`w-4 h-4 transition-transform duration-200 ${showSuggestions ? 'rotate-180' : ''}`} 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2"
              >
                <path d="M6 9l6 6 6-6"/>
              </svg>
            </h3>
            {showSuggestions && suggestedCompetitors.some(app => !importedApps.has(app.name)) && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleImportAll()
                }}
                disabled={isImporting}
                className="text-xs px-3 py-1.5 rounded-lg bg-[var(--primary)] text-black font-medium hover:bg-[#00E847] transition-colors disabled:opacity-50"
              >
                {isImporting ? 'Importing...' : 'Import All'}
              </button>
            )}
          </div>

          {/* Collapsible content */}
          <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
            showSuggestions ? 'max-h-[1000px] opacity-100 mt-4' : 'max-h-0 opacity-0 mt-0'
          }`}>
            <div className="grid md:grid-cols-2 gap-3">
              {suggestedCompetitors.map((app, index) => {
                const isImported = importedApps.has(app.name)
                return (
                  <div 
                    key={index}
                    onClick={() => !isImported && handleImportCompetitor(app)}
                    className={`p-3 rounded-xl border transition-all duration-200 ${
                      isImported 
                        ? 'bg-white/5 border-white/10 opacity-50' 
                        : 'bg-black/20 border-[var(--primary)]/20 hover:border-[var(--primary)]/40 hover:bg-black/30 cursor-pointer'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <h4 className={`font-medium text-sm transition-colors ${isImported ? 'text-white/40 line-through' : 'text-white'}`}>
                          {app.name}
                        </h4>
                        <p className="text-xs text-white/40 mt-0.5">{app.category}</p>
                        {app.estimatedMRR && (
                          <p className="text-xs text-[var(--primary)] mt-1">{app.estimatedMRR}/mo est.</p>
                        )}
                      </div>
                      {isImported && (
                        <span className="text-xs text-[var(--primary)]">✓</span>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
            <p className="text-xs text-white/30 mt-3">
              Click on a competitor to add it, or use &quot;Import All&quot;
            </p>
          </div>
        </LiquidCard>
      )}

      {loadingSource && !suggestedCompetitors.length && (
        <LiquidCard className="p-6 border border-[var(--primary)]/20">
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 border-2 border-[var(--primary)] border-t-transparent rounded-full animate-spin" />
            <span className="text-sm text-white/60">Loading suggestions from niche...</span>
          </div>
        </LiquidCard>
      )}

      {/* Add Competitor Button / Form */}
      <LiquidCard className="p-6">
        {!showForm ? (
          <button
            onClick={() => setShowForm(true)}
            className="w-full py-3 rounded-xl border-2 border-dashed border-white/10 text-white/40 hover:text-white hover:border-[var(--primary)]/50 transition-all flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 5v14M5 12h14"/>
            </svg>
            Add Competitor
          </button>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs text-white/40 mb-2">Competitor Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Calm, Headspace..."
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-[var(--primary)]/50 transition-colors"
                autoFocus
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-white/40 mb-2">App Store URL</label>
                <input
                  type="url"
                  value={formData.app_store_url}
                  onChange={(e) => setFormData({ ...formData, app_store_url: e.target.value })}
                  placeholder="https://apps.apple.com/..."
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-[var(--primary)]/50 transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs text-white/40 mb-2">Website URL</label>
                <input
                  type="url"
                  value={formData.website_url}
                  onChange={(e) => setFormData({ ...formData, website_url: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-[var(--primary)]/50 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs text-white/40 mb-2">Estimated Monthly Revenue (USD)</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30">$</span>
                <input
                  type="number"
                  value={formData.estimated_revenue}
                  onChange={(e) => setFormData({ ...formData, estimated_revenue: e.target.value })}
                  placeholder="50000"
                  min="0"
                  className="w-full pl-8 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-[var(--primary)]/50 transition-colors"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-white/40 mb-2">Strengths</label>
                <textarea
                  value={formData.strengths}
                  onChange={(e) => setFormData({ ...formData, strengths: e.target.value })}
                  placeholder="What do they do well?"
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-[var(--primary)]/50 transition-colors resize-none"
                />
              </div>
              <div>
                <label className="block text-xs text-white/40 mb-2">Weaknesses</label>
                <textarea
                  value={formData.weaknesses}
                  onChange={(e) => setFormData({ ...formData, weaknesses: e.target.value })}
                  placeholder="Where do they fall short?"
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-[var(--primary)]/50 transition-colors resize-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs text-white/40 mb-2">Notes</label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Additional observations..."
                rows={2}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-[var(--primary)]/50 transition-colors resize-none"
              />
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="flex-1 px-4 py-3 rounded-xl bg-white/5 text-white/60 font-medium hover:bg-white/10 hover:text-white transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!formData.name.trim()}
                className="flex-1 px-4 py-3 rounded-xl bg-[var(--primary)] text-black font-bold hover:bg-[#00E847] transition-all disabled:opacity-50"
              >
                Add Competitor
              </button>
            </div>
          </form>
        )}
      </LiquidCard>

      {/* Competitors List */}
      {competitors.length > 0 && (
        <LiquidCard className="p-6">
          <h3 className="text-sm font-bold text-white/60 uppercase tracking-wider mb-4">
            Competitors ({competitors.length})
          </h3>
          <div className="space-y-3">
            {competitors.map((competitor) => (
              <div 
                key={competitor.id}
                className="rounded-xl bg-white/5 border border-white/10 overflow-hidden"
              >
                {/* Header */}
                <div 
                  className="flex items-center gap-4 p-4 cursor-pointer hover:bg-white/5 transition-colors"
                  onClick={() => setExpandedId(expandedId === competitor.id ? null : competitor.id)}
                >
                  <div className="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center shrink-0">
                    <span className="text-lg">🏆</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-white">{competitor.name}</h4>
                    <div className="flex items-center gap-3 mt-1">
                      {competitor.estimated_revenue && (
                        <span className="text-xs text-[var(--primary)]">
                          {formatRevenue(competitor.estimated_revenue)}/mo
                        </span>
                      )}
                      {(competitor.app_store_url || competitor.website_url) && (
                        <span className="text-xs text-white/30">
                          {[competitor.app_store_url && 'App Store', competitor.website_url && 'Website'].filter(Boolean).join(' • ')}
                        </span>
                      )}
                    </div>
                  </div>
                  <svg 
                    className={`w-5 h-5 text-white/30 transition-transform ${expandedId === competitor.id ? 'rotate-180' : ''}`} 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2"
                  >
                    <path d="M6 9l6 6 6-6"/>
                  </svg>
                </div>

                {/* Expanded Content */}
                {expandedId === competitor.id && (
                  <div className="px-4 pb-4 space-y-4 border-t border-white/5 pt-4">
                    {/* Links */}
                    {(competitor.app_store_url || competitor.website_url) && (
                      <div className="flex gap-2">
                        {competitor.app_store_url && (
                          <a
                            href={competitor.app_store_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-500/10 text-blue-400 text-xs hover:bg-blue-500/20 transition-colors"
                          >
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                            </svg>
                            App Store
                          </a>
                        )}
                        {competitor.website_url && (
                          <a
                            href={competitor.website_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 text-white/60 text-xs hover:bg-white/10 transition-colors"
                          >
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <circle cx="12" cy="12" r="10"/>
                              <path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/>
                            </svg>
                            Website
                          </a>
                        )}
                      </div>
                    )}

                    {/* Strengths & Weaknesses */}
                    {((competitor.strengths && competitor.strengths.length > 0) || (competitor.weaknesses && competitor.weaknesses.length > 0)) && (
                      <div className="grid md:grid-cols-2 gap-4">
                        {competitor.strengths && competitor.strengths.length > 0 && (
                          <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                            <p className="text-xs font-bold text-green-400 mb-2">💪 Strengths</p>
                            <ul className="text-sm text-white/70 space-y-1">
                              {competitor.strengths.map((s, i) => (
                                <li key={i}>• {s}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {competitor.weaknesses && competitor.weaknesses.length > 0 && (
                          <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                            <p className="text-xs font-bold text-red-400 mb-2">⚠️ Weaknesses</p>
                            <ul className="text-sm text-white/70 space-y-1">
                              {competitor.weaknesses.map((w, i) => (
                                <li key={i}>• {w}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Notes */}
                    {competitor.notes && (
                      <div className="p-3 rounded-lg bg-white/5">
                        <p className="text-xs font-bold text-white/40 mb-2">📝 Notes</p>
                        <p className="text-sm text-white/70">{competitor.notes}</p>
                      </div>
                    )}

                    {/* Delete Button */}
                    <button
                      onClick={() => onDeleteCompetitor(competitor.id)}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg text-red-400 text-xs hover:bg-red-500/10 transition-colors"
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
                      </svg>
                      Delete Competitor
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </LiquidCard>
      )}

      {/* Empty State */}
      {competitors.length === 0 && !showForm && (
        <div className="text-center py-12">
          <span className="text-4xl mb-4 block">🏆</span>
          <h3 className="text-lg font-bold mb-2">No competitors yet</h3>
          <p className="text-white/40">Track your competition to find opportunities</p>
        </div>
      )}
    </div>
  )
}

// ============================================
// NOTES TAB COMPONENT
// ============================================

const noteCategories = [
  { id: 'idea', label: 'Idea', color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' },
  { id: 'research', label: 'Research', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
  { id: 'todo', label: 'To Do', color: 'bg-orange-500/20 text-orange-400 border-orange-500/30' },
  { id: 'feedback', label: 'Feedback', color: 'bg-purple-500/20 text-purple-400 border-purple-500/30' },
  { id: 'other', label: 'Other', color: 'bg-white/10 text-white/60 border-white/20' },
]

function NotesTab({
  notes,
  loading,
  onAddNote,
  onTogglePin,
  onDeleteNote,
}: {
  notes: Note[]
  loading: boolean
  onAddNote: (data: { title?: string; content: string; category?: string }) => void
  onTogglePin: (noteId: string, isPinned: boolean) => void
  onDeleteNote: (noteId: string) => void
}) {
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.content.trim()) return

    onAddNote({
      title: formData.title.trim() || undefined,
      content: formData.content.trim(),
      category: formData.category || undefined,
    })

    setFormData({ title: '', content: '', category: '' })
    setShowForm(false)
  }

  const pinnedNotes = notes.filter(n => n.is_pinned)
  const unpinnedNotes = notes.filter(n => !n.is_pinned)

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  const getCategoryStyle = (category: string | null) => {
    const cat = noteCategories.find(c => c.id === category)
    return cat?.color || noteCategories[4].color
  }

  if (loading) {
    return (
      <LiquidCard className="p-6">
        <div className="grid md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-32 bg-white/5 rounded-xl animate-pulse" />
          ))}
        </div>
      </LiquidCard>
    )
  }

  return (
    <div className="space-y-6">
      {/* Add Note Button / Form */}
      <LiquidCard className="p-6">
        {!showForm ? (
          <button
            onClick={() => setShowForm(true)}
            className="w-full py-3 rounded-xl border-2 border-dashed border-white/10 text-white/40 hover:text-white hover:border-[var(--primary)]/50 transition-all flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 5v14M5 12h14"/>
            </svg>
            Add Note
          </button>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs text-white/40 mb-2">Title (optional)</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Note title..."
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-[var(--primary)]/50 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs text-white/40 mb-2">Content *</label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Write your note..."
                rows={4}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-[var(--primary)]/50 transition-colors resize-none"
                autoFocus
              />
            </div>

            <div>
              <label className="block text-xs text-white/40 mb-2">Category</label>
              <div className="flex flex-wrap gap-2">
                {noteCategories.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, category: formData.category === cat.id ? '' : cat.id })}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                      formData.category === cat.id 
                        ? cat.color 
                        : 'bg-white/5 text-white/40 border-white/10 hover:bg-white/10'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="flex-1 px-4 py-3 rounded-xl bg-white/5 text-white/60 font-medium hover:bg-white/10 hover:text-white transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!formData.content.trim()}
                className="flex-1 px-4 py-3 rounded-xl bg-[var(--primary)] text-black font-bold hover:bg-[#00E847] transition-all disabled:opacity-50"
              >
                Add Note
              </button>
            </div>
          </form>
        )}
      </LiquidCard>

      {/* Pinned Notes */}
      {pinnedNotes.length > 0 && (
        <div>
          <h3 className="text-sm font-bold text-white/60 uppercase tracking-wider mb-4 flex items-center gap-2">
            <span>📌</span> Pinned
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            {pinnedNotes.map((note) => (
              <NoteCard 
                key={note.id}
                note={note}
                onTogglePin={onTogglePin}
                onDelete={onDeleteNote}
                formatDate={formatDate}
                getCategoryStyle={getCategoryStyle}
              />
            ))}
          </div>
        </div>
      )}

      {/* Other Notes */}
      {unpinnedNotes.length > 0 && (
        <div>
          {pinnedNotes.length > 0 && (
            <h3 className="text-sm font-bold text-white/60 uppercase tracking-wider mb-4">
              All Notes
            </h3>
          )}
          <div className="grid md:grid-cols-2 gap-4">
            {unpinnedNotes.map((note) => (
              <NoteCard 
                key={note.id}
                note={note}
                onTogglePin={onTogglePin}
                onDelete={onDeleteNote}
                formatDate={formatDate}
                getCategoryStyle={getCategoryStyle}
              />
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {notes.length === 0 && !showForm && (
        <div className="text-center py-12">
          <span className="text-4xl mb-4 block">📝</span>
          <h3 className="text-lg font-bold mb-2">No notes yet</h3>
          <p className="text-white/40">Capture your ideas and research</p>
        </div>
      )}
    </div>
  )
}

function NoteCard({
  note,
  onTogglePin,
  onDelete,
  formatDate,
  getCategoryStyle,
}: {
  note: Note
  onTogglePin: (noteId: string, isPinned: boolean) => void
  onDelete: (noteId: string) => void
  formatDate: (date: string) => string
  getCategoryStyle: (category: string | null) => string
}) {
  return (
    <LiquidCard className="p-4 group">
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          {note.category && (
            <span className={`px-2 py-0.5 rounded text-xs border ${getCategoryStyle(note.category)}`}>
              {noteCategories.find(c => c.id === note.category)?.label}
            </span>
          )}
          <span className="text-xs text-white/30">{formatDate(note.updated_at)}</span>
        </div>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onTogglePin(note.id, note.is_pinned)}
            className={`p-1.5 rounded-lg transition-colors ${
              note.is_pinned 
                ? 'text-yellow-400 hover:bg-yellow-500/10' 
                : 'text-white/30 hover:text-yellow-400 hover:bg-yellow-500/10'
            }`}
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill={note.is_pinned ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
              <path d="M12 2L12 12M12 12L8 8M12 12L16 8M5 15H19M7 15V22M17 15V22"/>
            </svg>
          </button>
          <button
            onClick={() => onDelete(note.id)}
            className="p-1.5 rounded-lg text-white/30 hover:text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>
      </div>
      {note.title && (
        <h4 className="font-medium text-white mb-2">{note.title}</h4>
      )}
      <p className="text-sm text-white/70 whitespace-pre-wrap">{note.content}</p>
    </LiquidCard>
  )
}

// ============================================
// RESOURCES TAB COMPONENT
// ============================================

const resourceTypes = [
  { id: 'article', label: 'Article', icon: '📄' },
  { id: 'video', label: 'Video', icon: '🎥' },
  { id: 'tool', label: 'Tool', icon: '🔧' },
  { id: 'course', label: 'Course', icon: '📚' },
  { id: 'template', label: 'Template', icon: '📋' },
  { id: 'other', label: 'Other', icon: '🔗' },
]

function ResourcesTab({
  resources,
  loading,
  onAddResource,
  onDeleteResource,
}: {
  resources: Resource[]
  loading: boolean
  onAddResource: (data: { title: string; url?: string; type?: string; description?: string }) => void
  onDeleteResource: (resourceId: string) => void
}) {
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    url: '',
    type: '',
    description: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title.trim()) return

    onAddResource({
      title: formData.title.trim(),
      url: formData.url.trim() || undefined,
      type: formData.type || undefined,
      description: formData.description.trim() || undefined,
    })

    setFormData({ title: '', url: '', type: '', description: '' })
    setShowForm(false)
  }

  const getTypeInfo = (type: string | null) => {
    return resourceTypes.find(t => t.id === type) || resourceTypes[5]
  }

  // Group resources by type
  const groupedResources = resources.reduce((acc, resource) => {
    const type = resource.type || 'other'
    if (!acc[type]) acc[type] = []
    acc[type].push(resource)
    return acc
  }, {} as Record<string, Resource[]>)

  if (loading) {
    return (
      <LiquidCard className="p-6">
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-16 bg-white/5 rounded-xl animate-pulse" />
          ))}
        </div>
      </LiquidCard>
    )
  }

  return (
    <div className="space-y-6">
      {/* Add Resource Button / Form */}
      <LiquidCard className="p-6">
        {!showForm ? (
          <button
            onClick={() => setShowForm(true)}
            className="w-full py-3 rounded-xl border-2 border-dashed border-white/10 text-white/40 hover:text-white hover:border-[var(--primary)]/50 transition-all flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 5v14M5 12h14"/>
            </svg>
            Add Resource
          </button>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs text-white/40 mb-2">Title *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Resource name..."
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-[var(--primary)]/50 transition-colors"
                autoFocus
              />
            </div>

            <div>
              <label className="block text-xs text-white/40 mb-2">URL</label>
              <input
                type="url"
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                placeholder="https://..."
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-[var(--primary)]/50 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs text-white/40 mb-2">Type</label>
              <div className="flex flex-wrap gap-2">
                {resourceTypes.map((type) => (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, type: formData.type === type.id ? '' : type.id })}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                      formData.type === type.id 
                        ? 'bg-[var(--primary)]/20 text-[var(--primary)] border-[var(--primary)]/30' 
                        : 'bg-white/5 text-white/40 border-white/10 hover:bg-white/10'
                    }`}
                  >
                    <span>{type.icon}</span>
                    <span>{type.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs text-white/40 mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Brief description..."
                rows={2}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-[var(--primary)]/50 transition-colors resize-none"
              />
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="flex-1 px-4 py-3 rounded-xl bg-white/5 text-white/60 font-medium hover:bg-white/10 hover:text-white transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!formData.title.trim()}
                className="flex-1 px-4 py-3 rounded-xl bg-[var(--primary)] text-black font-bold hover:bg-[#00E847] transition-all disabled:opacity-50"
              >
                Add Resource
              </button>
            </div>
          </form>
        )}
      </LiquidCard>

      {/* Resources by Type */}
      {Object.entries(groupedResources).map(([type, typeResources]) => (
        <LiquidCard key={type} className="p-6">
          <h3 className="text-sm font-bold text-white/60 uppercase tracking-wider mb-4 flex items-center gap-2">
            <span>{getTypeInfo(type).icon}</span>
            {getTypeInfo(type).label}s ({typeResources.length})
          </h3>
          <div className="space-y-2">
            {typeResources.map((resource) => (
              <div 
                key={resource.id}
                className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10 group hover:border-white/20 transition-all"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium text-white truncate">{resource.title}</h4>
                    {resource.url && (
                      <a
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[var(--primary)] hover:text-[#00E847] transition-colors shrink-0"
                      >
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3"/>
                        </svg>
                      </a>
                    )}
                  </div>
                  {resource.description && (
                    <p className="text-xs text-white/40 mt-1 truncate">{resource.description}</p>
                  )}
                </div>
                <button
                  onClick={() => onDeleteResource(resource.id)}
                  className="p-1.5 rounded-lg text-white/20 hover:text-red-400 hover:bg-red-500/10 opacity-0 group-hover:opacity-100 transition-all shrink-0"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 6L6 18M6 6l12 12"/>
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </LiquidCard>
      ))}

      {/* Empty State */}
      {resources.length === 0 && !showForm && (
        <div className="text-center py-12">
          <span className="text-4xl mb-4 block">🔗</span>
          <h3 className="text-lg font-bold mb-2">No resources yet</h3>
          <p className="text-white/40">Save useful links, articles and tools</p>
        </div>
      )}
    </div>
  )
}

// ============================================
// SWOT TAB COMPONENT
// ============================================

function SwotTab({
  project,
  projectId,
  onUpdate,
  sourceData,
}: {
  project: Project
  projectId: string
  onUpdate: (updates: Partial<Project>) => void
  sourceData: SourceData
}) {
  const [saving, setSaving] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [strengths, setStrengths] = useState<string[]>(project.swot_strengths || [])
  const [weaknesses, setWeaknesses] = useState<string[]>(project.swot_weaknesses || [])
  const [opportunities, setOpportunities] = useState<string[]>(project.swot_opportunities || [])
  const [threats, setThreats] = useState<string[]>(project.swot_threats || [])
  
  const [newItem, setNewItem] = useState({ strengths: '', weaknesses: '', opportunities: '', threats: '' })

  // Generate SWOT suggestions from source data
  const getSuggestions = () => {
    const suggestions = {
      strengths: [] as string[],
      weaknesses: [] as string[],
      opportunities: [] as string[],
      threats: [] as string[],
    }

    if (sourceData?.type === 'niche' && sourceData.niche) {
      const niche = sourceData.niche
      // Strengths from keyLearnings and improvements
      if (niche.keyLearnings) suggestions.strengths.push(...niche.keyLearnings)
      if (niche.improvements) suggestions.opportunities.push(...niche.improvements)
      // Opportunities from gap and opportunity
      if (niche.gap) suggestions.opportunities.push(niche.gap)
      if (niche.opportunity) suggestions.opportunities.push(niche.opportunity)
      // Threats from risks
      if (niche.risks) suggestions.threats.push(...niche.risks)
      // Weaknesses - competition level
      if (niche.stats?.competition) {
        suggestions.weaknesses.push(`Competition level: ${niche.stats.competition}`)
      }
    } else if (sourceData?.type === 'validation' && sourceData.validation) {
      const validation = sourceData.validation
      // Direct mapping
      if (validation.strengths) suggestions.strengths.push(...validation.strengths)
      if (validation.weaknesses) suggestions.weaknesses.push(...validation.weaknesses)
      if (validation.recommendations) suggestions.opportunities.push(...validation.recommendations)
      // Competition as threat
      if (validation.competition) {
        suggestions.threats.push(`Competition: ${validation.competition}`)
      }
    }

    return suggestions
  }

  const suggestions = getSuggestions()
  const hasSuggestions = Object.values(suggestions).some(arr => arr.length > 0)

  const handleAddItem = async (category: 'strengths' | 'weaknesses' | 'opportunities' | 'threats') => {
    if (!newItem[category].trim()) return
    
    const currentItems = category === 'strengths' ? strengths 
      : category === 'weaknesses' ? weaknesses 
      : category === 'opportunities' ? opportunities 
      : threats
    
    const updatedItems = [...currentItems, newItem[category].trim()]
    
    setSaving(true)
    try {
      const res = await fetch(`/api/projects/${projectId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ [`swot_${category}`]: updatedItems }),
      })
      
      if (res.ok) {
        if (category === 'strengths') setStrengths(updatedItems)
        else if (category === 'weaknesses') setWeaknesses(updatedItems)
        else if (category === 'opportunities') setOpportunities(updatedItems)
        else setThreats(updatedItems)
        
        onUpdate({ [`swot_${category}`]: updatedItems } as Partial<Project>)
        setNewItem({ ...newItem, [category]: '' })
      }
    } catch (error) {
      console.error('Error updating SWOT:', error)
    } finally {
      setSaving(false)
    }
  }

  const handleRemoveItem = async (category: 'strengths' | 'weaknesses' | 'opportunities' | 'threats', index: number) => {
    const currentItems = category === 'strengths' ? strengths 
      : category === 'weaknesses' ? weaknesses 
      : category === 'opportunities' ? opportunities 
      : threats
    
    const updatedItems = currentItems.filter((_, i) => i !== index)
    
    setSaving(true)
    try {
      const res = await fetch(`/api/projects/${projectId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ [`swot_${category}`]: updatedItems }),
      })
      
      if (res.ok) {
        if (category === 'strengths') setStrengths(updatedItems)
        else if (category === 'weaknesses') setWeaknesses(updatedItems)
        else if (category === 'opportunities') setOpportunities(updatedItems)
        else setThreats(updatedItems)
        
        onUpdate({ [`swot_${category}`]: updatedItems } as Partial<Project>)
      }
    } catch (error) {
      console.error('Error updating SWOT:', error)
    } finally {
      setSaving(false)
    }
  }

  const swotSections = [
    { 
      key: 'strengths' as const, 
      title: 'Strengths', 
      icon: '💪', 
      color: 'green' as const,
      items: strengths,
      placeholder: 'What gives you an advantage?'
    },
    { 
      key: 'weaknesses' as const, 
      title: 'Weaknesses', 
      icon: '⚠️', 
      color: 'red' as const,
      items: weaknesses,
      placeholder: 'What could be improved?'
    },
    { 
      key: 'opportunities' as const, 
      title: 'Opportunities', 
      icon: '🚀', 
      color: 'blue' as const,
      items: opportunities,
      placeholder: 'What trends can you capitalize on?'
    },
    { 
      key: 'threats' as const, 
      title: 'Threats', 
      icon: '⚡', 
      color: 'orange' as const,
      items: threats,
      placeholder: 'What obstacles do you face?'
    },
  ]

  const colorClasses = {
    green: { bg: 'bg-green-500/10', border: 'border-green-500/20', text: 'text-green-400', input: 'focus:border-green-500/50' },
    red: { bg: 'bg-red-500/10', border: 'border-red-500/20', text: 'text-red-400', input: 'focus:border-red-500/50' },
    blue: { bg: 'bg-blue-500/10', border: 'border-blue-500/20', text: 'text-blue-400', input: 'focus:border-blue-500/50' },
    orange: { bg: 'bg-orange-500/10', border: 'border-orange-500/20', text: 'text-orange-400', input: 'focus:border-orange-500/50' },
  }

  return (
    <div className="space-y-6">
      {/* Info */}
      <LiquidCard className="p-6">
        <div className="flex items-start gap-3">
          <span className="text-2xl">📊</span>
          <div>
            <h3 className="font-bold text-white mb-1">SWOT Analysis</h3>
            <p className="text-sm text-white/50">
              Analyze your project&apos;s Strengths, Weaknesses, Opportunities and Threats to make better strategic decisions.
            </p>
          </div>
        </div>
      </LiquidCard>

      {/* Suggestions from Source - Collapsible */}
      {hasSuggestions && (
        <LiquidCard className="p-6 border border-[var(--primary)]/20 bg-[var(--primary)]/5">
          {/* Header - Clickable to expand/collapse */}
          <div 
            className="flex items-center justify-between cursor-pointer select-none"
            onClick={() => setShowSuggestions(!showSuggestions)}
          >
            <h3 className="text-sm font-bold text-[var(--primary)] uppercase tracking-wider flex items-center gap-2">
              <span>💡</span>
              Suggestions from {sourceData?.type === 'niche' ? 'Niche' : 'Validation'}
              <svg 
                className={`w-4 h-4 transition-transform duration-200 ${showSuggestions ? 'rotate-180' : ''}`} 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2"
              >
                <path d="M6 9l6 6 6-6"/>
              </svg>
            </h3>
            {showSuggestions && (
              <button
                onClick={async (e) => {
                  e.stopPropagation()
                  setSaving(true)
                  try {
                    // Import progressively with visual feedback
                    let currentStrengths = [...strengths]
                    let currentWeaknesses = [...weaknesses]
                    let currentOpportunities = [...opportunities]
                    let currentThreats = [...threats]

                    // Add strengths one by one
                    for (const item of suggestions.strengths) {
                      if (!currentStrengths.includes(item)) {
                        currentStrengths = [...currentStrengths, item]
                        setStrengths(currentStrengths)
                        await new Promise(r => setTimeout(r, 80))
                      }
                    }

                    // Add weaknesses one by one
                    for (const item of suggestions.weaknesses) {
                      if (!currentWeaknesses.includes(item)) {
                        currentWeaknesses = [...currentWeaknesses, item]
                        setWeaknesses(currentWeaknesses)
                        await new Promise(r => setTimeout(r, 80))
                      }
                    }

                    // Add opportunities one by one
                    for (const item of suggestions.opportunities) {
                      if (!currentOpportunities.includes(item)) {
                        currentOpportunities = [...currentOpportunities, item]
                        setOpportunities(currentOpportunities)
                        await new Promise(r => setTimeout(r, 80))
                      }
                    }

                    // Add threats one by one
                    for (const item of suggestions.threats) {
                      if (!currentThreats.includes(item)) {
                        currentThreats = [...currentThreats, item]
                        setThreats(currentThreats)
                        await new Promise(r => setTimeout(r, 80))
                      }
                    }

                    // Save to database
                    const res = await fetch(`/api/projects/${projectId}`, {
                      method: 'PUT',
                      headers: { 'Content-Type': 'application/json' },
                      credentials: 'include',
                      body: JSON.stringify({
                        swot_strengths: currentStrengths,
                        swot_weaknesses: currentWeaknesses,
                        swot_opportunities: currentOpportunities,
                        swot_threats: currentThreats,
                      }),
                    })

                    if (res.ok) {
                      onUpdate({
                        swot_strengths: currentStrengths,
                        swot_weaknesses: currentWeaknesses,
                        swot_opportunities: currentOpportunities,
                        swot_threats: currentThreats,
                      })
                    }
                  } catch (error) {
                    console.error('Error importing suggestions:', error)
                  } finally {
                    setSaving(false)
                  }
                }}
                disabled={saving}
                className="text-xs px-3 py-1.5 rounded-lg bg-[var(--primary)] text-black font-medium hover:bg-[#00E847] transition-colors disabled:opacity-50"
              >
                {saving ? 'Importing...' : 'Import All'}
              </button>
            )}
          </div>

          {/* Collapsible content */}
          <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
            showSuggestions ? 'max-h-[1000px] opacity-100 mt-4' : 'max-h-0 opacity-0 mt-0'
          }`}>
            <div className="grid md:grid-cols-2 gap-3 text-sm">
              {suggestions.strengths.length > 0 && (
                <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                  <p className="font-bold text-green-400 mb-2">💪 Strengths ({suggestions.strengths.filter(s => !strengths.includes(s)).length}/{suggestions.strengths.length})</p>
                  <ul className="space-y-1">
                    {suggestions.strengths.map((s, i) => {
                      const isImported = strengths.includes(s)
                      return (
                        <li key={i} className={`transition-all duration-300 ${isImported ? 'text-white/30 line-through' : 'text-white/70'}`}>
                          {isImported ? '✓' : '•'} {s}
                        </li>
                      )
                    })}
                  </ul>
                </div>
              )}
              {suggestions.weaknesses.length > 0 && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                  <p className="font-bold text-red-400 mb-2">⚠️ Weaknesses ({suggestions.weaknesses.filter(s => !weaknesses.includes(s)).length}/{suggestions.weaknesses.length})</p>
                  <ul className="space-y-1">
                    {suggestions.weaknesses.map((s, i) => {
                      const isImported = weaknesses.includes(s)
                      return (
                        <li key={i} className={`transition-all duration-300 ${isImported ? 'text-white/30 line-through' : 'text-white/70'}`}>
                          {isImported ? '✓' : '•'} {s}
                        </li>
                      )
                    })}
                  </ul>
                </div>
              )}
              {suggestions.opportunities.length > 0 && (
                <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                  <p className="font-bold text-blue-400 mb-2">🚀 Opportunities ({suggestions.opportunities.filter(s => !opportunities.includes(s)).length}/{suggestions.opportunities.length})</p>
                  <ul className="space-y-1">
                    {suggestions.opportunities.map((s, i) => {
                      const isImported = opportunities.includes(s)
                      return (
                        <li key={i} className={`transition-all duration-300 ${isImported ? 'text-white/30 line-through' : 'text-white/70'}`}>
                          {isImported ? '✓' : '•'} {s}
                        </li>
                      )
                    })}
                  </ul>
                </div>
              )}
              {suggestions.threats.length > 0 && (
                <div className="p-3 rounded-lg bg-orange-500/10 border border-orange-500/20">
                  <p className="font-bold text-orange-400 mb-2">⚡ Threats ({suggestions.threats.filter(s => !threats.includes(s)).length}/{suggestions.threats.length})</p>
                  <ul className="space-y-1">
                    {suggestions.threats.map((s, i) => {
                      const isImported = threats.includes(s)
                      return (
                        <li key={i} className={`transition-all duration-300 ${isImported ? 'text-white/30 line-through' : 'text-white/70'}`}>
                          {isImported ? '✓' : '•'} {s}
                        </li>
                      )
                    })}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </LiquidCard>
      )}

      {/* Analysis Grid */}
      <div className="grid md:grid-cols-2 gap-4">
        {swotSections.map((section) => (
          <LiquidCard key={section.key} className={`p-6 ${colorClasses[section.color].bg} ${colorClasses[section.color].border}`}>
            <h3 className={`text-sm font-bold uppercase tracking-wider mb-4 flex items-center gap-2 ${colorClasses[section.color].text}`}>
              <span>{section.icon}</span>
              {section.title} ({section.items.length})
            </h3>
            
            {/* Items */}
            <div className="space-y-2 mb-4">
              {section.items.map((item, index) => (
                <div 
                  key={index}
                  className="flex items-center gap-2 p-2 rounded-lg bg-black/20 group"
                >
                  <span className="flex-1 text-sm text-white/80">{item}</span>
                  <button
                    onClick={() => handleRemoveItem(section.key, index)}
                    disabled={saving}
                    className="p-1 rounded text-white/20 hover:text-red-400 hover:bg-red-500/10 opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M18 6L6 18M6 6l12 12"/>
                    </svg>
                  </button>
                </div>
              ))}
              {section.items.length === 0 && (
                <p className="text-xs text-white/30 italic">No items yet</p>
              )}
            </div>
            
            {/* Add Item */}
            <div className="flex gap-2">
              <input
                type="text"
                value={newItem[section.key]}
                onChange={(e) => setNewItem({ ...newItem, [section.key]: e.target.value })}
                onKeyDown={(e) => e.key === 'Enter' && handleAddItem(section.key)}
                placeholder={section.placeholder}
                className={`flex-1 px-3 py-2 rounded-lg bg-black/30 border border-white/10 text-sm text-white placeholder:text-white/30 focus:outline-none ${colorClasses[section.color].input} transition-colors`}
              />
              <button
                onClick={() => handleAddItem(section.key)}
                disabled={saving || !newItem[section.key].trim()}
                className={`px-3 py-2 rounded-lg ${colorClasses[section.color].bg} ${colorClasses[section.color].text} text-sm font-medium hover:opacity-80 transition-opacity disabled:opacity-30`}
              >
                +
              </button>
            </div>
          </LiquidCard>
        ))}
      </div>
    </div>
  )
}

// ============================================
// REVENUE TAB COMPONENT
// ============================================

function RevenueTab({
  project,
  projectId,
  onUpdate,
}: {
  project: Project
  projectId: string
  onUpdate: (updates: Partial<Project>) => void
}) {
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [revenueGoal, setRevenueGoalState] = useState(project.revenue_goal?.toString() || '')
  const [revenueDeadline, setRevenueDeadlineState] = useState(project.revenue_goal_deadline || '')
  const [appStoreUrl, setAppStoreUrlState] = useState(project.app_store_url || '')
  const [monthlyRevenue, setMonthlyRevenueState] = useState(project.monthly_revenue?.toString() || '0')

  // Wrapper setters to reset saved state on change
  const setRevenueGoal = (val: string) => { setSaved(false); setRevenueGoalState(val) }
  const setRevenueDeadline = (val: string) => { setSaved(false); setRevenueDeadlineState(val) }
  const setAppStoreUrl = (val: string) => { setSaved(false); setAppStoreUrlState(val) }
  const setMonthlyRevenue = (val: string) => { setSaved(false); setMonthlyRevenueState(val) }

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await fetch(`/api/projects/${projectId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          revenue_goal: revenueGoal ? parseFloat(revenueGoal) : null,
          revenue_goal_deadline: revenueDeadline || null,
          app_store_url: appStoreUrl.trim() || null,
          monthly_revenue: parseFloat(monthlyRevenue) || 0,
        }),
      })
      
      if (res.ok) {
        onUpdate({
          revenue_goal: revenueGoal ? parseFloat(revenueGoal) : null,
          revenue_goal_deadline: revenueDeadline || null,
          app_store_url: appStoreUrl.trim() || null,
          monthly_revenue: parseFloat(monthlyRevenue) || 0,
        })
        setSaved(true)
      }
    } catch (error) {
      console.error('Error saving revenue data:', error)
    } finally {
      setSaving(false)
    }
  }

  const goalProgress = revenueGoal && parseFloat(monthlyRevenue) 
    ? Math.min(100, Math.round((parseFloat(monthlyRevenue) / parseFloat(revenueGoal)) * 100))
    : 0

  const formatCurrency = (value: number) => {
    if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`
    if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`
    return `$${value.toFixed(0)}`
  }

  const isLaunched = project.status === 'launched'

  return (
    <div className="space-y-6 relative">
      {/* Overlay for non-launched projects */}
      {!isLaunched && (
        <div className="absolute inset-0 z-20 flex items-center justify-center">
          <div className="absolute inset-0 bg-[var(--bg-deep)]/80 backdrop-blur-sm rounded-2xl" />
          <div className="relative z-10 text-center p-8 max-w-md">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[var(--primary)]/10 flex items-center justify-center">
              <span className="text-3xl">🚀</span>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Launch Your App First</h3>
            <p className="text-white/60 mb-4">
              Revenue tracking is available once your project status is set to <span className="text-[var(--primary)] font-medium">&quot;Launched&quot;</span>.
            </p>
            <p className="text-sm text-white/40">
              Update your project status in the Overview tab when you&apos;re ready to start tracking revenue.
            </p>
          </div>
        </div>
      )}

      {/* Content (grayed out if not launched) */}
      <div className={!isLaunched ? 'opacity-30 pointer-events-none select-none' : ''}>
      {/* Current Revenue */}
      <LiquidCard className="p-6">
        <h3 className="text-sm font-bold text-white/60 uppercase tracking-wider mb-4">Current Revenue</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-white/40 mb-2">Monthly Revenue (USD)</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30">$</span>
              <input
                type="number"
                value={monthlyRevenue}
                onChange={(e) => setMonthlyRevenue(e.target.value)}
                placeholder="0"
                min="0"
                step="0.01"
                className="w-full pl-8 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-[var(--primary)]/50 transition-colors"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs text-white/40 mb-2">App Store URL</label>
            <input
              type="url"
              value={appStoreUrl}
              onChange={(e) => setAppStoreUrl(e.target.value)}
              placeholder="https://apps.apple.com/..."
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-[var(--primary)]/50 transition-colors"
            />
          </div>
        </div>
      </LiquidCard>

      {/* Revenue Goal */}
      <LiquidCard className="p-6">
        <h3 className="text-sm font-bold text-white/60 uppercase tracking-wider mb-4">Revenue Goal</h3>
        
        {/* Progress */}
        {revenueGoal && (
          <div className="mb-6 p-4 rounded-xl bg-[var(--primary)]/10 border border-[var(--primary)]/20">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-white/60">Progress to goal</span>
              <span className="text-sm font-bold text-[var(--primary)]">{goalProgress}%</span>
            </div>
            <div className="h-3 bg-black/30 rounded-full overflow-hidden">
              <div 
                className="h-full bg-[var(--primary)] rounded-full transition-all duration-500"
                style={{ width: `${goalProgress}%` }}
              />
            </div>
            <div className="flex justify-between mt-2 text-xs text-white/40">
              <span>{formatCurrency(parseFloat(monthlyRevenue) || 0)}</span>
              <span>{formatCurrency(parseFloat(revenueGoal))}</span>
            </div>
          </div>
        )}
        
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-white/40 mb-2">Target Monthly Revenue</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30">$</span>
              <input
                type="number"
                value={revenueGoal}
                onChange={(e) => setRevenueGoal(e.target.value)}
                placeholder="10000"
                min="0"
                className="w-full pl-8 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-[var(--primary)]/50 transition-colors"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs text-white/40 mb-2">Target Date</label>
            <input
              type="date"
              value={revenueDeadline}
              onChange={(e) => setRevenueDeadline(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[var(--primary)]/50 transition-colors"
            />
          </div>
        </div>
      </LiquidCard>

      {/* Save Button */}
      {!saved && (
        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full py-3 rounded-xl bg-[var(--primary)] text-black font-bold hover:bg-[#00E847] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {saving ? (
            <>
              <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/>
                <polyline points="17 21 17 13 7 13 7 21"/>
                <polyline points="7 3 7 8 15 8"/>
              </svg>
              Save Revenue Data
            </>
          )}
        </button>
      )}
      </div>
    </div>
  )
}

// ============================================
// MARKET TAB COMPONENT
// ============================================

function MarketTab({
  project,
  projectId,
  onUpdate,
  sourceData,
}: {
  project: Project
  projectId: string
  onUpdate: (updates: Partial<Project>) => void
  sourceData: SourceData
}) {
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [appName, setAppNameState] = useState(project.app_name || '')
  const [appTagline, setAppTaglineState] = useState(project.app_tagline || '')
  const [targetAudience, setTargetAudienceState] = useState(project.target_audience || '')
  const [uniqueSellingPoint, setUniqueSellingPointState] = useState(project.unique_selling_point || '')
  const [marketNotes, setMarketNotesState] = useState(project.market_notes || '')
  const [keywords, setKeywordsState] = useState<string[]>(project.keywords || [])
  const [newKeyword, setNewKeyword] = useState('')
  const [isImporting, setIsImporting] = useState(false)
  const [importedItems, setImportedItems] = useState<Set<string>>(new Set())

  // Wrapper setters to reset saved state on change
  const setAppName = (val: string) => { setSaved(false); setAppNameState(val) }
  const setAppTagline = (val: string) => { setSaved(false); setAppTaglineState(val) }
  const setTargetAudience = (val: string) => { setSaved(false); setTargetAudienceState(val) }
  const setUniqueSellingPoint = (val: string) => { setSaved(false); setUniqueSellingPointState(val) }
  const setMarketNotes = (val: string) => { setSaved(false); setMarketNotesState(val) }
  const setKeywords = (val: string[] | ((prev: string[]) => string[])) => { 
    setSaved(false)
    if (typeof val === 'function') {
      setKeywordsState(val)
    } else {
      setKeywordsState(val)
    }
  }

  // Get suggestions from source data
  const suggestions = {
    targetAudience: sourceData?.type === 'niche' 
      ? sourceData.niche?.marketAnalysis?.targetAudience 
      : null,
    marketInsights: sourceData?.type === 'validation'
      ? sourceData.validation?.market_insights
      : null,
    gap: sourceData?.type === 'niche' ? sourceData.niche?.gap : null,
    opportunity: sourceData?.type === 'niche' ? sourceData.niche?.opportunity : null,
    monetization: sourceData?.type === 'niche' ? sourceData.niche?.monetization : null,
    category: sourceData?.type === 'niche' ? sourceData.niche?.category : null,
  }

  const hasSuggestions = Object.values(suggestions).some(v => v)

  // Import suggestions with animation
  const handleImportSuggestions = async () => {
    setIsImporting(true)
    const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))
    
    if (suggestions.targetAudience && !targetAudience) {
      setImportedItems(prev => new Set([...prev, 'targetAudience']))
      await delay(150)
      setTargetAudience(suggestions.targetAudience)
    }
    
    if (suggestions.gap && !uniqueSellingPoint) {
      setImportedItems(prev => new Set([...prev, 'gap']))
      await delay(150)
      setUniqueSellingPoint(suggestions.gap)
    }
    
    if (suggestions.marketInsights) {
      setImportedItems(prev => new Set([...prev, 'marketInsights']))
      await delay(150)
    }
    
    if (suggestions.monetization) {
      setImportedItems(prev => new Set([...prev, 'monetization']))
      await delay(150)
    }
    
    // Build market notes from various sources
    const notesFromSource: string[] = []
    if (suggestions.marketInsights) notesFromSource.push(`Market Insights:\n${suggestions.marketInsights}`)
    if (suggestions.opportunity) notesFromSource.push(`Opportunity:\n${suggestions.opportunity}`)
    if (suggestions.monetization) {
      notesFromSource.push(`Monetization:\n- Model: ${suggestions.monetization.model}\n- Pricing: ${suggestions.monetization.pricing}\n- Expected Conversion: ${suggestions.monetization.conversionRate}`)
    }
    if (notesFromSource.length > 0 && !marketNotes) {
      setMarketNotes(notesFromSource.join('\n\n'))
    }
    
    // Add category as keyword
    if (suggestions.category && !keywords.includes(suggestions.category)) {
      setKeywords(prev => [...prev, suggestions.category!])
    }
    
    setIsImporting(false)
  }

  const handleAddKeyword = () => {
    if (!newKeyword.trim() || keywords.includes(newKeyword.trim())) return
    setKeywords([...keywords, newKeyword.trim()])
    setNewKeyword('')
  }

  const handleRemoveKeyword = (keyword: string) => {
    setKeywords(keywords.filter(k => k !== keyword))
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await fetch(`/api/projects/${projectId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          app_name: appName.trim() || null,
          app_tagline: appTagline.trim() || null,
          target_audience: targetAudience.trim() || null,
          unique_selling_point: uniqueSellingPoint.trim() || null,
          market_notes: marketNotes.trim() || null,
          keywords: keywords.length > 0 ? keywords : null,
        }),
      })
      
      if (res.ok) {
        onUpdate({
          app_name: appName.trim() || null,
          app_tagline: appTagline.trim() || null,
          target_audience: targetAudience.trim() || null,
          unique_selling_point: uniqueSellingPoint.trim() || null,
          market_notes: marketNotes.trim() || null,
          keywords: keywords.length > 0 ? keywords : null,
        })
        setSaved(true)
      }
    } catch (error) {
      console.error('Error saving market data:', error)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Suggestions from Source */}
      {hasSuggestions && !targetAudience && !marketNotes && (
        <LiquidCard className="p-6 border border-[var(--primary)]/20 bg-[var(--primary)]/5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-[var(--primary)] uppercase tracking-wider flex items-center gap-2">
              <span>💡</span>
              Market Data from {sourceData?.type === 'niche' ? 'Niche' : 'Validation'}
            </h3>
            <button
              onClick={handleImportSuggestions}
              disabled={isImporting}
              className="text-xs px-3 py-1.5 rounded-lg bg-[var(--primary)] text-black font-medium hover:bg-[#00E847] transition-colors disabled:opacity-50"
            >
              {isImporting ? 'Importing...' : 'Import All'}
            </button>
          </div>
          <div className="space-y-3 text-sm">
            {suggestions.targetAudience && (
              <div className={`p-3 rounded-lg bg-black/20 border border-white/10 transition-all duration-300 ${importedItems.has('targetAudience') ? 'opacity-40' : ''}`}>
                <p className="text-xs font-bold text-white/60 mb-1 flex items-center gap-2">
                  Target Audience
                  {importedItems.has('targetAudience') && <span className="text-[var(--primary)]">✓</span>}
                </p>
                <p className={`text-white/80 ${importedItems.has('targetAudience') ? 'line-through' : ''}`}>{suggestions.targetAudience}</p>
              </div>
            )}
            {suggestions.gap && (
              <div className={`p-3 rounded-lg bg-black/20 border border-white/10 transition-all duration-300 ${importedItems.has('gap') ? 'opacity-40' : ''}`}>
                <p className="text-xs font-bold text-white/60 mb-1 flex items-center gap-2">
                  Market Gap (USP)
                  {importedItems.has('gap') && <span className="text-[var(--primary)]">✓</span>}
                </p>
                <p className={`text-white/80 ${importedItems.has('gap') ? 'line-through' : ''}`}>{suggestions.gap}</p>
              </div>
            )}
            {suggestions.marketInsights && (
              <div className={`p-3 rounded-lg bg-black/20 border border-white/10 transition-all duration-300 ${importedItems.has('marketInsights') ? 'opacity-40' : ''}`}>
                <p className="text-xs font-bold text-white/60 mb-1 flex items-center gap-2">
                  Market Insights
                  {importedItems.has('marketInsights') && <span className="text-[var(--primary)]">✓</span>}
                </p>
                <p className={`text-white/80 line-clamp-3 ${importedItems.has('marketInsights') ? 'line-through' : ''}`}>{suggestions.marketInsights}</p>
              </div>
            )}
            {suggestions.monetization && (
              <div className={`p-3 rounded-lg bg-black/20 border border-white/10 transition-all duration-300 ${importedItems.has('monetization') ? 'opacity-40' : ''}`}>
                <p className="text-xs font-bold text-white/60 mb-1 flex items-center gap-2">
                  Monetization
                  {importedItems.has('monetization') && <span className="text-[var(--primary)]">✓</span>}
                </p>
                <p className={`text-white/80 ${importedItems.has('monetization') ? 'line-through' : ''}`}>{suggestions.monetization.model} - {suggestions.monetization.pricing}</p>
              </div>
            )}
          </div>
        </LiquidCard>
      )}

      {/* App Identity */}
      <LiquidCard className="p-6">
        <h3 className="text-sm font-bold text-white/60 uppercase tracking-wider mb-4">App Identity</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-white/40 mb-2">App Name</label>
            <input
              type="text"
              value={appName}
              onChange={(e) => setAppName(e.target.value)}
              placeholder="My Awesome App"
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-[var(--primary)]/50 transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs text-white/40 mb-2">Tagline</label>
            <input
              type="text"
              value={appTagline}
              onChange={(e) => setAppTagline(e.target.value)}
              placeholder="Your catchy tagline"
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-[var(--primary)]/50 transition-colors"
            />
          </div>
        </div>
      </LiquidCard>

      {/* Target Market */}
      <LiquidCard className="p-6">
        <h3 className="text-sm font-bold text-white/60 uppercase tracking-wider mb-4">Target Market</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-xs text-white/40 mb-2">Target Audience</label>
            <textarea
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value)}
              placeholder="Describe your ideal users: demographics, behaviors, pain points..."
              rows={3}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-[var(--primary)]/50 transition-colors resize-none"
            />
          </div>
          <div>
            <label className="block text-xs text-white/40 mb-2">Unique Selling Point (USP)</label>
            <textarea
              value={uniqueSellingPoint}
              onChange={(e) => setUniqueSellingPoint(e.target.value)}
              placeholder="What makes your app different and better than competitors?"
              rows={2}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-[var(--primary)]/50 transition-colors resize-none"
            />
          </div>
        </div>
      </LiquidCard>

      {/* Keywords */}
      <LiquidCard className="p-6">
        <h3 className="text-sm font-bold text-white/60 uppercase tracking-wider mb-4">Keywords (ASO)</h3>
        
        {/* Keyword Tags */}
        {keywords.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {keywords.map((keyword) => (
              <span 
                key={keyword}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[var(--primary)]/20 text-[var(--primary)] text-sm"
              >
                {keyword}
                <button
                  onClick={() => handleRemoveKeyword(keyword)}
                  className="ml-1 hover:text-red-400 transition-colors"
                >
                  <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 6L6 18M6 6l12 12"/>
                  </svg>
                </button>
              </span>
            ))}
          </div>
        )}
        
        {/* Add Keyword */}
        <div className="flex gap-2">
          <input
            type="text"
            value={newKeyword}
            onChange={(e) => setNewKeyword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddKeyword()}
            placeholder="Add keyword..."
            className="flex-1 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-[var(--primary)]/50 transition-colors"
          />
          <button
            onClick={handleAddKeyword}
            disabled={!newKeyword.trim()}
            className="px-4 py-2 rounded-xl bg-[var(--primary)] text-black font-bold hover:bg-[#00E847] transition-all disabled:opacity-50"
          >
            Add
          </button>
        </div>
        <p className="text-xs text-white/30 mt-2">
          Add keywords that users might search for to find your app
        </p>
      </LiquidCard>

      {/* Market Notes */}
      <LiquidCard className="p-6">
        <h3 className="text-sm font-bold text-white/60 uppercase tracking-wider mb-4">Market Notes</h3>
        <textarea
          value={marketNotes}
          onChange={(e) => setMarketNotes(e.target.value)}
          placeholder="Market research, trends, insights, positioning ideas..."
          rows={4}
          className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-[var(--primary)]/50 transition-colors resize-none"
        />
      </LiquidCard>

      {/* Save Button */}
      {!saved && (
        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full py-3 rounded-xl bg-[var(--primary)] text-black font-bold hover:bg-[#00E847] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {saving ? (
            <>
              <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/>
                <polyline points="17 21 17 13 7 13 7 21"/>
                <polyline points="7 3 7 8 15 8"/>
              </svg>
              Save Market Data
            </>
          )}
        </button>
      )}
    </div>
  )
}

// ============================================
// COSTS TAB
// ============================================

interface Cost {
  id: string
  name: string
  amount: number
  frequency: 'monthly' | 'yearly' | 'one-time'
  category: string
  created_at: string
}

const COST_CATEGORIES = [
  { id: 'tools', label: 'Tools & Software', icon: '🛠️' },
  { id: 'api', label: 'APIs & Services', icon: '🔌' },
  { id: 'hosting', label: 'Hosting & Infra', icon: '☁️' },
  { id: 'marketing', label: 'Marketing', icon: '📢' },
  { id: 'other', label: 'Other', icon: '📦' },
]

const SUGGESTED_COSTS = [
  { name: 'Cursor Pro', amount: 20, frequency: 'monthly' as const, category: 'tools' },
  { name: 'ChatGPT Plus', amount: 20, frequency: 'monthly' as const, category: 'api' },
  { name: 'OpenAI API', amount: 0, frequency: 'monthly' as const, category: 'api' },
  { name: 'Apple Developer', amount: 99, frequency: 'yearly' as const, category: 'tools' },
  { name: 'Vercel Pro', amount: 20, frequency: 'monthly' as const, category: 'hosting' },
  { name: 'Supabase Pro', amount: 25, frequency: 'monthly' as const, category: 'hosting' },
  { name: 'Domain', amount: 12, frequency: 'yearly' as const, category: 'hosting' },
  { name: 'Figma', amount: 15, frequency: 'monthly' as const, category: 'tools' },
]

function CostsTab({
  projectId,
}: {
  projectId: string
}) {
  const [costs, setCosts] = useState<Cost[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  
  // New cost form
  const [showAddForm, setShowAddForm] = useState(false)
  const [newCost, setNewCost] = useState({
    name: '',
    amount: '',
    frequency: 'monthly' as 'monthly' | 'yearly' | 'one-time',
    category: 'tools',
  })

  // Load costs
  useEffect(() => {
    const loadCosts = async () => {
      try {
        const res = await fetch(`/api/projects/${projectId}/costs`, {
          credentials: 'include',
        })
        if (res.ok) {
          const data = await res.json()
          setCosts(data.costs || [])
        }
      } catch (error) {
        console.error('Error loading costs:', error)
      } finally {
        setLoading(false)
      }
    }
    loadCosts()
  }, [projectId])

  const handleAddCost = async (costData?: typeof SUGGESTED_COSTS[0]) => {
    const data = costData || newCost
    if (!data.name.trim() || !data.amount) return

    setSaving(true)
    try {
      const res = await fetch(`/api/projects/${projectId}/costs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          name: data.name.trim(),
          amount: parseFloat(data.amount.toString()),
          frequency: data.frequency,
          category: data.category,
        }),
      })

      if (res.ok) {
        const result = await res.json()
        setCosts([...costs, result.cost])
        setNewCost({ name: '', amount: '', frequency: 'monthly', category: 'tools' })
        setShowAddForm(false)
      }
    } catch (error) {
      console.error('Error adding cost:', error)
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteCost = async (costId: string) => {
    try {
      const res = await fetch(`/api/projects/${projectId}/costs?costId=${costId}`, {
        method: 'DELETE',
        credentials: 'include',
      })

      if (res.ok) {
        setCosts(costs.filter(c => c.id !== costId))
      }
    } catch (error) {
      console.error('Error deleting cost:', error)
    }
  }

  // Calculate totals
  const monthlyTotal = costs.reduce((sum, cost) => {
    if (cost.frequency === 'monthly') return sum + cost.amount
    if (cost.frequency === 'yearly') return sum + (cost.amount / 12)
    return sum
  }, 0)

  const yearlyTotal = costs.reduce((sum, cost) => {
    if (cost.frequency === 'monthly') return sum + (cost.amount * 12)
    if (cost.frequency === 'yearly') return sum + cost.amount
    if (cost.frequency === 'one-time') return sum + cost.amount
    return sum
  }, 0)

  const costExists = (name: string) => {
    return costs.some(c => c.name.toLowerCase() === name.toLowerCase())
  }

  if (loading) {
    return (
      <LiquidCard className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 w-32 bg-white/10 rounded" />
          <div className="h-20 bg-white/5 rounded-xl" />
          <div className="h-20 bg-white/5 rounded-xl" />
        </div>
      </LiquidCard>
    )
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid md:grid-cols-2 gap-4">
        <LiquidCard className="p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-white/50">Monthly Costs</span>
            <span className="text-2xl">💸</span>
          </div>
          <p className="text-3xl font-bold text-red-400">
            ${monthlyTotal.toFixed(0)}<span className="text-lg text-white/40">/mo</span>
          </p>
        </LiquidCard>
        
        <LiquidCard className="p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-white/50">Yearly Costs</span>
            <span className="text-2xl">📊</span>
          </div>
          <p className="text-3xl font-bold text-orange-400">
            ${yearlyTotal.toFixed(0)}<span className="text-lg text-white/40">/yr</span>
          </p>
        </LiquidCard>
      </div>

      {/* Quick Add from Suggestions */}
      <LiquidCard className="p-6">
        <h3 className="text-sm font-bold text-white/60 uppercase tracking-wider mb-4">Quick Add Common Costs</h3>
        <div className="flex flex-wrap gap-2">
          {SUGGESTED_COSTS.map((suggestion) => {
            const exists = costExists(suggestion.name)
            return (
              <button
                key={suggestion.name}
                onClick={() => !exists && handleAddCost(suggestion)}
                disabled={exists || saving}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                  exists
                    ? 'bg-[var(--primary)]/20 text-[var(--primary)] cursor-default'
                    : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white border border-white/10 hover:border-white/20'
                }`}
              >
                {exists ? (
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                ) : (
                  <span className="text-white/40">+</span>
                )}
                {suggestion.name}
                <span className="text-white/40">${suggestion.amount}/{suggestion.frequency === 'yearly' ? 'yr' : 'mo'}</span>
              </button>
            )
          })}
        </div>
      </LiquidCard>

      {/* Current Costs List */}
      <LiquidCard className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-white/60 uppercase tracking-wider">Your Costs ({costs.length})</h3>
          <button
            onClick={() => setShowAddForm(true)}
            className="px-3 py-1.5 rounded-lg bg-[var(--primary)]/20 text-[var(--primary)] text-sm font-medium hover:bg-[var(--primary)]/30 transition-all flex items-center gap-2"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 5v14M5 12h14"/>
            </svg>
            Add Custom
          </button>
        </div>

        {costs.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/5 flex items-center justify-center">
              <span className="text-3xl">💸</span>
            </div>
            <p className="text-white/40 mb-2">No costs tracked yet</p>
            <p className="text-sm text-white/30">Add costs from suggestions above or create custom ones</p>
          </div>
        ) : (
          <div className="space-y-2">
            {costs.map((cost) => {
              const category = COST_CATEGORIES.find(c => c.id === cost.category)
              return (
                <div
                  key={cost.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10 group hover:border-white/20 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{category?.icon || '📦'}</span>
                    <div>
                      <p className="font-medium text-white">{cost.name}</p>
                      <p className="text-xs text-white/40">{category?.label || 'Other'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="font-mono text-red-400 font-medium">${cost.amount}</p>
                      <p className="text-xs text-white/40">
                        {cost.frequency === 'monthly' ? '/month' : cost.frequency === 'yearly' ? '/year' : 'one-time'}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDeleteCost(cost.id)}
                      className="p-2 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-red-500/20 text-white/30 hover:text-red-400 transition-all"
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
                      </svg>
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </LiquidCard>

      {/* Add Custom Cost Modal */}
      {showAddForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowAddForm(false)} />
          <div className="relative w-full max-w-md bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 shadow-2xl">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
              <span className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center">
                <span className="text-xl">💸</span>
              </span>
              Add Cost
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-white/60 mb-2">Name *</label>
                <input
                  type="text"
                  value={newCost.name}
                  onChange={(e) => setNewCost({ ...newCost, name: e.target.value })}
                  placeholder="e.g. Cursor Pro, ChatGPT API..."
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-[var(--primary)]/50 transition-colors"
                  autoFocus
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-white/60 mb-2">Amount (USD) *</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30">$</span>
                    <input
                      type="number"
                      value={newCost.amount}
                      onChange={(e) => setNewCost({ ...newCost, amount: e.target.value })}
                      placeholder="0"
                      min="0"
                      step="0.01"
                      className="w-full pl-8 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-[var(--primary)]/50 transition-colors"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm text-white/60 mb-2">Frequency</label>
                  <select
                    value={newCost.frequency}
                    onChange={(e) => setNewCost({ ...newCost, frequency: e.target.value as 'monthly' | 'yearly' | 'one-time' })}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[var(--primary)]/50 transition-colors"
                  >
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                    <option value="one-time">One-time</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm text-white/60 mb-2">Category</label>
                <div className="flex flex-wrap gap-2">
                  {COST_CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setNewCost({ ...newCost, category: cat.id })}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                        newCost.category === cat.id
                          ? 'bg-[var(--primary)]/20 text-[var(--primary)] border border-[var(--primary)]/30'
                          : 'bg-white/5 text-white/60 border border-white/10 hover:bg-white/10'
                      }`}
                    >
                      <span>{cat.icon}</span>
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowAddForm(false)}
                className="flex-1 py-3 rounded-xl bg-white/10 text-white font-medium hover:bg-white/15 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={() => handleAddCost()}
                disabled={!newCost.name.trim() || !newCost.amount || saving}
                className="flex-1 py-3 rounded-xl bg-[var(--primary)] text-black font-bold hover:bg-[#00E847] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {saving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    Adding...
                  </>
                ) : (
                  'Add Cost'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
