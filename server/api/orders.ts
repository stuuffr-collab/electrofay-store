import { Request, Response } from 'express';

interface OrderData {
  product: {
    id: string;
    name: string;
    price: number;
  };
  customer: {
    name: string;
    phone: string;
    city: string;
    address: string;
    notes?: string;
  };
}

// In-memory storage for orders (in production, use a database)
const orders: Array<OrderData & { id: string; timestamp: Date; status: string }> = [];

export const createOrder = async (req: Request, res: Response) => {
  try {
    const orderData: OrderData = req.body;
    
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

    // Store order
    orders.push(order);

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
};

export const getOrders = async (req: Request, res: Response) => {
  try {
    // Return orders (in production, add pagination and authentication)
    res.json({
      orders: orders.map(order => ({
        id: order.id,
        product: order.product,
        customer: {
          name: order.customer.name,
          city: order.customer.city
        },
        timestamp: order.timestamp,
        status: order.status
      }))
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ 
      error: 'Internal server error' 
    });
  }
};