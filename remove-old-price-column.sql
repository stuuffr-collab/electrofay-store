-- إزالة عمود السعر القديم والاعتماد على التسعير الديناميكي فقط
-- Remove old price column and rely only on dynamic pricing

-- التأكد من وجود عمود base_price_usd قبل إزالة price
-- Ensure base_price_usd exists before removing price
DO $$ 
BEGIN
    -- التأكد من وجود عمود base_price_usd
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'products' AND column_name = 'base_price_usd') THEN
        RAISE EXCEPTION 'Cannot remove price column: base_price_usd column does not exist';
    END IF;

    -- تحديث أي منتجات لا تحتوي على base_price_usd
    -- Update any products without base_price_usd
    UPDATE products 
    SET base_price_usd = CASE 
        WHEN price IS NOT NULL AND price > 0 THEN ROUND(price / 5.10, 2)
        ELSE 50.00 -- سعر افتراضي
    END
    WHERE base_price_usd IS NULL OR base_price_usd = 0;

    -- جعل عمود base_price_usd مطلوباً
    -- Make base_price_usd required
    ALTER TABLE products ALTER COLUMN base_price_usd SET NOT NULL;

    -- إزالة عمود السعر القديم
    -- Remove the old price column
    IF EXISTS (SELECT 1 FROM information_schema.columns 
               WHERE table_name = 'products' AND column_name = 'price') THEN
        ALTER TABLE products DROP COLUMN price;
        RAISE NOTICE 'Successfully removed price column from products table';
    END IF;

    -- إزالة عمود original_price أيضاً إذا كان موجوداً
    -- Remove original_price column as well if it exists
    IF EXISTS (SELECT 1 FROM information_schema.columns 
               WHERE table_name = 'products' AND column_name = 'original_price') THEN
        ALTER TABLE products DROP COLUMN original_price;
        RAISE NOTICE 'Successfully removed original_price column from products table';
    END IF;

END $$;

-- التأكد من وجود سعر صرف افتراضي
-- Ensure default exchange rate exists
INSERT INTO settings (key, value)
VALUES ('usd_to_lyd_rate', '{"rate": 5.10}')
ON CONFLICT (key) DO NOTHING;

-- عرض المنتجات بعد التحديث للتأكد
-- Display products after update to verify
SELECT id, name, base_price_usd, category, is_active 
FROM products 
WHERE is_active = true 
LIMIT 5;

COMMIT;