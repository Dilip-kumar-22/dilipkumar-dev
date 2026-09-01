import { chromium } from 'playwright';
const b = await chromium.launch({ channel: 'chrome', headless: true });
const p = await b.newPage();
await p.goto('http://localhost:3001/resume', { waitUntil: 'networkidle', timeout: 45000 });
await p.emulateMedia({ media: 'print' });
await p.waitForTimeout(2500);
// preferCSSPageSize lets the @page rule in resume.css own the size AND the
// margins. Passing `margin` here as well applies them twice and pushes the
// right-hand column off the sheet.
await p.pdf({
  path: 'public/Dilip-Kumar-Resume.pdf',
  format: 'A4',
  printBackground: true,
  margin: { top: '12mm', bottom: '12mm', left: '13mm', right: '13mm' },
});
console.log('PDF written');
await b.close();
