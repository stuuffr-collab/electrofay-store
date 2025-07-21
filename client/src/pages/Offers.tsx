import { useEffect } from "react";
import { Percent, Clock, Gift, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CountdownTimer } from "@/components/CountdownTimer";
import { Link } from "wouter";

export default function Offers() {
  useEffect(() => {
    document.title = "العروض الخاصة - إلكتروفاي | خصومات وعروض حصرية";
  }, []);

  // Set offer end dates
  const weeklyOfferEnd = new Date();
  weeklyOfferEnd.setDate(weeklyOfferEnd.getDate() + 7);

  const flashSaleEnd = new Date();
  flashSaleEnd.setHours(flashSaleEnd.getHours() + 6);

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            العروض الخاصة
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            احصل على أفضل العروض والخصومات الحصرية على منتجاتنا المميزة
          </p>
        </div>

        {/* Main Offers */}
        <div className="grid lg:grid-cols-2 gap-8 mb-16">
          {/* Weekly Gaming Offer */}
          <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl p-8 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12"></div>
            
            <div className="relative z-10">
              <div className="flex items-center mb-4">
                <Percent className="w-8 h-8 text-electric-yellow ml-3" />
                <span className="bg-electric-yellow text-black px-3 py-1 rounded-full text-sm font-bold">
                  خصم 50%
                </span>
              </div>
              
              <h2 className="text-3xl font-bold mb-4">
                عرض القيمنج الأسبوعي
              </h2>
              <p className="text-purple-100 mb-6">
                خصم يصل إلى 50% على جميع إكسسوارات القيمنج - لوحات مفاتيح، فأرة، سماعات رأس والمزيد
              </p>
              
              <div className="bg-white/10 rounded-lg p-4 mb-6">
                <p className="text-sm font-medium mb-2">العرض ينتهي خلال:</p>
                <CountdownTimer targetDate={weeklyOfferEnd} />
              </div>

              <Link href="/products?category=gaming">
                <Button className="bg-electric-yellow hover:bg-yellow-300 text-black font-semibold">
                  تسوق إكسسوارات القيمنج
                </Button>
              </Link>
            </div>
          </div>

          {/* Electronics Bundle Offer */}
          <div className="bg-gradient-to-br from-blue-600 to-teal-600 rounded-2xl p-8 text-white relative overflow-hidden">
            <div className="absolute top-0 left-0 w-40 h-40 bg-white/5 rounded-full -translate-y-20 -translate-x-20"></div>
            <div className="absolute bottom-0 right-0 w-28 h-28 bg-white/10 rounded-full translate-y-14 translate-x-14"></div>
            
            <div className="relative z-10">
              <div className="flex items-center mb-4">
                <Gift className="w-8 h-8 text-electric-yellow ml-3" />
                <span className="bg-electric-yellow text-black px-3 py-1 rounded-full text-sm font-bold">
                  باقة مميزة
                </span>
              </div>
              
              <h2 className="text-3xl font-bold mb-4">
                باقة المنزل الذكي
              </h2>
              <p className="text-blue-100 mb-6">
                احصل على 3 منتجات كهرومنزلية ذكية بسعر منتجين فقط + توصيل مجاني
              </p>
              
              <div className="bg-white/10 rounded-lg p-4 mb-6">
                <ul className="space-y-2 text-sm">
                  <li>✓ سماعة ذكية + شاحن لاسلكي + بطارية محمولة</li>
                  <li>✓ توفير يصل إلى 120 دينار ليبي</li>
                  <li>✓ توصيل مجاني لجميع أنحاء ليبيا</li>
                </ul>
              </div>

              <Link href="/products?category=electronics">
                <Button className="bg-electric-yellow hover:bg-yellow-300 text-black font-semibold">
                  تسوق المنتجات الكهرومنزلية
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Flash Sale */}
        <div className="bg-gradient-to-r from-red-600 to-orange-600 rounded-2xl p-8 mb-16 text-white text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-center mb-4">
              <Zap className="w-10 h-10 text-electric-yellow ml-3 animate-pulse" />
              <h2 className="text-4xl font-bold">فلاش سيل ⚡</h2>
            </div>
            
            <p className="text-xl mb-6">عروض برق لا تُفوَّت - خصومات فورية محدودة الوقت!</p>
            
            <div className="max-w-md mx-auto mb-6">
              <CountdownTimer targetDate={flashSaleEnd} />
            </div>

            <div className="grid md:grid-cols-3 gap-4 mb-8">
              <div className="bg-white/10 rounded-lg p-4">
                <h4 className="font-bold text-lg">لوحة مفاتيح RGB</h4>
                <p className="text-2xl font-bold text-electric-yellow">120 د.ل</p>
                <p className="text-sm line-through">180 د.ل</p>
              </div>
              <div className="bg-white/10 rounded-lg p-4">
                <h4 className="font-bold text-lg">سماعة رأس قيمنج</h4>
                <p className="text-2xl font-bold text-electric-yellow">90 د.ل</p>
                <p className="text-sm line-through">150 د.ل</p>
              </div>
              <div className="bg-white/10 rounded-lg p-4">
                <h4 className="font-bold text-lg">شاحن لاسلكي سريع</h4>
                <p className="text-2xl font-bold text-electric-yellow">45 د.ل</p>
                <p className="text-sm line-through">65 د.ل</p>
              </div>
            </div>

            <Link href="/products">
              <Button size="lg" className="bg-electric-yellow hover:bg-yellow-300 text-black font-semibold text-lg px-8 py-3">
                تسوق العروض الآن
              </Button>
            </Link>
          </div>
        </div>

        {/* Additional Offers Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Free Shipping */}
          <div className="bg-white dark:bg-dark-card rounded-xl p-6 shadow-lg text-center">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2">توصيل مجاني</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              للطلبات أكثر من 200 دينار ليبي
            </p>
            <p className="text-sm text-green-600 font-medium">
              وفر حتى 30 دينار على رسوم التوصيل
            </p>
          </div>

          {/* Customer Loyalty */}
          <div className="bg-white dark:bg-dark-card rounded-xl p-6 shadow-lg text-center">
            <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2">عضوية VIP</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              خصم إضافي 10% للعملاء المميزين
            </p>
            <p className="text-sm text-purple-600 font-medium">
              اطلب 5 مرات واحصل على العضوية
            </p>
          </div>

          {/* Trade-In Program */}
          <div className="bg-white dark:bg-dark-card rounded-xl p-6 shadow-lg text-center">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2">برنامج الاستبدال</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              استبدل منتجك القديم بخصم على الجديد
            </p>
            <p className="text-sm text-blue-600 font-medium">
              خصم يصل إلى 25% عند الاستبدال
            </p>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <h3 className="text-2xl font-bold mb-4">لا تفوت عروضنا الحصرية!</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            تابع صفحتنا للحصول على آخر العروض والخصومات
          </p>
          <div className="flex justify-center gap-4">
            <Button 
              onClick={() => window.open('https://wa.me/218922569912', '_blank')}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              متابعة عبر واتساب
            </Button>
            <Link href="/products">
              <Button className="bg-electric-yellow hover:bg-yellow-300 text-black">
                تصفح جميع المنتجات
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
