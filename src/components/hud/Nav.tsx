'use client';

import { useEffect, useRef, useState } from 'react';
import { CHAPTERS } from '@/lib/content';
import { subscribe } from '@/lib/scrollStore';

/**
 * Chapter rail. The active marker is written directly to the DOM from the
 * frame loop; React state only changes when the active chapter actually
 * changes, so scrolling doesn't re-render the tree.
 */
export default function Nav() {
  const [active, setActive] = useState(0);
  const activeRef = useRef(0);

  useEffect(() => {
    const ids = CHAPTERS.map((c) => c.id);
    return subscribe(() => {
      const mid = window.innerHeight * 0.42;
      let found = 0;
      for (let i = 0; i < ids.length; i++) {
        const el = document.getElementById(ids[i]);
        if (el && el.getBoundingClientRect().top <= mid) found = i;
      }
      if (found !== activeRef.current) {
        activeRef.current = found;
        setActive(found);
      }
    });
  }, []);

  const go = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const y = el.getBoundingClientRect().top + window.scrollY;
    const lenis = (window as unknown as { __lenis?: { scrollTo: (y: number) => void } }).__lenis;
    if (lenis) lenis.scrollTo(y);
    else window.scrollTo({ top: y, behavior: 'smooth' });
  };

  return (
    <nav
      aria-label="Chapters"
      className="fixed left-6 top-1/2 z-40 hidden -translate-y-1/2 lg:block"
    >
      <ul className="flex flex-col gap-1">
        {CHAPTERS.map((c, i) => {
          const on = i === active;
          return (
            <li key={c.id}>
              <button
                onClick={() => go(c.id)}
                aria-current={on ? 'true' : undefined}
                className="group flex items-center gap-3 py-1.5 text-left"
              >
                <span
                  className={`h-px transition-all duration-500 ${
                    on ? 'w-7 bg-signal' : 'w-3 bg-line group-hover:w-5 group-hover:bg-mid'
                  }`}
                />
                <span
                  className={`t-data text-[0.6rem] uppercase tracking-[0.18em] transition-colors duration-500 ${
                    on ? 'text-signal' : 'text-low group-hover:text-mid'
                  }`}
                >
                  {c.label}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
