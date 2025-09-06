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

// Direct test function
async function testDirectInsert() {
  try {
    const testData = {
      customer_name: 'Direct Test',
      customer_phone: '0911111111',
      customer_city: 'طرابلس',
      customer_address: 'Test Address',
      items: '[{"test": true}]',
      total_amount: 99,
      delivery_fee: 0,
      status: 'pending'
    };
    
    console.log('🧪 Testing direct insert:', testData);
    const result = await supabase.from('orders').insert(testData).select();
    console.log('🧪 Direct insert result:', result);
    return result;
  } catch (error) {
    console.error('🧪 Direct insert failed:', error);
    return { error };
  }
}

export async function saveOrder(orderData: OrderData) {
  console.log('🚀 بدء حفظ الطلب:', orderData);
  
  try {
    // Test direct insert first
    await testDirectInsert();
    
    // Test Supabase connection first
    console.log('🔍 Testing Supabase connection...');
    const testResult = await supabase.from('orders').select('id').limit(1);
    console.log('🧪 Connection test result:', testResult);
    
    // Prepare items data for database storage
    const itemsJson = JSON.stringify(orderData.items.map(item => ({
      productId: item.product.id,
      name: item.product.name,
      price: item.product.price,
      quantity: item.quantity,
      total: item.product.price * item.quantity
    })));

    console.log('📦 بيانات المنتجات المحضرة:', itemsJson);

    const insertData = {
      customer_name: orderData.customerName,
      customer_phone: orderData.customerPhone,
      customer_city: orderData.customerCity,
      customer_address: orderData.customerAddress,
      order_notes: orderData.customerNotes || null,
      items: itemsJson,
      total_amount: Number(orderData.totalAmount),
      delivery_fee: Number(orderData.deliveryFee || 0),
      status: orderData.status || 'pending'
    };

    console.log('💾 البيانات المرسلة لقاعدة البيانات:', insertData);

    // Insert the order with explicit method
    console.log('🚀 Attempting insert with data:', insertData);
    const { data, error } = await supabase
      .from('orders')
      .insert(insertData)
      .select();

    console.log('📊 Raw Supabase response:', { data, error });

    if (error) {
      console.error('❌ خطأ Supabase:', error);
      console.error('❌ تفاصيل الخطأ:', JSON.stringify(error, null, 2));
      throw new Error(`فشل في حفظ الطلب: ${error.message} - Code: ${error.code}`);
    }

    if (!data) {
      throw new Error('لم يتم إرجاع بيانات من قاعدة البيانات');
    }

    console.log('✅ تم حفظ الطلب بنجاح في Supabase:', data);
    return data;
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