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

// GET - Liste des coûts d'un projet
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

    const { data: costs, error } = await supabaseAdmin
      .from('project_costs')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false })

    if (error) throw error

    return NextResponse.json({ costs: costs || [] })
  } catch (error) {
    console.error('Get costs error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST - Créer un coût
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
    const { name, amount, frequency, category } = body

    if (!name || amount === undefined) {
      return NextResponse.json({ error: 'Name and amount are required' }, { status: 400 })
    }

    const { data: cost, error } = await supabaseAdmin
      .from('project_costs')
      .insert({
        project_id: projectId,
        name,
        amount: parseFloat(amount),
        frequency: frequency || 'monthly',
        category: category || 'other',
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ success: true, cost })
  } catch (error) {
    console.error('Create cost error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT - Mettre à jour un coût
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
    const { costId, name, amount, frequency, category } = body

    if (!costId) {
      return NextResponse.json({ error: 'Cost ID is required' }, { status: 400 })
    }

    const updateData: Record<string, unknown> = {}
    if (name !== undefined) updateData.name = name
    if (amount !== undefined) updateData.amount = parseFloat(amount)
    if (frequency !== undefined) updateData.frequency = frequency
    if (category !== undefined) updateData.category = category

    const { data: cost, error } = await supabaseAdmin
      .from('project_costs')
      .update(updateData)
      .eq('id', costId)
      .eq('project_id', projectId)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ success: true, cost })
  } catch (error) {
    console.error('Update cost error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE - Supprimer un coût
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
    const costId = searchParams.get('costId')

    if (!costId) {
      return NextResponse.json({ error: 'Cost ID is required' }, { status: 400 })
    }

    const { error } = await supabaseAdmin
      .from('project_costs')
      .delete()
      .eq('id', costId)
      .eq('project_id', projectId)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete cost error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
