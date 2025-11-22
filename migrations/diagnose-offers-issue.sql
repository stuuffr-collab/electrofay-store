-- ============================================================================
-- DIAGNOSTIC: Check Offers Table Status
-- ============================================================================
-- Run this in Supabase SQL Editor to diagnose the invisible offers problem

-- 1. Check if image_url column exists
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'offers'
ORDER BY ordinal_position;

-- 2. Check recent offers (last 10)
SELECT 
  id,
  title,
  type,
  is_active,
  is_featured,
  deleted_at,
  created_at,
  image_url  -- This will fail if column doesn't exist
FROM public.offers
ORDER BY created_at DESC
LIMIT 10;

-- 3. Count total offers by status
SELECT 
  COUNT(*) FILTER (WHERE is_active = true AND deleted_at IS NULL) as active_count,
  COUNT(*) FILTER (WHERE is_active = false) as inactive_count,
  COUNT(*) FILTER (WHERE deleted_at IS NOT NULL) as deleted_count,
  COUNT(*) as total_count
FROM public.offers;

-- ============================================================================
-- FIX: Add image_url column if missing
-- ============================================================================
-- Run this if column doesn't exist

ALTER TABLE public.offers
ADD COLUMN IF NOT EXISTS image_url TEXT;

-- ============================================================================
-- VERIFICATION: Create test offer directly in database
-- ============================================================================
-- This bypasses the API to test database directly

INSERT INTO public.offers (
  type,
  title,
  subtitle,
  price_before,
  price_after,
  is_active,
  is_featured,
  is_limited_time,
  priority,
  deleted_at
) VALUES (
  'bundle',
  'عرض اختبار من SQL',
  'هذا عرض تجريبي',
  300,
  200,
  true,
  false,
  false,
  0,
  NULL
)
RETURNING id, title, type, is_active, created_at;

-- If this INSERT works, the database is fine
-- If it fails, check the error message for missing columns
