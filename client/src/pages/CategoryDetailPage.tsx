import { useState } from 'react';
import { useParams, Link, useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { getIconFromString, categorizeProduct, type Category } from '@/lib/categories';
import { useProducts } from '@/hooks/useProducts';
import { ChevronRight, SlidersHorizontal, X } from 'lucide-react';
import { ProductCard, Product } from '@/components/ProductCard';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Slider } from '@/components/ui/slider';

export default function CategoryDetailPage() {
  const { categoryId } = useParams();
  const [, setLocation] = useLocation();
  const { data: categoriesData = [], isLoading: categoriesLoading } = useQuery<Category[]>({
    queryKey: ['/api/categories'],
  });
  const category = categoriesData.find(cat => cat.id === categoryId);
  const { data: allProducts = [], isLoading } = useProducts();
  
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000]);
  const [sortBy, setSortBy] = useState<'price-asc' | 'price-desc' | 'rating' | 'name'>('rating');
  const [filterOpen, setFilterOpen] = useState(false);

  const handleOrderClick = (product: Product) => {
    setLocation(`/product/${product.id}`);
  };

  if (categoriesLoading) {
    return (
      <div className="min-h-screen bg-gray-900 dark:bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="min-h-screen bg-gray-900 dark:bg-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-4">القسم غير موجود</h1>
          <Link href="/categories">
            <Button variant="default">العودة للأقسام</Button>
          </Link>
        </div>
      </div>
    );
  }

  // Filter products by category - use categoryId directly if available, otherwise fallback to categorizeProduct
  const categoryProducts = allProducts.filter(product => {
    // First try to use the categoryId from the product (set in admin panel)
    if (product.categoryId) {
      return product.categoryId === categoryId;
    }
    // Fallback to categorizeProduct for products without categoryId
    const { categoryId: prodCategoryId } = categorizeProduct(product);
    return prodCategoryId === categoryId;
  });

  // Filter by subcategory if selected - use subcategoryId directly if available
  const filteredProducts = selectedSubcategory
    ? categoryProducts.filter(product => {
        // First try to use the subcategoryId from the product (set in admin panel)
        if (product.subcategoryId) {
          return product.subcategoryId === selectedSubcategory;
        }
        // Fallback to categorizeProduct for products without subcategoryId
        const { subcategoryId } = categorizeProduct(product);
        return subcategoryId === selectedSubcategory;
      })
    : categoryProducts;

  // Apply price filter
  const priceFilteredProducts = filteredProducts.filter(
    product => product.price >= priceRange[0] && product.price <= priceRange[1]
  );

  // Apply sorting
  const sortedProducts = [...priceFilteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-asc':
        return a.price - b.price;
      case 'price-desc':
        return b.price - a.price;
      case 'rating':
        return b.rating - a.rating;
      case 'name':
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });

  const IconComponent = getIconFromString(category.icon);

  const maxPrice = Math.max(...categoryProducts.map(p => p.price), 5000);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 dark:from-black dark:via-gray-900 dark:to-black">
      {/* Breadcrumb & Header */}
      <div className={`bg-gradient-to-r ${category.gradient} dark:opacity-90`}>
        <div className="container mx-auto px-4 py-8">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-white/80 mb-6" data-testid="breadcrumb">
            <Link href="/" className="hover:text-white transition-colors">الرئيسية</Link>
            <ChevronRight className="w-4 h-4" />
            <Link href="/categories" className="hover:text-white transition-colors">الأقسام</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-white">{category.name}</span>
          </div>

          {/* Category Header */}
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
              <IconComponent className="w-12 h-12 text-white" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-2" data-testid={`text-category-title-${category.id}`}>
                {category.name}
              </h1>
              <p className="text-lg text-white/90">{category.description}</p>
              <p className="text-sm text-white/70 mt-1">{sortedProducts.length} منتج متاح</p>
            </div>
          </div>
        </div>
      </div>

      {/* Subcategories Pills */}
      <div className="bg-gray-800/50 dark:bg-gray-900/50 border-b border-gray-700 dark:border-gray-800 sticky top-0 z-40 backdrop-blur-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3 overflow-x-auto scrollbar-hide">
            <button
              onClick={() => setSelectedSubcategory(null)}
              className={`px-6 py-2 rounded-full whitespace-nowrap transition-all duration-300 ${
                selectedSubcategory === null
                  ? `bg-gradient-to-r ${category.gradient} text-white shadow-lg`
                  : 'bg-gray-700/50 dark:bg-gray-800/50 text-gray-300 dark:text-gray-400 hover:bg-gray-700 dark:hover:bg-gray-800'
              }`}
              data-testid="button-all-subcategories"
            >
              الكل ({categoryProducts.length})
            </button>
            {category.subcategories.map((sub) => {
              const SubIcon = getIconFromString(sub.icon);
              const count = categoryProducts.filter(p => {
                // First try to use the subcategoryId from the product (set in admin panel)
                if (p.subcategoryId) {
                  return p.subcategoryId === sub.id;
                }
                // Fallback to categorizeProduct for products without subcategoryId
                const { subcategoryId } = categorizeProduct(p);
                return subcategoryId === sub.id;
              }).length;
              
              return (
                <button
                  key={sub.id}
                  onClick={() => setSelectedSubcategory(sub.id)}
                  className={`flex items-center gap-2 px-6 py-2 rounded-full whitespace-nowrap transition-all duration-300 ${
                    selectedSubcategory === sub.id
                      ? `bg-gradient-to-r ${category.gradient} text-white shadow-lg`
                      : 'bg-gray-700/50 dark:bg-gray-800/50 text-gray-300 dark:text-gray-400 hover:bg-gray-700 dark:hover:bg-gray-800'
                  }`}
                  data-testid={`button-subcategory-${sub.id}`}
                >
                  <SubIcon className="w-4 h-4" />
                  {sub.name} ({count})
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Filter & Sort Bar */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-4">
            {/* Filter Sheet */}
            <Sheet open={filterOpen} onOpenChange={setFilterOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" className="gap-2 bg-gray-800 dark:bg-gray-900 border-gray-700 dark:border-gray-800 text-white hover:bg-gray-700 dark:hover:bg-gray-800" data-testid="button-open-filters">
                  <SlidersHorizontal className="w-4 h-4" />
                  تصفية
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="bg-gray-900 dark:bg-black border-gray-800 dark:border-gray-900 text-white">
                <SheetHeader>
                  <SheetTitle className="text-white">خيارات التصفية</SheetTitle>
                  <SheetDescription className="text-gray-400">
                    اختر نطاق السعر المناسب لك
                  </SheetDescription>
                </SheetHeader>
                <div className="mt-8">
                  <h3 className="text-lg font-semibold mb-4">نطاق السعر</h3>
                  <div className="mb-6">
                    <Slider
                      min={0}
                      max={maxPrice}
                      step={50}
                      value={priceRange}
                      onValueChange={(value) => setPriceRange(value as [number, number])}
                      className="mb-4"
                    />
                    <div className="flex justify-between text-sm text-gray-400">
                      <span>{priceRange[0]} د.ل</span>
                      <span>{priceRange[1]} د.ل</span>
                    </div>
                  </div>
                  <Button
                    onClick={() => setPriceRange([0, maxPrice])}
                    variant="outline"
                    className="w-full border-gray-700 dark:border-gray-800 text-white hover:bg-gray-800 dark:hover:bg-gray-900"
                    data-testid="button-reset-filters"
                  >
                    إعادة تعيين
                  </Button>
                </div>
              </SheetContent>
            </Sheet>

            {/* Active Filters */}
            {(priceRange[0] > 0 || priceRange[1] < maxPrice) && (
              <div className="flex items-center gap-2 px-4 py-2 bg-gray-800/50 dark:bg-gray-900/50 rounded-full border border-gray-700 dark:border-gray-800">
                <span className="text-sm text-gray-300 dark:text-gray-400">
                  {priceRange[0]} - {priceRange[1]} د.ل
                </span>
                <button
                  onClick={() => setPriceRange([0, maxPrice])}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-4 py-2 bg-gray-800 dark:bg-gray-900 border border-gray-700 dark:border-gray-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            data-testid="select-sort"
          >
            <option value="rating">الأعلى تقييماً</option>
            <option value="price-asc">السعر: من الأقل للأعلى</option>
            <option value="price-desc">السعر: من الأعلى للأقل</option>
            <option value="name">الاسم: أ-ي</option>
          </select>
        </div>
      </div>

      {/* Products Grid */}
      <div className="container mx-auto px-4 pb-16">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-gray-800 dark:bg-gray-900 rounded-xl h-96 animate-pulse"></div>
            ))}
          </div>
        ) : sortedProducts.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {sortedProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <ProductCard product={product} onOrderClick={handleOrderClick} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-white mb-2">لا توجد منتجات</h3>
            <p className="text-gray-400 dark:text-gray-500">جرب تعديل خيارات التصفية</p>
          </div>
        )}
      </div>
    </div>
  );
}
