import { useState } from "react";
import { Minus, Plus, Trash2, X, ShoppingBag, MessageCircle, User, Phone, MapPin, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { CartItem } from "@/context/CartContext";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
  const [showCheckoutForm, setShowCheckoutForm] = useState(false);
  const [customerData, setCustomerData] = useState({
    name: '',
    phone: '',
    city: '',
    address: ''
  });

  const formatPrice = (price: number) => `${price} د.ل`;

  const libyanCities = [
    'طرابلس', 'بنغازي', 'مصراتة', 'الزاوية', 'سبها', 'أجدابيا', 'البيضاء', 'زليتن', 
    'غريان', 'صبراتة', 'الخمس', 'توكرة', 'درنة', 'الكفرة', 'أوباري', 'مرزق'
  ];

  const handleCustomerDataChange = (field: string, value: string) => {
    setCustomerData(prev => ({ ...prev, [field]: value }));
  };

  const handleCompleteOrder = () => {
    // Validate form
    if (!customerData.name || !customerData.phone || !customerData.city) {
      toast.error('يرجى ملء جميع البيانات المطلوبة');
      return;
    }

    // Create WhatsApp message with cart details
    const cartDetails = items.map(item => 
      `${item.product.name} × ${item.quantity} = ${item.product.price * item.quantity} د.ل`
    ).join('\n');
    
    const orderMessage = `
🛒 *طلب جديد من إلكتروفاي*

👤 *بيانات العميل:*
• الاسم: ${customerData.name}
• الهاتف: ${customerData.phone}
• المدينة: ${customerData.city}
• العنوان: ${customerData.address}

📦 *تفاصيل الطلب:*
${cartDetails}

💰 *المجموع الكلي: ${totalPrice} د.ل*

شكراً لاختياركم إلكتروفاي! 🎮⚡
    `.trim();

    window.open(`https://wa.me/218922569912?text=${encodeURIComponent(orderMessage)}`, '_blank');
    
    // Clear cart and close
    onCheckout();
    setShowCheckoutForm(false);
    setCustomerData({ name: '', phone: '', city: '', address: '' });
    toast.success('🎉 شكراً! تم إرسال طلبكم بنجاح');
  };

  if (items.length === 0) {
    return (
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent side="right" className="w-full sm:w-96 bg-dark-bg border-l border-dark-border" style={{ background: 'var(--dark-bg)' }}>
          <SheetHeader>
            <SheetTitle className="text-right text-white">🛒 سلة التسوق</SheetTitle>
          </SheetHeader>
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
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-full sm:w-96 flex flex-col bg-dark-bg border-l border-dark-border" style={{ background: 'var(--dark-bg)' }}>
        <SheetHeader>
          <SheetTitle className="text-right flex items-center justify-between text-white">
            <span>🛒 سلة التسوق</span>
            <Badge variant="secondary" className="bg-electric-yellow text-black">{items.length} منتج</Badge>
          </SheetTitle>
        </SheetHeader>
        
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
          
          {!showCheckoutForm ? (
            <Button
              onClick={() => setShowCheckoutForm(true)}
              className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <ShoppingCart className="w-5 h-5 ml-2" />
              متابعة عملية الشراء
            </Button>
          ) : (
            <div className="space-y-4">
              {/* Customer Form */}
              <div className="bg-dark-card rounded-lg p-4 border border-dark-border">
                <h3 className="text-lg font-bold text-white mb-4 text-center">
                  📝 بيانات العميل
                </h3>
                
                <div className="space-y-3">
                  {/* Name Field */}
                  <div>
                    <Label htmlFor="name" className="text-white flex items-center gap-2">
                      <User className="w-4 h-4" />
                      الاسم الكامل *
                    </Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="أدخل اسمك الكامل"
                      value={customerData.name}
                      onChange={(e) => handleCustomerDataChange('name', e.target.value)}
                      className="mt-1 text-right bg-gray-700 border-gray-600 text-white"
                    />
                  </div>

                  {/* Phone Field */}
                  <div>
                    <Label htmlFor="phone" className="text-white flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      رقم الهاتف *
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="مثال: 0911234567"
                      value={customerData.phone}
                      onChange={(e) => handleCustomerDataChange('phone', e.target.value)}
                      className="mt-1 text-right bg-gray-700 border-gray-600 text-white"
                    />
                  </div>

                  {/* City Field */}
                  <div>
                    <Label htmlFor="city" className="text-white flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      المدينة *
                    </Label>
                    <Select value={customerData.city} onValueChange={(value) => handleCustomerDataChange('city', value)}>
                      <SelectTrigger className="mt-1 text-right bg-gray-700 border-gray-600 text-white">
                        <SelectValue placeholder="اختر مدينتك" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-700 border-gray-600">
                        {libyanCities.map((city) => (
                          <SelectItem key={city} value={city} className="text-white hover:bg-gray-600">
                            {city}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Address Field */}
                  <div>
                    <Label htmlFor="address" className="text-white flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      العنوان التفصيلي
                    </Label>
                    <Input
                      id="address"
                      type="text"
                      placeholder="المنطقة، اسم الشارع، رقم المنزل (اختياري)"
                      value={customerData.address}
                      onChange={(e) => handleCustomerDataChange('address', e.target.value)}
                      className="mt-1 text-right bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <Button
                  onClick={() => setShowCheckoutForm(false)}
                  variant="outline"
                  className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700"
                >
                  رجوع
                </Button>
                <Button
                  onClick={handleCompleteOrder}
                  className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold"
                >
                  <MessageCircle className="w-4 h-4 ml-2" />
                  إرسال الطلب
                </Button>
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}