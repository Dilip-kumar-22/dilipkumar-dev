import { chromium } from 'playwright';
const b = await chromium.launch({ channel: 'chrome', headless: true });
const p = await b.newPage();
await p.goto('http://localhost:3001/resume', { waitUntil: 'networkidle', timeout: 45000 });
await p.emulateMedia({ media: 'print' });
await p.waitForTimeout(2500);
// The @page rule in resume.css owns size AND margins. Chrome ignores a
// `margin` option here whenever @page declares one, so passing both is how
// you end up with a silently margin-less PDF.
await p.pdf({
  path: 'public/Dilip-Kumar-Resume.pdf',
  printBackground: true,
  preferCSSPageSize: true,
});
console.log('PDF written');
await b.close();
