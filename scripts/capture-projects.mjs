/** Capture REAL screenshots of Dilip's live projects. No mockups, no fakes. */
import { chromium } from 'playwright';

const TARGETS = [
  { name: 'typing-master', url: 'https://dilip-kumar-22.github.io/typing-master-scorp/', wait: 5000 },
  { name: 'orbit',         url: 'https://dilip-kumar-22.github.io/orbit/',              wait: 6000 },
  { name: 'shanghai-48h',  url: 'https://dilip-kumar-22.github.io/shanghai-48h/',        wait: 6000 },
];

const b = await chromium.launch({
  channel: 'chrome', headless: false,
  args: ['--disable-renderer-backgrounding','--disable-backgrounding-occluded-windows','--disable-features=CalculateNativeWinOcclusion'],
});

for (const t of TARGETS) {
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
  const page = await ctx.newPage();
  try {
    await page.goto(t.url, { waitUntil: 'networkidle', timeout: 45000 });
    await page.waitForTimeout(t.wait);
    await page.screenshot({ path: `public/shots/${t.name}.png` });
    const info = await page.evaluate(() => ({
      title: document.title,
      h1: document.querySelector('h1,h2')?.innerText?.slice(0, 60) || null,
      canvas: document.querySelectorAll('canvas').length,
    }));
    console.log(`${t.name.padEnd(15)} OK  "${info.title}" · canvas ${info.canvas}`);
  } catch (e) {
    console.log(`${t.name.padEnd(15)} FAIL ${String(e).slice(0, 90)}`);
  }
  await ctx.close();
}
await b.close();
