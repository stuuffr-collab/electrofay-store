import { useProducts } from "@/hooks/useProducts";
import { useEffect, useState } from "react";

export default function AnalyzeProducts() {
  const { data: products = [], isLoading } = useProducts();
  const [analysis, setAnalysis] = useState<any>(null);
  const [smartAnalysis, setSmartAnalysis] = useState<any>(null);

  useEffect(() => {
    if (products.length > 0) {
      // Original category analysis
      const categories: Record<string, string[]> = {};
      
      products.forEach(p => {
        if (!categories[p.category]) {
          categories[p.category] = [];
        }
        categories[p.category].push(p.name);
      });

      const result = Object.entries(categories)
        .map(([cat, items]) => ({
          category: cat,
          count: items.length,
          samples: items.slice(0, 5)
        }))
        .sort((a, b) => b.count - a.count);

      setAnalysis(result);
      
      // Smart categorization based on product names
      const smartCategories: Record<string, any[]> = {
        'Keyboards - لوحات مفاتيح': [],
        'Mice - فأرة': [],
        'Headsets - سماعات': [],
        'Monitors - شاشات': [],
        'Chairs - كراسي': [],
        'Processors - معالجات': [],
        'Motherboards - لوحات أم': [],
        'Graphics Cards - كروت شاشة': [],
        'Power Supply - باور': [],
        'Storage - تخزين': [],
        'Cooling - تبريد': [],
        'Cases - كيسات': [],
        'Webcams - كاميرات': [],
        'Microphones - مايكات': [],
        'Accessories - اكسسوارات': []
      };
      
      products.forEach(p => {
        const name = p.nameEn?.toLowerCase() || p.name.toLowerCase();
        
        if (name.includes('keyboard') || name.includes('لوحة مفاتيح')) {
          smartCategories['Keyboards - لوحات مفاتيح'].push(p);
        } else if (name.includes('mouse') || name.includes('فأرة') || name.includes('ماوس')) {
          smartCategories['Mice - فأرة'].push(p);
        } else if (name.includes('headset') || name.includes('headphone') || name.includes('سماعة')) {
          smartCategories['Headsets - سماعات'].push(p);
        } else if (name.includes('monitor') || name.includes('display') || name.includes('شاشة')) {
          smartCategories['Monitors - شاشات'].push(p);
        } else if (name.includes('chair') || name.includes('كرسي')) {
          smartCategories['Chairs - كراسي'].push(p);
        } else if (name.includes('processor') || name.includes('cpu') || name.includes('ryzen') || name.includes('intel') || name.includes('معالج')) {
          smartCategories['Processors - معالجات'].push(p);
        } else if (name.includes('motherboard') || name.includes('لوحة أم')) {
          smartCategories['Motherboards - لوحات أم'].push(p);
        } else if (name.includes('graphic') || name.includes('gpu') || name.includes('rtx') || name.includes('gtx') || name.includes('كرت شاشة')) {
          smartCategories['Graphics Cards - كروت شاشة'].push(p);
        } else if (name.includes('power supply') || name.includes('psu') || name.includes('باور')) {
          smartCategories['Power Supply - باور'].push(p);
        } else if (name.includes('ssd') || name.includes('hdd') || name.includes('nvme') || name.includes('storage') || name.includes('تخزين')) {
          smartCategories['Storage - تخزين'].push(p);
        } else if (name.includes('cooling') || name.includes('cooler') || name.includes('fan') || name.includes('تبريد')) {
          smartCategories['Cooling - تبريد'].push(p);
        } else if (name.includes('case') || name.includes('كيس')) {
          smartCategories['Cases - كيسات'].push(p);
        } else if (name.includes('webcam') || name.includes('camera') || name.includes('كاميرا')) {
          smartCategories['Webcams - كاميرات'].push(p);
        } else if (name.includes('mic') || name.includes('microphone') || name.includes('مايك')) {
          smartCategories['Microphones - مايكات'].push(p);
        } else {
          smartCategories['Accessories - اكسسوارات'].push(p);
        }
      });
      
      const smartResult = Object.entries(smartCategories)
        .filter(([_, items]) => items.length > 0)
        .map(([cat, items]) => ({
          category: cat,
          count: items.length,
          samples: items.slice(0, 3).map(p => p.name)
        }))
        .sort((a, b) => b.count - a.count);
      
      setSmartAnalysis(smartResult);
      
      console.log('\n🧠 تحليل ذكي للفئات المقترحة:\n');
      smartResult.forEach(({ category, count, samples }) => {
        console.log(`\n📁 ${category}: (${count} منتج)`);
        samples.forEach(name => console.log(`   - ${name}`));
      });
    }
  }, [products]);

  if (isLoading) return <div className="p-8">جاري التحليل...</div>;

  return (
    <div className="p-8 bg-white dark:bg-gray-900 min-h-screen" dir="rtl">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
        تحليل الفئات - إجمالي: {products.length} منتج
      </h1>
      
      {smartAnalysis && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-4 text-electric-yellow">
            🧠 الفئات المقترحة (تحليل ذكي)
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {smartAnalysis.map(({ category, count, samples }: any) => (
              <div key={category} className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 border border-purple-500/30 p-6 rounded-lg">
                <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-white">
                  📁 {category}
                </h3>
                <p className="text-electric-yellow font-semibold mb-3">{count} منتج</p>
                <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
                  {samples.map((name: string, i: number) => (
                    <li key={i}>• {name}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {analysis && (
        <div>
          <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
            📊 الفئات الحالية في قاعدة البيانات
          </h2>
          <div className="space-y-4">
            {analysis.map(({ category, count, samples }: any) => (
              <div key={category} className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg">
                <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">
                  📁 {category} ({count} منتج)
                </h3>
                <ul className="space-y-1 text-gray-700 dark:text-gray-300">
                  {samples.map((name: string, i: number) => (
                    <li key={i}>• {name}</li>
                  ))}
                  {count > 5 && (
                    <li className="text-gray-500 dark:text-gray-400">
                      ... و {count - 5} منتج آخر
                    </li>
                  )}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
