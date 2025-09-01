import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabaseClient';
import { Product } from '@/components/ProductCard';

export async function fetchProducts(): Promise<Product[]> {
  try {
    // Try to fetch from Supabase first
    const { data: supabaseProducts, error } = await supabase
      .from('products')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (!error && supabaseProducts && supabaseProducts.length > 0) {
      // Convert Supabase data to Product format
      const products: Product[] = supabaseProducts.map((item: any) => ({
        id: item.id,
        name: item.name,
        name_en: item.name_en,
        description: item.description,
        description_en: item.description_en,
        price: parseFloat(item.price),
        originalPrice: item.original_price ? parseFloat(item.original_price) : undefined,
        category: item.category,
        image: item.image,
        rating: parseFloat(item.rating),
        badges: item.badges || [],
        inStock: item.in_stock,
        stockCount: item.stock_count
      }));
      return products;
    }
  } catch (error) {
    console.log('خطأ في تحميل البيانات من Supabase، سيتم استخدام البيانات المحلية');
  }

  // Fallback to local data if Supabase fails
  try {
    const { default: localProducts } = await import('@/data/products.json');
    return localProducts as Product[];
  } catch (error) {
    return [];
  }
}

export function useProducts() {
  return useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
    staleTime: Infinity, // Cache forever
    gcTime: Infinity, // Never garbage collect
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
    retry: false,
  });
}

export function useProductsByCategory(category: string) {
  return useQuery({
    queryKey: ['products', 'category', category],
    queryFn: async () => {
      const products = await fetchProducts();
      return products.filter(product => product.category === category);
    },
    staleTime: Infinity,
    gcTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
    retry: false,
  });
}