import { createClient } from '@supabase/supabase-js';

// Supabase configuration with fallback values
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://igeavikwgmkmicwyknkk.supabase.co';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlnZWF2aWt3Z21rbWljd3lrbmtrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQxNzEzODEsImV4cCI6MjA2OTc0NzM4MX0.PJxjxtrgthAMUIU4Gs1IP2E1sKw4zN_b20JHzjo2p8Q';
const supabaseServiceRoleKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlnZWF2aWt3Z21rbWljd3lrbmtrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NDE3MTM4MSwiZXhwIjoyMDY5NzQ3MzgxfQ.p8QuDYaSgi3zrHyAsoPuyS6X0MvTLn7CsdDCO2INlY0';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false
  }
});

if (!supabaseServiceRoleKey) {
  console.warn('⚠️ Warning: VITE_SUPABASE_SERVICE_ROLE_KEY not set. Admin operations will fail.');
}

export const adminSupabase = createClient(
  supabaseUrl, 
  supabaseServiceRoleKey || supabaseAnonKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);
