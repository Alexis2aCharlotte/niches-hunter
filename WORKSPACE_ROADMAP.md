# Workspace Roadmap

## Vue d'ensemble

Création d'un espace de travail dédié (`/workspace`) pour les utilisateurs payants, séparé de la page compte (`/account`).

### Architecture

| Route | Contenu |
|-------|---------|
| `/account` | Gestion compte : subscription, billing, logout |
| `/workspace` | Espace de travail : projets, validations, niches, revenue |
| `/workspace/validation/[id]` | Détail d'une validation sauvegardée |
| `/workspace/project/[id]` | Détail d'un projet |

---

## Phase 1 : Base de données ✓

### Tables à créer

- [x] `niche_validations` - Historique des analyses du Niche Validator
- [x] `projects` - Projets utilisateurs avec statuts

### Requêtes SQL

Voir section [SQL Supabase](#sql-supabase) en bas du document.

---

## Phase 2 : Niche Validator - Sauvegarde ✓

- [x] Créer `/api/validations/save` (POST) - sauvegarde une validation
- [x] Remplacer bouton "Explore Similar Niches" par "Save This Niche"
- [x] Après save → afficher message de confirmation "Saved to Workspace"

### Fichiers modifiés
- `src/app/niche-validator/page.tsx`

### Fichiers créés
- `src/app/api/validations/save/route.ts`

---

## Phase 3 : Workspace - Structure ✓

- [x] Créer page `/workspace` (dashboard principal)
- [x] 4 sections/tabs : Projects | Validations | Saved Niches | Revenue
- [x] Navigation entre sections
- [x] Protection : accès réservé aux users payants
- [x] Bouton Workspace dans `/account`

### Fichiers créés
- `src/app/workspace/page.tsx`

### Fichiers modifiés
- `src/app/account/page.tsx` (simplifié + bouton workspace)

---

## Phase 4 : Workspace - Validations ✓

- [x] Créer `/api/validations` (GET) - liste des validations de l'user
- [x] Afficher liste dans le workspace
- [x] Bouton "Start Project" sur chaque validation
- [ ] Créer page détail `/workspace/validation/[id]` (optionnel)

### Fichiers créés
- `src/app/api/validations/route.ts`

---

## Phase 5 : Workspace - Saved Niches ✓

- [x] Déplacer saved niches de `/account` vers `/workspace`
- [x] Afficher liste dans le workspace
- [x] Bouton "Start Project" sur chaque niche sauvegardée

### Fichiers modifiés
- `src/app/account/page.tsx` (retirée section saved niches)

---

## Phase 6 : Workspace - Projects ✓

- [x] Créer `/api/projects` (GET, POST)
- [x] Créer `/api/projects/[id]` (GET, PUT, DELETE)
- [x] CRUD projets dans le workspace (création via modal)
- [x] Créer page détail `/workspace/project/[id]`
- [x] Lier projet à validation OU saved niche
- [x] Statuts : Idea → Researching → Building → Launched
- [x] Notes personnelles par projet

### Fichiers créés
- `src/app/api/projects/route.ts`
- `src/app/api/projects/[id]/route.ts`
- `src/app/workspace/project/[id]/page.tsx`

### Fichiers modifiés
- `src/app/workspace/page.tsx` (modal création + boutons Start Project)

---

## Phase 7 : Workspace - Revenue ✓

- [x] Input revenue sur projets (déjà présent dans `/workspace/project/[id]`)
- [x] API revenue intégrée dans `/api/projects/[id]` (PUT)
- [x] Section Revenue améliorée :
  - Total mensuel en évidence
  - Stats (nombre d'apps lancées, moyenne par app)
  - Graphique en barres horizontales par projet
  - Barres de progression colorées
- [x] Calcul total revenue

### Future
- Intégration App Store Connect API

---

## Phase 8 : Cleanup & Polish

- [x] ~~Simplifier `/account`~~ (annulé - garder tel quel)
- [x] ~~Ajouter lien "Workspace" dans Navbar~~ (annulé)
- [x] ~~Rediriger après login vers `/workspace`~~ (annulé)
- [ ] Tests sur mobile
- [ ] Animations/transitions

---

## Ordre d'exécution

| Priorité | Phase | Estimation |
|----------|-------|------------|
| 1 | Phase 1 - Database | 10 min |
| 2 | Phase 2 - Validator Save | 30 min |
| 3 | Phase 3 - Workspace Base | 45 min |
| 4 | Phase 4 - Validations | 30 min |
| 5 | Phase 5 - Saved Niches | 20 min |
| 6 | Phase 6 - Projects | 1h |
| 7 | Phase 7 - Revenue | 30 min |
| 8 | Phase 8 - Polish | 30 min |

**Total estimé : ~4-5h**

---

## SQL Supabase

### Table `niche_validations`

```sql
-- Table pour stocker l'historique des validations du Niche Validator
CREATE TABLE niche_validations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Input utilisateur
  query TEXT NOT NULL,
  
  -- Résultats de l'analyse AI
  score INTEGER,
  score_label TEXT,
  market_size TEXT,
  competition TEXT,
  difficulty TEXT,
  time_to_mvp TEXT,
  strengths TEXT[],
  weaknesses TEXT[],
  recommendations TEXT[],
  market_insights TEXT,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Index pour accélérer les requêtes par user
CREATE INDEX idx_niche_validations_user_id ON niche_validations(user_id);

-- RLS : chaque user ne voit que ses propres validations
ALTER TABLE niche_validations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own validations"
  ON niche_validations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own validations"
  ON niche_validations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own validations"
  ON niche_validations FOR DELETE
  USING (auth.uid() = user_id);

-- Service role full access (pour les API routes)
CREATE POLICY "Service role full access"
  ON niche_validations FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role');
```

### Table `projects`

```sql
-- Table pour les projets utilisateurs
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Infos projet
  name TEXT NOT NULL,
  status TEXT DEFAULT 'idea' CHECK (status IN ('idea', 'researching', 'building', 'launched')),
  notes TEXT,
  
  -- Liens optionnels (un projet peut venir d'une validation OU d'une niche sauvegardée)
  validation_id UUID REFERENCES niche_validations(id) ON DELETE SET NULL,
  saved_niche_id TEXT, -- ID de la niche (format string comme dans saved_niches)
  
  -- Revenue tracking
  app_store_url TEXT,
  monthly_revenue DECIMAL(10,2) DEFAULT 0,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Index
CREATE INDEX idx_projects_user_id ON projects(user_id);
CREATE INDEX idx_projects_status ON projects(status);

-- RLS
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own projects"
  ON projects FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own projects"
  ON projects FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own projects"
  ON projects FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own projects"
  ON projects FOR DELETE
  USING (auth.uid() = user_id);

-- Service role full access
CREATE POLICY "Service role full access"
  ON projects FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role');

-- Trigger pour auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

### Vérifier la table `saved_niches`

```sql
-- Vérifier si user_id existe déjà
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'saved_niches';

-- Si user_id n'existe pas, l'ajouter :
-- ALTER TABLE saved_niches ADD COLUMN user_id UUID REFERENCES auth.users(id);
```

---

## Notes

### Authentification dans les API routes

Pour récupérer le `user_id` dans les API routes :

```typescript
import { cookies } from 'next/headers'
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function getUserId(): Promise<string | null> {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get('access_token')?.value
  
  if (!accessToken) return null
  
  const { data: { user } } = await supabaseAdmin.auth.getUser(accessToken)
  return user?.id || null
}
```

### Protection des pages workspace

```typescript
// Dans workspace/page.tsx
useEffect(() => {
  async function checkAccess() {
    const res = await fetch('/api/stripe/check-subscription')
    const { hasActiveSubscription } = await res.json()
    
    if (!hasActiveSubscription) {
      router.push('/pricing')
    }
  }
  checkAccess()
}, [])
```
