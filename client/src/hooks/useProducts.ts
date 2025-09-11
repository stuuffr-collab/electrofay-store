import { useQuery } from '@tanstack/react-query';
import { fetchProductsFromAPI, type ApiProduct } from '@/lib/apiService';
import { Product } from '@/components/ProductCard';

export async function fetchProducts(): Promise<Product[]> {
  try {
    console.log('🔍 Fetching products from local API...');
    
    // Try to fetch products from local API
    const apiProducts = await fetchProductsFromAPI();

    if (apiProducts && apiProducts.length > 0) {
      console.log(`✅ تم تحميل ${apiProducts.length} منتج من API المحلي مع التسعير الديناميكي!`);
      
      // Transform ApiProduct to Product interface
      const transformedProducts: Product[] = apiProducts.map(item => ({
        id: item.id,
        name: item.name,
        nameEn: item.nameEn,
        description: item.description,
        descriptionEn: item.descriptionEn,
        price: item.displayPriceLyd, // Use dynamically calculated LYD price
        originalPrice: item.originalPrice || null,
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
    console.log('لا توجد منتجات في قاعدة البيانات، سيتم استخدام البيانات المحلية');
    
    // Import local data as fallback
    try {
      const { default: localProducts } = await import('@/data/products.json');
      return localProducts as Product[];
    } catch (error) {
      return [];
    }
    
  } catch (error) {
    console.error('حدث خطأ أثناء تحميل المنتجات من API:', error);
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