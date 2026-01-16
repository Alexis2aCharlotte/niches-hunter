import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

async function getUserId(): Promise<string | null> {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get('access_token')?.value
  if (!accessToken) return null
  const { data: { user } } = await supabaseAdmin.auth.getUser(accessToken)
  return user?.id || null
}

async function verifyProjectOwnership(projectId: string, userId: string): Promise<boolean> {
  const { data } = await supabaseAdmin
    .from('projects')
    .select('id')
    .eq('id', projectId)
    .eq('user_id', userId)
    .single()
  return !!data
}

// GET - Liste des tâches d'un projet
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: projectId } = await params
    const userId = await getUserId()
    
    if (!userId) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    if (!await verifyProjectOwnership(projectId, userId)) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    const { data: tasks, error } = await supabaseAdmin
      .from('project_tasks')
      .select('*')
      .eq('project_id', projectId)
      .order('position', { ascending: true })
      .order('created_at', { ascending: true })

    if (error) throw error

    // Map 'completed' from DB to 'is_completed' for frontend
    const mappedTasks = tasks?.map(task => ({
      ...task,
      is_completed: task.completed,
    })) || []

    return NextResponse.json({ tasks: mappedTasks })
  } catch (error) {
    console.error('Get tasks error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST - Créer une tâche
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: projectId } = await params
    const userId = await getUserId()
    
    if (!userId) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    if (!await verifyProjectOwnership(projectId, userId)) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    const body = await request.json()
    const { content, category, position } = body

    if (!content) {
      return NextResponse.json({ error: 'Content is required' }, { status: 400 })
    }

    const { data: task, error } = await supabaseAdmin
      .from('project_tasks')
      .insert({
        project_id: projectId,
        content,
        category: category || 'general',
        position: position || 0,
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ success: true, task })
  } catch (error) {
    console.error('Create task error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT - Mettre à jour une tâche (toggle complete, update content)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: projectId } = await params
    const userId = await getUserId()
    
    if (!userId) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    if (!await verifyProjectOwnership(projectId, userId)) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    const body = await request.json()
    const { taskId, content, is_completed, category, position } = body

    if (!taskId) {
      return NextResponse.json({ error: 'Task ID is required' }, { status: 400 })
    }

    const updateData: Record<string, unknown> = {}
    if (content !== undefined) updateData.content = content
    // Map is_completed from frontend to completed in database
    if (is_completed !== undefined) {
      updateData.completed = is_completed
      updateData.completed_at = is_completed ? new Date().toISOString() : null
    }
    if (category !== undefined) updateData.category = category
    if (position !== undefined) updateData.position = position

    const { data: task, error } = await supabaseAdmin
      .from('project_tasks')
      .update(updateData)
      .eq('id', taskId)
      .eq('project_id', projectId)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ success: true, task })
  } catch (error) {
    console.error('Update task error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE - Supprimer une tâche
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: projectId } = await params
    const userId = await getUserId()
    
    if (!userId) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    if (!await verifyProjectOwnership(projectId, userId)) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    const { searchParams } = new URL(request.url)
    const taskId = searchParams.get('taskId')

    if (!taskId) {
      return NextResponse.json({ error: 'Task ID is required' }, { status: 400 })
    }

    const { error } = await supabaseAdmin
      .from('project_tasks')
      .delete()
      .eq('id', taskId)
      .eq('project_id', projectId)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete task error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
