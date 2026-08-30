'use client';

import { useEffect, useRef } from 'react';
import { prefersReducedMotion } from '@/lib/scrollStore';

/**
 * A reticle rather than a blob: a small dot with a ring that lags behind it,
 * and opens up over anything interactive. Pointer-device only — it is never
 * shown on touch, and never replaces the real cursor for keyboard users.
 */
export default function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    const d = dot.current;
    const r = ring.current;
    if (!d || !r) return;

    document.documentElement.style.cursor = 'none';

    let x = innerWidth / 2;
    let y = innerHeight / 2;
    let rx = x;
    let ry = y;
    let scale = 1;
    let targetScale = 1;
    let raf = 0;

    const move = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
      const t = e.target as HTMLElement | null;
      const interactive = !!t?.closest('a,button,[role="button"],input,textarea,select');
      targetScale = interactive ? 2.1 : 1;
      start();
    };

    // The loop parks itself once the ring has caught up. An always-on rAF
    // here composites two fixed layers over the whole page every frame, which
    // measurably costs frames on integrated graphics even when nothing moves.
    const loop = () => {
      rx += (x - rx) * 0.16;
      ry += (y - ry) * 0.16;
      scale += (targetScale - scale) * 0.12;

      d.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
      r.style.transform = `translate3d(${rx}px, ${ry}px, 0) translate(-50%, -50%) scale(${scale.toFixed(3)})`;

      const settled =
        Math.abs(x - rx) < 0.15 &&
        Math.abs(y - ry) < 0.15 &&
        Math.abs(targetScale - scale) < 0.005;

      if (settled) {
        raf = 0;
        return;
      }
      raf = requestAnimationFrame(loop);
    };

    const start = () => {
      if (!raf) raf = requestAnimationFrame(loop);
    };

    window.addEventListener('pointermove', move, { passive: true });
    start();

    return () => {
      document.documentElement.style.cursor = '';
      window.removeEventListener('pointermove', move);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[80] hidden lg:block">
      <div
        ref={ring}
        className="absolute left-0 top-0 h-8 w-8 rounded-full border border-signal/50"
        style={{ willChange: 'transform' }}
      />
      <div
        ref={dot}
        className="absolute left-0 top-0 h-1 w-1 rounded-full bg-signal"
        style={{ willChange: 'transform' }}
      />
    </div>
  );
}
