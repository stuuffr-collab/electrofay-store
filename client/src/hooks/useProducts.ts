import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabaseClient';
import { Product } from '@/components/ProductCard';

export async function fetchProducts(): Promise<Product[]> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('is_active', true)
      .eq('in_stock', true);

    if (error) {
      console.error('خطأ أثناء جلب المنتجات من Supabase:', error);
      // Fallback to local products data
      const { default: localProducts } = await import('@/data/products.json');
      return localProducts as Product[];
    }

    // Transform Supabase data to match the Product interface
    return data.map((item: any) => ({
      id: item.id,
      name: item.name,
      nameEn: item.name_en,
      description: item.description,
      descriptionEn: item.description_en,
      price: parseFloat(item.price),
      originalPrice: item.original_price ? parseFloat(item.original_price) : null,
      category: item.category as 'gaming' | 'electronics',
      image: item.image,
      rating: parseFloat(item.rating),
      badges: item.badges || [],
      inStock: item.in_stock,
      stockCount: item.stock_count
    }));
  } catch (error) {
    console.error('خطأ في الاتصال مع قاعدة البيانات:', error);
    // Fallback to local products data
    const { default: localProducts } = await import('@/data/products.json');
    return localProducts as Product[];
  }
}

export function useProducts() {
  return useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

export function useProductsByCategory(category: string) {
  return useQuery({
    queryKey: ['products', 'category', category],
    queryFn: async () => {
      const products = await fetchProducts();
      return products.filter(product => product.category === category);
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}