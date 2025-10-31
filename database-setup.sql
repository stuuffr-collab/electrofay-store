-- Supabase Database Setup for إلكتروفاي - Electrofy Store
-- Run this SQL in your Supabase SQL Editor

-- Enable UUID extension for generating IDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create products table
CREATE TABLE IF NOT EXISTS public.products (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    name_en TEXT NOT NULL,
    description TEXT NOT NULL,
    description_en TEXT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    original_price DECIMAL(10, 2),
    category TEXT NOT NULL CHECK (category IN ('gaming_accessory', 'gaming_pc', 'gaming_console', 'streaming_gear')),
    image TEXT NOT NULL,
    rating DECIMAL(3, 2) NOT NULL DEFAULT 0,
    badges TEXT[] DEFAULT '{}',
    in_stock BOOLEAN NOT NULL DEFAULT true,
    stock_count INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create orders table
CREATE TABLE IF NOT EXISTS public.orders (
    id SERIAL PRIMARY KEY,
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    customer_city TEXT NOT NULL,
    customer_address TEXT NOT NULL,
    order_notes TEXT,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'delivered', 'cancelled')),
    total_amount DECIMAL(10, 2) NOT NULL,
    delivery_fee DECIMAL(10, 2) NOT NULL DEFAULT 0,
    items TEXT NOT NULL, -- JSON string containing cart items
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create cities table
CREATE TABLE IF NOT EXISTS public.cities (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    name_en TEXT NOT NULL,
    delivery_fee DECIMAL(10, 2) NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true
);

-- Create contact_messages table
CREATE TABLE IF NOT EXISTS public.contact_messages (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    city TEXT NOT NULL,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'read', 'replied')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create admin_users table for dashboard access
CREATE TABLE IF NOT EXISTS public.admin_users (
    id SERIAL PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    username TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'admin',
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    last_login TIMESTAMP WITH TIME ZONE
);

-- Create storage bucket for product images
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- Set up RLS (Row Level Security) policies for public access to products
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access to active products" ON public.products
    FOR SELECT USING (is_active = true);

-- Allow public read access to cities
ALTER TABLE public.cities ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access to active cities" ON public.cities
    FOR SELECT USING (is_active = true);

-- Allow public insert to orders (customers can place orders)
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public insert to orders" ON public.orders
    FOR INSERT WITH CHECK (true);

-- Allow public insert to contact messages
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public insert to contact messages" ON public.contact_messages
    FOR INSERT WITH CHECK (true);

-- Enable RLS for admin_users (only admins can access)
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Storage policy for product images
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'product-images');
CREATE POLICY "Public Upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'product-images');

-- Insert sample Libyan cities with delivery fees
INSERT INTO public.cities (name, name_en, delivery_fee, is_active) VALUES
('طرابلس', 'Tripoli', 0, true),
('بنغازي', 'Benghazi', 15, true),
('مصراتة', 'Misrata', 10, true),
('الزاوية', 'Zawiya', 5, true),
('البيضاء', 'Al Bayda', 20, true),
('غريان', 'Gharyan', 8, true),
('صبراتة', 'Sabratha', 12, true),
('الخمس', 'Al Khums', 10, true),
('زليتن', 'Zliten', 12, true),
('أجدابيا', 'Ajdabiya', 25, true),
('ترهونة', 'Tarhuna', 8, true),
('نالوت', 'Nalut', 30, true),
('سرت', 'Sirte', 20, true),
('سبها', 'Sabha', 35, true),
('درنة', 'Derna', 30, true),
('توكرة', 'Tocra', 25, true),
('رجدالين', 'Rajdalin', 15, true),
('يفرن', 'Yafran', 15, true),
('زوارة', 'Zuwarah', 18, true),
('الجميل', 'Al Jamil', 12, true),
('القره بوللي', 'Qasr Ahmad', 20, true),
('تاجوراء', 'Tajoura', 5, true),
('العزيزية', 'Al Aziziyah', 8, true)
ON CONFLICT DO NOTHING;

-- Insert default admin account
-- Username: admin
-- Password: admin123
-- IMPORTANT: Change the password after first login
INSERT INTO public.admin_users (email, username, password_hash, role, is_active) VALUES
('admin@electrofy.ly', 'admin', '$2a$10$rOvHPZQxlhXQH0KXLnU8l.xN3C/YJ7LrT8zGF0kYXzFW2k4UqvKSK', 'admin', true)
ON CONFLICT (username) DO UPDATE
SET password_hash = EXCLUDED.password_hash,
    is_active = true;

