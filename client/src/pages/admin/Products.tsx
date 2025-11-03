import { useState, useRef } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Plus, Pencil, Trash2, Search, Package, Upload, Image as ImageIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { categories } from '@/lib/categories';
import { uploadImageToSupabase } from '@/lib/imageUpload';

const productSchema = z.object({
  id: z.string().min(1, 'معرف المنتج مطلوب'),
  name: z.string().min(1, 'الاسم العربي مطلوب'),
  nameEn: z.string().min(1, 'الاسم الإنجليزي مطلوب'),
  description: z.string().min(1, 'الوصف العربي مطلوب'),
  descriptionEn: z.string().min(1, 'الوصف الإنجليزي مطلوب'),
  basePriceUsd: z.number().min(0, 'السعر يجب أن يكون موجب'),
  categoryId: z.string().min(1, 'القسم الرئيسي مطلوب'),
  subcategoryId: z.string().min(1, 'القسم الفرعي مطلوب'),
  image: z.string().url('رابط الصورة غير صحيح'),
  stockCount: z.number().int().min(0, 'الكمية يجب أن تكون موجبة'),
  inStock: z.boolean(),
  isActive: z.boolean(),
});

type ProductFormData = z.infer<typeof productSchema>;

export default function AdminProducts() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const { data: products = [], isLoading } = useQuery<any[]>({
    queryKey: ['/api/admin/products'],
  });

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      id: '',
      name: '',
      nameEn: '',
      description: '',
      descriptionEn: '',
      basePriceUsd: 0,
      categoryId: '',
      subcategoryId: '',
      image: '',
      stockCount: 0,
      inStock: true,
      isActive: true,
    },
  });

  const selectedCat = form.watch('categoryId');
  const subcategories = categories.find(c => c.id === selectedCat)?.subcategories || [];

  const createMutation = useMutation({
    mutationFn: (data: ProductFormData) =>
      apiRequest('POST', '/api/admin/products', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/products'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      setDialogOpen(false);
      form.reset();
      toast({ title: 'تم إضافة المنتج بنجاح' });
    },
    onError: () => {
      toast({ title: 'فشل في إضافة المنتج', variant: 'destructive' });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: ProductFormData & { id: string }) =>
      apiRequest('PUT', `/api/admin/products/${data.id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/products'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      setDialogOpen(false);
      setEditingProduct(null);
      form.reset();
      toast({ title: 'تم تحديث المنتج بنجاح' });
    },
    onError: () => {
      toast({ title: 'فشل في تحديث المنتج', variant: 'destructive' });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) =>
      apiRequest('DELETE', `/api/admin/products/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/products'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast({ title: 'تم حذف المنتج بنجاح' });
    },
    onError: () => {
      toast({ title: 'فشل في حذف المنتج', variant: 'destructive' });
    },
  });

  const handleEdit = (product: any) => {
    setEditingProduct(product);
    form.reset({
      id: product.id,
      name: product.name,
      nameEn: product.nameEn,
      description: product.description,
      descriptionEn: product.descriptionEn,
      basePriceUsd: parseFloat(product.basePriceUsd),
      categoryId: product.categoryId,
      subcategoryId: product.subcategoryId,
      image: product.image,
      stockCount: product.stockCount,
      inStock: product.inStock,
      isActive: product.isActive,
    });
    setDialogOpen(true);
  };

  const handleSubmit = (data: ProductFormData) => {
    if (editingProduct) {
      updateMutation.mutate({ ...data, id: editingProduct.id });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذا المنتج؟')) {
      deleteMutation.mutate(id);
    }
  };

  const handleImageUpload = async () => {
    if (!selectedImage) {
      toast({ title: 'الرجاء اختيار صورة أولاً', variant: 'destructive' });
      return;
    }

    setUploadingImage(true);
    try {
      const result = await uploadImageToSupabase(selectedImage);
      
      if (result.success && result.url) {
        form.setValue('image', result.url);
        setSelectedImage(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        toast({ title: 'تم رفع الصورة بنجاح' });
      } else {
        toast({ 
          title: 'فشل في رفع الصورة', 
          description: result.error || 'حدث خطأ غير معروف',
          variant: 'destructive' 
        });
      }
    } catch (error) {
      toast({ title: 'فشل في رفع الصورة', variant: 'destructive' });
    } finally {
      setUploadingImage(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({ title: 'حجم الصورة كبير جداً (الحد الأقصى 5MB)', variant: 'destructive' });
        return;
      }
      setSelectedImage(file);
    }
  };

  const filteredProducts = products.filter((p: any) => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.nameEn.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || p.categoryId === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <AdminLayout>
      <div className="space-y-8 admin-animate-fade">
        {/* Page Header */}
        <div className="admin-spacing-md admin-header-gradient">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Package className="w-8 h-8" />
            إدارة المنتجات
          </h1>
          <p className="text-white/90 mt-2 font-medium">
            إضافة وتعديل وحذف المنتجات
          </p>
        </div>

        {/* Action Bar */}
        <div className="flex items-center justify-between admin-animate-slide">
          <Dialog open={dialogOpen} onOpenChange={(open) => {
            setDialogOpen(open);
            if (!open) {
              setEditingProduct(null);
              form.reset();
            }
          }}>
            <DialogTrigger asChild>
              <Button data-testid="button-add-product" className="gap-2 admin-btn-primary">
                <Plus className="w-4 h-4" />
                إضافة منتج جديد
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto admin-card">
              <DialogHeader>
                <DialogTitle className="admin-text-primary">
                  {editingProduct ? 'تعديل المنتج' : 'إضافة منتج جديد'}
                </DialogTitle>
              </DialogHeader>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="id"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="admin-text-secondary">معرف المنتج (ID)</FormLabel>
                          <FormControl>
                            <Input {...field} data-testid="input-product-id" disabled={!!editingProduct} className="admin-input" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="basePriceUsd"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="admin-text-secondary">السعر بالدولار</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              step="0.01"
                              {...field}
                              data-testid="input-price"
                              onChange={e => field.onChange(parseFloat(e.target.value))}
                              className="admin-input"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="admin-text-secondary">الاسم بالعربية</FormLabel>
                          <FormControl>
                            <Input {...field} data-testid="input-name-ar" className="admin-input" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="nameEn"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="admin-text-secondary">الاسم بالإنجليزية</FormLabel>
                          <FormControl>
                            <Input {...field} data-testid="input-name-en" className="admin-input" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="admin-text-secondary">الوصف بالعربية</FormLabel>
                          <FormControl>
                            <Textarea {...field} data-testid="input-desc-ar" rows={3} className="admin-input" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="descriptionEn"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="admin-text-secondary">الوصف بالإنجليزية</FormLabel>
                          <FormControl>
                            <Textarea {...field} data-testid="input-desc-en" rows={3} className="admin-input" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="categoryId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="admin-text-secondary">القسم الرئيسي</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger data-testid="select-category">
                                <SelectValue placeholder="اختر القسم" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {categories.map(cat => (
                                <SelectItem key={cat.id} value={cat.id}>
                                  {cat.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="subcategoryId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="admin-text-secondary">القسم الفرعي</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger data-testid="select-subcategory">
                                <SelectValue placeholder="اختر القسم الفرعي" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {subcategories.map(sub => (
                                <SelectItem key={sub.id} value={sub.id}>
                                  {sub.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="image"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="admin-text-secondary">صورة المنتج</FormLabel>
                        <div className="space-y-3">
                          <div className="flex gap-2">
                            <input
                              ref={fileInputRef}
                              type="file"
                              accept="image/*"
                              onChange={handleFileSelect}
                              className="hidden"
                              data-testid="input-file"
                            />
                            <Button
                              type="button"
                              onClick={() => fileInputRef.current?.click()}
                              className="gap-2"
                              variant="outline"
                              data-testid="button-select-image"
                            >
                              <ImageIcon className="w-4 h-4" />
                              {selectedImage ? selectedImage.name : 'اختر صورة من الجهاز'}
                            </Button>
                            {selectedImage && (
                              <Button
                                type="button"
                                onClick={handleImageUpload}
                                disabled={uploadingImage}
                                className="gap-2 admin-btn-primary"
                                data-testid="button-upload-image"
                              >
                                <Upload className="w-4 h-4" />
                                {uploadingImage ? 'جاري الرفع...' : 'رفع الصورة'}
                              </Button>
                            )}
                          </div>
                          <FormControl>
                            <Input 
                              {...field} 
                              data-testid="input-image" 
                              placeholder="أو أدخل رابط الصورة مباشرة" 
                              className="admin-input" 
                            />
                          </FormControl>
                          {field.value && (
                            <div className="mt-2">
                              <img 
                                src={field.value} 
                                alt="معاينة" 
                                className="max-w-xs h-32 object-cover rounded-lg border border-admin-border"
                                onError={(e) => {
                                  e.currentTarget.style.display = 'none';
                                }}
                              />
                            </div>
                          )}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="stockCount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="admin-text-secondary">الكمية في المخزون</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            data-testid="input-stock"
                            onChange={e => field.onChange(parseInt(e.target.value))}
                            className="admin-input"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="inStock"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between rounded-lg border border-admin-border p-4 admin-card">
                          <div>
                            <FormLabel className="admin-text-secondary">متوفر في المخزون</FormLabel>
                          </div>
                          <FormControl>
                            <Switch
                              data-testid="switch-in-stock"
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="isActive"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between rounded-lg border border-admin-border p-4 admin-card">
                          <div>
                            <FormLabel className="admin-text-secondary">نشط</FormLabel>
                          </div>
                          <FormControl>
                            <Switch
                              data-testid="switch-active"
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button
                      data-testid="button-save-product"
                      type="submit"
                      disabled={createMutation.isPending || updateMutation.isPending}
                      className="flex-1 admin-btn-primary"
                    >
                      {createMutation.isPending || updateMutation.isPending ? 'جاري الحفظ...' : 'حفظ'}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setDialogOpen(false)}
                      className="admin-btn-secondary"
                    >
                      إلغاء
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search and Filter */}
        <div className="flex gap-4 admin-animate-slide" style={{ animationDelay: '0.1s' }}>
          <div className="relative flex-1">
            <Search className="absolute right-3 top-3 w-4 h-4" style={{ color: 'var(--admin-text-muted)' }} />
            <Input
              data-testid="input-search"
              placeholder="بحث عن منتج..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-10 admin-input"
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger data-testid="select-filter-category" className="w-48">
              <SelectValue placeholder="تصفية حسب القسم" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">جميع الأقسام</SelectItem>
              {categories.map(cat => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Products Table */}
        {isLoading ? (
          <div className="text-center py-12 admin-card admin-spacing-lg">
            <div 
              className="w-16 h-16 border-4 rounded-full animate-spin mx-auto mb-4" 
              style={{ borderColor: 'var(--admin-accent-cyan)', borderTopColor: 'transparent' }}
            ></div>
            <p className="admin-text-secondary">جاري التحميل...</p>
          </div>
        ) : (
          <div className="admin-card overflow-hidden admin-animate-slide" style={{ animationDelay: '0.2s' }}>
            <Table className="admin-table">
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right admin-text-secondary">صورة</TableHead>
                  <TableHead className="text-right admin-text-secondary">الاسم</TableHead>
                  <TableHead className="text-right admin-text-secondary">السعر (USD)</TableHead>
                  <TableHead className="text-right admin-text-secondary">المخزون</TableHead>
                  <TableHead className="text-right admin-text-secondary">القسم</TableHead>
                  <TableHead className="text-right admin-text-secondary">الحالة</TableHead>
                  <TableHead className="text-right admin-text-secondary">إجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product: any) => (
                  <TableRow key={product.id} data-testid={`product-row-${product.id}`}>
                    <TableCell>
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-12 h-12 object-cover rounded transition-transform hover:scale-110"
                      />
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium admin-text-primary">{product.name}</p>
                        <p className="text-sm admin-text-muted">{product.nameEn}</p>
                      </div>
                    </TableCell>
                    <TableCell className="admin-text-primary font-semibold">${product.basePriceUsd}</TableCell>
                    <TableCell className="admin-text-primary">{product.stockCount}</TableCell>
                    <TableCell className="admin-text-secondary">
                      {categories.find(c => c.id === product.categoryId)?.name}
                    </TableCell>
                    <TableCell>
                      {product.isActive ? (
                        <span className="admin-badge admin-badge-success">نشط</span>
                      ) : (
                        <span className="admin-badge admin-badge-error">غير نشط</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          data-testid={`button-edit-${product.id}`}
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(product)}
                          className="admin-btn-secondary"
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          data-testid={`button-delete-${product.id}`}
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(product.id)}
                          disabled={deleteMutation.isPending}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
