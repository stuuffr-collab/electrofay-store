-- تحديث قاعدة البيانات الموجودة: تغيير اسم عمود password_hash إلى password
-- Update existing database: Rename password_hash column to password
-- 
-- قم بتشغيل هذا في Supabase SQL Editor لتحديث قاعدة البيانات الموجودة
-- Run this in Supabase SQL Editor to update your existing database

-- تغيير اسم العمود من password_hash إلى password
ALTER TABLE admin_users 
RENAME COLUMN password_hash TO password;

-- التحقق من التغيير
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'admin_users';
