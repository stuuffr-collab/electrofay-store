import { Monitor, Cpu, HardDrive, Keyboard, Mouse, Headphones, Gamepad2, Laptop, Camera, Mic, Fan, Power, CircuitBoard, SlidersHorizontal, Armchair, Box, LucideIcon, Lightbulb, Cable } from 'lucide-react';

// Icon mapping to convert string icon names to LucideIcon components
export const iconMap: Record<string, LucideIcon> = {
  'Monitor': Monitor,
  'Cpu': Cpu,
  'HardDrive': HardDrive,
  'Keyboard': Keyboard,
  'Mouse': Mouse,
  'Headphones': Headphones,
  'Gamepad2': Gamepad2,
  'Laptop': Laptop,
  'Camera': Camera,
  'Mic': Mic,
  'Fan': Fan,
  'Power': Power,
  'CircuitBoard': CircuitBoard,
  'SlidersHorizontal': SlidersHorizontal,
  'Armchair': Armchair,
  'Box': Box,
  'Lightbulb': Lightbulb,
  'Cable': Cable,
};

// Helper function to get icon from string name
export function getIconFromString(iconName: string): LucideIcon {
  return iconMap[iconName] || Box; // Default to Box if icon not found
}

export interface Subcategory {
  id: string;
  name: string;
  nameEn: string;
  icon: LucideIcon;
  description: string;
  descriptionEn: string;
}

export interface Category {
  id: string;
  name: string;
  nameEn: string;
  icon: LucideIcon;
  description: string;
  descriptionEn: string;
  color: string;
  gradient: string;
  subcategories: Subcategory[];
}

