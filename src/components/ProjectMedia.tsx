'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import type { MediaItem } from '@/lib/content';
import { subscribe, prefersReducedMotion } from '@/lib/scrollStore';

/**
 * A capture of the project actually running.
 *
 * Video plays only while it is on screen and pauses the moment it leaves, so
 * a page with several of these costs one decode, not six. Playback is driven
 * from the global frame loop rather than IntersectionObserver — IO thresholds
 * stall on instant scroll jumps with a smooth-scroll library attached
 * (LESSON [FRONTEND]).
 *
 * Under prefers-reduced-motion the poster frame is shown instead and nothing
 * ever plays.
 */

function Chrome({
  kind,
  label,
  children,
}: {
  kind: MediaItem['chrome'];
  label: string;
  children: React.ReactNode;
}) {
  if (!kind) return <>{children}</>;

  return (
    <div className="overflow-hidden border border-line-soft bg-ground-1/60 backdrop-blur-sm">
      <div className="flex items-center gap-3 border-b border-line-soft px-3.5 py-2.5">
        {kind === 'browser' ? (
          <span className="flex gap-1.5">
            {['#f0a339', '#5b6b9e', '#46a758'].map((c) => (
              <span
                key={c}
                className="h-2.5 w-2.5 rounded-full opacity-70"
                style={{ background: c }}
              />
            ))}
          </span>
        ) : (
          <span className="h-1.5 w-1.5 rounded-full bg-signal" />
        )}

        <span className="t-data truncate text-[0.62rem] tracking-[0.06em] text-low">
          {label}
        </span>

        {kind === 'window' && (
          <span className="ml-auto flex gap-2.5 text-low">
            {['–', '□', '×'].map((g) => (
              <span key={g} className="text-[0.6rem] leading-none">
                {g}
              </span>
            ))}
          </span>
        )}
      </div>
      {children}
    </div>
  );
}

export default function ProjectMedia({
  item,
  label,
  priority = false,
  className = '',
}: {
  item: MediaItem;
  label: string;
  priority?: boolean;
  className?: string;
}) {
  const vidRef = useRef<HTMLVideoElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const v = vidRef.current;
    const wrap = wrapRef.current;
    if (!v || !wrap) return;
    if (prefersReducedMotion()) return; // poster only

    let playing = false;
    return subscribe(() => {
      const r = wrap.getBoundingClientRect();
      // a generous band, so playback is already running by the time it matters
      const onScreen = r.top < window.innerHeight * 1.15 && r.bottom > -window.innerHeight * 0.15;

      if (onScreen && !playing) {
        playing = true;
        v.play().catch(() => {
          /* autoplay can be refused; the poster still reads correctly */
        });
      } else if (!onScreen && playing) {
        playing = false;
        v.pause();
      }
    });
  }, []);

  return (
    <div ref={wrapRef} className={className}>
      <Chrome kind={item.chrome} label={label}>
        {item.kind === 'video' ? (
          <video
            ref={vidRef}
            className="block h-auto w-full"
            poster={item.poster}
            muted
            loop
            playsInline
            preload="metadata"
            aria-label={item.alt}
          >
            {item.webm && <source src={item.webm} type="video/webm" />}
            <source src={item.src} type="video/mp4" />
          </video>
        ) : (
          <Image
            src={item.src}
            alt={item.alt}
            width={1400}
            height={900}
            priority={priority}
            className="block h-auto w-full"
            sizes="(max-width: 1024px) 100vw, 720px"
          />
        )}
      </Chrome>

      {/* The field behind this can be bright amber by the Work section, so the
          caption carries its own ground rather than relying on the page. */}
      <p className="t-data mt-3 max-w-[54ch] bg-ground/70 px-2.5 py-1.5 text-[0.7rem] leading-relaxed text-mid backdrop-blur-[2px]">
        {item.caption}
      </p>
    </div>
  );
}
