import * as THREE from 'three';

/**
 * The player card face, drawn to a 2D canvas and used as a texture.
 *
 * Drawing it in 2D rather than as 3D geometry is deliberate: it is the only
 * way to get genuinely crisp typography on a surface that tilts in space.
 *
 * The card borrows FIFA's grammar — portrait, one big rating, a stat block —
 * because that grammar is instantly legible. Everything *in* it is real:
 * the rating is his actual CGPA (which really is out of 10), and every stat
 * is a measurement that appears elsewhere on this site. No invented ratings.
 */

export const CARD_W = 1024;
export const CARD_H = 1434; // 5:7, the trading-card proportion

const INK = '#0e1116';
const PANEL = '#161b23';
const LINE = '#3d4757';
const AMBER = '#f0a339';
const AMBER_DIM = '#a9702a';
const HI = '#f4f5f7';
const MID = '#aeb6c2';

export type CardStat = { label: string; value: string };

export const CARD_STATS: CardStat[] = [
  { label: 'SHP', value: '10' },   // public Bolo releases
  { label: 'TST', value: '137' },  // passing tests in Typing Master
  { label: 'MEM', value: '18K' },  // facts in FRIDAY's store
  { label: 'AGT', value: '47' },   // agents live in S-CORP
  { label: 'WER', value: '5.0' },  // Bolo word error rate, clean English
  { label: 'LM', value: '200M' },  // parameters being pre-trained
];

function families() {
  const cs = getComputedStyle(document.documentElement);
  const pick = (v: string, fb: string) => (cs.getPropertyValue(v) || '').trim() || fb;
  return {
    display: pick('--font-instrument-serif', 'Georgia') + ', Georgia, serif',
    sans: pick('--font-archivo', 'system-ui') + ', system-ui, sans-serif',
    mono: pick('--font-plex-mono', 'monospace') + ', ui-monospace, monospace',
  };
}

function roundRect(
  c: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  c.beginPath();
  c.moveTo(x + r, y);
  c.arcTo(x + w, y, x + w, y + h, r);
  c.arcTo(x + w, y + h, x, y + h, r);
  c.arcTo(x, y + h, x, y, r);
  c.arcTo(x, y, x + w, y, r);
  c.closePath();
}

