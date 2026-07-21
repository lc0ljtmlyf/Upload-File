# 🚀 سیستم آپلود فایل حرفه‌ای

یک اپلیکیشن وب حرفه‌ای برای آپلود، ذخیره‌سازی و مدیریت فایل‌ها

## ✨ ویژگی‌ها

✅ ثبت نام و ورود - سیستم احراز هویت کامل  
✅ آپلود مهمان - بدون نیاز به ثبت نام  
✅ داشبورد شخصی - مشاهده و مدیریت فایل‌های خود  
✅ دانلود مستقیم - دانلود سریع و آسان فایل‌ها  
✅ حذف فایل - مدیریت کامل فایل‌های آپلود شده  
✅ آمار و نمودار - مشاهده آمار دانلودها و فایل‌ها  
✅ طراحی ریسپانسیو - کار بر روی تمام دستگاه‌ها  
✅ پشتیبانی فارسی - رابط کاربری به‌صورت کامل فارسی  

## 🛠️ فناوری‌های استفاده شده

- Backend: Node.js + Express.js
- Database: MongoDB
- Frontend: HTML5 + CSS3 + Bootstrap 5 + JavaScript
- Authentication: Passport.js + Express-session
- File Upload: Multer
- Security: bcryptjs

## 📋 نیازمندی‌ها

- Node.js >= 14
- MongoDB >= 4.0
- npm یا yarn

## 🚀 نصب و راه‌اندازی

### 1. Clone کردن پروژه
```bash
git clone https://github.com/yourusername/Upload-File.git
cd Upload-File
```

### 2. نصب وابستگی‌ها
```bash
npm install
```

### 3. تنظیم متغیرهای محیطی
```bash
cp .env.example .env
```

### 4. اجرای سرور
```bash
npm run dev
```

سرور در `http://localhost:3000` اجرا می‌شود.

## 📁 ساختار پروژه

```
Upload-File/
├── models/           # مدل‌های MongoDB
├── routes/           # مسیرهای API
├── views/            # صفحات EJS
├── public/           # فایل‌های استاتیک
├── server.js         # فایل اصلی
└── package.json
```

## 🔒 امنیت

- رمزهای عبور با bcryptjs هش می‌شوند
- جلسات ایمن با express-session
- حد اندازه فایل 100MB
- انواع فایل مجاز محدود شده‌اند

## 📝 API Endpoints

- POST /api/auth/register - ثبت نام
- POST /api/auth/login - ورود
- POST /api/auth/logout - خروج
- POST /api/upload - آپلود فایل
- GET /api/files - لیست فایل‌ها
- DELETE /api/files/:id - حذف فایل

## 📄 لایسنس

ISC License
