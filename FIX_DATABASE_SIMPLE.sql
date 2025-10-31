-- إصلاح سريع لقاعدة البيانات - تحديث من password_hash إلى password
-- Quick fix for database - Update from password_hash to password
-- 
-- شغّل هذا السكريبت في Supabase SQL Editor
-- Run this script in Supabase SQL Editor

-- الخيار 1: إذا كان الجدول موجود بالفعل
-- Option 1: If table already exists
ALTER TABLE admin_users 
RENAME COLUMN password_hash TO password;

-- الخيار 2: إذا كان الجدول غير موجود، أنشئه
-- Option 2: If table doesn't exist, create it
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

-- حذف أي سياسات RLS قديمة
DROP POLICY IF EXISTS "Enable read access for all users" ON admin_users;

-- إضافة حساب admin (بدون تشفير)
INSERT INTO admin_users (email, username, password, role, is_active) VALUES
('admin@electrofy.ly', 'admin', 'admin123', 'admin', true)
ON CONFLICT (username) DO UPDATE
SET password = 'admin123',
    is_active = true;

-- تفعيل RLS
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- التحقق من النتيجة
SELECT id, username, email, password, role, is_active 
FROM admin_users 
WHERE username = 'admin';
