# Niches Hunter — Developer API Roadmap

> Feature : API pay-as-you-go permettant aux développeurs d'accéder aux données scrappées (App Store rankings, niches analysées, opportunités).

---

## Décisions validées

| Décision | Valeur |
|---|---|
| Modèle de pricing | Pay-as-you-go en crédits |
| 1 crédit | = €0.01 |
| Dépôt minimum | €10 |
| Niche liste (par page de 20) | 5 crédits (€0.05) |
| **Niche détail** | **50 crédits (€0.50)** |
| Opportunities (par page de 50) | 5 crédits (€0.05) |
| Rankings (par query) | 3 crédits (€0.03) |
| Catégories | 1 crédit (€0.01) |
| Bonus monthly subscriber | 500 crédits one-time (€5) |
| Bonus lifetime subscriber | Aucun |
| Coût pour tout scraper (~160 niches) | ~€96 |
| Coût réel par niche servie | ~€0 (data déjà en base) |
| Endpoints IA (validator) | Non inclus dans l'API |
| Rate limit | 30 req/min |
| Accès SaaS pour dev accounts | Non (newsletter gratuite seulement) |
| Lien API dans workspace | Non |
| Lien API dans page account | Oui |

---

## Phase 1 — Fondations base de données

**Objectif** : Créer les tables et fonctions nécessaires dans Supabase.

### Connexion avec les tables existantes

Aucune migration nécessaire. Les tables existantes ne sont pas modifiées.
Toutes les nouvelles tables référencent `auth.users(id)` via `user_id`,
exactement comme `customers`, `saved_niches`, `projects`, etc.

```
auth.users (id)
  ├── customers (user_id)          ← existante, pas touchée
  ├── saved_niches (user_id)       ← existante, pas touchée
  ├── projects (user_id)           ← existante, pas touchée
  │
  ├── api_wallets (user_id)        ← NOUVELLE
  ├── api_keys (user_id)           ← NOUVELLE
  ├── api_calls (user_id)          ← NOUVELLE
  └── api_topups (user_id)         ← NOUVELLE
```

Pour déterminer si un user existant a droit au bonus €5 :
→ Query `customers WHERE user_id = X AND plan_type = 'monthly' AND status = 'active'`
Le `user_id` est déjà renseigné dans `customers` à chaque login (`/api/auth/login`).

### Tables à créer

- [ ] Table `api_wallets`
  ```sql
  CREATE TABLE api_wallets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) UNIQUE,
    balance_cents INTEGER NOT NULL DEFAULT 0,
    total_spent_cents INTEGER NOT NULL DEFAULT 0,
    bonus_claimed BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
  );
  ```

- [ ] Table `api_keys`
  ```sql
  CREATE TABLE api_keys (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id),
    name TEXT NOT NULL DEFAULT 'Default',
    key_hash TEXT NOT NULL UNIQUE,
    key_prefix TEXT NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT true,
    last_used_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now()
  );
  ```

- [ ] Table `api_calls`
  ```sql
  CREATE TABLE api_calls (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    api_key_id UUID NOT NULL REFERENCES api_keys(id),
    user_id UUID NOT NULL REFERENCES auth.users(id),
    endpoint TEXT NOT NULL,
    cost_cents INTEGER NOT NULL,
    status_code INTEGER,
    response_time_ms INTEGER,
    created_at TIMESTAMPTZ DEFAULT now()
  );
  ```

- [ ] Table `api_topups`
  ```sql
  CREATE TABLE api_topups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id),
    amount_cents INTEGER NOT NULL,
    stripe_payment_id TEXT,
    stripe_session_id TEXT,
    status TEXT NOT NULL DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT now()
  );
  ```

### Fonction RPC et index

- [ ] Fonction RPC `debit_api_call` (débit atomique avec `FOR UPDATE` lock + insert log)
  ```sql
  CREATE OR REPLACE FUNCTION debit_api_call(
    p_user_id UUID,
    p_cost INTEGER,
    p_api_key_id UUID,
    p_endpoint TEXT
  ) RETURNS BOOLEAN AS $$
  DECLARE
    v_balance INTEGER;
  BEGIN
    SELECT balance_cents INTO v_balance
    FROM api_wallets WHERE user_id = p_user_id
    FOR UPDATE;

    IF v_balance < p_cost THEN RETURN FALSE; END IF;

    UPDATE api_wallets
    SET balance_cents = balance_cents - p_cost,
        total_spent_cents = total_spent_cents + p_cost,
        updated_at = now()
    WHERE user_id = p_user_id;

    INSERT INTO api_calls (api_key_id, user_id, endpoint, cost_cents)
    VALUES (p_api_key_id, p_user_id, p_endpoint, p_cost);

    UPDATE api_keys SET last_used_at = now() WHERE id = p_api_key_id;

    RETURN TRUE;
  END;
  $$ LANGUAGE plpgsql;
  ```

- [ ] RLS policies (chaque user ne voit que ses propres données)
- [ ] Index sur `api_keys.key_hash` (lookup rapide à chaque requête API)
- [ ] Index sur `api_calls.created_at` (historique usage dashboard)
- [ ] Index sur `api_calls.user_id` (filtrage par user)

---

## Phase 2 — Middleware API et endpoints

**Objectif** : Créer le namespace `/api/v1/` avec authentification par clé API.

### Middleware

