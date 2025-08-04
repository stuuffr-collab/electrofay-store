import { useEffect } from "react";
import { Target, Users, Award, Clock, MapPin, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function About() {
  useEffect(() => {
    document.title = "من نحن - إلكتروفاي | رؤيتنا وقصتنا";
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-gray-800 via-gray-700 to-gray-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              عن <span className="text-electric-yellow">إلكتروفاي</span>
            </h1>
            <p className="text-xl text-gray-200 max-w-3xl mx-auto">
              نحن متجر متخصص في إكسسوارات القيمنج والمنتجات الكهرومنزلية، نسعى لتوفير أفضل المنتجات بأسعار منافسة مع خدمة عملاء متميزة
            </p>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16 bg-black dark:bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">قصتنا</h2>
              <div className="space-y-4 text-gray-600 dark:text-gray-300">
                <p>
                  بدأت إلكتروفاي من رؤية بسيطة: جعل أفضل إكسسوارات القيمنج والمنتجات الكهرومنزلية 
                  متاحة لكل بيت في ليبيا. نحن نؤمن بأن التكنولوجيا يجب أن تكون في متناول الجميع.
                </p>
                <p>
                  منذ انطلاقنا، نركز على انتقاء المنتجات عالية الجودة من أفضل العلامات التجارية 
                  العالمية، مع ضمان أسعار تنافسية وخدمة توصيل سريعة لجميع أنحاء ليبيا.
                </p>
                <p>
                  اليوم، نفخر بكوننا الخيار الأول لآلاف العملاء الذين يثقون في جودة منتجاتنا 
                  ومصداقية خدماتنا.
                </p>
              </div>
            </div>
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400" 
                alt="Modern electronics store setup" 
                className="rounded-xl shadow-lg w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-16 bg-black dark:bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">قيمنا ومبادئنا</h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              نسير وفق مبادئ واضحة تضمن تقديم أفضل تجربة تسوق لعملائنا
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-electric-yellow rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-black" />
              </div>
              <h3 className="text-xl font-bold mb-2">الجودة العالية</h3>
              <p className="text-gray-600 dark:text-gray-300">
                نختار بعناية أفضل المنتجات من علامات تجارية موثوقة
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-electric-yellow rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-black" />
              </div>
              <h3 className="text-xl font-bold mb-2">خدمة العملاء</h3>
              <p className="text-gray-600 dark:text-gray-300">
                فريق متخصص متاح 24/7 لمساعدتك في أي استفسار
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-electric-yellow rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-black" />
              </div>
              <h3 className="text-xl font-bold mb-2">التوصيل السريع</h3>
              <p className="text-gray-600 dark:text-gray-300">
                توصيل سريع وآمن لجميع مدن ليبيا في أقل وقت ممكن
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-electric-yellow rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-black" />
              </div>
              <h3 className="text-xl font-bold mb-2">أسعار منافسة</h3>
              <p className="text-gray-600 dark:text-gray-300">
                أفضل الأسعار في السوق مع ضمان الجودة والأصالة
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="py-16 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">أرقامنا تتحدث</h2>
            <p className="text-purple-100">إنجازاتنا خلال رحلتنا في خدمة عملائنا</p>
          </div>

          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div className="bg-white/10 rounded-lg p-6">
              <div className="text-4xl font-bold text-electric-yellow mb-2">1000+</div>
              <p className="text-purple-100">عميل راضٍ</p>
            </div>
            <div className="bg-white/10 rounded-lg p-6">
              <div className="text-4xl font-bold text-electric-yellow mb-2">200+</div>
              <p className="text-purple-100">منتج متميز</p>
            </div>
            <div className="bg-white/10 rounded-lg p-6">
              <div className="text-4xl font-bold text-electric-yellow mb-2">15</div>
              <p className="text-purple-100">مدينة نخدمها</p>
            </div>
            <div className="bg-white/10 rounded-lg p-6">
              <div className="text-4xl font-bold text-electric-yellow mb-2">24/7</div>
              <p className="text-purple-100">خدمة العملاء</p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Mission */}
      <section className="py-16 bg-white dark:bg-dark-bg">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-8">رؤيتنا ورسالتنا</h2>
          
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="bg-gray-50 dark:bg-dark-card rounded-xl p-8">
              <h3 className="text-2xl font-bold mb-4 text-electric-yellow">رؤيتنا</h3>
              <p className="text-gray-600 dark:text-gray-300">
                أن نكون الوجهة الأولى والأكثر ثقة لشراء إكسسوارات القيمنج والمنتجات الكهرومنزلية 
                في ليبيا، مع تقديم تجربة تسوق استثنائية لكل عميل.
              </p>
            </div>
            
            <div className="bg-gray-50 dark:bg-dark-card rounded-xl p-8">
              <h3 className="text-2xl font-bold mb-4 text-electric-yellow">رسالتنا</h3>
              <p className="text-gray-600 dark:text-gray-300">
                نسعى لتوفير أحدث وأفضل المنتجات التقنية بأسعار منافسة، مع ضمان الجودة والخدمة 
                المتميزة، لنساهم في تطوير الحياة الرقمية في ليبيا.
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-electric-yellow to-yellow-300 rounded-xl p-8 text-black">
            <h3 className="text-2xl font-bold mb-4">التزامنا تجاهك</h3>
            <p className="text-lg">
              نلتزم بتقديم منتجات أصلية 100%، خدمة عملاء متميزة، وتوصيل سريع وآمن. 
              رضاك هو هدفنا الأول، ونعمل باستمرار على تطوير خدماتنا لنلبي توقعاتك وأكثر.
            </p>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 bg-gray-50 dark:bg-dark-card">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">تواصل معنا</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            لديك استفسار؟ نحن هنا لمساعدتك. تواصل معنا عبر الواتساب أو زر صفحة التواصل
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={() => window.open('https://wa.me/218922569912', '_blank')}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <Phone className="w-5 h-5 ml-2" />
              تواصل عبر واتساب
            </Button>
            <Link href="/contact">
              <Button className="bg-electric-yellow hover:bg-yellow-300 text-black">
                <MapPin className="w-5 h-5 ml-2" />
                صفحة التواصل
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
