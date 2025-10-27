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
    <div className="flex flex-col h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-800">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Electrofy Admin
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          مرحباً، {username || 'Admin'}
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location === item.path;
          
          return (
            <Link 
              key={item.path} 
              href={item.path}
              onClick={() => setMobileOpen(false)}
            >
              <a
                data-testid={item.testId}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg transition-all",
                  isActive
                    ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-medium"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                )}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </a>
            </Link>
          );
        })}
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-800">
        <Button
          data-testid="button-logout"
          onClick={onLogout}
          variant="ghost"
          className="w-full justify-start gap-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
        >
          <LogOut className="w-5 h-5" />
          <span>تسجيل الخروج</span>
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
