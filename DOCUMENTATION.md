# 🍎 NicheHunter - Documentation Technique Complète

> Système automatisé de scraping et d'analyse des classements App Store pour identifier les opportunités de niches iOS.

---

## 📋 Table des matières

1. [Vue d'ensemble](#-vue-densemble)
2. [Architecture technique](#-architecture-technique)
3. [Base de données Supabase](#-base-de-données-supabase)
4. [Système de blacklist](#-système-de-blacklist)
5. [Triggers et automatisations](#-triggers-et-automatisations)
6. [Système de scoring](#-système-de-scoring)
7. [Scraper Node.js](#-scraper-nodejs)
8. [Déploiement Railway](#-déploiement-railway)
9. [Workflow quotidien](#-workflow-quotidien)
10. [Requêtes SQL utiles](#-requêtes-sql-utiles)
11. [Maintenance](#-maintenance)
12. [Troubleshooting](#-troubleshooting)

---

## 🎯 Vue d'ensemble

### Objectif

NicheHunter automatise la collecte et l'analyse des classements App Store pour :
- Identifier les apps performantes développées par des **indépendants**
- Exclure les grosses entreprises (GAFAM, banques, retail, etc.)
- Scorer les opportunités selon plusieurs critères
- Générer une liste quotidienne d'opportunités

### Sources de données

| Source | Pays | Limite | Volume estimé |
|--------|------|--------|---------------|
| Top Free Global | US, FR, GB, DE, IT | 200 apps | 1 000/jour |
| Top Paid Global | US, FR, GB, DE, IT | 200 apps | 1 000/jour |
| Top par Catégorie | US, FR, GB, DE, IT | 100 apps × 24 catégories | 12 000/jour |

**Volume total** : ~14 000 entrées/jour (avec doublons cross-pays)

### Catégories scrapées (24)

```
Business, Weather, Utilities, Travel, Sports, Social Networking,
Reference, Productivity, Photo & Video, News, Navigation, Music,
Lifestyle, Health & Fitness, Games, Finance, Entertainment, Education,
Books, Medical, Catalogs, Magazines & Newspapers, Food & Drink, Shopping
```

---

## 🏗 Architecture technique

```
┌─────────────────────────────────────────────────────────────────────┐
│                         RAILWAY (Cron 3h UTC)                       │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                    scraper.ts (Node.js)                      │   │
│  │                                                              │   │
│  │  1. Fetch Apple RSS APIs (~14k apps)                        │   │
│  │  2. Transform & normalize data                               │   │
│  │  3. Insert into Supabase (batches de 500)                   │   │
│  │  4. Call analyze_opportunities()                             │   │
│  │  5. Call cleanup_old_data()                                  │   │
│  └─────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────┐
│                           SUPABASE                                  │
│                                                                     │
│  ┌──────────────────┐    Trigger     ┌──────────────────────────┐  │
│  │ app_rankings_v2  │ ──────────────▶│ app_rankings_clean_v2    │  │
│  │ (données brutes) │                │ (sans blacklistés)       │  │
│  │ ~14k lignes/jour │                │ ~8k lignes/jour          │  │
│  └──────────────────┘                └──────────────────────────┘  │
│           │                                      │                  │
│           │         ┌────────────────────────────┘                  │
│           │         │                                               │
│           │         ▼                                               │
│           │  ┌──────────────────────────────────┐                   │
│           │  │ blacklisted_developers_v2        │                   │
│           │  │ (~1 555 développeurs exclus)     │                   │
│           │  └──────────────────────────────────┘                   │
│           │                                                         │
│           │    analyze_opportunities()                              │
│           └─────────────────────────┐                               │
│                                     ▼                               │
│                          ┌──────────────────────────┐               │
│                          │ opportunities_v2         │               │
│                          │ (apps scorées, 1/app)    │               │
│                          │ ~4k apps uniques         │               │
│                          └──────────────────────────┘               │
│                                                                     │
│  ┌──────────────────┐                                               │
│  │ category_scores  │  (bonus par catégorie)                        │
│  └──────────────────┘                                               │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 💾 Base de données Supabase

### Table `app_rankings_v2` (vaisseau mère)

Données brutes quotidiennes - **NE PAS MODIFIER MANUELLEMENT**

```sql
CREATE TABLE app_rankings_v2 (
  id SERIAL PRIMARY KEY,
  run_date DATE NOT NULL,              -- Date du scraping
  country TEXT NOT NULL,               -- US, FR, GB, DE, IT
  source_type TEXT NOT NULL,           -- top_free_global, top_paid_global, category_free, category_paid
  rank INT NOT NULL,                   -- Position dans le classement (1-200)
  category_id INT,                     -- ID catégorie Apple (null si global)
  category_name TEXT,                  -- Nom catégorie (null si global)
  app_id TEXT,                         -- ID unique Apple
  name TEXT,                           -- Nom de l'app
  developer TEXT,                      -- Nom du développeur
  category TEXT,                       -- Catégorie de l'app
  release_date TIMESTAMPTZ,            -- Date de sortie
  url TEXT,                            -- Lien App Store
  image TEXT,                          -- URL de l'icône
  created_at TIMESTAMPTZ DEFAULT now()
);
```

### Table `app_rankings_clean_v2` (filtrée)

Même structure que `app_rankings_v2`, mais **sans les développeurs blacklistés**.

Synchronisée automatiquement via triggers.

### Table `blacklisted_developers_v2`

Liste des développeurs à exclure (grosses entreprises).

```sql
CREATE TABLE blacklisted_developers_v2 (
  id SERIAL PRIMARY KEY,
  developer TEXT UNIQUE NOT NULL,      -- Nom exact du développeur
  category TEXT,                       -- Type: big_tech, retail, fintech, etc.
  created_at TIMESTAMPTZ DEFAULT now()
);
```

**Catégories de blacklist** :
- `big_tech` : Google, Meta, Apple, Microsoft, Amazon, etc.
- `retail` : Zara, H&M, IKEA, Temu, Shein, etc.
- `fintech` : PayPal, Revolut, banques traditionnelles, etc.
- `gaming` : Supercell, King, EA, Nintendo, etc.
- `media` : Netflix, Disney+, CNN, BBC, etc.
- `telecom` : Orange, Vodafone, AT&T, etc.
- `transport` : Uber, Lyft, SNCF, Lufthansa, etc.
- `food` : McDonald's, Starbucks, Deliveroo, etc.
- `government` : Services publics, impots.gouv, NHS, etc.
- `hardware` : Samsung, Philips, Bose, etc.

### Table `opportunities_v2` (apps scorées)

Une ligne par app unique, avec scores calculés.

```sql
CREATE TABLE opportunities_v2 (
  id SERIAL PRIMARY KEY,
  
  -- Identifiant
  app_id TEXT NOT NULL,
  
  -- Infos app
  name TEXT NOT NULL,
  developer TEXT,
  category_name TEXT,
  url TEXT,
  image TEXT,
  release_date DATE,
  
  -- Métriques
  best_rank INT,                       -- Meilleur classement observé
  avg_rank NUMERIC(5,1),               -- Rang moyen
  days_in_top INT,                     -- Nb jours dans les tops (sur 30j)
  country_count INT,                   -- Nb pays où l'app apparaît
  countries TEXT[],                    -- Liste des pays
  
  -- Flags
  is_paid BOOLEAN DEFAULT FALSE,       -- Présent dans Top Paid ?
  is_new BOOLEAN DEFAULT FALSE,        -- Release < 6 mois ?
  
  -- Scores (0-100)
  rank_score NUMERIC(5,1),
  country_score NUMERIC(5,1),
  category_bonus NUMERIC(5,1),
  paid_bonus NUMERIC(5,1),
  fresh_bonus NUMERIC(5,1),
  
  -- Score final
  total_score NUMERIC(5,1),
  
  -- Tracking
  first_seen DATE,
  last_seen DATE,
  analysis_date DATE NOT NULL DEFAULT CURRENT_DATE,
  
  UNIQUE(app_id, analysis_date)
);
```

### Table `category_scores`

Bonus par catégorie pour le scoring.

```sql
CREATE TABLE category_scores (
  id SERIAL PRIMARY KEY,
  category_name TEXT UNIQUE NOT NULL,
  bonus INT DEFAULT 10,                -- Bonus ajouté au score (0-30)
  tier TEXT DEFAULT 'mid'              -- top, mid, low
);
```

**Valeurs** :

| Tier | Catégories | Bonus |
|------|------------|-------|
| TOP | Utilities, Productivity, Health & Fitness, Lifestyle, Photo & Video, Education | 20-30 |
| MID | Weather, Reference, Food & Drink, Travel, Sports, Music, Books, Medical, Entertainment, Navigation, Business | 10-15 |
| LOW | Finance, Games, Social Networking, News, Shopping | 0-5 |

---

## 🚫 Système de blacklist

### Pourquoi blacklister ?

L'objectif de NicheHunter est d'identifier des **opportunités réplicables** pour des développeurs indépendants. Les apps de grandes entreprises ne sont pas réplicables car :
- Ressources financières illimitées
- Équipes de centaines de développeurs
- Effets de réseau (ex: Facebook)
- Réglementations spécifiques (ex: banques)
- Marques établies (ex: Zara)

### Critères de blacklist

| Type | Exemples | Nb développeurs |
|------|----------|-----------------|
| Big Tech | Google, Meta, Apple, Microsoft, Amazon | ~50 |
| E-commerce | Temu, Shein, Zara, H&M, IKEA, Zalando | ~100 |
| Fintech/Banques | PayPal, Revolut, N26, toutes les banques | ~300 |
| Gaming majeur | Supercell, King, EA, Nintendo, Roblox | ~50 |
| Média/Streaming | Netflix, Disney+, HBO, BBC, CNN | ~150 |
| Transport | Uber, Lyft, SNCF, airlines | ~100 |
| Télécoms | Orange, Vodafone, AT&T, Deutsche Telekom | ~50 |
| Food chains | McDonald's, Starbucks, Deliveroo, Just Eat | ~80 |
| Gouvernement | Services publics, impôts, santé publique | ~100 |
| Hardware | Samsung, Philips, Bose, Garmin, Canon | ~50 |

**Total** : ~1 555 développeurs blacklistés

### Ajouter à la blacklist

```sql
INSERT INTO blacklisted_developers_v2 (developer, category) VALUES
('Nouveau Developer Inc.', 'retail')
ON CONFLICT (developer) DO NOTHING;
```

### Retirer de la blacklist

```sql
DELETE FROM blacklisted_developers_v2 
WHERE developer = 'Faux Positif Inc.';
```

---

## ⚡ Triggers et automatisations

### Trigger 1 : Sync app_rankings_v2 → clean_v2

```sql
-- Fonction de synchronisation
CREATE OR REPLACE FUNCTION sync_clean_v2()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    IF NOT EXISTS (SELECT 1 FROM blacklisted_developers_v2 WHERE developer = NEW.developer) THEN
      INSERT INTO app_rankings_clean_v2 VALUES (NEW.*);
    END IF;
    RETURN NEW;

  ELSIF TG_OP = 'UPDATE' THEN
    DELETE FROM app_rankings_clean_v2 WHERE id = OLD.id;
    IF NOT EXISTS (SELECT 1 FROM blacklisted_developers_v2 WHERE developer = NEW.developer) THEN
      INSERT INTO app_rankings_clean_v2 VALUES (NEW.*);
    END IF;
    RETURN NEW;

  ELSIF TG_OP = 'DELETE' THEN
    DELETE FROM app_rankings_clean_v2 WHERE id = OLD.id;
    RETURN OLD;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Trigger
CREATE TRIGGER trg_sync_clean_v2
  AFTER INSERT OR UPDATE OR DELETE ON app_rankings_v2
  FOR EACH ROW
  EXECUTE FUNCTION sync_clean_v2();
```

### Trigger 2 : Sync blacklist → clean_v2

```sql
-- Quand un dev est ajouté/retiré de la blacklist
CREATE OR REPLACE FUNCTION sync_blacklist_change()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    -- Retirer les apps du dev blacklisté
    DELETE FROM app_rankings_clean_v2 WHERE developer = NEW.developer;
    RETURN NEW;

  ELSIF TG_OP = 'DELETE' THEN
    -- Ajouter les apps du dev dé-blacklisté
    INSERT INTO app_rankings_clean_v2
    SELECT * FROM app_rankings_v2 WHERE developer = OLD.developer;
    RETURN OLD;
  END IF;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_sync_blacklist
  AFTER INSERT OR DELETE ON blacklisted_developers_v2
  FOR EACH ROW
  EXECUTE FUNCTION sync_blacklist_change();
```

### Fonction : analyze_opportunities()

Appelée par le scraper après l'insert. Calcule les scores et met à jour `opportunities_v2`.

```sql
CREATE OR REPLACE FUNCTION analyze_opportunities()
RETURNS void AS $$
-- Agrège les données de app_rankings_clean_v2
-- Calcule les scores
-- Insert/Update dans opportunities_v2
-- Voir SQL complet dans la section Scoring
$$ LANGUAGE plpgsql;
```

### Fonction : cleanup_old_data()

Supprime les données de plus de 30 jours.

```sql
CREATE OR REPLACE FUNCTION cleanup_old_data()
RETURNS void AS $$
BEGIN
  DELETE FROM app_rankings_v2 
  WHERE run_date < CURRENT_DATE - INTERVAL '30 days';
  
  DELETE FROM app_rankings_clean_v2 
  WHERE run_date < CURRENT_DATE - INTERVAL '30 days';
END;
$$ LANGUAGE plpgsql;
```

---

## 📊 Système de scoring

### Composants du score

| Score | Poids | Formule | Max | Description |
|-------|-------|---------|-----|-------------|
| **Rank Score** | 35% | `100 - best_rank` | 100 | Meilleur classement (rank 1 = 99 pts) |
| **Country Score** | 25% | `nb_pays × 20` | 100 | Présence multi-pays (5 pays = 100) |
| **Category Bonus** | 20% | Table `category_scores` | 30 | Bonus selon catégorie |
| **Paid Bonus** | 10% | `30 si Top Paid` | 30 | Présence dans classement payant |
| **Fresh Bonus** | 10% | Selon release_date | 40 | App récente |

### Fresh Bonus détaillé

| Âge de l'app | Bonus |
|--------------|-------|
| < 6 mois | 40 |
| < 1 an | 25 |
| < 2 ans | 10 |
| > 2 ans | 0 |

### Formule finale

```
TOTAL_SCORE = (rank_score × 0.35) 
            + (country_score × 0.25) 
            + (category_bonus × 0.20) 
            + (paid_bonus × 0.10) 
            + (fresh_bonus × 0.10)
```

### Interprétation des scores

| Score | Qualité | Action |
|-------|---------|--------|
| 70+ | 🏆 Excellent | À analyser en priorité |
| 50-70 | ✅ Bon | Potentiel intéressant |
| 30-50 | ⚠️ Moyen | À creuser selon la niche |
| < 30 | ❌ Faible | Peu d'intérêt |

---

## 🔧 Scraper Node.js

### Structure du projet

```
niche-hunter-scraper/
├── src/
│   └── scraper.ts          # Code principal
├── package.json
├── tsconfig.json
├── .env                    # Variables d'environnement (NON COMMITÉ)
├── .gitignore
└── DOCUMENTATION.md
```

### Variables d'environnement (.env)

```env
SUPABASE_URL=https://paafqpdcjbjzyvcfzmzh.supabase.co
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
DRY_RUN=false
```

### Commandes

```bash
# Installation
npm install

# Lancer le scraping (ATTENTION: insert les données!)
npm run scrape

# Mode dry run (pas d'insert)
DRY_RUN=true npm run scrape

# Build TypeScript
npm run build
```

### Flux d'exécution

```
main()
  │
  ├─▶ scrapeAll()
  │     ├─▶ fetchTopGlobal() × 5 pays × 2 types (free/paid)
  │     └─▶ fetchTopCategory() × 5 pays × 24 catégories
  │
  ├─▶ insertToSupabase()
  │     └─▶ Batches de 500 apps
  │
  ├─▶ runAnalysis()
  │     └─▶ Appelle analyze_opportunities() via RPC
  │
  └─▶ cleanupOldData()
        └─▶ Appelle cleanup_old_data() via RPC
```

### Logs

Le scraper affiche des logs détaillés :

```
🍎 NICHE HUNTER - APPLE APP STORE SCRAPER

ℹ️  Date du run: 2025-12-10
ℹ️  Pays ciblés: US, FR, GB, DE, IT
ℹ️  Catégories: 24

→ TOP FREE GLOBAL (5 pays × 200 apps)
✅ US - 200 apps récupérées
✅ FR - 200 apps récupérées
...

→ INSERT SUPABASE (28 batches de 500 max)
[████████████████████░] 95% - Batch 27/28

📊 ANALYSE DES OPPORTUNITÉS
✅ Analyse des opportunités terminée !

🧹 NETTOYAGE
✅ Nettoyage terminé !

✨ TERMINÉ
   Durée totale: 45.32s
   Apps traitées: 13,847
```

---

## 🚂 Déploiement Railway

### Configuration

| Paramètre | Valeur |
|-----------|--------|
| **Cron Schedule** | `0 3 * * *` (3h UTC = 4h Paris) |
| **Region** | EU West (Amsterdam) |
| **Build Command** | `npm install && npm run build` |
| **Start Command** | `npm run scrape` |

### Variables d'environnement Railway

```
SUPABASE_URL=https://paafqpdcjbjzyvcfzmzh.supabase.co
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Déploiement

Le déploiement est **automatique** à chaque push sur `main` :

```bash
git add .
git commit -m "Message"
git push
```

Railway va :
1. Détecter le push
2. Builder le projet (npm install + tsc)
3. **Attendre** le prochain cron (3h UTC)
4. Exécuter le scraper

⚠️ **Un push ne lance PAS le scraper immédiatement !**

### Monitoring

- **Dashboard** : https://railway.app/dashboard
- **Logs** : Onglet "Deployments" → Cliquer sur une exécution
- **Métriques** : Onglet "Metrics"

---

## 🔄 Workflow quotidien

### Timeline (heure Paris)

| Heure | Action |
|-------|--------|
| 04:00 | 🚀 Cron Railway démarre |
| 04:00-04:15 | 📥 Scraping App Store (~14k apps) |
| 04:15-04:20 | 💾 Insert Supabase (28 batches) |
| 04:20 | 📊 Analyse des opportunités |
| 04:21 | 🧹 Nettoyage > 30 jours |
| 04:22 | ✅ Fin |

### Données générées

| Table | Volume quotidien | Rétention |
|-------|------------------|-----------|
| `app_rankings_v2` | +14k lignes | 30 jours |
| `app_rankings_clean_v2` | +8k lignes | 30 jours |
| `opportunities_v2` | ~4k lignes (écrasées) | Dernier jour uniquement |

---

## 🔍 Requêtes SQL utiles

### Top 20 opportunités du jour

```sql
SELECT 
  name,
  developer,
  category_name,
  total_score,
  best_rank,
  country_count,
  is_paid,
  is_new
FROM opportunities_v2 
WHERE analysis_date = CURRENT_DATE
ORDER BY total_score DESC 
LIMIT 20;
```

### Apps par catégorie

```sql
SELECT * FROM opportunities_v2 
WHERE analysis_date = CURRENT_DATE
AND category_name = 'Productivity'
ORDER BY total_score DESC 
LIMIT 20;
```

### Apps récentes qui performent

```sql
SELECT * FROM opportunities_v2 
WHERE analysis_date = CURRENT_DATE
AND is_new = TRUE
ORDER BY total_score DESC 
LIMIT 20;
```

### Apps payantes

```sql
SELECT * FROM opportunities_v2 
WHERE analysis_date = CURRENT_DATE
AND is_paid = TRUE
ORDER BY total_score DESC 
LIMIT 20;
```

### Vérifier la blacklist

```sql
-- Compter par catégorie
SELECT category, COUNT(*) as count
FROM blacklisted_developers_v2
GROUP BY category
ORDER BY count DESC;

-- Chercher un développeur
SELECT * FROM blacklisted_developers_v2
WHERE developer ILIKE '%google%';
```

### Stats globales

```sql
-- Nombre d'apps par jour
SELECT run_date, COUNT(*) as apps
FROM app_rankings_v2
GROUP BY run_date
ORDER BY run_date DESC;

-- Ratio blacklist
SELECT 
  (SELECT COUNT(*) FROM app_rankings_v2) as total_brut,
  (SELECT COUNT(*) FROM app_rankings_clean_v2) as total_clean,
  (SELECT COUNT(*) FROM blacklisted_developers_v2) as devs_blacklisted;
```

### Lancer l'analyse manuellement

```sql
SELECT analyze_opportunities();
```

### Lancer le nettoyage manuellement

```sql
SELECT cleanup_old_data();
```

---

## 🛠 Maintenance

### Ajouter un développeur à la blacklist

```sql
-- 1. Trouver le nom exact
SELECT DISTINCT developer 
FROM app_rankings_v2 
WHERE developer ILIKE '%nom%';

-- 2. Ajouter à la blacklist
INSERT INTO blacklisted_developers_v2 (developer, category) 
VALUES ('Nom Exact Inc.', 'big_tech');

-- Le trigger supprime automatiquement de clean_v2
```

### Modifier les scores de catégorie

```sql
UPDATE category_scores 
SET bonus = 25 
WHERE category_name = 'Weather';
```

### Réinitialiser opportunities_v2

```sql
TRUNCATE TABLE opportunities_v2;
SELECT analyze_opportunities();
```

### Vérifier l'état des triggers

```sql
SELECT tgname, tgenabled 
FROM pg_trigger 
WHERE tgrelid = 'app_rankings_v2'::regclass;
```

### Backup manuel

```sql
-- Export CSV depuis Supabase
-- Table Editor → Export → CSV
```

---

## ❓ Troubleshooting

### Le scraper ne se lance pas

1. Vérifier le cron dans Railway Settings
2. Vérifier les logs Railway
3. Vérifier les variables d'environnement

### Erreur "SUPABASE_SERVICE_KEY manquante"

Vérifier que la variable est bien définie dans Railway → Variables

### Les opportunities ne se mettent pas à jour

```sql
-- Vérifier que la fonction existe
SELECT proname FROM pg_proc WHERE proname = 'analyze_opportunities';

-- Lancer manuellement
SELECT analyze_opportunities();
```

### Apps blacklistées toujours présentes

```sql
-- Vérifier le nom exact
SELECT DISTINCT developer 
FROM app_rankings_clean_v2 
WHERE developer ILIKE '%meta%';

-- Ajouter avec le nom exact
INSERT INTO blacklisted_developers_v2 (developer, category) 
VALUES ('Meta Platforms, Inc.', 'big_tech');

-- Forcer la resync
DELETE FROM app_rankings_clean_v2 
WHERE developer = 'Meta Platforms, Inc.';
```

### Espace disque Supabase

```sql
-- Vérifier la taille des tables
SELECT 
  relname as table,
  pg_size_pretty(pg_total_relation_size(relid)) as size
FROM pg_stat_user_tables
ORDER BY pg_total_relation_size(relid) DESC;

-- Forcer le nettoyage
SELECT cleanup_old_data();
```

---

## 📞 Support

- **GitHub** : https://github.com/Alexis2aCharlotte/niche-hunter-scraper
- **Supabase** : https://supabase.com/dashboard/project/paafqpdcjbjzyvcfzmzh
- **Railway** : https://railway.app/dashboard

---

*Documentation mise à jour le 10 décembre 2025*

