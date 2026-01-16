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

// GET - Historique des revenus
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

    const { data: history, error } = await supabaseAdmin
      .from('project_revenue_history')
      .select('*')
      .eq('project_id', projectId)
      .order('month', { ascending: false })

    if (error) throw error

    return NextResponse.json({ history })
  } catch (error) {
    console.error('Get revenue history error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST - Ajouter/Mettre à jour un mois de revenu (upsert)
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
    const { month, amount, downloads, notes } = body

    if (!month || amount === undefined) {
      return NextResponse.json({ error: 'Month and amount are required' }, { status: 400 })
    }

    // Upsert - insert or update if exists
    const { data: entry, error } = await supabaseAdmin
      .from('project_revenue_history')
      .upsert({
        project_id: projectId,
        month,
        amount,
        downloads,
        notes,
      }, {
        onConflict: 'project_id,month'
      })
      .select()
      .single()

    if (error) throw error

    // Mettre à jour le monthly_revenue du projet avec le dernier mois
    const { data: latestRevenue } = await supabaseAdmin
      .from('project_revenue_history')
      .select('amount')
      .eq('project_id', projectId)
      .order('month', { ascending: false })
      .limit(1)
      .single()

    if (latestRevenue) {
      await supabaseAdmin
        .from('projects')
        .update({ monthly_revenue: latestRevenue.amount })
        .eq('id', projectId)
    }

    return NextResponse.json({ success: true, entry })
  } catch (error) {
    console.error('Create/update revenue error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE - Supprimer une entrée de revenu
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
    const entryId = searchParams.get('entryId')

    if (!entryId) {
      return NextResponse.json({ error: 'Entry ID is required' }, { status: 400 })
    }

    const { error } = await supabaseAdmin
      .from('project_revenue_history')
      .delete()
      .eq('id', entryId)
      .eq('project_id', projectId)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete revenue entry error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
