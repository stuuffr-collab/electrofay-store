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

// Debug logging
console.log('🔧 Supabase URL:', supabaseUrl ? 'موجود' : 'مفقود');
console.log('🔧 Supabase Key:', supabaseAnonKey ? 'موجود' : 'مفقود');
console.log('🔧 URL Valid:', supabaseUrl ? isValidUrl(supabaseUrl) : false);

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase environment variables!');
  throw new Error('Supabase configuration missing');
}

if (!isValidUrl(supabaseUrl)) {
  console.error('❌ Invalid Supabase URL format!');
  throw new Error('Invalid Supabase URL');
}

// Create the real Supabase client with explicit options
supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false
  },
  db: {
    schema: 'public'
  }
});
console.log('✅ Supabase client created successfully with URL:', supabaseUrl.substring(0, 30) + '...');

export { supabase };

export default supabase;