import { useState } from "react";
import { ProductCard } from "@/components/ProductCard";
import { useProducts } from "@/hooks/useProducts";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/hooks/use-toast";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Product } from "@/components/ProductCard";

export default function NewProducts() {
  const { data: products = [] } = useProducts();
  const cart = useCart();
  const { toast } = useToast();

  // Filter for newest products (products with "جديد" badge)
  const newProducts = products.filter(product => 
    product.badges.includes("جديد")
  ) as Product[];

  const handleAddToCart = (product: Product) => {
    cart.addItem(product);
    toast({
      title: "✅ تم إضافة للسلة",
      description: `تم إضافة ${product.name} للسلة بنجاح`,
    });
  };

  const handleOrderClick = (product: Product) => {
    // Add to cart and navigate to checkout
    cart.addItem(product);
    // You can add checkout navigation here
  };

  return (
    <div className="min-h-screen bg-dark-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumbs 
          items={[
            { label: "أحدث المنتجات" }
          ]} 
        />
        
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">أحدث المنتجات</h1>
          <p className="text-gray-300 max-w-2xl mx-auto">
            اكتشف أحدث منتجاتنا من عالم الألعاب والتكنولوجيا
          </p>
        </div>

        {newProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {newProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onOrderClick={handleOrderClick}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-gray-400 text-lg">لا توجد منتجات جديدة حالياً</p>
          </div>
        )}
      </div>
    </div>
  );
}