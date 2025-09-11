-- إصلاح جدول المنتجات لإضافة نظام التسعير الديناميكي
-- Fix products table to add dynamic pricing system

-- إضافة العمود المفقود إذا لم يكن موجوداً
-- Add missing column if it doesn't exist
DO $$ 
BEGIN
    -- إضافة عمود السعر بالدولار
    -- Add USD base price column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'products' AND column_name = 'base_price_usd') THEN
        ALTER TABLE products ADD COLUMN base_price_usd DECIMAL(10,2);
        RAISE NOTICE 'Added base_price_usd column to products table';
    END IF;

    -- إضافة عمود name_en إذا لم يكن موجوداً
    -- Add English name column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'products' AND column_name = 'name_en') THEN
        ALTER TABLE products ADD COLUMN name_en TEXT;
        RAISE NOTICE 'Added name_en column to products table';
    END IF;

    -- إضافة عمود description_en إذا لم يكن موجوداً
    -- Add English description column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'products' AND column_name = 'description_en') THEN
        ALTER TABLE products ADD COLUMN description_en TEXT;
        RAISE NOTICE 'Added description_en column to products table';
    END IF;

    -- إضافة عمود original_price إذا لم يكن موجوداً
    -- Add original price column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'products' AND column_name = 'original_price') THEN
        ALTER TABLE products ADD COLUMN original_price DECIMAL(10,2);
        RAISE NOTICE 'Added original_price column to products table';
    END IF;

    -- إضافة عمود badges إذا لم يكن موجوداً
    -- Add badges column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'products' AND column_name = 'badges') THEN
        ALTER TABLE products ADD COLUMN badges TEXT[];
        RAISE NOTICE 'Added badges column to products table';
    END IF;

    -- إضافة عمود in_stock إذا لم يكن موجوداً
    -- Add in_stock column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'products' AND column_name = 'in_stock') THEN
        ALTER TABLE products ADD COLUMN in_stock BOOLEAN DEFAULT true;
        RAISE NOTICE 'Added in_stock column to products table';
    END IF;

    -- إضافة عمود stock_count إذا لم يكن موجوداً
    -- Add stock_count column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'products' AND column_name = 'stock_count') THEN
        ALTER TABLE products ADD COLUMN stock_count INTEGER DEFAULT 0;
        RAISE NOTICE 'Added stock_count column to products table';
    END IF;

    -- إضافة عمود is_active إذا لم يكن موجوداً
    -- Add is_active column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'products' AND column_name = 'is_active') THEN
        ALTER TABLE products ADD COLUMN is_active BOOLEAN DEFAULT true;
        RAISE NOTICE 'Added is_active column to products table';
    END IF;

END $$;

-- إنشاء جدول الإعدادات إذا لم يكن موجوداً
-- Create settings table if it doesn't exist
CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- إنشاء جدول الطلبات إذا لم يكن موجوداً
-- Create orders table if it doesn't exist
CREATE TABLE IF NOT EXISTS orders (
  id SERIAL PRIMARY KEY,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_city TEXT NOT NULL,
  customer_address TEXT NOT NULL,
  order_notes TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  total_amount DECIMAL(10,2) NOT NULL,
  delivery_fee DECIMAL(10,2) NOT NULL DEFAULT 0,
  items TEXT NOT NULL,
  usd_to_lyd_snapshot DECIMAL(12,6),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- إدخال سعر الصرف الافتراضي
-- Insert default exchange rate
INSERT INTO settings (key, value)
VALUES ('usd_to_lyd_rate', '{"rate": 5.10}')
ON CONFLICT (key) DO UPDATE SET
  value = EXCLUDED.value,
  updated_at = NOW();

-- تحديث البيانات الموجودة بأسعار بالدولار
-- Update existing products with USD prices
UPDATE products SET 
  base_price_usd = CASE 
    WHEN id LIKE '%keyboard%' OR id LIKE '%kb%' THEN 64.00
    WHEN id LIKE '%mouse%' THEN 36.00
    WHEN id LIKE '%headset%' OR id LIKE '%headphone%' THEN 51.00
    WHEN id LIKE '%monitor%' OR id LIKE '%screen%' THEN 255.00
    WHEN id LIKE '%chair%' THEN 153.00
    ELSE ROUND(price / 5.10, 2) -- تحويل السعر الحالي إلى دولار
  END,
  name_en = COALESCE(name_en, name),
  description_en = COALESCE(description_en, description),
  badges = COALESCE(badges, ARRAY[]::TEXT[]),
  in_stock = COALESCE(in_stock, true),
  stock_count = COALESCE(stock_count, 10),
  is_active = COALESCE(is_active, true)
WHERE base_price_usd IS NULL;

-- إدخال منتجات تجريبية جديدة بأسعار الدولار
-- Insert new sample products with USD prices
INSERT INTO products (
  id, name, name_en, description, description_en, 
  price, base_price_usd, category, image, rating, 
  badges, in_stock, stock_count, is_active
) VALUES 
(
  'kb001', 
  'لوحة مفاتيح RGB ميكانيكية', 
  'RGB Mechanical Gaming Keyboard',
  'لوحة مفاتيح ميكانيكية احترافية مع إضاءة RGB قابلة للتخصيص ومفاتيح براون',
  'Professional mechanical keyboard with customizable RGB lighting and brown switches',
  326.50, 64.00, 'gaming_accessory',
  'https://images.unsplash.com/photo-1541140532154-b024d705b90a?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300',
  4.8, ARRAY['خصم 29%', 'جديد'], true, 15, true
),
(
  'mouse001',
  'ماوس قيمنج RGB عالي الدقة',
  'RGB Gaming Mouse Pro',
  'ماوس قيمنج بصري عالي الدقة 25600 DPI مع 11 زر قابل للبرمجة وإضاءة RGB',
  'High precision gaming mouse 25600 DPI with 11 programmable buttons and RGB lighting',
  183.50, 36.00, 'gaming_accessory',
  'https://images.unsplash.com/photo-1527814050087-3793815479db?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300',
  4.9, ARRAY['متبقي 3 قطع'], true, 3, true
)
ON CONFLICT (id) DO UPDATE SET
  base_price_usd = EXCLUDED.base_price_usd,
  name_en = EXCLUDED.name_en,
  description_en = EXCLUDED.description_en,
  price = EXCLUDED.price,
  badges = EXCLUDED.badges,
  in_stock = EXCLUDED.in_stock,
  stock_count = EXCLUDED.stock_count,
  is_active = EXCLUDED.is_active;

-- تفعيل Row Level Security للجداول الجديدة
-- Enable Row Level Security for new tables
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- إنشاء سياسات الأمان
-- Create security policies
DO $$ 
BEGIN
    -- حذف السياسات الموجودة إذا كانت موجودة
    -- Drop existing policies if they exist
    DROP POLICY IF EXISTS "Enable read access for all users" ON products;
    DROP POLICY IF EXISTS "Enable read access for all users" ON settings;
    DROP POLICY IF EXISTS "Enable insert for all users" ON orders;
    
    -- إنشاء سياسات جديدة
    -- Create new policies
    CREATE POLICY "Enable read access for all users" ON products FOR SELECT USING (true);
    CREATE POLICY "Enable read access for all users" ON settings FOR SELECT USING (true);
    CREATE POLICY "Enable insert for all users" ON orders FOR INSERT WITH CHECK (true);
    
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Policies already exist or error creating them: %', SQLERRM;
END $$;

-- إنشاء فهارس لتحسين الأداء
-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_is_active ON products(is_active);

COMMIT;