import { chromium } from 'playwright';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';

const OUT = String.raw`${'C:/Users/DILIPK~1/AppData/Local/Temp/claude/C--Users-Dilip-Kumar-Documents-ENGLISH/f6685e5b-12df-40f7-a063-12eb927d9d1c/scratchpad/fridayvid'}`;
const b = await chromium.launch({
  channel: 'chrome', headless: false,
  args: ['--disable-renderer-backgrounding','--disable-backgrounding-occluded-windows','--disable-features=CalculateNativeWinOcclusion'],
});
// Record at the size the terminal actually occupies, so the clip is not
// mostly empty page below the app.
const ctx = await b.newContext({
  viewport: { width: 1440, height: 706 },
  recordVideo: { dir: OUT, size: { width: 1440, height: 706 } },
});
const p = await ctx.newPage();
await p.goto(pathToFileURL(resolve('asset/friday/friday-walkthrough-standalone.html')).href, { waitUntil: 'networkidle' });

// The transport bar is player chrome, not part of the product — hide it.
await p.addStyleTag({ content: `
  [class*="control"], [class*="player"], [class*="transport"], [class*="scrub"],
  input[type=range] { display: none !important; }
` });
await p.evaluate(() => {
  // also hide any fixed bar sitting at the bottom of the viewport
  for (const el of document.querySelectorAll('*')) {
    const cs = getComputedStyle(el);
    if ((cs.position === 'fixed' || cs.position === 'absolute') &&
        el.getBoundingClientRect().top > innerHeight * 0.85 &&
        el.querySelector('button')) {
      el.style.display = 'none';
    }
  }
});

// let the 62s replay run to the end
await p.waitForTimeout(65000);
await ctx.close();
await b.close();
console.log('recorded to', OUT);
