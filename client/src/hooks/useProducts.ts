import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase-stable';
import { Product } from '@/components/ProductCard';

export async function fetchProducts(): Promise<Product[]> {
  try {
    // Always use local data for now to prevent refresh issues
    const { default: localProducts } = await import('@/data/products.json');
    return localProducts as Product[];
  } catch (error) {
    // Return empty array if local data fails
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