-- Insert sample gaming products data
INSERT INTO public.products (id, name, name_en, description, description_en, price, original_price, category, image, rating, badges, in_stock, stock_count, is_active) VALUES
('kb001', 'لوحة مفاتيح RGB ميكانيكية', 'RGB Mechanical Gaming Keyboard', 'لوحة مفاتيح ميكانيكية احترافية مع إضاءة RGB قابلة للتخصيص ومفاتيح براون', 'Professional mechanical keyboard with customizable RGB lighting and brown switches', 320, 450, 'gaming_accessory', 'https://images.unsplash.com/photo-1541140532154-b024d705b90a?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300', 4.8, ARRAY['خصم 29%', 'جديد'], true, 15, true),
('mouse001', 'ماوس قيمنج RGB عالي الدقة', 'RGB Gaming Mouse Pro', 'ماوس قيمنج بصري عالي الدقة 25600 DPI مع 11 زر قابل للبرمجة وإضاءة RGB', 'High precision gaming mouse 25600 DPI with 11 programmable buttons and RGB lighting', 180, NULL, 'gaming_accessory', 'https://images.unsplash.com/photo-1527814050087-3793815479db?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300', 4.9, ARRAY['متبقي 3 قطع'], true, 3, true),
('headset001', 'سماعة رأس قيمنج 7.1', 'Gaming Headset 7.1 Surround', 'سماعة رأس قيمنج احترافية مع صوت محيطي 7.1 وميكروفون مزود بإلغاء الضوضاء', 'Professional gaming headset with 7.1 surround sound and noise-canceling microphone', 280, 350, 'gaming_accessory', 'https://images.unsplash.com/photo-1599669454699-248893623440?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300', 4.7, ARRAY['خصم 20%'], true, 7, true),
('controller001', 'جهاز تحكم قيمنج لاسلكي', 'Wireless Gaming Controller Pro', 'جهاز تحكم لاسلكي احترافي متوافق مع PC/PS5/Xbox مع اهتزاز ومقابض مطاطية', 'Professional wireless controller compatible with PC/PS5/Xbox with vibration and rubber grips', 220, NULL, 'gaming_console', 'https://images.unsplash.com/photo-1592840496694-26d035b52b48?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300', 4.6, ARRAY['متوافق مع جميع المنصات'], true, 10, true),
('monitor001', 'شاشة قيمنج منحنية 27 بوصة', '27" Curved Gaming Monitor', 'شاشة قيمنج منحنية 27 بوصة 144Hz مع تقنية FreeSync وإضاءة RGB خلفية', '27-inch curved gaming monitor 144Hz with FreeSync technology and RGB backlight', 850, 1200, 'gaming_pc', 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300', 4.8, ARRAY['خصم 29%', 'الأكثر مبيعاً'], true, 5, true),
('chair001', 'كرسي قيمنج احترافي', 'Professional Gaming Chair', 'كرسي قيمنج احترافي مع دعم قطني وأذرع قابلة للتعديل وجلد عالي الجودة', 'Professional gaming chair with lumbar support, adjustable armrests and high-quality leather', 650, NULL, 'gaming_accessory', 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300', 4.5, ARRAY['ضمان 3 سنوات'], true, 8, true),
('webcam001', 'كاميرا ستريمر 4K', 'Streamer Webcam 4K Pro', 'كاميرا ويب 4K احترافية للستريمر مع مايك مدمج وتصحيح ألوان تلقائي', 'Professional 4K webcam for streamers with built-in mic and auto color correction', 380, 500, 'streaming_gear', 'https://images.unsplash.com/photo-1587020783486-7d1b9b7a7d69?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300', 4.7, ARRAY['خصم 24%'], true, 6, true),
('microphone001', 'مايكروفون ستريمر احترافي', 'Professional Streaming Microphone', 'مايكروفون USB احترافي للستريمر مع فلتر صوتي وحامل قابل للتعديل', 'Professional USB microphone for streamers with audio filter and adjustable stand', 420, NULL, 'streaming_gear', 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300', 4.9, ARRAY['اختيار الستريمرز'], true, 12, true),
('pc001', 'تجميعة PC قيمنج احترافية', 'Professional Gaming PC Build', 'تجميعة PC قيمنج احترافية مع RTX 4070 ومعالج AMD Ryzen 7 و32GB RAM', 'Professional gaming PC build with RTX 4070, AMD Ryzen 7 processor and 32GB RAM', 2800, 3500, 'gaming_pc', 'https://images.unsplash.com/photo-1587831990711-23ca6441447b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300', 4.9, ARRAY['خصم 20%', 'جاهز للتشغيل'], true, 2, true),
('pad001', 'ماوس باد قيمنج كبير RGB', 'Large RGB Gaming Mouse Pad', 'ماوس باد قيمنج كبير الحجم مع إضاءة RGB وسطح مقاوم للماء', 'Large gaming mouse pad with RGB lighting and water-resistant surface', 85, NULL, 'gaming_accessory', 'https://images.unsplash.com/photo-1616790264687-b7ebf74188dd?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300', 4.4, ARRAY['حجم XXL'], true, 25, true),
('laptop001', 'لابتوب قيمنج 15.6 بوصة', 'Gaming Laptop 15.6"', 'لابتوب قيمنج 15.6 بوصة مع RTX 4060 ومعالج Intel i7 وشاشة 144Hz', 'Gaming laptop 15.6" with RTX 4060, Intel i7 processor and 144Hz display', 2200, 2800, 'gaming_pc', 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300', 4.6, ARRAY['خصم 21%'], true, 4, true)
ON CONFLICT (id) DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category);
CREATE INDEX IF NOT EXISTS idx_products_active ON public.products(is_active);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at);

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers to automatically update updated_at
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON public.products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON public.orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();