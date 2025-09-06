import { useState } from "react";
import { Minus, Plus, Trash2, X, ShoppingBag, MessageCircle, User, Phone, MapPin, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CartItem } from "@/context/CartContext";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSaveOrder } from "@/hooks/useOrders";
import toast from "react-hot-toast";

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  totalPrice: number;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onCheckout: () => void;
}

export function CartSidebar({
  isOpen,
  onClose,
  items,
  totalPrice,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout
}: CartSidebarProps) {
  const [showCheckoutDialog, setShowCheckoutDialog] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [customerData, setCustomerData] = useState({
    name: '',
    phone: '',
    city: '',
    address: ''
  });

  const formatPrice = (price: number) => `${price} د.ل`;

  const libyanCities = [
    'طرابلس', 'بنغازي', 'مصراتة', 'الزاوية', 'البيضاء', 'غريان', 'صبراتة', 'الخمس',
    'زليتن', 'أجدابيا', 'ترهونة', 'نالوت', 'سرت', 'سبها', 'درنة', 'توكرة',
    'رجدالين', 'يفرن', 'زوارة', 'الجميل', 'القره بوللي', 'تاجوراء', 'العزيزية'
  ];

  const handleCustomerDataChange = (field: string, value: string) => {
    setCustomerData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const createWhatsAppMessage = (data: { product: any; customer: any }) => {
    return `
🛒 *طلب جديد من متجر إلكتروفاي*

📋 *تفاصيل المنتجات:*
${items.map(item => `• ${item.product.name} × ${item.quantity} = ${formatPrice(item.product.price * item.quantity)}`).join('\n')}

💰 *المجموع الكلي:* ${formatPrice(totalPrice)}

👤 *بيانات العميل:*
• الاسم: ${data.customer.name}
• الهاتف: ${data.customer.phone}
• المدينة: ${data.customer.city}
• العنوان: ${data.customer.address || 'غير محدد'}

📅 *تاريخ الطلب:* ${new Date().toLocaleDateString('ar-EG')}

شكراً لتسوقكم معنا! 🙏
    `.trim();
  };

  const saveOrderMutation = useSaveOrder();

  const handleCompleteOrder = async () => {
    if (!customerData.name || !customerData.phone || !customerData.city) {
      toast.error('الرجاء ملء جميع البيانات المطلوبة');
      return;
    }

    const orderMessage = createWhatsAppMessage({
      product: { 
        id: "cart-checkout",
        name: `طلب متعدد - ${items.length} منتج`,
        price: totalPrice 
      },
      customer: customerData
    });

    try {
      const orderData = {
        customerName: customerData.name,
        customerPhone: customerData.phone,
        customerCity: customerData.city,
        customerAddress: customerData.address,
        items: items,
        totalAmount: totalPrice,
        deliveryFee: 0
      };

      console.log('Order sent to backend:', orderData);
      console.log('📋 طلب جديد:', orderData);
      console.log('📱 رسالة واتساب للتاجر:', orderMessage);
      
      // Save order to Supabase database
      await saveOrderMutation.mutateAsync(orderData);
      
      console.log('💾 تم حفظ الطلب في قاعدة البيانات بنجاح!');
      
      // Also store in localStorage as backup for business owner
      const orders = JSON.parse(localStorage.getItem('businessOrders') || '[]');
      orders.push({
        ...orderData,
        id: Date.now(),
        timestamp: new Date().toISOString(),
        whatsappMessage: orderMessage
      });
      localStorage.setItem('businessOrders', JSON.stringify(orders));
      
      // Show success dialog to user immediately
      setShowCheckoutDialog(false);
      setShowSuccessDialog(true);
      
      // Clear cart after a short delay
      setTimeout(() => {
        onCheckout();
        setCustomerData({ name: '', phone: '', city: '', address: '' });
      }, 2000);
      
    } catch (error) {
      console.error('Error processing order:', error);
      toast.error('حدث خطأ في حفظ الطلب. يرجى المحاولة مرة أخرى أو التواصل معنا مباشرة');
      
      return;
    }
  };

  return (
    <>
      {/* Cart Sidebar */}
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent side="right" className="w-full sm:w-[420px] flex flex-col bg-dark-bg border-l border-dark-border max-h-screen" style={{ background: 'var(--dark-bg)' }}>
          <SheetHeader>
            <SheetTitle className="text-right flex items-center justify-between text-white">
              <span>🛒 سلة التسوق</span>
              <Badge variant="secondary" className="bg-electric-yellow text-black">{items.length} منتج</Badge>
            </SheetTitle>
          </SheetHeader>
          
          {/* Empty Cart Message */}
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <ShoppingBag className="w-16 h-16 text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-300 mb-2">
                🛒 لا توجد منتجات حالياً
              </h3>
              <p className="text-gray-400 mb-6">
                أضف منتجات لبدء الشراء
              </p>
              <div className="bg-dark-card rounded-lg p-4 border border-dark-border mb-4">
                <p className="text-gray-300 text-sm text-center">
                  💡 اضغط على "أضف للسلة" لأي منتج لتبدأ تسوقك
                </p>
              </div>
              <Button onClick={onClose} className="bg-electric-yellow text-black hover:bg-yellow-300">
                متابعة التسوق
              </Button>
            </div>
          ) : (
            <>
              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto py-4">
                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={item.product.id} className="bg-dark-card rounded-lg p-4 border border-dark-border" style={{ background: 'var(--dark-card)' }}>
                      <div className="flex gap-3">
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm line-clamp-2 text-right text-white">
                            {item.product.name}
                          </h4>
                          <p className="text-electric-yellow font-bold text-lg mt-1">
                            {formatPrice(item.product.price)}
                          </p>
                          
                          {/* Quantity Controls */}
                          <div className="flex items-center justify-between mt-3">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-red-500 hover:text-red-700"
                              onClick={() => onRemoveItem(item.product.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                            
                            <div className="flex items-center gap-2 bg-gray-700 rounded-lg p-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                                onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                              >
                                <Minus className="w-3 h-3" />
                              </Button>
                              <span className="min-w-[2rem] text-center font-medium">
                                {item.quantity}
                              </span>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                                onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                              >
                                <Plus className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Cart Footer */}
              <div className="border-t border-dark-border pt-4 space-y-4">
                <div className="bg-dark-card rounded-lg p-3 border border-dark-border">
                  <div className="flex justify-between items-center text-lg font-bold">
                    <span className="text-electric-yellow text-xl">{formatPrice(totalPrice)}</span>
                    <span className="text-white">المجموع:</span>
                  </div>
                </div>
                
                <p className="text-sm text-gray-400 text-center">
                  * السعر يشمل التوصيل داخل طرابلس
                </p>
                
                <Button
                  onClick={() => setShowCheckoutDialog(true)}
                  className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  <ShoppingCart className="w-5 h-5 ml-2" />
                  متابعة عملية الشراء
                </Button>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* Checkout Dialog - Separate Modal */}
      <Dialog open={showCheckoutDialog} onOpenChange={setShowCheckoutDialog}>
        <DialogContent className="sm:max-w-[500px] max-h-[90vh] bg-dark-bg text-white border-dark-border overflow-hidden flex flex-col" style={{ background: 'var(--dark-bg)' }}>
          <DialogHeader className="flex-shrink-0">
            <DialogTitle className="text-right text-xl font-bold text-white flex items-center justify-center gap-2">
              📝 إتمام الطلب
            </DialogTitle>
          </DialogHeader>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto pr-2 -mr-2">
            <div className="space-y-6">
              {/* Order Summary Card */}
              <div className="bg-gradient-to-r from-gray-800 to-gray-700 rounded-lg p-4 border border-dark-border">
                <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                  <ShoppingCart className="w-4 h-4" />
                  ملخص الطلب
                </h4>
                <div className="space-y-2">
                  {items.map((item) => (
                    <div key={item.product.id} className="flex justify-between items-center text-sm">
                      <span className="text-electric-yellow font-medium">
                        {formatPrice(item.product.price * item.quantity)}
                      </span>
                      <span className="text-gray-200">
                        {item.product.name} × {item.quantity}
                      </span>
                    </div>
                  ))}
                  <div className="border-t border-gray-600 pt-2 mt-2">
                    <div className="flex justify-between items-center font-bold">
                      <span className="text-electric-yellow text-lg">
                        {formatPrice(totalPrice)}
                      </span>
                      <span className="text-white">المجموع الكلي:</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Customer Information Form */}
              <div className="bg-dark-card rounded-lg p-5 border border-dark-border">
                <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  بيانات العميل
                </h4>
                
                <div className="space-y-4">
                  {/* Name Field */}
                  <div>
                    <Label htmlFor="name" className="text-white text-sm font-medium mb-2 block">
                      الاسم الكامل *
                    </Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="أدخل اسمك الكامل"
                      value={customerData.name}
                      onChange={(e) => handleCustomerDataChange('name', e.target.value)}
                      className="text-right bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-electric-yellow focus:ring-electric-yellow transition-colors"
                    />
                  </div>

                  {/* Phone Field */}
                  <div>
                    <Label htmlFor="phone" className="text-white text-sm font-medium mb-2 block">
                      رقم الهاتف *
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="مثال: 0911234567"
                      value={customerData.phone}
                      onChange={(e) => handleCustomerDataChange('phone', e.target.value)}
                      className="text-right bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-electric-yellow focus:ring-electric-yellow transition-colors"
                    />
                    <p className="text-xs text-gray-400 mt-1">
                      سنتواصل معك عبر هذا الرقم لتأكيد الطلب
                    </p>
                  </div>

                  {/* City Field */}
                  <div>
                    <Label htmlFor="city" className="text-white text-sm font-medium mb-2 block">
                      المدينة *
                    </Label>
                    <Select value={customerData.city} onValueChange={(value) => handleCustomerDataChange('city', value)}>
                      <SelectTrigger className="text-right bg-gray-700 border-gray-600 text-white focus:border-electric-yellow">
                        <SelectValue placeholder="اختر مدينتك" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-600 max-h-48">
                        {libyanCities.map((city) => (
                          <SelectItem key={city} value={city} className="text-white hover:bg-gray-700 cursor-pointer">
                            {city}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Address Field */}
                  <div>
                    <Label htmlFor="address" className="text-white text-sm font-medium mb-2 block">
                      العنوان التفصيلي
                    </Label>
                    <Input
                      id="address"
                      type="text"
                      placeholder="المنطقة، اسم الشارع، رقم المنزل (اختياري)"
                      value={customerData.address}
                      onChange={(e) => handleCustomerDataChange('address', e.target.value)}
                      className="text-right bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-electric-yellow focus:ring-electric-yellow transition-colors"
                    />
                    <p className="text-xs text-gray-400 mt-1">
                      عنوان تفصيلي يساعد مندوب التوصيل
                    </p>
                  </div>
                </div>
              </div>

              {/* Delivery Information */}
              <div className="bg-blue-900/30 rounded-lg p-4 border border-blue-700/50">
                <h4 className="text-blue-200 font-semibold mb-2 flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  معلومات التوصيل
                </h4>
                <ul className="text-sm text-blue-100 space-y-1">
                  <li>• التوصيل مجاني داخل طرابلس</li>
                  <li>• رسوم توصيل للمدن الأخرى حسب المسافة</li>
                  <li>• مدة التوصيل: 1-3 أيام عمل</li>
                  <li>• الدفع عند الاستلام متاح</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Fixed Bottom Action Button */}
          <div className="flex-shrink-0 border-t border-dark-border pt-4 mt-4">
            <Button
              onClick={handleCompleteOrder}
              disabled={!customerData.name || !customerData.phone || !customerData.city}
              className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-bold py-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:scale-100"
            >
              <MessageCircle className="w-5 h-5 ml-3" />
              تأكيد الطلب
            </Button>
            <p className="text-xs text-gray-400 text-center mt-2">
              بالضغط على تأكيد الطلب، سيتم إرسال طلبكم وسنتواصل معكم قريباً
            </p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Success Dialog */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="sm:max-w-[400px] bg-dark-bg text-white border-dark-border" style={{ background: 'var(--dark-bg)' }}>
          <DialogHeader>
            <DialogTitle className="text-center text-xl font-bold text-white flex items-center justify-center gap-2">
              🎉 تم تأكيد طلبكم بنجاح!
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              
              <h3 className="text-lg font-semibold text-green-400 mb-2">
                شكراً لك {customerData.name}!
              </h3>
              
              <p className="text-gray-300 mb-4">
                تم استلام طلبكم وإرساله إلى فريق المبيعات
              </p>
            </div>
            
            <div className="bg-dark-card rounded-lg p-4 border border-dark-border space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <Phone className="w-4 h-4 text-green-400" />
                <span>سنتواصل معكم خلال 10-30 دقيقة</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <MessageCircle className="w-4 h-4 text-green-400" />
                <span>سيتم التأكيد عبر الواتساب: {customerData.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <MapPin className="w-4 h-4 text-green-400" />
                <span>التوصيل إلى: {customerData.city}</span>
              </div>
            </div>
            
            <div className="bg-blue-900/30 rounded-lg p-3 border border-blue-700/50">
              <p className="text-sm text-blue-200 text-center">
                💡 احتفظ بهاتفك قريباً منك لاستلام مكالمة التأكيد
              </p>
            </div>
            
            <Button
              onClick={() => {
                setShowSuccessDialog(false);
                onClose();
              }}
              className="w-full bg-electric-yellow text-black hover:bg-yellow-300 font-bold py-3"
            >
              متابعة التسوق
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
