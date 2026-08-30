'use client';

import { useEffect, useRef } from 'react';
import { subscribe } from '@/lib/scrollStore';

/* ------------------------------------------------------------------ *
 * The scroll indicator IS a training loss curve.
 *
 * Vertical axis = training step (= scroll position).
 * Horizontal deflection = loss.
 * Scrolling down walks the marker down the curve; the curve converges
 * left as loss falls. The travelled section is lit in signal amber, the
 * untravelled section stays cold. That is the whole site in one widget.
 * ------------------------------------------------------------------ */

const W = 96;
const H = 380;
const STEPS = 12_000;
const N = 220;

const LOSS_MAX = 4.4;
const LOSS_MIN = 0.3;

/** Deterministic PRNG so SSR and client render byte-identical paths. */
function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** A believable loss curve: steep early drop, noisy plateau, slow tail. */
function buildCurve() {
  const rnd = mulberry32(20260830);
  const pts: { u: number; loss: number; x: number; y: number }[] = [];

  for (let i = 0; i < N; i++) {
    const u = i / (N - 1);
    const base = 0.44 + 3.75 * Math.exp(-5.4 * u);
    // noise that decays as the run converges — exactly what a real run does
    const amp = 0.34 * Math.exp(-2.1 * u) + 0.035;
    const loss = Math.max(LOSS_MIN, base + (rnd() - 0.5) * 2 * amp);

    const x = 10 + ((loss - LOSS_MIN) / (LOSS_MAX - LOSS_MIN)) * (W - 22);
    const y = u * H;
    pts.push({ u, loss, x, y });
  }
  return pts;
}

const CURVE = buildCurve();

const PATH = CURVE.map((p, i) =>
  `${i === 0 ? 'M' : 'L'}${p.x.toFixed(2)} ${p.y.toFixed(2)}`,
).join(' ');

/** Loss at an arbitrary progress, linearly interpolated between samples. */
function sample(p: number) {
  const f = Math.min(0.9999, Math.max(0, p)) * (N - 1);
  const i = Math.floor(f);
  const a = CURVE[i];
  const b = CURVE[Math.min(N - 1, i + 1)];
  const k = f - i;
  return {
    loss: a.loss + (b.loss - a.loss) * k,
    x: a.x + (b.x - a.x) * k,
    y: a.y + (b.y - a.y) * k,
  };
}

export default function LossCurve() {
  const litRef = useRef<SVGPathElement>(null);
  const markRef = useRef<SVGGElement>(null);
  const stepRef = useRef<HTMLSpanElement>(null);
  const lossRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const lit = litRef.current;
    if (!lit) return;

    const len = lit.getTotalLength();
    lit.style.strokeDasharray = `${len}`;
    lit.style.strokeDashoffset = `${len}`;

    let lastStep = -1;

    return subscribe(({ progress }) => {
      lit.style.strokeDashoffset = `${len * (1 - progress)}`;

      const s = sample(progress);
      markRef.current?.setAttribute('transform', `translate(${s.x} ${s.y})`);

      // mobile fallback bar
      if (barRef.current) barRef.current.style.transform = `scaleX(${progress})`;

      const step = Math.round(progress * STEPS);
      if (step !== lastStep) {
        lastStep = step;
        if (stepRef.current) stepRef.current.textContent = step.toLocaleString('en-US');
        if (lossRef.current) lossRef.current.textContent = s.loss.toFixed(3);
      }
    });
  }, []);

  return (
    <>
      {/* ---- desktop: the real instrument ---- */}
      <aside
        aria-hidden="true"
        className="pointer-events-none fixed right-6 top-1/2 z-40 hidden -translate-y-1/2 lg:block xl:right-10"
      >
        <div className="mb-3 flex flex-col gap-0.5 text-right">
          <span className="t-label !text-[0.58rem]">step</span>
          <span className="t-data text-[0.72rem] text-mid">
            <span ref={stepRef}>0</span>
            <span className="text-low">/{STEPS.toLocaleString('en-US')}</span>
          </span>
        </div>

        <svg
          width={W}
          height={H}
          viewBox={`0 0 ${W} ${H}`}
          fill="none"
          className="overflow-visible"
        >
          {/* axis */}
          <line
            x1={W - 6}
            y1={0}
            x2={W - 6}
            y2={H}
            stroke="var(--color-line-soft)"
            strokeWidth="1"
          />
          {[0, 0.25, 0.5, 0.75, 1].map((t) => (
            <line
              key={t}
              x1={W - 9}
              y1={t * H}
              x2={W - 6}
              y2={t * H}
              stroke="var(--color-line)"
              strokeWidth="1"
            />
          ))}

          {/* the full run, cold */}
          <path
            d={PATH}
            stroke="var(--color-line)"
            strokeWidth="1.25"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* the part you have travelled, lit */}
          <path
            ref={litRef}
            d={PATH}
            stroke="var(--color-signal)"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* current step marker */}
          <g ref={markRef} transform="translate(56 0)">
            <circle r="7" fill="var(--color-signal)" opacity="0.16" />
            <circle r="2.6" fill="var(--color-signal)" />
            <line
              x1="6"
              y1="0"
              x2={W - 8}
              y2="0"
              stroke="var(--color-signal-deep)"
              strokeWidth="1"
              strokeDasharray="2 3"
            />
          </g>
        </svg>

        <div className="mt-3 flex flex-col gap-0.5 text-right">
          <span className="t-label !text-[0.58rem]">loss</span>
          <span ref={lossRef} className="t-data text-[0.72rem] text-signal">
            4.190
          </span>
        </div>
      </aside>

      {/* ---- mobile / tablet: a hairline progress bar, same idea, less room ---- */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-x-0 top-0 z-40 h-px bg-line-soft lg:hidden"
      >
        <div
          ref={barRef}
          className="h-full origin-left scale-x-0 bg-signal"
          style={{ willChange: 'transform' }}
        />
      </div>
    </>
  );
}
