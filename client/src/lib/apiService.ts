// API service for connecting to local backend
export interface ApiProduct {
  id: string;
  name: string;
  nameEn: string;
  description: string;
  descriptionEn: string;
  basePriceUsd: number;
  displayPriceLyd: number;
  originalPrice?: number;
  category: string;
  image: string;
  rating: number;
  badges: string[];
  inStock: boolean;
  stockCount: number;
  usdToLydRate: number;
}

// Fetch products with dynamic pricing from local API
export async function fetchProductsFromAPI(): Promise<ApiProduct[]> {
  try {
    console.log('🔍 Fetching products from local API...');
    
    const response = await fetch('/api/products');
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const products = await response.json();
    console.log(`✅ Loaded ${products.length} products from local API`);
    
    return products;
  } catch (error) {
    console.error('Failed to fetch products from API:', error);
    return [];
  }
}

// Fetch exchange rate from local API
export async function fetchExchangeRateFromAPI(): Promise<number> {
  try {
    const response = await fetch('/api/settings/usd_to_lyd_rate');
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    // Handle new JSONB format with rate field
    return data.rate || 5.10;
  } catch (error) {
    console.error('Failed to fetch exchange rate from API:', error);
    return 5.10; // Fallback rate
  }
}