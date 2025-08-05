# Supabase Database Setup for إلكتروفاي Store

## Steps to Set Up Your Supabase Database

### 1. Access Supabase SQL Editor
1. Go to your Supabase project dashboard
2. Navigate to "SQL Editor" in the left sidebar
3. Click "New Query"

### 2. Run the Database Setup
1. Copy the entire content of `database-setup.sql`
2. Paste it into the SQL Editor
3. Click "Run" to execute all the setup commands

### 3. Verify Tables Created
After running the script, you should see these tables in your database:
- `products` - Store product catalog
- `orders` - Customer orders
- `cities` - Libyan cities with delivery fees  
- `contact_messages` - Contact form submissions

### 4. Storage Bucket
The script also creates a storage bucket called `product-images` for storing product photos.

### 5. Sample Data
The setup includes:
- 8 sample products (gaming accessories and electronics)
- 23 Libyan cities with delivery fees
- Proper permissions and security policies

### 6. Test the Integration
Once setup is complete:
- Your store will load products from Supabase instead of JSON files
- Customer orders will be saved to the database
- You can upload product images to Supabase Storage

### 7. Admin Access
You can view and manage all data through:
- Supabase Table Editor (for orders, products, etc.)
- Supabase Storage (for product images)
- Built-in admin dashboard (if implemented)

## Database Features Enabled

✅ **Product Management** - Complete product catalog with Arabic/English names  
✅ **Order Processing** - Customer orders saved with full details  
✅ **Geographic Support** - Libyan cities with delivery fees  
✅ **Image Storage** - Product images in Supabase Storage  
✅ **Security** - Row Level Security (RLS) policies  
✅ **Performance** - Database indexes for fast queries  
✅ **Backup** - Automatic timestamps and audit trail  

## Next Steps

After database setup, your store will:
1. Automatically fetch products from Supabase
2. Save customer orders to the database
3. Support product image uploads
4. Enable admin order management

The fallback to local JSON data ensures the store works even if there are connection issues.