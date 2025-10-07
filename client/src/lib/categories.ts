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

// Helper function to determine category and subcategory based on product
export function categorizeProduct(product: any): { categoryId: string; subcategoryId: string } {
  const name = product.name.toLowerCase() || product.nameEn?.toLowerCase() || '';
  const desc = product.description?.toLowerCase() || product.descriptionEn?.toLowerCase() || '';
  
  // PC Components
  if (name.includes('معالج') || name.includes('processor') || name.includes('cpu')) {
    return { categoryId: 'pc-components', subcategoryId: 'processors' };
  }
  if (name.includes('كرت') || name.includes('graphics') || name.includes('gpu') || name.includes('rtx') || name.includes('rx')) {
    return { categoryId: 'pc-components', subcategoryId: 'graphics-cards' };
  }
  if (name.includes('لوحة أم') || name.includes('motherboard')) {
    return { categoryId: 'pc-components', subcategoryId: 'motherboards' };
  }
  if (name.includes('تخزين') || name.includes('ssd') || name.includes('hdd') || name.includes('storage') || name.includes('nvme')) {
    return { categoryId: 'pc-components', subcategoryId: 'storage' };
  }
  if (name.includes('مزود طاقة') || name.includes('power supply') || name.includes('psu')) {
    return { categoryId: 'pc-components', subcategoryId: 'power-supply' };
  }
  if (name.includes('مبرد') || name.includes('cooler') || name.includes('cooling')) {
    return { categoryId: 'pc-components', subcategoryId: 'cooling' };
  }
  
  // Peripherals
  if (name.includes('كيبورد') || name.includes('لوحة مفاتيح') || name.includes('keyboard')) {
    return { categoryId: 'peripherals', subcategoryId: 'keyboards' };
  }
  if (name.includes('ماوس') || name.includes('mouse') && !name.includes('pad')) {
    return { categoryId: 'peripherals', subcategoryId: 'mice' };
  }
  if (name.includes('سماعة') || name.includes('headset') || name.includes('headphone')) {
    return { categoryId: 'peripherals', subcategoryId: 'headsets' };
  }
  if (name.includes('كرسي') || name.includes('chair')) {
    return { categoryId: 'peripherals', subcategoryId: 'chairs' };
  }
  if (name.includes('ماوس باد') || name.includes('mouse pad') || name.includes('mousepad')) {
    return { categoryId: 'peripherals', subcategoryId: 'mouse-pads' };
  }
  
  // Streaming Gear
  if (name.includes('كاميرا') || name.includes('webcam') || name.includes('camera')) {
    return { categoryId: 'streaming-gear', subcategoryId: 'cameras' };
  }
  if (name.includes('مايك') || name.includes('microphone') || name.includes('mic')) {
    return { categoryId: 'streaming-gear', subcategoryId: 'microphones' };
  }
  
  // Displays
  if (name.includes('شاشة') || name.includes('monitor') || name.includes('display')) {
    if (name.includes('قيمنج') || name.includes('gaming') || name.includes('144hz') || name.includes('180hz') || name.includes('240hz')) {
      return { categoryId: 'displays', subcategoryId: 'gaming-monitors' };
    }
    return { categoryId: 'displays', subcategoryId: 'professional-monitors' };
  }
  
  // Ready Builds
  if (name.includes('تجميعة') || name.includes('pc build') || (name.includes('pc') && desc.includes('rtx'))) {
    return { categoryId: 'ready-builds', subcategoryId: 'pc-builds' };
  }
  if (name.includes('لابتوب') || name.includes('laptop')) {
    return { categoryId: 'ready-builds', subcategoryId: 'laptops' };
  }
  if (name.includes('تحكم') || name.includes('controller') || name.includes('gamepad')) {
    return { categoryId: 'ready-builds', subcategoryId: 'controllers' };
  }
  
  // Default fallback
  return { categoryId: 'pc-components', subcategoryId: 'processors' };
}
