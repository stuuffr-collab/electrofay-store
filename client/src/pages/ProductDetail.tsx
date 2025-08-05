import { useState, useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { Minus, Plus, ShoppingCart, Truck, Shield, ArrowRight, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/context/CartContext";
import { useProducts } from "@/hooks/useProducts";
import { Product } from "@/components/ProductCard";
import { useToast } from "@/hooks/use-toast";
import { ProductImageZoom } from "@/components/ProductImageZoom";
import { StarRating } from "@/components/StarRating";
import { ProductTabs } from "@/components/ProductTabs";
import { SimilarProductsCarousel } from "@/components/SimilarProductsCarousel";


export default function ProductDetail() {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isWishlist, setIsWishlist] = useState(false);
  const cart = useCart();
  const { toast } = useToast();
  const { data: products = [] } = useProducts();

  // Find the current product
  const product = products.find(p => p.id === id) as Product | undefined;

  // Get similar products (same category, excluding current product)
  const similarProducts = products
    .filter(p => p.category === product?.category && p.id !== product?.id)
    .slice(0, 4) as Product[];

  useEffect(() => {
    if (!product && products.length > 0) {
      // Product not found, redirect to home
      setLocation('/');
    }
  }, [product, products, setLocation]);

  if (!product) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-electric-yellow mx-auto"></div>
          <p className="text-white mt-4">جارِ التحميل...</p>
        </div>
      </div>
    );
  }

  const handleQuantityChange = (change: number) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= product.stockCount) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      cart.addItem(product);
    }
    toast({
      title: "✅ تم إضافة للسلة",
      description: `تم إضافة ${quantity} من ${product.name} للسلة بنجاح`,
    });
  };

  const handleOrderNow = () => {
    // Add to cart first
    for (let i = 0; i < quantity; i++) {
      cart.addItem(product);
    }
    toast({
      title: "✅ تم إضافة للسلة",
      description: `تم إضافة ${product.name} للسلة بنجاح`,
    });
    // Navigate to checkout
    setLocation('/checkout');
  };

  const getCategoryDisplayName = (category: string) => {
    switch (category) {
      case 'gaming_accessory': return 'إكسسوارات قيمنج';
      case 'gaming_pc': return 'أجهزة PC';
      case 'gaming_console': return 'أجهزة تحكم';
      case 'streaming_gear': return 'أدوات ستريمر';
      default: return category;
    }
  };

  const getBadgeColor = (badge: string) => {
    if (badge.includes("خصم") || badge.includes("%")) return "destructive";
    if (badge === "جديد") return "secondary";
    if (badge.includes("متبقي") || badge.includes("قطع")) return "outline";
    if (badge === "الأكثر مبيعاً") return "default";
    return "secondary";
  };

  const discountPercentage = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  // Create multiple product images (for demo purposes, using the same image with different query params)
  const productImages = [
    product.image,
    `${product.image}&variant=angle1`,
    `${product.image}&variant=angle2`,
    `${product.image}&variant=detail`
  ];

  return (
    <div className="min-h-screen bg-dark-bg text-white">
      {/* Breadcrumb */}
      <div className="bg-dark-card border-b border-dark-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center space-x-2 text-sm text-gray-400">
            <button 
              onClick={() => setLocation('/')}
              className="hover:text-electric-yellow transition-colors"
            >
              الرئيسية
            </button>
            <ArrowRight className="w-4 h-4" />
            <button 
              onClick={() => setLocation('/products')}
              className="hover:text-electric-yellow transition-colors"
            >
              المنتجات
            </button>
            <ArrowRight className="w-4 h-4" />
            <span className="text-electric-yellow">{getCategoryDisplayName(product.category)}</span>
            <ArrowRight className="w-4 h-4" />
            <span className="text-white">{product.name}</span>
          </nav>
        </div>
      </div>

      {/* Product Detail Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Enhanced Product Images with Zoom */}
          <div className="space-y-4">
            <div className="relative">
              {/* Wishlist Button */}
              <button
                onClick={() => setIsWishlist(!isWishlist)}
                className={`absolute top-6 left-6 p-3 rounded-full transition-all duration-300 z-20 ${
                  isWishlist ? 'bg-red-500 text-white shadow-lg' : 'bg-white/20 backdrop-blur-sm text-white hover:bg-white/30'
                }`}
              >
                <Heart className={`w-5 h-5 ${isWishlist ? 'fill-current' : ''}`} />
              </button>
              
              <ProductImageZoom 
                images={productImages}
                alt={product.name}
                discountPercentage={discountPercentage}
              />
            </div>

            {/* Enhanced Product Features */}
            <div className="bg-dark-card rounded-xl p-6 border border-dark-border">
              <h4 className="text-lg font-bold mb-4 text-electric-yellow">مميزات المنتج</h4>
              <div className="space-y-3">
                <div className="flex items-center">
                  <Shield className="w-5 h-5 text-green-500 ml-3" />
                  <span>ضمان شامل سنة كاملة</span>
                </div>
                <div className="flex items-center">
                  <Truck className="w-5 h-5 text-blue-500 ml-3" />
                  <span>توصيل مجاني للطلبات أكثر من 500 د.ل</span>
                </div>
                <div className="flex items-center">
                  <ShoppingCart className="w-5 h-5 text-electric-yellow ml-3" />
                  <span>جودة عالية مضمونة</span>
                </div>
              </div>
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Product Title & Category */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline" className="text-electric-yellow border-electric-yellow">
                  {getCategoryDisplayName(product.category)}
                </Badge>
                {product.badges.map((badge, index) => (
                  <Badge key={index} variant={getBadgeColor(badge)}>
                    {badge}
                  </Badge>
                ))}
              </div>
              <h1 className="text-4xl lg:text-5xl font-extrabold mb-3 leading-tight" style={{ fontFamily: 'Cairo, Tajawal, sans-serif' }}>
                {product.name}
              </h1>
              <p className="text-gray-400 text-xl">{product.nameEn}</p>
            </div>

            {/* Enhanced Rating */}
            <StarRating 
              rating={product.rating} 
              reviewCount={127} 
              size="lg" 
            />

            {/* Enhanced Price Display */}
            <div className="space-y-3 p-6 bg-gradient-to-r from-dark-card to-dark-card/50 rounded-xl border border-dark-border">
              <div className="flex items-center gap-4">
                <span className="text-5xl font-extrabold text-electric-yellow">{product.price} د.ل</span>
                {product.originalPrice && (
                  <span className="text-3xl text-gray-500 line-through">{product.originalPrice} د.ل</span>
                )}
              </div>
              {discountPercentage > 0 && (
                <div className="flex items-center gap-3">
                  <Badge variant="destructive" className="px-3 py-1 text-sm font-bold">
                    وفر {product.originalPrice! - product.price} د.ل
                  </Badge>
                  <Badge variant="outline" className="border-green-500 text-green-400 px-3 py-1 text-sm">
                    خصم {discountPercentage}%
                  </Badge>
                </div>
              )}
            </div>

            {/* Stock Status */}
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${product.inStock ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className={product.inStock ? 'text-green-500' : 'text-red-500'}>
                {product.inStock ? `متوفر (${product.stockCount} قطعة)` : 'غير متوفر'}
              </span>
            </div>

            {/* Quantity & Actions */}
            {product.inStock && (
              <div className="space-y-6">
                {/* Quantity Selector */}
                <div className="flex items-center gap-4">
                  <span className="text-lg font-semibold">الكمية:</span>
                  <div className="flex items-center bg-dark-card border border-dark-border rounded-lg">
                    <button
                      onClick={() => handleQuantityChange(-1)}
                      disabled={quantity <= 1}
                      className="p-3 hover:bg-dark-border disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="px-4 py-3 font-bold text-lg min-w-[60px] text-center">{quantity}</span>
                    <button
                      onClick={() => handleQuantityChange(1)}
                      disabled={quantity >= product.stockCount}
                      className="p-3 hover:bg-dark-border disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <span className="text-sm text-gray-400">
                    المتوفر: {product.stockCount} قطعة
                  </span>
                </div>

                {/* Enhanced Action Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Button
                    onClick={handleAddToCart}
                    variant="outline"
                    className="h-16 text-xl font-bold border-2 border-electric-yellow text-electric-yellow hover:bg-electric-yellow hover:text-black transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    <ShoppingCart className="w-6 h-6 ml-2" />
                    أضف للسلة
                  </Button>
                  <Button
                    onClick={handleOrderNow}
                    className="h-16 text-xl font-bold bg-gradient-to-r from-electric-yellow to-yellow-300 hover:from-yellow-300 hover:to-electric-yellow text-black shadow-xl hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-300"
                  >
                    اطلب الآن
                  </Button>
                </div>
              </div>
            )}

          </div>
        </div>

        {/* Enhanced Product Tabs Section */}
        <div className="mt-16">
          <ProductTabs 
            description={product.description}
            descriptionEn={product.descriptionEn}
            category={product.category}
          />
        </div>

        {/* Enhanced Similar Products Carousel */}
        {similarProducts.length > 0 && (
          <div className="mt-20">
            <SimilarProductsCarousel
              products={similarProducts}
              onProductClick={(productId) => setLocation(`/product/${productId}`)}
              onAddToCart={(product) => {
                cart.addItem(product);
                toast({
                  title: "✅ تم إضافة للسلة",
                  description: `تم إضافة ${product.name} للسلة`,
                });
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}