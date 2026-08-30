'use client';

import { useEffect, useRef } from 'react';
import { subscribe, prefersReducedMotion } from '@/lib/scrollStore';

/**
 * Text that resolves out of noise, character by character.
 *
 * The real string is always in the DOM (inside a visually-hidden span) so
 * screen readers and crawlers never see scrambled glyphs — the animation is
 * painted into a separate aria-hidden span.
 */

// Light, typographic glyphs. Heavy block characters (░▒▓█) make a heading
// mid-scramble read as a rendering failure rather than as noise resolving.
const GLYPHS = '·:.~-=+*/\\<>|!?°¬01';

export default function DenoiseText({
  text,
  className = '',
  as: Tag = 'span',
  speed = 1,
}: {
  text: string;
  className?: string;
  as?: 'span' | 'h1' | 'h2' | 'h3' | 'p';
  speed?: number;
}) {
  const paint = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = paint.current;
    if (!el) return;

    if (prefersReducedMotion()) {
      el.textContent = text;
      return;
    }

    el.textContent = text.replace(/\S/g, '·');

    let started = false;
    let raf = 0;

    const run = () => {
      const chars = [...text];
      // each character locks in at its own time, left to right
      const lock = chars.map((_, i) => 180 + i * (34 / speed) + Math.random() * 220);
      const t0 = performance.now();

      const step = () => {
        const t = performance.now() - t0;
        let done = true;
        el.textContent = chars
          .map((c, i) => {
            if (c === ' ') return ' ';
            if (t >= lock[i]) return c;
            done = false;
            return GLYPHS[(Math.random() * GLYPHS.length) | 0];
          })
          .join('');
        if (!done) raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
    };

    const stop = subscribe(() => {
      if (started) return;
      const r = el.getBoundingClientRect();
      if (r.top >= window.innerHeight * 0.86) return; // still below the fold

      started = true;
      // If it is already fully above the viewport the visitor has scrolled
      // past it — animating now would be invisible, and requiring the element
      // to still be on screen (r.bottom > 0) left headings stranded as dots
      // forever. Resolve instantly instead.
      if (r.bottom <= 0) el.textContent = text;
      else run();
      stop();
    });

    return () => {
      cancelAnimationFrame(raf);
      stop();
    };
  }, [text, speed]);

  return (
    <Tag className={className}>
      <span className="sr-only">{text}</span>
      <span ref={paint} aria-hidden="true" />
    </Tag>
  );
}
