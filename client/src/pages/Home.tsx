import { useState, useEffect } from "react";
import { useLocation, Link } from "wouter";
import { Gamepad2, Smartphone, ArrowLeft, Percent, Truck, ChevronLeft, Monitor, Cpu, Headphones, Keyboard, Mouse, CircuitBoard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard, type Product } from "@/components/ProductCard";
import { OrderModal } from "@/components/OrderModal";
import { AnnouncementBanner } from "@/components/AnnouncementBanner";
import { motion } from "framer-motion";
import { FloatingWhatsApp } from "@/components/FloatingWhatsApp";
import { MobileCartButton } from "@/components/MobileCartButton";
import { CountdownTimer } from "@/components/CountdownTimer";
import { Toast, useToastManager } from "@/components/Toast";
import { useCart } from "@/hooks/use-cart";
import { type OrderData } from "@/lib/whatsapp";
import { trackEvent } from "@/lib/analytics";
import { useProducts } from "@/hooks/useProducts";
import { getIconFromString } from "@/lib/categories";
import { useQuery } from "@tanstack/react-query";

interface CategoryData {
  id: string;
  name: string;
  description: string;
  icon: string;
  gradient: string;
}


export default function Home() {
  const [location, setLocation] = useLocation();
  const { data: products = [], isLoading, error } = useProducts();
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const { addItem, totalItems, setIsOpen: setCartOpen } = useCart();
  const { toasts, showSuccess } = useToastManager();

  // Fetch categories dynamically
  const { data: categories = [], isLoading: categoriesLoading } = useQuery<CategoryData[]>({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await fetch('/api/categories');
      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }
      return response.json();
    }
  });

  // Sort products by creation date (newest first) and take top 8
  const recentProducts = [...products]
    .sort((a, b) => {
      if (!a.createdAt) return 1;
      if (!b.createdAt) return -1;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    })
    .slice(0, 8);

  const handleOrderClick = (product: Product) => {
    setSelectedProduct(product);
    setIsOrderModalOpen(true);
    trackEvent('initiate_checkout', 'engagement', product.name, product.price);
  };

  const handleAddToCart = (product: Product) => {
    addItem(product);
    showSuccess(`${product.name} أضيف للسلة`);
    trackEvent('add_to_cart', 'engagement', product.name, product.price);
  };

  const handleConfirmOrder = async (orderData: OrderData) => {
    setIsOrderModalOpen(false);
    showSuccess('تم استلام طلبك بنجاح!');
  };

  const scrollToProducts = () => {
    const element = document.getElementById('products-section');
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-dark-bg text-white pb-20">
      <AnnouncementBanner />
      <FloatingWhatsApp />
      <MobileCartButton
        itemCount={totalItems}
        onClick={() => setCartOpen(true)}
      />

      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} />
      ))}

      <OrderModal
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
        product={selectedProduct!}
        onOrderSubmit={handleConfirmOrder}
      />

      {/* Hero Section */}
      <section className="relative h-[500px] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/90 to-blue-900/90 z-10" />
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url("/Gaming_setup_hero_image_8e63dbf5.png")' }}
        />
        <div className="relative z-20 container mx-auto px-4 h-full flex flex-col justify-center items-center text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-electric-yellow to-electric-blue"
          >
            إلكتروفاي
            <br />
            <span className="text-white text-2xl md:text-4xl mt-4 block">وجهتك الأولى للقيمنج في ليبيا</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-300 mb-8 max-w-2xl"
          >
            أفضل تجميعات PC، لابتوبات، وإكسسوارات الألعاب بأسعار منافسة وتوصيل لجميع المدن
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex gap-4"
          >
            <Button
              size="lg"
              className="bg-electric-yellow text-black hover:bg-yellow-400 font-bold text-lg px-8"
              onClick={scrollToProducts}
            >
              تصفح المنتجات
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-dark-card/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">تصفح حسب الأقسام</h2>
            <p className="text-gray-400">اكتشف مجموعتنا المتنوعة من المنتجات التقنية المنظمة في أقسام متخصصة</p>
          </div>

          {categoriesLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="h-32 bg-dark-card rounded-2xl animate-pulse border border-dark-border" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((category, index) => {
                const IconComponent = getIconFromString(category.icon);
                return (
                  <motion.div
                    key={category.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link href={`/categories/${category.id}`}>
                      <div className="group relative overflow-hidden rounded-2xl bg-dark-card border border-dark-border hover:border-electric-blue transition-all duration-300 cursor-pointer h-full">
                        <div className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />

                        <div className="p-6 flex items-center gap-4">
                          <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${category.gradient} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                            <IconComponent className="w-8 h-8 text-white" />
                          </div>

                          <div className="flex-1">
                            <h3 className="text-xl font-bold mb-1 group-hover:text-electric-blue transition-colors">{category.name}</h3>
                            <p className="text-sm text-gray-400 mb-3 line-clamp-1">{category.description}</p>
                            <div className="flex items-center gap-2 text-sm text-gray-500 group-hover:text-electric-blue transition-colors">
                              <span>تصفح المنتجات</span>
                              <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          )}

          <div className="mt-10 text-center">
            <Link href="/categories">
              <Button
                variant="outline"
                size="lg"
                className="border-electric-blue text-electric-blue hover:bg-electric-blue hover:text-white transition-all duration-300"
              >
                عرض جميع الأقسام
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-12 px-4" id="products-section">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold mb-2 text-white">أحدث المنتجات المضافة</h3>
            <p className="text-gray-300">تصفح أحدث ما وصلنا من منتجات القيمنج الاحترافية</p>
          </div>

          {/* Products Grid */}
          {isLoading ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {[...Array(8)].map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="bg-gray-300 dark:bg-gray-700 rounded-lg h-64 mb-4"></div>
                  <div className="bg-gray-300 dark:bg-gray-700 rounded h-4 mb-2"></div>
                  <div className="bg-gray-300 dark:bg-gray-700 rounded h-4 w-3/4"></div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-500 mb-4">خطأ في تحميل المنتجات</p>
              <p className="text-gray-600 dark:text-gray-400">سيتم استخدام البيانات المؤقتة</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {recentProducts.map((product, index) => (
                <div
                  key={product.id}
                  style={{ animationDelay: `${index * 0.1}s` }}
                  className="animate-zoom-in transform hover:scale-105 transition-all duration-300"
                >
                  <ProductCard
                    product={product as Product}
                    onOrderClick={handleOrderClick}
                    onAddToCart={handleAddToCart}
                  />
                </div>
              ))}
            </div>
          )}

          {/* Load More Button */}
          <div className="text-center mt-12">
            <Button
              variant="outline"
              onClick={() => {
                window.scrollTo(0, 0);
                setLocation('/products');
              }}
              className="border-2 border-electric-yellow text-electric-yellow hover:bg-electric-yellow hover:text-black font-semibold py-3 px-8"
            >
              عرض جميع المنتجات
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
