import { createClient } from '@supabase/supabase-js';

// Get environment variables with validation
// Try to read from env first, then fallback to file
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim() || 'https://igeavikwgmkmicwyknkk.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim() || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlnZWF2aWt3Z21rbWljd3lrbmtrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQxNzEzODEsImV4cCI6MjA2OTc0NzM4MX0.PJxjxtrgthAMUIU4Gs1IP2E1sKw4zN_b20JHzjo2p8Q';

// Create fallback client for development environment
const createFallbackClient = () => ({
  from: (table: string) => ({
    select: (columns?: string) => ({
      eq: (column: string, value: any) => ({
        single: () => Promise.resolve({ 
          data: null, 
          error: { message: `Using fallback mode - backend API recommended for ${table}` } 
        })
      })
    }),
    insert: (data: any) => Promise.resolve({ 
      data: null, 
      error: { message: `Using fallback mode - backend API recommended for ${table}` } 
    }),
    upsert: (data: any) => Promise.resolve({ 
      data: null, 
      error: { message: `Using fallback mode - backend API recommended for ${table}` } 
    })
  }),
  storage: {
    from: (bucket: string) => ({
      upload: (path: string, file: File, options?: any) => Promise.resolve({ 
        data: null, 
        error: { message: `Using fallback mode - image upload to ${bucket} not available` } 
      }),
      remove: (paths: string[]) => Promise.resolve({ 
        error: { message: 'Using fallback mode - image removal not available' } 
      }),
      getPublicUrl: (path: string) => ({ 
        data: { publicUrl: `/fallback-image.jpg` } 
      })
    })
  }
});

// Create Supabase client or fallback
export const supabase = (!supabaseUrl || !supabaseAnonKey) 
  ? createFallbackClient()
  : createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false
      },
      db: {
        schema: 'public'
      }
    });

if (!supabaseUrl || !supabaseAnonKey) {
  console.log('⚠️  Running in fallback mode - Supabase environment variables not set');
  console.log('💡 For full functionality, backend API endpoints should be used');
} else {
  console.log('✅ Connected to Supabase database');
}

export default supabase;