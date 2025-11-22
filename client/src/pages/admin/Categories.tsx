import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useToast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { queryClient, apiRequest } from '@/lib/queryClient';
import { FolderTree, Package, Plus, Edit, Trash2, ChevronDown, ChevronUp, 
  Monitor, Cpu, HardDrive, Keyboard, Mouse, Headphones, Gamepad2, 
  Camera, Mic, Fan, Power, CircuitBoard, SlidersHorizontal, Armchair, 
  Box, Lightbulb, Cable } from 'lucide-react';
import * as LucideIcons from 'lucide-react';

// Available icons for selection
const availableIcons = [
  { value: 'Monitor', label: 'شاشة', icon: Monitor },
  { value: 'Cpu', label: 'معالج', icon: Cpu },
  { value: 'HardDrive', label: 'قرص صلب', icon: HardDrive },
  { value: 'Keyboard', label: 'كيبورد', icon: Keyboard },
  { value: 'Mouse', label: 'ماوس', icon: Mouse },
  { value: 'Headphones', label: 'سماعات', icon: Headphones },
  { value: 'Gamepad2', label: 'يد تحكم', icon: Gamepad2 },
  { value: 'Camera', label: 'كاميرا', icon: Camera },
  { value: 'Mic', label: 'مايك', icon: Mic },
  { value: 'Fan', label: 'مروحة', icon: Fan },
  { value: 'Power', label: 'طاقة', icon: Power },
  { value: 'CircuitBoard', label: 'لوحة', icon: CircuitBoard },
  { value: 'SlidersHorizontal', label: 'إعدادات', icon: SlidersHorizontal },
  { value: 'Armchair', label: 'كرسي', icon: Armchair },
  { value: 'Box', label: 'صندوق', icon: Box },
  { value: 'Lightbulb', label: 'إضاءة', icon: Lightbulb },
  { value: 'Cable', label: 'كابل', icon: Cable },
  { value: 'FolderTree', label: 'مجلد', icon: FolderTree },
  { value: 'Package', label: 'طرد', icon: Package }
];

// Category form schema
const categoryFormSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'الاسم بالعربية مطلوب'),
  nameEn: z.string().min(1, 'الاسم بالإنجليزية مطلوب'),
  icon: z.string().min(1, 'الأيقونة مطلوبة'),
  description: z.string().min(1, 'الوصف بالعربية مطلوب'),
  descriptionEn: z.string().min(1, 'الوصف بالإنجليزية مطلوب'),
  color: z.string().min(1, 'اللون مطلوب'),
  gradient: z.string().min(1, 'التدرج مطلوب'),
});

// Subcategory form schema
const subcategoryFormSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'الاسم بالعربية مطلوب'),
  nameEn: z.string().min(1, 'الاسم بالإنجليزية مطلوب'),
  icon: z.string().min(1, 'الأيقونة مطلوبة'),
  description: z.string().min(1, 'الوصف بالعربية مطلوب'),
  descriptionEn: z.string().min(1, 'الوصف بالإنجليزية مطلوب'),
});

