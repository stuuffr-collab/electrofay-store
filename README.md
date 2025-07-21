# 🔥 إلكتروفاي - Electrofy Store

متجر إلكتروني احترافي مخصص لبيع إكسسوارات القيمنج والإلكترونيات في ليبيا مع نظام طلبات واتساب متطور.

[![Vercel](https://vercelbadges.vercel.app/deploy)](https://vercel.com) 
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## ✨ المميزات الرئيسية

- 🛒 **متجر إلكتروني كامل** - 20+ منتج مع أوصاف عربية وإنجليزية
- 📱 **نظام واتساب للطلبات** - طلبات مباشرة عبر واتساب مع تفاصيل العميل
- 🎨 **تصميم متجاوب** - يعمل بشكل مثالي على جميع الأجهزة
- 🌙 **الوضع المظلم/الفاتح** - تبديل تلقائي حسب تفضيل المستخدم
- ⚡ **أداء عالي** - PWA جاهز مع تحميل سريع
- 🔍 **محسن للسيو** - meta tags شاملة و sitemap تلقائي
- 📊 **تحليلات متقدمة** - تتبع Google Analytics للزيارات والتحويلات
- 🎯 **استهداف ليبيا** - رسوم توصيل للمدن الليبية
- 🏆 **آراء العملاء** - قسم مخصص لتقييمات وآراء العملاء
- ⏱️ **عروض محدودة الوقت** - عدادات تنازلية للعروض الخاصة

## 🚀 التقنيات المستخدمة

### Frontend
- **React 18** - مكتبة JavaScript حديثة
- **TypeScript** - للكتابة الآمنة والموثوقة
- **Vite** - أداة بناء سريعة
- **Tailwind CSS** - تصميم utility-first
- **Wouter** - routing خفيف الوزن
- **TanStack Query** - إدارة حالة الخادم
- **Radix UI** - مكونات UI accessible

### Backend
- **Express.js** - خادم Node.js
- **TypeScript** - للكتابة الآمنة
- **Drizzle ORM** - ORM حديث ومرن
- **PostgreSQL** - قاعدة بيانات قوية

### Production Features
- **PWA Support** - تطبيق ويب تقدمي
- **Google Analytics** - تتبع الزيارات والأحداث
- **Hot Toast** - إشعارات تفاعلية
- **React Share** - مشاركة المنتجات
- **Countdown Timers** - عدادات العروض
- **Responsive Design** - تصميم متجاوب كامل

## 📦 إعداد المشروع

### المتطلبات
- Node.js 18+ 
- npm أو yarn
- PostgreSQL (اختياري للتطوير)

### التثبيت

```bash
# استنساخ المشروع
git clone https://github.com/your-username/electrofy-store.git
cd electrofy-store

# تثبيت التبعيات
npm install

# إعداد متغيرات البيئة
cp .env.example .env
```

### متغيرات البيئة

```env
# Google Analytics (اختياري)
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# reCAPTCHA (للحماية)
VITE_RECAPTCHA_SITE_KEY=6LeXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
RECAPTCHA_SECRET_KEY=6LeXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

# قاعدة البيانات (اختياري)
DATABASE_URL=postgresql://user:password@localhost:5432/electrofy
```

### التشغيل للتطوير

```bash
# تشغيل الخادم المحلي
npm run dev

# المشروع سيعمل على http://localhost:5000
```

### البناء للإنتاج

```bash
# بناء المشروع
npm run build

# معاينة البناء
npm run preview
```

## 📁 هيكل المشروع

```
electrofy-store/
├── client/                 # تطبيق React
│   ├── src/
│   │   ├── components/     # مكونات UI
│   │   ├── pages/         # صفحات التطبيق
│   │   ├── hooks/         # React hooks مخصصة
│   │   ├── lib/           # مكتبات مساعدة
│   │   ├── data/          # بيانات المنتجات والمدن
│   │   └── styles/        # ملفات التصميم
│   └── public/            # ملفات عامة
├── server/                # خادم Express
│   ├── api/              # مسارات API
│   └── index.ts          # نقطة دخول الخادم
├── shared/               # أنواع مشتركة
└── docs/                 # توثيق ولقطات شاشة
```

## 🛍️ إضافة منتج جديد

### 1. تحديث ملف البيانات

```json
// client/src/data/products.json
{
  "id": "product-id",
  "name": "اسم المنتج بالعربية",
  "nameEn": "Product Name in English",
  "description": "وصف المنتج بالعربية",
  "descriptionEn": "Product description in English",
  "price": 150,
  "originalPrice": 200,
  "category": "gaming", // أو "electronics"
  "image": "https://example.com/image.jpg",
  "rating": 4.5,
  "badges": ["خصم 25%", "جديد"],
  "inStock": true,
  "stockCount": 10
}
```

### 2. إضافة صور WebP محسنة

```bash
# تحويل الصور إلى WebP (600×400)
npx @squoosh/cli --webp auto input.jpg
```

## 🎨 تخصيص التصميم

### الألوان

```css
/* client/src/styles/tokens.css */
:root {
  --color-primary: #FFD700;        /* الذهبي */
  --color-primary-dark: #FFB300;   /* الذهبي الداكن */
  --color-secondary: #1E40AF;      /* الأزرق */
  --color-accent: #F59E0B;         /* البرتقالي */
}
```

### إضافة مكون جديد

```tsx
// client/src/components/NewComponent.tsx
import { Button } from "@/components/ui/button";

export function NewComponent() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6">
      <h2 className="text-2xl font-bold mb-4">عنوان المكون</h2>
      <Button className="bg-gradient-to-r from-[#FFD700] to-[#FFB300]">
        زر جديد
      </Button>
    </div>
  );
}
```

## 📱 رقم واتساب

لتغيير رقم واتساب المتجر:

```typescript
// client/src/lib/whatsapp.ts
const WHATSAPP_NUMBER = "218922569912"; // رقمك الجديد
```

## 📊 تحليلات جوجل

### إعداد Google Analytics

1. أنشئ حساب على [Google Analytics](https://analytics.google.com)
2. أنشئ خاصية جديدة لموقعك
3. احصل على Measurement ID (يبدأ بـ G-)
4. أضفه إلى `.env`:

```env
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

### الأحداث المتتبعة

- `view_item` - عرض منتج
- `add_to_cart` - الضغط على "اطلب الآن"
- `purchase_intent` - فتح نموذج الطلب
- `whatsapp_open` - فتح واتساب

## 🚀 نشر المشروع

### Vercel (موصى به)

```bash
# تثبيت Vercel CLI
npm i -g vercel

# نشر المشروع
vercel --prod
```

### إعدادات Vercel

1. ربط مستودع GitHub
2. تعيين متغيرات البيئة
3. إعداد Domain مخصص (اختياري)

### متطلبات الإنتاج

- ✅ HTTPS مفعل
- ✅ HSTS headers
- ✅ Compression enabled
- ✅ CDN للأصول الثابتة
- ✅ Performance score ≥ 90
- ✅ SEO score ≥ 95

## 📈 Lighthouse النتائج

بعد النشر، قم بتشغيل Lighthouse test:

```bash
# تثبيت Lighthouse
npm install -g lighthouse

# تشغيل الاختبار
lighthouse https://your-domain.com --output html --output-path ./docs/lighthouse-report.html
```

**الأهداف:**
- Performance: ≥ 90
- Accessibility: ≥ 95
- Best Practices: ≥ 90
- SEO: ≥ 95

## 🛡️ الأمان

- ✅ Input validation
- ✅ XSS protection
- ✅ CSRF protection
- ✅ Rate limiting
- ✅ Secure headers
- ✅ Environment variables

## 🤝 المساهمة

1. Fork المشروع
2. أنشئ branch جديد (`git checkout -b feature/amazing-feature`)
3. Commit التغييرات (`git commit -m 'Add some amazing feature'`)
4. Push إلى Branch (`git push origin feature/amazing-feature`)
5. افتح Pull Request

## 📞 الدعم

- واتساب: [+218922569912](https://wa.me/218922569912)
- Email: support@electrofy-store.com
- الموقع: [electrofy-store.vercel.app](https://electrofy-store.vercel.app)

## 📄 الترخيص

هذا المشروع مرخص تحت رخصة MIT - راجع ملف [LICENSE](LICENSE) للتفاصيل.

## 🙏 شكر وتقدير

- [Shadcn/ui](https://ui.shadcn.com/) للمكونات الجميلة
- [Lucide](https://lucide.dev/) للأيقونات الرائعة
- [Tailwind CSS](https://tailwindcss.com/) للتصميم السريع
- [Unsplash](https://unsplash.com/) للصور عالية الجودة

---

**صنع بـ ❤️ في ليبيا**