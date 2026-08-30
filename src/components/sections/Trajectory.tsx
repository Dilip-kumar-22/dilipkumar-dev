import { ROADMAP } from '@/lib/content';
import DenoiseText from '@/components/DenoiseText';

/**
 * Roadmap work — rendered in a deliberately dimmer, dashed language so it can
 * never be mistaken for shipped work. Honesty is a design decision here.
 */
export default function Trajectory() {
  return (
    <section id="trajectory" className="relative shell py-32">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="t-label reveal">epoch 06 — trajectory</span>
            <DenoiseText
              as="h2"
              text="Not built yet"
              className="t-display mt-6 block text-[clamp(2.2rem,5vw,4rem)] text-low"
            />
          </div>
          <p className="reveal reveal-2 max-w-md text-sm leading-relaxed text-low">
            Dated targets, not accomplishments. They are on this page so the
            direction is legible — and so I am on the record about it. Nothing
            below has been started.
          </p>
        </div>

        <ol className="mt-20 space-y-0">
          {ROADMAP.map((r, i) => (
            <li
              key={r.name}
              className={`reveal reveal-${i + 1} relative grid gap-5 border-t border-dashed border-line-soft py-10 md:grid-cols-[7rem_1fr] md:gap-14`}
            >
              <span className="t-data text-[0.9rem] text-signal-deep">{r.when}</span>
              <div>
                <h3 className="text-xl text-mid md:text-2xl">{r.name}</h3>
                <p className="t-body mt-3 text-sm text-low">{r.detail}</p>
              </div>
            </li>
          ))}
        </ol>
        <div className="border-t border-dashed border-line-soft" />
      </div>
    </section>
  );
}
