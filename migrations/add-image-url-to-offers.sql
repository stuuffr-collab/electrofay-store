-- Migration: Add image_url column to offers table
-- Date: 2025-11-21
-- Description: Adds image_url TEXT column to support offer images

-- Add the image_url column
ALTER TABLE public.offers
ADD COLUMN IF NOT EXISTS image_url TEXT;

-- Update existing offers to have NULL for image_url (already default)
-- No action needed as NULL is the default for new columns

-- Verify the column was added
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'offers' 
        AND column_name = 'image_url'
    ) THEN
        RAISE NOTICE 'Column image_url successfully added to offers table';
    ELSE
        RAISE EXCEPTION 'Failed to add image_url column to offers table';
    END IF;
END $$;
