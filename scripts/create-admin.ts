import { db } from '../server/db';
import { adminUsers } from '../shared/schema';
import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';

async function createAdmin() {
  const username = process.env.ADMIN_USERNAME || 'alizze';
  const password = process.env.ADMIN_PASSWORD || 'kokemode123';
  const email = process.env.ADMIN_EMAIL || 'admin@electrofy.com';

  try {
    const existingUser = await db.select()
      .from(adminUsers)
      .where(eq(adminUsers.username, username))
      .limit(1);

    if (existingUser.length > 0) {
      console.log(`❌ المستخدم ${username} موجود بالفعل`);
      process.exit(1);
    }

    const [newAdmin] = await db.insert(adminUsers).values({
      username,
      email,
      password: password,
      role: 'admin',
      isActive: true,
    }).returning();

    console.log('✅ تم إنشاء حساب المدير بنجاح!');
    console.log(`👤 اسم المستخدم: ${username}`);
    console.log(`📧 البريد الإلكتروني: ${email}`);
    console.log(`🔑 يمكنك الآن تسجيل الدخول على: /admin/login`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ حدث خطأ أثناء إنشاء حساب المدير:', error);
    process.exit(1);
  }
}

createAdmin();
