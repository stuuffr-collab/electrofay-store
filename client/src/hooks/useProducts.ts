import { useQuery } from '@tanstack/react-query';
import { fetchPricedProducts, type PricedProduct } from '@/lib/pricingService';
import { Product } from '@/components/ProductCard';

export async function fetchProducts(): Promise<Product[]> {
  try {
    console.log('🔍 Fetching products from Supabase with dynamic pricing...');
    
    // Try to fetch products from Supabase with dynamic pricing
    const pricedProducts = await fetchPricedProducts();

    if (pricedProducts && pricedProducts.length > 0) {
      console.log(`✅ تم تحميل ${pricedProducts.length} منتج من Supabase مع التسعير الديناميكي!`);
      
      // Transform PricedProduct to Product interface
      const transformedProducts: Product[] = pricedProducts.map(item => ({
        id: item.id,
        name: item.name,
        nameEn: item.nameEn,
        description: item.description,
        descriptionEn: item.descriptionEn,
        price: item.displayPriceLyd, // Use dynamically calculated LYD price
        originalPrice: null, // No longer using original price
        category: item.category as Product['category'],
        image: item.image,
        rating: item.rating,
        badges: item.badges || [],
        inStock: item.inStock,
        stockCount: item.stockCount
      }));

      return transformedProducts;
    }

    // Fallback to local data if no products in database
    console.log('لا توجد منتجات في Supabase، سيتم استخدام البيانات المحلية');
    
    // Import local data as fallback
    try {
      const { default: localProducts } = await import('@/data/products.json');
      return localProducts as Product[];
    } catch (error) {
      return [];
    }
    
  } catch (error) {
    console.error('حدث خطأ أثناء تحميل المنتجات من Supabase:', error);
    console.log('سيتم استخدام البيانات المحلية كبديل');
    
    // Import local data as fallback
    try {
      const { default: localProducts } = await import('@/data/products.json');
      return localProducts as Product[];
    } catch (error) {
      return [];
    }
  }
}

export function useProducts() {
  return useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
    staleTime: 2 * 60 * 1000, // 2 minutes (shorter because prices can change)
    retry: 2,
  });
}

export function useProductsByCategory(category: string) {
  return useQuery({
    queryKey: ['products', 'category', category],
    queryFn: async () => {
      const products = await fetchProducts();
      return products.filter(product => product.category === category);
    },
    staleTime: 2 * 60 * 1000,
    retry: 2,
  });
}