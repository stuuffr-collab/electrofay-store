import { Star } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "أحمد محمد",
    city: "طرابلس",
    avatar: "أ.م",
    rating: 5,
    comment: "خدمة ممتازة وسرعة في التوصيل. المنتجات أصلية وبجودة عالية جداً. أنصح بالتعامل معهم.",
    bgGradient: "from-electric-yellow to-electric-blue"
  },
  {
    id: 2,
    name: "سارة أحمد",
    city: "بنغازي",
    avatar: "س.أ",
    rating: 5,
    comment: "حصلت على أفضل إكسسوارات قيمنج من هنا. الأسعار معقولة والجودة فوق المتوقع. شكراً لكم!",
    bgGradient: "from-purple-500 to-pink-500"
  },
  {
    id: 3,
    name: "محمد علي",
    city: "مصراتة",
    avatar: "م.ع",
    rating: 5,
    comment: "فريق محترف ومتعاون. ساعدوني في اختيار المنتجات المناسبة لاحتياجاتي. راضي جداً عن التجربة.",
    bgGradient: "from-green-500 to-teal-500"
  }
];

export function TestimonialsSection() {
  return (
    <section className="py-16 bg-white dark:bg-dark-bg transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold mb-4">آراء عملائنا</h3>
          <p className="text-gray-600 dark:text-gray-400">ماذا يقول عملاؤنا عن تجربتهم معنا</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="bg-gray-50 dark:bg-dark-card rounded-xl p-6 text-center transition-colors duration-300">
              <div className="flex justify-center mb-4">
                <div className={`w-16 h-16 bg-gradient-to-br ${testimonial.bgGradient} rounded-full flex items-center justify-center text-white font-bold text-xl`}>
                  {testimonial.avatar}
                </div>
              </div>
              
              <div className="flex justify-center mb-4">
                <div className="flex text-yellow-500">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-current" />
                  ))}
                </div>
              </div>
              
              <p className="text-gray-600 dark:text-gray-300 mb-4 transition-colors duration-300">
                "{testimonial.comment}"
              </p>
              
              <h5 className="font-bold">{testimonial.name} - {testimonial.city}</h5>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