export const categories: Category[] = [
  {
    id: 'pc-components',
    name: 'قطع الكمبيوتر',
    nameEn: 'PC Components',
    icon: Cpu,
    description: 'معالجات، كروت شاشة، رامات، مزودات طاقة، تخزين، لوحات أم',
    descriptionEn: 'Processors, Graphics Cards, RAM, Power Supplies, Storage, Motherboards',
    color: '#3b82f6',
    gradient: 'from-blue-500 to-blue-700',
    subcategories: [
      {
        id: 'processors',
        name: 'المعالجات',
        nameEn: 'Processors',
        icon: Cpu,
        description: 'معالجات Intel و AMD',
        descriptionEn: 'Intel & AMD Processors'
      },
      {
        id: 'graphics-cards',
        name: 'كروت الشاشة',
        nameEn: 'Graphics Cards',
        icon: CircuitBoard,
        description: 'كروت الشاشة NVIDIA و AMD',
        descriptionEn: 'NVIDIA & AMD Graphics Cards'
      },
      {
        id: 'motherboards',
        name: 'اللوحات الأم',
        nameEn: 'Motherboards',
        icon: CircuitBoard,
        description: 'لوحات أم للألعاب والعمل',
        descriptionEn: 'Gaming & Professional Motherboards'
      },
      {
        id: 'memory',
        name: 'الذاكرة (RAM)',
        nameEn: 'Memory (RAM)',
        icon: CircuitBoard,
        description: 'ذاكرة DDR4 و DDR5',
        descriptionEn: 'DDR4 & DDR5 Memory'
      },
      {
        id: 'storage',
        name: 'التخزين',
        nameEn: 'Storage',
        icon: HardDrive,
        description: 'SSD و HDD و NVMe',
        descriptionEn: 'SSD, HDD & NVMe'
      },
      {
        id: 'power-supply',
        name: 'مزودات الطاقة',
        nameEn: 'Power Supplies',
        icon: Power,
        description: 'مزودات طاقة معيارية وكاملة',
        descriptionEn: 'Modular & Full Power Supplies'
      },
      {
        id: 'cooling',
        name: 'المبردات',
        nameEn: 'Cooling',
        icon: Fan,
        description: 'مبردات هوائية ومائية ومراوح',
        descriptionEn: 'Air & Liquid Cooling & Fans'
      },
      {
        id: 'cases',
        name: 'كيس الكمبيوتر',
        nameEn: 'PC Cases',
        icon: Box,
        description: 'صناديق وكيسات الكمبيوتر',
        descriptionEn: 'Computer Cases & Enclosures'
      }
    ]
  },
  {
    id: 'peripherals',
    name: 'ملحقات الكمبيوتر',
    nameEn: 'Computer Peripherals',
    icon: Keyboard,
    description: 'سماعات، ماوس، كيبورد وملحقات أخرى',
    descriptionEn: 'Headsets, Mice, Keyboards & More',
    color: '#8b5cf6',
    gradient: 'from-purple-500 to-purple-700',
    subcategories: [
      {
        id: 'keyboards',
        name: 'لوحات المفاتيح',
        nameEn: 'Keyboards',
        icon: Keyboard,
        description: 'لوحات مفاتيح ميكانيكية وعادية',
        descriptionEn: 'Mechanical & Membrane Keyboards'
      },
      {
        id: 'mice',
        name: 'الماوس',
        nameEn: 'Mice',
        icon: Mouse,
        description: 'ماوس سلكية ولاسلكية',
        descriptionEn: 'Wired & Wireless Mice'
      },
      {
        id: 'headsets',
        name: 'السماعات',
        nameEn: 'Headsets',
        icon: Headphones,
        description: 'سماعات قيمنج واحترافية',
        descriptionEn: 'Gaming & Professional Headsets'
      },
      {
        id: 'mouse-pads',
        name: 'ماوس باد',
        nameEn: 'Mouse Pads',
        icon: SlidersHorizontal,
        description: 'ماوس باد RGB وعادية',
        descriptionEn: 'RGB & Regular Mouse Pads'
      }
    ]
  },
  {
    id: 'streaming-gear',
    name: 'معدات البث والستريمنج',
    nameEn: 'Streaming Gear',
    icon: Camera,
    description: 'كاميرات ومايكروفونات البث',
    descriptionEn: 'Cameras & Microphones for Streaming',
    color: '#ec4899',
    gradient: 'from-pink-500 to-pink-700',
    subcategories: [
      {
        id: 'cameras',
        name: 'الكاميرات',
        nameEn: 'Cameras',
        icon: Camera,
        description: 'كاميرات ويب للستريمنج',
        descriptionEn: 'Streaming Webcams'
      },
      {
        id: 'microphones',
        name: 'المايكروفونات',
        nameEn: 'Microphones',
        icon: Mic,
        description: 'مايكروفونات USB واحترافية',
        descriptionEn: 'USB & Professional Microphones'
      }
    ]
  },
  {
    id: 'setup-accessories',
    name: 'إكسسوارات السيت أب',
    nameEn: 'Setup Accessories',
    icon: SlidersHorizontal,
    description: 'كراسي، إضاءة، حوامل، محولات وأجهزة التحكم',
    descriptionEn: 'Chairs, Lighting, Stands, Adapters & Controllers',
    color: '#06b6d4',
    gradient: 'from-cyan-500 to-cyan-700',
    subcategories: [
      {
        id: 'chairs',
        name: 'الكراسي',
        nameEn: 'Chairs',
        icon: Armchair,
        description: 'كراسي قيمنج ومكتبية',
        descriptionEn: 'Gaming & Office Chairs'
      },
      {
        id: 'lighting',
        name: 'الإضاءة',
        nameEn: 'Lighting',
        icon: Lightbulb,
        description: 'إضاءة LED و RGB للسيت أب',
        descriptionEn: 'LED & RGB Lighting for Setup'
      },
      {
        id: 'stands',
        name: 'الحوامل',
        nameEn: 'Stands',
        icon: SlidersHorizontal,
        description: 'حوامل مايكروفونات وشاشات',
        descriptionEn: 'Microphone & Monitor Stands'
      },
      {
        id: 'adapters',
        name: 'المحولات',
        nameEn: 'Adapters',
        icon: Cable,
        description: 'محولات USB وBluetooth وشبكة',
        descriptionEn: 'USB, Bluetooth & Network Adapters'
      },
      {
        id: 'controllers',
        name: 'أجهزة التحكم',
        nameEn: 'Controllers',
        icon: Gamepad2,
        description: 'أجهزة تحكم للألعاب',
        descriptionEn: 'Gaming Controllers'
      },
      {
        id: 'smart-accessories',
        name: 'ملحقات ذكية',
        nameEn: 'Smart Accessories',
        icon: SlidersHorizontal,
        description: 'مستشعرات وأجهزة جانبية ذكية',
        descriptionEn: 'Sensors & Smart Devices'
      }
    ]
  },
  {
    id: 'displays',
    name: 'الشاشات والعرض',
    nameEn: 'Displays & Monitors',
    icon: Monitor,
    description: 'شاشات الألعاب وملحقاتها',
    descriptionEn: 'Gaming Monitors & Accessories',
    color: '#10b981',
    gradient: 'from-green-500 to-green-700',
    subcategories: [
      {
        id: 'gaming-monitors',
        name: 'شاشات الألعاب',
        nameEn: 'Gaming Monitors',
        icon: Monitor,
        description: 'شاشات عالية التحديث للألعاب',
        descriptionEn: 'High Refresh Rate Gaming Monitors'
      },
      {
        id: 'monitor-accessories',
        name: 'ملحقات شاشة',
        nameEn: 'Monitor Accessories',
        icon: Lightbulb,
        description: 'إضاءة وملحقات للشاشات',
        descriptionEn: 'Lighting & Monitor Accessories'
      }
    ]
  },
  {
    id: 'ready-builds',
    name: 'التجميعات الجاهزة',
    nameEn: 'Ready Builds',
    icon: Box,
    description: 'تجميعات PC جاهزة للألعاب والعمل',
    descriptionEn: 'Ready PC Builds for Gaming & Work',
    color: '#f59e0b',
    gradient: 'from-amber-500 to-amber-700',
    subcategories: [
      {
        id: 'pc-builds',
        name: 'تجميعات جاهزة',
        nameEn: 'Ready Builds',
        icon: Box,
        description: 'تجميعات جاهزة للألعاب والعمل',
        descriptionEn: 'Ready Gaming & Work Builds'
      }
    ]
  }
];

