-- 📋 تشغيل هذا الملف مرة واحدة فقط في Supabase SQL Editor
-- الخطوات: Supabase Dashboard > SQL Editor > نسخ ولصق كل المحتوى > Run

-- حذف الجداول القديمة (إن وجدت)
DROP TABLE IF EXISTS public.subcategories CASCADE;
DROP TABLE IF EXISTS public.categories CASCADE;

-- ========== إنشاء جداول الأقسام ==========

CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  name_en TEXT NOT NULL,
  icon TEXT NOT NULL,
  description TEXT NOT NULL,
  description_en TEXT NOT NULL,
  color TEXT NOT NULL,
  gradient TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE public.subcategories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  name_en TEXT NOT NULL,
  icon TEXT NOT NULL,
  description TEXT NOT NULL,
  description_en TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- فهرسة للأداء
CREATE INDEX idx_categories_sort_order ON public.categories(sort_order);
CREATE INDEX idx_categories_is_active ON public.categories(is_active);
CREATE INDEX idx_subcategories_category_id ON public.subcategories(category_id);
CREATE INDEX idx_subcategories_sort_order ON public.subcategories(sort_order);
CREATE INDEX idx_subcategories_is_active ON public.subcategories(is_active);

-- إعدادات الأمان
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subcategories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Enable read access for all users" ON public.categories;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.subcategories;

CREATE POLICY "Enable read access for all users" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON public.subcategories FOR SELECT USING (true);

-- ========== إضافة البيانات الافتراضية ==========

-- الأقسام الرئيسية
INSERT INTO public.categories (name, name_en, icon, description, description_en, color, gradient, sort_order) VALUES
('قطع الكمبيوتر', 'PC Components', 'Cpu', 'معالجات، كروت شاشة، رامات، وحدات تخزين', 'Processors, Graphics Cards, RAM, Storage', '#3b82f6', 'from-blue-500 to-blue-700', 1),
('الملحقات', 'Peripherals', 'Mouse', 'لوحات مفاتيح، ماوس، سماعات', 'Keyboards, Mice, Headsets', '#8b5cf6', 'from-purple-500 to-purple-700', 2),
('الشاشات', 'Displays', 'Monitor', 'شاشات قيمنق وملحقاتها', 'Gaming Monitors and Accessories', '#ec4899', 'from-pink-500 to-pink-700', 3),
('معدات البث', 'Streaming Gear', 'Video', 'كاميرات، مايكروفونات', 'Cameras, Microphones', '#f59e0b', 'from-amber-500 to-amber-700', 4),
('ملحقات السيتب', 'Setup Accessories', 'Zap', 'إضاءة، حوامل، محولات', 'Lighting, Stands, Adapters', '#10b981', 'from-green-500 to-green-700', 5),
('التجميعات الجاهزة', 'Ready Builds', 'Box', 'أجهزة مجمعة جاهزة', 'Pre-built PCs', '#ef4444', 'from-red-500 to-red-700', 6);

-- الأقسام الفرعية (تُضاف بعد إنشاء الأقسام الرئيسية)
WITH cat AS (SELECT id, name_en FROM categories)
INSERT INTO public.subcategories (category_id, name, name_en, icon, description, description_en, sort_order)
SELECT 
  cat.id,
  sub.name,
  sub.name_en,
  sub.icon,
  sub.description,
  sub.description_en,
  sub.sort_order
FROM cat,
LATERAL (VALUES
  -- قطع الكمبيوتر
  ('PC Components', 'المعالجات', 'Processors', 'Cpu', 'معالجات Intel و AMD', 'Intel and AMD Processors', 1),
  ('PC Components', 'كروت الشاشة', 'Graphics Cards', 'Layers', 'NVIDIA و AMD', 'NVIDIA and AMD GPUs', 2),
  ('PC Components', 'الرامات', 'Memory (RAM)', 'MemoryStick', 'ذاكرة الوصول العشوائي', 'Random Access Memory', 3),
  ('PC Components', 'التخزين', 'Storage', 'HardDrive', 'SSD و HDD', 'SSDs and HDDs', 4),
  ('PC Components', 'اللوحات الأم', 'Motherboards', 'CircuitBoard', 'لوحات أم للبناء', 'Motherboards for Building', 5),
  ('PC Components', 'مزودات الطاقة', 'Power Supply', 'Zap', 'مزودات الطاقة PSU', 'Power Supply Units', 6),
  ('PC Components', 'التبريد', 'Cooling', 'Fan', 'مراوح ومبردات', 'Fans and Coolers', 7),
  ('PC Components', 'الكيسات', 'Cases', 'Box', 'كيسات الكمبيوتر', 'PC Cases', 8),
  -- الملحقات
  ('Peripherals', 'لوحات المفاتيح', 'Keyboards', 'Keyboard', 'لوحات مفاتيح ميكانيكية', 'Mechanical Keyboards', 1),
  ('Peripherals', 'الماوس', 'Mice', 'Mouse', 'ماوس قيمنق', 'Gaming Mice', 2),
  ('Peripherals', 'السماعات', 'Headsets', 'Headphones', 'سماعات رأس قيمنق', 'Gaming Headsets', 3),
  ('Peripherals', 'ماوس باد', 'Mouse Pads', 'Square', 'ماوس باد قيمنق', 'Gaming Mouse Pads', 4),
  -- الشاشات
  ('Displays', 'الشاشات', 'Gaming Monitors', 'Monitor', 'شاشات قيمنق', 'Gaming Monitors', 1),
  ('Displays', 'ملحقات الشاشة', 'Monitor Accessories', 'MonitorDot', 'لايت بار وحوامل', 'Light Bars and Mounts', 2),
  -- معدات البث
  ('Streaming Gear', 'الكاميرات', 'Cameras', 'Camera', 'كاميرات ويب للبث', 'Webcams for Streaming', 1),
  ('Streaming Gear', 'المايكروفونات', 'Microphones', 'Mic', 'مايكروفونات احترافية', 'Professional Microphones', 2),
  -- ملحقات السيتب
  ('Setup Accessories', 'الإضاءة', 'Lighting', 'Lightbulb', 'إضاءة RGB', 'RGB Lighting', 1),
  ('Setup Accessories', 'الحوامل', 'Stands', 'Smartphone', 'حوامل الأجهزة', 'Device Stands', 2),
  ('Setup Accessories', 'المحولات', 'Adapters', 'Plug', 'محولات USB ومحولات', 'USB Hubs and Adapters', 3),
  ('Setup Accessories', 'الأكسسوارات الذكية', 'Smart Accessories', 'Sparkles', 'أجهزة ذكية', 'Smart Devices', 4),
  ('Setup Accessories', 'الكراسي', 'Chairs', 'Armchair', 'كراسي قيمنق', 'Gaming Chairs', 5),
  ('Setup Accessories', 'يدات التحكم', 'Controllers', 'Gamepad2', 'يدات قيمنق', 'Gaming Controllers', 6),
  -- التجميعات الجاهزة
  ('Ready Builds', 'تجميعات PC', 'PC Builds', 'Pc', 'أجهزة PC جاهزة', 'Pre-built PCs', 1)
) AS sub(parent_name, name, name_en, icon, description, description_en, sort_order)
WHERE cat.name_en = sub.parent_name;

-- ✅ تم! الآن صفحة الأقسام ستعمل بشكل صحيح
