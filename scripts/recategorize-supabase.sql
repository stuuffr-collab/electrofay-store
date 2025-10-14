-- إعادة تصنيف المنتجات بشكل ذكي

-- معالجات (Processors/CPU)
UPDATE products SET category = 'processors' 
WHERE (name ILIKE '%معالج%' OR name ILIKE '%بروسيسور%' OR name_en ILIKE '%processor%' OR name_en ILIKE '%cpu%' OR name_en ILIKE '%ryzen%' OR name_en ILIKE '%intel%' OR name_en ILIKE '%core i%');

-- لوحات أم (Motherboards)
UPDATE products SET category = 'motherboards' 
WHERE (name ILIKE '%لوحة أم%' OR name ILIKE '%لوحه ام%' OR name ILIKE '%مذربورد%' OR name_en ILIKE '%motherboard%' OR name_en ILIKE '%mainboard%' OR name_en ILIKE '%mobo%');

-- ذاكرة RAM
UPDATE products SET category = 'ram' 
WHERE (name ILIKE '%رام%' OR name ILIKE '%ذاكرة%' OR name_en ILIKE '%ram%' OR name_en ILIKE '%memory%' OR name_en ILIKE '%ddr4%' OR name_en ILIKE '%ddr5%') 
  AND category != 'storage_ssd' AND category != 'storage_hdd';

-- كروت الشاشة (Graphics Cards)
UPDATE products SET category = 'graphics_cards' 
WHERE (name ILIKE '%كرت شاشة%' OR name ILIKE '%كارت شاشة%' OR name ILIKE '%كرت جرافيك%' OR name_en ILIKE '%graphics card%' OR name_en ILIKE '%gpu%' OR name_en ILIKE '%nvidia%' OR name_en ILIKE '%rtx%' OR name_en ILIKE '%gtx%' OR name_en ILIKE '%radeon%' OR name_en ILIKE '%geforce%');

-- التخزين SSD
UPDATE products SET category = 'storage_ssd' 
WHERE (name_en ILIKE '%ssd%' OR name_en ILIKE '%nvme%' OR name_en ILIKE '%solid state%' OR name ILIKE '%nvme%' OR name ILIKE '%ssd%');

-- التخزين HDD (ما لم يكن SSD)
UPDATE products SET category = 'storage_hdd' 
WHERE (name ILIKE '%هارد%' OR name ILIKE '%قرص صلب%' OR name_en ILIKE '%hdd%' OR name_en ILIKE '%hard disk%' OR name_en ILIKE '%hard drive%') 
  AND category != 'storage_ssd';

-- مزودات الطاقة (Power Supply)
UPDATE products SET category = 'power_supplies' 
WHERE (name ILIKE '%باور%' OR name ILIKE '%مزود طاقة%' OR name_en ILIKE '%power supply%' OR name_en ILIKE '%psu%');

-- التبريد (Cooling) - مراوح ومبردات
UPDATE products SET category = 'cooling' 
WHERE (name ILIKE '%مبرد%' OR name ILIKE '%تبريد%' OR name ILIKE '%مروحة%' OR name ILIKE '%مراوح%' OR name_en ILIKE '%cooler%' OR name_en ILIKE '%cooling%' OR name_en ILIKE '%fan%' OR name_en ILIKE '%aio%' OR name_en ILIKE '%water cooling%')
  AND category != 'cases'; -- التأكد من عدم تغيير الكيسات التي تحتوي على مراوح

-- علب الكمبيوتر (Cases)  
UPDATE products SET category = 'cases' 
WHERE (name ILIKE '%كيس%' OR name ILIKE '%علبة%' OR name_en ILIKE '%case%' OR name_en ILIKE '%chassis%')
  AND name NOT ILIKE '%مراوح%' AND name_en NOT ILIKE '%fan%';

-- لوحات المفاتيح (Keyboards)
UPDATE products SET category = 'keyboards' 
WHERE (name ILIKE '%لوحة مفاتيح%' OR name ILIKE '%كيبورد%' OR name_en ILIKE '%keyboard%');

-- الماوس (Mouse)
UPDATE products SET category = 'mice' 
WHERE (name ILIKE '%ماوس%' OR name ILIKE '%فأرة%' OR name_en ILIKE '%mouse%');

-- السماعات (Headsets)
UPDATE products SET category = 'headsets' 
WHERE (name ILIKE '%سماعة%' OR name ILIKE '%سماعات%' OR name_en ILIKE '%headset%' OR name_en ILIKE '%headphone%');

-- الشاشات (Monitors)
UPDATE products SET category = 'monitors' 
WHERE (name ILIKE '%شاشة%' OR name ILIKE '%مونيتور%' OR name_en ILIKE '%monitor%' OR name_en ILIKE '%display%')
  AND name NOT ILIKE '%كرت%'; -- التأكد من عدم تصنيف كروت الشاشة هنا

-- أذرع التحكم (Controllers)
UPDATE products SET category = 'controllers' 
WHERE (name ILIKE '%جهاز تحكم%' OR name ILIKE '%يد تحكم%' OR name_en ILIKE '%controller%' OR name_en ILIKE '%gamepad%');

-- كاميرا ويب (Webcam)
UPDATE products SET category = 'webcams' 
WHERE (name ILIKE '%كاميرا%' OR name ILIKE '%ويب كام%' OR name_en ILIKE '%webcam%');

-- ميكروفون (Microphone)
UPDATE products SET category = 'microphones' 
WHERE (name ILIKE '%ميكروفون%' OR name ILIKE '%مايك%' OR name_en ILIKE '%microphone%' OR name_en ILIKE '%mic%');

-- لابتوب (Laptops)
UPDATE products SET category = 'laptops' 
WHERE (name ILIKE '%لابتوب%' OR name ILIKE '%لاب توب%' OR name_en ILIKE '%laptop%' OR name_en ILIKE '%notebook%');

-- أجهزة مكتبية (Desktop PC)
UPDATE products SET category = 'desktops' 
WHERE (name ILIKE '%جهاز كمبيوتر%' OR name ILIKE '%كمبيوتر مكتبي%' OR name_en ILIKE '%desktop%' OR (name_en ILIKE '%pc%' AND name_en NOT ILIKE '%gpu%'));

-- أجهزة ألعاب (Gaming Consoles)
UPDATE products SET category = 'consoles' 
WHERE (name ILIKE '%بلايستيشن%' OR name ILIKE '%اكس بوكس%' OR name_en ILIKE '%playstation%' OR name_en ILIKE '%xbox%' OR name_en ILIKE '%console%' OR name_en ILIKE '%ps5%' OR name_en ILIKE '%ps4%');

-- باقي المنتجات: ملحقات عامة
UPDATE products SET category = 'accessories' 
WHERE category = 'gaming' OR category IS NULL;

-- عرض ملخص التصنيفات الجديدة
SELECT category, COUNT(*) as count 
FROM products 
GROUP BY category 
ORDER BY count DESC;
