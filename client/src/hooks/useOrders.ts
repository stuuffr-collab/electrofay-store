import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabaseClient';
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
  try {
    // Prepare items data for database storage
    const itemsJson = JSON.stringify(orderData.items.map(item => ({
      productId: item.product.id,
      name: item.product.name,
      price: item.product.price,
      quantity: item.quantity,
      total: item.product.price * item.quantity
    })));

    const { data, error } = await supabase
      .from('orders')
      .insert({
        customer_name: orderData.customerName,
        customer_phone: orderData.customerPhone,
        customer_email: orderData.customerEmail || null,
        customer_city: orderData.customerCity,
        customer_address: orderData.customerAddress,
        order_notes: orderData.customerNotes || null,
        items: itemsJson,
        total_amount: orderData.totalAmount.toString(),
        delivery_fee: (orderData.deliveryFee || 0).toString(),
        status: orderData.status || 'pending'
      })
      .select()
      .single();

    if (error) {
      console.error('خطأ أثناء حفظ الطلب في Supabase:', error);
      throw new Error('فشل في حفظ الطلب في قاعدة البيانات');
    }

    console.log('✅ تم حفظ الطلب بنجاح في Supabase:', data);
    return data;
  } catch (error) {
    console.error('خطأ في حفظ الطلب:', error);
    // Log the order locally as fallback
    console.log('📋 طلب جديد (محفوظ محلياً):', orderData);
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