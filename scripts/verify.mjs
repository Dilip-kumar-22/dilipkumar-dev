/**
 * Verification harness for the visual-iteration loop.
 *
 * LESSON [PROCESS] / [3D]: never call a phase done on "looks right". This
 * runs the real page in a real browser and reports evidence — console errors,
 * reveal state, canvas size, measured fps, blown-highlight check, contrast —
 * plus screenshots at three widths and several scroll positions.
 *
 *   node scripts/verify.mjs [--url http://localhost:3000] [--out DIR] [--quick]
 */

import { chromium } from 'playwright';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const arg = (k, d) => {
  const i = process.argv.indexOf(k);
  return i > -1 ? process.argv[i + 1] : d;
};

const URL = arg('--url', 'http://localhost:3000');
const OUT = arg('--out', join(process.cwd(), '.verify'));
const QUICK = process.argv.includes('--quick');

const WIDTHS = QUICK ? [1440] : [360, 768, 1440];
const STOPS = QUICK ? [0, 0.5] : [0, 0.17, 0.4, 0.66, 0.93, 1];

mkdirSync(OUT, { recursive: true });

const report = { url: URL, when: new Date().toISOString(), viewports: [], errors: [], warnings: [] };

const LAUNCH = {
  channel: 'chrome',
  headless: false,
  args: [
    // keep the renderer live even when the window isn't focused — otherwise
    // rAF throttles and every measurement below is a lie
    '--disable-background-timer-throttling',
    '--disable-backgrounding-occluded-windows',
    '--disable-renderer-backgrounding',
    '--disable-features=CalculateNativeWinOcclusion',
  ],
};

