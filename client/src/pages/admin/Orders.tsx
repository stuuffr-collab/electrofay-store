import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye } from 'lucide-react';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

const statusLabels: Record<string, string> = {
  pending: 'قيد الانتظار',
  confirmed: 'مؤكد',
  delivered: 'تم التوصيل',
  cancelled: 'ملغي'
};

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
  confirmed: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
  delivered: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
  cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
};

export default function AdminOrders() {
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const { toast } = useToast();

  const { data: orders, isLoading } = useQuery({
    queryKey: ['/api/admin/orders'],
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ orderId, status }: { orderId: number; status: string }) =>
      apiRequest(`/api/admin/orders/${orderId}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/orders'] });
      toast({ title: 'تم تحديث حالة الطلب بنجاح' });
      setSelectedOrder(null);
    },
    onError: () => {
      toast({ title: 'فشل في تحديث حالة الطلب', variant: 'destructive' });
    },
  });

  const handleStatusChange = (orderId: number, status: string) => {
    updateStatusMutation.mutate({ orderId, status });
  };

  const filteredOrders = orders?.filter((order: any) => 
    statusFilter === 'all' || order.status === statusFilter
  ) || [];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">إدارة الطلبات</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              عرض وإدارة جميع الطلبات
            </p>
          </div>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger data-testid="select-status-filter" className="w-48">
              <SelectValue placeholder="تصفية حسب الحالة" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">جميع الطلبات</SelectItem>
              <SelectItem value="pending">قيد الانتظار</SelectItem>
              <SelectItem value="confirmed">مؤكد</SelectItem>
              <SelectItem value="delivered">تم التوصيل</SelectItem>
              <SelectItem value="cancelled">ملغي</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {isLoading ? (
          <div className="text-center py-12">جاري التحميل...</div>
        ) : (
          <div className="bg-white dark:bg-gray-900 rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right">رقم الطلب</TableHead>
                  <TableHead className="text-right">اسم العميل</TableHead>
                  <TableHead className="text-right">الهاتف</TableHead>
                  <TableHead className="text-right">المدينة</TableHead>
                  <TableHead className="text-right">المبلغ الإجمالي</TableHead>
                  <TableHead className="text-right">الحالة</TableHead>
                  <TableHead className="text-right">التاريخ</TableHead>
                  <TableHead className="text-right">إجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order: any) => (
                  <TableRow key={order.id} data-testid={`order-row-${order.id}`}>
                    <TableCell className="font-medium">#{order.id}</TableCell>
                    <TableCell>{order.customerName}</TableCell>
                    <TableCell>{order.customerPhone}</TableCell>
                    <TableCell>{order.customerCity}</TableCell>
                    <TableCell>{order.totalAmount.toFixed(2)} د.ل</TableCell>
                    <TableCell>
                      <Badge className={statusColors[order.status]}>
                        {statusLabels[order.status]}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(order.createdAt).toLocaleDateString('ar-LY')}
                    </TableCell>
                    <TableCell>
                      <Button
                        data-testid={`button-view-${order.id}`}
                        size="sm"
                        variant="outline"
                        onClick={() => setSelectedOrder(order)}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        عرض
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Order Details Dialog */}
        <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>تفاصيل الطلب #{selectedOrder?.id}</DialogTitle>
            </DialogHeader>
            
            {selectedOrder && (
              <div className="space-y-6">
                {/* Customer Info */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">معلومات العميل</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">الاسم</p>
                        <p className="font-medium">{selectedOrder.customerName}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">الهاتف</p>
                        <p className="font-medium">{selectedOrder.customerPhone}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">المدينة</p>
                        <p className="font-medium">{selectedOrder.customerCity}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">التاريخ</p>
                        <p className="font-medium">
                          {new Date(selectedOrder.createdAt).toLocaleDateString('ar-LY')}
                        </p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">العنوان</p>
                      <p className="font-medium">{selectedOrder.customerAddress}</p>
                    </div>
                    {selectedOrder.orderNotes && (
                      <div>
                        <p className="text-sm text-gray-500">ملاحظات</p>
                        <p className="font-medium">{selectedOrder.orderNotes}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Order Items */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">المنتجات</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {selectedOrder.items.map((item: any, index: number) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-12 h-12 object-cover rounded"
                            />
                            <div>
                              <p className="font-medium">{item.name}</p>
                              <p className="text-sm text-gray-500">
                                الكمية: {item.quantity}
                              </p>
                            </div>
                          </div>
                          <p className="font-medium">
                            {(item.price * item.quantity).toFixed(2)} د.ل
                          </p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Order Summary */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">ملخص الطلب</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">رسوم التوصيل</span>
                      <span className="font-medium">{selectedOrder.deliveryFee} د.ل</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold border-t pt-2">
                      <span>المبلغ الإجمالي</span>
                      <span>{selectedOrder.totalAmount.toFixed(2)} د.ل</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Status Change */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">تغيير حالة الطلب</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-2">
                      <Select
                        value={selectedOrder.status}
                        onValueChange={(status) => handleStatusChange(selectedOrder.id, status)}
                        disabled={updateStatusMutation.isPending}
                      >
                        <SelectTrigger data-testid="select-order-status">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">قيد الانتظار</SelectItem>
                          <SelectItem value="confirmed">مؤكد</SelectItem>
                          <SelectItem value="delivered">تم التوصيل</SelectItem>
                          <SelectItem value="cancelled">ملغي</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
