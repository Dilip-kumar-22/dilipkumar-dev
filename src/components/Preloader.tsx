'use client';

import { useEffect, useRef, useState } from 'react';
import { prefersReducedMotion } from '@/lib/scrollStore';

/**
 * Boot sequence. It is an overlay, never a gate: all content is already in the
 * DOM underneath, so crawlers and screen readers are unaffected and a failed
 * script can never leave the page blank.
 */

const LINES = [
  'init  tokenizer',
  'load  corpus',
  'build model',
  'alloc device',
  'run   training',
] as const;

export default function Preloader() {
  const [done, setDone] = useState(false);
  const [shown, setShown] = useState<number>(0);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) {
      setDone(true);
      return;
    }

    // Never let a slow frame trap the visitor behind the overlay.
    const hardStop = setTimeout(() => setDone(true), 2600);

    const timers: ReturnType<typeof setTimeout>[] = [];
    LINES.forEach((_, i) => {
      timers.push(setTimeout(() => setShown(i + 1), 120 + i * 190));
    });
    timers.push(setTimeout(() => setDone(true), 120 + LINES.length * 190 + 380));

    let raf = 0;
    const t0 = performance.now();
    const tick = () => {
      const p = Math.min(1, (performance.now() - t0) / 1300);
      if (barRef.current) barRef.current.style.transform = `scaleX(${p})`;
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      clearTimeout(hardStop);
      timers.forEach(clearTimeout);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[90] flex items-end justify-start p-8 md:p-12"
      style={{
        background: 'var(--color-ground)',
        opacity: done ? 0 : 1,
        transform: done ? 'translateY(-100%)' : 'none',
        transition:
          'opacity 0.5s cubic-bezier(0.6,0,0.2,1), transform 0.9s cubic-bezier(0.76,0,0.24,1)',
        transitionDelay: done ? '0.15s, 0s' : '0s',
      }}
    >
      <div className="w-full max-w-sm">
        <div className="mb-5 flex items-baseline justify-between">
          <span className="t-label !text-[0.58rem]">epoch 00</span>
          <span className="t-data text-[0.6rem] text-signal">boot</span>
        </div>

        <div className="space-y-1">
          {LINES.map((l, i) => (
            <div
              key={l}
              className="t-data flex items-center gap-3 text-[0.68rem] transition-opacity duration-300"
              style={{ opacity: i < shown ? 1 : 0.12 }}
            >
              <span className={i < shown ? 'text-signal' : 'text-low'}>
                {i < shown ? '✓' : '·'}
              </span>
              <span className="text-mid">{l}</span>
            </div>
          ))}
        </div>

        <div className="mt-6 h-px w-full bg-line-soft">
          <div
            ref={barRef}
            className="h-full origin-left scale-x-0 bg-signal"
            style={{ willChange: 'transform' }}
          />
        </div>
      </div>
    </div>
  );
}
