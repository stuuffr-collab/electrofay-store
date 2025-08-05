import { useState, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard, Product } from "@/components/ProductCard";
import { Badge } from "@/components/ui/badge";

interface SimilarProductsCarouselProps {
  products: Product[];
  onProductClick: (productId: string) => void;
  onAddToCart: (product: Product) => void;
}

export function SimilarProductsCarousel({ products, onProductClick, onAddToCart }: SimilarProductsCarouselProps) {
  const [scrollPosition, setScrollPosition] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (!containerRef.current) return;
    
    const container = containerRef.current;
    const scrollAmount = 320; // Width of one card plus gap
    
    if (direction === 'left') {
      container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    } else {
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const handleScroll = () => {
    if (containerRef.current) {
      setScrollPosition(containerRef.current.scrollLeft);
    }
  };

  const getProductBadge = (product: Product) => {
    const hasDiscount = product.originalPrice && product.originalPrice > product.price;
    if (hasDiscount) return { text: "خصم", variant: "destructive" as const };
    if (product.rating >= 4.8) return { text: "الأفضل", variant: "default" as const };
    if (product.stockCount <= 5) return { text: "محدود", variant: "outline" as const };
    return { text: "جديد", variant: "secondary" as const };
  };

  if (products.length === 0) return null;

  return (
    <div className="relative">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold">منتجات مشابهة</h3>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => scroll('left')}
            className="h-10 w-10 border-dark-border hover:bg-dark-card"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => scroll('right')}
            className="h-10 w-10 border-dark-border hover:bg-dark-card"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="flex gap-6 overflow-x-auto scrollbar-hide pb-4"
        style={{ scrollSnapType: 'x mandatory' }}
      >
        {products.map((product) => {
          const badge = getProductBadge(product);
          return (
            <div key={product.id} className="flex-shrink-0 w-80" style={{ scrollSnapAlign: 'start' }}>
              <div className="relative">
                {/* Product Badge */}
                <div className="absolute top-4 right-4 z-10">
                  <Badge variant={badge.variant} className="text-xs font-bold">
                    {badge.text}
                  </Badge>
                </div>
                
                <ProductCard
                  product={product}
                  onOrderClick={() => onProductClick(product.id)}
                  onAddToCart={onAddToCart}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Mobile scroll indicator */}
      <div className="flex justify-center mt-4 md:hidden">
        <div className="flex gap-2">
          {products.map((_, index) => (
            <div
              key={index}
              className={`h-2 w-2 rounded-full transition-colors ${
                Math.floor(scrollPosition / 320) === index 
                  ? 'bg-electric-yellow' 
                  : 'bg-gray-600'
              }`}
            />
          ))}
        </div>
      </div>

      <style>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}