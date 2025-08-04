import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MobileCartButtonProps {
  cartItemsCount: number;
  onCartClick: () => void;
}

export function MobileCartButton({ cartItemsCount, onCartClick }: MobileCartButtonProps) {
  if (cartItemsCount === 0) return null;

  return (
    <div className="fixed bottom-20 right-4 z-50 md:hidden">
      <Button
        onClick={onCartClick}
        className="relative bg-electric-yellow hover:bg-yellow-300 text-black rounded-full w-14 h-14 shadow-lg hover:shadow-xl transition-all duration-300 animate-pulse"
        size="icon"
      >
        <ShoppingCart className="w-6 h-6" />
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center">
          {cartItemsCount > 99 ? '99+' : cartItemsCount}
        </span>
      </Button>
    </div>
  );
}