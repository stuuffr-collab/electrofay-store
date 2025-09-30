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
  console.log('🚀 بدء حفظ الطلب في Supabase:', orderData);
  
  try {
    // Get current exchange rate from Supabase settings
    const { data: settingData, error: settingError } = await supabase
      .from('settings')
      .select('value')
      .eq('key', 'usd_to_lyd_rate')
      .single();

    const currentExchangeRate = settingData?.value?.rate || 5.10;
    console.log('💱 سعر الصرف الحالي:', currentExchangeRate);

    // Prepare order data for Supabase
    const orderPayload = {
      customer_name: orderData.customerName,
      customer_phone: orderData.customerPhone,
      customer_city: orderData.customerCity,
      customer_address: orderData.customerAddress,
      order_notes: orderData.customerNotes || null,
      items: JSON.stringify(orderData.items.map(item => ({
        productId: item.product.id,
        name: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
        total: item.product.price * item.quantity
      }))),
      total_amount: Number(orderData.totalAmount),
      delivery_fee: Number(orderData.deliveryFee || 0),
      status: orderData.status || 'pending'
    };

    console.log('💾 البيانات المرسلة لـ Supabase:', orderPayload);

    // Save order to Supabase
    const result = supabase
      .from('orders')
      .insert(orderPayload);
    
    const { data, error } = 'select' in result 
      ? await result.select()
      : await result;

    if (error) {
      console.error('❌ خطأ Supabase:', error);
      throw new Error(`Supabase error: ${error.message}`);
    }

    console.log('✅ تم حفظ الطلب بنجاح في Supabase:', data);
    return {
      success: true,
      orderId: data && data.length > 0 ? data[0].id : null,
      message: 'Order saved successfully'
    };
    
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