/** Loads the portrait, draws the card, returns a ready texture. */
export async function buildCardTexture(portraitSrc: string): Promise<THREE.CanvasTexture> {
  const cv = document.createElement('canvas');
  cv.width = CARD_W;
  cv.height = CARD_H;
  const c = cv.getContext('2d')!;

  // Fonts must be resolved before the first fillText, or the card renders in
  // a fallback face and the texture is baked wrong for the whole session.
  try {
    await document.fonts.ready;
  } catch {
    /* older browsers: fall through with whatever is available */
  }
  const F = families();

  const img = await new Promise<HTMLImageElement | null>((res) => {
    const i = new Image();
    i.crossOrigin = 'anonymous';
    i.onload = () => res(i);
    i.onerror = () => res(null);
    i.src = portraitSrc;
  });

  /* ---------- ground ---------- */
  const g = c.createLinearGradient(0, 0, CARD_W * 0.6, CARD_H);
  g.addColorStop(0, '#2e3a4c');
  g.addColorStop(0.45, '#232c39');
  g.addColorStop(1, '#161c25');
  roundRect(c, 0, 0, CARD_W, CARD_H, 54);
  c.fillStyle = g;
  c.fill();

  // faint instrument grid, so the card belongs to the rest of the site
  c.save();
  roundRect(c, 0, 0, CARD_W, CARD_H, 54);
  c.clip();
  c.strokeStyle = 'rgba(255,255,255,0.05)';
  c.lineWidth = 1;
  for (let x = 0; x < CARD_W; x += 48) {
    c.beginPath();
    c.moveTo(x, 0);
    c.lineTo(x, CARD_H);
    c.stroke();
  }
  for (let y = 0; y < CARD_H; y += 48) {
    c.beginPath();
    c.moveTo(0, y);
    c.lineTo(CARD_W, y);
    c.stroke();
  }

  /* ---------- portrait ---------- */
  if (img) {
    const pw = 690;
    const ph = 690;
    const px = CARD_W - pw - 46;
    const py = 214;
    c.save();
    // fade the photo out at its edges so it sits in the card, not on it
    const mask = c.createRadialGradient(
      px + pw * 0.5,
      py + ph * 0.46,
      pw * 0.14,
      px + pw * 0.5,
      py + ph * 0.46,
      pw * 0.47,
    );
    mask.addColorStop(0, 'rgba(0,0,0,1)');
    mask.addColorStop(0.55, 'rgba(0,0,0,0.98)');
    mask.addColorStop(0.82, 'rgba(0,0,0,0.35)');
    mask.addColorStop(1, 'rgba(0,0,0,0)');
    c.beginPath();
    c.rect(px, py, pw, ph);
    c.clip();
    c.globalAlpha = 0.82;
    c.drawImage(img, px, py, pw, ph);
    c.globalCompositeOperation = 'destination-in';
    c.fillStyle = mask;
    c.fillRect(px, py, pw, ph);
    c.restore();

    // cool the photo toward the card's palette
    c.save();
    c.globalCompositeOperation = 'overlay';
    c.fillStyle = 'rgba(60,80,110,0.30)';
    c.fillRect(px, py, pw, ph);
    c.restore();
  }
  c.restore();

  /* ---------- rating block (top-left, FIFA's anchor) ---------- */
  c.textBaseline = 'alphabetic';
  c.fillStyle = HI;
  c.font = `400 168px ${F.display}`;
  c.fillText('9.00', 62, 232);

  c.fillStyle = AMBER;
  c.font = `500 40px ${F.mono}`;
  c.fillText('AI/ML', 68, 292);

  c.strokeStyle = LINE;
  c.lineWidth = 2;
  c.beginPath();
  c.moveTo(66, 324);
  c.lineTo(268, 324);
  c.stroke();

  c.fillStyle = MID;
  c.font = `400 32px ${F.mono}`;
  c.fillText('LPU', 68, 372);
  c.fillText('IND', 68, 420);

  c.fillStyle = '#7b8595';
  c.font = `400 24px ${F.mono}`;
  c.fillText('CGPA · OUT OF 10', 68, 470);

  /* ---------- name band ---------- */
  const bandY = 952;
  c.strokeStyle = LINE;
  c.lineWidth = 2;
  c.beginPath();
  c.moveTo(62, bandY - 60);
  c.lineTo(CARD_W - 62, bandY - 60);
  c.stroke();

  c.fillStyle = HI;
  c.textAlign = 'center';
  c.font = `400 110px ${F.display}`;
  c.fillText('SAMAEL', CARD_W / 2, bandY + 38);

  c.fillStyle = MID;
  c.font = `500 25px ${F.mono}`;
  c.letterSpacing = '7px';
  c.fillText('DILIP KUMAR · MODEL TRAINING', CARD_W / 2, bandY + 96);
  c.letterSpacing = '0px';

  /* ---------- stat grid: every number is real ---------- */
  const gx = 96;
  const gy = 1128;
  const colW = 300;
  const rowH = 96;

  c.strokeStyle = LINE;
  c.beginPath();
  c.moveTo(CARD_W / 2, gy - 44);
  c.lineTo(CARD_W / 2, gy + rowH * 2 + 34);
  c.stroke();

  CARD_STATS.forEach((s, i) => {
    const col = i % 2;
    const row = (i / 2) | 0;
    const x = gx + col * (colW + 132);
    const y = gy + row * rowH;

    c.textAlign = 'left';
    c.fillStyle = HI;
    c.font = `400 56px ${F.mono}`;
    c.fillText(s.value, x, y);

    c.fillStyle = AMBER_DIM;
    c.font = `500 26px ${F.mono}`;
    c.fillText(s.label, x + 152, y - 4);
  });

  /* ---------- frame + corner ticks ---------- */
  roundRect(c, 10, 10, CARD_W - 20, CARD_H - 20, 46);
  c.strokeStyle = 'rgba(240,163,57,0.62)';
  c.lineWidth = 3;
  c.stroke();

  c.strokeStyle = AMBER;
  c.lineWidth = 5;
  const T = 62;
  const corners: [number, number, number, number][] = [
    [30, 96, 30, 30 + T],
    [96, 30, 30 + T, 30],
    [CARD_W - 30, 96, CARD_W - 30, 30 + T],
    [CARD_W - 96, 30, CARD_W - 30 - T, 30],
    [30, CARD_H - 96, 30, CARD_H - 30 - T],
    [96, CARD_H - 30, 30 + T, CARD_H - 30],
    [CARD_W - 30, CARD_H - 96, CARD_W - 30, CARD_H - 30 - T],
    [CARD_W - 96, CARD_H - 30, CARD_W - 30 - T, CARD_H - 30],
  ];
  for (const [x1, y1, x2, y2] of corners) {
    c.beginPath();
    c.moveTo(x1, y1);
    c.lineTo(x2, y2);
    c.stroke();
  }

  const tex = new THREE.CanvasTexture(cv);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  tex.needsUpdate = true;
  return tex;
}


