'use client';

import { useEffect, useRef, useState } from 'react';
import { PERSON } from '@/lib/content';
import { enterSite, gate } from '@/lib/gateStore';
import { prefersReducedMotion } from '@/lib/scrollStore';

/**
 * The gate that sits over the site until the visitor enters.
 *
 * The card itself lives in the WebGL scene (PlayerCard); this is only the
 * chrome around it: the prompt, the scroll lock, and the ways in.
 *
 * Deliberately not mouse-only. Double-click is the headline gesture, but
 * Enter, Space, a real focusable button and any scroll all work too — a gate
 * you can get stuck behind is a broken front door.
 */
export default function CardGate({ onEnter }: { onEnter: () => void }) {
  const [leaving, setLeaving] = useState(false);
  const fired = useRef(false);

  const go = () => {
    if (fired.current) return;
    fired.current = true;
    setLeaving(true);
    document.documentElement.classList.remove('gate-open');
    enterSite();
    // matches the card's exit flight
    window.setTimeout(onEnter, 1150);
  };

  useEffect(() => {
    // lock the page behind the gate
    const html = document.documentElement;
    const prev = html.style.overflow;
    html.style.overflow = 'hidden';
    // The content stays in the DOM the whole time — crawlers and screen
    // readers still get the real page — it is only hidden visually.
    html.classList.add('gate-open');

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'Escape') {
        e.preventDefault();
        go();
      }
    };
    const onWheel = () => go();
    const onTouch = () => go();

    window.addEventListener('keydown', onKey);
    // a visitor who just scrolls should not be trapped
    window.addEventListener('wheel', onWheel, { passive: true });
    window.addEventListener('touchmove', onTouch, { passive: true });

    return () => {
      html.style.overflow = prev;
      html.classList.remove('gate-open');
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('touchmove', onTouch);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const reduced = typeof window !== 'undefined' && prefersReducedMotion();

  return (
    <div
      onDoubleClick={go}
      role="dialog"
      aria-label={`${PERSON.name} — enter the site`}
      className="fixed inset-0 z-[70] flex select-none flex-col justify-between px-6 py-7 md:px-10 md:py-9"
      style={{
        // the card shows through; this layer only darkens the surround
        background:
          'radial-gradient(120% 90% at 50% 45%, transparent 22%, oklch(0.145 0.018 250 / 0.55) 62%, oklch(0.12 0.016 250 / 0.9) 100%)',
        opacity: leaving ? 0 : 1,
        transition: 'opacity 0.75s cubic-bezier(0.4,0,0.2,1)',
        pointerEvents: leaving ? 'none' : 'auto',
        cursor: leaving ? 'default' : 'grab',
      }}
    >
      {/* ---- top rail ---- */}
      <div className="flex items-start justify-between gap-6">
        <div>
          <p className="t-label !text-[0.6rem]">{PERSON.name}</p>
          <p className="t-data mt-1 text-[0.68rem] text-signal">{PERSON.role}</p>
        </div>
        <p className="t-data hidden text-right text-[0.62rem] leading-relaxed text-low sm:block">
          every stat on this card
          <br />
          is a real measurement
        </p>
      </div>

      {/* ---- the way in ---- */}
      <div className="flex flex-col items-center gap-4 text-center">
        <p className="t-data text-[0.66rem] text-low">
          {reduced ? 'press enter to continue' : 'drag to spin · flick it'}
        </p>

        <button
          onClick={go}
          onDoubleClick={go}
          className="group flex items-center gap-3 border border-line px-5 py-3 transition-colors duration-300 hover:border-signal focus-visible:border-signal"
        >
          <span
            className="h-1.5 w-1.5 rounded-full bg-signal"
            style={{ animation: reduced ? 'none' : 'gatePulse 1.9s ease-in-out infinite' }}
          />
          <span className="t-data text-[0.7rem] uppercase tracking-[0.2em] text-hi">
            Double-click to enter
          </span>
        </button>

        <p className="t-data text-[0.58rem] text-low/70">or press enter</p>
      </div>

      <style>{`
        @keyframes gatePulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%      { opacity: 0.35; transform: scale(0.7); }
        }
      `}</style>
    </div>
  );
}

export { gate };
