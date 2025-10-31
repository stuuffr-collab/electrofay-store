import { Router, type Request, type Response } from 'express';
import bcrypt from 'bcryptjs';
import { db } from '../db';
import { adminUsers } from '../../shared/schema';
import { eq } from 'drizzle-orm';

const router = Router();

interface AdminSession {
  adminId?: number;
  adminUsername?: string;
  adminEmail?: string;
}

router.post('/login', async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    console.log('تسجيل دخول - المستخدم:', username);

    if (!username || !password) {
      return res.status(400).json({ error: 'اسم المستخدم وكلمة المرور مطلوبة' });
    }

    const admin = await db.select()
      .from(adminUsers)
      .where(eq(adminUsers.username, username))
      .limit(1);

    console.log('نتيجة البحث - عدد المستخدمين:', admin.length);

    if (!admin || admin.length === 0) {
      return res.status(401).json({ error: 'اسم المستخدم أو كلمة المرور غير صحيحة' });
    }

    const adminUser = admin[0];
    console.log('المستخدم الموجود:', adminUser.username);

    if (!adminUser.isActive) {
      return res.status(403).json({ error: 'هذا الحساب غير نشط' });
    }

    // Simple password comparison without encryption
    const isValidPassword = password === adminUser.password;
    console.log('كلمة المرور صحيحة:', isValidPassword);

    if (!isValidPassword) {
      return res.status(401).json({ error: 'اسم المستخدم أو كلمة المرور غير صحيحة' });
    }

    await db.update(adminUsers)
      .set({ lastLogin: new Date() })
      .where(eq(adminUsers.id, adminUser.id));

    const session = (req as any).session;
    if (!session) {
      console.error('Session is undefined!');
      return res.status(500).json({ error: 'خطأ في الجلسة' });
    }

    session.adminId = adminUser.id;
    session.adminUsername = adminUser.username;
    session.adminEmail = adminUser.email;

    console.log('✅ تسجيل دخول ناجح:', adminUser.username);

    res.json({
      id: adminUser.id,
      username: adminUser.username,
      email: adminUser.email,
      role: adminUser.role,
    });
  } catch (error) {
    console.error('خطأ في تسجيل الدخول:', error);
    res.status(500).json({ error: 'حدث خطأ أثناء تسجيل الدخول', details: error instanceof Error ? error.message : String(error) });
  }
});

router.post('/logout', (req: Request, res: Response) => {
  (req as any).session.destroy((err: any) => {
    if (err) {
      return res.status(500).json({ error: 'حدث خطأ أثناء تسجيل الخروج' });
    }
    res.clearCookie('connect.sid');
    res.json({ message: 'تم تسجيل الخروج بنجاح' });
  });
});

router.get('/me', (req: Request, res: Response) => {
  const session = (req as any).session;
  if (!session.adminId) {
    return res.status(401).json({ error: 'غير مصرح' });
  }

  res.json({
    id: session.adminId,
    username: session.adminUsername,
    email: session.adminEmail,
  });
});

router.post('/setup-first-admin', async (req: Request, res: Response) => {
  try {
    const existingAdmins = await db.select().from(adminUsers).limit(1);
    
    if (existingAdmins.length > 0) {
      return res.status(400).json({ error: 'يوجد حساب إدمن بالفعل. استخدم صفحة تسجيل الدخول.' });
    }

    const { username, password, email } = req.body;

    if (!username || !password || !email) {
      return res.status(400).json({ error: 'جميع الحقول مطلوبة' });
    }

    console.log('🔐 إنشاء أول حساب إدمن...');

    const [newAdmin] = await db.insert(adminUsers).values({
      username,
      email,
      password: password,
      role: 'admin',
      isActive: true,
    }).returning();

    console.log('✅ تم إنشاء حساب الإدمن:', newAdmin.username);

    res.json({
      success: true,
      message: 'تم إنشاء حساب الإدمن بنجاح',
      admin: {
        id: newAdmin.id,
        username: newAdmin.username,
        email: newAdmin.email,
      }
    });
  } catch (error) {
    console.error('❌ خطأ في إنشاء حساب الإدمن:', error);
    res.status(500).json({ error: 'حدث خطأ أثناء إنشاء الحساب' });
  }
});

export function requireAdmin(req: Request, res: Response, next: any) {
  const session = (req as any).session;
  if (!session.adminId) {
    return res.status(401).json({ error: 'غير مصرح - يجب تسجيل الدخول' });
  }
  next();
}

export default router;
