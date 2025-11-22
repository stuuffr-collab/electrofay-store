-- Migration: Create Advanced Offers Management System
-- Version: 001
-- Description: Creates offers and offer_products tables with support for 5 offer types
-- Author: System
-- Date: 2025-01-21

-- ============================================================================
-- DROP EXISTING (if migrating from old system)
-- ============================================================================
DROP TRIGGER IF EXISTS update_offers_updated_at ON public.offers;
DROP POLICY IF EXISTS "Allow public read access to active offers" ON public.offers;
DROP POLICY IF EXISTS "Allow public read access to offer products" ON public.offer_products;
DROP INDEX IF EXISTS idx_offers_active;
DROP INDEX IF EXISTS idx_offers_priority;
DROP INDEX IF EXISTS idx_offers_featured;
DROP INDEX IF EXISTS idx_offers_type;
DROP INDEX IF EXISTS idx_offers_not_deleted;
DROP INDEX IF EXISTS idx_offers_coupon_code;
DROP INDEX IF EXISTS idx_offer_products_offer;
DROP INDEX IF EXISTS idx_offer_products_product;
DROP TABLE IF EXISTS public.offer_products CASCADE;
DROP TABLE IF EXISTS public.offers CASCADE;

-- ============================================================================
-- CREATE NEW TABLES
-- ============================================================================

-- Main offers table
CREATE TABLE public.offers (
    -- Identity
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Content
    title TEXT NOT NULL,
    subtitle TEXT,
    badge_label TEXT,
    image_url TEXT,

    
    -- Classification (5 supported types)
    type TEXT NOT NULL CHECK (type IN (
        'product_discount',
        'bundle',
        'buy2_get3_half',
        'free_shipping_threshold',
        'coupon'
    )),
    
    -- Discount Configuration (for product_discount, coupon)
    discount_type TEXT CHECK (discount_type IN ('percent', 'fixed')),
    discount_value DECIMAL(10, 2),
    
    -- Bundle Pricing (for bundle type)
    price_before DECIMAL(10, 2),
    price_after DECIMAL(10, 2),
    
    -- Buy X Get Y Rules (for buy2_get3_half type)
    min_quantity INTEGER DEFAULT 3,
    
    -- Shipping Threshold (for free_shipping_threshold type)
    min_cart_total DECIMAL(10, 2),
    free_shipping BOOLEAN DEFAULT FALSE,
    
    -- Coupon System (for coupon type)
    coupon_code TEXT UNIQUE,
    max_uses INTEGER,
    per_user_limit INTEGER,
    
    -- Temporal Controls
    starts_at TIMESTAMP WITH TIME ZONE,
    ends_at TIMESTAMP WITH TIME ZONE,
    is_limited_time BOOLEAN DEFAULT FALSE,
    
    -- Status & Display
    is_active BOOLEAN DEFAULT TRUE,
    is_featured BOOLEAN DEFAULT FALSE,
    priority INTEGER DEFAULT 0,
    
    -- Soft Delete Support
    deleted_at TIMESTAMP WITH TIME ZONE,
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    
    -- Constraints
    CONSTRAINT valid_time_range CHECK (
        NOT is_limited_time OR (starts_at IS NOT NULL AND ends_at IS NOT NULL AND ends_at > starts_at)
    )
);

-- Junction table for offer-product relationships
CREATE TABLE public.offer_products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    offer_id UUID NOT NULL REFERENCES public.offers(id) ON DELETE CASCADE,
    product_id TEXT NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    quantity INTEGER DEFAULT 1,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    
    UNIQUE(offer_id, product_id)
);

-- ============================================================================
-- CREATE INDEXES
-- ============================================================================
CREATE INDEX idx_offers_active ON public.offers(is_active, ends_at) WHERE is_active = TRUE;
CREATE INDEX idx_offers_featured ON public.offers(is_featured, priority) WHERE is_featured = TRUE;
CREATE INDEX idx_offers_type ON public.offers(type);
CREATE INDEX idx_offers_not_deleted ON public.offers(deleted_at) WHERE deleted_at IS NULL;
CREATE INDEX idx_offers_coupon_code ON public.offers(coupon_code) WHERE coupon_code IS NOT NULL;
CREATE INDEX idx_offer_products_offer ON public.offer_products(offer_id);
CREATE INDEX idx_offer_products_product ON public.offer_products(product_id);

-- ============================================================================
-- ENABLE RLS
-- ============================================================================
ALTER TABLE public.offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.offer_products ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- CREATE RLS POLICIES
-- ============================================================================

-- Public can read active, non-deleted offers
CREATE POLICY "Allow public read access to active offers" ON public.offers
    FOR SELECT USING (is_active = TRUE AND deleted_at IS NULL);

-- Public can read offer_products for active offers
CREATE POLICY "Allow public read access to offer products" ON public.offer_products
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.offers 
            WHERE offers.id = offer_products.offer_id 
            AND offers.is_active = TRUE 
            AND offers.deleted_at IS NULL
        )
    );

-- ============================================================================
-- CREATE HELPER FUNCTION (if not exists)
-- ============================================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- ============================================================================
-- CREATE TRIGGERS
-- ============================================================================
CREATE TRIGGER update_offers_updated_at BEFORE UPDATE ON public.offers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- MIGRATION COMPLETE
-- ============================================================================
-- Successfully created:
-- - offers table (with 5 offer types support, soft delete)
-- - offer_products table (junction for offer-product relationships)
-- - 7 performance indexes
-- - 2 RLS policies
-- - 1 trigger for updated_at
