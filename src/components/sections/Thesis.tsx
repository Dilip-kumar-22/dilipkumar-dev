import { PERSON } from '@/lib/content';

/**
 * One line, given the whole viewport. Deliberately the emptiest section on
 * the site — the composition is the point.
 */
export default function Thesis() {
  return (
    <section
      id="thesis"
      className="relative flex min-h-dvh items-center shell py-32"
    >
      <div className="mx-auto w-full max-w-6xl">
        <span className="t-label reveal">epoch 02 — thesis</span>

        <blockquote className="mt-12 lg:pl-[8%]">
          <p
            className="reveal reveal-1 t-display text-hi"
            style={{ fontSize: 'clamp(2.1rem, 5.4vw, 4.6rem)', lineHeight: 1.06 }}
          >
            “If I have a problem and can’t find the right tool,{' '}
            <span className="text-signal" style={{ fontStyle: 'italic' }}>
              I try to build it.
            </span>
            ”
          </p>

          <footer className="reveal reveal-3 mt-12 flex items-center gap-4">
            <span className="h-px w-12 bg-line" />
            <span className="t-label !tracking-[0.2em]">{PERSON.name}</span>
          </footer>
        </blockquote>

        <div className="reveal reveal-4 mt-20 grid gap-10 md:grid-cols-3 lg:pl-[8%]">
          {[
            [
              'Typing Master',
              'I wanted a typing tutor that adapted to the keys I kept missing. I could not find a free, offline, ad-free one — so it exists now.',
            ],
            [
              'Bolo',
              'Every good dictation tool ships your voice to a server. I wanted to know whether it had to. It does not.',
            ],
            [
              'ORBIT',
              'Cinematic 3D sites get rebuilt from scratch every time, and the hard parts get skipped. I made those decisions once and gave them away.',
            ],
          ].map(([t, d], i) => (
            <div key={t} className={`reveal reveal-${i + 3}`}>
              <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-signal">
                {t}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-mid">{d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
