/**
 * One rAF loop for the whole site.
 *
 * React state is NOT used for per-frame values — at 60fps a setState per frame
 * would re-render the tree 60×/s and drop the 3D scene's budget. Instead this
 * is an external store: subscribers get a frame callback and mutate DOM nodes
 * or shader uniforms directly.
 *
 * It also drives scroll reveals. LESSON [FRONTEND]: IntersectionObserver
 * thresholds stall when you land mid-page via an instant scroll jump with a
 * smooth-scroll library attached — so reveals are checked here, per frame,
 * against rect.top < 0.88 * innerHeight.
 */

export type Frame = {
  /** 0 → 1 across the entire document. */
  progress: number;
  /** Pixels scrolled. */
  y: number;
  /** Smoothed px/frame — used to add drag to the particle field. */
  velocity: number;
  /** Seconds since start. */
  t: number;
};

type Listener = (f: Frame) => void;

const listeners = new Set<Listener>();
let revealTargets: HTMLElement[] = [];

export const frame: Frame = { progress: 0, y: 0, velocity: 0, t: 0 };

let raf = 0;
let started = false;
let t0 = 0;
let lastY = 0;
let running = true;

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export function subscribe(fn: Listener): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

/** Re-scan the DOM for .reveal elements (call after route/content changes). */
export function collectReveals() {
  revealTargets = Array.from(
    document.querySelectorAll<HTMLElement>('.reveal:not(.is-in)'),
  );
}

function checkReveals() {
  if (!revealTargets.length) return;
  const limit = window.innerHeight * 0.88;
  let removed = false;

  for (const el of revealTargets) {
    if (el.classList.contains('is-in')) {
      removed = true;
      continue;
    }
    const top = el.getBoundingClientRect().top;
    if (top < limit) {
      // LESSON [FRONTEND]: let the from-state paint for one frame before the
      // transition starts, or a teleport-scroll leaves it stuck at opacity 0.
      requestAnimationFrame(() => el.classList.add('is-in'));
      removed = true;
    }
  }

  if (removed) revealTargets = revealTargets.filter((el) => !el.classList.contains('is-in'));
}

function tick(now: number) {
  raf = requestAnimationFrame(tick);
  if (!running) return;

  if (!t0) t0 = now;
  frame.t = (now - t0) / 1000;

  const y = window.scrollY || window.pageYOffset || 0;
  const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);

  frame.y = y;
  frame.progress = Math.min(1, Math.max(0, y / max));
  // low-pass the velocity so a flick doesn't spike the shader
  frame.velocity += ((y - lastY) - frame.velocity) * 0.18;
  lastY = y;

  checkReveals();
  for (const fn of listeners) fn(frame);
}

export function startLoop() {
  if (started) return;
  started = true;
  collectReveals();
  // Reveal anything already on screen at load, so a deep-link never lands on
  // a page of invisible content.
  checkReveals();
  raf = requestAnimationFrame(tick);

  document.addEventListener('visibilitychange', () => {
    running = !document.hidden;
  });
}

export function stopLoop() {
  cancelAnimationFrame(raf);
  started = false;
  raf = 0;
}
