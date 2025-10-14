import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

// التصنيفات الصحيحة
const CATEGORIES = {
  // مكونات الكمبيوتر
  CPU: 'processors',           // معالجات
  MOTHERBOARD: 'motherboards', // لوحات أم
  RAM: 'ram',                  // ذاكرة RAM
  GPU: 'graphics_cards',       // كروت شاشة
  STORAGE_SSD: 'storage_ssd',  // تخزين SSD
  STORAGE_HDD: 'storage_hdd',  // تخزين HDD
  PSU: 'power_supplies',       // مزودات الطاقة
  CASE: 'cases',               // علب الكمبيوتر
  COOLING: 'cooling',          // التبريد
  
  // ملحقات
  KEYBOARD: 'keyboards',       // لوحات مفاتيح
  MOUSE: 'mice',               // ماوس
  HEADSET: 'headsets',         // سماعات
  MONITOR: 'monitors',         // شاشات
  CONTROLLER: 'controllers',   // أذرع تحكم
  WEBCAM: 'webcams',           // كاميرات ويب
  MICROPHONE: 'microphones',   // ميكروفونات
  
  // أنظمة
  LAPTOP: 'laptops',           // لابتوبات
  DESKTOP: 'desktops',         // أجهزة مكتبية
  CONSOLE: 'consoles',         // أجهزة ألعاب
  
  // أخرى
  ACCESSORIES: 'accessories',  // ملحقات عامة
};

// دالة ذكية لتحديد التصنيف بناءً على الاسم
function categorizeProduct(name: string, nameEn: string): string {
  const combinedText = `${name} ${nameEn}`.toLowerCase();
  
  // معالجات - Processors/CPU
  if (
    combinedText.includes('معالج') || 
    combinedText.includes('بروسيسور') ||
    combinedText.includes('processor') || 
    combinedText.includes('cpu') ||
    combinedText.includes('ryzen') || 
    combinedText.includes('intel') ||
    combinedText.includes('core i')
  ) {
    return CATEGORIES.CPU;
  }
  
  // لوحات أم - Motherboards
  if (
    combinedText.includes('لوحة أم') || 
    combinedText.includes('لوحه ام') ||
    combinedText.includes('مذربورد') ||
    combinedText.includes('motherboard') || 
    combinedText.includes('mainboard') ||
    combinedText.includes('mobo')
  ) {
    return CATEGORIES.MOTHERBOARD;
  }
  
  // ذاكرة RAM
  if (
    combinedText.includes('رام') || 
    combinedText.includes('ذاكرة') ||
    combinedText.includes('ram') || 
    combinedText.includes('memory') ||
    combinedText.includes('ddr4') || 
    combinedText.includes('ddr5')
  ) {
    return CATEGORIES.RAM;
  }
  
  // كروت الشاشة - Graphics Cards
  if (
    combinedText.includes('كرت شاشة') || 
    combinedText.includes('كارت شاشة') ||
    combinedText.includes('كرت جرافيك') ||
    combinedText.includes('graphics card') || 
    combinedText.includes('gpu') ||
    combinedText.includes('nvidia') || 
    combinedText.includes('rtx') ||
    combinedText.includes('gtx') || 
    combinedText.includes('radeon') ||
    combinedText.includes('geforce')
  ) {
    return CATEGORIES.GPU;
  }
  
  // التخزين SSD
  if (
    combinedText.includes('ssd') ||
    combinedText.includes('nvme') ||
    combinedText.includes('solid state')
  ) {
    return CATEGORIES.STORAGE_SSD;
  }
  
  // التخزين HDD
  if (
    combinedText.includes('هارد') || 
    combinedText.includes('قرص صلب') ||
    combinedText.includes('hdd') || 
    combinedText.includes('hard disk') ||
    combinedText.includes('hard drive')
  ) {
    return CATEGORIES.STORAGE_HDD;
  }
  
  // مزودات الطاقة - Power Supply
  if (
    combinedText.includes('باور سبلاي') || 
    combinedText.includes('مزود طاقة') ||
    combinedText.includes('power supply') || 
    combinedText.includes('psu')
  ) {
    return CATEGORIES.PSU;
  }
  
  // التبريد - Cooling
  if (
    combinedText.includes('مبرد') || 
    combinedText.includes('تبريد') ||
    combinedText.includes('مروحة') ||
    combinedText.includes('cooler') || 
    combinedText.includes('cooling') ||
    combinedText.includes('fan') ||
    combinedText.includes('aio') ||
    combinedText.includes('water cooling')
  ) {
    return CATEGORIES.COOLING;
  }
  
  // علب الكمبيوتر - Cases
  if (
    combinedText.includes('كيس') || 
    combinedText.includes('علبة') ||
    combinedText.includes('case') || 
    combinedText.includes('chassis')
  ) {
    return CATEGORIES.CASE;
  }
  
  // لوحات المفاتيح - Keyboards
  if (
    combinedText.includes('لوحة مفاتيح') || 
    combinedText.includes('كيبورد') ||
    combinedText.includes('keyboard')
  ) {
    return CATEGORIES.KEYBOARD;
  }
  
  // الماوس - Mouse
  if (
    combinedText.includes('ماوس') || 
    combinedText.includes('فأرة') ||
    combinedText.includes('mouse')
  ) {
    return CATEGORIES.MOUSE;
  }
  
  // السماعات - Headsets
  if (
    combinedText.includes('سماعة') || 
    combinedText.includes('سماعات') ||
    combinedText.includes('headset') || 
    combinedText.includes('headphone')
  ) {
    return CATEGORIES.HEADSET;
  }
  
  // الشاشات - Monitors
  if (
    combinedText.includes('شاشة') || 
    combinedText.includes('مونيتور') ||
    combinedText.includes('monitor') || 
    combinedText.includes('display')
  ) {
    return CATEGORIES.MONITOR;
  }
  
  // أذرع التحكم - Controllers
  if (
    combinedText.includes('جهاز تحكم') || 
    combinedText.includes('يد تحكم') ||
    combinedText.includes('controller') || 
    combinedText.includes('gamepad')
  ) {
    return CATEGORIES.CONTROLLER;
  }
  
  // كاميرا ويب - Webcam
  if (
    combinedText.includes('كاميرا') || 
    combinedText.includes('ويب كام') ||
    combinedText.includes('webcam')
  ) {
    return CATEGORIES.WEBCAM;
  }
  
  // ميكروفون - Microphone
  if (
    combinedText.includes('ميكروفون') || 
    combinedText.includes('مايك') ||
    combinedText.includes('microphone') || 
    combinedText.includes('mic')
  ) {
    return CATEGORIES.MICROPHONE;
  }
  
  // لابتوب - Laptops
  if (
    combinedText.includes('لابتوب') || 
    combinedText.includes('لاب توب') ||
    combinedText.includes('laptop') || 
    combinedText.includes('notebook')
  ) {
    return CATEGORIES.LAPTOP;
  }
  
  // أجهزة مكتبية - Desktop PC
  if (
    combinedText.includes('جهاز كمبيوتر') || 
    combinedText.includes('كمبيوتر مكتبي') ||
    combinedText.includes('desktop') || 
    combinedText.includes('pc')
  ) {
    return CATEGORIES.DESKTOP;
  }
  
  // أجهزة ألعاب - Gaming Consoles
  if (
    combinedText.includes('بلايستيشن') || 
    combinedText.includes('اكس بوكس') ||
    combinedText.includes('playstation') || 
    combinedText.includes('xbox') ||
    combinedText.includes('console') ||
    combinedText.includes('ps5') || 
    combinedText.includes('ps4')
  ) {
    return CATEGORIES.CONSOLE;
  }
  
  // افتراضي: ملحقات عامة
  return CATEGORIES.ACCESSORIES;
}

