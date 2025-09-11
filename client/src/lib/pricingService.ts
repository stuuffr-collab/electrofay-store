import { supabase } from './supabaseClient';

export interface PricedProduct {
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

// Round LYD prices to nearest 0.5 (or your preferred step)
function roundLYD(value: number): number {
  const step = 0.5;
  return Math.round(value / step) * step;
}

// Fetch exchange rate from settings
export async function fetchExchangeRate(): Promise<number> {
  try {
    const { data, error } = await supabase
      .from('settings')
      .select('value')
      .eq('key', 'usd_to_lyd_rate')
      .single();
    
    if (error) {
      console.error('Failed to fetch exchange rate:', error);
      return 5.0; // Fallback rate
    }
    
    const rate = Number(data?.value) || parseFloat(String(data?.value));
    return rate || 5.0; // Fallback rate
  } catch (error) {
    console.error('Error fetching exchange rate:', error);
    return 5.0; // Fallback rate
  }
}

// Fetch products with calculated LYD prices
export async function fetchPricedProducts(): Promise<PricedProduct[]> {
  try {
    // Fetch products and exchange rate in parallel
    const [productsResult, rate] = await Promise.all([
      supabase
        .from('products')
        .select('id, name, name_en, description, description_en, base_price_usd, original_price, category, image, rating, badges, in_stock, stock_count')
        .eq('is_active', true),
      fetchExchangeRate()
    ]);

    const { data: products, error } = productsResult;
    
    if (error) {
      console.error('Failed to fetch products:', error);
      return [];
    }

    if (!products) {
      return [];
    }

    // Calculate LYD prices for each product
    return products.map((product: any) => {
      const basePriceUsd = Number(product.base_price_usd || 0);
      const rawLydPrice = basePriceUsd * rate;
      const displayPriceLyd = roundLYD(rawLydPrice);
      
      return {
        id: product.id,
        name: product.name,
        nameEn: product.name_en,
        description: product.description,
        descriptionEn: product.description_en,
        basePriceUsd,
        displayPriceLyd,
        originalPrice: product.original_price ? Number(product.original_price) : undefined,
        category: product.category,
        image: product.image,
        rating: Number(product.rating),
        badges: product.badges || [],
        inStock: product.in_stock,
        stockCount: product.stock_count,
        usdToLydRate: rate
      };
    });
  } catch (error) {
    console.error('Error in fetchPricedProducts:', error);
    return [];
  }
}

// Update exchange rate (admin function)
export async function updateExchangeRate(newRate: number): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('settings')
      .upsert({
        key: 'usd_to_lyd_rate',
        value: newRate
      });
    
    if (error) {
      console.error('Failed to update exchange rate:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error updating exchange rate:', error);
    return false;
  }
}