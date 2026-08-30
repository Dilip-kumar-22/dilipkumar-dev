import { SKILLS } from '@/lib/content';
import DenoiseText from '@/components/DenoiseText';

/**
 * Skills as an instrument panel — channels on a desk, not a wall of pills.
 * Every group is one row; the eye reads down the left rail.
 */
export default function Signal() {
  return (
    <section id="signal" className="relative shell py-32">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_2fr] lg:gap-20">
          <div className="lg:sticky lg:top-32 lg:self-start">
            <span className="t-label reveal">epoch 03 — signal</span>
            <DenoiseText
              as="h2"
              text="What I work with"
              className="t-display mt-6 block text-[clamp(2rem,4.2vw,3.4rem)] text-hi"
            />
            <p className="reveal reveal-2 mt-6 text-sm leading-relaxed text-mid">
              Listed only where I can hold a conversation about it under
              questioning. Everything on this panel has been used in something
              that shipped or something I am actively training.
            </p>
          </div>

          <div className="reveal reveal-1">
            {SKILLS.map((g, gi) => (
              <div
                key={g.group}
                className={`reveal reveal-${Math.min(5, gi + 1)} group border-t border-line-soft py-7 transition-colors duration-500 hover:border-signal-deep`}
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-baseline md:gap-10">
                  <div className="flex shrink-0 items-baseline gap-3 md:w-52">
                    <span className="t-data text-[0.65rem] text-signal-deep">
                      {String(gi + 1).padStart(2, '0')}
                    </span>
                    <span className="t-label !tracking-[0.16em] !text-[0.66rem] text-mid transition-colors duration-500 group-hover:text-signal">
                      {g.group}
                    </span>
                  </div>

                  <ul className="flex flex-wrap items-baseline gap-x-5 gap-y-2">
                    {g.items.map((it) => (
                      <li
                        key={it}
                        className="t-data text-[0.92rem] text-hi/85 transition-colors duration-300 hover:text-signal"
                      >
                        {it}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
            <div className="border-t border-line-soft" />
          </div>
        </div>
      </div>
    </section>
  );
}
