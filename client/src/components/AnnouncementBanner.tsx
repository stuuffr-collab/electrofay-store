import { Percent, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function AnnouncementBanner() {
  return (
    <div className="bg-gradient-to-r from-red-500 via-red-600 to-red-700 text-white py-2 relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0" style={{ 
          backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.1) 10px, rgba(255,255,255,0.1) 20px)' 
        }}></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="flex items-center justify-center gap-4 text-sm font-medium">
          <div className="flex items-center gap-2">
            <Percent className="w-4 h-4 text-yellow-300" />
            <span className="animate-pulse">📢 عروض محدودة - خصم حتى 30%</span>
          </div>
          
          <Badge variant="secondary" className="bg-yellow-300 text-red-700 font-bold animate-bounce">
            <Clock className="w-3 h-3 ml-1" />
            لفترة محدودة
          </Badge>
          
          <div className="hidden sm:block text-yellow-200">
            🚚 توصيل مجاني للطلبات أكثر من 200 د.ل
          </div>
        </div>
      </div>
    </div>
  );
}