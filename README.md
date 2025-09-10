# 💬 Chat App - بازطراحی شده

یک اپلیکیشن چت آنلاین مدرن و زیبا با استفاده از تکنولوژی‌های پیشرفته.

## ✨ ویژگی‌های جدید

### 🎨 طراحی مدرن
- **فونت YekanBakh**: فونت فارسی زیبا و خوانا
- **رنگ‌بندی حرفه‌ای**: استفاده از رنگ‌های Ant Design
- **طراحی ریسپانسیو**: سازگار با تمام دستگاه‌ها
- **انیمیشن‌های نرم**: استفاده از GSAP و AOS

### 🚀 تکنولوژی‌های استفاده شده

#### Frontend
- **Bootstrap 5.3**: فریمورک CSS مدرن
- **Ant Design**: کامپوننت‌های حرفه‌ای
- **GSAP**: انیمیشن‌های پیشرفته
- **AOS**: انیمیشن‌های scroll
- **SweetAlert2**: نوتیفیکیشن‌های زیبا
- **jQuery 3.7.1**: کتابخانه JavaScript

#### Backend
- **PHP 8.2+**: زبان برنامه‌نویسی
- **MySQL/MariaDB**: پایگاه داده
- **PDO**: اتصال امن به دیتابیس

### 🎯 ویژگی‌های اصلی

#### 🔐 احراز هویت
- ورود و ثبت‌نام کاربران
- هش کردن رمز عبور
- مدیریت session

#### 💬 چت آنلاین
- ارسال و دریافت پیام‌های فوری
- نمایش وضعیت آنلاین/آفلاین
- علامت‌گذاری پیام‌های خوانده شده
- انیمیشن‌های زیبا برای پیام‌ها

#### 🎨 رابط کاربری
- طراحی RTL برای فارسی
- انیمیشن‌های hover و click
- Toast notification ها
- Loading animation ها

## 📁 ساختار پروژه

```
chat/
├── assets/
│   ├── css/
│   │   ├── main.css          # استایل‌های اصلی
│   │   └── animations.css    # انیمیشن‌ها
│   ├── js/
│   │   ├── main.js          # منطق اصلی
│   │   ├── animations.js    # کنترلر انیمیشن‌ها
│   │   └── toast.js         # مدیریت نوتیفیکیشن‌ها
│   ├── fonts/               # فونت‌های YekanBakh
│   └── images/              # تصاویر
├── includes/
│   ├── config.php           # تنظیمات
│   ├── db.php              # کلاس دیتابیس
│   └── functions.php       # توابع کمکی
├── ajax/
│   ├── send_message.php    # ارسال پیام
│   ├── get_messages.php    # دریافت پیام‌ها
│   └── update_status.php   # به‌روزرسانی وضعیت
├── index.php               # صفحه ورود
├── chat.php               # صفحه چت
├── logout.php             # خروج
└── chat_db.sql           # دیتابیس
```

## 🚀 نصب و راه‌اندازی

### پیش‌نیازها
- XAMPP یا WAMP
- PHP 8.2+
- MySQL 5.7+ یا MariaDB 10.4+
- مرورگر مدرن

### مراحل نصب

1. **دانلود پروژه**
   ```bash
   git clone [repository-url]
   cd chat
   ```

2. **راه‌اندازی دیتابیس**
   - XAMPP را اجرا کنید
   - phpMyAdmin را باز کنید
   - دیتابیس `chat_db` ایجاد کنید
   - فایل `chat_db.sql` را import کنید

3. **تنظیمات**
   - فایل `includes/config.php` را ویرایش کنید
   - اطلاعات دیتابیس را بررسی کنید

4. **اجرای پروژه**
   - پروژه را در پوشه `htdocs` قرار دهید
   - مرورگر را باز کنید و به `http://localhost/1/chat` بروید

## 🎨 سفارشی‌سازی

### تغییر رنگ‌ها
فایل `assets/css/main.css` را ویرایش کنید:

```css
:root {
    --primary-color: #1890ff;    /* رنگ اصلی */
    --success-color: #52c41a;    /* رنگ موفقیت */
    --warning-color: #faad14;    /* رنگ هشدار */
    --error-color: #ff4d4f;      /* رنگ خطا */
}
```

### اضافه کردن انیمیشن
فایل `assets/js/animations.js` را ویرایش کنید:

```javascript
// انیمیشن سفارشی
gsap.fromTo(element, 
    { opacity: 0, y: 50 },
    { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }
);
```

## 📱 ویژگی‌های موبایل

- طراحی ریسپانسیو
- منوی کشویی برای لیست کاربران
- بهینه‌سازی برای لمس
- انیمیشن‌های مناسب موبایل

## 🔧 تنظیمات پیشرفته

### AOS (Animate On Scroll)
```html
<div data-aos="fade-up" data-aos-duration="800">
    محتوا
</div>
```

### GSAP Timeline
```javascript
const tl = gsap.timeline();
tl.fromTo(element, {x: -100}, {x: 0, duration: 1});
```

### SweetAlert2
```javascript
Swal.fire({
    title: 'عنوان',
    text: 'متن',
    icon: 'success'
});
```

## 🐛 عیب‌یابی

### مشکلات رایج

1. **خطای اتصال به دیتابیس**
   - تنظیمات `config.php` را بررسی کنید
   - مطمئن شوید MySQL در حال اجرا است

2. **انیمیشن‌ها کار نمی‌کنند**
   - CDN های GSAP و AOS را بررسی کنید
   - Console مرورگر را چک کنید

3. **فونت‌ها نمایش داده نمی‌شوند**
   - فایل‌های فونت را در پوشه `assets/fonts` قرار دهید
   - مسیر فونت‌ها را بررسی کنید
## 🤝 مشارکت

برای مشارکت در پروژه:
1. Fork کنید
2. Branch جدید ایجاد کنید
3. تغییرات را commit کنید
4. Pull request ارسال کنید

## 📞 پشتیبانی

برای پشتیبانی و گزارش باگ:
- ایمیل: [mahsanmaji@gmail.com]
---
