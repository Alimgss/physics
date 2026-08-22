const http = require('http');
const { createReadStream, existsSync } = require('fs');
const { extname, join, normalize } = require('path');
const { networkInterfaces } = require('os');

const port = Number(process.env.PORT || 5173);
const host = '0.0.0.0';
const root = process.cwd();

const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
};

function localAddresses() {
  return Object.values(networkInterfaces())
    .flat()
    .filter((item) => item && item.family === 'IPv4' && !item.internal)
    .map((item) => item.address);
}

function safePath(url) {
  const cleanUrl = decodeURIComponent(url.split('?')[0]);
  const requested = cleanUrl === '/' ? '/index.html' : cleanUrl;
  const filePath = normalize(join(root, requested));
  return filePath.startsWith(root) ? filePath : join(root, 'index.html');
}

const server = http.createServer((request, response) => {
  const filePath = safePath(request.url || '/');
  if (!existsSync(filePath)) {
    response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    response.end('فایل پیدا نشد');
    return;
  }

  response.writeHead(200, { 'Content-Type': mimeTypes[extname(filePath)] || 'application/octet-stream' });
  createReadStream(filePath).pipe(response);
});

server.listen(port, host, () => {
  console.log('\n✅ اپ برنامه‌ساز بدنسازی اجرا شد');
  console.log(`   Local:   http://localhost:${port}/`);
  for (const address of localAddresses()) console.log(`   Network: http://${address}:${port}/`);
  console.log('\nاگر داخل محیط آنلاین هستید، از بخش Preview/Ports همین پورت را باز کنید.');
});
