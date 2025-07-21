import { Star, Quote } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface Testimonial {
  id: string;
  name: string;
  location: string;
  rating: number;
  comment: string;
  product: string;
  date: string;
  avatar: string;
}

const testimonials: Testimonial[] = [
  {
    id: "1",
    name: "أحمد محمد",
    location: "طرابلس",
    rating: 5,
    comment: "سماعات ممتازة جداً، الصوت واضح والجودة عالية. التوصيل كان سريع والتعامل محترم جداً. أنصح بالمتجر بقوة 👍",
    product: "سماعات قيمنج لاسلكية",
    date: "منذ أسبوعين",
    avatar: "👨‍💼"
  },
  {
    id: "2", 
    name: "فاطمة علي",
    location: "بنغازي",
    rating: 5,
    comment: "الماوس ممتاز للقيمنج، استجابة سريعة جداً وتصميم مريح. ابني مبسوط جداً به، وسعر معقول مقارنة بالجودة.",
    product: "ماوس قيمنج RGB",
    date: "منذ 3 أيام",
    avatar: "👩‍🏫"
  },
  {
    id: "3",
    name: "عمر خالد",
    location: "مصراتة", 
    rating: 5,
    comment: "كيبورد رائع، الإضاءة جميلة والأزرار ناعمة. وصل بسرعة رغم المسافة. شكراً متجر إلكتروفاي 🔥",
    product: "كيبورد ميكانيكي RGB",
    date: "منذ 5 أيام",
    avatar: "👨‍🎓"
  },
  {
    id: "4",
    name: "مريم سالم",
    location: "سبها",
    rating: 5,
    comment: "الشاشة ممتازة للعمل والقيمنج، الألوان زاهية والوضوح عالي جداً. التعامل مع المتجر كان راقي ومحترم.",
    product: "شاشة قيمنج 24 بوصة",
    date: "منذ أسبوع",
    avatar: "👩‍💻"
  },
  {
    id: "5",
    name: "محمد الطاهر",
    location: "الزاوية",
    rating: 5,
    comment: "الكرسي مريح جداً، جودة التصنيع عالية والسعر منافس. نصحني صديق بالمتجر وما خاب ظني، شكراً لكم 💪",
    product: "كرسي قيمنج احترافي",
    date: "منذ 4 أيام", 
    avatar: "👨‍💼"
  }
];

export default function Testimonials() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          آراء عملائنا
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          نفتخر بثقة عملائنا وتقييماتهم الإيجابية لمنتجاتنا وخدماتنا
        </p>
        <div className="flex items-center justify-center gap-2 mt-6">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-6 h-6 fill-yellow-400 text-yellow-400" />
            ))}
          </div>
          <span className="text-lg font-semibold text-gray-900 dark:text-white">
            4.9 من 5 نجوم
          </span>
          <span className="text-gray-600 dark:text-gray-400">
            (250+ تقييم)
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {testimonials.map((testimonial) => (
          <Card key={testimonial.id} className="relative bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <Quote className="w-8 h-8 text-blue-500 mb-4" />
              
              <div className="flex items-center mb-4">
                <div className="text-3xl mr-3">{testimonial.avatar}</div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {testimonial.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {testimonial.location}
                  </p>
                </div>
              </div>

              <div className="flex items-center mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`w-4 h-4 ${
                      i < testimonial.rating 
                        ? 'fill-yellow-400 text-yellow-400' 
                        : 'text-gray-300'
                    }`} 
                  />
                ))}
              </div>

              <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                {testimonial.comment}
              </p>

              <div className="border-t border-gray-200 dark:border-gray-600 pt-4">
                <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
                  {testimonial.product}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {testimonial.date}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="text-center mt-12">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            شارك تجربتك معنا
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            هل اشتريت منتج من متجرنا؟ نحب أن نسمع رأيك وتقييمك
          </p>
          <a 
            href="https://wa.me/218922569912?text=أريد مشاركة تقييمي للمنتج الذي اشتريته"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            <Star className="w-5 h-5" />
            اترك تقييمك الآن
          </a>
        </div>
      </div>
    </div>
  );
}