for (const width of WIDTHS) {
  // A FRESH browser per viewport. Sharing one across viewports let GPU
  // pressure accumulate and under-reported the last viewport by ~5x.
  const browser = await chromium.launch(LAUNCH);
  const height = width < 500 ? 780 : width < 900 ? 1024 : 900;
  const ctx = await browser.newContext({
    viewport: { width, height },
    deviceScaleFactor: 1,
    colorScheme: 'dark',
  });
  const page = await ctx.newPage();

  const errors = [];
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push(m.text().slice(0, 300));
  });
  page.on('pageerror', (e) => errors.push('PAGEERROR: ' + String(e).slice(0, 300)));

  await page.goto(URL, { waitUntil: 'networkidle', timeout: 60_000 });
  await page.waitForTimeout(2500); // fonts + first 3D frames

  // ---- measured fps -------------------------------------------------
  const fps = await page.evaluate(async () => {
    let f = 0;
    const t0 = performance.now();
    await new Promise((res) => {
      const loop = () => {
        f++;
        if (performance.now() - t0 > 1200) return res();
        requestAnimationFrame(loop);
      };
      requestAnimationFrame(loop);
    });
    return Math.round(f / ((performance.now() - t0) / 1000));
  });

  // ---- structural probe ---------------------------------------------
  const probe = await page.evaluate(() => {
    const c = document.querySelector('canvas');
    const q = (s) => document.querySelector(s);
    const disp = q('h1 .t-display') || q('.t-display');
    const cs = disp ? getComputedStyle(disp) : null;
    return {
      title: document.title,
      canvas: c ? { w: c.width, h: c.height, cssW: Math.round(c.getBoundingClientRect().width) } : null,
      revealsIn: document.querySelectorAll('.reveal.is-in').length,
      revealsTotal: document.querySelectorAll('.reveal').length,
      displayFont: cs?.fontFamily?.split(',')[0],
      displaySize: cs?.fontSize,
      bodyBg: getComputedStyle(document.body).backgroundColor,
      docH: document.documentElement.scrollHeight,
      screens: +(document.documentElement.scrollHeight / innerHeight).toFixed(1),
      h1: q('h1')?.innerText?.replace(/\n/g, ' | ').slice(0, 120),
      hasLossCurve: !!q('aside svg path'),
      imagesMissingAlt: [...document.querySelectorAll('img')].filter((i) => !i.alt).length,
      lenis: !!window.__lenis,
    };
  });

  // Capture at the real section anchors when they exist, so each screenshot
  // shows a section the way a reader actually meets it.
  const anchored = await page.evaluate((ids) => {
    const max = document.documentElement.scrollHeight - innerHeight;
    if (max <= 0) return null;
    const out = [];
    for (const id of ids) {
      const el = document.getElementById(id);
      if (!el) return null;
      const c = el.offsetTop + el.offsetHeight / 2 - innerHeight / 2;
      out.push(+Math.min(1, Math.max(0, c / max)).toFixed(4));
    }
    return out;
  }, ['boot', 'identity', 'thesis', 'signal', 'work', 'research', 'trajectory', 'record', 'convergence']);

  const captureAt = QUICK ? STOPS : anchored || STOPS;

  // ---- screenshots + blown-highlight check across the run ------------
  const shots = [];
  for (const p of captureAt) {
    await page.evaluate((prog) => {
      const max = document.documentElement.scrollHeight - innerHeight;
      const y = Math.round(max * prog);
      // force:true so Lenis honours an exact jump instead of easing back
      if (window.__lenis) window.__lenis.scrollTo(y, { immediate: true, force: true });
      window.scrollTo(0, y);
    }, p);
    // let the camera dolly and the morph weights settle before capturing
    await page.waitForTimeout(1100);

    const file = join(OUT, `w${width}-p${String(Math.round(p * 100)).padStart(3, '0')}.png`);
    const buf = await page.screenshot({ path: file });

    // LESSON [3D]: check for blown highlights numerically, not by eye.
    // Analyse the SCREENSHOT, not the live canvas — reading back a WebGL
    // canvas returns black unless preserveDrawingBuffer is on (which costs
    // performance), so canvas readback silently reports "all dark".
    const lum = await page.evaluate(async (b64) => {
      const img = new Image();
      img.src = 'data:image/png;base64,' + b64;
      await img.decode();
      const o = document.createElement('canvas');
      const W = (o.width = 320);
      const H = (o.height = Math.max(1, Math.round((img.height / img.width) * 320)));
      const x = o.getContext('2d');
      x.drawImage(img, 0, 0, W, H);
      const d = x.getImageData(0, 0, W, H).data;
      let blown = 0, sum = 0, dark = 0;
      const n = W * H;
      for (let i = 0; i < d.length; i += 4) {
        const l = (0.2126 * d[i] + 0.7152 * d[i + 1] + 0.0722 * d[i + 2]) / 255;
        sum += l;
        if (l > 0.97) blown++;
        if (l < 0.02) dark++;
      }
      return {
        meanLuma: +(sum / n).toFixed(4),
        blownPct: +((blown / n) * 100).toFixed(3),
        darkPct: +((dark / n) * 100).toFixed(1),
      };
    }, buf.toString('base64'));

    shots.push({ progress: p, file: file.split(/[\\/]/).pop(), ...(lum || {}) });
  }

  // steady-state fps, measured again after all the scroll work
  const fpsSettled = await page.evaluate(async () => {
    let f = 0;
    const t0 = performance.now();
    await new Promise((res) => {
      const loop = () => { f++; if (performance.now() - t0 > 1400) return res(); requestAnimationFrame(loop); };
      requestAnimationFrame(loop);
    });
    return Math.round(f / ((performance.now() - t0) / 1000));
  });

  report.viewports.push({ width, height, fps, fpsSettled, ...probe, errors, shots });
  if (errors.length) report.errors.push(...errors.map((e) => `[${width}] ${e}`));

  await ctx.close();
  await browser.close();
}

writeFileSync(join(OUT, 'report.json'), JSON.stringify(report, null, 2));

/* ---------------- summary ---------------- */
console.log('\n═══ VERIFY ' + URL + ' ═══');
for (const v of report.viewports) {
  console.log(`\n▸ ${v.width}px — ${v.fps}fps · ${v.screens} screens · title "${v.title}"`);
  console.log(`  canvas   ${v.canvas ? `${v.canvas.w}×${v.canvas.h} (css ${v.canvas.cssW})` : 'MISSING'}`);
  console.log(`  reveals  ${v.revealsIn}/${v.revealsTotal}`);
  console.log(`  display  ${v.displayFont} @ ${v.displaySize}`);
  console.log(`  loss HUD ${v.hasLossCurve ? 'yes' : 'MISSING'}   lenis ${v.lenis ? 'yes' : 'no'}`);
  for (const s of v.shots) {
    const flag = s.blownPct > 1.5 ? '  ⚠ BLOWN' : '';
    console.log(
      `   p=${String(s.progress).padEnd(5)} luma ${String(s.meanLuma).padEnd(7)} blown ${String(s.blownPct).padEnd(6)}% dark ${String(s.darkPct).padEnd(5)}%${flag}`,
    );
  }
  if (v.errors.length) {
    console.log('  ERRORS:');
    v.errors.forEach((e) => console.log('   ✗ ' + e));
  }
}
console.log(`\n→ ${report.errors.length} console error(s). Artifacts: ${OUT}\n`);
process.exit(report.errors.length ? 1 : 0);