/* ------------------------------------------------------------------ *
 * The card back.
 *
 * Without this, DoubleSide renders the front texture mirrored when you
 * spin the card, which reads as a bug rather than as an object. A real
 * back is what makes the flip worth doing.
 * ------------------------------------------------------------------ */
export async function buildCardBackTexture(): Promise<THREE.CanvasTexture> {
  const cv = document.createElement('canvas');
  cv.width = CARD_W;
  cv.height = CARD_H;
  const c = cv.getContext('2d')!;

  try {
    await document.fonts.ready;
  } catch {
    /* fall through */
  }
  const F = families();

  const g = c.createLinearGradient(0, 0, CARD_W, CARD_H);
  g.addColorStop(0, '#232c39');
  g.addColorStop(0.5, '#1a212b');
  g.addColorStop(1, '#141a22');
  roundRect(c, 0, 0, CARD_W, CARD_H, 54);
  c.fillStyle = g;
  c.fill();

  c.save();
  roundRect(c, 0, 0, CARD_W, CARD_H, 54);
  c.clip();

  // the same instrument grid as the front
  c.strokeStyle = 'rgba(255,255,255,0.045)';
  c.lineWidth = 1;
  for (let x = 0; x < CARD_W; x += 48) {
    c.beginPath(); c.moveTo(x, 0); c.lineTo(x, CARD_H); c.stroke();
  }
  for (let y = 0; y < CARD_H; y += 48) {
    c.beginPath(); c.moveTo(0, y); c.lineTo(CARD_W, y); c.stroke();
  }

  // the site's own motif: a loss curve descending across the back
  c.strokeStyle = AMBER;
  c.lineWidth = 7;
  c.lineJoin = 'round';
  c.lineCap = 'round';
  c.beginPath();
  for (let i = 0; i <= 90; i++) {
    const u = i / 90;
    const x = 110 + u * (CARD_W - 220);
    const noise = Math.sin(i * 2.1) * 26 * Math.exp(-2.4 * u);
    const y = 470 + (1 - (0.42 + 3.6 * Math.exp(-5.0 * u)) / 4.2) * 430 + noise;
    if (i === 0) c.moveTo(x, y); else c.lineTo(x, y);
  }
  c.stroke();

  c.fillStyle = AMBER;
  c.beginPath();
  c.arc(CARD_W - 110, 862, 13, 0, Math.PI * 2);
  c.fill();

  c.restore();

  // wordmark
  c.textAlign = 'center';
  c.fillStyle = HI;
  c.font = `400 128px ${F.display}`;
  c.fillText('NOISE', CARD_W / 2, 300);
  c.fillStyle = AMBER;
  c.font = `400 92px ${F.display}`;
  c.fillText('↓', CARD_W / 2, 392);
  c.fillStyle = HI;
  c.font = `400 128px ${F.display}`;
  c.fillText('SIGNAL', CARD_W / 2, 512);

  c.fillStyle = MID;
  c.font = `500 26px ${F.mono}`;
  c.letterSpacing = '10px';
  c.fillText('LOSS DESCENDING', CARD_W / 2, 1000);
  c.letterSpacing = '0px';

  c.fillStyle = '#7b8595';
  c.font = `400 27px ${F.mono}`;
  c.fillText('github.com/Dilip-kumar-22', CARD_W / 2, 1150);
  c.fillText('huggingface.co/dilipsroy-22', CARD_W / 2, 1198);

  c.fillStyle = AMBER_DIM;
  c.font = `500 24px ${F.mono}`;
  c.fillText('B.TECH CSE · AI & ML · LPU · 2025-2029', CARD_W / 2, 1300);

  // frame
  roundRect(c, 10, 10, CARD_W - 20, CARD_H - 20, 46);
  c.strokeStyle = 'rgba(240,163,57,0.55)';
  c.lineWidth = 3;
  c.stroke();

  const tex = new THREE.CanvasTexture(cv);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  tex.needsUpdate = true;
  return tex;
}
