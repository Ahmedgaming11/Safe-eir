require('dotenv').config();
const express = require('express');
const httpProxy = require('http-proxy');
const crypto = require('crypto-js');
const path = require('path');

const app = express();
const proxy = httpProxy.createProxyServer();

// قائمة بالمواقع المسموح بها
const allowedSites = ["https://www.google.com", "https://www.example.com", "https://www.wikipedia.org"]; // يمكنك إضافة المزيد من المواقع هنا

// دالة لفحص أمان الموقع
function isSecureSite(url) {
  return allowedSites.some(site => url.startsWith(site));
}

// تقديم الملفات الثابتة من المجلد العام
app.use(express.static(path.join(__dirname, 'public')));

// توجيه الطلبات إلى الموقع المحدد بعد التحقق من الأمان
app.get('/search', (req, res) => {
  const targetUrl = req.query.q; // نحصل على الرابط من استعلام البحث
  if (isSecureSite(targetUrl)) {
    proxy.web(req, res, { target: targetUrl, changeOrigin: true });
  } else {
    res.status(403).send("عذرًا، هذا الموقع غير آمن ولن يُسمح بفتحه.");
  }
});

// بدء الخادم على المنفذ 3000
app.listen(3000, () => {
  console.log('الخادم يعمل على http://localhost:3000');
});