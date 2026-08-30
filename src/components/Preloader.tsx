'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * The boot sequence. Not a spinner — the site opens the way a training run
 * opens, which is the whole premise. It waits for fonts (so the hero never
 * swaps typeface after the reveal) with a hard timeout so a slow font CDN can
 * never trap someone on a loading screen.
 */

const LINES: [string, string][] = [
  ['tokenizer', 'vocab 32,000'],
  ['corpus', 'curated · deduped'],
  ['model', '≈204M params'],
  ['objective', 'next-token'],
  ['device', 'ready'],
];

export default function Preloader() {
  const [done, setDone] = useState(false);
  const [gone, setGone] = useState(false);
  const [step, setStep] = useState(0);
  const pct = useRef<HTMLSpanElement>(null);
  const bar = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Respect a returning visitor — a preloader every navigation is a tax.
    if (sessionStorage.getItem('booted') === '1') {
      setDone(true);
      setGone(true);
      return;
    }

    let raf = 0;
    const t0 = performance.now();
    const MIN = 1500; // long enough to read, short enough not to annoy
    const MAX = 3800;

    let fontsReady = false;
    document.fonts?.ready.then(() => (fontsReady = true));

    const tick = () => {
      const t = performance.now() - t0;
      // progress is time-based but cannot complete until fonts land
      const target = fontsReady ? Math.min(1, t / MIN) : Math.min(0.92, t / MIN);
      const p = t >= MAX ? 1 : target;

      if (pct.current) pct.current.textContent = String(Math.round(p * 100)).padStart(3, '0');
      if (bar.current) bar.current.style.transform = `scaleX(${p})`;
      setStep(Math.min(LINES.length, Math.floor(p * LINES.length * 1.15)));

      if (p >= 1) {
        sessionStorage.setItem('booted', '1');
        setDone(true);
        setTimeout(() => setGone(true), 900);
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(raf);
  }, []);

  if (gone) return null;

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 z-[90] flex flex-col justify-between p-6 md:p-12"
      style={{
        background: 'var(--color-ground)',
        clipPath: done ? 'inset(0 0 100% 0)' : 'inset(0 0 0 0)',
        transition: 'clip-path 0.9s cubic-bezier(0.76, 0, 0.24, 1)',
      }}
    >
      <div className="flex items-center gap-2">
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-signal" />
        <span className="t-label">initialising run</span>
      </div>

      <div className="mx-auto w-full max-w-lg">
        <dl className="space-y-2">
          {LINES.map(([k, v], i) => (
            <div
              key={k}
              className="flex items-baseline justify-between gap-6 border-b border-line-soft pb-2 transition-opacity duration-500"
              style={{ opacity: i < step ? 1 : 0.18 }}
            >
              <dt className="t-data text-[0.72rem] text-mid">{k}</dt>
              <dd className="t-data text-[0.72rem] text-low">
                {i < step ? v : '········'}
              </dd>
            </div>
          ))}
        </dl>
      </div>

      <div>
        <div className="mb-3 h-px w-full bg-line-soft">
          <div
            ref={bar}
            className="h-full origin-left scale-x-0 bg-signal"
            style={{ willChange: 'transform' }}
          />
        </div>
        <div className="flex items-baseline justify-between">
          <span className="t-label">loading</span>
          <span className="t-data text-sm text-signal">
            <span ref={pct}>000</span>%
          </span>
        </div>
      </div>
    </div>
  );
}
