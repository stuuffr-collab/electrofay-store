import { useState } from "react";
import { Star, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import { useLocation } from "wouter";

export interface Product {
  id: string;
  name: string;
  nameEn: string;
  description: string;
  descriptionEn: string;
  price: number;
  originalPrice: number | null;
  category: "gaming_accessory" | "gaming_pc" | "gaming_console" | "streaming_gear";
  image: string;
  rating: number;
  badges: string[];
  inStock: boolean;
  stockCount: number;
}

interface ProductCardProps {
  product: Product;
  onOrderClick: (product: Product) => void;
  onAddToCart?: (product: Product) => void;
}

export function ProductCard({ product, onOrderClick, onAddToCart }: ProductCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [, setLocation] = useLocation();



  const getBadgeColor = (badge: string) => {
    if (badge.includes("خصم") || badge.includes("%")) return "destructive";
    if (badge === "جديد") return "secondary";
    if (badge.includes("متبقي") || badge.includes("قطع")) return "outline";
    if (badge === "الأكثر مبيعاً") return "default";
    return "secondary";
  };

  // Generate dynamic stock badge
  const generateStockBadge = () => {
    if (product.stockCount <= 5) {
      return `⚡ متبقّي ${product.stockCount} قطع`;
    }
    return null;
  };

  const dynamicBadge = generateStockBadge();
  const allBadges = dynamicBadge ? [dynamicBadge, ...product.badges] : product.badges;

  const handleProductClick = () => {
    window.scrollTo(0, 0);
    setLocation(`/product/${product.id}`);
  };

  return (
    <div 
      className="bg-dark-card rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group hover:scale-105 transform animate-fadeIn border border-dark-border cursor-pointer" 
      style={{ background: 'var(--dark-card)' }}
      onClick={handleProductClick}
    >
      <div className="relative">
        {/* Product Image */}
        <div className="w-full h-56 bg-gray-800 relative overflow-hidden rounded-t-xl">
          {!imageError ? (
            <img
              src={product.image}
              alt={product.name}
              className={`w-full h-full object-contain group-hover:scale-105 transition-transform duration-300 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <span className="text-sm">صورة غير متاحة</span>
            </div>
          )}
          
          {!imageLoaded && !imageError && (
            <div className="absolute inset-0 bg-gray-700 animate-pulse" />
          )}
        </div>

        {/* Product Badges */}
        <div className="absolute top-3 right-3 flex flex-col gap-2">
          {allBadges.map((badge, index) => (
            <Badge key={index} variant={getBadgeColor(badge)} className="text-xs shadow-sm">
              {badge}
            </Badge>
          ))}
        </div>
      </div>

      <div className="p-4">
        <h4 className="font-bold text-lg mb-2 line-clamp-2 text-white">{product.name}</h4>
        <p className="text-gray-300 text-sm mb-3 line-clamp-2">
          {product.description}
        </p>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2 space-x-reverse">
            <span className="text-2xl font-bold text-electric-yellow">
              {product.price} د.ل
            </span>
            {product.originalPrice && (
              <>
                <span className="text-sm text-gray-400 line-through">
                  {product.originalPrice} د.ل
                </span>
                <span className="text-xs bg-red-500 text-white px-2 py-1 rounded-full">
                  -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                </span>
              </>
            )}
          </div>
        </div>



        <div className="flex gap-2 mb-2">
          <Button
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart?.(product);
            }}
            disabled={!product.inStock}
            className="flex-1 bg-gradient-to-r from-[#FFD700] to-[#FFB300] hover:from-[#FFB300] hover:to-[#FF8C00] text-black font-semibold shadow-lg hover:shadow-xl transition-all duration-300 animate-pulse-glow"
          >
            <ShoppingCart className="w-4 h-4 ml-1" />
            {product.inStock ? "أضف للسلة" : "غير متوفر"}
          </Button>
          <Button
            onClick={(e) => {
              e.stopPropagation();
              setLocation(`/product/${product.id}`);
            }}
            disabled={!product.inStock}
            variant="outline"
            className="px-3 border-electric-yellow text-electric-yellow hover:bg-electric-yellow hover:text-black"
          >
            عرض التفاصيل
          </Button>
        </div>


      </div>
    </div>
  );
}
