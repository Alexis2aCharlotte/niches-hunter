# 🗺️ ROADMAP - Niches Hunter

> Dernière mise à jour : 14 décembre 2024

---

## ✅ Fait

### Frontend
- [x] Landing page complète
- [x] Page `/niches` avec liste des niches + filtres par catégorie
- [x] Pages dynamiques `/niches/[id]` avec étude complète
- [x] Page lockée avec CTA paiement
- [x] Navbar avec dropdown (Resources, Blog, About)
- [x] Pages Blog et About (structure de base)
- [x] Design responsive et moderne
- [x] Effet de halo lumineux qui suit la souris (LiquidCard)
- [x] Composant `LiquidCard` réutilisable

### Architecture
- [x] Structure de données `Niche` typée (TypeScript)
- [x] Routes dynamiques Next.js App Router
- [x] Séparation données / composants (`data.ts`)

### Base de données
- [x] Table `niches` créée dans Supabase
- [x] Types TypeScript générés (`database.types.ts`)
- [x] Client Supabase configuré (`.env.local`)
- [x] Frontend connecté à Supabase (plus de mock data)
- [x] Fonctions `fetchAllNiches()` et `fetchNicheById()` async
- [x] États de chargement (loading states)
- [x] Niche de test insérée et fonctionnelle ✓

---

## 🚧 Prochaines étapes

### Phase 1 : Tables Supabase restantes ⬅️ ON EST ICI

#### À créer maintenant :

```sql
-- 1. Sources utilisées pour chaque niche (anti-répétition)
CREATE TABLE niche_sources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  niche_id TEXT REFERENCES niches(id) ON DELETE CASCADE,
  app_id TEXT NOT NULL,
  app_name TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Historique des publications (cooldown 10 jours)
CREATE TABLE published_niche_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  niche_pattern TEXT NOT NULL,
  source_app_ids TEXT[],
  published_at TIMESTAMPTZ DEFAULT now(),
  cooldown_until TIMESTAMPTZ DEFAULT (now() + INTERVAL '10 days')
);
CREATE INDEX idx_cooldown ON published_niche_history(cooldown_until);

-- 3. Achats one-time (4.99€)
CREATE TABLE niche_purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  niche_id TEXT REFERENCES niches(id),
  email TEXT,  -- pour les achats sans compte
  amount INTEGER,  -- en centimes (499 = 4.99€)
  stripe_payment_id TEXT UNIQUE,
  purchased_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Abonnements mensuels (10€)
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  stripe_subscription_id TEXT UNIQUE,
  stripe_customer_id TEXT,
  status TEXT CHECK (status IN ('active', 'canceled', 'past_due', 'trialing')),
  current_period_end TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 5. Newsletter subscribers
CREATE TABLE subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  subscribed_at TIMESTAMPTZ DEFAULT now(),
  unsubscribed_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true
);
```

---

### Phase 2 : Authentification (optionnel pour v1)

- [ ] Configurer Supabase Auth
- [ ] Page `/login` fonctionnelle
- [ ] Page `/signup`
- [ ] Magic link (recommandé pour zero-friction)
- [ ] Session utilisateur persistante

**Note :** L'auth peut attendre si on permet les achats sans compte (juste email).

---

### Phase 3 : Script IA Railway (génération automatique)

- [ ] Créer le projet Railway
- [ ] Variables d'environnement (Supabase URL/Key, OpenAI Key)
- [ ] Script `generate_daily_niche.py`
  - Récupérer apps trending depuis ta DB
  - Exclure celles en cooldown (published_niche_history)
  - Clustering par catégorie
  - Appel OpenAI avec le prompt complet
  - Validation JSON
  - Insert dans Supabase
  - Insert cooldown (10 jours)
- [ ] Cron job : tous les jours à 8h00

---

### Phase 4 : Stripe (paiements)

- [ ] Créer compte Stripe
- [ ] Produit "Niche Analysis" (4.99€ one-time)
- [ ] Endpoint `/api/checkout/niche/[id]`
- [ ] Webhook `/api/webhooks/stripe`
- [ ] Débloquer niche après paiement
- [ ] Page de succès `/success`

