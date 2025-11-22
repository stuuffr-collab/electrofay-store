-- SQL to DROP offers table from Supabase
-- Run this ONLY if you previously ran the create-offers-table.sql migration
-- WARNING: This will delete all data in the offers table

-- Drop trigger
DROP TRIGGER IF EXISTS update_offers_updated_at ON public.offers;

-- Drop indexes
DROP INDEX IF EXISTS idx_offers_active;
DROP INDEX IF EXISTS idx_offers_priority;

-- Drop RLS policies
DROP POLICY IF EXISTS "Allow public read access to active offers" ON public.offers;

-- Drop table
DROP TABLE IF EXISTS public.offers CASCADE;
