-- ⚡ إصلاح فوري - شغّل هذا في Supabase SQL Editor
-- Run this in Supabase SQL Editor NOW

-- تغيير اسم العمود من password_hash إلى password
ALTER TABLE admin_users 
RENAME COLUMN password_hash TO password;

-- تحديث كلمة المرور
UPDATE admin_users 
SET password = 'admin123'
WHERE username = 'admin';

-- التحقق من النتيجة
SELECT username, password 
FROM admin_users 
WHERE username = 'admin';
