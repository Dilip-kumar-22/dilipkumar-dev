/**
 * OKLCH → sRGB (Björn Ottosson's OKLab).
 * Ported from the ORBIT engine (github.com/Dilip-kumar-22/orbit) so the
 * WebGL scene and the CSS in globals.css resolve to the *same* perceptual
 * palette instead of drifting apart.
 */

export type Oklch = readonly [L: number, C: number, h: number];

export function oklchToRGB([L, C, h]: Oklch): [number, number, number] {
  const a = C * Math.cos((h * Math.PI) / 180);
  const b = C * Math.sin((h * Math.PI) / 180);

  const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = L - 0.0894841775 * a - 1.291485548 * b;

  const l = l_ ** 3;
  const m = m_ ** 3;
  const s = s_ ** 3;

  const r = 4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s;
  const g = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
  const bl = -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s;

  const oetf = (x: number) =>
    x <= 0.0031308 ? 12.92 * x : 1.055 * Math.pow(x, 1 / 2.4) - 0.055;
  const cl = (x: number) => Math.min(1, Math.max(0, x));

  return [cl(oetf(r)), cl(oetf(g)), cl(oetf(bl))];
}

/** Hex string, for anything that needs a plain colour (meta tags, SVG). */
export function oklchToHex(c: Oklch): string {
  const [r, g, b] = oklchToRGB(c);
  const h = (x: number) =>
    Math.round(x * 255)
      .toString(16)
      .padStart(2, '0');
  return `#${h(r)}${h(g)}${h(b)}`;
}

/**
 * The scene palette. Mirrors the @theme block in globals.css exactly —
 * if you change one, change both.
 */
export const PALETTE = {
  ground: [0.145, 0.018, 250],
  ground1: [0.19, 0.02, 250],
  signal: [0.8, 0.165, 68],
  signalDim: [0.62, 0.13, 65],
  instr: [0.8, 0.115, 205],
  ice: [0.86, 0.045, 230],
  hi: [0.965, 0.008, 250],
} as const satisfies Record<string, Oklch>;

/**
 * Post-processing constants, carried over from ORBIT.
 * LESSON [3D]: bloom threshold must stay high (≥0.9) and exposure ≤1.0, or
 * the hero blows out to white. These values are verified — do not "improve"
 * them without re-screenshotting.
 */
export const RENDER = {
  bloom: { intensity: 0.55, radius: 0.45, threshold: 0.92 },
  exposure: 0.96,
  vignette: 0.9,
  maxDpr: 1.5,
} as const;
