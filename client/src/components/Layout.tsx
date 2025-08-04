import { ReactNode } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { PromotionalTicker } from "./PromotionalTicker";
import { CartSidebar } from "./CartSidebar";
import { useCart } from "@/hooks/use-cart";
import { createWhatsAppMessage } from "@/lib/whatsapp";
import toast from "react-hot-toast";

interface LayoutProps {
  children: ReactNode;
  onSearch?: (query: string) => void;
}

export function Layout({ children, onSearch }: LayoutProps) {
  const cart = useCart();

  const handleCartCheckout = () => {
    if (cart.items.length === 0) return;
    
    const message = createWhatsAppMessage({
      product: { 
        id: "cart-checkout",
        name: `طلب متعدد - ${cart.items.length} منتج`,
        price: cart.totalPrice 
      },
      customer: {
        name: "عميل",
        phone: "",
        city: "طرابلس",
        address: ""
      }
    });
    
    // Add cart details to message
    const cartDetails = cart.items.map(item => 
      `${item.product.name} × ${item.quantity} = ${item.product.price * item.quantity} د.ل`
    ).join('\n');
    
    const fullMessage = message + '\n\nتفاصيل الطلب:\n' + cartDetails;
    
    window.open(`https://wa.me/218922569912?text=${encodeURIComponent(fullMessage)}`, '_blank');
    cart.clearCart();
    cart.setIsOpen(false);
    toast.success("🎉 شكراً! طلبك قيد التنفيذ");
  };
  
  return (
    <div className="min-h-screen bg-black text-white transition-colors duration-300" dir="rtl" style={{ background: '#000000' }}>
      {/* Cart Sidebar */}
      <CartSidebar
        isOpen={cart.isOpen}
        onClose={() => cart.setIsOpen(false)}
        items={cart.items}
        totalPrice={cart.totalPrice}
        onUpdateQuantity={cart.updateQuantity}
        onRemoveItem={cart.removeItem}
        onCheckout={handleCartCheckout}
      />
      
      <PromotionalTicker />
      <Header 
        onSearch={onSearch} 
      />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}
