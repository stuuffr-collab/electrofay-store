import { pool } from './db';

async function fixCategoriesDatabase() {
  const client = await pool.connect();
  
  try {
    console.log('🔧 Fixing categories database structure...');
    
    // Drop existing tables
    console.log('📥 Dropping existing tables...');
    await client.query('DROP TABLE IF EXISTS public.subcategories CASCADE');
    await client.query('DROP TABLE IF EXISTS public.categories CASCADE');
    console.log('✅ Existing tables dropped');
    
    // Create categories table with correct structure
    console.log('📦 Creating categories table...');
    await client.query(`
      CREATE TABLE public.categories (
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
      )
    `);
    
    // Create subcategories table
    console.log('📦 Creating subcategories table...');
    await client.query(`
      CREATE TABLE public.subcategories (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        category_id UUID NOT NULL,
        name TEXT NOT NULL,
        name_en TEXT NOT NULL,
        icon TEXT NOT NULL,
        description TEXT NOT NULL,
        description_en TEXT NOT NULL,
        sort_order INTEGER NOT NULL DEFAULT 0,
        is_active BOOLEAN NOT NULL DEFAULT true,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        CONSTRAINT fk_category FOREIGN KEY (category_id) REFERENCES public.categories(id) ON DELETE CASCADE
      )
    `);
    
    // Create indexes
    console.log('🔍 Creating indexes...');
    await client.query('CREATE INDEX idx_categories_sort_order ON public.categories(sort_order)');
    await client.query('CREATE INDEX idx_categories_is_active ON public.categories(is_active)');
    await client.query('CREATE INDEX idx_subcategories_category_id ON public.subcategories(category_id)');
    await client.query('CREATE INDEX idx_subcategories_sort_order ON public.subcategories(sort_order)');
    await client.query('CREATE INDEX idx_subcategories_is_active ON public.subcategories(is_active)');
    
    // Enable RLS
    console.log('🔒 Enabling Row Level Security...');
    await client.query('ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY');
    await client.query('ALTER TABLE public.subcategories ENABLE ROW LEVEL SECURITY');
    
    // Create policies
    await client.query(`
      CREATE POLICY "Enable read access for all users" 
      ON public.categories FOR SELECT USING (true)
    `);
    await client.query(`
      CREATE POLICY "Enable read access for all users" 
      ON public.subcategories FOR SELECT USING (true)
    `);
    
    console.log('✅ Tables created successfully!');
    console.log('🎉 Database structure fixed!');
    
  } catch (error) {
    console.error('❌ Error fixing database:', error);
    throw error;
  } finally {
    client.release();
  }
}

// Run the fix
fixCategoriesDatabase()
  .then(() => {
    console.log('✅ Fix complete');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Fix failed:', error);
    process.exit(1);
  });