- [ ] Vérification de la clé API (hash → lookup `api_keys`)
- [ ] Vérification du solde (`api_wallets.balance_cents >= cost`)
- [ ] Débit atomique via `debit_api_call` RPC
- [ ] Rate limiting (30 req/min par clé)
- [ ] Headers de réponse : `X-Credits-Remaining`, `X-Credits-Used`
- [ ] Réponse 402 quand solde insuffisant (avec `topup_url`)

### Endpoints

- [ ] `GET /api/v1/niches` — liste paginée (titre, score, catégorie, tags). 5 cr/page, 20 résultats/page
- [ ] `GET /api/v1/niches/[code]` — détail complet (stats, market_analysis, monetization, ASO, risks, key_learnings, trending). 50 cr/appel
- [ ] `GET /api/v1/opportunities` — liste paginée avec filtres (catégorie, score min, pays). 5 cr/page, 50 résultats/page
- [ ] `GET /api/v1/rankings` — query par pays + catégorie + date. 3 cr/appel
- [ ] `GET /api/v1/categories` — liste des catégories avec scores/tiers. 1 cr/appel

### Coûts par endpoint

```
getEndpointCost(pathname):
  /v1/niches          →  5 crédits (par page)
  /v1/niches/:code    → 50 crédits
  /v1/opportunities   →  5 crédits (par page)
  /v1/rankings        →  3 crédits
  /v1/categories      →  1 crédit
```

---

## Phase 3 — Stripe integration (wallet top-up)

**Objectif** : Permettre les recharges de crédits via Stripe.

- [ ] Route `POST /api/stripe/api-topup` — crée une session Stripe (mode `payment`, min €10)
- [ ] Handler webhook `checkout.session.completed` avec metadata `type: 'api_topup'`
  - Crédite `api_wallets.balance_cents`
  - Insert dans `api_topups`
- [ ] Bonus one-time monthly : à la première activation API, créditer 500 crédits (€5)
  - Flag `bonus_claimed` dans `api_wallets` pour ne le faire qu'une seule fois

---

## Phase 4 — Page Pricing (carte Developer)

**Objectif** : Ajouter la troisième carte sur `/pricing`.

- [ ] Passer la grille de `md:grid-cols-2` à `md:grid-cols-3`
- [ ] Carte "Developer API" :
  - Titre : "Developer API"
  - Sous-titre : "Pay as you go"
  - Pas de prix affiché (juste "Get your API key")
  - Features : REST API access, 160+ niches data, App Store rankings, Scored opportunities, Usage dashboard, Documentation
  - CTA : "Get API Key →" → `/developer`
- [ ] Carte indépendante du toggle Monthly/Lifetime
- [ ] Style différencié (accent violet/bleu vs vert Pro)
- [ ] Ajouter colonne "Developer" dans le tableau comparatif
- [ ] Ajouter FAQ "What is the Developer API?"

---

## Phase 5 — Signup Developer et dashboard `/developer`

### 5a — Flow d'arrivée

- [ ] Si utilisateur connecté → dashboard direct
- [ ] Si pas connecté → formulaire signup `/developer` (email + password)
  - Crée compte Supabase Auth
  - Inscrit à newsletter gratuite (table `subscribers`)
  - Pas d'accès au SaaS (pas de niches UI, pas de workspace, pas de validator)
  - Redirect vers dashboard

### 5b — Dashboard `/developer`

- [ ] Header avec 3 stats cards : Solde (€), Appels ce mois, Dépensé ce mois
- [ ] Section "Add Credits" :
  - Minimum €10
  - Boutons : €10 / €20 / €50 / Custom
  - Click → checkout Stripe
- [ ] Section "Your API Key" :
  - Générer / Afficher (masqué) / Copier / Révoquer
- [ ] Section "Usage History" :
  - Tableau des derniers appels (endpoint, coût, date)
  - Filtre par période
- [ ] Section "Quick Start" :
  - Exemple curl
  - Lien vers documentation

---

## Phase 6 — Lien dans la page Account

**Objectif** : Permettre aux users Pro existants d'accéder à l'API depuis `/account`.

- [ ] Carte `LiquidCard` "API Credits" entre Workspace et Feedback/Affiliate
- [ ] Si wallet existant → affiche solde + "Manage API"
- [ ] Si monthly sans wallet → "Activate your API — €5 free credits included"
- [ ] Si lifetime sans wallet → "Get API access"
- [ ] Click → `/developer` (pas de re-login)

---

## Phase 7 — Documentation API

**Objectif** : Page publique `/developer/docs`.

- [ ] Authentication (comment passer la clé API)
- [ ] Liste des endpoints avec exemples requête/réponse
- [ ] Codes d'erreur (401, 402, 429)
- [ ] Grille de pricing (crédits par endpoint)
- [ ] Rate limits
- [ ] Exemples curl, JavaScript, Python

---

## Phase 8 — Tests et lancement

- [ ] Test flow complet : signup dev → top-up → generate key → appel API → débit → solde mis à jour
- [ ] Test flow monthly : account → activate API → bonus €5 → appel → débit
- [ ] Test flow lifetime : account → activate API → pas de bonus → top-up → appel
- [ ] Test edge cases : solde à 0 (402), rate limit (429), clé révoquée (401), clé invalide (401)
- [ ] Test concurrence (appels simultanés → `FOR UPDATE` empêche double-débit)
- [ ] Soft launch beta
- [ ] Annonce email + post X
