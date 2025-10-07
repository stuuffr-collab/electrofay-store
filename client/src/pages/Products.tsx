import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ProductCard, type Product } from "@/components/ProductCard";
import { OrderModal } from "@/components/OrderModal";
import { Toast, useToastManager } from "@/components/Toast";
import { type OrderData } from "@/lib/whatsapp";
import { trackEvent } from "@/lib/analytics";
import { useProducts } from "@/hooks/useProducts";
import { useCart } from "@/hooks/use-cart";
import { MobileCartButton } from "@/components/MobileCartButton";
import toast from "react-hot-toast";
import { filterBySmartCategory, type SmartCategory, categoryLabels } from "@/lib/smartFilters";

export default function Products() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [filter, setFilter] = useState<SmartCategory>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "price_asc" | "price_desc">("name");
  const { toasts, showSuccess } = useToastManager();
  const { data: products = [], isLoading, error } = useProducts();
  const cart = useCart();

  const filteredAndSortedProducts = filterBySmartCategory(products, filter)
    .filter(product => {
      const matchesSearch = searchQuery === "" || 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "price_asc":
          return a.price - b.price;
        case "price_desc":
          return b.price - a.price;
        default:
          return a.name.localeCompare(b.name, 'ar');
      }
    });

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

  useEffect(() => {
    document.title = "المنتجات - إلكتروفاي | أفضل إكسسوارات قيمنج ومنتجات كهرومنزلية في ليبيا";
  }, []);

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">جميع المنتجات</h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            تصفح مجموعتنا الكاملة من إكسسوارات القيمنج والمنتجات الكهرومنزلية عالية الجودة
          </p>
        </div>

        {/* Filters and Search */}
        <div className="bg-black dark:bg-black rounded-lg p-6 mb-8 shadow-lg">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Input
                type="text"
                placeholder="ابحث عن المنتجات..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 text-right"
              />
              <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-1 bg-black dark:bg-black rounded-lg p-1">
              <Button
                variant={filter === "all" ? "default" : "ghost"}
                size="sm"
                onClick={() => setFilter("all")}
                className={filter === "all" ? "bg-electric-yellow text-black" : "text-white hover:text-black"}
              >
                {categoryLabels.all.ar}
              </Button>
              <Button
                variant={filter === "pc_components" ? "default" : "ghost"}
                size="sm"
                onClick={() => setFilter("pc_components")}
                className={filter === "pc_components" ? "bg-electric-yellow text-black" : "text-white hover:text-black"}
              >
                {categoryLabels.pc_components.ar}
              </Button>
              <Button
                variant={filter === "gaming_peripherals" ? "default" : "ghost"}
                size="sm"
                onClick={() => setFilter("gaming_peripherals")}
                className={filter === "gaming_peripherals" ? "bg-electric-yellow text-black" : "text-white hover:text-black"}
              >
                {categoryLabels.gaming_peripherals.ar}
              </Button>
              <Button
                variant={filter === "setup_equipment" ? "default" : "ghost"}
                size="sm"
                onClick={() => setFilter("setup_equipment")}
                className={filter === "setup_equipment" ? "bg-electric-yellow text-black" : "text-white hover:text-black"}
              >
                {categoryLabels.setup_equipment.ar}
              </Button>
              <Button
                variant={filter === "accessories" ? "default" : "ghost"}
                size="sm"
                onClick={() => setFilter("accessories")}
                className={filter === "accessories" ? "bg-electric-yellow text-black" : "text-white hover:text-black"}
              >
                {categoryLabels.accessories.ar}
              </Button>
            </div>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as "name" | "price_asc" | "price_desc")}
              className="px-4 py-2 border border-gray-600 rounded-lg bg-gray-800 text-right text-white"
            >
              <option value="name">ترتيب حسب الاسم</option>
              <option value="price_desc">السعر من الأعلى للأقل</option>
              <option value="price_asc">السعر من الأقل للأعلى</option>
            </select>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600 dark:text-gray-400">
            عرض {filteredAndSortedProducts.length} منتج
            {searchQuery && ` من البحث عن "${searchQuery}"`}
            {filter !== "all" && ` في فئة ${categoryLabels[filter].ar}`}
          </p>
        </div>

        {/* Products Grid */}
        {isLoading ? (
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(12)].map((_, index) => (
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
        ) : filteredAndSortedProducts.length > 0 ? (
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredAndSortedProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product as Product}
                onOrderClick={handleOrderClick}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <h3 className="text-xl font-semibold mb-4">لم نجد أي منتجات</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                حاول البحث بكلمات مختلفة أو تصفح جميع المنتجات
              </p>
              <Button 
                onClick={() => {
                  setSearchQuery("");
                  setFilter("all");
                }}
                className="bg-electric-yellow hover:bg-yellow-300 text-black"
              >
                عرض جميع المنتجات
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Order Modal */}
      <OrderModal
        isOpen={isOrderModalOpen}
        product={selectedProduct}
        onClose={() => setIsOrderModalOpen(false)}
        onOrderSubmit={handleOrderSubmit}
      />

      {/* Mobile Cart Button */}
      <MobileCartButton 
        itemCount={cart.totalItems}
        onClick={() => cart.setIsOpen(true)}
      />

      {/* Toast Notifications */}
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} />
      ))}
    </div>
  );
}
