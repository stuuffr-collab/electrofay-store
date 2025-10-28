import { useQuery } from '@tanstack/react-query';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { categories } from '@/lib/categories';
import { FolderTree, Package } from 'lucide-react';

export default function AdminCategories() {
  const { data: products } = useQuery({
    queryKey: ['/api/admin/products'],
  });

  const getCategoryProductCount = (categoryId: string) => {
    return products?.filter((p: any) => p.categoryId === categoryId).length || 0;
  };

  const getSubcategoryProductCount = (categoryId: string, subcategoryId: string) => {
    return products?.filter((p: any) => 
      p.categoryId === categoryId && p.subcategoryId === subcategoryId
    ).length || 0;
  };

  return (
    <AdminLayout>
      <div className="space-y-8 admin-animate-fade">
        {/* Page Header */}
        <div className="admin-spacing-md admin-header-gradient">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <FolderTree className="w-8 h-8" />
            إدارة الأقسام
          </h1>
          <p className="text-white/90 mt-2 font-medium">
            عرض الأقسام الرئيسية والفرعية وعدد المنتجات في كل قسم
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid gap-6">
          {categories.map((category, index) => {
            const Icon = category.icon;
            const productCount = getCategoryProductCount(category.id);

            return (
              <div
                key={category.id}
                data-testid={`category-${category.id}`}
                className="admin-card overflow-hidden admin-animate-slide"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div 
                  className="admin-spacing-md"
                  style={{ 
                    background: `linear-gradient(to right, ${category.color}15, transparent)`,
                    borderBottom: `2px solid ${category.color}30`
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div 
                        className="w-12 h-12 rounded-lg flex items-center justify-center transition-transform hover:scale-110"
                        style={{ backgroundColor: `${category.color}20` }}
                      >
                        <Icon className="w-6 h-6" style={{ color: category.color }} />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold admin-text-primary">{category.name}</h2>
                        <p className="text-sm admin-text-muted mt-1">
                          {category.nameEn}
                        </p>
                        <p className="text-sm admin-text-secondary mt-1">
                          {category.description}
                        </p>
                      </div>
                    </div>
                    <span
                      data-testid={`count-${category.id}`}
                      className="text-lg px-4 py-2 rounded-lg font-bold transition-all hover:scale-105"
                      style={{ 
                        background: `${category.color}20`,
                        color: category.color,
                        border: `2px solid ${category.color}50`
                      }}
                    >
                      {productCount} منتج
                    </span>
                  </div>
                </div>
                
                <div className="admin-spacing-md">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {category.subcategories.map((subcategory) => {
                      const SubIcon = subcategory.icon;
                      const subProductCount = getSubcategoryProductCount(category.id, subcategory.id);
                      
                      return (
                        <div
                          key={subcategory.id}
                          data-testid={`subcategory-${category.id}-${subcategory.id}`}
                          className="flex items-center justify-between p-4 rounded-lg transition-all hover:transform hover:scale-105"
                          style={{ 
                            background: 'var(--admin-card-bg)',
                            border: '1px solid var(--admin-border)'
                          }}
                        >
                          <div className="flex items-center gap-3">
                            <SubIcon className="w-5 h-5 admin-text-secondary" />
                            <div>
                              <p className="font-medium admin-text-primary">
                                {subcategory.name}
                              </p>
                              <p className="text-xs admin-text-muted">
                                {subcategory.nameEn}
                              </p>
                            </div>
                          </div>
                          <span
                            data-testid={`count-${category.id}-${subcategory.id}`}
                            className="admin-badge admin-badge-info flex items-center gap-1"
                          >
                            <Package className="w-3 h-3" />
                            {subProductCount}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AdminLayout>
  );
}
