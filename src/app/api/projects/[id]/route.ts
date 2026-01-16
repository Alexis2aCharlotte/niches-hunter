import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// Récupérer le user_id depuis le token
async function getUserId(): Promise<string | null> {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get('access_token')?.value
  
  if (!accessToken) return null
  
  const { data: { user } } = await supabaseAdmin.auth.getUser(accessToken)
  return user?.id || null
}

// GET - Récupérer un projet par ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const userId = await getUserId()
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const { data: project, error } = await supabaseAdmin
      .from('projects')
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .single()

    if (error || !project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ project })

  } catch (error) {
    console.error('Get project error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT - Mettre à jour un projet
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const userId = await getUserId()
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { name, status, notes, app_store_url, monthly_revenue } = body

    // Vérifier que le projet appartient à l'utilisateur
    const { data: existingProject } = await supabaseAdmin
      .from('projects')
      .select('id')
      .eq('id', id)
      .eq('user_id', userId)
      .single()

    if (!existingProject) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      )
    }

    // Construire l'objet de mise à jour
    const updateData: Record<string, unknown> = {}
    if (name !== undefined) updateData.name = name
    if (status !== undefined) updateData.status = status
    if (notes !== undefined) updateData.notes = notes
    if (app_store_url !== undefined) updateData.app_store_url = app_store_url
    if (monthly_revenue !== undefined) updateData.monthly_revenue = monthly_revenue
    
    // SWOT Analysis
    if (body.swot_strengths !== undefined) updateData.swot_strengths = body.swot_strengths
    if (body.swot_weaknesses !== undefined) updateData.swot_weaknesses = body.swot_weaknesses
    if (body.swot_opportunities !== undefined) updateData.swot_opportunities = body.swot_opportunities
    if (body.swot_threats !== undefined) updateData.swot_threats = body.swot_threats
    
    // Revenue Goals
    if (body.revenue_goal !== undefined) updateData.revenue_goal = body.revenue_goal
    if (body.revenue_goal_deadline !== undefined) updateData.revenue_goal_deadline = body.revenue_goal_deadline
    
    // Market & Product Info
    if (body.market_notes !== undefined) updateData.market_notes = body.market_notes
    if (body.target_audience !== undefined) updateData.target_audience = body.target_audience
    if (body.unique_selling_point !== undefined) updateData.unique_selling_point = body.unique_selling_point
    if (body.app_name !== undefined) updateData.app_name = body.app_name
    if (body.app_tagline !== undefined) updateData.app_tagline = body.app_tagline
    if (body.keywords !== undefined) updateData.keywords = body.keywords

    const { data: project, error } = await supabaseAdmin
      .from('projects')
      .update(updateData)
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single()

    if (error) {
      console.error('Error updating project:', error)
      return NextResponse.json(
        { error: 'Failed to update project' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, project })

  } catch (error) {
    console.error('Update project error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE - Supprimer un projet
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const userId = await getUserId()
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Vérifier que le projet appartient à l'utilisateur
    const { data: existingProject } = await supabaseAdmin
      .from('projects')
      .select('id')
      .eq('id', id)
      .eq('user_id', userId)
      .single()

    if (!existingProject) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      )
    }

    const { error } = await supabaseAdmin
      .from('projects')
      .delete()
      .eq('id', id)
      .eq('user_id', userId)

    if (error) {
      console.error('Error deleting project:', error)
      return NextResponse.json(
        { error: 'Failed to delete project' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Delete project error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