async function recategorizeAllProducts() {
  console.log('🔄 جاري جلب جميع المنتجات من Supabase...');
  
  // جلب جميع المنتجات
  const { data: products, error } = await supabase
    .from('products')
    .select('id, name, name_en, category');
  
  if (error) {
    console.error('❌ خطأ في جلب المنتجات:', error);
    return;
  }
  
  if (!products || products.length === 0) {
    console.log('⚠️ لا توجد منتجات في قاعدة البيانات');
    return;
  }
  
  console.log(`✅ تم جلب ${products.length} منتج`);
  console.log('\n📊 إحصائيات التصنيف القديم:');
  
  const oldCategories: Record<string, number> = {};
  products.forEach(p => {
    oldCategories[p.category] = (oldCategories[p.category] || 0) + 1;
  });
  console.table(oldCategories);
  
  console.log('\n🔄 جاري إعادة تصنيف المنتجات...\n');
  
  const updates: Array<{ id: string; oldCategory: string; newCategory: string; name: string }> = [];
  
  for (const product of products) {
    const newCategory = categorizeProduct(product.name, product.name_en);
    
    if (product.category !== newCategory) {
      updates.push({
        id: product.id,
        oldCategory: product.category,
        newCategory,
        name: product.name
      });
    }
  }
  
  console.log(`📝 سيتم تحديث ${updates.length} منتج:\n`);
  
  // عرض التغييرات
  updates.forEach(u => {
    console.log(`  • ${u.name}`);
    console.log(`    من: ${u.oldCategory} ← إلى: ${u.newCategory}\n`);
  });
  
  if (updates.length === 0) {
    console.log('✅ جميع المنتجات مصنفة بشكل صحيح بالفعل!');
    return;
  }
  
  // تحديث المنتجات
  console.log('⚡ جاري تحديث قاعدة البيانات...\n');
  
  let successCount = 0;
  let errorCount = 0;
  
  for (const update of updates) {
    const { error } = await supabase
      .from('products')
      .update({ category: update.newCategory })
      .eq('id', update.id);
    
    if (error) {
      console.error(`❌ فشل تحديث ${update.name}:`, error);
      errorCount++;
    } else {
      successCount++;
    }
  }
  
  console.log(`\n✅ تم التحديث بنجاح: ${successCount} منتج`);
  if (errorCount > 0) {
    console.log(`❌ فشل: ${errorCount} منتج`);
  }
  
  // عرض إحصائيات التصنيف الجديد
  const { data: updatedProducts } = await supabase
    .from('products')
    .select('category');
  
  if (updatedProducts) {
    console.log('\n📊 إحصائيات التصنيف الجديد:');
    const newCategories: Record<string, number> = {};
    updatedProducts.forEach(p => {
      newCategories[p.category] = (newCategories[p.category] || 0) + 1;
    });
    console.table(newCategories);
  }
  
  console.log('\n🎉 تمت إعادة التصنيف بنجاح!');
}

// تشغيل السكريبت
recategorizeAllProducts().catch(console.error);
