import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { supabase } from "./supabaseClient";
import { db } from "./db";
import { products, settings, orders, insertOrderSchema, insertProductSchema } from "@shared/schema";
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

  // Get products with dynamic pricing and smart categorization
  app.get("/api/products", async (req, res) => {
    try {
      // Fetch products and exchange rate in parallel
      const [productsResult, settingsResult] = await Promise.all([
        db.select().from(products).where(eq(products.isActive, true)),
        db.select().from(settings).where(eq(settings.key, 'usd_to_lyd_rate'))
      ]);

      // Parse JSONB exchange rate setting
      const exchangeRate = settingsResult[0] && settingsResult[0].value 
        ? (settingsResult[0].value as { rate: number }).rate 
        : 5.10;

      // Calculate LYD prices and add smart categorization
      const productsWithPricing = productsResult.map(product => {
        const basePriceUsd = parseFloat(String(product.basePriceUsd)) || 0;
        const rawLydPrice = basePriceUsd * exchangeRate;
        const displayPriceLyd = roundLYD(rawLydPrice);

        // Smart categorization using categorizeProduct from categories.ts
        // This is calculated dynamically based on product name and description
        const categorization = categorizeProduct(product);

        return {
          id: product.id,
          name: product.name,
          nameEn: product.nameEn,
          description: product.description,
          descriptionEn: product.descriptionEn,
          basePriceUsd,
          displayPriceLyd,
          category: product.category,
          categoryId: product.categoryId || categorization.categoryId,
          subcategoryId: product.subcategoryId || categorization.subcategoryId,
          image: product.image,
          inStock: product.inStock,
          stockCount: product.stockCount,
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
      const { data: allProducts, error: productsError } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (productsError) {
        console.error('Supabase error fetching products:', productsError);
        return res.status(500).json({ error: 'Failed to fetch products' });
      }

      const { data: settingsData, error: settingsError } = await supabase
        .from('settings')
        .select('value')
        .eq('key', 'usd_to_lyd_rate')
        .single();
      
      const exchangeRate = settingsData?.value?.rate || 5.10;
      
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
  
  // Admin: Create product in Supabase
  app.post("/api/admin/products", async (req, res) => {
    try {
      const productData = req.body;
      
      const { data: newProduct, error } = await supabase
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
        console.error('Supabase error creating product:', error);
        return res.status(500).json({ error: 'Failed to create product' });
      }
      
      res.status(201).json(newProduct);
    } catch (error) {
      console.error('Error creating product:', error);
      res.status(500).json({ error: 'Failed to create product' });
    }
  });
  
  // Admin: Update product in Supabase
  app.put("/api/admin/products/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const productData = req.body;
      
      const { data: updated, error } = await supabase
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
        console.error('Supabase error updating product:', error);
        return res.status(404).json({ error: 'Product not found' });
      }
      
      res.json(updated);
    } catch (error) {
      console.error('Error updating product:', error);
      res.status(500).json({ error: 'Failed to update product' });
    }
  });
  
  // Admin: Delete product from Supabase
  app.delete("/api/admin/products/:id", async (req, res) => {
    try {
      const { id } = req.params;
      
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Supabase error deleting product:', error);
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
      const { data: allOrders, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Supabase error fetching orders:', error);
        return res.status(500).json({ error: 'Failed to fetch orders' });
      }

      const ordersWithParsedItems = (allOrders || []).map((order: any) => ({
        ...order,
        items: JSON.parse(order.items),
        totalAmount: parseFloat(String(order.total_amount)),
        deliveryFee: parseFloat(String(order.delivery_fee)),
        customerName: order.customer_name,
        customerPhone: order.customer_phone,
        customerCity: order.customer_city,
        customerAddress: order.customer_address,
        orderNotes: order.order_notes,
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
  
  // Admin: Update order status in Supabase
  app.put("/api/admin/orders/:id/status", async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      
      if (!['pending', 'confirmed', 'delivered', 'cancelled'].includes(status)) {
        return res.status(400).json({ error: 'Invalid status' });
      }
      
      const { data: updated, error } = await supabase
        .from('orders')
        .update({ 
          status, 
          updated_at: new Date().toISOString() 
        })
        .eq('id', parseInt(id))
        .select()
        .single();
      
      if (error) {
        console.error('Supabase error updating order status:', error);
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
      const { data: allSettings, error } = await supabase
        .from('settings')
        .select('*');
      
      if (error) {
        console.error('Supabase error fetching settings:', error);
        return res.status(500).json({ error: 'Failed to fetch settings' });
      }

      res.json(allSettings || []);
    } catch (error) {
      console.error('Error fetching settings:', error);
      res.status(500).json({ error: 'Failed to fetch settings' });
    }
  });
  
  // Admin: Update settings in Supabase
  app.put("/api/admin/settings", async (req, res) => {
    try {
      const { key, value } = req.body;
      
      const { data: updated, error } = await supabase
        .from('settings')
        .upsert({ 
          key, 
          value, 
          updated_at: new Date().toISOString() 
        }, {
          onConflict: 'key'
        })
        .select()
        .single();
      
      if (error) {
        console.error('Supabase error updating settings:', error);
        return res.status(500).json({ error: 'Failed to update settings' });
      }

      res.json(updated);
    } catch (error) {
      console.error('Error updating settings:', error);
      res.status(500).json({ error: 'Failed to update settings' });
    }
  });
  
  // Admin: Get dashboard statistics from Supabase
  app.get("/api/admin/stats", async (req, res) => {
    try {
      // Get total products count
      const { count: totalProducts } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true);
      
      // Get total orders count
      const { count: totalOrders } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true });
      
      // Get delivered orders for total sales
      const { data: deliveredOrders } = await supabase
        .from('orders')
        .select('total_amount')
        .eq('status', 'delivered');
      
      const totalSales = (deliveredOrders || []).reduce((sum: number, order: any) => 
        sum + parseFloat(String(order.total_amount || 0)), 0);
      
      // Get low stock products (< 5 items)
      const { data: lowStockProducts } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .lt('stock_count', 5)
        .limit(10);
      
      // Get recent orders
      const { data: recentOrders } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);
      
      // Get orders grouped by status (manual grouping)
      const { data: allOrdersForStatus } = await supabase
        .from('orders')
        .select('status');
      
      const statusCounts = (allOrdersForStatus || []).reduce((acc: any, order: any) => {
        acc[order.status] = (acc[order.status] || 0) + 1;
        return acc;
      }, {});
      
      const ordersByStatus = Object.entries(statusCounts).map(([status, count]) => ({
        status,
        count: count as number
      }));
      
      res.json({
        totalProducts: totalProducts || 0,
        totalOrders: totalOrders || 0,
        totalSales,
        lowStockProducts: (lowStockProducts || []).map((p: any) => ({
          id: p.id,
          name: p.name,
          nameEn: p.name_en,
          basePriceUsd: parseFloat(String(p.base_price_usd)),
          stockCount: p.stock_count,
          image: p.image
        })),
        recentOrders: (recentOrders || []).map((o: any) => ({
          id: o.id,
          customerName: o.customer_name,
          status: o.status,
          items: JSON.parse(o.items),
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
