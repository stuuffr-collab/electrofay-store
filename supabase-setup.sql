-- نظام التسعير الديناميكي - إعداد قاعدة البيانات
-- Dynamic Pricing System - Database Setup

-- إنشاء جدول المنتجات مع الأسعار بالدولار
-- Create products table with USD base prices
CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  name_en TEXT NOT NULL,
  description TEXT NOT NULL,
  description_en TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL, -- سعر بالدينار الليبي (محسوب)
  original_price DECIMAL(10,2), -- السعر الأصلي قبل الخصم
  base_price_usd DECIMAL(10,2) NOT NULL, -- السعر الأساسي بالدولار
  category TEXT NOT NULL,
  image TEXT NOT NULL,
  rating DECIMAL(3,2) NOT NULL DEFAULT 0,
  badges TEXT[],
  in_stock BOOLEAN NOT NULL DEFAULT true,
  stock_count INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- إنشاء جدول الإعدادات لحفظ سعر الصرف
-- Create settings table for exchange rates
CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- إنشاء جدول الطلبات مع لقطة سعر الصرف
-- Create orders table with exchange rate snapshots
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
  items TEXT NOT NULL, -- JSON string containing cart items
  usd_to_lyd_snapshot DECIMAL(12,6), -- سعر الصرف وقت الطلب
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- إنشاء جدول المدن مع أسعار التوصيل
-- Create cities table with delivery fees
CREATE TABLE IF NOT EXISTS cities (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  name_en TEXT NOT NULL,
  delivery_fee DECIMAL(10,2) NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true
);

-- إنشاء جدول رسائل التواصل
-- Create contact messages table
CREATE TABLE IF NOT EXISTS contact_messages (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  city TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- إدخال سعر الصرف الافتراضي
-- Insert default exchange rate
INSERT INTO settings (key, value)
VALUES ('usd_to_lyd_rate', '{"rate": 5.10}')
ON CONFLICT (key) DO UPDATE SET
  value = EXCLUDED.value,
  updated_at = NOW();

-- إدخال منتجات تجريبية بالأسعار بالدولار
-- Insert sample gaming products with USD prices
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
),
(
  'headset001',
  'سماعة قيمنج محيطية 7.1',
  'Surround 7.1 Gaming Headset',
  'سماعة قيمنج محيطية 7.1 مع ميكروفون مع إلغاء الضوضاء وإضاءة RGB',
  '7.1 surround gaming headset with noise-cancelling microphone and RGB lighting',
  260.00, 51.00, 'gaming_accessory',
  'https://images.unsplash.com/photo-1599669454699-248893623440?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300',
  4.7, ARRAY['أكثر مبيعاً'], true, 8, true
),
(
  'monitor001',
  'شاشة قيمنج منحنية 27 بوصة',
  '27" Curved Gaming Monitor',
  'شاشة قيمنج منحنية 27 بوصة 144Hz مع تقنية G-Sync ودقة 1440p',
  '27-inch curved gaming monitor 144Hz with G-Sync technology and 1440p resolution',
  1300.50, 255.00, 'gaming_accessory',
  'https://images.unsplash.com/photo-1593640408182-31c5d14d0ad5?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300',
  4.9, ARRAY['الأعلى تقييماً'], true, 5, true
),
(
  'chair001',
  'كرسي قيمنج مريح',
  'Ergonomic Gaming Chair',
  'كرسي قيمنج مريح مع دعم أسفل الظهر ومساند ذراع قابلة للتعديل',
  'Ergonomic gaming chair with lumbar support and adjustable armrests',
  780.50, 153.00, 'gaming_accessory',
  'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300',
  4.6, ARRAY['ضمان 3 سنوات'], true, 10, true
)
ON CONFLICT (id) DO UPDATE SET
  base_price_usd = EXCLUDED.base_price_usd,
  price = EXCLUDED.price,
  updated_at = NOW();

-- إدخال بيانات المدن الليبية
-- Insert Libyan cities data
INSERT INTO cities (name, name_en, delivery_fee, is_active) VALUES
('طرابلس', 'Tripoli', 0.00, true),
('بنغازي', 'Benghazi', 15.00, true),
('مصراتة', 'Misrata', 10.00, true),
('الزاوية', 'Zawiya', 5.00, true),
('صبراتة', 'Sabratha', 8.00, true),
('زليتن', 'Zliten', 12.00, true),
('درنة', 'Derna', 20.00, true),
('سرت', 'Sirte', 18.00, true)
ON CONFLICT (name) DO UPDATE SET
  delivery_fee = EXCLUDED.delivery_fee,
  is_active = EXCLUDED.is_active;

-- إنشاء جدول المستخدمين الإداريين
-- Create admin users table
CREATE TABLE IF NOT EXISTS admin_users (
  id SERIAL PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  username TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'admin',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login TIMESTAMP WITH TIME ZONE
);

-- تفعيل Row Level Security
-- Enable Row Level Security
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE cities ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- إنشاء سياسات للقراءة العامة
-- Create policies for public read access
CREATE POLICY "Enable read access for all users" ON products FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON cities FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON settings FOR SELECT USING (true);

-- سياسة للكتابة في جدول الطلبات
-- Policy for inserting orders
CREATE POLICY "Enable insert for all users" ON orders FOR INSERT WITH CHECK (true);

-- سياسة للكتابة في جدول رسائل التواصل
-- Policy for inserting contact messages
CREATE POLICY "Enable insert for all users" ON contact_messages FOR INSERT WITH CHECK (true);

-- إنشاء فهارس لتحسين الأداء
-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_is_active ON products(is_active);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);

COMMIT;