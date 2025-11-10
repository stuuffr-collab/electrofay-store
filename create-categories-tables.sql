-- Create categories and subcategories tables for Supabase
-- Based on the Drizzle schema in shared/schema.ts

-- Create categories table
CREATE TABLE IF NOT EXISTS public.categories (
  id TEXT PRIMARY KEY,
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

-- Create subcategories table
CREATE TABLE IF NOT EXISTS public.subcategories (
  id TEXT PRIMARY KEY,
  category_id TEXT NOT NULL,
  name TEXT NOT NULL,
  name_en TEXT NOT NULL,
  icon TEXT NOT NULL,
  description TEXT NOT NULL,
  description_en TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT fk_category FOREIGN KEY (category_id) REFERENCES public.categories(id) ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_categories_sort_order ON public.categories(sort_order);
CREATE INDEX IF NOT EXISTS idx_categories_is_active ON public.categories(is_active);
CREATE INDEX IF NOT EXISTS idx_subcategories_category_id ON public.subcategories(category_id);
CREATE INDEX IF NOT EXISTS idx_subcategories_sort_order ON public.subcategories(sort_order);
CREATE INDEX IF NOT EXISTS idx_subcategories_is_active ON public.subcategories(is_active);

-- Enable Row Level Security
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subcategories ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Enable read access for all users" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON public.subcategories FOR SELECT USING (true);

-- Insert default categories
INSERT INTO public.categories (id, name, name_en, icon, description, description_en, color, gradient, sort_order, is_active) VALUES
('pc-components', 'قطع الكمبيوتر', 'PC Components', 'Cpu', 'معالجات، كروت شاشة، رامات، وحدات تخزين', 'Processors, Graphics Cards, RAM, Storage', '#3b82f6', 'from-blue-500 to-blue-700', 1, true),
('peripherals', 'الملحقات', 'Peripherals', 'Mouse', 'لوحات مفاتيح، ماوس، سماعات', 'Keyboards, Mice, Headsets', '#8b5cf6', 'from-purple-500 to-purple-700', 2, true),
('displays', 'الشاشات', 'Displays', 'Monitor', 'شاشات قيمنق وملحقاتها', 'Gaming Monitors and Accessories', '#ec4899', 'from-pink-500 to-pink-700', 3, true),
('streaming-gear', 'معدات البث', 'Streaming Gear', 'Video', 'كاميرات، مايكروفونات', 'Cameras, Microphones', '#f59e0b', 'from-amber-500 to-amber-700', 4, true),
('setup-accessories', 'ملحقات السيتب', 'Setup Accessories', 'Zap', 'إضاءة، حوامل، محولات', 'Lighting, Stands, Adapters', '#10b981', 'from-green-500 to-green-700', 5, true),
('ready-builds', 'التجميعات الجاهزة', 'Ready Builds', 'Box', 'أجهزة مجمعة جاهزة', 'Pre-built PCs', '#ef4444', 'from-red-500 to-red-700', 6, true)
ON CONFLICT (id) DO NOTHING;

-- Insert default subcategories
INSERT INTO public.subcategories (id, category_id, name, name_en, icon, description, description_en, sort_order, is_active) VALUES
-- PC Components
('processors', 'pc-components', 'المعالجات', 'Processors', 'Cpu', 'معالجات Intel و AMD', 'Intel and AMD Processors', 1, true),
('graphics-cards', 'pc-components', 'كروت الشاشة', 'Graphics Cards', 'Layers', 'NVIDIA و AMD', 'NVIDIA and AMD GPUs', 2, true),
('memory', 'pc-components', 'الرامات', 'Memory (RAM)', 'MemoryStick', 'ذاكرة الوصول العشوائي', 'Random Access Memory', 3, true),
('storage', 'pc-components', 'التخزين', 'Storage', 'HardDrive', 'SSD و HDD', 'SSDs and HDDs', 4, true),
('motherboards', 'pc-components', 'اللوحات الأم', 'Motherboards', 'CircuitBoard', 'لوحات أم للبناء', 'Motherboards for Building', 5, true),
('power-supply', 'pc-components', 'مزودات الطاقة', 'Power Supply', 'Zap', 'مزودات الطاقة PSU', 'Power Supply Units', 6, true),
('cooling', 'pc-components', 'التبريد', 'Cooling', 'Fan', 'مراوح ومبردات', 'Fans and Coolers', 7, true),
('cases', 'pc-components', 'الكيسات', 'Cases', 'Box', 'كيسات الكمبيوتر', 'PC Cases', 8, true),

-- Peripherals
('keyboards', 'peripherals', 'لوحات المفاتيح', 'Keyboards', 'Keyboard', 'لوحات مفاتيح ميكانيكية', 'Mechanical Keyboards', 1, true),
('mice', 'peripherals', 'الماوس', 'Mice', 'Mouse', 'ماوس قيمنق', 'Gaming Mice', 2, true),
('headsets', 'peripherals', 'السماعات', 'Headsets', 'Headphones', 'سماعات رأس قيمنق', 'Gaming Headsets', 3, true),
('mouse-pads', 'peripherals', 'ماوس باد', 'Mouse Pads', 'Square', 'ماوس باد قيمنق', 'Gaming Mouse Pads', 4, true),

-- Displays
('gaming-monitors', 'displays', 'الشاشات', 'Gaming Monitors', 'Monitor', 'شاشات قيمنق', 'Gaming Monitors', 1, true),
('monitor-accessories', 'displays', 'ملحقات الشاشة', 'Monitor Accessories', 'MonitorDot', 'لايت بار وحوامل', 'Light Bars and Mounts', 2, true),

-- Streaming Gear
('cameras', 'streaming-gear', 'الكاميرات', 'Cameras', 'Camera', 'كاميرات ويب للبث', 'Webcams for Streaming', 1, true),
('microphones', 'streaming-gear', 'المايكروفونات', 'Microphones', 'Mic', 'مايكروفونات احترافية', 'Professional Microphones', 2, true),

-- Setup Accessories
('lighting', 'setup-accessories', 'الإضاءة', 'Lighting', 'Lightbulb', 'إضاءة RGB', 'RGB Lighting', 1, true),
('stands', 'setup-accessories', 'الحوامل', 'Stands', 'Smartphone', 'حوامل الأجهزة', 'Device Stands', 2, true),
('adapters', 'setup-accessories', 'المحولات', 'Adapters', 'Plug', 'محولات USB ومحولات', 'USB Hubs and Adapters', 3, true),
('smart-accessories', 'setup-accessories', 'الأكسسوارات الذكية', 'Smart Accessories', 'Sparkles', 'أجهزة ذكية', 'Smart Devices', 4, true),
('chairs', 'setup-accessories', 'الكراسي', 'Chairs', 'Armchair', 'كراسي قيمنق', 'Gaming Chairs', 5, true),
('controllers', 'setup-accessories', 'يدات التحكم', 'Controllers', 'Gamepad2', 'يدات قيمنق', 'Gaming Controllers', 6, true),

-- Ready Builds
('pc-builds', 'ready-builds', 'تجميعات PC', 'PC Builds', 'Pc', 'أجهزة PC جاهزة', 'Pre-built PCs', 1, true)
ON CONFLICT (id) DO NOTHING;

-- Create trigger function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_categories_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_categories_timestamp
  BEFORE UPDATE ON public.categories
  FOR EACH ROW
  EXECUTE FUNCTION update_categories_updated_at();

CREATE TRIGGER update_subcategories_timestamp
  BEFORE UPDATE ON public.subcategories
  FOR EACH ROW
  EXECUTE FUNCTION update_categories_updated_at();
