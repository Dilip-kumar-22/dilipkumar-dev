'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';
import { startLoop, stopLoop, collectReveals, prefersReducedMotion } from '@/lib/scrollStore';

/**
 * Mounts smooth scroll + the global frame loop.
 * Under prefers-reduced-motion we skip Lenis entirely and let the browser
 * scroll natively — the frame loop still runs so reveals resolve instantly.
 */
export default function ScrollProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    let lenis: Lenis | null = null;

    if (!prefersReducedMotion()) {
      lenis = new Lenis({
        duration: 1.05,
        // slightly long, slightly heavy — this site should feel like mass
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        wheelMultiplier: 0.9,
        touchMultiplier: 1.6,
        autoRaf: true,
      });

      // Dev-only handle so the verification harness can jump to an exact
      // scroll position without fighting the smooth-scroll animation.
      if (process.env.NODE_ENV === 'development') {
        (window as unknown as { __lenis?: Lenis }).__lenis = lenis;
      }
    }

    startLoop();

    // Content can mount after the first frame (3D, fonts) — re-scan once settled.
    const rescan = setTimeout(collectReveals, 300);

    return () => {
      clearTimeout(rescan);
      lenis?.destroy();
      stopLoop();
    };
  }, []);

  return <>{children}</>;
}
