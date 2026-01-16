# SQL - Workspace Tables

## À exécuter dans Supabase SQL Editor

```sql
-- ═══════════════════════════════════════════════════════════════════════
-- PROJECT TASKS (Checklist items)
-- ═══════════════════════════════════════════════════════════════════════

CREATE TABLE project_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  
  content TEXT NOT NULL,
  completed BOOLEAN DEFAULT false,
  category TEXT DEFAULT 'general', -- 'general', 'launch', 'aso', 'marketing', 'development'
  position INTEGER DEFAULT 0,
  
  created_at TIMESTAMPTZ DEFAULT now(),
  completed_at TIMESTAMPTZ
);

CREATE INDEX idx_project_tasks_project_id ON project_tasks(project_id);

-- RLS
ALTER TABLE project_tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own project tasks"
  ON project_tasks FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM projects 
      WHERE projects.id = project_tasks.project_id 
      AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Service role full access on project_tasks"
  ON project_tasks FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role');


-- ═══════════════════════════════════════════════════════════════════════
-- PROJECT MILESTONES (Timeline & Goals)
-- ═══════════════════════════════════════════════════════════════════════

CREATE TABLE project_milestones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  
  title TEXT NOT NULL,
  description TEXT,
  target_date DATE,
  completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_project_milestones_project_id ON project_milestones(project_id);

ALTER TABLE project_milestones ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own project milestones"
  ON project_milestones FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM projects 
      WHERE projects.id = project_milestones.project_id 
      AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Service role full access on project_milestones"
  ON project_milestones FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role');


-- ═══════════════════════════════════════════════════════════════════════
-- PROJECT COMPETITORS (Competitor Analysis)
-- ═══════════════════════════════════════════════════════════════════════

CREATE TABLE project_competitors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  
  name TEXT NOT NULL,
  app_store_url TEXT,
  website_url TEXT,
  estimated_revenue TEXT,
  strengths TEXT[],
  weaknesses TEXT[],
  notes TEXT,
  
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_project_competitors_project_id ON project_competitors(project_id);

ALTER TABLE project_competitors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own project competitors"
  ON project_competitors FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM projects 
      WHERE projects.id = project_competitors.project_id 
      AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Service role full access on project_competitors"
  ON project_competitors FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role');


-- ═══════════════════════════════════════════════════════════════════════
-- PROJECT NOTES (Advanced Notes with categories)
-- ═══════════════════════════════════════════════════════════════════════

CREATE TABLE project_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  
  title TEXT,
  content TEXT NOT NULL,
  category TEXT DEFAULT 'general', -- 'general', 'idea', 'research', 'technical', 'marketing'
  pinned BOOLEAN DEFAULT false,
  
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_project_notes_project_id ON project_notes(project_id);

ALTER TABLE project_notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own project notes"
  ON project_notes FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM projects 
      WHERE projects.id = project_notes.project_id 
      AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Service role full access on project_notes"
  ON project_notes FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role');

-- Trigger pour auto-update updated_at
CREATE TRIGGER update_project_notes_updated_at
  BEFORE UPDATE ON project_notes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();


-- ═══════════════════════════════════════════════════════════════════════
-- PROJECT RESOURCES (Links & Files)
-- ═══════════════════════════════════════════════════════════════════════

CREATE TABLE project_resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  
  title TEXT NOT NULL,
  url TEXT,
  type TEXT DEFAULT 'link', -- 'link', 'document', 'design', 'screenshot', 'video'
  description TEXT,
  
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_project_resources_project_id ON project_resources(project_id);

ALTER TABLE project_resources ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own project resources"
  ON project_resources FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM projects 
      WHERE projects.id = project_resources.project_id 
      AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Service role full access on project_resources"
  ON project_resources FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role');


-- ═══════════════════════════════════════════════════════════════════════
-- REVENUE HISTORY (Monthly tracking)
-- ═══════════════════════════════════════════════════════════════════════

CREATE TABLE project_revenue_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  
  month DATE NOT NULL, -- Premier jour du mois (ex: 2025-01-01)
  amount DECIMAL(10,2) NOT NULL DEFAULT 0,
  downloads INTEGER,
  notes TEXT,
  
  created_at TIMESTAMPTZ DEFAULT now(),
  
  UNIQUE(project_id, month)
);

CREATE INDEX idx_project_revenue_history_project_id ON project_revenue_history(project_id);

ALTER TABLE project_revenue_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own revenue history"
  ON project_revenue_history FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM projects 
      WHERE projects.id = project_revenue_history.project_id 
      AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Service role full access on project_revenue_history"
  ON project_revenue_history FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role');


-- ═══════════════════════════════════════════════════════════════════════
-- ADD NEW COLUMNS TO PROJECTS TABLE
-- ═══════════════════════════════════════════════════════════════════════

-- SWOT Analysis
ALTER TABLE projects ADD COLUMN IF NOT EXISTS swot_strengths TEXT[];
ALTER TABLE projects ADD COLUMN IF NOT EXISTS swot_weaknesses TEXT[];
ALTER TABLE projects ADD COLUMN IF NOT EXISTS swot_opportunities TEXT[];
ALTER TABLE projects ADD COLUMN IF NOT EXISTS swot_threats TEXT[];

-- Revenue Goals
ALTER TABLE projects ADD COLUMN IF NOT EXISTS revenue_goal DECIMAL(10,2);
ALTER TABLE projects ADD COLUMN IF NOT EXISTS revenue_goal_deadline DATE;

-- Market insights (user's own research)
ALTER TABLE projects ADD COLUMN IF NOT EXISTS market_notes TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS target_audience TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS unique_selling_point TEXT;

-- App metadata
ALTER TABLE projects ADD COLUMN IF NOT EXISTS app_name TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS app_tagline TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS keywords TEXT[];
```
