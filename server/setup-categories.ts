import { adminSupabase } from './supabaseClient';

const defaultCategories = [
  {
    name: "قطع الكمبيوتر",
    name_en: "PC Components",
    icon: "Cpu",
    description: "معالجات، كروت شاشة، رامات، وحدات تخزين",
    description_en: "Processors, Graphics Cards, RAM, Storage",
    color: "#3b82f6",
    gradient: "from-blue-500 to-blue-700",
    sort_order: 1,
    is_active: true
  },
  {
    name: "الملحقات",
    name_en: "Peripherals",
    icon: "Mouse",
    description: "لوحات مفاتيح، ماوس، سماعات",
    description_en: "Keyboards, Mice, Headsets",
    color: "#8b5cf6",
    gradient: "from-purple-500 to-purple-700",
    sort_order: 2,
    is_active: true
  },
  {
    name: "الشاشات",
    name_en: "Displays",
    icon: "Monitor",
    description: "شاشات قيمنق وملحقاتها",
    description_en: "Gaming Monitors and Accessories",
    color: "#ec4899",
    gradient: "from-pink-500 to-pink-700",
    sort_order: 3,
    is_active: true
  },
  {
    name: "معدات البث",
    name_en: "Streaming Gear",
    icon: "Video",
    description: "كاميرات، مايكروفونات",
    description_en: "Cameras, Microphones",
    color: "#f59e0b",
    gradient: "from-amber-500 to-amber-700",
    sort_order: 4,
    is_active: true
  },
  {
    name: "ملحقات السيتب",
    name_en: "Setup Accessories",
    icon: "Zap",
    description: "إضاءة، حوامل، محولات",
    description_en: "Lighting, Stands, Adapters",
    color: "#10b981",
    gradient: "from-green-500 to-green-700",
    sort_order: 5,
    is_active: true
  },
  {
    name: "التجميعات الجاهزة",
    name_en: "Ready Builds",
    icon: "Box",
    description: "أجهزة مجمعة جاهزة",
    description_en: "Pre-built PCs",
    color: "#ef4444",
    gradient: "from-red-500 to-red-700",
    sort_order: 6,
    is_active: true
  }
];

