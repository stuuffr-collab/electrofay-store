import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase-stable';
import { Product } from '@/components/ProductCard';

export async function fetchProducts(): Promise<Product[]> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('is_active', true)
      .eq('in_stock', true);

    if (error) {
      // Fallback to local products data (no console logging)
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
      category: item.category as "gaming_accessory" | "gaming_pc" | "gaming_console" | "streaming_gear",
      image: item.image,
      rating: parseFloat(item.rating),
      badges: item.badges || [],
      inStock: item.in_stock,
      stockCount: item.stock_count
    }));
  } catch (error) {
    // Fallback to local products data (no console logging)
    const { default: localProducts } = await import('@/data/products.json');
    return localProducts as Product[];
  }
}

export function useProducts() {
  return useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
    staleTime: 30 * 60 * 1000, // 30 minutes (reduce API calls)
    gcTime: 60 * 60 * 1000, // 1 hour
    refetchOnWindowFocus: false, // Prevent refetch on focus
    refetchOnReconnect: false, // Prevent refetch on reconnect
  });
}

export function useProductsByCategory(category: string) {
  return useQuery({
    queryKey: ['products', 'category', category],
    queryFn: async () => {
      const products = await fetchProducts();
      return products.filter(product => product.category === category);
    },
    staleTime: 30 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
}