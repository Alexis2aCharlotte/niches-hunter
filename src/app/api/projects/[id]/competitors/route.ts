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

// GET - Liste des competitors
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

    const { data: competitors, error } = await supabaseAdmin
      .from('project_competitors')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false })

    if (error) throw error

    return NextResponse.json({ competitors })
  } catch (error) {
    console.error('Get competitors error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST - Créer un competitor
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
    const { name, app_store_url, website_url, estimated_revenue, strengths, weaknesses, notes } = body

    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 })
    }

    // Convert strengths/weaknesses to arrays if they're strings
    const parseToArray = (value: unknown): string[] => {
      if (!value) return []
      if (Array.isArray(value)) return value
      if (typeof value === 'string') return value.split('\n').filter(s => s.trim())
      return []
    }

    const { data: competitor, error } = await supabaseAdmin
      .from('project_competitors')
      .insert({
        project_id: projectId,
        name,
        app_store_url,
        website_url,
        estimated_revenue,
        strengths: parseToArray(strengths),
        weaknesses: parseToArray(weaknesses),
        notes,
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ success: true, competitor })
  } catch (error) {
    console.error('Create competitor error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT - Mettre à jour un competitor
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
    const { competitorId, name, app_store_url, website_url, estimated_revenue, strengths, weaknesses, notes } = body

    if (!competitorId) {
      return NextResponse.json({ error: 'Competitor ID is required' }, { status: 400 })
    }

    const updateData: Record<string, unknown> = {}
    if (name !== undefined) updateData.name = name
    if (app_store_url !== undefined) updateData.app_store_url = app_store_url
    if (website_url !== undefined) updateData.website_url = website_url
    if (estimated_revenue !== undefined) updateData.estimated_revenue = estimated_revenue
    if (strengths !== undefined) updateData.strengths = strengths
    if (weaknesses !== undefined) updateData.weaknesses = weaknesses
    if (notes !== undefined) updateData.notes = notes

    const { data: competitor, error } = await supabaseAdmin
      .from('project_competitors')
      .update(updateData)
      .eq('id', competitorId)
      .eq('project_id', projectId)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ success: true, competitor })
  } catch (error) {
    console.error('Update competitor error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE - Supprimer un competitor
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
    const competitorId = searchParams.get('competitorId')

    if (!competitorId) {
      return NextResponse.json({ error: 'Competitor ID is required' }, { status: 400 })
    }

    const { error } = await supabaseAdmin
      .from('project_competitors')
      .delete()
      .eq('id', competitorId)
      .eq('project_id', projectId)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete competitor error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
