import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageCircle, Phone, MapPin, Calendar, Package, User } from 'lucide-react';

interface Order {
  id: number;
  customerName: string;
  customerPhone: string;
  customerCity: string;
  customerAddress: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
    total: number;
  }>;
  totalPrice: number;
  orderDate: string;
  timestamp: string;
  whatsappMessage: string;
}

export function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const savedOrders = JSON.parse(localStorage.getItem('businessOrders') || '[]');
    setOrders(savedOrders.reverse()); // Show newest first
  }, []);

  const formatPrice = (price: number) => `${price} د.ل`;

  const copyToWhatsApp = (message: string, phone: string) => {
    // Copy message to clipboard
    navigator.clipboard.writeText(message);
    
    // Open WhatsApp with the business number
    window.open(`https://wa.me/218922569912`, '_blank');
  };

  const clearAllOrders = () => {
    if (confirm('هل أنت متأكد من حذف جميع الطلبات؟')) {
      localStorage.removeItem('businessOrders');
      setOrders([]);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-electric-yellow">
            📋 إدارة الطلبات - إلكتروفاي
          </h1>
          <div className="flex gap-4">
            <Badge variant="secondary" className="bg-electric-yellow text-black px-4 py-2">
              {orders.length} طلب جديد
            </Badge>
            <Button 
              onClick={clearAllOrders}
              variant="destructive"
              size="sm"
            >
              مسح جميع الطلبات
            </Button>
          </div>
        </div>

        {orders.length === 0 ? (
          <Card className="bg-dark-card border-dark-border">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Package className="w-16 h-16 text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-300 mb-2">
                لا توجد طلبات جديدة
              </h3>
              <p className="text-gray-400">
                ستظهر الطلبات الجديدة هنا عند قيام العملاء بالطلب
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <Card key={order.id} className="bg-dark-card border-dark-border">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-white flex items-center gap-2">
                        <User className="w-5 h-5" />
                        {order.customerName}
                      </CardTitle>
                      <p className="text-gray-400 text-sm">
                        طلب رقم #{order.id}
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge className="bg-green-600 text-white mb-2">
                        جديد
                      </Badge>
                      <p className="text-sm text-gray-400 flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(order.timestamp).toLocaleString('ar-EG')}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* Customer Info */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-gray-800 rounded-lg p-4">
                      <h4 className="font-semibold text-white mb-3">بيانات العميل</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-electric-yellow" />
                          <span>{order.customerPhone}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-electric-yellow" />
                          <span>{order.customerCity}</span>
                        </div>
                        {order.customerAddress && (
                          <div className="text-gray-300">
                            العنوان: {order.customerAddress}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Order Items */}
                    <div className="bg-gray-800 rounded-lg p-4">
                      <h4 className="font-semibold text-white mb-3">المنتجات</h4>
                      <div className="space-y-2">
                        {order.items.map((item, index) => (
                          <div key={index} className="flex justify-between items-center text-sm">
                            <span className="text-gray-300">
                              {item.name} × {item.quantity}
                            </span>
                            <span className="text-electric-yellow font-medium">
                              {formatPrice(item.total)}
                            </span>
                          </div>
                        ))}
                        <div className="border-t border-gray-600 pt-2 mt-2">
                          <div className="flex justify-between items-center font-bold">
                            <span className="text-white">المجموع الكلي:</span>
                            <span className="text-electric-yellow text-lg">
                              {formatPrice(order.totalPrice)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 pt-4 border-t border-gray-700">
                    <Button
                      onClick={() => copyToWhatsApp(order.whatsappMessage, order.customerPhone)}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                    >
                      <MessageCircle className="w-4 h-4 ml-2" />
                      نسخ الرسالة وفتح واتساب
                    </Button>
                    <Button
                      onClick={() => window.open(`tel:${order.customerPhone}`)}
                      variant="outline"
                      className="border-electric-yellow text-electric-yellow hover:bg-electric-yellow hover:text-black"
                    >
                      <Phone className="w-4 h-4 ml-2" />
                      اتصال
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}