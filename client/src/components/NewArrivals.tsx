import { Badge } from '@/components/ui/badge';
import { Clock, Sparkles } from 'lucide-react';
import { useProducts } from '@/hooks/useProducts';

export function NewArrivalsBanner() {
  const { data: products = [] } = useProducts();
  // Get newest products (last 3 products)
  const newProducts = products.slice(-3);
  
  return (
    <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 overflow-hidden">
      <div className="flex items-center justify-center">
        <div className="flex items-center gap-2 animate-pulse">
          <Sparkles className="w-5 h-5 text-yellow-300" />
          <span className="font-bold text-sm">🔥 وصلت الآن</span>
          <Sparkles className="w-5 h-5 text-yellow-300" />
        </div>
        
        <div className="flex items-center gap-4 mr-6 overflow-hidden">
          <div className="animate-marquee flex gap-6">
            {newProducts.map((product, index) => (
              <div key={product.id} className="flex items-center gap-2 whitespace-nowrap">
                <span className="text-sm font-medium">{product.name}</span>
                <Badge variant="secondary" className="bg-yellow-300 text-black text-xs">
                  جديد
                </Badge>
                {index < newProducts.length - 1 && (
                  <span className="text-white/60 mx-2">•</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Add to index.css for marquee animation
/*
@keyframes marquee {
  0% {
    transform: translateX(100%);
  }
  100% {
    transform: translateX(-100%);
  }
}

.animate-marquee {
  animation: marquee 20s linear infinite;
}
*/