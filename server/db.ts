import pkg from 'pg';
const { Pool } = pkg;
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from "@shared/schema";

// DATABASE_URL is optional - if not set, we'll use Supabase client instead
// For Supabase, you can get the connection string from: Settings > Database > Connection string
// Format: postgresql://postgres.[PROJECT_REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres
const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.warn('⚠️  DATABASE_URL not set. PostgreSQL operations will use Supabase client instead.');
  console.warn('💡 To use PostgreSQL directly, set DATABASE_URL in your environment variables.');
  console.warn('💡 You can get the connection string from Supabase: Settings > Database > Connection string');
}

// Create pool only if DATABASE_URL is set
// Note: pool may be undefined, so check before using it
export const pool = databaseUrl ? new Pool({ connectionString: databaseUrl }) : null;

// Create drizzle instance only if pool exists
export const db = pool ? drizzle(pool, { schema }) : null as any;