// Helper function to get category by ID
export function getCategoryById(id: string): Category | undefined {
  return categories.find(cat => cat.id === id);
}

// Helper function to get subcategory by ID
export function getSubcategoryById(categoryId: string, subcategoryId: string): Subcategory | undefined {
  const category = getCategoryById(categoryId);
  return category?.subcategories.find(sub => sub.id === subcategoryId);
}

// Helper function to map old category to new system
export function mapOldCategoryToNew(oldCategory: string): { categoryId: string; subcategoryId: string } {
  const mapping: Record<string, { categoryId: string; subcategoryId: string }> = {
    'gaming_accessory': { categoryId: 'peripherals', subcategoryId: 'keyboards' },
    'gaming_pc': { categoryId: 'pc-components', subcategoryId: 'graphics-cards' },
    'gaming_console': { categoryId: 'ready-builds', subcategoryId: 'controllers' },
    'streaming_gear': { categoryId: 'streaming-gear', subcategoryId: 'cameras' }
  };
  
  return mapping[oldCategory] || { categoryId: 'pc-components', subcategoryId: 'processors' };
}

// Enhanced AI-powered product categorization with comprehensive keyword matching
export function categorizeProduct(product: any): { categoryId: string; subcategoryId: string } {
  const name = (product.name?.toLowerCase() || product.nameEn?.toLowerCase() || '');
  const desc = (product.description?.toLowerCase() || product.descriptionEn?.toLowerCase() || '');
  const combined = `${name} ${desc}`;
  
  // PC Components - كروت الشاشة (check FIRST to avoid confusion with displays)
  if (combined.match(/كرت شاشة|graphics card|gpu|rtx|gtx|geforce|vga|rx [4567]|nvidia|radeon/) && !combined.match(/\bشاشة\b.*(?:gaming|monitor|24|27|curved)|\bmonitor\b/)) {
    return { categoryId: 'pc-components', subcategoryId: 'graphics-cards' };
  }
  
  // Displays - ملحقات شاشة (monitor accessories like light bars)
  if (combined.match(/colorpanda|monitor light|لايت بار/) && combined.match(/monitor|شاشة/)) {
    return { categoryId: 'displays', subcategoryId: 'monitor-accessories' };
  }
  
  // Displays - الشاشات (all monitors)
  if (combined.match(/شاشة|شاشات|\bmonitor\b|gaming monitor|curved|ultrawide|ips panel|refresh rate|144hz|165hz|240hz|27 inch|24 inch/) || 
      (combined.match(/\bdisplay\b|screen/) && !combined.match(/adapter|محول|رام|ram|memory|ddr|graphics|gpu|rtx|gtx/))) {
    return { categoryId: 'displays', subcategoryId: 'gaming-monitors' };
  }
  
  // PC Components - اللوحات الأم (check before processors)
  if (combined.match(/لوحة أم|motherboard|mainboard/)) {
    return { categoryId: 'pc-components', subcategoryId: 'motherboards' };
  }
  
  // PC Components - المعالجات
  if (combined.match(/معالج|processor|cpu|ryzen|i[3579]|ryzen [3579]/) && !combined.match(/motherboard|لوحة أم/)) {
    return { categoryId: 'pc-components', subcategoryId: 'processors' };
  }
  
  // PC Components - الرامات
  if (combined.match(/رام|ذاكرة|ram|ddr[345]|memory|16gb|32gb|8gb/) && !combined.match(/ssd|nvme|hdd|storage/)) {
    return { categoryId: 'pc-components', subcategoryId: 'memory' };
  }
  
  // PC Components - التخزين
  if (combined.match(/تخزين|ssd|nvme|hdd|m\.2|storage|hard disk|500gb|1tb|2tb/)) {
    return { categoryId: 'pc-components', subcategoryId: 'storage' };
  }
  
  // PC Components - مزودات الطاقة
  if (combined.match(/مزود طاقة|power supply|psu|watt|bronze|gold|platinum|[567][05]0w/)) {
    return { categoryId: 'pc-components', subcategoryId: 'power-supply' };
  }
  
  // PC Components - كيس الكمبيوتر
  if (combined.match(/كيس|case|chassis|tower/)) {
    return { categoryId: 'pc-components', subcategoryId: 'cases' };
  }
  
  // PC Components - المبردات (cooling fans)
  if (combined.match(/مبرد|تبريد|مروحة|مراوح|cooler|cooling|fan|liquid|airflow|aio/) && !combined.match(/كيس|case/)) {
    return { categoryId: 'pc-components', subcategoryId: 'cooling' };
  }
  
  // Peripherals - لوحات المفاتيح
  if (combined.match(/كيبورد|لوحة مفاتيح|keyboard|mechanical|rgb keyboard|keychron/)) {
    return { categoryId: 'peripherals', subcategoryId: 'keyboards' };
  }
  
  // Peripherals - الماوس
  if (combined.match(/ماوس(?! باد)|mouse(?! pad)|dpi|wireless mouse|gaming mouse/) && !combined.includes('pad')) {
    return { categoryId: 'peripherals', subcategoryId: 'mice' };
  }
  
  // Peripherals - السماعات
  if (combined.match(/سماعة|سماعات|headset|headphone|hyperx|razer|gaming headset/)) {
    return { categoryId: 'peripherals', subcategoryId: 'headsets' };
  }
  
  // Peripherals - Mouse Pads
  if (combined.match(/ماوس باد|mouse ?pad|mousepad/)) {
    return { categoryId: 'peripherals', subcategoryId: 'mouse-pads' };
  }
  
  // Streaming Gear - الكاميرات
  if (combined.match(/كاميرا|webcam|camera|streaming cam|logitech.*c[97]/)) {
    return { categoryId: 'streaming-gear', subcategoryId: 'cameras' };
  }
  
  // Streaming Gear - المايكروفونات
  if (combined.match(/مايك|ميكروفون|microphone|mic|condenser|blue yeti|usb mic/)) {
    return { categoryId: 'streaming-gear', subcategoryId: 'microphones' };
  }
  
  // Setup Accessories - الكراسي (moved from peripherals)
  if (combined.match(/كرسي|chair|gaming chair|ergonomic|مقعد/)) {
    return { categoryId: 'setup-accessories', subcategoryId: 'chairs' };
  }
  
  // Setup Accessories - الإضاءة (moved from streaming-gear)
  if (combined.match(/led|rgb|إضاءة|light strip|govee|نيون/) && !combined.match(/monitor|شاشة/)) {
    return { categoryId: 'setup-accessories', subcategoryId: 'lighting' };
  }
  
  // Setup Accessories - Controllers (moved from ready-builds)
  if (combined.match(/تحكم|controller|gamepad|joystick|xbox|ps[45]/)) {
    return { categoryId: 'setup-accessories', subcategoryId: 'controllers' };
  }
  
  // Setup Accessories - Stands
  if (combined.match(/حامل|stand|mount|arm|قاعدة/)) {
    return { categoryId: 'setup-accessories', subcategoryId: 'stands' };
  }
  
  // Setup Accessories - Adapters (renamed from hubs-adapters)
  if (combined.match(/hub|adapter|محول|bluetooth|wi-?fi|usb.*hub|شبكة|network/)) {
    return { categoryId: 'setup-accessories', subcategoryId: 'adapters' };
  }
  
  // Setup Accessories - Smart Accessories
  if (combined.match(/sensor|مستشعر|smart|ذكي|iot/)) {
    return { categoryId: 'setup-accessories', subcategoryId: 'smart-accessories' };
  }
  
  // Ready Builds - التجميعات (only PC builds now)
  if (combined.match(/تجميعة|pc build|bundle|pre.?built/)) {
    return { categoryId: 'ready-builds', subcategoryId: 'pc-builds' };
  }
  
  // Fallback to generic PC components
  return { categoryId: 'pc-components', subcategoryId: 'processors' };
}
