import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { DollarSign, Save, Settings as SettingsIcon, Store } from 'lucide-react';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

export default function AdminSettings() {
  const [exchangeRate, setExchangeRate] = useState('5.10');
  const { toast } = useToast();

  const { data: settings } = useQuery({
    queryKey: ['/api/admin/settings'],
  });

  useEffect(() => {
    if (settings) {
      const rateSetting = settings.find((s: any) => s.key === 'usd_to_lyd_rate');
      if (rateSetting) {
        setExchangeRate(String(rateSetting.value.rate || 5.10));
      }
    }
  }, [settings]);

  const updateSettingsMutation = useMutation({
    mutationFn: (data: { key: string; value: any }) =>
      apiRequest('/api/admin/settings', {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/settings'] });
      queryClient.invalidateQueries({ queryKey: ['/api/products'] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/products'] });
      toast({ title: 'تم حفظ الإعدادات بنجاح' });
    },
    onError: () => {
      toast({ title: 'فشل في حفظ الإعدادات', variant: 'destructive' });
    },
  });

  const handleSaveExchangeRate = () => {
    const rate = parseFloat(exchangeRate);
    if (isNaN(rate) || rate <= 0) {
      toast({ 
        title: 'خطأ', 
        description: 'يرجى إدخال سعر صرف صحيح',
        variant: 'destructive' 
      });
      return;
    }

    updateSettingsMutation.mutate({
      key: 'usd_to_lyd_rate',
      value: { rate }
    });
  };

  return (
    <AdminLayout>
      <div className="space-y-8 max-w-4xl admin-animate-fade">
        {/* Page Header */}
        <div className="admin-spacing-md admin-header-gradient">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <SettingsIcon className="w-8 h-8" />
            الإعدادات
          </h1>
          <p className="text-white/90 mt-2 font-medium">
            إدارة إعدادات المتجر العامة
          </p>
        </div>

        {/* Exchange Rate Setting */}
        <div className="admin-card admin-spacing-md admin-animate-slide">
          <div className="flex items-center gap-3 mb-6">
            <div 
              className="admin-stat-icon"
              style={{ background: 'rgba(16, 185, 129, 0.15)', color: 'rgb(16, 185, 129)' }}
            >
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold admin-text-primary">سعر الصرف</h2>
              <p className="admin-text-secondary text-sm">
                سعر الصرف من الدولار الأمريكي إلى الدينار الليبي (USD → LYD)
              </p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="exchange-rate" className="admin-text-secondary">سعر الصرف (1 USD = ? LYD)</Label>
              <div className="flex gap-3">
                <Input
                  id="exchange-rate"
                  data-testid="input-exchange-rate"
                  type="number"
                  step="0.01"
                  value={exchangeRate}
                  onChange={(e) => setExchangeRate(e.target.value)}
                  placeholder="5.10"
                  className="max-w-xs admin-input"
                />
                <Button
                  data-testid="button-save-exchange-rate"
                  onClick={handleSaveExchangeRate}
                  disabled={updateSettingsMutation.isPending}
                  className="gap-2 admin-btn-primary"
                >
                  <Save className="w-4 h-4" />
                  {updateSettingsMutation.isPending ? 'جاري الحفظ...' : 'حفظ'}
                </Button>
              </div>
              <p className="text-sm admin-text-muted">
                سيتم تحديث أسعار جميع المنتجات تلقائياً بناءً على سعر الصرف الجديد
              </p>
            </div>

            {/* Current Rate Display */}
            <div 
              className="p-4 rounded-lg admin-card"
              style={{ background: 'rgba(16, 185, 129, 0.1)' }}
            >
              <p className="text-sm font-medium admin-text-secondary">
                سعر الصرف الحالي
              </p>
              <p className="text-2xl font-bold mt-1" style={{ color: 'rgb(16, 185, 129)' }}>
                1 USD = {exchangeRate} LYD
              </p>
            </div>
          </div>
        </div>

        {/* Store Information */}
        <div className="admin-card admin-spacing-md admin-animate-slide" style={{ animationDelay: '0.1s' }}>
          <div className="flex items-center gap-3 mb-6">
            <div 
              className="admin-stat-icon"
              style={{ background: 'rgba(0, 188, 212, 0.15)', color: 'var(--admin-accent-cyan)' }}
            >
              <Store className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold admin-text-primary">معلومات المتجر</h2>
              <p className="admin-text-secondary text-sm">
                معلومات أساسية عن المتجر
              </p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="admin-text-secondary">اسم المتجر</Label>
                <Input 
                  data-testid="input-store-name"
                  value="Electrofy Store" 
                  readOnly 
                  className="admin-input opacity-60"
                />
              </div>
              
              <div className="space-y-2">
                <Label className="admin-text-secondary">البريد الإلكتروني</Label>
                <Input 
                  data-testid="input-store-email"
                  value="info@electrofy.ly" 
                  readOnly 
                  className="admin-input opacity-60"
                />
              </div>
              
              <div className="space-y-2">
                <Label className="admin-text-secondary">رقم الهاتف</Label>
                <Input 
                  data-testid="input-store-phone"
                  value="+218 91 234 5678" 
                  readOnly 
                  className="admin-input opacity-60"
                />
              </div>
              
              <div className="space-y-2">
                <Label className="admin-text-secondary">المدينة</Label>
                <Input 
                  data-testid="input-store-city"
                  value="طرابلس، ليبيا" 
                  readOnly 
                  className="admin-input opacity-60"
                />
              </div>
            </div>

            <div 
              className="p-4 rounded-lg admin-card"
              style={{ background: 'rgba(0, 188, 212, 0.05)' }}
            >
              <p className="text-sm admin-text-secondary">
                💡 لتعديل معلومات المتجر، يرجى التواصل مع المطور أو تحديث قاعدة البيانات مباشرة.
              </p>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
