import { supabase } from './supabaseClient';

export interface PricedProduct {
  id: string;
  name: string;
  nameEn: string;
  description: string;
  descriptionEn: string;
  basePriceUsd: number;
  displayPriceLyd: number;
  category: string;
  categoryId?: string | null;
  subcategoryId?: string | null;
  image: string;
  inStock: boolean;
  stockCount: number;
  usdToLydRate: number;
  createdAt: string;
}

// Round LYD prices to nearest whole number (no decimals)
function roundLYD(value: number): number {
  return Math.round(value);
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

    // Parse JSON object format: { rate: number }
    let rate = 5.0;
    try {
      if (data?.value && typeof data.value === 'object' && 'rate' in data.value) {
        rate = Number(data.value.rate);
      } else if (typeof data?.value === 'string') {
        const parsed = JSON.parse(data.value);
        rate = Number(parsed.rate);
      } else if (typeof data?.value === 'number') {
        rate = data.value; // Fallback for direct number storage
      }
    } catch (parseError) {
      console.warn('⚠️ Error parsing exchange rate JSON:', parseError);
    }

    return rate > 0 ? rate : 5.0; // Ensure valid rate
  } catch (error) {
    console.error('Error fetching exchange rate:', error);
    return 5.0; // Fallback rate
  }
}

// Fetch products with calculated LYD prices
export async function fetchPricedProducts(): Promise<PricedProduct[]> {
  try {
    console.log('📊 Fetching products and exchange rate from Supabase...');

    // Fetch products and exchange rate in parallel
    const [productsResult, rate] = await Promise.all([
      supabase
        .from('products')
        .select('id, name, name_en, description, description_en, base_price_usd, category, category_id, subcategory_id, image, in_stock, stock_count, created_at')
        .eq('is_active', true)
        .order('created_at', { ascending: false }),
      fetchExchangeRate()
    ]) as [any, number];

    const { data: products, error } = productsResult;

    if (error) {
      console.error('❌ Supabase error fetching products:', error);
      return [];
    }

    if (!products || products.length === 0) {
      console.log('⚠️ No products found in Supabase. Please run the SQL setup script.');
      return [];
    }

    console.log(`✅ Fetched ${products.length} products from Supabase`);

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
        category: product.category,
        categoryId: product.category_id,
        subcategoryId: product.subcategory_id,
        image: product.image,
        inStock: product.in_stock,
        stockCount: product.stock_count,
        usdToLydRate: rate,
        createdAt: product.created_at
      };
    });
  } catch (error) {
    console.error('💥 Error in fetchPricedProducts:', error);
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
        value: { rate: newRate } // Store as JSON object
      });

    if (error) {
      console.error('Failed to update exchange rate:', error);
      return false;
    }

    console.log(`✅ Updated exchange rate to ${newRate}`);
    return true;
  } catch (error) {
    console.error('Error updating exchange rate:', error);
    return false;
  }
}