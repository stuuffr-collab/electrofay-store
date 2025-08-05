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
        return [
          { icon: <Headphones className="w-5 h-5" />, label: "صوت ستيريو عالي الجودة", value: "Hi-Fi Stereo" },
          { icon: <Battery className="w-5 h-5" />, label: "البطارية", value: "20 ساعة تشغيل" },
          { icon: <Shield className="w-5 h-5" />, label: "مقاومة", value: "IPX4 مقاوم للماء" },
          { icon: <Cpu className="w-5 h-5" />, label: "التوافق", value: "PC, PS5, Xbox, Mobile" }
        ];
      case 'gaming_pc':
        return [
          { icon: <Monitor className="w-5 h-5" />, label: "الدقة", value: "2560×1440 QHD" },
          { icon: <Cpu className="w-5 h-5" />, label: "معدل التحديث", value: "144Hz" },
          { icon: <Shield className="w-5 h-5" />, label: "تقنية", value: "FreeSync Premium" },
          { icon: <Battery className="w-5 h-5" />, label: "استهلاك الطاقة", value: "65W" }
        ];
      case 'gaming_console':
        return [
          { icon: <Cpu className="w-5 h-5" />, label: "الاتصال", value: "Bluetooth 5.0" },
          { icon: <Battery className="w-5 h-5" />, label: "البطارية", value: "40 ساعة تشغيل" },
          { icon: <Shield className="w-5 h-5" />, label: "التوافق", value: "PC, PS5, Xbox" },
          { icon: <Headphones className="w-5 h-5" />, label: "الاهتزاز", value: "HD Rumble" }
        ];
      case 'streaming_gear':
        return [
          { icon: <Headphones className="w-5 h-5" />, label: "جودة الصوت", value: "48kHz/16-bit" },
          { icon: <Cpu className="w-5 h-5" />, label: "الاتصال", value: "USB-C & XLR" },
          { icon: <Shield className="w-5 h-5" />, label: "إلغاء الضوضاء", value: "AI Noise Reduction" },
          { icon: <Monitor className="w-5 h-5" />, label: "التطبيقات", value: "OBS, Streamlabs" }
        ];
      default:
        return [
          { icon: <Shield className="w-5 h-5" />, label: "الضمان", value: "سنة كاملة" },
          { icon: <Truck className="w-5 h-5" />, label: "التوصيل", value: "2-5 أيام عمل" },
          { icon: <Cpu className="w-5 h-5" />, label: "الجودة", value: "معايير عالمية" },
          { icon: <Battery className="w-5 h-5" />, label: "الأداء", value: "احترافي" }
        ];
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {specifications.map((spec, index) => (
              <div key={index} className="flex items-center p-4 bg-dark-bg rounded-lg border border-dark-border">
                <div className="text-electric-yellow ml-3">
                  {spec.icon}
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-white">{spec.label}</div>
                  <div className="text-gray-400 text-sm">{spec.value}</div>
                </div>
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