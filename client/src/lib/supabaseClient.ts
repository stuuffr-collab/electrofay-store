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

// Temporary fix for swapped environment variables
let supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
let supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check if values are swapped and fix them
if (supabaseUrl && supabaseUrl.startsWith('eyJ')) {
  // URL is actually the token, swap them
  const temp = supabaseUrl;
  supabaseUrl = supabaseAnonKey;
  supabaseAnonKey = temp;
  console.log('🔄 Fixed swapped Supabase environment variables');
}

// Debug logging
console.log('Supabase URL after fix:', supabaseUrl);
console.log('Supabase URL type:', typeof supabaseUrl);
console.log('URL starts with https:', supabaseUrl?.startsWith('https://'));
console.log('URL includes supabase.co:', supabaseUrl?.includes('.supabase.co'));
console.log('Is valid URL:', supabaseUrl ? isValidUrl(supabaseUrl) : false);

// Create a null supabase client if environment variables are missing
// This allows the app to work with fallback data during development
let supabase: any = null;

if (!supabaseUrl || !supabaseAnonKey || !isValidUrl(supabaseUrl)) {
  if (supabaseUrl && !isValidUrl(supabaseUrl)) {
    console.error('❌ Invalid Supabase URL format. Expected format: https://your-project.supabase.co');
    console.error('Current URL appears to be a token instead of URL:', supabaseUrl.substring(0, 50) + '...');
  }
  console.warn('⚠️ Supabase environment variables not found. App will use fallback data.');
  // Create a mock client that safely fails operations
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