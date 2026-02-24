-- ============================================================
-- NICHES HUNTER — Developer API : Setup SQL
-- ============================================================
-- Ce script CRÉE uniquement de NOUVELLES tables et fonctions.
-- Il ne MODIFIE et ne SUPPRIME aucune table existante.
-- Tu peux l'exécuter en une seule fois dans le SQL Editor de Supabase.
-- ============================================================


-- ============================================================
-- TABLE 1 : api_wallets
-- ============================================================
-- Le "portefeuille" de chaque développeur.
-- balance_cents = son solde en centimes d'euros (ex: 2000 = €20)
-- total_spent_cents = total dépensé depuis la création du compte
-- bonus_claimed = true si le dev a déjà reçu ses €5 gratuits (monthly only)
-- Un seul wallet par user (UNIQUE sur user_id).

CREATE TABLE api_wallets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  balance_cents INTEGER NOT NULL DEFAULT 0,
  total_spent_cents INTEGER NOT NULL DEFAULT 0,
  bonus_claimed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);


-- ============================================================
-- TABLE 2 : api_keys
-- ============================================================
-- Les clés API des développeurs.
-- key_hash = le SHA-256 de la clé (on ne stocke JAMAIS la clé en clair)
-- key_prefix = les premiers caractères "nh_live_a3b2" pour que le dev
--              puisse identifier sa clé dans le dashboard sans la voir en entier
-- is_active = false quand le dev révoque sa clé
-- Un user peut avoir plusieurs clés (mais en pratique on en génère une seule).

CREATE TABLE api_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL DEFAULT 'Default',
  key_hash TEXT NOT NULL UNIQUE,
  key_prefix TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  last_used_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);


-- ============================================================
-- TABLE 3 : api_calls
-- ============================================================
-- Le log de CHAQUE appel API. Sert pour :
--   1. Le dashboard "Usage History" du développeur
--   2. Le calcul de "Calls this month" et "Spent this month"
--   3. Le debugging si un dev conteste une facturation
-- Chaque ligne = 1 requête API = 1 débit de X crédits.

CREATE TABLE api_calls (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  api_key_id UUID NOT NULL REFERENCES api_keys(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  endpoint TEXT NOT NULL,
  cost_cents INTEGER NOT NULL,
  status_code INTEGER,
  response_time_ms INTEGER,
  created_at TIMESTAMPTZ DEFAULT now()
);


-- ============================================================
-- TABLE 4 : api_topups
-- ============================================================
-- L'historique des recharges de crédits via Stripe.
-- Quand un dev paye €20, on crée une ligne ici avec status = 'pending'.
-- Quand Stripe confirme le paiement (webhook), on passe à 'completed'
-- et on crédite api_wallets.balance_cents.

CREATE TABLE api_topups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount_cents INTEGER NOT NULL,
  stripe_payment_id TEXT,
  stripe_session_id TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT now()
);


-- ============================================================
-- FONCTION RPC : debit_api_call
-- ============================================================
-- C'est le COEUR du système de facturation.
-- Appelée à chaque requête API par le middleware Next.js.
-- 
-- Ce qu'elle fait en UNE SEULE transaction atomique :
--   1. Verrouille la ligne du wallet (FOR UPDATE) pour éviter les double-débits
--      si le dev envoie 50 requêtes en parallèle
--   2. Vérifie que le solde est suffisant
--   3. Débite le montant du wallet
--   4. Ajoute le montant au total dépensé
--   5. Insère un log dans api_calls
--   6. Met à jour le last_used_at de la clé API
--   7. Retourne TRUE si OK, FALSE si solde insuffisant

CREATE OR REPLACE FUNCTION debit_api_call(
  p_user_id UUID,
  p_cost INTEGER,
  p_api_key_id UUID,
  p_endpoint TEXT
) RETURNS BOOLEAN AS $$
DECLARE
  v_balance INTEGER;
BEGIN
  -- 1. Lock la ligne du wallet pour cet user (bloque les appels concurrents)
  SELECT balance_cents INTO v_balance
  FROM api_wallets WHERE user_id = p_user_id
  FOR UPDATE;

  -- 2. Solde insuffisant → on refuse
  IF v_balance IS NULL OR v_balance < p_cost THEN
    RETURN FALSE;
  END IF;

  -- 3+4. Débite et cumule le total dépensé
  UPDATE api_wallets
  SET balance_cents = balance_cents - p_cost,
      total_spent_cents = total_spent_cents + p_cost,
      updated_at = now()
  WHERE user_id = p_user_id;

  -- 5. Log l'appel
  INSERT INTO api_calls (api_key_id, user_id, endpoint, cost_cents)
  VALUES (p_api_key_id, p_user_id, p_endpoint, p_cost);

  -- 6. Met à jour le dernier usage de la clé
  UPDATE api_keys SET last_used_at = now() WHERE id = p_api_key_id;

  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- ============================================================
-- INDEX
-- ============================================================
-- Accélèrent les requêtes les plus fréquentes.
-- Ne modifient aucune donnée, juste la vitesse de lecture.

-- Chaque requête API fait un lookup par key_hash → doit être ultra rapide
CREATE INDEX idx_api_keys_key_hash ON api_keys(key_hash);

-- Le dashboard affiche l'historique par user, trié par date
CREATE INDEX idx_api_calls_user_created ON api_calls(user_id, created_at DESC);

-- Le webhook Stripe cherche les topups par session_id
CREATE INDEX idx_api_topups_session ON api_topups(stripe_session_id);


-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================
-- Protège les données : chaque user ne peut voir/modifier que SES données.
-- Le service_role (ton backend Next.js) bypass ces règles automatiquement.

-- api_wallets
ALTER TABLE api_wallets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own wallet"
  ON api_wallets FOR SELECT
  USING (auth.uid() = user_id);

-- api_keys
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own keys"
  ON api_keys FOR SELECT
  USING (auth.uid() = user_id);

-- api_calls
ALTER TABLE api_calls ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own calls"
  ON api_calls FOR SELECT
  USING (auth.uid() = user_id);

-- api_topups
ALTER TABLE api_topups ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own topups"
  ON api_topups FOR SELECT
  USING (auth.uid() = user_id);
