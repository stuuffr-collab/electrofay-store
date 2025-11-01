import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Lock } from 'lucide-react';

export default function AdminLogin() {
  const [, setLocation] = useLocation();

  useEffect(() => {
    setLocation('/admin/dashboard');
  }, [setLocation]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="space-y-4 text-center">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Electrofy Admin
          </CardTitle>
        </CardHeader>
        
        <CardContent className="text-center py-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-lg text-gray-600 dark:text-gray-300">مرحباً بك في لوحة تحكم Electrofy Admin</p>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">جاري التحويل إلى لوحة التحكم...</p>
        </CardContent>
      </Card>
    </div>
  );
}
