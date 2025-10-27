import { useState } from 'react';
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
import { Plus, Pencil, Trash2, Search } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { categories } from '@/lib/categories';

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
  const { toast } = useToast();

  const { data: products, isLoading } = useQuery({
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
      apiRequest('/api/admin/products', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/products'] });
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
      apiRequest(`/api/admin/products/${data.id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/products'] });
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
      apiRequest(`/api/admin/products/${id}`, { method: 'DELETE' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/products'] });
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

  const filteredProducts = products?.filter((p: any) => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.nameEn.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || p.categoryId === selectedCategory;
    return matchesSearch && matchesCategory;
  }) || [];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">إدارة المنتجات</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              إضافة وتعديل وحذف المنتجات
            </p>
          </div>
          
          <Dialog open={dialogOpen} onOpenChange={(open) => {
            setDialogOpen(open);
            if (!open) {
              setEditingProduct(null);
              form.reset();
            }
          }}>
            <DialogTrigger asChild>
              <Button data-testid="button-add-product" className="gap-2">
                <Plus className="w-4 h-4" />
                إضافة منتج جديد
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
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
                          <FormLabel>معرف المنتج (ID)</FormLabel>
                          <FormControl>
                            <Input {...field} data-testid="input-product-id" disabled={!!editingProduct} />
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
                          <FormLabel>السعر بالدولار</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              step="0.01"
                              {...field}
                              data-testid="input-price"
                              onChange={e => field.onChange(parseFloat(e.target.value))}
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
                          <FormLabel>الاسم بالعربية</FormLabel>
                          <FormControl>
                            <Input {...field} data-testid="input-name-ar" />
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
                          <FormLabel>الاسم بالإنجليزية</FormLabel>
                          <FormControl>
                            <Input {...field} data-testid="input-name-en" />
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
                          <FormLabel>الوصف بالعربية</FormLabel>
                          <FormControl>
                            <Textarea {...field} data-testid="input-desc-ar" rows={3} />
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
                          <FormLabel>الوصف بالإنجليزية</FormLabel>
                          <FormControl>
                            <Textarea {...field} data-testid="input-desc-en" rows={3} />
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
                          <FormLabel>القسم الرئيسي</FormLabel>
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
                          <FormLabel>القسم الفرعي</FormLabel>
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
                        <FormLabel>رابط الصورة</FormLabel>
                        <FormControl>
                          <Input {...field} data-testid="input-image" placeholder="https://..." />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="stockCount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>الكمية في المخزون</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            data-testid="input-stock"
                            onChange={e => field.onChange(parseInt(e.target.value))}
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
                        <FormItem className="flex items-center justify-between rounded-lg border p-4">
                          <div>
                            <FormLabel>متوفر في المخزون</FormLabel>
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
                        <FormItem className="flex items-center justify-between rounded-lg border p-4">
                          <div>
                            <FormLabel>نشط</FormLabel>
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
                      className="flex-1"
                    >
                      {createMutation.isPending || updateMutation.isPending ? 'جاري الحفظ...' : 'حفظ'}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setDialogOpen(false)}
                    >
                      إلغاء
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute right-3 top-3 w-4 h-4 text-gray-400" />
            <Input
              data-testid="input-search"
              placeholder="بحث عن منتج..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-10"
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

        {isLoading ? (
          <div className="text-center py-12">جاري التحميل...</div>
        ) : (
          <div className="bg-white dark:bg-gray-900 rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right">صورة</TableHead>
                  <TableHead className="text-right">الاسم</TableHead>
                  <TableHead className="text-right">السعر (USD)</TableHead>
                  <TableHead className="text-right">المخزون</TableHead>
                  <TableHead className="text-right">القسم</TableHead>
                  <TableHead className="text-right">الحالة</TableHead>
                  <TableHead className="text-right">إجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product: any) => (
                  <TableRow key={product.id} data-testid={`product-row-${product.id}`}>
                    <TableCell>
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-gray-500">{product.nameEn}</p>
                      </div>
                    </TableCell>
                    <TableCell>${product.basePriceUsd}</TableCell>
                    <TableCell>{product.stockCount}</TableCell>
                    <TableCell>
                      {categories.find(c => c.id === product.categoryId)?.name}
                    </TableCell>
                    <TableCell>
                      <Badge variant={product.isActive ? 'default' : 'secondary'}>
                        {product.isActive ? 'نشط' : 'غير نشط'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          data-testid={`button-edit-${product.id}`}
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(product)}
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
