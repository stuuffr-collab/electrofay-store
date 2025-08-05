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
    category TEXT NOT NULL CHECK (category IN ('gaming', 'electronics')),
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

-- Insert sample products data
INSERT INTO public.products (id, name, name_en, description, description_en, price, original_price, category, image, rating, badges, in_stock, stock_count, is_active) VALUES
('kb001', 'لوحة مفاتيح RGB احترافية', 'RGB Gaming Keyboard', 'لوحة مفاتيح ميكانيكية مع إضاءة RGB قابلة للتخصيص', 'Mechanical keyboard with customizable RGB lighting', 180, 240, 'gaming', 'https://images.unsplash.com/photo-1541140532154-b024d705b90a?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300', 4.8, ARRAY['خصم 25%', 'جديد'], true, 15, true),
('mouse001', 'فأرة قيمنج احترافية', 'Professional Gaming Mouse', 'فأرة بصرية عالية الدقة 12000 DPI مع إضاءة RGB', 'High precision optical mouse 12000 DPI with RGB lighting', 95, NULL, 'gaming', 'https://images.unsplash.com/photo-1527814050087-3793815479db?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300', 4.6, ARRAY['متبقي 3 قطع'], true, 3, true),
('speaker001', 'سماعة ذكية', 'Smart Speaker', 'سماعة ذكية مع تحكم صوتي وجودة صوت عالية', 'Smart speaker with voice control and high sound quality', 220, NULL, 'electronics', 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300', 4.9, ARRAY['الأكثر مبيعاً'], true, 8, true),
('charger001', 'شاحن لاسلكي سريع', 'Fast Wireless Charger', 'شاحن لاسلكي سريع 15W متوافق مع جميع الهواتف', 'Fast wireless charger 15W compatible with all phones', 65, NULL, 'electronics', 'https://images.unsplash.com/photo-1583394838336-acd977736f90?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300', 4.7, ARRAY['صديق للبيئة'], true, 12, true),
('headset001', 'سماعة رأس قيمنج', 'Gaming Headset', 'سماعة رأس احترافية مع ميكروفون وإلغاء الضوضاء', 'Professional headset with microphone and noise cancellation', 150, 200, 'gaming', 'https://images.unsplash.com/photo-1599669454699-248893623440?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300', 4.5, ARRAY['خصم 25%'], true, 7, true),
('controller001', 'جهاز تحكم لاسلكي', 'Wireless Controller', 'جهاز تحكم لاسلكي متوافق مع أجهزة متعددة', 'Wireless controller compatible with multiple devices', 120, NULL, 'gaming', 'https://images.unsplash.com/photo-1592840496694-26d035b52b48?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300', 4.4, ARRAY['متوافق مع PC/PS/Xbox'], true, 10, true),
('camera001', 'كاميرا ويب 4K', '4K Webcam', 'كاميرا ويب عالية الدقة 4K للتيارات المباشرة والاجتماعات', '4K high definition webcam for streaming and meetings', 180, 250, 'electronics', 'https://images.unsplash.com/photo-1587020783486-7d1b9b7a7d69?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300', 4.6, ARRAY['خصم 28%'], true, 6, true),
('powerbank001', 'بوربانك سريع الشحن', 'Fast Charging Power Bank', 'بوربانك 20000mAh مع شحن سريع وشاشة LED', '20000mAh power bank with fast charging and LED display', 85, NULL, 'electronics', 'https://images.unsplash.com/photo-1609592100955-59b3790b7b83?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300', 4.3, ARRAY['ضمان سنتين'], true, 20, true)
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