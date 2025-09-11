import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { db } from "./db";
import { products, settings, orders, insertOrderSchema } from "@shared/schema";
import { eq } from "drizzle-orm";

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

  // Get products with dynamic pricing
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

      // Calculate LYD prices
      const productsWithPricing = productsResult.map(product => {
        const basePriceUsd = parseFloat(String(product.basePriceUsd)) || 0;
        const rawLydPrice = basePriceUsd * exchangeRate;
        const displayPriceLyd = roundLYD(rawLydPrice);

        return {
          id: product.id,
          name: product.name,
          nameEn: product.nameEn,
          description: product.description,
          descriptionEn: product.descriptionEn,
          basePriceUsd,
          displayPriceLyd,
          originalPrice: product.originalPrice ? parseFloat(String(product.originalPrice)) : undefined,
          category: product.category,
          image: product.image,
          rating: parseFloat(String(product.rating)),
          badges: product.badges || [],
          inStock: product.inStock,
          stockCount: product.stockCount,
          usdToLydRate: exchangeRate
        };
      });

      console.log(`✅ API: Returning ${productsWithPricing.length} products with USD→LYD rate ${exchangeRate}`);
      res.json(productsWithPricing);
    } catch (error) {
      console.error('Error fetching products:', error);
      res.status(500).json({ error: 'Failed to fetch products' });
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
