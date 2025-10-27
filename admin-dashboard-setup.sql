-- Admin Dashboard Setup Script
-- تحديث قاعدة البيانات لإضافة لوحة التحكم

-- 1. إضافة جدول المسؤولين
CREATE TABLE IF NOT EXISTS admin_users (
  id SERIAL PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  username TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'admin',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  last_login TIMESTAMP
);

-- 2. تحديث جدول المنتجات لإضافة حقول التصنيف
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS category_id TEXT,
ADD COLUMN IF NOT EXISTS subcategory_id TEXT;

-- 3. إنشاء فهارس لتحسين الأداء
CREATE INDEX IF NOT EXISTS idx_products_category_id ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_subcategory_id ON products(subcategory_id);
CREATE INDEX IF NOT EXISTS idx_products_is_active ON products(is_active);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);

-- 4. إضافة مسؤول افتراضي (كلمة المرور: admin123)
-- يجب تغيير كلمة المرور بعد تسجيل الدخول الأول
-- كلمة المرور المشفرة باستخدام bcrypt
INSERT INTO admin_users (email, username, password_hash, role)
VALUES ('admin@electrofy.ly', 'admin', '$2a$10$rOvHPZQxlhXQH0KXLnU8l.xN3C/YJ7LrT8zGF0kYXzFW2k4UqvKSK', 'admin')
ON CONFLICT (email) DO NOTHING;

-- 5. إضافة سياسات الأمان (Row Level Security)
-- تأكد من أن المسؤولين فقط يمكنهم الوصول لجدول admin_users
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- 6. تحديث المنتجات الحالية بالتصنيفات (أمثلة)
-- ستحتاج لتشغيل سكريبت تصنيف آلي بعد ذلك
COMMENT ON TABLE admin_users IS 'جدول المسؤولين لإدارة لوحة التحكم';
COMMENT ON TABLE products IS 'جدول المنتجات مع دعم التصنيفات الهرمية';

-- 7. عرض النتائج
SELECT 'تم إنشاء جدول المسؤولين بنجاح' as status;
SELECT 'تم تحديث جدول المنتجات بنجاح' as status;
SELECT 'عدد المسؤولين: ' || COUNT(*) FROM admin_users;
