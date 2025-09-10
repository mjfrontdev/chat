# فونت‌های YekanBakh

این پوشه برای قرار دادن فایل‌های فونت YekanBakh استفاده می‌شود.

## فایل‌های مورد نیاز

لطفاً فایل‌های زیر را در این پوشه قرار دهید:

- `YekanBakh-Regular.ttf` - وزن معمولی (400)
- `YekanBakh-Bold.ttf` - وزن پررنگ (700)
- `YekanBakh-ExtraBlack.ttf` - وزن فوق‌العاده پررنگ (900)

## دانلود فونت

می‌توانید فونت YekanBakh را از لینک‌های زیر دانلود کنید:

- [دانلود از GitHub](https://github.com/rastikerdar/vazir-font)
- [دانلود از فونت‌ایران](https://fontiran.com/font/yekan-bakh)

## استفاده

فونت‌ها به صورت خودکار در فایل `main.css` تعریف شده‌اند:

```css
@font-face {
    font-family: 'YekanBakh';
    src: url('../fonts/YekanBakh-Regular.ttf') format('truetype');
    font-weight: 400;
    font-style: normal;
    font-display: swap;
}
```

## نکات مهم

1. **حق کپی**: لطفاً قوانین کپی‌رایت فونت را رعایت کنید
2. **بهینه‌سازی**: فایل‌های فونت را بهینه‌سازی کنید تا سرعت بارگذاری بهبود یابد
3. **پشتیبانی مرورگر**: فونت‌های TTF با اکثر مرورگرهای مدرن سازگار هستند

## جایگزین

اگر فایل‌های فونت در دسترس نیستند، سیستم به صورت خودکار از فونت‌های سیستم استفاده خواهد کرد:

```css
font-family: 'YekanBakh', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
```
