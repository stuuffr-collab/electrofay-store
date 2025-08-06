import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Truck, Shield, Headphones, Battery, Cpu, Monitor } from "lucide-react";

interface ProductTabsProps {
  description: string;
  descriptionEn: string;
  category: string;
}

export function ProductTabs({ description, descriptionEn, category }: ProductTabsProps) {
  const getSpecifications = (category: string) => {
    switch (category) {
      case 'gaming_accessory':
        return {
          "الحجم": "24.5 inches",
          "الدقة": "FHD (1920×1080)",
          "نوع الشاشة": "IPS",
          "معدل التحديث": "100Hz",
          "زمن الاستجابة": "1ms (MPRT) / 4ms (GTG)",
          "السطوع": "300 nits",
          "المنافذ": "1x DisplayPort 1.2a, 1x HDMI 1.4b, Headphone Jack",
          "دعم VESA": "Yes (100x100mm)",
          "مميزات إضافية": "HDR, Blue Light Reduction, Anti-Flicker, Frameless Design, Adjustable Tilt Stand"
        };
      case 'gaming_pc':
        return {
          "المعالج": "Intel Core i7-12700K",
          "كرت الرسوميات": "NVIDIA RTX 4070",
          "الذاكرة": "16GB DDR4 3200MHz",
          "التخزين": "1TB NVMe SSD",
          "اللوحة الأم": "MSI B660M PRO-VDH",
          "مزود الطاقة": "650W 80+ Gold",
          "التبريد": "RGB Air Cooler",
          "الصندوق": "Mid Tower RGB Case"
        };
      case 'gaming_console':
        return {
          "الاتصال": "Bluetooth 5.0",
          "البطارية": "40 ساعة تشغيل",
          "التوافق": "PC, PS5, Xbox Series X/S",
          "الاهتزاز": "HD Rumble Technology",
          "المقاومة": "IPX4 Water Resistant",
          "الأزرار": "16 Programmable Buttons",
          "الوزن": "280g",
          "الضمان": "سنتان"
        };
      case 'streaming_gear':
        return {
          "جودة الصوت": "48kHz/16-bit Audio",
          "الاتصال": "USB-C & XLR Output",
          "إلغاء الضوضاء": "AI Noise Reduction",
          "التطبيقات": "OBS, Streamlabs Compatible",
          "النمط": "Cardioid Pickup Pattern",
          "الحساسية": "-34dB ±2dB",
          "نطاق التردد": "20Hz - 20kHz",
          "التوافق": "Windows, Mac, Linux"
        };
      default:
        return {
          "الضمان": "سنة كاملة",
          "التوصيل": "2-5 أيام عمل",
          "الجودة": "معايير عالمية",
          "الدعم الفني": "24/7"
        };
    }
  };

  const specifications = getSpecifications(category);

  return (
    <Tabs defaultValue="description" className="w-full">
      <TabsList className="grid w-full grid-cols-3 bg-dark-card border border-dark-border">
        <TabsTrigger 
          value="description"
          className="data-[state=active]:bg-electric-yellow data-[state=active]:text-black font-semibold"
        >
          الوصف
        </TabsTrigger>
        <TabsTrigger 
          value="specifications"
          className="data-[state=active]:bg-electric-yellow data-[state=active]:text-black font-semibold"
        >
          المواصفات
        </TabsTrigger>
        <TabsTrigger 
          value="shipping"
          className="data-[state=active]:bg-electric-yellow data-[state=active]:text-black font-semibold"
        >
          الشحن
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="description" className="mt-6 space-y-4">
        <div className="bg-dark-card rounded-xl p-6 border border-dark-border">
          <h4 className="text-lg font-bold mb-4 text-electric-yellow">وصف المنتج</h4>
          <p className="text-gray-300 leading-relaxed mb-4">{description}</p>
          <p className="text-gray-400 text-sm">{descriptionEn}</p>
        </div>
      </TabsContent>
      
      <TabsContent value="specifications" className="mt-6">
        <div className="bg-dark-card rounded-xl p-6 border border-dark-border">
          <h4 className="text-lg font-bold mb-6 text-electric-yellow">المواصفات التقنية</h4>
          <div className="space-y-3">
            {Object.entries(specifications).map(([key, value], index) => (
              <div key={index} className="flex justify-between items-center py-3 border-b border-dark-border/50 last:border-b-0">
                <span className="font-semibold text-white">{key}:</span>
                <span className="text-gray-300 text-right max-w-md">{value}</span>
              </div>
            ))}
          </div>
        </div>
      </TabsContent>
      
      <TabsContent value="shipping" className="mt-6">
        <div className="bg-dark-card rounded-xl p-6 border border-dark-border">
          <h4 className="text-lg font-bold mb-6 flex items-center text-electric-yellow">
            <Truck className="w-5 h-5 ml-2" />
            معلومات الشحن والتوصيل
          </h4>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-dark-bg rounded-lg border border-dark-border">
              <span className="font-semibold">التوصيل داخل طرابلس</span>
              <span className="text-electric-yellow font-bold">15 د.ل</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-dark-bg rounded-lg border border-dark-border">
              <span className="font-semibold">التوصيل للمدن الأخرى</span>
              <span className="text-electric-yellow font-bold">25-35 د.ل</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-green-900/20 rounded-lg border border-green-500/30">
              <span className="font-semibold">توصيل مجاني</span>
              <span className="text-green-400 font-bold">للطلبات أكثر من 500 د.ل</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-dark-bg rounded-lg border border-dark-border">
              <span className="font-semibold">مدة التوصيل</span>
              <span className="text-electric-yellow font-bold">2-5 أيام عمل</span>
            </div>
            
            <div className="mt-6 p-4 bg-blue-900/20 rounded-lg border border-blue-500/30">
              <h5 className="font-bold text-blue-400 mb-2">🛡️ ضمانات الشحن</h5>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>• تغليف آمن ومحكم للحماية من التلف</li>
                <li>• تتبع الطلب عبر WhatsApp</li>
                <li>• ضمان استرداد في حالة التلف أثناء الشحن</li>
                <li>• فحص المنتج قبل التسليم</li>
              </ul>
            </div>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
}