import { useState } from 'react';
import { useLocation } from 'wouter';

interface AdminUser {
  id: number;
  username: string;
  email: string;
  role: string;
}

const defaultUser: AdminUser = {
  id: 1,
  username: 'Admin',
  email: 'admin@electrofy.com',
  role: 'admin'
};

export function useAuth() {
  const [user] = useState<AdminUser | null>(defaultUser);
  const [loading] = useState(false);
  const [, setLocation] = useLocation();

  const login = async (username: string, password: string) => {
    setLocation('/admin/dashboard');
    return { success: true };
  };

  const logout = async () => {
    setLocation('/admin/dashboard');
  };

  const requireAuth = () => {
    return true;
  };

  const checkAuth = async () => {
    return;
  };

  return {
    user,
    loading,
    isAuthenticated: true,
    login,
    logout,
    requireAuth,
    checkAuth
  };
}
