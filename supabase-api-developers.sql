-- =============================================
-- TABLE : api_developers
-- Liste des développeurs API avec leur email
-- pour la communication (newsletters, notifications)
-- =============================================

CREATE TABLE api_developers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  email TEXT NOT NULL,
  name TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  newsletter_opted_out BOOLEAN NOT NULL DEFAULT false,
  source TEXT NOT NULL DEFAULT 'signup',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Index pour les envois de newsletters
CREATE INDEX idx_api_developers_active ON api_developers(is_active, newsletter_opted_out);
CREATE INDEX idx_api_developers_email ON api_developers(email);

-- RLS
ALTER TABLE api_developers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own developer profile"
  ON api_developers FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Service role full access to api_developers"
  ON api_developers FOR ALL
  USING (auth.role() = 'service_role');

-- =============================================
-- MIGRATION : Importer les développeurs existants
-- (ceux qui ont déjà un api_wallet)
-- =============================================

INSERT INTO api_developers (user_id, email, source, created_at)
SELECT
  aw.user_id,
  au.email,
  'migration',
  aw.created_at
FROM api_wallets aw
JOIN auth.users au ON au.id = aw.user_id
ON CONFLICT (user_id) DO NOTHING;
