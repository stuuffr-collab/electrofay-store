import { useAuth } from '@/hooks/useAuth';
import { Sidebar } from './Sidebar';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const { logout, user } = useAuth();

  return (
    <div className="min-h-screen admin-bg">
      <Sidebar onLogout={logout} username={user?.username} />
      
      <main className="lg:mr-64 min-h-screen">
        <div className="admin-spacing-lg">
          {children}
        </div>
      </main>
    </div>
  );
}
