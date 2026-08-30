import { RESEARCH } from '@/lib/content';
import DenoiseText from '@/components/DenoiseText';

export default function Research() {
  return (
    <section id="research" className="relative shell py-32">
      <div className="mx-auto max-w-7xl">
        <span className="t-label reveal">epoch 05 — research</span>

        <div className="mt-6 grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-24">
          <DenoiseText
            as="h2"
            text={RESEARCH.heading}
            className="t-display block text-[clamp(2.4rem,6vw,5rem)] text-hi"
          />
          <p className="reveal reveal-2 t-body self-end">{RESEARCH.body}</p>
        </div>

        <div className="mt-24">
          {RESEARCH.tracks.map((t, i) => (
            <div
              key={t.k}
              className={`reveal reveal-${i + 1} grid gap-6 border-t border-line-soft py-12 md:grid-cols-[auto_1fr] md:gap-16`}
            >
              <div className="flex items-baseline gap-4 md:w-64 md:flex-col md:items-start md:gap-3">
                <span className="t-data text-[0.7rem] text-signal-deep">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="t-label !text-[0.7rem] !tracking-[0.2em] text-signal">
                  {t.k}
                </span>
                <span className="t-data text-[0.65rem] text-low">{t.state}</span>
              </div>

              <div>
                <h3
                  className="t-display text-hi"
                  style={{ fontSize: 'clamp(1.5rem, 3.1vw, 2.4rem)' }}
                >
                  {t.title}
                </h3>
                <p className="t-body mt-4 text-mid">{t.body}</p>
              </div>
            </div>
          ))}
          <div className="border-t border-line-soft" />
        </div>

        <p className="reveal mt-12 flex items-center gap-4 text-sm text-low">
          <span className="h-px w-10 bg-signal-deep" />
          <span className="t-data">{RESEARCH.discipline}</span>
        </p>
      </div>
    </section>
  );
}
