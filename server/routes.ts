import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // Order management API
  app.post("/api/orders", async (req, res) => {
    try {
      const orderData = req.body;
      
      // Validate required fields
      if (!orderData.product?.id || !orderData.customer?.name || !orderData.customer?.phone) {
        return res.status(400).json({ 
          error: 'Missing required fields' 
        });
      }

      // Create order with ID and timestamp
      const order = {
        ...orderData,
        id: `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date(),
        status: 'pending'
      };

      // Log order for debugging
      console.log('New order received:', {
        orderId: order.id,
        product: order.product.name,
        customer: order.customer.name,
        timestamp: order.timestamp
      });

      // Return success response
      res.status(201).json({
        success: true,
        orderId: order.id,
        message: 'Order recorded successfully'
      });

    } catch (error) {
      console.error('Error creating order:', error);
      res.status(500).json({ 
        error: 'Internal server error' 
      });
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
