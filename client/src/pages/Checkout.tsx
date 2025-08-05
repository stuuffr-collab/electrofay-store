import { useState } from "react";
import { useLocation } from "wouter";
import { ArrowRight, Truck, CreditCard, MapPin, Phone, User, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/hooks/use-toast";
import { useSaveOrder } from "@/hooks/useOrders";

interface OrderData {
  customerName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  notes: string;
}

export default function Checkout() {
  const [, setLocation] = useLocation();
  const cart = useCart();
  const { toast } = useToast();
  const saveOrderMutation = useSaveOrder();
  
  const [orderData, setOrderData] = useState<OrderData>({
    customerName: '',
    phone: '',
    email: '',
    address: '',
    city: 'طرابلس',
    notes: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const cities = [
    { name: 'طرابلس', fee: 15 },
    { name: 'بنغازي', fee: 25 },
    { name: 'مصراتة', fee: 25 },
    { name: 'الزاوية', fee: 20 },
    { name: 'صبراتة', fee: 25 },
    { name: 'زليتن', fee: 30 },
    { name: 'الخمس', fee: 30 },
    { name: 'غريان', fee: 25 },
    { name: 'مدينة أخرى', fee: 35 }
  ];

  const selectedCity = cities.find(city => city.name === orderData.city);
  const deliveryFee = selectedCity?.fee || 35;
  const subtotal = cart.items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const total = subtotal + deliveryFee;
  
  // Free shipping for orders over 500 LYD
  const finalDeliveryFee = subtotal >= 500 ? 0 : deliveryFee;
  const finalTotal = subtotal + finalDeliveryFee;

  const handleInputChange = (field: keyof OrderData, value: string) => {
    setOrderData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmitOrder = async () => {
    // Validate required fields
    if (!orderData.customerName || !orderData.phone || !orderData.address) {
      toast({
        title: "خطأ في البيانات",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive"
      });
      return;
    }

    if (cart.items.length === 0) {
      toast({
        title: "السلة فارغة",
        description: "يرجى إضافة منتجات للسلة قبل إتمام الطلب",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const orderDetails = {
        customerName: orderData.customerName,
        customerPhone: orderData.phone,
        customerEmail: orderData.email,
        customerAddress: orderData.address,
        customerCity: orderData.city,
        customerNotes: orderData.notes,
        items: cart.items,
        totalAmount: finalTotal,
        deliveryFee: finalDeliveryFee,
        status: 'pending'
      };

      // Save to database
      await saveOrderMutation.mutateAsync(orderDetails);

      // Clear cart
      cart.clearCart();

      // Show success message
      toast({
        title: "✅ تم إرسال الطلب بنجاح!",
        description: "سيتم التواصل معك خلال 24 ساعة لتأكيد الطلب",
      });

      // Navigate to success page or home
      setLocation('/order-success');
    } catch (error) {
      console.error('Error submitting order:', error);
      toast({
        title: "خطأ في إرسال الطلب",
        description: "حدث خطأ أثناء إرسال الطلب. يرجى المحاولة مرة أخرى",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-dark-bg text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">السلة فارغة</h1>
          <p className="text-gray-400 mb-6">لا توجد منتجات في سلة التسوق</p>
          <Button onClick={() => setLocation('/')} className="bg-electric-yellow text-black">
            العودة للتسوق
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-bg text-white">
      {/* Header */}
      <div className="bg-dark-card border-b border-dark-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setLocation('/')}
              className="text-electric-yellow hover:text-yellow-300 transition-colors"
            >
              <ArrowRight className="w-6 h-6" />
            </button>
            <h1 className="text-2xl font-bold">إتمام الطلب</h1>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Order Form */}
          <div className="space-y-6">
            <div className="bg-dark-card rounded-xl p-6 border border-dark-border">
              <h2 className="text-xl font-bold mb-6 flex items-center">
                <User className="w-5 h-5 ml-2 text-electric-yellow" />
                بيانات العميل
              </h2>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="customerName">الاسم الكامل *</Label>
                  <Input
                    id="customerName"
                    value={orderData.customerName}
                    onChange={(e) => handleInputChange('customerName', e.target.value)}
                    className="bg-dark-bg border-dark-border text-white"
                    placeholder="أدخل اسمك الكامل"
                  />
                </div>

                <div>
                  <Label htmlFor="phone">رقم الهاتف *</Label>
                  <Input
                    id="phone"
                    value={orderData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="bg-dark-bg border-dark-border text-white"
                    placeholder="مثال: 0912345678"
                  />
                </div>

                <div>
                  <Label htmlFor="email">البريد الإلكتروني (اختياري)</Label>
                  <Input
                    id="email"
                    type="email"
                    value={orderData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="bg-dark-bg border-dark-border text-white"
                    placeholder="example@email.com"
                  />
                </div>
              </div>
            </div>

            <div className="bg-dark-card rounded-xl p-6 border border-dark-border">
              <h2 className="text-xl font-bold mb-6 flex items-center">
                <MapPin className="w-5 h-5 ml-2 text-electric-yellow" />
                عنوان التوصيل
              </h2>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="city">المدينة *</Label>
                  <Select value={orderData.city} onValueChange={(value) => handleInputChange('city', value)}>
                    <SelectTrigger className="bg-dark-bg border-dark-border text-white">
                      <SelectValue placeholder="اختر المدينة" />
                    </SelectTrigger>
                    <SelectContent>
                      {cities.map((city) => (
                        <SelectItem key={city.name} value={city.name}>
                          {city.name} ({city.fee} د.ل)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="address">العنوان التفصيلي *</Label>
                  <Input
                    id="address"
                    value={orderData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    className="bg-dark-bg border-dark-border text-white"
                    placeholder="رقم المنزل، اسم الشارع، المنطقة"
                  />
                </div>

                <div>
                  <Label htmlFor="notes">ملاحظات إضافية (اختياري)</Label>
                  <Input
                    id="notes"
                    value={orderData.notes}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                    className="bg-dark-bg border-dark-border text-white"
                    placeholder="أي ملاحظات خاصة بالطلب"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <div className="bg-dark-card rounded-xl p-6 border border-dark-border">
              <h2 className="text-xl font-bold mb-6">ملخص الطلب</h2>
              
              <div className="space-y-4 mb-6">
                {cart.items.map((item, index) => (
                  <div key={index} className="flex justify-between items-center py-2 border-b border-dark-border">
                    <div className="flex-1">
                      <h4 className="font-semibold">{item.product.name}</h4>
                      <p className="text-sm text-gray-400">الكمية: {item.quantity}</p>
                    </div>
                    <span className="font-bold text-electric-yellow">
                      {item.product.price * item.quantity} د.ل
                    </span>
                  </div>
                ))}
              </div>

              <div className="space-y-3 pt-4 border-t border-dark-border">
                <div className="flex justify-between">
                  <span>المجموع الفرعي:</span>
                  <span>{subtotal} د.ل</span>
                </div>
                <div className="flex justify-between">
                  <span>رسوم التوصيل:</span>
                  <span className={finalDeliveryFee === 0 ? "text-green-500" : ""}>
                    {finalDeliveryFee === 0 ? "مجاني" : `${finalDeliveryFee} د.ل`}
                  </span>
                </div>
                {subtotal >= 500 && deliveryFee > 0 && (
                  <div className="text-sm text-green-500">
                    🎉 التوصيل مجاني للطلبات أكثر من 500 د.ل
                  </div>
                )}
                <div className="flex justify-between text-xl font-bold text-electric-yellow pt-2 border-t border-dark-border">
                  <span>المجموع الكلي:</span>
                  <span>{finalTotal} د.ل</span>
                </div>
              </div>
            </div>

            <div className="bg-dark-card rounded-xl p-6 border border-dark-border">
              <h3 className="font-bold mb-4 flex items-center">
                <Truck className="w-5 h-5 ml-2 text-electric-yellow" />
                معلومات التوصيل
              </h3>
              <div className="space-y-2 text-sm text-gray-300">
                <p>• مدة التوصيل: 2-5 أيام عمل</p>
                <p>• الدفع عند الاستلام</p>
                <p>• فحص المنتج قبل الدفع</p>
                <p>• ضمان استرداد المال</p>
              </div>
            </div>

            <Button
              onClick={handleSubmitOrder}
              disabled={isSubmitting}
              className="w-full h-14 text-lg font-bold bg-electric-yellow hover:bg-yellow-300 text-black shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
            >
              {isSubmitting ? "جارِ إرسال الطلب..." : "تأكيد الطلب"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}