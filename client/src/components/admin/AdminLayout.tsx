import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/hooks/useAuth';
import { Sidebar } from './Sidebar';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const { user, loading, logout, requireAuth } = useAuth();
  const [location, setLocation] = useLocation();

  useEffect(() => {
    if (!loading && !user && location !== '/admin/login') {
      setLocation('/admin/login');
    }
  }, [user, loading, location, setLocation]);

  // Show loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen admin-bg">
        <div className="text-center">
          <div className="w-16 h-16 border-4 rounded-full animate-spin mx-auto mb-4" style={{ borderColor: 'var(--admin-accent-cyan)', borderTopColor: 'transparent' }}></div>
          <p className="admin-text-secondary">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  // Don't show layout on login page
  if (location === '/admin/login') {
    return <>{children}</>;
  }

  // Redirect if not authenticated
  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen admin-bg">
      <Sidebar onLogout={logout} username={user.username} />
      
      <main className="lg:mr-64 min-h-screen">
        <div className="admin-spacing-lg">
          {children}
        </div>
      </main>
    </div>
  );
}
