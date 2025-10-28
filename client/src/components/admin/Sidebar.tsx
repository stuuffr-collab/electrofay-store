import { Link, useLocation } from 'wouter';
import { 
  LayoutDashboard, 
  Package, 
  FolderTree, 
  ShoppingCart, 
  Settings,
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface SidebarProps {
  onLogout: () => void;
  username?: string;
}

const menuItems = [
  { icon: LayoutDashboard, label: 'لوحة التحكم', path: '/admin/dashboard', testId: 'nav-dashboard' },
  { icon: Package, label: 'المنتجات', path: '/admin/products', testId: 'nav-products' },
  { icon: FolderTree, label: 'الأقسام', path: '/admin/categories', testId: 'nav-categories' },
  { icon: ShoppingCart, label: 'الطلبات', path: '/admin/orders', testId: 'nav-orders' },
  { icon: Settings, label: 'الإعدادات', path: '/admin/settings', testId: 'nav-settings' },
];

export function Sidebar({ onLogout, username }: SidebarProps) {
  const [location] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const SidebarContent = () => (
    <div className="flex flex-col h-full admin-sidebar-bg border-r" style={{ borderColor: 'var(--admin-border)' }}>
      {/* Header */}
      <div className="admin-spacing-md border-b admin-animate-fade" style={{ borderColor: 'var(--admin-border)' }}>
        <div className="admin-header-gradient text-center">
          <h1 className="text-2xl font-bold">
            Electrofy Admin
          </h1>
        </div>
        <p className="text-sm admin-text-secondary mt-3 text-center font-medium">
          مرحباً، {username || 'Admin'}
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 admin-spacing-md space-y-3 admin-animate-slide">
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = location === item.path;
          
          return (
            <div key={item.path}>
              <Link 
                href={item.path}
                onClick={() => setMobileOpen(false)}
              >
                <div
                  data-testid={item.testId}
                  className={cn(
                    "flex items-center gap-4 px-5 py-4 rounded-xl transition-all duration-300 relative cursor-pointer",
                    isActive
                      ? "admin-text-primary font-semibold"
                      : "admin-text-secondary font-medium hover:admin-text-primary"
                  )}
                  style={{
                    background: isActive ? 'rgba(0, 188, 212, 0.15)' : 'transparent',
                    borderRight: isActive ? '3px solid var(--admin-accent-cyan)' : 'none',
                    transform: isActive ? 'translateX(-4px)' : 'none',
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                      e.currentTarget.style.transform = 'translateX(-4px)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.transform = 'none';
                    }
                  }}
                >
                  <Icon 
                    className="w-6 h-6" 
                    style={{ color: isActive ? 'var(--admin-accent-cyan)' : 'var(--admin-text-secondary)' }}
                  />
                  <span className="text-[15px]">{item.label}</span>
                  {isActive && (
                    <div 
                      className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-3/4 rounded-r-md"
                      style={{ background: 'var(--admin-gradient-header)' }}
                    />
                  )}
                </div>
              </Link>
            </div>
          );
        })}
      </nav>

      {/* Logout Button */}
      <div className="admin-spacing-md border-t" style={{ borderColor: 'var(--admin-border)' }}>
        <Button
          data-testid="button-logout"
          onClick={onLogout}
          variant="ghost"
          className="w-full justify-start gap-4 px-5 py-4 rounded-xl text-red-400 hover:text-red-300 font-medium transition-all duration-300"
          style={{
            background: 'transparent',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(239, 68, 68, 0.15)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
          }}
        >
          <LogOut className="w-6 h-6" />
          <span className="text-[15px]">تسجيل الخروج</span>
        </Button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          data-testid="button-mobile-menu"
          onClick={() => setMobileOpen(!mobileOpen)}
          variant="outline"
          size="icon"
          className="bg-white dark:bg-gray-900"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </Button>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 h-screen fixed right-0 top-0">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      {mobileOpen && (
        <>
          <div
            className="lg:hidden fixed inset-0 bg-black/50 z-40"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="lg:hidden fixed right-0 top-0 h-screen w-64 z-50">
            <SidebarContent />
          </aside>
        </>
      )}
    </>
  );
}
