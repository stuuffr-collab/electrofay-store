import { createClient } from '@supabase/supabase-js';

// Validate URL format
const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return url.startsWith('https://') && url.includes('.supabase.co');
  } catch {
    return false;
  }
};

// Get environment variables once
let supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim();
let supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim();

// Check if values are swapped and fix them (only once, no logging)
if (supabaseUrl && supabaseUrl.startsWith('eyJ')) {
  const temp = supabaseUrl;
  supabaseUrl = supabaseAnonKey;
  supabaseAnonKey = temp;
}

// Create a null supabase client if environment variables are missing
// This allows the app to work with fallback data during development
let supabase: any = null;

// Temporary debug logging (will remove after fix)
console.log('🔧 Supabase URL:', supabaseUrl ? 'موجود' : 'مفقود');
console.log('🔧 Supabase Key:', supabaseAnonKey ? 'موجود' : 'مفقود');
console.log('🔧 URL Valid:', supabaseUrl ? isValidUrl(supabaseUrl) : false);

if (!supabaseUrl || !supabaseAnonKey || !isValidUrl(supabaseUrl)) {
  console.log('❌ Supabase غير مكون بشكل صحيح، استخدام البيانات المحلية');
  // Create a mock client that safely fails operations (no console logging)
  supabase = {
    from: () => ({
      select: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } }),
      insert: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } }),
      eq: () => ({ data: null, error: { message: 'Supabase not configured' } })
    }),
    storage: {
      from: () => ({
        upload: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } }),
        remove: () => Promise.resolve({ error: { message: 'Supabase not configured' } }),
        getPublicUrl: () => ({ data: { publicUrl: '' } })
      })
    }
  };
} else {
  supabase = createClient(supabaseUrl, supabaseAnonKey);
}

export { supabase };

export default supabase;