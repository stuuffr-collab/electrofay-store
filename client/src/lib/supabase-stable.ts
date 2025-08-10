import { createClient } from '@supabase/supabase-js';

// Create a stable Supabase client without logs
const supabaseUrl = 'https://vofpgdsemzhivyesmarp.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZvZnBnZHNlbXpoaXZ5ZXNtYXJwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ4NjQ4MTAsImV4cCI6MjA3MDQ0MDgxMH0.MjNsE7Cs3YSvmZhMzOKg3bVEqrRNpFHmJLXJxfGm9Js';

// Create client instance once
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false, // Disable session persistence to prevent multiple clients
  },
});

export default supabase;