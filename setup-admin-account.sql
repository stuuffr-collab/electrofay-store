-- إنشاء حساب admin في Supabase
-- قم بتشغيل هذا السكريبت في Supabase SQL Editor

-- تعطيل RLS مؤقتاً للإدراج
ALTER TABLE admin_users DISABLE ROW LEVEL SECURITY;

-- حذف أي مستخدمين قدامى (اختياري)
-- DELETE FROM admin_users WHERE username = 'admin';

-- إنشاء حساب admin مع كلمة مرور مشفرة
INSERT INTO admin_users (username, email, password_hash, role, is_active)
VALUES (
  'admin',
  'admin@electrofy.com',
  '$2b$10$MF51U0yEJYbxy.lI5mHb/eZH.mi27dwDEk/4cJc/rFt32FBL8mL16',
  'admin',
  true
)
ON CONFLICT (username) DO UPDATE
SET password_hash = EXCLUDED.password_hash,
    is_active = true;

-- إعادة تفعيل RLS
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- التحقق من إنشاء الحساب
SELECT id, username, email, role, is_active, created_at 
FROM admin_users 
WHERE username = 'admin';