async function setupCategories() {
  console.log('🚀 Starting categories setup...');

  try {
    // First, create subcategories table if it doesn't exist
    const { error: tableError } = await adminSupabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS public.subcategories (
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
        );
        
        CREATE INDEX IF NOT EXISTS idx_subcategories_category_id ON public.subcategories(category_id);
        CREATE INDEX IF NOT EXISTS idx_subcategories_sort_order ON public.subcategories(sort_order);
        CREATE INDEX IF NOT EXISTS idx_subcategories_is_active ON public.subcategories(is_active);
        
        ALTER TABLE public.subcategories ENABLE ROW LEVEL SECURITY;
        DROP POLICY IF EXISTS "Enable read access for all users" ON public.subcategories;
        CREATE POLICY "Enable read access for all users" ON public.subcategories FOR SELECT USING (true);
      `
    });

    if (tableError && !tableError.message?.includes('already exists')) {
      console.warn('⚠️ Note: Could not create table via RPC (may not be available), will try direct insert');
    }

    // Insert default categories
    console.log('📦 Inserting default categories...');
    const { data: categoriesData, error: categoriesError } = await adminSupabase
      .from('categories')
      .upsert(defaultCategories, { onConflict: 'name_en', ignoreDuplicates: false })
      .select();

    if (categoriesError) {
      console.error('❌ Error inserting categories:', categoriesError);
      throw categoriesError;
    }

    console.log(`✅ Inserted ${categoriesData?.length || 0} categories`);

    // Now insert subcategories
    if (!categoriesData || categoriesData.length === 0) {
      console.log('⚠️ No categories found, fetching existing ones...');
      const { data: existing } = await adminSupabase
        .from('categories')
        .select('*');
      if (existing && existing.length > 0) {
        console.log(`✅ Found ${existing.length} existing categories`);
      }
      return;
    }

    // Create a map of category names to IDs
    const categoryMap = new Map();
    categoriesData.forEach((cat: any) => {
      categoryMap.set(cat.name_en, cat.id);
    });

    // Define subcategories
    const subcategories = [
      // PC Components
      { parent: "PC Components", name: "المعالجات", name_en: "Processors", icon: "Cpu", description: "معالجات Intel و AMD", description_en: "Intel and AMD Processors", sort_order: 1 },
      { parent: "PC Components", name: "كروت الشاشة", name_en: "Graphics Cards", icon: "Layers", description: "NVIDIA و AMD", description_en: "NVIDIA and AMD GPUs", sort_order: 2 },
      { parent: "PC Components", name: "الرامات", name_en: "Memory (RAM)", icon: "MemoryStick", description: "ذاكرة الوصول العشوائي", description_en: "Random Access Memory", sort_order: 3 },
      { parent: "PC Components", name: "التخزين", name_en: "Storage", icon: "HardDrive", description: "SSD و HDD", description_en: "SSDs and HDDs", sort_order: 4 },
      { parent: "PC Components", name: "اللوحات الأم", name_en: "Motherboards", icon: "CircuitBoard", description: "لوحات أم للبناء", description_en: "Motherboards for Building", sort_order: 5 },
      { parent: "PC Components", name: "مزودات الطاقة", name_en: "Power Supply", icon: "Zap", description: "مزودات الطاقة PSU", description_en: "Power Supply Units", sort_order: 6 },
      { parent: "PC Components", name: "التبريد", name_en: "Cooling", icon: "Fan", description: "مراوح ومبردات", description_en: "Fans and Coolers", sort_order: 7 },
      { parent: "PC Components", name: "الكيسات", name_en: "Cases", icon: "Box", description: "كيسات الكمبيوتر", description_en: "PC Cases", sort_order: 8 },
      
      // Peripherals
      { parent: "Peripherals", name: "لوحات المفاتيح", name_en: "Keyboards", icon: "Keyboard", description: "لوحات مفاتيح ميكانيكية", description_en: "Mechanical Keyboards", sort_order: 1 },
      { parent: "Peripherals", name: "الماوس", name_en: "Mice", icon: "Mouse", description: "ماوس قيمنق", description_en: "Gaming Mice", sort_order: 2 },
      { parent: "Peripherals", name: "السماعات", name_en: "Headsets", icon: "Headphones", description: "سماعات رأس قيمنق", description_en: "Gaming Headsets", sort_order: 3 },
      { parent: "Peripherals", name: "ماوس باد", name_en: "Mouse Pads", icon: "Square", description: "ماوس باد قيمنق", description_en: "Gaming Mouse Pads", sort_order: 4 },
      
      // Displays
      { parent: "Displays", name: "الشاشات", name_en: "Gaming Monitors", icon: "Monitor", description: "شاشات قيمنق", description_en: "Gaming Monitors", sort_order: 1 },
      { parent: "Displays", name: "ملحقات الشاشة", name_en: "Monitor Accessories", icon: "MonitorDot", description: "لايت بار وحوامل", description_en: "Light Bars and Mounts", sort_order: 2 },
      
      // Streaming Gear
      { parent: "Streaming Gear", name: "الكاميرات", name_en: "Cameras", icon: "Camera", description: "كاميرات ويب للبث", description_en: "Webcams for Streaming", sort_order: 1 },
      { parent: "Streaming Gear", name: "المايكروفونات", name_en: "Microphones", icon: "Mic", description: "مايكروفونات احترافية", description_en: "Professional Microphones", sort_order: 2 },
      
      // Setup Accessories
      { parent: "Setup Accessories", name: "الإضاءة", name_en: "Lighting", icon: "Lightbulb", description: "إضاءة RGB", description_en: "RGB Lighting", sort_order: 1 },
      { parent: "Setup Accessories", name: "الحوامل", name_en: "Stands", icon: "Smartphone", description: "حوامل الأجهزة", description_en: "Device Stands", sort_order: 2 },
      { parent: "Setup Accessories", name: "المحولات", name_en: "Adapters", icon: "Plug", description: "محولات USB ومحولات", description_en: "USB Hubs and Adapters", sort_order: 3 },
      { parent: "Setup Accessories", name: "الأكسسوارات الذكية", name_en: "Smart Accessories", icon: "Sparkles", description: "أجهزة ذكية", description_en: "Smart Devices", sort_order: 4 },
      { parent: "Setup Accessories", name: "الكراسي", name_en: "Chairs", icon: "Armchair", description: "كراسي قيمنق", description_en: "Gaming Chairs", sort_order: 5 },
      { parent: "Setup Accessories", name: "يدات التحكم", name_en: "Controllers", icon: "Gamepad2", description: "يدات قيمنق", description_en: "Gaming Controllers", sort_order: 6 },
      
      // Ready Builds
      { parent: "Ready Builds", name: "تجميعات PC", name_en: "PC Builds", icon: "Pc", description: "أجهزة PC جاهزة", description_en: "Pre-built PCs", sort_order: 1 }
    ];

    const subcategoriesData = subcategories.map(sub => ({
      category_id: categoryMap.get(sub.parent),
      name: sub.name,
      name_en: sub.name_en,
      icon: sub.icon,
      description: sub.description,
      description_en: sub.description_en,
      sort_order: sub.sort_order,
      is_active: true
    })).filter(sub => sub.category_id); // Only include if parent category exists

    console.log('📦 Inserting subcategories...');
    const { data: subsData, error: subsError } = await adminSupabase
      .from('subcategories')
      .insert(subcategoriesData)
      .select();

    if (subsError) {
      console.error('❌ Error inserting subcategories:', subsError);
      throw subsError;
    }

    console.log(`✅ Inserted ${subsData?.length || 0} subcategories`);
    console.log('🎉 Categories setup completed successfully!');
  } catch (error) {
    console.error('❌ Setup failed:', error);
    throw error;
  }
}

// Run the setup
setupCategories()
  .then(() => {
    console.log('✅ Setup complete');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Setup failed:', error);
    process.exit(1);
  });
