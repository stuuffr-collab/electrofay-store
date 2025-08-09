import { useState, useEffect } from "react";
import { Phone, Mail, MapPin, Clock, MessageCircle, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Toast, useToastManager } from "@/components/Toast";
import { trackEvent } from "@/lib/analytics";
import citiesData from "@/data/cities.json";

interface ContactForm {
  name: string;
  phone: string;
  email: string;
  city: string;
  subject: string;
  message: string;
}

export default function Contact() {
  const [formData, setFormData] = useState<ContactForm>({
    name: "",
    phone: "",
    email: "",
    city: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toasts, showSuccess, showError } = useToastManager();

  useEffect(() => {
    document.title = "تواصل معنا - إلكتروفاي | خدمة العملاء ومعلومات التواصل";
  }, []);

  const handleInputChange = (field: keyof ContactForm, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Create WhatsApp message for contact inquiry
      const whatsappMessage = `📞 *استفسار جديد من إلكتروفاي*

👤 *بيانات المتصل:*
• الاسم: ${formData.name}
• رقم الهاتف: ${formData.phone}
• البريد الإلكتروني: ${formData.email}
• المدينة: ${citiesData.find(city => city.id === formData.city)?.name || formData.city}

📝 *الموضوع:* ${formData.subject}

💬 *الرسالة:*
${formData.message}

⏰ *تاريخ الاستفسار:* ${new Date().toLocaleString('ar-LY')}`;

      // Open WhatsApp
      const whatsappUrl = `https://wa.me/218922569912?text=${encodeURIComponent(whatsappMessage)}`;
      window.open(whatsappUrl, '_blank');

      // Track event
      trackEvent('contact_form_submitted', 'engagement', formData.subject);

      // Show success message
      showSuccess("تم إرسال رسالتك بنجاح! سنتواصل معك قريباً");

      // Reset form
      setFormData({
        name: "",
        phone: "",
        email: "",
        city: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      showError("حدث خطأ في إرسال الرسالة. حاول مرة أخرى");
      console.error("Contact form error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">تواصل معنا</h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            نحن هنا لخدمتك! تواصل معنا لأي استفسار أو طلب مساعدة
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Contact Information */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-gray-800 to-gray-600 rounded-2xl p-8 text-white mb-8">
              <h2 className="text-2xl font-bold mb-6">معلومات التواصل</h2>
              
              <div className="space-y-6">
                <div className="flex items-center space-x-4 space-x-reverse">
                  <div className="w-12 h-12 bg-electric-yellow rounded-lg flex items-center justify-center">
                    <Phone className="w-6 h-6 text-black" />
                  </div>
                  <div>
                    <h3 className="font-semibold">رقم الهاتف</h3>
                    <p className="text-gray-200">+218922569912</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4 space-x-reverse">
                  <div className="w-12 h-12 bg-electric-yellow rounded-lg flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-black" />
                  </div>
                  <div>
                    <h3 className="font-semibold">منطقة الخدمة</h3>
                    <p className="text-gray-200">جميع مدن ليبيا</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4 space-x-reverse">
                  <div className="w-12 h-12 bg-electric-yellow rounded-lg flex items-center justify-center">
                    <Clock className="w-6 h-6 text-black" />
                  </div>
                  <div>
                    <h3 className="font-semibold">ساعات العمل</h3>
                    <p className="text-gray-200">24/7 خدمة العملاء</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4 space-x-reverse">
                  <div className="w-12 h-12 bg-electric-yellow rounded-lg flex items-center justify-center">
                    <MessageCircle className="w-6 h-6 text-black" />
                  </div>
                  <div>
                    <h3 className="font-semibold">واتساب</h3>
                    <p className="text-gray-200">الرد السريع المضمون</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-gray-600">
                <h3 className="font-semibold mb-4">تواصل سريع</h3>
                <Button
                  onClick={() => window.open('https://wa.me/218922569912', '_blank')}
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                >
                  <MessageCircle className="w-5 h-5 ml-2" />
                  فتح واتساب
                </Button>
              </div>
            </div>

            {/* FAQ Section */}
            <div className="bg-black dark:bg-black rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-bold mb-4">أسئلة شائعة</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-electric-yellow mb-2">كم يستغرق التوصيل؟</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    عادة من 1-3 أيام عمل حسب المدينة
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-electric-yellow mb-2">هل المنتجات أصلية؟</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    نعم، جميع منتجاتنا أصلية 100% مع ضمان
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-electric-yellow mb-2">طرق الدفع المتاحة؟</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300 flex items-center">
                    💵 <span className="mr-2">دفع عند الاستلام</span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-black dark:bg-black rounded-xl p-8 shadow-lg">
              <h2 className="text-2xl font-bold mb-6">إرسال رسالة</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="name" className="block text-sm font-medium mb-2">
                      الاسم الكامل *
                    </Label>
                    <Input
                      id="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      placeholder="أدخل اسمك الكامل"
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone" className="block text-sm font-medium mb-2">
                      رقم الهاتف *
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      placeholder="09xxxxxxxx"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="email" className="block text-sm font-medium mb-2">
                      البريد الإلكتروني
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      placeholder="example@email.com"
                    />
                  </div>

                  <div>
                    <Label htmlFor="city" className="block text-sm font-medium mb-2">
                      المدينة *
                    </Label>
                    <Select
                      value={formData.city}
                      onValueChange={(value) => handleInputChange("city", value)}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="اختر المدينة" />
                      </SelectTrigger>
                      <SelectContent>
                        {citiesData.map((city) => (
                          <SelectItem key={city.id} value={city.id}>
                            {city.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="subject" className="block text-sm font-medium mb-2">
                    موضوع الرسالة *
                  </Label>
                  <Select
                    value={formData.subject}
                    onValueChange={(value) => handleInputChange("subject", value)}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="اختر موضوع الرسالة" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="استفسار عن منتج">استفسار عن منتج</SelectItem>
                      <SelectItem value="مشكلة في الطلب">مشكلة في الطلب</SelectItem>
                      <SelectItem value="استفسار عن التوصيل">استفسار عن التوصيل</SelectItem>
                      <SelectItem value="شكوى">شكوى</SelectItem>
                      <SelectItem value="اقتراح">اقتراح</SelectItem>
                      <SelectItem value="أخرى">أخرى</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="message" className="block text-sm font-medium mb-2">
                    نص الرسالة *
                  </Label>
                  <Textarea
                    id="message"
                    required
                    rows={6}
                    value={formData.message}
                    onChange={(e) => handleInputChange("message", e.target.value)}
                    placeholder="اكتب رسالتك هنا..."
                    className="resize-none"
                  />
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    <strong>ملاحظة:</strong> سيتم توجيهك إلى واتساب لإكمال إرسال الرسالة. 
                    هذا يضمن وصول رسالتك إلينا بشكل فوري ومباشر.
                  </p>
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-electric-yellow hover:bg-yellow-300 text-black font-semibold py-3"
                >
                  <Send className="w-5 h-5 ml-2" />
                  {isSubmitting ? "جاري الإرسال..." : "إرسال الرسالة"}
                </Button>
              </form>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-16 grid md:grid-cols-3 gap-8">
          <div className="text-center p-6 bg-black dark:bg-black rounded-xl border border-gray-800">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-lg font-bold mb-2 text-white">رد سريع</h3>
            <p className="text-gray-300 text-sm">
              نرد على استفساراتك خلال دقائق معدودة
            </p>
          </div>

          <div className="text-center p-6 bg-black dark:bg-black rounded-xl border border-gray-800">
            <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Phone className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-lg font-bold mb-2 text-white">دعم مباشر</h3>
            <p className="text-gray-300 text-sm">
              فريق خدمة عملاء متخصص ومدرب
            </p>
          </div>

          <div className="text-center p-6 bg-black dark:bg-black rounded-xl border border-gray-800">
            <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-lg font-bold mb-2 text-white">متاح دائماً</h3>
            <p className="text-gray-300 text-sm">
              خدمة العملاء متاحة 24 ساعة طوال الأسبوع
            </p>
          </div>
        </div>
      </div>

      {/* Toast Notifications */}
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} />
      ))}
    </div>
  );
}
