import { Product } from "@/components/ProductCard";

export type SmartCategory = 
  | "all"
  | "pc_components"
  | "gaming_peripherals"
  | "setup_equipment"
  | "accessories";

export const categoryLabels: Record<SmartCategory, { ar: string; en: string }> = {
  all: { ar: "الكل", en: "All" },
  pc_components: { ar: "قطع الكمبيوتر", en: "PC Components" },
  gaming_peripherals: { ar: "ملحقات القيمنج", en: "Gaming Peripherals" },
  setup_equipment: { ar: "الإعداد والتجهيزات", en: "Setup & Equipment" },
  accessories: { ar: "اكسسوارات", en: "Accessories" },
};

export function categorizeProduct(product: Product): SmartCategory {
  const name = product.nameEn?.toLowerCase() || product.name.toLowerCase();
  
  // PC Components: Processors, GPUs, Motherboards, Storage, Cooling, PSU, Cases
  if (
    name.includes('processor') || name.includes('cpu') || 
    name.includes('ryzen') || name.includes('intel') || name.includes('معالج') ||
    name.includes('graphic') || name.includes('gpu') || 
    name.includes('rtx') || name.includes('gtx') || name.includes('كرت شاشة') ||
    name.includes('motherboard') || name.includes('لوحة أم') ||
    name.includes('ssd') || name.includes('hdd') || 
    name.includes('nvme') || name.includes('storage') || name.includes('تخزين') ||
    name.includes('cooling') || name.includes('cooler') || 
    name.includes('fan') || name.includes('تبريد') ||
    name.includes('power supply') || name.includes('psu') || name.includes('باور') ||
    name.includes('case') || name.includes('كيس')
  ) {
    return 'pc_components';
  }
  
  // Gaming Peripherals: Keyboards, Mice, Headsets
  if (
    name.includes('keyboard') || name.includes('لوحة مفاتيح') ||
    name.includes('mouse') || name.includes('فأرة') || name.includes('ماوس') ||
    name.includes('headset') || name.includes('headphone') || name.includes('سماعة')
  ) {
    return 'gaming_peripherals';
  }
  
  // Setup & Equipment: Chairs, Monitors, Webcams
  if (
    name.includes('chair') || name.includes('كرسي') ||
    name.includes('monitor') || name.includes('display') || name.includes('شاشة') ||
    name.includes('webcam') || name.includes('camera') || name.includes('كاميرا') ||
    name.includes('mic') || name.includes('microphone') || name.includes('مايك')
  ) {
    return 'setup_equipment';
  }
  
  // Everything else: Accessories
  return 'accessories';
}

export function filterBySmartCategory(
  products: Product[],
  category: SmartCategory
): Product[] {
  if (category === 'all') {
    return products;
  }
  
  return products.filter(product => categorizeProduct(product) === category);
}
