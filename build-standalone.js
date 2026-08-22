const { readFileSync, writeFileSync } = require('fs');

const html = readFileSync('index.html', 'utf8');
const css = readFileSync('src/styles.css', 'utf8');
const js = readFileSync('src/app.js', 'utf8');

const standalone = html
  .replace('<link rel="stylesheet" href="src/styles.css" />', `<style>\n${css}\n</style>`)
  .replace('<script src="src/app.js"></script>', `<script>\n${js.replaceAll('</script>', '<\\/script>')}\n</script>`);

writeFileSync('workout-planner.html', standalone);
console.log('✅ فایل workout-planner.html ساخته شد. آن را روی کامپیوترتان دانلود کنید و دوبار کلیک کنید.');
