import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { apiRequest } from '@/lib/queryClient';

interface AdminUser {
  id: number;
  username: string;
  email: string;
  role: string;
}

export function useAuth() {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [, setLocation] = useLocation();

  // Check if user is authenticated on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/me', {
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        setUser(data);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (username: string, password: string) => {
    try {
      const response = await apiRequest('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ username, password })
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data);
        return { success: true };
      } else {
        const error = await response.json();
        return { success: false, error: error.error || 'فشل تسجيل الدخول' };
      }
    } catch (error) {
      return { success: false, error: 'حدث خطأ في الاتصال' };
    }
  };

  const logout = async () => {
    try {
      await apiRequest('/api/auth/logout', {
        method: 'POST'
      });
      setUser(null);
      setLocation('/admin/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const requireAuth = () => {
    if (!loading && !user) {
      setLocation('/admin/login');
      return false;
    }
    return true;
  };

  return {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    logout,
    requireAuth,
    checkAuth
  };
}
