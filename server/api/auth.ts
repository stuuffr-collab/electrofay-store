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

    if (!username || !password) {
      return res.status(400).json({ error: 'اسم المستخدم وكلمة المرور مطلوبة' });
    }

    const admin = await db.select()
      .from(adminUsers)
      .where(eq(adminUsers.username, username))
      .limit(1);

    if (!admin || admin.length === 0) {
      return res.status(401).json({ error: 'اسم المستخدم أو كلمة المرور غير صحيحة' });
    }

    const adminUser = admin[0];

    if (!adminUser.isActive) {
      return res.status(403).json({ error: 'هذا الحساب غير نشط' });
    }

    const isValidPassword = await bcrypt.compare(password, adminUser.passwordHash);

    if (!isValidPassword) {
      return res.status(401).json({ error: 'اسم المستخدم أو كلمة المرور غير صحيحة' });
    }

    await db.update(adminUsers)
      .set({ lastLogin: new Date() })
      .where(eq(adminUsers.id, adminUser.id));

    const session = req.session as any;
    session.adminId = adminUser.id;
    session.adminUsername = adminUser.username;
    session.adminEmail = adminUser.email;

    res.json({
      id: adminUser.id,
      username: adminUser.username,
      email: adminUser.email,
      role: adminUser.role,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'حدث خطأ أثناء تسجيل الدخول' });
  }
});

router.post('/logout', (req: Request, res: Response) => {
  const session = req.session as any;
  req.session.destroy((err: any) => {
    if (err) {
      return res.status(500).json({ error: 'حدث خطأ أثناء تسجيل الخروج' });
    }
    res.clearCookie('connect.sid');
    res.json({ message: 'تم تسجيل الخروج بنجاح' });
  });
});

router.get('/me', (req: Request, res: Response) => {
  const session = req.session as any;
  if (!session.adminId) {
    return res.status(401).json({ error: 'غير مصرح' });
  }

  res.json({
    id: session.adminId,
    username: session.adminUsername,
    email: session.adminEmail,
  });
});

export function requireAdmin(req: Request, res: Response, next: any) {
  const session = req.session as any;
  if (!session.adminId) {
    return res.status(401).json({ error: 'غير مصرح - يجب تسجيل الدخول' });
  }
  next();
}

export default router;
