import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { db } from "./db";
import { supabase, adminSupabase } from "./supabaseClient";
import { products, settings, orders, categories, subcategories, insertOrderSchema, insertProductSchema, insertCategorySchema, insertSubcategorySchema } from "@shared/schema";
import { eq, desc, sql } from "drizzle-orm";

export async function registerRoutes(app: Express): Promise<Server> {
  // Order management API
  app.post("/api/orders", async (req, res) => {
    try {
      const orderData = req.body;
      
      // Validate required fields structure
      if (!orderData.customerName || !orderData.customerPhone || !orderData.items?.length) {
        return res.status(400).json({ 
          error: 'Missing required fields: customerName, customerPhone, items' 
        });
      }

      // Get current exchange rate for snapshot
      const [settingsResult] = await db.select().from(settings).where(eq(settings.key, 'usd_to_lyd_rate'));
      const exchangeRate = settingsResult ? (settingsResult.value as { rate: number }).rate : 5.10;

      // Prepare order data for database insertion
      const orderToInsert = {
        customerName: orderData.customerName,
        customerPhone: orderData.customerPhone,
        customerCity: orderData.customerCity || '',
        customerAddress: orderData.customerAddress || '',
        orderNotes: orderData.customerNotes || null,
        status: 'pending',
        totalAmount: String(orderData.totalAmount || 0),
        deliveryFee: String(orderData.deliveryFee || 0),
        items: JSON.stringify(orderData.items),
        usdToLydSnapshot: String(exchangeRate)
      };

      // Insert order into database
      const [insertedOrder] = await db.insert(orders).values(orderToInsert).returning();

      console.log('✅ Order saved to database:', {
        orderId: insertedOrder.id,
        customer: orderData.customerName,
        totalAmount: orderData.totalAmount,
        exchangeRate: exchangeRate
      });

      // Return success response with order ID
      res.status(201).json({
        success: true,
        orderId: insertedOrder.id,
        message: 'Order saved successfully',
        exchangeRateUsed: exchangeRate
      });

    } catch (error) {
      console.error('Error saving order:', error);
      res.status(500).json({ 
        error: 'Internal server error' 
      });
    }
  });

  // Round LYD prices to nearest 0.5
  function roundLYD(value: number): number {
    const step = 0.5;
    return Math.round(value / step) * step;
  }

  // Get products with dynamic pricing and smart categorization from Supabase
  app.get("/api/products", async (req, res) => {
    try {
      // Fetch products and exchange rate in parallel from Supabase
      const [productsResult, settingsResult] = await Promise.all([
        supabase.from('products').select('*').eq('is_active', true),
        supabase.from('settings').select('*').eq('key', 'usd_to_lyd_rate').single()
      ]);

      if (productsResult.error) throw productsResult.error;

      // Parse JSONB exchange rate setting
      const exchangeRate = settingsResult.data && settingsResult.data.value 
        ? (settingsResult.data.value as { rate: number }).rate 
        : 5.10;

      // Calculate LYD prices and add smart categorization
      const productsWithPricing = (productsResult.data || []).map((product: any) => {
        const basePriceUsd = parseFloat(String(product.base_price_usd)) || 0;
        const rawLydPrice = basePriceUsd * exchangeRate;
        const displayPriceLyd = roundLYD(rawLydPrice);

        // Smart categorization using categorizeProduct from categories.ts
        // This is calculated dynamically based on product name and description
        const categorization = categorizeProduct({
          name: product.name,
          nameEn: product.name_en,
          description: product.description,
          descriptionEn: product.description_en
        });

        return {
          id: product.id,
          name: product.name,
          nameEn: product.name_en,
          description: product.description,
          descriptionEn: product.description_en,
          basePriceUsd,
          displayPriceLyd,
          category: product.category,
          categoryId: product.category_id || categorization.categoryId,
          subcategoryId: product.subcategory_id || categorization.subcategoryId,
          image: product.image,
          inStock: product.in_stock,
          stockCount: product.stock_count,
          usdToLydRate: exchangeRate
        };
      });

      console.log(`✅ API: Returning ${productsWithPricing.length} products with smart categorization and USD→LYD rate ${exchangeRate}`);
      res.json(productsWithPricing);
    } catch (error) {
      console.error('Error fetching products:', error);
      res.status(500).json({ error: 'Failed to fetch products' });
    }
  });
  
  // Helper function for smart categorization (imported logic from client)
  function categorizeProduct(product: any): { categoryId: string; subcategoryId: string } {
    const name = (product.name?.toLowerCase() || product.nameEn?.toLowerCase() || '');
    const desc = (product.description?.toLowerCase() || product.descriptionEn?.toLowerCase() || '');
    const combined = `${name} ${desc}`;
    
    // Displays - ملحقات شاشة (monitor accessories like light bars) - check first
    if (combined.match(/colorpanda|monitor light|لايت بار/) && combined.match(/monitor|شاشة/)) {
      return { categoryId: 'displays', subcategoryId: 'monitor-accessories' };
    }
    
    // Displays - الشاشات (all monitors - check before other categories)
    if (combined.match(/\bشاشة\b|شاشات|\bmonitor\b|\bdisplay\b|screen|gaming monitor|hz\b|fps\b|curved|ultrawide|ips panel/)) {
      return { categoryId: 'displays', subcategoryId: 'gaming-monitors' };
    }
    
    // PC Components - اللوحات الأم (check before processors)
    if (combined.match(/لوحة أم|motherboard|mainboard/)) {
      return { categoryId: 'pc-components', subcategoryId: 'motherboards' };
    }
    
    // PC Components - المعالجات
    if (combined.match(/معالج|processor|cpu|ryzen|i[3579]|ryzen [3579]/) && !combined.match(/motherboard|لوحة أم/)) {
      return { categoryId: 'pc-components', subcategoryId: 'processors' };
    }
    
    // PC Components - كروت الشاشة
    if (combined.match(/كرت شاشة|graphics|gpu|rtx|gtx|vga|rx [4567]|nvidia|radeon/) && !combined.match(/\bشاشة\b|\bmonitor\b/)) {
      return { categoryId: 'pc-components', subcategoryId: 'graphics-cards' };
    }
    
    // PC Components - الرامات
    if (combined.match(/رام|ذاكرة|ram|ddr[345]|memory|16gb|32gb|8gb/) && !combined.match(/ssd|nvme|hdd|storage/)) {
      return { categoryId: 'pc-components', subcategoryId: 'memory' };
    }
    
    // PC Components - التخزين
    if (combined.match(/تخزين|ssd|nvme|hdd|m\.2|storage|hard disk|500gb|1tb|2tb/)) {
      return { categoryId: 'pc-components', subcategoryId: 'storage' };
    }
    
    // PC Components - مزودات الطاقة
    if (combined.match(/مزود طاقة|power supply|psu|watt|bronze|gold|platinum|[567][05]0w/)) {
      return { categoryId: 'pc-components', subcategoryId: 'power-supply' };
    }
    
    // PC Components - كيس الكمبيوتر
    if (combined.match(/كيس|case|chassis|tower/)) {
      return { categoryId: 'pc-components', subcategoryId: 'cases' };
    }
    
    // PC Components - المبردات (cooling fans)
    if (combined.match(/مبرد|تبريد|مروحة|مراوح|cooler|cooling|fan|liquid|airflow|aio/) && !combined.match(/كيس|case/)) {
      return { categoryId: 'pc-components', subcategoryId: 'cooling' };
    }
    
    // Peripherals - لوحات المفاتيح
    if (combined.match(/كيبورد|لوحة مفاتيح|keyboard|mechanical|rgb keyboard|keychron/)) {
      return { categoryId: 'peripherals', subcategoryId: 'keyboards' };
    }
    
    // Peripherals - الماوس
    if (combined.match(/ماوس(?! باد)|mouse(?! pad)|dpi|wireless mouse|gaming mouse/) && !combined.includes('pad')) {
      return { categoryId: 'peripherals', subcategoryId: 'mice' };
    }
    
    // Peripherals - السماعات
    if (combined.match(/سماعة|سماعات|headset|headphone|hyperx|razer|gaming headset/)) {
      return { categoryId: 'peripherals', subcategoryId: 'headsets' };
    }
    
    // Peripherals - Mouse Pads
    if (combined.match(/ماوس باد|mouse ?pad|mousepad/)) {
      return { categoryId: 'peripherals', subcategoryId: 'mouse-pads' };
    }
    
    // Streaming Gear - الكاميرات
    if (combined.match(/كاميرا|webcam|camera|streaming cam|logitech.*c[97]/)) {
      return { categoryId: 'streaming-gear', subcategoryId: 'cameras' };
    }
    
    // Streaming Gear - المايكروفونات
    if (combined.match(/مايك|ميكروفون|microphone|mic|condenser|blue yeti|usb mic/)) {
      return { categoryId: 'streaming-gear', subcategoryId: 'microphones' };
    }
    
    // Setup Accessories - الكراسي (moved from peripherals)
    if (combined.match(/كرسي|chair|gaming chair|ergonomic|مقعد/)) {
      return { categoryId: 'setup-accessories', subcategoryId: 'chairs' };
    }
    
    // Setup Accessories - الإضاءة (moved from streaming-gear)
    if (combined.match(/led|rgb|إضاءة|light bar|strip|govee|نيون/)) {
      return { categoryId: 'setup-accessories', subcategoryId: 'lighting' };
    }
    
    // Setup Accessories - Controllers (moved from ready-builds)
    if (combined.match(/تحكم|controller|gamepad|joystick|xbox|ps[45]/)) {
      return { categoryId: 'setup-accessories', subcategoryId: 'controllers' };
    }
    
    // Setup Accessories - Stands
    if (combined.match(/حامل|stand|mount|arm|قاعدة/)) {
      return { categoryId: 'setup-accessories', subcategoryId: 'stands' };
    }
    
    // Setup Accessories - Adapters (renamed from hubs-adapters)
    if (combined.match(/hub|adapter|محول|bluetooth|wi-?fi|usb.*hub|شبكة|network/)) {
      return { categoryId: 'setup-accessories', subcategoryId: 'adapters' };
    }
    
    // Setup Accessories - Smart Accessories
    if (combined.match(/sensor|مستشعر|smart|ذكي|iot/)) {
      return { categoryId: 'setup-accessories', subcategoryId: 'smart-accessories' };
    }
    
    // Ready Builds - التجميعات (only PC builds now)
    if (combined.match(/تجميعة|pc build|bundle|pre.?built/)) {
      return { categoryId: 'ready-builds', subcategoryId: 'pc-builds' };
    }
    
    // Fallback to generic PC components
    return { categoryId: 'pc-components', subcategoryId: 'processors' };
  }

  // Get categories with subcategories from database (public endpoint)
  app.get("/api/categories", async (req, res) => {
    try {
      // Fetch categories and subcategories using Supabase client
      const [categoriesResult, subcategoriesResult] = await Promise.all([
        supabase.from('categories').select('*').eq('is_active', true).order('sort_order', { ascending: true }),
        supabase.from('subcategories').select('*').eq('is_active', true).order('sort_order', { ascending: true })
      ]);

      if (categoriesResult.error) throw categoriesResult.error;
      if (subcategoriesResult.error) throw subcategoriesResult.error;

      const categoriesData = categoriesResult.data || [];
      const subcategoriesData = subcategoriesResult.data || [];

      // Map categories with their subcategories (convert snake_case to camelCase)
      const categoriesWithSubcategories = categoriesData.map((category: any) => {
        const categorySubcategories = subcategoriesData
          .filter((sub: any) => sub.category_id === category.id)
          .map((sub: any) => ({
            id: sub.id,
            name: sub.name,
            nameEn: sub.name_en,
            icon: sub.icon,
            description: sub.description,
            descriptionEn: sub.description_en
          }));

        return {
          id: category.id,
          name: category.name,
          nameEn: category.name_en,
          icon: category.icon,
          description: category.description,
          descriptionEn: category.description_en,
          color: category.color,
          gradient: category.gradient,
          subcategories: categorySubcategories
        };
      });

      console.log(`✅ API: Returning ${categoriesWithSubcategories.length} categories with subcategories`);
      res.json(categoriesWithSubcategories);
    } catch (error) {
      console.error('Error fetching categories:', error);
      res.status(500).json({ error: 'Failed to fetch categories' });
    }
  });

  // Get exchange rate setting
  app.get("/api/settings/:key", async (req, res) => {
    try {
      const { key } = req.params;
      const [setting] = await db.select().from(settings).where(eq(settings.key, key));
      
      if (!setting) {
        return res.status(404).json({ error: 'Setting not found' });
      }
      
      // Return the setting with proper JSONB structure
      res.json({
        key: setting.key,
        value: setting.value,
        rate: (setting.value as { rate: number }).rate
      });
    } catch (error) {
      console.error('Error fetching setting:', error);
      res.status(500).json({ error: 'Failed to fetch setting' });
    }
  });

  // ============= ADMIN API ROUTES =============
  
  // Admin: Get all products (including inactive) from Supabase
  app.get("/api/admin/products", async (req, res) => {
    try {
      const { data: allProducts, error: productsError } = await adminSupabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (productsError) throw productsError;
      
      const { data: settingsData, error: settingsError } = await adminSupabase
        .from('settings')
        .select('*')
        .eq('key', 'usd_to_lyd_rate')
        .single();
      
      const exchangeRate = settingsData ? (settingsData.value as { rate: number }).rate : 5.10;
      
      const productsWithPricing = (allProducts || []).map((product: any) => ({
        id: product.id,
        name: product.name,
        nameEn: product.name_en,
        description: product.description,
        descriptionEn: product.description_en,
        basePriceUsd: parseFloat(String(product.base_price_usd)) || 0,
        categoryId: product.category_id,
        subcategoryId: product.subcategory_id,
        category: product.category,
        image: product.image,
        inStock: product.in_stock,
        stockCount: product.stock_count,
        isActive: product.is_active,
        displayPriceLyd: roundLYD((parseFloat(String(product.base_price_usd)) || 0) * exchangeRate),
        usdToLydRate: exchangeRate,
        createdAt: product.created_at,
        updatedAt: product.updated_at
      }));
      
      res.json(productsWithPricing);
    } catch (error) {
      console.error('Error fetching admin products:', error);
      res.status(500).json({ error: 'Failed to fetch products' });
    }
  });
  
  // Admin: Create product in Supabase database
  app.post("/api/admin/products", async (req, res) => {
    try {
      const productData = req.body;
      
      const { data: newProduct, error } = await adminSupabase
        .from('products')
        .insert({
          id: productData.id,
          name: productData.name,
          name_en: productData.nameEn,
          description: productData.description,
          description_en: productData.descriptionEn,
          base_price_usd: String(productData.basePriceUsd),
          category: productData.category || '',
          category_id: productData.categoryId,
          subcategory_id: productData.subcategoryId,
          image: productData.image,
          in_stock: productData.inStock !== false,
          stock_count: productData.stockCount || 0,
          is_active: productData.isActive !== false
        })
        .select()
        .single();
      
      if (error) {
        console.error('Supabase insert error:', error);
        throw error;
      }
      
      res.status(201).json(newProduct);
    } catch (error) {
      console.error('Error creating product:', error);
      res.status(500).json({ error: 'Failed to create product' });
    }
  });
  
  // Admin: Update product in Supabase database
  app.put("/api/admin/products/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const productData = req.body;
      
      const { data: updated, error } = await adminSupabase
        .from('products')
        .update({
          name: productData.name,
          name_en: productData.nameEn,
          description: productData.description,
          description_en: productData.descriptionEn,
          base_price_usd: String(productData.basePriceUsd),
          category: productData.category || '',
          category_id: productData.categoryId,
          subcategory_id: productData.subcategoryId,
          image: productData.image,
          in_stock: productData.inStock,
          stock_count: productData.stockCount,
          is_active: productData.isActive,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        console.error('Supabase update error:', error);
        if (error.code === 'PGRST116') {
          return res.status(404).json({ error: 'Product not found' });
        }
        throw error;
      }
      
      res.json(updated);
    } catch (error) {
      console.error('Error updating product:', error);
      res.status(500).json({ error: 'Failed to update product' });
    }
  });
  
  // Admin: Delete product from Supabase database
  app.delete("/api/admin/products/:id", async (req, res) => {
    try {
      const { id } = req.params;
      
      const { error, count } = await adminSupabase
        .from('products')
        .delete({ count: 'exact' })
        .eq('id', id);
      
      if (error) {
        console.error('Supabase delete error:', error);
        throw error;
      }
      
      if (count === 0) {
        return res.status(404).json({ error: 'Product not found' });
      }
      
      res.json({ message: 'Product deleted successfully' });
    } catch (error) {
      console.error('Error deleting product:', error);
      res.status(500).json({ error: 'Failed to delete product' });
    }
  });
  
  // Admin: Get all orders from Supabase
  app.get("/api/admin/orders", async (req, res) => {
    try {
      const { data: allOrders, error: ordersError } = await adminSupabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (ordersError) throw ordersError;

      const ordersWithParsedItems = (allOrders || []).map((order: any) => ({
        id: order.id,
        customerName: order.customer_name,
        customerPhone: order.customer_phone,
        customerCity: order.customer_city,
        customerAddress: order.customer_address,
        orderNotes: order.order_notes,
        status: order.status,
        totalAmount: parseFloat(String(order.total_amount)),
        deliveryFee: parseFloat(String(order.delivery_fee)),
        items: typeof order.items === 'string' ? JSON.parse(order.items) : order.items,
        usdToLydSnapshot: order.usd_to_lyd_snapshot,
        createdAt: order.created_at,
        updatedAt: order.updated_at
      }));
      
      res.json(ordersWithParsedItems);
    } catch (error) {
      console.error('Error fetching orders:', error);
      res.status(500).json({ error: 'Failed to fetch orders' });
    }
  });
  
  // Admin: Update order status in database
  app.put("/api/admin/orders/:id/status", async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      
      if (!['pending', 'confirmed', 'delivered', 'cancelled'].includes(status)) {
        return res.status(400).json({ error: 'Invalid status' });
      }
      
      const [updated] = await db.update(orders)
        .set({ 
          status, 
          updatedAt: new Date() 
        })
        .where(eq(orders.id, parseInt(id)))
        .returning();
      
      if (!updated) {
        return res.status(404).json({ error: 'Order not found' });
      }
      
      res.json(updated);
    } catch (error) {
      console.error('Error updating order status:', error);
      res.status(500).json({ error: 'Failed to update order status' });
    }
  });
  
  // Admin: Get all settings from Supabase
  app.get("/api/admin/settings", async (req, res) => {
    try {
      const { data: allSettings, error: settingsError } = await adminSupabase
        .from('settings')
        .select('*');
      
      if (settingsError) throw settingsError;
      
      res.json(allSettings || []);
    } catch (error) {
      console.error('Error fetching settings:', error);
      res.status(500).json({ error: 'Failed to fetch settings' });
    }
  });
  
  // Admin: Update settings in database
  app.put("/api/admin/settings", async (req, res) => {
    try {
      const { key, value } = req.body;
      
      const [updated] = await db.insert(settings)
        .values({ 
          key, 
          value, 
          updatedAt: new Date() 
        })
        .onConflictDoUpdate({
          target: settings.key,
          set: { value, updatedAt: new Date() }
        })
        .returning();

      res.json(updated);
    } catch (error) {
      console.error('Error updating settings:', error);
      res.status(500).json({ error: 'Failed to update settings' });
    }
  });
  
  // Admin: Get dashboard statistics from Supabase
  app.get("/api/admin/stats", async (req, res) => {
    try {
      // Get total products count from Supabase
      const { data: activeProducts, error: productsError } = await adminSupabase
        .from('products')
        .select('*')
        .eq('is_active', true);
      
      if (productsError) throw productsError;
      const totalProducts = activeProducts?.length || 0;
      
      // Get all orders from Supabase
      const { data: allOrders, error: ordersError } = await adminSupabase
        .from('orders')
        .select('*');
      
      if (ordersError) throw ordersError;
      const totalOrders = allOrders?.length || 0;
      
      // Get delivered orders for total sales
      const deliveredOrders = (allOrders || []).filter((o: any) => o.status === 'delivered');
      const totalSales = deliveredOrders.reduce((sum, order: any) => 
        sum + parseFloat(String(order.total_amount || 0)), 0);
      
      // Get low stock products (< 5 items) from Supabase
      const { data: lowStockData, error: lowStockError } = await adminSupabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .lt('stock_count', 5)
        .limit(10);
      
      if (lowStockError) throw lowStockError;
      
      // Get recent orders from Supabase
      const { data: recentOrdersData, error: recentOrdersError } = await adminSupabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (recentOrdersError) throw recentOrdersError;
      
      // Get orders grouped by status
      const statusCounts = (allOrders || []).reduce((acc: any, order: any) => {
        acc[order.status] = (acc[order.status] || 0) + 1;
        return acc;
      }, {});
      
      const ordersByStatus = Object.entries(statusCounts).map(([status, count]) => ({
        status,
        count: count as number
      }));
      
      res.json({
        totalProducts,
        totalOrders,
        totalSales,
        lowStockProducts: (lowStockData || []).map((p: any) => ({
          id: p.id,
          name: p.name,
          nameEn: p.name_en,
          basePriceUsd: parseFloat(String(p.base_price_usd)),
          stockCount: p.stock_count,
          image: p.image
        })),
        recentOrders: (recentOrdersData || []).map((o: any) => ({
          id: o.id,
          customerName: o.customer_name,
          status: o.status,
          items: typeof o.items === 'string' ? JSON.parse(o.items) : o.items,
          totalAmount: parseFloat(String(o.total_amount)),
          createdAt: o.created_at
        })),
        ordersByStatus
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
      res.status(500).json({ error: 'Failed to fetch statistics' });
    }
  });

  // ============= CATEGORY MANAGEMENT API ROUTES =============
  
  // Admin: Get all categories with subcategories from database
  app.get("/api/admin/categories", async (req, res) => {
    try {
      // Fetch categories and subcategories using Supabase admin client
      const [categoriesResult, subcategoriesResult] = await Promise.all([
        adminSupabase.from('categories').select('*').order('sort_order', { ascending: true }),
        adminSupabase.from('subcategories').select('*').order('sort_order', { ascending: true })
      ]);

      if (categoriesResult.error) throw categoriesResult.error;
      if (subcategoriesResult.error) throw subcategoriesResult.error;

      const categoriesData = categoriesResult.data || [];
      const subcategoriesData = subcategoriesResult.data || [];

      // Map categories with subcategories (convert snake_case to camelCase)
      const categoriesWithSubs = categoriesData.map((cat: any) => ({
        id: cat.id,
        name: cat.name,
        nameEn: cat.name_en,
        icon: cat.icon,
        description: cat.description,
        descriptionEn: cat.description_en,
        color: cat.color,
        gradient: cat.gradient,
        sortOrder: cat.sort_order,
        isActive: cat.is_active,
        createdAt: cat.created_at,
        updatedAt: cat.updated_at,
        subcategories: subcategoriesData
          .filter((sub: any) => sub.category_id === cat.id)
          .map((sub: any) => ({
            id: sub.id,
            categoryId: sub.category_id,
            name: sub.name,
            nameEn: sub.name_en,
            icon: sub.icon,
            description: sub.description,
            descriptionEn: sub.description_en,
            sortOrder: sub.sort_order,
            isActive: sub.is_active,
            createdAt: sub.created_at,
            updatedAt: sub.updated_at
          }))
      }));

      res.json(categoriesWithSubs);
    } catch (error) {
      console.error('Error fetching categories:', error);
      res.status(500).json({ error: 'Failed to fetch categories' });
    }
  });

  // Admin: Create new category in Supabase
  app.post("/api/admin/categories", async (req, res) => {
    try {
      const categoryData = req.body;

      const validation = insertCategorySchema.safeParse({
        id: categoryData.id,
        name: categoryData.name,
        nameEn: categoryData.nameEn,
        icon: categoryData.icon,
        description: categoryData.description,
        descriptionEn: categoryData.descriptionEn,
        color: categoryData.color,
        gradient: categoryData.gradient,
        sortOrder: categoryData.sortOrder || 0,
        isActive: categoryData.isActive !== false
      });

      if (!validation.success) {
        return res.status(400).json({ 
          error: 'Invalid category data', 
          details: validation.error.errors 
        });
      }

      const { data: newCategory, error } = await adminSupabase
        .from('categories')
        .insert({
          id: categoryData.id,
          name: categoryData.name,
          name_en: categoryData.nameEn,
          icon: categoryData.icon,
          description: categoryData.description,
          description_en: categoryData.descriptionEn,
          color: categoryData.color,
          gradient: categoryData.gradient,
          sort_order: categoryData.sortOrder || 0,
          is_active: categoryData.isActive !== false
        })
        .select()
        .single();

      if (error) {
        console.error('Supabase insert error:', error);
        if (error.code === '23505') {
          return res.status(409).json({ error: 'Category with this ID already exists' });
        }
        throw error;
      }

      res.status(201).json(newCategory);
    } catch (error) {
      console.error('Error creating category:', error);
      res.status(500).json({ error: 'Failed to create category' });
    }
  });

  // Admin: Update category in Supabase
  app.put("/api/admin/categories/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const categoryData = req.body;

      if (!categoryData.name || !categoryData.nameEn) {
        return res.status(400).json({ error: 'Name and nameEn are required' });
      }

      const { data: updated, error } = await adminSupabase
        .from('categories')
        .update({
          name: categoryData.name,
          name_en: categoryData.nameEn,
          icon: categoryData.icon,
          description: categoryData.description,
          description_en: categoryData.descriptionEn,
          color: categoryData.color,
          gradient: categoryData.gradient,
          sort_order: categoryData.sortOrder,
          is_active: categoryData.isActive,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Supabase update error:', error);
        if (error.code === 'PGRST116') {
          return res.status(404).json({ error: 'Category not found' });
        }
        throw error;
      }

      res.json(updated);
    } catch (error) {
      console.error('Error updating category:', error);
      res.status(500).json({ error: 'Failed to update category' });
    }
  });

  // Admin: Delete category from Supabase
  app.delete("/api/admin/categories/:id", async (req, res) => {
    try {
      const { id } = req.params;

      const { data: subcats } = await adminSupabase
        .from('subcategories')
        .select('id')
        .eq('category_id', id);

      if (subcats && subcats.length > 0) {
        return res.status(400).json({ 
          error: 'Cannot delete category with existing subcategories. Please delete subcategories first.' 
        });
      }

      const { error, count } = await adminSupabase
        .from('categories')
        .delete({ count: 'exact' })
        .eq('id', id);

      if (error) {
        console.error('Supabase delete error:', error);
        throw error;
      }

      if (count === 0) {
        return res.status(404).json({ error: 'Category not found' });
      }

      res.json({ message: 'Category deleted successfully' });
    } catch (error) {
      console.error('Error deleting category:', error);
      res.status(500).json({ error: 'Failed to delete category' });
    }
  });

  // Admin: Create new subcategory in Supabase
  app.post("/api/admin/subcategories", async (req, res) => {
    try {
      const subcategoryData = req.body;

      const validation = insertSubcategorySchema.safeParse({
        id: subcategoryData.id,
        categoryId: subcategoryData.categoryId,
        name: subcategoryData.name,
        nameEn: subcategoryData.nameEn,
        icon: subcategoryData.icon,
        description: subcategoryData.description,
        descriptionEn: subcategoryData.descriptionEn,
        sortOrder: subcategoryData.sortOrder || 0,
        isActive: subcategoryData.isActive !== false
      });

      if (!validation.success) {
        return res.status(400).json({ 
          error: 'Invalid subcategory data', 
          details: validation.error.errors 
        });
      }

      const { data: categoryExists } = await adminSupabase
        .from('categories')
        .select('id')
        .eq('id', subcategoryData.categoryId)
        .single();

      if (!categoryExists) {
        return res.status(400).json({ error: 'Parent category does not exist' });
      }

      const { data: newSubcategory, error } = await adminSupabase
        .from('subcategories')
        .insert({
          id: subcategoryData.id,
          category_id: subcategoryData.categoryId,
          name: subcategoryData.name,
          name_en: subcategoryData.nameEn,
          icon: subcategoryData.icon,
          description: subcategoryData.description,
          description_en: subcategoryData.descriptionEn,
          sort_order: subcategoryData.sortOrder || 0,
          is_active: subcategoryData.isActive !== false
        })
        .select()
        .single();

      if (error) {
        console.error('Supabase insert error:', error);
        if (error.code === '23505') {
          return res.status(409).json({ error: 'Subcategory with this ID already exists' });
        }
        throw error;
      }

      res.status(201).json(newSubcategory);
    } catch (error) {
      console.error('Error creating subcategory:', error);
      res.status(500).json({ error: 'Failed to create subcategory' });
    }
  });

  // Admin: Update subcategory in Supabase
  app.put("/api/admin/subcategories/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const subcategoryData = req.body;

      if (!subcategoryData.name || !subcategoryData.nameEn) {
        return res.status(400).json({ error: 'Name and nameEn are required' });
      }

      const { data: updated, error } = await adminSupabase
        .from('subcategories')
        .update({
          name: subcategoryData.name,
          name_en: subcategoryData.nameEn,
          icon: subcategoryData.icon,
          description: subcategoryData.description,
          description_en: subcategoryData.descriptionEn,
          sort_order: subcategoryData.sortOrder,
          is_active: subcategoryData.isActive,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Supabase update error:', error);
        if (error.code === 'PGRST116') {
          return res.status(404).json({ error: 'Subcategory not found' });
        }
        throw error;
      }

      res.json(updated);
    } catch (error) {
      console.error('Error updating subcategory:', error);
      res.status(500).json({ error: 'Failed to update subcategory' });
    }
  });

  // Admin: Delete subcategory from Supabase
  app.delete("/api/admin/subcategories/:id", async (req, res) => {
    try {
      const { id } = req.params;

      const { error, count } = await adminSupabase
        .from('subcategories')
        .delete({ count: 'exact' })
        .eq('id', id);

      if (error) {
        console.error('Supabase delete error:', error);
        throw error;
      }

      if (count === 0) {
        return res.status(404).json({ error: 'Subcategory not found' });
      }

      res.json({ message: 'Subcategory deleted successfully' });
    } catch (error) {
      console.error('Error deleting subcategory:', error);
      res.status(500).json({ error: 'Failed to delete subcategory' });
    }
  });

  // Admin: Reorder categories in Supabase
  app.put("/api/admin/categories/reorder", async (req, res) => {
    try {
      const reorderData = req.body;

      if (!Array.isArray(reorderData)) {
        return res.status(400).json({ error: 'Request body must be an array of {id, sortOrder}' });
      }

      for (const item of reorderData) {
        if (!item.id || typeof item.sortOrder !== 'number') {
          return res.status(400).json({ 
            error: 'Each item must have id and sortOrder properties' 
          });
        }
      }

      const updatePromises = reorderData.map(item => 
        adminSupabase
          .from('categories')
          .update({ 
            sort_order: item.sortOrder,
            updated_at: new Date().toISOString()
          })
          .eq('id', item.id)
      );

      const results = await Promise.all(updatePromises);

      const errors = results.filter(result => result.error);
      if (errors.length > 0) {
        console.error('Supabase reorder errors:', errors);
        throw new Error('Failed to update some categories');
      }

      res.json({ message: 'Categories reordered successfully', updated: reorderData.length });
    } catch (error) {
      console.error('Error reordering categories:', error);
      res.status(500).json({ error: 'Failed to reorder categories' });
    }
  });

  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({ 
      status: "healthy", 
      timestamp: new Date().toISOString(),
      version: "1.0.0"
    });
  });

  const httpServer = createServer(app);

  return httpServer;
}