---

### Phase 5 : Newsletter

- [ ] Choisir provider (Resend recommandé)
- [ ] Formulaire inscription landing page
- [ ] Template email niche quotidienne
- [ ] Intégration avec script Railway
- [ ] Page désabonnement

---

### Phase 6 : Polish & SEO

- [ ] Articles de blog
- [ ] Sitemap.xml dynamique
- [ ] Métadonnées SEO
- [ ] Open Graph images
- [ ] Page 404 custom
- [ ] Analytics

---

## 📊 Récapitulatif

| Phase | Statut | Durée estimée |
|-------|--------|---------------|
| Tables Supabase | ⬅️ En cours | 30 min |
| Auth | À faire | 1 jour |
| Script Railway + IA | À faire | 2 jours |
| Stripe | À faire | 1-2 jours |
| Newsletter | À faire | 1 jour |
| Polish & SEO | À faire | 2-3 jours |

**Temps restant estimé : 7-10 jours**

---

## 🎯 Action immédiate

**Exécuter ces SQL dans Supabase :**

1. Va sur [Supabase Dashboard](https://supabase.com/dashboard)
2. Ouvre ton projet → SQL Editor
3. Copie/colle les 5 CREATE TABLE ci-dessus
4. Exécute

Une fois fait, on passe à la configuration de l'authentification ou directement au script Railway (selon ta préférence).

---

## 📝 Prompt OpenAI (rappel)

```
Tu es un expert en analyse de marché mobile. Génère une analyse complète de niche au format JSON strict.

CONTEXTE:
- Apps trending détectées: {liste des apps avec leurs métriques}
- Pattern identifié: {description du pattern/cluster}
- Marché principal: {pays dominant}

GÉNÈRE UN JSON avec cette structure EXACTE:

{
  "id": "XXX",
  "title": "",
  "category": "",
  "tags": ["", "", ""],
  "score": 0,
  "opportunity": "",
  "gap": "",
  "move": "",
  "stats": {
    "competition": "",
    "potential": "",
    "revenue": "",
    "market": "",
    "timeToMVP": "",
    "difficulty": ""
  },
  "marketAnalysis": {
    "totalMarketSize": "",
    "growthRate": "",
    "targetAudience": "",
    "geographicFocus": []
  },
  "keyLearnings": [],
  "improvements": [],
  "marketingStrategies": [
    {"channel": "", "strategy": "", "estimatedCost": ""}
  ],
  "monetization": {
    "model": "",
    "pricing": "",
    "conversionRate": ""
  },
  "techStack": [],
  "risks": [],
  "trending": [
    {
      "name": "",
      "category": "",
      "growth": "",
      "description": "",
      "strongMarket": "",
      "estimatedMRR": "",
      "keyPoints": [],
      "weakPoints": []
    }
  ]
}

RÈGLES:
- Réponds UNIQUEMENT avec le JSON, pas de texte avant/après
- Tous les champs sont OBLIGATOIRES
- category: Education, Entertainment, Health & Fitness, Lifestyle, Productivity, Finance, Social Networking, Games, Photo & Video, Utilities
- tags: 3 max, en MAJUSCULES
- score: 0-100
- keyLearnings: 4-6 items avec données chiffrées
- improvements: 4-6 items concrets
- marketingStrategies: 4-5 canaux
- trending: 3-5 apps avec analyse complète
```

---

## 💰 Modèle économique (rappel)

| Type | Prix | Frais Stripe | Net |
|------|------|--------------|-----|
| One-time | 4.99€ | ~0.39€ | 4.60€ |
| Monthly | 10€ | ~0.39€ | 9.61€ |

---

## 🔗 Ressources

- [Supabase Dashboard](https://supabase.com/dashboard)
- [Stripe Dashboard](https://dashboard.stripe.com)
- [Railway](https://railway.app)
- [Resend](https://resend.com)
- [OpenAI API](https://platform.openai.com)
