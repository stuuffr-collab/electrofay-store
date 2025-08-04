import { ReactNode } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { PromotionalTicker } from "./PromotionalTicker";
import { useCart } from "@/hooks/use-cart";

interface LayoutProps {
  children: ReactNode;
  onSearch?: (query: string) => void;
}

export function Layout({ children, onSearch }: LayoutProps) {
  const cart = useCart();
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg text-gray-900 dark:text-white transition-colors duration-300" dir="rtl">
      <PromotionalTicker />
      <Header 
        onSearch={onSearch} 
        cartItemsCount={cart.totalItems}
        onCartClick={() => cart.setIsOpen(true)}
      />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}
