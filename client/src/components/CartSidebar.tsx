import { Minus, Plus, Trash2, X, ShoppingBag, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { CartItem } from "@/hooks/use-cart";
import { Badge } from "@/components/ui/badge";

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  totalPrice: number;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onCheckout: () => void;
}

export function CartSidebar({
  isOpen,
  onClose,
  items,
  totalPrice,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout
}: CartSidebarProps) {
  const formatPrice = (price: number) => `${price} د.ل`;

  if (items.length === 0) {
    return (
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent side="right" className="w-full sm:w-96 bg-dark-bg border-l border-dark-border" style={{ background: 'var(--dark-bg)' }}>
          <SheetHeader>
            <SheetTitle className="text-right text-white">🛒 سلة التسوق</SheetTitle>
          </SheetHeader>
          <div className="flex flex-col items-center justify-center h-full text-center">
            <ShoppingBag className="w-16 h-16 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-300 mb-2">
              🛒 لا توجد منتجات حالياً
            </h3>
            <p className="text-gray-400 mb-6">
              أضف منتجات لبدء الشراء
            </p>
            <Button onClick={onClose} className="bg-electric-yellow text-black hover:bg-yellow-300">
              متابعة التسوق
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-full sm:w-96 flex flex-col bg-dark-bg border-l border-dark-border" style={{ background: 'var(--dark-bg)' }}>
        <SheetHeader>
          <SheetTitle className="text-right flex items-center justify-between text-white">
            <span>🛒 سلة التسوق</span>
            <Badge variant="secondary" className="bg-electric-yellow text-black">{items.length} منتج</Badge>
          </SheetTitle>
        </SheetHeader>
        
        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto py-4">
          <div className="space-y-4">
            {items.map((item) => (
              <div key={item.product.id} className="bg-dark-card rounded-lg p-4 border border-dark-border" style={{ background: 'var(--dark-card)' }}>
                <div className="flex gap-3">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm line-clamp-2 text-right text-white">
                      {item.product.name}
                    </h4>
                    <p className="text-electric-yellow font-bold text-lg mt-1">
                      {formatPrice(item.product.price)}
                    </p>
                    
                    {/* Quantity Controls */}
                    <div className="flex items-center justify-between mt-3">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-500 hover:text-red-700"
                        onClick={() => onRemoveItem(item.product.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                      
                      <div className="flex items-center gap-2 bg-gray-700 rounded-lg p-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                        >
                          <Minus className="w-3 h-3" />
                        </Button>
                        <span className="min-w-[2rem] text-center font-medium">
                          {item.quantity}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                        >
                          <Plus className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Cart Footer */}
        <div className="border-t border-dark-border pt-4 space-y-4">
          <div className="flex justify-between items-center text-lg font-bold">
            <span className="text-electric-yellow">{formatPrice(totalPrice)}</span>
            <span className="text-white">المجموع:</span>
          </div>
          
          <p className="text-sm text-gray-400 text-center">
            * السعر يشمل التوصيل داخل طرابلس
          </p>
          
          <Button
            onClick={onCheckout}
            className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-3 rounded-lg shadow-lg"
          >
            <MessageCircle className="w-5 h-5 ml-2" />
            اطلب الآن عبر واتساب
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}