import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { DollarSign, Save } from 'lucide-react';
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
      <div className="space-y-6 max-w-4xl">
        <div>
          <h1 className="text-3xl font-bold">الإعدادات</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            إدارة إعدادات المتجر العامة
          </p>
        </div>

        {/* Exchange Rate Setting */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <CardTitle>سعر الصرف</CardTitle>
                <CardDescription>
                  سعر الصرف من الدولار الأمريكي إلى الدينار الليبي (USD → LYD)
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="exchange-rate">سعر الصرف (1 USD = ? LYD)</Label>
              <div className="flex gap-3">
                <Input
                  id="exchange-rate"
                  data-testid="input-exchange-rate"
                  type="number"
                  step="0.01"
                  value={exchangeRate}
                  onChange={(e) => setExchangeRate(e.target.value)}
                  placeholder="5.10"
                  className="max-w-xs"
                />
                <Button
                  data-testid="button-save-exchange-rate"
                  onClick={handleSaveExchangeRate}
                  disabled={updateSettingsMutation.isPending}
                  className="gap-2"
                >
                  <Save className="w-4 h-4" />
                  {updateSettingsMutation.isPending ? 'جاري الحفظ...' : 'حفظ'}
                </Button>
              </div>
              <p className="text-sm text-gray-500">
                سيتم تحديث أسعار جميع المنتجات تلقائياً بناءً على سعر الصرف الجديد
              </p>
            </div>

            {/* Current Rate Display */}
            <div className="bg-blue-50 dark:bg-blue-900/10 p-4 rounded-lg">
              <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                سعر الصرف الحالي
              </p>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-1">
                1 USD = {exchangeRate} LYD
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Store Information */}
        <Card>
          <CardHeader>
            <CardTitle>معلومات المتجر</CardTitle>
            <CardDescription>
              معلومات أساسية عن المتجر
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>اسم المتجر</Label>
                <Input 
                  data-testid="input-store-name"
                  value="Electrofy Store" 
                  readOnly 
                  className="bg-gray-50 dark:bg-gray-800"
                />
              </div>
              
              <div className="space-y-2">
                <Label>البريد الإلكتروني</Label>
                <Input 
                  data-testid="input-store-email"
                  value="info@electrofy.ly" 
                  readOnly 
                  className="bg-gray-50 dark:bg-gray-800"
                />
              </div>
              
              <div className="space-y-2">
                <Label>رقم الهاتف</Label>
                <Input 
                  data-testid="input-store-phone"
                  value="+218 91 234 5678" 
                  readOnly 
                  className="bg-gray-50 dark:bg-gray-800"
                />
              </div>
              
              <div className="space-y-2">
                <Label>المدينة</Label>
                <Input 
                  data-testid="input-store-city"
                  value="طرابلس، ليبيا" 
                  readOnly 
                  className="bg-gray-50 dark:bg-gray-800"
                />
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                💡 لتعديل معلومات المتجر، يرجى التواصل مع المطور أو تحديث قاعدة البيانات مباشرة.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
