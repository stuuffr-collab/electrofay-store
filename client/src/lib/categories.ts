import { Monitor, Cpu, HardDrive, Keyboard, Mouse, Headphones, Gamepad2, Laptop, Camera, Mic, Fan, Power, CircuitBoard, SlidersHorizontal, Armchair, Box, LucideIcon } from 'lucide-react';

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
        name: 'التبريد',
        nameEn: 'Cooling',
        icon: Fan,
        description: 'مبردات هوائية ومائية',
        descriptionEn: 'Air & Liquid Cooling'
      }
    ]
  },
  {
    id: 'peripherals',
    name: 'ملحقات الكمبيوتر',
    nameEn: 'Computer Peripherals',
    icon: Keyboard,
    description: 'سماعات، ماوس، كيبورد، كراسي وملحقات أخرى',
    descriptionEn: 'Headsets, Mice, Keyboards, Chairs & More',
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
        id: 'chairs',
        name: 'الكراسي',
        nameEn: 'Chairs',
        icon: Armchair,
        description: 'كراسي قيمنج ومكتبية',
        descriptionEn: 'Gaming & Office Chairs'
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
    description: 'كاميرات، مايكروفونات، إضاءة وملحقات البث',
    descriptionEn: 'Cameras, Microphones, Lighting & Streaming Accessories',
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
      },
      {
        id: 'lighting',
        name: 'الإضاءة',
        nameEn: 'Lighting',
        icon: Fan,
        description: 'إضاءة LED و RGB للسيت أب',
        descriptionEn: 'LED & RGB Lighting for Setup'
      }
    ]
  },
  {
    id: 'setup-accessories',
    name: 'إكسسوارات السيت أب',
    nameEn: 'Setup Accessories',
    icon: SlidersHorizontal,
    description: 'حوامل، هبات USB، محولات ومستشعرات',
    descriptionEn: 'Stands, USB Hubs, Adapters & Sensors',
    color: '#06b6d4',
    gradient: 'from-cyan-500 to-cyan-700',
    subcategories: [
      {
        id: 'stands',
        name: 'الحوامل',
        nameEn: 'Stands',
        icon: SlidersHorizontal,
        description: 'حوامل مايكروفونات وشاشات',
        descriptionEn: 'Microphone & Monitor Stands'
      },
      {
        id: 'hubs-adapters',
        name: 'هبات ومحولات',
        nameEn: 'Hubs & Adapters',
        icon: CircuitBoard,
        description: 'USB Hub و Bluetooth Adapter',
        descriptionEn: 'USB Hubs & Bluetooth Adapters'
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
    description: 'شاشات قيمنج واحترافية بمختلف الأحجام',
    descriptionEn: 'Gaming & Professional Monitors in Various Sizes',
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
        id: 'professional-monitors',
        name: 'شاشات احترافية',
        nameEn: 'Professional Monitors',
        icon: Monitor,
        description: 'شاشات للتصميم والعمل',
        descriptionEn: 'Design & Work Monitors'
      }
    ]
  },
  {
    id: 'ready-builds',
    name: 'التجميعات الجاهزة',
    nameEn: 'Ready Builds & Systems',
    icon: Laptop,
    description: 'تجميعات PC جاهزة، لابتوبات، أجهزة تحكم',
    descriptionEn: 'Ready PC Builds, Laptops, Controllers',
    color: '#f59e0b',
    gradient: 'from-amber-500 to-amber-700',
    subcategories: [
      {
        id: 'pc-builds',
        name: 'تجميعات PC',
        nameEn: 'PC Builds',
        icon: Box,
        description: 'تجميعات جاهزة للألعاب والعمل',
        descriptionEn: 'Ready Gaming & Work Builds'
      },
      {
        id: 'laptops',
        name: 'اللابتوبات',
        nameEn: 'Laptops',
        icon: Laptop,
        description: 'لابتوبات قيمنج واحترافية',
        descriptionEn: 'Gaming & Professional Laptops'
      },
      {
        id: 'controllers',
        name: 'أجهزة التحكم',
        nameEn: 'Controllers',
        icon: Gamepad2,
        description: 'أجهزة تحكم للألعاب',
        descriptionEn: 'Gaming Controllers'
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
  
  // PC Components - المعالجات
  if (combined.match(/معالج|processor|cpu|intel|ryzen|i[3579]|ryzen [3579]/)) {
    return { categoryId: 'pc-components', subcategoryId: 'processors' };
  }
  
  // PC Components - كروت الشاشة
  if (combined.match(/كرت شاشة|graphics|gpu|rtx|gtx|vga|rx [4567]|nvidia|radeon/)) {
    return { categoryId: 'pc-components', subcategoryId: 'graphics-cards' };
  }
  
  // PC Components - اللوحات الأم
  if (combined.match(/لوحة أم|motherboard|mainboard|gigabyte|asus|msi|b[45][567]0|z[4567]90|x[4567]70/)) {
    return { categoryId: 'pc-components', subcategoryId: 'motherboards' };
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
  
  // PC Components - التبريد
  if (combined.match(/مبرد|تبريد|cooler|cooling|fan|liquid|airflow|aio/)) {
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
  
  // Peripherals - الكراسي
  if (combined.match(/كرسي|chair|gaming chair|ergonomic|مقعد/)) {
    return { categoryId: 'peripherals', subcategoryId: 'chairs' };
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
  
  // Displays - الشاشات
  if (combined.match(/شاشة|monitor|display|screen/)) {
    if (combined.match(/قيمنج|gaming|144hz|165hz|180hz|240hz|curved|1ms/)) {
      return { categoryId: 'displays', subcategoryId: 'gaming-monitors' };
    }
    return { categoryId: 'displays', subcategoryId: 'professional-monitors' };
  }
  
  // Ready Builds - التجميعات
  if (combined.match(/تجميعة|pc build|bundle|pre.?built/)) {
    return { categoryId: 'ready-builds', subcategoryId: 'pc-builds' };
  }
  
  // Ready Builds - اللابتوبات
  if (combined.match(/لابتوب|laptop|notebook/)) {
    return { categoryId: 'ready-builds', subcategoryId: 'laptops' };
  }
  
  // Ready Builds - Controllers
  if (combined.match(/تحكم|controller|gamepad|joystick|xbox|ps[45]/)) {
    return { categoryId: 'ready-builds', subcategoryId: 'controllers' };
  }
  
  // Streaming Gear - LED & RGB Lighting
  if (combined.match(/led|rgb|إضاءة|light bar|strip|govee|نيون/)) {
    return { categoryId: 'streaming-gear', subcategoryId: 'lighting' };
  }
  
  // Setup Accessories - Stands
  if (combined.match(/حامل|stand|mount|arm|قاعدة/)) {
    return { categoryId: 'setup-accessories', subcategoryId: 'stands' };
  }
  
  // Setup Accessories - Hubs & Adapters
  if (combined.match(/hub|adapter|محول|bluetooth|wi-?fi|usb.*hub|شبكة|network/)) {
    return { categoryId: 'setup-accessories', subcategoryId: 'hubs-adapters' };
  }
  
  // Setup Accessories - Smart Accessories
  if (combined.match(/sensor|مستشعر|smart|ذكي|iot/)) {
    return { categoryId: 'setup-accessories', subcategoryId: 'smart-accessories' };
  }
  
  // Fallback to generic PC components
  return { categoryId: 'pc-components', subcategoryId: 'processors' };
}
