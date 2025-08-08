import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Search, Sun, Moon, Menu, Zap, ShoppingCart, Gamepad2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { SmartSearch } from "@/components/SmartSearch";
import { useDarkMode } from "@/hooks/use-dark-mode";
import { useCart } from "@/hooks/use-cart";
import { useProducts } from "@/hooks/useProducts";

interface HeaderProps {}

export function Header({}: HeaderProps) {
  const [location] = useLocation();
  const { isDark, toggle } = useDarkMode();
  const cart = useCart();
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { data: products = [] } = useProducts();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Navigate to products page with search query
      window.scrollTo(0, 0);
      window.location.href = `/products?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  const navigationItems = [
    { href: "/", label: "الرئيسية" },
    { href: "/products", label: "المنتجات" },
    { href: "/offers", label: "العروض" },
    { href: "/about", label: "من نحن" },
    { href: "/contact", label: "تواصل معنا" },
  ];

  return (
    <header className="bg-dark-card/95 backdrop-blur-md shadow-2xl sticky top-0 z-50 transition-all duration-300 border-b border-dark-border" style={{ background: 'rgba(18, 18, 18, 0.98)', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-4 space-x-reverse">
            <div className="w-10 h-10 bg-gradient-to-br from-electric-yellow to-yellow-500 rounded-lg flex items-center justify-center shadow-lg">
              <Gamepad2 className="w-6 h-6 text-black" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">إلكتروفاي</h1>
              <p className="text-xs text-gray-300">Electrofy Store</p>
            </div>
          </Link>

          {/* Smart Search */}
          <div className="hidden md:block flex-1 max-w-md mx-8">
            <SmartSearch 
              products={products}
              onSearchChange={() => {}}
              placeholder="ابحث عن منتجات قيمنج، إكسسوارات، PC..."
            />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8 space-x-reverse">
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-gray-300 hover:text-electric-yellow transition-colors ${
                  location === item.href ? "text-electric-yellow font-medium" : ""
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right Section */}
          <div className="flex items-center space-x-4 space-x-reverse">

            {/* Cart Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => cart.setIsOpen(true)}
              className="relative rounded-lg hover:bg-gray-700 text-white"
            >
              <ShoppingCart className="w-5 h-5" />
              {cart.totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-electric-yellow text-black text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center shadow-lg animate-pulse">
                  {cart.totalItems > 99 ? '99+' : cart.totalItems}
                </span>
              )}
            </Button>

            {/* Dark Mode Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggle}
              className="rounded-lg hover:bg-gray-700 text-white"
            >
              {isDark ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </Button>

            {/* Mobile Menu */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] bg-dark-bg border-l border-dark-border" style={{ background: 'var(--dark-bg)' }}>
                <div className="flex flex-col space-y-4 mt-8">
                  {/* Mobile Smart Search */}
                  <div className="md:hidden">
                    <SmartSearch 
                      products={products}
                      onSearchChange={() => {}}
                      placeholder="ابحث عن منتجات قيمنج، إكسسوارات، PC..."
                    />
                  </div>

                  {/* Mobile Navigation */}
                  {navigationItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`text-lg py-2 px-4 rounded-lg transition-colors ${
                        location === item.href
                          ? "bg-electric-yellow text-black font-medium"
                          : "text-gray-300 hover:bg-gray-700"
                      }`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
