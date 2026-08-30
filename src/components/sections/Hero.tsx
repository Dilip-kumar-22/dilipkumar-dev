'use client';

import { useEffect, useRef } from 'react';
import { PERSON } from '@/lib/content';
import { subscribe } from '@/lib/scrollStore';

/** Instrument readout. Reads as a training run booting, because it is one. */
const BOOT = [
  ['init', 'tokenizer', 'vocab 32,000'],
  ['load', 'corpus', 'curated · deduped'],
  ['build', 'model', '≈204M params'],
  ['set', 'objective', 'next-token'],
  ['run', 'status', 'training'],
] as const;

export default function Hero() {
  const cueRef = useRef<HTMLDivElement>(null);

  // The scroll cue is only useful before you've scrolled — fade it out.
  useEffect(
    () =>
      subscribe(({ progress }) => {
        if (cueRef.current) {
          cueRef.current.style.opacity = String(Math.max(0, 1 - progress * 22));
        }
      }),
    [],
  );

  return (
    <section
      id="boot"
      data-epoch="00"
      className="relative flex min-h-dvh flex-col justify-between shell pb-10 pt-28"
    >
      {/* ---- boot console ---- */}
      <div className="reveal max-w-md">
        <div className="mb-3 flex items-center gap-2">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-signal" />
          <span className="t-label">epoch 00 — boot</span>
        </div>

        <dl className="space-y-1 border-l border-line-soft pl-4">
          {BOOT.map(([verb, key, val], i) => (
            <div
              key={key}
              className={`reveal reveal-${i + 1} flex items-baseline gap-3 text-[0.7rem]`}
            >
              <dt className="t-data w-11 shrink-0 text-signal-dim">{verb}</dt>
              <dd className="t-data flex-1 text-low">{key}</dd>
              <dd className="t-data text-mid">{val}</dd>
            </div>
          ))}
        </dl>
      </div>

      {/* ---- the statement ---- */}
      <div className="max-w-5xl">
        <h1>
          <span className="reveal t-label mb-6 block !text-[0.68rem] !tracking-[0.3em] text-mid">
            {PERSON.name} <span className="text-low">·</span> {PERSON.role}
          </span>
          <span
            className="reveal reveal-2 t-display block text-hi"
            style={{ fontSize: 'clamp(2.9rem, 9.2vw, 8.6rem)' }}
          >
            Everything starts
            <br />
            as{' '}
            <em className="not-italic text-signal" style={{ fontStyle: 'italic' }}>
              noise
            </em>
            .
          </span>
        </h1>

        <p className="reveal reveal-3 t-body mt-8 text-mid">
          I am {PERSON.alias} — a second-year engineer at Lovely Professional University
          building AI systems end to end: on-device speech in Rust, multi-agent platforms in
          Python, and a language model I am pre-training from scratch to understand what the
          rest of us are importing.
        </p>

        <div
          ref={cueRef}
          className="reveal reveal-5 mt-14 flex items-center gap-3"
          style={{ willChange: 'opacity' }}
        >
          <span className="t-label">scroll to train</span>
          <span className="h-px w-16 bg-gradient-to-r from-signal to-transparent" />
        </div>
      </div>
    </section>
  );
}
