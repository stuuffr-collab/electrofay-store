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
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">إدارة الأقسام</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            عرض الأقسام الرئيسية والفرعية وعدد المنتجات في كل قسم
          </p>
        </div>

        <div className="grid gap-6">
          {categories.map((category) => {
            const Icon = category.icon;
            const productCount = getCategoryProductCount(category.id);

            return (
              <Card 
                key={category.id}
                data-testid={`category-${category.id}`}
                className="overflow-hidden"
              >
                <CardHeader 
                  className="pb-4"
                  style={{ 
                    background: `linear-gradient(to right, ${category.color}15, transparent)`,
                    borderBottom: `2px solid ${category.color}30`
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div 
                        className="w-12 h-12 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: `${category.color}20` }}
                      >
                        <Icon className="w-6 h-6" style={{ color: category.color }} />
                      </div>
                      <div>
                        <CardTitle className="text-2xl">{category.name}</CardTitle>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          {category.nameEn}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                          {category.description}
                        </p>
                      </div>
                    </div>
                    <Badge 
                      data-testid={`count-${category.id}`}
                      variant="outline" 
                      className="text-lg px-4 py-2"
                      style={{ 
                        borderColor: category.color,
                        color: category.color
                      }}
                    >
                      {productCount} منتج
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {category.subcategories.map((subcategory) => {
                      const SubIcon = subcategory.icon;
                      const subProductCount = getSubcategoryProductCount(category.id, subcategory.id);
                      
                      return (
                        <div
                          key={subcategory.id}
                          data-testid={`subcategory-${category.id}-${subcategory.id}`}
                          className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <SubIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                            <div>
                              <p className="font-medium text-gray-900 dark:text-white">
                                {subcategory.name}
                              </p>
                              <p className="text-xs text-gray-500">
                                {subcategory.nameEn}
                              </p>
                            </div>
                          </div>
                          <Badge 
                            data-testid={`count-${category.id}-${subcategory.id}`}
                            variant="secondary"
                          >
                            <Package className="w-3 h-3 mr-1" />
                            {subProductCount}
                          </Badge>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </AdminLayout>
  );
}
