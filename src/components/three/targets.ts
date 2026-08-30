/**
 * The five target shapes the particle field morphs between.
 * All are generated once, client-side, and uploaded as static attributes.
 */

import { PROJECTS } from '@/lib/content';

function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Box–Muller — a real normal distribution, not rand()-rand(). */
function gauss(rnd: () => number) {
  let u = 0;
  while (u === 0) u = rnd();
  const v = rnd();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

/* ---------- 0. gaussian noise — an untrained model ------------------ */
export function noiseCloud(n: number, seed = 1): Float32Array {
  const rnd = mulberry32(seed);
  const a = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    a[i * 3] = gauss(rnd) * 3.4;
    a[i * 3 + 1] = gauss(rnd) * 2.4;
    a[i * 3 + 2] = gauss(rnd) * 3.4;
  }
  return a;
}

/* ---------- 1. the name — sampled from rendered text ---------------- */
export function textPoints(n: number, text: string, seed = 7): Float32Array {
  const out = new Float32Array(n * 3);
  const rnd = mulberry32(seed);

  if (typeof document === 'undefined') return noiseCloud(n, seed);

  const CW = 1200;
  const CH = 300;
  const cv = document.createElement('canvas');
  cv.width = CW;
  cv.height = CH;
  const ctx = cv.getContext('2d', { willReadFrequently: true });
  if (!ctx) return noiseCloud(n, seed);

  ctx.fillStyle = '#fff';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  // Weight matters more than family here — we only need the silhouette.
  ctx.font = '700 168px "Archivo", "Arial Black", sans-serif';
  ctx.fillText(text, CW / 2, CH / 2);

  const data = ctx.getImageData(0, 0, CW, CH).data;

  // collect lit pixels — sample every pixel so the letterforms stay crisp
  const hits: number[] = [];
  for (let y = 0; y < CH; y++) {
    for (let x = 0; x < CW; x++) {
      if (data[(y * CW + x) * 4 + 3] > 140) hits.push(x, y);
    }
  }

  if (hits.length < 6) return noiseCloud(n, seed);

  const count = hits.length / 2;
  const SX = 10.4 / CW; // world width — must stay inside the camera frustum
  const SY = 10.4 / CW; // keep the aspect ratio honest

  for (let i = 0; i < n; i++) {
    const j = Math.floor(rnd() * count) * 2;
    // tight jitter — anything wider and the letters read as debris, not type
    const px = hits[j] + (rnd() - 0.5) * 1.05;
    const py = hits[j + 1] + (rnd() - 0.5) * 1.05;

    out[i * 3] = (px - CW / 2) * SX;
    out[i * 3 + 1] = -(py - CH / 2) * SY + 1.15; // lift clear of the body copy
    out[i * 3 + 2] = gauss(rnd) * 0.14; // slight depth so it isn't a flat decal
  }
  return out;
}

/* ---------- 2. swiss roll — the canonical manifold ------------------ */
export function swissRoll(n: number, seed = 3): Float32Array {
  const rnd = mulberry32(seed);
  const a = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    const u = rnd();
    const v = rnd();
    const t = 1.5 * Math.PI * (1 + 2 * u);
    const s = 0.42;
    a[i * 3] = t * Math.cos(t) * s;
    a[i * 3 + 1] = (v - 0.5) * 6.2;
    a[i * 3 + 2] = t * Math.sin(t) * s;
    // thin scatter off the sheet, so it reads as sampled data not a mesh
    a[i * 3] += gauss(rnd) * 0.09;
    a[i * 3 + 2] += gauss(rnd) * 0.09;
  }
  return a;
}

/* ---------- 3. constellation — projects as clusters ----------------- */
export function constellation(n: number, seed = 11): Float32Array {
  const rnd = mulberry32(seed);
  const a = new Float32Array(n * 3);
  const nodes = PROJECTS.map((p) => p.pos);

  // edges between semantically-near projects
  const edges: [number[], number[]][] = [];
  PROJECTS.forEach((p, i) => {
    p.near.forEach((slug) => {
      const j = PROJECTS.findIndex((q) => q.slug === slug);
      if (j > -1) edges.push([nodes[i] as unknown as number[], nodes[j] as unknown as number[]]);
    });
  });

  for (let i = 0; i < n; i++) {
    const r = rnd();

    if (r < 0.62) {
      // cluster core
      const c = nodes[Math.floor(rnd() * nodes.length)];
      a[i * 3] = c[0] + gauss(rnd) * 0.52;
      a[i * 3 + 1] = c[1] + gauss(rnd) * 0.52;
      a[i * 3 + 2] = c[2] + gauss(rnd) * 0.52;
    } else if (r < 0.82 && edges.length) {
      // along an edge — the graph structure made visible
      const [p, q] = edges[Math.floor(rnd() * edges.length)];
      const k = rnd();
      a[i * 3] = p[0] + (q[0] - p[0]) * k + gauss(rnd) * 0.1;
      a[i * 3 + 1] = p[1] + (q[1] - p[1]) * k + gauss(rnd) * 0.1;
      a[i * 3 + 2] = p[2] + (q[2] - p[2]) * k + gauss(rnd) * 0.1;
    } else {
      // ambient field so the space doesn't read as empty
      a[i * 3] = gauss(rnd) * 4.2;
      a[i * 3 + 1] = gauss(rnd) * 2.6;
      a[i * 3 + 2] = gauss(rnd) * 4.2;
    }
  }
  return a;
}

/* ---------- 4. converged — the run settles -------------------------- */
export function convergedRing(n: number, seed = 5): Float32Array {
  const rnd = mulberry32(seed);
  const a = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    const th = rnd() * Math.PI * 2;
    const R = 4.15 + gauss(rnd) * 0.16;
    const tube = gauss(rnd) * 0.2;
    a[i * 3] = Math.cos(th) * R;
    a[i * 3 + 1] = tube + Math.sin(th * 3.0) * 0.14;
    a[i * 3 + 2] = Math.sin(th) * R;
  }
  return a;
}

export function randoms(n: number, seed = 99): Float32Array {
  const rnd = mulberry32(seed);
  const a = new Float32Array(n);
  for (let i = 0; i < n; i++) a[i] = rnd();
  return a;
}
