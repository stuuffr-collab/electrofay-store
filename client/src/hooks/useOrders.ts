import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CartItem } from '@/context/CartContext';

export interface OrderData {
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  customerCity: string;
  customerAddress: string;
  customerNotes?: string;
  items: CartItem[];
  totalAmount: number;
  deliveryFee?: number;
  status?: string;
}

export async function saveOrder(orderData: OrderData) {
  console.log('🚀 بدء حفظ الطلب:', orderData);
  
  try {
    // Prepare order data for local API
    const orderPayload = {
      customerName: orderData.customerName,
      customerPhone: orderData.customerPhone,
      customerCity: orderData.customerCity,
      customerAddress: orderData.customerAddress,
      customerNotes: orderData.customerNotes || null,
      items: orderData.items.map(item => ({
        productId: item.product.id,
        name: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
        total: item.product.price * item.quantity
      })),
      totalAmount: Number(orderData.totalAmount),
      deliveryFee: Number(orderData.deliveryFee || 0),
      status: orderData.status || 'pending'
    };

    console.log('💾 البيانات المرسلة للـ API المحلي:', orderPayload);

    // Send order to local API
    const response = await fetch('/api/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderPayload)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(`API error ${response.status}: ${errorData.error || 'Failed to save order'}`);
    }

    const result = await response.json();
    console.log('✅ تم حفظ الطلب بنجاح في قاعدة البيانات المحلية:', result);
    return result;
    
  } catch (error) {
    console.error('💥 خطأ شامل في حفظ الطلب:', error);
    console.log('📋 بيانات الطلب المفشل:', JSON.stringify(orderData, null, 2));
    throw error;
  }
}

export function useSaveOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: saveOrder,
    onSuccess: () => {
      // Invalidate orders cache if we add orders listing later
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
    onError: (error) => {
      console.error('فشل في حفظ الطلب:', error);
    }
  });
}