export default function AdminCategories() {
  const { toast } = useToast();
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const [subcategoryDialogOpen, setSubcategoryDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [editingSubcategory, setEditingSubcategory] = useState<any>(null);
  const [selectedCategoryForSub, setSelectedCategoryForSub] = useState<string>('');
  const [deleteTarget, setDeleteTarget] = useState<{ type: 'category' | 'subcategory', id: string } | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [expandedSubcategories, setExpandedSubcategories] = useState<Set<string>>(new Set());

  // Fetch categories
  const { data: categories, isLoading: categoriesLoading } = useQuery<any[]>({
    queryKey: ['/api/admin/categories'],
  });

  // Fetch products
  const { data: products } = useQuery<any[]>({
    queryKey: ['/api/admin/products'],
  });

  // Category form
  const categoryForm = useForm<z.infer<typeof categoryFormSchema>>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      id: '',
      name: '',
      nameEn: '',
      icon: 'FolderTree',
      description: '',
      descriptionEn: '',
      color: '#3b82f6',
      gradient: 'from-blue-500 to-blue-700',
    },
  });

  // Subcategory form
  const subcategoryForm = useForm<z.infer<typeof subcategoryFormSchema>>({
    resolver: zodResolver(subcategoryFormSchema),
    defaultValues: {
      id: '',
      name: '',
      nameEn: '',
      icon: 'Package',
      description: '',
      descriptionEn: '',
    },
  });

  // Create/Update category mutation
  const categoryMutation = useMutation({
    mutationFn: async (data: z.infer<typeof categoryFormSchema>) => {
      if (editingCategory) {
        return apiRequest('PUT', `/api/admin/categories/${editingCategory.id}`, data);
      } else {
        return apiRequest('POST', '/api/admin/categories', data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/categories'] });
      setCategoryDialogOpen(false);
      setEditingCategory(null);
      categoryForm.reset();
      toast({
        title: editingCategory ? 'تم التحديث' : 'تم الإضافة',
        description: editingCategory ? 'تم تحديث القسم بنجاح' : 'تم إضافة القسم بنجاح',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'خطأ',
        description: error.message || 'حدث خطأ أثناء حفظ القسم',
        variant: 'destructive',
      });
    },
  });

  // Create/Update subcategory mutation
  const subcategoryMutation = useMutation({
    mutationFn: async (data: z.infer<typeof subcategoryFormSchema> & { categoryId: string }) => {
      if (editingSubcategory) {
        return apiRequest('PUT', `/api/admin/subcategories/${editingSubcategory.id}`, data);
      } else {
        return apiRequest('POST', '/api/admin/subcategories', data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/categories'] });
      setSubcategoryDialogOpen(false);
      setEditingSubcategory(null);
      setSelectedCategoryForSub('');
      subcategoryForm.reset();
      toast({
        title: editingSubcategory ? 'تم التحديث' : 'تم الإضافة',
        description: editingSubcategory ? 'تم تحديث القسم الفرعي بنجاح' : 'تم إضافة القسم الفرعي بنجاح',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'خطأ',
        description: error.message || 'حدث خطأ أثناء حفظ القسم الفرعي',
        variant: 'destructive',
      });
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async ({ type, id }: { type: 'category' | 'subcategory', id: string }) => {
      if (type === 'category') {
        return apiRequest('DELETE', `/api/admin/categories/${id}`);
      } else {
        return apiRequest('DELETE', `/api/admin/subcategories/${id}`);
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/categories'] });
      setDeleteDialogOpen(false);
      setDeleteTarget(null);
      toast({
        title: 'تم الحذف',
        description: variables.type === 'category' ? 'تم حذف القسم بنجاح' : 'تم حذف القسم الفرعي بنجاح',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'خطأ',
        description: error.message || 'حدث خطأ أثناء الحذف',
        variant: 'destructive',
      });
    },
  });

  // Helper functions
  const getCategoryProductCount = (categoryId: string) => {
    return products?.filter((p: any) => p.categoryId === categoryId).length || 0;
  };

  const getSubcategoryProductCount = (categoryId: string, subcategoryId: string) => {
    return products?.filter((p: any) => 
      p.categoryId === categoryId && p.subcategoryId === subcategoryId
    ).length || 0;
  };

  const getCategoryProducts = (categoryId: string) => {
    return products?.filter((p: any) => p.categoryId === categoryId) || [];
  };

  const getSubcategoryProducts = (categoryId: string, subcategoryId: string) => {
    return products?.filter((p: any) => 
      p.categoryId === categoryId && p.subcategoryId === subcategoryId
    ) || [];
  };

  const toggleCategoryExpanded = (categoryId: string) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });
  };

  const toggleSubcategoryExpanded = (subcategoryId: string) => {
    setExpandedSubcategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(subcategoryId)) {
        newSet.delete(subcategoryId);
      } else {
        newSet.add(subcategoryId);
      }
      return newSet;
    });
  };

  const getIconComponent = (iconName: string) => {
    const IconComponent = (LucideIcons as any)[iconName] || FolderTree;
    return IconComponent;
  };

  const openAddCategoryDialog = () => {
    setEditingCategory(null);
    categoryForm.reset({
      id: '',
      name: '',
      nameEn: '',
      icon: 'FolderTree',
      description: '',
      descriptionEn: '',
      color: '#3b82f6',
      gradient: 'from-blue-500 to-blue-700',
    });
    setCategoryDialogOpen(true);
  };

  const openEditCategoryDialog = (category: any) => {
    setEditingCategory(category);
    categoryForm.reset({
      id: category.id,
      name: category.name,
      nameEn: category.nameEn,
      icon: category.icon,
      description: category.description,
      descriptionEn: category.descriptionEn,
      color: category.color,
      gradient: category.gradient,
    });
    setCategoryDialogOpen(true);
  };

  const openAddSubcategoryDialog = (categoryId: string) => {
    setEditingSubcategory(null);
    setSelectedCategoryForSub(categoryId);
    subcategoryForm.reset({
      id: '',
      name: '',
      nameEn: '',
      icon: 'Package',
      description: '',
      descriptionEn: '',
    });
    setSubcategoryDialogOpen(true);
  };

  const openEditSubcategoryDialog = (categoryId: string, subcategory: any) => {
    setEditingSubcategory(subcategory);
    setSelectedCategoryForSub(categoryId);
    subcategoryForm.reset({
      id: subcategory.id,
      name: subcategory.name,
      nameEn: subcategory.nameEn,
      icon: subcategory.icon,
      description: subcategory.description,
      descriptionEn: subcategory.descriptionEn,
    });
    setSubcategoryDialogOpen(true);
  };

  const openDeleteDialog = (type: 'category' | 'subcategory', id: string) => {
    setDeleteTarget({ type, id });
    setDeleteDialogOpen(true);
  };

  const handleCategorySubmit = (data: z.infer<typeof categoryFormSchema>) => {
    categoryMutation.mutate(data);
  };

  const handleSubcategorySubmit = (data: z.infer<typeof subcategoryFormSchema>) => {
    subcategoryMutation.mutate({ ...data, categoryId: selectedCategoryForSub });
  };

  const handleDelete = () => {
    if (deleteTarget) {
      deleteMutation.mutate(deleteTarget);
    }
  };

  if (categoriesLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-xl admin-text-secondary">جاري التحميل...</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-8 admin-animate-fade">
        {/* Page Header */}
        <div className="admin-spacing-md admin-header-gradient">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-3">
                <FolderTree className="w-8 h-8" />
                إدارة الأقسام
              </h1>
              <p className="text-white/90 mt-2 font-medium">
                إدارة الأقسام الرئيسية والفرعية وعدد المنتجات في كل قسم
              </p>
            </div>
            <Button 
              onClick={openAddCategoryDialog}
              data-testid="button-add-category"
              className="bg-white text-blue-600 hover:bg-blue-50"
            >
              <Plus className="w-4 h-4 ml-2" />
              إضافة قسم رئيسي
            </Button>
          </div>
        </div>

        {/* Categories Grid */}
        <div className="grid gap-6">
          {categories?.map((category, index) => {
            const Icon = getIconComponent(category.icon);
            const productCount = getCategoryProductCount(category.id);
            const categoryProducts = getCategoryProducts(category.id);
            const isCategoryExpanded = expandedCategories.has(category.id);

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
                    <div className="flex items-center gap-4 flex-1">
                      <div 
                        className="w-12 h-12 rounded-lg flex items-center justify-center transition-transform hover:scale-110 cursor-pointer"
                        style={{ backgroundColor: `${category.color}20` }}
                        onClick={() => toggleCategoryExpanded(category.id)}
                        data-testid={`toggle-category-${category.id}`}
                      >
                        <Icon className="w-6 h-6" style={{ color: category.color }} />
                      </div>
                      <div className="flex-1">
                        <h2 className="text-2xl font-bold admin-text-primary">{category.name}</h2>
                        <p className="text-sm admin-text-muted mt-1">
                          {category.nameEn}
                        </p>
                        <p className="text-sm admin-text-secondary mt-1">
                          {category.description}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span
                        data-testid={`count-${category.id}`}
                        className="text-lg px-4 py-2 rounded-lg font-bold transition-all hover:scale-105 cursor-pointer"
                        style={{ 
                          background: `${category.color}20`,
                          color: category.color,
                          border: `2px solid ${category.color}50`
                        }}
                        onClick={() => toggleCategoryExpanded(category.id)}
                      >
                        {productCount} منتج
                        {isCategoryExpanded ? <ChevronUp className="w-4 h-4 inline mr-2" /> : <ChevronDown className="w-4 h-4 inline mr-2" />}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openAddSubcategoryDialog(category.id)}
                        data-testid={`button-add-subcategory-${category.id}`}
                      >
                        <Plus className="w-3 h-3 ml-1" />
                        قسم فرعي
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => openEditCategoryDialog(category)}
                        data-testid={`button-edit-category-${category.id}`}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => openDeleteDialog('category', category.id)}
                        data-testid={`button-delete-category-${category.id}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
                
                {/* Category Products (Expandable) */}
                {isCategoryExpanded && categoryProducts.length > 0 && (
                  <div className="admin-spacing-md bg-gray-50 dark:bg-gray-900/30">
                    <h3 className="font-semibold mb-3 admin-text-primary">منتجات القسم:</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {categoryProducts.map((product: any) => (
                        <div key={product.id} className="flex items-center gap-2 p-2 rounded bg-white dark:bg-gray-800 border">
                          <img src={product.image} alt={product.name} className="w-10 h-10 object-cover rounded" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{product.name}</p>
                            <p className="text-xs text-gray-500">{product.id}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Subcategories */}
                <div className="admin-spacing-md">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {category.subcategories?.map((subcategory: any) => {
                      const SubIcon = getIconComponent(subcategory.icon);
                      const subProductCount = getSubcategoryProductCount(category.id, subcategory.id);
                      const subProducts = getSubcategoryProducts(category.id, subcategory.id);
                      const isSubExpanded = expandedSubcategories.has(`${category.id}-${subcategory.id}`);
                      
                      return (
                        <div
                          key={subcategory.id}
                          data-testid={`subcategory-${category.id}-${subcategory.id}`}
                          className="border rounded-lg overflow-hidden"
                          style={{ 
                            background: 'var(--admin-card-bg)',
                            border: '1px solid var(--admin-border)'
                          }}
                        >
                          <div className="flex items-center justify-between p-4">
                            <div 
                              className="flex items-center gap-3 flex-1 cursor-pointer"
                              onClick={() => toggleSubcategoryExpanded(`${category.id}-${subcategory.id}`)}
                            >
                              <SubIcon className="w-5 h-5 admin-text-secondary" />
                              <div className="flex-1">
                                <p className="font-medium admin-text-primary">
                                  {subcategory.name}
                                </p>
                                <p className="text-xs admin-text-muted">
                                  {subcategory.nameEn}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <span
                                data-testid={`count-${category.id}-${subcategory.id}`}
                                className="admin-badge admin-badge-info flex items-center gap-1 cursor-pointer"
                                onClick={() => toggleSubcategoryExpanded(`${category.id}-${subcategory.id}`)}
                              >
                                <Package className="w-3 h-3" />
                                {subProductCount}
                                {isSubExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                              </span>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => openEditSubcategoryDialog(category.id, subcategory)}
                                data-testid={`button-edit-subcategory-${category.id}-${subcategory.id}`}
                              >
                                <Edit className="w-3 h-3" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-red-600 hover:text-red-700"
                                onClick={() => openDeleteDialog('subcategory', subcategory.id)}
                                data-testid={`button-delete-subcategory-${category.id}-${subcategory.id}`}
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                          
                          {/* Subcategory Products (Expandable) */}
                          {isSubExpanded && subProducts.length > 0 && (
                            <div className="px-4 pb-4 pt-2 bg-gray-50 dark:bg-gray-900/30 border-t">
                              <h4 className="text-xs font-semibold mb-2 admin-text-secondary">المنتجات:</h4>
                              <div className="space-y-2">
                                {subProducts.map((product: any) => (
                                  <div key={product.id} className="flex items-center gap-2 p-2 rounded bg-white dark:bg-gray-800 border text-xs">
                                    <img src={product.image} alt={product.name} className="w-8 h-8 object-cover rounded" />
                                    <div className="flex-1 min-w-0">
                                      <p className="font-medium truncate">{product.name}</p>
                                      <p className="text-gray-500">{product.id}</p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
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

      {/* Category Dialog */}
      <Dialog open={categoryDialogOpen} onOpenChange={setCategoryDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingCategory ? 'تعديل القسم الرئيسي' : 'إضافة قسم رئيسي جديد'}
            </DialogTitle>
            <DialogDescription>
              {editingCategory ? 'قم بتعديل بيانات القسم الرئيسي' : 'أضف قسم رئيسي جديد للمتجر'}
            </DialogDescription>
          </DialogHeader>
          <Form {...categoryForm}>
            <form onSubmit={categoryForm.handleSubmit(handleCategorySubmit)} className="space-y-4">
              {editingCategory && (
                <FormField
                  control={categoryForm.control}
                  name="id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>المعرف (ID)</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          placeholder="pc-components" 
                          disabled={true}
                          data-testid="input-category-id"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={categoryForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>الاسم بالعربية</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="قطع الكمبيوتر" data-testid="input-category-name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={categoryForm.control}
                  name="nameEn"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>الاسم بالإنجليزية</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="PC Components" data-testid="input-category-nameEn" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={categoryForm.control}
                name="icon"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>الأيقونة</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger data-testid="select-category-icon">
                          <SelectValue placeholder="اختر أيقونة" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {availableIcons.map((icon) => {
                          const IconComp = icon.icon;
                          return (
                            <SelectItem key={icon.value} value={icon.value}>
                              <div className="flex items-center gap-2">
                                <IconComp className="w-4 h-4" />
                                <span>{icon.label}</span>
                              </div>
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={categoryForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>الوصف بالعربية</FormLabel>
                    <FormControl>
                      <Textarea {...field} placeholder="معالجات، كروت شاشة، رامات..." data-testid="input-category-description" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={categoryForm.control}
                name="descriptionEn"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>الوصف بالإنجليزية</FormLabel>
                    <FormControl>
                      <Textarea {...field} placeholder="Processors, Graphics Cards, RAM..." data-testid="input-category-descriptionEn" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={categoryForm.control}
                  name="color"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>اللون</FormLabel>
                      <FormControl>
                        <div className="flex gap-2">
                          <Input type="color" {...field} className="w-20" data-testid="input-category-color" />
                          <Input {...field} placeholder="#3b82f6" />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={categoryForm.control}
                  name="gradient"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>التدرج (Gradient)</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="from-blue-500 to-blue-700" data-testid="input-category-gradient" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <DialogFooter>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setCategoryDialogOpen(false)}
                  data-testid="button-cancel-category"
                >
                  إلغاء
                </Button>
                <Button 
                  type="submit" 
                  disabled={categoryMutation.isPending}
                  data-testid="button-save-category"
                >
                  {categoryMutation.isPending ? 'جاري الحفظ...' : (editingCategory ? 'تحديث' : 'إضافة')}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Subcategory Dialog */}
      <Dialog open={subcategoryDialogOpen} onOpenChange={setSubcategoryDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingSubcategory ? 'تعديل القسم الفرعي' : 'إضافة قسم فرعي جديد'}
            </DialogTitle>
            <DialogDescription>
              {editingSubcategory ? 'قم بتعديل بيانات القسم الفرعي' : 'أضف قسم فرعي جديد'}
            </DialogDescription>
          </DialogHeader>
          <Form {...subcategoryForm}>
            <form onSubmit={subcategoryForm.handleSubmit(handleSubcategorySubmit)} className="space-y-4">
              {editingSubcategory && (
                <FormField
                  control={subcategoryForm.control}
                  name="id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>المعرف (ID)</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          placeholder="processors" 
                          disabled={true}
                          data-testid="input-subcategory-id"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={subcategoryForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>الاسم بالعربية</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="المعالجات" data-testid="input-subcategory-name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={subcategoryForm.control}
                  name="nameEn"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>الاسم بالإنجليزية</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Processors" data-testid="input-subcategory-nameEn" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={subcategoryForm.control}
                name="icon"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>الأيقونة</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger data-testid="select-subcategory-icon">
                          <SelectValue placeholder="اختر أيقونة" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {availableIcons.map((icon) => {
                          const IconComp = icon.icon;
                          return (
                            <SelectItem key={icon.value} value={icon.value}>
                              <div className="flex items-center gap-2">
                                <IconComp className="w-4 h-4" />
                                <span>{icon.label}</span>
                              </div>
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={subcategoryForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>الوصف بالعربية</FormLabel>
                    <FormControl>
                      <Textarea {...field} placeholder="معالجات Intel و AMD" data-testid="input-subcategory-description" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={subcategoryForm.control}
                name="descriptionEn"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>الوصف بالإنجليزية</FormLabel>
                    <FormControl>
                      <Textarea {...field} placeholder="Intel & AMD Processors" data-testid="input-subcategory-descriptionEn" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setSubcategoryDialogOpen(false)}
                  data-testid="button-cancel-subcategory"
                >
                  إلغاء
                </Button>
                <Button 
                  type="submit" 
                  disabled={subcategoryMutation.isPending}
                  data-testid="button-save-subcategory"
                >
                  {subcategoryMutation.isPending ? 'جاري الحفظ...' : (editingSubcategory ? 'تحديث' : 'إضافة')}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>هل أنت متأكد؟</AlertDialogTitle>
            <AlertDialogDescription>
              {deleteTarget?.type === 'category' 
                ? 'سيتم حذف القسم الرئيسي وجميع الأقسام الفرعية التابعة له. هذا الإجراء لا يمكن التراجع عنه.'
                : 'سيتم حذف القسم الفرعي. هذا الإجراء لا يمكن التراجع عنه.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-testid="button-cancel-delete">إلغاء</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
              disabled={deleteMutation.isPending}
              data-testid="button-confirm-delete"
            >
              {deleteMutation.isPending ? 'جاري الحذف...' : 'حذف'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
}
