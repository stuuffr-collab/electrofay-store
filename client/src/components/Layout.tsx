import { ReactNode } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { PromotionalTicker } from "./PromotionalTicker";

interface LayoutProps {
  children: ReactNode;
  onSearch?: (query: string) => void;
}

export function Layout({ children, onSearch }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg text-gray-900 dark:text-white transition-colors duration-300" dir="rtl">
      <PromotionalTicker />
      <Header onSearch={onSearch} />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}
