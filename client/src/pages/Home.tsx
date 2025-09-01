import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Gamepad2, Smartphone, ArrowLeft, Percent, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard, type Product } from "@/components/ProductCard";
import { OrderModal } from "@/components/OrderModal";
import { AnnouncementBanner } from "@/components/AnnouncementBanner";

import { FloatingWhatsApp } from "@/components/FloatingWhatsApp";
import { MobileCartButton } from "@/components/MobileCartButton";
import { CountdownTimer } from "@/components/CountdownTimer";
import { Toast, useToastManager } from "@/components/Toast";
import { useCart } from "@/hooks/use-cart";
import { type OrderData } from "@/lib/whatsapp";
import { trackEvent } from "@/lib/analytics";
import { useProducts } from "@/hooks/useProducts";
import toast from "react-hot-toast";

export default function Home() {
  const [, setLocation] = useLocation();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [filter, setFilter] = useState<"all" | "gaming_accessory" | "gaming_pc" | "gaming_console" | "streaming_gear">("all");
  const { toasts, showSuccess } = useToastManager();
  const cart = useCart();
  const { data: products = [], isLoading, error } = useProducts();

  // Get offer end date (7 days from now)
  const offerEndDate = new Date();
  offerEndDate.setDate(offerEndDate.getDate() + 7);

  const filteredProducts = products.filter(product => 
    filter === "all" || product.category === filter
  ).slice(0, 8); // Show first 8 products


  const handleOrderClick = (product: Product) => {
    setSelectedProduct(product);
    setIsOrderModalOpen(true);
    trackEvent('order_modal_open', 'engagement', product.name);
  };

  const handleOrderSubmit = (orderData: OrderData) => {
    showSuccess("📦 تم استلام طلبك - سنتواصل معك خلال دقائق");
    trackEvent('order_submitted', 'conversion', orderData.product.name, orderData.product.price);
  };

  const handleAddToCart = (product: Product) => {
    cart.addItem(product);
    toast.success(`✅ تمت إضافة ${product.name} للسلة`);
    trackEvent('add_to_cart', 'engagement', product.name, product.price);
  };



  const scrollToProducts = () => {
    document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      {/* Announcement Banner */}
      <AnnouncementBanner />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white py-20 overflow-hidden" style={{ background: 'var(--hero-gradient)' }}>
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(250,255,0,0.1) 2px, rgba(250,255,0,0.1) 4px)' }}></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="text-center md:text-right">
              <h1 className="text-4xl md:text-6xl font-tajawal-extrabold mb-6 animate-fade-in">
                إلكتروفاي قيمنج
                <span className="text-electric-yellow drop-shadow-glow"> الوجهة الأولى</span>
                <br />لعالم الألعاب في ليبيا
              </h1>
              <p className="text-xl mb-8 text-gray-200 animate-slide-up animation-delay-200">
                متجرك المتخصص في أجهزة القيمنج الاحترافية وأدوات الستريمر مع توصيل سريع لجميع أنحاء ليبيا
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start animate-slide-up animation-delay-400">
                <Button 
                  onClick={scrollToProducts}
                  className="bg-electric-yellow hover:bg-yellow-300 text-black px-8 py-4 font-bold text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 animate-pulse-glow"
                >
                  تسوق الآن
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => window.open('https://wa.me/218922569912', '_blank')}
                  className="border-2 border-electric-yellow text-electric-yellow hover:bg-electric-yellow hover:text-black px-8 py-3 font-semibold"
                >
                  تواصل معنا
                </Button>
              </div>
            </div>
            
            <div className="relative">
              <img 
                src="/attached_assets/generated_images/Gaming_setup_hero_image_8e63dbf5.png" 
                alt="إعداد قيمنج احترافي مع إضاءة RGB وإكسسوارات متقدمة" 
                className="rounded-xl shadow-2xl w-full h-auto animate-pulse-electric"
                loading="eager"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-electric-yellow/20 to-blue-500/20 rounded-xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-dark-bg transition-colors duration-300" style={{ background: 'var(--dark-bg)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold mb-4 text-white">تسوق حسب الفئة</h3>
            <p className="text-gray-300">اختر من أفضل منتجات القيمنج والستريمنج الاحترافية</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Gaming Accessories Category */}
            <div 
              onClick={() => setFilter('gaming_accessory')}
              className="group relative bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl p-8 text-white overflow-hidden cursor-pointer transform hover:scale-105 transition-all duration-300"
            >
              <div className="absolute inset-0 bg-black/20"></div>
              <div className="relative z-10">
                <Gamepad2 className="w-12 h-12 mb-4 text-electric-yellow" />
                <h4 className="text-2xl font-bold mb-2">فئات اكسسوارات</h4>
                <p className="text-purple-100 mb-6">لوحات مفاتيح، فأرة، سماعات، كراسي وإكسسوارات ألعاب احترافية</p>
                <div className="flex items-center text-electric-yellow">
                  <span className="font-semibold">تسوق الآن</span>
                  <ArrowLeft className="w-5 h-5 mr-2 group-hover:translate-x-2 transition-transform" />
                </div>
              </div>
              <img 
                src="https://images.unsplash.com/photo-1593305841991-05c297ba4575?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300" 
                alt="Gaming controller and accessories" 
                className="absolute top-0 right-0 w-32 h-32 object-cover opacity-30 group-hover:opacity-50 transition-opacity"
              />
            </div>

            {/* Gaming PC & Streaming Category */}
            <div 
              onClick={() => setFilter('gaming_pc')}
              className="group relative bg-gradient-to-br from-blue-500 to-teal-500 rounded-2xl p-8 text-white overflow-hidden cursor-pointer transform hover:scale-105 transition-all duration-300"
            >
              <div className="absolute inset-0 bg-black/20"></div>
              <div className="relative z-10">
                <Smartphone className="w-12 h-12 mb-4 text-electric-yellow" />
                <h4 className="text-2xl font-bold mb-2">فئات أجهزة PC</h4>
                <p className="text-blue-100 mb-6">شاشات قيمنج، لابتوبات، تجميعات PC وأدوات الستريمر</p>
                <div className="flex items-center text-electric-yellow">
                  <span className="font-semibold">تسوق الآن</span>
                  <ArrowLeft className="w-5 h-5 mr-2 group-hover:translate-x-2 transition-transform" />
                </div>
              </div>
              <img 
                src="https://images.unsplash.com/photo-1587831990711-23ca6441447b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300" 
                alt="Gaming PC and streaming setup" 
                className="absolute top-0 right-0 w-32 h-32 object-cover opacity-30 group-hover:opacity-50 transition-opacity"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section id="products" className="py-16 bg-dark-card transition-colors duration-300" style={{ background: 'var(--dark-card)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold mb-2 text-white">المنتجات المميزة</h3>
            <p className="text-gray-300">أحدث منتجات القيمنج وأكثرها مبيعاً</p>
          </div>


          <div className="flex justify-between items-center mb-8">
            <div className="text-sm text-gray-300">
              "اختر فئة لعرض المنتجات"
            </div>
            
            {/* Filter Buttons */}
            <div className="hidden md:flex bg-dark-bg rounded-lg p-1 border border-dark-border" style={{ background: 'var(--dark-bg)' }}>
              <Button
                variant={filter === "all" ? "default" : "ghost"}
                size="sm"
                onClick={() => setFilter("all")}
                className={filter === "all" ? "bg-electric-yellow text-black" : ""}
              >
                الكل
              </Button>
              <Button
                variant={filter === "gaming_accessory" ? "default" : "ghost"}
                size="sm"
                onClick={() => setFilter("gaming_accessory")}
                className={filter === "gaming_accessory" ? "bg-electric-yellow text-black" : ""}
              >
                اكسسوارات
              </Button>
              <Button
                variant={filter === "gaming_pc" ? "default" : "ghost"}
                size="sm"
                onClick={() => setFilter("gaming_pc")}
                className={filter === "gaming_pc" ? "bg-electric-yellow text-black" : ""}
              >
                أجهزة PC
              </Button>
              <Button
                variant={filter === "streaming_gear" ? "default" : "ghost"}
                size="sm"
                onClick={() => setFilter("streaming_gear")}
                className={filter === "streaming_gear" ? "bg-electric-yellow text-black" : ""}
              >
                ستريمنج
              </Button>
            </div>
          </div>

          {/* Products Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filteredProducts.map((product, index) => (
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
              عرض المزيد من المنتجات
            </Button>
          </div>
        </div>
      </section>

      {/* Special Offers Section */}
      <section className="py-16 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold mb-4">عروض خاصة لفترة محدودة</h3>
            <p className="text-purple-100">احصل على أفضل العروض قبل انتهاء المدة المحدودة</p>
          </div>

          {/* Countdown Timer */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-8 text-center">
            <h4 className="text-xl font-bold mb-4">العرض ينتهي خلال:</h4>
            <CountdownTimer targetDate={offerEndDate} />
          </div>

          {/* Offer Cards */}
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <div className="flex items-center mb-4">
                <div className="bg-electric-yellow text-black rounded-full p-3 ml-4">
                  <Percent className="w-6 h-6" />
                </div>
                <div>
                  <h5 className="text-xl font-bold">خصم 50% على إكسسوارات القيمنج</h5>
                  <p className="text-purple-100">فقط لهذا الأسبوع</p>
                </div>
              </div>
              <Button 
                onClick={scrollToProducts}
                className="bg-electric-yellow text-black hover:bg-yellow-300"
              >
                تسوق الآن
              </Button>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <div className="flex items-center mb-4">
                <div className="bg-electric-yellow text-black rounded-full p-3 ml-4">
                  <Truck className="w-6 h-6" />
                </div>
                <div>
                  <h5 className="text-xl font-bold">توصيل مجاني</h5>
                  <p className="text-purple-100">للطلبات أكثر من 200 دينار</p>
                </div>
              </div>
              <Button 
                onClick={scrollToProducts}
                className="bg-electric-yellow text-black hover:bg-yellow-300"
              >
                اطلب الآن
              </Button>
            </div>
          </div>
        </div>
      </section>



      {/* Order Modal */}
      <OrderModal
        isOpen={isOrderModalOpen}
        product={selectedProduct}
        onClose={() => setIsOrderModalOpen(false)}
        onOrderSubmit={handleOrderSubmit}
      />

      {/* Floating WhatsApp Button */}
      <FloatingWhatsApp />

      {/* Mobile Cart Button */}
      <MobileCartButton 
        itemCount={cart.totalItems}
        onClick={() => cart.setIsOpen(true)}
      />

      {/* Toast Notifications */}
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} />
      ))}
    </>
  );
}
