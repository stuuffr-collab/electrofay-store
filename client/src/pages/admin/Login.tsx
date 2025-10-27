import { useState } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LogIn, Lock, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, user } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  // Redirect if already logged in
  if (user) {
    setLocation('/admin/dashboard');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await login(username, password);
      
      if (result.success) {
        toast({
          title: 'تم تسجيل الدخول بنجاح',
          description: 'مرحباً بك في لوحة التحكم',
        });
        setLocation('/admin/dashboard');
      } else {
        toast({
          variant: 'destructive',
          title: 'فشل تسجيل الدخول',
          description: result.error || 'اسم المستخدم أو كلمة المرور غير صحيحة',
        });
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'خطأ',
        description: 'حدث خطأ أثناء تسجيل الدخول',
      });
    } finally {
      setLoading(false);
    }
  };

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
          <CardDescription className="text-base">
            تسجيل الدخول إلى لوحة التحكم
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-right block">
                اسم المستخدم
              </Label>
              <div className="relative">
                <User className="absolute right-3 top-3 w-5 h-5 text-gray-400" />
                <Input
                  id="username"
                  data-testid="input-username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="pr-10 text-right"
                  placeholder="أدخل اسم المستخدم"
                  required
                  disabled={loading}
                  dir="rtl"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-right block">
                كلمة المرور
              </Label>
              <div className="relative">
                <Lock className="absolute right-3 top-3 w-5 h-5 text-gray-400" />
                <Input
                  id="password"
                  data-testid="input-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pr-10 text-right"
                  placeholder="أدخل كلمة المرور"
                  required
                  disabled={loading}
                  dir="rtl"
                />
              </div>
            </div>

            <Button
              data-testid="button-login"
              type="submit"
              className="w-full h-12 text-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>جاري تسجيل الدخول...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <LogIn className="w-5 h-5" />
                  <span>تسجيل الدخول</span>
                </div>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
