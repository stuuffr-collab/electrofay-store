import { useQuery } from '@tanstack/react-query';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, ShoppingCart, DollarSign, AlertTriangle, TrendingUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#00bcd4', '#10b981', '#f5c518', '#ef4444'];

const statusLabels: Record<string, string> = {
  pending: 'قيد الانتظار',
  confirmed: 'مؤكد',
  delivered: 'تم التوصيل',
  cancelled: 'ملغي'
};

export default function AdminDashboard() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['/api/admin/stats'],
  });

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center admin-animate-fade">
            <div 
              className="w-16 h-16 border-4 rounded-full animate-spin mx-auto mb-4" 
              style={{ borderColor: 'var(--admin-accent-cyan)', borderTopColor: 'transparent' }}
            ></div>
            <p className="admin-text-secondary">جاري تحميل الإحصائيات...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  const ordersByStatus = stats?.ordersByStatus || [];
  const pieData = ordersByStatus.map((item: any) => ({
    name: statusLabels[item.status] || item.status,
    value: parseInt(item.count) || 0
  }));

  return (
    <AdminLayout>
      <div className="space-y-8 admin-animate-fade">
        {/* Page Header */}
        <div className="admin-spacing-md admin-header-gradient">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <TrendingUp className="w-8 h-8" />
            لوحة التحكم
          </h1>
          <p className="text-white/90 mt-2 font-medium">
            نظرة عامة على إحصائيات المتجر
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div 
            data-testid="card-total-products"
            className="admin-stat-card admin-animate-slide"
          >
            <div className="flex items-center justify-between mb-4">
              <div 
                className="admin-stat-icon"
                style={{ background: 'rgba(0, 188, 212, 0.15)' }}
              >
                <Package className="w-6 h-6" style={{ color: 'var(--admin-accent-cyan)' }} />
              </div>
            </div>
            <div className="admin-text-secondary text-sm font-semibold mb-2">
              إجمالي المنتجات
            </div>
            <div className="admin-text-primary text-4xl font-bold">
              {stats?.totalProducts || 0}
            </div>
          </div>

          <div 
            data-testid="card-total-orders"
            className="admin-stat-card admin-animate-slide"
            style={{ animationDelay: '0.1s' }}
          >
            <div className="flex items-center justify-between mb-4">
              <div 
                className="admin-stat-icon"
                style={{ background: 'rgba(16, 185, 129, 0.15)', color: 'rgb(16, 185, 129)' }}
              >
                <ShoppingCart className="w-6 h-6" />
              </div>
            </div>
            <div className="admin-text-secondary text-sm font-semibold mb-2">
              إجمالي الطلبات
            </div>
            <div className="admin-text-primary text-4xl font-bold">
              {stats?.totalOrders || 0}
            </div>
          </div>

          <div 
            data-testid="card-total-sales"
            className="admin-stat-card admin-animate-slide"
            style={{ animationDelay: '0.2s' }}
          >
            <div className="flex items-center justify-between mb-4">
              <div 
                className="admin-stat-icon"
                style={{ background: 'rgba(245, 197, 24, 0.15)', color: 'var(--admin-accent-yellow)' }}
              >
                <DollarSign className="w-6 h-6" />
              </div>
            </div>
            <div className="admin-text-secondary text-sm font-semibold mb-2">
              إجمالي المبيعات
            </div>
            <div className="admin-text-primary text-4xl font-bold">
              {typeof stats?.totalSales === 'number' ? stats.totalSales.toFixed(2) : '0.00'} <span className="text-2xl admin-text-secondary">د.ل</span>
            </div>
          </div>

          <div 
            data-testid="card-low-stock"
            className="admin-stat-card admin-animate-slide"
            style={{ animationDelay: '0.3s' }}
          >
            <div className="flex items-center justify-between mb-4">
              <div 
                className="admin-stat-icon"
                style={{ background: 'rgba(239, 68, 68, 0.15)', color: 'rgb(239, 68, 68)' }}
              >
                <AlertTriangle className="w-6 h-6" />
              </div>
            </div>
            <div className="admin-text-secondary text-sm font-semibold mb-2">
              منتجات منخفضة المخزون
            </div>
            <div className="admin-text-primary text-4xl font-bold">
              {stats?.lowStockProducts?.length || 0}
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Orders by Status Pie Chart */}
          <div className="admin-card admin-spacing-md">
            <h2 className="admin-text-primary text-xl font-bold mb-6 flex items-center gap-2">
              <div className="w-1 h-6 rounded-full" style={{ background: 'var(--admin-gradient-header)' }}></div>
              توزيع الطلبات حسب الحالة
            </h2>
            <div className="admin-scrollbar" style={{ maxHeight: '320px', overflowY: 'auto' }}>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry) => `${entry.name}: ${entry.value}`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: 'var(--admin-card-bg)',
                      border: '1px solid var(--admin-border)',
                      borderRadius: '8px',
                      color: 'var(--admin-text-primary)'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Low Stock Products */}
          <div className="admin-card admin-spacing-md">
            <h2 className="admin-text-primary text-xl font-bold mb-6 flex items-center gap-2">
              <div className="w-1 h-6 rounded-full" style={{ background: 'var(--admin-gradient-header)' }}></div>
              منتجات منخفضة المخزون
            </h2>
            <div className="space-y-4 admin-scrollbar" style={{ maxHeight: '320px', overflowY: 'auto' }}>
              {stats?.lowStockProducts?.slice(0, 5).map((product: any, index: number) => (
                <div
                  key={product.id}
                  data-testid={`low-stock-${product.id}`}
                  className="flex items-center justify-between p-4 rounded-xl transition-all duration-300"
                  style={{ 
                    background: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid rgba(239, 68, 68, 0.2)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(239, 68, 68, 0.15)';
                    e.currentTarget.style.transform = 'translateX(-4px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)';
                    e.currentTarget.style.transform = 'none';
                  }}
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-14 h-14 object-cover rounded-lg"
                      style={{ border: '2px solid var(--admin-border)' }}
                    />
                    <div>
                      <p className="admin-text-primary font-semibold text-sm">
                        {product.name}
                      </p>
                      <p className="admin-text-secondary text-xs mt-1">
                        الكمية: {product.stockCount}
                      </p>
                    </div>
                  </div>
                  <div className="admin-badge admin-badge-error">
                    منخفض
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="admin-card admin-spacing-md">
          <h2 className="admin-text-primary text-xl font-bold mb-6 flex items-center gap-2">
            <div className="w-1 h-6 rounded-full" style={{ background: 'var(--admin-gradient-header)' }}></div>
            آخر الطلبات
          </h2>
          <div className="admin-scrollbar" style={{ overflowX: 'auto' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>رقم الطلب</th>
                  <th>اسم العميل</th>
                  <th>المدينة</th>
                  <th>المبلغ</th>
                  <th>الحالة</th>
                  <th>التاريخ</th>
                </tr>
              </thead>
              <tbody>
                {stats?.recentOrders?.slice(0, 10).map((order: any) => (
                  <tr key={order.id} data-testid={`order-row-${order.id}`}>
                    <td className="font-semibold">#{order.id}</td>
                    <td className="font-medium">{order.customerName}</td>
                    <td>{order.customerCity}</td>
                    <td className="font-semibold">{order.totalAmount.toFixed(2)} د.ل</td>
                    <td>
                      <span className={`admin-badge ${
                        order.status === 'delivered' ? 'admin-badge-success' :
                        order.status === 'confirmed' ? 'admin-badge-info' :
                        order.status === 'pending' ? 'admin-badge-warning' :
                        'admin-badge-error'
                      }`}>
                        {statusLabels[order.status]}
                      </span>
                    </td>
                    <td className="admin-text-secondary">
                      {new Date(order.createdAt).toLocaleDateString('ar-LY')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
