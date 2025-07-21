import { useState } from "react";
import { X, Truck, ShieldCheck, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { createWhatsAppMessage, openWhatsApp, type OrderData } from "@/lib/whatsapp";
import { type Product } from "./ProductCard";
import citiesData from "@/data/cities.json";

interface OrderModalProps {
  isOpen: boolean;
  product: Product | null;
  onClose: () => void;
  onOrderSubmit: (orderData: OrderData) => void;
}

interface CustomerData {
  name: string;
  phone: string;
  city: string;
  address: string;
  notes: string;
}

export function OrderModal({ isOpen, product, onClose, onOrderSubmit }: OrderModalProps) {
  const [customerData, setCustomerData] = useState<CustomerData>({
    name: "",
    phone: "",
    city: "",
    address: "",
    notes: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: keyof CustomerData, value: string) => {
    setCustomerData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;

    setIsSubmitting(true);

    try {
      const orderData: OrderData = {
        product: {
          id: product.id,
          name: product.name,
          price: product.price,
        },
        customer: customerData,
      };

      const whatsappMessage = createWhatsAppMessage(orderData);
      openWhatsApp(whatsappMessage);

      onOrderSubmit(orderData);
      
      // Reset form and close modal
      setCustomerData({
        name: "",
        phone: "",
        city: "",
        address: "",
        notes: "",
      });
      onClose();
    } catch (error) {
      console.error("Error submitting order:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedCity = citiesData.find(city => city.id === customerData.city);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto" dir="rtl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">تأكيد الطلب</DialogTitle>
        </DialogHeader>

        {product && (
          <>
            {/* Product Info */}
            <div className="bg-gray-50 dark:bg-dark-bg rounded-lg p-4 mb-6">
              <h4 className="font-semibold text-lg mb-2">{product.name}</h4>
              <p className="text-electric-yellow font-bold text-xl">{product.price} د.ل</p>
            </div>

            {/* Customer Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="customerName" className="block text-sm font-medium mb-2">
                  الاسم الكامل *
                </Label>
                <Input
                  id="customerName"
                  type="text"
                  required
                  value={customerData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className="w-full"
                  placeholder="أدخل اسمك الكامل"
                />
              </div>

              <div>
                <Label htmlFor="customerPhone" className="block text-sm font-medium mb-2">
                  رقم الهاتف *
                </Label>
                <Input
                  id="customerPhone"
                  type="tel"
                  required
                  value={customerData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  className="w-full"
                  placeholder="09xxxxxxxx"
                />
              </div>

              <div>
                <Label htmlFor="customerCity" className="block text-sm font-medium mb-2">
                  المدينة *
                </Label>
                <Select
                  value={customerData.city}
                  onValueChange={(value) => handleInputChange("city", value)}
                  required
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="اختر المدينة" />
                  </SelectTrigger>
                  <SelectContent>
                    {citiesData.map((city) => (
                      <SelectItem key={city.id} value={city.id}>
                        {city.name}
                        {city.deliveryFee > 0 && (
                          <span className="text-gray-500 text-sm mr-2">
                            ({city.deliveryFee} د.ل توصيل)
                          </span>
                        )}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="customerAddress" className="block text-sm font-medium mb-2">
                  العنوان التفصيلي *
                </Label>
                <Textarea
                  id="customerAddress"
                  required
                  rows={3}
                  value={customerData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  className="w-full"
                  placeholder="العنوان الكامل مع معالم مميزة"
                />
              </div>

              <div>
                <Label htmlFor="orderNotes" className="block text-sm font-medium mb-2">
                  ملاحظات إضافية
                </Label>
                <Textarea
                  id="orderNotes"
                  rows={2}
                  value={customerData.notes}
                  onChange={(e) => handleInputChange("notes", e.target.value)}
                  className="w-full"
                  placeholder="أي ملاحظات أو طلبات خاصة"
                />
              </div>

              {/* Delivery Info */}
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <h5 className="font-semibold mb-2 flex items-center">
                  <Truck className="w-5 h-5 ml-2 text-blue-600" />
                  معلومات التوصيل
                </h5>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                  • التوصيل متاح لجميع مدن ليبيا
                </p>
                {selectedCity && selectedCity.deliveryFee > 0 && (
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                    • رسوم التوصيل لـ {selectedCity.name}: {selectedCity.deliveryFee} د.ل
                  </p>
                )}
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  • الدفع عند الاستلام فقط
                </p>
              </div>

              {/* Security Notice */}
              <div className="bg-gray-100 dark:bg-dark-bg p-4 rounded-lg text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  <ShieldCheck className="w-4 h-4 inline ml-1" />
                  طلبك محمي ومؤمن
                </p>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-electric-yellow hover:bg-yellow-300 text-black font-semibold py-3"
              >
                <MessageCircle className="w-5 h-5 ml-2" />
                {isSubmitting ? "جاري الإرسال..." : "إرسال الطلب عبر واتساب"}
              </Button>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
