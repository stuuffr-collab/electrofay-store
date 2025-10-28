import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, ShoppingCart } from 'lucide-react';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

const statusLabels: Record<string, string> = {
  pending: 'قيد الانتظار',
  confirmed: 'مؤكد',
  delivered: 'تم التوصيل',
  cancelled: 'ملغي'
};

const statusBadgeClasses: Record<string, string> = {
  pending: 'admin-badge admin-badge-warning',
  confirmed: 'admin-badge admin-badge-info',
  delivered: 'admin-badge admin-badge-success',
  cancelled: 'admin-badge admin-badge-error'
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
      <div className="space-y-8 admin-animate-fade">
        {/* Page Header */}
        <div className="admin-spacing-md admin-header-gradient">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <ShoppingCart className="w-8 h-8" />
            إدارة الطلبات
          </h1>
          <p className="text-white/90 mt-2 font-medium">
            عرض وإدارة جميع الطلبات
          </p>
        </div>

        {/* Filter */}
        <div className="flex justify-end admin-animate-slide">
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

        {/* Orders Table */}
        {isLoading ? (
          <div className="text-center py-12 admin-card admin-spacing-lg">
            <div 
              className="w-16 h-16 border-4 rounded-full animate-spin mx-auto mb-4" 
              style={{ borderColor: 'var(--admin-accent-cyan)', borderTopColor: 'transparent' }}
            ></div>
            <p className="admin-text-secondary">جاري التحميل...</p>
          </div>
        ) : (
          <div className="admin-card overflow-hidden admin-animate-slide" style={{ animationDelay: '0.1s' }}>
            <Table className="admin-table">
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right admin-text-secondary">رقم الطلب</TableHead>
                  <TableHead className="text-right admin-text-secondary">اسم العميل</TableHead>
                  <TableHead className="text-right admin-text-secondary">الهاتف</TableHead>
                  <TableHead className="text-right admin-text-secondary">المدينة</TableHead>
                  <TableHead className="text-right admin-text-secondary">المبلغ الإجمالي</TableHead>
                  <TableHead className="text-right admin-text-secondary">الحالة</TableHead>
                  <TableHead className="text-right admin-text-secondary">التاريخ</TableHead>
                  <TableHead className="text-right admin-text-secondary">إجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order: any) => (
                  <TableRow key={order.id} data-testid={`order-row-${order.id}`}>
                    <TableCell className="font-medium admin-text-primary">#{order.id}</TableCell>
                    <TableCell className="admin-text-primary">{order.customerName}</TableCell>
                    <TableCell className="admin-text-secondary">{order.customerPhone}</TableCell>
                    <TableCell className="admin-text-secondary">{order.customerCity}</TableCell>
                    <TableCell className="admin-text-primary font-semibold">{order.totalAmount.toFixed(2)} د.ل</TableCell>
                    <TableCell>
                      <span className={statusBadgeClasses[order.status]}>
                        {statusLabels[order.status]}
                      </span>
                    </TableCell>
                    <TableCell className="admin-text-secondary">
                      {new Date(order.createdAt).toLocaleDateString('ar-LY')}
                    </TableCell>
                    <TableCell>
                      <Button
                        data-testid={`button-view-${order.id}`}
                        size="sm"
                        variant="outline"
                        onClick={() => setSelectedOrder(order)}
                        className="admin-btn-secondary gap-1"
                      >
                        <Eye className="w-4 h-4" />
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
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto admin-card admin-scrollbar">
            <DialogHeader>
              <DialogTitle className="admin-text-primary text-2xl">
                تفاصيل الطلب #{selectedOrder?.id}
              </DialogTitle>
            </DialogHeader>
            
            {selectedOrder && (
              <div className="space-y-6">
                {/* Customer Info */}
                <div className="admin-card admin-spacing-md">
                  <h3 className="admin-text-primary text-lg font-bold mb-4">معلومات العميل</h3>
                  <div className="space-y-2">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm admin-text-muted">الاسم</p>
                        <p className="font-medium admin-text-primary">{selectedOrder.customerName}</p>
                      </div>
                      <div>
                        <p className="text-sm admin-text-muted">الهاتف</p>
                        <p className="font-medium admin-text-primary">{selectedOrder.customerPhone}</p>
                      </div>
                      <div>
                        <p className="text-sm admin-text-muted">المدينة</p>
                        <p className="font-medium admin-text-primary">{selectedOrder.customerCity}</p>
                      </div>
                      <div>
                        <p className="text-sm admin-text-muted">التاريخ</p>
                        <p className="font-medium admin-text-primary">
                          {new Date(selectedOrder.createdAt).toLocaleDateString('ar-LY')}
                        </p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm admin-text-muted">العنوان</p>
                      <p className="font-medium admin-text-primary">{selectedOrder.customerAddress}</p>
                    </div>
                    {selectedOrder.orderNotes && (
                      <div>
                        <p className="text-sm admin-text-muted">ملاحظات</p>
                        <p className="font-medium admin-text-primary">{selectedOrder.orderNotes}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Order Items */}
                <div className="admin-card admin-spacing-md">
                  <h3 className="admin-text-primary text-lg font-bold mb-4">المنتجات</h3>
                  <div className="space-y-3">
                    {selectedOrder.items.map((item: any, index: number) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 rounded-lg transition-all hover:bg-admin-card-hover-bg"
                        style={{ background: 'rgba(255, 255, 255, 0.03)' }}
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-12 h-12 object-cover rounded transition-transform hover:scale-110"
                          />
                          <div>
                            <p className="font-medium admin-text-primary">{item.name}</p>
                            <p className="text-sm admin-text-muted">
                              الكمية: {item.quantity}
                            </p>
                          </div>
                        </div>
                        <p className="font-medium admin-text-primary">
                          {(item.price * item.quantity).toFixed(2)} د.ل
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Summary */}
                <div className="admin-card admin-spacing-md">
                  <h3 className="admin-text-primary text-lg font-bold mb-4">ملخص الطلب</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="admin-text-secondary">رسوم التوصيل</span>
                      <span className="font-medium admin-text-primary">{selectedOrder.deliveryFee} د.ل</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold border-t pt-2" style={{ borderColor: 'var(--admin-border)' }}>
                      <span className="admin-text-primary">المبلغ الإجمالي</span>
                      <span style={{ color: 'var(--admin-accent-cyan)' }}>{selectedOrder.totalAmount.toFixed(2)} د.ل</span>
                    </div>
                  </div>
                </div>

                {/* Status Change */}
                <div className="admin-card admin-spacing-md">
                  <h3 className="admin-text-primary text-lg font-bold mb-4">تغيير حالة الطلب</h3>
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
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
