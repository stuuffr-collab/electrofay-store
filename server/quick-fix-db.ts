import pkg from 'pg';
const { Pool } = pkg;

// Create a new pool with extended timeout settings
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  connectionTimeoutMillis: 60000, // 60 seconds
  query_timeout: 60000,
  statement_timeout: 60000,
  idle_in_transaction_session_timeout: 60000,
});

async function quickFixDatabase() {
  console.log('🔧 Starting quick database fix...');
  console.log('📍 Using DATABASE_URL:', process.env.DATABASE_URL?.substring(0, 30) + '...');
  
  let client;
  
  try {
    console.log('⏳ Attempting to connect (60s timeout)...');
    client = await pool.connect();
    console.log('✅ Connected to database!');
    
    const sqlCommands = [
      'DROP TABLE IF EXISTS public.subcategories CASCADE',
      'DROP TABLE IF EXISTS public.categories CASCADE',
      `CREATE TABLE public.categories (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT NOT NULL,
        name_en TEXT NOT NULL,
        icon TEXT NOT NULL,
        description TEXT NOT NULL,
        description_en TEXT NOT NULL,
        color TEXT NOT NULL,
        gradient TEXT NOT NULL,
        sort_order INTEGER NOT NULL DEFAULT 0,
        is_active BOOLEAN NOT NULL DEFAULT true,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )`,
      `CREATE TABLE public.subcategories (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
        name TEXT NOT NULL,
        name_en TEXT NOT NULL,
        icon TEXT NOT NULL,
        description TEXT NOT NULL,
        description_en TEXT NOT NULL,
        sort_order INTEGER NOT NULL DEFAULT 0,
        is_active BOOLEAN NOT NULL DEFAULT true,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )`,
      'CREATE INDEX idx_categories_sort_order ON public.categories(sort_order)',
      'CREATE INDEX idx_categories_is_active ON public.categories(is_active)',
      'CREATE INDEX idx_subcategories_category_id ON public.subcategories(category_id)',
      'ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY',
      'ALTER TABLE public.subcategories ENABLE ROW LEVEL SECURITY',
      `CREATE POLICY "Enable read access for all users" ON public.categories FOR SELECT USING (true)`,
      `CREATE POLICY "Enable read access for all users" ON public.subcategories FOR SELECT USING (true)`
    ];
    
    for (const sql of sqlCommands) {
      console.log('⚙️  Executing:', sql.substring(0, 50) + '...');
      await client.query(sql);
    }
    
    console.log('✅ All schema commands executed successfully!');
    return true;
    
  } catch (error: any) {
    console.error('❌ Error:', error.message);
    if (error.code === 'ETIMEDOUT' || error.message?.includes('timeout')) {
      console.error('💡 Connection timeout - DATABASE_URL may not be accessible from this environment');
    }
    return false;
  } finally {
    if (client) client.release();
    await pool.end();
  }
}

quickFixDatabase().then(success => {
  process.exit(success ? 0 : 1);
});
