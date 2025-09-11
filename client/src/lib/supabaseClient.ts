import { createClient } from '@supabase/supabase-js';

// Get environment variables with validation
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim();
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim();

// Create fallback client for development environment
const createFallbackClient = () => ({
  from: (table: string) => ({
    select: (columns?: string) => Promise.resolve({ 
      data: null, 
      error: { message: `Using fallback mode - backend API recommended for ${table}` } 
    }),
    insert: (data: any) => Promise.resolve({ 
      data: null, 
      error: { message: `Using fallback mode - backend API recommended for ${table}` } 
    }),
    eq: (column: string, value: any) => ({ 
      data: null, 
      error: { message: `Using fallback mode - backend API recommended for ${table}` } 
    }),
    single: () => ({ 
      data: null, 
      error: { message: 'Using fallback mode - backend API recommended' } 
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