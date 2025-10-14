// تعريفات التصنيفات بالعربية والإنجليزية

export const CATEGORY_NAMES: Record<string, { ar: string; en: string }> = {
  // مكونات الكمبيوتر
  processors: { ar: 'معالجات', en: 'Processors' },
  motherboards: { ar: 'لوحات أم', en: 'Motherboards' },
  ram: { ar: 'ذاكرة RAM', en: 'RAM Memory' },
  graphics_cards: { ar: 'كروت الشاشة', en: 'Graphics Cards' },
  storage_ssd: { ar: 'SSD', en: 'SSD Storage' },
  storage_hdd: { ar: 'هاردسك', en: 'HDD Storage' },
  power_supplies: { ar: 'مزودات الطاقة', en: 'Power Supplies' },
  cases: { ar: 'علب الكمبيوتر', en: 'PC Cases' },
  cooling: { ar: 'التبريد', en: 'Cooling' },
  
  // الملحقات
  keyboards: { ar: 'لوحات المفاتيح', en: 'Keyboards' },
  mice: { ar: 'الماوس', en: 'Mice' },
  headsets: { ar: 'السماعات', en: 'Headsets' },
  monitors: { ar: 'الشاشات', en: 'Monitors' },
  controllers: { ar: 'أذرع التحكم', en: 'Controllers' },
  webcams: { ar: 'كاميرات الويب', en: 'Webcams' },
  microphones: { ar: 'الميكروفونات', en: 'Microphones' },
  
  // الأنظمة
  laptops: { ar: 'لابتوبات', en: 'Laptops' },
  desktops: { ar: 'أجهزة مكتبية', en: 'Desktop PCs' },
  consoles: { ar: 'أجهزة ألعاب', en: 'Gaming Consoles' },
  
  // عام
  accessories: { ar: 'ملحقات', en: 'Accessories' },
  gaming: { ar: 'قيمنج', en: 'Gaming' }, // للتوافق مع البيانات القديمة
};

// الحصول على اسم التصنيف بالعربية
export function getCategoryNameAr(category: string): string {
  return CATEGORY_NAMES[category]?.ar || category;
}

// الحصول على اسم التصنيف بالإنجليزية
export function getCategoryNameEn(category: string): string {
  return CATEGORY_NAMES[category]?.en || category;
}

// جميع التصنيفات الرئيسية
export const MAIN_CATEGORIES = [
  { id: 'processors', nameAr: 'معالجات', nameEn: 'Processors', icon: '🔧' },
  { id: 'motherboards', nameAr: 'لوحات أم', nameEn: 'Motherboards', icon: '💾' },
  { id: 'ram', nameAr: 'ذاكرة RAM', nameEn: 'RAM Memory', icon: '💿' },
  { id: 'graphics_cards', nameAr: 'كروت الشاشة', nameEn: 'Graphics Cards', icon: '🎮' },
  { id: 'storage_ssd', nameAr: 'SSD', nameEn: 'SSD Storage', icon: '💽' },
  { id: 'storage_hdd', nameAr: 'هاردسك', nameEn: 'HDD Storage', icon: '💾' },
  { id: 'keyboards', nameAr: 'لوحات المفاتيح', nameEn: 'Keyboards', icon: '⌨️' },
  { id: 'mice', nameAr: 'الماوس', nameEn: 'Mice', icon: '🖱️' },
  { id: 'headsets', nameAr: 'السماعات', nameEn: 'Headsets', icon: '🎧' },
  { id: 'monitors', nameAr: 'الشاشات', nameEn: 'Monitors', icon: '🖥️' },
  { id: 'power_supplies', nameAr: 'مزودات الطاقة', nameEn: 'Power Supplies', icon: '⚡' },
  { id: 'cooling', nameAr: 'التبريد', nameEn: 'Cooling', icon: '❄️' },
  { id: 'cases', nameAr: 'علب الكمبيوتر', nameEn: 'PC Cases', icon: '📦' },
  { id: 'accessories', nameAr: 'ملحقات', nameEn: 'Accessories', icon: '🎯' },
];
