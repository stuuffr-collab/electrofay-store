import { useState } from "react";
import { Star, ShoppingCart, MessageCircle, Facebook } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { shareProduct } from "@/lib/whatsapp";

export interface Product {
  id: string;
  name: string;
  nameEn: string;
  description: string;
  descriptionEn: string;
  price: number;
  originalPrice: number | null;
  category: "gaming" | "electronics";
  image: string;
  rating: number;
  badges: string[];
  inStock: boolean;
  stockCount: number;
}

interface ProductCardProps {
  product: Product;
  onOrderClick: (product: Product) => void;
}

export function ProductCard({ product, onOrderClick }: ProductCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleShare = (platform: 'whatsapp' | 'facebook' | 'twitter') => {
    shareProduct(platform, product.name, product.price);
  };

  const getBadgeColor = (badge: string) => {
    if (badge.includes("خصم") || badge.includes("%")) return "destructive";
    if (badge === "جديد") return "secondary";
    if (badge.includes("متبقي")) return "outline";
    if (badge === "الأكثر مبيعاً") return "default";
    return "secondary";
  };

  return (
    <div className="bg-white dark:bg-dark-bg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
      <div className="relative">
        {/* Product Image */}
        <div className="w-full h-48 bg-gray-200 dark:bg-gray-700 relative overflow-hidden">
          {!imageError ? (
            <img
              src={product.image}
              alt={product.name}
              className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-500">
              <span className="text-sm">صورة غير متاحة</span>
            </div>
          )}
          
          {!imageLoaded && !imageError && (
            <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse" />
          )}
        </div>

        {/* Product Badges */}
        <div className="absolute top-3 right-3 flex flex-col gap-2">
          {product.badges.map((badge, index) => (
            <Badge key={index} variant={getBadgeColor(badge)} className="text-xs">
              {badge}
            </Badge>
          ))}
        </div>
      </div>

      <div className="p-4">
        <h4 className="font-bold text-lg mb-2 line-clamp-2">{product.name}</h4>
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">
          {product.description}
        </p>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2 space-x-reverse">
            <span className="text-2xl font-bold text-electric-yellow">
              {product.price} د.ل
            </span>
            {product.originalPrice && (
              <span className="text-sm text-gray-500 line-through">
                {product.originalPrice} د.ل
              </span>
            )}
          </div>
          <div className="flex items-center text-yellow-500">
            <Star className="w-4 h-4 fill-current" />
            <span className="text-sm mr-1">{product.rating}</span>
          </div>
        </div>

        <Button
          onClick={() => onOrderClick(product)}
          disabled={!product.inStock}
          className="w-full bg-electric-yellow hover:bg-yellow-300 text-black font-semibold mb-2"
        >
          <ShoppingCart className="w-4 h-4 ml-1" />
          {product.inStock ? "اطلب الآن" : "غير متوفر"}
        </Button>

        {/* Share Buttons */}
        <div className="flex justify-center space-x-2 space-x-reverse">
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleShare('whatsapp')}
            className="p-2 bg-green-500 hover:bg-green-600 text-white border-green-500"
          >
            <MessageCircle className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleShare('facebook')}
            className="p-2 bg-blue-600 hover:bg-blue-700 text-white border-blue-600"
          >
            <Facebook className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
