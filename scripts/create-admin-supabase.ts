import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ خطأ: لم يتم العثور على متغيرات Supabase البيئية');
  console.error('تأكد من تعيين VITE_SUPABASE_URL و VITE_SUPABASE_ANON_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function createAdminUser() {
  const username = process.env.ADMIN_USERNAME || 'alizze';
  const password = process.env.ADMIN_PASSWORD || 'kokemode123';
  const email = process.env.ADMIN_EMAIL || 'admin@electrofy.com';

  try {
    console.log('🔐 جاري تشفير كلمة المرور...');
    const passwordHash = await bcrypt.hash(password, 10);

    console.log('📝 جاري إنشاء حساب المدير في Supabase...');
    
    const { data, error } = await supabase
      .from('admin_users')
      .insert({
        username,
        email,
        password_hash: passwordHash,
        role: 'admin',
        is_active: true,
      })
      .select()
      .single();

    if (error) {
      console.error('❌ خطأ في إنشاء المستخدم:', JSON.stringify(error, null, 2));
      
      if (error.code === '23505') {
        console.log('⚠️  المستخدم موجود بالفعل، جاري تحديث كلمة المرور...');
        
        const { data: updateData, error: updateError } = await supabase
          .from('admin_users')
          .update({ password_hash: passwordHash })
          .eq('username', username)
          .select()
          .single();

        if (updateError) {
          console.error('❌ خطأ في تحديث المستخدم:', JSON.stringify(updateError, null, 2));
          process.exit(1);
        }

        console.log('✅ تم تحديث كلمة المرور بنجاح!');
      } else {
        console.error('⚠️  قد يكون الجدول غير موجود أو الصلاحيات غير كافية');
        console.error('💡 جرب إضافة المستخدم يدوياً من لوحة Supabase SQL Editor');
        process.exit(1);
      }
    } else {
      console.log('✅ تم إنشاء حساب المدير بنجاح!');
    }

    console.log('\n📋 معلومات تسجيل الدخول:');
    console.log('👤 اسم المستخدم:', username);
    console.log('🔑 كلمة المرور:', password);
    console.log('📧 البريد الإلكتروني:', email);
    console.log('\n🌐 يمكنك الآن تسجيل الدخول على: /admin/login');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ خطأ غير متوقع:', error);
    process.exit(1);
  }
}

createAdminUser();
