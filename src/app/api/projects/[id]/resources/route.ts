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

// GET - Liste des resources
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

    const { data: resources, error } = await supabaseAdmin
      .from('project_resources')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false })

    if (error) throw error

    return NextResponse.json({ resources })
  } catch (error) {
    console.error('Get resources error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST - Créer une resource
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
    const { title, url, type, description } = body

    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 })
    }

    const { data: resource, error } = await supabaseAdmin
      .from('project_resources')
      .insert({
        project_id: projectId,
        title,
        url,
        type: type || 'link',
        description,
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ success: true, resource })
  } catch (error) {
    console.error('Create resource error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT - Mettre à jour une resource
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
    const { resourceId, title, url, type, description } = body

    if (!resourceId) {
      return NextResponse.json({ error: 'Resource ID is required' }, { status: 400 })
    }

    const updateData: Record<string, unknown> = {}
    if (title !== undefined) updateData.title = title
    if (url !== undefined) updateData.url = url
    if (type !== undefined) updateData.type = type
    if (description !== undefined) updateData.description = description

    const { data: resource, error } = await supabaseAdmin
      .from('project_resources')
      .update(updateData)
      .eq('id', resourceId)
      .eq('project_id', projectId)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ success: true, resource })
  } catch (error) {
    console.error('Update resource error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE - Supprimer une resource
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
    const resourceId = searchParams.get('resourceId')

    if (!resourceId) {
      return NextResponse.json({ error: 'Resource ID is required' }, { status: 400 })
    }

    const { error } = await supabaseAdmin
      .from('project_resources')
      .delete()
      .eq('id', resourceId)
      .eq('project_id', projectId)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete resource error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
