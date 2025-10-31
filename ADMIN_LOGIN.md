# بيانات تسجيل الدخول للوحة التحكم
# Admin Login Credentials

## 🔐 بيانات الدخول الافتراضية / Default Credentials

بعد تشغيل سكريبت `database-setup.sql` أو `FIX_DATABASE_SIMPLE.sql` في Supabase:

**اسم المستخدم / Username:** `admin`

**كلمة المرور / Password:** `admin123`

⚠️ **ملاحظة أمنية مهمة:** كلمة المرور الآن غير مشفرة في قاعدة البيانات (نص عادي)

---

## 📋 خطوات الإعداد / Setup Steps

### ⚡ إصلاح سريع (إذا كانت قاعدة البيانات موجودة)

**الأسرع** - إذا كان لديك قاعدة بيانات موجودة:

1. افتح Supabase Dashboard → **SQL Editor**
2. انسخ محتوى ملف `FIX_DATABASE_SIMPLE.sql`
3. الصق وانقر **Run** ▶️
4. جرب تسجيل الدخول: `admin` / `admin123`

### 📦 إعداد كامل (قاعدة بيانات جديدة)

إذا كنت تريد إنشاء كل شيء من البداية:

1. افتح Supabase Dashboard
2. اذهب إلى **SQL Editor**
3. انقر على **New Query**
4. انسخ محتوى ملف `database-setup.sql`
5. الصق في SQL Editor
6. انقر على **Run** ▶️

### 2. تسجيل الدخول

1. اذهب إلى `/admin` في موقعك
2. استخدم بيانات الدخول أعلاه
3. **مهم:** غيّر كلمة المرور بعد أول تسجيل دخول

---

## ⚠️ ملاحظات أمنية / Security Notes

- كلمة المرور مشفرة باستخدام bcrypt
- يُنصح بتغيير كلمة المرور فوراً بعد الإعداد
- لا تشارك بيانات الدخول مع أحد

---

## 🔧 حل المشكلات / Troubleshooting

### المشكلة: "فشل في تسجيل الدخول"

**الحل:**

1. تأكد من تشغيل `database-setup.sql` في Supabase
2. تحقق من وجود جدول `admin_users` في قاعدة البيانات
3. تأكد من الاتصال بـ Supabase (تحقق من المفاتيح في Secrets)

### تحقق من وجود الحساب:

شغّل هذا الاستعلام في SQL Editor:

```sql
SELECT id, username, email, role, is_active 
FROM admin_users 
WHERE username = 'admin';
```

يجب أن يظهر حساب واحد.

---

## 🔄 إعادة تعيين كلمة المرور / Reset Password

إذا نسيت كلمة المرور، شغّل هذا في SQL Editor:

```sql
UPDATE admin_users 
SET password = 'admin123'
WHERE username = 'admin';
```

هذا سيعيد كلمة المرور إلى `admin123` (نص عادي بدون تشفير)
