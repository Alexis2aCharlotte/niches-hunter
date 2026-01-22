-- ============================================
-- AFFILIATE PROGRAM - OPEN TO EVERYONE
-- ============================================
-- Run this in Supabase SQL Editor

-- Add new columns to existing affiliates table
ALTER TABLE affiliates 
ADD COLUMN IF NOT EXISTS affiliate_type TEXT DEFAULT 'pro',
ADD COLUMN IF NOT EXISTS promotion_platform TEXT,
ADD COLUMN IF NOT EXISTS promotion_url TEXT,
ADD COLUMN IF NOT EXISTS audience_size TEXT;

-- Add comment for clarity
COMMENT ON COLUMN affiliates.affiliate_type IS 'pro = existing paid user, external = non-user';
COMMENT ON COLUMN affiliates.promotion_platform IS 'twitter, reddit, youtube, blog, newsletter';
COMMENT ON COLUMN affiliates.promotion_url IS 'Link to their platform/profile';
COMMENT ON COLUMN affiliates.audience_size IS 'Estimated audience: 1K-5K, 5K-10K, 10K-50K, 50K+';

-- Update existing affiliates to be marked as 'pro'
UPDATE affiliates SET affiliate_type = 'pro' WHERE affiliate_type IS NULL;

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_affiliates_type ON affiliates(affiliate_type);
CREATE INDEX IF NOT EXISTS idx_affiliates_status ON affiliates(status);
