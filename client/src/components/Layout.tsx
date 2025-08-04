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
    // This function is now handled inside CartSidebar component
    cart.clearCart();
    cart.setIsOpen(false);
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
