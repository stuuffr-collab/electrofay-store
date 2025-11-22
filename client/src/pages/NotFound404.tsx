import { Button } from "@/components/ui/button";
import { Home, ArrowLeft, Search } from "lucide-react";
import { Link } from "wouter";
import { SEOHead } from "@/components/SEOHead";

export default function NotFound404() {
  return (
    <>
      <SEOHead 
        title="الصفحة غير موجودة - إلكتروفاي"
        description="الصفحة التي تبحث عنها غير موجودة. تصفح منتجاتنا أو عد إلى الصفحة الرئيسية."
      />
      
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 px-4">
        <div className="max-w-md w-full text-center">
          {/* 404 Illustration */}
          <div className="mb-8">
            <div className="text-8xl font-bold text-gray-300 dark:text-gray-600 mb-4">404</div>
            <div className="w-32 h-32 mx-auto bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-6">
              <Search className="w-16 h-16 text-white" />
            </div>
          </div>

          {/* Error Message */}
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            الصفحة غير موجودة
          </h1>
          
          <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
            عذراً، الصفحة التي تبحث عنها غير موجودة أو تم نقلها. 
            يمكنك العودة إلى الصفحة الرئيسية أو تصفح منتجاتنا المميزة.
          </p>

          {/* Action Buttons */}
          <div className="space-y-4">
            <Link href="/">
              <Button className="w-full bg-gradient-to-r from-[#FFD700] to-[#FFB300] hover:from-[#FFB300] hover:to-[#FF8C00] text-black font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
                <Home className="w-5 h-5 ml-2" />
                العودة للرئيسية
              </Button>
            </Link>
            
            <Link href="/products">
              <Button variant="outline" className="w-full">
                <ArrowLeft className="w-5 h-5 ml-2" />
                تصفح المنتجات
              </Button>
            </Link>
          </div>

          {/* Quick Links */}
          <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              روابط مفيدة:
            </p>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <Link href="/products" className="text-blue-600 dark:text-blue-400 hover:underline">
                المنتجات
              </Link>
              <Link href="/about" className="text-blue-600 dark:text-blue-400 hover:underline">
                من نحن
              </Link>
              <Link href="/contact" className="text-blue-600 dark:text-blue-400 hover:underline">
                تواصل معنا
              </Link>
              <Link href="/categories" className="text-blue-600 dark:text-blue-400 hover:underline">
                الأقسام
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}