import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('المفاتيح المطلوبة للاتصال مع Supabase غير موجودة في ملف البيئة');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase;